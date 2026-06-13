"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { calcProfileCompletion } from "@/lib/profileCompletion";
import { sendWelcomeEmail, sendTrialStartEmail, sendReferralRewardEmail, sendEmployerLinkRequestNotificationEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";

const STANDARD_TRIAL_DAYS = 14;
const REFERRAL_TRIAL_DAYS = 30;  // referee gets 30-day trial instead of 14
const REFERRER_BONUS_DAYS = 30;  // referrer gains 30 free Pro days

export async function completeOnboarding(): Promise<{ pct: number; trialDays: number } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const admin = createAdminClient();
  const [profileRes, walletRes, linkRes] = await Promise.all([
    admin.from("professional_profiles").select("*").eq("auth_id", user.id).single(),
    admin.from("cme_wallets").select("id").eq("professional_id", user.id).maybeSingle(),
    admin.from("employer_link_requests").select("id").eq("professional_id", user.id).eq("status", "approved").maybeSingle(),
  ]);

  const profile = profileRes.data;
  const pct = calcProfileCompletion(profile ?? {}, {
    hasCmeWallet: !!walletRes.data,
    hasEmployerLink: !!linkRes.data,
  });

  // Check if user came via a referral — referrals earn a longer trial
  const referredBy = user.user_metadata?.referred_by as string | undefined;
  const trialDays = referredBy ? REFERRAL_TRIAL_DAYS : STANDARD_TRIAL_DAYS;
  const trialEndsAt = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString();

  // Auto-generate referral code at onboarding so the trial email contains a personalized link
  let referralCode: string | null = profile?.referral_code ?? null;
  if (!referralCode) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    referralCode = code;
  }

  await admin
    .from("professional_profiles")
    .update({
      onboarding_complete: true,
      onboarding_step: 7,
      profile_completion_pct: pct,
      pro_trial_ends_at: trialEndsAt,
      referral_code: referralCode,
    })
    .eq("auth_id", user.id);

  // Fire-and-forget — emails must never block onboarding completion
  if (user.email) {
    sendWelcomeEmail({
      to: user.email,
      name: profile?.full_name ?? "Healthcare Professional",
      profession: profile?.profession ?? null,
      country: profile?.country_of_residence ?? null,
    });
    sendTrialStartEmail({
      to: user.email,
      name: profile?.full_name ?? "Healthcare Professional",
      trialEndsAt,
      referralCode,
      trialDays,
    });
  }

  logAudit({
    actorAuthId: user.id,
    action: "onboarding.completed",
    targetTable: "professional_profiles",
    metadata: { profile_completion_pct: pct, pro_trial_ends_at: trialEndsAt, via_referral: !!referredBy },
  });

  // Employer invite — auto-create pending link request if user registered via invite link
  const pendingInviteOrgId = user.user_metadata?.pending_employer_invite as string | undefined;
  if (pendingInviteOrgId) {
    // Confirm the org exists before creating the link
    const { data: org } = await admin
      .from("organizations")
      .select("id, name")
      .eq("id", pendingInviteOrgId)
      .maybeSingle();

    if (org) {
      // Upsert: avoid duplicate requests if onboarding is re-run
      const { data: existing } = await admin
        .from("employer_link_requests")
        .select("id")
        .eq("professional_id", user.id)
        .eq("organization_id", org.id)
        .maybeSingle();

      if (!existing) {
        await admin.from("employer_link_requests").insert({
          professional_id: user.id,
          organization_id: org.id,
          status: "pending",
          requested_at: new Date().toISOString(),
        });

        logAudit({
          actorAuthId: user.id,
          action: "employer_link.auto_requested",
          targetTable: "employer_link_requests",
          metadata: { organization_id: org.id, organization_name: org.name, via_invite_link: true },
        });

        // Fire-and-forget: notify the employer admin about the new staff link request
        Promise.resolve(
          admin.from("organization_members")
            .select("auth_id")
            .eq("organization_id", org.id)
            .eq("role", "employer_admin")
            .maybeSingle()
        ).then(async ({ data: empMember }) => {
          if (!empMember?.auth_id) return;
          const [empProfileRes, proProfileRes] = await Promise.all([
            admin.from("professional_profiles").select("email, full_name").eq("auth_id", empMember.auth_id).maybeSingle(),
            admin.from("professional_profiles").select("full_name, profession").eq("auth_id", user.id).maybeSingle(),
          ]);
          const empEmail = empProfileRes.data?.email;
          if (!empEmail) return;
          sendEmployerLinkRequestNotificationEmail({
            to: empEmail,
            adminName: empProfileRes.data?.full_name ?? "Administrator",
            professionalName: proProfileRes.data?.full_name ?? "A healthcare professional",
            profession: proProfileRes.data?.profession ?? null,
            orgName: org.name,
          }).catch(() => {});
        }).catch(() => {});
      }
    }
  }

  // Referral reward — extend referrer's Pro trial by 30 days
  if (referredBy) {
    const { data: referrer } = await admin
      .from("professional_profiles")
      .select("auth_id, full_name, pro_trial_ends_at")
      .eq("referral_code", referredBy)
      .maybeSingle();

    if (referrer?.auth_id) {
      // Extend from current trial end (or from now if already expired)
      const currentEnd = referrer.pro_trial_ends_at
        ? new Date(referrer.pro_trial_ends_at)
        : new Date();
      const base = currentEnd > new Date() ? currentEnd : new Date();
      const newTrialEndsAt = new Date(base.getTime() + REFERRER_BONUS_DAYS * 24 * 60 * 60 * 1000).toISOString();

      await admin
        .from("professional_profiles")
        .update({ pro_trial_ends_at: newTrialEndsAt })
        .eq("auth_id", referrer.auth_id);

      // Get referrer's email for notification — from profiles (no extra auth call needed)
      const { data: referrerProfile } = await admin
        .from("professional_profiles")
        .select("email")
        .eq("auth_id", referrer.auth_id)
        .maybeSingle();
      const referrerEmail = referrerProfile?.email;

      if (referrerEmail) {
        sendReferralRewardEmail({
          to: referrerEmail,
          referrerName: referrer.full_name ?? "Healthcare Professional",
          refereeName: profile?.full_name ?? "a colleague",
          bonusDays: REFERRER_BONUS_DAYS,
          newTrialEndsAt,
        });
      }

      logAudit({
        actorAuthId: referrer.auth_id,
        action: "referral.signup",
        targetTable: "professional_profiles",
        targetId: user.id,
        metadata: { referred_user_id: user.id, bonus_days: REFERRER_BONUS_DAYS, new_trial_ends_at: newTrialEndsAt },
      });
    }
  }

  return { pct, trialDays };
}

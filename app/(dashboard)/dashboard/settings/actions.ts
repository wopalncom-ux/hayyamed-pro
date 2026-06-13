"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { calcProfileCompletion } from "@/lib/profileCompletion";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { getUserPlan, isPro } from "@/lib/subscription";
import { sendEmployerLinkRequestNotificationEmail, sendAdminUnverifiedLinkRequestEmail } from "@/lib/email";

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  // Audit log before deletion (append-only â€” survives the cascade)
  await logAudit({
    actorAuthId: user.id,
    action: "account.deleted",
    targetTable: "professional_profiles",
    targetId: user.id,
    metadata: { reason: "user_requested" },
  });

  // Deleting the auth user cascades to professional_profiles and all child tables.
  // Audit logs are append-only and reference actor_auth_id as a plain UUID â€” they are
  // retained for the 7-year compliance window even after the auth user is gone.
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return { error: error.message };

  return { error: null };
}

const ALLOWED_PRIVACY_FIELDS = new Set([
  "employer_can_view_cme_summary",
  "employer_can_view_certificates",
  "employer_can_view_license_expiry",
  "employer_can_view_detailed_cme_activities",
]);

export async function updatePrivacySetting(field: string, value: boolean) {
  if (!ALLOWED_PRIVACY_FIELDS.has(field)) return { error: "Invalid field" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("profile_privacy_settings")
    .upsert(
      { professional_id: user.id, [field]: value },
      { onConflict: "professional_id" }
    );

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: user.id,
    action: "privacy_settings.updated",
    targetTable: "profile_privacy_settings",
    targetId: user.id,
    metadata: { field, value },
  });

  revalidatePath("/dashboard/settings");
  return { error: null };
}

export async function updateProfessionalProfile({
  fullName,
  mobile,
  dateOfBirth,
  nationality,
  countryOfResidence,
  profession,
  specialty,
  licenseNumber,
  licensingAuthority,
  licenseExpiry,
}: {
  fullName: string;
  mobile: string;
  dateOfBirth: string;
  nationality: string;
  countryOfResidence: string;
  profession: string;
  specialty: string;
  licenseNumber: string;
  licensingAuthority: string;
  licenseExpiry: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("professional_profiles")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  const merged = {
    ...existing,
    full_name: fullName.trim() || existing?.full_name,
    mobile: mobile.trim() || existing?.mobile,
    date_of_birth: dateOfBirth || existing?.date_of_birth,
    nationality: nationality.trim() || existing?.nationality,
    country_of_residence: countryOfResidence.trim() || existing?.country_of_residence,
    profession: profession.trim() || existing?.profession,
    specialty: specialty.trim() || existing?.specialty,
    license_number: licenseNumber.trim() || existing?.license_number,
    licensing_authority: licensingAuthority.trim() || existing?.licensing_authority,
    license_expiry: licenseExpiry || existing?.license_expiry,
  };

  const [{ data: wallet }, { data: link }] = await Promise.all([
    admin.from("cme_wallets").select("id").eq("professional_id", user.id).order("created_at", { ascending: true }).limit(1).maybeSingle(),
    admin.from("employer_link_requests").select("id").eq("professional_id", user.id).eq("status", "approved").maybeSingle(),
  ]);

  const pct = calcProfileCompletion(merged as Record<string, unknown>, {
    hasCmeWallet: !!wallet,
    hasEmployerLink: !!link,
  });

  const { error } = await admin
    .from("professional_profiles")
    .update({
      full_name: merged.full_name,
      mobile: merged.mobile,
      date_of_birth: merged.date_of_birth,
      nationality: merged.nationality,
      country_of_residence: merged.country_of_residence,
      profession: merged.profession,
      specialty: merged.specialty,
      license_number: merged.license_number,
      licensing_authority: merged.licensing_authority,
      license_expiry: merged.license_expiry,
      profile_completion_pct: pct,
    })
    .eq("auth_id", user.id);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: user.id,
    action: "profile.updated",
    targetTable: "professional_profiles",
    targetId: user.id,
    metadata: { fields: ["full_name", "mobile", "date_of_birth", "nationality", "country_of_residence", "profession", "specialty", "license_number", "licensing_authority", "license_expiry"] },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/licenses");
  return { error: null };
}

const EMAIL_PREF_FIELDS = new Set([
  "email_cme_verified",
  "email_cme_deadline",
  "email_license_expiry",
  "email_trial_reminders",
  "email_employer_tasks",
]);

export async function updateEmailPreferences(prefs: Record<string, boolean>): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Only allow known preference keys
  const filtered: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(prefs)) {
    if (EMAIL_PREF_FIELDS.has(k) && typeof v === "boolean") filtered[k] = v;
  }
  if (Object.keys(filtered).length === 0) return { error: "No valid fields" };

  const admin = createAdminClient();
  const { error } = await admin
    .from("professional_profiles")
    .update(filtered)
    .eq("auth_id", user.id);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: user.id,
    action: "email_preferences.updated",
    targetTable: "professional_profiles",
    targetId: user.id,
    metadata: filtered,
  });

  revalidatePath("/dashboard/settings");
  return {};
}

export async function getOrCreateReferralCode(): Promise<{ code?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("professional_profiles")
    .select("referral_code")
    .eq("auth_id", user.id)
    .single();

  if (profile?.referral_code) return { code: profile.referral_code };

  // Generate a unique 8-char alphanumeric code (uppercase)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];

  const { error } = await admin
    .from("professional_profiles")
    .update({ referral_code: code })
    .eq("auth_id", user.id);

  if (error) return { error: error.message };

  return { code };
}

export async function addCountryWallet(payload: {
  country: string;
  profession: string;
  specialty: string | null;
  required_credits: number;
  cycle_start_date: string;
  cycle_end_date: string;
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const admin = createAdminClient();

  // Check existing wallets
  const { count } = await admin
    .from("cme_wallets")
    .select("id", { count: "exact", head: true })
    .eq("professional_id", user.id);

  const walletCount = count ?? 0;

  // Server-side plan gate: Free users are limited to 1 wallet
  if (walletCount >= 1) {
    const plan = await getUserPlan(user.id);
    if (!isPro(plan)) return { error: "upgrade_required" };
  }

  if (walletCount >= 5) return { error: "Maximum 5 compliance countries allowed." };

  const { error } = await admin.from("cme_wallets").insert({
    professional_id: user.id,
    country: payload.country,
    profession: payload.profession,
    specialty: payload.specialty,
    required_credits: payload.required_credits,
    completed_credits: 0,
    renewal_cycle_years: 1,
    cycle_start_date: payload.cycle_start_date,
    cycle_end_date: payload.cycle_end_date,
    compliance_status: "non_compliant",
    is_primary: false,
    label: `${payload.country} License`,
  });

  if (error) {
    if (error.code === "23505") return { error: `You already have a wallet for ${payload.country}.` };
    return { error: error.message };
  }

  await logAudit({
    actorAuthId: user.id,
    action: "wallet.added",
    targetTable: "cme_wallets",
    metadata: { country: payload.country },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/cme");
  return {};
}

export async function removeSecondaryWallet(walletId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const admin = createAdminClient();

  const { data: wallet } = await admin
    .from("cme_wallets")
    .select("professional_id, is_primary")
    .eq("id", walletId)
    .maybeSingle();

  if (!wallet || wallet.professional_id !== user.id) return { error: "Wallet not found." };
  if (wallet.is_primary) return { error: "Cannot remove your primary wallet. Change your primary country in onboarding settings." };

  await admin.from("cme_wallets").delete().eq("id", walletId);

  await logAudit({
    actorAuthId: user.id,
    action: "wallet.removed",
    targetTable: "cme_wallets",
    targetId: walletId,
    metadata: {},
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/cme");
  return {};
}

export async function submitLinkRequest(payload: {
  organizationId: string | null;
  unverifiedEmployerName: string | null;
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (!payload.organizationId && !payload.unverifiedEmployerName?.trim()) {
    return { error: "Employer name is required" };
  }

  const admin = createAdminClient();

  // Prevent duplicate pending requests
  const { data: existing } = await admin
    .from("employer_link_requests")
    .select("id")
    .eq("professional_id", user.id)
    .in("status", ["pending", "approved"])
    .maybeSingle();
  if (existing) return { error: "You already have an active or pending employer link." };

  const { data: inserted, error: insertError } = await admin
    .from("employer_link_requests")
    .insert({
      professional_id: user.id,
      organization_id: payload.organizationId ?? null,
      unverified_employer_name: payload.organizationId ? null : payload.unverifiedEmployerName?.trim(),
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError) return { error: insertError.message };

  await logAudit({
    actorAuthId: user.id,
    action: "employer_link.requested",
    targetTable: "employer_link_requests",
    targetId: inserted.id,
    metadata: {
      organization_id: payload.organizationId,
      unverified_name: payload.organizationId ? null : payload.unverifiedEmployerName?.trim(),
    },
  });

  // Fire-and-forget: notify org admin (employer_admin or university_admin) for verified orgs
  if (payload.organizationId) {
    Promise.all([
      admin.from("organization_members")
        .select("auth_id, role")
        .eq("organization_id", payload.organizationId)
        .in("role", ["employer_admin", "university_admin"])
        .maybeSingle(),
      admin.from("professional_profiles")
        .select("full_name, profession")
        .eq("auth_id", user.id)
        .maybeSingle(),
      admin.from("organizations")
        .select("name")
        .eq("id", payload.organizationId)
        .single(),
    ]).then(async ([memberRes, profileRes, orgRes]) => {
      const adminAuthId = memberRes.data?.auth_id;
      if (!adminAuthId) return;
      const { data: adminProfile } = await admin
        .from("professional_profiles")
        .select("email, full_name")
        .eq("auth_id", adminAuthId)
        .maybeSingle();
      if (!adminProfile?.email) return;
      const isUniversity = memberRes.data?.role === "university_admin";
      sendEmployerLinkRequestNotificationEmail({
        to: adminProfile.email,
        adminName: adminProfile.full_name ?? "Administrator",
        professionalName: profileRes.data?.full_name ?? "A healthcare professional",
        profession: profileRes.data?.profession ?? null,
        orgName: orgRes.data?.name ?? "your organization",
        portalUrl: isUniversity ? `${process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro"}/university/faculty` : undefined,
        portalLabel: isUniversity ? "Review in university dashboard" : undefined,
      }).catch(() => {});
    }).catch(() => {});
  }

  // For unverified orgs: notify master_admin so they can create the org and review
  if (!payload.organizationId && payload.unverifiedEmployerName) {
    const { data: profile } = await admin
      .from("professional_profiles")
      .select("full_name, profession")
      .eq("auth_id", user.id)
      .maybeSingle();
    sendAdminUnverifiedLinkRequestEmail({
      professionalName: profile?.full_name ?? "Unknown professional",
      unverifiedEmployerName: payload.unverifiedEmployerName,
      profession: profile?.profession ?? null,
    }).catch(() => {});
  }

  revalidatePath("/dashboard/settings");
  return {};
}

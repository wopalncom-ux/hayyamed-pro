"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { sendCmeVerifiedEmail, sendCmeRejectedEmail } from "@/lib/email";
import { getUserPlan, isPro } from "@/lib/subscription";
import { dispatchWebhook } from "@/lib/webhooks/dispatch";

async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();

  return member ? user : null;
}


export async function verifyCmeActivity(activityId: string) {
  const actor = await getAdminUser();
  if (!actor) return { error: "Not authorized" };

  const admin = createAdminClient();

  const { data: activity } = await admin
    .from("cme_activities")
    .select("title, credits, professional_id")
    .eq("id", activityId)
    .single();

  const { error } = await admin
    .from("cme_activities")
    .update({ verification_status: "verified" })
    .eq("id", activityId);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: actor.id,
    action: "cme_activity.verified",
    targetTable: "cme_activities",
    targetId: activityId,
  });

  if (activity) {
    const [profileRes, plan, linksRes, walletRes] = await Promise.all([
      admin.from("professional_profiles").select("email, full_name").eq("auth_id", activity.professional_id).single(),
      getUserPlan(activity.professional_id),
      admin.from("employer_link_requests").select("organization_id").eq("professional_id", activity.professional_id).eq("status", "approved"),
      admin.from("cme_wallets").select("compliance_status, completed_credits, required_credits")
        .eq("professional_id", activity.professional_id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ]);
    if (profileRes.data?.email) {
      await sendCmeVerifiedEmail({
        to: profileRes.data.email,
        name: profileRes.data.full_name ?? "Doctor",
        activityTitle: activity.title,
        credits: activity.credits,
        isPro: isPro(plan),
      });
    }
    for (const link of linksRes.data ?? []) {
      dispatchWebhook(link.organization_id, "cme.verified", {
        professional_id: activity.professional_id,
        activity_title: activity.title,
        credits: activity.credits,
      }).catch(() => {});
      // Also dispatch compliance status change so employer HRIS knows the new standing
      if (walletRes.data) {
        dispatchWebhook(link.organization_id, "staff.compliance_changed", {
          professional_id: activity.professional_id,
          compliance_status: walletRes.data.compliance_status ?? "unknown",
          completed_credits: walletRes.data.completed_credits ?? 0,
          required_credits: walletRes.data.required_credits ?? 0,
        }).catch(() => {});
      }
    }
  }

  revalidatePath("/admin/cme-activities");
  return { error: null };
}

export async function rejectCmeActivity(activityId: string, reason: string) {
  const actor = await getAdminUser();
  if (!actor) return { error: "Not authorized" };

  const admin = createAdminClient();

  const { data: activity } = await admin
    .from("cme_activities")
    .select("title, professional_id")
    .eq("id", activityId)
    .single();

  const { error } = await admin
    .from("cme_activities")
    .update({ verification_status: "rejected", rejection_reason: reason.trim() || null })
    .eq("id", activityId);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: actor.id,
    action: "cme_activity.rejected",
    targetTable: "cme_activities",
    targetId: activityId,
    metadata: { reason: reason.trim() || null },
  });

  if (activity) {
    const { data: profileRes } = await admin
      .from("professional_profiles")
      .select("email, full_name")
      .eq("auth_id", activity.professional_id)
      .single();
    if (profileRes?.email) {
      await sendCmeRejectedEmail({
        to: profileRes.email,
        name: profileRes.full_name ?? "Doctor",
        activityTitle: activity.title,
        reason: reason.trim() || null,
      });
    }
  }

  revalidatePath("/admin/cme-activities");
  return { error: null };
}

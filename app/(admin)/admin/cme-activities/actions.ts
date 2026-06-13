"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { sendCmeVerifiedEmail, sendCmeRejectedEmail } from "@/lib/email";
import { getUserPlan, isPro } from "@/lib/subscription";

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
    const [profileRes, plan] = await Promise.all([
      admin.from("professional_profiles").select("email, full_name").eq("auth_id", activity.professional_id).single(),
      getUserPlan(activity.professional_id),
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

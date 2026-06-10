"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit";
import { sendCmeVerifiedEmail, sendCmeRejectedEmail } from "@/lib/email";

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

  // Fetch activity + professional info for email
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

  // Send email to professional (Pro users only — check subscription)
  if (activity) {
    const { data: sub } = await admin
      .from("subscriptions")
      .select("plan, status")
      .eq("professional_id", activity.professional_id)
      .maybeSingle();

    const isPro = sub && (sub.plan === "pro" || sub.plan === "employer") && sub.status === "active";

    if (isPro) {
      const { data: authUser } = await admin.auth.admin.getUserById(activity.professional_id);
      const { data: profile } = await admin
        .from("professional_profiles")
        .select("full_name")
        .eq("auth_id", activity.professional_id)
        .single();

      if (authUser?.user?.email) {
        await sendCmeVerifiedEmail({
          to: authUser.user.email,
          name: profile?.full_name ?? "Doctor",
          activityTitle: activity.title,
          credits: activity.credits,
        });
      }
    }
  }

  revalidatePath("/admin/cme-activities");
  return { error: null };
}

export async function rejectCmeActivity(activityId: string) {
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
    .update({ verification_status: "rejected" })
    .eq("id", activityId);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: actor.id,
    action: "cme_activity.rejected",
    targetTable: "cme_activities",
    targetId: activityId,
  });

  if (activity) {
    const { data: sub } = await admin
      .from("subscriptions")
      .select("plan, status")
      .eq("professional_id", activity.professional_id)
      .maybeSingle();

    const isPro = sub && (sub.plan === "pro" || sub.plan === "employer") && sub.status === "active";

    if (isPro) {
      const { data: authUser } = await admin.auth.admin.getUserById(activity.professional_id);
      const { data: profile } = await admin
        .from("professional_profiles")
        .select("full_name")
        .eq("auth_id", activity.professional_id)
        .single();

      if (authUser?.user?.email) {
        await sendCmeRejectedEmail({
          to: authUser.user.email,
          name: profile?.full_name ?? "Doctor",
          activityTitle: activity.title,
        });
      }
    }
  }

  revalidatePath("/admin/cme-activities");
  return { error: null };
}

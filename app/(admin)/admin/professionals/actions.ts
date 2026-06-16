"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function overrideUserPlan(
  authId: string,
  plan: "free" | "pro" | "employer",
  employerTier: string | null
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await requireAdminUser();
  if (!adminUser) throw new Error("Forbidden");

  const admin = createAdminClient();

  await admin.from("subscriptions").upsert(
    {
      professional_id: authId,
      plan,
      status: plan === "free" ? "canceled" : "active",
      employer_tier: plan === "employer" ? (employerTier ?? "clinic") : null,
      billing_interval: "annual",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "professional_id" }
  );

  await logAudit({
    actorAuthId: user.id,
    action: "admin.plan_override",
    targetTable: "subscriptions",
    targetId: authId,
    metadata: { plan, employer_tier: employerTier, overridden_by: user.email },
  });

  revalidatePath("/admin/professionals");
}

export async function suspendAccount(
  authId: string,
  reason: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const adminUser = await requireAdminUser();
  if (!adminUser) return { error: "Forbidden" };

  if (!reason.trim()) return { error: "Reason is required" };

  const admin = createAdminClient();

  // Ban in Supabase Auth — immediately invalidates all active sessions
  const { error: banError } = await admin.auth.admin.updateUserById(authId, {
    ban_duration: "indefinite",
  });
  if (banError) return { error: banError.message };

  // Record suspension metadata in our DB for audit trail + UI display
  await admin
    .from("professional_profiles")
    .update({
      is_suspended: true,
      suspended_at: new Date().toISOString(),
      suspended_reason: reason.trim(),
    })
    .eq("auth_id", authId);

  await logAudit({
    actorAuthId: user.id,
    action: "admin.account.suspended",
    targetTable: "professional_profiles",
    targetId: authId,
    metadata: { reason: reason.trim(), suspended_by: user.email },
  });

  revalidatePath(`/admin/professionals/${authId}`);
  return {};
}

export async function unsuspendAccount(authId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const adminUser = await requireAdminUser();
  if (!adminUser) return { error: "Forbidden" };

  const admin = createAdminClient();

  // Lift Supabase Auth ban — user can sign in again
  const { error: unbanError } = await admin.auth.admin.updateUserById(authId, {
    ban_duration: "none",
  });
  if (unbanError) return { error: unbanError.message };

  await admin
    .from("professional_profiles")
    .update({
      is_suspended: false,
      suspended_at: null,
      suspended_reason: null,
    })
    .eq("auth_id", authId);

  await logAudit({
    actorAuthId: user.id,
    action: "admin.account.unsuspended",
    targetTable: "professional_profiles",
    targetId: authId,
    metadata: { unsuspended_by: user.email },
  });

  revalidatePath(`/admin/professionals/${authId}`);
  return {};
}

export async function extendTrial(authId: string, days: number): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const adminUser = await requireAdminUser();
  if (!adminUser) return { error: "Forbidden" };

  if (days <= 0 || days > 90) return { error: "Days must be between 1 and 90" };

  const admin = createAdminClient();

  // Get current trial end (or now if none), then add days
  const { data: profile } = await admin
    .from("professional_profiles")
    .select("pro_trial_ends_at")
    .eq("auth_id", authId)
    .single();

  const base = profile?.pro_trial_ends_at && new Date(profile.pro_trial_ends_at) > new Date()
    ? new Date(profile.pro_trial_ends_at)
    : new Date();
  const newEnd = new Date(base.getTime() + days * 86400000);

  const { error } = await admin
    .from("professional_profiles")
    .update({ pro_trial_ends_at: newEnd.toISOString() })
    .eq("auth_id", authId);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: user.id,
    action: "admin.trial_extended",
    targetTable: "professional_profiles",
    targetId: authId,
    metadata: { extended_by_days: days, new_trial_end: newEnd.toISOString(), extended_by: user.email },
  });

  revalidatePath("/admin/professionals");
  return {};
}

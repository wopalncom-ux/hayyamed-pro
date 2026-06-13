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

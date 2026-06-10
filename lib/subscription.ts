import { createAdminClient } from "./supabase/server";

export type Plan = "free" | "pro" | "employer";

export async function getUserPlan(userId: string): Promise<Plan> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("plan, status")
    .eq("professional_id", userId)
    .maybeSingle();

  if (!data) return "free";
  if (data.status === "canceled" || data.status === "past_due") return "free";
  if (data.status !== "active" && data.status !== "trialing") return "free";
  return data.plan as Plan;
}

export function isPro(plan: Plan): boolean {
  return plan === "pro" || plan === "employer";
}

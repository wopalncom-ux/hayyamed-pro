import { createAdminClient } from "./supabase/server";
export type { Plan } from "./planUtils";
export { isPro } from "./planUtils";

export async function getUserPlan(userId: string): Promise<import("./planUtils").Plan> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("plan, status")
    .eq("professional_id", userId)
    .maybeSingle();

  if (!data) return "free";
  if (data.status === "canceled" || data.status === "past_due") return "free";
  if (data.status !== "active" && data.status !== "trialing") return "free";
  return data.plan as import("./planUtils").Plan;
}

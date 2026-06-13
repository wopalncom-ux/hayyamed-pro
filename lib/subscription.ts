import { createAdminClient } from "./supabase/server";
export type { Plan } from "./planUtils";
export { isPro } from "./planUtils";

export async function getUserPlan(userId: string): Promise<import("./planUtils").Plan> {
  const admin = createAdminClient();

  // Check subscription and trial in parallel
  const [subRes, profileRes] = await Promise.all([
    admin.from("subscriptions").select("plan, status").eq("professional_id", userId).maybeSingle(),
    admin.from("professional_profiles").select("pro_trial_ends_at").eq("auth_id", userId).maybeSingle(),
  ]);

  const sub = subRes.data;
  if (sub && sub.status !== "canceled" && sub.status !== "past_due") {
    if (sub.status === "active" || sub.status === "trialing") {
      return sub.plan as import("./planUtils").Plan;
    }
  }

  // Pro trial (14-day standard; 30-day for referred users)
  if (profileRes.data?.pro_trial_ends_at) {
    if (new Date(profileRes.data.pro_trial_ends_at) > new Date()) {
      return "trialing";
    }
  }

  // Employer admins with an active employer org subscription get Pro features free
  const { data: membership } = await admin
    .from("organization_members")
    .select("organization_id, role")
    .eq("auth_id", userId)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (membership) {
    const { data: orgSub } = await admin
      .from("subscriptions")
      .select("plan, status")
      .eq("professional_id", membership.organization_id)
      .maybeSingle();

    if (
      orgSub &&
      orgSub.plan === "employer" &&
      (orgSub.status === "active" || orgSub.status === "trialing")
    ) {
      return "employer";
    }
  }

  return "free";
}

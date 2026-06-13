// Client-safe plan utilities — no server imports
export type Plan = "free" | "pro" | "employer" | "trialing";

export function isPro(plan: Plan): boolean {
  return plan === "pro" || plan === "employer" || plan === "trialing";
}

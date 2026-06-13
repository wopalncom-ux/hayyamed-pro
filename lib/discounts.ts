import { createAdminClient } from "./supabase/server";
import type { Discount } from "./types";

// Find the best active discount for a given user + plan combination
export async function getBestDiscount(
  userId: string,
  plan: "pro" | "employer",
): Promise<Discount | null> {
  const admin = createAdminClient();
  const now = new Date().toISOString();

  // Fetch user's org memberships
  const { data: memberships } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", userId);
  const orgIds = memberships?.map((m) => m.organization_id) ?? [];

  // Fetch all candidate discounts (user-specific, org-specific, or global)
  const { data: discounts } = await admin
    .from("discounts")
    .select("*")
    .eq("is_active", true)
    .lte("valid_from", now)
    .or(`valid_until.is.null,valid_until.gte.${now}`)
    .or([
      `target_type.eq.global`,
      `and(target_type.eq.user,target_id.eq.${userId})`,
      orgIds.length > 0
        ? `and(target_type.eq.organization,target_id.in.(${orgIds.join(",")}))`
        : `target_type.eq.never_matches`,
    ].join(","))
    .order("discount_value", { ascending: false });

  if (!discounts?.length) return null;

  // Filter: must apply to the requested plan; max_uses not exceeded
  const eligible = discounts.filter(
    (d) =>
      d.applicable_plans.includes(plan) &&
      (d.max_uses === null || d.current_uses < d.max_uses),
  );

  if (!eligible.length) return null;

  // free_upgrade > percentage (largest) > fixed_amount (largest)
  const ranked = eligible.sort((a, b) => {
    if (a.discount_type === "free_upgrade") return -1;
    if (b.discount_type === "free_upgrade") return 1;
    return b.discount_value - a.discount_value;
  });

  return ranked[0] as Discount;
}

// Apply a discount to a base price; returns the final price (never below 0)
export function applyDiscount(basePrice: number, discount: Discount): number {
  if (discount.discount_type === "free_upgrade") return 0;
  if (discount.discount_type === "percentage") {
    return Math.max(0, basePrice * (1 - discount.discount_value / 100));
  }
  return Math.max(0, basePrice - discount.discount_value);
}

// Look up a discount by promo code (validates active status and plan eligibility)
export async function getDiscountByCode(
  code: string,
  plan: "pro" | "employer",
): Promise<Discount | null> {
  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { data: discount } = await admin
    .from("discounts")
    .select("*")
    .eq("promo_code", code.toUpperCase().trim())
    .eq("is_active", true)
    .lte("valid_from", now)
    .or(`valid_until.is.null,valid_until.gte.${now}`)
    .maybeSingle();

  if (!discount) return null;
  if (!discount.applicable_plans.includes(plan)) return null;
  if (discount.max_uses !== null && discount.current_uses >= discount.max_uses) return null;

  return discount as Discount;
}

// Increment the use counter after a successful checkout
export async function recordDiscountUse(discountId: string): Promise<void> {
  const admin = createAdminClient();
  await admin.rpc("increment_discount_uses", { discount_id: discountId });
}

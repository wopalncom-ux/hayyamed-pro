import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getPaddle, resolvePaddlePriceId, type EmployerTierKey } from "@/lib/paddle";
import { getBestDiscount, getDiscountByCode, applyDiscount } from "@/lib/discounts";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import type { BillingInterval } from "@/lib/types";
import { z } from "zod";

const BodySchema = z.object({
  plan: z.enum(["pro", "employer"]),
  billing_interval: z.enum(["monthly", "annual"]).default("annual"),
  employer_tier: z.enum(["clinic", "growth", "department", "hospital"]).optional(),
  promo_code: z.string().max(50).optional(),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { plan, billing_interval, employer_tier, promo_code } = parsed.data;

  // Rate limit: 10 checkout sessions per user per hour (prevents session farming)
  const rl = await checkAndLogRateLimit({
    action: "paddle.checkout",
    userId: user.id,
    maxPerHour: 10,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many checkout attempts — please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds ?? 3600) },
      }
    );
  }

  const admin = createAdminClient();

  // Resolve discount first — free_upgrade discounts bypass Paddle entirely
  // and must be checked before the price ID gate (Paddle may not be configured yet).
  const discount = promo_code
    ? (await getDiscountByCode(promo_code, plan)) ?? (await getBestDiscount(user.id, plan))
    : await getBestDiscount(user.id, plan);

  // Fast path: free_upgrade discount — grant Pro directly, no Paddle needed
  if (discount?.discount_type === "free_upgrade") {
    const discountedPrice = applyDiscount(0, discount);
    if (discountedPrice === 0) {
      await admin.from("subscriptions").upsert(
        {
          professional_id: user.id,
          plan,
          status: "active",
          billing_interval,
          employer_tier: employer_tier ?? null,
          current_period_end: new Date(
            Date.now() + (billing_interval === "annual" ? 365 : 30) * 86400000,
          ).toISOString(),
          cancel_at_period_end: false,
        },
        { onConflict: "professional_id" },
      );
      await admin.rpc("increment_discount_uses", { discount_id: discount.id });
      return NextResponse.json({ url: "/dashboard?upgrade=success" });
    }
  }

  // Paid path: require a configured Paddle price ID
  const priceId = resolvePaddlePriceId(
    plan,
    billing_interval as BillingInterval,
    employer_tier as EmployerTierKey | undefined,
  );

  if (!priceId) {
    return NextResponse.json({ error: "Price ID not configured" }, { status: 500 });
  }

  const { data: sub } = await admin
    .from("subscriptions")
    .select("paddle_customer_id")
    .eq("professional_id", user.id)
    .maybeSingle();

  let discountMeta: Record<string, unknown> = {};
  if (discount && discount.discount_type !== "free_upgrade") {
    discountMeta = { discount_id: discount.id, discount_name: discount.name };
  }

  const transaction = await getPaddle().transactions.create({
    items: [{ priceId, quantity: 1 }],
    ...(sub?.paddle_customer_id
      ? { customer: { id: sub.paddle_customer_id } }
      : { customer: { email: user.email! } }),
    customData: {
      supabase_uid: user.id,
      plan,
      billing_interval,
      employer_tier: employer_tier ?? null,
      ...discountMeta,
    },
  });

  if (!transaction.checkout?.url) {
    return NextResponse.json({ error: "Could not create checkout" }, { status: 500 });
  }

  return NextResponse.json({ url: transaction.checkout.url });
}

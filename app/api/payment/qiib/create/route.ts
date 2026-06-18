import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { getBestDiscount, getDiscountByCode, applyDiscount } from "@/lib/discounts";
import {
  isQiibConfigured,
  resolveQiibPrice,
  createQiibSession,
  usdToQar,
} from "@/lib/qiib";
import { logAudit } from "@/lib/audit";
import { z } from "zod";
import type { BillingInterval, EmployerTier } from "@/lib/types";

export const runtime = "nodejs";

const BodySchema = z.object({
  plan: z.enum(["pro", "employer"]),
  billing_interval: z.enum(["monthly", "annual"]).default("annual"),
  employer_tier: z.enum(["clinic", "growth", "department", "hospital"]).optional(),
  promo_code: z.string().max(50).optional(),
});

export async function POST(request: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { plan, billing_interval, employer_tier, promo_code } = parsed.data;

  // Rate limit: 10 checkout attempts per user per hour
  const rl = await checkAndLogRateLimit({
    action: "qiib.checkout",
    userId: user.id,
    maxPerHour: 10,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many checkout attempts — please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds ?? 3600) } },
    );
  }

  const admin = createAdminClient();

  // Check for free_upgrade discount — bypasses payment entirely
  const discount = promo_code
    ? (await getDiscountByCode(promo_code, plan)) ?? (await getBestDiscount(user.id, plan))
    : await getBestDiscount(user.id, plan);

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
          payment_provider: "free_upgrade",
          current_period_end: new Date(
            Date.now() + (billing_interval === "annual" ? 365 : 30) * 86400000,
          ).toISOString(),
          cancel_at_period_end: false,
        },
        { onConflict: "professional_id" },
      );
      await admin.rpc("increment_discount_uses", { discount_id: discount.id });
      await logAudit({ actorAuthId: user.id, action: "subscription.free_upgrade", metadata: { plan, promo_code } });
      return NextResponse.json({ url: "/dashboard?upgrade=success" });
    }
  }

  // If QIIB is not yet configured, return a clear contact message
  if (!isQiibConfigured()) {
    return NextResponse.json(
      {
        error: "payment_not_configured",
        message: "Online payment is being set up. To upgrade now, contact support.",
        support_email: "support@hayyamed.pro",
      },
      { status: 503 },
    );
  }

  // Resolve price
  const pricing = resolveQiibPrice(
    plan,
    billing_interval as BillingInterval,
    employer_tier as Exclude<EmployerTier, "enterprise"> | undefined,
  );

  // Apply percentage/fixed discount to QAR amount
  const amountQar = discount && discount.discount_type !== "free_upgrade"
    ? applyDiscount(pricing.qar, discount)
    : pricing.qar;
  const amountUsd = discount && discount.discount_type !== "free_upgrade"
    ? applyDiscount(pricing.usd, discount)
    : pricing.usd;

  // Create session record in DB first (we need the ID as the QIIB order reference)
  const { data: session, error: sessionError } = await admin
    .from("qiib_payment_sessions")
    .insert({
      professional_id: user.id,
      plan,
      billing_interval,
      employer_tier: employer_tier ?? null,
      amount_usd: amountUsd,
      amount_qar: amountQar,
      currency: "QAR",
      status: "pending",
      discount_id: discount?.id ?? null,
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Could not create payment session" }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";

  try {
    const qiibSession = await createQiibSession({
      orderId: session.id,
      amountQar,
      returnUrl: `${appUrl}/api/payment/qiib/callback?session_id=${session.id}`,
      webhookUrl: `${appUrl}/api/payment/qiib/webhook`,
      description: `Hayya Med Pro — ${plan} plan (${billing_interval})`,
      customerEmail: user.email!,
    });

    // Store QIIB session details
    await admin
      .from("qiib_payment_sessions")
      .update({
        qiib_session_id: qiibSession.sessionId,
        payment_url: qiibSession.paymentUrl,
      })
      .eq("id", session.id);

    await logAudit({
      actorAuthId: user.id,
      action: "payment.qiib.session_created",
      targetTable: "qiib_payment_sessions",
      targetId: session.id,
      metadata: { plan, billing_interval, amount_qar: amountQar },
    });

    return NextResponse.json({ url: qiibSession.paymentUrl });
  } catch (err) {
    // Clean up the pending session on QIIB error
    await admin
      .from("qiib_payment_sessions")
      .update({ status: "failed", failure_reason: String(err) })
      .eq("id", session.id);

    return NextResponse.json({ error: "Could not connect to payment gateway" }, { status: 502 });
  }
}

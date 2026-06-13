import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { createQPayInvoice, isQPayConfigured, QPAY_PLAN_PRICES } from "@/lib/qpay";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  plan: z.enum(["pro", "employer"]),
  billing_interval: z.enum(["monthly", "annual"]).default("annual"),
});

export async function POST(request: NextRequest) {
  if (!isQPayConfigured()) {
    return NextResponse.json({ error: "QPay not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { plan, billing_interval } = parsed.data;

  const rl = await checkAndLogRateLimit({
    action: "qpay.checkout",
    userId: user.id,
    maxPerHour: 10,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds ?? 3600) } }
    );
  }

  const priceKey = `${plan}_${billing_interval}`;
  const price = QPAY_PLAN_PRICES[priceKey];
  if (!price) {
    return NextResponse.json({ error: "Invalid plan/billing combination" }, { status: 400 });
  }

  const admin = createAdminClient();
  const invoiceNumber = `HMP-${user.id.slice(0, 8).toUpperCase()}-${Date.now()}`;

  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://pro.hayyamed.pro"}/api/qpay/callback?invoice_number=${invoiceNumber}`;

  try {
    const invoice = await createQPayInvoice({
      invoiceNumber,
      amount: price.amountQAR,
      callbackUrl,
      senderName: user.email ?? "User",
      description: price.description,
    });

    // Store pending QPay invoice for verification on callback
    await admin.from("qpay_invoices").insert({
      invoice_id: invoice.invoice_id,
      invoice_number: invoiceNumber,
      professional_id: user.id,
      plan,
      billing_interval,
      amount_qar: price.amountQAR,
      status: "pending",
      qr_text: invoice.qr_text,
      short_url: invoice.qpay_shorturl,
    });

    logAudit({
      actorAuthId: user.id,
      action: "qpay.checkout_created",
      targetTable: "qpay_invoices",
      metadata: { invoice_id: invoice.invoice_id, plan, billing_interval, amount_qar: price.amountQAR },
    }).catch(() => {});

    return NextResponse.json({
      invoice_id: invoice.invoice_id,
      qr_text: invoice.qr_text,
      qr_image: invoice.qr_image,
      short_url: invoice.qpay_shorturl,
      urls: invoice.urls,
      amount_qar: price.amountQAR,
      description: price.description,
    });
  } catch (err) {
    console.error("QPay checkout error:", err);
    return NextResponse.json({ error: "QPay service unavailable. Please try again." }, { status: 503 });
  }
}

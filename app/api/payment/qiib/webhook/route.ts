import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import {
  verifyQiibWebhookSignature,
  normalizeQiibStatus,
} from "@/lib/qiib";
import { sendSubscriptionActivatedEmail } from "@/lib/email";

export const runtime = "nodejs";

// QIIB IPN (Instant Payment Notification) webhook.
// QIIB POSTs payment outcome to this URL directly (server-to-server).
// This is the reliable path — the callback route only redirects the user
// and reads back whatever status this webhook already wrote; the IPN here
// is the sole authoritative source for marking a session "paid".
//
// TODO: confirm exact webhook payload structure and signature header name
// from QIIB API docs (common: X-Signature, X-QIIB-Signature).

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const signature =
    request.headers.get("x-qiib-signature") ??
    request.headers.get("x-signature") ??
    "";

  // Reject anything that doesn't verify — including everything until
  // QIIB_WEBHOOK_SECRET is actually set, which is the safe default.
  if (!verifyQiibWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // TODO: confirm exact field names from QIIB webhook docs
  const orderId = (payload.orderId ?? payload.order_id ?? payload.merchantOrderId) as string;
  const rawStatus = (payload.status ?? payload.paymentStatus ?? payload.transactionStatus) as string;
  const transactionRef = (payload.transactionRef ?? payload.txnRef ?? payload.transactionId ?? "") as string;

  if (!orderId || !rawStatus) {
    return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: session } = await admin
    .from("qiib_payment_sessions")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (!session) {
    // Return 200 to prevent QIIB from retrying indefinitely for unknown orders
    return NextResponse.json({ received: true });
  }

  // Idempotency: skip if already processed
  if (session.status === "paid") {
    return NextResponse.json({ received: true });
  }

  const normalizedStatus = normalizeQiibStatus(rawStatus);

  if (normalizedStatus === "paid") {
    await admin
      .from("qiib_payment_sessions")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        qiib_transaction_ref: transactionRef || null,
      })
      .eq("id", orderId);

    const periodEnd = new Date(
      Date.now() +
        (session.billing_interval === "annual" ? 365 : 30) * 86400000,
    ).toISOString();

    await admin.from("subscriptions").upsert(
      {
        professional_id: session.professional_id,
        plan: session.plan,
        status: "active",
        billing_interval: session.billing_interval,
        employer_tier: session.employer_tier ?? null,
        payment_provider: "qiib",
        current_period_end: periodEnd,
        cancel_at_period_end: false,
      },
      { onConflict: "professional_id" },
    );

    await logAudit({
      actorAuthId: session.professional_id,
      action: "subscription.activated",
      targetTable: "qiib_payment_sessions",
      targetId: orderId,
      metadata: {
        plan: session.plan,
        billing_interval: session.billing_interval,
        amount_qar: session.amount_qar,
        transaction_ref: transactionRef,
        payment_provider: "qiib",
        source: "webhook",
      },
    });

    // Fire-and-forget confirmation email
    admin
      .from("professional_profiles")
      .select("email, full_name")
      .eq("auth_id", session.professional_id)
      .maybeSingle()
      .then(({ data: profile }) => {
        if (profile?.email) {
          sendSubscriptionActivatedEmail({
            to: profile.email,
            name: profile.full_name ?? "Healthcare Professional",
            plan: session.plan,
            billingInterval: session.billing_interval,
            employerTier: session.employer_tier ?? undefined,
          }).catch(() => {});
        }
      });
  } else if (normalizedStatus === "failed") {
    await admin
      .from("qiib_payment_sessions")
      .update({ status: "failed", failure_reason: rawStatus })
      .eq("id", orderId);

    await logAudit({
      actorAuthId: session.professional_id,
      action: "payment.qiib.failed",
      targetTable: "qiib_payment_sessions",
      targetId: orderId,
      metadata: { raw_status: rawStatus },
    });
  }

  return NextResponse.json({ received: true });
}

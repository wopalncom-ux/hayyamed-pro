import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { normalizeQiibStatus } from "@/lib/qiib";
import { sendSubscriptionActivatedEmail } from "@/lib/email";

export const runtime = "nodejs";

// QIIB redirects the user back here after payment (success or fail).
// URL pattern: /api/payment/qiib/callback?session_id=xxx&status=SUCCESS&transaction_ref=xxx
//
// TODO: confirm exact query param names with QIIB API docs.
// Common patterns: status, txnRef, transactionId, paymentStatus, orderStatus

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sessionId = searchParams.get("session_id");

  // TODO: confirm param names from QIIB docs
  const rawStatus = searchParams.get("status") ?? searchParams.get("paymentStatus") ?? "";
  const transactionRef =
    searchParams.get("transaction_ref") ??
    searchParams.get("txnRef") ??
    searchParams.get("transactionId") ??
    "";

  if (!sessionId) {
    return NextResponse.redirect(new URL("/pricing?payment=error", request.nextUrl.origin));
  }

  const admin = createAdminClient();

  const { data: session } = await admin
    .from("qiib_payment_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session) {
    return NextResponse.redirect(new URL("/pricing?payment=error", request.nextUrl.origin));
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
      .eq("id", sessionId);

    // Activate subscription
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
      targetId: sessionId,
      metadata: {
        plan: session.plan,
        billing_interval: session.billing_interval,
        amount_qar: session.amount_qar,
        transaction_ref: transactionRef,
        payment_provider: "qiib",
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

    return NextResponse.redirect(
      new URL("/dashboard?upgrade=success", request.nextUrl.origin),
    );
  }

  // Payment failed or unknown status
  await admin
    .from("qiib_payment_sessions")
    .update({
      status: normalizedStatus === "failed" ? "failed" : "pending",
      failure_reason: rawStatus || "unknown",
    })
    .eq("id", sessionId);

  await logAudit({
    actorAuthId: session.professional_id,
    action: "payment.qiib.callback_failed",
    targetTable: "qiib_payment_sessions",
    targetId: sessionId,
    metadata: { raw_status: rawStatus, transaction_ref: transactionRef },
  });

  return NextResponse.redirect(
    new URL("/pricing?payment=failed", request.nextUrl.origin),
  );
}

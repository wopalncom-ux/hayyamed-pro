import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { getQiibPaymentStatus, normalizeQiibStatus } from "@/lib/qiib";
import { sendSubscriptionActivatedEmail } from "@/lib/email";

export const runtime = "nodejs";

// QIIB redirects the *user's browser* back here after payment. This is NOT a
// trusted server-to-server call — anyone can hit this URL with any query
// params they like, so it must NEVER activate a subscription based on the
// `status` query param (that was the bug here before: forging
// ?status=SUCCESS on your own known session_id was enough to get a free
// subscription). The webhook route is the only authoritative writer of
// "paid". This route only reads back whatever the webhook already decided,
// with a best-effort server-side status re-check (our own outbound call,
// not user input) as a fallback if the webhook hasn't landed yet.

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sessionId = searchParams.get("session_id");

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

  // Webhook already confirmed this one way or the other — trust the DB, not the URL.
  if (session.status === "paid") {
    return NextResponse.redirect(
      new URL(`/billing/success?checkout_id=${sessionId}`, request.nextUrl.origin),
    );
  }
  if (session.status === "failed") {
    return NextResponse.redirect(
      new URL(`/billing/failed?checkout_id=${sessionId}`, request.nextUrl.origin),
    );
  }

  // Still "pending" — the IPN may just be slow. Ask QIIB ourselves rather
  // than trusting anything from the redirect URL.
  try {
    const rawStatus = await getQiibPaymentStatus(sessionId);
    const normalizedStatus = normalizeQiibStatus(rawStatus);

    if (normalizedStatus === "paid") {
      await admin
        .from("qiib_payment_sessions")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", sessionId);

      const periodEnd = new Date(
        Date.now() + (session.billing_interval === "annual" ? 365 : 30) * 86400000,
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
          payment_provider: "qiib",
          source: "callback_status_check",
        },
      });

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
        new URL(`/billing/success?checkout_id=${sessionId}`, request.nextUrl.origin),
      );
    }

    if (normalizedStatus === "failed") {
      await admin
        .from("qiib_payment_sessions")
        .update({ status: "failed", failure_reason: rawStatus })
        .eq("id", sessionId);

      await logAudit({
        actorAuthId: session.professional_id,
        action: "payment.qiib.callback_failed",
        targetTable: "qiib_payment_sessions",
        targetId: sessionId,
        metadata: { raw_status: rawStatus, source: "callback_status_check" },
      });

      return NextResponse.redirect(
        new URL(`/billing/failed?checkout_id=${sessionId}`, request.nextUrl.origin),
      );
    }
  } catch {
    // Status API not reachable/not configured yet — fall through to "processing".
  }

  // Genuinely still pending (or status check unavailable) — don't guess, show a
  // waiting page; the webhook will finalize it and the user can refresh.
  return NextResponse.redirect(
    new URL(`/billing/processing?checkout_id=${sessionId}`, request.nextUrl.origin),
  );
}

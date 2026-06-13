import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { checkQPayPayment } from "@/lib/qpay";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

// QPay calls this URL after payment. We verify payment via API (not just trust the callback).
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const invoiceNumber = searchParams.get("invoice_number");

  if (!invoiceNumber) {
    return NextResponse.redirect(new URL("/pricing?payment=failed", request.url));
  }

  const admin = createAdminClient();

  const { data: invoice } = await admin
    .from("qpay_invoices")
    .select("*")
    .eq("invoice_number", invoiceNumber)
    .maybeSingle();

  if (!invoice || invoice.status === "paid") {
    return NextResponse.redirect(
      new URL(invoice?.status === "paid" ? "/dashboard?upgrade=success" : "/pricing?payment=failed", request.url)
    );
  }

  try {
    const paymentCheck = await checkQPayPayment(invoice.invoice_id);

    if (paymentCheck.count === 0 || paymentCheck.paid_amount < invoice.amount_qar) {
      return NextResponse.redirect(new URL("/pricing?payment=pending", request.url));
    }

    const paymentRow = paymentCheck.rows[0];

    // Mark invoice as paid
    await admin
      .from("qpay_invoices")
      .update({
        status: "paid",
        payment_id: paymentRow.payment_id,
        paid_at: new Date().toISOString(),
      })
      .eq("invoice_number", invoiceNumber);

    // Activate subscription
    const billingInterval = invoice.billing_interval as "monthly" | "annual";
    await admin.from("subscriptions").upsert(
      {
        professional_id: invoice.professional_id,
        plan: invoice.plan,
        status: "active",
        billing_interval: billingInterval,
        current_period_end: new Date(
          Date.now() + (billingInterval === "annual" ? 365 : 30) * 86400000
        ).toISOString(),
        cancel_at_period_end: false,
        payment_provider: "qpay",
        qpay_invoice_id: invoice.invoice_id,
      },
      { onConflict: "professional_id" }
    );

    logAudit({
      actorAuthId: invoice.professional_id,
      action: "qpay.payment_confirmed",
      targetTable: "qpay_invoices",
      metadata: {
        invoice_id: invoice.invoice_id,
        payment_id: paymentRow.payment_id,
        plan: invoice.plan,
        amount_qar: invoice.amount_qar,
      },
    }).catch(() => {});

    return NextResponse.redirect(new URL("/dashboard?upgrade=success&provider=qpay", request.url));
  } catch (err) {
    console.error("QPay callback error:", err);
    return NextResponse.redirect(new URL("/pricing?payment=error", request.url));
  }
}

// QPay may also POST the callback
export const POST = GET;

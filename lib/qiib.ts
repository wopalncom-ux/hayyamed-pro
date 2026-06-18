// QIIB Bank Payment Gateway client
// Contact QIIB merchant services to receive API documentation and credentials.
// Once you have the docs, fill in every TODO block below.
//
// Expected env vars (add to GCP Secret Manager once received from QIIB):
//   QIIB_MERCHANT_ID      — your merchant identifier
//   QIIB_API_KEY          — API key / secret for request signing
//   QIIB_BASE_URL         — gateway base URL (sandbox vs live)
//   QIIB_WEBHOOK_SECRET   — secret used to verify QIIB webhook signatures

import type { BillingInterval, EmployerTier } from "./types";

// ── Constants ──────────────────────────────────────────────────────────────

// QAR is pegged 1 USD = 3.64 QAR (Qatar Central Bank fixed rate)
export const USD_TO_QAR = 3.64;

// Round to nearest 0.5 QAR for clean receipt amounts
export function usdToQar(usd: number): number {
  return Math.round(usd * USD_TO_QAR * 2) / 2;
}

// ── Configuration ──────────────────────────────────────────────────────────

export function isQiibConfigured(): boolean {
  return Boolean(
    process.env.QIIB_MERCHANT_ID &&
    process.env.QIIB_API_KEY &&
    process.env.QIIB_BASE_URL,
  );
}

// ── Pricing in QAR ────────────────────────────────────────────────────────

export const QIIB_PRICES: Record<string, Record<BillingInterval, { qar: number; usd: number }>> = {
  pro: {
    monthly: { usd: 6,     qar: usdToQar(6) },
    annual:  { usd: 61.20, qar: usdToQar(61.20) },
  },
  employer_clinic: {
    monthly: { usd: 50,   qar: usdToQar(50) },
    annual:  { usd: 510,  qar: usdToQar(510) },
  },
  employer_growth: {
    monthly: { usd: 100,  qar: usdToQar(100) },
    annual:  { usd: 1020, qar: usdToQar(1020) },
  },
  employer_department: {
    monthly: { usd: 180,  qar: usdToQar(180) },
    annual:  { usd: 1836, qar: usdToQar(1836) },
  },
  employer_hospital: {
    monthly: { usd: 350,  qar: usdToQar(350) },
    annual:  { usd: 3570, qar: usdToQar(3570) },
  },
};

export function resolveQiibPrice(
  plan: "pro" | "employer",
  interval: BillingInterval,
  employerTier?: Exclude<EmployerTier, "enterprise"> | null,
): { qar: number; usd: number } {
  if (plan === "pro") return QIIB_PRICES.pro[interval];
  const key = `employer_${employerTier ?? "growth"}`;
  return QIIB_PRICES[key]?.[interval] ?? QIIB_PRICES.employer_growth[interval];
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface QiibCreateSessionParams {
  orderId: string;        // unique order reference (our qiib_payment_sessions.id)
  amountQar: number;      // amount in QAR
  returnUrl: string;      // where QIIB redirects user after payment
  webhookUrl: string;     // where QIIB sends IPN notification
  description: string;    // shown on QIIB payment page
  customerEmail: string;  // pre-fills customer email on QIIB page
}

export interface QiibSession {
  sessionId: string;   // QIIB's session identifier
  paymentUrl: string;  // redirect the user to this URL
}

export interface QiibWebhookPayload {
  orderId: string;
  status: string;              // e.g. "SUCCESS", "FAILED" — confirm exact values with QIIB
  transactionRef: string;
  amount: number;
  signature: string;
}

// ── API calls ─────────────────────────────────────────────────────────────

export async function createQiibSession(
  params: QiibCreateSessionParams,
): Promise<QiibSession> {
  if (!isQiibConfigured()) {
    throw new Error("QIIB gateway not configured — set QIIB_MERCHANT_ID, QIIB_API_KEY, QIIB_BASE_URL");
  }

  // TODO: implement once QIIB API docs received.
  //
  // Typical regional bank gateway pattern (exact fields will differ):
  //
  // const response = await fetch(`${process.env.QIIB_BASE_URL}/payment/create`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${process.env.QIIB_API_KEY}`,
  //     // OR: "X-Merchant-ID": process.env.QIIB_MERCHANT_ID,
  //     // Some gateways use HMAC signature — confirm with QIIB docs.
  //   },
  //   body: JSON.stringify({
  //     merchantId: process.env.QIIB_MERCHANT_ID,
  //     orderId: params.orderId,
  //     amount: params.amountQar,          // confirm: QAR or halala (QAR × 100)?
  //     currency: "QAR",
  //     returnUrl: params.returnUrl,
  //     notificationUrl: params.webhookUrl,
  //     description: params.description,
  //     customerEmail: params.customerEmail,
  //   }),
  // });
  //
  // const data = await response.json();
  // return { sessionId: data.sessionId, paymentUrl: data.paymentUrl };

  throw new Error("TODO: QIIB createSession — awaiting API docs from QIIB merchant services");
}

export async function getQiibPaymentStatus(orderId: string): Promise<string> {
  if (!isQiibConfigured()) {
    throw new Error("QIIB gateway not configured");
  }

  // TODO: implement once QIIB API docs received.
  //
  // const response = await fetch(
  //   `${process.env.QIIB_BASE_URL}/payment/status/${orderId}`,
  //   {
  //     headers: { "Authorization": `Bearer ${process.env.QIIB_API_KEY}` },
  //   },
  // );
  // const data = await response.json();
  // return data.status; // normalize to "paid" | "pending" | "failed"

  throw new Error("TODO: QIIB getPaymentStatus — awaiting API docs from QIIB merchant services");
}

export function verifyQiibWebhookSignature(
  payload: string,
  signature: string,
): boolean {
  // TODO: implement once QIIB API docs received.
  //
  // Most regional gateways use HMAC-SHA256:
  //
  // import { createHmac } from "crypto";
  // const expected = createHmac("sha256", process.env.QIIB_WEBHOOK_SECRET!)
  //   .update(payload)
  //   .digest("hex");
  // return expected === signature;
  //
  // Some use a different header name or base64 encoding — confirm with QIIB docs.

  void payload; void signature;
  return false; // safe default: reject until implemented
}

// Normalize QIIB's status string to our DB status
export function normalizeQiibStatus(qiibStatus: string): "paid" | "failed" | "pending" {
  // TODO: confirm exact status strings from QIIB docs.
  // Common patterns: "SUCCESS"/"APPROVED" → "paid", "FAILED"/"DECLINED" → "failed"
  const s = qiibStatus.toUpperCase();
  if (["SUCCESS", "APPROVED", "PAID", "CAPTURED"].includes(s)) return "paid";
  if (["FAILED", "DECLINED", "REJECTED", "CANCELLED"].includes(s)) return "failed";
  return "pending";
}

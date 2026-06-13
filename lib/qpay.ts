// QPay Qatar — National Payment Gateway integration
// Docs: https://developer.qpay.gov.qa

const QPAY_BASE_URL = process.env.QPAY_BASE_URL ?? "https://merchant.qpay.gov.qa/v2";
const QPAY_USERNAME = process.env.QPAY_USERNAME ?? "";
const QPAY_PASSWORD = process.env.QPAY_PASSWORD ?? "";
const QPAY_INVOICE_CODE = process.env.QPAY_INVOICE_CODE ?? "";

interface QPayToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface QPayInvoiceResponse {
  invoice_id: string;
  qr_text: string;
  qr_image: string;
  qpay_shorturl: string;
  urls: Array<{ name: string; logo: string; description: string; url: string }>;
}

interface QPayPaymentCheckResponse {
  count: number;
  paid_amount: number;
  rows: Array<{
    payment_id: string;
    payment_status: string;
    payment_type: string;
    payment_reference: string;
    payment_currency: string;
    payment_amount: number;
    payment_date: string;
  }>;
}

let _token: QPayToken | null = null;
let _tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry) return _token.access_token;

  const res = await fetch(`${QPAY_BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${QPAY_USERNAME}:${QPAY_PASSWORD}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`QPay auth failed: ${res.status} ${await res.text()}`);
  }

  _token = (await res.json()) as QPayToken;
  _tokenExpiry = Date.now() + (_token.expires_in - 60) * 1000;
  return _token.access_token;
}

export function isQPayConfigured(): boolean {
  return !!(QPAY_USERNAME && QPAY_PASSWORD && QPAY_INVOICE_CODE);
}

export interface QPayCreateInvoiceParams {
  invoiceNumber: string;
  amount: number;
  callbackUrl: string;
  senderName?: string;
  description?: string;
}

export async function createQPayInvoice(
  params: QPayCreateInvoiceParams
): Promise<QPayInvoiceResponse> {
  const token = await getAccessToken();

  const body = {
    invoice_code: QPAY_INVOICE_CODE,
    sender_name: params.senderName ?? "Hayya Med Pro",
    sender_branch_name: "Hayya Med Pro",
    invoice_receiver_code: "terminal",
    invoice_description: params.description ?? "Hayya Med Pro subscription",
    amount: params.amount,
    callback_url: params.callbackUrl,
    invoice_number: params.invoiceNumber,
  };

  const res = await fetch(`${QPAY_BASE_URL}/invoice`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`QPay invoice creation failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as QPayInvoiceResponse;
}

export async function checkQPayPayment(invoiceId: string): Promise<QPayPaymentCheckResponse> {
  const token = await getAccessToken();

  const res = await fetch(`${QPAY_BASE_URL}/payment/check`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      object_type: "INVOICE",
      object_id: invoiceId,
      offset: { page_number: 1, page_limit: 100 },
    }),
  });

  if (!res.ok) {
    throw new Error(`QPay payment check failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as QPayPaymentCheckResponse;
}

export interface QPayPlanPrice {
  amountQAR: number;
  description: string;
}

export const QPAY_PLAN_PRICES: Record<string, QPayPlanPrice> = {
  "pro_monthly":  { amountQAR: 49,   description: "Hayya Med Pro — Monthly" },
  "pro_annual":   { amountQAR: 399,  description: "Hayya Med Pro — Annual" },
  "employer_monthly": { amountQAR: 299,  description: "Hayya Med Employer — Monthly" },
  "employer_annual":  { amountQAR: 2499, description: "Hayya Med Employer — Annual" },
};

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QPayInvoiceResponse {
  invoice_id: string;
  qr_text: string;
  qr_image: string;
  short_url: string;
  urls: Array<{ name: string; logo: string; description: string; url: string }>;
  amount_qar: number;
  description: string;
}

interface QPayCheckoutProps {
  plan: "pro" | "employer";
  billingInterval: "monthly" | "annual";
  onClose?: () => void;
}

export default function QPayCheckout({ plan, billingInterval, onClose }: QPayCheckoutProps) {
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [invoice, setInvoice] = useState<QPayInvoiceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function initiateCheckout() {
    setState("loading");
    setError(null);

    try {
      const res = await fetch("/api/qpay/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing_interval: billingInterval }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Checkout failed."); setState("error"); return; }
      setInvoice(data);
      setState("ready");
    } catch {
      setError("Connection error. Please try again.");
      setState("error");
    }
  }

  if (state === "idle" || state === "loading") {
    return (
      <button
        type="button"
        onClick={initiateCheckout}
        disabled={state === "loading"}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#8d1b3d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a1735] transition-colors disabled:opacity-60"
      >
        {state === "loading" ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Preparing QPay…
          </>
        ) : (
          <>
            {/* Qatar flag stripe */}
            <span className="text-base leading-none">🇶🇦</span>
            Pay with QPay (QAR)
          </>
        )}
      </button>
    );
  }

  if (state === "error") {
    return (
      <div className="w-full">
        <div className="text-xs text-[#dc2626] mb-2 text-center">{error}</div>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="w-full px-4 py-2.5 border border-[#e2e8f0] text-sm text-[#374151] rounded-xl hover:bg-[#f8fafc] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (state === "ready" && invoice) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          {/* Invoice card */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#64748b]">QPay Invoice</p>
                <p className="text-lg font-bold text-[#0f1f3d]">QAR {invoice.amount_qar}</p>
                <p className="text-xs text-[#64748b]">{invoice.description}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#8d1b3d] flex items-center justify-center">
                <span className="text-white text-xl">🇶🇦</span>
              </div>
            </div>

            {/* QR code */}
            {invoice.qr_image && (
              <div className="flex justify-center">
                <div className="bg-white p-3 rounded-xl border border-[#e2e8f0] inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`data:image/png;base64,${invoice.qr_image}`}
                    alt="QPay QR Code"
                    width={160}
                    height={160}
                    className="rounded"
                  />
                </div>
              </div>
            )}

            <p className="text-xs text-center text-[#64748b]">
              Scan with your bank app or tap below to open QPay
            </p>

            {/* QPay short URL */}
            {invoice.short_url && (
              <a
                href={invoice.short_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-2.5 bg-[#8d1b3d] text-white text-sm font-semibold rounded-xl hover:bg-[#7a1735] transition-colors"
              >
                Open QPay App →
              </a>
            )}

            {/* Bank-specific payment links */}
            {invoice.urls && invoice.urls.length > 0 && (
              <div>
                <p className="text-[10px] text-[#94a3b8] text-center mb-2">Or pay directly with your bank</p>
                <div className="grid grid-cols-2 gap-2">
                  {invoice.urls.slice(0, 4).map((u) => (
                    <a
                      key={u.name}
                      href={u.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-2 py-1.5 bg-white border border-[#e2e8f0] rounded-lg text-xs text-[#374151] hover:border-[#1a56a0] transition-colors"
                    >
                      {u.logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.logo} alt={u.name} width={16} height={16} className="rounded" />
                      )}
                      <span className="truncate">{u.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[10px] text-[#94a3b8] text-center">
              After payment, you will be automatically redirected. Allow up to 2 minutes for activation.
            </p>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full text-xs text-[#94a3b8] hover:text-[#64748b] transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const RETRY_DELAY_MS = 4000;
const MAX_RETRIES = 8;

export default function BillingProcessingPage() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!checkoutId || attempt >= MAX_RETRIES) return;
    const t = setTimeout(() => {
      // Re-runs the callback route's DB-status + QIIB status-check logic;
      // it redirects to /billing/success or /billing/failed once resolved.
      window.location.href = `/api/payment/qiib/callback?session_id=${checkoutId}`;
    }, RETRY_DELAY_MS);
    return () => clearTimeout(t);
  }, [checkoutId, attempt]);

  useEffect(() => {
    if (attempt >= MAX_RETRIES) return;
    const t = setTimeout(() => setAttempt((a) => a + 1), RETRY_DELAY_MS);
    return () => clearTimeout(t);
  }, [attempt]);

  const timedOut = attempt >= MAX_RETRIES;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <nav className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-[#1a56a0] text-lg">
          <span className="w-7 h-7 rounded-lg bg-[#1a56a0] flex items-center justify-center text-white text-sm font-black">H</span>
          Hayya Med Pro
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#f0f7ff] flex items-center justify-center mx-auto mb-6">
            {!timedOut ? (
              <div
                className="w-8 h-8 rounded-full border-2 border-[#c7daf7] border-t-[#1a56a0]"
                style={{ animation: "spin 0.8s linear infinite" }}
                aria-hidden="true"
              />
            ) : (
              <span className="text-2xl" aria-hidden="true">⏳</span>
            )}
          </div>

          <h1 className="text-xl font-bold text-[#0f1f3d] mb-3">
            {timedOut ? "Still confirming your payment" : "Confirming your payment…"}
          </h1>
          <p className="text-sm text-[#64748b] mb-8 leading-relaxed">
            {timedOut ? (
              <>
                This is taking longer than usual. Your payment is safe — we&apos;ll activate your
                subscription automatically as soon as it&apos;s confirmed. If it doesn&apos;t update within
                a few minutes, contact{" "}
                <a href="mailto:support@hayyamed.pro" className="text-[#1a56a0] hover:underline">
                  support@hayyamed.pro
                </a>{" "}
                with your order reference below.
              </>
            ) : (
              "We're waiting on the final confirmation from your payment provider — this page will update automatically."
            )}
          </p>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors"
          >
            Go to dashboard
          </Link>

          {checkoutId && (
            <p className="text-xs text-[#94a3b8] mt-6">
              Order reference: <span className="font-mono">{checkoutId}</span>
            </p>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

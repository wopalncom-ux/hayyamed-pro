"use client";

import { useState } from "react";

type Mode = "cancel" | "pause";

interface Props {
  currentPeriodEnd: string | null;
  onClose: () => void;
}

export default function CancelSubscriptionModal({ currentPeriodEnd, onClose }: Props) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<"paused" | "cancelled" | null>(null);
  const [error, setError] = useState("");

  const periodEndDisplay = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  async function handleConfirm() {
    if (!mode) return;
    setLoading(true);
    setError("");
    try {
      const endpoint = mode === "pause" ? "/api/subscription/pause" : "/api/subscription/cancel";
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setDone(mode === "pause" ? "paused" : "cancelled");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#111]">Manage subscription</h2>
          <button onClick={onClose} aria-label="Close" className="text-[#64748b] hover:text-[#111] p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          {done === "paused" ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-base font-semibold text-[#111] mb-2">Subscription paused</p>
              <p className="text-sm text-[#64748b]">
                Your subscription will not renew. You&apos;ll keep Pro access until{" "}
                {periodEndDisplay ? <strong>{periodEndDisplay}</strong> : "your current period ends"}, then get
                an extra 30 days of free Pro access before switching to the free plan.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-5 text-sm font-semibold bg-[#1a56a0] text-white px-5 py-2.5 rounded-lg hover:bg-[#154890] transition-colors"
              >
                Got it
              </button>
            </div>
          ) : done === "cancelled" ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#dc2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-base font-semibold text-[#111] mb-2">Subscription cancelled</p>
              <p className="text-sm text-[#64748b]">
                Your subscription will not renew. You&apos;ll keep Pro access until{" "}
                {periodEndDisplay ? <strong>{periodEndDisplay}</strong> : "your current period ends"}.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-5 text-sm font-semibold border border-[#e2e8f0] text-[#374151] px-5 py-2.5 rounded-lg hover:bg-[#f8fafc] transition-colors"
              >
                Close
              </button>
            </div>
          ) : mode === null ? (
            /* Option picker */
            <div className="space-y-3">
              <p className="text-sm text-[#374151] mb-4">
                {periodEndDisplay
                  ? `Your current billing period ends on ${periodEndDisplay}.`
                  : "Choose what you'd like to do."}
              </p>

              {/* Pause option */}
              <button
                onClick={() => setMode("pause")}
                className="w-full text-left p-4 rounded-xl border-2 border-[#e2e8f0] hover:border-[#1a56a0] hover:bg-[#f8fafc] transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111] group-hover:text-[#1a56a0]">
                      Pause — don&apos;t renew, get 30 extra free days
                    </p>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      Cancel the renewal and receive a 30-day free Pro extension after your current period.
                      Perfect if you need a break but plan to return.
                    </p>
                  </div>
                </div>
              </button>

              {/* Cancel option */}
              <button
                onClick={() => setMode("cancel")}
                className="w-full text-left p-4 rounded-xl border-2 border-[#e2e8f0] hover:border-[#dc2626]/50 hover:bg-[#fef2f2] transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#fee2e2] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[#dc2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111]">
                      Cancel at period end
                    </p>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      Stop the subscription at the end of your current billing period. No refund is issued.
                      You can resubscribe any time.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            /* Confirmation step */
            <div>
              <div className="mb-5 p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <p className="text-sm font-semibold text-[#111] mb-1">
                  {mode === "pause"
                    ? "Pause subscription and get 30 free days"
                    : "Cancel subscription at period end"}
                </p>
                <p className="text-xs text-[#64748b]">
                  {mode === "pause"
                    ? `Your subscription won't renew. After your current period${periodEndDisplay ? ` (ends ${periodEndDisplay})` : ""}, you'll get 30 days of free Pro access before moving to the free plan.`
                    : `Your subscription won't renew. You'll keep Pro access until${periodEndDisplay ? ` ${periodEndDisplay}` : " your period end"}, then move to the free plan.`}
                </p>
              </div>

              {error && (
                <p className="text-sm text-[#dc2626] mb-4">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setMode(null)}
                  disabled={loading}
                  className="flex-1 text-sm font-medium border border-[#e2e8f0] text-[#374151] px-4 py-2.5 rounded-lg hover:bg-[#f8fafc] transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className={`flex-1 text-sm font-semibold text-white px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 ${
                    mode === "pause" ? "bg-[#1a56a0] hover:bg-[#154890]" : "bg-[#dc2626] hover:bg-[#b91c1c]"
                  }`}
                >
                  {loading ? "Processing…" : mode === "pause" ? "Pause subscription" : "Cancel subscription"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

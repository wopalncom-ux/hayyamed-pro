"use client";

import { useState, useEffect } from "react";
import { track } from "@/lib/analytics";

const DISMISS_KEY = "nps_dismissed_at";
const SUBMITTED_KEY = "nps_submitted";
const DISMISS_DAYS = 90;
const MIN_AGE_DAYS = 30;

export default function NpsSurvey({ createdAt }: { createdAt: string }) {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already submitted
    if (localStorage.getItem(SUBMITTED_KEY)) return;

    // Dismissed recently
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt, 10)) / 86_400_000;
      if (daysSince < DISMISS_DAYS) return;
    }

    // Account must be at least MIN_AGE_DAYS days old
    const ageDays = (Date.now() - new Date(createdAt).getTime()) / 86_400_000;
    if (ageDays < MIN_AGE_DAYS) return;

    // Show after a short delay so the page renders first
    const t = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(t);
  }, [createdAt]);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
    track("nps_dismissed", { selected });
  }

  function submit() {
    if (selected === null) return;
    localStorage.setItem(SUBMITTED_KEY, "1");
    track("nps_submitted", { score: selected, reason: reason.trim() || undefined });
    setSubmitted(true);
    setTimeout(() => setVisible(false), 2500);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-[340px] bg-white border border-[#e2e8f0] rounded-2xl shadow-xl p-5"
      role="dialog"
      aria-labelledby="nps-heading"
    >
      {submitted ? (
        <div className="text-center py-4">
          <p className="text-2xl mb-2">Thank you</p>
          <p className="text-sm text-[#64748b]">Your feedback helps us improve Hayya Med Pro.</p>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-3">
            <p id="nps-heading" className="text-sm font-semibold text-[#111] leading-snug pr-4">
              How likely are you to recommend Hayya Med Pro to a colleague?
            </p>
            <button
              onClick={dismiss}
              className="shrink-0 text-[#94a3b8] hover:text-[#64748b] text-lg leading-none"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>

          {/* Score buttons 0–10 */}
          <div className="flex gap-1 mb-1">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`flex-1 text-xs font-semibold py-2 rounded-lg border transition-colors ${
                  selected === i
                    ? "bg-[#1a56a0] border-[#1a56a0] text-white"
                    : "bg-[#f8fafc] border-[#e2e8f0] text-[#374151] hover:border-[#1a56a0]/40"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-[#94a3b8] mb-4 px-0.5">
            <span>Not likely</span>
            <span>Very likely</span>
          </div>

          {selected !== null && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                selected >= 9
                  ? "What do you love most about it?"
                  : selected >= 7
                  ? "What could we improve?"
                  : "What's missing or not working for you?"
              }
              rows={2}
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 resize-none"
            />
          )}

          <button
            onClick={submit}
            disabled={selected === null}
            className="w-full bg-[#1a56a0] text-white text-sm font-semibold py-2 rounded-lg hover:bg-[#1547a0] disabled:opacity-40 transition-colors"
          >
            Submit feedback
          </button>
        </>
      )}
    </div>
  );
}

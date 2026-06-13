"use client";

import { useState, useEffect } from "react";
import { submitNpsResponse } from "@/app/(dashboard)/dashboard/actions/nps";
import { track } from "@/lib/analytics";

const DISMISS_KEY = "nps_dismissed_at";
const DISMISS_DAYS = 30;

function shouldShowAfterDismiss(): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return true;
  const ts = Number(raw);
  return Date.now() - ts > DISMISS_DAYS * 86400000;
}

export default function NpsSurveyBanner({ eligible }: { eligible: boolean }) {
  const [visible, setVisible] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [phase, setPhase] = useState<"survey" | "thanks">("survey");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (eligible) setVisible(shouldShowAfterDismiss());
  }, [eligible]);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
    track("nps_dismissed");
  }

  async function submit() {
    if (score === null) return;
    setSubmitting(true);
    const result = await submitNpsResponse(score, comment.trim() || undefined);
    setSubmitting(false);

    if (result.ok || result.error === "Already submitted") {
      track("nps_submitted", { score });
      setPhase("thanks");
      setTimeout(() => {
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
        setVisible(false);
      }, 2800);
    }
  }

  if (!visible) return null;

  const scoreLabel =
    score === null
      ? null
      : score >= 9
      ? "Promoter 🎉"
      : score >= 7
      ? "Neutral"
      : "Detractor";

  const scoreLabelColor =
    score !== null && score >= 9
      ? "text-green-600"
      : score !== null && score >= 7
      ? "text-[#d97706]"
      : score !== null
      ? "text-[#dc2626]"
      : "";

  return (
    <div
      className="bg-white border border-[#e2e8f0] rounded-xl p-5 mb-6 shadow-sm"
      role="dialog"
      aria-label="Quick feedback survey"
    >
      {phase === "thanks" ? (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111]">Thanks for your feedback!</p>
            <p className="text-xs text-[#64748b] mt-0.5">Your response helps us make Hayya Med Pro better for every healthcare professional.</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-sm font-semibold text-[#111]">
                How likely are you to recommend Hayya Med Pro to a colleague?
              </p>
              <p className="text-xs text-[#64748b] mt-0.5">0 = Not at all likely · 10 = Extremely likely</p>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss survey"
              className="text-[#94a3b8] hover:text-[#64748b] transition-colors flex-shrink-0 mt-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Score grid 0–10 */}
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {Array.from({ length: 11 }, (_, i) => i).map((n) => (
              <button
                key={n}
                onClick={() => setScore(n)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all border ${
                  score === n
                    ? n >= 9
                      ? "bg-green-600 border-green-600 text-white"
                      : n >= 7
                      ? "bg-[#d97706] border-[#d97706] text-white"
                      : "bg-[#dc2626] border-[#dc2626] text-white"
                    : "bg-[#f8fafc] border-[#e2e8f0] text-[#374151] hover:border-[#1a56a0] hover:text-[#1a56a0]"
                }`}
              >
                {n}
              </button>
            ))}
            {score !== null && (
              <span className={`text-xs font-medium self-center ml-1 ${scoreLabelColor}`}>
                {scoreLabel}
              </span>
            )}
          </div>

          {/* Optional comment — shown after score selected */}
          {score !== null && (
            <div className="mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What's the main reason for your score? (optional)"
                rows={2}
                maxLength={1000}
                className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 text-[#111] placeholder-[#94a3b8] resize-none focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-[#94a3b8]">Takes 10 seconds · anonymous feedback</p>
            <button
              onClick={submit}
              disabled={score === null || submitting}
              className="px-4 py-2 bg-[#1a56a0] text-white text-sm font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1648891] transition-colors"
            >
              {submitting ? "Sending…" : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

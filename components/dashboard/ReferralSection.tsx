"use client";

import { useState, useTransition } from "react";
import { getOrCreateReferralCode } from "@/app/(dashboard)/dashboard/settings/actions";
import { track } from "@/lib/analytics";

const REFERRER_BONUS_DAYS = 30;
const REFEREE_TRIAL_DAYS = 30;

export default function ReferralSection({
  initialCode,
  referralCount = 0,
}: {
  initialCode: string | null;
  referralCount?: number;
}) {
  const [code, setCode] = useState<string | null>(initialCode);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://hayyamed.pro";

  const referralUrl = code ? `${appUrl}/r/${code}` : null;

  function generate() {
    startTransition(async () => {
      const result = await getOrCreateReferralCode();
      if (result.error) setError(result.error);
      else if (result.code) {
        setCode(result.code);
        track("referral_link_generated");
      }
    });
  }

  function copy() {
    if (!referralUrl) return;
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      track("referral_link_copied");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareLinkedIn() {
    if (!referralUrl) return;
    const text = encodeURIComponent(
      `I track my CME compliance with Hayya Med Pro â€” QCHP, SCFHS, DHA and more in one platform. Sign up free:`
    );
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}&summary=${text}`,
      "_blank",
      "noopener"
    );
    track("referral_link_shared_linkedin");
  }

  const bonusEarned = referralCount * REFERRER_BONUS_DAYS;

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6" id="referral">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-1">
        <h2 className="text-base font-semibold text-[#111]">Refer a Colleague</h2>
        {referralCount > 0 && (
          <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]">
            {referralCount} colleague{referralCount === 1 ? "" : "s"} referred Â· {bonusEarned} days earned
          </span>
        )}
      </div>
      <p className="text-sm text-[#64748b] mb-5">
        Share your referral link with fellow healthcare professionals.
      </p>

      {/* Reward cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-4 py-3">
          <p className="text-xs font-semibold text-[#16a34a] uppercase tracking-wide mb-1">You earn</p>
          <p className="text-xl font-bold text-[#111]">{REFERRER_BONUS_DAYS} free Pro days</p>
          <p className="text-xs text-[#64748b] mt-0.5">per colleague who joins</p>
        </div>
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg px-4 py-3">
          <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-wide mb-1">They get</p>
          <p className="text-xl font-bold text-[#111]">{REFEREE_TRIAL_DAYS}-day trial</p>
          <p className="text-xs text-[#64748b] mt-0.5">instead of the standard 14</p>
        </div>
      </div>

      {!code ? (
        <div>
          <button
            onClick={generate}
            disabled={isPending}
            className="text-sm font-semibold bg-[#1a56a0] text-white px-4 py-2.5 rounded-lg hover:bg-[#154890] disabled:opacity-50 transition-colors"
          >
            {isPending ? "Generatingâ€¦" : "Generate my referral link"}
          </button>
          {error && <p className="text-xs text-[#dc2626] mt-2">{error}</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {/* URL row */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#374151] font-mono truncate select-all">
              {referralUrl}
            </div>
            <button
              onClick={copy}
              className={`flex-shrink-0 text-sm font-semibold px-4 py-2.5 rounded-lg border transition-colors ${
                copied
                  ? "bg-[#dcfce7] border-[#bbf7d0] text-[#16a34a]"
                  : "bg-white border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc]"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Share actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={shareLinkedIn}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-[#e8f0fe] text-[#1a56a0] border border-[#bfdbfe] hover:bg-[#dbeafe] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-11 6H6v10h2V9zm-1-1.5A1.25 1.25 0 115.75 6 1.25 1.25 0 017 7.5zM18 19v-5.5c0-2.1-1.1-3.1-2.7-3.1-1.1 0-1.8.6-2.1 1.2V10h-2v9h2v-4.8c0-1.1.7-1.8 1.7-1.8 1 0 1.1.7 1.1 1.9V19h2z"/>
              </svg>
              Share on LinkedIn
            </button>

            <p className="text-xs text-[#64748b]">
              Code: <span className="font-mono font-semibold text-[#111]">{code}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import type { LearningPathway } from "@/app/api/ai/learning-pathway/route";
import LearningPathwayResult from "@/components/dashboard/LearningPathwayResult";

type WalletSummary = {
  profession: string;
  specialty: string | null;
  country: string;
  required_credits: number;
  completed_credits: number;
  cycle_end_date: string | null;
};

type Props = {
  isPro: boolean;
  wallet: WalletSummary | null;
  gaps: { category: string; earned: number; needed: number }[];
};

export default function LearningPathwayClient({ isPro, wallet, gaps }: Props) {
  const [pathway, setPathway] = useState<LearningPathway | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!wallet) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/learning-pathway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profession: wallet.profession,
          specialty: wallet.specialty,
          country: wallet.country,
          requiredCredits: wallet.required_credits,
          completedCredits: wallet.completed_credits,
          cycleEndDate: wallet.cycle_end_date,
          gaps,
        }),
      });
      if (res.status === 403) { setError("Upgrade to Pro to generate your learning pathway."); return; }
      if (res.status === 429) { setError("Rate limit reached — try again in an hour."); return; }
      if (!res.ok) { setError("AI is temporarily unavailable. Please try again shortly."); return; }
      const data: LearningPathway = await res.json();
      setPathway(data);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [wallet, gaps]);

  if (!isPro) {
    return (
      <div className="bg-gradient-to-br from-[#f8fafc] to-[#e8f0fe] border border-[#bfdbfe] rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-[#1a56a0]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-[#111] mb-2">AI Learning Pathway — Pro Feature</h2>
        <p className="text-sm text-[#64748b] max-w-md mx-auto mb-6">
          Get a personalized 12-month CPD plan with monthly targets, focus areas, and GCC-specific recommendations — all calibrated to your current compliance gaps.
        </p>
        <ul className="text-sm text-[#374151] space-y-2 max-w-xs mx-auto mb-6 text-left">
          {[
            "Month-by-month credit targets",
            "Specialty-specific focus topics",
            "Category gap remediation built-in",
            "GCC conference and platform tips",
            "Regenerate anytime as needs change",
          ].map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className="text-[#16a34a] mt-0.5 flex-shrink-0">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <a
          href="/pricing?source=learning_pathway"
          className="inline-block bg-[#1a56a0] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#1547a0] transition-colors"
        >
          Upgrade to Pro — $6/month →
        </a>
        <p className="text-xs text-[#64748b] mt-3">14-day money-back guarantee · Cancel anytime</p>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-10 text-center">
        <p className="text-sm text-[#64748b] mb-4">Set up your CME wallet first to generate a learning pathway.</p>
        <a href="/dashboard/cme" className="text-sm font-semibold text-[#1a56a0] hover:underline">Go to CME Wallet →</a>
      </div>
    );
  }

  if (pathway) {
    return (
      <LearningPathwayResult
        pathway={pathway}
        profession={wallet.profession}
        country={wallet.country}
        onRegenerate={generate}
        loading={loading}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-10 text-center">
      <div className="w-14 h-14 bg-[#e8f0fe] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-[#111] mb-2">Generate your personalized pathway</h3>
      <p className="text-sm text-[#64748b] max-w-sm mx-auto mb-2">
        Based on your <strong>{wallet.profession}</strong> profile in <strong>{wallet.country}</strong>
        {wallet.specialty ? ` (${wallet.specialty})` : ""}. Currently{" "}
        <strong>{wallet.completed_credits}/{wallet.required_credits}</strong> credits completed.
      </p>
      {gaps.length > 0 && (
        <p className="text-xs text-[#d97706] mb-5">
          {gaps.length} category gap{gaps.length !== 1 ? "s" : ""} detected — your plan will address these specifically.
        </p>
      )}
      {error && <p className="text-sm text-[#dc2626] mb-4">{error}</p>}
      <button
        onClick={generate}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-[#1a56a0] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#1547a0] disabled:opacity-60 transition-colors"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Generating your plan…
          </>
        ) : (
          "✦ Generate 12-Month Plan"
        )}
      </button>
      <p className="text-xs text-[#64748b] mt-3">Takes about 10–15 seconds · Powered by Claude Sonnet AI</p>
    </div>
  );
}

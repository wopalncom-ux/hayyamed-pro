"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import type { AiGap, WalletSummary } from "@/app/(dashboard)/dashboard/ai/page";

type Recommendation = {
  title: string;
  category: string;
  credits: number;
  reason: string;
  action_label: string;
  urgency: "high" | "medium" | "low";
};

type Course = { id: string; title: string; provider_name: string; credits: number; is_free: boolean };

type RecoResult = {
  summary: string;
  recommendations: Recommendation[];
  courses: Record<string, Course[]>;
};

const URGENCY_STYLES: Record<string, string> = {
  high: "bg-[#fef2f2] text-[#dc2626] border-red-100",
  medium: "bg-[#fff7ed] text-[#d97706] border-orange-100",
  low: "bg-[#f0fdf4] text-[#16a34a] border-green-100",
};

const CATEGORY_LABELS: Record<string, string> = {
  conference: "Conference",
  online: "Online / E-Learning",
  workshop: "Workshop",
  journal: "Journal",
  teaching: "Teaching",
  simulation: "Simulation",
  mandatory: "Mandatory",
  patient_safety: "Patient Safety",
  general: "Overall",
  other: "Other",
};

export default function AiRecommendations({
  isPro,
  wallet,
  gaps,
  daysLeft,
}: {
  isPro: boolean;
  wallet: WalletSummary | null;
  gaps: AiGap[];
  daysLeft: number | null;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasGaps = gaps.length > 0;
  const totalRemaining = wallet ? Math.max(0, wallet.required_credits - wallet.completed_credits) : 0;
  const completionPct = wallet ? Math.min(100, Math.round((wallet.completed_credits / wallet.required_credits) * 100)) : 0;

  async function runAnalysis() {
    if (!wallet || !isPro) return;
    setLoading(true);
    setError(null);
    track("ai_recommendation_viewed");

    try {
      const res = await fetch("/api/ai/compliance-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profession: wallet.profession,
          specialty: wallet.specialty,
          country: wallet.country,
          totalRequired: wallet.required_credits,
          totalCompleted: wallet.completed_credits,
          gaps: gaps.filter((g) => g.needed > 0),
          cycleEndDate: wallet.cycle_end_date,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Analysis failed"); return; }
      setResult(data);
    } catch {
      setError("Could not connect to AI service. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] flex flex-col h-[520px] overflow-y-auto relative">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#e2e8f0] sticky top-0 bg-white z-10">
        <div className="w-8 h-8 rounded-full bg-[#fef9c3] flex items-center justify-center text-base">⚡</div>
        <div>
          <p className="text-sm font-semibold text-[#111]">Gap Analysis</p>
          <p className="text-xs text-[#64748b]">AI-powered recommendations to close your gaps</p>
        </div>
        {isPro && (
          <span className="ml-auto text-[10px] font-semibold text-[#d97706] bg-[#fef9c3] px-2 py-0.5 rounded-full">
            Claude Sonnet
          </span>
        )}
      </div>

      <div className="flex-1 px-5 py-4 space-y-4">
        {/* No wallet */}
        {!wallet && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <p className="text-sm text-[#64748b] mb-3">Set up your CME wallet to see your compliance gaps.</p>
            <a href="/onboarding/5" className="text-sm text-[#1a56a0] font-medium hover:underline">Complete CME setup →</a>
          </div>
        )}

        {/* Status bar */}
        {wallet && (
          <div>
            <div className="flex justify-between text-xs text-[#64748b] mb-1.5">
              <span>{wallet.completed_credits} / {wallet.required_credits} credits</span>
              <span>{completionPct}% complete{daysLeft !== null ? ` · ${daysLeft}d left` : ""}</span>
            </div>
            <div className="w-full bg-[#e2e8f0] rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${completionPct >= 100 ? "bg-[#16a34a]" : completionPct >= 60 ? "bg-[#1a56a0]" : "bg-[#d97706]"}`}
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Gap cards — visible to all (it's just data) */}
        {wallet && (
          <div className="space-y-2">
            {!hasGaps && (
              <div className="flex items-center gap-2 bg-[#f0fdf4] border border-green-100 rounded-lg px-4 py-3">
                <span className="text-[#16a34a]">✓</span>
                <p className="text-sm text-[#16a34a] font-medium">All category requirements are met</p>
              </div>
            )}
            {gaps.map((g) => (
              <div key={g.category} className="bg-[#fff7ed] border border-orange-100 rounded-lg px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#374151]">{CATEGORY_LABELS[g.category] ?? g.category}</span>
                  <span className="text-xs font-semibold text-[#d97706]">{g.needed} credits needed</span>
                </div>
                <div className="w-full bg-[#fed7aa]/40 rounded-full h-1.5">
                  <div
                    className="h-1.5 bg-[#d97706] rounded-full"
                    style={{ width: `${Math.min(100, (g.earned / (g.earned + g.needed)) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-[#94a3b8] mt-1">{g.earned} earned of {g.earned + g.needed} required</p>
              </div>
            ))}
          </div>
        )}

        {/* AI analysis results */}
        {result && (
          <div className="space-y-3 pt-1">
            <p className="text-sm text-[#374151] bg-[#f8fafc] rounded-lg px-4 py-3 border border-[#e2e8f0]">
              {result.summary}
            </p>
            {result.recommendations.map((r, i) => (
              <div key={i} className="border border-[#e2e8f0] rounded-xl overflow-hidden">
                <div className="flex items-start gap-3 px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border mt-0.5 ${URGENCY_STYLES[r.urgency]}`}>
                    {r.urgency}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111]">{r.title}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">{r.reason}</p>
                    <p className="text-xs text-[#1a56a0] mt-1">~{r.credits} credits · {CATEGORY_LABELS[r.category] ?? r.category}</p>
                  </div>
                </div>
                {result.courses[r.category]?.length > 0 && (
                  <div className="border-t border-[#f1f5f9] bg-[#f8fafc] px-4 py-2.5 space-y-1.5">
                    {result.courses[r.category].map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-xs text-[#374151]">
                        <span className="truncate mr-2">{c.title}</span>
                        <span className="shrink-0 text-[#64748b]">{c.credits} cr · {c.is_free ? "Free" : c.provider_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-[#dc2626] bg-red-50 rounded-lg px-4 py-3">{error}</p>
        )}

        {/* Analyse button — Pro only */}
        {wallet && isPro && !result && (
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#1a56a0] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#1547a0] disabled:opacity-60 transition-colors mt-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analysing with Claude Sonnet…
              </>
            ) : (
              <>✦ {hasGaps ? "Get AI Recommendations" : "Run Full Analysis"}</>
            )}
          </button>
        )}

        {wallet && result && (
          <button
            onClick={() => { setResult(null); runAnalysis(); }}
            className="w-full text-sm text-[#64748b] hover:text-[#111] transition-colors py-1"
          >
            Re-run analysis ↺
          </button>
        )}
      </div>

      {/* Free-tier lock overlay — only over the AI section, gap bars still visible */}
      {!isPro && wallet && (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/95 to-transparent flex flex-col items-center justify-end pb-5 gap-2">
          <p className="text-xs text-[#64748b]">AI recommendations require Pro</p>
          <a href="/pricing?source=ai_recommendations" className="bg-[#1a56a0] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#1547a0] transition-colors">
            ✦ Upgrade to Pro — $6/month
          </a>
        </div>
      )}
    </div>
  );
}

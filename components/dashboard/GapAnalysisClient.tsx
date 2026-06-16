"use client";

import { useState } from "react";
import type { GapAnalysis } from "@/app/api/ai/gap-analysis/route";

type InitialData = {
  profession: string;
  specialty: string | null;
  country: string;
  requiredCredits: number;
  completedCredits: number;
  cycleEndDate: string | null;
  categoryBreakdown: { category: string; earned: number; cap: number | null; minimum: number }[];
} | null;

const STATUS_CONFIG = {
  complete:  { label: "Complete",  bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200"  },
  on_track:  { label: "On Track",  bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"   },
  at_risk:   { label: "At Risk",   bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200"  },
  critical:  { label: "Critical",  bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200"    },
};

const PRIORITY_CONFIG = {
  high:   { dot: "bg-red-500",   label: "High"   },
  medium: { dot: "bg-amber-500", label: "Medium" },
  low:    { dot: "bg-green-500", label: "Low"    },
};

export default function GapAnalysisClient({
  initialData,
  cachedResult,
  cachedAt,
}: {
  initialData: InitialData;
  cachedResult?: GapAnalysis | null;
  cachedAt?: string | null;
}) {
  const [result, setResult] = useState<GapAnalysis | null>(cachedResult ?? null);
  const [isCached, setIsCached] = useState<boolean>(!!cachedResult);
  const [cachedAtState, setCachedAtState] = useState<string | null>(cachedAt ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis(forceRefresh = false) {
    if (!initialData) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/gap-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...initialData, forceRefresh }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? `Error ${res.status}`);
      }

      const data = await res.json() as GapAnalysis & { cached?: boolean; cached_at?: string };
      setResult(data);
      setIsCached(data.cached === true);
      setCachedAtState(data.cached_at ?? new Date().toISOString());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!initialData) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-sm text-amber-800">
        No CME wallet found. Please set up your wallet first to run a gap analysis.
      </div>
    );
  }

  const { profession, specialty, country, requiredCredits, completedCredits, cycleEndDate } = initialData;
  const pct = requiredCredits > 0 ? Math.min(100, Math.round((completedCredits / requiredCredits) * 100)) : 0;

  const cachedLabel = cachedAtState
    ? new Date(cachedAtState).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="space-y-6">
      {/* Profile summary card */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#111]">
              {profession}{specialty ? ` — ${specialty}` : ""}
            </p>
            <p className="text-xs text-[#64748b] mt-0.5">{country}</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 max-w-xs bg-[#f0f4f8] rounded-full h-2">
                <div
                  className="bg-[#1a56a0] h-2 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-medium text-[#64748b]">
                {completedCredits}/{requiredCredits} credits ({pct}%)
              </span>
            </div>
            {cycleEndDate && (
              <p className="text-xs text-[#64748b] mt-1">
                Renewal deadline: {new Date(cycleEndDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={() => runAnalysis(!!result)}
              disabled={loading}
              className="shrink-0 bg-[#1a56a0] text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60 hover:bg-[#1547a0] transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analysing…
                </span>
              ) : result ? "Refresh Analysis" : "Run AI Gap Analysis"}
            </button>
            {isCached && cachedLabel && !loading && (
              <span className="text-xs text-[#64748b]">Cached · {cachedLabel}</span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-8 text-center">
          <svg className="animate-spin h-8 w-8 mx-auto text-[#1a56a0] mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-[#64748b]">Analysing your CME compliance profile…</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-5">
          {/* Overall status */}
          {(() => {
            const cfg = STATUS_CONFIG[result.overall_status];
            return (
              <div className={`${cfg.bg} border ${cfg.border} rounded-xl p-5`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className={`text-sm ${cfg.text}`}>{result.summary}</p>
              </div>
            );
          })()}

          {/* Priority actions */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <h2 className="text-sm font-bold text-[#111] mb-3">Priority Actions</h2>
            <ol className="space-y-2">
              {result.priority_actions.map((action, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#374151]">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#1a56a0] text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Category gaps */}
          {result.category_gaps.length > 0 && (
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
              <h2 className="text-sm font-bold text-[#111] mb-3">Category Gaps</h2>
              <div className="space-y-3">
                {result.category_gaps.map((gap) => {
                  const pcfg = PRIORITY_CONFIG[gap.priority];
                  return (
                    <div key={gap.category} className="border border-[#e2e8f0] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[#111]">{gap.category}</span>
                        <span className="flex items-center gap-1 text-xs text-[#64748b]">
                          <span className={`inline-block w-2 h-2 rounded-full ${pcfg.dot}`} />
                          {pcfg.label} priority
                        </span>
                      </div>
                      <p className="text-xs text-[#64748b] mb-2">
                        {gap.earned} earned / {gap.minimum} required — {gap.shortfall} credit{gap.shortfall !== 1 ? "s" : ""} short
                      </p>
                      <p className="text-xs text-[#374151]">{gap.recommendation}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Suggested activity types */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <h2 className="text-sm font-bold text-[#111] mb-3">Recommended Activity Types</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {result.suggested_activity_types.map((act, i) => (
                <div key={i} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-[#1a56a0]">{act.type}</span>
                    <span className="text-xs text-[#64748b]">~{act.estimated_credits} credits</span>
                  </div>
                  <p className="text-xs text-[#374151]">{act.rationale}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline advice */}
          {result.timeline_advice && (
            <div className="bg-[#f0f4f8] border border-[#e2e8f0] rounded-xl p-5">
              <h2 className="text-sm font-bold text-[#111] mb-2">Timeline Advice</h2>
              <p className="text-sm text-[#374151]">{result.timeline_advice}</p>
            </div>
          )}

          {/* Authority-specific tip */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
            <h2 className="text-sm font-bold text-[#111] mb-2">{country} Authority Tip</h2>
            <p className="text-sm text-[#374151]">{result.authority_specific_tip}</p>
          </div>

          <p className="text-xs text-[#64748b] text-center pt-2">
            AI analysis is for guidance only. Always verify requirements with your licensing authority.
          </p>
        </div>
      )}
    </div>
  );
}

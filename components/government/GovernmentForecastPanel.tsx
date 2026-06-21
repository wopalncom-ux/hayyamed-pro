"use client";

import { useState } from "react";

interface ForecastData {
  headline: string;
  risk_level: "low" | "medium" | "high" | "critical";
  projected_compliance_rate: number;
  professionals_at_risk: number;
  key_insights: string[];
  recommended_actions: string[];
  confidence: "low" | "medium" | "high";
}

export default function GovernmentForecastPanel({ organizationId }: { organizationId: string }) {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/government-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json.forecast);
      setGenerated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate forecast");
    } finally {
      setLoading(false);
    }
  }

  const riskColors: Record<string, string> = {
    low:      "bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]",
    medium:   "bg-[#fff7ed] text-[#d97706] border-[#fed7aa]",
    high:     "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]",
    critical: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]",
  };

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
      <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#111]">AI Compliance Forecast</h2>
            <span className="text-xs bg-[#e8f0fe] text-[#1a56a0] px-2 py-0.5 rounded-full font-medium">AI</span>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5">
            Projected 90-day compliance outlook · Powered by Claude Haiku
          </p>
        </div>
        {!generated && (
          <button
            onClick={generate}
            disabled={loading}
            className="text-sm px-4 py-2 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating…
              </>
            ) : (
              "Generate Forecast"
            )}
          </button>
        )}
        {generated && (
          <button
            onClick={generate}
            disabled={loading}
            className="text-xs px-3 py-1.5 border border-[#e2e8f0] text-[#64748b] rounded-lg hover:bg-[#f8fafc] disabled:opacity-50 transition-colors"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        )}
      </div>

      {error && (
        <div className="mx-6 mt-4 px-4 py-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-sm text-[#dc2626]">
          {error}
        </div>
      )}

      {!generated && !loading && !error && (
        <div className="px-6 py-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#e8f0fe] flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
          </div>
          <p className="text-sm text-[#374151] font-medium mb-1">90-Day Compliance Forecast</p>
          <p className="text-xs text-[#64748b]">
            AI analysis of current compliance trends, at-risk professionals, and projected outcomes
          </p>
        </div>
      )}

      {loading && !data && (
        <div className="px-6 py-10 text-center">
          <div className="w-8 h-8 border-2 border-[#1a56a0] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#64748b]">Analysing compliance data…</p>
        </div>
      )}

      {data && (
        <div className="px-6 py-5 space-y-5">
          {/* Headline */}
          <div className={`px-4 py-3 rounded-lg border text-sm font-medium ${riskColors[data.risk_level]}`}>
            {data.headline}
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <MetricCard
              label="Projected Compliance"
              value={`${data.projected_compliance_rate}%`}
              color={data.projected_compliance_rate >= 80 ? "green" : data.projected_compliance_rate >= 60 ? "orange" : "red"}
            />
            <MetricCard
              label="Professionals at Risk"
              value={data.professionals_at_risk.toString()}
              color={data.professionals_at_risk === 0 ? "green" : data.professionals_at_risk < 5 ? "orange" : "red"}
            />
            <MetricCard
              label="Forecast Confidence"
              value={data.confidence.charAt(0).toUpperCase() + data.confidence.slice(1)}
              color={data.confidence === "high" ? "green" : data.confidence === "medium" ? "orange" : "red"}
            />
          </div>

          {/* Insights */}
          {data.key_insights.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-2">Key Insights</p>
              <ul className="space-y-1.5">
                {data.key_insights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                    <span className="text-[#1a56a0] mt-0.5 flex-shrink-0">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {data.recommended_actions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-2">Recommended Actions</p>
              <ol className="space-y-1.5 list-decimal list-inside">
                {data.recommended_actions.map((action, i) => (
                  <li key={i} className="text-sm text-[#374151]">{action}</li>
                ))}
              </ol>
            </div>
          )}

          <p className="text-xs text-[#64748b] border-t border-[#e2e8f0] pt-3">
            This forecast is AI-generated based on current data trends. Verify requirements with your regulatory authority before making compliance decisions.
          </p>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: "green" | "orange" | "red" }) {
  const colors = { green: "text-[#16a34a]", orange: "text-[#d97706]", red: "text-[#dc2626]" };
  return (
    <div className="bg-[#f8fafc] rounded-lg p-3 text-center">
      <p className={`text-lg font-bold ${colors[color]}`}>{value}</p>
      <p className="text-xs text-[#64748b] mt-0.5">{label}</p>
    </div>
  );
}

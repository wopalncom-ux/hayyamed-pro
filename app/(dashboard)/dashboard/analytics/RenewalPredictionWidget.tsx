"use client";

import { useState } from "react";

interface WalletInfo {
  country: string;
  profession: string;
  specialty: string | null;
  required_credits: number;
  completed_credits: number;
  avg_per_month: number;
  days_left: number | null;
  cycle_end_date: string | null;
}

interface Prediction {
  risk_level: "on_track" | "at_risk" | "critical";
  credits_shortfall: number;
  projected_completion_date: string | null;
  required_monthly_pace: number;
  insights: string[];
  recommendation: string;
  wallet: WalletInfo;
  _fallback?: boolean;
}

const RISK_CONFIG = {
  on_track: {
    label: "On Track",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "✓",
  },
  at_risk: {
    label: "At Risk",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "⚠",
  },
  critical: {
    label: "Critical",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "✕",
  },
};

export default function RenewalPredictionWidget({
  walletId,
  isPro,
}: {
  walletId: string;
  isPro: boolean;
}) {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getForecast() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/renewal-prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletId }),
      });
      if (res.status === 429) {
        const retryAfter = res.headers.get("Retry-After");
        setError(`Rate limit reached. Try again in ${retryAfter ? `${Math.ceil(parseInt(retryAfter) / 60)} minutes` : "an hour"}.`);
        return;
      }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError((d as { error?: string }).error ?? "Unable to generate forecast.");
        return;
      }
      const data = (await res.json()) as Prediction;
      setPrediction(data);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isPro) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#111] mb-1">AI Renewal Forecast</h2>
            <p className="text-sm text-[#64748b]">
              Get an AI-powered prediction of your renewal risk, pace analysis, and recommended actions.
            </p>
          </div>
          <a
            href="/pricing"
            className="shrink-0 ml-6 px-4 py-2 rounded-lg bg-[#1a56a0] text-white text-sm font-medium hover:bg-[#1547a0] transition-colors"
          >
            Upgrade to Pro
          </a>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#111] mb-1">AI Renewal Forecast</h2>
            <p className="text-sm text-[#64748b]">
              Claude analyzes your pace, patterns, and deadline to predict renewal risk.
            </p>
          </div>
          <button
            onClick={getForecast}
            disabled={loading}
            className="shrink-0 ml-6 px-4 py-2 rounded-lg bg-[#1a56a0] text-white text-sm font-medium hover:bg-[#1547a0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing…
              </>
            ) : (
              "Get AI Forecast"
            )}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </div>
    );
  }

  const cfg = RISK_CONFIG[prediction.risk_level];

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-[#111]">AI Renewal Forecast</h2>
        <button
          onClick={() => setPrediction(null)}
          className="text-xs text-[#64748b] hover:text-[#111] underline"
        >
          Refresh
        </button>
      </div>

      {/* Risk level banner */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border mb-5 ${cfg.bg} ${cfg.border}`}>
        <span className={`text-2xl font-bold ${cfg.color}`}>{cfg.icon}</span>
        <div>
          <p className={`text-base font-bold ${cfg.color}`}>{cfg.label}</p>
          <p className="text-sm text-[#374151]">{prediction.recommendation}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <MiniStat
          label="Required pace"
          value={`${prediction.required_monthly_pace.toFixed(1)}/mo`}
          sub="credits per month"
        />
        <MiniStat
          label="Current pace"
          value={`${prediction.wallet.avg_per_month.toFixed(1)}/mo`}
          sub="credits per month"
          highlight={prediction.wallet.avg_per_month >= prediction.required_monthly_pace ? "green" : "red"}
        />
        <MiniStat
          label="Credits shortfall"
          value={prediction.credits_shortfall > 0 ? `${Math.ceil(prediction.credits_shortfall)}` : "None"}
          sub="at current pace"
          highlight={prediction.credits_shortfall > 0 ? "red" : "green"}
        />
        <MiniStat
          label="Projected finish"
          value={
            prediction.projected_completion_date
              ? new Date(prediction.projected_completion_date).toLocaleDateString("en", { month: "short", day: "numeric" })
              : "Insufficient data"
          }
          sub={prediction.wallet.cycle_end_date ? `by ${prediction.wallet.cycle_end_date}` : "no deadline set"}
        />
      </div>

      {/* Insights */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2">AI Insights</p>
        {prediction.insights.map((insight, i) => (
          <div key={i} className="flex gap-2.5 text-sm text-[#374151]">
            <span className="text-[#1a56a0] mt-0.5 shrink-0">→</span>
            <span>{insight}</span>
          </div>
        ))}
      </div>

      {prediction._fallback && (
        <p className="mt-4 text-xs text-[#94a3b8]">
          Forecast generated from rule-based analysis (AI unavailable).
        </p>
      )}

      <p className="mt-4 text-xs text-[#94a3b8]">
        Powered by Claude · Based on verified activities only · 5 forecasts/hour
      </p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: "green" | "red";
}) {
  const valueClass = highlight === "green"
    ? "text-green-600"
    : highlight === "red"
    ? "text-red-600"
    : "text-[#111]";

  return (
    <div className="bg-[#f8fafc] rounded-lg p-3 border border-[#e2e8f0]">
      <p className="text-xs text-[#64748b] mb-0.5">{label}</p>
      <p className={`text-base font-bold ${valueClass}`}>{value}</p>
      <p className="text-xs text-[#94a3b8]">{sub}</p>
    </div>
  );
}

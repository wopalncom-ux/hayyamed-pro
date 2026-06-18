"use client";

import { useState } from "react";
import type { LearningPathway } from "@/app/api/ai/learning-pathway/route";

const ACTIVITY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  online:     { bg: "#e8f0fe", text: "#1a56a0", label: "Online" },
  conference: { bg: "#f0fdf4", text: "#16a34a", label: "Conference" },
  journal:    { bg: "#fef9c3", text: "#a16207", label: "Journal" },
  workshop:   { bg: "#fef3c7", text: "#d97706", label: "Workshop" },
  simulation: { bg: "#fce7f3", text: "#be185d", label: "Simulation" },
  teaching:   { bg: "#f3e8ff", text: "#7c3aed", label: "Teaching" },
};

type Props = {
  pathway: LearningPathway;
  profession: string;
  country: string;
  onRegenerate: () => void;
  loading: boolean;
};

export default function LearningPathwayResult({ pathway, profession, country, onRegenerate, loading }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const totalPlanned = pathway.months.reduce((s, m) => s + m.target_credits, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1a56a0] to-[#0f3d7a] rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">✦ AI Generated</span>
              <span className="text-xs text-white/70">{profession} · {country}</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Your 12-Month CPD Pathway</h2>
            <p className="text-sm text-white/80 leading-relaxed max-w-2xl">{pathway.plan_summary}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-bold">{totalPlanned}</div>
            <div className="text-xs text-white/70 mt-0.5">credits planned</div>
          </div>
        </div>
      </div>

      {/* Monthly grid */}
      <div>
        <h3 className="text-sm font-semibold text-[#374151] mb-3">Monthly Plan</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {pathway.months.map((m) => {
            const color = ACTIVITY_COLORS[m.activity_type] ?? ACTIVITY_COLORS.online;
            const isExpanded = expanded === m.month;
            return (
              <button
                key={m.month}
                onClick={() => setExpanded(isExpanded ? null : m.month)}
                className="text-left bg-white rounded-xl border border-[#e2e8f0] p-4 hover:border-[#1a56a0] hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#64748b]">{m.month_name.slice(0, 3).toUpperCase()}</span>
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded"
                    style={{ background: color.bg, color: color.text }}
                  >
                    {color.label}
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#1a56a0] mb-1">{m.target_credits}</div>
                <div className="text-[11px] text-[#374151] font-medium leading-tight">{m.focus_area}</div>
                {isExpanded && (
                  <p className="mt-2 text-[11px] text-[#64748b] leading-snug border-t border-[#f1f5f9] pt-2">
                    {m.rationale}
                  </p>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-[#64748b] mt-2">Tap any month to see the rationale.</p>
      </div>

      {/* Key topics */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
        <h3 className="text-sm font-semibold text-[#374151] mb-3">Recommended Focus Topics</h3>
        <div className="flex flex-wrap gap-2">
          {pathway.key_topics.map((topic) => (
            <span key={topic} className="text-xs bg-[#f1f5f9] text-[#374151] px-3 py-1.5 rounded-full font-medium">
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Tips */}
      {(pathway.conference_tip || pathway.online_platform_tip) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pathway.conference_tip && (
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">🗓️</span>
                <span className="text-xs font-semibold text-[#16a34a] uppercase tracking-wide">Conference Pick</span>
              </div>
              <p className="text-sm text-[#15803d]">{pathway.conference_tip}</p>
            </div>
          )}
          {pathway.online_platform_tip && (
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">💻</span>
                <span className="text-xs font-semibold text-[#1a56a0] uppercase tracking-wide">Online Platform</span>
              </div>
              <p className="text-sm text-[#1e40af]">{pathway.online_platform_tip}</p>
            </div>
          )}
        </div>
      )}

      {/* Regenerate */}
      <div className="flex justify-end">
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-[#64748b] border border-[#e2e8f0] bg-white px-4 py-2 rounded-lg hover:border-[#1a56a0] hover:text-[#1a56a0] disabled:opacity-50 transition-colors"
        >
          <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          {loading ? "Generating…" : "Regenerate plan"}
        </button>
      </div>

      <p className="text-xs text-[#64748b] text-center">
        AI-generated plan is a guide only — verify credit requirements with your licensing authority.
      </p>
    </div>
  );
}

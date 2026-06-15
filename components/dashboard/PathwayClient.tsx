"use client";

import { useState, useTransition } from "react";

type PathwayInput = {
  profession: string;
  specialty: string | null;
  country: string;
  requiredCredits: number;
  completedCredits: number;
  cycleEndDate: string | null;
  gaps: { category: string; earned: number; needed: number }[];
};

type PathwayMonth = {
  month: number;
  month_name: string;
  target_credits: number;
  focus_area: string;
  activity_type: "online" | "conference" | "journal" | "workshop" | "simulation" | "teaching";
  rationale: string;
};

type Pathway = {
  plan_summary: string;
  yearly_target_credits: number;
  months: PathwayMonth[];
  key_topics: string[];
  conference_tip: string | null;
  online_platform_tip: string | null;
};

const ACTIVITY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  online:      { bg: "bg-[#dbeafe]", text: "text-[#1d4ed8]", icon: "💻" },
  conference:  { bg: "bg-[#dcfce7]", text: "text-[#15803d]", icon: "🏛️" },
  journal:     { bg: "bg-[#fef9c3]", text: "text-[#a16207]", icon: "📖" },
  workshop:    { bg: "bg-[#f3e8ff]", text: "text-[#7e22ce]", icon: "🔬" },
  simulation:  { bg: "bg-[#fee2e2]", text: "text-[#b91c1c]", icon: "🎯" },
  teaching:    { bg: "bg-[#f0f7ff]", text: "text-[#1a56a0]", icon: "🎓" },
};

function MonthCard({ month, index }: { month: PathwayMonth; index: number }) {
  const [expanded, setExpanded] = useState(index < 3);
  const style = ACTIVITY_COLORS[month.activity_type] ?? ACTIVITY_COLORS["online"];
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-[#f8fafc] transition-colors"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${style.bg}`}>
          {style.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[#0f1f3d]">{month.month_name}</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
              {month.activity_type}
            </span>
          </div>
          <p className="text-xs text-[#64748b] mt-0.5 truncate">{month.focus_area}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-[#1a56a0]">{month.target_credits}</p>
          <p className="text-[10px] text-[#94a3b8]">credits</p>
        </div>
        <span className="text-[#94a3b8] text-sm ml-1">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-[#f1f5f9]">
          <p className="text-xs text-[#64748b] mt-3">{month.rationale}</p>
        </div>
      )}
    </div>
  );
}

export default function PathwayClient({ initialData }: { initialData: PathwayInput | null }) {
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, startGenerate] = useTransition();
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);

  const handleGenerate = () => {
    if (!initialData) return;
    setError(null);
    startGenerate(async () => {
      try {
        const res = await fetch("/api/ai/learning-pathway", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(initialData),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setError(d.error ?? "Failed to generate pathway. Try again in a moment.");
          return;
        }
        const data: Pathway = await res.json();
        setPathway(data);
        setGeneratedAt(new Date());
      } catch {
        setError("Network error. Please check your connection.");
      }
    });
  };

  if (!initialData) {
    return (
      <div className="bg-[#f8fafc] border border-dashed border-[#e2e8f0] rounded-xl px-6 py-12 text-center">
        <p className="text-sm font-medium text-[#374151] mb-1">No CME wallet found</p>
        <p className="text-xs text-[#94a3b8]">
          Complete onboarding to set up your CME wallet before generating a learning pathway.
        </p>
        <a href="/onboarding/1" className="mt-4 inline-block text-xs font-semibold text-[#1a56a0] hover:underline">
          Complete onboarding →
        </a>
      </div>
    );
  }

  const gap = Math.max(0, initialData.requiredCredits - initialData.completedCredits);
  const pct = initialData.requiredCredits > 0
    ? Math.round((initialData.completedCredits / initialData.requiredCredits) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Status card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-[#374151] mb-3">Your current status</h2>
            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <p className="text-2xl font-bold text-[#0f1f3d]">{initialData.completedCredits}/{initialData.requiredCredits}</p>
                <p className="text-xs text-[#94a3b8]">credits ({pct}%)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#dc2626]">{gap}</p>
                <p className="text-xs text-[#94a3b8]">credits gap</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#374151] capitalize">{initialData.profession.replace(/_/g, " ")}</p>
                <p className="text-xs text-[#94a3b8]">{initialData.country}{initialData.specialty ? ` · ${initialData.specialty}` : ""}</p>
              </div>
              {initialData.cycleEndDate && (
                <div>
                  <p className="text-sm font-semibold text-[#374151]">
                    {new Date(initialData.cycleEndDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                  <p className="text-xs text-[#94a3b8]">cycle deadline</p>
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            disabled={generating}
            onClick={handleGenerate}
            className="flex-shrink-0 bg-[#1a56a0] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1547a0] disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {generating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating…
              </>
            ) : pathway ? (
              "↺ Regenerate"
            ) : (
              "✨ Generate my pathway"
            )}
          </button>
        </div>

        {initialData.gaps.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#f1f5f9]">
            <p className="text-xs font-semibold text-[#374151] mb-2">Category gaps detected:</p>
            <div className="flex flex-wrap gap-2">
              {initialData.gaps.map((g) => (
                <span key={g.category} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#dc2626]">
                  {g.category.replace(/_/g, " ")}: {g.needed} credits needed
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-3 text-sm text-[#dc2626]">
          {error}
        </div>
      )}

      {generating && !pathway && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-12 text-center">
          <div className="w-8 h-8 border-3 border-[#1a56a0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-[#374151]">Generating your 12-month pathway…</p>
          <p className="text-xs text-[#94a3b8] mt-1">This takes 5–15 seconds</p>
        </div>
      )}

      {pathway && (
        <>
          {/* Summary */}
          <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-sm font-semibold text-[#1e40af]">Plan Summary</p>
              {generatedAt && (
                <p className="text-[10px] text-[#94a3b8] flex-shrink-0">
                  Generated {generatedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>
            <p className="text-sm text-[#1e40af] leading-relaxed">{pathway.plan_summary}</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-[#1a56a0]">{pathway.yearly_target_credits}</p>
                <p className="text-[10px] text-[#64748b]">credits planned</p>
              </div>
              <div className="w-px h-8 bg-[#bfdbfe]" />
              <div className="text-center">
                <p className="text-xl font-bold text-[#1a56a0]">
                  {Math.round(pathway.yearly_target_credits / 12 * 10) / 10}
                </p>
                <p className="text-[10px] text-[#64748b]">avg / month</p>
              </div>
            </div>
          </div>

          {/* Key topics */}
          {pathway.key_topics.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
              <p className="text-sm font-semibold text-[#374151] mb-3">Focus Topics</p>
              <div className="flex flex-wrap gap-2">
                {pathway.key_topics.map((t) => (
                  <span key={t} className="text-xs font-medium px-3 py-1 rounded-full bg-[#f0f7ff] text-[#1a56a0] border border-[#bfdbfe]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Month-by-month timeline */}
          <div>
            <p className="text-sm font-semibold text-[#374151] mb-3">12-Month Plan <span className="text-[#94a3b8] font-normal">(click to expand)</span></p>
            <div className="space-y-2">
              {pathway.months.map((m, i) => (
                <MonthCard key={m.month} month={m} index={i} />
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pathway.conference_tip && (
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#15803d] mb-1.5">🏛️ Conference Tip</p>
                <p className="text-sm text-[#166534]">{pathway.conference_tip}</p>
              </div>
            )}
            {pathway.online_platform_tip && (
              <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#1e40af] mb-1.5">💻 Online Platform</p>
                <p className="text-sm text-[#1e40af]">{pathway.online_platform_tip}</p>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-[#94a3b8] text-center">
            AI-generated pathway — verify specific requirements with your licensing authority.
            Hayya Med Pro does not issue licenses and does not replace official regulatory guidance.
          </p>
        </>
      )}

      {!pathway && !generating && (
        <div className="bg-[#f8fafc] border border-dashed border-[#e2e8f0] rounded-xl px-6 py-12 text-center">
          <p className="text-4xl mb-3">🗺️</p>
          <p className="text-sm font-medium text-[#374151] mb-1">Your pathway is ready to generate</p>
          <p className="text-xs text-[#94a3b8]">
            Click "Generate my pathway" to create your personalised 12-month CME plan.
          </p>
        </div>
      )}
    </div>
  );
}

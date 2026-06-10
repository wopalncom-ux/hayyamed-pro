"use client";

import { useState } from "react";

interface Gap {
  category: string;
  earned: number;
  needed: number;
}

interface Recommendation {
  title: string;
  category: string;
  credits: number;
  reason: string;
  action_label: string;
  urgency: "high" | "medium" | "low";
}

interface MatchedCourse {
  id: string;
  title: string;
  provider_name: string;
  credits: number;
  is_free: boolean;
}

interface Props {
  profession: string;
  specialty: string | null;
  country: string;
  totalRequired: number;
  totalCompleted: number;
  gaps: Gap[];
  cycleEndDate: string | null;
}

const URGENCY_CONFIG = {
  high:   { label: "High priority", classes: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]" },
  medium: { label: "Medium",        classes: "bg-[#fff7ed] text-[#d97706] border-[#fed7aa]" },
  low:    { label: "Low",           classes: "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]" },
};

const CATEGORY_LABELS: Record<string, string> = {
  conference:     "Conference",
  online:         "Online / E-Learning",
  workshop:       "Workshop",
  journal:        "Journal / Self-Assessment",
  teaching:       "Teaching",
  simulation:     "Simulation",
  mandatory:      "Mandatory",
  patient_safety: "Patient Safety",
  other:          "Other",
};

export default function AIRecommendationsCard(props: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [summary, setSummary] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [courses, setCourses] = useState<Record<string, MatchedCourse[]>>({});

  const hasGaps = props.gaps.length > 0;

  async function analyze() {
    setState("loading");
    try {
      const res = await fetch("/api/ai/compliance-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setSummary(data.summary ?? "");
      setRecommendations(data.recommendations ?? []);
      setCourses(data.courses ?? {});
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (!hasGaps) return null;

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">✨</span>
          <h2 className="text-base font-semibold text-[#111]">AI Compliance Advisor</h2>
        </div>
        {state === "idle" && (
          <span className="text-xs text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded-full">
            {props.gaps.length} gap{props.gaps.length > 1 ? "s" : ""} detected
          </span>
        )}
        {state === "done" && (
          <button
            onClick={() => setState("idle")}
            className="text-xs text-[#64748b] hover:text-[#1a56a0]"
          >
            Reset
          </button>
        )}
      </div>

      <div className="px-6 py-5">
        {state === "idle" && (
          <div className="text-center py-4">
            <p className="text-sm text-[#374151] mb-1">
              You have {props.gaps.reduce((s, g) => s + g.needed, 0)} credits missing across{" "}
              {props.gaps.length} categor{props.gaps.length > 1 ? "ies" : "y"}.
            </p>
            <p className="text-xs text-[#64748b] mb-4">
              Get personalized recommendations tailored to your profession and gaps.
            </p>
            <button
              onClick={analyze}
              className="bg-[#1a56a0] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#1547a0] transition-colors"
            >
              Analyze my gaps
            </button>
          </div>
        )}

        {state === "loading" && (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-2 border-[#1a56a0] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#64748b]">Analyzing your compliance profile…</p>
          </div>
        )}

        {state === "error" && (
          <div className="text-center py-4">
            <p className="text-sm text-[#dc2626] mb-2">Could not reach AI advisor. Please try again.</p>
            <button
              onClick={analyze}
              className="text-sm text-[#1a56a0] hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {state === "done" && (
          <div>
            {summary && (
              <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-lg px-4 py-3 mb-5">
                <p className="text-sm text-[#1e3a8a] font-medium">{summary}</p>
              </div>
            )}

            <div className="space-y-4">
              {recommendations.map((rec, i) => {
                const urgency = URGENCY_CONFIG[rec.urgency] ?? URGENCY_CONFIG.medium;
                const matchedCourses = courses[rec.category] ?? [];

                return (
                  <div
                    key={i}
                    className={`border rounded-xl p-4 ${
                      rec.urgency === "high"
                        ? "border-[#fecaca] bg-[#fff8f8]"
                        : rec.urgency === "medium"
                        ? "border-[#fed7aa] bg-[#fffbf5]"
                        : "border-[#e2e8f0] bg-[#f8fafc]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#111]">{rec.title}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${urgency.classes}`}>
                          {urgency.label}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-[#1a56a0] shrink-0">
                        ~{rec.credits} credits
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-[10px] bg-[#e2e8f0] text-[#374151] rounded px-1.5 py-0.5">
                        {CATEGORY_LABELS[rec.category] ?? rec.category}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748b] mb-3">{rec.reason}</p>

                    {/* Matching marketplace courses */}
                    {matchedCourses.length > 0 && (
                      <div className="mb-3 space-y-1.5">
                        {matchedCourses.map((c) => (
                          <a
                            key={c.id}
                            href={`/dashboard/marketplace/${c.id}`}
                            className="flex items-center justify-between bg-white border border-[#e2e8f0] rounded-lg px-3 py-2 hover:border-[#1a56a0] transition-colors group"
                          >
                            <div>
                              <p className="text-xs font-medium text-[#111] group-hover:text-[#1a56a0]">{c.title}</p>
                              <p className="text-[10px] text-[#94a3b8]">{c.provider_name}</p>
                            </div>
                            <div className="text-right shrink-0 ml-3">
                              <p className="text-xs font-semibold text-[#1a56a0]">{c.credits} cr</p>
                              <p className="text-[10px] text-[#94a3b8]">{c.is_free ? "Free" : "Paid"}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}

                    <a
                      href={`/dashboard/marketplace?category=${rec.category}`}
                      className="text-xs font-medium text-[#1a56a0] hover:underline"
                    >
                      {rec.action_label} →
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

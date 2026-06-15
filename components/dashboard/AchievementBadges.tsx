"use client";

import { useState, useEffect } from "react";
import { BADGE_DEFINITIONS, BADGE_MAP } from "@/lib/badges";

interface Achievement {
  badge_key: string;
  awarded_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function AchievementBadges() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/achievements")
      .then((r) => r.json())
      .then((data: { achievements: Achievement[] }) => setAchievements(data.achievements ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const earnedKeys = new Set(achievements.map((a) => a.badge_key));
  const awardedMap = Object.fromEntries(achievements.map((a) => [a.badge_key, a.awarded_at]));
  const earnedCount = earnedKeys.size;
  const totalCount = BADGE_DEFINITIONS.length;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 animate-pulse">
        <div className="h-4 bg-[#e2e8f0] rounded w-40 mb-3" />
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-14 bg-[#f1f5f9] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0]">
      <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#111]">Achievements</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            {earnedCount}/{totalCount} earned — keep logging to unlock more
          </p>
        </div>
        {earnedCount > 0 && (
          <div className="text-right">
            <p className="text-lg font-bold text-[#1a56a0]">{Math.round((earnedCount / totalCount) * 100)}%</p>
            <p className="text-xs text-[#64748b]">complete</p>
          </div>
        )}
      </div>

      <div className="p-4 grid grid-cols-5 sm:grid-cols-10 gap-2">
        {BADGE_DEFINITIONS.map((badge) => {
          const earned = earnedKeys.has(badge.key);
          const awardDate = awardedMap[badge.key];
          return (
            <div
              key={badge.key}
              title={earned ? `${badge.title}: ${badge.description}\nEarned ${formatDate(awardDate)}` : `${badge.title}: ${badge.description}\n(Not yet earned)`}
              className={`group relative flex flex-col items-center justify-center h-14 rounded-xl border transition-all cursor-default ${
                earned
                  ? `${badge.color} shadow-sm`
                  : "bg-[#f8fafc] border-[#e2e8f0] opacity-40 grayscale"
              }`}
            >
              <span className="text-xl leading-none">{badge.icon}</span>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 hidden group-hover:block w-40 bg-[#0f1f3d] text-white text-xs rounded-lg px-2.5 py-2 text-center pointer-events-none shadow-lg">
                <p className="font-semibold">{badge.title}</p>
                <p className="text-[#94a3b8] mt-0.5 leading-snug">{badge.description}</p>
                {earned && awardDate && (
                  <p className="text-[#60a5fa] mt-1">{formatDate(awardDate)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {earnedCount === 0 && (
        <p className="px-5 pb-4 text-xs text-[#64748b] text-center">
          Log your first CME activity to earn your first badge.
        </p>
      )}
    </div>
  );
}

export function BadgeSummaryChips({ achievements }: { achievements: Achievement[] }) {
  if (!achievements.length) return null;
  const recent = achievements.slice(-3);
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {recent.map((a) => {
        const def = BADGE_MAP[a.badge_key];
        if (!def) return null;
        return (
          <span
            key={a.badge_key}
            title={def.description}
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${def.color}`}
          >
            {def.icon} {def.title}
          </span>
        );
      })}
    </div>
  );
}

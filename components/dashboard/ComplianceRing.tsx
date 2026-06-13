"use client";

import { useEffect, useState } from "react";

const CIRCUMFERENCE = 2 * Math.PI * 80; // r=80

// Health score: weighted composite 0-100
function computeHealthScore(
  completed: number,
  required: number,
  cycleStart: string | null,
  cycleEnd: string | null,
  licenseExpiryDays: number | null,
): number {
  if (required === 0) return 100;

  // Completion (0–50)
  const completionScore = Math.min(completed / required, 1) * 50;

  // Pace (0–30): how well actual progress matches elapsed-time expectation
  let paceScore = 15;
  if (cycleStart && cycleEnd) {
    const start = new Date(cycleStart).getTime();
    const end = new Date(cycleEnd).getTime();
    const now = Date.now();
    const total = end - start;
    const elapsed = Math.max(0, now - start);
    if (total > 0 && elapsed > 0) {
      const expectedFrac = elapsed / total;
      const actualFrac = completed / required;
      paceScore = Math.min((actualFrac / expectedFrac) * 30, 30);
    }
  }

  // License (0–20)
  let licScore = 10;
  if (licenseExpiryDays !== null) {
    if (licenseExpiryDays > 365) licScore = 20;
    else if (licenseExpiryDays > 90) licScore = 15;
    else if (licenseExpiryDays > 30) licScore = 8;
    else if (licenseExpiryDays > 0) licScore = 3;
    else licScore = 0;
  }

  return Math.round(Math.min(completionScore + paceScore + licScore, 100));
}

function getGrade(score: number) {
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  if (score >= 35) return "D";
  return "F";
}

function getRingColor(score: number) {
  if (score >= 80) return "#16a34a";
  if (score >= 50) return "#d97706";
  return "#dc2626";
}

function getPaceText(
  completed: number,
  required: number,
  cycleStart: string | null,
  cycleEnd: string | null,
): { text: string; good: boolean } {
  if (!cycleStart || !cycleEnd) return { text: "Set cycle dates in Settings for pace tracking.", good: false };
  if (completed >= required) return { text: "Fully compliant — all required credits complete.", good: true };

  const start = new Date(cycleStart).getTime();
  const end = new Date(cycleEnd).getTime();
  const now = Date.now();

  if (now < start) return { text: "Cycle has not started yet.", good: true };

  const daysElapsed = Math.max(1, Math.floor((now - start) / 86400000));
  const daysLeft = Math.max(0, Math.floor((end - now) / 86400000));
  const remaining = required - completed;

  if (completed === 0) {
    return { text: `No activities yet. ${daysLeft} days left in cycle — start logging to track pace.`, good: false };
  }

  const creditsPerDay = completed / daysElapsed;
  const daysNeeded = remaining / creditsPerDay;
  const projectedMs = now + daysNeeded * 86400000;

  if (projectedMs < end) {
    const months = Math.ceil(daysNeeded / 30);
    return { text: `On track — projected complete in ~${months} month${months !== 1 ? "s" : ""}.`, good: true };
  }

  const creditsPerMonth = Math.ceil((remaining / Math.max(daysLeft, 1)) * 30);
  return {
    text: `Behind pace — log ~${creditsPerMonth} credit${creditsPerMonth !== 1 ? "s" : ""}/month to meet your deadline.`,
    good: false,
  };
}

const GRADE_STYLES: Record<string, string> = {
  A: "text-[#16a34a] bg-[#dcfce7] border-[#bbf7d0]",
  B: "text-[#1a56a0] bg-[#dbeafe] border-[#bfdbfe]",
  C: "text-[#d97706] bg-[#fff7ed] border-[#fed7aa]",
  D: "text-[#ea580c] bg-[#ffedd5] border-[#fdba74]",
  F: "text-[#dc2626] bg-[#fef2f2] border-[#fecaca]",
};

export default function ComplianceRing({
  completed,
  required,
  cycleStartDate,
  cycleEndDate,
  licenseExpiryDays,
}: {
  completed: number;
  required: number;
  cycleStartDate: string | null;
  cycleEndDate: string | null;
  licenseExpiryDays: number | null;
}) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  const score = computeHealthScore(completed, required, cycleStartDate, cycleEndDate, licenseExpiryDays);
  const grade = getGrade(score);
  const ringColor = getRingColor(score);
  const pct = required > 0 ? Math.min((completed / required) * 100, 100) : 0;
  const dashOffset = animated ? CIRCUMFERENCE * (1 - pct / 100) : CIRCUMFERENCE;
  const { text: paceText, good: paceGood } = getPaceText(completed, required, cycleStartDate, cycleEndDate);

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-[#111]">Compliance Health</h2>
          <p className="text-xs text-[#64748b] mt-0.5">Score updates as you log activities</p>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-lg border ${GRADE_STYLES[grade]}`}>
          Grade {grade}
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Animated SVG donut ring */}
        <div className="relative flex-shrink-0 w-[130px] h-[130px]">
          <svg width="130" height="130" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#e2e8f0" strokeWidth="18" />
            <circle
              cx="100" cy="100" r="80"
              fill="none"
              stroke={ringColor}
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 100 100)"
              style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.4s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-[#111] leading-none">{score}</span>
            <span className="text-[9px] font-semibold text-[#64748b] uppercase tracking-widest mt-0.5">score</span>
          </div>
        </div>

        {/* Stats column */}
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <div className="flex items-baseline gap-1.5 mb-1.5">
              <span className="text-2xl font-bold text-[#1a56a0]">{completed}</span>
              <span className="text-sm text-[#64748b]">/ {required} credits</span>
            </div>
            <div className="w-full bg-[#e2e8f0] rounded-full h-1.5 overflow-hidden">
              <div
                className="h-1.5 rounded-full transition-all duration-1000"
                style={{ width: animated ? `${pct}%` : "0%", backgroundColor: ringColor }}
              />
            </div>
            <p className="text-xs text-[#64748b] mt-1">{Math.round(pct)}% of cycle complete</p>
          </div>

          <div className={`rounded-lg px-3 py-2 text-xs leading-relaxed ${
            paceGood ? "bg-[#f0fdf4] text-[#15803d]" : "bg-[#fff7ed] text-[#92400e]"
          }`}>
            {paceGood ? "✓ " : "⚠ "}{paceText}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { track } from "@/lib/analytics";
import { FREE_ACTIVITY_LIMIT } from "@/lib/planLimits";

export default function FreeTierBanner({ activityCount }: { activityCount: number }) {
  const remaining = Math.max(0, FREE_ACTIVITY_LIMIT - activityCount);
  const pct = Math.min((activityCount / FREE_ACTIVITY_LIMIT) * 100, 100);
  const isAtCap = remaining === 0;
  const isNearCap = remaining <= 3 && remaining > 0;

  return (
    <div className={`rounded-xl border p-5 mb-6 ${
      isAtCap
        ? "bg-[#fef2f2] border-[#fecaca]"
        : isNearCap
        ? "bg-[#fff7ed] border-[#fed7aa]"
        : "bg-[#f0f6ff] border-[#bfdbfe]"
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          {isAtCap ? (
            <>
              <p className="text-sm font-semibold text-[#dc2626] mb-0.5">
                You&apos;ve reached your free activity limit
              </p>
              <p className="text-xs text-[#b91c1c]">
                Upgrade to Pro to log unlimited CME activities, download your compliance PDF, and get license expiry alerts.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-[#1a56a0] mb-0.5">
                {isNearCap
                  ? `Only ${remaining} free ${remaining === 1 ? "activity" : "activities"} remaining`
                  : "You're on the free plan"}
              </p>
              <p className="text-xs text-[#374151]">
                {activityCount} of {FREE_ACTIVITY_LIMIT} free activities used · Upgrade for unlimited tracking, PDF reports, and email alerts.
              </p>
            </>
          )}

          {/* Progress bar */}
          <div className="mt-2.5 w-full bg-white/60 rounded-full h-1.5 max-w-xs">
            <div
              className={`h-1.5 rounded-full transition-all ${
                isAtCap ? "bg-[#dc2626]" : isNearCap ? "bg-[#d97706]" : "bg-[#1a56a0]"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <a
          href="/pricing"
          onClick={() => track("upgrade_clicked", { source: "dashboard_banner" })}
          className={`shrink-0 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
            isAtCap
              ? "bg-[#dc2626] text-white hover:bg-[#b91c1c]"
              : "bg-[#1a56a0] text-white hover:bg-[#1547a0]"
          }`}
        >
          {isAtCap ? "Upgrade now — $49/yr" : "Upgrade to Pro →"}
        </a>
      </div>
    </div>
  );
}

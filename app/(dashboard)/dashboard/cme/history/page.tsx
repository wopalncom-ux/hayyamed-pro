import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserPlan, isPro } from "@/lib/subscription";
import Link from "next/link";

export const metadata = { title: "CME Activity History — Hayya Med Pro" };

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function buildWeekGrid(dates: string[]): {
  weeks: { days: { date: string; count: number }[] }[];
  monthMarkers: { label: string; colIndex: number }[];
} {
  const dateCount: Record<string, number> = {};
  for (const d of dates) {
    dateCount[d] = (dateCount[d] ?? 0) + 1;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Go back 51 full weeks + partial current week so we always show 52 columns
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon ...
  const startOffset = 51 * 7 + dayOfWeek;
  const start = new Date(today);
  start.setDate(start.getDate() - startOffset);
  // Snap to Sunday
  const startSunday = new Date(start);

  const weeks: { days: { date: string; count: number }[] }[] = [];
  const monthMarkers: { label: string; colIndex: number }[] = [];
  let lastMonth = -1;

  for (let w = 0; w < 52; w++) {
    const week: { date: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(startSunday);
      day.setDate(day.getDate() + w * 7 + d);
      const iso = day.toISOString().slice(0, 10);
      const month = day.getMonth();
      if (d === 0 && month !== lastMonth) {
        monthMarkers.push({ label: MONTH_NAMES[month], colIndex: w });
        lastMonth = month;
      }
      week.push({ date: iso, count: day <= today ? (dateCount[iso] ?? 0) : -1 });
    }
    weeks.push({ days: week });
  }

  return { weeks, monthMarkers };
}

function cellColor(count: number): string {
  if (count < 0) return "bg-[#f1f5f9]"; // future
  if (count === 0) return "bg-[#e2e8f0]";
  if (count === 1) return "bg-[#bfdbfe]";
  if (count === 2) return "bg-[#60a5fa]";
  return "bg-[#1a56a0]";
}

export default async function CmeHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [plan, activitiesRes] = await Promise.all([
    getUserPlan(user.id),
    admin
      .from("cme_activities")
      .select("activity_date, credits, title, category")
      .eq("professional_id", user.id)
      .neq("verification_status", "rejected")
      .order("activity_date", { ascending: false }),
  ]);

  if (!isPro(plan)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 bg-[#eff6ff] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#111] mb-2">CME Activity History</h1>
        <p className="text-[#64748b] mb-6 max-w-sm mx-auto">
          Your full 52-week CME contribution calendar is a Pro feature. See every day you earned credits at a glance.
        </p>
        <a
          href="/pricing?source=cme_history"
          className="inline-block bg-[#1a56a0] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1547a0] transition-colors"
        >
          Upgrade to Pro →
        </a>
      </div>
    );
  }

  const activities = activitiesRes.data ?? [];
  const dates = activities.map((a) => a.activity_date.slice(0, 10));
  const { weeks, monthMarkers } = buildWeekGrid(dates);

  // Stats
  const thisYear = new Date().getFullYear().toString();
  const thisYearActivities = activities.filter((a) => a.activity_date.startsWith(thisYear));
  const thisYearCredits = thisYearActivities.reduce((s, a) => s + a.credits, 0);
  const totalActivities = activities.length;

  // Longest streak (consecutive days)
  const daySet = new Set(dates);
  let longestStreak = 0;
  let currentStreak = 0;
  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    if (daySet.has(iso)) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  // Most active month (last 12 months)
  const creditsByMonth: Record<string, number> = {};
  for (const a of activities) {
    const ym = a.activity_date.slice(0, 7);
    creditsByMonth[ym] = (creditsByMonth[ym] ?? 0) + a.credits;
  }
  const sortedMonths = Object.entries(creditsByMonth).sort((a, b) => b[1] - a[1]);
  const bestMonthEntry = sortedMonths[0];
  const bestMonthLabel = bestMonthEntry
    ? (() => {
        const [y, m] = bestMonthEntry[0].split("-").map(Number);
        return `${MONTH_NAMES[m - 1]} ${y}`;
      })()
    : null;

  // Category breakdown
  const catCount: Record<string, number> = {};
  for (const a of thisYearActivities) {
    const c = a.category ?? "uncategorized";
    catCount[c] = (catCount[c] ?? 0) + 1;
  }
  const topCategories = Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-[#64748b] mb-2">
          <Link href="/dashboard/cme" className="hover:text-[#1a56a0] transition-colors">CME Wallet</Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <span>Activity History</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111]">CME Activity History</h1>
        <p className="text-sm text-[#64748b] mt-1">Your CME contribution calendar — every day you earned credits.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Activities this year", value: thisYearActivities.length },
          { label: `Credits in ${thisYear}`, value: `${Math.round(thisYearCredits * 10) / 10}` },
          { label: "Total activities", value: totalActivities },
          { label: "Longest streak", value: `${longestStreak}d` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e2e8f0] p-4">
            <p className="text-2xl font-bold text-[#111]">{value}</p>
            <p className="text-xs text-[#64748b] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Heat map */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-8 overflow-x-auto">
        <h2 className="text-sm font-semibold text-[#374151] mb-4">52-Week Contribution Calendar</h2>

        {/* Month labels */}
        <div className="flex mb-1" style={{ marginLeft: "28px" }}>
          {Array.from({ length: 52 }, (_, i) => {
            const marker = monthMarkers.find((m) => m.colIndex === i);
            return (
              <div key={i} className="flex-shrink-0" style={{ width: "14px", marginRight: "2px" }}>
                {marker && (
                  <span className="text-[9px] text-[#94a3b8] font-medium whitespace-nowrap">
                    {marker.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="flex gap-0">
          {/* Day labels */}
          <div className="flex flex-col flex-shrink-0 mr-1.5" style={{ gap: "2px" }}>
            {DAY_LABELS.map((label, i) => (
              <div key={i} className="flex items-center justify-end" style={{ height: "12px" }}>
                <span className="text-[8px] text-[#94a3b8] font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col flex-shrink-0" style={{ gap: "2px", marginRight: "2px" }}>
              {week.days.map((day, di) => (
                <div
                  key={di}
                  className={`rounded-sm flex-shrink-0 ${cellColor(day.count)}`}
                  style={{ width: "12px", height: "12px" }}
                  title={day.count >= 0 ? `${day.date}: ${day.count} activit${day.count === 1 ? "y" : "ies"}` : ""}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-[10px] text-[#94a3b8]">Less</span>
          {["bg-[#e2e8f0]", "bg-[#bfdbfe]", "bg-[#60a5fa]", "bg-[#1a56a0]"].map((cls) => (
            <div key={cls} className={`w-3 h-3 rounded-sm ${cls}`} />
          ))}
          <span className="text-[10px] text-[#94a3b8]">More</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Best month */}
        {bestMonthLabel && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <h2 className="text-sm font-semibold text-[#374151] mb-3">Most Active Month</h2>
            <p className="text-xl font-bold text-[#1a56a0]">{bestMonthLabel}</p>
            <p className="text-sm text-[#64748b] mt-0.5">
              {Math.round((bestMonthEntry[1]) * 10) / 10} credits earned
            </p>
          </div>
        )}

        {/* Category breakdown */}
        {topCategories.length > 0 && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <h2 className="text-sm font-semibold text-[#374151] mb-3">Top Categories ({thisYear})</h2>
            <div className="space-y-2">
              {topCategories.map(([cat, count]) => {
                const max = topCategories[0][1];
                return (
                  <div key={cat} className="flex items-center gap-2">
                    <span className="text-xs text-[#64748b] w-24 capitalize truncate">{cat}</span>
                    <div className="flex-1 bg-[#f1f5f9] rounded-full h-2">
                      <div
                        className="bg-[#1a56a0] h-2 rounded-full"
                        style={{ width: `${Math.round((count / max) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#374151] font-medium w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Recent activities */}
      {activities.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] mt-6">
          <div className="px-5 py-4 border-b border-[#f1f5f9]">
            <h2 className="text-sm font-semibold text-[#374151]">Recent Activities</h2>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {activities.slice(0, 20).map((a, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#111] truncate">{a.title}</p>
                  <p className="text-xs text-[#64748b] capitalize">{a.category ?? "Uncategorized"}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-[#1a56a0]">{a.credits} cr</p>
                  <p className="text-xs text-[#94a3b8]">{a.activity_date.slice(0, 10)}</p>
                </div>
              </div>
            ))}
          </div>
          {activities.length > 20 && (
            <div className="px-5 py-3 border-t border-[#f1f5f9]">
              <Link href="/dashboard/cme" className="text-sm text-[#1a56a0] hover:underline">
                View all {activities.length} activities →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface Activity {
  credits: number;
  category: string | null;
  activity_date: string;
  verification_status: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  conference: "Conference",
  online: "Online",
  workshop: "Workshop",
  journal: "Journal",
  teaching: "Teaching",
  simulation: "Simulation",
  mandatory: "Mandatory",
  patient_safety: "Patient Safety",
  other: "Other",
  uncategorized: "Uncategorized",
};

function getLast6Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return months;
}

function monthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString("en", { month: "short" });
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [walletRes, activitiesRes] = await Promise.all([
    admin.from("cme_wallets").select("*").eq("professional_id", user.id).maybeSingle(),
    admin
      .from("cme_activities")
      .select("credits, category, activity_date, verification_status")
      .eq("professional_id", user.id)
      .order("activity_date"),
  ]);

  const wallet = walletRes.data;
  const all: Activity[] = activitiesRes.data ?? [];
  const valid = all.filter((a) => a.verification_status !== "rejected");

  // ── Stats ──────────────────────────────────────────────────────────────
  const totalEarned = valid.reduce((s, a) => s + a.credits, 0);
  const required = wallet?.required_credits ?? 50;
  const remaining = Math.max(0, required - totalEarned);
  const pct = Math.min(Math.round((totalEarned / required) * 100), 100);

  const cycleEnd = wallet?.cycle_end_date ? new Date(wallet.cycle_end_date) : null;
  const daysLeft = cycleEnd
    ? Math.max(0, Math.ceil((cycleEnd.getTime() - Date.now()) / 86400000))
    : null;
  const monthsLeft = daysLeft !== null ? daysLeft / 30.4 : null;

  // Monthly credits (last 6 months)
  const last6 = getLast6Months();
  const creditsByMonth: Record<string, number> = {};
  const activitiesByMonth: Record<string, number> = {};
  for (const a of valid) {
    const ym = a.activity_date.slice(0, 7);
    creditsByMonth[ym] = (creditsByMonth[ym] ?? 0) + a.credits;
    activitiesByMonth[ym] = (activitiesByMonth[ym] ?? 0) + 1;
  }
  const monthData = last6.map((ym) => ({
    ym,
    label: monthLabel(ym),
    credits: creditsByMonth[ym] ?? 0,
    count: activitiesByMonth[ym] ?? 0,
  }));
  const maxMonthCredits = Math.max(...monthData.map((m) => m.credits), 1);

  // Pace — avg credits per month over the active months
  const activeMonths = Object.values(creditsByMonth).filter((v) => v > 0).length || 1;
  const firstActivity = valid[0]?.activity_date;
  const monthsSinceFirst = firstActivity
    ? Math.max(
        1,
        Math.ceil(
          (Date.now() - new Date(firstActivity).getTime()) / (1000 * 60 * 60 * 24 * 30.4)
        )
      )
    : 1;
  const avgPerMonth = totalEarned / monthsSinceFirst;

  // Projection
  const monthsToComplete =
    avgPerMonth > 0 && remaining > 0 ? remaining / avgPerMonth : null;
  const projectedDate =
    monthsToComplete !== null
      ? new Date(Date.now() + monthsToComplete * 30.4 * 86400000)
      : null;
  const onTrack =
    cycleEnd && projectedDate ? projectedDate <= cycleEnd : totalEarned >= required;
  const creditsPerMonthNeeded =
    monthsLeft && monthsLeft > 0 && remaining > 0
      ? (remaining / monthsLeft).toFixed(1)
      : null;

  // Category breakdown
  const byCategory: Record<string, number> = {};
  for (const a of valid) {
    const cat = a.category ?? "uncategorized";
    byCategory[cat] = (byCategory[cat] ?? 0) + a.credits;
  }
  const categoryRows = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxCatCredits = Math.max(...categoryRows.map(([, v]) => v), 1);

  // Cumulative trend (for sparkline)
  const cumulative: number[] = [];
  let running = 0;
  for (const m of last6) {
    running += creditsByMonth[m] ?? 0;
    cumulative.push(running);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Analytics</h1>
        <p className="text-sm text-[#64748b] mt-1">
          {wallet
            ? `${wallet.country} · ${wallet.profession}${wallet.specialty ? ` — ${wallet.specialty}` : ""} · Cycle ends ${wallet.cycle_end_date}`
            : "Set up your CME wallet to see analytics"}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Credits Earned"
          value={`${totalEarned}`}
          sub={`of ${required} required`}
          accent="blue"
        />
        <StatCard
          label="Activities"
          value={`${valid.length}`}
          sub={`${all.length - valid.length > 0 ? `${all.length - valid.length} pending/rejected` : "all counted"}`}
          accent="green"
        />
        <StatCard
          label="Avg / Month"
          value={avgPerMonth.toFixed(1)}
          sub="credits at current pace"
          accent={onTrack ? "green" : "yellow"}
        />
        <StatCard
          label="Days Left"
          value={daysLeft !== null ? `${daysLeft}` : "—"}
          sub={cycleEnd ? `Renewal: ${wallet?.cycle_end_date}` : "No wallet set up"}
          accent={
            daysLeft === null ? "gray" : daysLeft < 30 ? "red" : daysLeft < 90 ? "yellow" : "green"
          }
        />
      </div>

      {/* Progress to goal */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#111]">Progress to Renewal</h2>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
              pct >= 100
                ? "bg-green-50 text-green-700 border-green-200"
                : onTrack
                ? "bg-blue-50 text-blue-700 border-blue-100"
                : "bg-yellow-50 text-yellow-700 border-yellow-200"
            }`}
          >
            {pct >= 100 ? "Complete" : onTrack ? "On track" : "Needs attention"}
          </span>
        </div>

        <div className="flex items-end gap-3 mb-3">
          <span className="text-4xl font-bold text-[#1a56a0]">{totalEarned}</span>
          <span className="text-xl text-[#64748b] mb-1">/ {required} credits</span>
          <span className="text-sm text-[#64748b] mb-1 ml-auto">{pct}%</span>
        </div>

        {/* Main progress bar */}
        <div className="w-full bg-[#e2e8f0] rounded-full h-3 mb-4">
          <div
            className={`h-3 rounded-full transition-all ${pct >= 100 ? "bg-green-500" : "bg-[#1a56a0]"}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Forecast row */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[#64748b] text-xs mb-0.5">Credits needed</p>
            <p className="font-semibold text-[#111]">{remaining} more credits</p>
          </div>
          <div>
            <p className="text-[#64748b] text-xs mb-0.5">Required pace</p>
            <p className="font-semibold text-[#111]">
              {creditsPerMonthNeeded
                ? `${creditsPerMonthNeeded} credits/month`
                : pct >= 100
                ? "Complete!"
                : "Set up renewal date"}
            </p>
          </div>
          <div>
            <p className="text-[#64748b] text-xs mb-0.5">Current pace</p>
            <p className={`font-semibold ${onTrack ? "text-green-600" : "text-yellow-600"}`}>
              {avgPerMonth.toFixed(1)} credits/month
            </p>
          </div>
          <div>
            <p className="text-[#64748b] text-xs mb-0.5">Projected completion</p>
            <p className={`font-semibold ${onTrack ? "text-green-600" : "text-red-600"}`}>
              {projectedDate
                ? projectedDate.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })
                : pct >= 100
                ? "Already complete"
                : "Log activities to see forecast"}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly bar chart */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-base font-semibold text-[#111] mb-5">Monthly Credits (Last 6 Months)</h2>

        {valid.length === 0 ? (
          <p className="text-sm text-[#64748b] py-4">No activities logged yet.</p>
        ) : (
          <div className="flex items-end gap-3 h-36">
            {monthData.map((m) => {
              const barPct = (m.credits / maxMonthCredits) * 100;
              return (
                <div key={m.ym} className="flex flex-col items-center flex-1 gap-1.5">
                  <span className="text-[10px] text-[#64748b]">
                    {m.credits > 0 ? m.credits : ""}
                  </span>
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        m.credits > 0 ? "bg-[#1a56a0]" : "bg-[#e2e8f0]"
                      }`}
                      style={{ height: m.credits > 0 ? `${Math.max(barPct, 6)}%` : "6%" }}
                    />
                  </div>
                  <span className="text-xs text-[#64748b]">{m.label}</span>
                  {m.count > 0 && (
                    <span className="text-[10px] text-[#94a3b8]">
                      {m.count} act.
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category breakdown */}
      {categoryRows.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-5">Credits by Category</h2>
          <div className="space-y-3">
            {categoryRows.map(([cat, credits]) => {
              const barPct = (credits / maxCatCredits) * 100;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#374151]">
                      {CATEGORY_LABELS[cat] ?? cat}
                    </span>
                    <span className="text-sm font-medium text-[#111]">{credits} credits</span>
                  </div>
                  <div className="w-full bg-[#e2e8f0] rounded-full h-2">
                    <div
                      className="bg-[#1a56a0] h-2 rounded-full"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.values(byCategory).length === 0 && (
              <p className="text-sm text-[#64748b]">
                Log activities with categories to see the breakdown.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "blue" | "green" | "yellow" | "red" | "gray";
}) {
  const accentColor = {
    blue: "text-[#1a56a0]",
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
    gray: "text-[#64748b]",
  }[accent];

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
      <p className="text-xs text-[#64748b] mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accentColor}`}>{value}</p>
      <p className="text-xs text-[#94a3b8] mt-0.5 truncate">{sub}</p>
    </div>
  );
}

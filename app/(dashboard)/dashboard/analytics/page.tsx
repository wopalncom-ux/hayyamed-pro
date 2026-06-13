import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import WalletTabs from "@/components/dashboard/WalletTabs";
import RenewalPredictionWidget from "./RenewalPredictionWidget";
import { getUserPlan, isPro } from "@/lib/subscription";

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

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ wallet?: string }>;
}) {
  const { wallet: walletParam } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  // Fetch wallets and plan in parallel
  const [walletsRes, plan] = await Promise.all([
    admin
      .from("cme_wallets")
      .select("*")
      .eq("professional_id", user.id)
      .order("created_at", { ascending: true }),
    getUserPlan(user.id),
  ]);
  const userIsPro = isPro(plan);

  const wallets = walletsRes.data ?? [];
  const wallet = wallets.find((w) => w.id === walletParam) ?? wallets[0] ?? null;

  // Fetch activities only for the active wallet
  let all: Activity[] = [];
  if (wallet) {
    const activitiesRes = await admin
      .from("cme_activities")
      .select("credits, category, activity_date, verification_status")
      .eq("professional_id", user.id)
      .eq("wallet_id", wallet.id)
      .order("activity_date");
    all = activitiesRes.data ?? [];
  }

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

      {/* Wallet tabs — shown when multiple wallets exist */}
      <WalletTabs
        wallets={wallets.map((w) => ({
          id: w.id,
          country: w.country,
          label: w.label ?? null,
          compliance_status: w.compliance_status ?? "non_compliant",
        }))}
        activeWalletId={wallet?.id ?? ""}
      />

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

      {/* Cumulative credits trend */}
      {valid.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-[#111]">Cumulative Credits Trend</h2>
            <span className="text-xs text-[#64748b]">Last 6 months</span>
          </div>
          {(() => {
            const W = 400;
            const H = 90;
            const PAD_X = 6;
            const PAD_TOP = 12;
            const PAD_BOT = 24;
            const plotH = H - PAD_TOP - PAD_BOT;
            const maxY = Math.max(...cumulative, required, 1);
            const n = cumulative.length;
            const xs = cumulative.map((_, i) =>
              n === 1 ? W / 2 : PAD_X + (i / (n - 1)) * (W - 2 * PAD_X)
            );
            const ys = cumulative.map(
              (v) => PAD_TOP + (1 - v / maxY) * plotH
            );
            const goalY = PAD_TOP + (1 - required / maxY) * plotH;
            const pts = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
            const areaPath =
              `M${xs[0]},${PAD_TOP + plotH} ` +
              xs.map((x, i) => `L${x},${ys[i]}`).join(" ") +
              ` L${xs[n - 1]},${PAD_TOP + plotH} Z`;
            return (
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full"
                style={{ maxHeight: 130 }}
                aria-label="Cumulative credits trend"
              >
                {/* Goal line */}
                {required > 0 && goalY > PAD_TOP && goalY < PAD_TOP + plotH && (
                  <>
                    <line
                      x1={PAD_X}
                      y1={goalY}
                      x2={W - PAD_X}
                      y2={goalY}
                      stroke="#16a34a"
                      strokeWidth={1}
                      strokeDasharray="4 3"
                      opacity={0.6}
                    />
                    <text
                      x={W - PAD_X + 2}
                      y={goalY + 4}
                      fill="#16a34a"
                      fontSize={8}
                      fontFamily="system-ui,-apple-system,sans-serif"
                      opacity={0.8}
                    >
                      Goal
                    </text>
                  </>
                )}
                {/* Area fill */}
                <path d={areaPath} fill="#1a56a0" fillOpacity={0.08} />
                {/* Line */}
                <polyline
                  points={pts}
                  fill="none"
                  stroke="#1a56a0"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* Data points */}
                {xs.map((x, i) => (
                  <g key={i}>
                    <circle cx={x} cy={ys[i]} r={3.5} fill="#1a56a0" />
                    {cumulative[i] > 0 && (
                      <text
                        x={x}
                        y={ys[i] - 7}
                        textAnchor="middle"
                        fill="#374151"
                        fontSize={8.5}
                        fontFamily="system-ui,-apple-system,sans-serif"
                        fontWeight={600}
                      >
                        {cumulative[i]}
                      </text>
                    )}
                    <text
                      x={x}
                      y={H - 2}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize={8.5}
                      fontFamily="system-ui,-apple-system,sans-serif"
                    >
                      {monthData[i].label}
                    </text>
                  </g>
                ))}
              </svg>
            );
          })()}
        </div>
      )}

      {/* AI Renewal Forecast widget */}
      {wallet && (
        <div className="mb-6">
          <RenewalPredictionWidget walletId={wallet.id} isPro={userIsPro} />
        </div>
      )}

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

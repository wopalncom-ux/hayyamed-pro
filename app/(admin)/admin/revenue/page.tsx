import { createAdminClient } from "@/lib/supabase/server";

function calcMrr(plan: string, tier: string | null, interval: string | null): number {
  if (plan === "pro") return interval === "annual" ? 61.20 / 12 : 6;
  if (plan === "employer") {
    const prices: Record<string, [number, number]> = {
      clinic:     [50,  510],
      growth:     [100, 1020],
      department: [180, 1836],
      hospital:   [350, 3570],
    };
    const [mo, yr] = prices[tier ?? "clinic"] ?? [50, 510];
    return interval === "annual" ? yr / 12 : mo;
  }
  return 0;
}

export const metadata = { title: "Revenue" };

export default async function AdminRevenuePage() {
  const admin = createAdminClient();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

  const [subsRes, totalProfilesRes, signupRes, recentSubsRes, trialsActiveRes, trialsExpiringRes, churnedRes] = await Promise.all([
    admin
      .from("subscriptions")
      .select("plan, employer_tier, billing_interval, status, created_at")
      .in("status", ["active", "trialing"]),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }),
    admin
      .from("professional_profiles")
      .select("created_at")
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: true }),
    admin
      .from("subscriptions")
      .select("professional_id, plan, employer_tier, billing_interval, status, created_at")
      .in("status", ["active", "trialing"])
      .order("created_at", { ascending: false })
      .limit(10),
    admin
      .from("professional_profiles")
      .select("id", { count: "exact", head: true })
      .gt("pro_trial_ends_at", now.toISOString()),
    admin
      .from("professional_profiles")
      .select("id", { count: "exact", head: true })
      .gt("pro_trial_ends_at", now.toISOString())
      .lte("pro_trial_ends_at", threeDaysFromNow),
    // Churn: cancelled in last 30 days
    admin
      .from("subscriptions")
      .select("plan, employer_tier, billing_interval")
      .eq("status", "cancelled")
      .gte("updated_at", thirtyDaysAgo),
  ]);

  const activeSubs = subsRes.data ?? [];
  const totalProfiles = totalProfilesRes.count ?? 0;
  const signups = signupRes.data ?? [];
  const recentSubs = recentSubsRes.data ?? [];
  const trialsActive = trialsActiveRes.count ?? 0;
  const trialsExpiringSoon = trialsExpiringRes.count ?? 0;
  const churnedSubs = churnedRes.data ?? [];

  // MRR / ARR — accurate per billing interval
  let totalMrr = 0;
  let proMrrMonthly = 0;
  let proMrrAnnual = 0;
  let proMonthlyCount = 0;
  let proAnnualCount = 0;
  let employerCount = 0;
  const tierMrr: Record<string, { count: number; mrr: number }> = {};

  for (const s of activeSubs) {
    const mrr = calcMrr(s.plan, s.employer_tier, s.billing_interval);
    totalMrr += mrr;
    if (s.plan === "pro") {
      if (s.billing_interval === "annual") { proMrrAnnual += mrr; proAnnualCount++; }
      else { proMrrMonthly += mrr; proMonthlyCount++; }
    }
    if (s.plan === "employer") {
      employerCount++;
      const tier = s.employer_tier ?? "unknown";
      if (!tierMrr[tier]) tierMrr[tier] = { count: 0, mrr: 0 };
      tierMrr[tier].count++;
      tierMrr[tier].mrr += mrr;
    }
  }

  // Churn metrics (last 30 days)
  let churnedMrr = 0;
  for (const s of churnedSubs) {
    churnedMrr += calcMrr(s.plan, s.employer_tier, s.billing_interval);
  }
  const churnedCount = churnedSubs.length;
  const totalPaid = (proMonthlyCount + proAnnualCount) + employerCount;
  const churnRate = totalPaid + churnedCount > 0
    ? ((churnedCount / (totalPaid + churnedCount)) * 100).toFixed(1)
    : "0.0";

  const totalArr = totalMrr * 12;
  const totalProCount = proMonthlyCount + proAnnualCount;
  const conversionRate = totalProfiles > 0 ? ((totalPaid / totalProfiles) * 100).toFixed(1) : "0.0";

  // Daily signups chart
  const dayMap = new Map<string, number>();
  for (const s of signups) {
    const day = s.created_at.slice(0, 10);
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
  }

  const chartDays: { label: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    chartDays.push({ label, count: dayMap.get(key) ?? 0 });
  }

  const maxCount = Math.max(...chartDays.map((d) => d.count), 1);

  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n.toFixed(0)}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Revenue Dashboard</h1>
          <p className="text-sm text-[#64748b] mt-1">Live MRR/ARR from active subscriptions</p>
        </div>
        <a href="/admin" className="text-sm text-[#1a56a0] hover:underline">← Back to admin</a>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <KpiCard label="MRR" value={fmt(totalMrr)} sub="Monthly recurring" green />
        <KpiCard label="ARR" value={fmt(totalArr)} sub="Annual run rate" green />
        <KpiCard label="Paid Users" value={String(totalPaid)} sub={`of ${totalProfiles} total`} />
        <KpiCard label="Conversion" value={`${conversionRate}%`} sub="Free → Paid" />
      </div>

      {/* Revenue per plan tier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#111] mb-1">Revenue by Plan Tier</h2>
          <p className="text-xs text-[#64748b] mb-4">Actual MRR per tier (interval-corrected)</p>
          <div className="space-y-3">
            {proMonthlyCount > 0 && (
              <BreakdownRow label="Pro · Monthly" count={proMonthlyCount} mrr={proMrrMonthly} color="blue" />
            )}
            {proAnnualCount > 0 && (
              <BreakdownRow label="Pro · Annual" count={proAnnualCount} mrr={proMrrAnnual} color="blue" />
            )}
            {Object.entries(tierMrr).map(([tier, { count, mrr }]) => (
              <BreakdownRow
                key={tier}
                label={`Employer — ${tier.charAt(0).toUpperCase() + tier.slice(1)}`}
                count={count}
                mrr={mrr}
                color="orange"
              />
            ))}
            {totalPaid === 0 && (
              <p className="text-sm text-[#64748b] py-2">No paid subscriptions yet.</p>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-[#f1f5f9] grid grid-cols-3 text-center">
            <div>
              <p className="text-xs text-[#64748b]">Pro</p>
              <p className="text-sm font-bold text-[#1a56a0]">{totalProCount}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Employer</p>
              <p className="text-sm font-bold text-[#1a56a0]">{employerCount}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Total MRR</p>
              <p className="text-sm font-bold text-[#16a34a]">{fmt(totalMrr)}</p>
            </div>
          </div>
        </div>

        {/* Churn tracking */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#111] mb-1">Churn — Last 30 Days</h2>
          <p className="text-xs text-[#64748b] mb-4">Cancelled subscriptions and lost MRR</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className={`rounded-lg p-3 text-center ${churnedCount > 0 ? "bg-[#fef2f2] border border-[#fecaca]" : "bg-[#f0fdf4] border border-[#bbf7d0]"}`}>
              <p className={`text-2xl font-bold ${churnedCount > 0 ? "text-[#dc2626]" : "text-[#16a34a]"}`}>{churnedCount}</p>
              <p className="text-[10px] text-[#64748b] mt-0.5">Cancelled</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${churnedMrr > 0 ? "bg-[#fef2f2] border border-[#fecaca]" : "bg-[#f0fdf4] border border-[#bbf7d0]"}`}>
              <p className={`text-2xl font-bold ${churnedMrr > 0 ? "text-[#dc2626]" : "text-[#16a34a]"}`}>
                {churnedMrr > 0 ? `-${fmt(churnedMrr)}` : "$0"}
              </p>
              <p className="text-[10px] text-[#64748b] mt-0.5">Lost MRR</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${parseFloat(churnRate) > 5 ? "bg-[#fff7ed] border border-[#fed7aa]" : "bg-[#f0fdf4] border border-[#bbf7d0]"}`}>
              <p className={`text-2xl font-bold ${parseFloat(churnRate) > 5 ? "text-[#d97706]" : "text-[#16a34a]"}`}>{churnRate}%</p>
              <p className="text-[10px] text-[#64748b] mt-0.5">Churn rate</p>
            </div>
          </div>
          <div className="bg-[#f8fafc] rounded-lg p-3">
            <p className="text-xs text-[#374151] font-medium mb-1">Target thresholds</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#64748b]">
                <span>Pro annual churn target</span><span className="font-semibold">&lt; 5%</span>
              </div>
              <div className="flex justify-between text-xs text-[#64748b]">
                <span>Employer churn target</span><span className="font-semibold">&lt; 2%</span>
              </div>
              <div className="flex justify-between text-xs text-[#64748b]">
                <span>Lost ARR</span><span className="font-semibold text-[#dc2626]">{fmt(churnedMrr * 12)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent upgrades */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-sm font-semibold text-[#111] mb-4">Recent Upgrades</h2>
        {recentSubs.length === 0 ? (
          <p className="text-sm text-[#64748b]">No upgrades yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {recentSubs.map((s, i) => {
              const mrr = calcMrr(s.plan, s.employer_tier, s.billing_interval);
              const when = new Date(s.created_at).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              });
              const label = s.plan === "employer"
                ? `Employer ${s.employer_tier ?? ""} · ${s.billing_interval ?? "monthly"}`
                : `Pro · ${s.billing_interval ?? "monthly"}`;
              return (
                <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-[#f8fafc] rounded-lg">
                  <div>
                    <p className="text-xs font-medium text-[#111]">{label}</p>
                    <p className="text-[10px] text-[#64748b]">{when}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#16a34a]">+{fmt(mrr)}/mo</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trial pipeline */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-sm font-semibold text-[#111] mb-1">Trial Pipeline</h2>
        <p className="text-xs text-[#64748b] mb-4">Active 14-day Pro trials — potential paid conversions</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#1a56a0]">{trialsActive}</p>
            <p className="text-xs text-[#64748b] mt-1">Active trials</p>
          </div>
          <div className={`rounded-xl p-4 text-center border ${trialsExpiringSoon > 0 ? "bg-[#fff7ed] border-[#fed7aa]" : "bg-[#f8fafc] border-[#e2e8f0]"}`}>
            <p className={`text-2xl font-bold ${trialsExpiringSoon > 0 ? "text-[#d97706]" : "text-[#64748b]"}`}>{trialsExpiringSoon}</p>
            <p className="text-xs text-[#64748b] mt-1">Expiring in 3 days</p>
          </div>
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#16a34a]">{totalPaid}</p>
            <p className="text-xs text-[#64748b] mt-1">Converted (paid)</p>
          </div>
        </div>
        {trialsExpiringSoon > 0 && (
          <p className="text-xs text-[#d97706] mt-3">
            ⚠ {trialsExpiringSoon} trial{trialsExpiringSoon > 1 ? "s" : ""} expiring within 3 days — reminder emails will fire via the trial-reminders cron.
          </p>
        )}
      </div>

      {/* Signup chart */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <h2 className="text-sm font-semibold text-[#111] mb-1">New Signups — Last 30 Days</h2>
        <p className="text-xs text-[#64748b] mb-5">{signups.length} total sign-ups in this period</p>

        <div className="flex items-end gap-1 h-32 overflow-x-auto pb-1">
          {chartDays.map((d, i) => {
            const heightPct = maxCount > 0 ? (d.count / maxCount) * 100 : 0;
            const showLabel = i === 0 || i === 14 || i === 29 || d.count === Math.max(...chartDays.map((x) => x.count));
            return (
              <div key={i} className="flex flex-col items-center flex-1 min-w-[6px] gap-0.5" title={`${d.label}: ${d.count}`}>
                <div
                  className="w-full rounded-t-sm bg-[#1a56a0] transition-all"
                  style={{ height: `${heightPct}%`, minHeight: d.count > 0 ? "4px" : "1px", opacity: d.count > 0 ? 1 : 0.15 }}
                />
                {showLabel && (
                  <span className="text-[8px] text-[#64748b] rotate-0 whitespace-nowrap" style={{ fontSize: "8px" }}>
                    {d.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, green }: { label: string; value: string; sub: string; green?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold mb-1 ${green ? "text-[#16a34a]" : "text-[#1a56a0]"}`}>{value}</p>
      <p className="text-xs text-[#64748b]">{sub}</p>
    </div>
  );
}

function BreakdownRow({
  label, count, mrr, color,
}: { label: string; count: number; mrr: number; color: "blue" | "orange" }) {
  const colors = { blue: "bg-[#e8f0fe] text-[#1a56a0]", orange: "bg-[#fff7ed] text-[#d97706]" };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors[color]}`}>{label}</span>
        <span className="text-xs text-[#64748b]">{count} active</span>
      </div>
      <span className="text-xs font-semibold text-[#374151]">${mrr.toFixed(0)}/mo</span>
    </div>
  );
}

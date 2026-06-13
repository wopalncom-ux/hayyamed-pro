import { createAdminClient } from "@/lib/supabase/server";

// Monthly recurring revenue per plan/tier/interval
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

export default async function AdminRevenuePage() {
  const admin = createAdminClient();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

  const [subsRes, totalProfilesRes, signupRes, recentSubsRes, trialsActiveRes, trialsExpiringRes] = await Promise.all([
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
  ]);

  const activeSubs = subsRes.data ?? [];
  const totalProfiles = totalProfilesRes.count ?? 0;
  const signups = signupRes.data ?? [];
  const recentSubs = recentSubsRes.data ?? [];
  const trialsActive = trialsActiveRes.count ?? 0;
  const trialsExpiringSoon = trialsExpiringRes.count ?? 0;

  // MRR / ARR
  let totalMrr = 0;
  let proCount = 0;
  let employerCount = 0;
  const tierBreakdown: Record<string, number> = {};

  for (const s of activeSubs) {
    const mrr = calcMrr(s.plan, s.employer_tier, s.billing_interval);
    totalMrr += mrr;
    if (s.plan === "pro") proCount++;
    if (s.plan === "employer") {
      employerCount++;
      const tier = s.employer_tier ?? "unknown";
      tierBreakdown[tier] = (tierBreakdown[tier] ?? 0) + 1;
    }
  }

  const totalArr = totalMrr * 12;
  const totalPaid = proCount + employerCount;
  const conversionRate = totalProfiles > 0 ? ((totalPaid / totalProfiles) * 100).toFixed(1) : "0.0";

  // Daily signups chart (last 30 days)
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

      {/* Plan breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#111] mb-4">Plan Breakdown</h2>
          <div className="space-y-3">
            <BreakdownRow label="Pro" count={proCount} mrr={proCount * 6} color="blue" />
            {Object.entries(tierBreakdown).map(([tier, count]) => (
              <BreakdownRow
                key={tier}
                label={`Employer — ${tier.charAt(0).toUpperCase() + tier.slice(1)}`}
                count={count}
                mrr={count * calcMrr("employer", tier, "monthly")}
                color="orange"
              />
            ))}
            {totalPaid === 0 && (
              <p className="text-sm text-[#94a3b8] py-2">No paid subscriptions yet.</p>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-[#f1f5f9] flex items-center justify-between">
            <span className="text-xs text-[#64748b]">Total active subscribers</span>
            <span className="text-sm font-bold text-[#111]">{totalPaid}</span>
          </div>
        </div>

        {/* Recent upgrades */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#111] mb-4">Recent Upgrades</h2>
          {recentSubs.length === 0 ? (
            <p className="text-sm text-[#94a3b8]">No upgrades yet.</p>
          ) : (
            <div className="space-y-2.5">
              {recentSubs.map((s, i) => {
                const mrr = calcMrr(s.plan, s.employer_tier, s.billing_interval);
                const when = new Date(s.created_at).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric",
                });
                const label = s.plan === "employer"
                  ? `Employer ${s.employer_tier ?? ""} · ${s.billing_interval ?? "monthly"}`
                  : `Pro · ${s.billing_interval ?? "monthly"}`;
                return (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#f8fafc] last:border-0">
                    <div>
                      <p className="text-xs font-medium text-[#111]">{label}</p>
                      <p className="text-[10px] text-[#94a3b8]">{when}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#16a34a]">+${mrr.toFixed(0)}/mo</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
            <p className={`text-2xl font-bold ${trialsExpiringSoon > 0 ? "text-[#d97706]" : "text-[#94a3b8]"}`}>{trialsExpiringSoon}</p>
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
                  <span className="text-[8px] text-[#94a3b8] rotate-0 whitespace-nowrap" style={{ fontSize: "8px" }}>
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
      <p className="text-xs text-[#94a3b8]">{sub}</p>
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
      <span className="text-xs font-semibold text-[#374151]">${mrr.toFixed(0)}/mo est.</span>
    </div>
  );
}

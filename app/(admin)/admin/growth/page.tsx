import { createAdminClient } from "@/lib/supabase/server";

export const metadata = { title: "Growth Dashboard — Admin" };
export const dynamic = "force-dynamic";

function FunnelBar({ label, value, max, pct }: { label: string; value: number; max: number; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-[#374151]">{label}</span>
        <span className="text-xs font-bold text-[#0f172a]">{value.toLocaleString()} <span className="text-[#94a3b8] font-normal">({pct}%)</span></span>
      </div>
      <div className="h-3 bg-[#f1f5f9] rounded-full overflow-hidden">
        <div className="h-3 rounded-full bg-[#1a56a0] transition-all" style={{ width: `${Math.max((value / Math.max(max, 1)) * 100, value > 0 ? 2 : 0)}%` }} />
      </div>
    </div>
  );
}

function pct(num: number, den: number) { return den > 0 ? Math.round((num / den) * 100) : 0; }

export default async function GrowthPage() {
  const admin = createAdminClient();
  const now = new Date();
  const day7  = new Date(now.getTime() -  7 * 86400000).toISOString();
  const day30 = new Date(now.getTime() - 30 * 86400000).toISOString();
  const day7ahead = new Date(now.getTime() +  7 * 86400000).toISOString();
  const day30ahead = new Date(now.getTime() + 30 * 86400000).toISOString();

  const [
    allProfilesRes, cmeUsersRes, allSubsRes,
    trialsExpiringRes, recentUpgradesRes, recentCancelsRes,
    newSignups7dRes, topFreeUsersRes,
  ] = await Promise.all([
    // Total + onboarded
    admin.from("professional_profiles").select("auth_id, onboarding_complete, created_at"),
    // Users with ≥1 CME
    admin.from("cme_activities").select("professional_id"),
    // All subscriptions
    admin.from("subscriptions").select("professional_id, plan, status, trial_ends_at, created_at, updated_at"),
    // Trials expiring in 7 days
    admin.from("subscriptions")
      .select("professional_id, plan, trial_ends_at")
      .eq("status", "trialing")
      .gte("trial_ends_at", now.toISOString())
      .lte("trial_ends_at", day7ahead)
      .order("trial_ends_at", { ascending: true }),
    // Recent upgrades (last 30d)
    admin.from("subscriptions")
      .select("professional_id, plan, status, created_at")
      .eq("status", "active")
      .gte("created_at", day30)
      .order("created_at", { ascending: false })
      .limit(10),
    // Recent cancellations (last 30d)
    admin.from("subscriptions")
      .select("professional_id, plan, status, updated_at")
      .in("status", ["cancelled", "canceled"])
      .gte("updated_at", day30)
      .order("updated_at", { ascending: false })
      .limit(10),
    // New signups last 7d
    admin.from("professional_profiles")
      .select("auth_id, full_name, profession, country_of_residence, onboarding_complete, created_at")
      .gte("created_at", day7)
      .order("created_at", { ascending: false }),
    // Top free users (onboarded, most CME activity, no paid plan)
    admin.from("professional_profiles")
      .select("auth_id, full_name, profession, country_of_residence, created_at")
      .eq("onboarding_complete", true)
      .limit(200),
  ]);

  const profiles  = allProfilesRes.data ?? [];
  const allSubs   = allSubsRes.data ?? [];
  const cmeUsers  = new Set((cmeUsersRes.data ?? []).map((r) => r.professional_id));

  // Funnel
  const totalSignups   = profiles.length;
  const totalOnboarded = profiles.filter((p) => p.onboarding_complete).length;
  const totalCme       = [...cmeUsers].filter((id) => profiles.some((p) => p.auth_id === id && p.onboarding_complete)).length; // cmeUsers contains professional_id values which match auth_id on professional_profiles
  const anyPlan   = new Set(allSubs.filter((s) => ["active", "trialing"].includes(s.status)).map((s) => s.professional_id)).size;
  const paidPlan  = new Set(allSubs.filter((s) => s.status === "active").map((s) => s.professional_id)).size;

  // Trials expiring
  const trialsExpiring = trialsExpiringRes.data ?? [];
  const trialsMonth = (allSubsRes.data ?? []).filter(
    (s) => s.status === "trialing" && s.trial_ends_at && s.trial_ends_at <= day30ahead
  ).length;

  // Plan distribution
  const planDist: Record<string, number> = {};
  for (const s of allSubs.filter((s) => ["active", "trialing"].includes(s.status))) {
    const k = s.status === "trialing" ? "trial" : (s.plan ?? "free");
    planDist[k] = (planDist[k] ?? 0) + 1;
  }

  // Recent upgrades / cancels
  const recentUpgrades = recentUpgradesRes.data ?? [];
  const recentCancels  = recentCancelsRes.data ?? [];

  // Top free users (onboarded, no paid sub, most CME)
  const paidIds = new Set(allSubs.filter((s) => ["active", "trialing"].includes(s.status)).map((s) => s.professional_id));
  const freeOnboarded = (topFreeUsersRes.data ?? []).filter((p) => !paidIds.has(p.auth_id));
  const cmeCounts: Record<string, number> = {};
  for (const r of (cmeUsersRes.data ?? [])) cmeCounts[r.professional_id] = (cmeCounts[r.professional_id] ?? 0) + 1;
  const topFree = freeOnboarded
    .sort((a, b) => (cmeCounts[b.auth_id] ?? 0) - (cmeCounts[a.auth_id] ?? 0))
    .slice(0, 8);

  // Velocity
  const newSignups7d = newSignups7dRes.data ?? [];
  const newOnboarded7d = newSignups7d.filter((p) => p.onboarding_complete).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Growth Dashboard</h1>
        <p className="text-[#64748b] mt-1">Conversion funnel, trial pipeline, upgrade signals — everything to get the next paying customer.</p>
      </div>

      {/* Velocity row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "New Signups (7d)",     value: newSignups7d.length,  note: `${newOnboarded7d} onboarded`, good: newSignups7d.length > 0 },
          { label: "Active Subscribers",   value: paidPlan,             note: "paid plans",                  good: paidPlan > 0 },
          { label: "Trials Expiring (7d)", value: trialsExpiring.length, note: "→ convert or cancel",        good: false },
          { label: "Trials Expiring (30d)",value: trialsMonth,           note: "convert opportunity",        good: false },
        ].map(({ label, value, note, good }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-3xl font-bold ${good ? "text-[#16a34a]" : value > 0 ? "text-[#d97706]" : "text-[#0f172a]"}`}>{value}</p>
            <p className="text-xs text-[#94a3b8] mt-1">{note}</p>
          </div>
        ))}
      </div>

      {/* Conversion funnel */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-5">Conversion Funnel — All Time</h2>
        <div className="space-y-4">
          <FunnelBar label="1. Signed Up"         value={totalSignups}   max={totalSignups}   pct={100} />
          <FunnelBar label="2. Completed Onboarding" value={totalOnboarded} max={totalSignups} pct={pct(totalOnboarded, totalSignups)} />
          <FunnelBar label="3. Submitted ≥1 CME"  value={totalCme}      max={totalSignups}   pct={pct(totalCme, totalSignups)} />
          <FunnelBar label="4. Any Active Plan"   value={anyPlan}       max={totalSignups}   pct={pct(anyPlan, totalSignups)} />
          <FunnelBar label="5. Paying Customer"   value={paidPlan}      max={totalSignups}   pct={pct(paidPlan, totalSignups)} />
        </div>
        <div className="mt-5 grid grid-cols-4 gap-3 text-xs">
          {[
            { drop: "Onboarding drop-off",  val: totalSignups - totalOnboarded,   pctV: pct(totalSignups - totalOnboarded, totalSignups) },
            { drop: "CME activation drop",  val: totalOnboarded - totalCme,       pctV: pct(totalOnboarded - totalCme, totalOnboarded) },
            { drop: "Plan drop-off",        val: totalCme - anyPlan,              pctV: pct(totalCme - anyPlan, totalCme) },
            { drop: "Trial → Paid",         val: anyPlan - paidPlan,              pctV: pct(anyPlan - paidPlan, anyPlan) },
          ].map(({ drop, val, pctV }) => (
            <div key={drop} className="p-3 bg-[#fff7ed] border border-orange-200 rounded-lg">
              <p className="text-orange-800 font-semibold">{val > 0 ? `-${val}` : "0"}</p>
              <p className="text-orange-700 mt-0.5">{drop}</p>
              <p className="text-orange-600 mt-0.5">({pctV}% lost)</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Plan distribution */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <h2 className="text-sm font-semibold text-[#0f172a] mb-4">Active Plan Distribution</h2>
          {Object.keys(planDist).length === 0 ? (
            <p className="text-sm text-[#64748b]">No active subscriptions yet.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {Object.entries(planDist).sort((a, b) => b[1] - a[1]).map(([plan, count]) => {
                const colors: Record<string, string> = { trial: "bg-[#fef9c3] text-[#92400e]", pro: "bg-[#dbeafe] text-[#1d4ed8]", employer: "bg-[#dcfce7] text-[#15803d]" };
                return (
                  <div key={plan} className={`px-4 py-3 rounded-xl ${colors[plan] ?? "bg-[#f1f5f9] text-[#374151]"}`}>
                    <p className="text-xl font-bold">{count}</p>
                    <p className="text-xs font-medium capitalize">{plan}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Trials expiring */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Trials Expiring This Week</h2>
          <p className="text-xs text-[#64748b] mb-3">Convert now — send an email or extend their trial</p>
          {trialsExpiring.length === 0 ? (
            <p className="text-sm text-[#16a34a]">No trials expiring this week ✓</p>
          ) : (
            <div className="space-y-2">
              {trialsExpiring.slice(0, 8).map((t) => {
                const daysLeft = Math.max(0, Math.ceil((new Date(t.trial_ends_at!).getTime() - now.getTime()) / 86400000));
                return (
                  <div key={t.professional_id} className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${daysLeft <= 2 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                      {daysLeft}d
                    </span>
                    <span className="text-xs font-mono text-[#64748b]">{t.professional_id.slice(-8)}</span>
                    <span className="text-xs text-[#374151] capitalize">{t.plan}</span>
                    <a href={`/admin/user-actions`}
                      className="ml-auto text-[10px] text-[#1a56a0] hover:underline whitespace-nowrap">Extend →</a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent upgrades */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Recent Upgrades — Last 30 Days</h2>
          <p className="text-xs text-[#64748b] mb-3">{recentUpgrades.length} new paying customers</p>
          {recentUpgrades.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-2xl mb-2">🎯</p>
              <p className="text-sm text-[#64748b]">No upgrades yet — first one is coming.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentUpgrades.map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
                  <span className="text-xs font-mono text-[#64748b]">{u.professional_id.slice(-8)}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#16a34a] font-medium capitalize">{u.plan}</span>
                  <span className="ml-auto text-[10px] text-[#94a3b8]">
                    {new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Churn */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Recent Cancellations — Last 30 Days</h2>
          <p className="text-xs text-[#64748b] mb-3">{recentCancels.length} cancellations</p>
          {recentCancels.length === 0 ? (
            <p className="text-sm text-[#16a34a]">No cancellations this month ✓</p>
          ) : (
            <div className="space-y-2">
              {recentCancels.map((u, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] flex-shrink-0" />
                  <span className="text-xs font-mono text-[#64748b]">{u.professional_id.slice(-8)}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#dc2626] font-medium capitalize">{u.plan}</span>
                  <span className="ml-auto text-[10px] text-[#94a3b8]">
                    {new Date(u.updated_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top free users to convert */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Top Free Users — Most Engaged, No Plan</h2>
        <p className="text-xs text-[#64748b] mb-4">
          {freeOnboarded.length} onboarded free users · sorted by CME submissions · best upgrade targets
        </p>
        {topFree.length === 0 ? (
          <p className="text-sm text-[#64748b]">All active users are on a paid plan — excellent!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  <th className="text-left px-2 py-2 text-[#64748b] font-medium">Name</th>
                  <th className="text-left px-2 py-2 text-[#64748b] font-medium">Profession</th>
                  <th className="text-left px-2 py-2 text-[#64748b] font-medium">Country</th>
                  <th className="text-right px-2 py-2 text-[#64748b] font-medium">CME Entries</th>
                  <th className="text-left px-2 py-2 text-[#64748b] font-medium">Joined</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {topFree.map((u) => (
                  <tr key={u.auth_id} className="hover:bg-[#f8fafc]">
                    <td className="px-2 py-2 font-medium text-[#0f172a]">{u.full_name ?? "—"}</td>
                    <td className="px-2 py-2 text-[#64748b] capitalize">{u.profession ?? "—"}</td>
                    <td className="px-2 py-2 text-[#64748b]">{u.country_of_residence ?? "—"}</td>
                    <td className="px-2 py-2 text-right">
                      <span className={`font-bold ${(cmeCounts[u.auth_id] ?? 0) >= 5 ? "text-[#1a56a0]" : "text-[#374151]"}`}>
                        {cmeCounts[u.auth_id] ?? 0}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-[#64748b]">
                      {new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-2 py-2">
                      <a href="/admin/user-actions" className="text-[10px] text-[#1a56a0] hover:underline">Action →</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

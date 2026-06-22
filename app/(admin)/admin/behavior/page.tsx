import { createAdminClient } from "@/lib/supabase/server";

export const metadata = { title: "User Behavior — Admin" };
export const dynamic = "force-dynamic";

function pct(num: number, den: number) {
  if (!den) return 0;
  return Math.round((num / den) * 100);
}

function ScoreBar({ value, max, color = "#1a56a0" }: { value: number; max: number; color?: string }) {
  const w = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex-1 bg-[#f1f5f9] rounded-full h-1.5 min-w-0">
      <div className="h-1.5 rounded-full" style={{ width: `${w}%`, backgroundColor: color }} />
    </div>
  );
}

export default async function BehaviorPage() {
  const admin = createAdminClient();

  const now = new Date();
  const day7  = new Date(now.getTime() -  7 * 86400000).toISOString();
  const day30 = new Date(now.getTime() - 30 * 86400000).toISOString();
  const day90 = new Date(now.getTime() - 90 * 86400000).toISOString();

  const [
    allProfilesRes,
    recentCmeRes,
    aiLogsRes,
    planDistRes,
    onboardingStepRes,
    subscriptionsRes,
    recentSignupsRes,
  ] = await Promise.all([
    // All professionals — for churn risk analysis
    admin.from("professional_profiles").select("auth_id, full_name, profession, country_of_residence, onboarding_complete, created_at, profile_completion_pct"),

    // CME submissions last 30 days — for active user identification
    admin.from("cme_activities").select("auth_id, created_at").gte("created_at", day30),

    // AI call logs last 30 days — for feature adoption
    admin.from("ai_call_logs").select("professional_id, action, model, cost_usd, success, created_at").gte("created_at", day30),

    // Plan distribution
    admin.from("subscriptions").select("plan, status, employer_tier"),

    // Onboarding stuck users (last 90 days, not completed)
    admin.from("professional_profiles")
      .select("auth_id, full_name, onboarding_step, created_at")
      .eq("onboarding_complete", false)
      .gte("created_at", day90)
      .order("created_at", { ascending: false })
      .limit(10),

    // Active subscriptions
    admin.from("subscriptions").select("plan, status, created_at").in("status", ["active", "trialing"]),

    // New signups last 7 days
    admin.from("professional_profiles")
      .select("auth_id, full_name, profession, country_of_residence, created_at, onboarding_complete")
      .gte("created_at", day7)
      .order("created_at", { ascending: false })
      .limit(15),
  ]);

  const profiles = allProfilesRes.data ?? [];
  const totalUsers = profiles.length;

  // CME activity maps
  const cme30 = recentCmeRes.data ?? [];
  const activeUserIds = new Set(cme30.map((c) => c.auth_id));
  const cmeByUser: Record<string, number> = {};
  for (const c of cme30) {
    cmeByUser[c.auth_id] = (cmeByUser[c.auth_id] ?? 0) + 1;
  }

  // Power users — top 10 by CME activity last 30 days
  const powerUsers = Object.entries(cmeByUser)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([authId, count]) => ({
      authId,
      count,
      profile: profiles.find((p) => p.auth_id === authId),
    }));

  // Churn risk: onboarded users who haven't submitted a CME in 30+ days
  const onboardedIds = new Set(profiles.filter((p) => p.onboarding_complete).map((p) => p.auth_id));
  const dormantIds = [...onboardedIds].filter((id) => !activeUserIds.has(id));
  const dormantCount = dormantIds.length;

  // Onboarding health
  const completedCount = profiles.filter((p) => p.onboarding_complete).length;
  const incompleteCount = totalUsers - completedCount;

  // Profile completion distribution
  const buckets = { "0-24": 0, "25-49": 0, "50-74": 0, "75-99": 0, "100": 0 };
  for (const p of profiles) {
    const pct_val = p.profile_completion_pct ?? 0;
    if (pct_val === 100) buckets["100"]++;
    else if (pct_val >= 75) buckets["75-99"]++;
    else if (pct_val >= 50) buckets["50-74"]++;
    else if (pct_val >= 25) buckets["25-49"]++;
    else buckets["0-24"]++;
  }
  const maxBucket = Math.max(...Object.values(buckets), 1);

  // AI feature adoption
  const aiLogs = aiLogsRes.data ?? [];
  const aiByAction: Record<string, { calls: number; users: Set<string>; success: number }> = {};
  for (const log of aiLogs) {
    const a = log.action ?? "unknown";
    aiByAction[a] = aiByAction[a] ?? { calls: 0, users: new Set(), success: 0 };
    aiByAction[a].calls++;
    if (log.professional_id) aiByAction[a].users.add(log.professional_id);
    if (log.success) aiByAction[a].success++;
  }
  const aiFeatures = Object.entries(aiByAction)
    .sort((a, b) => b[1].calls - a[1].calls)
    .slice(0, 8);
  const maxAiCalls = Math.max(...aiFeatures.map(([, v]) => v.calls), 1);
  const totalAiUsers = new Set(aiLogs.map((l) => l.professional_id).filter(Boolean)).size;
  const aiAdoptionPct = pct(totalAiUsers, completedCount);

  // Plan breakdown
  const plans = planDistRes.data ?? [];
  const planCount = plans.reduce<Record<string, number>>((acc, p) => {
    const key = p.status === "trialing" ? "trial" : (p.plan ?? "free");
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  // Engagement score = % of onboarded users active in last 30 days
  const engagementScore = pct(activeUserIds.size, completedCount);

  const stuckUsers = onboardingStepRes.data ?? [];
  const newSignups = recentSignupsRes.data ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">User Behavior</h1>
        <p className="text-[#64748b] mt-1">
          Feature adoption, power users, churn risk, and platform engagement — all from your own DB.
        </p>
      </div>

      {/* Engagement Health KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Engagement Rate</p>
          <p className={`text-3xl font-bold ${engagementScore >= 40 ? "text-[#16a34a]" : engagementScore >= 20 ? "text-[#d97706]" : "text-[#dc2626]"}`}>
            {engagementScore}%
          </p>
          <p className="text-xs text-[#64748b] mt-1">Active users last 30 days</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Churn Risk</p>
          <p className={`text-3xl font-bold ${dormantCount === 0 ? "text-[#16a34a]" : dormantCount < 50 ? "text-[#d97706]" : "text-[#dc2626]"}`}>
            {dormantCount}
          </p>
          <p className="text-xs text-[#64748b] mt-1">Onboarded, no CME in 30d</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">AI Adoption</p>
          <p className={`text-3xl font-bold ${aiAdoptionPct >= 20 ? "text-[#16a34a]" : aiAdoptionPct >= 5 ? "text-[#d97706]" : "text-[#dc2626]"}`}>
            {aiAdoptionPct}%
          </p>
          <p className="text-xs text-[#64748b] mt-1">{totalAiUsers} users used AI this month</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Stuck in Onboarding</p>
          <p className={`text-3xl font-bold ${incompleteCount === 0 ? "text-[#16a34a]" : "text-[#d97706]"}`}>
            {incompleteCount}
          </p>
          <p className="text-xs text-[#64748b] mt-1">of {totalUsers} total users</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* AI Feature Adoption */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#0f172a] mb-1">AI Feature Adoption — Last 30 Days</h2>
          <p className="text-xs text-[#64748b] mb-4">{aiLogs.length} AI calls · {totalAiUsers} unique users</p>
          {aiFeatures.length === 0 ? (
            <p className="text-sm text-[#64748b]">No AI calls recorded this month.</p>
          ) : (
            <div className="space-y-3">
              {aiFeatures.map(([action, { calls, users, success }]) => {
                const label = action.replace("ai.", "").replace(/_/g, " ");
                const successRate = pct(success, calls);
                return (
                  <div key={action}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[#374151] capitalize">{label}</span>
                      <div className="flex gap-3 text-xs text-[#64748b]">
                        <span>{users.size} users</span>
                        <span>{calls} calls</span>
                        <span className={successRate >= 95 ? "text-[#16a34a]" : "text-[#d97706]"}>{successRate}%</span>
                      </div>
                    </div>
                    <ScoreBar value={calls} max={maxAiCalls} color="#7c3aed" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Profile Completion Distribution */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Profile Completion Distribution</h2>
          <p className="text-xs text-[#64748b] mb-4">How complete are user profiles? ({totalUsers} total)</p>
          <div className="space-y-3">
            {Object.entries(buckets).map(([range, count]) => (
              <div key={range} className="flex items-center gap-3">
                <span className="text-xs text-[#374151] w-16 flex-shrink-0">{range}%</span>
                <ScoreBar value={count} max={maxBucket} color={range === "100" ? "#16a34a" : range === "75-99" ? "#1a56a0" : range === "50-74" ? "#d97706" : "#dc2626"} />
                <span className="text-xs font-semibold text-[#374151] w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan Distribution */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-4">Plan Distribution (Active + Trialing)</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(planCount).map(([plan, count]) => {
            const colors: Record<string, string> = {
              free: "bg-[#f1f5f9] text-[#374151]",
              trial: "bg-[#fef9c3] text-[#92400e]",
              pro: "bg-[#dbeafe] text-[#1d4ed8]",
              employer: "bg-[#dcfce7] text-[#15803d]",
            };
            const pctVal = pct(count, totalUsers);
            return (
              <div key={plan} className={`flex flex-col items-center px-5 py-3 rounded-xl ${colors[plan] ?? "bg-[#f1f5f9] text-[#374151]"}`}>
                <span className="text-2xl font-bold">{count}</span>
                <span className="text-xs font-medium capitalize">{plan}</span>
                <span className="text-xs opacity-70">{pctVal}%</span>
              </div>
            );
          })}
          <div className="flex flex-col items-center px-5 py-3 rounded-xl bg-[#f0f4f8] text-[#64748b]">
            <span className="text-2xl font-bold">{totalUsers - Object.values(planCount).reduce((a, b) => a + b, 0)}</span>
            <span className="text-xs font-medium">Free (no sub)</span>
            <span className="text-xs opacity-70">{pct(totalUsers - Object.values(planCount).reduce((a, b) => a + b, 0), totalUsers)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Power Users */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Power Users — Last 30 Days</h2>
          <p className="text-xs text-[#64748b] mb-4">Most CME submissions — most engaged professionals</p>
          {powerUsers.length === 0 ? (
            <p className="text-sm text-[#64748b]">No CME activity this month.</p>
          ) : (
            <div className="space-y-2">
              {powerUsers.map(({ authId, count, profile }, i) => (
                <div key={authId} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#94a3b8] w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#0f172a] truncate">
                      {profile?.full_name ?? `User …${authId.slice(-6)}`}
                    </p>
                    <p className="text-[10px] text-[#64748b] capitalize">
                      {profile?.profession ?? "—"} · {profile?.country_of_residence ?? "—"}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#1a56a0] whitespace-nowrap">{count} CME</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Users Stuck in Onboarding */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#0f172a] mb-1">Stuck in Onboarding — Last 90 Days</h2>
          <p className="text-xs text-[#64748b] mb-4">Signed up but never completed setup (most recent first)</p>
          {stuckUsers.length === 0 ? (
            <p className="text-sm text-[#16a34a]">All recent users completed onboarding ✓</p>
          ) : (
            <div className="space-y-2">
              {stuckUsers.map((u) => {
                const daysSince = Math.floor((now.getTime() - new Date(u.created_at).getTime()) / 86400000);
                return (
                  <div key={u.auth_id} className="flex items-center gap-3">
                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full bg-[#fef9c3] text-[10px] font-bold text-[#92400e]">
                      {u.onboarding_step ?? 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#0f172a] truncate">{u.full_name ?? "Unnamed"}</p>
                      <p className="text-[10px] text-[#64748b]">Step {u.onboarding_step ?? 1}/7 · {daysSince}d ago</p>
                    </div>
                    <a
                      href={`/admin/professionals?search=${u.auth_id}`}
                      className="text-[10px] text-[#1a56a0] hover:underline whitespace-nowrap"
                    >
                      View →
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Signups Feed */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#0f172a] mb-1">New Signups — Last 7 Days</h2>
        <p className="text-xs text-[#64748b] mb-4">{newSignups.length} new users</p>
        {newSignups.length === 0 ? (
          <p className="text-sm text-[#64748b]">No new signups this week.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  <th className="text-left px-2 py-2 text-[#64748b] font-medium">Name</th>
                  <th className="text-left px-2 py-2 text-[#64748b] font-medium">Profession</th>
                  <th className="text-left px-2 py-2 text-[#64748b] font-medium">Country</th>
                  <th className="text-left px-2 py-2 text-[#64748b] font-medium">Signed Up</th>
                  <th className="text-left px-2 py-2 text-[#64748b] font-medium">Onboarded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {newSignups.map((u) => (
                  <tr key={u.auth_id} className="hover:bg-[#f8fafc]">
                    <td className="px-2 py-2 font-medium text-[#0f172a]">{u.full_name ?? "—"}</td>
                    <td className="px-2 py-2 text-[#64748b] capitalize">{u.profession ?? "—"}</td>
                    <td className="px-2 py-2 text-[#64748b]">{u.country_of_residence ?? "—"}</td>
                    <td className="px-2 py-2 text-[#64748b] whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-2 py-2">
                      <span className={`px-2 py-0.5 rounded-full font-medium ${u.onboarding_complete ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fef9c3] text-[#92400e]"}`}>
                        {u.onboarding_complete ? "Yes" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Churn risk panel */}
      {dormantCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-amber-900 mb-1">
            ⚠ {dormantCount} Users at Churn Risk
          </h2>
          <p className="text-xs text-amber-800 mb-3">
            These users completed onboarding but haven&apos;t submitted a CME activity in the last 30 days.
            Consider a re-engagement email or push notification campaign.
          </p>
          <div className="flex gap-3">
            <a
              href="/admin/notification-queue"
              className="text-xs px-3 py-1.5 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition-colors"
            >
              Send Re-engagement Push →
            </a>
            <a
              href="/admin/analytics"
              className="text-xs px-3 py-1.5 border border-amber-300 text-amber-900 rounded-lg hover:bg-amber-100 transition-colors"
            >
              View Full Analytics
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

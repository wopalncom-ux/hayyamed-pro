import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const admin = createAdminClient();
  const { data } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["founder", "master_admin", "super_admin"])
    .maybeSingle();
  if (!data) redirect("/dashboard");
}

function fmt(n: number) {
  return n < 0.01 ? `$${n.toFixed(4)}` : `$${n.toFixed(2)}`;
}

export default async function AiCostsPage() {
  await requireAdmin();
  const admin = createAdminClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400_000).toISOString();

  const [monthRes, allTimeRes] = await Promise.all([
    admin
      .from("ai_call_logs")
      .select("action, model, cost_usd, success, latency_ms, professional_id, created_at")
      .gte("created_at", monthStart)
      .order("created_at", { ascending: false }),
    admin
      .from("ai_call_logs")
      .select("cost_usd, success")
      .order("created_at", { ascending: false }),
  ]);

  const logs = monthRes.data ?? [];
  const allLogs = allTimeRes.data ?? [];

  // Totals
  const totalCostMonth = logs.reduce((s, r) => s + (r.cost_usd ?? 0), 0);
  const totalCallsMonth = logs.length;
  const successRate = totalCallsMonth > 0
    ? Math.round((logs.filter((r) => r.success).length / totalCallsMonth) * 100)
    : 100;
  const avgLatencyMs = logs.length > 0
    ? Math.round(logs.reduce((s, r) => s + (r.latency_ms ?? 0), 0) / logs.length)
    : 0;
  const totalCostAllTime = allLogs.reduce((s, r) => s + (r.cost_usd ?? 0), 0);

  // By model
  const byModel: Record<string, { calls: number; cost: number }> = {};
  for (const r of logs) {
    const m = r.model ?? "unknown";
    byModel[m] = byModel[m] ?? { calls: 0, cost: 0 };
    byModel[m].calls++;
    byModel[m].cost += r.cost_usd ?? 0;
  }
  const modelRows = Object.entries(byModel).sort((a, b) => b[1].cost - a[1].cost);

  // By action
  const byAction: Record<string, { calls: number; cost: number }> = {};
  for (const r of logs) {
    const a = r.action ?? "unknown";
    byAction[a] = byAction[a] ?? { calls: 0, cost: 0 };
    byAction[a].calls++;
    byAction[a].cost += r.cost_usd ?? 0;
  }
  const actionRows = Object.entries(byAction).sort((a, b) => b[1].cost - a[1].cost);

  // Daily cost — last 7 days
  const dailyCost: Record<string, number> = {};
  const recentLogs = logs.filter((r) => r.created_at >= sevenDaysAgo);
  for (const r of recentLogs) {
    const day = r.created_at.slice(0, 10);
    dailyCost[day] = (dailyCost[day] ?? 0) + (r.cost_usd ?? 0);
  }
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10);
    days.push(d);
  }
  const maxDayCost = Math.max(...days.map((d) => dailyCost[d] ?? 0), 0.001);

  // Top consumers (last 30 days) — anonymized to first 8 chars of UUID
  const userCost: Record<string, number> = {};
  for (const r of logs) {
    const uid = r.professional_id ?? "system";
    userCost[uid] = (userCost[uid] ?? 0) + (r.cost_usd ?? 0);
  }
  const topUsers = Object.entries(userCost)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const MODEL_COLORS: Record<string, string> = {
    "gemini-2.5-flash-lite": "bg-[#fef9c3] text-[#a16207]",
    "gemini-2.0-flash-lite": "bg-[#fef9c3] text-[#a16207]",
    "gemini-2.0-flash-001":  "bg-[#fef9c3] text-[#a16207]",
    // Historical rows from before the 2026-07-01 Gemini switch
    "claude-haiku-4-5-20251001": "bg-[#dcfce7] text-[#15803d]",
    "claude-haiku-4-5":          "bg-[#dcfce7] text-[#15803d]",
    "claude-sonnet-4-6":         "bg-[#dbeafe] text-[#1d4ed8]",
    "claude-opus-4-8":           "bg-[#ede9fe] text-[#7c3aed]",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f1f3d] mb-1">AI Costs</h1>
        <p className="text-sm text-[#64748b]">
          Real-time spend from <code>ai_call_logs</code> — costs estimated from token counts × model pricing.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">This month</p>
          <p className="text-2xl font-bold text-[#0f1f3d]">{fmt(totalCostMonth)}</p>
          <p className="text-xs text-[#64748b] mt-1">
            {now.toLocaleString("en-GB", { month: "long" })} {now.getFullYear()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">All-time total</p>
          <p className="text-2xl font-bold text-[#0f1f3d]">{fmt(totalCostAllTime)}</p>
          <p className="text-xs text-[#64748b] mt-1">{allLogs.length} total calls</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">Calls this month</p>
          <p className="text-2xl font-bold text-[#1a56a0]">{totalCallsMonth.toLocaleString()}</p>
          <p className="text-xs text-[#64748b] mt-1">{successRate}% success rate</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">Avg latency</p>
          <p className={`text-2xl font-bold ${avgLatencyMs > 5000 ? "text-[#dc2626]" : avgLatencyMs > 2000 ? "text-[#d97706]" : "text-[#16a34a]"}`}>
            {avgLatencyMs > 0 ? `${(avgLatencyMs / 1000).toFixed(1)}s` : "—"}
          </p>
          <p className="text-xs text-[#64748b] mt-1">p50 this month</p>
        </div>
      </div>

      {/* Daily cost bar chart */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#0f1f3d] mb-4">Daily spend — last 7 days</h2>
        {days.every((d) => !dailyCost[d]) ? (
          <p className="text-sm text-[#64748b]">No AI calls in the last 7 days.</p>
        ) : (
          <div className="flex items-end gap-2 h-24">
            {days.map((day) => {
              const cost = dailyCost[day] ?? 0;
              const heightPct = (cost / maxDayCost) * 100;
              const label = new Date(day + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric" });
              return (
                <div key={day} className="flex flex-col items-center flex-1 gap-1">
                  <span className="text-[9px] text-[#64748b]">{cost > 0 ? fmt(cost) : ""}</span>
                  <div className="w-full rounded-t-sm bg-[#1a56a0]" style={{ height: `${Math.max(heightPct, 2)}%` }} />
                  <span className="text-[9px] text-[#64748b] text-center leading-tight">{label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* By model */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#0f1f3d] mb-4">Cost by model — this month</h2>
          {modelRows.length === 0 ? (
            <p className="text-sm text-[#64748b]">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {modelRows.map(([model, { calls, cost }]) => {
                const pct = totalCostMonth > 0 ? (cost / totalCostMonth) * 100 : 0;
                const badge = MODEL_COLORS[model] ?? "bg-[#f1f5f9] text-[#374151]";
                const shortLabel = model
                  .replace("claude-", "").replace("-4-5-20251001", " 4.5").replace("-4-5", " 4.5").replace("-4-6", " 4.6").replace("-4-8", " 4.8")
                  .replace("gemini-", "Gemini ").replace("-lite", " Lite").replace("-001", "");
                return (
                  <div key={model}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge}`}>
                        {shortLabel}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-[#64748b]">
                        <span>{calls} calls</span>
                        <span className="font-semibold text-[#0f1f3d]">{fmt(cost)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1a56a0] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* By action */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#0f1f3d] mb-4">Cost by feature — this month</h2>
          {actionRows.length === 0 ? (
            <p className="text-sm text-[#64748b]">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {actionRows.map(([action, { calls, cost }]) => {
                const pct = totalCostMonth > 0 ? (cost / totalCostMonth) * 100 : 0;
                const shortAction = action.replace("ai.", "").replace(/_/g, " ");
                return (
                  <div key={action}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[#374151] capitalize">{shortAction}</span>
                      <div className="flex items-center gap-3 text-xs text-[#64748b]">
                        <span>{calls} calls</span>
                        <span className="font-semibold text-[#0f1f3d]">{fmt(cost)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div className="h-full bg-[#d97706] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top consumers */}
      {topUsers.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#0f1f3d] mb-1">Top AI consumers — this month</h2>
          <p className="text-xs text-[#64748b] mb-4">User IDs truncated for privacy. No PII is sent to AI APIs.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  <th className="text-left text-xs text-[#64748b] pb-2 font-medium">Professional ID</th>
                  <th className="text-right text-xs text-[#64748b] pb-2 font-medium">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {topUsers.map(([uid, cost]) => (
                  <tr key={uid}>
                    <td className="py-2 text-xs font-mono text-[#374151]">{uid.slice(0, 8)}…</td>
                    <td className="py-2 text-right text-xs font-semibold text-[#0f1f3d]">{fmt(cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalCallsMonth === 0 && (
        <div className="mt-6 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-[#92400e]">No AI calls logged this month.</p>
          <p className="text-xs text-[#92400e] mt-1">
            AI calls are logged automatically via <code>logAiCall()</code> in each AI route.
            If calls are happening but not appearing here, check that the <code>ai_call_logs</code> table exists (migration 041+).
          </p>
        </div>
      )}
    </div>
  );
}

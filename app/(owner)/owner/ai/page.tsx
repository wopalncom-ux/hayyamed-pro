import { createAdminClient } from "@/lib/supabase/server";
import { requireOwnerAuth } from "@/lib/ownerAuth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Command Center",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function OwnerAiPage() {
  await requireOwnerAuth();
  const admin = createAdminClient();

  const now = new Date();
  const day7Ago  = new Date(now.getTime() - 7 * 86400_000).toISOString();
  const day30Ago = new Date(now.getTime() - 30 * 86400_000).toISOString();

  const [
    totalCallsRes, calls30dRes, failedRes,
    costRes, cost30dRes,
    byModelRes, byActionRes, recentCallsRes,
    consentRes,
  ] = await Promise.all([
    admin.from("ai_call_logs").select("id", { count: "exact", head: true }),
    admin.from("ai_call_logs").select("id", { count: "exact", head: true }).gte("created_at", day30Ago),
    admin.from("ai_call_logs").select("id", { count: "exact", head: true }).eq("success", false).gte("created_at", day30Ago),
    admin.from("ai_call_logs").select("cost_usd"),
    admin.from("ai_call_logs").select("cost_usd").gte("created_at", day30Ago),
    admin.from("ai_call_logs").select("model, cost_usd, input_tokens, output_tokens").gte("created_at", day30Ago),
    admin.from("ai_call_logs").select("action, cost_usd").gte("created_at", day30Ago),
    admin.from("ai_call_logs").select("id, action, model, cost_usd, latency_ms, success, created_at, error_message").order("created_at", { ascending: false }).limit(20),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).eq("ai_consent_given", true),
  ]);

  const totalCost = (costRes.data ?? []).reduce((s, r) => s + (Number(r.cost_usd) || 0), 0);
  const cost30d   = (cost30dRes.data ?? []).reduce((s, r) => s + (Number(r.cost_usd) || 0), 0);

  // Aggregate by model
  const modelAgg: Record<string, { calls: number; cost: number; inputTokens: number; outputTokens: number }> = {};
  for (const r of byModelRes.data ?? []) {
    if (!modelAgg[r.model]) modelAgg[r.model] = { calls: 0, cost: 0, inputTokens: 0, outputTokens: 0 };
    modelAgg[r.model].calls++;
    modelAgg[r.model].cost += Number(r.cost_usd) || 0;
    modelAgg[r.model].inputTokens += r.input_tokens ?? 0;
    modelAgg[r.model].outputTokens += r.output_tokens ?? 0;
  }

  // Aggregate by action
  const actionAgg: Record<string, { calls: number; cost: number }> = {};
  for (const r of byActionRes.data ?? []) {
    if (!actionAgg[r.action]) actionAgg[r.action] = { calls: 0, cost: 0 };
    actionAgg[r.action].calls++;
    actionAgg[r.action].cost += Number(r.cost_usd) || 0;
  }

  const topModels  = Object.entries(modelAgg).sort((a, b) => b[1].calls - a[1].calls);
  const topActions = Object.entries(actionAgg).sort((a, b) => b[1].calls - a[1].calls).slice(0, 8);

  const vertexConfigured = !!process.env.GOOGLE_CLOUD_PROJECT;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">AI Command Center</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Token usage, costs, models, and failure rates</p>
        </div>
        <div className="flex gap-3">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
            vertexConfigured ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
          }`}>
            Gemini: {vertexConfigured ? "✓ Active" : "✗ Not configured"}
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total AI Calls",    value: String(totalCallsRes.count ?? 0),  sub: "all time",         color: "#7e22ce" },
          { label: "Calls (30 days)",   value: String(calls30dRes.count ?? 0),    sub: "last 30 days",     color: "#1a56a0" },
          { label: "Failed (30d)",      value: String(failedRes.count ?? 0),      sub: "API failures",     color: (failedRes.count ?? 0) > 0 ? "#b91c1c" : "#64748b" },
          { label: "Cost (30d)",        value: `$${cost30d.toFixed(2)}`,          sub: "USD, last 30 days", color: cost30d > 50 ? "#b91c1c" : "#15803d" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8] mb-2">{k.label}</p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs text-[#94a3b8] mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By model */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-4">Usage by Model (30 days)</p>
          {topModels.length === 0 ? (
            <p className="text-sm text-[#94a3b8]">No AI calls recorded yet</p>
          ) : (
            <div className="space-y-4">
              {topModels.map(([model, data]) => (
                <div key={model}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-sm font-medium text-[#374151] truncate">{model}</span>
                    <span className="text-xs font-bold text-[#0f172a] tabular-nums flex-shrink-0">
                      ${data.cost.toFixed(3)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                    <span>{data.calls.toLocaleString()} calls</span>
                    <span>·</span>
                    <span>{(data.inputTokens + data.outputTokens).toLocaleString()} tokens</span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-sm">
                <span className="text-[#64748b]">Total cost (all time)</span>
                <span className="font-bold text-[#0f172a]">${totalCost.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* By action */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-4">Top Actions (30 days)</p>
          {topActions.length === 0 ? (
            <p className="text-sm text-[#94a3b8]">No AI calls recorded yet</p>
          ) : (
            <div className="space-y-3">
              {topActions.map(([action, data]) => (
                <div key={action} className="flex items-center justify-between text-sm">
                  <span className="text-[#374151] font-medium truncate max-w-[180px]">{action}</span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[#94a3b8] tabular-nums">{data.calls}</span>
                    <span className="text-[#0f172a] font-bold tabular-nums">${data.cost.toFixed(3)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Consent */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-3">AI Consent (GDPR)</p>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[#64748b]">Users with AI consent:</span>
          <span className="font-bold text-[#0f172a] tabular-nums">{consentRes.count ?? 0}</span>
        </div>
      </div>

      {/* Recent calls log */}
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="px-5 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
          <p className="text-sm font-semibold text-[#0f172a]">Recent AI Calls</p>
          <a href="/admin/ai-costs" className="text-xs text-[#1a56a0] hover:underline font-semibold">Full logs →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748b] uppercase">Action</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748b] uppercase hidden sm:table-cell">Model</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748b] uppercase">Cost</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748b] uppercase hidden md:table-cell">Latency</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748b] uppercase">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#64748b] uppercase hidden lg:table-cell">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {(recentCallsRes.data ?? []).map((call) => (
                <tr key={call.id} className="hover:bg-[#f8fafc]">
                  <td className="px-5 py-3 font-medium text-[#374151] truncate max-w-[160px]">{call.action}</td>
                  <td className="px-5 py-3 text-[#94a3b8] hidden sm:table-cell text-xs">{call.model}</td>
                  <td className="px-5 py-3 tabular-nums text-[#0f172a]">
                    {call.cost_usd ? `$${Number(call.cost_usd).toFixed(4)}` : "—"}
                  </td>
                  <td className="px-5 py-3 tabular-nums text-[#94a3b8] hidden md:table-cell">
                    {call.latency_ms ? `${call.latency_ms}ms` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    {call.success ? (
                      <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">OK</span>
                    ) : (
                      <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full" title={call.error_message ?? ""}>FAIL</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-[#94a3b8] hidden lg:table-cell">
                    {new Date(call.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { href: "/admin/ai-modules",  label: "AI Modules Config" },
          { href: "/admin/ai-costs",    label: "Full AI Cost Log" },
          { href: "/admin/ai-modules",  label: "Knowledge Base" },
        ].map((l) => (
          <a key={l.href + l.label} href={l.href}
            className="text-center px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white text-sm font-semibold text-[#374151] hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors">
            {l.label} →
          </a>
        ))}
      </div>
    </div>
  );
}

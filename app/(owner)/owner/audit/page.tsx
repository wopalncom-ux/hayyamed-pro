import { createAdminClient } from "@/lib/supabase/server";
import { requireOwnerAuth } from "@/lib/ownerAuth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Logs",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function OwnerAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; action?: string; table?: string }>;
}) {
  await requireOwnerAuth();
  const sp = await searchParams;
  const page   = Math.max(1, parseInt(sp.page ?? "1", 10));
  const limit  = 50;
  const offset = (page - 1) * limit;
  const actionFilter = sp.action ?? "";
  const tableFilter  = sp.table ?? "";

  const admin = createAdminClient();

  // Count total
  let countQuery = admin.from("audit_logs").select("id", { count: "exact", head: true });
  if (actionFilter) countQuery = countQuery.ilike("action", `%${actionFilter}%`);
  if (tableFilter) countQuery = countQuery.eq("target_table", tableFilter);
  const { count: totalCount } = await countQuery;

  // Fetch page
  let dataQuery = admin
    .from("audit_logs")
    .select("id, actor_auth_id, action, target_table, target_id, metadata, created_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (actionFilter) dataQuery = dataQuery.ilike("action", `%${actionFilter}%`);
  if (tableFilter) dataQuery = dataQuery.eq("target_table", tableFilter);
  const { data: logs } = await dataQuery;

  // Unique actors lookup
  const actorIds = [...new Set((logs ?? []).map((l) => l.actor_auth_id).filter(Boolean))];
  const actorMap: Record<string, string> = {};
  if (actorIds.length > 0) {
    const { data: profiles } = await admin
      .from("professional_profiles")
      .select("auth_id, full_name")
      .in("auth_id", actorIds);
    for (const p of profiles ?? []) {
      actorMap[p.auth_id] = p.full_name ?? p.auth_id.slice(0, 8);
    }
  }

  // Stats
  const [todayCountRes, emergencyCountRes, adminCountRes] = await Promise.all([
    admin.from("audit_logs").select("id", { count: "exact", head: true }).gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    admin.from("audit_logs").select("id", { count: "exact", head: true }).ilike("action", "emergency.%"),
    admin.from("audit_logs").select("id", { count: "exact", head: true }).ilike("action", "admin.%"),
  ]);

  const totalPages = Math.ceil((totalCount ?? 0) / limit);

  const sevClass: Record<string, string> = {
    emergency: "bg-red-100 text-red-700",
    admin:     "bg-purple-100 text-purple-700",
    referral:  "bg-blue-100 text-blue-700",
    cme:       "bg-green-100 text-green-700",
    ai:        "bg-violet-100 text-violet-700",
  };

  function getBadgeClass(action: string) {
    for (const [prefix, cls] of Object.entries(sevClass)) {
      if (action.startsWith(prefix)) return cls;
    }
    return "bg-gray-100 text-gray-600";
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Audit & Activity Logs</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Every platform action — append-only, 7-year retention</p>
        </div>
        <a href="/admin/audit-logs" className="text-sm font-semibold text-[#1a56a0] hover:underline">
          Admin Audit View →
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Events",     value: String(totalCount ?? 0),              color: "#1a56a0" },
          { label: "Today",            value: String(todayCountRes.count ?? 0),     color: "#374151" },
          { label: "Emergency Actions",value: String(emergencyCountRes.count ?? 0), color: (emergencyCountRes.count ?? 0) > 0 ? "#b91c1c" : "#64748b" },
          { label: "Admin Actions",    value: String(adminCountRes.count ?? 0),     color: "#7e22ce" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#94a3b8] mb-2">{k.label}</p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
        <form method="GET" className="flex flex-wrap gap-3">
          <input
            name="action"
            defaultValue={actionFilter}
            placeholder="Filter by action (e.g. emergency, cme)"
            className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] w-64"
          />
          <input
            name="table"
            defaultValue={tableFilter}
            placeholder="Filter by table"
            className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] w-48"
          />
          <button
            type="submit"
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1545a0] transition-colors"
          >
            Filter
          </button>
          {(actionFilter || tableFilter) && (
            <a href="/owner/audit" className="text-sm text-[#64748b] hover:text-[#1a56a0] px-3 py-2 rounded-lg border border-[#e2e8f0] transition-colors">
              Clear
            </a>
          )}
        </form>
      </div>

      {/* Log table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#64748b] uppercase">When</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#64748b] uppercase">Actor</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#64748b] uppercase">Action</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#64748b] uppercase hidden md:table-cell">Table</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#64748b] uppercase hidden lg:table-cell">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {(logs ?? []).map((log) => (
                <tr key={log.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-3.5 text-xs text-[#94a3b8] whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString("en-GB", {
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit"
                    })}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium text-[#374151]">
                      {log.actor_auth_id ? (actorMap[log.actor_auth_id] ?? log.actor_auth_id.slice(0, 8) + "…") : "system"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#94a3b8] hidden md:table-cell">
                    {log.target_table ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    {log.metadata ? (
                      <span className="text-[11px] font-mono text-[#94a3b8] truncate max-w-[200px] block">
                        {JSON.stringify(log.metadata).slice(0, 60)}…
                      </span>
                    ) : <span className="text-[#e2e8f0]">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(logs ?? []).length === 0 && (
          <div className="text-center py-16 text-[#94a3b8] text-sm">No audit events found</div>
        )}

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-[#f1f5f9] flex items-center justify-between">
            <p className="text-xs text-[#64748b]">
              Page {page} of {totalPages} · {(totalCount ?? 0).toLocaleString()} total events
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a href={`/owner/audit?page=${page - 1}${actionFilter ? `&action=${actionFilter}` : ""}${tableFilter ? `&table=${tableFilter}` : ""}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc]">
                  Previous
                </a>
              )}
              {page < totalPages && (
                <a href={`/owner/audit?page=${page + 1}${actionFilter ? `&action=${actionFilter}` : ""}${tableFilter ? `&table=${tableFilter}` : ""}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1545a0]">
                  Next
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <p className="text-sm font-semibold text-amber-800 mb-1">Audit Log Policy</p>
        <p className="text-xs text-amber-700">
          This audit log is append-only. No row can be deleted or updated — protected at database level by RLS.
          Retention: 7 years minimum. All admin and emergency actions are logged with actor ID and timestamp.
        </p>
      </div>
    </div>
  );
}

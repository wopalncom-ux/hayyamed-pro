import { createAdminClient } from "@/lib/supabase/server";

const ACTION_PREFIXES = [
  { value: "",              label: "All actions" },
  { value: "cme_activity.", label: "CME activities" },
  { value: "onboarding.",   label: "Onboarding" },
  { value: "subscription.", label: "Subscriptions" },
  { value: "employer.",     label: "Employer" },
  { value: "discount.",     label: "Discounts" },
  { value: "organization.", label: "Organizations" },
  { value: "admin.",        label: "Admin actions" },
  { value: "plan.",         label: "Plan overrides" },
  { value: "auth.",         label: "Auth events" },
];

const DATE_RANGES = [
  { value: "1",  label: "Today" },
  { value: "7",  label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "0",  label: "All time" },
];

const PAGE_SIZE = 50;

function fmtMeta(meta: Record<string, unknown> | null): string {
  if (!meta) return "";
  const pairs = Object.entries(meta)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
    .slice(0, 4);
  return pairs.join(" · ");
}

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; days?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const actionFilter = sp.action ?? "";
  const days = parseInt(sp.days ?? "30", 10);
  const page = Math.max(0, parseInt(sp.page ?? "0", 10));

  const admin = createAdminClient();

  let query = admin
    .from("audit_logs")
    .select("id, actor_auth_id, action, target_table, target_id, metadata, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  if (actionFilter) query = query.like("action", `${actionFilter}%`);
  if (days > 0) {
    const since = new Date(Date.now() - days * 86400000).toISOString();
    query = query.gte("created_at", since);
  }

  const { data: logs, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  // Resolve actor names (deduplicated)
  const actorIds = [...new Set((logs ?? []).map((l) => l.actor_auth_id).filter(Boolean) as string[])];
  const nameMap: Record<string, string> = {};
  if (actorIds.length > 0) {
    const { data: profiles } = await admin
      .from("professional_profiles")
      .select("auth_id, full_name")
      .in("auth_id", actorIds);
    for (const p of profiles ?? []) {
      if (p.auth_id && p.full_name) nameMap[p.auth_id] = p.full_name;
    }
  }

  function buildUrl(overrides: Record<string, string>) {
    const base = new URLSearchParams({
      action: actionFilter,
      days: String(days),
      page: "0",
      ...overrides,
    });
    return `/admin/audit-logs?${base}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Audit Log</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {count !== null ? `${count.toLocaleString()} records` : "—"}{" "}
            · Append-only · 7-year retention
          </p>
        </div>
        <a href="/admin" className="text-sm text-[#1a56a0] hover:underline">← Admin</a>
      </div>

      {/* Filters */}
      <form method="GET" action="/admin/audit-logs" className="flex flex-wrap gap-3 mb-6">
        <select
          name="action"
          defaultValue={actionFilter}
          className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
        >
          {ACTION_PREFIXES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          name="days"
          defaultValue={String(days)}
          className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
        >
          {DATE_RANGES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <input type="hidden" name="page" value="0" />
        <button
          type="submit"
          className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1547a0]"
        >
          Filter
        </button>
        {(actionFilter || days !== 30) && (
          <a
            href="/admin/audit-logs"
            className="text-sm px-4 py-2 rounded-lg bg-[#f1f5f9] text-[#374151] hover:bg-[#e2e8f0] transition-colors"
          >
            Clear
          </a>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Timestamp</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Actor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Action</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Target</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {(logs ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-[#64748b]">
                  No audit records found for this filter.
                </td>
              </tr>
            )}
            {(logs ?? []).map((log) => (
              <tr key={log.id} className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-4 py-3 text-xs text-[#64748b] whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3 text-xs">
                  {log.actor_auth_id ? (
                    <span className="text-[#111] font-medium">
                      {nameMap[log.actor_auth_id] ?? log.actor_auth_id.slice(0, 8) + "…"}
                    </span>
                  ) : (
                    <span className="text-[#94a3b8]">system</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ActionBadge action={log.action} />
                </td>
                <td className="px-4 py-3 text-xs text-[#64748b]">
                  {log.target_table ? (
                    <span>
                      {log.target_table}
                      {log.target_id && (
                        <span className="ml-1 font-mono text-[#94a3b8]">
                          #{log.target_id.slice(0, 8)}
                        </span>
                      )}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-[#64748b] max-w-[300px] truncate">
                  {fmtMeta(log.metadata as Record<string, unknown> | null)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-[#64748b]">
            Page {page + 1} of {totalPages} · {count?.toLocaleString()} total records
          </p>
          <div className="flex gap-2">
            {page > 0 && (
              <a
                href={buildUrl({ page: String(page - 1) })}
                className="text-sm px-3 py-1.5 rounded-lg border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc]"
              >
                ← Previous
              </a>
            )}
            {page + 1 < totalPages && (
              <a
                href={buildUrl({ page: String(page + 1) })}
                className="text-sm px-3 py-1.5 rounded-lg border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc]"
              >
                Next →
              </a>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-[#94a3b8] mt-4">
        Audit logs are append-only. No records can be edited or deleted. Retained for 7 years per platform policy.
      </p>
    </div>
  );
}

function ActionBadge({ action }: { action: string }) {
  const [prefix] = action.split(".");
  const colors: Record<string, string> = {
    cme_activity: "bg-[#e8f0fe] text-[#1a56a0]",
    subscription: "bg-[#dcfce7] text-[#16a34a]",
    onboarding:   "bg-[#f0f7ff] text-[#1547a0]",
    employer:     "bg-[#fef9c3] text-[#92400e]",
    discount:     "bg-[#fdf4ff] text-[#7e22ce]",
    organization: "bg-[#ecfdf5] text-[#059669]",
    admin:        "bg-[#fef2f2] text-[#dc2626]",
    plan:         "bg-[#fff7ed] text-[#d97706]",
    auth:         "bg-[#f1f5f9] text-[#374151]",
  };
  const cls = colors[prefix] ?? "bg-[#f1f5f9] text-[#374151]";
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md font-mono ${cls}`}>
      {action}
    </span>
  );
}

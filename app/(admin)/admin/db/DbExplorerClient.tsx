"use client";
import { useState, useCallback, useEffect } from "react";

const TABLE_GROUPS: Record<string, string[]> = {
  "Users & Profiles": ["professional_profiles", "profile_privacy_settings", "professional_licenses", "certificates"],
  "Organizations":    ["organizations", "organization_members", "employer_link_requests", "employer_required_trainings"],
  "CME / CPD":        ["cme_activities", "cme_wallets", "country_compliance_rules", "compliance_activity_categories"],
  "Subscriptions":    ["subscriptions", "discount_codes"],
  "Marketplace":      ["training_providers", "provider_courses", "courses", "course_enrollments", "course_reviews"],
  "Platform":         ["platform_content", "page_seo_settings", "media_library", "performance_snapshots", "feature_flags"],
  "Notifications":    ["notification_queue", "push_subscriptions", "webhook_endpoints", "webhook_deliveries"],
  "Lead & Growth":    ["waitlist_entries", "demo_requests", "nps_responses"],
  "Security / Ops":   ["audit_logs", "ai_call_logs", "api_keys"],
  "Staff":            ["government_staff", "university_staff"],
};

function cellValue(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v).slice(0, 80);
  return String(v).slice(0, 120);
}

function priorityCols(cols: string[]) {
  const priority = ["id", "auth_id", "full_name", "name", "title", "email", "status", "plan", "role", "created_at"];
  const sorted = [...priority.filter((c) => cols.includes(c)), ...cols.filter((c) => !priority.includes(c))];
  return sorted.slice(0, 8);
}

export default function DbExplorerClient() {
  const [selected, setSelected] = useState<string>("professional_profiles");
  const [data, setData]         = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns]   = useState<string[]>([]);
  const [count, setCount]       = useState<number>(0);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [offset, setOffset]     = useState(0);
  const [search, setSearch]     = useState("");
  const [col, setCol]           = useState("");
  const [detail, setDetail]     = useState<Record<string, unknown> | null>(null);
  const LIMIT = 50;

  const fetchRecords = useCallback(async (table: string, off: number, srch: string, srchCol: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ table, limit: String(LIMIT), offset: String(off) });
      if (srch && srchCol) { params.set("search", srch); params.set("col", srchCol); }
      const res = await fetch(`/api/admin/db/records?${params}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json.data ?? []);
      setColumns(json.columns ?? []);
      setCount(json.count ?? 0);
    } catch (e) { setError((e as Error).message); }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecords(selected, offset, search, col);
  }, [selected, offset, fetchRecords, search, col]);

  const switchTable = (t: string) => {
    setSelected(t); setOffset(0); setSearch(""); setCol(""); setDetail(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    fetchRecords(selected, 0, search, col);
  };

  const visCols = priorityCols(columns);
  const totalPages = Math.ceil(count / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  return (
    <div className="flex gap-0 min-h-[600px] bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 bg-[#f8fafc] border-r border-[#e2e8f0] overflow-y-auto">
        {Object.entries(TABLE_GROUPS).map(([group, tables]) => (
          <div key={group} className="mb-1">
            <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">{group}</p>
            {tables.map((t) => (
              <button
                key={t}
                onClick={() => switchTable(t)}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors truncate ${
                  selected === t
                    ? "bg-[#1a56a0] text-white"
                    : "text-[#374151] hover:bg-[#f0f4f8]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e2e8f0] bg-white">
          <h2 className="text-sm font-semibold text-[#0f172a] mr-2">{selected}</h2>
          <span className="text-xs text-[#64748b]">{count.toLocaleString("en-US")} rows</span>
          <form onSubmit={handleSearch} className="flex gap-2 ml-auto items-center">
            <select
              value={col}
              onChange={(e) => setCol(e.target.value)}
              className="text-xs border border-[#e2e8f0] rounded-lg px-2 py-1.5 bg-white text-[#374151]"
            >
              <option value="">All columns</option>
              {columns.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="text-xs border border-[#e2e8f0] rounded-lg px-3 py-1.5 w-40 outline-none focus:border-[#1a56a0]"
            />
            <button type="submit" className="text-xs px-3 py-1.5 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0]">
              Go
            </button>
            {(search || col) && (
              <button type="button" onClick={() => { setSearch(""); setCol(""); setOffset(0); }}
                className="text-xs px-2 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f0f4f8]">
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
              <div className="text-sm text-[#64748b]">Loading…</div>
            </div>
          )}
          {error && (
            <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}
          {!loading && !error && data.length === 0 && (
            <div className="flex items-center justify-center h-40 text-sm text-[#64748b]">No records found.</div>
          )}
          {data.length > 0 && (
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[#f8fafc] border-b border-[#e2e8f0]">
                <tr>
                  {visCols.map((c) => (
                    <th key={c} className="px-3 py-2 text-left text-[#64748b] font-medium whitespace-nowrap">
                      {c}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left text-[#64748b] font-medium">…</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {data.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => setDetail(row)}
                    className="hover:bg-[#f0f4f8] cursor-pointer transition-colors"
                  >
                    {visCols.map((c) => (
                      <td key={c} className="px-3 py-2 text-[#374151] max-w-[160px] truncate whitespace-nowrap" title={String(row[c] ?? "")}>
                        {cellValue(row[c])}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-[#94a3b8]">→</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {count > LIMIT && (
          <div className="flex items-center gap-3 px-4 py-3 border-t border-[#e2e8f0] bg-white text-xs text-[#64748b]">
            <button
              onClick={() => setOffset(Math.max(0, offset - LIMIT))}
              disabled={offset === 0}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg disabled:opacity-40 hover:bg-[#f0f4f8] text-[#374151]"
            >
              ← Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setOffset(offset + LIMIT)}
              disabled={offset + LIMIT >= count}
              className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg disabled:opacity-40 hover:bg-[#f0f4f8] text-[#374151]"
            >
              Next →
            </button>
            <span className="ml-auto">Showing rows {offset + 1}–{Math.min(offset + LIMIT, count)} of {count}</span>
          </div>
        )}
      </div>

      {/* Record detail slide-in */}
      {detail && (
        <div className="w-80 flex-shrink-0 border-l border-[#e2e8f0] bg-white flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e2e8f0]">
            <span className="text-xs font-semibold text-[#0f172a]">Record Detail</span>
            <button onClick={() => setDetail(null)} className="text-[#94a3b8] hover:text-[#374151] text-lg leading-none">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {Object.entries(detail).map(([k, v]) => (
              <div key={k}>
                <p className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wide">{k}</p>
                <p className="text-xs text-[#0f172a] break-all whitespace-pre-wrap font-mono bg-[#f8fafc] rounded px-2 py-1 mt-0.5">
                  {v === null ? <span className="text-[#94a3b8] italic">null</span> : typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)}
                </p>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-[#e2e8f0]">
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(detail, null, 2))}
              className="w-full text-xs px-3 py-2 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f0f4f8] transition-colors"
            >
              Copy as JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

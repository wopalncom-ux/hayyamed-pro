"use client";
import { useState, useEffect, useCallback } from "react";

type Source = "audit" | "ai" | "webhook";
type Range  = "1h" | "24h" | "7d" | "30d" | "90d";
type Level  = "all" | "success" | "error";

type AuditRow = {
  id: string; created_at: string; actor_auth_id: string | null;
  action: string; target_table: string | null; target_id: string | null; metadata: unknown;
};
type AiRow = {
  id: string; created_at: string; professional_id: string; action: string; model: string;
  cost_usd: number; input_tokens: number; output_tokens: number; latency_ms: number;
  success: boolean; error_message: string | null;
};
type WebhookRow = {
  id: string; created_at: string; endpoint_id: string; event_type: string;
  status_code: number; success: boolean; attempt_count: number; response_body: unknown;
};

const LIMIT = 100;

function ts(v: string) {
  return new Date(v).toLocaleString("en-GB", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function StatusDot({ ok }: { ok: boolean }) {
  return <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${ok ? "bg-[#16a34a]" : "bg-[#dc2626]"}`} />;
}

export default function LogsClient() {
  const [source, setSource] = useState<Source>("audit");
  const [range,  setRange]  = useState<Range>("7d");
  const [level,  setLevel]  = useState<Level>("all");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [data,   setData]   = useState<unknown[]>([]);
  const [count,  setCount]  = useState(0);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async (src: Source, rng: Range, lvl: Level, srch: string, off: number) => {
    setLoading(true);
    setError(null);
    try {
      const p = new URLSearchParams({ source: src, range: rng, level: lvl, offset: String(off), limit: String(LIMIT) });
      if (srch) p.set("search", srch);
      const res = await fetch(`/api/admin/logs?${p}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json.data ?? []);
      setCount(json.count ?? 0);
    } catch (e) { setError((e as Error).message); }
    setLoading(false);
  }, []);

  useEffect(() => {
    setOffset(0);
    setExpanded(null);
    load(source, range, level, search, 0);
  }, [source, range, level, load]); // search triggers on form submit only

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); setOffset(0); load(source, range, level, search, 0);
  };

  const handleClearSearch = () => {
    setSearch(""); setOffset(0); load(source, range, level, "", 0);
  };

  const handleExport = () => {
    const p = new URLSearchParams({ dataset: source === "ai" ? "ai_call_logs" : source === "audit" ? "audit_logs" : "webhook_deliveries" });
    window.open(`/api/admin/exports?${p}`, "_blank");
  };

  const totalPages = Math.ceil(count / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  // AI stats
  const aiRows = source === "ai" ? (data as AiRow[]) : [];
  const totalCost = aiRows.reduce((s, r) => s + (r.cost_usd ?? 0), 0);
  const successRate = aiRows.length ? Math.round(aiRows.filter((r) => r.success).length / aiRows.length * 100) : null;

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-[#e2e8f0] bg-[#f8fafc]">
        {/* Source tabs */}
        <div className="flex gap-1 bg-white border border-[#e2e8f0] rounded-lg p-0.5">
          {(["audit", "ai", "webhook"] as Source[]).map((s) => (
            <button key={s} onClick={() => setSource(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                source === s ? "bg-[#1a56a0] text-white" : "text-[#64748b] hover:text-[#374151]"
              }`}>
              {s === "audit" ? "Audit Log" : s === "ai" ? "AI Calls" : "Webhooks"}
            </button>
          ))}
        </div>

        {/* Range */}
        <div className="flex gap-1">
          {(["1h", "24h", "7d", "30d", "90d"] as Range[]).map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                range === r ? "bg-[#0f172a] text-white" : "text-[#64748b] hover:bg-[#f0f4f8]"
              }`}>
              {r}
            </button>
          ))}
        </div>

        {/* Level */}
        {source !== "audit" && (
          <div className="flex gap-1">
            {(["all", "success", "error"] as Level[]).map((l) => (
              <button key={l} onClick={() => setLevel(l)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  level === l
                    ? l === "error" ? "bg-[#dc2626] text-white" : l === "success" ? "bg-[#16a34a] text-white" : "bg-[#0f172a] text-white"
                    : "text-[#64748b] hover:bg-[#f0f4f8]"
                }`}>
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 ml-auto items-center">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, actor, model…"
            className="text-xs border border-[#e2e8f0] rounded-lg px-3 py-1.5 w-48 outline-none focus:border-[#1a56a0]"
          />
          <button type="submit" className="text-xs px-3 py-1.5 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0]">Go</button>
          {search && (
            <button type="button" onClick={handleClearSearch}
              className="text-xs px-2 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f0f4f8]">✕</button>
          )}
        </form>

        <button onClick={handleExport}
          className="text-xs px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f0f4f8] flex items-center gap-1">
          ↓ CSV
        </button>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-6 px-4 py-2 bg-white border-b border-[#f1f5f9] text-xs text-[#64748b]">
        <span>{count.toLocaleString("en-US")} entries · {currentPage}/{totalPages} pages</span>
        {source === "ai" && aiRows.length > 0 && (
          <>
            <span>Cost: <strong className="text-[#0f172a]">${totalCost.toFixed(4)}</strong></span>
            <span>Success: <strong className={successRate! >= 95 ? "text-[#16a34a]" : "text-[#d97706]"}>{successRate}%</strong></span>
          </>
        )}
        {loading && <span className="ml-auto text-[#1a56a0]">Loading…</span>}
      </div>

      {error && (
        <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      {/* Table: Audit */}
      {source === "audit" && (
        <table className="w-full text-xs">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-[#64748b] font-medium">Time</th>
              <th className="px-3 py-2 text-left text-[#64748b] font-medium">Actor</th>
              <th className="px-3 py-2 text-left text-[#64748b] font-medium">Action</th>
              <th className="px-3 py-2 text-left text-[#64748b] font-medium">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8fafc]">
            {(data as AuditRow[]).map((r) => (
              <>
                <tr key={r.id} onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  className="hover:bg-[#f8fafc] cursor-pointer transition-colors">
                  <td className="px-3 py-2 text-[#64748b] whitespace-nowrap">{ts(r.created_at)}</td>
                  <td className="px-3 py-2 font-mono text-[10px] text-[#374151] max-w-[100px] truncate">{r.actor_auth_id?.slice(-8) ?? "system"}</td>
                  <td className="px-3 py-2 font-medium text-[#0f172a]">{r.action}</td>
                  <td className="px-3 py-2 text-[#64748b]">{r.target_table ?? "—"}</td>
                </tr>
                {expanded === r.id && (
                  <tr key={`${r.id}-detail`}><td colSpan={4} className="px-4 py-3 bg-[#f8fafc]">
                    <pre className="text-[10px] font-mono text-[#374151] whitespace-pre-wrap break-all">
                      {JSON.stringify(r.metadata ?? {}, null, 2)}
                    </pre>
                  </td></tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}

      {/* Table: AI */}
      {source === "ai" && (
        <table className="w-full text-xs">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-[#64748b] font-medium">Time</th>
              <th className="px-3 py-2 text-left text-[#64748b] font-medium">Action</th>
              <th className="px-3 py-2 text-left text-[#64748b] font-medium">Model</th>
              <th className="px-3 py-2 text-right text-[#64748b] font-medium">Tokens In</th>
              <th className="px-3 py-2 text-right text-[#64748b] font-medium">Tokens Out</th>
              <th className="px-3 py-2 text-right text-[#64748b] font-medium">Cost</th>
              <th className="px-3 py-2 text-right text-[#64748b] font-medium">Latency</th>
              <th className="px-3 py-2 text-center text-[#64748b] font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8fafc]">
            {(data as AiRow[]).map((r) => (
              <>
                <tr key={r.id} onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  className="hover:bg-[#f8fafc] cursor-pointer transition-colors">
                  <td className="px-3 py-2 text-[#64748b] whitespace-nowrap">{ts(r.created_at)}</td>
                  <td className="px-3 py-2 font-medium text-[#0f172a]">{r.action}</td>
                  <td className="px-3 py-2"><span className="px-1.5 py-0.5 rounded text-[9px] bg-[#dbeafe] text-[#1d4ed8] font-mono">{r.model?.split("-").slice(-2).join("-") ?? "—"}</span></td>
                  <td className="px-3 py-2 text-right text-[#374151]">{(r.input_tokens ?? 0).toLocaleString("en-US")}</td>
                  <td className="px-3 py-2 text-right text-[#374151]">{(r.output_tokens ?? 0).toLocaleString("en-US")}</td>
                  <td className="px-3 py-2 text-right font-mono text-[#374151]">${(r.cost_usd ?? 0).toFixed(5)}</td>
                  <td className="px-3 py-2 text-right text-[#374151]">{r.latency_ms ? `${r.latency_ms}ms` : "—"}</td>
                  <td className="px-3 py-2 text-center"><StatusDot ok={r.success} /></td>
                </tr>
                {expanded === r.id && r.error_message && (
                  <tr key={`${r.id}-detail`}><td colSpan={8} className="px-4 py-3 bg-red-50">
                    <p className="text-[10px] font-mono text-red-700">{r.error_message}</p>
                  </td></tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}

      {/* Table: Webhooks */}
      {source === "webhook" && (
        <table className="w-full text-xs">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-[#64748b] font-medium">Time</th>
              <th className="px-3 py-2 text-left text-[#64748b] font-medium">Event Type</th>
              <th className="px-3 py-2 text-center text-[#64748b] font-medium">Status</th>
              <th className="px-3 py-2 text-center text-[#64748b] font-medium">HTTP</th>
              <th className="px-3 py-2 text-center text-[#64748b] font-medium">Attempts</th>
              <th className="px-3 py-2 text-left text-[#64748b] font-medium">Endpoint</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f8fafc]">
            {(data as WebhookRow[]).map((r) => (
              <>
                <tr key={r.id} onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  className="hover:bg-[#f8fafc] cursor-pointer transition-colors">
                  <td className="px-3 py-2 text-[#64748b] whitespace-nowrap">{ts(r.created_at)}</td>
                  <td className="px-3 py-2 font-medium text-[#0f172a]">{r.event_type}</td>
                  <td className="px-3 py-2 text-center"><StatusDot ok={r.success} /></td>
                  <td className="px-3 py-2 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-medium ${
                      (r.status_code ?? 0) < 300 ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fee2e2] text-[#dc2626]"
                    }`}>{r.status_code ?? "—"}</span>
                  </td>
                  <td className={`px-3 py-2 text-center font-medium ${(r.attempt_count ?? 1) > 1 ? "text-[#d97706]" : "text-[#374151]"}`}>
                    {r.attempt_count ?? 1}
                  </td>
                  <td className="px-3 py-2 font-mono text-[10px] text-[#94a3b8] truncate max-w-[180px]">{r.endpoint_id}</td>
                </tr>
                {expanded === r.id && (
                  <tr key={`${r.id}-detail`}><td colSpan={6} className={`px-4 py-3 ${r.success ? "bg-[#f8fafc]" : "bg-red-50"}`}>
                    <pre className={`text-[10px] font-mono whitespace-pre-wrap break-all ${r.success ? "text-[#374151]" : "text-red-700"}`}>
                      {typeof r.response_body === "string" ? r.response_body : JSON.stringify(r.response_body ?? {}, null, 2)}
                    </pre>
                  </td></tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}

      {!loading && data.length === 0 && !error && (
        <div className="flex items-center justify-center h-40 text-sm text-[#64748b]">
          No log entries for this filter. Try a longer time range.
        </div>
      )}

      {/* Pagination */}
      {count > LIMIT && (
        <div className="flex items-center gap-3 px-4 py-3 border-t border-[#e2e8f0] bg-white text-xs text-[#64748b]">
          <button onClick={() => { const o = Math.max(0, offset - LIMIT); setOffset(o); load(source, range, level, search, o); }}
            disabled={offset === 0}
            className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg disabled:opacity-40 hover:bg-[#f0f4f8] text-[#374151]">
            ← Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => { const o = offset + LIMIT; setOffset(o); load(source, range, level, search, o); }}
            disabled={offset + LIMIT >= count}
            className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg disabled:opacity-40 hover:bg-[#f0f4f8] text-[#374151]">
            Next →
          </button>
          <span className="ml-auto">Rows {offset + 1}–{Math.min(offset + LIMIT, count)} of {count}</span>
        </div>
      )}
    </div>
  );
}

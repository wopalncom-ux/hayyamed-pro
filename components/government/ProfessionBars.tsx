"use client";

type Row = { name: string; total: number; compliant: number; atRisk: number; nonCompliant: number };

export default function ProfessionBars({ rows }: { rows: Row[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-[#64748b] py-6 text-center">No profession data yet.</p>;
  }
  const top = rows.slice(0, 8);

  return (
    <div className="space-y-3.5">
      {top.map((r) => {
        const c = r.total > 0 ? (r.compliant / r.total) * 100 : 0;
        const a = r.total > 0 ? (r.atRisk / r.total) * 100 : 0;
        const n = r.total > 0 ? (r.nonCompliant / r.total) * 100 : 0;
        const u = Math.max(0, 100 - c - a - n);
        const rate = Math.round(c);
        return (
          <div key={r.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-[#374151] truncate">{r.name}</span>
              <span className="text-xs text-[#64748b] tabular-nums ml-2">
                {r.compliant}/{r.total} · <span className={rate >= 80 ? "text-[#16a34a]" : rate >= 60 ? "text-[#d97706]" : "text-[#dc2626]"}>{rate}%</span>
              </span>
            </div>
            <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-[#f1f5f9]">
              <div style={{ width: `${c}%`, background: "#16a34a" }} />
              <div style={{ width: `${a}%`, background: "#d97706" }} />
              <div style={{ width: `${n}%`, background: "#dc2626" }} />
              <div style={{ width: `${u}%`, background: "#e2e8f0" }} />
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-4 pt-1 text-[11px] text-[#64748b]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#16a34a]" /> Compliant</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#d97706]" /> At risk</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#dc2626]" /> Non-compliant</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#e2e8f0]" /> No data</span>
      </div>
    </div>
  );
}

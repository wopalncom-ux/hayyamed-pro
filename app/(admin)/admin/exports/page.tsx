"use client";
import { useState } from "react";

const EXPORTS = [
  {
    id: "users",
    label: "All Users",
    description: "Every professional_profiles row — name, profession, country, onboarding status, profile completeness",
    icon: "👤",
    supportsDate: false,
  },
  {
    id: "subscriptions",
    label: "Subscriptions",
    description: "All subscription records — plan, status, trial dates, Paddle IDs",
    icon: "💳",
    supportsDate: true,
  },
  {
    id: "cme_activities",
    label: "CME Activities",
    description: "Every submitted CME entry — credits, category, verification status, date range filterable",
    icon: "📚",
    supportsDate: true,
  },
  {
    id: "organizations",
    label: "Organizations",
    description: "All registered hospitals, clinics, universities — name, type, country, verification status",
    icon: "🏥",
    supportsDate: false,
  },
  {
    id: "audit_logs",
    label: "Audit Trail",
    description: "Full audit log export — every admin and system action with actor, action, metadata",
    icon: "🔍",
    supportsDate: true,
  },
  {
    id: "ai_call_logs",
    label: "AI Call Log",
    description: "Every AI API call — model, tokens, cost, latency, success/failure",
    icon: "🤖",
    supportsDate: true,
  },
];

export default function ExportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [dates, setDates] = useState<Record<string, { from: string; to: string }>>({});
  const [downloaded, setDownloaded] = useState<string[]>([]);

  const handleExport = async (id: string) => {
    setDownloading(id);
    try {
      const p = new URLSearchParams({ dataset: id });
      const d = dates[id];
      if (d?.from) p.set("from", d.from);
      if (d?.to)   p.set("to",   d.to);
      const res = await fetch(`/api/admin/exports?${p}`);
      if (!res.ok) { const j = await res.json(); throw new Error(j.error); }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const cd = res.headers.get("Content-Disposition") ?? "";
      const fname = cd.match(/filename="([^"]+)"/)?.[1] ?? `${id}.csv`;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloaded((prev) => [id, ...prev.filter((x) => x !== id)]);
    } catch (e) {
      alert(`Export failed: ${(e as Error).message}`);
    }
    setDownloading(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Data Exports</h1>
        <p className="text-[#64748b] mt-1">
          One-click CSV downloads for any dataset. Max 10,000 rows per export.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPORTS.map((exp) => {
          const d = dates[exp.id] ?? {};
          const isDownloading = downloading === exp.id;
          const wasDone = downloaded.includes(exp.id);

          return (
            <div key={exp.id} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">{exp.icon}</span>
                <div>
                  <h2 className="text-sm font-semibold text-[#0f172a]">{exp.label}</h2>
                  <p className="text-xs text-[#64748b] mt-0.5">{exp.description}</p>
                </div>
              </div>

              {exp.supportsDate && (
                <div className="flex gap-2 mb-4">
                  <div className="flex-1">
                    <label className="block text-[10px] text-[#64748b] mb-1 uppercase font-medium">From</label>
                    <input
                      type="date"
                      value={d.from ?? ""}
                      onChange={(e) => setDates((prev) => ({ ...prev, [exp.id]: { ...prev[exp.id], from: e.target.value } }))}
                      className="w-full text-xs border border-[#e2e8f0] rounded-lg px-3 py-2 outline-none focus:border-[#1a56a0]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-[#64748b] mb-1 uppercase font-medium">To</label>
                    <input
                      type="date"
                      value={d.to ?? ""}
                      onChange={(e) => setDates((prev) => ({ ...prev, [exp.id]: { ...prev[exp.id], to: e.target.value } }))}
                      className="w-full text-xs border border-[#e2e8f0] rounded-lg px-3 py-2 outline-none focus:border-[#1a56a0]"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => handleExport(exp.id)}
                disabled={isDownloading}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  wasDone && !isDownloading
                    ? "bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]"
                    : "bg-[#1a56a0] text-white hover:bg-[#1547a0] disabled:opacity-50"
                }`}
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Exporting…
                  </>
                ) : wasDone ? (
                  "✓ Downloaded — Export Again"
                ) : (
                  `↓ Export ${exp.label} CSV`
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs text-[#64748b]">
        <p className="font-semibold text-[#374151] mb-1">Export Notes</p>
        <ul className="list-disc list-inside space-y-1">
          <li>All exports are limited to 10,000 rows. Use date filters to narrow large datasets.</li>
          <li>Exports contain raw database values — timestamps are in UTC.</li>
          <li>Sensitive fields (passwords, tokens) are never stored in these tables and will not appear in exports.</li>
          <li>All exports are logged in the audit trail for compliance.</li>
        </ul>
      </div>
    </div>
  );
}

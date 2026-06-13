"use client";

import { useState } from "react";
import type { Plan } from "@/lib/planUtils";
import { isPro } from "@/lib/planUtils";
import Link from "next/link";

export default function ExportCsvButton({
  walletId,
  plan,
}: {
  walletId: string;
  plan: Plan;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isPro(plan)) {
    return (
      <Link
        href="/pricing?source=export_csv"
        className="text-xs font-medium border border-[#e2e8f0] text-[#94a3b8] px-3 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors flex items-center gap-1.5"
        title="Upgrade to Pro to export your CME activities"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8a4 4 0 018 0v4H5V8z M5 12h14m-7 4v4" />
        </svg>
        Export CSV
        <span className="text-[10px] font-bold text-[#7c3aed] bg-[#f5f3ff] px-1 py-0.5 rounded">Pro</span>
      </Link>
    );
  }

  async function handleExport() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/export/cme?wallet_id=${encodeURIComponent(walletId)}`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError((json as { error?: string }).error ?? "Export failed");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CME-Export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleExport}
        disabled={loading}
        className="text-xs font-medium border border-[#e2e8f0] text-[#374151] px-3 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors flex items-center gap-1.5 disabled:opacity-50"
        title="Export activities as CSV"
      >
        <svg className="w-3.5 h-3.5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        {loading ? "Exporting…" : "Export CSV"}
      </button>
      {error && (
        <p className="absolute top-full left-0 mt-1 text-xs text-[#dc2626] bg-white border border-[#fecaca] rounded px-2 py-1 whitespace-nowrap z-10">
          {error}
        </p>
      )}
    </div>
  );
}

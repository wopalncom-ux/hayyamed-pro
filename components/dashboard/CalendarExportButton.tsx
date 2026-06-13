"use client";

import { useState } from "react";
import type { Plan } from "@/lib/planUtils";
import { isPro } from "@/lib/planUtils";
import Link from "next/link";

export default function CalendarExportButton({ plan }: { plan: Plan }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isPro(plan)) {
    return (
      <Link
        href="/pricing?source=export_calendar"
        className="text-xs font-medium border border-[#e2e8f0] text-[#94a3b8] px-3 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors flex items-center gap-1.5"
        title="Upgrade to Pro to add CME deadlines to your calendar"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Add to Calendar
        <span className="text-[10px] font-bold text-[#7c3aed] bg-[#f5f3ff] px-1 py-0.5 rounded">Pro</span>
      </Link>
    );
  }

  async function handleExport() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/export/calendar");
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError((json as { error?: string }).error ?? "Export failed");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Hayya-Med-Pro-CME-Calendar.ics";
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
        title="Add CME deadlines and license expiry to Google Calendar / Outlook / Apple Calendar"
      >
        <svg className="w-3.5 h-3.5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {loading ? "Exporting…" : "Add to Calendar"}
      </button>
      {error && (
        <p className="absolute top-full left-0 mt-1 text-xs text-[#dc2626] bg-white border border-[#fecaca] rounded px-2 py-1 whitespace-nowrap z-10">
          {error}
        </p>
      )}
    </div>
  );
}

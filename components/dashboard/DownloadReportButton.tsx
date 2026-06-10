"use client";

import { useState } from "react";

export default function DownloadReportButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pdf/cme-report");
      if (res.status === 403) {
        setError("Pro plan required");
        return;
      }
      if (!res.ok) { setError("Failed to generate report"); return; }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CME-Report-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not generate report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-sm font-medium bg-[#f0f7ff] text-[#1a56a0] border border-[#bfdbfe] px-3 py-1.5 rounded-lg hover:bg-[#dbeafe] disabled:opacity-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {loading ? "Generating…" : "Download PDF Report"}
      </button>
      {error && <span className="text-xs text-[#dc2626]">{error}</span>}
    </div>
  );
}

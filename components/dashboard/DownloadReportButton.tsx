"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import type { Plan } from "@/lib/planUtils";
import { isPro } from "@/lib/subscription";

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function DownloadReportButton({ plan }: { plan?: Plan }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const proUser = plan ? isPro(plan) : true; // default to pro behaviour if no plan passed

  async function handleDownload() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pdf/cme-report");
      if (res.status === 403) {
        track("pdf_report_blocked");
        setError("Pro plan required");
        return;
      }
      if (!res.ok) { setError("Failed to generate report"); return; }

      track("pdf_report_downloaded");
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

  if (!proUser) {
    return (
      <a
        href="/pricing?source=pdf_report"
        onClick={() => track("pdf_report_upgrade_clicked", { source: "cme_page" })}
        title="Upgrade to Pro to download your PDF compliance report"
        className="inline-flex items-center gap-1.5 text-sm font-medium bg-white text-[#64748b] border border-[#e2e8f0] px-3 py-1.5 rounded-lg hover:border-[#1a56a0] hover:text-[#1a56a0] hover:bg-[#f0f7ff] transition-colors group"
      >
        <DownloadIcon />
        <span>PDF Report</span>
        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-[#1a56a0] text-white px-1.5 py-0.5 rounded ml-0.5 group-hover:bg-[#1547a0]">
          <LockIcon />
          Pro
        </span>
      </a>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-sm font-medium bg-[#f0f7ff] text-[#1a56a0] border border-[#bfdbfe] px-3 py-1.5 rounded-lg hover:bg-[#dbeafe] disabled:opacity-50 transition-colors"
      >
        <DownloadIcon />
        {loading ? "Generating…" : "Download PDF Report"}
      </button>
      {error && <span className="text-xs text-[#dc2626]">{error}</span>}
    </div>
  );
}

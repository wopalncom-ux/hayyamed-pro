"use client";

import { useState } from "react";

export default function DownloadPortfolioButton({ isPro, reflectionCount }: { isPro: boolean; reflectionCount: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isPro) {
    return (
      <a
        href="/pricing?source=cpd_portfolio_export"
        className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-xl hover:bg-[#1547a0] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Export Portfolio PDF
        <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">Pro</span>
      </a>
    );
  }

  const download = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pdf/cpd-portfolio");
      if (res.status === 403) { setError("Pro plan required."); return; }
      if (!res.ok) { setError("Failed to generate PDF. Please try again."); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CPD-Portfolio-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={download}
        disabled={loading}
        className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-xl hover:bg-[#1547a0] disabled:opacity-60 transition-colors"
        title={reflectionCount === 0 ? "Add reflections to export a portfolio" : undefined}
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Generating…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Portfolio PDF
          </>
        )}
      </button>
      {error && <p className="text-xs text-[#dc2626]">{error}</p>}
    </div>
  );
}

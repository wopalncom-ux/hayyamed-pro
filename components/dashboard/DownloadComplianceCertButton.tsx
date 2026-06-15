"use client";

import { useState } from "react";

export default function DownloadComplianceCertButton() {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch("/api/pdf/compliance-certificate");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert((err as { error?: string }).error ?? "Failed to generate certificate.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Compliance-Certificate-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex-shrink-0 text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1547a0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "Generating…" : "Compliance Certificate"}
    </button>
  );
}

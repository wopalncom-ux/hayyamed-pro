"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";

export default function BulkReportButton({
  organizationId,
  orgName,
}: {
  organizationId: string;
  orgName: string;
}) {
  const [loading, setLoading] = useState(false);

  async function download() {
    setLoading(true);
    try {
      const res = await fetch(`/api/pdf/org-report?orgId=${organizationId}`);
      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${orgName.replace(/\s+/g, "-")}-Compliance-Report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={download}
      disabled={loading}
      className="flex items-center gap-2 text-sm font-medium bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#154891] disabled:opacity-60 transition-colors"
    >
      <FileDown className="w-4 h-4" />
      {loading ? "Generating..." : "Download Report"}
    </button>
  );
}

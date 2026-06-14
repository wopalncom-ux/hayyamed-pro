"use client";

import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";

export default function ExportStaffCsvButton({
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
      const res = await fetch(`/api/employer/export-staff-csv?orgId=${organizationId}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${orgName.replace(/[^a-zA-Z0-9-]/g, "-")}-Staff-${new Date().toISOString().slice(0, 10)}.csv`;
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
      className="flex items-center gap-2 text-sm font-medium border border-[#e2e8f0] bg-white text-[#374151] px-4 py-2 rounded-lg hover:bg-[#f8fafc] disabled:opacity-60 transition-colors"
    >
      <FileSpreadsheet className="w-4 h-4 text-[#16a34a]" />
      {loading ? "Exporting…" : "Export CSV"}
    </button>
  );
}

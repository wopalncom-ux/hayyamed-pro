"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export default function AuditExportButton({
  organizationId,
  orgName,
}: {
  organizationId: string;
  orgName: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    track("employer_audit_export_clicked", { orgId: organizationId });
    try {
      const res = await fetch(`/api/employer/audit-export?orgId=${organizationId}&months=12`);
      if (!res.ok) { setLoading(false); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${orgName.replace(/\s+/g, "-")}-Audit-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      title="Export 12-month audit log for compliance evidence (JCI/CBAHI)"
      className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e2e8f0] text-xs font-semibold text-[#374151] rounded-lg hover:bg-[#f8fafc] hover:border-[#1a56a0] transition-colors disabled:opacity-50"
    >
      <svg className="w-3.5 h-3.5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      {loading ? "Exporting…" : "Audit CSV"}
    </button>
  );
}

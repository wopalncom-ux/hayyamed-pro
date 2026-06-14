"use client";

export default function ComplianceReportButton({
  organizationId,
  orgName,
}: {
  organizationId: string;
  orgName: string;
}) {
  return (
    <a
      href={`/api/employer/compliance-report?orgId=${organizationId}`}
      target="_blank"
      rel="noopener noreferrer"
      title={`Download compliance report for ${orgName}`}
      className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e2e8f0] text-xs font-semibold text-[#374151] rounded-lg hover:bg-[#f8fafc] hover:border-[#1a56a0] transition-colors"
    >
      <svg className="w-3.5 h-3.5 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      PDF Report
    </a>
  );
}

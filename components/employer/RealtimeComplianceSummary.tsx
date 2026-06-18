"use client";

import { useRealtimeStaffCompliance } from "@/hooks/useRealtimeStaff";

export default function RealtimeComplianceSummary({
  organizationId,
  initial,
  total,
}: {
  organizationId: string;
  initial: { compliant: number; at_risk: number; non_compliant: number };
  total: number;
}) {
  const counts = useRealtimeStaffCompliance(organizationId, initial);

  function pct(n: number) {
    return total > 0 ? Math.round((n / total) * 100) : 0;
  }

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#0f1f3d]">Staff Compliance</h3>
        <span className="flex items-center gap-1 text-[10px] text-[#64748b]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
          live
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-[#15803d]">Compliant</span>
            <span className="text-[#64748b]">{counts.compliant} ({pct(counts.compliant)}%)</span>
          </div>
          <div className="h-2 bg-[#f0f4f8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#16a34a] rounded-full transition-all duration-500"
              style={{ width: `${pct(counts.compliant)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-[#92400e]">At Risk</span>
            <span className="text-[#64748b]">{counts.at_risk} ({pct(counts.at_risk)}%)</span>
          </div>
          <div className="h-2 bg-[#f0f4f8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#d97706] rounded-full transition-all duration-500"
              style={{ width: `${pct(counts.at_risk)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-[#dc2626]">Non-Compliant</span>
            <span className="text-[#64748b]">{counts.non_compliant} ({pct(counts.non_compliant)}%)</span>
          </div>
          <div className="h-2 bg-[#f0f4f8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#dc2626] rounded-full transition-all duration-500"
              style={{ width: `${pct(counts.non_compliant)}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-[#64748b] mt-3">{total} total staff</p>
    </div>
  );
}

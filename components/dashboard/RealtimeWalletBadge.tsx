"use client";

import { useRealtimeWallet } from "@/hooks/useRealtimeWallet";

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  compliant:     { bg: "bg-[#dcfce7]", text: "text-[#15803d]", label: "Compliant" },
  at_risk:       { bg: "bg-[#fef9c3]", text: "text-[#92400e]", label: "At Risk"   },
  non_compliant: { bg: "bg-[#fee2e2]", text: "text-[#dc2626]", label: "Not Compliant" },
};

export default function RealtimeWalletBadge({
  walletId,
  initialStatus,
  initialCompleted,
  initialRequired,
}: {
  walletId: string;
  initialStatus: string;
  initialCompleted: number;
  initialRequired: number;
}) {
  const wallet = useRealtimeWallet(walletId, {
    compliance_status: initialStatus,
    completed_credits: initialCompleted,
    required_credits: initialRequired,
  });

  const cfg = STATUS_COLORS[wallet.compliance_status] ?? STATUS_COLORS.non_compliant;
  const pct = wallet.required_credits > 0
    ? Math.min(100, Math.round((wallet.completed_credits / wallet.required_credits) * 100))
    : 0;

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
        {cfg.label}
      </span>
      <span className="text-xs text-[#64748b]">
        {wallet.completed_credits}/{wallet.required_credits} credits ({pct}%)
      </span>
      <span className="flex items-center gap-1 text-[10px] text-[#94a3b8]">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse" />
        live
      </span>
    </div>
  );
}

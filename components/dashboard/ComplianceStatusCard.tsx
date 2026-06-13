interface Props {
  completed: number;
  required: number;
  complianceStatus: string;
  cycleEndDate: string | null;
  country: string;
}

export default function ComplianceStatusCard({
  completed,
  required,
  complianceStatus,
  cycleEndDate,
  country,
}: Props) {
  const pct = required > 0 ? Math.min(100, Math.round((completed / required) * 100)) : 0;
  const remaining = Math.max(0, required - completed);

  const daysLeft = cycleEndDate
    ? Math.ceil((new Date(cycleEndDate).getTime() - Date.now()) / 86400000)
    : null;

  // SVG ring parameters
  const R = 32;
  const STROKE = 6;
  const circumference = 2 * Math.PI * R;
  const dashOffset = circumference - (pct / 100) * circumference;

  const statusConfig = {
    compliant:     { color: "#16a34a", bg: "bg-[#dcfce7]", text: "text-[#16a34a]", label: "Compliant" },
    at_risk:       { color: "#d97706", bg: "bg-[#fff7ed]", text: "text-[#d97706]", label: "At Risk" },
    non_compliant: { color: "#dc2626", bg: "bg-[#fef2f2]", text: "text-[#dc2626]", label: "Non-Compliant" },
  }[complianceStatus] ?? { color: "#94a3b8", bg: "bg-[#f1f5f9]", text: "text-[#64748b]", label: "Unknown" };

  const ringColor = statusConfig.color;

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-5 mb-6">
      <div className="flex items-center gap-6 flex-wrap">
        {/* Ring */}
        <div className="flex-shrink-0 relative w-[80px] h-[80px]">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle
              cx="40" cy="40" r={R}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={STROKE}
            />
            <circle
              cx="40" cy="40" r={R}
              fill="none"
              stroke={ringColor}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-[#111]">{pct}%</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-semibold text-[#111]">CME Compliance</h2>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
              {statusConfig.label}
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
            <span className="text-[#111] font-medium">
              {completed} <span className="text-[#64748b] font-normal">/ {required} credits</span>
            </span>
            {remaining > 0 && (
              <span className="text-[#64748b]">
                {remaining} remaining
              </span>
            )}
            {remaining === 0 && (
              <span className="text-[#16a34a] font-medium">All credits earned ✓</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            {daysLeft !== null && (
              <span className={`text-xs ${daysLeft <= 30 ? "text-[#dc2626] font-medium" : daysLeft <= 90 ? "text-[#d97706]" : "text-[#64748b]"}`}>
                {daysLeft <= 0
                  ? "Cycle ended"
                  : `${daysLeft} days until renewal`}
              </span>
            )}
            {country && (
              <span className="text-xs text-[#94a3b8]">{country}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="/dashboard/cme"
            className="text-xs font-semibold bg-[#1a56a0] text-white px-3 py-2 rounded-lg hover:bg-[#1547a0] transition-colors whitespace-nowrap"
          >
            + Log Activity
          </a>
          <a
            href="/dashboard/analytics"
            className="text-xs font-medium border border-[#e2e8f0] text-[#374151] px-3 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors whitespace-nowrap"
          >
            Analytics →
          </a>
        </div>
      </div>
    </div>
  );
}

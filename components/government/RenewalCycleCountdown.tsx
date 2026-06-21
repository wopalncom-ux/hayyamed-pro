"use client";

export default function RenewalCycleCountdown({
  cycleMonths,
  cycleStartMonth,
  nonCompliantCount,
  totalCount,
  countryCode,
}: {
  cycleMonths: number;
  cycleStartMonth: number;
  nonCompliantCount: number;
  totalCount: number;
  countryCode: string;
}) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-based

  // Find next cycle end
  // Cycle runs cycleMonths from cycleStartMonth
  let cycleEndYear = currentYear;
  let cycleEndMonth = cycleStartMonth + cycleMonths - 1;
  if (cycleEndMonth > 12) { cycleEndMonth -= 12; cycleEndYear += 1; }

  // If cycle end has already passed this year, advance by one cycle
  if (
    cycleEndYear < currentYear ||
    (cycleEndYear === currentYear && cycleEndMonth < currentMonth)
  ) {
    cycleEndYear += cycleMonths <= 12 ? 1 : Math.ceil(cycleMonths / 12);
  }

  const cycleEnd = new Date(cycleEndYear, cycleEndMonth - 1, 1);
  const daysLeft = Math.ceil((cycleEnd.getTime() - now.getTime()) / 86400000);
  const monthsLeft = Math.round(daysLeft / 30.44);

  const urgency = daysLeft < 30 ? "critical" : daysLeft < 90 ? "warning" : "ok";

  const bg = urgency === "critical" ? "bg-[#fef2f2] border-[#fecaca]" : urgency === "warning" ? "bg-[#fff7ed] border-[#fed7aa]" : "bg-[#f0fdf4] border-[#bbf7d0]";
  const textColor = urgency === "critical" ? "text-[#dc2626]" : urgency === "warning" ? "text-[#d97706]" : "text-[#16a34a]";
  const icon = urgency === "critical" ? "🚨" : urgency === "warning" ? "⚠️" : "✅";

  return (
    <div className={`${bg} border rounded-xl px-5 py-4 mb-6`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
          <div>
            <p className={`text-sm font-bold ${textColor}`}>
              {monthsLeft > 0 ? `${monthsLeft} month${monthsLeft !== 1 ? "s" : ""}` : `${daysLeft} day${daysLeft !== 1 ? "s" : ""}`} until {countryCode} renewal cycle ends
            </p>
            <p className="text-xs text-[#374151] mt-0.5">
              Cycle period: {cycleMonths} months · Next deadline:{" "}
              {cycleEnd.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-center">
          <div>
            <p className={`text-xl font-bold ${textColor}`}>{nonCompliantCount}</p>
            <p className="text-xs text-[#64748b] mt-0.5">Non-compliant / At risk</p>
          </div>
          <div className="w-px h-8 bg-[#e2e8f0]" />
          <div>
            <p className="text-xl font-bold text-[#374151]">{totalCount > 0 ? Math.round(((totalCount - nonCompliantCount) / totalCount) * 100) : 0}%</p>
            <p className="text-xs text-[#64748b] mt-0.5">On track to comply</p>
          </div>
        </div>
      </div>
    </div>
  );
}

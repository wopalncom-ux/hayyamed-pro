function urgency(days: number) {
  if (days < 0) return { label: "EXPIRED", ring: "border-red-500", text: "text-red-600", bg: "bg-red-50" };
  if (days <= 14) return { label: "Critical", ring: "border-red-500", text: "text-red-600", bg: "bg-red-50" };
  if (days <= 30) return { label: "Urgent", ring: "border-orange-400", text: "text-orange-600", bg: "bg-orange-50" };
  if (days <= 90) return { label: "Upcoming", ring: "border-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50" };
  return { label: "On track", ring: "border-green-400", text: "text-green-700", bg: "bg-green-50" };
}

export default function LicenseCountdownCard({
  licenseExpiry,
  licenseNumber,
  authority,
  profession,
  cycleEnd,
  cmeCompleted,
  cmeRequired,
}: {
  licenseExpiry: string | null;
  licenseNumber: string | null;
  authority: string | null;
  profession: string | null;
  cycleEnd: string | null;
  cmeCompleted: number;
  cmeRequired: number;
}) {
  if (!licenseExpiry) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <h2 className="text-base font-semibold text-[#111] mb-2">License Renewal</h2>
        <p className="text-sm text-[#64748b]">
          No license expiry date set.{" "}
          <a href="/dashboard/licenses" className="text-[#1a56a0] hover:underline">
            Update license details →
          </a>
        </p>
      </div>
    );
  }

  const expiryDate = new Date(licenseExpiry);
  const daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / 86400000);
  const { label, ring, text, bg } = urgency(daysLeft);

  const cycleEndDate = cycleEnd ? new Date(cycleEnd) : null;
  const cmeDaysLeft = cycleEndDate
    ? Math.ceil((cycleEndDate.getTime() - Date.now()) / 86400000)
    : null;
  const cmePct = Math.min(Math.round((cmeCompleted / Math.max(cmeRequired, 1)) * 100), 100);
  const cmeOk = cmeCompleted >= cmeRequired;

  // Ring arc — circumference of r=42 circle = ~264
  const r = 42;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ * (1 - Math.min(Math.max(daysLeft, 0), 365) / 365);

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-[#111]">License Renewal</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            {profession ?? "Professional"} · {authority ?? "Licensing authority"}
            {licenseNumber ? ` · #${licenseNumber}` : ""}
          </p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${bg} ${text} border-current/20`}>
          {label}
        </span>
      </div>

      <div className="flex items-center gap-8">
        {/* Circular countdown */}
        <div className="relative shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={daysLeft < 0 ? "#ef4444" : daysLeft <= 30 ? "#f97316" : daysLeft <= 90 ? "#facc15" : "#22c55e"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-bold leading-none ${text}`}>
              {daysLeft < 0 ? "!" : Math.abs(daysLeft)}
            </span>
            <span className="text-[9px] text-[#64748b] mt-0.5">
              {daysLeft < 0 ? "expired" : "days"}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs text-[#64748b]">Expiry date</p>
            <p className="text-sm font-semibold text-[#111]">
              {expiryDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-[#64748b]">CME progress</p>
              <p className="text-xs font-medium text-[#374151]">
                {cmeCompleted}/{cmeRequired} credits
                {cmeDaysLeft !== null && (
                  <span className="text-[#94a3b8] ml-1">· {cmeDaysLeft}d left</span>
                )}
              </p>
            </div>
            <div className="w-full bg-[#e2e8f0] rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${cmeOk ? "bg-green-500" : "bg-[#1a56a0]"}`}
                style={{ width: `${cmePct}%` }}
              />
            </div>
            {!cmeOk && (
              <p className="text-[10px] text-[#64748b] mt-0.5">
                {cmeRequired - cmeCompleted} credits still needed for renewal
              </p>
            )}
          </div>
        </div>
      </div>

      {daysLeft > 0 && daysLeft <= 90 && (
        <div className={`mt-4 rounded-lg px-3 py-2.5 text-xs ${bg} ${text}`}>
          {daysLeft <= 14
            ? "⚠ Your license expires very soon. Contact your licensing authority immediately."
            : daysLeft <= 30
            ? "Your license expires in less than 30 days. Begin the renewal process now."
            : "Your license expires in less than 90 days. Ensure your CME credits are complete before renewing."}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-[#e2e8f0] flex items-center justify-between">
        <a href="/dashboard/licenses" className="text-xs text-[#1a56a0] hover:underline">
          Update license details
        </a>
        <a href="/dashboard/cme" className="text-xs text-[#1a56a0] hover:underline">
          View CME wallet →
        </a>
      </div>
    </div>
  );
}

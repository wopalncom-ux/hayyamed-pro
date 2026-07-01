"use client";

type Segment = { label: string; value: number; color: string };

export default function ComplianceDonut({
  compliant,
  atRisk,
  nonCompliant,
  unknown,
}: {
  compliant: number;
  atRisk: number;
  nonCompliant: number;
  unknown: number;
}) {
  const segments: Segment[] = [
    { label: "Compliant",     value: compliant,    color: "#16a34a" },
    { label: "At Risk",       value: atRisk,       color: "#d97706" },
    { label: "Non-Compliant", value: nonCompliant, color: "#dc2626" },
    { label: "No Data",       value: unknown,      color: "#cbd5e1" },
  ];
  const total = segments.reduce((s, x) => s + x.value, 0);
  const withData = compliant + atRisk + nonCompliant;
  const rate = withData > 0 ? Math.round((compliant / withData) * 100) : 0;

  const size = 220;
  const stroke = 32;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const arcs =
    total > 0
      ? segments
          .filter((s) => s.value > 0)
          .map((s) => {
            const frac = s.value / total;
            const dash = frac * circumference;
            const arc = {
              color: s.color,
              dasharray: `${dash} ${circumference - dash}`,
              dashoffset: -offset,
            };
            offset += dash;
            return arc;
          })
      : [];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
          {arcs.map((a, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={a.color}
              strokeWidth={stroke}
              strokeDasharray={a.dasharray}
              strokeDashoffset={a.dashoffset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${rate >= 80 ? "text-[#16a34a]" : rate >= 60 ? "text-[#d97706]" : "text-[#dc2626]"}`}>
            {total > 0 ? `${rate}%` : "—"}
          </span>
          <span className="text-sm text-[#64748b] mt-1">compliant</span>
        </div>
      </div>

      <div className="space-y-3 min-w-0 w-full sm:w-auto">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="text-sm text-[#374151] flex-1 font-medium">{s.label}</span>
            <span className="text-base font-bold text-[#111] tabular-nums">{s.value}</span>
            <span className="text-sm text-[#94a3b8] tabular-nums w-10 text-right">
              {total > 0 ? `${Math.round((s.value / total) * 100)}%` : "0%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

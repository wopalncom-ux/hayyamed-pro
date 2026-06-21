"use client";

interface Snapshot {
  date: string;
  total: number;
  compliant: number;
  atRisk: number;
  nonCompliant: number;
}

export default function ComplianceTrendChart({ snapshots }: { snapshots: Snapshot[] }) {
  if (snapshots.length < 2) return null;

  const W = 640;
  const H = 160;
  const PAD = { top: 12, right: 16, bottom: 24, left: 36 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const rates = snapshots.map((s) => (s.total > 0 ? (s.compliant / s.total) * 100 : 0));
  const minRate = Math.max(0, Math.floor(Math.min(...rates) / 10) * 10);
  const maxRate = Math.min(100, Math.ceil(Math.max(...rates) / 10) * 10 + 10);
  const rangeRate = maxRate - minRate || 10;

  const xScale = (i: number) => PAD.left + (i / (snapshots.length - 1)) * chartW;
  const yScale = (v: number) => PAD.top + chartH - ((v - minRate) / rangeRate) * chartH;

  const points = rates.map((r, i) => `${xScale(i)},${yScale(r)}`).join(" ");
  const areaPoints = [
    `${xScale(0)},${PAD.top + chartH}`,
    ...rates.map((r, i) => `${xScale(i)},${yScale(r)}`),
    `${xScale(rates.length - 1)},${PAD.top + chartH}`,
  ].join(" ");

  // y-axis ticks
  const ticks = [minRate, minRate + rangeRate / 2, maxRate].filter((v) => v >= 0 && v <= 100);
  const uniqueTicks = [...new Set(ticks)];

  // x-axis label positions (show start, middle, end)
  const labelIndices = [0, Math.floor((snapshots.length - 1) / 2), snapshots.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      aria-label="Compliance trend chart"
      role="img"
    >
      <defs>
        <linearGradient id="cTrendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a56a0" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1a56a0" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {uniqueTicks.map((tick) => (
        <line
          key={tick}
          x1={PAD.left}
          y1={yScale(tick)}
          x2={PAD.left + chartW}
          y2={yScale(tick)}
          stroke="#e2e8f0"
          strokeWidth={1}
        />
      ))}

      {/* Y-axis labels */}
      {uniqueTicks.map((tick) => (
        <text key={tick} x={PAD.left - 6} y={yScale(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">
          {tick}%
        </text>
      ))}

      {/* Area fill */}
      <polygon points={areaPoints} fill="url(#cTrendGrad)" />

      {/* Line */}
      <polyline points={points} fill="none" stroke="#1a56a0" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

      {/* Dots at data points (only if few snapshots) */}
      {snapshots.length <= 30 &&
        rates.map((r, i) => (
          <circle key={i} cx={xScale(i)} cy={yScale(r)} r={3} fill="#1a56a0" />
        ))}

      {/* X-axis labels */}
      {labelIndices.map((i) => (
        <text
          key={i}
          x={xScale(i)}
          y={H - 4}
          textAnchor={i === 0 ? "start" : i === snapshots.length - 1 ? "end" : "middle"}
          fontSize={9}
          fill="#64748b"
        >
          {new Date(snapshots[i].date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
        </text>
      ))}

      {/* Current rate callout */}
      <text x={xScale(rates.length - 1)} y={yScale(rates[rates.length - 1]) - 10} textAnchor="end" fontSize={11} fontWeight="600" fill="#1a56a0">
        {rates[rates.length - 1].toFixed(1)}%
      </text>
    </svg>
  );
}

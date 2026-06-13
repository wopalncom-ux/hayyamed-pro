"use client";

export interface WeekBucket {
  label: string;
  count: number;
}

export default function WeeklyEnrollmentChart({ data }: { data: WeekBucket[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const BAR_W = 28;
  const GAP = 10;
  const CHART_H = 96;
  const totalW = data.length * (BAR_W + GAP) - GAP;

  return (
    <svg
      viewBox={`0 0 ${totalW} ${CHART_H + 28}`}
      className="w-full"
      style={{ maxHeight: 136 }}
      aria-label="Weekly enrollments"
    >
      {data.map((d, i) => {
        const x = i * (BAR_W + GAP);
        const barH = Math.max(2, (d.count / maxCount) * CHART_H);
        const y = CHART_H - barH;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={BAR_W}
              height={barH}
              rx={3}
              fill={d.count > 0 ? "#1a56a0" : "#e2e8f0"}
              opacity={d.count > 0 ? 0.9 : 1}
            >
              <title>
                {d.label}: {d.count} enrollment{d.count !== 1 ? "s" : ""}
              </title>
            </rect>
            {d.count > 0 && (
              <text
                x={x + BAR_W / 2}
                y={y - 4}
                textAnchor="middle"
                fill="#374151"
                fontSize={9}
                fontFamily="system-ui,-apple-system,sans-serif"
                fontWeight={600}
              >
                {d.count}
              </text>
            )}
            <text
              x={x + BAR_W / 2}
              y={CHART_H + 14}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize={8.5}
              fontFamily="system-ui,-apple-system,sans-serif"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

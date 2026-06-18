"use client";

const CELL = 12;
const GAP = 2;
const LEFT_W = 20;
const TOP_H = 20;
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const COLORS = [
  "#f0f4f8", // 0 credits
  "#bfdbfe", // 1–2
  "#60a5fa", // 3–5
  "#2563eb", // 6–9
  "#1a56a0", // 10+
];

function intensity(credits: number): number {
  if (credits === 0) return 0;
  if (credits <= 2) return 1;
  if (credits <= 5) return 2;
  if (credits <= 9) return 3;
  return 4;
}

type Activity = { activity_date: string; credits: number };

export default function CmeHeatmap({ activities }: { activities: Activity[] }) {
  const creditMap = new Map<string, number>();
  for (const a of activities) {
    const key = a.activity_date.slice(0, 10);
    creditMap.set(key, (creditMap.get(key) ?? 0) + a.credits);
  }

  const msDay = 86_400_000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start 51 weeks ago, aligned to Sunday
  const start = new Date(today.getTime() - 51 * 7 * msDay);
  start.setTime(start.getTime() - start.getDay() * msDay);

  const weeks: { date: Date; credits: number }[][] = [];
  for (let w = 0; w < 52; w++) {
    const week: { date: Date; credits: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start.getTime() + (w * 7 + d) * msDay);
      const key = date.toISOString().slice(0, 10);
      week.push({ date, credits: creditMap.get(key) ?? 0 });
    }
    weeks.push(week);
  }

  // Month label positions
  const monthLabels: { weekIdx: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, w) => {
    const m = week[0].date.getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ weekIdx: w, label: MONTHS[m] });
      lastMonth = m;
    }
  });

  const totalCredits = Array.from(creditMap.values()).reduce((s, v) => s + v, 0);
  const activeDays = creditMap.size;

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-[#111]">Learning Activity — Past 12 Months</h3>
        <span className="text-xs text-[#64748b]">
          {totalCredits} credits · {activeDays} active {activeDays === 1 ? "day" : "days"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: LEFT_W + 52 * (CELL + GAP) + "px" }}>
          {/* Month labels row */}
          <div className="flex" style={{ marginLeft: LEFT_W, height: TOP_H }}>
            {weeks.map((_, w) => {
              const lbl = monthLabels.find((m) => m.weekIdx === w);
              return (
                <div key={w} style={{ width: CELL + GAP, flexShrink: 0 }}>
                  {lbl && (
                    <span style={{ fontSize: 10, color: "#64748b", lineHeight: 1 }}>{lbl.label}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex">
            {/* Day labels */}
            <div style={{ width: LEFT_W, flexShrink: 0 }}>
              {["S","M","T","W","T","F","S"].map((d, i) => (
                <div
                  key={i}
                  style={{
                    height: CELL + GAP,
                    lineHeight: CELL + "px",
                    fontSize: 9,
                    color: "#64748b",
                    textAlign: "right",
                    paddingRight: 4,
                  }}
                >
                  {i === 1 || i === 3 || i === 5 ? d : ""}
                </div>
              ))}
            </div>

            {/* Week columns */}
            <div className="flex" style={{ gap: GAP }}>
              {weeks.map((week, w) => (
                <div key={w} className="flex flex-col" style={{ gap: GAP }}>
                  {week.map((cell, d) => {
                    const isFuture = cell.date > today;
                    const label = isFuture
                      ? ""
                      : `${cell.date.toISOString().slice(0, 10)}: ${cell.credits} credit${cell.credits !== 1 ? "s" : ""}`;
                    return (
                      <div
                        key={d}
                        title={label}
                        style={{
                          width: CELL,
                          height: CELL,
                          borderRadius: 2,
                          backgroundColor: isFuture ? "#f8fafc" : COLORS[intensity(cell.credits)],
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-3" style={{ marginLeft: LEFT_W }}>
            <span style={{ fontSize: 10, color: "#64748b" }}>Less</span>
            {COLORS.map((color, i) => (
              <div key={i} style={{ width: CELL, height: CELL, borderRadius: 2, backgroundColor: color }} />
            ))}
            <span style={{ fontSize: 10, color: "#64748b" }}>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

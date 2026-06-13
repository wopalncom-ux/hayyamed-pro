"use client";

export default function ActivityStreakCard({
  streak,
  atRisk,
}: {
  streak: number;
  atRisk: boolean;
}) {
  if (streak === 0) return null;

  return (
    <div className={`rounded-xl border p-4 flex items-center gap-4 mb-4 ${
      atRisk
        ? "bg-[#fff7ed] border-[#fed7aa]"
        : "bg-[#f0fdf4] border-[#bbf7d0]"
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
        atRisk ? "bg-[#fef3c7]" : "bg-[#dcfce7]"
      }`}>
        {atRisk ? "⚠️" : "🔥"}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${atRisk ? "text-[#92400e]" : "text-[#15803d]"}`}>
          {streak}-week activity streak
          {atRisk && " — at risk"}
        </p>
        <p className={`text-xs mt-0.5 ${atRisk ? "text-[#b45309]" : "text-[#16a34a]"}`}>
          {atRisk
            ? "No activities logged this week — log one before Sunday to keep your streak."
            : `You've logged CME activities for ${streak} consecutive week${streak !== 1 ? "s" : ""}.`}
        </p>
      </div>
      <div className={`text-2xl font-bold flex-shrink-0 ${atRisk ? "text-[#d97706]" : "text-[#16a34a]"}`}>
        {streak}
      </div>
    </div>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  conference: "Conference / Seminar",
  online: "Online / E-Learning",
  workshop: "Workshop (Hands-on)",
  journal: "Journal / Self-Assessment",
  teaching: "Teaching / Lecturing",
  simulation: "Simulation / Skill Lab",
  mandatory: "Mandatory (SCFHS)",
  patient_safety: "Patient Safety",
  other: "Other",
};

interface CategoryRule {
  category_name: string;
  max_credits_per_cycle: number | null;
  min_credits_per_cycle: number;
  accreditation_required: boolean;
  notes: string | null;
}

interface Activity {
  credits: number;
  category: string | null;
  verification_status: string;
}

function Bar({
  pct,
  color,
}: {
  pct: number;
  color: "blue" | "green" | "red" | "yellow";
}) {
  const bg =
    color === "red"
      ? "bg-red-500"
      : color === "green"
      ? "bg-green-500"
      : color === "yellow"
      ? "bg-yellow-400"
      : "bg-[#1a56a0]";
  return (
    <div className="w-full bg-[#e2e8f0] rounded-full h-1.5">
      <div
        className={`${bg} h-1.5 rounded-full transition-all`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

export default function ComplianceGapCard({
  categoryRules,
  activities,
}: {
  categoryRules: CategoryRule[];
  activities: Activity[];
}) {
  // Only count non-rejected activities
  const valid = activities.filter((a) => a.verification_status !== "rejected");

  // Sum credits per category
  const creditsByCategory: Record<string, number> = {};
  let uncategorizedCredits = 0;
  for (const a of valid) {
    if (a.category) {
      creditsByCategory[a.category] = (creditsByCategory[a.category] ?? 0) + a.credits;
    } else {
      uncategorizedCredits += a.credits;
    }
  }

  // Compute per-rule status
  const rows = categoryRules.map((rule) => {
    const earned = creditsByCategory[rule.category_name] ?? 0;
    const cap = rule.max_credits_per_cycle;
    const minReq = rule.min_credits_per_cycle;
    const overcapped = cap !== null && earned > cap;
    const underMin = minReq > 0 && earned < minReq;
    const effective = cap !== null ? Math.min(earned, cap) : earned;
    const pct = cap ? (effective / cap) * 100 : Math.min((earned / 10) * 100, 100);

    return { rule, earned, cap, minReq, overcapped, underMin, effective, pct };
  });

  const gapCount = rows.filter((r) => r.underMin).length;
  const capCount = rows.filter((r) => r.overcapped).length;
  const alertCount = gapCount + capCount;
  const uncategorizedCount = valid.filter((a) => !a.category).length;

  if (categoryRules.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
        <h2 className="text-base font-semibold text-[#111]">Category Breakdown</h2>
        {alertCount > 0 && (
          <span className="text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded-full px-2.5 py-0.5">
            {alertCount} gap{alertCount > 1 ? "s" : ""} need attention
          </span>
        )}
        {alertCount === 0 && (
          <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-0.5">
            All categories on track
          </span>
        )}
      </div>

      <div className="divide-y divide-[#e2e8f0]">
        {rows.map(({ rule, earned, cap, minReq, overcapped, underMin, pct }) => {
          const barColor = underMin
            ? "red"
            : overcapped
            ? "yellow"
            : earned > 0
            ? "green"
            : "blue";

          return (
            <div key={rule.category_name} className="px-6 py-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#111]">
                    {CATEGORY_LABELS[rule.category_name] ?? rule.category_name}
                  </span>
                  {rule.accreditation_required && (
                    <span className="text-[10px] text-[#64748b] border border-[#e2e8f0] rounded px-1.5 py-0.5">
                      Accredited only
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#374151]">
                    {earned}{cap !== null ? ` / ${cap}` : ""} credits
                  </span>
                  {underMin && (
                    <span className="text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded-full px-2 py-0.5">
                      Need {minReq - earned} more
                    </span>
                  )}
                  {overcapped && !underMin && (
                    <span className="text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-2 py-0.5">
                      {earned - (cap ?? 0)} over cap
                    </span>
                  )}
                  {!underMin && !overcapped && earned > 0 && (
                    <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5">
                      ✓
                    </span>
                  )}
                  {cap === null && earned === 0 && (
                    <span className="text-xs text-[#94a3b8]">No cap</span>
                  )}
                </div>
              </div>

              <Bar pct={pct} color={barColor} />

              {underMin && (
                <p className="text-xs text-red-600 mt-1">
                  Minimum {minReq} credits required — {minReq - earned} still needed
                  {rule.notes ? ` · ${rule.notes}` : ""}
                </p>
              )}
              {overcapped && (
                <p className="text-xs text-yellow-700 mt-1">
                  {earned - (cap ?? 0)} credit{earned - (cap ?? 0) > 1 ? "s" : ""} over the{" "}
                  {cap}-credit cap — excess won&apos;t count toward your total
                </p>
              )}
            </div>
          );
        })}

        {uncategorizedCredits > 0 && (
          <div className="px-6 py-4 bg-[#fafafa]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#374151]">
                  Uncategorized activities
                </p>
                <p className="text-xs text-[#64748b] mt-0.5">
                  {uncategorizedCount} activit{uncategorizedCount > 1 ? "ies" : "y"} not yet
                  categorized — category helps verify cap compliance
                </p>
              </div>
              <span className="text-sm font-medium text-[#64748b]">
                {uncategorizedCredits} credits
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

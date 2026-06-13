export function buildRenewalPredictionPrompt({
  profession,
  specialty,
  country,
  requiredCredits,
  completedCredits,
  avgPerMonth,
  daysLeft,
  cycleEndDate,
  recentMonths,
}: {
  profession: string;
  specialty: string | null;
  country: string;
  requiredCredits: number;
  completedCredits: number;
  avgPerMonth: number;
  daysLeft: number | null;
  cycleEndDate: string | null;
  recentMonths: { month: string; credits: number }[];
}): string {
  const remaining = Math.max(0, requiredCredits - completedCredits);
  const pct = Math.round((completedCredits / requiredCredits) * 100);
  const monthsLeft = daysLeft !== null ? daysLeft / 30.4 : null;
  const requiredPace =
    monthsLeft && monthsLeft > 0 && remaining > 0
      ? (remaining / monthsLeft).toFixed(2)
      : null;
  const monthsSummary = recentMonths
    .map((m) => `${m.month}: ${m.credits} credits`)
    .join(", ");

  const paceStatus =
    avgPerMonth === 0
      ? "no activities logged yet"
      : requiredPace
      ? avgPerMonth >= parseFloat(requiredPace)
        ? `on pace (${avgPerMonth.toFixed(1)}/mo vs ${requiredPace} needed)`
        : `behind pace (${avgPerMonth.toFixed(1)}/mo vs ${requiredPace} needed)`
      : `${avgPerMonth.toFixed(1)} credits/month average`;

  return `You are a healthcare CME compliance risk analyst. Analyze the renewal risk for this professional.

Profile: ${profession}${specialty ? ` specializing in ${specialty}` : ""} in ${country}
CME progress: ${completedCredits}/${requiredCredits} credits (${pct}% complete)
${cycleEndDate ? `Renewal deadline: ${cycleEndDate}${daysLeft !== null ? ` (${daysLeft} days remaining, ${monthsLeft?.toFixed(1)} months)` : ""}` : "No renewal date set"}
Pace: ${paceStatus}
Monthly history (recent): ${monthsSummary || "no data"}

Return ONLY valid JSON — no markdown, no text outside the JSON object:

{
  "risk_level": "on_track" | "at_risk" | "critical",
  "credits_shortfall": <number — 0 if on track or already complete>,
  "projected_completion_date": "<ISO date YYYY-MM-DD if they will complete at current pace, null if they will not>",
  "required_monthly_pace": <credits/month needed to finish exactly by deadline, 0 if already complete>,
  "insights": [<2 to 4 specific, actionable strings>],
  "recommendation": "<1-2 sentences — the single most important action>"
}

Risk level rules:
- on_track: projected completion is before the deadline with at least 30 days buffer
- at_risk: projected completion is within 30 days of deadline, OR recent pace dropped more than 20%
- critical: will NOT complete before deadline at current pace, OR less than 30 days left with more than 15% remaining

Insights must be specific to this professional's numbers, not generic advice.
required_monthly_pace: 0 when completedCredits >= requiredCredits.`;
}

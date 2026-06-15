export function buildGapAnalysisPrompt({
  profession,
  specialty,
  country,
  requiredCredits,
  completedCredits,
  cycleEndDate,
  categoryBreakdown,
}: {
  profession: string;
  specialty: string | null;
  country: string;
  requiredCredits: number;
  completedCredits: number;
  cycleEndDate: string | null;
  categoryBreakdown: { category: string; earned: number; cap: number | null; minimum: number }[];
}): string {
  const remaining = Math.max(0, requiredCredits - completedCredits);
  const pct = requiredCredits > 0 ? Math.round((completedCredits / requiredCredits) * 100) : 0;
  const catLines = categoryBreakdown.length
    ? categoryBreakdown
        .map(
          (c) =>
            `  - ${c.category}: ${c.earned} earned` +
            (c.minimum > 0 ? `, min required: ${c.minimum}` : "") +
            (c.cap !== null ? `, cap: ${c.cap}` : "")
        )
        .join("\n")
    : "  No category data available";

  return `You are a GCC healthcare CME compliance specialist. Analyze the CME gap for this professional and provide a structured, actionable gap analysis.

Professional: ${profession}${specialty ? ` (${specialty})` : ""} — ${country}
Overall progress: ${completedCredits}/${requiredCredits} credits (${pct}% complete, ${remaining} remaining)
${cycleEndDate ? `Cycle deadline: ${cycleEndDate}` : "No renewal deadline set"}

Category breakdown:
${catLines}

Return ONLY valid JSON — no markdown, no text outside the JSON object:

{
  "overall_status": "on_track" | "at_risk" | "critical" | "complete",
  "summary": "<2-3 sentence overall assessment tailored to this professional>",
  "category_gaps": [
    {
      "category": "<category name>",
      "earned": <number>,
      "minimum": <number>,
      "shortfall": <number>,
      "priority": "high" | "medium" | "low",
      "recommendation": "<specific actionable recommendation for this category>"
    }
  ],
  "priority_actions": ["<action 1>", "<action 2>", "<action 3>"],
  "suggested_activity_types": [
    {
      "type": "<activity type e.g. online module, conference, journal>",
      "rationale": "<why this suits this professional's gaps and country context>",
      "estimated_credits": <number>
    }
  ],
  "timeline_advice": "<specific advice on how to pace remaining credits given the deadline, or null if no deadline>",
  "authority_specific_tip": "<one specific tip about ${country} authority requirements that this professional may not know>"
}

Rules:
- category_gaps: only include categories with shortfall > 0
- priority_actions: 3 specific, numbered actions — most impactful first
- suggested_activity_types: 2-3 types, not generic (e.g. not just "attend conferences" — name specific accredited providers or formats relevant to ${profession} in ${country})
- authority_specific_tip must be factually accurate to the known requirements for ${country}
- If completedCredits >= requiredCredits: overall_status = "complete", category_gaps only for categories with minimums unmet`;
}

// v1 — CME compliance recommendations prompt
// Generates 3 ranked, actionable recommendations to close CME gaps.

export type ComplianceRecommendationsInput = {
  profession: string;
  specialty: string | null;
  country: string;
  deficit: number;
  totalCompleted: number;
  totalRequired: number;
  daysLeft: number | null;
  gaps: { category: string; earned: number; needed: number }[];
};

export function buildComplianceRecommendationsPrompt(input: ComplianceRecommendationsInput): string {
  const gapLines = input.gaps
    .map((g) => `  - ${g.category}: have ${g.earned}, need ${g.needed} more`)
    .join("\n");

  return `You are a healthcare CME compliance advisor. A ${input.profession}${input.specialty ? ` specializing in ${input.specialty}` : ""} in ${input.country} has these gaps in their current license renewal cycle${input.daysLeft !== null ? ` (${input.daysLeft} days remaining)` : ""}:

Overall deficit: ${input.deficit} credits (${input.totalCompleted}/${input.totalRequired} completed)
Category gaps:
${gapLines}

Give exactly 3 ranked, actionable recommendations to close the highest-priority gaps. Return only valid JSON — no markdown, no text outside the JSON:

{
  "summary": "One sentence summarizing priority and timeline",
  "recommendations": [
    {
      "title": "Specific action title (max 8 words)",
      "category": "exactly one of: conference, online, workshop, journal, teaching, simulation, mandatory, patient_safety, other",
      "credits": <integer — how many credits this activity typically yields>,
      "reason": "One sentence why this closes their specific gap",
      "action_label": "Browse courses",
      "urgency": "high"
    }
  ]
}

Rank by urgency: largest deficit first. Urgency: high (gap > 5 or < 60 days), medium (gap 2-5), low (gap 1-2).`;
}

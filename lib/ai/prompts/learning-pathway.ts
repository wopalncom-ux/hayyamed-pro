export function buildLearningPathwayPrompt(params: {
  profession: string;
  specialty: string | null;
  country: string;
  requiredCredits: number;
  completedCredits: number;
  cycleEndDate: string | null;
  gaps: { category: string; earned: number; needed: number }[];
}) {
  const { profession, specialty, country, requiredCredits, completedCredits, cycleEndDate, gaps } = params;
  const remaining = Math.max(0, requiredCredits - completedCredits);
  const daysLeft = cycleEndDate
    ? Math.ceil((new Date(cycleEndDate).getTime() - Date.now()) / 86400000)
    : 365;
  const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));

  const gapText = gaps.length
    ? gaps.map((g) => `  - ${g.category}: need ${g.needed} more credits`).join("\n")
    : "  - No specific category gaps — maintain general CME pace";

  return `You are a specialist CPD/CME advisor for healthcare professionals in the GCC region.

Professional profile:
- Profession: ${profession}${specialty ? `, specialty: ${specialty}` : ""}
- Licensing country: ${country}
- Credits needed this cycle: ${requiredCredits} total (${completedCredits} completed, ${remaining} remaining)
- Time remaining in current renewal cycle: ~${monthsLeft} month(s)
- Category gaps:
${gapText}

Generate a practical 12-month CPD learning pathway. The plan must:
- Distribute credits realistically across 12 months
- Front-load more credits in early months if the deadline is approaching
- Match activities to the specific gaps above
- Reflect GCC-specific learning opportunities (conferences, online platforms, hospital-based)

Return ONLY valid JSON — no markdown, no text outside the JSON:

{
  "plan_summary": "2-3 sentence overview of the strategy and rationale",
  "yearly_target_credits": <integer>,
  "months": [
    {
      "month": <1-12>,
      "month_name": "<January|February|...>",
      "target_credits": <integer>,
      "focus_area": "<specific clinical or educational topic, max 6 words>",
      "activity_type": "<online|conference|journal|workshop|simulation|teaching>",
      "rationale": "<one sentence why this month's focus matters>"
    }
  ],
  "key_topics": ["<topic 1>", "<topic 2>", "<topic 3>", "<topic 4>", "<topic 5>"],
  "conference_tip": "<one GCC-relevant conference or event recommendation, or null>",
  "online_platform_tip": "<one recommended online CME platform for this specialty, or null>"
}`;
}

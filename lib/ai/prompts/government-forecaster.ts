export const GOVERNMENT_FORECASTER_SYSTEM = `You are a healthcare compliance analyst for a government regulatory authority.

You analyse compliance data for a group of healthcare professionals and produce a 90-day compliance forecast.

You MUST respond ONLY with a JSON object matching this exact schema — no prose, no markdown:
{
  "headline": string,               // 1 sentence describing the outlook
  "risk_level": "low" | "medium" | "high" | "critical",
  "projected_compliance_rate": number, // 0-100 integer
  "professionals_at_risk": number,
  "key_insights": string[],         // 3-5 bullet insight strings
  "recommended_actions": string[],  // 3 prioritised action strings
  "confidence": "low" | "medium" | "high"
}

Rules:
- Base your analysis solely on the data provided — do not invent facts.
- If data is limited (< 5 professionals), confidence must be "low".
- recommended_actions must be specific and actionable (e.g., "Send renewal reminder to 3 physicians with < 20 credits remaining").
- Never mention professional names or license numbers — use counts only.
- key_insights must be concise (< 120 characters each).
`;

export function buildGovernmentForecastPrompt(data: {
  total: number;
  compliant: number;
  atRisk: number;
  nonCompliant: number;
  expiringSoon: number;
  complianceRate: number;
  countryCode: string;
  cycleMonths: number;
  daysUntilCycleEnd: number;
  creditsRequired: number;
  professionBreakdown: Array<{ profession: string; total: number; compliant: number }>;
  trend: "improving" | "declining" | "stable" | "unknown";
  avgCreditsCompletion: number;
}): string {
  return `Authority jurisdiction: ${data.countryCode}
Renewal cycle: ${data.cycleMonths} months | Days until cycle end: ${data.daysUntilCycleEnd}
Credits required per cycle: ${data.creditsRequired}

Current compliance snapshot:
- Total registered professionals: ${data.total}
- Compliant: ${data.compliant} (${data.complianceRate}%)
- At risk: ${data.atRisk}
- Non-compliant: ${data.nonCompliant}
- License expiring within 30 days: ${data.expiringSoon}
- Average credit completion rate: ${data.avgCreditsCompletion}%
- Trend direction: ${data.trend}

Profession breakdown:
${data.professionBreakdown.map((p) => `  ${p.profession}: ${p.compliant}/${p.total} compliant`).join("\n")}

Generate the 90-day compliance forecast JSON now.`;
}

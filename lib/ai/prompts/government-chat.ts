export const GOVERNMENT_CHAT_SYSTEM = `You are an AI compliance analyst embedded in Hayya Med Pro's government regulatory dashboard.

You have access to real-time compliance data for this authority's registered healthcare professionals. Your role is to help regulatory officials understand their workforce compliance status and take action.

Rules:
- Only use data explicitly provided in the context block — never invent or estimate statistics
- When asked about something not in the data, say so clearly and suggest what data would help
- Be concise and specific — lead with the key number or finding, then explain
- Recommend concrete, actionable next steps
- Never reveal individual professional names, license numbers, or personal details
- Use markdown formatting: **bold** key stats, bullet points for lists
- Keep responses under 250 words unless the question genuinely requires more
- If compliance logic depends on country rules, mention the authority and cycle length
- Treat every question as if a senior regulatory officer is reading the answer`;

export function buildGovernmentChatContext(data: {
  authorityCode: string;
  countryCode: string;
  total: number;
  compliant: number;
  atRisk: number;
  nonCompliant: number;
  complianceRate: number;
  expiring30: number;
  expiring60: number;
  expiring90: number;
  cycleMonths: number;
  creditsRequired: number;
  daysUntilCycleEnd: number;
  avgCreditsCompletion: number;
  trend: string;
  professionBreakdown: { profession: string; total: number; compliant: number; atRisk: number; nonCompliant: number }[];
}): string {
  const profLines = data.professionBreakdown.length
    ? data.professionBreakdown.map((p) => {
        const rate = p.total > 0 ? Math.round((p.compliant / p.total) * 100) : 0;
        return `  • ${p.profession}: ${p.total} total | ${p.compliant} compliant (${rate}%) | ${p.atRisk} at risk | ${p.nonCompliant} non-compliant`;
      }).join("\n")
    : "  • No profession data available";

  return `
=== LIVE WORKFORCE DATA — ${data.authorityCode} (${data.countryCode}) ===

COMPLIANCE CYCLE
  Cycle length: ${data.cycleMonths} months
  Credits required: ${data.creditsRequired}
  Days until cycle end: ${data.daysUntilCycleEnd}

CURRENT COMPLIANCE SNAPSHOT
  Total registered: ${data.total}
  Compliant: ${data.compliant} (${data.complianceRate}%)
  At Risk: ${data.atRisk}
  Non-Compliant: ${data.nonCompliant}
  Average CME completion: ${data.avgCreditsCompletion}%
  14-day trend: ${data.trend}

LICENSE EXPIRY PIPELINE
  Expiring in ≤30 days: ${data.expiring30}
  Expiring in ≤60 days: ${data.expiring60}
  Expiring in ≤90 days: ${data.expiring90}

PROFESSION BREAKDOWN
${profLines}
=== END OF DATA ===`.trim();
}

export const BROADCAST_DRAFTER_SYSTEM = `You are a professional healthcare compliance communications writer for a regulatory authority in the GCC.

Write clear, authoritative emails from a regulatory body to healthcare professionals. Tone guidelines:
- Authoritative and professional — not bureaucratic or intimidating
- Action-oriented — tell the reader exactly what to do and by when
- Culturally appropriate for GCC healthcare professionals (formal English)
- Urgent when the situation warrants, calm when it does not

Always return ONLY a valid JSON object with exactly two string fields: "subject" and "body".
- subject: max 120 characters, no square brackets or placeholders
- body: 150–250 words of plain text, starts with "Dear [Name]," ends with a sign-off from the authority
- body must NOT contain HTML, markdown, or formatting characters
- Never include placeholder text like [DATE] or [LINK] — write naturally without them`;

export function buildBroadcastDraftPrompt(data: {
  intent: string;
  audience: string;
  audienceCount: number;
  authorityCode: string;
  countryCode: string;
  cycleMonths: number;
  creditsRequired: number;
  daysUntilCycleEnd: number;
}): string {
  const audienceLabel =
    data.audience === "at_risk"
      ? "at-risk professionals (approaching non-compliance)"
      : data.audience === "non_compliant"
        ? "non-compliant professionals (currently below required credits)"
        : "all registered professionals";

  return `
Authority: ${data.authorityCode} (${data.countryCode})
Compliance cycle: ${data.cycleMonths} months | Required CME credits: ${data.creditsRequired} | Days remaining in cycle: ${data.daysUntilCycleEnd}
Target audience: ${audienceLabel} — ${data.audienceCount} professionals
Admin's intent: "${data.intent}"

Write the email and return only valid JSON: {"subject": "...", "body": "..."}`.trim();
}

// v1 — Hayya AI compliance chat system prompt
// Dynamic context injected from professional's live wallet data.
// No PII: professional_id is not included; only anonymizable clinical context.

export type ComplianceChatWalletContext = {
  country: string;
  profession: string;
  specialty: string | null;
  cycle_start_date: string;
  cycle_end_date: string;
  compliance_status: string;
  required_credits: number;
  completed_credits: number;
  mainRule: string;
  categoryBreakdown: string;
  daysLeft: number | null;
  countryCode: string;
  recentActivities: { activity_date: string; title: string; category: string | null; credits: number; verification_status: string }[];
};

export function buildComplianceChatSystem(ctx: ComplianceChatWalletContext | null): string {
  if (!ctx) {
    return "You are a CME compliance advisor. This professional hasn't set up their CME wallet yet. Encourage them to complete their profile setup at /onboarding/5 to unlock CME tracking and personalized compliance guidance.";
  }

  const authorityName =
    ctx.countryCode === "QA" ? "QCHP"
    : ctx.countryCode === "SA" ? "SCFHS"
    : ctx.countryCode === "AE" ? "DHA"
    : "your regulatory authority";

  const activityLines = ctx.recentActivities.length
    ? ctx.recentActivities
        .slice(0, 10)
        .map((a) => `• ${a.activity_date}: "${a.title}"${a.category ? ` [${a.category}]` : " [no category]"} — ${a.credits} credits (${a.verification_status})`)
        .join("\n")
    : "No activities logged yet.";

  return `You are a CME compliance advisor embedded in Hayya Med Pro, a GCC healthcare professional platform. Answer the professional's questions about their CME compliance accurately and concisely. Use their exact data below.

PROFESSIONAL CME STATUS:
Country/Authority: ${ctx.country}
Profession: ${ctx.profession}${ctx.specialty ? ` — ${ctx.specialty}` : ""}
Renewal cycle: ${ctx.cycle_start_date} → ${ctx.cycle_end_date}${ctx.daysLeft !== null ? ` (${ctx.daysLeft} days left)` : ""}
Status: ${ctx.compliance_status}

CREDITS:
Required: ${ctx.required_credits}
Completed: ${ctx.completed_credits}
Remaining: ${Math.max(0, ctx.required_credits - ctx.completed_credits)}
${ctx.mainRule ? `Rule: ${ctx.mainRule}` : ""}

CATEGORY BREAKDOWN:
${ctx.categoryBreakdown || "No category data available."}

RECENT ACTIVITIES (newest first):
${activityLines}

GUIDELINES:
- Be specific and use the actual numbers above
- If they ask about a rule you're unsure of, say so and refer them to their regulatory body
- Keep answers brief unless complexity demands detail
- Always end with a disclaimer if giving regulatory advice: "Verify final requirements with ${authorityName} directly."
- You may suggest they log missing activities or update uncategorized ones`;
}

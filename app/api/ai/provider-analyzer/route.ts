import { NextRequest } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  organizationId: z.string().uuid(),
  analysisType: z.enum(["demand_prediction", "gap_analysis", "revenue_report", "full_report"]),
});

const ResponseSchema = z.object({
  summary: z.string(),
  demandScore: z.number().min(0).max(100),
  topDemandedSpecialties: z.array(z.string()),
  gapOpportunities: z.array(
    z.object({
      area: z.string(),
      demandLevel: z.enum(["very_high", "high", "medium", "low"]),
      estimatedMonthlyLearners: z.number(),
      recommendedAction: z.string(),
    })
  ),
  revenueInsights: z.object({
    highValueCategories: z.array(z.string()),
    suggestedPricingTier: z.string(),
    estimatedMonthlyRevenuePotential: z.string(),
  }),
  recommendations: z.array(z.string()),
});

export type ProviderAnalysisResult = z.infer<typeof ResponseSchema>;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const raw = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) return new Response("Invalid request", { status: 400 });

  const { organizationId, analysisType } = parsed.data;

  const admin = createAdminClient();

  // Verify caller is training_provider_admin for this org
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .eq("organization_id", organizationId)
    .eq("role", "training_provider_admin")
    .maybeSingle();

  if (!member) return new Response("Forbidden", { status: 403 });

  const rl = await checkAndLogRateLimit({
    action: "ai_provider_analyzer",
    userId: user.id,
    maxPerHour: 20,
  });
  if (!rl.allowed) {
    return Response.json(
      { error: "Rate limit reached." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "AI not configured." }, { status: 503 });
  }

  // Fetch provider's course enrollment and CME activity data (anonymized aggregates)
  const { data: courses } = await admin
    .from("marketplace_courses")
    .select("id, title, specialty, category, price, status, enrolled_count, completion_rate")
    .eq("provider_id", organizationId)
    .eq("status", "active");

  // Fetch anonymized demand signals from platform wallets (what professions/countries need)
  const { data: walletAggregates } = await admin
    .from("cme_wallets")
    .select("country, profession, compliance_status")
    .limit(500);

  const totalCourses = courses?.length ?? 0;
  const avgEnrollment = totalCourses > 0
    ? Math.round((courses ?? []).reduce((sum, c) => sum + (c.enrolled_count ?? 0), 0) / totalCourses)
    : 0;

  const specialtyDemand: Record<string, number> = {};
  const countryProfessions: Record<string, number> = {};

  for (const w of walletAggregates ?? []) {
    const key = `${w.profession}`;
    specialtyDemand[key] = (specialtyDemand[key] ?? 0) + 1;

    const ck = `${w.country}`;
    countryProfessions[ck] = (countryProfessions[ck] ?? 0) + 1;
  }

  const topDemand = Object.entries(specialtyDemand)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([k, v]) => `${k} (${v} professionals)`)
    .join(", ");

  const topCountries = Object.entries(countryProfessions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k, v]) => `${k} (${v})`)
    .join(", ");

  const coursesSummary =
    totalCourses > 0
      ? (courses ?? [])
          .slice(0, 10)
          .map((c) => `"${c.title}" — ${c.specialty ?? "General"}, enrolled: ${c.enrolled_count ?? 0}, completion: ${c.completion_rate ?? 0}%`)
          .join("\n")
      : "No active courses yet.";

  const aggregateContext = `
Training Provider Analysis for: ${organizationId}
Analysis type: ${analysisType}

Provider's active courses (${totalCourses} total, avg ${avgEnrollment} enrollments):
${coursesSummary}

Platform demand signals (top professions seeking CME):
${topDemand || "No data yet"}

Top markets by professional count: ${topCountries || "No data yet"}
`;

  const systemPrompt = `You are an AI business intelligence analyst for a healthcare CME marketplace in the GCC region. You analyze anonymized, aggregate market demand data and training provider performance to provide actionable growth insights.

Return valid JSON matching EXACTLY this schema:
{
  "summary": "string (2-3 sentence executive summary)",
  "demandScore": number (0-100, market opportunity strength),
  "topDemandedSpecialties": ["string", ...] (top 5 specialties with unmet demand),
  "gapOpportunities": [
    {
      "area": "string (specific CME topic or specialty)",
      "demandLevel": "very_high|high|medium|low",
      "estimatedMonthlyLearners": number,
      "recommendedAction": "string (specific action for this provider)"
    }
  ] (3-5 gaps),
  "revenueInsights": {
    "highValueCategories": ["string", ...] (3-4 categories),
    "suggestedPricingTier": "string (e.g., 'QAR 150-300 per course')",
    "estimatedMonthlyRevenuePotential": "string (e.g., 'QAR 15,000-25,000')"
  },
  "recommendations": ["string", ...] (4-5 specific, actionable items)
}

Use GCC context: QCHP, DHA, SCFHS requirements. Focus on practical opportunities for a CME training provider. Demandscores above 70 indicate strong market opportunity.`;

  const startTime = Date.now();

  try {
    const claude = getAnthropicClient();
    const response = await claude.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 1200,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Analyze this training provider's market position and return JSON:\n${aggregateContext}`,
        },
      ],
    });

    const rawText =
      response.content[0]?.type === "text" ? response.content[0].text : "{}";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Invalid AI response format." }, { status: 502 });
    }

    const aiData = JSON.parse(jsonMatch[0]);
    const validated = ResponseSchema.safeParse(aiData);

    if (!validated.success) {
      return Response.json({ error: "AI response validation failed." }, { status: 502 });
    }

    logAudit({
      actorAuthId: user.id,
      action: "ai.provider_analysis",
      targetTable: "organizations",
      targetId: organizationId,
      metadata: {
        model: "claude-sonnet-4-6-20250514",
        input_tokens: response.usage?.input_tokens ?? 0,
        output_tokens: response.usage?.output_tokens ?? 0,
        latency_ms: Date.now() - startTime,
        analysis_type: analysisType,
        course_count: totalCourses,
      },
    }).catch(() => {});

    return Response.json(validated.data);
  } catch (err) {
    console.error("Provider analyzer error:", err);
    return Response.json({ error: "AI service unavailable." }, { status: 503 });
  }
}

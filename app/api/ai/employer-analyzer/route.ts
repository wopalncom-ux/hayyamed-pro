import { NextRequest } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  organizationId: z.string().uuid(),
  analysisType: z.enum(["heatmap", "risk_alerts", "full_report"]),
});

const ResponseSchema = z.object({
  summary: z.string(),
  riskScore: z.number().min(0).max(100),
  alerts: z.array(
    z.object({
      severity: z.enum(["critical", "high", "medium", "low"]),
      message: z.string(),
      affectedCount: z.number(),
    })
  ),
  recommendations: z.array(z.string()),
  departmentBreakdown: z
    .array(
      z.object({
        department: z.string(),
        compliantPct: z.number(),
        atRiskPct: z.number(),
        nonCompliantPct: z.number(),
      })
    )
    .optional(),
});

export type EmployerAnalysisResult = z.infer<typeof ResponseSchema>;

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

  // Verify caller is employer_admin for this org
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .eq("organization_id", organizationId)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) return new Response("Forbidden", { status: 403 });

  const rl = await checkAndLogRateLimit({
    action: "ai_employer_analyzer",
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

  // Fetch org staff compliance data (no PII — use IDs and aggregate counts only)
  const { data: links } = await admin
    .from("employer_link_requests")
    .select("professional_id")
    .eq("organization_id", organizationId)
    .eq("status", "approved");

  if (!links || links.length === 0) {
    return Response.json({ error: "No approved staff found for this organization." }, { status: 404 });
  }

  const professionalIds = links.map((l) => l.professional_id);

  const { data: wallets } = await admin
    .from("cme_wallets")
    .select("professional_id, country, profession, compliance_status, completed_credits, required_credits")
    .in("professional_id", professionalIds);

  const { data: profiles } = await admin
    .from("professional_profiles")
    .select("auth_id, department, specialty")
    .in("auth_id", professionalIds);

  // Build anonymized aggregate (no names, no license numbers)
  const departmentMap: Record<
    string,
    { compliant: number; at_risk: number; non_compliant: number; unknown: number }
  > = {};

  let compliant = 0,
    atRisk = 0,
    nonCompliant = 0,
    unknown = 0;

  for (const w of wallets ?? []) {
    const profile = profiles?.find((p) => p.auth_id === w.professional_id);
    const dept = profile?.department ?? "Unassigned";
    if (!departmentMap[dept]) {
      departmentMap[dept] = { compliant: 0, at_risk: 0, non_compliant: 0, unknown: 0 };
    }
    switch (w.compliance_status) {
      case "compliant":
        compliant++;
        departmentMap[dept].compliant++;
        break;
      case "at_risk":
        atRisk++;
        departmentMap[dept].at_risk++;
        break;
      case "non_compliant":
        nonCompliant++;
        departmentMap[dept].non_compliant++;
        break;
      default:
        unknown++;
        departmentMap[dept].unknown++;
    }
  }

  const total = professionalIds.length;
  const staffWithData = (wallets ?? []).length;

  const deptSummary = Object.entries(departmentMap)
    .map(([dept, counts]) => {
      const dTotal = counts.compliant + counts.at_risk + counts.non_compliant + counts.unknown;
      return `${dept}: ${counts.compliant}/${dTotal} compliant, ${counts.at_risk} at-risk, ${counts.non_compliant} non-compliant`;
    })
    .join("\n");

  const aggregateContext = `
Organization has ${total} approved staff. ${staffWithData} have wallet data.
Compliance breakdown: ${compliant} compliant (${Math.round((compliant / total) * 100)}%), ${atRisk} at-risk (${Math.round((atRisk / total) * 100)}%), ${nonCompliant} non-compliant (${Math.round((nonCompliant / total) * 100)}%), ${unknown} unknown.

Department breakdown:
${deptSummary}

Analysis requested: ${analysisType}
`;

  const systemPrompt = `You are an AI compliance analyst for a healthcare workforce management platform in the GCC region. You analyze anonymized aggregate compliance data and return structured JSON only. No PII is provided and none should be generated.

Return valid JSON matching exactly this schema:
{
  "summary": "string (2-3 sentences executive summary)",
  "riskScore": number (0-100, higher = more risk),
  "alerts": [{"severity": "critical|high|medium|low", "message": "string", "affectedCount": number}],
  "recommendations": ["string", ...] (3-5 actionable items),
  "departmentBreakdown": [{"department": "string", "compliantPct": number, "atRiskPct": number, "nonCompliantPct": number}]
}

riskScore formula: weighted (non_compliant×3 + at_risk×1.5) / (total×3) × 100.
Alerts: critical = >30% non-compliant dept, high = >50% at-risk, medium = no data >20% staff, low = general observations.
Always end with practical, specific recommendations relevant to GCC healthcare compliance (QCHP, DHA, SCFHS, etc.).`;

  const startTime = Date.now();

  try {
    const claude = getAnthropicClient();
    const response = await claude.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Analyze this healthcare organization compliance data and return JSON:\n${aggregateContext}`,
        },
      ],
    });

    const rawText =
      response.content[0]?.type === "text" ? response.content[0].text : "{}";

    // Extract JSON from response (handle markdown code blocks)
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
      action: "ai.employer_analysis",
      targetTable: "organizations",
      targetId: organizationId,
      metadata: {
        model: "claude-sonnet-4-6-20250514",
        input_tokens: response.usage?.input_tokens ?? 0,
        output_tokens: response.usage?.output_tokens ?? 0,
        latency_ms: Date.now() - startTime,
        analysis_type: analysisType,
        staff_count: total,
      },
    }).catch(() => {});

    return Response.json(validated.data);
  } catch (err) {
    console.error("Employer analyzer error:", err);
    return Response.json({ error: "AI service unavailable." }, { status: 503 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getAnthropicClient } from "@/lib/anthropic";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { getUserPlan, isPro } from "@/lib/subscription";
import { logAudit } from "@/lib/audit";
import { logAiCall } from "@/lib/ai/logAiCall";
import { buildComplianceRecommendationsPrompt } from "@/lib/ai/prompts/compliance-recommendations";

const RecommendationSchema = z.object({
  title: z.string(),
  category: z.string(),
  credits: z.number().int(),
  reason: z.string(),
  action_label: z.string(),
  urgency: z.enum(["high", "medium", "low"]),
});

const RecommendationsResponseSchema = z.object({
  summary: z.string(),
  recommendations: z.array(RecommendationSchema),
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) return NextResponse.json({ error: "Pro plan required" }, { status: 403 });

  const rl = await checkAndLogRateLimit({ action: "ai_compliance_recommendations", userId: user.id, maxPerHour: 10 });
  if (!rl.allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });

  const body = await req.json();
  const { profession, specialty, country, totalRequired, totalCompleted, gaps, cycleEndDate } = body as {
    profession: string;
    specialty: string | null;
    country: string;
    totalRequired: number;
    totalCompleted: number;
    gaps: { category: string; earned: number; needed: number }[];
    cycleEndDate: string | null;
  };

  if (!gaps?.length) {
    return NextResponse.json({
      summary: "All your CME categories are on track — no gaps to address.",
      recommendations: [],
      courses: {},
    });
  }

  const deficit = totalRequired - totalCompleted;
  const daysLeft = cycleEndDate
    ? Math.ceil((new Date(cycleEndDate).getTime() - Date.now()) / 86400000)
    : null;

  const prompt = buildComplianceRecommendationsPrompt({
    profession,
    specialty,
    country,
    deficit,
    totalCompleted,
    totalRequired,
    daysLeft,
    gaps,
  });

  let summary = "";
  let recommendations: {
    title: string;
    category: string;
    credits: number;
    reason: string;
    action_label: string;
    urgency: "high" | "medium" | "low";
  }[] = [];

  const startTime = Date.now();
  try {
    const client = getAnthropicClient();
    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 700,
      messages: [{ role: "user", content: prompt }],
    });

    logAudit({
      actorAuthId: user.id,
      action: "ai.compliance_recommendations",
      targetTable: "audit_logs",
      metadata: {
        model: "claude-sonnet-4-6",
        input_tokens: res.usage?.input_tokens ?? 0,
        output_tokens: res.usage?.output_tokens ?? 0,
        latency_ms: Date.now() - startTime,
      },
    }).catch(() => {});
    logAiCall({
      professionalId: user.id,
      action: "ai.compliance_recommendations",
      model: "claude-sonnet-4-6",
      inputTokens: res.usage?.input_tokens ?? 0,
      outputTokens: res.usage?.output_tokens ?? 0,
      latencyMs: Date.now() - startTime,
    }).catch(() => {});

    const text = (res.content[0] as { type: string; text: string }).text.trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const validated = RecommendationsResponseSchema.safeParse(JSON.parse(match[0]));
      if (validated.success) {
        summary = validated.data.summary;
        recommendations = validated.data.recommendations;
      }
    }
  } catch {
    return NextResponse.json({ error: "AI unavailable" }, { status: 503 });
  }

  // Fetch matching marketplace courses for each recommended category
  const admin = createAdminClient();
  const categories = [...new Set(recommendations.map((r) => r.category))];
  const courses: Record<string, { id: string; title: string; provider_name: string; credits: number; is_free: boolean }[]> = {};

  if (categories.length > 0) {
    const { data: matched } = await admin
      .from("courses")
      .select("id, title, credits, is_free, category, provider_id, training_providers(name)")
      .eq("status", "active")
      .in("category", categories)
      .limit(9);

    for (const course of matched ?? []) {
      const tp = course.training_providers as { name: string }[] | { name: string } | null;
      const providerName = Array.isArray(tp) ? tp[0]?.name : (tp as { name: string } | null)?.name ?? "—";
      const cat = course.category as string;
      if (!courses[cat]) courses[cat] = [];
      if (courses[cat].length < 2) {
        courses[cat].push({
          id: course.id,
          title: course.title,
          provider_name: providerName,
          credits: course.credits,
          is_free: course.is_free,
        });
      }
    }
  }

  return NextResponse.json({ summary, recommendations, courses });
}

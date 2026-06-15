import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getAnthropicClient } from "@/lib/anthropic";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { getUserPlan, isPro } from "@/lib/subscription";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { logAudit } from "@/lib/audit";
import { logAiCall } from "@/lib/ai/logAiCall";
import { buildGapAnalysisPrompt } from "@/lib/ai/prompts/gap-analysis";

const CategoryGapSchema = z.object({
  category: z.string(),
  earned: z.number().nonnegative(),
  minimum: z.number().nonnegative(),
  shortfall: z.number().nonnegative(),
  priority: z.enum(["high", "medium", "low"]),
  recommendation: z.string(),
});

const SuggestedActivitySchema = z.object({
  type: z.string(),
  rationale: z.string(),
  estimated_credits: z.number().nonnegative(),
});

const GapAnalysisSchema = z.object({
  overall_status: z.enum(["on_track", "at_risk", "critical", "complete"]),
  summary: z.string(),
  category_gaps: z.array(CategoryGapSchema),
  priority_actions: z.array(z.string()).min(1).max(5),
  suggested_activity_types: z.array(SuggestedActivitySchema).min(1).max(4),
  timeline_advice: z.string().nullable(),
  authority_specific_tip: z.string(),
});

export type GapAnalysis = z.infer<typeof GapAnalysisSchema>;

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) return NextResponse.json({ error: "Pro plan required" }, { status: 403 });
  if (!await isFeatureEnabled("ai_gap_analysis", plan)) return NextResponse.json({ error: "Feature unavailable" }, { status: 403 });

  const rl = await checkAndLogRateLimit({ action: "ai_gap_analysis", userId: user.id, maxPerHour: 5 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });
  }

  const body = await req.json() as {
    profession: string;
    specialty: string | null;
    country: string;
    requiredCredits: number;
    completedCredits: number;
    cycleEndDate: string | null;
    categoryBreakdown: { category: string; earned: number; cap: number | null; minimum: number }[];
  };

  const prompt = buildGapAnalysisPrompt(body);

  const startTime = Date.now();
  try {
    const client = getAnthropicClient();
    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    logAudit({
      actorAuthId: user.id,
      action: "ai.gap_analysis",
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
      action: "ai.gap_analysis",
      model: "claude-sonnet-4-6",
      inputTokens: res.usage?.input_tokens ?? 0,
      outputTokens: res.usage?.output_tokens ?? 0,
      latencyMs: Date.now() - startTime,
    }).catch(() => {});

    const text = (res.content[0] as { type: string; text: string }).text.trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ error: "Invalid AI response" }, { status: 502 });

    const validated = GapAnalysisSchema.safeParse(JSON.parse(match[0]));
    if (!validated.success) return NextResponse.json({ error: "AI response schema mismatch" }, { status: 502 });

    return NextResponse.json(validated.data);
  } catch {
    return NextResponse.json({ error: "AI unavailable" }, { status: 503 });
  }
}

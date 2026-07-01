import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { aiComplete } from "@/lib/ai/complete";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { getUserPlan, isPro } from "@/lib/subscription";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { logAudit } from "@/lib/audit";
import { logAiCall } from "@/lib/ai/logAiCall";
import { buildLearningPathwayPrompt } from "@/lib/ai/prompts/learning-pathway";
import { checkAiConsent } from "@/lib/ai/checkAiConsent";

const MonthSchema = z.object({
  month: z.number().int().min(1).max(12),
  month_name: z.string(),
  target_credits: z.number().int().nonnegative(),
  focus_area: z.string(),
  activity_type: z.enum(["online", "conference", "journal", "workshop", "simulation", "teaching"]),
  rationale: z.string(),
});

const LearningPathwaySchema = z.object({
  plan_summary: z.string(),
  yearly_target_credits: z.number().int().nonnegative(),
  months: z.array(MonthSchema).length(12),
  key_topics: z.array(z.string()).min(1).max(8),
  conference_tip: z.string().nullable(),
  online_platform_tip: z.string().nullable(),
});

export type LearningPathway = z.infer<typeof LearningPathwaySchema>;

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) return NextResponse.json({ error: "Pro plan required" }, { status: 403 });
  if (!await isFeatureEnabled("ai_learning_pathway", plan)) return NextResponse.json({ error: "Feature unavailable" }, { status: 403 });
  if (!await checkAiConsent(user.id)) return NextResponse.json({ error: "AI consent required — enable in Settings > Privacy" }, { status: 403 });

  const rl = await checkAndLogRateLimit({ action: "ai_learning_pathway", userId: user.id, maxPerHour: 5 });
  if (!rl.allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });

  const body = await req.json();
  const { profession, specialty, country, requiredCredits, completedCredits, cycleEndDate, gaps } = body as {
    profession: string;
    specialty: string | null;
    country: string;
    requiredCredits: number;
    completedCredits: number;
    cycleEndDate: string | null;
    gaps: { category: string; earned: number; needed: number }[];
  };

  const prompt = buildLearningPathwayPrompt({ profession, specialty, country, requiredCredits, completedCredits, cycleEndDate, gaps });

  const startTime = Date.now();
  try {
    const ai = await aiComplete({
      task: "gap_analysis",
      maxTokens: 2000,
      json: true,
      messages: [{ role: "user", content: prompt }],
    });

    logAudit({
      actorAuthId: user.id,
      action: "ai.learning_pathway",
      targetTable: "audit_logs",
      metadata: {
        model: ai.model,
        input_tokens: ai.inputTokens,
        output_tokens: ai.outputTokens,
        latency_ms: Date.now() - startTime,
      },
    }).catch(() => {});
    logAiCall({
      professionalId: user.id,
      action: "ai.learning_pathway",
      model: ai.model,
      inputTokens: ai.inputTokens,
      outputTokens: ai.outputTokens,
      latencyMs: Date.now() - startTime,
    }).catch(() => {});

    const text = ai.text.trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ error: "Invalid AI response" }, { status: 502 });

    const validated = LearningPathwaySchema.safeParse(JSON.parse(match[0]));
    if (!validated.success) return NextResponse.json({ error: "AI response schema mismatch" }, { status: 502 });

    // Persist pathway (fire-and-forget — table may not exist yet pre-migration)
    const admin = createAdminClient();
    admin.from("learning_pathways").insert({
      professional_id: user.id,
      country,
      profession,
      model: ai.model,
      prompt_version: "v1",
      pathway_json: validated.data,
      credits_gap: Math.max(0, requiredCredits - completedCredits),
      cycle_end_date: cycleEndDate ?? null,
      is_current: true,
    }).then(undefined, () => {});

    return NextResponse.json(validated.data);
  } catch {
    return NextResponse.json({ error: "AI unavailable" }, { status: 503 });
  }
}

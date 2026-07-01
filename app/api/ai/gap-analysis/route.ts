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
import { buildGapAnalysisPrompt } from "@/lib/ai/prompts/gap-analysis";
import { checkAiConsent } from "@/lib/ai/checkAiConsent";

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

// Returned to client when serving a cached result
export type GapAnalysisResponse = GapAnalysis & {
  cached?: boolean;
  cached_at?: string;
};

export const runtime = "nodejs";

const CACHE_TTL_HOURS = 24;

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) return NextResponse.json({ error: "Pro plan required" }, { status: 403 });
  if (!await isFeatureEnabled("ai_gap_analysis", plan)) return NextResponse.json({ error: "Feature unavailable" }, { status: 403 });
  if (!await checkAiConsent(user.id)) return NextResponse.json({ error: "AI consent required — enable in Settings > Privacy" }, { status: 403 });

  const body = await req.json() as {
    profession: string;
    specialty: string | null;
    country: string;
    requiredCredits: number;
    completedCredits: number;
    cycleEndDate: string | null;
    categoryBreakdown: { category: string; earned: number; cap: number | null; minimum: number }[];
    forceRefresh?: boolean;
  };

  const admin = createAdminClient();

  // Serve cached result if still valid and completedCredits hasn't changed
  if (!body.forceRefresh) {
    const { data: cached } = await admin
      .from("gap_analysis_cache")
      .select("result_json, created_at")
      .eq("professional_id", user.id)
      .eq("is_current", true)
      .eq("completed_credits", body.completedCredits)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cached) {
      return NextResponse.json({
        ...(cached.result_json as GapAnalysis),
        cached: true,
        cached_at: cached.created_at,
      } satisfies GapAnalysisResponse);
    }
  }

  // Cache miss or forceRefresh — consume rate limit slot before calling AI
  const rl = await checkAndLogRateLimit({ action: "ai_gap_analysis", userId: user.id, maxPerHour: 5 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });
  }

  const prompt = buildGapAnalysisPrompt(body);

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
      action: "ai.gap_analysis",
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
      action: "ai.gap_analysis",
      model: ai.model,
      inputTokens: ai.inputTokens,
      outputTokens: ai.outputTokens,
      latencyMs: Date.now() - startTime,
    }).catch(() => {});

    const text = ai.text.trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ error: "Invalid AI response" }, { status: 502 });

    const validated = GapAnalysisSchema.safeParse(JSON.parse(match[0]));
    if (!validated.success) return NextResponse.json({ error: "AI response schema mismatch" }, { status: 502 });

    // Persist to cache (fire-and-forget): mark previous rows as not current, then insert
    const expiresAt = new Date(Date.now() + CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString();
    Promise.resolve()
      .then(() => admin
        .from("gap_analysis_cache")
        .update({ is_current: false })
        .eq("professional_id", user.id)
        .eq("is_current", true)
      )
      .then(() => admin
        .from("gap_analysis_cache")
        .insert({
          professional_id: user.id,
          country: body.country,
          profession: body.profession,
          completed_credits: body.completedCredits,
          result_json: validated.data,
          model: ai.model,
          is_current: true,
          expires_at: expiresAt,
        })
      )
      .catch(() => {});

    return NextResponse.json(validated.data satisfies GapAnalysis);
  } catch {
    return NextResponse.json({ error: "AI unavailable" }, { status: 503 });
  }
}

import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { aiComplete } from "@/lib/ai/complete";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { getUserPlan, isPro } from "@/lib/subscription";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { logAudit } from "@/lib/audit";
import { logAiCall } from "@/lib/ai/logAiCall";
import { VOICE_CHAT_SYSTEM } from "@/lib/ai/prompts/voice-chat";
import { retrieveRelevantChunks, formatChunksForPrompt } from "@/lib/ai/rag/retrieve";
import { toCountryCode } from "@/lib/countryCode";
import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  message: z.string().min(1).max(500),
  conversationId: z.string().optional(),
});


export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return new Response("Unauthorized", { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) {
    return Response.json(
      { error: "Voice assistant requires a Pro plan.", upgrade: true },
      { status: 403 }
    );
  }
  if (!await isFeatureEnabled("ai_voice_chat", plan)) {
    return Response.json({ error: "Feature unavailable." }, { status: 403 }
    );
  }

  const rl = await checkAndLogRateLimit({
    action: "ai_voice_chat",
    userId: user.id,
    maxPerHour: 40,
  });
  if (!rl.allowed) {
    return Response.json(
      { error: "Rate limit reached. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const raw = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) return new Response("Invalid request", { status: 400 });

  const { message } = parsed.data;

  const startTime = Date.now();
  const admin = createAdminClient();

  // Fetch minimal wallet context for personalised responses
  const { data: wallet } = await admin
    .from("cme_wallets")
    .select("country, profession, compliance_status, completed_credits, required_credits")
    .eq("professional_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const context = wallet
    ? `\n\nUser context: ${wallet.profession} in ${wallet.country}. CME status: ${wallet.compliance_status}. Progress: ${wallet.completed_credits}/${wallet.required_credits} credits.`
    : "";

  // Same owner-trained knowledge (documents/websites/Q&A) + always-on rules
  // used by compliance-chat — kept short (topK 2) since voice replies are brief.
  const countryCode = wallet?.country ? toCountryCode(wallet.country) : undefined;
  const [ragChunks, rulesRes] = await Promise.all([
    retrieveRelevantChunks(message, { countryCode, topK: 2, similarityThreshold: 0.65 }).catch(() => []),
    admin.from("assistant_rules").select("rule_text").eq("active", true),
  ]);
  const ragContext = formatChunksForPrompt(ragChunks);
  const activeRules = rulesRes.data ?? [];
  const rulesContext = activeRules.length
    ? `MANDATORY RULES (always follow these, no exceptions):\n${activeRules.map((r) => `- ${r.rule_text}`).join("\n")}`
    : "";
  const systemPrompt = [VOICE_CHAT_SYSTEM + context, rulesContext, ragContext].filter(Boolean).join("\n\n");

  try {
    const ai = await aiComplete({
      task: "chat",
      maxTokens: 256,
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    });

    const text = ai.text || "I couldn't process that. Please try again.";

    logAudit({
      actorAuthId: user.id,
      action: "ai.voice_chat",
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
      action: "ai.voice_chat",
      model: ai.model,
      inputTokens: ai.inputTokens,
      outputTokens: ai.outputTokens,
      latencyMs: Date.now() - startTime,
    }).catch(() => {});

    return Response.json({ text });
  } catch {
    return Response.json({ error: "AI service unavailable. Please try again." }, { status: 503 });
  }
}

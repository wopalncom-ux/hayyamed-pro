import { NextRequest } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { getUserPlan, isPro } from "@/lib/subscription";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  message: z.string().min(1).max(500),
  conversationId: z.string().optional(),
});

const SYSTEM_PROMPT = `You are Hayya AI, a friendly and knowledgeable compliance assistant for Hayya Med Pro — a GCC healthcare professional platform. You help healthcare professionals understand their CME requirements, track compliance, and prepare for license renewals.

You speak in a warm, professional tone. Keep responses concise and direct — this is a voice interface, so avoid bullet points, headers, or markdown. Speak naturally as if in conversation.

Core topics you help with:
- CME credit requirements for QCHP (Qatar), SCFHS (Saudi Arabia), DHA/DOH (UAE), NHRA (Bahrain), OMSB (Oman), MOH Kuwait
- How to log CME activities and track compliance
- License renewal timelines and documentation
- Category caps and credit conversion factors
- Navigating the Hayya Med Pro platform

Always end answers to regulatory questions with: "I recommend verifying the exact requirements directly with your licensing authority."

If asked about topics outside healthcare compliance, politely redirect to your area of expertise.`;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) {
    return Response.json(
      { error: "Voice assistant requires a Pro plan.", upgrade: true },
      { status: 403 }
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

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "AI not configured." }, { status: 503 });
  }

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

  try {
    const claude = getAnthropicClient();
    const response = await claude.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system: SYSTEM_PROMPT + context,
      messages: [{ role: "user", content: message }],
    });

    const text =
      response.content[0]?.type === "text" ? response.content[0].text : "I couldn't process that. Please try again.";

    logAudit({
      actorAuthId: user.id,
      action: "ai.voice_chat",
      targetTable: "audit_logs",
      metadata: {
        model: "claude-haiku-4-5-20251001",
        input_tokens: response.usage?.input_tokens ?? 0,
        output_tokens: response.usage?.output_tokens ?? 0,
        latency_ms: Date.now() - startTime,
      },
    }).catch(() => {});

    return Response.json({ text });
  } catch {
    return Response.json({ error: "AI service unavailable. Please try again." }, { status: 503 });
  }
}

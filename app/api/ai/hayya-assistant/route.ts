import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { HAYYA_ASSISTANT_SYSTEM_PROMPT } from "@/lib/ai/prompts/hayya-assistant";
import { geminiChat } from "@/lib/ai/providers/gemini";
import { aiLimiter } from "@/lib/rateLimit";
import { MODEL_IDS } from "@/lib/ai/router";
import { createAdminClient } from "@/lib/supabase/server";
import { retrieveRelevantChunks, formatChunksForPrompt } from "@/lib/ai/rag/retrieve";
import type { GeminiMessage } from "@/lib/ai/providers/gemini";

export const runtime = "nodejs";

const MODEL = MODEL_IDS["gemini-flash"];

const BodySchema = z.object({
  message: z.string().min(1).max(500),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(1000),
      })
    )
    .max(8)
    .default([]),
  voice: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous";

  if (aiLimiter) {
    const result = await aiLimiter.limit(`hayya_assistant:${ip}`);
    if (!result.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before asking again." },
        { status: 429 }
      );
    }
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const maxTokens = body.voice ? 200 : 600;

  const geminiMessages: GeminiMessage[] = [
    ...body.history.slice(-6).map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    })),
    { role: "user" as const, parts: [{ text: body.message }] },
  ];

  // Same owner-trained knowledge (documents/websites/Q&A) + always-on rules used
  // by compliance-chat. No country context here — this widget is public/anonymous.
  const admin = createAdminClient();
  const [ragChunks, rulesRes] = await Promise.all([
    retrieveRelevantChunks(body.message, { topK: 2, similarityThreshold: 0.65 }).catch(() => []),
    admin.from("assistant_rules").select("rule_text").eq("active", true),
  ]);
  const ragContext = formatChunksForPrompt(ragChunks);
  const activeRules = rulesRes.data ?? [];
  const rulesContext = activeRules.length
    ? `MANDATORY RULES (always follow these, no exceptions):\n${activeRules.map((r) => `- ${r.rule_text}`).join("\n")}`
    : "";
  const systemPrompt = [HAYYA_ASSISTANT_SYSTEM_PROMPT, rulesContext, ragContext].filter(Boolean).join("\n\n");

  try {
    const reply = await geminiChat(MODEL, systemPrompt, geminiMessages, maxTokens);
    return NextResponse.json({ reply: reply || "I'm not sure about that — try asking in a different way." });
  } catch {
    // One retry — transient Vertex hiccups are common; no Claude fallback (Gemini-only by design)
    try {
      const reply = await geminiChat(MODEL, systemPrompt, geminiMessages, maxTokens);
      return NextResponse.json({ reply: reply || "I'm not sure about that — try asking in a different way." });
    } catch {
      return NextResponse.json({
        reply: "I'm having trouble connecting right now. For immediate help, visit hayyamed.pro/register or email support@hayyamed.pro.",
      });
    }
  }
}

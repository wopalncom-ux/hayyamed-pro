import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { HAYYA_ASSISTANT_SYSTEM_PROMPT } from "@/lib/ai/prompts/hayya-assistant";
import { geminiChat } from "@/lib/ai/providers/gemini";
import { getAnthropicClient } from "@/lib/anthropic";
import { aiLimiter } from "@/lib/rateLimit";
import type { GeminiMessage } from "@/lib/ai/providers/gemini";

export const runtime = "nodejs";

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

  // Primary: Gemini Flash 2.0 — 10× cheaper than Haiku for this public endpoint
  try {
    const geminiMessages: GeminiMessage[] = [
      ...body.history.slice(-6).map((m) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: m.content }],
      })),
      { role: "user" as const, parts: [{ text: body.message }] },
    ];

    const reply = await geminiChat(
      "gemini-2.0-flash-001",
      HAYYA_ASSISTANT_SYSTEM_PROMPT,
      geminiMessages,
      maxTokens,
    );

    return NextResponse.json({ reply: reply || "I'm not sure about that — try asking in a different way." });
  } catch {
    // Fallback: Claude Haiku (same GCP auth, higher cost)
    try {
      const anthropic = getAnthropicClient();
      const messages = [
        ...body.history.slice(-6),
        { role: "user" as const, content: body.message },
      ];
      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: maxTokens,
        system: HAYYA_ASSISTANT_SYSTEM_PROMPT,
        messages,
      });
      const reply = response.content[0]?.type === "text" ? response.content[0].text : "";
      return NextResponse.json({ reply });
    } catch {
      return NextResponse.json({
        reply: "I'm having trouble connecting right now. For immediate help, visit hayyamed.pro/register or email support@hayyamed.pro.",
      });
    }
  }
}

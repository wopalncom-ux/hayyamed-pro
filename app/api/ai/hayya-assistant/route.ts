import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAnthropicClient } from "@/lib/anthropic";
import { HAYYA_ASSISTANT_SYSTEM_PROMPT } from "@/lib/ai/prompts/hayya-assistant";
import { aiLimiter } from "@/lib/rateLimit";

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
  // IP-based rate limiting for public endpoint
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

  const anthropic = getAnthropicClient();

  const messages: { role: "user" | "assistant"; content: string }[] = [
    ...body.history.slice(-6),
    { role: "user", content: body.message },
  ];

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: body.voice ? 200 : 600,
      system: HAYYA_ASSISTANT_SYSTEM_PROMPT,
      messages,
    });

    const reply =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[hayya-assistant]", err);
    return NextResponse.json(
      {
        reply:
          "I'm having trouble connecting right now. For immediate help, visit hayyamed.pro/register to get started, or email support@hayyamed.pro.",
      },
      { status: 200 }
    );
  }
}

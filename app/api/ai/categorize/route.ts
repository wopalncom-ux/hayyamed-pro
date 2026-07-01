import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { aiComplete } from "@/lib/ai/complete";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";
import { logAiCall } from "@/lib/ai/logAiCall";
import { CATEGORIZE_SYSTEM } from "@/lib/ai/prompts/categorize";

const CategorizeResponseSchema = z.object({
  category: z.enum(["conference", "online", "workshop", "journal", "teaching", "simulation", "mandatory", "patient_safety", "other"]),
  confidence: z.enum(["high", "medium", "low"]),
  creditSuggestion: z.number().nullable(),
  notes: z.string(),
});

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await checkAndLogRateLimit({ action: "ai_categorize", userId: user.id, maxPerHour: 100 });
  if (!rl.allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });

  const body = await req.json();
  const { title, provider, credits, countryCode } = body as {
    title: string;
    provider?: string;
    credits?: number;
    countryCode?: string;
  };

  if (!title?.trim() || title.trim().length < 3) {
    return NextResponse.json({ error: "Title too short" }, { status: 400 });
  }

  const startTime = Date.now();
  try {
    const ai = await aiComplete({
      task: "classify",
      maxTokens: 256,
      json: true,
      system: CATEGORIZE_SYSTEM,
      messages: [
        {
          role: "user",
          content: `Classify this CME activity:
Title: "${title.trim()}"${provider ? `\nProvider: "${provider}"` : ""}${credits ? `\nCredits entered: ${credits}` : ""}
Country: ${countryCode || "QA"}

- conference: in-person conferences, seminars, symposia, grand rounds
- online: webinars, e-learning, online courses, distance learning
- workshop: hands-on practical workshops, procedural training
- journal: journal reading, self-assessment programs (SAP)
- teaching: teaching, lecturing, supervising trainees
- simulation: simulation labs, OSCE, skill station training
- mandatory: mandatory structured credits (Saudi Arabia SCFHS)
- patient_safety: patient safety modules (DHA Dubai)
- other: anything else

Set creditSuggestion to null if entered credits seem reasonable, or suggest a better value if clearly wrong.`,
        },
      ],
    });

    logAudit({
      actorAuthId: user.id,
      action: "ai.categorize",
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
      action: "ai.categorize",
      model: ai.model,
      inputTokens: ai.inputTokens,
      outputTokens: ai.outputTokens,
      latencyMs: Date.now() - startTime,
    }).catch(() => {});

    if (!ai.text.trim()) {
      return NextResponse.json({ error: "No AI response" }, { status: 500 });
    }

    const parsed = CategorizeResponseSchema.safeParse(JSON.parse(ai.text.trim()));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid AI response structure" }, { status: 500 });
    }
    return NextResponse.json(parsed.data);
  } catch {
    return NextResponse.json({ error: "Categorization failed" }, { status: 500 });
  }
}

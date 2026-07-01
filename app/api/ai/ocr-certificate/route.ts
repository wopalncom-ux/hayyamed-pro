import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { aiComplete } from "@/lib/ai/complete";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { getUserPlan, isPro } from "@/lib/subscription";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { logAudit } from "@/lib/audit";
import { logAiCall } from "@/lib/ai/logAiCall";
import { OCR_CERTIFICATE_PROMPT } from "@/lib/ai/prompts/ocr-certificate";

const OcrResponseSchema = z.object({
  title: z.string(),
  provider: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  credits: z.number().nullable().optional(),
  category: z.enum(["conference", "online", "workshop", "journal", "teaching", "simulation", "mandatory", "patient_safety", "other"]).nullable().optional(),
});

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) return NextResponse.json({ error: "Pro plan required" }, { status: 403 });
  if (!await isFeatureEnabled("ai_certificate_ocr", plan)) return NextResponse.json({ error: "Feature unavailable" }, { status: 403 });

  const rl = await checkAndLogRateLimit({ action: "ai_ocr_certificate", userId: user.id, maxPerHour: 20 });
  if (!rl.allowed) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "application/pdf"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 413 });
  }

  const startTime = Date.now();
  try {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const ai = await aiComplete({
      task: "ocr",
      maxTokens: 512,
      json: true,
      messages: [{ role: "user", content: OCR_CERTIFICATE_PROMPT }],
      images: [{ mediaType: file.type, data: base64 }],
    });

    logAudit({
      actorAuthId: user.id,
      action: "ai.ocr_certificate",
      targetTable: "audit_logs",
      metadata: {
        model: ai.model,
        input_tokens: ai.inputTokens,
        output_tokens: ai.outputTokens,
        latency_ms: Date.now() - startTime,
        file_type: file.type,
        file_size_bytes: file.size,
      },
    }).catch(() => {});
    logAiCall({
      professionalId: user.id,
      action: "ai.ocr_certificate",
      model: ai.model,
      inputTokens: ai.inputTokens,
      outputTokens: ai.outputTokens,
      latencyMs: Date.now() - startTime,
    }).catch(() => {});

    if (!ai.text.trim()) {
      return NextResponse.json({ error: "No AI response" }, { status: 500 });
    }

    const parsed = OcrResponseSchema.safeParse(JSON.parse(ai.text.trim()));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid AI response structure" }, { status: 500 });
    }
    return NextResponse.json(parsed.data);
  } catch {
    return NextResponse.json({ error: "OCR failed" }, { status: 500 });
  }
}

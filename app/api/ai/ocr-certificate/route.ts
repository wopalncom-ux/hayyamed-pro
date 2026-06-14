import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { getUserPlan, isPro } from "@/lib/subscription";
import { logAudit } from "@/lib/audit";

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) return NextResponse.json({ error: "Pro plan required" }, { status: 403 });

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

    const isPdf = file.type === "application/pdf";
    type ImgType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

    const fileBlock = isPdf
      ? ({
          type: "document" as const,
          source: {
            type: "base64" as const,
            media_type: "application/pdf" as const,
            data: base64,
          },
        })
      : ({
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: file.type as ImgType,
            data: base64,
          },
        });

    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: [
            fileBlock,
            {
              type: "text",
              text: `Extract CME/CPD certificate information. Respond ONLY with valid JSON, no other text:
{"title":"<activity or course name>","provider":"<issuing organization>","date":"<YYYY-MM-DD or null>","credits":<number or null>,"category":"<conference|online|workshop|journal|teaching|simulation|mandatory|patient_safety|other or null>"}

Rules:
- title: the main training/activity name on the certificate
- provider: who awarded it (hospital, authority, university, etc.)
- date: completion or activity date in YYYY-MM-DD format; null if not visible
- credits: CME/CPD credit hours shown as a number; null if not shown
- category: best fit for the activity type; null if unclear
Use null for any field not visible in the certificate.`,
            },
          ],
        },
      ],
    });

    logAudit({
      actorAuthId: user.id,
      action: "ai.ocr_certificate",
      targetTable: "audit_logs",
      metadata: {
        model: "claude-sonnet-4-6",
        input_tokens: response.usage?.input_tokens ?? 0,
        output_tokens: response.usage?.output_tokens ?? 0,
        latency_ms: Date.now() - startTime,
        file_type: file.type,
        file_size_bytes: file.size,
      },
    }).catch(() => {});

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") {
      return NextResponse.json({ error: "No AI response" }, { status: 500 });
    }

    const parsed = OcrResponseSchema.safeParse(JSON.parse(text.text.trim()));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid AI response structure" }, { status: 500 });
    }
    return NextResponse.json(parsed.data);
  } catch {
    return NextResponse.json({ error: "OCR failed" }, { status: 500 });
  }
}

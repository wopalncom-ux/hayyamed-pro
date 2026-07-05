import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOwnerApiAuth } from "@/lib/auth/requireOwnerApi";
import { ingestChunks } from "@/lib/ai/rag/ingest";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const BodySchema = z.object({
  question: z.string().min(3).max(500),
  answer: z.string().min(1).max(4000),
});

// POST /api/owner/knowledge/qa
// Owner types a question + answer pair directly; stored as a single
// knowledge_chunks row (source_type = 'admin_qa') so the chatbot can
// retrieve and cite it verbatim when a similar question is asked.
export async function POST(req: NextRequest) {
  const owner = await requireOwnerApiAuth();
  if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "question and answer are required" }, { status: 400 });

  const { question, answer } = parsed.data;
  const content = `Q: ${question}\nA: ${answer}`;
  const sourceId = `qa-${Date.now()}`;

  const result = await ingestChunks({
    sourceType: "admin_qa",
    sourceId,
    title: question,
    chunks: [content],
    metadata: { question, answer },
  });

  await logAudit({
    actorAuthId: owner.userId,
    action: "owner.knowledge.qa_added",
    targetTable: "knowledge_chunks",
    metadata: { question, errors: result.errors },
  });

  return NextResponse.json({ success: result.errors.length === 0, errors: result.errors });
}

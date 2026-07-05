import { NextRequest, NextResponse } from "next/server";
import { requireOwnerApiAuth } from "@/lib/auth/requireOwnerApi";
import { chunkText, ingestChunks } from "@/lib/ai/rag/ingest";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["text/plain", "text/markdown", "application/pdf"];

// POST /api/owner/knowledge/document
// Owner uploads a document (.txt, .md, .pdf) to brief/train the compliance
// chatbot. Text is extracted, chunked, embedded, and stored in the shared
// knowledge_chunks RAG table (source_type = 'admin_document').
export async function POST(req: NextRequest) {
  const owner = await requireOwnerApiAuth();
  if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type. Allowed: .txt, .md, .pdf" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 413 });
  }

  let text: string;
  try {
    if (file.type === "application/pdf") {
      // pdf-parse's CJS/ESM interop shape isn't consistent across build
      // environments — handle both a `.default` export and a bare callable module.
      const pdfParseModule: unknown = await import("pdf-parse");
      const pdfParse = (
        typeof pdfParseModule === "function"
          ? pdfParseModule
          : (pdfParseModule as { default: (buf: Buffer) => Promise<{ text: string }> }).default
      ) as (buf: Buffer) => Promise<{ text: string }>;
      const buffer = Buffer.from(await file.arrayBuffer());
      const parsed = await pdfParse(buffer);
      text = parsed.text;
    } else {
      text = await file.text();
    }
  } catch (e) {
    return NextResponse.json({ error: `Could not read file: ${e instanceof Error ? e.message : "unknown error"}` }, { status: 400 });
  }

  if (!text.trim()) return NextResponse.json({ error: "File appears to be empty" }, { status: 400 });

  const chunks = chunkText(text);
  if (!chunks.length) return NextResponse.json({ error: "Could not extract any usable text" }, { status: 400 });

  const sourceId = `doc-${Date.now()}`;
  const result = await ingestChunks({
    sourceType: "admin_document",
    sourceId,
    title: file.name,
    chunks,
    metadata: { file_name: file.name, file_type: file.type },
  });

  await logAudit({
    actorAuthId: owner.userId,
    action: "owner.knowledge.document_uploaded",
    targetTable: "knowledge_chunks",
    metadata: { file_name: file.name, chunks_inserted: result.inserted, errors: result.errors },
  });

  return NextResponse.json({
    success: result.errors.length === 0,
    chunks_inserted: result.inserted,
    errors: result.errors,
  });
}

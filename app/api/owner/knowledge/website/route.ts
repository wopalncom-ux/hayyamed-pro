import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOwnerApiAuth } from "@/lib/auth/requireOwnerApi";
import { validateWebhookUrl } from "@/lib/webhooks/validateUrl";
import { chunkText, htmlToText, ingestChunks } from "@/lib/ai/rag/ingest";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const maxDuration = 60;

const BodySchema = z.object({ url: z.string().url() });

// POST /api/owner/knowledge/website
// Owner provides a URL; the page is fetched server-side, reduced to plain
// text, chunked, embedded, and stored (source_type = 'admin_website').
// Only works for static/server-rendered pages — no JS execution.
export async function POST(req: NextRequest) {
  const owner = await requireOwnerApiAuth();
  if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "A valid url is required" }, { status: 400 });

  const { url } = parsed.data;
  const urlCheck = validateWebhookUrl(url);
  if (!urlCheck.ok) return NextResponse.json({ error: urlCheck.error }, { status: 400 });

  let html: string;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "HayyaMedProBot/1.0 (+https://hayyamed.pro)" },
    });
    if (!res.ok) return NextResponse.json({ error: `Fetch failed: HTTP ${res.status}` }, { status: 400 });
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      return NextResponse.json({ error: `Unsupported content type: ${contentType}` }, { status: 400 });
    }
    html = await res.text();
  } catch (e) {
    return NextResponse.json({ error: `Could not fetch URL: ${e instanceof Error ? e.message : "unknown error"}` }, { status: 400 });
  }

  const text = htmlToText(html);
  if (!text.trim() || text.length < 50) {
    return NextResponse.json({ error: "Could not extract meaningful text — the page may require JavaScript to render." }, { status: 400 });
  }

  const chunks = chunkText(text);
  const sourceId = `web-${Date.now()}`;
  const result = await ingestChunks({
    sourceType: "admin_website",
    sourceId,
    title: url,
    chunks,
    metadata: { url },
  });

  await logAudit({
    actorAuthId: owner.userId,
    action: "owner.knowledge.website_ingested",
    targetTable: "knowledge_chunks",
    metadata: { url, chunks_inserted: result.inserted, errors: result.errors },
  });

  return NextResponse.json({
    success: result.errors.length === 0,
    chunks_inserted: result.inserted,
    errors: result.errors,
  });
}

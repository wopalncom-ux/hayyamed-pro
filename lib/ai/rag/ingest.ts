import { getTextEmbedding } from "@/lib/ai/embeddings";
import { createAdminClient } from "@/lib/supabase/server";

const MAX_CHUNK_CHARS = 1200;

/**
 * Splits text into paragraph-aware chunks small enough for the embedding
 * model (which truncates at 2048 chars) and for focused retrieval.
 */
export function chunkText(text: string, maxChars: number = MAX_CHUNK_CHARS): string[] {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    const candidate = current ? `${current}\n\n${para}` : para;
    if (candidate.length > maxChars) {
      if (current) chunks.push(current);
      // A single paragraph longer than maxChars gets hard-split
      if (para.length > maxChars) {
        for (let i = 0; i < para.length; i += maxChars) chunks.push(para.slice(i, i + maxChars));
        current = "";
      } else {
        current = para;
      }
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks.filter((c) => c.length > 20); // drop near-empty fragments
}

export type IngestSourceType = "admin_document" | "admin_website" | "admin_qa";

export type IngestResult = { inserted: number; errors: string[] };

/**
 * Embeds and stores a set of text chunks under a single source (a document,
 * a website, or a Q&A pair) in the shared knowledge_chunks RAG table.
 */
export async function ingestChunks(params: {
  sourceType: IngestSourceType;
  sourceId: string;
  title: string;
  chunks: string[];
  metadata?: Record<string, unknown>;
}): Promise<IngestResult> {
  const { sourceType, sourceId, title, chunks, metadata = {} } = params;
  const admin = createAdminClient();
  const result: IngestResult = { inserted: 0, errors: [] };

  for (const [i, content] of chunks.entries()) {
    try {
      const embedding = await getTextEmbedding(content);
      const { error } = await admin.from("knowledge_chunks").insert({
        source_type: sourceType,
        source_id: sourceId,
        title: chunks.length > 1 ? `${title} (part ${i + 1}/${chunks.length})` : title,
        content,
        embedding,
        metadata,
      });
      if (error) result.errors.push(error.message);
      else result.inserted++;
    } catch (e) {
      result.errors.push(e instanceof Error ? e.message : String(e));
    }
  }

  return result;
}

/**
 * Minimal, dependency-free HTML-to-text extractor for the website-ingestion
 * feature. Strips scripts/styles/tags and decodes common entities. Works for
 * static/server-rendered pages; JS-rendered content will not be captured
 * since this is a plain fetch, not a headless browser.
 */
export function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

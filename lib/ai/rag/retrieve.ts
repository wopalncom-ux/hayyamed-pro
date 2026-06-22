import { getTextEmbedding } from "@/lib/ai/embeddings";
import { createAdminClient } from "@/lib/supabase/server";

export type KnowledgeChunk = {
  id: string;
  title: string;
  content: string;
  source_type: string;
  country_code: string | null;
  similarity: number;
};

/**
 * Retrieve the top-k most relevant knowledge chunks for a user query.
 * Used to inject authoritative compliance rules into the AI system prompt.
 */
export async function retrieveRelevantChunks(
  query: string,
  options: {
    countryCode?: string;
    topK?: number;
    similarityThreshold?: number;
  } = {},
): Promise<KnowledgeChunk[]> {
  const { countryCode, topK = 4, similarityThreshold = 0.6 } = options;

  let embedding: number[];
  try {
    embedding = await getTextEmbedding(query);
  } catch {
    // Embedding failed — return empty (chatbot falls back to system prompt context)
    return [];
  }

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("match_knowledge_chunks", {
    query_embedding: embedding,
    match_count: topK,
    filter_country: countryCode ?? null,
    similarity_threshold: similarityThreshold,
  });

  if (error || !data) return [];
  return data as KnowledgeChunk[];
}

/**
 * Format retrieved chunks into a compact string for injection into system prompt.
 */
export function formatChunksForPrompt(chunks: KnowledgeChunk[]): string {
  if (!chunks.length) return "";
  return [
    "AUTHORITATIVE KNOWLEDGE (from official compliance database — cite these facts, do not contradict them):",
    ...chunks.map((c, i) => `[${i + 1}] ${c.title}:\n${c.content}`),
  ].join("\n\n");
}

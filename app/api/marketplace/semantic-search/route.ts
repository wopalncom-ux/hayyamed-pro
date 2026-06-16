import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getTextEmbedding } from "@/lib/ai/embeddings";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  query: z.string().min(3).max(500),
  countryCode: z.string().max(10).optional(),
  limit: z.number().int().min(1).max(12).default(6),
});

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await checkAndLogRateLimit({ action: "semantic_search", userId: user.id, maxPerHour: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const raw = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { query, countryCode, limit } = parsed.data;

  const embedding = await getTextEmbedding(query);
  const admin = createAdminClient();

  const { data: results, error } = await admin.rpc("semantic_course_search", {
    query_embedding: JSON.stringify(embedding),
    match_count: limit,
    country_filter: countryCode ?? null,
  });

  if (error) {
    // Fallback to category FTS if pgvector not yet enabled or no embeddings
    const { data: fallback } = await admin
      .from("courses")
      .select("id, title, category, credits, is_free, price_usd, provider_id")
      .eq("status", "active")
      .textSearch("search_vector", query.split(" ").join(" & "))
      .limit(limit);

    return NextResponse.json({ results: fallback ?? [], source: "fts_fallback" });
  }

  // Fetch provider names for results
  const providerIds = [...new Set((results ?? []).map((r: { provider_id: string }) => r.provider_id))];
  const providerMap: Record<string, string> = {};

  if (providerIds.length > 0) {
    const { data: providers } = await admin
      .from("training_providers")
      .select("id, name")
      .in("id", providerIds);
    for (const p of providers ?? []) {
      providerMap[p.id] = p.name;
    }
  }

  const enriched = (results ?? []).map((r: {
    id: string; title: string; category: string; credits: number;
    is_free: boolean; price_usd: number | null; provider_id: string; similarity: number;
  }) => ({
    ...r,
    provider_name: providerMap[r.provider_id] ?? "—",
    similarity: Math.round(r.similarity * 100),
  }));

  return NextResponse.json({ results: enriched, source: "vector" });
}

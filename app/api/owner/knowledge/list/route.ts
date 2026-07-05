import { NextResponse } from "next/server";
import { requireOwnerApiAuth } from "@/lib/auth/requireOwnerApi";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// GET /api/owner/knowledge/list
// Lists everything the owner has manually added to train the compliance
// chatbot: documents, websites, Q&A pairs, and always-on rules.
export async function GET() {
  const owner = await requireOwnerApiAuth();
  if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  const [chunksRes, rulesRes] = await Promise.all([
    admin
      .from("knowledge_chunks")
      .select("id, source_type, source_id, title, content, metadata, created_at")
      .in("source_type", ["admin_document", "admin_website", "admin_qa"])
      .order("created_at", { ascending: false }),
    admin
      .from("assistant_rules")
      .select("id, rule_text, active, created_at")
      .order("created_at", { ascending: false }),
  ]);

  // Group chunks by source_id so a multi-chunk document shows as one entry
  const grouped = new Map<string, { source_type: string; title: string; created_at: string; chunk_count: number; chunk_ids: string[] }>();
  for (const c of chunksRes.data ?? []) {
    const key = c.source_id ?? c.id;
    const existing = grouped.get(key);
    if (existing) {
      existing.chunk_count++;
      existing.chunk_ids.push(c.id);
    } else {
      grouped.set(key, {
        source_type: c.source_type,
        title: c.title.replace(/\s\(part \d+\/\d+\)$/, ""),
        created_at: c.created_at,
        chunk_count: 1,
        chunk_ids: [c.id],
      });
    }
  }

  return NextResponse.json({
    sources: Array.from(grouped.entries()).map(([sourceId, v]) => ({ source_id: sourceId, ...v })),
    rules: rulesRes.data ?? [],
  });
}

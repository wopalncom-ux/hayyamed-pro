import { NextResponse } from "next/server";
import { requireOwnerApiAuth } from "@/lib/auth/requireOwnerApi";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

// DELETE /api/owner/knowledge/source/[sourceId]
// Removes all chunks belonging to one ingested document/website/Q&A entry.
export async function DELETE(_req: Request, { params }: { params: Promise<{ sourceId: string }> }) {
  const owner = await requireOwnerApiAuth();
  if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sourceId } = await params;
  const admin = createAdminClient();

  const { error, count } = await admin
    .from("knowledge_chunks")
    .delete({ count: "exact" })
    .eq("source_id", sourceId)
    .in("source_type", ["admin_document", "admin_website", "admin_qa"]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: owner.userId,
    action: "owner.knowledge.source_deleted",
    targetTable: "knowledge_chunks",
    metadata: { source_id: sourceId, chunks_deleted: count ?? 0 },
  });

  return NextResponse.json({ success: true, deleted: count ?? 0 });
}

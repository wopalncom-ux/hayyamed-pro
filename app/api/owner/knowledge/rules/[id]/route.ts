import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireOwnerApiAuth } from "@/lib/auth/requireOwnerApi";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const PatchSchema = z.object({ active: z.boolean() });

// PATCH /api/owner/knowledge/rules/[id]  — toggle active/inactive
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const owner = await requireOwnerApiAuth();
  if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = PatchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "active (boolean) is required" }, { status: 400 });

  const { id } = await params;
  const admin = createAdminClient();
  const { error } = await admin.from("assistant_rules").update({ active: parsed.data.active }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: owner.userId,
    action: "owner.knowledge.rule_toggled",
    targetTable: "assistant_rules",
    targetId: id,
    metadata: { active: parsed.data.active },
  });

  return NextResponse.json({ success: true });
}

// DELETE /api/owner/knowledge/rules/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const owner = await requireOwnerApiAuth();
  if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();
  const { error } = await admin.from("assistant_rules").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: owner.userId,
    action: "owner.knowledge.rule_deleted",
    targetTable: "assistant_rules",
    targetId: id,
  });

  return NextResponse.json({ success: true });
}

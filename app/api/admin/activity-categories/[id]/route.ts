import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { requireAdminUser } from "@/lib/adminAuth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    authority_id,
    max_credits_per_cycle,
    min_credits_per_cycle,
    credits_per_hour,
    accreditation_required,
    notes,
  } = body;

  const admin = createAdminClient();

  const { error } = await admin
    .from("compliance_activity_categories")
    .update({
      authority_id: authority_id ?? null,
      max_credits_per_cycle: max_credits_per_cycle ?? null,
      min_credits_per_cycle: Number(min_credits_per_cycle ?? 0),
      credits_per_hour: Number(credits_per_hour ?? 1),
      accreditation_required: !!accreditation_required,
      notes: notes ?? null,
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: "activity_category.updated",
    targetTable: "compliance_activity_categories",
    targetId: id,
    metadata: {},
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  const { error } = await admin
    .from("compliance_activity_categories")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: "activity_category.deleted",
    targetTable: "compliance_activity_categories",
    targetId: id,
    metadata: {},
  });

  return NextResponse.json({ ok: true });
}

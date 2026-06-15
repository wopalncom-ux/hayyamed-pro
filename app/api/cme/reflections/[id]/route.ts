import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const UpdateReflectionSchema = z.object({
  reflection_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  reflection_type: z.enum(["learning", "practice_change", "significant_event", "feedback", "research"]).optional(),
  what_learned: z.string().min(10).max(5000).optional(),
  how_applied: z.string().max(5000).nullable().optional(),
  impact_on_practice: z.string().max(5000).nullable().optional(),
  further_learning: z.string().max(5000).nullable().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = UpdateReflectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("cpd_reflections")
    .update(parsed.data)
    .eq("id", id)
    .eq("professional_id", user.id);

  if (error) return NextResponse.json({ error: "Failed to update reflection" }, { status: 500 });

  logAudit({
    actorAuthId: user.id,
    action: "cpd_reflection.updated",
    targetTable: "cpd_reflections",
    targetId: id,
  }).catch(() => {});

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("cpd_reflections")
    .delete()
    .eq("id", id)
    .eq("professional_id", user.id);

  if (error) return NextResponse.json({ error: "Failed to delete reflection" }, { status: 500 });

  logAudit({
    actorAuthId: user.id,
    action: "cpd_reflection.deleted",
    targetTable: "cpd_reflections",
    targetId: id,
  }).catch(() => {});

  return NextResponse.json({ success: true });
}

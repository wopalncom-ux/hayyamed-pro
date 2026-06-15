import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const CreateReflectionSchema = z.object({
  cme_activity_id: z.string().uuid().nullable().optional(),
  reflection_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reflection_type: z.enum(["learning", "practice_change", "significant_event", "feedback", "research"]),
  what_learned: z.string().min(10).max(5000),
  how_applied: z.string().max(5000).optional().nullable(),
  impact_on_practice: z.string().max(5000).optional().nullable(),
  further_learning: z.string().max(5000).optional().nullable(),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cpd_reflections")
    .select(`
      id, reflection_date, reflection_type, what_learned, how_applied,
      impact_on_practice, further_learning, created_at, cme_activity_id,
      cme_activities(title, credits, activity_date)
    `)
    .eq("professional_id", user.id)
    .order("reflection_date", { ascending: false });

  if (error) return NextResponse.json({ error: "Database error" }, { status: 500 });
  return NextResponse.json({ reflections: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = CreateReflectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cpd_reflections")
    .insert({
      professional_id: user.id,
      cme_activity_id: parsed.data.cme_activity_id ?? null,
      reflection_date: parsed.data.reflection_date,
      reflection_type: parsed.data.reflection_type,
      what_learned: parsed.data.what_learned,
      how_applied: parsed.data.how_applied ?? null,
      impact_on_practice: parsed.data.impact_on_practice ?? null,
      further_learning: parsed.data.further_learning ?? null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: "Failed to save reflection" }, { status: 500 });

  logAudit({
    actorAuthId: user.id,
    action: "cpd_reflection.created",
    targetTable: "cpd_reflections",
    targetId: data.id,
    metadata: { reflection_type: parsed.data.reflection_type },
  }).catch(() => {});

  return NextResponse.json({ id: data.id }, { status: 201 });
}

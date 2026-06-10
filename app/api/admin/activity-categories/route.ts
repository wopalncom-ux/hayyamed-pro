import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    country_code,
    authority_id,
    category_name,
    max_credits_per_cycle,
    min_credits_per_cycle,
    credits_per_hour,
    accreditation_required,
    notes,
  } = body;

  if (!country_code) return NextResponse.json({ error: "country_code required" }, { status: 400 });
  if (!category_name) return NextResponse.json({ error: "category_name required" }, { status: 400 });

  const admin = createAdminClient();

  const { data: created, error } = await admin
    .from("compliance_activity_categories")
    .insert({
      country_code,
      authority_id: authority_id ?? null,
      category_name,
      max_credits_per_cycle: max_credits_per_cycle ?? null,
      min_credits_per_cycle: Number(min_credits_per_cycle ?? 0),
      credits_per_hour: Number(credits_per_hour ?? 1),
      accreditation_required: !!accreditation_required,
      notes: notes ?? null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: "activity_category.created",
    targetTable: "compliance_activity_categories",
    targetId: created.id,
    metadata: { country_code, category_name },
  });

  return NextResponse.json({ id: created.id }, { status: 201 });
}

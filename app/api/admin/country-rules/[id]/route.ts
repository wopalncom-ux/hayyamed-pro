import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    authority_id,
    cycle_years,
    total_credits_required,
    credit_terminology,
    online_credits_max_pct,
    mandatory_credits_min,
    self_reported_allowed,
    grace_period_days,
    employer_report_required,
    employer_report_format,
    notes,
    effective_from,
    effective_to,
  } = body;

  if (!total_credits_required || total_credits_required < 1)
    return NextResponse.json({ error: "Credits must be at least 1" }, { status: 400 });
  if (!cycle_years || cycle_years < 1)
    return NextResponse.json({ error: "Cycle years must be at least 1" }, { status: 400 });
  if (online_credits_max_pct < 0 || online_credits_max_pct > 100)
    return NextResponse.json({ error: "Online % must be 0–100" }, { status: 400 });

  const admin = createAdminClient();

  const { error } = await admin
    .from("country_compliance_rules")
    .update({
      authority_id: authority_id ?? null,
      cycle_years: Number(cycle_years),
      total_credits_required: Number(total_credits_required),
      credit_terminology,
      online_credits_max_pct: Number(online_credits_max_pct),
      mandatory_credits_min: Number(mandatory_credits_min ?? 0),
      self_reported_allowed: !!self_reported_allowed,
      grace_period_days: Number(grace_period_days ?? 30),
      employer_report_required: !!employer_report_required,
      employer_report_format: employer_report_format ?? null,
      notes: notes ?? null,
      effective_from: effective_from || undefined,
      effective_to: effective_to ?? null,
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: "country_rule.updated",
    targetTable: "country_compliance_rules",
    targetId: id,
    metadata: { total_credits_required, cycle_years, credit_terminology },
  });

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { requireAdminUser } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    country_code,
    profession_code,
    cycle_years,
    total_credits_required,
    credit_terminology,
    online_credits_max_pct,
    mandatory_credits_min,
    self_reported_allowed,
    grace_period_days,
    employer_report_required,
    notes,
    effective_from,
  } = body;

  // Validate required fields
  const code = typeof country_code === "string" ? country_code.trim().toUpperCase() : "";
  const prof = typeof profession_code === "string" ? profession_code.trim().toLowerCase() : "";

  if (!code) return NextResponse.json({ error: "Country code is required" }, { status: 400 });
  if (!prof) return NextResponse.json({ error: "Profession code is required" }, { status: 400 });
  if (!/^[A-Z]{2}(-[A-Z]{2})?$/.test(code))
    return NextResponse.json({ error: "Country code must be 2 letters (e.g. GB) or sub-code (e.g. AE-DU)" }, { status: 400 });
  if (Number(total_credits_required) < 1)
    return NextResponse.json({ error: "Credits required must be at least 1" }, { status: 400 });
  if (Number(cycle_years) < 1)
    return NextResponse.json({ error: "Cycle must be at least 1 year" }, { status: 400 });

  const admin = createAdminClient();

  // Prevent duplicate active rule for same country + profession
  const { data: existing } = await admin
    .from("country_compliance_rules")
    .select("id")
    .eq("country_code", code)
    .eq("profession_code", prof)
    .is("effective_to", null)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: `An active rule for profession "${prof}" already exists for ${code}. Edit the existing rule instead.` },
      { status: 409 }
    );
  }

  const { data: inserted, error } = await admin
    .from("country_compliance_rules")
    .insert({
      country_code: code,
      profession_code: prof,
      cycle_years: Number(cycle_years),
      total_credits_required: Number(total_credits_required),
      credit_terminology: credit_terminology || "CME",
      online_credits_max_pct: Number(online_credits_max_pct ?? 50),
      mandatory_credits_min: Number(mandatory_credits_min ?? 0),
      self_reported_allowed: self_reported_allowed === true || self_reported_allowed === "true",
      grace_period_days: Number(grace_period_days ?? 30),
      employer_report_required: employer_report_required === true || employer_report_required === "true",
      notes: notes || null,
      effective_from: effective_from || new Date().toISOString().slice(0, 10),
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: "country_rule.created",
    targetTable: "country_compliance_rules",
    targetId: inserted.id,
    metadata: { country_code: code, profession_code: prof, total_credits_required, cycle_years },
  });

  return NextResponse.json({ ok: true, id: inserted.id });
}

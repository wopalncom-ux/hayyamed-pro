import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey, requireScope } from "@/lib/apiKeyAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { checkApiKeyRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

/**
 * GET /api/v1/faculty/compliance
 *
 * Aggregate CME compliance summary for all faculty linked to the university.
 * Returns total counts and breakdowns by department and profession.
 *
 * Authentication: X-Api-Key: hmp_live_...
 * Required scope:  read:compliance
 */
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? req.headers.get("authorization")?.replace("Bearer ", "");
  if (!apiKey) {
    return NextResponse.json({ error: "Missing X-Api-Key header" }, { status: 401 });
  }

  const ctx = await verifyApiKey(apiKey);
  if (!ctx) return NextResponse.json({ error: "Invalid or expired API key" }, { status: 401 });

  if (!requireScope(ctx, "read:compliance")) {
    return NextResponse.json({ error: "Insufficient scope — requires read:compliance" }, { status: 403 });
  }

  const rl = await checkApiKeyRateLimit(ctx.keyId);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const admin = createAdminClient();

  const { data: orgCheck } = await admin
    .from("organization_members")
    .select("id")
    .eq("organization_id", ctx.organizationId)
    .eq("role", "university_admin")
    .limit(1)
    .maybeSingle();

  if (!orgCheck) {
    return NextResponse.json({ error: "This endpoint is only available to university organisations" }, { status: 403 });
  }

  const { data: links } = await admin
    .from("employer_link_requests")
    .select("professional_id, department")
    .eq("organization_id", ctx.organizationId)
    .eq("status", "approved");

  if (!links?.length) {
    return NextResponse.json({
      total_faculty: 0,
      compliant_count: 0,
      at_risk_count: 0,
      non_compliant_count: 0,
      unknown_count: 0,
      by_department: [],
      by_profession: [],
      meta: { organization_id: ctx.organizationId, generated_at: new Date().toISOString(), api_version: "v1" },
    });
  }

  const facultyIds = links.map((l) => l.professional_id);
  const deptMap    = Object.fromEntries(links.map((l) => [l.professional_id, l.department ?? "Unassigned"]));

  const [profilesRes, walletsRes, privacyRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("auth_id, profession")
      .in("auth_id", facultyIds),
    admin.from("cme_wallets")
      .select("professional_id, compliance_status")
      .in("professional_id", facultyIds),
    admin.from("profile_privacy_settings")
      .select("professional_id, employer_can_view_cme_summary")
      .in("professional_id", facultyIds),
  ]);

  const professionMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.auth_id, p.profession]));
  const privacyMap    = Object.fromEntries(
    (privacyRes.data ?? []).map((p) => [p.professional_id, p.employer_can_view_cme_summary])
  );

  const rank: Record<string, number> = { non_compliant: 3, at_risk: 2, unknown: 1, compliant: 0 };
  const effectiveStatus: Record<string, string> = {};
  for (const w of walletsRes.data ?? []) {
    const pid  = w.professional_id;
    const curr = w.compliance_status ?? "unknown";
    if (!effectiveStatus[pid] || (rank[curr] ?? 0) > (rank[effectiveStatus[pid]] ?? 0)) {
      effectiveStatus[pid] = curr;
    }
  }

  // Aggregation accumulators
  const counts   = { compliant: 0, at_risk: 0, non_compliant: 0, unknown: 0 };
  const deptAgg:  Record<string, Record<string, number>> = {};
  const profAgg:  Record<string, Record<string, number>> = {};

  for (const pid of facultyIds) {
    const visible = privacyMap[pid] !== false;
    const status  = visible ? (effectiveStatus[pid] ?? "unknown") : "unknown";
    const dept    = deptMap[pid];
    const prof    = professionMap[pid] ?? "unknown";

    if (status === "compliant") counts.compliant++;
    else if (status === "at_risk") counts.at_risk++;
    else if (status === "non_compliant") counts.non_compliant++;
    else counts.unknown++;

    if (!deptAgg[dept]) deptAgg[dept] = { compliant: 0, at_risk: 0, non_compliant: 0, unknown: 0, total: 0 };
    deptAgg[dept][status] = (deptAgg[dept][status] ?? 0) + 1;
    deptAgg[dept].total   = (deptAgg[dept].total ?? 0) + 1;

    if (!profAgg[prof]) profAgg[prof] = { compliant: 0, at_risk: 0, non_compliant: 0, unknown: 0, total: 0 };
    profAgg[prof][status] = (profAgg[prof][status] ?? 0) + 1;
    profAgg[prof].total   = (profAgg[prof].total ?? 0) + 1;
  }

  return NextResponse.json({
    total_faculty:       facultyIds.length,
    compliant_count:     counts.compliant,
    at_risk_count:       counts.at_risk,
    non_compliant_count: counts.non_compliant,
    unknown_count:       counts.unknown,
    by_department: Object.entries(deptAgg)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([department, c]) => ({ department, ...c })),
    by_profession: Object.entries(profAgg)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([profession, c]) => ({ profession, ...c })),
    meta: { organization_id: ctx.organizationId, generated_at: new Date().toISOString(), api_version: "v1" },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey, requireScope } from "@/lib/apiKeyAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { checkApiKeyRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

/**
 * GET /api/v1/faculty
 *
 * Faculty directory for university portal HRIS integrations.
 * Returns paginated list of faculty/alumni linked to the university org.
 *
 * Authentication: X-Api-Key: hmp_live_...
 * Required scope:  read:faculty
 *
 * Query params:
 *   ?department=Medicine    — filter by department
 *   ?profession=physician   — filter by profession
 *   ?status=compliant|at_risk|non_compliant
 *   ?q=john                 — name search
 *   ?page=1&per_page=100
 *
 * Privacy: CME status masked as "private" when employer_can_view_cme_summary=false
 */
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? req.headers.get("authorization")?.replace("Bearer ", "");
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing X-Api-Key header", docs: "https://hayyamed.pro/docs/api" },
      { status: 401 }
    );
  }

  const ctx = await verifyApiKey(apiKey);
  if (!ctx) return NextResponse.json({ error: "Invalid or expired API key" }, { status: 401 });

  if (!requireScope(ctx, "read:faculty")) {
    return NextResponse.json({ error: "Insufficient scope — requires read:faculty" }, { status: 403 });
  }

  const rl = await checkApiKeyRateLimit(ctx.keyId);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded — 100 requests per minute per API key" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const admin = createAdminClient();

  // Confirm this key belongs to a university org
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

  const { searchParams } = new URL(req.url);
  const page           = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage        = Math.min(200, Math.max(1, parseInt(searchParams.get("per_page") ?? "100")));
  const departmentFilter = searchParams.get("department");
  const professionFilter = searchParams.get("profession");
  const statusFilter     = searchParams.get("status");
  const nameQuery        = searchParams.get("q")?.toLowerCase().trim();

  const { data: links } = await admin
    .from("employer_link_requests")
    .select("professional_id, department")
    .eq("organization_id", ctx.organizationId)
    .eq("status", "approved");

  if (!links?.length) {
    return NextResponse.json({
      data: [],
      pagination: { page, per_page: perPage, total: 0, total_pages: 0 },
      meta: { organization_id: ctx.organizationId, generated_at: new Date().toISOString(), api_version: "v1" },
    });
  }

  let filteredLinks = links;
  if (departmentFilter) {
    filteredLinks = filteredLinks.filter(
      (l) => (l.department ?? "unassigned").toLowerCase() === departmentFilter.toLowerCase()
    );
  }

  const facultyIds = filteredLinks.map((l) => l.professional_id);
  const deptMap    = Object.fromEntries(filteredLinks.map((l) => [l.professional_id, l.department]));

  const [profilesRes, walletsRes, privacyRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("auth_id, full_name, profession, specialty, created_at")
      .in("auth_id", facultyIds),
    admin.from("cme_wallets")
      .select("professional_id, compliance_status, completed_credits, required_credits")
      .in("professional_id", facultyIds),
    admin.from("profile_privacy_settings")
      .select("professional_id, employer_can_view_cme_summary")
      .in("professional_id", facultyIds),
  ]);

  const profileMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.auth_id, p]));
  const privacyMap = Object.fromEntries(
    (privacyRes.data ?? []).map((p) => [p.professional_id, p.employer_can_view_cme_summary])
  );

  // Worst-status aggregation across multiple wallets (multi-country)
  const walletStatusMap: Record<string, string> = {};
  const rank: Record<string, number> = { non_compliant: 3, at_risk: 2, unknown: 1, compliant: 0 };
  for (const w of walletsRes.data ?? []) {
    const pid  = w.professional_id;
    const curr = w.compliance_status ?? "unknown";
    if (!walletStatusMap[pid] || (rank[curr] ?? 0) > (rank[walletStatusMap[pid]] ?? 0)) {
      walletStatusMap[pid] = curr;
    }
  }

  let rows = facultyIds.map((pid) => {
    const profile    = profileMap[pid];
    const cmeVisible = privacyMap[pid] !== false;
    return {
      professional_id:   pid,
      department:        deptMap[pid] ?? null,
      name:              profile?.full_name ?? null,
      profession:        profile?.profession ?? null,
      specialty:         profile?.specialty ?? null,
      compliance_status: cmeVisible ? (walletStatusMap[pid] ?? "unknown") : "private",
      data_visible:      cmeVisible,
      platform_joined_at: profile?.created_at ?? null,
    };
  });

  if (professionFilter) rows = rows.filter((r) => r.profession === professionFilter);
  if (statusFilter)     rows = rows.filter((r) => r.compliance_status === statusFilter);
  if (nameQuery)        rows = rows.filter((r) => r.name?.toLowerCase().includes(nameQuery));

  const total    = rows.length;
  const start    = (page - 1) * perPage;
  const pageRows = rows.slice(start, start + perPage);

  return NextResponse.json({
    data: pageRows,
    pagination: { page, per_page: perPage, total, total_pages: Math.ceil(total / perPage) },
    meta: { organization_id: ctx.organizationId, generated_at: new Date().toISOString(), api_version: "v1" },
  });
}

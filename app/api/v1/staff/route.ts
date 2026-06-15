import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey, requireScope } from "@/lib/apiKeyAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { checkApiKeyRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

/**
 * GET /api/v1/staff
 *
 * HRIS integration endpoint — returns a paginated staff directory for all
 * professionals linked to the API key's organisation.
 *
 * Authentication: X-Api-Key: hmp_live_...
 * Required scope:  read:staff
 *
 * Query params:
 *   ?department=Cardiology   — filter by department
 *   ?profession=physician    — filter by profession
 *   ?status=compliant|at_risk|non_compliant  — filter by compliance status
 *   ?q=john                  — fuzzy name search (case-insensitive prefix)
 *   ?page=1&per_page=100
 *
 * Privacy: CME compliance status is masked as "private" for staff who have
 * set employer_can_view_cme_summary=false.
 *
 * Returns:
 *   professional_id, name, profession, specialty, department,
 *   compliance_status, data_visible, platform_joined_at
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

  if (!requireScope(ctx, "read:staff")) {
    return NextResponse.json({ error: "Insufficient scope — requires read:staff" }, { status: 403 });
  }

  const rl = await checkApiKeyRateLimit(ctx.keyId);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded — 100 requests per minute per API key" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const { searchParams } = new URL(req.url);
  const page    = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage = Math.min(200, Math.max(1, parseInt(searchParams.get("per_page") ?? "100")));
  const departmentFilter = searchParams.get("department");
  const professionFilter = searchParams.get("profession");
  const statusFilter     = searchParams.get("status");
  const nameQuery        = searchParams.get("q")?.toLowerCase().trim();

  const admin = createAdminClient();

  // Get approved staff links
  const { data: links, error: linksErr } = await admin
    .from("employer_link_requests")
    .select("professional_id, department")
    .eq("organization_id", ctx.organizationId)
    .eq("status", "approved");

  if (linksErr) return NextResponse.json({ error: linksErr.message }, { status: 500 });
  if (!links?.length) {
    return NextResponse.json({
      data: [],
      pagination: { page, per_page: perPage, total: 0, total_pages: 0 },
      meta: { organization_id: ctx.organizationId, generated_at: new Date().toISOString(), api_version: "v1" },
    });
  }

  // Apply department filter early
  let filteredLinks = links;
  if (departmentFilter) {
    filteredLinks = filteredLinks.filter(
      (l) => (l.department ?? "unassigned").toLowerCase() === departmentFilter.toLowerCase()
    );
  }

  const staffIds = filteredLinks.map((l) => l.professional_id);
  const deptMap = Object.fromEntries(filteredLinks.map((l) => [l.professional_id, l.department]));

  // Parallel fetch: profiles + primary wallet compliance + privacy settings
  const [profilesRes, walletsRes, privacyRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("auth_id, full_name, profession, specialty, created_at")
      .in("auth_id", staffIds),
    admin
      .from("cme_wallets")
      .select("professional_id, compliance_status")
      .in("professional_id", staffIds),
    admin
      .from("profile_privacy_settings")
      .select("professional_id, employer_can_view_cme_summary")
      .in("professional_id", staffIds),
  ]);

  const profileMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.auth_id, p]));
  const privacyMap = Object.fromEntries(
    (privacyRes.data ?? []).map((p) => [p.professional_id, p.employer_can_view_cme_summary])
  );

  // For professionals with multiple wallets (multi-country), derive the worst status
  const walletStatusMap: Record<string, string> = {};
  for (const w of walletsRes.data ?? []) {
    const pid = w.professional_id;
    const prev = walletStatusMap[pid];
    const curr = w.compliance_status ?? "unknown";
    // worst-first order: non_compliant > at_risk > unknown > compliant
    const rank: Record<string, number> = { non_compliant: 3, at_risk: 2, unknown: 1, compliant: 0 };
    if (!prev || (rank[curr] ?? 0) > (rank[prev] ?? 0)) {
      walletStatusMap[pid] = curr;
    }
  }

  // Build result rows
  let rows = staffIds.map((pid) => {
    const profile = profileMap[pid];
    const cmeVisible = privacyMap[pid] !== false;

    const rawStatus = walletStatusMap[pid] ?? "unknown";
    const complianceStatus = cmeVisible ? rawStatus : "private";

    return {
      professional_id: pid,
      department: deptMap[pid] ?? null,
      name: profile?.full_name ?? null,
      profession: profile?.profession ?? null,
      specialty: profile?.specialty ?? null,
      compliance_status: complianceStatus,
      data_visible: cmeVisible,
      platform_joined_at: profile?.created_at ?? null,
    };
  });

  // Apply in-memory filters
  if (professionFilter) rows = rows.filter((r) => r.profession === professionFilter);
  if (statusFilter)     rows = rows.filter((r) => r.compliance_status === statusFilter);
  if (nameQuery)        rows = rows.filter((r) => r.name?.toLowerCase().includes(nameQuery));

  const total = rows.length;
  const start = (page - 1) * perPage;
  const pageRows = rows.slice(start, start + perPage);

  return NextResponse.json({
    data: pageRows,
    pagination: {
      page,
      per_page: perPage,
      total,
      total_pages: Math.ceil(total / perPage),
    },
    meta: {
      organization_id: ctx.organizationId,
      generated_at: new Date().toISOString(),
      api_version: "v1",
    },
  });
}

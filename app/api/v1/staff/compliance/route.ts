import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey, requireScope } from "@/lib/apiKeyAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { checkApiKeyRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

/**
 * GET /api/v1/staff/compliance
 *
 * HRIS integration endpoint — returns compliance status for all staff
 * linked to the API key's organisation.
 *
 * Authentication: X-Api-Key: hmp_live_...
 * Required scope:  read:compliance
 *
 * Query params:
 *   ?page=1&per_page=100
 *   ?status=compliant|non_compliant|at_risk
 *   ?department=Cardiology
 *
 * Privacy: staff who have set employer_can_view_cme_summary=false are
 * included in the response with data_visible=false and null credit fields.
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
  if (!ctx) {
    return NextResponse.json({ error: "Invalid or expired API key" }, { status: 401 });
  }

  if (!requireScope(ctx, "read:compliance")) {
    return NextResponse.json({ error: "Insufficient scope — requires read:compliance" }, { status: 403 });
  }

  const rl = await checkApiKeyRateLimit(ctx.keyId);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded — 100 requests per minute per API key" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage = Math.min(200, Math.max(1, parseInt(searchParams.get("per_page") ?? "100")));
  const statusFilter = searchParams.get("status");
  const professionFilter = searchParams.get("profession");
  const departmentFilter = searchParams.get("department");

  const admin = createAdminClient();

  // Get approved staff links for this org
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

  // Apply department filter before fetching (reduces downstream queries)
  let filteredLinks = links;
  if (departmentFilter) {
    filteredLinks = filteredLinks.filter(
      (l) => (l.department ?? "unassigned").toLowerCase() === departmentFilter.toLowerCase()
    );
  }

  const staffIds = filteredLinks.map((l) => l.professional_id);
  const deptMap = Object.fromEntries(filteredLinks.map((l) => [l.professional_id, l.department]));

  // Parallel fetch: profiles + wallets + privacy settings
  const [profilesRes, walletsRes, privacyRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("auth_id, full_name, profession, specialty")
      .in("auth_id", staffIds),
    admin
      .from("cme_wallets")
      .select("professional_id, country, profession, compliance_status, completed_credits, required_credits, cycle_end_date")
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

  // Group wallets by professional_id
  const walletsByProf = new Map<string, typeof walletsRes.data>();
  for (const w of walletsRes.data ?? []) {
    if (!walletsByProf.has(w.professional_id)) walletsByProf.set(w.professional_id, []);
    walletsByProf.get(w.professional_id)!.push(w);
  }

  // Build rows
  let rows = staffIds.map((pid) => {
    const profile = profileMap[pid];
    const cmeVisible = privacyMap[pid] !== false;
    const wallets = cmeVisible ? (walletsByProf.get(pid) ?? []) : [];

    const overallStatus = !cmeVisible
      ? "private"
      : wallets.length === 0
        ? "unknown"
        : wallets.every((w) => w.compliance_status === "compliant")
          ? "compliant"
          : wallets.some((w) => w.compliance_status === "non_compliant")
            ? "non_compliant"
            : "at_risk";

    return {
      professional_id: pid,
      department: deptMap[pid] ?? null,
      full_name: profile?.full_name ?? null,
      profession: profile?.profession ?? null,
      specialty: profile?.specialty ?? null,
      overall_status: overallStatus,
      data_visible: cmeVisible,
      compliance: cmeVisible
        ? wallets.map((w) => ({
            country: w.country,
            profession: w.profession,
            status: w.compliance_status,
            completed_credits: w.completed_credits,
            required_credits: w.required_credits,
            gap: Math.max(0, (w.required_credits ?? 0) - (w.completed_credits ?? 0)),
            pct_complete:
              (w.required_credits ?? 0) > 0
                ? Math.round(((w.completed_credits ?? 0) / w.required_credits) * 100)
                : 100,
            cycle_end_date: w.cycle_end_date,
          }))
        : null,
    };
  });

  // Apply status and profession filters
  if (statusFilter) rows = rows.filter((r) => r.overall_status === statusFilter);
  if (professionFilter) rows = rows.filter((r) => r.profession === professionFilter);

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

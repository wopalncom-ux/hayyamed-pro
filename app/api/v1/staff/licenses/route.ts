import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey, requireScope } from "@/lib/apiKeyAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { checkApiKeyRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

/**
 * GET /api/v1/staff/licenses
 *
 * Returns all license records for staff linked to the API key's organisation.
 * Useful for HRIS / HR systems to sync renewal dates and trigger alerts.
 * Includes both the primary license on professional_profiles AND secondary
 * licenses added via the multi-license wallet (professional_licenses table).
 *
 * Authentication: X-Api-Key: hmp_live_...
 * Required scope:  read:licenses
 *
 * Query params:
 *   ?expiring_within_days=90   — filter to licenses expiring within N days
 *   ?country_code=QA           — filter by licensing authority country
 *   ?page=1&per_page=100
 *
 * Privacy: staff who have set employer_can_view_license_expiry=false are
 * excluded from license records entirely.
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

  if (!requireScope(ctx, "read:licenses")) {
    return NextResponse.json({ error: "Insufficient scope — requires read:licenses" }, { status: 403 });
  }

  const rl = await checkApiKeyRateLimit(ctx.keyId);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded — 100 requests per minute per API key" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const { searchParams } = new URL(req.url);
  const expiringWithin = searchParams.get("expiring_within_days");
  const countryCode    = searchParams.get("country_code");
  const page    = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage = Math.min(200, Math.max(1, parseInt(searchParams.get("per_page") ?? "100")));
  const expiringDays = expiringWithin ? parseInt(expiringWithin) : null;

  const admin = createAdminClient();

  // Get approved staff links for this org
  const { data: links } = await admin
    .from("employer_link_requests")
    .select("professional_id, department")
    .eq("organization_id", ctx.organizationId)
    .eq("status", "approved");

  const allStaffIds = (links ?? []).map((l) => l.professional_id);
  if (allStaffIds.length === 0) {
    return NextResponse.json({
      data: [],
      pagination: { page, per_page: perPage, total: 0, total_pages: 0 },
      meta: { organization_id: ctx.organizationId, generated_at: new Date().toISOString(), api_version: "v1" },
    });
  }

  const deptMap = Object.fromEntries((links ?? []).map((l) => [l.professional_id, l.department]));

  // Fetch privacy settings — only return licenses for staff who consented
  const { data: privacyRows } = await admin
    .from("profile_privacy_settings")
    .select("professional_id, employer_can_view_license_expiry")
    .in("professional_id", allStaffIds);

  const privacyMap = Object.fromEntries(
    (privacyRows ?? []).map((p) => [p.professional_id, p.employer_can_view_license_expiry])
  );

  // Staff with no privacy row default to visible (true)
  const visibleIds = allStaffIds.filter((id) => privacyMap[id] !== false);

  if (visibleIds.length === 0) {
    return NextResponse.json({
      data: [],
      pagination: { page, per_page: perPage, total: 0, total_pages: 0 },
      meta: { organization_id: ctx.organizationId, generated_at: new Date().toISOString(), api_version: "v1" },
    });
  }

  const now = Date.now();

  function licenseStatus(expiryDate: string | null): "active" | "expiring_90d" | "expiring_soon" | "expired" | "no_expiry" {
    if (!expiryDate) return "no_expiry";
    const days = Math.ceil((new Date(expiryDate).getTime() - now) / 86_400_000);
    if (days < 0) return "expired";
    if (days <= 30) return "expiring_soon";
    if (days <= 90) return "expiring_90d";
    return "active";
  }

  // Fetch primary licenses (professional_profiles.license_number / license_expiry)
  // and secondary licenses (professional_licenses table) in parallel
  const [profilesRes, secLicensesRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("auth_id, full_name, license_number, licensing_authority, country_of_residence, license_expiry")
      .in("auth_id", visibleIds),
    admin
      .from("professional_licenses")
      .select("professional_id, license_number, licensing_authority, country_code, profession, specialty, issue_date, expiry_date, is_primary")
      .in("professional_id", visibleIds)
      .order("is_primary", { ascending: false }),
  ]);

  const profileMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.auth_id, p]));

  type LicenseRecord = {
    professional_id: string;
    professional_name: string | null;
    department: string | null;
    license_number: string | null;
    licensing_authority: string | null;
    country_code: string | null;
    profession: string | null;
    specialty: string | null;
    issue_date: string | null;
    expiry_date: string | null;
    days_to_expiry: number | null;
    status: string;
    is_primary: boolean;
    source: "profile" | "multi_license_wallet";
  };

  const allLicenses: LicenseRecord[] = [];

  for (const pid of visibleIds) {
    const profile = profileMap[pid];

    // Primary license from professional_profiles (only if license_number is set)
    if (profile?.license_number) {
      const daysLeft = profile.license_expiry
        ? Math.ceil((new Date(profile.license_expiry).getTime() - now) / 86_400_000)
        : null;
      allLicenses.push({
        professional_id: pid,
        professional_name: profile.full_name ?? null,
        department: deptMap[pid] ?? null,
        license_number: profile.license_number,
        licensing_authority: profile.licensing_authority ?? null,
        country_code: profile.country_of_residence ?? null,
        profession: null,
        specialty: null,
        issue_date: null,
        expiry_date: profile.license_expiry ?? null,
        days_to_expiry: daysLeft,
        status: licenseStatus(profile.license_expiry ?? null),
        is_primary: true,
        source: "profile",
      });
    }
  }

  // Secondary licenses from professional_licenses table
  for (const l of secLicensesRes.data ?? []) {
    const pid = l.professional_id;
    const profile = profileMap[pid];
    const daysLeft = l.expiry_date
      ? Math.ceil((new Date(l.expiry_date).getTime() - now) / 86_400_000)
      : null;
    allLicenses.push({
      professional_id: pid,
      professional_name: profile?.full_name ?? null,
      department: deptMap[pid] ?? null,
      license_number: l.license_number,
      licensing_authority: l.licensing_authority,
      country_code: l.country_code,
      profession: l.profession ?? null,
      specialty: l.specialty ?? null,
      issue_date: l.issue_date ?? null,
      expiry_date: l.expiry_date ?? null,
      days_to_expiry: daysLeft,
      status: licenseStatus(l.expiry_date ?? null),
      is_primary: l.is_primary,
      source: "multi_license_wallet",
    });
  }

  // Apply filters
  let filtered = allLicenses;
  if (countryCode) {
    filtered = filtered.filter((l) => l.country_code?.toUpperCase() === countryCode.toUpperCase());
  }
  if (expiringDays !== null && !isNaN(expiringDays)) {
    filtered = filtered.filter(
      (l) => l.days_to_expiry !== null && l.days_to_expiry >= 0 && l.days_to_expiry <= expiringDays
    );
  }

  // Sort: soonest-expiring first, then no-expiry at end
  filtered.sort((a, b) => {
    if (a.days_to_expiry === null && b.days_to_expiry === null) return 0;
    if (a.days_to_expiry === null) return 1;
    if (b.days_to_expiry === null) return -1;
    return a.days_to_expiry - b.days_to_expiry;
  });

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const pageRows = filtered.slice(start, start + perPage);

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

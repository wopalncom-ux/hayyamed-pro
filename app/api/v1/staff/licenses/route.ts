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
 *
 * Authentication: X-Api-Key: hmp_live_...
 * Required scope:  read:licenses
 *
 * Query params:
 *   ?expiring_within_days=90   — filter to licenses expiring within N days
 *   ?country_code=QA           — filter by licensing authority country
 *   ?page=1&per_page=100
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

  const admin = createAdminClient();

  // Get approved staff IDs for this org
  const { data: links } = await admin
    .from("employer_link_requests")
    .select("professional_id")
    .eq("organization_id", ctx.organizationId)
    .eq("status", "approved");

  const staffIds = (links ?? []).map((l) => l.professional_id);
  if (staffIds.length === 0) {
    return NextResponse.json({
      data: [],
      pagination: { page, per_page: perPage, total: 0, total_pages: 0 },
      meta: { organization_id: ctx.organizationId, generated_at: new Date().toISOString(), api_version: "v1" },
    });
  }

  // Fetch license records
  let licenseQuery = admin
    .from("professional_licenses")
    .select("id, professional_id, license_number, licensing_authority, country_code, profession, specialty, issue_date, expiry_date, is_primary", { count: "exact" })
    .in("professional_id", staffIds)
    .order("expiry_date", { ascending: true })
    .range((page - 1) * perPage, page * perPage - 1);

  if (countryCode) licenseQuery = licenseQuery.eq("country_code", countryCode.toUpperCase());

  if (expiringWithin) {
    const days = parseInt(expiringWithin);
    if (!isNaN(days) && days > 0) {
      const cutoff = new Date(Date.now() + days * 86400_000).toISOString().slice(0, 10);
      licenseQuery = licenseQuery.lte("expiry_date", cutoff);
    }
  }

  const { data: licenses, count, error } = await licenseQuery;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch professional names for the records we got
  const profIds = [...new Set((licenses ?? []).map((l) => l.professional_id))];
  const { data: profiles } = profIds.length
    ? await admin
        .from("professional_profiles")
        .select("auth_id, full_name")
        .in("auth_id", profIds)
    : { data: [] };

  const nameMap = Object.fromEntries((profiles ?? []).map((p) => [p.auth_id, p.full_name]));

  const now = new Date();
  const enriched = (licenses ?? []).map((l) => {
    const daysToExpiry = l.expiry_date
      ? Math.ceil((new Date(l.expiry_date).getTime() - now.getTime()) / 86400_000)
      : null;

    return {
      id: l.id,
      professional_id: l.professional_id,
      professional_name: nameMap[l.professional_id] ?? null,
      license_number: l.license_number,
      licensing_authority: l.licensing_authority,
      country_code: l.country_code,
      profession: l.profession,
      specialty: l.specialty,
      issue_date: l.issue_date,
      expiry_date: l.expiry_date,
      days_to_expiry: daysToExpiry,
      status: daysToExpiry === null
        ? "unknown"
        : daysToExpiry < 0
          ? "expired"
          : daysToExpiry <= 30
            ? "expiring_soon"
            : daysToExpiry <= 90
              ? "expiring_90d"
              : "active",
      is_primary: l.is_primary,
    };
  });

  return NextResponse.json({
    data: enriched,
    pagination: {
      page,
      per_page: perPage,
      total: count ?? 0,
      total_pages: Math.ceil((count ?? 0) / perPage),
    },
    meta: {
      organization_id: ctx.organizationId,
      generated_at: new Date().toISOString(),
      api_version: "v1",
    },
  });
}

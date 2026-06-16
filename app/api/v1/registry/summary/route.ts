import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey, requireScope } from "@/lib/apiKeyAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { checkApiKeyRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

/**
 * GET /api/v1/registry/summary
 *
 * Aggregate compliance summary for the professional registry.
 * Returns counts by profession, compliance status, and country.
 *
 * Authentication: X-Api-Key: hmp_live_...
 * Required scope:  read:registry
 */
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? req.headers.get("authorization")?.replace("Bearer ", "");
  if (!apiKey) {
    return NextResponse.json({ error: "Missing X-Api-Key header" }, { status: 401 });
  }

  const ctx = await verifyApiKey(apiKey);
  if (!ctx) return NextResponse.json({ error: "Invalid or expired API key" }, { status: 401 });

  if (!requireScope(ctx, "read:registry")) {
    return NextResponse.json({ error: "Insufficient scope — requires read:registry" }, { status: 403 });
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
    .eq("role", "government_admin")
    .limit(1)
    .maybeSingle();

  if (!orgCheck) {
    return NextResponse.json({ error: "This endpoint is only available to government organisations" }, { status: 403 });
  }

  const { data: links } = await admin
    .from("employer_link_requests")
    .select("professional_id")
    .eq("organization_id", ctx.organizationId)
    .eq("status", "approved");

  if (!links?.length) {
    return NextResponse.json({
      total: 0,
      compliant_count: 0,
      at_risk_count: 0,
      non_compliant_count: 0,
      unknown_count: 0,
      by_profession: [],
      by_country: [],
      by_compliance_status: [],
      meta: { organization_id: ctx.organizationId, generated_at: new Date().toISOString(), api_version: "v1" },
    });
  }

  const professionalIds = links.map((l) => l.professional_id);

  const [profilesRes, walletsRes, privacyRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("auth_id, profession, country")
      .in("auth_id", professionalIds),
    admin.from("cme_wallets")
      .select("professional_id, compliance_status")
      .in("professional_id", professionalIds),
    admin.from("profile_privacy_settings")
      .select("professional_id, employer_can_view_cme_summary")
      .in("professional_id", professionalIds),
  ]);

  const professionMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.auth_id, p]));
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

  const totals  = { compliant: 0, at_risk: 0, non_compliant: 0, unknown: 0 };
  const profAgg: Record<string, number> = {};
  const countryAgg: Record<string, number> = {};
  const statusAgg: Record<string, number> = { compliant: 0, at_risk: 0, non_compliant: 0, unknown: 0 };

  for (const pid of professionalIds) {
    const visible = privacyMap[pid] !== false;
    const status  = visible ? (effectiveStatus[pid] ?? "unknown") : "unknown";
    const profile = professionMap[pid];
    const prof    = profile?.profession ?? "unknown";
    const country = profile?.country ?? "unknown";

    totals[status as keyof typeof totals] = (totals[status as keyof typeof totals] ?? 0) + 1;
    statusAgg[status]  = (statusAgg[status] ?? 0) + 1;
    profAgg[prof]      = (profAgg[prof] ?? 0) + 1;
    countryAgg[country] = (countryAgg[country] ?? 0) + 1;
  }

  return NextResponse.json({
    total:               professionalIds.length,
    compliant_count:     totals.compliant,
    at_risk_count:       totals.at_risk,
    non_compliant_count: totals.non_compliant,
    unknown_count:       totals.unknown,
    by_profession: Object.entries(profAgg)
      .sort((a, b) => b[1] - a[1])
      .map(([profession, count]) => ({ profession, count })),
    by_country: Object.entries(countryAgg)
      .sort((a, b) => b[1] - a[1])
      .map(([country, count]) => ({ country, count })),
    by_compliance_status: Object.entries(statusAgg)
      .map(([status, count]) => ({ status, count })),
    meta: { organization_id: ctx.organizationId, generated_at: new Date().toISOString(), api_version: "v1" },
  });
}

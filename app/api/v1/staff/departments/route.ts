import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey, requireScope } from "@/lib/apiKeyAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { checkApiKeyRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

/**
 * GET /api/v1/staff/departments
 *
 * HRIS integration endpoint — returns compliance summary grouped by department
 * for the API key's organisation.
 *
 * Authentication: X-Api-Key: hmp_live_...
 * Required scope:  read:compliance
 *
 * Returns one row per department (plus "unassigned" for staff with no department),
 * each containing headcount and compliance breakdown.
 */
export async function GET(req: NextRequest) {
  const apiKey =
    req.headers.get("x-api-key") ??
    req.headers.get("authorization")?.replace("Bearer ", "");

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
    return NextResponse.json(
      { error: "Insufficient scope — requires read:compliance" },
      { status: 403 }
    );
  }

  const rl = await checkApiKeyRateLimit(ctx.keyId);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded — 100 requests per minute per API key" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const admin = createAdminClient();

  // Fetch all approved staff with department, compliance status, and license expiry
  const { data: links, error } = await admin
    .from("employer_link_requests")
    .select("professional_id, department")
    .eq("organization_id", ctx.organizationId)
    .eq("status", "approved");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!links?.length) {
    return NextResponse.json({
      data: [],
      meta: {
        organization_id: ctx.organizationId,
        total_staff: 0,
        generated_at: new Date().toISOString(),
        api_version: "v1",
      },
    });
  }

  const staffIds = links.map((l) => l.professional_id);

  // Fetch wallet compliance status and license expiry for all staff
  const [walletsRes, profilesRes] = await Promise.all([
    admin
      .from("cme_wallets")
      .select("professional_id, compliance_status")
      .in("professional_id", staffIds),
    admin
      .from("professional_profiles")
      .select("auth_id, license_expiry")
      .in("auth_id", staffIds),
  ]);

  const walletMap = Object.fromEntries(
    (walletsRes.data ?? []).map((w) => [w.professional_id, w.compliance_status as string])
  );
  const profileMap = Object.fromEntries(
    (profilesRes.data ?? []).map((p) => [p.auth_id, p.license_expiry as string | null])
  );

  const now = Date.now();

  // Group by department
  const deptMap = new Map<
    string,
    {
      total: number;
      compliant: number;
      at_risk: number;
      non_compliant: number;
      unknown: number;
      expiring_30d: number;
      expired: number;
    }
  >();

  for (const link of links) {
    const deptKey = link.department ?? "unassigned";
    if (!deptMap.has(deptKey)) {
      deptMap.set(deptKey, {
        total: 0,
        compliant: 0,
        at_risk: 0,
        non_compliant: 0,
        unknown: 0,
        expiring_30d: 0,
        expired: 0,
      });
    }

    const dept = deptMap.get(deptKey)!;
    dept.total++;

    const status = walletMap[link.professional_id];
    if (status === "compliant") dept.compliant++;
    else if (status === "at_risk") dept.at_risk++;
    else if (status === "non_compliant") dept.non_compliant++;
    else dept.unknown++;

    const expiry = profileMap[link.professional_id];
    if (expiry) {
      const daysLeft = Math.ceil((new Date(expiry).getTime() - now) / 86_400_000);
      if (daysLeft < 0) dept.expired++;
      else if (daysLeft <= 30) dept.expiring_30d++;
    }
  }

  const departments = [...deptMap.entries()]
    .sort(([a], [b]) => {
      if (a === "unassigned") return 1;
      if (b === "unassigned") return -1;
      return a.localeCompare(b);
    })
    .map(([name, stats]) => ({
      department: name,
      total_staff: stats.total,
      compliance_rate_pct:
        stats.total > 0 ? Math.round((stats.compliant / stats.total) * 100) : 0,
      breakdown: {
        compliant: stats.compliant,
        at_risk: stats.at_risk,
        non_compliant: stats.non_compliant,
        no_data: stats.unknown,
      },
      license_alerts: {
        expired: stats.expired,
        expiring_within_30d: stats.expiring_30d,
      },
    }));

  return NextResponse.json({
    data: departments,
    meta: {
      organization_id: ctx.organizationId,
      total_staff: links.length,
      total_departments: [...deptMap.keys()].filter((k) => k !== "unassigned").length,
      generated_at: new Date().toISOString(),
      api_version: "v1",
    },
  });
}

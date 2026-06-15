import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey, requireScope } from "@/lib/apiKeyAuth";
import { createAdminClient } from "@/lib/supabase/server";

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
 *   ?profession=physician|nurse|...
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

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const perPage = Math.min(200, Math.max(1, parseInt(searchParams.get("per_page") ?? "100")));
  const statusFilter = searchParams.get("status");
  const professionFilter = searchParams.get("profession");

  const admin = createAdminClient();

  // Get linked professionals for this org
  let query = admin
    .from("employer_link_requests")
    .select(`
      professional_id,
      professional_profiles!inner(
        auth_id, full_name, profession, specialty,
        cme_wallets(
          country, profession, compliance_status,
          completed_credits, required_credits, cycle_end_date
        )
      )
    `)
    .eq("organization_id", ctx.organizationId)
    .eq("status", "approved")
    .range((page - 1) * perPage, page * perPage - 1);

  const { data: links, error, count } = await admin
    .from("employer_link_requests")
    .select("professional_id", { count: "exact", head: true })
    .eq("organization_id", ctx.organizationId)
    .eq("status", "approved");

  const totalCount = count ?? 0;

  const { data: staffLinks } = await query;

  type ProfileRow = {
    auth_id: string;
    full_name: string | null;
    profession: string | null;
    specialty: string | null;
    cme_wallets: {
      country: string;
      profession: string;
      compliance_status: string;
      completed_credits: number;
      required_credits: number;
      cycle_end_date: string | null;
    }[];
  };

  type LinkRow = {
    professional_id: string;
    professional_profiles: ProfileRow | ProfileRow[];
  };

  const staff = (staffLinks as unknown as LinkRow[] ?? []).map((link) => {
    const profile = Array.isArray(link.professional_profiles)
      ? link.professional_profiles[0]
      : link.professional_profiles;

    const wallets = profile?.cme_wallets ?? [];

    return {
      professional_id: link.professional_id,
      full_name: profile?.full_name ?? null,
      profession: profile?.profession ?? null,
      specialty: profile?.specialty ?? null,
      compliance: wallets.map((w) => ({
        country: w.country,
        profession: w.profession,
        status: w.compliance_status,
        completed_credits: w.completed_credits,
        required_credits: w.required_credits,
        cycle_end_date: w.cycle_end_date,
        gap: Math.max(0, w.required_credits - w.completed_credits),
        pct_complete: w.required_credits > 0
          ? Math.round((w.completed_credits / w.required_credits) * 100)
          : 100,
      })),
      overall_status: wallets.length === 0
        ? "unknown"
        : wallets.every((w) => w.compliance_status === "compliant")
          ? "compliant"
          : wallets.some((w) => w.compliance_status === "non_compliant")
            ? "non_compliant"
            : "at_risk",
    };
  });

  // Apply filters after fetch (wallet filters)
  const filtered = staff.filter((s) => {
    if (statusFilter && s.overall_status !== statusFilter) return false;
    if (professionFilter && s.profession !== professionFilter) return false;
    return true;
  });

  return NextResponse.json({
    data: filtered,
    pagination: {
      page,
      per_page: perPage,
      total: totalCount,
      total_pages: Math.ceil(totalCount / perPage),
    },
    meta: {
      organization_id: ctx.organizationId,
      generated_at: new Date().toISOString(),
      api_version: "v1",
    },
  });
}

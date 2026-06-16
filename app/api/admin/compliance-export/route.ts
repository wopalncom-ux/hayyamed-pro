import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * GET /api/admin/compliance-export
 *
 * Exports platform compliance data as CSV, formatted for QCHP regulatory submission.
 * Supports filtering by country, profession, and status.
 *
 * Query params:
 *   ?country=QA
 *   ?profession=physician
 *   ?status=compliant|at_risk|non_compliant
 */
export async function GET(req: NextRequest) {
  // Admin auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();

  if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const countryFilter    = searchParams.get("country")    ?? "";
  const professionFilter = searchParams.get("profession") ?? "";
  const statusFilter     = searchParams.get("status")     ?? "";

  // Fetch wallets + join profiles + licenses
  let walletQuery = admin
    .from("cme_wallets")
    .select(`
      professional_id,
      country,
      profession,
      compliance_status,
      completed_credits,
      required_credits,
      cycle_start_date,
      cycle_end_date
    `)
    .order("country", { ascending: true })
    .order("compliance_status", { ascending: true });

  if (countryFilter)    walletQuery = walletQuery.eq("country", countryFilter);
  if (professionFilter) walletQuery = walletQuery.eq("profession", professionFilter);
  if (statusFilter)     walletQuery = walletQuery.eq("compliance_status", statusFilter);

  const { data: wallets, error } = await walletQuery;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (!wallets || wallets.length === 0) {
    return new NextResponse("No,records,found\n", {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="hayya-med-compliance-export-empty.csv"`,
      },
    });
  }

  // Get professional IDs for profile lookup
  const profIds = [...new Set(wallets.map((w) => w.professional_id))];

  const [profilesRes, licensesRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("auth_id, full_name, email, profession, specialty, license_number, phone")
      .in("auth_id", profIds),
    admin.from("professional_licenses")
      .select("professional_id, license_number, licensing_authority, country_code, profession, expiry_date, is_primary")
      .in("professional_id", profIds)
      .eq("is_primary", true),
  ]);

  const profileMap = Object.fromEntries(
    (profilesRes.data ?? []).map((p) => [p.auth_id, p])
  );
  const licenseMap = Object.fromEntries(
    (licensesRes.data ?? []).map((l) => [l.professional_id, l])
  );

  // Build CSV rows
  const headers = [
    "professional_id",
    "full_name",
    "email",
    "profession",
    "specialty",
    "license_number",
    "licensing_authority",
    "license_expiry",
    "country",
    "compliance_status",
    "completed_credits",
    "required_credits",
    "gap",
    "pct_complete",
    "cycle_start",
    "cycle_end",
    "export_date",
  ];

  const exportDate = new Date().toISOString().slice(0, 10);

  const rows = wallets.map((w) => {
    const p = profileMap[w.professional_id];
    const l = licenseMap[w.professional_id];
    const gap = Math.max(0, (w.required_credits ?? 0) - (w.completed_credits ?? 0));
    const pct = (w.required_credits ?? 0) > 0
      ? Math.round(((w.completed_credits ?? 0) / w.required_credits) * 100)
      : 100;

    return [
      w.professional_id,
      csvEscape(p?.full_name ?? ""),
      csvEscape(p?.email ?? ""),
      csvEscape(w.profession ?? p?.profession ?? ""),
      csvEscape(p?.specialty ?? ""),
      csvEscape(l?.license_number ?? p?.license_number ?? ""),
      csvEscape(l?.licensing_authority ?? ""),
      l?.expiry_date ?? "",
      w.country ?? "",
      w.compliance_status ?? "unknown",
      w.completed_credits ?? 0,
      w.required_credits ?? 0,
      gap,
      pct,
      w.cycle_start_date ?? "",
      w.cycle_end_date ?? "",
      exportDate,
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  const safeCountry = (countryFilter    || "all-countries").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 10) || "all-countries";
  const safeProf   = (professionFilter || "all-professions").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 20) || "all-professions";
  const filename = `hayya-med-compliance-${safeCountry}-${safeProf}-${exportDate}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";

export const runtime = "nodejs";

function csvCell(val: string | null | undefined): string {
  const s = val ?? "";
  if (/^[=+\-@\t\r]/.test(s)) {
    return `"\t${s.replace(/"/g, '""')}"`;
  }
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(request: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = request.nextUrl.searchParams.get("orgId");
  if (!orgId) return NextResponse.json({ error: "Missing orgId" }, { status: 400 });

  const admin = createAdminClient();

  // Verify caller is employer_admin for this org
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("organization_id", orgId)
    .eq("role", "employer_admin")
    .limit(1)
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? "Organization";

  const { data: approved } = await admin
    .from("employer_link_requests")
    .select("professional_id, department")
    .eq("organization_id", orgId)
    .eq("status", "approved");

  if (!approved?.length) {
    return NextResponse.json({ error: "No staff linked" }, { status: 404 });
  }

  const staffIds = approved.map((r) => r.professional_id);
  const deptMap = Object.fromEntries(approved.map((r) => [r.professional_id, r.department ?? ""]));

  const [profilesRes, privacyRes, walletsRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("auth_id, full_name, profession, specialty, license_number, licensing_authority, license_expiry")
      .in("auth_id", staffIds),
    admin.from("profile_privacy_settings")
      .select("professional_id, employer_can_view_cme_summary, employer_can_view_license_expiry")
      .in("professional_id", staffIds),
    admin.from("cme_wallets")
      .select("professional_id, completed_credits, required_credits, compliance_status, country, cycle_end_date")
      .in("professional_id", staffIds),
  ]);

  const profileMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.auth_id, p]));
  const privacyMap = Object.fromEntries((privacyRes.data ?? []).map((p) => [p.professional_id, p]));
  const walletMap = Object.fromEntries((walletsRes.data ?? []).map((w) => [w.professional_id, w]));

  const csvCols = [
    "Name",
    "Profession",
    "Specialty",
    "Department",
    "License Number",
    "Licensing Authority",
    "License Expiry",
    "Days to License Expiry",
    "CME Country",
    "CME Completed",
    "CME Required",
    "CME Progress %",
    "Compliance Status",
    "CME Cycle End",
  ];

  const rows = staffIds.map((id) => {
    const p = profileMap[id];
    const privacy = privacyMap[id];
    const wallet = walletMap[id];
    const cmeVisible = privacy?.employer_can_view_cme_summary !== false;
    const licenseVisible = privacy?.employer_can_view_license_expiry !== false;

    const licenseExpiry = licenseVisible ? (p?.license_expiry ?? null) : null;
    const daysToExpiry = licenseExpiry
      ? Math.ceil((new Date(licenseExpiry).getTime() - Date.now()) / 86400000)
      : null;

    const completed = cmeVisible ? (wallet?.completed_credits ?? null) : null;
    const required = cmeVisible ? (wallet?.required_credits ?? null) : null;
    const pct = completed !== null && required ? Math.round((completed / required) * 100) : null;

    return [
      p?.full_name ?? "Unknown",
      p?.profession ?? "",
      p?.specialty ?? "",
      deptMap[id] ?? "",
      licenseVisible ? (p?.license_number ?? "") : "Private",
      licenseVisible ? (p?.licensing_authority ?? "") : "Private",
      licenseExpiry ?? (licenseVisible ? "" : "Private"),
      daysToExpiry !== null ? String(daysToExpiry) : (licenseVisible ? "" : "Private"),
      cmeVisible ? (wallet?.country ?? "") : "Private",
      completed !== null ? String(completed) : (cmeVisible ? "" : "Private"),
      required !== null ? String(required) : (cmeVisible ? "" : "Private"),
      pct !== null ? `${pct}%` : (cmeVisible ? "" : "Private"),
      cmeVisible ? (wallet?.compliance_status ?? "") : "Private",
      cmeVisible ? (wallet?.cycle_end_date ?? "") : "Private",
    ].map(csvCell);
  });

  const csv = [
    csvCols.map(csvCell).join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\r\n");

  const filename = `${orgName.replace(/[^a-zA-Z0-9-]/g, "-")}-Staff-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

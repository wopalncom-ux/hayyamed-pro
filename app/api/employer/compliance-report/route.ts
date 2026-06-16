import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";

export const runtime = "nodejs";

function esc(s: string | null | undefined): string {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET(request: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = request.nextUrl.searchParams.get("orgId");
  if (!orgId) return NextResponse.json({ error: "Missing orgId" }, { status: 400 });

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("organization_id", orgId)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? "Organization";

  const { data: approved } = await admin
    .from("employer_link_requests")
    .select("professional_id, department")
    .eq("organization_id", orgId)
    .eq("status", "approved");

  const staffIds = (approved ?? []).map((r) => r.professional_id);
  const deptMap = Object.fromEntries((approved ?? []).map((r) => [r.professional_id, r.department ?? ""]));

  const [profilesRes, privacyRes, walletsRes] = await Promise.all([
    staffIds.length
      ? admin.from("professional_profiles")
          .select("auth_id, full_name, profession, specialty, license_expiry")
          .in("auth_id", staffIds)
      : Promise.resolve({ data: [] }),
    staffIds.length
      ? admin.from("profile_privacy_settings")
          .select("professional_id, employer_can_view_cme_summary, employer_can_view_license_expiry")
          .in("professional_id", staffIds)
      : Promise.resolve({ data: [] }),
    staffIds.length
      ? admin.from("cme_wallets")
          .select("professional_id, completed_credits, required_credits, compliance_status, country, cycle_end_date")
          .in("professional_id", staffIds)
      : Promise.resolve({ data: [] }),
  ]);

  const profileMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.auth_id, p]));
  const privacyMap = Object.fromEntries((privacyRes.data ?? []).map((p) => [p.professional_id, p]));
  const walletMap = Object.fromEntries((walletsRes.data ?? []).map((w) => [w.professional_id, w]));

  const staff = staffIds.map((id) => {
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
    return {
      id,
      name: p?.full_name ?? "Unknown",
      profession: p?.profession ?? "",
      specialty: p?.specialty ?? "",
      department: deptMap[id] ?? "",
      licenseExpiry: licenseVisible ? licenseExpiry : null,
      licenseVisible,
      daysToExpiry,
      completed,
      required,
      pct,
      status: cmeVisible ? (wallet?.compliance_status ?? "unknown") : null,
      country: cmeVisible ? (wallet?.country ?? "") : null,
      cycleEnd: cmeVisible ? (wallet?.cycle_end_date ?? null) : null,
      cmeVisible,
    };
  });

  const total = staff.length;
  const compliant = staff.filter((s) => s.status === "compliant").length;
  const atRisk = staff.filter((s) => s.status === "at_risk").length;
  const nonCompliant = staff.filter((s) => s.status === "non_compliant").length;
  const expiringSoon = staff.filter((s) => s.daysToExpiry !== null && s.daysToExpiry <= 30 && s.daysToExpiry >= 0).length;
  const generatedAt = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const statusBadge = (s: string | null) => {
    if (!s) return '<span style="background:#f1f5f9;color:#64748b;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600">No Data</span>';
    const map: Record<string, string> = {
      compliant: "background:#dcfce7;color:#16a34a",
      at_risk: "background:#fff7ed;color:#d97706",
      non_compliant: "background:#fef2f2;color:#dc2626",
      unknown: "background:#f1f5f9;color:#64748b",
    };
    const labels: Record<string, string> = {
      compliant: "Compliant",
      at_risk: "At Risk",
      non_compliant: "Non-Compliant",
      unknown: "No Data",
    };
    return `<span style="${map[s] ?? map.unknown};padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600">${labels[s] ?? s}</span>`;
  };

  const rows = staff.map((s) => `
    <tr>
      <td>${esc(s.name)}</td>
      <td>${esc(s.profession)}${s.specialty ? ` — ${esc(s.specialty)}` : ""}</td>
      <td>${esc(s.department) || "—"}</td>
      <td>${s.licenseExpiry ? new Date(s.licenseExpiry).toLocaleDateString("en-GB") : (s.licenseVisible ? "—" : "Private")}</td>
      <td>${s.daysToExpiry !== null ? `${s.daysToExpiry}d` : "—"}</td>
      <td>${s.completed !== null ? `${s.completed}/${s.required}` : "—"}</td>
      <td>${s.pct !== null ? `${s.pct}%` : "—"}</td>
      <td>${statusBadge(s.status)}</td>
      <td>${s.cycleEnd ? new Date(s.cycleEnd).toLocaleDateString("en-GB") : "—"}</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(orgName)} — Staff Compliance Report</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; background: #fff; padding: 32px; font-size: 13px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid #1a56a0; }
  .brand { display: flex; align-items: center; gap: 10px; }
  .brand-icon { width: 36px; height: 36px; background: #1a56a0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 16px; }
  .brand-name { font-size: 17px; font-weight: 700; color: #111; }
  .brand-name span { color: #1a56a0; }
  .report-meta { text-align: right; color: #64748b; font-size: 12px; }
  .report-meta h1 { font-size: 18px; font-weight: 700; color: #111; margin-bottom: 4px; }
  .summary { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 24px; }
  .stat { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; text-align: center; }
  .stat-val { font-size: 26px; font-weight: 700; }
  .stat-label { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; margin-top: 2px; }
  .blue { color: #1a56a0; } .green { color: #16a34a; } .orange { color: #d97706; } .red { color: #dc2626; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead tr { background: #f8fafc; }
  th { padding: 9px 10px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
  td { padding: 9px 10px; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
  tr:hover td { background: #fafbfc; }
  .footer { text-align: center; color: #94a3b8; font-size: 11px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
  @media print {
    body { padding: 16px; font-size: 11px; }
    .no-print { display: none !important; }
    th, td { padding: 6px 8px; font-size: 10px; }
    .stat-val { font-size: 20px; }
  }
</style>
</head>
<body>
<div class="header">
  <div class="brand">
    <div class="brand-icon">H</div>
    <div>
      <div class="brand-name">Hayya Med <span>Pro</span></div>
      <div style="font-size:11px;color:#64748b">Healthcare Compliance Platform</div>
    </div>
  </div>
  <div class="report-meta">
    <h1>Staff Compliance Report</h1>
    <div>${esc(orgName)}</div>
    <div>Generated: ${generatedAt}</div>
  </div>
</div>

<div class="summary">
  <div class="stat"><div class="stat-val blue">${total}</div><div class="stat-label">Total Staff</div></div>
  <div class="stat"><div class="stat-val green">${compliant}</div><div class="stat-label">Compliant</div></div>
  <div class="stat"><div class="stat-val orange">${atRisk}</div><div class="stat-label">At Risk</div></div>
  <div class="stat"><div class="stat-val red">${nonCompliant}</div><div class="stat-label">Non-Compliant</div></div>
  <div class="stat"><div class="stat-val ${expiringSoon > 0 ? "red" : "green"}">${expiringSoon}</div><div class="stat-label">License ≤30d</div></div>
</div>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Profession / Specialty</th>
      <th>Department</th>
      <th>License Expiry</th>
      <th>Days Left</th>
      <th>CME Credits</th>
      <th>Progress</th>
      <th>Status</th>
      <th>Cycle End</th>
    </tr>
  </thead>
  <tbody>
    ${rows || '<tr><td colspan="9" style="text-align:center;color:#64748b;padding:24px">No staff linked yet.</td></tr>'}
  </tbody>
</table>

<div class="footer">
  <p>Hayya Med Pro · hayyamed.pro · This report reflects staff compliance data at the time of generation.</p>
  <p>Staff members control their own data visibility. Fields marked Private are hidden by the staff member's privacy settings.</p>
</div>

<script class="no-print">window.addEventListener('load', () => window.print());</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

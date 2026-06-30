import { NextResponse } from "next/server";
import { headers } from "next/headers";
import ExcelJS from "exceljs";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getAuthorityForUser, getJurisdictionProfessionals, computeStats } from "@/lib/government/jurisdiction";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const STATUS_LABEL: Record<string, string> = {
  compliant: "Compliant",
  at_risk: "At Risk",
  non_compliant: "Non-Compliant",
  unknown: "No Data",
};

// GET /api/government/export-registry — full jurisdiction registry as Excel (.xlsx)
export async function GET(): Promise<NextResponse> {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const authority = await getAuthorityForUser(user.id);
  if (!authority) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const professionals = await getJurisdictionProfessionals(authority, user.id);
  const stats = computeStats(professionals);

  const wb = new ExcelJS.Workbook();
  wb.creator = "Hayya Med Pro";
  wb.created = new Date();

  // ── Summary sheet ──────────────────────────────────────────────
  const summary = wb.addWorksheet("Summary");
  summary.columns = [{ width: 28 }, { width: 18 }];
  summary.addRow([`${authority.authorityCode ?? authority.orgName} — Compliance Registry`]);
  summary.getCell("A1").font = { bold: true, size: 14, color: { argb: "FF1A56A0" } };
  summary.addRow([`Jurisdiction: ${authority.jurisdictionCountry}`]);
  summary.addRow([`Generated: ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`]);
  summary.addRow([]);
  const summaryRows: [string, number | string][] = [
    ["Total registered", stats.total],
    ["Compliant", stats.compliant],
    ["At risk", stats.atRisk],
    ["Non-compliant", stats.nonCompliant],
    ["No data", stats.unknown],
    ["License expiring ≤30d", stats.expiringSoon],
    ["License expired", stats.expired],
    ["Compliance rate", `${stats.complianceRate}%`],
  ];
  summaryRows.forEach(([k, v]) => {
    const row = summary.addRow([k, v]);
    row.getCell(1).font = { color: { argb: "FF64748B" } };
    row.getCell(2).font = { bold: true };
  });

  // ── Registry sheet ─────────────────────────────────────────────
  const ws = wb.addWorksheet("Registry");
  ws.columns = [
    { header: "Name", key: "name", width: 26 },
    { header: "Profession", key: "profession", width: 18 },
    { header: "Specialty", key: "specialty", width: 20 },
    { header: "Employer", key: "employer", width: 26 },
    { header: "License #", key: "license", width: 16 },
    { header: "CME Completed", key: "completed", width: 14 },
    { header: "CME Required", key: "required", width: 14 },
    { header: "Status", key: "status", width: 16 },
    { header: "License Expiry", key: "expiry", width: 16 },
    { header: "Days To Expiry", key: "days", width: 14 },
  ];
  ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  ws.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A56A0" } };
  ws.views = [{ state: "frozen", ySplit: 1 }];

  for (const p of professionals) {
    ws.addRow({
      name: p.name,
      profession: p.profession,
      specialty: p.specialty,
      employer: p.employer ?? "Unaffiliated",
      license: p.licenseNumber ?? "",
      completed: p.completedCredits ?? "",
      required: p.requiredCredits ?? "",
      status: STATUS_LABEL[p.complianceStatus] ?? p.complianceStatus,
      expiry: p.licenseExpiry ?? "",
      days: p.daysToExpiry ?? "",
    });
  }
  ws.autoFilter = { from: "A1", to: "J1" };

  const buffer = await wb.xlsx.writeBuffer();

  logAudit({
    actorAuthId: user.id,
    action: "government.registry_exported",
    targetTable: "professional_profiles",
    targetId: authority.organizationId,
    metadata: { format: "xlsx", rows: professionals.length, jurisdiction: authority.jurisdictionCountry },
  });

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="registry-${authority.jurisdictionCountry}-${date}.xlsx"`,
    },
  });
}

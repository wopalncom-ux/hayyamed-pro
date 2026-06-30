import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getAuthorityForUser, getJurisdictionProfessionals } from "@/lib/government/jurisdiction";
import { logAudit } from "@/lib/audit";

function csvCell(v: string | number | null | undefined): string {
  const s = v == null ? "" : String(v);
  const safe = /^[=+\-@\t\r]/.test(s) ? `\t${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(): Promise<NextResponse> {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const authority = await getAuthorityForUser(user.id);
  if (!authority) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const header = "name,profession,specialty,employer,license_number,cme_completed,cme_required,compliance_status,license_expiry,days_to_expiry";

  const professionals = await getJurisdictionProfessionals(authority, user.id);
  const rows = professionals.map((p) => [
    csvCell(p.name),
    csvCell(p.profession),
    csvCell(p.specialty),
    csvCell(p.employer ?? "Unaffiliated"),
    csvCell(p.licenseNumber),
    csvCell(p.completedCredits),
    csvCell(p.requiredCredits),
    csvCell(p.complianceStatus),
    csvCell(p.licenseExpiry),
    csvCell(p.daysToExpiry),
  ].join(","));

  const csv = [header, ...rows].join("\n");

  logAudit({
    actorAuthId: user.id,
    action: "government.registry_exported",
    targetTable: "professional_profiles",
    targetId: authority.organizationId,
    metadata: { rows: rows.length, jurisdiction: authority.jurisdictionCountry, authority: authority.authorityCode },
  });

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="registry-${authority.jurisdictionCountry}-${date}.csv"`,
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getAuthorityForUser, getJurisdictionProfessionals } from "@/lib/government/jurisdiction";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";
import { renderToBuffer } from "@react-pdf/renderer";
import { GovernmentReportDocument } from "@/components/pdf/GovernmentReportDocument";
import React from "react";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const authority = await getAuthorityForUser(user.id);
  if (!authority) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // If an orgId is supplied it must match the caller's authority
  const orgId = request.nextUrl.searchParams.get("orgId");
  if (orgId && orgId !== authority.organizationId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rl = await checkAndLogRateLimit({ action: "pdf.government_report", userId: user.id, maxPerHour: 10 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, {
      status: 429,
      headers: { "Retry-After": String(rl.retryAfterSeconds ?? 3600) },
    });
  }

  const authorityCode = authority.authorityCode ?? authority.orgName.slice(0, 10).toUpperCase();

  const jp = await getJurisdictionProfessionals(authority, user.id);
  const professionals = jp.map((p) => ({
    name: p.name,
    profession: p.profession,
    specialty: p.specialty,
    completedCredits: p.completedCredits,
    requiredCredits: p.requiredCredits,
    complianceStatus: p.complianceStatus,
    daysToExpiry: p.daysToExpiry,
  }));

  const buffer = await renderToBuffer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.createElement(GovernmentReportDocument, {
      authorityName: authority.orgName,
      authorityCode,
      jurisdictionCountry: authority.jurisdictionCountry,
      generatedAt: new Date().toISOString(),
      professionals,
    }) as any
  );

  const safeCode = authorityCode.replace(/[\r\n\t"]/g, "").replace(/\s+/g, "-").slice(0, 40) || "Authority";

  logAudit({
    actorAuthId: user.id,
    action: "pdf.government_report_downloaded",
    targetTable: "organizations",
    targetId: authority.organizationId,
    metadata: { authorityCode, professionalCount: professionals.length, jurisdiction: authority.jurisdictionCountry },
  }).catch(() => {});

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeCode}-Compliance-Report-${new Date().toISOString().slice(0, 10)}.pdf"`,
    },
  });
}

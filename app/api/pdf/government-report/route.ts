import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";
import { renderToBuffer } from "@react-pdf/renderer";
import { GovernmentReportDocument } from "@/components/pdf/GovernmentReportDocument";
import React from "react";

export const runtime = "nodejs";

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
    .eq("role", "government_admin")
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rl = await checkAndLogRateLimit({ action: "pdf.government_report", userId: user.id, maxPerHour: 10 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, {
      status: 429,
      headers: { "Retry-After": String(rl.retryAfterSeconds ?? 3600) },
    });
  }

  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? "Authority";

  const { data: govSettings } = await admin
    .from("government_settings")
    .select("authority_code, jurisdiction_country")
    .eq("organization_id", orgId)
    .maybeSingle();

  const authorityCode = govSettings?.authority_code ?? orgName.slice(0, 10).toUpperCase();
  const jurisdictionCountry = govSettings?.jurisdiction_country ?? "—";

  const { data: approved } = await admin
    .from("employer_link_requests")
    .select("professional_id")
    .eq("organization_id", orgId)
    .eq("status", "approved");

  const approvedIds = (approved ?? []).map((r) => r.professional_id);

  if (approvedIds.length === 0) {
    return NextResponse.json({ error: "No registered professionals" }, { status: 404 });
  }

  const [profilesRes, privacyRes, walletsRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("auth_id, full_name, profession, specialty, license_expiry")
      .in("auth_id", approvedIds),
    admin.from("profile_privacy_settings")
      .select("professional_id, employer_can_view_cme_summary, employer_can_view_license_expiry")
      .in("professional_id", approvedIds),
    admin.from("cme_wallets")
      .select("professional_id, completed_credits, required_credits, compliance_status")
      .in("professional_id", approvedIds),
  ]);

  const profileMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.auth_id, p]));
  const privacyMap = Object.fromEntries((privacyRes.data ?? []).map((p) => [p.professional_id, p]));
  const walletMap = Object.fromEntries((walletsRes.data ?? []).map((w) => [w.professional_id, w]));

  const professionals = approvedIds.map((id) => {
    const profile = profileMap[id];
    const privacy = privacyMap[id];
    const wallet = walletMap[id];
    const cmeVisible = privacy?.employer_can_view_cme_summary !== false;
    const licenseVisible = privacy?.employer_can_view_license_expiry !== false;
    const licenseExpiry = licenseVisible ? (profile?.license_expiry ?? null) : null;
    const daysToExpiry = licenseExpiry
      ? Math.ceil((new Date(licenseExpiry).getTime() - Date.now()) / 86400000)
      : null;

    return {
      name: profile?.full_name ?? "Unknown",
      profession: profile?.profession ?? "Unknown",
      specialty: profile?.specialty ?? "—",
      completedCredits: cmeVisible ? (wallet?.completed_credits ?? null) : null,
      requiredCredits: cmeVisible ? (wallet?.required_credits ?? null) : null,
      complianceStatus: cmeVisible && wallet ? (wallet.compliance_status ?? "unknown") : "unknown",
      daysToExpiry,
    };
  });

  const buffer = await renderToBuffer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.createElement(GovernmentReportDocument, {
      authorityName: orgName,
      authorityCode,
      jurisdictionCountry,
      generatedAt: new Date().toISOString(),
      professionals,
    }) as any
  );

  const safeCode = authorityCode.replace(/[\r\n\t"]/g, "").replace(/\s+/g, "-").slice(0, 40) || "Authority";

  logAudit({
    actorAuthId: user.id,
    action: "pdf.government_report_downloaded",
    targetTable: "organizations",
    targetId: orgId,
    metadata: { authorityCode, professionalCount: professionals.length },
  }).catch(() => {});

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeCode}-Compliance-Report-${new Date().toISOString().slice(0, 10)}.pdf"`,
    },
  });
}

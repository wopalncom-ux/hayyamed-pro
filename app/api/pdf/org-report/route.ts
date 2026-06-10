import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { OrgReportDocument } from "@/components/pdf/OrgReportDocument";
import React from "react";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = request.nextUrl.searchParams.get("orgId");
  if (!orgId) return NextResponse.json({ error: "Missing orgId" }, { status: 400 });

  const admin = createAdminClient();

  // Verify user is employer_admin for this org
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
    .select("professional_id")
    .eq("organization_id", orgId)
    .eq("status", "approved");

  const staffIds = (approved ?? []).map((r) => r.professional_id);

  if (staffIds.length === 0) {
    return NextResponse.json({ error: "No staff linked" }, { status: 404 });
  }

  const [profilesRes, privacyRes, walletsRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("auth_id, full_name, profession, license_expiry")
      .in("auth_id", staffIds),
    admin.from("profile_privacy_settings")
      .select("professional_id, employer_can_view_cme_summary, employer_can_view_license_expiry")
      .in("professional_id", staffIds),
    admin.from("cme_wallets")
      .select("professional_id, completed_credits, required_credits, compliance_status")
      .in("professional_id", staffIds),
  ]);

  const profileMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.auth_id, p]));
  const privacyMap = Object.fromEntries((privacyRes.data ?? []).map((p) => [p.professional_id, p]));
  const walletMap = Object.fromEntries((walletsRes.data ?? []).map((w) => [w.professional_id, w]));

  const staff = staffIds.map((id) => {
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
      profession: profile?.profession ?? "—",
      completedCredits: cmeVisible ? (wallet?.completed_credits ?? null) : null,
      requiredCredits: cmeVisible ? (wallet?.required_credits ?? null) : null,
      complianceStatus: cmeVisible && wallet ? (wallet.compliance_status ?? "unknown") : "unknown",
      daysToExpiry,
    };
  });

  const buffer = await renderToBuffer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.createElement(OrgReportDocument, {
      orgName,
      staff,
      generatedAt: new Date().toISOString(),
    }) as any
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${orgName.replace(/\s+/g, "-")}-Compliance-${new Date().toISOString().slice(0, 10)}.pdf"`,
    },
  });
}

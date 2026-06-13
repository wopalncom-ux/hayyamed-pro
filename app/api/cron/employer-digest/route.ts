import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendEmployerDigestEmail, DigestStaffAlert } from "@/lib/email";
import { pingCronMonitor } from "@/lib/cronMonitor";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // All employer admins with their org
  const { data: members, error: membersErr } = await admin
    .from("organization_members")
    .select("auth_id, organization_id, organizations(name)")
    .eq("role", "employer_admin");

  if (membersErr || !members?.length) {
    return NextResponse.json({ sent: 0 });
  }

  const weekOf = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  // Batch-fetch email + name for all admin auth_ids in one query
  const adminIds = members.map((m) => m.auth_id);
  const { data: adminProfiles } = await admin
    .from("professional_profiles")
    .select("auth_id, email, full_name")
    .in("auth_id", adminIds);
  const adminProfileMap = Object.fromEntries(
    (adminProfiles ?? []).map((p) => [p.auth_id, p])
  );

  let sent = 0;

  for (const member of members) {
    const orgId = member.organization_id;
    const orgs = member.organizations as { name: string }[] | { name: string } | null;
    const orgName = (Array.isArray(orgs) ? orgs[0]?.name : (orgs as { name: string } | null)?.name) ?? "Your Organization";

    const adminProfile = adminProfileMap[member.auth_id];
    const adminEmail = adminProfile?.email;
    if (!adminEmail) continue;
    const adminName = adminProfile?.full_name ?? adminEmail;

    // Fetch approved links for this org
    const { data: links } = await admin
      .from("employer_link_requests")
      .select("professional_id, department")
      .eq("organization_id", orgId)
      .eq("status", "approved");

    if (!links?.length) {
      // Skip orgs with no staff
      continue;
    }

    const staffIds = links.map((l) => l.professional_id);
    const deptByProfId = Object.fromEntries(links.map((l) => [l.professional_id, l.department ?? null]));

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

    let total = 0, compliant = 0, atRisk = 0, nonCompliant = 0, expiringSoon = 0;
    const alerts: DigestStaffAlert[] = [];

    for (const profId of staffIds) {
      total++;
      const profile = profileMap[profId];
      const privacy = privacyMap[profId];
      const wallet = walletMap[profId];
      const cmeVisible = privacy?.employer_can_view_cme_summary !== false;
      const licenseVisible = privacy?.employer_can_view_license_expiry !== false;

      const licenseExpiry = licenseVisible ? (profile?.license_expiry ?? null) : null;
      const daysToExpiry = licenseExpiry
        ? Math.ceil((new Date(licenseExpiry).getTime() - Date.now()) / 86400000)
        : null;

      const status = (cmeVisible && wallet?.compliance_status) ? wallet.compliance_status as DigestStaffAlert["complianceStatus"] : "unknown";

      if (status === "compliant") compliant++;
      else if (status === "at_risk") atRisk++;
      else if (status === "non_compliant") nonCompliant++;

      if (daysToExpiry !== null && daysToExpiry <= 30 && daysToExpiry >= 0) expiringSoon++;

      const needsAttention = status === "non_compliant" || status === "at_risk" ||
        (daysToExpiry !== null && daysToExpiry <= 30);

      if (needsAttention) {
        alerts.push({
          name: profile?.full_name ?? "Unknown",
          profession: profile?.profession ?? "—",
          department: deptByProfId[profId] ?? null,
          complianceStatus: status,
          completedCredits: cmeVisible ? (wallet?.completed_credits ?? null) : null,
          requiredCredits: cmeVisible ? (wallet?.required_credits ?? null) : null,
          daysToExpiry,
        });
      }
    }

    // Sort alerts: non-compliant first, then at-risk, then license expiring soonest
    alerts.sort((a, b) => {
      const rank = (s: DigestStaffAlert) =>
        s.complianceStatus === "non_compliant" ? 0 : s.complianceStatus === "at_risk" ? 1 : 2;
      return rank(a) - rank(b) || (a.daysToExpiry ?? 999) - (b.daysToExpiry ?? 999);
    });

    await sendEmployerDigestEmail({
      to: adminEmail,
      adminName,
      orgName,
      total,
      compliant,
      atRisk,
      nonCompliant,
      expiringSoon,
      alerts,
      weekOf,
    });

    sent++;
  }

  await pingCronMonitor("employer-digest");
  return NextResponse.json({ sent });
}

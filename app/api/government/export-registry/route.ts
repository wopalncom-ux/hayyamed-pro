import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export async function GET(): Promise<NextResponse> {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const orgId = member.organization_id;
  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const org = Array.isArray(_orgs) ? _orgs[0] : (_orgs as { name: string } | null);
  const orgName = org?.name ?? "Authority";

  const { data: approved } = await admin
    .from("employer_link_requests")
    .select("professional_id")
    .eq("organization_id", orgId)
    .eq("status", "approved");

  const approvedIds = (approved ?? []).map((r) => r.professional_id);
  if (approvedIds.length === 0) {
    return new NextResponse("name,profession,specialty,country,cme_completed,cme_required,compliance_status,license_expiry\n", {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="registry-empty.csv"`,
      },
    });
  }

  const [profilesRes, privacyRes, walletsRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("auth_id, full_name, profession, specialty, license_expiry, country")
      .in("auth_id", approvedIds),
    admin.from("profile_privacy_settings")
      .select("professional_id, employer_can_view_cme_summary, employer_can_view_license_expiry")
      .in("professional_id", approvedIds),
    admin.from("cme_wallets")
      .select("professional_id, completed_credits, required_credits, compliance_status")
      .in("professional_id", approvedIds),
  ]);

  const privacyMap = Object.fromEntries((privacyRes.data ?? []).map((p) => [p.professional_id, p]));
  const walletMap = Object.fromEntries((walletsRes.data ?? []).map((w) => [w.professional_id, w]));

  const rows = (profilesRes.data ?? []).map((profile) => {
    const privacy = privacyMap[profile.auth_id];
    const wallet = walletMap[profile.auth_id];
    const cmeVisible = privacy?.employer_can_view_cme_summary !== false;
    const licenseVisible = privacy?.employer_can_view_license_expiry !== false;

    return [
      `"${(profile.full_name ?? "Unknown").replace(/"/g, '""')}"`,
      `"${(profile.profession ?? "—").replace(/"/g, '""')}"`,
      `"${(profile.specialty ?? "—").replace(/"/g, '""')}"`,
      `"${(profile.country ?? "—").replace(/"/g, '""')}"`,
      cmeVisible ? (wallet?.completed_credits ?? "") : "private",
      cmeVisible ? (wallet?.required_credits ?? "") : "private",
      cmeVisible ? (wallet?.compliance_status ?? "unknown") : "private",
      licenseVisible ? (profile.license_expiry ?? "") : "private",
    ].join(",");
  });

  const header = "name,profession,specialty,country,cme_completed,cme_required,compliance_status,license_expiry";
  const csv = [header, ...rows].join("\n");

  logAudit({
    actorAuthId: user.id,
    action: "government.registry_exported",
    targetTable: "organization_members",
    targetId: orgId,
    metadata: { rows: rows.length, orgName },
  });

  const date = new Date().toISOString().slice(0, 10);
  const filename = `registry-${date}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

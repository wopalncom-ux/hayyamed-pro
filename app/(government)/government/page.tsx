import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import InviteLinkButton from "@/components/employer/InviteLinkButton";
import BulkApproveRequests from "@/components/government/BulkApproveRequests";
import ComplianceTrendChart from "@/components/government/ComplianceTrendChart";
import RenewalCycleCountdown from "@/components/government/RenewalCycleCountdown";
import GovernmentForecastPanel from "@/components/government/GovernmentForecastPanel";

export const metadata = { title: "Authority Dashboard — Hayya Med Pro" };

type ComplianceStatus = "compliant" | "at_risk" | "non_compliant" | "unknown";

const STATUS_CONFIG: Record<ComplianceStatus, { label: string; classes: string }> = {
  compliant:     { label: "Compliant",     classes: "bg-[#dcfce7] text-[#16a34a]" },
  at_risk:       { label: "At Risk",       classes: "bg-[#fff7ed] text-[#d97706]" },
  non_compliant: { label: "Non-Compliant", classes: "bg-[#fef2f2] text-[#dc2626]" },
  unknown:       { label: "No Data",       classes: "bg-[#f1f5f9] text-[#64748b]" },
};

export default async function GovernmentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name, verified)")
    .eq("auth_id", user.id)
    .in("role", ["government_admin", "government_staff"])
    .maybeSingle();

  if (!member) redirect("/dashboard");

  const orgId = member.organization_id;
  const _orgs = member.organizations as { name: string; verified: boolean }[] | { name: string; verified: boolean } | null;
  const org = Array.isArray(_orgs) ? _orgs[0] : (_orgs as { name: string; verified: boolean } | null);
  const orgName = org?.name ?? "Your Authority";
  const isVerified = org?.verified ?? false;

  const { data: govSettings } = await admin
    .from("government_settings")
    .select("authority_code, authority_subtype, jurisdiction_country")
    .eq("organization_id", orgId)
    .maybeSingle();

  const [pendingRes, approvedRes] = await Promise.all([
    admin.from("employer_link_requests")
      .select("id, professional_id, requested_at")
      .eq("organization_id", orgId).eq("status", "pending")
      .order("requested_at", { ascending: false }),
    admin.from("employer_link_requests")
      .select("id, professional_id")
      .eq("organization_id", orgId).eq("status", "approved"),
  ]);

  const pending = pendingRes.data ?? [];
  const approved = approvedRes.data ?? [];
  const approvedIds = approved.map((r) => r.professional_id);
  const pendingIds = pending.map((r) => r.professional_id);

  const [profilesRes, pendingProfilesRes, privacyRes, walletsRes, snapshotsRes, countryRulesRes] = await Promise.all([
    approvedIds.length
      ? admin.from("professional_profiles")
          .select("auth_id, full_name, profession, specialty, license_expiry")
          .in("auth_id", approvedIds)
      : Promise.resolve({ data: [] }),
    pendingIds.length
      ? admin.from("professional_profiles")
          .select("auth_id, full_name, profession")
          .in("auth_id", pendingIds)
      : Promise.resolve({ data: [] }),
    approvedIds.length
      ? admin.from("profile_privacy_settings")
          .select("professional_id, employer_can_view_cme_summary, employer_can_view_license_expiry")
          .in("professional_id", approvedIds)
      : Promise.resolve({ data: [] }),
    approvedIds.length
      ? admin.from("cme_wallets")
          .select("professional_id, completed_credits, required_credits, compliance_status")
          .in("professional_id", approvedIds)
      : Promise.resolve({ data: [] }),
    // Compliance trend: last 90 days of snapshots
    admin.from("organization_compliance_snapshots")
      .select("snapshot_date, total_staff, compliant, at_risk, non_compliant")
      .eq("organization_id", orgId)
      .order("snapshot_date", { ascending: true })
      .limit(90),
    // Country rules for renewal cycle countdown
    govSettings?.jurisdiction_country
      ? admin.from("country_compliance_rules")
          .select("cycle_months, cycle_start_month, credits_required")
          .eq("country_code", govSettings.jurisdiction_country)
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const profileMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.auth_id, p]));
  const pendingProfileMap = Object.fromEntries((pendingProfilesRes.data ?? []).map((p) => [p.auth_id, p]));
  const privacyMap = Object.fromEntries((privacyRes.data ?? []).map((p) => [p.professional_id, p]));
  const walletMap = Object.fromEntries((walletsRes.data ?? []).map((w) => [w.professional_id, w]));

  const professionals = approved.map((link) => {
    const profile = profileMap[link.professional_id];
    const privacy = privacyMap[link.professional_id];
    const wallet = walletMap[link.professional_id];
    const cmeVisible = privacy?.employer_can_view_cme_summary !== false;
    const licenseVisible = privacy?.employer_can_view_license_expiry !== false;
    const licenseExpiry = licenseVisible ? (profile?.license_expiry ?? null) : null;
    const daysToExpiry = licenseExpiry
      ? Math.ceil((new Date(licenseExpiry).getTime() - Date.now()) / 86400000)
      : null;
    return {
      linkId: link.id,
      professionalId: link.professional_id,
      name: profile?.full_name ?? "Unknown",
      profession: profile?.profession ?? "—",
      specialty: profile?.specialty ?? "—",
      cmeVisible,
      completedCredits: cmeVisible ? (wallet?.completed_credits ?? null) : null,
      requiredCredits: cmeVisible ? (wallet?.required_credits ?? null) : null,
      complianceStatus: (cmeVisible && wallet ? (wallet.compliance_status as ComplianceStatus) : "unknown") ?? "unknown",
      licenseExpiry,
      daysToExpiry,
    };
  });

  const total = professionals.length;
  const compliant = professionals.filter((p) => p.complianceStatus === "compliant").length;
  const atRisk = professionals.filter((p) => p.complianceStatus === "at_risk").length;
  const nonCompliant = professionals.filter((p) => p.complianceStatus === "non_compliant").length;
  const expiringSoon = professionals.filter((p) => p.daysToExpiry !== null && p.daysToExpiry <= 30 && p.daysToExpiry >= 0).length;
  const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 0;

  const professionMap = new Map<string, typeof professionals>();
  for (const p of professionals) {
    const key = p.profession || "Other";
    if (!professionMap.has(key)) professionMap.set(key, []);
    professionMap.get(key)!.push(p);
  }
  const professionGroups = [...professionMap.entries()]
    .map(([name, members]) => ({ name, members }))
    .sort((a, b) => b.members.length - a.members.length);

  const needsAttention = professionals.filter(
    (p) => p.complianceStatus === "non_compliant" || p.complianceStatus === "at_risk" ||
            (p.daysToExpiry !== null && p.daysToExpiry <= 30)
  );

  // Prepare trend chart data
  const snapshots = (snapshotsRes.data ?? []).map((s) => ({
    date: s.snapshot_date as string,
    total: s.total_staff as number,
    compliant: s.compliant as number,
    atRisk: s.at_risk as number,
    nonCompliant: s.non_compliant as number,
  }));

  // Renewal cycle data
  const countryRule = countryRulesRes?.data as { cycle_months: number; cycle_start_month: number; credits_required: number } | null;

  // Pending requests for bulk approve
  const pendingRequests = pending.map((req) => ({
    id: req.id,
    name: pendingProfileMap[req.professional_id]?.full_name ?? "Unknown",
    profession: pendingProfileMap[req.professional_id]?.profession ?? "—",
    requestedAt: req.requested_at as string,
  }));

  return (
    <div>
      {sp.setup === "complete" && (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#15803d]">Authority registered — government dashboard is active</p>
            <p className="text-xs text-[#64748b] mt-0.5">Share your invite link with healthcare professionals to start tracking compliance.</p>
          </div>
        </div>
      )}

      {!isVerified && sp.setup !== "complete" && (
        <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
          <span className="text-lg flex-shrink-0">⏳</span>
          <div>
            <p className="text-sm font-semibold text-[#92400e]">Authority verification pending</p>
            <p className="text-xs text-[#374151] mt-0.5">Your authority is being verified. You can configure settings and share the invite link in the meantime.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">
            {govSettings?.authority_code ? `${govSettings.authority_code} — ` : ""}Compliance Overview
          </h1>
          <p className="text-sm text-[#64748b] mt-1">{orgName}</p>
        </div>
        <div className="flex items-center gap-3">
          <InviteLinkButton organizationId={orgId} orgName={orgName} />
          {total > 0 && (
            <Link
              href="/government/reports"
              className="text-sm bg-white border border-[#e2e8f0] text-[#374151] px-4 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors font-medium"
            >
              Reports
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-6">
        <StatCard label="Registered" value={total.toString()} color="blue" />
        <StatCard label="Compliant" value={compliant.toString()} color="green" />
        <StatCard label="At Risk" value={atRisk.toString()} color="orange" />
        <StatCard label="Non-Compliant" value={nonCompliant.toString()} color="red" />
        <StatCard label="License ≤30d" value={expiringSoon.toString()} color={expiringSoon > 0 ? "red" : "green"} />
        <StatCard
          label="Compliance Rate"
          value={total > 0 ? `${complianceRate}%` : "—"}
          color={complianceRate >= 80 ? "green" : complianceRate >= 60 ? "orange" : "red"}
        />
      </div>

      {/* Renewal Cycle Countdown */}
      {countryRule && total > 0 && (
        <RenewalCycleCountdown
          cycleMonths={countryRule.cycle_months}
          cycleStartMonth={countryRule.cycle_start_month}
          nonCompliantCount={nonCompliant + atRisk}
          totalCount={total}
          countryCode={govSettings?.jurisdiction_country ?? "QA"}
        />
      )}

      {/* Compliance Trend Chart */}
      {snapshots.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#111]">Compliance Trend</h2>
              <p className="text-xs text-[#64748b] mt-0.5">Daily compliance rate over the last {snapshots.length} days</p>
            </div>
          </div>
          <ComplianceTrendChart snapshots={snapshots} />
        </div>
      )}

      {/* AI Forecast */}
      {total >= 5 && (
        <GovernmentForecastPanel organizationId={orgId} />
      )}

      {/* Attention alerts */}
      {needsAttention.length > 0 && (
        <div className="bg-[#fef9c3] border border-[#fde68a] rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-[#92400e] mb-2">
            ⚠ {needsAttention.length} professional{needsAttention.length > 1 ? "s" : ""} need attention
          </p>
          <div className="space-y-1">
            {needsAttention.slice(0, 5).map((p) => (
              <p key={p.professionalId} className="text-xs text-[#92400e]">
                &bull; {p.name} —{" "}
                {p.complianceStatus !== "compliant" && p.complianceStatus !== "unknown"
                  ? STATUS_CONFIG[p.complianceStatus].label
                  : ""}
                {p.daysToExpiry !== null && p.daysToExpiry <= 30
                  ? ` License expires in ${p.daysToExpiry}d`
                  : ""}
              </p>
            ))}
            {needsAttention.length > 5 && (
              <p className="text-xs text-[#92400e]">+ {needsAttention.length - 5} more</p>
            )}
          </div>
        </div>
      )}

      {/* Bulk Approve Pending Requests */}
      {pendingRequests.length > 0 && (
        <BulkApproveRequests requests={pendingRequests} organizationId={orgId} />
      )}

      {/* Professional Registry */}
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#111]">Professional Registry</h2>
            <p className="text-xs text-[#64748b] mt-0.5">CME and license data visible only where professionals have given consent.</p>
          </div>
          {total > 0 && (
            <div className="flex items-center gap-3">
              <a
                href="/api/government/export-registry"
                className="text-xs px-3 py-1.5 border border-[#e2e8f0] text-[#374151] rounded-lg hover:bg-[#f8fafc] transition-colors font-medium flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                CSV
              </a>
              <Link
                href="/government/registry"
                className="text-xs text-[#1a56a0] hover:underline font-medium"
              >
                View full registry →
              </Link>
            </div>
          )}
        </div>

        {professionals.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#e8f0fe] flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏛</span>
            </div>
            <h3 className="text-base font-bold text-[#111] mb-1">No professionals registered yet</h3>
            <p className="text-sm text-[#64748b] max-w-sm mx-auto mb-6">
              Share your invite link with healthcare professionals so they can link their accounts with your authority.
            </p>
            <InviteLinkButton organizationId={orgId} orgName={orgName} />
          </div>
        ) : (
          professionGroups.map((group) => {
            const gCompliant = group.members.filter((p) => p.complianceStatus === "compliant").length;
            const gAtRisk = group.members.filter((p) => p.complianceStatus === "at_risk").length;
            const gNonCompliant = group.members.filter((p) => p.complianceStatus === "non_compliant").length;
            return (
              <div key={group.name}>
                <div className="px-6 py-2.5 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#374151] uppercase tracking-wide">{group.name}</span>
                  <span className="text-xs text-[#64748b]">{group.members.length}</span>
                  <div className="flex items-center gap-1.5 ml-auto text-xs">
                    <span className="bg-[#dcfce7] text-[#16a34a] px-1.5 py-0.5 rounded font-medium">{gCompliant}</span>
                    {gAtRisk > 0 && <span className="bg-[#fff7ed] text-[#d97706] px-1.5 py-0.5 rounded font-medium">{gAtRisk}</span>}
                    {gNonCompliant > 0 && <span className="bg-[#fef2f2] text-[#dc2626] px-1.5 py-0.5 rounded font-medium">{gNonCompliant}</span>}
                  </div>
                </div>
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#f1f5f9]">
                        {["Name", "Specialty", "CME Credits", "Status", "License Expiry"].map((h) => (
                          <th key={h} className="text-left px-6 py-2 text-xs font-medium text-[#64748b] uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      {group.members.map((p) => (
                        <tr key={p.professionalId} className="hover:bg-[#f8fafc] transition-colors">
                          <td className="px-6 py-4 font-medium text-[#111]">{p.name}</td>
                          <td className="px-6 py-4 text-[#374151]">{p.specialty}</td>
                          <td className="px-6 py-4">
                            {p.cmeVisible && p.completedCredits !== null ? (
                              <div>
                                <span className="font-medium text-[#1a56a0]">{p.completedCredits}</span>
                                <span className="text-[#64748b]"> / {p.requiredCredits}</span>
                                <div className="w-24 bg-[#e2e8f0] rounded-full h-1.5 mt-1">
                                  <div
                                    className="bg-[#1a56a0] h-1.5 rounded-full"
                                    style={{ width: `${Math.min(((p.completedCredits ?? 0) / (p.requiredCredits ?? 50)) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-[#64748b]">Private</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_CONFIG[p.complianceStatus].classes}`}>
                              {STATUS_CONFIG[p.complianceStatus].label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {p.daysToExpiry !== null ? (
                              <span className={`text-sm font-medium ${
                                p.daysToExpiry < 0 ? "text-[#dc2626]" :
                                p.daysToExpiry <= 30 ? "text-[#dc2626]" :
                                p.daysToExpiry <= 90 ? "text-[#d97706]" : "text-[#16a34a]"
                              }`}>
                                {p.daysToExpiry < 0 ? "EXPIRED" : `${p.daysToExpiry}d`}
                              </span>
                            ) : (
                              <span className="text-xs text-[#64748b]">Private</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="sm:hidden divide-y divide-[#e2e8f0]">
                  {group.members.map((p) => (
                    <div key={p.professionalId} className="px-4 py-4">
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          <p className="text-sm font-medium text-[#111]">{p.name}</p>
                          <p className="text-xs text-[#64748b]">{p.specialty}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_CONFIG[p.complianceStatus].classes}`}>
                          {STATUS_CONFIG[p.complianceStatus].label}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs text-[#64748b]">
                        <span>CME: {p.cmeVisible && p.completedCredits !== null ? `${p.completedCredits}/${p.requiredCredits}` : "Private"}</span>
                        <span>Expiry: {p.daysToExpiry !== null ? (p.daysToExpiry < 0 ? "EXPIRED" : `${p.daysToExpiry}d`) : "Private"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="text-xs text-[#64748b] mt-6 text-center">
        Hayya Med Pro displays only data that professionals have explicitly consented to share with your authority.
      </p>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: "blue" | "green" | "orange" | "red" }) {
  const colors = { blue: "text-[#1a56a0]", green: "text-[#16a34a]", orange: "text-[#d97706]", red: "text-[#dc2626]" };
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center">
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
      <p className="text-xs text-[#64748b] mt-1 leading-tight">{label}</p>
    </div>
  );
}

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Compliance Reports — Hayya Med Pro" };

type ComplianceStatus = "compliant" | "at_risk" | "non_compliant" | "unknown";

export default async function GovernmentReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .maybeSingle();

  if (!member) redirect("/government");

  const orgId = member.organization_id;
  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const org = Array.isArray(_orgs) ? _orgs[0] : (_orgs as { name: string } | null);
  const orgName = org?.name ?? "Your Authority";

  const { data: approved } = await admin
    .from("employer_link_requests")
    .select("professional_id")
    .eq("organization_id", orgId)
    .eq("status", "approved");

  const approvedIds = (approved ?? []).map((r) => r.professional_id);

  const [profilesRes, privacyRes, walletsRes] = await Promise.all([
    approvedIds.length
      ? admin.from("professional_profiles")
          .select("auth_id, profession, specialty, license_expiry, country")
          .in("auth_id", approvedIds)
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
  ]);

  const privacyMap = Object.fromEntries((privacyRes.data ?? []).map((p) => [p.professional_id, p]));
  const walletMap = Object.fromEntries((walletsRes.data ?? []).map((w) => [w.professional_id, w]));

  const professionals = (profilesRes.data ?? []).map((profile) => {
    const privacy = privacyMap[profile.auth_id];
    const wallet = walletMap[profile.auth_id];
    const cmeVisible = privacy?.employer_can_view_cme_summary !== false;
    const licenseVisible = privacy?.employer_can_view_license_expiry !== false;
    const licenseExpiry = licenseVisible ? (profile.license_expiry ?? null) : null;
    const daysToExpiry = licenseExpiry
      ? Math.ceil((new Date(licenseExpiry).getTime() - Date.now()) / 86400000)
      : null;
    const complianceStatus: ComplianceStatus =
      cmeVisible && wallet ? (wallet.compliance_status as ComplianceStatus) : "unknown";

    return {
      profession: profile.profession ?? "Unknown",
      specialty: profile.specialty ?? "Unknown",
      country: profile.country ?? "Unknown",
      cmeVisible,
      completedCredits: cmeVisible ? (wallet?.completed_credits ?? null) : null,
      requiredCredits: cmeVisible ? (wallet?.required_credits ?? null) : null,
      complianceStatus,
      daysToExpiry,
      licenseExpiry,
    };
  });

  // Aggregate by profession
  const byProfession = new Map<string, { total: number; compliant: number; atRisk: number; nonCompliant: number; unknown: number }>();
  for (const p of professionals) {
    const key = p.profession;
    if (!byProfession.has(key)) byProfession.set(key, { total: 0, compliant: 0, atRisk: 0, nonCompliant: 0, unknown: 0 });
    const entry = byProfession.get(key)!;
    entry.total++;
    if (p.complianceStatus === "compliant") entry.compliant++;
    else if (p.complianceStatus === "at_risk") entry.atRisk++;
    else if (p.complianceStatus === "non_compliant") entry.nonCompliant++;
    else entry.unknown++;
  }

  const total = professionals.length;
  const compliant = professionals.filter((p) => p.complianceStatus === "compliant").length;
  const atRisk = professionals.filter((p) => p.complianceStatus === "at_risk").length;
  const nonCompliant = professionals.filter((p) => p.complianceStatus === "non_compliant").length;
  const expired = professionals.filter((p) => p.daysToExpiry !== null && p.daysToExpiry < 0).length;
  const expiringIn30 = professionals.filter((p) => p.daysToExpiry !== null && p.daysToExpiry >= 0 && p.daysToExpiry <= 30).length;
  const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 0;

  const professionRows = [...byProfession.entries()]
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.total - a.total);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Compliance Reports</h1>
        <p className="text-sm text-[#64748b] mt-1">{orgName} &mdash; aggregate analytics</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total Registered", value: total.toString(), color: "text-[#1a56a0]" },
          { label: "Compliance Rate", value: `${complianceRate}%`, color: complianceRate >= 80 ? "text-[#16a34a]" : complianceRate >= 60 ? "text-[#d97706]" : "text-[#dc2626]" },
          { label: "Expired Licenses", value: expired.toString(), color: expired > 0 ? "text-[#dc2626]" : "text-[#16a34a]" },
          { label: "Expiring ≤30d", value: expiringIn30.toString(), color: expiringIn30 > 0 ? "text-[#d97706]" : "text-[#16a34a]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-[#64748b] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Compliance breakdown */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Compliant", count: compliant, color: "bg-[#dcfce7] text-[#16a34a]" },
          { label: "At Risk", count: atRisk, color: "bg-[#fff7ed] text-[#d97706]" },
          { label: "Non-Compliant", count: nonCompliant, color: "bg-[#fef2f2] text-[#dc2626]" },
        ].map(({ label, count, color }) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${color.replace("text-", "border-").replace("[#16a34a]", "[#bbf7d0]").replace("[#d97706]", "[#fed7aa]").replace("[#dc2626]", "[#fecaca]")} ${color.replace("bg-", "bg-").split(" ")[0]}`}>
            <p className={`text-3xl font-bold ${color.split(" ")[1]}`}>{count}</p>
            <p className={`text-xs mt-1 font-medium ${color.split(" ")[1]}`}>{label}</p>
            {total > 0 && <p className={`text-xs mt-0.5 opacity-75 ${color.split(" ")[1]}`}>{Math.round((count / total) * 100)}%</p>}
          </div>
        ))}
      </div>

      {/* By profession */}
      {professionRows.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
          <div className="px-6 py-4 border-b border-[#e2e8f0]">
            <h2 className="text-base font-semibold text-[#111]">Compliance by Profession</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  {["Profession", "Total", "Compliant", "At Risk", "Non-Compliant", "Rate"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {professionRows.map((row) => {
                  const rate = Math.round((row.compliant / row.total) * 100);
                  return (
                    <tr key={row.name} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-6 py-4 font-medium text-[#111]">{row.name}</td>
                      <td className="px-6 py-4 text-[#374151]">{row.total}</td>
                      <td className="px-6 py-4 text-[#16a34a] font-medium">{row.compliant}</td>
                      <td className="px-6 py-4 text-[#d97706] font-medium">{row.atRisk}</td>
                      <td className="px-6 py-4 text-[#dc2626] font-medium">{row.nonCompliant}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-[#e2e8f0] rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${rate >= 80 ? "bg-[#16a34a]" : rate >= 60 ? "bg-[#d97706]" : "bg-[#dc2626]"}`}
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-[#374151]">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSV export */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <h2 className="text-base font-semibold text-[#111] mb-1">Download Reports</h2>
        <p className="text-sm text-[#64748b] mb-5">
          Export compliance data for your records, audit submissions, or regulatory reporting.
          Only data that professionals have consented to share is included.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="/api/government/export-registry"
            className="flex items-center gap-3 border border-[#e2e8f0] rounded-xl p-4 hover:bg-[#f8fafc] transition-colors group"
          >
            <div className="w-10 h-10 bg-[#e8f0fe] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a56a0] transition-colors">
              <svg className="w-5 h-5 text-[#1a56a0] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#111]">Full Registry CSV</p>
              <p className="text-xs text-[#64748b] mt-0.5">All registered professionals with compliance status</p>
            </div>
          </a>

          <a
            href={`/api/pdf/government-report?orgId=${orgId}`}
            className="flex items-center gap-3 border border-[#e2e8f0] rounded-xl p-4 hover:bg-[#f8fafc] transition-colors group"
          >
            <div className="w-10 h-10 bg-[#fef3c7] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#d97706] transition-colors">
              <svg className="w-5 h-5 text-[#d97706] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#111]">Authority PDF Report</p>
              <p className="text-xs text-[#64748b] mt-0.5">Branded PDF with full compliance breakdown by profession</p>
            </div>
          </a>
        </div>

        {total === 0 && (
          <p className="text-xs text-[#64748b] mt-4">
            No professionals are registered yet. Share your invite link from the dashboard to get started.
          </p>
        )}
      </div>
    </div>
  );
}

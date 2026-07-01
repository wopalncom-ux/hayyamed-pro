import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ComplianceTrendChart from "@/components/government/ComplianceTrendChart";
import RenewalCycleCountdown from "@/components/government/RenewalCycleCountdown";
import GovernmentForecastPanel from "@/components/government/GovernmentForecastPanel";
import ComplianceDonut from "@/components/government/ComplianceDonut";
import ProfessionBars from "@/components/government/ProfessionBars";
import {
  getAuthorityForUser,
  getJurisdictionProfessionals,
  computeStats,
  redZone,
  computeLicenseZone,
  ZONE_CONFIG,
  authorityDisplayName,
} from "@/lib/government/jurisdiction";

export const metadata = { title: "Authority Dashboard — Hayya Med Pro" };


export default async function GovernmentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const authority = await getAuthorityForUser(user.id);
  if (!authority) redirect("/government/register");

  const professionals = await getJurisdictionProfessionals(authority, user.id);
  const stats = computeStats(professionals);
  const attention = redZone(professionals);

  // Compliance breakdown by profession (for the bar chart)
  const profMap = new Map<string, { name: string; total: number; compliant: number; atRisk: number; nonCompliant: number }>();
  for (const p of professionals) {
    const key = p.profession || "Other";
    if (!profMap.has(key)) profMap.set(key, { name: key, total: 0, compliant: 0, atRisk: 0, nonCompliant: 0 });
    const e = profMap.get(key)!;
    e.total++;
    if (p.complianceStatus === "compliant") e.compliant++;
    else if (p.complianceStatus === "at_risk") e.atRisk++;
    else if (p.complianceStatus === "non_compliant") e.nonCompliant++;
  }
  const professionRows = [...profMap.values()].sort((a, b) => b.total - a.total);

  // Trend snapshots + renewal cycle rule
  const admin = createAdminClient();
  const [snapshotsRes, countryRuleRes] = await Promise.all([
    admin.from("organization_compliance_snapshots")
      .select("snapshot_date, total_staff, compliant, at_risk, non_compliant")
      .eq("organization_id", authority.organizationId)
      .order("snapshot_date", { ascending: true })
      .limit(90),
    admin.from("country_compliance_rules")
      .select("cycle_months, cycle_start_month, credits_required")
      .eq("country_code", authority.jurisdictionCountry)
      .limit(1)
      .maybeSingle(),
  ]);

  const snapshots = (snapshotsRes.data ?? []).map((s) => ({
    date: s.snapshot_date as string,
    total: s.total_staff as number,
    compliant: s.compliant as number,
    atRisk: s.at_risk as number,
    nonCompliant: s.non_compliant as number,
  }));
  const countryRule = countryRuleRes?.data as { cycle_months: number; cycle_start_month: number; credits_required: number } | null;

  const titlePrefix = authority.authorityCode ? `${authority.authorityCode} — ` : "";

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
            <p className="text-sm font-semibold text-[#15803d]">Authority registered — oversight dashboard is active</p>
            <p className="text-xs text-[#64748b] mt-0.5">All professionals registered in your jurisdiction appear automatically below.</p>
          </div>
        </div>
      )}

      {!authority.verified && sp.setup !== "complete" && (
        <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
          <span className="text-lg flex-shrink-0">⏳</span>
          <div>
            <p className="text-sm font-semibold text-[#92400e]">Authority verification pending</p>
            <p className="text-xs text-[#374151] mt-0.5">Your authority is being verified. Jurisdiction data is shown below in the meantime.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">{titlePrefix}Compliance Overview</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {authority.orgName} · {authorityDisplayName(authority)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/government/reminders" className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors font-medium">
            Send reminder
          </Link>
          <Link href="/government/reports" className="text-sm bg-white border border-[#e2e8f0] text-[#374151] px-4 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors font-medium">
            Reports
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <StatCard label="Registered"       value={stats.total.toString()}       color="blue" />
        <StatCard label="Compliant ✓"      value={stats.compliant.toString()}    color="green" />
        <StatCard label="At Risk"          value={stats.atRisk.toString()}       color="orange" />
        <StatCard label="Non-Compliant"    value={stats.nonCompliant.toString()} color="red" />
        <StatCard label="License Expired"  value={stats.expired.toString()}      color={stats.expired > 0 ? "red" : "green"} />
        <StatCard label="Expiring ≤30d"    value={stats.expiringSoon.toString()} color={stats.expiringSoon > 0 ? "orange" : "green"} />
        <StatCard
          label="Compliance Rate"
          value={stats.total > 0 ? `${stats.complianceRate}%` : "—"}
          color={stats.complianceRate >= 80 ? "green" : stats.complianceRate >= 60 ? "orange" : "red"}
        />
      </div>

      {/* Modern charts: compliance split + by-profession */}
      {stats.total > 0 && (
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <h2 className="text-base font-semibold text-[#111] mb-4">Compliance Breakdown</h2>
            <ComplianceDonut
              compliant={stats.compliant}
              atRisk={stats.atRisk}
              nonCompliant={stats.nonCompliant}
              unknown={stats.unknown}
            />
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <h2 className="text-base font-semibold text-[#111] mb-4">Compliance by Profession</h2>
            <ProfessionBars rows={professionRows} />
          </div>
        </div>
      )}

      {countryRule && stats.total > 0 && (
        <RenewalCycleCountdown
          cycleMonths={countryRule.cycle_months}
          cycleStartMonth={countryRule.cycle_start_month}
          nonCompliantCount={stats.nonCompliant + stats.atRisk}
          totalCount={stats.total}
          countryCode={authority.jurisdictionCountry}
        />
      )}

      {snapshots.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#111]">Compliance Trend</h2>
            <p className="text-xs text-[#64748b] mt-0.5">Daily compliance rate over the last {snapshots.length} days</p>
          </div>
          <ComplianceTrendChart snapshots={snapshots} />
        </div>
      )}

      {stats.total >= 5 && <GovernmentForecastPanel organizationId={authority.organizationId} />}

      {/* Red zone priority list */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#111]">Red Zone — needs attention</h2>
            <p className="text-xs text-[#64748b] mt-0.5">Non-compliant, at-risk, or license expiring within 30 days</p>
          </div>
          <Link href="/government/registry" className="text-xs text-[#1a56a0] hover:underline font-medium">View full registry →</Link>
        </div>

        {stats.total === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#e8f0fe] flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏛</span>
            </div>
            <h3 className="text-base font-bold text-[#111] mb-1">No professionals in this jurisdiction yet</h3>
            <p className="text-sm text-[#64748b] max-w-sm mx-auto">
              As healthcare professionals in {authority.jurisdictionCountry} complete onboarding, they appear here automatically.
            </p>
          </div>
        ) : attention.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-semibold text-[#16a34a]">✓ All clear</p>
            <p className="text-xs text-[#64748b] mt-1">No professionals are currently in the red zone.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  {["Name", "Profession", "Employer", "CME", "Status", "License"].map((h) => (
                    <th key={h} className="text-left px-6 py-2 text-xs font-medium text-[#64748b] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {attention.slice(0, 15).map((p) => (
                  <tr key={p.professionalId} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-3 font-medium text-[#111]">{p.name}</td>
                    <td className="px-6 py-3 text-[#374151]">{p.profession}</td>
                    <td className="px-6 py-3 text-[#374151]">{p.employer ?? <span className="text-[#94a3b8]">Unaffiliated</span>}</td>
                    <td className="px-6 py-3">
                      {p.completedCredits !== null
                        ? <span><span className="font-medium text-[#1a56a0]">{p.completedCredits}</span><span className="text-[#64748b]">/{p.requiredCredits}</span></span>
                        : <span className="text-xs text-[#94a3b8]">—</span>}
                    </td>
                    <td className="px-6 py-3">
                      {(() => { const z = computeLicenseZone(p); const cfg = ZONE_CONFIG[z]; return (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
                          {cfg.label}
                        </span>
                      ); })()}
                    </td>
                    <td className="px-6 py-3">
                      {p.daysToExpiry !== null
                        ? <span className={`text-sm font-medium ${p.daysToExpiry < 0 ? "text-[#dc2626]" : p.daysToExpiry <= 30 ? "text-[#dc2626]" : p.daysToExpiry <= 90 ? "text-[#d97706]" : "text-[#16a34a]"}`}>{p.daysToExpiry < 0 ? "EXPIRED" : `${p.daysToExpiry}d`}</span>
                        : <span className="text-xs text-[#94a3b8]">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {attention.length > 15 && (
              <div className="px-6 py-3 border-t border-[#f1f5f9] text-center">
                <Link href="/government/registry?zone=red" className="text-xs text-[#1a56a0] hover:underline font-medium">
                  + {attention.length - 15} more in the red zone →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-[#64748b] mt-6 text-center max-w-2xl mx-auto">
        As a licensing authority, you have oversight access to compliance data for professionals registered in your
        jurisdiction. All access is audit-logged. Certificate documents remain private to each professional.
      </p>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: "blue" | "green" | "orange" | "red" }) {
  const colors = { blue: "text-[#1a56a0]", green: "text-[#16a34a]", orange: "text-[#d97706]", red: "text-[#dc2626]" };
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 text-center">
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
      <p className="text-sm text-[#64748b] mt-1.5 leading-tight font-medium">{label}</p>
    </div>
  );
}

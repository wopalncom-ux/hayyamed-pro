import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getAuthorityForUser, getJurisdictionProfessionals, computeStats,
  parseProfessionalFilters, filterProfessionals, filterOptions, hasActiveFilters, filtersToQuery,
  authorityDisplayName,
} from "@/lib/government/jurisdiction";
import ComplianceDonut from "@/components/government/ComplianceDonut";
import ProfessionBars from "@/components/government/ProfessionBars";

export const metadata = { title: "Compliance Reports — Hayya Med Pro" };

export default async function GovernmentReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ profession?: string; specialty?: string; employer?: string; status?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const authority = await getAuthorityForUser(user.id);
  if (!authority) redirect("/government/register");

  const all = await getJurisdictionProfessionals(authority, user.id);

  // Filters — applied BEFORE stats so every number (cards, donut, bars, table) matches
  const { professions, specialties, employers } = filterOptions(all);
  const filters = parseProfessionalFilters(sp);
  const professionals = filterProfessionals(all, filters);
  const stats = computeStats(professionals);
  const activeFilters = hasActiveFilters(filters);
  const exportQs = filtersToQuery(filters);
  const exportSuffix = exportQs ? `?${exportQs}` : "";

  // Aggregate by profession (over the filtered set)
  const byProfession = new Map<string, { name: string; total: number; compliant: number; atRisk: number; nonCompliant: number }>();
  for (const p of professionals) {
    const key = p.profession || "Other";
    if (!byProfession.has(key)) byProfession.set(key, { name: key, total: 0, compliant: 0, atRisk: 0, nonCompliant: 0 });
    const e = byProfession.get(key)!;
    e.total++;
    if (p.complianceStatus === "compliant") e.compliant++;
    else if (p.complianceStatus === "at_risk") e.atRisk++;
    else if (p.complianceStatus === "non_compliant") e.nonCompliant++;
  }
  const professionRows = [...byProfession.values()].sort((a, b) => b.total - a.total);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Compliance Reports</h1>
        <p className="text-sm text-[#64748b] mt-1">
          {authority.orgName} — {authorityDisplayName(authority)}
          {activeFilters && <span className="text-[#1a56a0] font-medium"> · filtered: {stats.total} of {all.length}</span>}
        </p>
      </div>

      {/* Filters — report by employer / specialty / profession */}
      <form method="GET" className="bg-white rounded-xl border border-[#e2e8f0] p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">Report by</span>
          <select name="employer" defaultValue={sp.employer ?? ""} suppressHydrationWarning className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20">
            <option value="">All employers</option>
            <option value="__none__">Unaffiliated</option>
            {employers.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <select name="profession" defaultValue={sp.profession ?? ""} suppressHydrationWarning className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm min-w-[150px] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20">
            <option value="">All categories</option>
            {professions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select name="specialty" defaultValue={sp.specialty ?? ""} suppressHydrationWarning className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm min-w-[150px] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20">
            <option value="">All specialties</option>
            {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="submit" suppressHydrationWarning className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1547a0] transition-colors">Apply</button>
          {activeFilters && <a href="/government/reports" className="text-sm text-[#64748b] px-3 py-2 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors">Clear</a>}
        </div>
      </form>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Registered",  value: stats.total.toString(),                                          color: "text-[#1a56a0]" },
          { label: "Compliance Rate",   value: stats.total > 0 ? `${stats.complianceRate}%` : "—",             color: stats.complianceRate >= 80 ? "text-[#16a34a]" : stats.complianceRate >= 60 ? "text-[#d97706]" : "text-[#dc2626]" },
          { label: "License Expired",   value: stats.expired.toString(),                                        color: stats.expired > 0 ? "text-[#dc2626]" : "text-[#16a34a]" },
          { label: "Expiring ≤30 days", value: stats.expiringSoon.toString(),                                   color: stats.expiringSoon > 0 ? "text-[#d97706]" : "text-[#16a34a]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e2e8f0] p-5 text-center">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-sm text-[#64748b] mt-1.5 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {stats.total > 0 && (
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <h2 className="text-base font-semibold text-[#111] mb-4">Compliance Breakdown</h2>
            <ComplianceDonut compliant={stats.compliant} atRisk={stats.atRisk} nonCompliant={stats.nonCompliant} unknown={stats.unknown} />
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <h2 className="text-base font-semibold text-[#111] mb-4">Compliance by Profession</h2>
            <ProfessionBars rows={professionRows} />
          </div>
        </div>
      )}

      {/* By profession table */}
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
                  const rate = row.total > 0 ? Math.round((row.compliant / row.total) * 100) : 0;
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
                            <div className={`h-2 rounded-full ${rate >= 80 ? "bg-[#16a34a]" : rate >= 60 ? "bg-[#d97706]" : "bg-[#dc2626]"}`} style={{ width: `${rate}%` }} />
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

      {/* Downloads — Excel + PDF */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <h2 className="text-base font-semibold text-[#111] mb-1">Download Reports</h2>
        <p className="text-sm text-[#64748b] mb-5">
          Export jurisdiction compliance data for your records, audit submissions, or regulatory reporting.
          {activeFilters ? " Exports match the filters applied above." : " All exports are audit-logged."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href={`/api/government/export-registry${exportSuffix}`} className="flex items-center gap-3 border border-[#e2e8f0] rounded-xl p-4 hover:bg-[#f8fafc] transition-colors group">
            <div className="w-10 h-10 bg-[#dcfce7] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#16a34a] transition-colors">
              <svg className="w-5 h-5 text-[#16a34a] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 4.5h16.5m-13.5-9v13.5m4.5-13.5v13.5M4.5 4.5h15a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V6a1.5 1.5 0 0 1 1.5-1.5Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#111]">Full Registry — Excel</p>
              <p className="text-xs text-[#64748b] mt-0.5">All professionals with employer, CME & compliance (.xlsx)</p>
            </div>
          </a>

          <a href={`/api/pdf/government-report${exportSuffix}`} className="flex items-center gap-3 border border-[#e2e8f0] rounded-xl p-4 hover:bg-[#f8fafc] transition-colors group">
            <div className="w-10 h-10 bg-[#fef2f2] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#dc2626] transition-colors">
              <svg className="w-5 h-5 text-[#dc2626] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#111]">Authority Report — PDF</p>
              <p className="text-xs text-[#64748b] mt-0.5">Branded compliance breakdown by profession</p>
            </div>
          </a>
        </div>

        {stats.total === 0 && (
          <p className="text-xs text-[#64748b] mt-4">No professionals are registered in your jurisdiction yet.</p>
        )}
      </div>
    </div>
  );
}

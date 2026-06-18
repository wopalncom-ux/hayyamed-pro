import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Global Compliance — Admin | Hayya Med Pro" };

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  compliant:     { label: "Compliant",     bg: "bg-[#dcfce7]", text: "text-[#15803d]" },
  at_risk:       { label: "At Risk",       bg: "bg-[#fef9c3]", text: "text-[#a16207]" },
  non_compliant: { label: "Non-Compliant", bg: "bg-[#fee2e2]", text: "text-[#dc2626]" },
  unknown:       { label: "Unknown",       bg: "bg-[#f1f5f9]", text: "text-[#64748b]" },
};

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const admin = createAdminClient();
  const { data } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();
  if (!data) redirect("/dashboard");
}

export default async function AdminCompliancePage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; profession?: string; status?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const countryFilter    = params.country    ?? "";
  const professionFilter = params.profession ?? "";
  const statusFilter     = params.status     ?? "";

  const admin = createAdminClient();

  // Aggregate wallets for heatmap
  const { data: wallets } = await admin
    .from("cme_wallets")
    .select("country, profession, compliance_status, professional_id, completed_credits, required_credits");

  // Professional profiles for cross-reference
  const { data: profiles } = await admin
    .from("professional_profiles")
    .select("auth_id, full_name, profession, specialty, email")
    .eq("onboarding_complete", true);

  const profileMap = Object.fromEntries(
    (profiles ?? []).map((p) => [p.auth_id, p])
  );

  const allWallets = wallets ?? [];

  // Country × status heatmap
  const countryStatusMap: Record<string, Record<string, number>> = {};
  const professionStatusMap: Record<string, Record<string, number>> = {};
  const profTotals: Record<string, number> = {};
  let compliantCount = 0, atRiskCount = 0, nonCompliantCount = 0, unknownCount = 0;

  const statuses = ["compliant", "at_risk", "non_compliant", "unknown"];

  // Deduplicate: one status per professional (worst-case from their wallets)
  const professionalStatus: Record<string, string> = {};
  for (const w of allWallets) {
    const existing = professionalStatus[w.professional_id];
    const cur = w.compliance_status ?? "unknown";
    if (!existing) {
      professionalStatus[w.professional_id] = cur;
    } else {
      // worst case: non_compliant > at_risk > unknown > compliant
      const rank = ["compliant", "unknown", "at_risk", "non_compliant"];
      if (rank.indexOf(cur) > rank.indexOf(existing)) {
        professionalStatus[w.professional_id] = cur;
      }
    }
  }

  // Build heatmap from wallets directly (country × status)
  for (const w of allWallets) {
    const country = w.country ?? "Unknown";
    const status  = w.compliance_status ?? "unknown";
    const prof    = w.profession ?? "Unknown";

    if (!countryStatusMap[country]) countryStatusMap[country] = {};
    countryStatusMap[country][status] = (countryStatusMap[country][status] ?? 0) + 1;

    if (!professionStatusMap[prof]) professionStatusMap[prof] = {};
    professionStatusMap[prof][status] = (professionStatusMap[prof][status] ?? 0) + 1;
    profTotals[prof] = (profTotals[prof] ?? 0) + 1;
  }

  for (const s of Object.values(professionalStatus)) {
    if (s === "compliant")     compliantCount++;
    else if (s === "at_risk")  atRiskCount++;
    else if (s === "non_compliant") nonCompliantCount++;
    else unknownCount++;
  }

  const totalProfessionals = (profiles ?? []).length;
  const totalWithWallets   = Object.keys(professionalStatus).length;
  const complianceRate = totalWithWallets > 0
    ? Math.round((compliantCount / totalWithWallets) * 100)
    : 0;

  const countries   = Object.keys(countryStatusMap).sort();
  const professions = Object.keys(professionStatusMap).sort();

  // Filterable professionals table
  const filteredWallets = allWallets.filter((w) => {
    if (countryFilter    && w.country             !== countryFilter)    return false;
    if (professionFilter && w.profession           !== professionFilter) return false;
    if (statusFilter     && w.compliance_status    !== statusFilter)     return false;
    return true;
  });

  // Deduplicate by professional_id for the table view
  const seenProfessionals = new Set<string>();
  const tableRows: typeof filteredWallets = [];
  for (const w of filteredWallets) {
    if (!seenProfessionals.has(w.professional_id)) {
      seenProfessionals.add(w.professional_id);
      tableRows.push(w);
    }
  }
  const displayRows = tableRows.slice(0, 200);

  const exportParams = new URLSearchParams();
  if (countryFilter)    exportParams.set("country", countryFilter);
  if (professionFilter) exportParams.set("profession", professionFilter);
  if (statusFilter)     exportParams.set("status", statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1f3d]">Global Compliance Dashboard</h1>
          <p className="text-sm text-[#64748b] mt-1">Platform-wide CME & CPD compliance status across all countries</p>
        </div>
        <a
          href={`/api/admin/compliance-export?${exportParams.toString()}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a56a0] text-white text-sm font-semibold rounded-xl hover:bg-[#1547a0] transition-colors"
        >
          ⬇ Export CSV (QCHP)
        </a>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Professionals", value: totalProfessionals, color: "text-[#0f1f3d]" },
          { label: "Compliant", value: compliantCount, color: "text-[#16a34a]" },
          { label: "At Risk",   value: atRiskCount,   color: "text-[#d97706]" },
          { label: "Non-Compliant", value: nonCompliantCount, color: "text-[#dc2626]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e2e8f0] p-5 text-center">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-[#64748b] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Compliance rate bar */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-[#374151]">Platform Compliance Rate</p>
          <p className="text-sm font-bold text-[#1a56a0]">{complianceRate}%</p>
        </div>
        <div className="w-full bg-[#f1f5f9] rounded-full h-3">
          <div
            className="h-3 rounded-full bg-[#16a34a] transition-all"
            style={{ width: `${complianceRate}%` }}
          />
        </div>
        <p className="text-xs text-[#64748b] mt-2">
          {compliantCount} of {totalWithWallets} professionals with at least one CME wallet are compliant
        </p>
      </div>

      {/* Country × Status Heatmap */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-base font-semibold text-[#0f1f3d] mb-4">Country × Compliance Status</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f1f5f9]">
                <th className="text-left py-2 pr-4 text-xs font-semibold text-[#64748b]">Country</th>
                {statuses.map((s) => (
                  <th key={s} className="py-2 px-3 text-xs font-semibold text-[#64748b] text-center">
                    {STATUS_LABELS[s].label}
                  </th>
                ))}
                <th className="py-2 px-3 text-xs font-semibold text-[#64748b] text-center">Total</th>
                <th className="py-2 px-3 text-xs font-semibold text-[#64748b] text-center">Rate</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((country) => {
                const row = countryStatusMap[country];
                const total = statuses.reduce((sum, s) => sum + (row[s] ?? 0), 0);
                const rate  = total > 0 ? Math.round(((row["compliant"] ?? 0) / total) * 100) : 0;
                return (
                  <tr key={country} className="border-b border-[#f8fafc] hover:bg-[#f8fafc]">
                    <td className="py-2 pr-4 font-medium text-[#0f1f3d]">
                      <Link href={`/admin/compliance?country=${country}`} className="hover:underline text-[#1a56a0]">
                        {country}
                      </Link>
                    </td>
                    {statuses.map((s) => {
                      const val = row[s] ?? 0;
                      const { bg, text } = STATUS_LABELS[s];
                      return (
                        <td key={s} className="py-2 px-3 text-center">
                          {val > 0 ? (
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${bg} ${text}`}>
                              {val}
                            </span>
                          ) : (
                            <span className="text-[#cbd5e1] text-xs">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-2 px-3 text-center text-xs font-medium text-[#374151]">{total}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-xs font-bold ${rate >= 80 ? "text-[#16a34a]" : rate >= 50 ? "text-[#d97706]" : "text-[#dc2626]"}`}>
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profession Breakdown */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-base font-semibold text-[#0f1f3d] mb-4">Profession Breakdown</h2>
        <div className="space-y-3">
          {professions.slice(0, 20).map((prof) => {
            const row   = professionStatusMap[prof];
            const total = profTotals[prof] ?? 0;
            const compliant = row["compliant"] ?? 0;
            const rate  = total > 0 ? Math.round((compliant / total) * 100) : 0;
            return (
              <div key={prof} className="flex items-center gap-3">
                <Link
                  href={`/admin/compliance?profession=${encodeURIComponent(prof)}`}
                  className="text-xs font-medium text-[#374151] w-36 flex-shrink-0 hover:text-[#1a56a0]"
                >
                  {prof.charAt(0).toUpperCase() + prof.slice(1).replace(/_/g, " ")}
                </Link>
                <div className="flex-1 bg-[#f1f5f9] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${rate >= 80 ? "bg-[#16a34a]" : rate >= 50 ? "bg-[#d97706]" : "bg-[#dc2626]"}`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
                <span className={`text-xs font-bold w-10 text-right ${rate >= 80 ? "text-[#16a34a]" : rate >= 50 ? "text-[#d97706]" : "text-[#dc2626]"}`}>
                  {rate}%
                </span>
                <span className="text-xs text-[#64748b] w-14 text-right">{compliant}/{total}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters + Professional Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-base font-semibold text-[#0f1f3d]">
            Professionals
            {(countryFilter || professionFilter || statusFilter) && (
              <span className="ml-2 text-xs font-normal text-[#64748b]">(filtered)</span>
            )}
          </h2>
          <form method="GET" className="flex items-center gap-2 flex-wrap">
            <select
              name="country"
              defaultValue={countryFilter}
              className="text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-lg bg-white text-[#374151]"
            >
              <option value="">All countries</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              name="profession"
              defaultValue={professionFilter}
              className="text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-lg bg-white text-[#374151]"
            >
              <option value="">All professions</option>
              {professions.map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1).replace(/_/g, " ")}</option>
              ))}
            </select>
            <select
              name="status"
              defaultValue={statusFilter}
              className="text-xs px-2.5 py-1.5 border border-[#e2e8f0] rounded-lg bg-white text-[#374151]"
            >
              <option value="">All statuses</option>
              {statuses.map((s) => <option key={s} value={s}>{STATUS_LABELS[s].label}</option>)}
            </select>
            <button
              type="submit"
              className="text-xs font-semibold px-3 py-1.5 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0]"
            >
              Filter
            </button>
            {(countryFilter || professionFilter || statusFilter) && (
              <Link href="/admin/compliance" className="text-xs text-[#64748b] hover:underline">Clear</Link>
            )}
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f1f5f9]">
                <th className="text-left py-2 pr-3 text-xs font-semibold text-[#64748b]">Professional</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-[#64748b]">Profession</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-[#64748b]">Country</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-[#64748b]">Credits</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-[#64748b]">Status</th>
                <th className="text-right py-2 pl-3 text-xs font-semibold text-[#64748b]">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm text-[#64748b]">
                    No professionals match the selected filters.
                  </td>
                </tr>
              )}
              {displayRows.map((w) => {
                const profile = profileMap[w.professional_id];
                const { bg, text, label } = STATUS_LABELS[w.compliance_status ?? "unknown"] ?? STATUS_LABELS["unknown"];
                const pct = w.required_credits > 0
                  ? Math.round((w.completed_credits / w.required_credits) * 100)
                  : 100;
                return (
                  <tr key={`${w.professional_id}-${w.country}`} className="border-b border-[#f8fafc] hover:bg-[#f8fafc]">
                    <td className="py-2.5 pr-3">
                      <p className="text-xs font-medium text-[#0f1f3d]">{profile?.full_name ?? "—"}</p>
                      <p className="text-[10px] text-[#64748b]">{profile?.email ?? w.professional_id.slice(0, 8)}</p>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-[#374151] capitalize">{(w.profession ?? "—").replace(/_/g, " ")}</td>
                    <td className="py-2.5 px-3 text-xs font-medium text-[#374151]">{w.country ?? "—"}</td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="text-xs font-medium text-[#374151]">{w.completed_credits}/{w.required_credits}</div>
                      <div className="text-[10px] text-[#64748b]">{pct}%</div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${bg} ${text}`}>{label}</span>
                    </td>
                    <td className="py-2.5 pl-3 text-right">
                      <Link
                        href={`/admin/professionals/${w.professional_id}`}
                        className="text-[10px] font-semibold text-[#1a56a0] hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {tableRows.length > 200 && (
          <p className="text-xs text-[#64748b] text-center mt-4">
            Showing first 200 of {tableRows.length} results. Use filters to narrow or export CSV for full data.
          </p>
        )}
      </div>
    </div>
  );
}

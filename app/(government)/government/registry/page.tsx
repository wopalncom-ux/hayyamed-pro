import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  getAuthorityForUser,
  getJurisdictionProfessionals,
  type ComplianceZone,
  type JurisdictionProfessional,
} from "@/lib/government/jurisdiction";

export const metadata = { title: "Professional Registry — Hayya Med Pro" };

const STATUS_CONFIG: Record<ComplianceZone, { label: string; classes: string }> = {
  compliant:     { label: "Compliant",     classes: "bg-[#dcfce7] text-[#16a34a]" },
  at_risk:       { label: "At Risk",       classes: "bg-[#fff7ed] text-[#d97706]" },
  non_compliant: { label: "Non-Compliant", classes: "bg-[#fef2f2] text-[#dc2626]" },
  unknown:       { label: "No Data",       classes: "bg-[#f1f5f9] text-[#64748b]" },
};

export default async function GovernmentRegistryPage({
  searchParams,
}: {
  searchParams: Promise<{ profession?: string; status?: string; employer?: string; zone?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const authority = await getAuthorityForUser(user.id);
  if (!authority) redirect("/government/register");

  const all = await getJurisdictionProfessionals(authority, user.id);

  // Filter options
  const professions = [...new Set(all.map((p) => p.profession).filter((x) => x && x !== "—"))].sort();
  const employers = [...new Set(all.map((p) => p.employer).filter((x): x is string => !!x))].sort();

  // Apply filters
  let filtered = all;
  if (sp.profession) filtered = filtered.filter((p) => p.profession === sp.profession);
  if (sp.status) filtered = filtered.filter((p) => p.complianceStatus === sp.status);
  if (sp.employer) {
    filtered = sp.employer === "__none__"
      ? filtered.filter((p) => !p.employer)
      : filtered.filter((p) => p.employer === sp.employer);
  }
  if (sp.zone === "red") {
    filtered = filtered.filter((p) =>
      p.complianceStatus === "non_compliant" || p.complianceStatus === "at_risk" ||
      (p.daysToExpiry !== null && p.daysToExpiry <= 30)
    );
  }
  if (sp.q) {
    const q = sp.q.toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(q) || p.specialty.toLowerCase().includes(q) ||
      (p.employer ?? "").toLowerCase().includes(q)
    );
  }

  // Employer roll-ups (over the unfiltered jurisdiction)
  const byEmployer = new Map<string, JurisdictionProfessional[]>();
  for (const p of all) {
    const key = p.employer ?? "Unaffiliated";
    if (!byEmployer.has(key)) byEmployer.set(key, []);
    byEmployer.get(key)!.push(p);
  }
  const employerRollups = [...byEmployer.entries()]
    .map(([name, members]) => {
      const compliant = members.filter((m) => m.complianceStatus === "compliant").length;
      const withData = members.filter((m) => m.complianceStatus !== "unknown").length;
      return { name, count: members.length, rate: withData > 0 ? Math.round((compliant / withData) * 100) : 0 };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const hasFilters = !!(sp.profession || sp.status || sp.employer || sp.zone || sp.q);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Professional Registry</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {filtered.length} of {all.length} professionals in {authority.jurisdictionCountry}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <a href="/api/government/export-registry" className="text-sm border border-[#e2e8f0] text-[#374151] px-4 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </a>
          <a href="/government/reminders" className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors font-medium">Send reminder</a>
        </div>
      </div>

      {/* Employer roll-ups */}
      {employerRollups.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 mb-5">
          <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">By employer</p>
          <div className="flex flex-wrap gap-2">
            {employerRollups.map((e) => (
              <a
                key={e.name}
                href={`/government/registry?employer=${encodeURIComponent(e.name === "Unaffiliated" ? "__none__" : e.name)}`}
                className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-xs hover:bg-[#f8fafc] transition-colors"
              >
                <span className="font-medium text-[#111]">{e.name}</span>
                <span className="text-[#64748b]"> · {e.count}</span>
                <span className={`ml-1.5 font-medium ${e.rate >= 80 ? "text-[#16a34a]" : e.rate >= 60 ? "text-[#d97706]" : "text-[#dc2626]"}`}>{e.rate}%</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <form method="GET" className="bg-white rounded-xl border border-[#e2e8f0] p-4 mb-5">
        <div className="flex flex-wrap gap-3">
          <input name="q" defaultValue={sp.q ?? ""} placeholder="Search name, specialty, employer..." className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20" />
          <select name="employer" defaultValue={sp.employer ?? ""} className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20">
            <option value="">All employers</option>
            <option value="__none__">Unaffiliated</option>
            {employers.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <select name="profession" defaultValue={sp.profession ?? ""} className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm min-w-[140px] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20">
            <option value="">All professions</option>
            {professions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select name="status" defaultValue={sp.status ?? ""} className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm min-w-[140px] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20">
            <option value="">All statuses</option>
            <option value="compliant">Compliant</option>
            <option value="at_risk">At Risk</option>
            <option value="non_compliant">Non-Compliant</option>
            <option value="unknown">No Data</option>
          </select>
          <button type="submit" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1547a0] transition-colors">Apply</button>
          {hasFilters && <a href="/government/registry" className="text-sm text-[#64748b] px-3 py-2 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors">Clear</a>}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-10 text-center"><p className="text-sm text-[#64748b]">No professionals match your filters.</p></div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    {["Name", "Profession", "Employer", "CME Credits", "Status", "License Expiry"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filtered.map((p) => (
                    <tr key={p.professionalId} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-6 py-4 font-medium text-[#111]">{p.name}<div className="text-xs text-[#64748b] font-normal">{p.specialty}</div></td>
                      <td className="px-6 py-4 text-[#374151]">{p.profession}</td>
                      <td className="px-6 py-4 text-[#374151]">{p.employer ?? <span className="text-[#94a3b8]">Unaffiliated</span>}</td>
                      <td className="px-6 py-4">
                        {p.completedCredits !== null ? (
                          <div>
                            <span className="font-medium text-[#1a56a0]">{p.completedCredits}</span>
                            <span className="text-[#64748b]"> / {p.requiredCredits}</span>
                            <div className="w-20 bg-[#e2e8f0] rounded-full h-1.5 mt-1">
                              <div className="bg-[#1a56a0] h-1.5 rounded-full" style={{ width: `${p.progressPct ?? 0}%` }} />
                            </div>
                          </div>
                        ) : <span className="text-xs text-[#94a3b8]">—</span>}
                      </td>
                      <td className="px-6 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_CONFIG[p.complianceStatus].classes}`}>{STATUS_CONFIG[p.complianceStatus].label}</span></td>
                      <td className="px-6 py-4">
                        {p.daysToExpiry !== null
                          ? <span className={`text-sm font-medium ${p.daysToExpiry < 0 ? "text-[#dc2626]" : p.daysToExpiry <= 30 ? "text-[#dc2626]" : p.daysToExpiry <= 90 ? "text-[#d97706]" : "text-[#16a34a]"}`}>{p.daysToExpiry < 0 ? "EXPIRED" : `${p.daysToExpiry}d`}</span>
                          : <span className="text-xs text-[#94a3b8]">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden divide-y divide-[#e2e8f0]">
              {filtered.map((p) => (
                <div key={p.professionalId} className="px-4 py-4">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <p className="text-sm font-medium text-[#111]">{p.name}</p>
                      <p className="text-xs text-[#64748b]">{p.profession} &middot; {p.employer ?? "Unaffiliated"}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_CONFIG[p.complianceStatus].classes}`}>{STATUS_CONFIG[p.complianceStatus].label}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-[#64748b]">
                    <span>CME: {p.completedCredits !== null ? `${p.completedCredits}/${p.requiredCredits}` : "—"}</span>
                    <span>Expiry: {p.daysToExpiry !== null ? (p.daysToExpiry < 0 ? "EXPIRED" : `${p.daysToExpiry}d`) : "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-[#64748b] mt-4 text-center">
        Oversight access for professionals registered in your jurisdiction. All access is audit-logged.
      </p>
    </div>
  );
}

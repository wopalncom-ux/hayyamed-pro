import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Professional Registry — Hayya Med Pro" };

type ComplianceStatus = "compliant" | "at_risk" | "non_compliant" | "unknown";

const STATUS_CONFIG: Record<ComplianceStatus, { label: string; classes: string }> = {
  compliant:     { label: "Compliant",     classes: "bg-[#dcfce7] text-[#16a34a]" },
  at_risk:       { label: "At Risk",       classes: "bg-[#fff7ed] text-[#d97706]" },
  non_compliant: { label: "Non-Compliant", classes: "bg-[#fef2f2] text-[#dc2626]" },
  unknown:       { label: "No Data",       classes: "bg-[#f1f5f9] text-[#64748b]" },
};

export default async function GovernmentRegistryPage({
  searchParams,
}: {
  searchParams: Promise<{ profession?: string; status?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .maybeSingle();

  if (!member) redirect("/government");

  const orgId = member.organization_id;

  const { data: approved } = await admin
    .from("employer_link_requests")
    .select("id, professional_id")
    .eq("organization_id", orgId)
    .eq("status", "approved");

  const approvedIds = (approved ?? []).map((r) => r.professional_id);

  const [profilesRes, privacyRes, walletsRes] = await Promise.all([
    approvedIds.length
      ? admin.from("professional_profiles")
          .select("auth_id, full_name, profession, specialty, license_expiry, country")
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

  const allProfessionals = (profilesRes.data ?? []).map((profile) => {
    const privacy = privacyMap[profile.auth_id];
    const wallet = walletMap[profile.auth_id];
    const cmeVisible = privacy?.employer_can_view_cme_summary !== false;
    const licenseVisible = privacy?.employer_can_view_license_expiry !== false;
    const licenseExpiry = licenseVisible ? (profile?.license_expiry ?? null) : null;
    const daysToExpiry = licenseExpiry
      ? Math.ceil((new Date(licenseExpiry).getTime() - Date.now()) / 86400000)
      : null;
    const complianceStatus: ComplianceStatus =
      cmeVisible && wallet ? (wallet.compliance_status as ComplianceStatus) : "unknown";

    return {
      professionalId: profile.auth_id,
      name: profile.full_name ?? "Unknown",
      profession: profile.profession ?? "—",
      specialty: profile.specialty ?? "—",
      country: profile.country ?? "—",
      cmeVisible,
      completedCredits: cmeVisible ? (wallet?.completed_credits ?? null) : null,
      requiredCredits: cmeVisible ? (wallet?.required_credits ?? null) : null,
      complianceStatus,
      licenseExpiry,
      daysToExpiry,
    };
  });

  // Derive filter options
  const professions = [...new Set(allProfessionals.map((p) => p.profession).filter(Boolean))].sort();

  // Apply filters
  let filtered = allProfessionals;
  if (sp.profession) filtered = filtered.filter((p) => p.profession === sp.profession);
  if (sp.status) filtered = filtered.filter((p) => p.complianceStatus === sp.status);
  if (sp.q) {
    const q = sp.q.toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(q) || p.specialty.toLowerCase().includes(q)
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Professional Registry</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {filtered.length} of {allProfessionals.length} registered professionals
          </p>
        </div>
        <a
          href="/government/reports"
          className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors font-medium self-start sm:self-auto"
        >
          Download report
        </a>
      </div>

      {/* Filters */}
      <form method="GET" className="bg-white rounded-xl border border-[#e2e8f0] p-4 mb-5">
        <div className="flex flex-wrap gap-3">
          <input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Search by name or specialty..."
            className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
          />
          <select
            name="profession"
            defaultValue={sp.profession ?? ""}
            className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
          >
            <option value="">All professions</option>
            {professions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={sp.status ?? ""}
            className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
          >
            <option value="">All statuses</option>
            <option value="compliant">Compliant</option>
            <option value="at_risk">At Risk</option>
            <option value="non_compliant">Non-Compliant</option>
            <option value="unknown">No Data</option>
          </select>
          <button
            type="submit"
            className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1547a0] transition-colors"
          >
            Apply
          </button>
          {(sp.profession || sp.status || sp.q) && (
            <a
              href="/government/registry"
              className="text-sm text-[#64748b] px-3 py-2 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors"
            >
              Clear
            </a>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-[#64748b]">No professionals match your filters.</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0]">
                    {["Name", "Profession", "Specialty", "CME Credits", "Status", "License Expiry"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-medium text-[#94a3b8] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filtered.map((p) => (
                    <tr key={p.professionalId} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-6 py-4 font-medium text-[#111]">{p.name}</td>
                      <td className="px-6 py-4 text-[#374151]">{p.profession}</td>
                      <td className="px-6 py-4 text-[#374151]">{p.specialty}</td>
                      <td className="px-6 py-4">
                        {p.cmeVisible && p.completedCredits !== null ? (
                          <div>
                            <span className="font-medium text-[#1a56a0]">{p.completedCredits}</span>
                            <span className="text-[#64748b]"> / {p.requiredCredits}</span>
                            <div className="w-20 bg-[#e2e8f0] rounded-full h-1.5 mt-1">
                              <div
                                className="bg-[#1a56a0] h-1.5 rounded-full"
                                style={{ width: `${Math.min(((p.completedCredits ?? 0) / (p.requiredCredits ?? 50)) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-[#94a3b8]">Private</span>
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
                          <span className="text-xs text-[#94a3b8]">Private</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="sm:hidden divide-y divide-[#e2e8f0]">
              {filtered.map((p) => (
                <div key={p.professionalId} className="px-4 py-4">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <p className="text-sm font-medium text-[#111]">{p.name}</p>
                      <p className="text-xs text-[#64748b]">{p.profession} &middot; {p.specialty}</p>
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
          </>
        )}
      </div>

      <p className="text-xs text-[#94a3b8] mt-4 text-center">
        Only data that professionals have consented to share with your authority is visible here.
      </p>
    </div>
  );
}

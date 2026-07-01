import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getAuthorityForUser, getJurisdictionProfessionals, type ComplianceZone } from "@/lib/government/jurisdiction";
import { logAudit } from "@/lib/audit";

export const metadata = { title: "Professional — Hayya Med Pro" };

const STATUS_CONFIG: Record<ComplianceZone, { label: string; classes: string }> = {
  compliant:     { label: "Compliant",     classes: "bg-[#dcfce7] text-[#16a34a]" },
  at_risk:       { label: "At Risk",       classes: "bg-[#fff7ed] text-[#d97706]" },
  non_compliant: { label: "Non-Compliant", classes: "bg-[#fef2f2] text-[#dc2626]" },
  unknown:       { label: "No Data",       classes: "bg-[#f1f5f9] text-[#64748b]" },
};

function fmtDate(d: string | null): string {
  return d ? d.slice(0, 10) : "—";
}

export default async function GovernmentProfessionalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const authority = await getAuthorityForUser(user.id);
  if (!authority) redirect("/government/register");

  // Authorisation: the professional must be inside this authority's jurisdiction.
  // Reuse the jurisdiction sweep (audit=false here; we log a specific view below).
  const all = await getJurisdictionProfessionals(authority, user.id, false);
  const pro = all.find((p) => p.professionalId === id);
  if (!pro) notFound();

  const admin = createAdminClient();
  const [{ data: profile }, { data: wallets }, { data: activities }] = await Promise.all([
    admin.from("professional_profiles")
      .select("nationality, mobile, licensing_authority, subspecialty, license_number, license_expiry, onboarding_complete, created_at")
      .eq("auth_id", id).maybeSingle(),
    admin.from("cme_wallets")
      .select("country, profession, required_credits, completed_credits, compliance_status, cycle_start_date, cycle_end_date, is_primary")
      .eq("professional_id", id),
    admin.from("cme_activities")
      .select("title, provider, activity_date, credits, verification_status")
      .eq("professional_id", id)
      .order("activity_date", { ascending: false })
      .limit(20),
  ]);

  logAudit({
    actorAuthId: user.id,
    action: "government.professional_view",
    targetTable: "professional_profiles",
    targetId: id,
    metadata: { jurisdiction: authority.jurisdictionCountry, authority: authority.authorityCode },
  });

  const status = STATUS_CONFIG[pro.complianceStatus];
  const walletRows = wallets ?? [];
  const activityRows = activities ?? [];
  const verified = activityRows.filter((a) => a.verification_status === "verified").length;

  return (
    <div className="max-w-4xl">
      <a href="/government/registry" className="text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors">← Back to registry</a>

      {/* Header */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mt-3 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-[#e8f0fe] text-[#1a56a0] flex items-center justify-center text-xl font-bold flex-shrink-0">
              {pro.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111]">{pro.name}</h1>
              <p className="text-sm text-[#64748b] mt-0.5">
                {pro.profession}{pro.specialty && pro.specialty !== "—" ? ` · ${pro.specialty}` : ""}
              </p>
              <p className="text-sm text-[#64748b]">{pro.employer ?? "Unaffiliated"}</p>
            </div>
          </div>
          <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${status.classes} self-start`}>{status.label}</span>
        </div>
      </div>

      {/* Key facts */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Fact label="CME Progress" value={pro.completedCredits !== null ? `${pro.completedCredits} / ${pro.requiredCredits}` : "No wallet"} sub={pro.progressPct !== null ? `${pro.progressPct}%` : undefined} />
        <Fact label="License #" value={pro.licenseNumber ?? "—"} />
        <Fact label="License Expiry" value={fmtDate(pro.licenseExpiry)} sub={pro.daysToExpiry !== null ? (pro.daysToExpiry < 0 ? "EXPIRED" : `${pro.daysToExpiry}d left`) : undefined} subDanger={pro.daysToExpiry !== null && pro.daysToExpiry <= 30} />
        <Fact label="Verified CME" value={`${verified} activit${verified === 1 ? "y" : "ies"}`} />
      </div>

      {/* Profile details */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-5">
        <h2 className="text-base font-semibold text-[#111] mb-4">Profile</h2>
        <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <Row label="Email" value={pro.email} />
          <Row label="Nationality" value={profile?.nationality ?? null} />
          <Row label="Mobile" value={profile?.mobile ?? null} />
          <Row label="Licensing authority" value={profile?.licensing_authority ?? null} />
          <Row label="Subspecialty" value={profile?.subspecialty ?? null} />
          <Row label="Onboarding" value={pro.onboardingComplete ? "Complete" : "Incomplete"} />
          <Row label="Registered" value={fmtDate(profile?.created_at ?? null)} />
        </dl>
      </div>

      {/* CME wallets */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] mb-5">
        <div className="px-6 py-4 border-b border-[#e2e8f0]"><h2 className="text-base font-semibold text-[#111]">CME Wallets</h2></div>
        {walletRows.length === 0 ? (
          <p className="px-6 py-6 text-sm text-[#64748b]">No CME wallet — this professional has not started tracking CME (counts as No Data).</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  {["Country", "Profession", "Completed", "Required", "Status", "Cycle end"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {walletRows.map((w, i) => {
                  const zone = (STATUS_CONFIG[(w.compliance_status as ComplianceZone)] ?? STATUS_CONFIG.unknown);
                  return (
                    <tr key={i}>
                      <td className="px-6 py-3 text-[#374151]">{w.country}{w.is_primary ? " ★" : ""}</td>
                      <td className="px-6 py-3 text-[#374151]">{w.profession}</td>
                      <td className="px-6 py-3 font-medium text-[#1a56a0]">{w.completed_credits}</td>
                      <td className="px-6 py-3 text-[#374151]">{w.required_credits}</td>
                      <td className="px-6 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${zone.classes}`}>{zone.label}</span></td>
                      <td className="px-6 py-3 text-xs text-[#64748b]">{fmtDate(w.cycle_end_date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CME activities */}
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="px-6 py-4 border-b border-[#e2e8f0]"><h2 className="text-base font-semibold text-[#111]">Recent CME Activities</h2></div>
        {activityRows.length === 0 ? (
          <p className="px-6 py-6 text-sm text-[#64748b]">No CME activities recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  {["Activity", "Provider", "Date", "Credits", "Status"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {activityRows.map((a, i) => (
                  <tr key={i}>
                    <td className="px-6 py-3 font-medium text-[#111]">{a.title}</td>
                    <td className="px-6 py-3 text-[#374151]">{a.provider ?? "—"}</td>
                    <td className="px-6 py-3 text-xs text-[#64748b]">{fmtDate(a.activity_date)}</td>
                    <td className="px-6 py-3 text-[#1a56a0] font-medium">{Number(a.credits)}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${a.verification_status === "verified" ? "bg-[#dcfce7] text-[#16a34a]" : a.verification_status === "rejected" ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#fff7ed] text-[#d97706]"}`}>
                        {a.verification_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-[#64748b] mt-4 text-center">
        Oversight access under your jurisdiction mandate. This view is audit-logged.
      </p>
    </div>
  );
}

function Fact({ label, value, sub, subDanger }: { label: string; value: string; sub?: string; subDanger?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
      <p className="text-xs text-[#64748b]">{label}</p>
      <p className="text-lg font-bold text-[#111] mt-0.5">{value}</p>
      {sub && <p className={`text-xs mt-0.5 font-medium ${subDanger ? "text-[#dc2626]" : "text-[#64748b]"}`}>{sub}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#f8fafc] pb-2">
      <dt className="text-[#64748b]">{label}</dt>
      <dd className="text-[#111] font-medium text-right">{value ?? "—"}</dd>
    </div>
  );
}

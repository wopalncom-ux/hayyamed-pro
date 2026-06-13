import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import InviteLinkButton from "@/components/employer/InviteLinkButton";
import LinkRequestActions from "@/components/employer/LinkRequestActions";

export const metadata = { title: "University Dashboard — Hayya Med Pro" };

type ComplianceStatus = "compliant" | "at_risk" | "non_compliant" | "unknown";

interface FacultyMember {
  linkId: string;
  professionalId: string;
  name: string;
  profession: string;
  specialty: string;
  department: string | null;
  licenseExpiry: string | null;
  daysToExpiry: number | null;
  cmeVisible: boolean;
  completedCredits: number | null;
  requiredCredits: number | null;
  complianceStatus: ComplianceStatus;
}

const STATUS_CONFIG: Record<ComplianceStatus, { label: string; classes: string }> = {
  compliant:     { label: "Compliant",     classes: "bg-[#dcfce7] text-[#16a34a]" },
  at_risk:       { label: "At Risk",       classes: "bg-[#fff7ed] text-[#d97706]" },
  non_compliant: { label: "Non-Compliant", classes: "bg-[#fef2f2] text-[#dc2626]" },
  unknown:       { label: "No Data",       classes: "bg-[#f1f5f9] text-[#64748b]" },
};

export default async function UniversityDashboardPage({
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
    .eq("role", "university_admin")
    .maybeSingle();

  if (!member) redirect("/dashboard");

  const orgId = member.organization_id;
  const _orgs = member.organizations as { name: string; verified: boolean }[] | { name: string; verified: boolean } | null;
  const org = Array.isArray(_orgs) ? _orgs[0] : (_orgs as { name: string; verified: boolean } | null);
  const orgName = org?.name ?? "Your Institution";
  const isVerified = org?.verified ?? false;

  const [pendingRes, approvedRes] = await Promise.all([
    admin.from("employer_link_requests")
      .select("id, professional_id, requested_at")
      .eq("organization_id", orgId).eq("status", "pending")
      .order("requested_at", { ascending: false }),
    admin.from("employer_link_requests")
      .select("id, professional_id, department")
      .eq("organization_id", orgId).eq("status", "approved"),
  ]);

  const pending = pendingRes.data ?? [];
  const approved = approvedRes.data ?? [];
  const facultyIds = approved.map((r) => r.professional_id);
  const pendingIds = pending.map((r) => r.professional_id);

  const [profilesRes, pendingProfilesRes, privacyRes, walletsRes] = await Promise.all([
    facultyIds.length
      ? admin.from("professional_profiles")
          .select("auth_id, full_name, profession, specialty, license_expiry")
          .in("auth_id", facultyIds)
      : Promise.resolve({ data: [] }),
    pendingIds.length
      ? admin.from("professional_profiles")
          .select("auth_id, full_name, profession")
          .in("auth_id", pendingIds)
      : Promise.resolve({ data: [] }),
    facultyIds.length
      ? admin.from("profile_privacy_settings")
          .select("professional_id, employer_can_view_cme_summary, employer_can_view_license_expiry")
          .in("professional_id", facultyIds)
      : Promise.resolve({ data: [] }),
    facultyIds.length
      ? admin.from("cme_wallets")
          .select("professional_id, completed_credits, required_credits, compliance_status")
          .in("professional_id", facultyIds)
      : Promise.resolve({ data: [] }),
  ]);

  const profileMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.auth_id, p]));
  const pendingProfileMap = Object.fromEntries((pendingProfilesRes.data ?? []).map((p) => [p.auth_id, p]));
  const privacyMap = Object.fromEntries((privacyRes.data ?? []).map((p) => [p.professional_id, p]));
  const walletMap = Object.fromEntries((walletsRes.data ?? []).map((w) => [w.professional_id, w]));

  const faculty: FacultyMember[] = approved.map((link) => {
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
      department: (link as { department?: string | null }).department ?? null,
      licenseExpiry,
      daysToExpiry,
      cmeVisible,
      completedCredits: cmeVisible ? (wallet?.completed_credits ?? null) : null,
      requiredCredits: cmeVisible ? (wallet?.required_credits ?? null) : null,
      complianceStatus: (cmeVisible && wallet ? (wallet.compliance_status as ComplianceStatus) : "unknown") ?? "unknown",
    };
  });

  const total = faculty.length;
  const compliant = faculty.filter((f) => f.complianceStatus === "compliant").length;
  const atRisk = faculty.filter((f) => f.complianceStatus === "at_risk").length;
  const nonCompliant = faculty.filter((f) => f.complianceStatus === "non_compliant").length;
  const expiringSoon = faculty.filter((f) => f.daysToExpiry !== null && f.daysToExpiry <= 30 && f.daysToExpiry >= 0).length;

  const needsAttention = faculty.filter(
    (f) => f.complianceStatus === "non_compliant" || f.complianceStatus === "at_risk" ||
           (f.daysToExpiry !== null && f.daysToExpiry <= 30)
  );

  // Group by school/department
  const deptMap = new Map<string, FacultyMember[]>();
  for (const f of faculty) {
    const key = f.department ?? "";
    if (!deptMap.has(key)) deptMap.set(key, []);
    deptMap.get(key)!.push(f);
  }
  const deptGroups = [...deptMap.entries()]
    .map(([name, members]) => ({ name: name || "Unassigned", members }))
    .sort((a, b) => a.name === "Unassigned" ? 1 : b.name === "Unassigned" ? -1 : a.name.localeCompare(b.name));

  const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 0;

  return (
    <div>
      {/* Setup complete */}
      {sp.setup === "complete" && (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#15803d]">Institution registered — university dashboard is active</p>
            <p className="text-xs text-[#64748b] mt-0.5">
              Share your faculty invite link to start tracking CME compliance. Our team will verify your institution within 1 business day.
            </p>
          </div>
        </div>
      )}

      {/* Pending verification banner */}
      {!isVerified && sp.setup !== "complete" && (
        <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
          <span className="text-lg flex-shrink-0">⏳</span>
          <div>
            <p className="text-sm font-semibold text-[#92400e]">Institution verification pending</p>
            <p className="text-xs text-[#374151] mt-0.5">
              Your institution is being verified by our team. You can add faculty and configure settings in the meantime.
              Verification is typically completed within 1 business day.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Faculty Compliance Overview</h1>
          <p className="text-sm text-[#64748b] mt-1">{orgName}</p>
        </div>
        <div className="flex items-center gap-3">
          <InviteLinkButton organizationId={orgId} orgName={orgName} />
          {total > 0 && (
            <Link
              href="/university/analytics"
              className="text-sm bg-white border border-[#e2e8f0] text-[#374151] px-4 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors font-medium"
            >
              View analytics
            </Link>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-8">
        <StatCard label="Total Faculty" value={total.toString()} color="blue" />
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

      {/* Alerts */}
      {needsAttention.length > 0 && (
        <div className="bg-[#fef9c3] border border-[#fde68a] rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-[#92400e] mb-2">
            ⚠ {needsAttention.length} faculty member{needsAttention.length > 1 ? "s" : ""} need attention
          </p>
          <div className="space-y-1">
            {needsAttention.slice(0, 5).map((f) => (
              <p key={f.professionalId} className="text-xs text-[#92400e]">
                • {f.name} —{" "}
                {f.complianceStatus !== "compliant" && f.complianceStatus !== "unknown"
                  ? STATUS_CONFIG[f.complianceStatus].label
                  : ""}
                {f.daysToExpiry !== null && f.daysToExpiry <= 30
                  ? ` License expires in ${f.daysToExpiry}d`
                  : ""}
              </p>
            ))}
            {needsAttention.length > 5 && (
              <p className="text-xs text-[#92400e]">+ {needsAttention.length - 5} more</p>
            )}
          </div>
        </div>
      )}

      {/* Pending requests */}
      {pending.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
          <div className="px-6 py-4 border-b border-[#e2e8f0]">
            <h2 className="text-base font-semibold text-[#111]">Pending Faculty Requests</h2>
            <p className="text-xs text-[#64748b] mt-0.5">Faculty requesting to link to your institution</p>
          </div>
          <div className="divide-y divide-[#e2e8f0]">
            {pending.map((req) => {
              const prof = pendingProfileMap[req.professional_id];
              return (
                <div key={req.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#111]">{prof?.full_name ?? "Unknown"}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      {prof?.profession ?? "—"} · Requested {new Date(req.requested_at).toLocaleDateString()}
                    </p>
                  </div>
                  <LinkRequestActions requestId={req.id} organizationId={orgId} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Faculty compliance table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#111]">Faculty Compliance</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            CME and license data visible only where faculty have given consent.
          </p>
        </div>

        {faculty.length === 0 ? (
          <div className="px-6 py-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#e8f0fe] flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-base font-bold text-[#111] mb-1">No faculty linked yet</h3>
              <p className="text-sm text-[#64748b] max-w-sm mx-auto">
                Share your invite link with faculty so they can link their Hayya Med Pro accounts to your institution.
              </p>
            </div>
            <div className="mb-6 flex justify-center">
              <InviteLinkButton organizationId={orgId} orgName={orgName} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { step: "1", title: "Copy & share invite link", body: "Share your institution invite link with faculty via email or your LMS." },
                { step: "2", title: "Faculty register via link", body: "Faculty register on Hayya Med Pro — they're auto-linked to your institution on completing onboarding." },
                { step: "3", title: "Approve requests here", body: "Approve each request to start seeing their CME compliance data in real time." },
              ].map(({ step, title, body }) => (
                <div key={step} className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-[#1a56a0] text-white text-sm font-bold flex items-center justify-center mx-auto mb-2">{step}</div>
                  <p className="text-xs font-semibold text-[#111] mb-1">{title}</p>
                  <p className="text-xs text-[#64748b] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {deptGroups.map((group) => {
              const gCompliant = group.members.filter((f) => f.complianceStatus === "compliant").length;
              const gAtRisk = group.members.filter((f) => f.complianceStatus === "at_risk").length;
              const gNonCompliant = group.members.filter((f) => f.complianceStatus === "non_compliant").length;

              return (
                <div key={group.name}>
                  <div className="px-6 py-2.5 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#374151] uppercase tracking-wide">{group.name}</span>
                    <span className="text-xs text-[#64748b]">{group.members.length} faculty</span>
                    <div className="flex items-center gap-1.5 ml-auto text-xs">
                      <span className="bg-[#dcfce7] text-[#16a34a] px-1.5 py-0.5 rounded font-medium">{gCompliant}</span>
                      {gAtRisk > 0 && <span className="bg-[#fff7ed] text-[#d97706] px-1.5 py-0.5 rounded font-medium">{gAtRisk}</span>}
                      {gNonCompliant > 0 && <span className="bg-[#fef2f2] text-[#dc2626] px-1.5 py-0.5 rounded font-medium">{gNonCompliant}</span>}
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#f1f5f9]">
                          {["Name", "Profession", "School / Dept", "CME Credits", "Status", "License Expiry"].map((h) => (
                            <th key={h} className="text-left px-6 py-2 text-xs font-medium text-[#94a3b8] uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9]">
                        {group.members.map((f) => (
                          <tr key={f.professionalId} className="hover:bg-[#f8fafc] transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-medium text-[#111]">{f.name}</p>
                              <p className="text-xs text-[#64748b]">{f.specialty}</p>
                            </td>
                            <td className="px-6 py-4 text-[#374151]">{f.profession}</td>
                            <td className="px-6 py-4">
                              <span className="text-xs text-[#64748b]">{f.department ?? "—"}</span>
                            </td>
                            <td className="px-6 py-4">
                              {f.cmeVisible && f.completedCredits !== null ? (
                                <div>
                                  <span className="font-medium text-[#1a56a0]">{f.completedCredits}</span>
                                  <span className="text-[#64748b]"> / {f.requiredCredits}</span>
                                  <div className="w-24 bg-[#e2e8f0] rounded-full h-1.5 mt-1">
                                    <div
                                      className="bg-[#1a56a0] h-1.5 rounded-full"
                                      style={{ width: `${Math.min(((f.completedCredits ?? 0) / (f.requiredCredits ?? 50)) * 100, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-[#94a3b8]">Private</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_CONFIG[f.complianceStatus].classes}`}>
                                {STATUS_CONFIG[f.complianceStatus].label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {f.daysToExpiry !== null ? (
                                <span className={`text-sm font-medium ${
                                  f.daysToExpiry < 0 ? "text-[#dc2626]" :
                                  f.daysToExpiry <= 30 ? "text-[#dc2626]" :
                                  f.daysToExpiry <= 90 ? "text-[#d97706]" : "text-[#16a34a]"
                                }`}>
                                  {f.daysToExpiry < 0 ? "EXPIRED" : `${f.daysToExpiry}d`}
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
                    {group.members.map((f) => (
                      <div key={f.professionalId} className="px-4 py-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-[#111]">{f.name}</p>
                            <p className="text-xs text-[#64748b]">{f.profession} · {f.specialty}</p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_CONFIG[f.complianceStatus].classes}`}>
                            {STATUS_CONFIG[f.complianceStatus].label}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-[#64748b]">
                          <span>CME: {f.cmeVisible && f.completedCredits !== null ? `${f.completedCredits}/${f.requiredCredits}` : "Private"}</span>
                          <span>Expiry: {f.daysToExpiry !== null ? (f.daysToExpiry < 0 ? "EXPIRED" : `${f.daysToExpiry}d`) : "Private"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      <p className="text-xs text-[#94a3b8] mt-6 text-center">
        Hayya Med Pro shows only data that faculty have explicitly consented to share with their institution.
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

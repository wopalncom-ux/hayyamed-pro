import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BulkReportButton from "@/components/employer/BulkReportButton";
import LinkRequestActions from "@/components/employer/LinkRequestActions";
import AssignDepartmentButton from "@/components/employer/AssignDepartmentButton";
import AssignTaskButton from "@/components/employer/AssignTaskButton";
import SendReminderButton from "@/components/employer/SendReminderButton";
import InviteLinkButton from "@/components/employer/InviteLinkButton";

type ComplianceStatus = "compliant" | "at_risk" | "non_compliant" | "unknown";

interface StaffMember {
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

export default async function EmployerDashboardPage({
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
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) redirect("/dashboard");

  const orgId = member.organization_id;
  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? "Your Organization";

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
  const staffIds = approved.map((r) => r.professional_id);

  const pendingIds = pending.map((r) => r.professional_id);
  const [profilesRes, pendingProfilesRes, privacyRes, walletsRes] = await Promise.all([
    staffIds.length
      ? admin.from("professional_profiles")
          .select("auth_id, full_name, profession, specialty, license_expiry")
          .in("auth_id", staffIds)
      : Promise.resolve({ data: [] }),
    pendingIds.length
      ? admin.from("professional_profiles")
          .select("auth_id, full_name, profession")
          .in("auth_id", pendingIds)
      : Promise.resolve({ data: [] }),
    staffIds.length
      ? admin.from("profile_privacy_settings")
          .select("professional_id, employer_can_view_cme_summary, employer_can_view_license_expiry")
          .in("professional_id", staffIds)
      : Promise.resolve({ data: [] }),
    staffIds.length
      ? admin.from("cme_wallets")
          .select("professional_id, completed_credits, required_credits, compliance_status")
          .in("professional_id", staffIds)
      : Promise.resolve({ data: [] }),
  ]);

  const profileMap = Object.fromEntries((profilesRes.data ?? []).map((p) => [p.auth_id, p]));
  const pendingProfileMap = Object.fromEntries((pendingProfilesRes.data ?? []).map((p) => [p.auth_id, p]));
  const privacyMap = Object.fromEntries((privacyRes.data ?? []).map((p) => [p.professional_id, p]));
  const walletMap = Object.fromEntries((walletsRes.data ?? []).map((w) => [w.professional_id, w]));

  const staff: StaffMember[] = approved.map((link) => {
    const profile = profileMap[link.professional_id];
    const privacy = privacyMap[link.professional_id];
    const wallet = walletMap[link.professional_id];
    const cmeVisible = privacy?.employer_can_view_cme_summary !== false;
    const licenseVisible = privacy?.employer_can_view_license_expiry !== false;

    const licenseExpiry = licenseVisible ? (profile?.license_expiry ?? null) : null;
    const daysToExpiry = licenseExpiry
      ? Math.ceil((new Date(licenseExpiry).getTime() - Date.now()) / 86400000)
      : null;

    let complianceStatus: ComplianceStatus = "unknown";
    if (cmeVisible && wallet) {
      complianceStatus = wallet.compliance_status as ComplianceStatus ?? "unknown";
    }

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
      complianceStatus,
    };
  });

  // Summary stats
  const total = staff.length;
  const compliant = staff.filter((s) => s.complianceStatus === "compliant").length;
  const atRisk = staff.filter((s) => s.complianceStatus === "at_risk").length;
  const nonCompliant = staff.filter((s) => s.complianceStatus === "non_compliant").length;
  const expiringSoon = staff.filter((s) => s.daysToExpiry !== null && s.daysToExpiry <= 30 && s.daysToExpiry >= 0).length;

  const needsAttention = staff.filter(
    (s) => s.complianceStatus === "non_compliant" || s.complianceStatus === "at_risk" ||
           (s.daysToExpiry !== null && s.daysToExpiry <= 30)
  );

  // Group by department
  const deptMap = new Map<string, StaffMember[]>();
  for (const s of staff) {
    const key = s.department ?? "";
    if (!deptMap.has(key)) deptMap.set(key, []);
    deptMap.get(key)!.push(s);
  }
  const hasDepartments = [...deptMap.keys()].some((k) => k !== "");
  const deptGroups: Array<{ name: string; members: StaffMember[] }> = [];
  for (const [key, members] of deptMap) {
    deptGroups.push({ name: key || "Unassigned", members });
  }
  deptGroups.sort((a, b) => {
    if (a.name === "Unassigned") return 1;
    if (b.name === "Unassigned") return -1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      {/* Setup complete — shown once after employer registration */}
      {sp.setup === "complete" && (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#15803d]">Organization registered — employer dashboard is ready</p>
            <p className="text-xs text-[#64748b] mt-0.5">
              Copy your invite link above and share it with your staff to get started.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Staff Compliance Overview</h1>
          <p className="text-sm text-[#64748b] mt-1">{orgName}</p>
        </div>
        <div className="flex items-center gap-3">
          <InviteLinkButton organizationId={orgId} orgName={orgName} />
          {total > 0 && <BulkReportButton organizationId={orgId} orgName={orgName} />}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        <StatCard label="Total Staff" value={total} color="blue" />
        <StatCard label="Compliant" value={compliant} color="green" />
        <StatCard label="At Risk" value={atRisk} color="orange" />
        <StatCard label="Non-Compliant" value={nonCompliant} color="red" />
        <StatCard label="License ≤30d" value={expiringSoon} color={expiringSoon > 0 ? "red" : "green"} />
      </div>

      {/* Alerts */}
      {needsAttention.length > 0 && (
        <div className="bg-[#fef9c3] border border-[#fde68a] rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-[#92400e] mb-2">
            ⚠ {needsAttention.length} staff member{needsAttention.length > 1 ? "s" : ""} need attention
          </p>
          <div className="space-y-1">
            {needsAttention.slice(0, 5).map((s) => (
              <p key={s.professionalId} className="text-xs text-[#92400e]">
                • {s.name} —{" "}
                {s.complianceStatus !== "compliant" && s.complianceStatus !== "unknown"
                  ? STATUS_CONFIG[s.complianceStatus].label
                  : ""}
                {s.daysToExpiry !== null && s.daysToExpiry <= 30
                  ? ` License expires in ${s.daysToExpiry}d`
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
            <h2 className="text-base font-semibold text-[#111]">Pending Link Requests</h2>
            <p className="text-xs text-[#64748b] mt-0.5">Professionals requesting to link to your organization</p>
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

      {/* Staff compliance table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#111]">Staff Compliance</h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              CME and license data shown only where staff have given consent.
              {hasDepartments && " Click the department tag on any row to reassign."}
            </p>
          </div>
        </div>

        {staff.length === 0 ? (
          <div className="px-6 py-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#e8f0fe] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#111] mb-1">No staff linked yet</h3>
              <p className="text-sm text-[#64748b] max-w-sm mx-auto">
                Staff need to link their Hayya Med Pro account to your organization. Here&apos;s how to get them started.
              </p>
            </div>

            <div className="mb-6 flex justify-center">
              <InviteLinkButton organizationId={orgId} orgName={orgName} />
            </div>
            <p className="text-center text-xs text-[#64748b] mb-6">
              Share this link with your staff — they&apos;ll be auto-linked to {orgName} after registering.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-4 text-center">
                <div className="w-8 h-8 rounded-full bg-[#1a56a0] text-white text-sm font-bold flex items-center justify-center mx-auto mb-2">1</div>
                <p className="text-xs font-semibold text-[#111] mb-1">Copy &amp; share invite link</p>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Use the button above to copy your invite link and share it with staff via email or WhatsApp.
                </p>
              </div>
              <div className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-4 text-center">
                <div className="w-8 h-8 rounded-full bg-[#1a56a0] text-white text-sm font-bold flex items-center justify-center mx-auto mb-2">2</div>
                <p className="text-xs font-semibold text-[#111] mb-1">Staff register via link</p>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Staff register using your invite link — a link request is auto-created when they finish onboarding.
                </p>
              </div>
              <div className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-4 text-center">
                <div className="w-8 h-8 rounded-full bg-[#1a56a0] text-white text-sm font-bold flex items-center justify-center mx-auto mb-2">3</div>
                <p className="text-xs font-semibold text-[#111] mb-1">Approve requests here</p>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Approve each request and start seeing their compliance data in real time.
                </p>
              </div>
            </div>

            <div className="text-center mt-6">
              <a
                href="/employer/staff/import"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a56a0] hover:text-[#154890] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Or bulk-import staff via CSV →
              </a>
            </div>
          </div>
        ) : (
          <>
            {deptGroups.map((group) => {
              const gCompliant = group.members.filter((s) => s.complianceStatus === "compliant").length;
              const gAtRisk = group.members.filter((s) => s.complianceStatus === "at_risk").length;
              const gNonCompliant = group.members.filter((s) => s.complianceStatus === "non_compliant").length;

              return (
                <div key={group.name}>
                  {/* Department header */}
                  <div className="px-6 py-2.5 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#374151] uppercase tracking-wide">
                      {group.name}
                    </span>
                    <span className="text-xs text-[#64748b]">{group.members.length} staff</span>
                    {group.members.length > 0 && (
                      <div className="flex items-center gap-1.5 ml-auto text-xs">
                        <span className="bg-[#dcfce7] text-[#16a34a] px-1.5 py-0.5 rounded font-medium">{gCompliant}</span>
                        {gAtRisk > 0 && <span className="bg-[#fff7ed] text-[#d97706] px-1.5 py-0.5 rounded font-medium">{gAtRisk}</span>}
                        {gNonCompliant > 0 && <span className="bg-[#fef2f2] text-[#dc2626] px-1.5 py-0.5 rounded font-medium">{gNonCompliant}</span>}
                      </div>
                    )}
                  </div>

                  {/* Desktop table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#f1f5f9]">
                          <th className="text-left px-6 py-2 text-xs font-medium text-[#94a3b8] uppercase tracking-wide">Name</th>
                          <th className="text-left px-6 py-2 text-xs font-medium text-[#94a3b8] uppercase tracking-wide">Profession</th>
                          <th className="text-left px-6 py-2 text-xs font-medium text-[#94a3b8] uppercase tracking-wide">Department</th>
                          <th className="text-left px-6 py-2 text-xs font-medium text-[#94a3b8] uppercase tracking-wide">CME Credits</th>
                          <th className="text-left px-6 py-2 text-xs font-medium text-[#94a3b8] uppercase tracking-wide">Status</th>
                          <th className="text-left px-6 py-2 text-xs font-medium text-[#94a3b8] uppercase tracking-wide">License Expiry</th>
                          <th className="text-left px-6 py-2 text-xs font-medium text-[#94a3b8] uppercase tracking-wide">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9]">
                        {group.members.map((s) => (
                          <tr key={s.professionalId} className="hover:bg-[#f8fafc] transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-medium text-[#111]">{s.name}</p>
                              <p className="text-xs text-[#64748b]">{s.specialty}</p>
                            </td>
                            <td className="px-6 py-4 text-[#374151]">{s.profession}</td>
                            <td className="px-6 py-4">
                              <AssignDepartmentButton linkId={s.linkId} initialDepartment={s.department} />
                            </td>
                            <td className="px-6 py-4">
                              {s.cmeVisible && s.completedCredits !== null ? (
                                <div>
                                  <span className="font-medium text-[#1a56a0]">{s.completedCredits}</span>
                                  <span className="text-[#64748b]"> / {s.requiredCredits}</span>
                                  <div className="w-24 bg-[#e2e8f0] rounded-full h-1.5 mt-1">
                                    <div
                                      className="bg-[#1a56a0] h-1.5 rounded-full"
                                      style={{ width: `${Math.min(((s.completedCredits ?? 0) / (s.requiredCredits ?? 50)) * 100, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-[#94a3b8]">Private</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_CONFIG[s.complianceStatus].classes}`}>
                                {STATUS_CONFIG[s.complianceStatus].label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {s.daysToExpiry !== null ? (
                                <span className={`text-sm font-medium ${
                                  s.daysToExpiry < 0 ? "text-[#dc2626]" :
                                  s.daysToExpiry <= 30 ? "text-[#dc2626]" :
                                  s.daysToExpiry <= 90 ? "text-[#d97706]" : "text-[#16a34a]"
                                }`}>
                                  {s.daysToExpiry < 0 ? "EXPIRED" : `${s.daysToExpiry}d`}
                                </span>
                              ) : (
                                <span className="text-xs text-[#94a3b8]">Private</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <AssignTaskButton professionalId={s.professionalId} staffName={s.name} />
                                <SendReminderButton
                                  professionalId={s.professionalId}
                                  staffName={s.name}
                                  completedCredits={s.completedCredits}
                                  requiredCredits={s.requiredCredits}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="sm:hidden divide-y divide-[#e2e8f0]">
                    {group.members.map((s) => (
                      <div key={s.professionalId} className="px-4 py-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-[#111]">{s.name}</p>
                            <p className="text-xs text-[#64748b]">{s.profession} · {s.specialty}</p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_CONFIG[s.complianceStatus].classes}`}>
                            {STATUS_CONFIG[s.complianceStatus].label}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-[#64748b] mb-2">
                          <span>
                            CME: {s.cmeVisible && s.completedCredits !== null
                              ? `${s.completedCredits}/${s.requiredCredits}`
                              : "Private"}
                          </span>
                          <span>
                            Expiry: {s.daysToExpiry !== null
                              ? (s.daysToExpiry < 0 ? "EXPIRED" : `${s.daysToExpiry}d`)
                              : "Private"}
                          </span>
                        </div>
                        <AssignDepartmentButton linkId={s.linkId} initialDepartment={s.department} />
                        <div className="flex gap-2 mt-2">
                          <AssignTaskButton professionalId={s.professionalId} staffName={s.name} />
                          <SendReminderButton
                            professionalId={s.professionalId}
                            staffName={s.name}
                            completedCredits={s.completedCredits}
                            requiredCredits={s.requiredCredits}
                          />
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

      {/* Disclaimer */}
      <p className="text-xs text-[#94a3b8] mt-6 text-center">
        Hayya Med Pro employer view only shows data that professionals have explicitly consented to share.
      </p>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: "blue" | "green" | "orange" | "red" }) {
  const colors = {
    blue:   "text-[#1a56a0]",
    green:  "text-[#16a34a]",
    orange: "text-[#d97706]",
    red:    "text-[#dc2626]",
  };
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center">
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
      <p className="text-xs text-[#64748b] mt-1 leading-tight">{label}</p>
    </div>
  );
}

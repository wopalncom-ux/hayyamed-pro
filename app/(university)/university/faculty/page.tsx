import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import InviteLinkButton from "@/components/employer/InviteLinkButton";
import LinkRequestActions from "@/components/employer/LinkRequestActions";

export const metadata = { title: "Faculty Management — University Portal" };

export default async function UniversityFacultyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "university_admin")
    .maybeSingle();

  if (!member) redirect("/dashboard");

  const orgId = member.organization_id;
  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? "Your Institution";

  const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
    admin.from("employer_link_requests")
      .select("id, professional_id, requested_at")
      .eq("organization_id", orgId).eq("status", "pending")
      .order("requested_at", { ascending: false }),
    admin.from("employer_link_requests")
      .select("id, professional_id, department, requested_at")
      .eq("organization_id", orgId).eq("status", "approved")
      .order("requested_at", { ascending: false }),
    admin.from("employer_link_requests")
      .select("id, professional_id, requested_at")
      .eq("organization_id", orgId).eq("status", "rejected")
      .order("requested_at", { ascending: false })
      .limit(20),
  ]);

  const pending = pendingRes.data ?? [];
  const approved = approvedRes.data ?? [];
  const rejected = rejectedRes.data ?? [];

  const allIds = [...new Set([
    ...pending.map((r) => r.professional_id),
    ...approved.map((r) => r.professional_id),
    ...rejected.map((r) => r.professional_id),
  ])];

  const profileMap: Record<string, { full_name: string | null; profession: string | null; specialty: string | null; license_expiry: string | null }> = {};
  if (allIds.length > 0) {
    const { data: profiles } = await admin
      .from("professional_profiles")
      .select("auth_id, full_name, profession, specialty, license_expiry")
      .in("auth_id", allIds);
    (profiles ?? []).forEach((p) => { profileMap[p.auth_id] = p; });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Faculty Management</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {approved.length} active · {pending.length} pending · {orgName}
          </p>
        </div>
        <InviteLinkButton organizationId={orgId} orgName={orgName} />
      </div>

      {/* Import via CSV */}
      <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#1e40af]">Bulk import faculty</p>
          <p className="text-xs text-[#374151] mt-0.5">
            Upload a CSV of faculty email addresses to send them an invitation to link their accounts.
          </p>
        </div>
        <a
          href="/employer/staff/import"
          className="text-sm bg-white border border-[#bfdbfe] text-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#f0f7ff] transition-colors font-medium whitespace-nowrap flex-shrink-0"
        >
          Import CSV →
        </a>
      </div>

      {/* Pending requests */}
      {pending.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-3">
            <h2 className="text-base font-semibold text-[#111]">Pending Requests</h2>
            <span className="bg-[#fff7ed] text-[#d97706] text-xs font-semibold px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          </div>
          <div className="divide-y divide-[#e2e8f0]">
            {pending.map((req) => {
              const prof = profileMap[req.professional_id];
              return (
                <div key={req.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-[#111]">{prof?.full_name ?? "Unknown"}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {prof?.profession && (
                        <span className="text-xs text-[#64748b]">{prof.profession}</span>
                      )}
                      {prof?.specialty && (
                        <span className="text-xs text-[#94a3b8]">· {prof.specialty}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#94a3b8] mt-0.5">
                      Requested {new Date(req.requested_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <LinkRequestActions requestId={req.id} organizationId={orgId} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active faculty */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#111]">Active Faculty</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            {approved.length} faculty linked to {orgName}
          </p>
        </div>

        {approved.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#e8f0fe] flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <p className="text-sm font-medium text-[#111] mb-1">No faculty linked yet</p>
            <p className="text-sm text-[#64748b]">
              Share your invite link above or import faculty via CSV.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9]">
                    {["Name", "Profession / Specialty", "School / Dept", "License Expiry", "Linked Since"].map((h) => (
                      <th key={h} className="text-left px-6 py-2 text-xs font-medium text-[#94a3b8] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {approved.map((link) => {
                    const prof = profileMap[link.professional_id];
                    const daysToExpiry = prof?.license_expiry
                      ? Math.ceil((new Date(prof.license_expiry).getTime() - Date.now()) / 86400000)
                      : null;
                    return (
                      <tr key={link.id} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#111]">{prof?.full_name ?? "—"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[#374151]">{prof?.profession ?? "—"}</p>
                          {prof?.specialty && <p className="text-xs text-[#64748b]">{prof.specialty}</p>}
                        </td>
                        <td className="px-6 py-4 text-[#64748b] text-xs">
                          {(link as { department?: string | null }).department ?? "—"}
                        </td>
                        <td className="px-6 py-4">
                          {daysToExpiry !== null ? (
                            <span className={`text-sm font-medium ${
                              daysToExpiry < 0 ? "text-[#dc2626]" :
                              daysToExpiry <= 30 ? "text-[#dc2626]" :
                              daysToExpiry <= 90 ? "text-[#d97706]" : "text-[#16a34a]"
                            }`}>
                              {daysToExpiry < 0 ? "EXPIRED" : `${daysToExpiry}d`}
                            </span>
                          ) : (
                            <span className="text-xs text-[#94a3b8]">Private</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-[#64748b]">
                          {new Date(link.requested_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="sm:hidden divide-y divide-[#e2e8f0]">
              {approved.map((link) => {
                const prof = profileMap[link.professional_id];
                return (
                  <div key={link.id} className="px-4 py-4">
                    <p className="text-sm font-medium text-[#111]">{prof?.full_name ?? "—"}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">{prof?.profession ?? "—"} · {prof?.specialty ?? ""}</p>
                    <p className="text-xs text-[#94a3b8] mt-1">
                      Linked {new Date(link.requested_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Rejected (collapsed history) */}
      {rejected.length > 0 && (
        <details className="bg-white rounded-xl border border-[#e2e8f0]">
          <summary className="px-6 py-4 cursor-pointer text-sm font-medium text-[#64748b] hover:text-[#111] list-none flex items-center justify-between">
            <span>Rejected requests ({rejected.length})</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </summary>
          <div className="divide-y divide-[#e2e8f0] border-t border-[#e2e8f0]">
            {rejected.map((req) => {
              const prof = profileMap[req.professional_id];
              return (
                <div key={req.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#374151]">{prof?.full_name ?? "—"}</p>
                    <p className="text-xs text-[#94a3b8]">{prof?.profession ?? "—"}</p>
                  </div>
                  <span className="text-xs text-[#dc2626] font-medium">Rejected</span>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}

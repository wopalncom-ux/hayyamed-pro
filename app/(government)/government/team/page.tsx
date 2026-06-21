import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import InviteTeamMemberForm from "@/components/government/InviteTeamMemberForm";
import RemoveTeamMemberButton from "@/components/government/RemoveTeamMemberButton";

export const metadata = { title: "Authority Team — Hayya Med Pro" };

export default async function GovernmentTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: selfMember } = await admin
    .from("organization_members")
    .select("id, organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .maybeSingle();

  if (!selfMember) redirect("/government");

  const orgId = selfMember.organization_id;
  const _orgs = selfMember.organizations as { name: string }[] | { name: string } | null;
  const org = Array.isArray(_orgs) ? _orgs[0] : (_orgs as { name: string } | null);
  const orgName = org?.name ?? "Your Authority";

  const { data: members } = await admin
    .from("organization_members")
    .select("id, auth_id, role, created_at")
    .eq("organization_id", orgId)
    .in("role", ["government_admin", "government_staff"])
    .order("created_at", { ascending: true });

  const memberIds = (members ?? []).map((m) => m.auth_id);
  const { data: profiles } = await admin
    .from("professional_profiles")
    .select("auth_id, full_name, email, profession")
    .in("auth_id", memberIds);

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.auth_id, p]));

  const enriched = (members ?? []).map((m) => ({
    ...m,
    profile: profileMap[m.auth_id],
    isSelf: m.auth_id === user.id,
  }));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/government" className="text-sm text-[#64748b] hover:text-[#374151] transition-colors">
          ← Dashboard
        </Link>
        <span className="text-[#e2e8f0]">/</span>
        <h1 className="text-lg font-semibold text-[#111]">Authority Team</h1>
      </div>

      {sp.error && (
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-5 py-3 mb-5 text-sm text-[#dc2626]">
          {sp.error}
        </div>
      )}

      {/* Current team members */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#111]">Team Members</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            {enriched.length} member{enriched.length !== 1 ? "s" : ""} with access to {orgName}&apos;s dashboard
          </p>
        </div>

        <div className="divide-y divide-[#e2e8f0]">
          {enriched.map((m) => (
            <div key={m.id} className="px-6 py-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-[#1a56a0]">
                  {(m.profile?.full_name ?? "?")[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#111]">{m.profile?.full_name ?? "Unknown"}</p>
                  {m.isSelf && <span className="text-xs bg-[#f1f5f9] text-[#64748b] px-2 py-0.5 rounded-full">You</span>}
                </div>
                <p className="text-xs text-[#64748b] mt-0.5">
                  {m.profile?.email ?? "—"} · {m.profile?.profession ?? "—"}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  m.role === "government_admin"
                    ? "bg-[#e8f0fe] text-[#1a56a0]"
                    : "bg-[#f1f5f9] text-[#64748b]"
                }`}>
                  {m.role === "government_admin" ? "Admin" : "Staff"}
                </span>
                {!m.isSelf && (
                  <RemoveTeamMemberButton memberId={m.id} organizationId={orgId} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite new member */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <h2 className="text-base font-semibold text-[#111] mb-1">Invite Team Member</h2>
        <p className="text-sm text-[#64748b] mb-5">
          Add another person from your authority to access this dashboard. They must have an existing Hayya Med Pro account.
        </p>

        <InviteTeamMemberForm organizationId={orgId} />

        <div className="mt-5 pt-5 border-t border-[#e2e8f0]">
          <p className="text-xs font-semibold text-[#374151] mb-2">Access levels</p>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2 text-xs text-[#64748b]">
              <span className="font-medium text-[#1a56a0] flex-shrink-0">Admin</span>
              <span>— Full access: approve requests, send broadcasts, manage team, download reports</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-[#64748b]">
              <span className="font-medium text-[#64748b] flex-shrink-0">Staff</span>
              <span>— Read-only: view compliance data and registry only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

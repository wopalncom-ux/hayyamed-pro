import { createAdminClient } from "@/lib/supabase/server";
import { requireOwnerAuth } from "@/lib/ownerAuth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function OwnerUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; role?: string; status?: string; q?: string }>;
}) {
  await requireOwnerAuth();
  const sp = await searchParams;
  const page   = Math.max(1, parseInt(sp.page ?? "1", 10));
  const limit  = 50;
  const offset = (page - 1) * limit;
  const roleFilter   = sp.role ?? "";
  const statusFilter = sp.status ?? "";

  const admin = createAdminClient();

  const [
    totalRes, newWeekRes, suspendedRes, proRes, employerAdminRes,
    govAdminRes, providerAdminRes, masterAdminRes,
  ] = await Promise.all([
    admin.from("professional_profiles").select("id", { count: "exact", head: true }),
    admin.from("professional_profiles").select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 86400_000).toISOString()),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }).eq("is_suspended", true),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).in("status", ["active", "trialing"]).eq("plan", "pro"),
    admin.from("organization_members").select("id", { count: "exact", head: true }).eq("role", "employer_admin"),
    admin.from("organization_members").select("id", { count: "exact", head: true }).eq("role", "government_admin"),
    admin.from("organization_members").select("id", { count: "exact", head: true }).eq("role", "training_provider_admin"),
    admin.from("organization_members").select("id", { count: "exact", head: true }).in("role", ["master_admin", "super_admin", "founder"]),
  ]);

  // Fetch paginated professionals
  let query = admin
    .from("professional_profiles")
    .select("auth_id, full_name, profession, country_of_residence, profile_completion_pct, is_suspended, onboarding_complete, created_at, email_hard_bounced")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (statusFilter === "suspended") query = query.eq("is_suspended", true);
  if (statusFilter === "bounced") query = query.eq("email_hard_bounced", true);
  if (statusFilter === "incomplete") query = query.eq("onboarding_complete", false);

  const { data: profiles, count: filteredCount } = await query;

  const stats = [
    { label: "Total Users",        value: String(totalRes.count ?? 0),         color: "blue" },
    { label: "New (7 days)",       value: String(newWeekRes.count ?? 0),        color: "green" },
    { label: "Suspended",          value: String(suspendedRes.count ?? 0),      color: (suspendedRes.count ?? 0) > 0 ? "red" : "gray" },
    { label: "Pro Subscribers",    value: String(proRes.count ?? 0),            color: "purple" },
    { label: "Employer Admins",    value: String(employerAdminRes.count ?? 0),  color: "amber" },
    { label: "Gov Admins",         value: String(govAdminRes.count ?? 0),       color: "amber" },
    { label: "Providers",          value: String(providerAdminRes.count ?? 0),  color: "amber" },
    { label: "Platform Admins",    value: String(masterAdminRes.count ?? 0),    color: "purple" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };

  const totalPages = Math.ceil((filteredCount ?? totalRes.count ?? 0) / limit);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">User Management Center</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Manage all platform users, roles, and account status</p>
        </div>
        <a
          href="/admin/professionals"
          className="text-sm font-semibold text-[#1a56a0] hover:underline"
        >
          Full Management in Admin Panel →
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border px-4 py-3 ${colorMap[s.color] ?? colorMap.gray}`}>
            <p className="text-lg font-bold tabular-nums">{s.value}</p>
            <p className="text-[10px] font-medium mt-0.5 opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
        <form method="GET" className="flex flex-wrap gap-3">
          <select
            name="status"
            defaultValue={statusFilter}
            className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
          >
            <option value="">All Users</option>
            <option value="suspended">Suspended</option>
            <option value="bounced">Email Bounced</option>
            <option value="incomplete">Incomplete Onboarding</option>
          </select>
          <button
            type="submit"
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1545a0] transition-colors"
          >
            Filter
          </button>
          {statusFilter && (
            <a
              href="/owner/users"
              className="text-sm text-[#64748b] hover:text-[#1a56a0] px-3 py-2 rounded-lg border border-[#e2e8f0] transition-colors"
            >
              Clear
            </a>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">User</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide hidden sm:table-cell">Profession</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide hidden md:table-cell">Country</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide hidden lg:table-cell">Profile</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide hidden lg:table-cell">Joined</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-[#64748b] uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc]">
              {(profiles ?? []).map((p) => (
                <tr key={p.auth_id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#1a56a0]">
                          {(p.full_name ?? "?").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#0f172a] truncate max-w-[140px]">
                          {p.full_name ?? "—"}
                        </p>
                        <p className="text-[11px] text-[#94a3b8] font-mono truncate max-w-[140px]">
                          {p.auth_id.slice(0, 8)}…
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748b] hidden sm:table-cell">
                    {p.profession ?? <span className="text-[#cbd5e1]">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-[#64748b] hidden md:table-cell">
                    {p.country_of_residence ?? <span className="text-[#cbd5e1]">—</span>}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-[#f1f5f9] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#1a56a0]"
                          style={{ width: `${p.profile_completion_pct ?? 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#94a3b8]">{p.profile_completion_pct ?? 0}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.is_suspended ? (
                      <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">SUSPENDED</span>
                    ) : p.email_hard_bounced ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">BOUNCED</span>
                    ) : !p.onboarding_complete ? (
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">PENDING</span>
                    ) : (
                      <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">ACTIVE</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-[#94a3b8] text-xs hidden lg:table-cell">
                    {p.created_at ? new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <a
                      href={`/admin/professionals?id=${p.auth_id}`}
                      className="text-xs font-semibold text-[#1a56a0] hover:underline"
                    >
                      Manage →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(profiles ?? []).length === 0 && (
          <div className="text-center py-16 text-[#94a3b8] text-sm">No users found</div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-[#f1f5f9] flex items-center justify-between">
            <p className="text-xs text-[#64748b]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={`/owner/users?page=${page - 1}${statusFilter ? `&status=${statusFilter}` : ""}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors"
                >
                  Previous
                </a>
              )}
              {page < totalPages && (
                <a
                  href={`/owner/users?page=${page + 1}${statusFilter ? `&status=${statusFilter}` : ""}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1545a0] transition-colors"
                >
                  Next
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick links to admin management */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/professionals", label: "All Professionals" },
          { href: "/admin/organizations", label: "Organizations" },
          { href: "/admin/employers",     label: "Employers" },
          { href: "/admin/user-actions",  label: "User Action Logs" },
        ].map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-center px-4 py-3 rounded-xl border border-[#e2e8f0] bg-white text-sm font-semibold text-[#374151] hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors"
          >
            {l.label} →
          </a>
        ))}
      </div>
    </div>
  );
}

import { createAdminClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const admin = createAdminClient();

  const [profCount, orgCount, pendingLinks] = await Promise.all([
    admin.from("professional_profiles").select("id", { count: "exact", head: true }),
    admin.from("organizations").select("id", { count: "exact", head: true }),
    admin.from("employer_link_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-6">Admin Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">Total Professionals</p>
          <p className="text-2xl font-bold text-[#1a56a0]">{profCount.count ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">Organizations</p>
          <p className="text-2xl font-bold text-[#1a56a0]">{orgCount.count ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">Pending Link Requests</p>
          <p className="text-2xl font-bold text-[#d97706]">{pendingLinks.count ?? 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <h2 className="text-base font-semibold text-[#111] mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <a href="/admin/organizations" className="block text-sm text-[#1a56a0] hover:underline">Manage Organizations</a>
          <a href="/admin/link-requests" className="block text-sm text-[#1a56a0] hover:underline">Review Link Requests</a>
          <a href="/admin/professionals" className="block text-sm text-[#1a56a0] hover:underline">Manage Professionals</a>
        </div>
      </div>
    </div>
  );
}

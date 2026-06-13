import { createAdminClient } from "@/lib/supabase/server";
import OrgVerifyButton from "@/components/admin/OrgVerifyButton";

export default async function AdminOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const admin = createAdminClient();

  let query = admin
    .from("organizations")
    .select("id, name, type, city, country, verified, created_at")
    .order("name");

  if (q?.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
  }

  const { data: orgs } = await query;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Organizations</h1>
          <p className="text-sm text-[#64748b] mt-1">{orgs?.length ?? 0} total</p>
        </div>
        <a href="/admin" className="text-sm text-[#1a56a0] hover:underline">← Back to admin</a>
      </div>

      <form method="GET" action="/admin/organizations" className="mb-4 flex gap-2">
        <input
          name="q"
          type="search"
          defaultValue={q ?? ""}
          placeholder="Search by name…"
          className="flex-1 text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
        />
        <button
          type="submit"
          className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1547a0] transition-colors"
        >
          Search
        </button>
        {q && (
          <a
            href="/admin/organizations"
            className="text-sm px-4 py-2 rounded-lg bg-[#f1f5f9] text-[#374151] hover:bg-[#e2e8f0] transition-colors"
          >
            Clear
          </a>
        )}
      </form>

      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">City</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Country</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {!orgs || orgs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#64748b]">
                    No organizations yet.
                  </td>
                </tr>
              ) : (
                orgs.map((org) => (
                  <tr key={org.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#111] max-w-[200px] truncate">{org.name}</td>
                    <td className="px-4 py-3 text-[#64748b] capitalize">{org.type}</td>
                    <td className="px-4 py-3 text-[#64748b]">{org.city ?? "—"}</td>
                    <td className="px-4 py-3 text-[#64748b]">{org.country ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        org.verified ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fff7ed] text-[#d97706]"
                      }`}>
                        {org.verified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <OrgVerifyButton orgId={org.id} verified={org.verified ?? false} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { createAdminClient } from "@/lib/supabase/server";

export default async function AdminOrganizationsPage() {
  const admin = createAdminClient();

  const { data: orgs } = await admin
    .from("organizations")
    .select("id, name, type, city, country, verified, created_at")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Organizations</h1>
          <p className="text-sm text-[#64748b] mt-1">{orgs?.length ?? 0} total</p>
        </div>
        <a href="/admin" className="text-sm text-[#1a56a0] hover:underline">← Back to admin</a>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="grid grid-cols-12 px-6 py-3 border-b border-[#e2e8f0] text-xs font-medium text-[#64748b] uppercase tracking-wide">
          <span className="col-span-5">Name</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-2">City</span>
          <span className="col-span-2">Country</span>
          <span className="col-span-1">Verified</span>
        </div>
        {!orgs || orgs.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#64748b]">No organizations yet.</div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {orgs.map((org) => (
              <div key={org.id} className="grid grid-cols-12 px-6 py-3 items-center">
                <p className="col-span-5 text-sm font-medium text-[#111]">{org.name}</p>
                <p className="col-span-2 text-sm text-[#64748b] capitalize">{org.type}</p>
                <p className="col-span-2 text-sm text-[#64748b]">{org.city ?? "—"}</p>
                <p className="col-span-2 text-sm text-[#64748b]">{org.country ?? "—"}</p>
                <div className="col-span-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    org.verified ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fff7ed] text-[#d97706]"
                  }`}>
                    {org.verified ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

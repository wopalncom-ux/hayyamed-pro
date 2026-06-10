import { createAdminClient } from "@/lib/supabase/server";
import UnverifiedRequestActions from "@/components/admin/UnverifiedRequestActions";
import VerifiedRequestActions from "@/components/admin/VerifiedRequestActions";

export default async function AdminLinkRequestsPage() {
  const admin = createAdminClient();

  const { data: requests } = await admin
    .from("employer_link_requests")
    .select("id, professional_id, organization_id, unverified_employer_name, status, requested_at, organizations(name)")
    .order("requested_at", { ascending: false });

  const allRequests = requests ?? [];
  const pending = allRequests.filter((r) => r.status === "pending");
  const resolved = allRequests.filter((r) => r.status !== "pending");

  // Fetch professional names
  const allIds = allRequests.map((r) => r.professional_id);
  const { data: profiles } = allIds.length
    ? await admin.from("professional_profiles").select("auth_id, full_name, profession").in("auth_id", allIds)
    : { data: [] };
  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.auth_id, p]));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Link Requests</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {pending.length} pending · {resolved.length} resolved
          </p>
        </div>
        <a href="/admin" className="text-sm text-[#1a56a0] hover:underline">← Back to admin</a>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#111]">Pending Requests</h2>
        </div>
        {pending.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#64748b]">No pending requests.</div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {pending.map((req) => {
              const prof = profileMap[req.professional_id];
              const isUnverified = !req.organization_id;
              const _orgs = req.organizations as { name: string }[] | { name: string } | null;
              const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? req.unverified_employer_name ?? "—";
              return (
                <div key={req.id} className="px-6 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-[#111]">{prof?.full_name ?? "Unknown"}</p>
                      <span className="text-xs text-[#64748b]">•</span>
                      <p className="text-xs text-[#64748b]">{prof?.profession ?? "—"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-[#374151]">→ {orgName}</p>
                      {isUnverified && (
                        <span className="text-xs bg-[#fff7ed] text-[#d97706] px-2 py-0.5 rounded-full">
                          Unverified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#94a3b8] mt-0.5">
                      {new Date(req.requested_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {isUnverified ? (
                      <UnverifiedRequestActions
                        requestId={req.id}
                        suggestedName={req.unverified_employer_name ?? ""}
                        professionalId={req.professional_id}
                      />
                    ) : (
                      <VerifiedRequestActions requestId={req.id} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0]">
          <div className="px-6 py-4 border-b border-[#e2e8f0]">
            <h2 className="text-base font-semibold text-[#111]">Resolved</h2>
          </div>
          <div className="divide-y divide-[#e2e8f0]">
            {resolved.map((req) => {
              const prof = profileMap[req.professional_id];
              const _orgs = req.organizations as { name: string }[] | { name: string } | null;
              const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? req.unverified_employer_name ?? "—";
              return (
                <div key={req.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#111]">{prof?.full_name ?? "Unknown"} → {orgName}</p>
                    <p className="text-xs text-[#94a3b8] mt-0.5">{new Date(req.requested_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    req.status === "approved"
                      ? "bg-[#dcfce7] text-[#16a34a]"
                      : "bg-[#fef2f2] text-[#dc2626]"
                  }`}>
                    {req.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

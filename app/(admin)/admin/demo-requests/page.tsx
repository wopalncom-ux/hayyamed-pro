import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  new:          "bg-[#dbeafe] text-[#1e40af]",
  contacted:    "bg-[#fef9c3] text-[#854d0e]",
  qualified:    "bg-[#dcfce7] text-[#15803d]",
  closed_won:   "bg-[#bbf7d0] text-[#15803d]",
  closed_lost:  "bg-[#fee2e2] text-[#b91c1c]",
};

const STATUS_LABELS: Record<string, string> = {
  new:         "New",
  contacted:   "Contacted",
  qualified:   "Qualified",
  closed_won:  "Won",
  closed_lost: "Lost",
};

export default async function DemoRequestsPage() {
  const admin = createAdminClient();

  const { data: requests, error } = await admin
    .from("demo_requests")
    .select("id, name, email, job_title, org_name, org_type, staff_count, country, message, status, notes, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const total     = requests?.length ?? 0;
  const newCount  = requests?.filter((r) => r.status === "new").length ?? 0;
  const wonCount  = requests?.filter((r) => r.status === "closed_won").length ?? 0;

  // Group by status for pipeline view
  const pipeline: Record<string, typeof requests> = {};
  for (const r of requests ?? []) {
    if (!pipeline[r.status]) pipeline[r.status] = [];
    pipeline[r.status]!.push(r);
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Demo Requests</h1>
          <p className="text-sm text-[#64748b] mt-1">Enterprise leads from /request-demo. DB is source of truth — email is secondary.</p>
        </div>
        <a
          href="/api/admin/demo-requests/export"
          className="text-sm font-medium text-white bg-[#1a56a0] hover:bg-[#1547a0] px-4 py-2 rounded-lg transition-colors"
        >
          Export CSV ({total})
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Total requests</p>
          <p className="text-3xl font-bold text-[#1a56a0]">{total}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Needs follow-up</p>
          <p className={`text-3xl font-bold ${newCount > 0 ? "text-[#d97706]" : "text-[#16a34a]"}`}>{newCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Won</p>
          <p className="text-3xl font-bold text-[#16a34a]">{wonCount}</p>
        </div>
      </div>

      {error && (
        <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-sm px-4 py-3 rounded-lg mb-6">
          Failed to load demo requests: {error.message}
        </div>
      )}

      {total === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <p className="text-[#64748b] text-sm">No demo requests yet. Share /request-demo with clinic directors and hospital HR contacts.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">Organisation</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">Size</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">Country</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {requests?.map((r) => (
                <tr key={r.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#111]">{r.name}</p>
                    <p className="text-xs text-[#64748b]">{r.job_title}</p>
                    <a href={`mailto:${r.email}`} className="text-xs text-[#1a56a0] hover:underline">{r.email}</a>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#374151]">{r.org_name}</p>
                    <p className="text-xs text-[#64748b]">{r.org_type}</p>
                  </td>
                  <td className="px-4 py-3 text-[#374151] text-xs font-medium">{r.staff_count} staff</td>
                  <td className="px-4 py-3 text-[#374151] text-xs">{r.country}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status] ?? "bg-[#f1f5f9] text-[#64748b]"}`}>
                      {STATUS_LABELS[r.status] ?? r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#64748b] text-xs whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {total >= 200 && (
            <div className="px-4 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
              <p className="text-xs text-[#64748b]">Showing first 200 requests. Export CSV for the full list.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

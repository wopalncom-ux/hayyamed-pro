import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function WaitlistPage() {
  const admin = createAdminClient();

  const { data: signups, error } = await admin
    .from("waitlist_signups")
    .select("id, email, profession, country, source, created_at, notified")
    .order("created_at", { ascending: false })
    .limit(500);

  const total = signups?.length ?? 0;
  const notified = signups?.filter((s) => s.notified).length ?? 0;
  const pending = total - notified;

  // Build CSV string for client-side download
  const csvRows = [
    ["Email", "Profession", "Country", "Source", "Signed Up", "Notified"],
    ...(signups ?? []).map((s) => [
      s.email,
      s.profession ?? "",
      s.country ?? "",
      s.source ?? "",
      new Date(s.created_at).toISOString(),
      s.notified ? "Yes" : "No",
    ]),
  ];
  const csv = csvRows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Waitlist Signups</h1>
          <p className="text-sm text-[#64748b] mt-1">Pre-launch email leads from the coming-soon page.</p>
        </div>
        <WaitlistCsvButton csv={csv} total={total} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Total</p>
          <p className="text-3xl font-bold text-[#1a56a0]">{total}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Pending notification</p>
          <p className={`text-3xl font-bold ${pending > 0 ? "text-[#d97706]" : "text-[#16a34a]"}`}>{pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Notified</p>
          <p className="text-3xl font-bold text-[#16a34a]">{notified}</p>
        </div>
      </div>

      {error && (
        <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-sm px-4 py-3 rounded-lg mb-6">
          Failed to load waitlist: {error.message}
        </div>
      )}

      {total === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <p className="text-[#64748b] text-sm">No signups yet. Share the coming-soon page to start collecting leads.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">Profession</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">Country</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">Source</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">Signed Up</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide">Notified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {signups?.map((s) => (
                <tr key={s.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#111]">{s.email}</td>
                  <td className="px-4 py-3 text-[#374151]">{s.profession ?? <span className="text-[#94a3b8]">—</span>}</td>
                  <td className="px-4 py-3 text-[#374151]">{s.country ?? <span className="text-[#94a3b8]">—</span>}</td>
                  <td className="px-4 py-3 text-[#64748b] text-xs">{s.source ?? "—"}</td>
                  <td className="px-4 py-3 text-[#64748b] text-xs">{new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-4 py-3">
                    {s.notified
                      ? <span className="text-xs text-[#16a34a] font-medium">Sent</span>
                      : <span className="text-xs text-[#d97706] font-medium">Pending</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {total >= 500 && (
            <div className="px-4 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
              <p className="text-xs text-[#64748b]">Showing first 500 signups. Export CSV for the full list.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function WaitlistCsvButton({ csv, total }: { csv: string; total: number }) {
  if (total === 0) return null;
  return (
    <form action="/api/admin/waitlist/export" method="GET">
      <button
        type="submit"
        className="text-sm font-medium text-white bg-[#1a56a0] hover:bg-[#1547a0] px-4 py-2 rounded-lg transition-colors"
      >
        Export CSV ({total})
      </button>
    </form>
  );
}

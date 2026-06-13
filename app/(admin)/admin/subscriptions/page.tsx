import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

type SubRow = {
  id: string;
  plan: string;
  status: string;
  billing_interval: string | null;
  employer_tier: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  professional_profiles: { full_name: string | null; email: string | null; profession: string | null } | null;
};

const STATUS_COLOR: Record<string, string> = {
  active:     "bg-[#dcfce7] text-[#16a34a]",
  trialing:   "bg-[#e8f0fe] text-[#1a56a0]",
  past_due:   "bg-[#fff7ed] text-[#d97706]",
  canceled:   "bg-[#f1f5f9] text-[#64748b]",
  incomplete: "bg-[#fef2f2] text-[#dc2626]",
};

const PAGE_SIZE = 50;

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { page: pageStr, status: statusFilter } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const admin = createAdminClient();

  let rowsQuery = admin
    .from("subscriptions")
    .select(`
      id, plan, status, billing_interval, employer_tier,
      current_period_end, cancel_at_period_end, created_at,
      professional_profiles!professional_id ( full_name, email, profession )
    `)
    .neq("plan", "free")
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  let countQuery = admin
    .from("subscriptions")
    .select("id", { count: "exact", head: true })
    .neq("plan", "free");

  if (statusFilter) {
    rowsQuery = rowsQuery.eq("status", statusFilter);
    countQuery = countQuery.eq("status", statusFilter);
  }

  const [subsRes, countRes, proRes, empRes, pastDueRes] = await Promise.all([
    rowsQuery,
    countQuery,
    admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("plan", "pro").eq("status", "active"),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("plan", "employer").eq("status", "active"),
    admin.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "past_due"),
  ]);

  const rows = (subsRes.data ?? []) as unknown as SubRow[];
  const total = countRes.count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    params.set("page", String(p));
    return `/admin/subscriptions?${params.toString()}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Subscriptions</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {statusFilter ? `Filtered by: ${statusFilter}` : "All active and historical paid subscriptions."}
          </p>
        </div>
        <a href="/admin" className="text-sm text-[#1a56a0] hover:underline">← Back to admin</a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pro — Active"     value={proRes.count ?? 0}    color="blue" />
        <StatCard label="Employer — Active" value={empRes.count ?? 0}   color="green" />
        <StatCard label="Past Due"          value={pastDueRes.count ?? 0} color="orange" />
        <StatCard label="Total Paid"        value={(proRes.count ?? 0) + (empRes.count ?? 0)} color="blue" />
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {["", "active", "trialing", "past_due", "canceled"].map((s) => (
          <a
            key={s || "all"}
            href={s ? `/admin/subscriptions?status=${s}` : "/admin/subscriptions"}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              (statusFilter ?? "") === s
                ? "bg-[#1a56a0] border-[#1a56a0] text-white"
                : "bg-white border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc]"
            }`}
          >
            {s || "All"}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Member</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Plan</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Tier</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Interval</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Renews</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {!rows.length && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#94a3b8]">
                  No paid subscriptions yet.
                </td>
              </tr>
            )}
            {rows.map((s) => (
              <tr key={s.id} className="hover:bg-[#f8fafc]">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#111]">{s.professional_profiles?.full_name ?? "—"}</p>
                  <p className="text-xs text-[#64748b]">{s.professional_profiles?.email ?? ""}</p>
                  {s.professional_profiles?.profession && (
                    <p className="text-xs text-[#94a3b8]">{s.professional_profiles.profession}</p>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold text-[#111] capitalize">{s.plan}</td>
                <td className="px-4 py-3 text-[#64748b] capitalize">{s.employer_tier ?? "—"}</td>
                <td className="px-4 py-3 text-[#64748b] capitalize">{s.billing_interval ?? "annual"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[s.status] ?? "bg-[#f1f5f9] text-[#64748b]"}`}>
                    {s.status}{s.cancel_at_period_end ? " (canceling)" : ""}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#64748b]">
                  {s.current_period_end
                    ? new Date(s.current_period_end).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                    : "—"}
                </td>
                <td className="px-4 py-3 text-[#64748b]">
                  {new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#e2e8f0]">
            <p className="text-xs text-[#64748b]">
              Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              {page > 1 && (
                <Link href={pageHref(page - 1)} className="text-xs px-3 py-1.5 rounded-lg border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc] transition-colors">
                  ← Prev
                </Link>
              )}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <Link
                    key={p}
                    href={pageHref(p)}
                    className={`text-xs w-8 h-7 flex items-center justify-center rounded-lg border transition-colors ${
                      p === page
                        ? "bg-[#1a56a0] border-[#1a56a0] text-white font-semibold"
                        : "border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc]"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
              {page < totalPages && (
                <Link href={pageHref(page + 1)} className="text-xs px-3 py-1.5 rounded-lg border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc] transition-colors">
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: "blue" | "green" | "orange" }) {
  const c = { blue: "text-[#1a56a0]", green: "text-[#16a34a]", orange: "text-[#d97706]" }[color];
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
      <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold ${c}`}>{value}</p>
    </div>
  );
}

import { createAdminClient } from "@/lib/supabase/server";
import { isQPayConfigured } from "@/lib/qpay";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "QPay Invoices — Admin" };

const STATUS_STYLES: Record<string, string> = {
  paid:      "bg-green-50 text-green-700 border-green-200",
  pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  expired:   "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]",
};

const PLAN_LABELS: Record<string, string> = {
  pro: "Pro",
  employer: "Employer",
};

const PAGE_SIZE = 50;

export default async function AdminQPayInvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status = "all", page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page, 10));
  const admin = createAdminClient();

  // ── Stats ──────────────────────────────────────────────────────────────────
  const [paidRes, pendingRes, expiredRes] = await Promise.all([
    admin.from("qpay_invoices").select("amount_qar").eq("status", "paid"),
    admin.from("qpay_invoices").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("qpay_invoices").select("id", { count: "exact", head: true }).eq("status", "expired"),
  ]);

  const totalRevenueQAR = (paidRes.data ?? []).reduce((s, i) => s + Number(i.amount_qar), 0);
  const paidCount = (paidRes.data ?? []).length;
  const pendingCount = pendingRes.count ?? 0;
  const expiredCount = expiredRes.count ?? 0;

  // ── Invoices ───────────────────────────────────────────────────────────────
  let invoicesQuery = admin
    .from("qpay_invoices")
    .select("id, invoice_id, invoice_number, plan, billing_interval, amount_qar, status, paid_at, created_at, professional_id", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE - 1);

  if (status !== "all") invoicesQuery = invoicesQuery.eq("status", status);

  const { data: invoices, count } = await invoicesQuery;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  // ── Fetch professional names ───────────────────────────────────────────────
  const professionalIds = [...new Set((invoices ?? []).map((i) => i.professional_id))];
  const profileMap: Record<string, { full_name: string | null; email: string | null }> = {};

  if (professionalIds.length > 0) {
    const { data: profiles } = await admin
      .from("professional_profiles")
      .select("auth_id, full_name, email")
      .in("auth_id", professionalIds);
    for (const p of profiles ?? []) {
      profileMap[p.auth_id] = { full_name: p.full_name, email: p.email };
    }
  }

  const statusOptions = ["all", "paid", "pending", "expired", "cancelled"];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">QPay Invoices</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Qatar national payment gateway — invoice lifecycle and revenue
          {!isQPayConfigured() && (
            <span className="ml-2 text-yellow-600 font-medium">(credentials not configured)</span>
          )}
        </p>
      </div>

      {/* Revenue stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Revenue" value={`QAR ${totalRevenueQAR.toLocaleString()}`} sub={`${paidCount} paid invoices`} color="green" />
        <StatCard label="Pending Payment" value={String(pendingCount)} sub="awaiting QPay scan" color="yellow" />
        <StatCard label="Expired" value={String(expiredCount)} sub="customer did not pay" color="red" />
        <StatCard label="Total Invoices" value={String(count ?? 0)} sub="all time" color="blue" />
      </div>

      {/* Filter tabs */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        <div className="flex gap-0 border-b border-[#e2e8f0] px-4 overflow-x-auto">
          {statusOptions.map((s) => (
            <a
              key={s}
              href={`?status=${s}&page=1`}
              className={`py-3 px-4 text-sm border-b-2 whitespace-nowrap capitalize transition-colors ${
                status === s
                  ? "border-[#1a56a0] text-[#1a56a0] font-medium"
                  : "border-transparent text-[#64748b] hover:text-[#111]"
              }`}
            >
              {s === "all" ? "All" : s}
            </a>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                <th className="text-left px-4 py-3 text-xs text-[#64748b] font-medium">Invoice #</th>
                <th className="text-left px-4 py-3 text-xs text-[#64748b] font-medium">Professional</th>
                <th className="text-left px-4 py-3 text-xs text-[#64748b] font-medium">Plan</th>
                <th className="text-right px-4 py-3 text-xs text-[#64748b] font-medium">Amount</th>
                <th className="text-left px-4 py-3 text-xs text-[#64748b] font-medium">Status</th>
                <th className="text-left px-4 py-3 text-xs text-[#64748b] font-medium">Paid At</th>
                <th className="text-left px-4 py-3 text-xs text-[#64748b] font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {(invoices ?? []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-[#64748b]">
                    No invoices found
                  </td>
                </tr>
              ) : (
                (invoices ?? []).map((inv) => {
                  const profile = profileMap[inv.professional_id];
                  return (
                    <tr key={inv.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[#374151]">
                        {inv.invoice_number}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[#111] font-medium text-xs">{profile?.full_name ?? "—"}</p>
                        <p className="text-[#94a3b8] text-xs">{profile?.email ?? inv.professional_id.slice(0, 8) + "…"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-[#374151]">
                          {PLAN_LABELS[inv.plan] ?? inv.plan}
                        </span>
                        <span className="text-xs text-[#94a3b8] ml-1 capitalize">{inv.billing_interval}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-[#111]">
                        QAR {Number(inv.amount_qar).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_STYLES[inv.status] ?? ""}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#64748b]">
                        {inv.paid_at ? new Date(inv.paid_at).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#64748b]">
                        {new Date(inv.created_at).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#e2e8f0]">
            <p className="text-xs text-[#64748b]">
              Page {pageNum} of {totalPages} — {count} total
            </p>
            <div className="flex gap-2">
              {pageNum > 1 && (
                <a
                  href={`?status=${status}&page=${pageNum - 1}`}
                  className="px-3 py-1.5 text-xs border border-[#e2e8f0] rounded-lg text-[#374151] hover:bg-[#f8fafc]"
                >
                  Previous
                </a>
              )}
              {pageNum < totalPages && (
                <a
                  href={`?status=${status}&page=${pageNum + 1}`}
                  className="px-3 py-1.5 text-xs bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0]"
                >
                  Next
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: "green" | "yellow" | "red" | "blue";
}) {
  const colorClass = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
    blue: "text-[#1a56a0]",
  }[color];

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-4">
      <p className="text-xs text-[#64748b] mb-1">{label}</p>
      <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
      <p className="text-xs text-[#94a3b8] mt-0.5">{sub}</p>
    </div>
  );
}

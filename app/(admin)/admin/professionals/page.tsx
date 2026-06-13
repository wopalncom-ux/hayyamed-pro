import { createAdminClient } from "@/lib/supabase/server";
import PlanOverrideButton from "@/components/admin/PlanOverrideButton";
import TrialExtendButton from "@/components/admin/TrialExtendButton";
import Link from "next/link";

const PAGE_SIZE = 50;

export default async function AdminProfessionalsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const admin = createAdminClient();

  const searchTerm = q?.trim() ?? "";
  const isEmailSearch = searchTerm.includes("@");

  let countQuery = admin
    .from("professional_profiles")
    .select("id", { count: "exact", head: true });
  let profilesQuery = admin
    .from("professional_profiles")
    .select("id, auth_id, full_name, profession, specialty, license_number, licensing_authority, license_expiry, onboarding_complete, profile_completion_pct, pro_trial_ends_at, created_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (searchTerm) {
    const filter = `%${searchTerm}%`;
    if (isEmailSearch) {
      profilesQuery = profilesQuery.ilike("email", filter);
      countQuery = countQuery.ilike("email", filter);
    } else {
      profilesQuery = profilesQuery.ilike("full_name", filter);
      countQuery = countQuery.ilike("full_name", filter);
    }
  }

  const [profilesRes, countRes, subsRes] = await Promise.all([
    profilesQuery,
    countQuery,
    admin.from("subscriptions").select("professional_id, plan, employer_tier, status"),
  ]);

  const profiles = profilesRes.data ?? [];
  const total = countRes.count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const subMap = Object.fromEntries(
    (subsRes.data ?? []).map((s) => [s.professional_id, s])
  );

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(p));
    return `/admin/professionals?${params.toString()}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Professionals</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {q
              ? `${total} result${total !== 1 ? "s" : ""} for "${q}"`
              : `${total} registered`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/export/professionals"
            className="text-sm font-semibold px-4 py-2 rounded-lg border border-[#e2e8f0] bg-white text-[#374151] hover:bg-[#f8fafc] transition-colors"
          >
            Export CSV
          </a>
          <a href="/admin" className="text-sm text-[#1a56a0] hover:underline">← Back to admin</a>
        </div>
      </div>

      <form method="GET" action="/admin/professionals" className="mb-4 flex gap-2">
        <input
          name="q"
          type="search"
          defaultValue={q ?? ""}
          placeholder="Search by name or email…"
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
            href="/admin/professionals"
            className="text-sm px-4 py-2 rounded-lg bg-[#f1f5f9] text-[#374151] hover:bg-[#e2e8f0] transition-colors"
          >
            Clear
          </a>
        )}
      </form>

      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Profession</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Specialty</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">License</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Complete</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Onboarding</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase">Trial</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-[#64748b]">No professionals yet.</td>
                </tr>
              )}
              {profiles.map((p) => {
                const daysToExpiry = p.license_expiry
                  ? Math.ceil((new Date(p.license_expiry).getTime() - Date.now()) / 86400000)
                  : null;
                const sub = subMap[p.auth_id];
                return (
                  <tr key={p.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3 font-medium text-[#111] max-w-[160px] truncate">{p.full_name ?? "—"}</td>
                    <td className="px-4 py-3 text-[#64748b]">{p.profession ?? "—"}</td>
                    <td className="px-4 py-3 text-[#64748b]">{p.specialty ?? "—"}</td>
                    <td className="px-4 py-3">
                      {daysToExpiry !== null ? (
                        <span className={`text-xs font-medium ${
                          daysToExpiry < 30 ? "text-[#dc2626]" : daysToExpiry < 90 ? "text-[#d97706]" : "text-[#16a34a]"
                        }`}>{daysToExpiry}d</span>
                      ) : <span className="text-xs text-[#94a3b8]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#64748b]">{p.profile_completion_pct ?? 0}%</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.onboarding_complete ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fff7ed] text-[#d97706]"
                      }`}>
                        {p.onboarding_complete ? "Complete" : "In progress"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <PlanOverrideButton authId={p.auth_id} currentPlan={sub?.plan ?? "free"} />
                    </td>
                    <td className="px-4 py-3">
                      <TrialExtendButton authId={p.auth_id} currentTrialEnd={p.pro_trial_ends_at ?? null} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/professionals/${p.auth_id}`}
                        className="text-xs text-[#1a56a0] hover:underline whitespace-nowrap"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#e2e8f0]">
            <p className="text-xs text-[#64748b]">
              Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex items-center gap-1">
              {page > 1 && (
                <Link
                  href={pageHref(page - 1)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc] transition-colors"
                >
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
                <Link
                  href={pageHref(page + 1)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc] transition-colors"
                >
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

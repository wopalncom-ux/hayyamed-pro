import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CmeActivityActions from "@/components/admin/CmeActivityActions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CME Verification Queue — Admin",
  robots: { index: false },
};

const PAGE_SIZE = 30;

export default async function CmeVerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: adminMember } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();
  if (!adminMember) redirect("/dashboard");

  const sp = await searchParams;
  const page = Math.max(0, parseInt(sp.page ?? "0", 10));
  const statusFilter = sp.status ?? "pending";

  const [activitiesRes, countRes] = await Promise.all([
    admin
      .from("cme_activities")
      .select("id, professional_id, title, activity_date, credits, certificate_url, created_at, rejection_reason, verification_status")
      .eq("verification_status", statusFilter)
      .order("created_at", { ascending: true })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1),
    admin
      .from("cme_activities")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", statusFilter),
  ]);

  const activities = activitiesRes.data ?? [];
  const total = countRes.count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const profIds = [...new Set(activities.map((a) => a.professional_id))];
  const { data: profiles } = profIds.length
    ? await admin
        .from("professional_profiles")
        .select("auth_id, full_name, profession, specialty")
        .in("auth_id", profIds)
    : { data: [] };
  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.auth_id, p]));

  const STATUS_TABS = [
    { value: "pending",  label: "Pending" },
    { value: "verified", label: "Verified" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111] tracking-tight">CME Verification Queue</h1>
        <p className="text-sm text-[#64748b] mt-1">
          {total} {statusFilter} activit{total === 1 ? "y" : "ies"}
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-1">
        {STATUS_TABS.map(({ value, label }) => (
          <a
            key={value}
            href={`?status=${value}`}
            className={`flex-1 text-center text-sm font-medium py-2 rounded-lg transition-colors ${
              statusFilter === value
                ? "bg-white shadow-sm text-[#111]"
                : "text-[#64748b] hover:text-[#111]"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {activities.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <p className="text-sm font-semibold text-[#374151]">Queue is empty</p>
          <p className="text-xs text-[#64748b] mt-1">No {statusFilter} activities to review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((act) => {
            const profile = profileMap[act.professional_id];
            return (
              <div key={act.id} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-[#111] truncate">{act.title}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748b]">
                      <span>{profile?.full_name ?? act.professional_id}</span>
                      {profile?.profession && (
                        <>
                          <span className="text-[#d1d5db]">·</span>
                          <span>{profile.profession}{profile.specialty ? ` — ${profile.specialty}` : ""}</span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748b]">
                      {act.activity_date && (
                        <span>
                          {new Date(act.activity_date).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      )}
                      {act.credits != null && (
                        <>
                          <span className="text-[#d1d5db]">·</span>
                          <span>{act.credits} credits claimed</span>
                        </>
                      )}
                      <span className="text-[#d1d5db]">·</span>
                      <span>Submitted {new Date(act.created_at).toLocaleDateString("en-GB")}</span>
                    </div>
                    {act.rejection_reason && (
                      <p className="text-xs text-[#dc2626] mt-1">
                        Rejection reason: {act.rejection_reason}
                      </p>
                    )}
                    {act.certificate_url && (
                      <div className="mt-2">
                        <a
                          href={`/api/certificates?path=${encodeURIComponent(act.certificate_url)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#1a56a0] font-medium bg-[#eff6ff] px-2 py-1 rounded-md hover:bg-[#dbeafe] transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          View certificate
                        </a>
                      </div>
                    )}
                  </div>
                  <CmeActivityActions
                    activityId={act.id}
                    currentStatus={act.verification_status ?? "pending"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-[#64748b]">Page {page + 1} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 0 && (
              <a href={`?status=${statusFilter}&page=${page - 1}`}
                className="text-xs font-medium px-3 py-1.5 border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc] transition-colors">
                Previous
              </a>
            )}
            {page + 1 < totalPages && (
              <a href={`?status=${statusFilter}&page=${page + 1}`}
                className="text-xs font-medium px-3 py-1.5 border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc] transition-colors">
                Next
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

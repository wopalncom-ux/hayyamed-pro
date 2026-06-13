import { createAdminClient } from "@/lib/supabase/server";
import CmeActivityActions from "@/components/admin/CmeActivityActions";
import CertificateLink from "@/components/dashboard/CertificateLink";

const RESOLVED_LIMIT = 100;

export default async function AdminCmeActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const showAll = view === "all";

  const admin = createAdminClient();

  // Always fetch all pending (no limit — admins must action all of them)
  const pendingQuery = admin
    .from("cme_activities")
    .select("id, title, provider, activity_date, credits, verification_status, certificate_url, professional_id, created_at")
    .eq("verification_status", "pending")
    .order("created_at", { ascending: true });

  // Resolved: cap at RESOLVED_LIMIT unless "view=all"
  const resolvedQuery = admin
    .from("cme_activities")
    .select("id, title, provider, activity_date, credits, verification_status, professional_id, created_at")
    .neq("verification_status", "pending")
    .order("created_at", { ascending: false })
    .limit(showAll ? 1000 : RESOLVED_LIMIT);

  const [{ data: pending }, { data: resolvedRaw }, countRes] = await Promise.all([
    pendingQuery,
    resolvedQuery,
    admin
      .from("cme_activities")
      .select("id", { count: "exact", head: true })
      .neq("verification_status", "pending"),
  ]);

  const resolvedTotal = countRes.count ?? 0;
  const resolved = resolvedRaw ?? [];
  const pendingList = pending ?? [];

  // Fetch professional names for all visible activities
  const ids = [...new Set([...pendingList, ...resolved].map((a) => a.professional_id))];
  const { data: profiles } = ids.length
    ? await admin.from("professional_profiles").select("auth_id, full_name").in("auth_id", ids)
    : { data: [] };
  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.auth_id, p]));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">CME Activities</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {pendingList.length} pending · {resolvedTotal} resolved
          </p>
        </div>
        <a href="/admin" className="text-sm text-[#1a56a0] hover:underline">← Back to admin</a>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#111]">Pending Verification</h2>
          <p className="text-xs text-[#64748b] mt-0.5">Verifying an activity updates the professional&apos;s CME wallet credits automatically.</p>
        </div>
        {pendingList.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#64748b]">No pending activities.</div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {pendingList.map((a) => {
              const prof = profileMap[a.professional_id];
              return (
                <div key={a.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111]">{a.title}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      {prof?.full_name ?? "Unknown"} · {a.provider ?? "—"} · {a.activity_date} · <strong>{a.credits} credits</strong>
                    </p>
                    {a.certificate_url && (
                      <div className="mt-0.5">
                        <CertificateLink certificatePath={a.certificate_url} />
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <CmeActivityActions activityId={a.id} currentStatus={a.verification_status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolved */}
      {resolvedTotal > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0]">
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#111]">
              Resolved
              {!showAll && resolvedTotal > RESOLVED_LIMIT && (
                <span className="ml-2 text-xs font-normal text-[#64748b]">
                  (showing latest {RESOLVED_LIMIT} of {resolvedTotal})
                </span>
              )}
            </h2>
            {!showAll && resolvedTotal > RESOLVED_LIMIT && (
              <a href="?view=all" className="text-xs text-[#1a56a0] hover:underline">Show all {resolvedTotal}</a>
            )}
          </div>
          <div className="divide-y divide-[#e2e8f0]">
            {resolved.map((a) => {
              const prof = profileMap[a.professional_id];
              return (
                <div key={a.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#111]">{a.title}</p>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      {prof?.full_name ?? "Unknown"} · {a.credits} credits · {a.activity_date}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    a.verification_status === "verified"
                      ? "bg-[#dcfce7] text-[#16a34a]"
                      : "bg-[#fef2f2] text-[#dc2626]"
                  }`}>
                    {a.verification_status}
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

import { createAdminClient } from "@/lib/supabase/server";
import CmeActivityActions from "@/components/admin/CmeActivityActions";
import CertificateLink from "@/components/dashboard/CertificateLink";

export default async function AdminCmeActivitiesPage() {
  const admin = createAdminClient();

  const { data: activities } = await admin
    .from("cme_activities")
    .select("id, title, provider, activity_date, credits, verification_status, certificate_url, professional_id, created_at")
    .order("created_at", { ascending: false });

  const all = activities ?? [];
  const pending = all.filter((a) => a.verification_status === "pending");
  const resolved = all.filter((a) => a.verification_status !== "pending");

  // Fetch professional names
  const ids = all.map((a) => a.professional_id);
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
            {pending.length} pending · {resolved.length} resolved
          </p>
        </div>
        <a href="/admin" className="text-sm text-[#1a56a0] hover:underline">← Back to admin</a>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#111]">Pending Verification</h2>
          <p className="text-xs text-[#64748b] mt-0.5">Verifying an activity updates the professional's CME wallet credits automatically.</p>
        </div>
        {pending.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#64748b]">No pending activities.</div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {pending.map((a) => {
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
      {resolved.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0]">
          <div className="px-6 py-4 border-b border-[#e2e8f0]">
            <h2 className="text-base font-semibold text-[#111]">Resolved</h2>
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

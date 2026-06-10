import { createAdminClient } from "@/lib/supabase/server";

export default async function AdminProfessionalsPage() {
  const admin = createAdminClient();

  const { data: profiles } = await admin
    .from("professional_profiles")
    .select("id, auth_id, full_name, profession, specialty, license_number, licensing_authority, license_expiry, onboarding_complete, profile_completion_pct, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Professionals</h1>
          <p className="text-sm text-[#64748b] mt-1">{profiles?.length ?? 0} registered</p>
        </div>
        <a href="/admin" className="text-sm text-[#1a56a0] hover:underline">← Back to admin</a>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="grid grid-cols-12 px-6 py-3 border-b border-[#e2e8f0] text-xs font-medium text-[#64748b] uppercase tracking-wide">
          <span className="col-span-3">Name</span>
          <span className="col-span-2">Profession</span>
          <span className="col-span-2">Specialty</span>
          <span className="col-span-2">License</span>
          <span className="col-span-1">Complete</span>
          <span className="col-span-2">Onboarding</span>
        </div>
        {!profiles || profiles.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#64748b]">No professionals yet.</div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {profiles.map((p) => {
              const daysToExpiry = p.license_expiry
                ? Math.ceil((new Date(p.license_expiry).getTime() - Date.now()) / 86400000)
                : null;
              return (
                <div key={p.id} className="grid grid-cols-12 px-6 py-3 items-center">
                  <p className="col-span-3 text-sm font-medium text-[#111] truncate">
                    {p.full_name ?? "—"}
                  </p>
                  <p className="col-span-2 text-sm text-[#64748b] truncate">{p.profession ?? "—"}</p>
                  <p className="col-span-2 text-sm text-[#64748b] truncate">{p.specialty ?? "—"}</p>
                  <div className="col-span-2">
                    {daysToExpiry !== null ? (
                      <span className={`text-xs font-medium ${
                        daysToExpiry < 30 ? "text-[#dc2626]" : daysToExpiry < 90 ? "text-[#d97706]" : "text-[#16a34a]"
                      }`}>
                        {daysToExpiry}d
                      </span>
                    ) : (
                      <span className="text-xs text-[#94a3b8]">—</span>
                    )}
                  </div>
                  <div className="col-span-1">
                    <span className="text-xs text-[#64748b]">{p.profile_completion_pct}%</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.onboarding_complete
                        ? "bg-[#dcfce7] text-[#16a34a]"
                        : "bg-[#fff7ed] text-[#d97706]"
                    }`}>
                      {p.onboarding_complete ? "Complete" : "In progress"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

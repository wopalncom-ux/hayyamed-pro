import { createAdminClient } from "@/lib/supabase/server";
import ProviderActions from "@/components/admin/ProviderActions";

export const metadata = { title: "Training Providers — Admin" };

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#fff7ed] text-[#d97706]",
  active: "bg-[#dcfce7] text-[#16a34a]",
  suspended: "bg-[#fef2f2] text-[#dc2626]",
};

export default async function AdminTrainingProvidersPage() {
  const admin = createAdminClient();

  const { data: providers } = await admin
    .from("training_providers")
    .select("id, name, country_code, is_accredited, accreditor, contact_email, status, created_at, created_by")
    .order("created_at", { ascending: false });

  const allProviders = providers ?? [];
  const pending = allProviders.filter((p) => p.status === "pending");
  const active = allProviders.filter((p) => p.status === "active");
  const suspended = allProviders.filter((p) => p.status === "suspended");

  // Course counts per provider
  const providerIds = allProviders.map((p) => p.id);
  const courseCounts: Record<string, number> = {};
  if (providerIds.length > 0) {
    const { data: courses } = await admin
      .from("courses")
      .select("provider_id")
      .in("provider_id", providerIds);
    (courses ?? []).forEach((c) => {
      courseCounts[c.provider_id] = (courseCounts[c.provider_id] ?? 0) + 1;
    });
  }

  function ProviderRow({ p }: { p: typeof allProviders[0] }) {
    return (
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[#111]">{p.name}</p>
            {p.is_accredited && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#dcfce7] text-[#16a34a] font-medium">
                Accredited
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-[#64748b]">{p.country_code}</p>
            {p.accreditor && <><span className="text-xs text-[#94a3b8]">·</span><p className="text-xs text-[#64748b]">{p.accreditor}</p></>}
            {p.contact_email && <><span className="text-xs text-[#94a3b8]">·</span><p className="text-xs text-[#64748b]">{p.contact_email}</p></>}
          </div>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            {courseCounts[p.id] ?? 0} courses · Registered {new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[p.status]}`}>
            {p.status}
          </span>
          <ProviderActions providerId={p.id} status={p.status} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Training Providers</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {pending.length} pending · {active.length} active · {suspended.length} suspended
          </p>
        </div>
        <a href="/admin" className="text-sm text-[#1a56a0] hover:underline">← Back to admin</a>
      </div>

      {pending.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#111]">Pending Approval</h2>
            <span className="text-xs bg-[#fff7ed] text-[#d97706] font-medium px-2 py-0.5 rounded-full">{pending.length}</span>
          </div>
          <div className="divide-y divide-[#e2e8f0]">
            {pending.map((p) => <ProviderRow key={p.id} p={p} />)}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#111]">Active Providers</h2>
        </div>
        {active.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#64748b]">No active providers yet.</div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {active.map((p) => <ProviderRow key={p.id} p={p} />)}
          </div>
        )}
      </div>

      {suspended.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0]">
          <div className="px-6 py-4 border-b border-[#e2e8f0]">
            <h2 className="text-base font-semibold text-[#111]">Suspended</h2>
          </div>
          <div className="divide-y divide-[#e2e8f0]">
            {suspended.map((p) => <ProviderRow key={p.id} p={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import PlanOverrideButton from "@/components/admin/PlanOverrideButton";
import TrialExtendButton from "@/components/admin/TrialExtendButton";

export default async function AdminProfessionalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();

  const [profileRes, walletRes, subsRes, activitiesRes, auditRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("*")
      .eq("auth_id", id)
      .single(),
    admin.from("cme_wallets")
      .select("*")
      .eq("professional_id", id)
      .maybeSingle(),
    admin.from("subscriptions")
      .select("*")
      .eq("professional_id", id)
      .order("created_at", { ascending: false }),
    admin.from("cme_activities")
      .select("id, title, provider, activity_date, credits, verification_status, created_at")
      .eq("professional_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
    admin.from("audit_logs")
      .select("id, action, metadata, created_at")
      .eq("actor_auth_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  if (profileRes.error || !profileRes.data) notFound();

  const profile = profileRes.data;
  const email = profile.email ?? "—";
  const wallet = walletRes.data;
  const subs = subsRes.data ?? [];
  const activities = activitiesRes.data ?? [];
  const auditLogs = auditRes.data ?? [];
  const activeSub = subs.find((s) => s.status === "active" || s.status === "trialing");

  const daysToExpiry = profile.license_expiry
    ? Math.ceil((new Date(profile.license_expiry).getTime() - Date.now()) / 86400000)
    : null;

  const completionPct = profile.profile_completion_pct ?? 0;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/admin/professionals" className="text-sm text-[#1a56a0] hover:underline">
              ← Professionals
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-[#111]">{profile.full_name ?? "Unknown"}</h1>
          <p className="text-sm text-[#64748b] mt-1">{email}</p>
        </div>
        <div className="flex items-center gap-3">
          <PlanOverrideButton authId={id} currentPlan={activeSub?.plan ?? "free"} />
          <TrialExtendButton authId={id} currentTrialEnd={profile.pro_trial_ends_at ?? null} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — profile + wallet */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile details */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <h2 className="text-sm font-semibold text-[#111] uppercase tracking-wide mb-4">Profile</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Auth ID" value={id.slice(0, 8) + "…"} />
              <Field label="Email" value={email} />
              <Field label="Full name" value={profile.full_name} />
              <Field label="Profession" value={profile.profession} />
              <Field label="Specialty" value={profile.specialty} />
              <Field label="Country" value={profile.country} />
              <Field label="City" value={profile.city} />
              <Field label="Licensing authority" value={profile.licensing_authority} />
              <Field label="License number" value={profile.license_number} />
              <Field
                label="License expiry"
                value={
                  profile.license_expiry
                    ? `${new Date(profile.license_expiry).toLocaleDateString("en-GB")}${
                        daysToExpiry !== null
                          ? ` (${daysToExpiry >= 0 ? `${daysToExpiry}d remaining` : "EXPIRED"})`
                          : ""
                      }`
                    : null
                }
                warn={daysToExpiry !== null && daysToExpiry < 30}
              />
              <Field
                label="Onboarding"
                value={profile.onboarding_complete ? "Complete" : `Step ${profile.onboarding_step ?? 1} of 7`}
              />
              <Field label="Profile completion" value={`${completionPct}%`} />
              <Field
                label="Registered"
                value={new Date(profile.created_at).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              />
            </div>
          </div>

          {/* CME wallet */}
          {wallet && (
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
              <h2 className="text-sm font-semibold text-[#111] uppercase tracking-wide mb-4">CME Wallet</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Field label="Status" value={wallet.compliance_status} />
                <Field label="Country" value={wallet.country_code} />
                <Field label="Credits completed" value={String(wallet.completed_credits ?? 0)} />
                <Field label="Credits required" value={String(wallet.required_credits ?? 0)} />
                <Field label="Cycle start" value={wallet.cycle_start_date ? new Date(wallet.cycle_start_date).toLocaleDateString("en-GB") : null} />
                <Field label="Cycle end" value={wallet.cycle_end_date ? new Date(wallet.cycle_end_date).toLocaleDateString("en-GB") : null} />
              </div>
              {/* Progress bar */}
              {wallet.required_credits > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-[#64748b] mb-1">
                    <span>Progress</span>
                    <span>{Math.min(100, Math.round(((wallet.completed_credits ?? 0) / wallet.required_credits) * 100))}%</span>
                  </div>
                  <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1a56a0] rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((wallet.completed_credits ?? 0) / wallet.required_credits) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CME activities */}
          <div className="bg-white rounded-xl border border-[#e2e8f0]">
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#111] uppercase tracking-wide">CME Activities (recent 20)</h2>
            </div>
            {activities.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-[#94a3b8]">No activities yet.</div>
            ) : (
              <div className="divide-y divide-[#f1f5f9]">
                {activities.map((a) => (
                  <div key={a.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#111]">{a.title}</p>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        {a.provider ?? "—"} · {a.activity_date} · {a.credits} credits
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      a.verification_status === "verified"
                        ? "bg-[#dcfce7] text-[#16a34a]"
                        : a.verification_status === "rejected"
                        ? "bg-[#fef2f2] text-[#dc2626]"
                        : "bg-[#fff7ed] text-[#d97706]"
                    }`}>
                      {a.verification_status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column — subscription + audit */}
        <div className="space-y-6">

          {/* Subscription */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <h2 className="text-sm font-semibold text-[#111] uppercase tracking-wide mb-4">Subscription</h2>
            {subs.length === 0 ? (
              <p className="text-sm text-[#94a3b8]">Free plan</p>
            ) : (
              <div className="space-y-3">
                {subs.map((s, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${s.status === "active" || s.status === "trialing" ? "border-[#bbf7d0] bg-[#f0fdf4]" : "border-[#e2e8f0] bg-[#f8fafc]"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold capitalize text-[#111]">{s.plan}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        s.status === "active" ? "bg-[#dcfce7] text-[#16a34a]"
                        : s.status === "trialing" ? "bg-[#e8f0fe] text-[#1a56a0]"
                        : "bg-[#f1f5f9] text-[#64748b]"
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    {s.employer_tier && <p className="text-xs text-[#64748b]">Tier: {s.employer_tier}</p>}
                    {s.billing_interval && <p className="text-xs text-[#64748b]">Interval: {s.billing_interval}</p>}
                    {s.current_period_end && (
                      <p className="text-xs text-[#64748b]">
                        Renews: {new Date(s.current_period_end).toLocaleDateString("en-GB")}
                      </p>
                    )}
                    {s.cancel_at_period_end && (
                      <p className="text-xs text-[#d97706] mt-1">Canceling at period end</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Trial info */}
            {profile.pro_trial_ends_at && (
              <div className="mt-4 p-3 rounded-lg bg-[#f0f7ff] border border-[#bfdbfe]">
                <p className="text-xs font-medium text-[#1a56a0]">Trial period</p>
                <p className="text-xs text-[#64748b] mt-0.5">
                  Ends: {new Date(profile.pro_trial_ends_at).toLocaleDateString("en-GB")}
                  {" "}({
                    Math.ceil((new Date(profile.pro_trial_ends_at).getTime() - Date.now()) / 86400000)
                  }d remaining)
                </p>
              </div>
            )}
          </div>

          {/* Recent audit */}
          <div className="bg-white rounded-xl border border-[#e2e8f0]">
            <div className="px-5 py-4 border-b border-[#e2e8f0]">
              <h2 className="text-sm font-semibold text-[#111] uppercase tracking-wide">Recent Activity</h2>
            </div>
            {auditLogs.length === 0 ? (
              <div className="px-5 py-6 text-center text-xs text-[#94a3b8]">No audit records.</div>
            ) : (
              <div className="divide-y divide-[#f1f5f9]">
                {auditLogs.map((log) => (
                  <div key={log.id} className="px-5 py-3">
                    <p className="text-xs font-mono text-[#374151]">{log.action}</p>
                    <p className="text-[10px] text-[#94a3b8] mt-0.5">
                      {new Date(log.created_at).toLocaleString("en-GB", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="px-5 py-3 border-t border-[#f1f5f9]">
              <Link
                href={`/admin/audit-logs?action=&days=0`}
                className="text-xs text-[#1a56a0] hover:underline"
              >
                View full audit log →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, warn }: { label: string; value: string | null | undefined; warn?: boolean }) {
  return (
    <div>
      <p className="text-xs text-[#94a3b8] mb-0.5">{label}</p>
      <p className={`text-sm ${warn ? "text-[#d97706] font-medium" : "text-[#374151]"}`}>
        {value ?? <span className="text-[#94a3b8]">—</span>}
      </p>
    </div>
  );
}

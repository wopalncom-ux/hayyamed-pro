import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import PlanOverrideButton from "@/components/admin/PlanOverrideButton";
import TrialExtendButton from "@/components/admin/TrialExtendButton";
import SuspendAccountButton from "@/components/admin/SuspendAccountButton";
import { ActivitiesSection } from "./ActivitiesSection";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const admin = createAdminClient();
  const { data } = await admin.from("professional_profiles").select("full_name").eq("auth_id", id).maybeSingle();
  return { title: data?.full_name ? `${data.full_name} — Professional` : "Professional Detail" };
}

export default async function AdminProfessionalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();

  const [profileRes, walletsRes, subsRes, activitiesRes, auditRes, licensesRes, orgLinksRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("*")
      .eq("auth_id", id)
      .single(),
    admin.from("cme_wallets")
      .select("*")
      .eq("professional_id", id)
      .order("country"),
    admin.from("subscriptions")
      .select("*")
      .eq("professional_id", id)
      .order("created_at", { ascending: false }),
    admin.from("cme_activities")
      .select("id, title, provider, activity_date, credits, category, verification_status, created_at")
      .eq("professional_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
    admin.from("audit_logs")
      .select("id, action, metadata, created_at")
      .or(`actor_auth_id.eq.${id},target_id.eq.${id}`)
      .order("created_at", { ascending: false })
      .limit(20),
    admin.from("professional_licenses")
      .select("id, license_number, licensing_authority, country_code, profession, specialty, expiry_date, is_primary")
      .eq("professional_id", id)
      .order("is_primary", { ascending: false }),
    admin.from("employer_link_requests")
      .select("id, status, department, organizations(name, type)")
      .eq("professional_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (profileRes.error || !profileRes.data) notFound();

  const profile = profileRes.data;
  const email = profile.email ?? "—";
  const wallets = walletsRes.data ?? [];
  const wallet = wallets[0] ?? null; // primary wallet for legacy progress bar
  const subs = subsRes.data ?? [];
  const activities = activitiesRes.data ?? [];
  const auditLogs = auditRes.data ?? [];
  const licenses = licensesRes.data ?? [];
  const orgLinks = orgLinksRes.data ?? [];
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
        <div className="flex items-center gap-3 flex-wrap">
          <PlanOverrideButton authId={id} currentPlan={activeSub?.plan ?? "free"} />
          <TrialExtendButton authId={id} currentTrialEnd={profile.pro_trial_ends_at ?? null} />
          <SuspendAccountButton
            authId={id}
            isSuspended={profile.is_suspended ?? false}
            suspendedReason={profile.suspended_reason ?? null}
          />
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
              <Field label="Country" value={profile.country_of_residence} />
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

          {/* CME wallets — all countries */}
          {wallets.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
              <h2 className="text-sm font-semibold text-[#111] uppercase tracking-wide mb-4">CME Wallets ({wallets.length})</h2>
              <div className="space-y-4">
                {wallets.map((w) => {
                  const pct = (w.required_credits ?? 0) > 0
                    ? Math.min(100, Math.round(((w.completed_credits ?? 0) / w.required_credits) * 100))
                    : 100;
                  const gap = Math.max(0, (w.required_credits ?? 0) - (w.completed_credits ?? 0));
                  return (
                    <div key={w.id} className="border border-[#f1f5f9] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-[#111]">{w.country}</p>
                          <p className="text-xs text-[#64748b] capitalize">{(w.profession ?? "").replace(/_/g, " ")}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          w.compliance_status === "compliant"     ? "bg-[#dcfce7] text-[#15803d]" :
                          w.compliance_status === "at_risk"       ? "bg-[#fef9c3] text-[#a16207]" :
                          w.compliance_status === "non_compliant" ? "bg-[#fee2e2] text-[#dc2626]" :
                          "bg-[#f1f5f9] text-[#64748b]"
                        }`}>
                          {(w.compliance_status ?? "unknown").replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct >= 80 ? "bg-[#16a34a]" : pct >= 50 ? "bg-[#d97706]" : "bg-[#dc2626]"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-[#374151] w-10 text-right">{pct}%</span>
                      </div>
                      <p className="text-xs text-[#64748b] mt-1.5">
                        {w.completed_credits ?? 0}/{w.required_credits ?? 0} credits
                        {gap > 0 && <span className="text-[#dc2626]"> · {gap} gap</span>}
                        {w.cycle_end_date && <span> · ends {new Date(w.cycle_end_date).toLocaleDateString("en-GB")}</span>}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Licenses */}
          {licenses.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
              <h2 className="text-sm font-semibold text-[#111] uppercase tracking-wide mb-4">Licenses ({licenses.length})</h2>
              <div className="space-y-3">
                {licenses.map((l) => {
                  const daysLeft = l.expiry_date ? Math.ceil((new Date(l.expiry_date).getTime() - Date.now()) / 86400_000) : null;
                  return (
                    <div key={l.id} className="flex items-start justify-between gap-3 border border-[#f1f5f9] rounded-xl p-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-[#111]">{l.license_number}</p>
                          {l.is_primary && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-[#dbeafe] text-[#1d4ed8]">Primary</span>}
                        </div>
                        <p className="text-xs text-[#64748b]">{l.licensing_authority} · {l.country_code}</p>
                        <p className="text-xs text-[#64748b] capitalize">{(l.profession ?? "").replace(/_/g, " ")}{l.specialty ? ` · ${l.specialty}` : ""}</p>
                      </div>
                      {l.expiry_date && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-[#374151]">{new Date(l.expiry_date).toLocaleDateString("en-GB")}</p>
                          {daysLeft !== null && (
                            <p className={`text-[10px] font-semibold ${daysLeft < 0 ? "text-[#dc2626]" : daysLeft <= 30 ? "text-[#d97706]" : "text-[#64748b]"}`}>
                              {daysLeft < 0 ? "EXPIRED" : `${daysLeft}d left`}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Employer links */}
          {orgLinks.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
              <h2 className="text-sm font-semibold text-[#111] uppercase tracking-wide mb-4">Employer Links</h2>
              <div className="divide-y divide-[#f8fafc]">
                {orgLinks.map((link) => {
                  const org = link.organizations as unknown as { name: string; type: string } | null;
                  return (
                    <div key={link.id} className="flex items-center justify-between py-2.5">
                      <div>
                        <p className="text-sm font-medium text-[#111]">{org?.name ?? "—"}</p>
                        <p className="text-xs text-[#64748b] capitalize">{(org?.type ?? "").replace(/_/g, " ")}{link.department ? ` · ${link.department}` : ""}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        link.status === "approved" ? "bg-[#dcfce7] text-[#15803d]" :
                        link.status === "pending"  ? "bg-[#fef9c3] text-[#a16207]" :
                        "bg-[#fee2e2] text-[#dc2626]"
                      }`}>
                        {link.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CME activities — inline verify/reject for pending items */}
          <ActivitiesSection initialActivities={activities} />
        </div>

        {/* Right column — subscription + audit */}
        <div className="space-y-6">

          {/* Subscription */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
            <h2 className="text-sm font-semibold text-[#111] uppercase tracking-wide mb-4">Subscription</h2>
            {subs.length === 0 ? (
              <p className="text-sm text-[#64748b]">Free plan</p>
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
              <div className="px-5 py-6 text-center text-xs text-[#64748b]">No audit records.</div>
            ) : (
              <div className="divide-y divide-[#f1f5f9]">
                {auditLogs.map((log) => (
                  <div key={log.id} className="px-5 py-3">
                    <p className="text-xs font-mono text-[#374151]">{log.action}</p>
                    <p className="text-[10px] text-[#64748b] mt-0.5">
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
      <p className="text-xs text-[#64748b] mb-0.5">{label}</p>
      <p className={`text-sm ${warn ? "text-[#d97706] font-medium" : "text-[#374151]"}`}>
        {value ?? <span className="text-[#64748b]">—</span>}
      </p>
    </div>
  );
}

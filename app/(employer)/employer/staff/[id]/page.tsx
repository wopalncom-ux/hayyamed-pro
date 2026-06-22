import { notFound, redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const admin = createAdminClient();
  const { data } = await admin.from("professional_profiles").select("full_name").eq("auth_id", id).maybeSingle();
  return { title: data?.full_name ? `${data.full_name} — Staff Profile` : "Staff Profile" };
}

export const dynamic = "force-dynamic";

function statusBadge(s: string) {
  if (s === "compliant")
    return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#16a34a]">Compliant</span>;
  if (s === "at_risk")
    return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#fff7ed] text-[#d97706]">At Risk</span>;
  return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#fef2f2] text-[#dc2626]">Non-Compliant</span>;
}

function PrivacyNote() {
  return (
    <p className="text-xs text-[#64748b] italic">
      This information is private — the staff member has not consented to sharing it with employers.
    </p>
  );
}

export default async function StaffDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: professionalId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  // Verify the calling user is an employer_admin for an org that has this professional linked
  const { data: adminMember } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!adminMember) redirect("/dashboard");

  const orgId = adminMember.organization_id;
  const _orgs = adminMember.organizations as { name: string }[] | { name: string } | null;
  const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? "Your Organization";

  // Confirm the staff member is actually linked to this org
  const { data: link } = await admin
    .from("employer_link_requests")
    .select("id, department, status")
    .eq("organization_id", orgId)
    .eq("professional_id", professionalId)
    .eq("status", "approved")
    .maybeSingle();

  if (!link) notFound();

  // Fetch all data in parallel
  const [profileRes, privacyRes, walletRes, activitiesRes, tasksRes, licensesRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("full_name, profession, specialty, country_of_residence, license_number, licensing_authority, license_expiry, profile_completion_pct, onboarding_complete, created_at")
      .eq("auth_id", professionalId)
      .maybeSingle(),

    admin
      .from("profile_privacy_settings")
      .select("employer_can_view_cme_summary, employer_can_view_detailed_cme_activities, employer_can_view_license_expiry, employer_can_view_profile_details, employer_can_view_certificates")
      .eq("professional_id", professionalId)
      .maybeSingle(),

    admin
      .from("cme_wallets")
      .select("completed_credits, required_credits, compliance_status, country, cycle_start_date, cycle_end_date")
      .eq("professional_id", professionalId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),

    admin
      .from("cme_activities")
      .select("id, title, provider, activity_date, credits, category, verification_status")
      .eq("professional_id", professionalId)
      .eq("employer_visible", true)
      .eq("verification_status", "verified")
      .order("activity_date", { ascending: false })
      .limit(10),

    admin
      .from("employer_tasks")
      .select("id, title, status, due_date, created_at")
      .eq("organization_id", orgId)
      .eq("assigned_to", professionalId)
      .order("created_at", { ascending: false })
      .limit(5),

    admin
      .from("professional_licenses")
      .select("license_number, licensing_authority, country_code, profession, expiry_date, is_primary")
      .eq("professional_id", professionalId)
      .order("is_primary", { ascending: false }),
  ]);

  const profile  = profileRes.data;
  const privacy  = privacyRes.data;
  const wallet   = walletRes.data;
  const activities = activitiesRes.data ?? [];
  const tasks    = tasksRes.data ?? [];
  const licenses = licensesRes.data ?? [];

  // Apply privacy gates
  const showProfile     = privacy?.employer_can_view_profile_details !== false;
  const showCme         = privacy?.employer_can_view_cme_summary !== false;
  const showActivities  = privacy?.employer_can_view_detailed_cme_activities === true;
  const showLicenseExpiry = privacy?.employer_can_view_license_expiry !== false;

  const name = showProfile ? (profile?.full_name ?? "Staff Member") : "Staff Member (private)";

  const cycleEndDate = wallet?.cycle_end_date;
  const daysLeft = cycleEndDate
    ? Math.ceil((new Date(cycleEndDate).getTime() - Date.now()) / 86400000)
    : null;

  const licenseExpiry = showLicenseExpiry ? profile?.license_expiry : null;
  const daysToLicenseExpiry = licenseExpiry
    ? Math.ceil((new Date(licenseExpiry).getTime() - Date.now()) / 86400000)
    : null;

  const completionPct = wallet && wallet.required_credits
    ? Math.min(Math.round((wallet.completed_credits / wallet.required_credits) * 100), 100)
    : 0;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back nav */}
      <div className="mb-6">
        <a href="/employer" className="inline-flex items-center gap-1.5 text-sm text-[#1a56a0] hover:text-[#1547a0] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to {orgName}
        </a>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#111]">{name}</h1>
            {showProfile && (
              <p className="text-sm text-[#64748b] mt-0.5">
                {profile?.profession ?? "—"}
                {profile?.specialty ? ` · ${profile.specialty}` : ""}
                {link.department ? ` · ${link.department}` : ""}
              </p>
            )}
          </div>
          {showCme && wallet && statusBadge(wallet.compliance_status ?? "non_compliant")}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* CME Compliance */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#0f1f3d] mb-4">CME Compliance</h2>
          {!showCme ? (
            <PrivacyNote />
          ) : wallet ? (
            <div>
              <div className="flex items-end justify-between mb-2">
                <div>
                  <span className="text-3xl font-bold text-[#1a56a0]">{wallet.completed_credits}</span>
                  <span className="text-lg text-[#64748b]"> / {wallet.required_credits}</span>
                  <p className="text-xs text-[#64748b] mt-0.5">credits completed</p>
                </div>
                <span className="text-2xl font-bold text-[#0f1f3d]">{completionPct}%</span>
              </div>
              <div className="h-3 bg-[#f1f5f9] rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${
                    completionPct >= 100 ? "bg-[#16a34a]" :
                    completionPct >= 60  ? "bg-[#d97706]" : "bg-[#dc2626]"
                  }`}
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              {wallet.cycle_start_date && wallet.cycle_end_date && (
                <div className="text-xs text-[#64748b] space-y-1">
                  <p>Cycle: {wallet.cycle_start_date} → {wallet.cycle_end_date}</p>
                  {daysLeft !== null && (
                    <p className={daysLeft < 30 ? "text-[#dc2626] font-semibold" : ""}>
                      {daysLeft > 0 ? `${daysLeft} days remaining` : "Cycle ended"}
                    </p>
                  )}
                  <p>Country: {wallet.country}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#64748b]">No CME wallet set up yet.</p>
          )}
        </div>

        {/* License */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#0f1f3d] mb-4">License</h2>
          {!showLicenseExpiry ? (
            <PrivacyNote />
          ) : (
            <div className="space-y-2 text-sm">
              {showProfile && profile?.license_number && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Number</span>
                  <span className="font-mono text-xs text-[#374151]">{profile.license_number}</span>
                </div>
              )}
              {showProfile && profile?.licensing_authority && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Authority</span>
                  <span className="text-[#374151]">{profile.licensing_authority}</span>
                </div>
              )}
              {licenseExpiry && (
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Expiry</span>
                  <span className={`font-semibold ${
                    daysToLicenseExpiry !== null && daysToLicenseExpiry < 0 ? "text-[#dc2626]" :
                    daysToLicenseExpiry !== null && daysToLicenseExpiry <= 30 ? "text-[#dc2626]" :
                    daysToLicenseExpiry !== null && daysToLicenseExpiry <= 90 ? "text-[#d97706]" :
                    "text-[#16a34a]"
                  }`}>
                    {licenseExpiry}
                    {daysToLicenseExpiry !== null && (
                      <span className="ml-1 font-normal text-xs">
                        ({daysToLicenseExpiry < 0 ? "EXPIRED" : `${daysToLicenseExpiry}d`})
                      </span>
                    )}
                  </span>
                </div>
              )}
              {licenses.length > 0 && (
                <div className="pt-2 border-t border-[#f1f5f9]">
                  <p className="text-xs font-semibold text-[#64748b] mb-1.5">All licenses ({licenses.length})</p>
                  {licenses.map((l, i) => (
                    <div key={i} className="flex justify-between text-xs text-[#374151] py-0.5">
                      <span>{l.licensing_authority} ({l.country_code})</span>
                      <span className={l.expiry_date && new Date(l.expiry_date) < new Date() ? "text-[#dc2626]" : "text-[#64748b]"}>
                        {l.expiry_date ?? "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {!licenseExpiry && licenses.length === 0 && (
                <p className="text-xs text-[#64748b]">No license data available.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CME Activity Timeline */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#0f1f3d] mb-4">
          Recent CME Activity
          {showActivities && activities.length > 0 && (
            <span className="ml-2 text-xs font-normal text-[#64748b]">
              (employer-visible, verified only)
            </span>
          )}
        </h2>
        {!showActivities ? (
          <PrivacyNote />
        ) : activities.length === 0 ? (
          <p className="text-sm text-[#64748b]">No verified employer-visible activities yet.</p>
        ) : (
          <div className="space-y-0 divide-y divide-[#f1f5f9]">
            {activities.map((a) => (
              <div key={a.id} className="py-3 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#111] truncate">{a.title}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    {a.activity_date}
                    {a.provider ? ` · ${a.provider}` : ""}
                    {a.category ? ` · ${a.category.replace(/_/g, " ")}` : ""}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-bold text-[#1a56a0]">+{a.credits}</p>
                  <p className="text-xs text-[#64748b]">credits</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assigned Tasks */}
      {tasks.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#0f1f3d] mb-4">Tasks assigned by {orgName}</h2>
          <div className="space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm py-2 border-b border-[#f1f5f9] last:border-0">
                <div>
                  <p className="font-medium text-[#111]">{t.title}</p>
                  {t.due_date && (
                    <p className="text-xs text-[#64748b] mt-0.5">Due: {t.due_date}</p>
                  )}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  t.status === "completed"    ? "bg-[#dcfce7] text-[#16a34a]" :
                  t.status === "acknowledged" ? "bg-[#dbeafe] text-[#1d4ed8]" :
                  "bg-[#f1f5f9] text-[#64748b]"
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-[#64748b] mt-6 text-center">
        This view shows only data the staff member has consented to share with employers.
      </p>
    </div>
  );
}

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/dashboard/SignOutButton";
import PrivacyToggles from "@/components/dashboard/PrivacyToggles";
import ProfileEditForm from "@/components/dashboard/ProfileEditForm";
import AddEmployerForm from "@/components/dashboard/AddEmployerForm";
import ManageBillingButton from "@/components/dashboard/ManageBillingButton";
import ChangePasswordForm from "@/components/dashboard/ChangePasswordForm";
import DeleteAccountButton from "@/components/dashboard/DeleteAccountButton";
import EmailPreferencesForm from "@/components/dashboard/EmailPreferencesForm";
import ReferralSection from "@/components/dashboard/ReferralSection";
import SoundToggle from "@/components/dashboard/SoundToggle";
import MultiCountryWallet from "@/components/dashboard/MultiCountryWallet";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#fff7ed] text-[#d97706]",
  approved: "bg-[#dcfce7] text-[#16a34a]",
  rejected: "bg-[#fef2f2] text-[#dc2626]",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const [profileRes, linkRequestsRes, privacyRes, subRes, employerMemberRes, walletsRes, referralCountRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("full_name, mobile, date_of_birth, nationality, country_of_residence, profession, specialty, license_number, licensing_authority, license_expiry, pro_trial_ends_at, email_cme_verified, email_cme_deadline, email_license_expiry, email_trial_reminders, email_employer_tasks, referral_code, email_hard_bounced, email_spam_reported")
      .eq("auth_id", user.id)
      .single(),
    admin.from("employer_link_requests")
      .select("id, status, requested_at, organization_id, unverified_employer_name, organizations(name)")
      .eq("professional_id", user.id)
      .order("requested_at", { ascending: false }),
    admin.from("profile_privacy_settings")
      .select("*")
      .eq("professional_id", user.id)
      .maybeSingle(),
    admin.from("subscriptions")
      .select("plan, status, current_period_end, cancel_at_period_end, paddle_customer_id")
      .eq("professional_id", user.id)
      .maybeSingle(),
    admin.from("organization_members")
      .select("role, organizations(name)")
      .eq("auth_id", user.id)
      .eq("role", "employer_admin")
      .maybeSingle(),
    admin.from("cme_wallets")
      .select("id, country, profession, required_credits, completed_credits, compliance_status, cycle_end_date, is_primary, label")
      .eq("professional_id", user.id)
      .order("created_at", { ascending: true }),
    admin.from("audit_logs")
      .select("id", { count: "exact", head: true })
      .eq("actor_auth_id", user.id)
      .eq("action", "referral.signup"),
  ]);

  const profile = profileRes.data;
  const referralCount = referralCountRes.count ?? 0;
  const wallets = (walletsRes.data ?? []) as {
    id: string; country: string; profession: string; required_credits: number;
    completed_credits: number; compliance_status: string; cycle_end_date: string | null;
    is_primary: boolean; label: string | null;
  }[];
  const linkRequests = linkRequestsRes.data;
  const privacy = privacyRes.data;
  const sub = subRes.data;
  const employerMember = employerMemberRes?.data;
  const isEmployerAdmin = !!employerMember;
  const _emOrg = employerMember?.organizations as { name: string }[] | { name: string } | null;
  const employerOrgName = (Array.isArray(_emOrg) ? _emOrg[0]?.name : (_emOrg as { name: string } | null)?.name) ?? null;
  const isPaidPlan = sub && (sub.plan === "pro" || sub.plan === "employer") && (sub.status === "active" || sub.status === "trialing");

  const trialEndsAt = profile?.pro_trial_ends_at ?? null;
  const trialDaysLeft = trialEndsAt && !isPaidPlan
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000))
    : null;
  const isOnTrial = trialDaysLeft !== null && trialDaysLeft > 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Professional Details */}
        <ProfileEditForm
          profile={{
            full_name: profile?.full_name ?? null,
            mobile: profile?.mobile ?? null,
            date_of_birth: profile?.date_of_birth ?? null,
            nationality: profile?.nationality ?? null,
            country_of_residence: profile?.country_of_residence ?? null,
            profession: profile?.profession ?? null,
            specialty: profile?.specialty ?? null,
            license_number: profile?.license_number ?? null,
            licensing_authority: profile?.licensing_authority ?? null,
            license_expiry: profile?.license_expiry ?? null,
          }}
        />

        {/* Employer link status */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[#111]">Employer Link</h2>
          </div>

          {linkRequests && linkRequests.length > 0 && (
            <div className="space-y-3 mb-4">
              {linkRequests.map((req) => {
                const _orgs = req.organizations as { name: string }[] | { name: string } | null;
                const orgName =
                  (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ??
                  req.unverified_employer_name ??
                  "Unknown organization";
                return (
                  <div key={req.id} className="flex items-center justify-between py-2 border-b border-[#f1f5f9] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-[#111]">{orgName}</p>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        Requested {new Date(req.requested_at).toLocaleDateString()}
                        {req.unverified_employer_name && " • Pending admin verification"}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[req.status] ?? "bg-[#f1f5f9] text-[#64748b]"}`}>
                      {req.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show AddEmployerForm unless there's already a pending or approved request */}
          {(!linkRequests || !linkRequests.some((r) => r.status === "pending" || r.status === "approved")) && (
            <div>
              {(!linkRequests || linkRequests.length === 0) && (
                <p className="text-sm text-[#64748b] mb-4">No employer link requests yet.</p>
              )}
              {linkRequests && linkRequests.length > 0 && linkRequests.every((r) => r.status === "rejected") && (
                <p className="text-sm text-[#64748b] mb-4">Previous request was rejected. Submit a new one below.</p>
              )}
              <AddEmployerForm />
            </div>
          )}
        </div>

        {/* Employer Management */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-1">Employer Management</h2>
          <p className="text-xs text-[#64748b] mb-4">
            Manage your team&apos;s CME compliance, track license expiry, and run bulk reports.
          </p>
          {isEmployerAdmin ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#111]">{employerOrgName ?? "Your organization"}</p>
                <p className="text-xs text-[#16a34a] mt-0.5">Employer Admin</p>
              </div>
              <a
                href="/employer"
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1547a0] transition-colors"
              >
                Employer Dashboard →
              </a>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-[#64748b]">
                Are you an HR manager, clinic owner, or hospital administrator?
                Register your organization to access compliance management tools.
              </p>
              <a
                href="/employer/register"
                className="text-sm font-semibold px-4 py-2 rounded-lg border border-[#1a56a0] text-[#1a56a0] hover:bg-[#f0f7ff] transition-colors whitespace-nowrap flex-shrink-0"
              >
                Register org
              </a>
            </div>
          )}
        </div>

        {/* Privacy settings */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-4">Privacy Settings</h2>
          <PrivacyToggles
            initial={{
              employer_can_view_cme_summary: privacy?.employer_can_view_cme_summary ?? true,
              employer_can_view_certificates: privacy?.employer_can_view_certificates ?? false,
              employer_can_view_license_expiry: privacy?.employer_can_view_license_expiry ?? true,
              employer_can_view_detailed_cme_activities: privacy?.employer_can_view_detailed_cme_activities ?? false,
              employer_can_view_profile_details: privacy?.employer_can_view_profile_details ?? true,
            }}
          />
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-4">Subscription</h2>

          {isOnTrial ? (
            <div>
              <div className={`rounded-xl border px-4 py-4 mb-4 ${
                trialDaysLeft! <= 3 ? "bg-[#fff7ed] border-[#fed7aa]" : "bg-[#f0f7ff] border-[#bfdbfe]"
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-sm font-semibold ${trialDaysLeft! <= 3 ? "text-[#92400e]" : "text-[#1e3a5f]"}`}>
                      {trialDaysLeft! <= 3 ? "⚠️ " : ""}14-Day Pro Trial
                    </p>
                    <p className={`text-xs mt-0.5 ${trialDaysLeft! <= 3 ? "text-[#b45309]" : "text-[#3b5a8a]"}`}>
                      {trialDaysLeft === 1
                        ? "Expires tomorrow — upgrade now to keep Pro access."
                        : `${trialDaysLeft} days remaining — all Pro features are active.`}
                    </p>
                    {trialEndsAt && (
                      <p className="text-xs text-[#64748b] mt-1">
                        Trial ends {new Date(trialEndsAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <a
                    href="/pricing?source=settings_trial"
                    className={`text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      trialDaysLeft! <= 3
                        ? "bg-[#d97706] text-white hover:bg-[#b45309]"
                        : "bg-[#1a56a0] text-white hover:bg-[#1547a0]"
                    }`}
                  >
                    Upgrade — from $6/mo
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-semibold capitalize ${
                    isPaidPlan ? "text-[#1a56a0]" : "text-[#374151]"
                  }`}>
                    {sub?.plan ?? "Free"} Plan
                  </span>
                  {sub?.status === "trialing" && (
                    <span className="text-xs bg-blue-50 text-[#1a56a0] border border-blue-100 rounded-full px-2 py-0.5">
                      Trial
                    </span>
                  )}
                  {sub?.cancel_at_period_end && (
                    <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-2 py-0.5">
                      Cancels {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : "soon"}
                    </span>
                  )}
                </div>
                {isPaidPlan && sub.current_period_end && !sub.cancel_at_period_end && (
                  <p className="text-xs text-[#64748b]">
                    Renews {new Date(sub.current_period_end).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}
                {!isPaidPlan && (
                  <p className="text-xs text-[#64748b]">Upgrade for PDF reports, AI analysis, and unlimited CME tracking.</p>
                )}
              </div>
              {isPaidPlan && sub.paddle_customer_id ? (
                <ManageBillingButton />
              ) : (
                <a
                  href="/pricing?source=settings_billing"
                  className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1547a0] transition-colors"
                >
                  Upgrade to Pro
                </a>
              )}
            </div>
          )}
        </div>

        {/* Multi-country compliance wallets */}
        <div id="compliance-countries" className="bg-white rounded-xl border border-[#e2e8f0] p-6 scroll-mt-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-semibold text-[#111]">Compliance Countries</h2>
          </div>
          <p className="text-xs text-[#64748b] mb-4">
            Track CME requirements for multiple countries if you hold licenses in more than one GCC country.
          </p>
          <MultiCountryWallet
            wallets={wallets}
            primaryProfession={profile?.profession ?? ""}
          />
        </div>

        {/* App preferences */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-4">App Preferences</h2>
          <SoundToggle />
        </div>

        {/* Email delivery warning — bounce or spam reported */}
        {(profile?.email_hard_bounced || profile?.email_spam_reported) && (
          <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-5 flex items-start gap-3">
            <svg className="w-5 h-5 text-[#d97706] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-[#92400e] mb-1">Email delivery issue detected</p>
              <p className="text-sm text-[#b45309]">
                {profile.email_hard_bounced
                  ? "Our emails to your address are being rejected (hard bounce). You may not be receiving compliance reminders or license alerts."
                  : "Your email address has been marked as spam. You may not be receiving emails from us."}
                {" "}Please contact <a href="mailto:support@hayyamed.pro" className="underline font-medium">support@hayyamed.pro</a> to resolve this.
              </p>
            </div>
          </div>
        )}

        {/* Email notification preferences */}
        <div id="notifications" className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-1">Email Notifications</h2>
          <p className="text-xs text-[#64748b] mb-4">Choose which emails you receive. Changes save immediately.</p>
          <EmailPreferencesForm
            initial={{
              email_cme_verified:    profile?.email_cme_verified    ?? true,
              email_cme_deadline:    profile?.email_cme_deadline    ?? true,
              email_license_expiry:  profile?.email_license_expiry  ?? true,
              email_trial_reminders: profile?.email_trial_reminders ?? true,
              email_employer_tasks:  profile?.email_employer_tasks  ?? true,
            }}
          />
        </div>

        {/* Referral */}
        <ReferralSection initialCode={profile?.referral_code ?? null} referralCount={referralCount} />

        {/* Change password */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-1">Change Password</h2>
          <p className="text-xs text-[#64748b] mb-4">You must be signed in to update your password.</p>
          <ChangePasswordForm />
        </div>

        {/* Account */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-4">Account</h2>
          <div className="flex flex-col gap-4">
            <SignOutButton />
            <div className="border-t border-[#f1f5f9] pt-4">
              <p className="text-xs text-[#64748b] mb-2">
                Under PDPL and GDPR, you have the right to request deletion of your personal data.
              </p>
              <DeleteAccountButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

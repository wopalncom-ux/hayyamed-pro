import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/dashboard/SignOutButton";
import PrivacyToggles from "@/components/dashboard/PrivacyToggles";
import ProfileEditForm from "@/components/dashboard/ProfileEditForm";
import AddEmployerForm from "@/components/dashboard/AddEmployerForm";
import ManageBillingButton from "@/components/dashboard/ManageBillingButton";

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

  const [profileRes, linkRequestsRes, privacyRes, subRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("full_name, mobile, profession, specialty, license_number, licensing_authority, license_expiry")
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
  ]);

  const profile = profileRes.data;
  const linkRequests = linkRequestsRes.data;
  const privacy = privacyRes.data;
  const sub = subRes.data;
  const isPaidPlan = sub && (sub.plan === "pro" || sub.plan === "employer") && (sub.status === "active" || sub.status === "trialing");

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-6">Settings</h1>

      <div className="space-y-4">
        {/* Professional Details */}
        <ProfileEditForm
          profile={{
            full_name: profile?.full_name ?? null,
            mobile: profile?.mobile ?? null,
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
                <p className="text-xs text-[#64748b]">Upgrade for PDF exports and automated alerts.</p>
              )}
            </div>
            {isPaidPlan && sub.paddle_customer_id ? (
              <ManageBillingButton />
            ) : (
              <a
                href="/pricing"
                className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#1547a0] transition-colors"
              >
                Upgrade to Pro
              </a>
            )}
          </div>
        </div>

        {/* Account */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-4">Account</h2>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}

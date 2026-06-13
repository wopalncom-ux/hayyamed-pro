import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserPlan, isPro } from "@/lib/subscription";
import { FREE_ACTIVITY_LIMIT } from "@/lib/planLimits";
import FreeTierBanner from "@/components/dashboard/FreeTierBanner";
import TrialBanner from "@/components/dashboard/TrialBanner";
import UpgradeSuccessToast from "@/components/dashboard/UpgradeSuccessToast";
import ProfileCompletionCard, { buildProfileGaps } from "@/components/dashboard/ProfileCompletionCard";
import WhatNextCard from "@/components/dashboard/WhatNextCard";
import ComplianceStatusCard from "@/components/dashboard/ComplianceStatusCard";
import ComplianceBadgeCard from "@/components/dashboard/ComplianceBadgeCard";
import NpsSurveyBanner from "@/components/dashboard/NpsSurveyBanner";
import EmployerTeaserCard from "@/components/dashboard/EmployerTeaserCard";
import TrialExpiredBanner from "@/components/dashboard/TrialExpiredBanner";
import EmployerSetupBanner from "@/components/dashboard/EmployerSetupBanner";
import ComplianceChatWidget from "@/components/dashboard/ComplianceChatWidget";
import Image from "next/image";
import type { Partner } from "@/lib/types";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgrade?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const npsLookback = new Date(Date.now() - 365 * 86400000).toISOString();
  const [profileRes, walletRes, activitiesRes, plan, employerLinkRes, partnersRes, npsRes, employerRoleRes, referralCountRes, subscriptionRes] = await Promise.all([
    admin.from("professional_profiles").select("*").eq("auth_id", user.id).single(),
    admin.from("cme_wallets").select("*").eq("professional_id", user.id).order("created_at", { ascending: true }).limit(1).maybeSingle(),
    admin.from("cme_activities").select("id").eq("professional_id", user.id),
    getUserPlan(user.id),
    admin.from("employer_link_requests").select("id").eq("professional_id", user.id).eq("status", "approved").maybeSingle(),
    admin.from("partners").select("id, name, logo_url, website_url, partner_type, tagline")
      .eq("is_active", true).eq("show_on_dashboard", true).order("display_order").limit(8),
    admin.from("nps_responses").select("id").eq("professional_id", user.id).gte("created_at", npsLookback).maybeSingle(),
    admin.from("organization_members").select("role").eq("auth_id", user.id).eq("role", "employer_admin").maybeSingle(),
    admin.from("audit_logs").select("*", { count: "exact", head: true }).eq("actor_auth_id", user.id).eq("action", "referral.signup"),
    admin.from("subscriptions").select("plan, employer_tier").eq("professional_id", user.id).eq("status", "active").maybeSingle(),
  ]);

  const profile = profileRes.data;
  const wallet = walletRes.data;
  const activityCount = activitiesRes.data?.length ?? 0;
  const partners = (partnersRes.data ?? []) as Partner[];
  const referralCount = referralCountRes.count ?? 0;
  const subscriptionPlan = subscriptionRes.data?.plan ?? null;
  const subscriptionEmployerTier = subscriptionRes.data?.employer_tier ?? null;

  // NPS eligibility: account >= 30 days old, no submission in the last 365 days
  const accountAgeMs = profile?.created_at
    ? Date.now() - new Date(profile.created_at).getTime()
    : 0;
  const npsEligible = accountAgeMs >= 30 * 86400000 && !npsRes.data;

  // Employer teaser: shown to Pro users who are not already an employer_admin
  const isEmployerAdmin = !!employerRoleRes.data;
  const showEmployerTeaser = isPro(plan) && !isEmployerAdmin;

  // Employer setup: active employer subscription but no org registered yet
  const hasEmployerSubscription = subscriptionPlan === "employer";
  const needsEmployerSetup = hasEmployerSubscription && !isEmployerAdmin;
  // If they just purchased (upgrade param present) and webhook has already fired, redirect to setup
  if (needsEmployerSetup && sp.upgrade) {
    redirect("/employer/register?welcome=1");
  }

  // Trial-expired re-engagement: show for 14 days after trial ends, Free users only
  const trialExpiredDaysAgo = !isPro(plan) && profile?.pro_trial_ends_at
    ? Math.floor((Date.now() - new Date(profile.pro_trial_ends_at).getTime()) / 86400000)
    : -1;
  const showTrialExpiredBanner = trialExpiredDaysAgo >= 0 && trialExpiredDaysAgo <= 14;

  const completionPct = profile?.profile_completion_pct ?? 0;
  const daysToExpiry = profile?.license_expiry
    ? Math.ceil((new Date(profile.license_expiry).getTime() - Date.now()) / 86400000)
    : null;

  const profileGaps = profile
    ? buildProfileGaps(profile as Record<string, unknown>, {
        hasCmeWallet: !!wallet,
        hasEmployerLink: !!employerLinkRes.data,
      })
    : [];

  return (
    <div>
      {sp.upgrade && <UpgradeSuccessToast type={sp.upgrade === "trial" ? "trial" : undefined} />}

      {/* Employer setup — active employer subscription but org not yet registered */}
      {needsEmployerSetup && (
        <EmployerSetupBanner employerTier={subscriptionEmployerTier} />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">
          Welcome back, {profile?.full_name?.split(" ")[0] ?? "Professional"}
        </h1>
        {(profile?.profession || profile?.specialty) && (
          <p className="text-[#64748b] text-sm mt-1">
            {[profile.profession, profile.specialty].filter(Boolean).join(" • ")}
          </p>
        )}
      </div>

      {/* Trial banner — shown while 14-day trial is active */}
      {plan === "trialing" && (() => {
        const trialDaysLeft = profile?.pro_trial_ends_at
          ? Math.max(0, Math.ceil((new Date(profile.pro_trial_ends_at).getTime() - Date.now()) / 86400000))
          : 0;
        return trialDaysLeft > 0 ? <TrialBanner daysLeft={trialDaysLeft} /> : null;
      })()}

      {/* Trial expired re-engagement — shown for 14 days after trial ends */}
      {showTrialExpiredBanner && (
        <TrialExpiredBanner daysAgo={trialExpiredDaysAgo} />
      )}

      {/* Free tier upgrade banner — shown to non-Pro users without a recent trial expiry */}
      {!isPro(plan) && !showTrialExpiredBanner && (
        <FreeTierBanner activityCount={activityCount} />
      )}

      {/* NPS survey — shown after 30 days, once per year */}
      <NpsSurveyBanner eligible={npsEligible} />

      {/* Profile completion guidance — hidden at 100% */}
      <ProfileCompletionCard pct={completionPct} gaps={profileGaps} />

      {/* CME compliance status hero — only when wallet exists */}
      {wallet && (
        <ComplianceStatusCard
          completed={wallet.completed_credits}
          required={wallet.required_credits}
          complianceStatus={wallet.compliance_status}
          cycleEndDate={wallet.cycle_end_date ?? null}
          country={wallet.country ?? ""}
        />
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Profile Complete"
          value={`${completionPct}%`}
          sub="Keep filling in your details"
          color={completionPct >= 80 ? "green" : "blue"}
        />
        <StatCard
          label="CME Credits"
          value={wallet ? `${wallet.completed_credits} / ${wallet.required_credits}` : "—"}
          sub={wallet ? `${wallet.required_credits - wallet.completed_credits} remaining` : "Set up CME wallet"}
          color={wallet?.compliance_status === "compliant" ? "green" : "orange"}
        />
        <StatCard
          label="License Expiry"
          value={daysToExpiry !== null ? `${daysToExpiry}d` : "—"}
          sub={profile?.license_expiry ? new Date(profile.license_expiry).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Not set"}
          color={daysToExpiry !== null && daysToExpiry < 90 ? "red" : "green"}
        />
        <StatCard
          label="CME Activities"
          value={String(activityCount)}
          sub={isPro(plan) ? "Unlimited · Pro plan" : `of ${FREE_ACTIVITY_LIMIT} free · ${Math.max(0, FREE_ACTIVITY_LIMIT - activityCount)} remaining`}
          color="blue"
        />
      </div>

      {/* Compliance badge — show when user has a wallet */}
      {wallet && user && (
        <ComplianceBadgeCard
          professionalId={user.id}
          plan={plan}
          name={profile?.full_name ?? ""}
          pct={wallet.required_credits > 0 ? Math.min(100, Math.round((wallet.completed_credits / wallet.required_credits) * 100)) : 0}
          complianceStatus={wallet.compliance_status ?? "non_compliant"}
          referralCode={profile?.referral_code ?? null}
        />
      )}

      {/* Setup progress / what's next */}
      <WhatNextCard
        hasWallet={!!wallet}
        hasLicense={!!profile?.license_number}
        profilePct={completionPct}
        activityCount={activityCount}
        hasEmployerLink={!!employerLinkRes.data}
        plan={plan}
        referralCount={referralCount}
      />

      {/* Employer teaser — shown to Pro users who are not yet employer_admin */}
      {showEmployerTeaser && <EmployerTeaserCard plan={plan} />}

      {/* Accredited partners / trusted institutions */}
      {partners.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">
            Trusted Accreditors &amp; Partners
          </p>
          <div className="flex flex-wrap gap-3">
            {partners.map((p) => (
              <a
                key={p.id}
                href={p.website_url ?? "#"}
                target={p.website_url ? "_blank" : undefined}
                rel="noopener noreferrer"
                title={p.tagline ?? p.name}
                className="flex items-center gap-2.5 bg-white border border-[#e2e8f0] rounded-xl px-3 py-2 hover:border-[#1a56a0] transition-colors group"
              >
                {p.logo_url ? (
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                      src={p.logo_url}
                      alt={p.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 flex-shrink-0 rounded-md bg-[#e8f0fe] flex items-center justify-center text-[#1a56a0] text-xs font-bold">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium text-[#374151] group-hover:text-[#1a56a0] transition-colors max-w-[100px] truncate">
                  {p.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e]">
        Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Always verify final requirements with your relevant regulatory body (e.g. QCHP).
      </div>

      <ComplianceChatWidget />
    </div>
  );
}

function StatCard({ label, value, sub, color }: {
  label: string;
  value: string;
  sub: string;
  color: "blue" | "green" | "orange" | "red";
}) {
  const colors = {
    blue: "bg-[#e8f0fe] text-[#1a56a0]",
    green: "bg-[#dcfce7] text-[#16a34a]",
    orange: "bg-[#fff7ed] text-[#d97706]",
    red: "bg-[#fef2f2] text-[#dc2626]",
  };
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
      <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold mb-1 ${colors[color].split(" ")[1]}`}>{value}</p>
      <p className="text-xs text-[#64748b]">{sub}</p>
    </div>
  );
}

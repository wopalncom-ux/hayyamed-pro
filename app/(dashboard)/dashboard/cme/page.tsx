import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AddActivityButton from "@/components/dashboard/AddActivityButton";
import CmeActivitiesEmptyState from "@/components/dashboard/CmeActivitiesEmptyState";
import CertificateLink from "@/components/dashboard/CertificateLink";
import CmeActivityActions from "@/components/dashboard/CmeActivityActions";
import DownloadReportButton from "@/components/dashboard/DownloadReportButton";
import PdfReportCard from "@/components/dashboard/PdfReportCard";
import ComplianceGapCard from "@/components/dashboard/ComplianceGapCard";
import AIRecommendationsCard from "@/components/dashboard/AIRecommendationsCard";
import ComplianceChatWidget from "@/components/dashboard/ComplianceChatWidget";
import EmployerTasksSection from "@/components/dashboard/EmployerTasksSection";
import ComplianceRing from "@/components/dashboard/ComplianceRing";
import MilestoneCelebration from "@/components/dashboard/MilestoneCelebration";
import WalletTabs from "@/components/dashboard/WalletTabs";
import ImportCsvButton from "@/components/dashboard/ImportCsvButton";
import ExportCsvButton from "@/components/dashboard/ExportCsvButton";
import CalendarExportButton from "@/components/dashboard/CalendarExportButton";
import { getUserPlan, isPro } from "@/lib/subscription";
import { FREE_ACTIVITY_LIMIT } from "@/lib/planLimits";
import { toCountryCode } from "@/lib/countryCode";

function computeStreak(dates: string[]): { current: number; atRisk: boolean } {
  if (!dates.length) return { current: 0, atRisk: false };
  const MS_WEEK = 7 * 86400000;
  const weekSet = new Set(dates.map((d) => Math.floor(new Date(d).getTime() / MS_WEEK)));
  const nowWeek = Math.floor(Date.now() / MS_WEEK);
  const startWeek = weekSet.has(nowWeek) ? nowWeek : nowWeek - 1;
  if (!weekSet.has(startWeek)) return { current: 0, atRisk: false };
  let streak = 0;
  let w = startWeek;
  while (weekSet.has(w)) { streak++; w--; }
  return { current: streak, atRisk: !weekSet.has(nowWeek) && weekSet.has(nowWeek - 1) };
}

export default async function CmePage({
  searchParams,
}: {
  searchParams: Promise<{ wallet?: string }>;
}) {
  const { wallet: walletParam } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  // Round 1: all wallets + plan in parallel
  const [walletsRes, plan] = await Promise.all([
    admin
      .from("cme_wallets")
      .select("*")
      .eq("professional_id", user.id)
      .order("created_at", { ascending: true }),
    getUserPlan(user.id),
  ]);

  const wallets = walletsRes.data ?? [];
  const wallet = wallets.find((w) => w.id === walletParam) ?? wallets[0] ?? null;

  type ActivityRow = {
    id: string; title: string; provider: string | null; activity_date: string;
    credits: number; category: string | null; certificate_url: string | null;
    verification_status: string; rejection_reason: string | null;
  };
  type CatRuleRow = {
    category_name: string; max_credits_per_cycle: number | null;
    min_credits_per_cycle: number; accreditation_required: boolean; notes: string | null;
  };

  // Round 2: activities + category rules for the active wallet in parallel
  let activities: ActivityRow[] = [];
  let categoryRules: CatRuleRow[] = [];

  if (wallet) {
    const [activitiesRes, catRulesRes] = await Promise.all([
      admin
        .from("cme_activities")
        .select(
          "id, title, provider, activity_date, credits, category, certificate_url, verification_status, rejection_reason"
        )
        .eq("professional_id", user.id)
        .eq("wallet_id", wallet.id)
        .order("activity_date", { ascending: false }),
      admin
        .from("compliance_activity_categories")
        .select(
          "category_name, max_credits_per_cycle, min_credits_per_cycle, accreditation_required, notes"
        )
        .eq("country_code", toCountryCode(wallet.country))
        .order("category_name"),
    ]);
    activities = (activitiesRes.data ?? []) as ActivityRow[];
    categoryRules = (catRulesRes.data ?? []) as CatRuleRow[];
  }

  const { current: streakWeeks, atRisk: streakAtRisk } = computeStreak(
    activities.map((a) => a.activity_date)
  );

  const pendingActivities = activities.filter((a) => a.verification_status === "pending");
  const pendingCreditsSum = pendingActivities.reduce((sum, a) => sum + (a.credits ?? 0), 0);

  const validActivities = activities.filter((a) => a.verification_status !== "rejected");
  const creditsByCategory: Record<string, number> = {};
  for (const a of validActivities) {
    if (a.category) creditsByCategory[a.category] = (creditsByCategory[a.category] ?? 0) + a.credits;
  }
  const gaps = categoryRules
    .filter((r) => r.min_credits_per_cycle > 0)
    .map((r) => ({
      category: r.category_name,
      earned: creditsByCategory[r.category_name] ?? 0,
      needed: Math.max(0, r.min_credits_per_cycle - (creditsByCategory[r.category_name] ?? 0)),
    }))
    .filter((g) => g.needed > 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-2">CME Wallet</h1>
      <p className="text-sm text-[#64748b] mb-6">
        Track your Continuing Medical Education credits for license renewal.
      </p>

      {wallet ? (
        <>
          {/* Multi-wallet tabs — only shown when user has 2+ wallets */}
          <WalletTabs
            wallets={wallets.map((w) => ({
              id: w.id,
              country: w.country,
              label: w.label ?? null,
              compliance_status: w.compliance_status,
            }))}
            activeWalletId={wallet.id}
          />

          {/* Milestone celebration overlay */}
          <MilestoneCelebration
            walletId={wallet.id}
            completed={wallet.completed_credits}
            required={wallet.required_credits}
          />

          {/* Compliance health ring */}
          <ComplianceRing
            completed={wallet.completed_credits}
            required={wallet.required_credits}
            cycleStartDate={wallet.cycle_start_date ?? null}
            cycleEndDate={wallet.cycle_end_date ?? null}
            licenseExpiryDays={null}
          />

          {/* Cycle meta */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] px-5 py-3.5 mb-6 flex items-center justify-between flex-wrap gap-3">
            <div className="text-sm text-[#64748b]">
              <span className="font-medium text-[#374151]">{wallet.profession}</span>
              {wallet.specialty ? ` • ${wallet.specialty}` : ""}
              {" • "}{wallet.country}
              <span className="mx-2 text-[#e2e8f0]">|</span>
              Cycle: {wallet.cycle_start_date} → {wallet.cycle_end_date}
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                wallet.compliance_status === "compliant"
                  ? "bg-[#dcfce7] text-[#16a34a]"
                  : wallet.compliance_status === "at_risk"
                  ? "bg-[#fff7ed] text-[#d97706]"
                  : "bg-[#fef2f2] text-[#dc2626]"
              }`}>
                {wallet.compliance_status.replace("_", " ").toUpperCase()}
              </span>
              {wallets.length === 1 && (
                <a
                  href="/dashboard/settings#compliance-countries"
                  className="text-xs text-[#64748b] hover:text-[#1a56a0] hover:underline transition-colors"
                >
                  + Track another country
                </a>
              )}
            </div>
          </div>

          {/* Pending activities notice */}
          {pendingCreditsSum > 0 && (
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
              <svg className="w-4 h-4 text-[#1a56a0] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <p className="text-sm text-[#1a56a0]">
                <span className="font-semibold">{pendingCreditsSum} credits pending verification</span>
                {" "}across {pendingActivities.length} {pendingActivities.length === 1 ? "activity" : "activities"} —
                {" "}your total will update automatically once reviewed.
              </p>
            </div>
          )}

          {/* Streak banner */}
          {streakWeeks >= 2 && (
            <div className={`rounded-xl border px-4 py-3 mb-6 flex items-center gap-3 ${
              streakAtRisk ? "bg-[#fff7ed] border-[#fed7aa]" : "bg-[#f0fdf4] border-[#bbf7d0]"
            }`}>
              <span className="text-xl">{streakAtRisk ? "⚠️" : "🔥"}</span>
              <div>
                <p className={`text-sm font-semibold ${streakAtRisk ? "text-[#92400e]" : "text-[#15803d]"}`}>
                  {streakWeeks}-week streak{streakAtRisk ? " — at risk" : ""}
                </p>
                <p className={`text-xs ${streakAtRisk ? "text-[#b45309]" : "text-[#16a34a]"}`}>
                  {streakAtRisk
                    ? "No activities logged this week — log one before Sunday to keep your streak."
                    : `You've logged CME activities for ${streakWeeks} consecutive week${streakWeeks !== 1 ? "s" : ""}.`}
                </p>
              </div>
            </div>
          )}

          {/* Tasks assigned by employer */}
          <EmployerTasksSection professionalId={user.id} />

          {/* Compliance gap analysis */}
          <ComplianceGapCard categoryRules={categoryRules} activities={activities} />

          {/* AI recommendations */}
          <AIRecommendationsCard
            profession={wallet.profession ?? "Healthcare Professional"}
            specialty={wallet.specialty ?? null}
            country={toCountryCode(wallet.country ?? "QA")}
            totalRequired={wallet.required_credits}
            totalCompleted={wallet.completed_credits}
            gaps={gaps}
            cycleEndDate={wallet.cycle_end_date ?? null}
            plan={plan}
          />

          {/* Activities */}
          <div className="bg-white rounded-xl border border-[#e2e8f0]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
              <div>
                <h2 className="text-base font-semibold text-[#111]">CME Activities</h2>
                {!isPro(plan) && (
                  <p className={`text-xs mt-0.5 ${activities.length >= FREE_ACTIVITY_LIMIT ? "text-[#dc2626]" : "text-[#64748b]"}`}>
                    {activities.length} / {FREE_ACTIVITY_LIMIT} free activities used
                    {activities.length >= FREE_ACTIVITY_LIMIT && " — limit reached"}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <DownloadReportButton plan={plan} />
                <ExportCsvButton walletId={wallet.id} plan={plan} />
                <CalendarExportButton plan={plan} />
                <ImportCsvButton
                  walletId={wallet.id}
                  plan={plan}
                  existingCount={activities.length}
                />
                {isPro(plan) || activities.length < FREE_ACTIVITY_LIMIT ? (
                  <AddActivityButton
                    walletId={wallet.id}
                    plan={plan}
                    countryCode={wallet.country ? toCountryCode(wallet.country) : "QA"}
                    categoryCapData={Object.fromEntries(
                      categoryRules
                        .filter((r) => r.max_credits_per_cycle != null)
                        .map((r) => [
                          r.category_name,
                          { max: r.max_credits_per_cycle, earned: creditsByCategory[r.category_name] ?? 0 },
                        ])
                    )}
                  />
                ) : (
                  <a
                    href="/pricing?source=cme_activity_limit"
                    className="text-xs bg-[#1a56a0] text-white px-3 py-2 rounded-lg font-semibold hover:bg-[#1547a0] transition-colors"
                  >
                    Upgrade to log more
                  </a>
                )}
              </div>
            </div>

            {activities.length === 0 ? (
              <CmeActivitiesEmptyState walletId={wallet.id} plan={plan} />
            ) : (
              <div className="divide-y divide-[#e2e8f0]">
                {activities.map((a) => (
                  <div key={a.id} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#111]">{a.title}</p>
                        <p className="text-xs text-[#64748b] mt-0.5">
                          {a.provider ?? "—"} • {a.activity_date}
                          {a.category && (
                            <span className="ml-2 bg-[#f1f5f9] text-[#374151] rounded px-1.5 py-0.5 text-[10px] capitalize">
                              {a.category.replace("_", " ")}
                            </span>
                          )}
                        </p>
                        {a.certificate_url && (
                          <div className="mt-0.5">
                            <CertificateLink certificatePath={a.certificate_url} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-semibold text-[#1a56a0]">+{a.credits} credits</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          a.verification_status === "verified"
                            ? "bg-[#dcfce7] text-[#16a34a]"
                            : a.verification_status === "rejected"
                            ? "bg-[#fef2f2] text-[#dc2626]"
                            : "bg-[#f1f5f9] text-[#64748b]"
                        }`}>
                          {a.verification_status}
                        </span>
                        {a.verification_status === "rejected" && a.rejection_reason && (
                          <p className="text-[10px] text-[#dc2626] max-w-[160px] text-right leading-tight">
                            {a.rejection_reason}
                          </p>
                        )}
                      </div>
                    </div>
                    {(a.verification_status === "pending" || a.verification_status === "rejected") && (
                      <CmeActivityActions
                        id={a.id}
                        status={a.verification_status}
                        title={a.title}
                        provider={a.provider ?? null}
                        activityDate={a.activity_date}
                        credits={a.credits}
                        category={a.category ?? null}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PDF report card — paywall for Free users, download card for Pro */}
          <PdfReportCard plan={plan} walletCountry={wallet.country ?? null} />
        </>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-10 text-center">
          <div className="w-12 h-12 bg-[#f0f4f8] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-[#111] mb-1.5">CME wallet not configured</h3>
          <p className="text-sm text-[#64748b] max-w-xs mx-auto mb-5">
            Set up your wallet with your country and profession so we can calculate your compliance status.
          </p>
          <a
            href="/onboarding/5"
            className="inline-block text-sm bg-[#1a56a0] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#1547a0] transition-colors"
          >
            Set up CME wallet →
          </a>
        </div>
      )}

      <ComplianceChatWidget />
    </div>
  );
}

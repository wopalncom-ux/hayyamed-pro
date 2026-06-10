import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AddActivityButton from "@/components/dashboard/AddActivityButton";
import CertificateLink from "@/components/dashboard/CertificateLink";
import DownloadReportButton from "@/components/dashboard/DownloadReportButton";
import ComplianceGapCard from "@/components/dashboard/ComplianceGapCard";
import AIRecommendationsCard from "@/components/dashboard/AIRecommendationsCard";
import ComplianceChatWidget from "@/components/dashboard/ComplianceChatWidget";
import EmployerTasksSection from "@/components/dashboard/EmployerTasksSection";
import { getUserPlan, isPro } from "@/lib/subscription";

export default async function CmePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [walletRes, activitiesRes, plan] = await Promise.all([
    admin.from("cme_wallets").select("*").eq("professional_id", user.id).maybeSingle(),
    admin.from("cme_activities").select("*").eq("professional_id", user.id).order("activity_date", { ascending: false }),
    getUserPlan(user.id),
  ]);

  const wallet = walletRes.data;
  const activities = activitiesRes.data ?? [];

  // Fetch per-category compliance rules for the professional's country
  let categoryRules: {
    category_name: string;
    max_credits_per_cycle: number | null;
    min_credits_per_cycle: number;
    accreditation_required: boolean;
    notes: string | null;
  }[] = [];
  if (wallet?.country) {
    const { data } = await admin
      .from("compliance_activity_categories")
      .select("category_name, max_credits_per_cycle, min_credits_per_cycle, accreditation_required, notes")
      .eq("country_code", wallet.country)
      .order("category_name");
    categoryRules = data ?? [];
  }

  // Compute gaps for AI recommendations
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
          {/* Wallet summary */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-[#64748b]">
                  Renewal cycle: {wallet.cycle_start_date} → {wallet.cycle_end_date}
                </p>
                <p className="text-sm text-[#64748b]">
                  {wallet.profession} • {wallet.specialty ?? "All specialties"} • {wallet.country}
                </p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                wallet.compliance_status === "compliant"
                  ? "bg-[#dcfce7] text-[#16a34a]"
                  : wallet.compliance_status === "at_risk"
                  ? "bg-[#fff7ed] text-[#d97706]"
                  : "bg-[#fef2f2] text-[#dc2626]"
              }`}>
                {wallet.compliance_status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold text-[#1a56a0]">{wallet.completed_credits}</span>
              <span className="text-lg text-[#64748b] mb-0.5">/ {wallet.required_credits} credits</span>
            </div>
            <div className="w-full bg-[#e2e8f0] rounded-full h-2">
              <div
                className="bg-[#1a56a0] h-2 rounded-full transition-all"
                style={{ width: `${Math.min((wallet.completed_credits / wallet.required_credits) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Tasks assigned by employer */}
          <EmployerTasksSection professionalId={user.id} />

          {/* Compliance gap analysis */}
          <ComplianceGapCard categoryRules={categoryRules} activities={activities} />

          {/* AI recommendations */}
          <AIRecommendationsCard
            profession={wallet.profession ?? "Healthcare Professional"}
            specialty={wallet.specialty ?? null}
            country={wallet.country ?? "QA"}
            totalRequired={wallet.required_credits}
            totalCompleted={wallet.completed_credits}
            gaps={gaps}
            cycleEndDate={wallet.cycle_end_date ?? null}
          />

          {/* Activities */}
          <div className="bg-white rounded-xl border border-[#e2e8f0]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
              <h2 className="text-base font-semibold text-[#111]">CME Activities</h2>
              <div className="flex items-center gap-3">
                {isPro(plan) ? (
                  <DownloadReportButton />
                ) : (
                  <a href="/pricing" className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors">
                    Upgrade for PDF export ↗
                  </a>
                )}
                <AddActivityButton walletId={wallet.id} />
              </div>
            </div>

            {activities.length === 0 ? (
              <div className="px-6 py-12 text-center text-[#64748b] text-sm">
                No activities logged yet. Add your first CME activity.
              </div>
            ) : (
              <div className="divide-y divide-[#e2e8f0]">
                {activities.map((a) => (
                  <div key={a.id} className="px-6 py-4 flex items-center justify-between">
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
                    <div className="flex items-center gap-3">
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 text-center">
          <p className="text-[#64748b] mb-4">Your CME wallet hasn&apos;t been set up yet.</p>
          <a
            href="/onboarding/5"
            className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors"
          >
            Set up CME wallet
          </a>
        </div>
      )}

      <ComplianceChatWidget />
    </div>
  );
}

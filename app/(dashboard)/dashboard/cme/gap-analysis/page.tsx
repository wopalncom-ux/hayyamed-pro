import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserPlan, isPro } from "@/lib/subscription";
import { toCountryCode } from "@/lib/countryCode";
import GapAnalysisClient from "@/components/dashboard/GapAnalysisClient";
import type { GapAnalysis } from "@/app/api/ai/gap-analysis/route";

export const metadata = {
  title: "AI CME Gap Analysis — Hayya Med Pro",
  description: "AI-powered analysis of your CME gaps and personalised recommendations to reach compliance.",
};

export default async function GapAnalysisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [plan, profileRes] = await Promise.all([
    getUserPlan(user.id),
    createAdminClient()
      .from("professional_profiles")
      .select("profession, specialty, country_of_residence")
      .eq("auth_id", user.id)
      .maybeSingle(),
  ]);

  if (!isPro(plan)) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center px-4">
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="text-xl font-bold text-[#111] mb-2">AI CME Gap Analysis</h1>
        <p className="text-[#64748b] text-sm mb-6">
          AI-powered gap analysis and personalised recommendations are available on the Pro plan.
        </p>
        <a
          href="/pricing?source=gap_analysis"
          className="inline-block bg-[#1a56a0] text-white text-sm font-semibold px-6 py-3 rounded-lg"
        >
          Upgrade to Pro →
        </a>
      </div>
    );
  }

  const profile = profileRes.data;
  const admin = createAdminClient();

  const [walletsRes] = await Promise.all([
    admin.from("cme_wallets").select("*").eq("professional_id", user.id).order("created_at", { ascending: true }),
  ]);

  const wallets = walletsRes.data ?? [];
  const wallet = wallets[0] ?? null;

  type CatRuleRow = {
    category_name: string;
    max_credits_per_cycle: number | null;
    min_credits_per_cycle: number;
  };
  type ActivityRow = {
    credits: number;
    category: string | null;
    verification_status: string;
  };

  let categoryBreakdown: { category: string; earned: number; cap: number | null; minimum: number }[] = [];

  if (wallet) {
    const countryCode = toCountryCode(wallet.country);
    const [activitiesRes, catRulesRes] = await Promise.all([
      admin
        .from("cme_activities")
        .select("credits, category, verification_status")
        .eq("professional_id", user.id)
        .eq("wallet_id", wallet.id),
      admin
        .from("compliance_activity_categories")
        .select("category_name, max_credits_per_cycle, min_credits_per_cycle")
        .eq("country_code", countryCode)
        .order("category_name"),
    ]);

    const activities = (activitiesRes.data ?? []) as ActivityRow[];
    const categoryRules = (catRulesRes.data ?? []) as CatRuleRow[];

    const creditsByCategory: Record<string, number> = {};
    for (const a of activities.filter((x) => x.verification_status !== "rejected")) {
      if (a.category) creditsByCategory[a.category] = (creditsByCategory[a.category] ?? 0) + a.credits;
    }

    categoryBreakdown = categoryRules.map((r) => ({
      category: r.category_name,
      earned: creditsByCategory[r.category_name] ?? 0,
      cap: r.max_credits_per_cycle,
      minimum: r.min_credits_per_cycle,
    }));
  }

  const initialData = wallet
    ? {
        profession: profile?.profession ?? "Healthcare Professional",
        specialty: profile?.specialty ?? null,
        country: wallet.country ?? profile?.country_of_residence ?? "Qatar",
        requiredCredits: wallet.required_credits ?? 80,
        completedCredits: wallet.completed_credits ?? 0,
        cycleEndDate: wallet.cycle_end_date ?? null,
        categoryBreakdown,
      }
    : null;

  // Fetch cached analysis — valid if is_current=true, not expired, and credits unchanged
  let cachedResult: GapAnalysis | null = null;
  let cachedAt: string | null = null;

  if (wallet) {
    const { data: cacheRow } = await admin
      .from("gap_analysis_cache")
      .select("result_json, created_at")
      .eq("professional_id", user.id)
      .eq("is_current", true)
      .eq("completed_credits", wallet.completed_credits ?? 0)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cacheRow) {
      cachedResult = cacheRow.result_json as GapAnalysis;
      cachedAt = cacheRow.created_at as string;
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111] mb-1">AI CME Gap Analysis</h1>
        <p className="text-sm text-[#64748b]">
          AI-powered analysis of your compliance gaps with personalised recommendations.
        </p>
      </div>

      <GapAnalysisClient
        initialData={initialData}
        cachedResult={cachedResult}
        cachedAt={cachedAt}
      />
    </div>
  );
}

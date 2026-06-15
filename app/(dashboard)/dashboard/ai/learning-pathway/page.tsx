import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserPlan, isPro } from "@/lib/subscription";
import { toCountryCode } from "@/lib/countryCode";
import LearningPathwayClient from "@/components/dashboard/LearningPathwayClient";

export const metadata = { title: "AI Learning Pathway — Hayya Med Pro" };

export default async function LearningPathwayPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [plan, walletRes] = await Promise.all([
    getUserPlan(user.id),
    admin
      .from("cme_wallets")
      .select("id, country, profession, specialty, required_credits, completed_credits, cycle_end_date")
      .eq("professional_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const wallet = walletRes.data;
  const proUser = isPro(plan);

  let gaps: { category: string; earned: number; needed: number }[] = [];

  if (wallet) {
    const countryCode = toCountryCode(wallet.country);
    const [activitiesRes, catRulesRes] = await Promise.all([
      admin
        .from("cme_activities")
        .select("category, credits, verification_status")
        .eq("professional_id", user.id)
        .eq("wallet_id", wallet.id),
      admin
        .from("compliance_activity_categories")
        .select("category_name, min_credits_per_cycle")
        .eq("country_code", countryCode)
        .gt("min_credits_per_cycle", 0),
    ]);

    const byCategory: Record<string, number> = {};
    for (const a of activitiesRes.data ?? []) {
      if (a.category && a.verification_status !== "rejected") {
        byCategory[a.category] = (byCategory[a.category] ?? 0) + a.credits;
      }
    }

    for (const rule of catRulesRes.data ?? []) {
      const earned = byCategory[rule.category_name] ?? 0;
      if (earned < rule.min_credits_per_cycle) {
        gaps.push({ category: rule.category_name, earned, needed: rule.min_credits_per_cycle - earned });
      }
    }

    const overallRemaining = wallet.required_credits - wallet.completed_credits;
    if (overallRemaining > 0 && gaps.length === 0) {
      gaps.push({ category: "general", earned: wallet.completed_credits, needed: overallRemaining });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">AI Learning Pathway</h1>
          <p className="text-sm text-[#64748b] mt-1">
            A personalized 12-month CPD plan built from your compliance gaps
          </p>
        </div>
        {proUser && (
          <span className="text-xs font-semibold bg-[#e8f0fe] text-[#1a56a0] px-3 py-1.5 rounded-full">
            ✦ Pro — AI active
          </span>
        )}
      </div>

      <LearningPathwayClient
        isPro={proUser}
        wallet={wallet ? {
          profession: wallet.profession,
          specialty: wallet.specialty ?? null,
          country: wallet.country,
          required_credits: wallet.required_credits,
          completed_credits: wallet.completed_credits,
          cycle_end_date: wallet.cycle_end_date ?? null,
        } : null}
        gaps={gaps}
      />
    </div>
  );
}

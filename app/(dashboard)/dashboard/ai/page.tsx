import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserPlan, isPro } from "@/lib/subscription";
import AiChat from "@/components/dashboard/AiChat";
import AiRecommendations from "@/components/dashboard/AiRecommendations";

export const metadata = { title: "AI Assistant — Hayya Med Pro" };

export type AiGap = { category: string; earned: number; needed: number };

export type WalletSummary = {
  country: string;
  profession: string;
  specialty: string | null;
  required_credits: number;
  completed_credits: number;
  compliance_status: string;
  cycle_end_date: string | null;
};

export default async function AiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [plan, walletRes] = await Promise.all([
    getUserPlan(user.id),
    admin.from("cme_wallets").select("country, profession, specialty, required_credits, completed_credits, compliance_status, cycle_end_date").eq("professional_id", user.id).order("created_at", { ascending: true }).limit(1).maybeSingle(),
  ]);

  const wallet = walletRes.data as WalletSummary | null;

  let gaps: AiGap[] = [];
  const daysLeft = wallet?.cycle_end_date
    ? Math.ceil((new Date(wallet.cycle_end_date).getTime() - Date.now()) / 86400000)
    : null;

  if (wallet) {
    const [activitiesRes, catRulesRes] = await Promise.all([
      admin.from("cme_activities").select("category, credits, verification_status").eq("professional_id", user.id),
      admin.from("compliance_activity_categories").select("category_name, min_credits_per_cycle").eq("country_code", wallet.country).gt("min_credits_per_cycle", 0),
    ]);

    const byCategory: Record<string, number> = {};
    for (const a of activitiesRes.data ?? []) {
      if (a.category && a.verification_status !== "rejected") {
        byCategory[a.category] = (byCategory[a.category] ?? 0) + a.credits;
      }
    }

    for (const cat of catRulesRes.data ?? []) {
      const earned = byCategory[cat.category_name] ?? 0;
      if (earned < cat.min_credits_per_cycle) {
        gaps.push({ category: cat.category_name, earned, needed: cat.min_credits_per_cycle - earned });
      }
    }

    const overallRemaining = wallet.required_credits - wallet.completed_credits;
    if (overallRemaining > 0 && gaps.length === 0) {
      gaps.push({ category: "general", earned: wallet.completed_credits, needed: overallRemaining });
    }
  }

  const proUser = isPro(plan);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">AI Compliance Assistant</h1>
          <p className="text-sm text-[#64748b] mt-1">Powered by Claude — your personal CME compliance advisor</p>
        </div>
        {!proUser && (
          <a href="/pricing?source=ai_page" className="flex items-center gap-1.5 text-xs font-semibold bg-[#1a56a0] text-white px-3 py-1.5 rounded-full hover:bg-[#1547a0] transition-colors">
            ✦ Upgrade to Pro
          </a>
        )}
        {proUser && (
          <span className="text-xs font-semibold bg-[#e8f0fe] text-[#1a56a0] px-3 py-1.5 rounded-full">
            ✦ Pro — AI active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AiChat isPro={proUser} hasWallet={!!wallet} />
        <AiRecommendations
          isPro={proUser}
          wallet={wallet}
          gaps={gaps}
          daysLeft={daysLeft}
        />
      </div>

      <p className="text-xs text-[#94a3b8] text-center">
        AI advice is for guidance only — always verify requirements with your regulatory authority (e.g. QCHP, SCFHS, DHA).
      </p>
    </div>
  );
}

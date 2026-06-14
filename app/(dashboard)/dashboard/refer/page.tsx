import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import ReferralSection from "@/components/dashboard/ReferralSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refer a Colleague — Hayya Med Pro",
  robots: { index: false },
};

export default async function ReferPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const [profileRes, countRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("referral_code, full_name")
      .eq("auth_id", user.id)
      .single(),
    admin
      .from("audit_logs")
      .select("*", { count: "exact", head: true })
      .eq("actor_auth_id", user.id)
      .eq("action", "referral.signup"),
  ]);

  const referralCode = profileRes.data?.referral_code ?? null;
  const referralCount = countRes.count ?? 0;
  const daysEarned = referralCount * 30;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111] tracking-tight">Refer a Colleague</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Invite fellow healthcare professionals to Hayya Med Pro. Both of you benefit.
        </p>
      </div>

      {/* Referral widget */}
      <ReferralSection initialCode={referralCode} referralCount={referralCount} />

      {/* Stats */}
      {referralCount > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#111] mb-4">Your referral impact</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[#1a56a0]">{referralCount}</p>
              <p className="text-xs text-[#64748b] mt-0.5">Colleagues joined</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#16a34a]">{daysEarned}</p>
              <p className="text-xs text-[#64748b] mt-0.5">Pro days earned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#d97706]">{referralCount * 30}</p>
              <p className="text-xs text-[#64748b] mt-0.5">Trial days gifted</p>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <h2 className="text-sm font-semibold text-[#111] mb-4">How it works</h2>
        <ol className="space-y-3">
          {[
            { step: "1", text: "Copy your unique referral link above" },
            { step: "2", text: "Share it with a colleague via WhatsApp, email, or LinkedIn" },
            { step: "3", text: "They sign up using your link and get a 30-day Pro trial" },
            { step: "4", text: "When they complete registration, you earn 30 free Pro days" },
          ].map(({ step, text }) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1a56a0] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {step}
              </span>
              <p className="text-sm text-[#374151]">{text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Terms note */}
      <p className="text-xs text-[#64748b] text-center">
        Referral bonuses are applied automatically when your referred colleague completes registration.
        One bonus per unique referral. Bonus Pro days are added to your current plan end date.
      </p>
    </div>
  );
}

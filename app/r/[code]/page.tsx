import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ code: string }>;
}

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const firstName = await getReferrerName(code);
  const title = firstName
    ? `${firstName} invited you to Hayya Med Pro`
    : "You've been invited to Hayya Med Pro";
  return {
    title,
    description: "Track your CME credits, stay compliant with your licensing authority, and download your official compliance report. Start your 30-day free trial.",
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description: "30-day free trial · No credit card required · GCC-ready CME & CPD tracking.",
      url: `${BASE}/r/${code}`,
    },
  };
}

async function getReferrerName(code: string): Promise<string | null> {
  if (!/^[a-zA-Z0-9_-]{4,32}$/.test(code)) return null;
  const admin = createAdminClient();
  const { data } = await admin
    .from("professional_profiles")
    .select("full_name")
    .eq("referral_code", code)
    .maybeSingle();
  if (!data?.full_name) return null;
  return data.full_name.trim().split(/\s+/)[0] ?? null;
}

export default async function ReferralPage({ params }: Props) {
  const { code } = await params;

  if (!/^[a-zA-Z0-9_-]{4,32}$/.test(code)) {
    redirect("/register");
  }

  const firstName = await getReferrerName(code);

  if (!firstName) {
    redirect(`/register`);
  }

  const registerUrl = `/register?ref=${encodeURIComponent(code)}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
        </div>
        <span className="text-base font-bold text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
      </a>

      <div className="w-full max-w-md">
        {/* Invitation card */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] px-8 py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#1a56a0] border-2 border-[rgba(255,255,255,0.2)] mx-auto mb-4 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{firstName[0].toUpperCase()}</span>
            </div>
            <p className="text-[rgba(255,255,255,0.7)] text-sm mb-1">Personal invitation from</p>
            <h1 className="text-xl font-bold text-white">{firstName}</h1>
          </div>

          <div className="px-8 py-7">
            <h2 className="text-lg font-bold text-[#111] text-center mb-1">
              You&rsquo;re invited to Hayya Med Pro
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-6">
              Track your CME credits, stay compliant with your licensing authority, and generate your official compliance report — all in one place.
            </p>

            {/* Trial highlight */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3.5 mb-6 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#16a34a] flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#15803d]">30-day free trial — exclusively via this invite</p>
                <p className="text-xs text-[#166534] mt-0.5">Standard trial is 14 days. {firstName}&rsquo;s invite doubles your trial. No credit card required.</p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2.5 mb-7">
              {[
                "CME & CPD credit tracking for QCHP, SCFHS, DHA, and more",
                "AI-powered compliance gap analysis",
                "PDF compliance report — ready to submit to your authority",
                "License expiry tracking and renewal alerts",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#1a56a0] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-sm text-[#374151]">{f}</span>
                </li>
              ))}
            </ul>

            <a
              href={registerUrl}
              className="block w-full bg-[#1a56a0] hover:bg-[#154890] text-white font-semibold text-sm text-center py-3.5 rounded-xl transition-colors"
            >
              Accept {firstName}&rsquo;s Invitation →
            </a>
            <p className="text-center text-xs text-[#94a3b8] mt-3">
              30-day trial · No credit card required · Cancel anytime
            </p>
          </div>
        </div>

        {/* Footer trust */}
        <div className="flex items-center justify-center gap-6 text-xs text-[#94a3b8]">
          <span>QCHP · SCFHS · DHA · DOH</span>
          <span>·</span>
          <a href="/privacy" className="hover:text-[#64748b]">Privacy</a>
          <span>·</span>
          <a href="/terms" className="hover:text-[#64748b]">Terms</a>
        </div>
      </div>
    </div>
  );
}

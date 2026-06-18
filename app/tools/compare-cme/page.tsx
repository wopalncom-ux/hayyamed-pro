import { createAdminClient } from "@/lib/supabase/server";
import CompareToolClient from "./CompareToolClient";
import SiteFooter from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GCC CME Requirements Comparison Tool 2026 | Hayya Med Pro",
  description:
    "Compare CME and CPD credit requirements side by side across Qatar (QCHP), Saudi Arabia (SCFHS), UAE (DHA/DOH), Kuwait, Bahrain, and Oman. Free interactive comparison tool for GCC healthcare professionals.",
  openGraph: {
    title: "GCC CME Requirements Comparison 2026",
    description:
      "Interactive tool: compare CME credit requirements across all 6 GCC countries. QCHP vs SCFHS vs DHA — see credits, cycle length, and online caps side by side.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GCC CME Requirements Comparison Tool",
  url: "https://hayyamed.pro/tools/compare-cme",
  applicationCategory: "HealthcareApplication",
  description:
    "Compare CME and CPD credit requirements across GCC healthcare licensing authorities.",
  provider: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default async function CompareToolPage() {
  const admin = createAdminClient();
  const { data: rules } = await admin
    .from("country_compliance_rules")
    .select(
      "country_code, country_name, total_credits_required, credit_terminology, cycle_years, online_credits_max_pct, mandatory_credits_min"
    )
    .order("country_name");

  const GCC_ORDER = ["QA", "SA", "AE", "KW", "BH", "OM"];
  const sorted = (rules ?? []).sort((a, b) => {
    const ai = GCC_ORDER.indexOf(a.country_code);
    const bi = GCC_ORDER.indexOf(b.country_code);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Minimal header */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</a>
            <div className="flex items-center gap-3">
              <a href="/login" className="text-sm text-[#64748b] hover:text-[#111] transition-colors">Sign in</a>
              <a
                href="/register"
                className="text-sm font-semibold bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors"
              >
                Start free
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-10">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] text-[#1e40af] text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-[#bfdbfe]">
              Free comparison tool
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111] mb-3 tracking-tight">
              GCC CME Requirements<br className="hidden sm:block" /> Comparison 2026
            </h1>
            <p className="text-[#64748b] text-base max-w-xl mx-auto">
              Compare Continuing Medical Education credit requirements across all six GCC
              healthcare licensing authorities — side by side, in seconds.
            </p>
          </div>

          {/* Authority quick reference */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
            {[
              { code: "QA", auth: "QCHP", flag: "🇶🇦" },
              { code: "SA", auth: "SCFHS", flag: "🇸🇦" },
              { code: "AE", auth: "DHA/DOH", flag: "🇦🇪" },
              { code: "KW", auth: "MOH", flag: "🇰🇼" },
              { code: "BH", auth: "NHRA", flag: "🇧🇭" },
              { code: "OM", auth: "OMSB", flag: "🇴🇲" },
            ].map(({ code, auth, flag }) => (
              <div key={code} className="bg-white rounded-xl border border-[#e2e8f0] p-3 text-center">
                <div className="text-xl mb-1">{flag}</div>
                <p className="text-[10px] font-bold text-[#111]">{auth}</p>
              </div>
            ))}
          </div>

          {/* Interactive comparison tool */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-7 mb-8">
            <h2 className="text-lg font-bold text-[#111] mb-1">Interactive Comparison</h2>
            <p className="text-xs text-[#64748b] mb-5">
              Select your profession and the countries you hold or plan to hold licenses in.
            </p>
            <CompareToolClient rules={sorted} />
          </div>

          {/* How to use this tool */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-7 mb-8">
            <h2 className="text-lg font-bold text-[#111] mb-4">How to use this comparison</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  step: "1",
                  title: "Select your profession",
                  desc: "Requirements can vary by profession within the same country.",
                },
                {
                  step: "2",
                  title: "Pick your countries",
                  desc: "Select every country where you hold a license or plan to practice.",
                },
                {
                  step: "3",
                  title: "Plan your CME",
                  desc: "The most demanding cycle sets your baseline. Activities that count in one country often count in others.",
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a56a0] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111] mb-1">{title}</p>
                    <p className="text-xs text-[#64748b] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ section */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sm:p-7 mb-8">
            <h2 className="text-lg font-bold text-[#111] mb-4">Frequently asked questions</h2>
            <div className="space-y-5">
              {[
                {
                  q: "Can CME credits earned in one GCC country count toward another country's requirements?",
                  a: "It depends on the activity and the authority. Internationally accredited activities (e.g., accredited by ACCME, EACCME) are generally accepted across GCC authorities. Locally accredited activities (e.g., QCHP-only accreditation) may need to be verified by the second authority before they count.",
                },
                {
                  q: "What is the difference between CME and CPD?",
                  a: "CME (Continuing Medical Education) traditionally refers to formal medical education activities. CPD (Continuing Professional Development) is a broader concept that includes non-clinical professional skills. Qatar and Bahrain use 'CPD' terminology; Saudi Arabia and Oman prefer 'CME'. In practice, GCC authorities accept similar activity types under both frameworks.",
                },
                {
                  q: "What happens if I don't complete my CME requirements on time?",
                  a: "Your license renewal will be withheld until the shortfall is addressed. In most GCC countries this means a gap in your active license status, which affects your right to practice. Some authorities impose a grace period; others do not. Never let your cycle expire without completing the required credits.",
                },
                {
                  q: "How do I track CME for multiple GCC licenses?",
                  a: "Hayya Med Pro supports multi-country CME tracking — each license has its own wallet with the correct cycle length, credit requirement, and category rules. The AI gap analysis shows exactly what you still need for each authority before your renewal date.",
                },
              ].map(({ q, a }) => (
                <div key={q}>
                  <p className="text-sm font-semibold text-[#111] mb-1.5">{q}</p>
                  <p className="text-sm text-[#64748b] leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#64748b] text-center">
            Requirements are sourced from official GCC healthcare authority publications and are reviewed regularly.
            Always verify current requirements with QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, or OMSB directly.
          </p>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}

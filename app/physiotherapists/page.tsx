import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CPD Requirements for Physiotherapists 2026 — GCC & Global PT Guide | Hayya Med Pro",
  description:
    "Complete CPD and CME requirements for physiotherapists worldwide. Qatar QCHP (80 CPD/2yr), Saudi SCFHS (40-60/yr), UAE DHA (40/2yr), UK HCPC (30 hours/2yr), Australia AHPRA. Track physio CPD automatically.",
  keywords: [
    "CPD requirements physiotherapists",
    "physiotherapist CME GCC",
    "physiotherapist CPD requirements",
    "QCHP physiotherapist CPD",
    "SCFHS physiotherapy CME",
    "HCPC CPD physiotherapy UK",
    "AHPRA CPD physiotherapy",
    "PT license renewal CPD",
    "physical therapy continuing education",
    "allied health CPD GCC",
  ],
  openGraph: {
    title: "CPD Requirements for Physiotherapists 2026",
    description: "Qatar · Saudi Arabia · UAE · UK · Australia — physiotherapist CPD requirements worldwide.",
    url: `${BASE}/physiotherapists`,
    type: "website",
    images: [{ url: `${BASE}/api/og?title=CPD+Requirements+for+Physiotherapists+2026`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CPD Requirements for Physiotherapists 2026",
    description: "Physiotherapist CPD requirements for Qatar, Saudi Arabia, UAE, UK, Australia and more.",
  },
  alternates: { canonical: `${BASE}/physiotherapists` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do physiotherapists need in Qatar (QCHP)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Physiotherapists in Qatar must complete 80 CPD credits per 2-year cycle (40 per year minimum), governed by QCHP / DHP-AS under the Ministry of Public Health. This applies to all physiotherapy specialties including musculoskeletal, neurological, paediatric, sports, and cardiac rehabilitation.",
      },
    },
    {
      "@type": "Question",
      name: "What CPD activities count for physiotherapists in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GCC licensing authorities accept: accredited physiotherapy conferences and workshops; hands-on skills training (manual therapy, ultrasound, exercise prescription); online CPD modules; peer learning and journal clubs; and research or teaching activities. Hayya Med Pro helps you log all these activity types with the correct credit values.",
      },
    },
    {
      "@type": "Question",
      name: "Do physiotherapists need the same CME as doctors and nurses in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — in most GCC countries, physiotherapists, doctors, and nurses are all required to complete the same total credit requirement (e.g., 80 CPD per 2 years in Qatar). However, the mandatory topics and accepted activities may be profession-specific. QCHP, SCFHS, and DHA all apply the same credit totals to all licensed healthcare professionals.",
      },
    },
  ],
};

const breadcrumbs = [
  { name: "Home", url: BASE },
  { name: "Physiotherapists", url: `${BASE}/physiotherapists` },
];

export default function PhysiotherapistsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="min-h-screen bg-[#f8fafc]">
        <nav className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-[#1a56a0] text-lg">
            <span className="w-7 h-7 rounded-lg bg-[#1a56a0] flex items-center justify-center text-white text-sm font-black">H</span>
            Hayya Med Pro
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/doctors" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">Doctors</Link>
            <Link href="/nurses" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">Nurses</Link>
            <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">Start free</Link>
          </div>
        </nav>

        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl" aria-hidden="true">🏃</span>
              <span className="text-xs font-bold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full uppercase tracking-wide">Physiotherapists · Allied Health</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-5 leading-tight max-w-3xl">
              CPD requirements for physiotherapists — every country, every authority
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-8">
              Physiotherapists worldwide must complete CPD to maintain their registration.
              Hayya Med Pro tracks your compliance automatically across GCC countries and internationally,
              so you never miss a renewal deadline.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my physio CPD — free
              </Link>
              <Link href="/allied-health-cpd" className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                Allied health CPD guide →
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-14">

          <section aria-labelledby="requirements-heading">
            <h2 id="requirements-heading" className="text-2xl font-bold text-[#0f1f3d] mb-5">Physiotherapist CPD requirements by country</h2>
            <div className="space-y-3">
              {[
                { flag: "🇶🇦", country: "Qatar", authority: "QCHP / DHP-AS", credits: "80 CPD", cycle: "2 years", slug: "qatar" },
                { flag: "🇸🇦", country: "Saudi Arabia", authority: "SCFHS", credits: "40–60 CME", cycle: "1–3 years", slug: "saudi-arabia" },
                { flag: "🇦🇪", country: "UAE (Dubai)", authority: "DHA", credits: "40 CME", cycle: "2 years", slug: "uae" },
                { flag: "🇧🇭", country: "Bahrain", authority: "NHRA", credits: "40 CPD", cycle: "2 years", slug: "bahrain" },
                { flag: "🇰🇼", country: "Kuwait", authority: "MOH", credits: "30 CME", cycle: "1 year", slug: "kuwait" },
                { flag: "🇴🇲", country: "Oman", authority: "OMSB", credits: "40 CME", cycle: "2 years", slug: "oman" },
                { flag: "🇬🇧", country: "United Kingdom", authority: "HCPC", credits: "30 hours CPD", cycle: "2 years", slug: "united-kingdom" },
                { flag: "🇦🇺", country: "Australia", authority: "AHPRA / APA", credits: "Varies", cycle: "Annual", slug: "australia" },
              ].map(({ flag, country, authority, credits, cycle, slug }) => (
                <div key={`${country}-${authority}`} className="bg-white border border-[#e2e8f0] rounded-xl px-6 py-4 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">{flag}</span>
                    <div>
                      <p className="font-semibold text-[#0f1f3d] text-sm">{country}</p>
                      <p className="text-xs text-[#64748b]">{authority}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="font-bold text-[#1a56a0] text-sm">{credits}</p>
                      <p className="text-xs text-[#64748b]">{cycle}</p>
                    </div>
                    <Link href={`/${slug}/cme`} className="text-xs font-semibold text-[#1a56a0] border border-[#c7daf7] px-3 py-1.5 rounded-lg hover:bg-[#f0f7ff] transition-colors">
                      Full guide →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">Physiotherapist CPD — frequently asked questions</h2>
            <div className="space-y-4">
              {faqLd.mainEntity.map(q => (
                <div key={q.name} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                  <h3 className="font-semibold text-[#0f1f3d] mb-2">{q.name}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="professions-heading">
            <h2 id="professions-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">Other healthcare professions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Doctors", href: "/doctors", icon: "🩺" },
                { name: "Nurses", href: "/nurses", icon: "👩‍⚕️" },
                { name: "Pharmacists", href: "/pharmacists", icon: "💊" },
                { name: "Dentists", href: "/dentists", icon: "🦷" },
              ].map(({ name, href, icon }) => (
                <Link key={href} href={href} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all text-center">
                  <span className="text-2xl block mb-2" aria-hidden="true">{icon}</span>
                  <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">{name}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-[#1a56a0] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Track your physio CPD — free</h2>
            <p className="text-white/75 mb-6 max-w-md mx-auto text-sm">
              Hayya Med Pro tracks CPD for physiotherapists and allied health professionals across GCC and globally.
            </p>
            <Link href="/register" className="inline-block bg-white text-[#1a56a0] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              Start free — 3 minutes
            </Link>
          </section>

          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports CPD tracking for physiotherapists and allied health professionals. It does not issue licenses.
            Verify requirements with QCHP, SCFHS, HCPC, AHPRA, or your relevant authority.
          </p>
        </main>
      </div>
    </>
  );
}

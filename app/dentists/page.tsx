import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CME Requirements for Dentists 2026 — GCC & Global Dentist CME Guide | Hayya Med Pro",
  description:
    "Complete CME and CPD requirements for dentists worldwide. Qatar QCHP (80 CPD/2yr), Saudi SCFHS (40-60 CME/yr), UAE DHA (40/2yr), UK GDC (100 CPD/5yr). Track dentist CME automatically.",
  keywords: [
    "CME requirements dentists",
    "dentist CPD requirements",
    "dentist CME GCC",
    "QCHP dentist CPD",
    "SCFHS dentist CME",
    "GDC CPD dentists UK",
    "dentist license renewal",
    "dental CPD continuing education",
    "oral surgeon CME GCC",
    "orthodontist CME",
  ],
  openGraph: {
    title: "CME Requirements for Dentists 2026",
    description: "Qatar · Saudi Arabia · UAE · UK — dentist CME and CPD requirements worldwide.",
    url: `${BASE}/dentists`,
    type: "website",
    images: [{ url: `${BASE}/api/og?title=CME+Requirements+for+Dentists+2026`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CME Requirements for Dentists 2026",
    description: "Dentist CME and CPD requirements for Qatar, Saudi Arabia, UAE, UK and more.",
  },
  alternates: { canonical: `${BASE}/dentists` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do dentists need in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dentists in Qatar must complete 80 CPD credits per 2-year cycle (40 per year minimum), required by QCHP / DHP-AS. This applies to general dentists, orthodontists, oral surgeons, paediatric dentists, and all other dental specialties. Accepted categories include accredited education (conferences, workshops, online modules), self-directed learning, professional activities, and teaching/research.",
      },
    },
    {
      "@type": "Question",
      name: "What dental CME activities are accepted in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS accepts: accredited dental conferences and workshops; online dental CME modules; hands-on dental skills training (implants, endodontics, etc.); research publications; and teaching activities. Dentists submit CPD records through the Mumaris+ portal for license renewal.",
      },
    },
    {
      "@type": "Question",
      name: "Do hands-on dental skills workshops count as CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hands-on dental skills workshops — implant training, endodontic masterclasses, orthodontic workshops, digital dentistry courses — are accepted as Category A (accredited education) CME by QCHP, SCFHS, DHA, and most other licensing authorities. They are often valued more highly than purely didactic learning.",
      },
    },
  ],
};

const breadcrumbs = [
  { name: "Home", url: BASE },
  { name: "Dentists", url: `${BASE}/dentists` },
];

export default function DentistsPage() {
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
              <span className="text-4xl" aria-hidden="true">🦷</span>
              <span className="text-xs font-bold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full uppercase tracking-wide">Dentists · GCC & Global</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-5 leading-tight max-w-3xl">
              CME requirements for dentists — every country, every authority
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-8">
              Dentists worldwide must complete CME or CPD to renew their dental license.
              Hayya Med Pro tracks your compliance automatically — whether you're a general dentist,
              oral surgeon, orthodontist, or specialist practicing in GCC or internationally.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my dental CME — free
              </Link>
              <Link href="/dentist-cme" className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                Dentist CME guide →
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-14">

          <section aria-labelledby="requirements-heading">
            <h2 id="requirements-heading" className="text-2xl font-bold text-[#0f1f3d] mb-5">Dentist CME requirements by country</h2>
            <div className="space-y-3">
              {[
                { flag: "🇶🇦", country: "Qatar", authority: "QCHP / DHP-AS", credits: "80 CPD", cycle: "2 years", slug: "qatar" },
                { flag: "🇸🇦", country: "Saudi Arabia", authority: "SCFHS", credits: "40–60 CME", cycle: "1–3 years", slug: "saudi-arabia" },
                { flag: "🇦🇪", country: "UAE (Dubai)", authority: "DHA", credits: "40 CME", cycle: "2 years", slug: "uae" },
                { flag: "🇧🇭", country: "Bahrain", authority: "NHRA", credits: "40 CPD", cycle: "2 years", slug: "bahrain" },
                { flag: "🇰🇼", country: "Kuwait", authority: "MOH", credits: "30 CME", cycle: "1 year", slug: "kuwait" },
                { flag: "🇴🇲", country: "Oman", authority: "OMSB", credits: "40 CME", cycle: "2 years", slug: "oman" },
                { flag: "🇬🇧", country: "United Kingdom", authority: "GDC", credits: "100 CPD hours", cycle: "5 years", slug: "united-kingdom" },
                { flag: "🇦🇺", country: "Australia", authority: "AHPRA / ADA", credits: "60 CPD hours", cycle: "3 years", slug: "australia" },
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
            <h2 id="faq-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">Dentist CME — frequently asked questions</h2>
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
                { name: "Physiotherapists", href: "/physiotherapists", icon: "🏃" },
              ].map(({ name, href, icon }) => (
                <Link key={href} href={href} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all text-center">
                  <span className="text-2xl block mb-2" aria-hidden="true">{icon}</span>
                  <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">{name}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-[#1a56a0] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Track your dental CME — free</h2>
            <p className="text-white/75 mb-6 max-w-md mx-auto text-sm">
              Hayya Med Pro tracks CME for dentists across GCC and globally. Log activities, upload certificates, download your compliance report.
            </p>
            <Link href="/register" className="inline-block bg-white text-[#1a56a0] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              Start free — 3 minutes
            </Link>
          </section>

          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports CME/CPD tracking for dentists. It does not issue licenses.
            Verify requirements with QCHP, SCFHS, GDC, AHPRA, or your relevant authority.
          </p>
        </main>
      </div>
    </>
  );
}

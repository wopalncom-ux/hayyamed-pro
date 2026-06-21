import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CME Requirements for Pharmacists 2026 â€” GCC & Global Pharmacist CPD Guide | Hayya Med Pro",
  description:
    "Complete CME and CPD requirements for pharmacists worldwide. Qatar QCHP (80 CPD/2yr), Saudi SCFHS (40-60 CME/yr), UAE DHA (40/2yr), UK GPhC (35 hours/yr). Track pharmacist CME automatically.",
  keywords: [
    "CME requirements pharmacists",
    "pharmacist CPD requirements",
    "pharmacist CME GCC",
    "QCHP pharmacist CPD",
    "SCFHS pharmacist CME",
    "GPhC CPD pharmacists UK",
    "pharmacist license renewal",
    "pharmacy CPD continuing education",
    "clinical pharmacist CME",
    "hospital pharmacist CPD",
  ],
  openGraph: {
    title: "CME Requirements for Pharmacists 2026",
    description: "Qatar Â· Saudi Arabia Â· UAE Â· UK â€” pharmacist CME and CPD requirements worldwide.",
    url: `${BASE}/pharmacists`,
    type: "website",
    images: [{ url: `${BASE}/api/og?title=CME+Requirements+for+Pharmacists+2026`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CME Requirements for Pharmacists 2026",
    description: "Pharmacist CPD and CME requirements for Qatar, Saudi Arabia, UAE, UK and more.",
  },
  alternates: { canonical: `${BASE}/pharmacists` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do pharmacists need in Qatar (QCHP)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pharmacists in Qatar must complete 80 CPD credits per 2-year cycle (40 per year minimum), required by QCHP / DHP-AS under the Ministry of Public Health. Both clinical pharmacists and dispensing pharmacists are covered. Accepted categories include accredited education (conferences, workshops, online modules), self-directed learning, professional activities, and teaching/research.",
      },
    },
    {
      "@type": "Question",
      name: "What CME activities are accepted for pharmacists in Saudi Arabia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS (Saudi Commission for Health Specialties) accepts: conferences and workshops accredited by SCFHS or international pharmacy bodies; online pharmacy CME modules; clinical pharmacy training; research publications; and teaching activities. Pharmacists must complete 40â€“60 credits per cycle through the Mumaris+ portal.",
      },
    },
    {
      "@type": "Question",
      name: "Do online pharmacy CPD modules count in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All GCC licensing authorities accept online pharmacy CPD modules as valid CME activities. Clinical pharmacists and hospital pharmacists in Qatar, Saudi Arabia, UAE, and other GCC countries can complete a significant portion of their CPD requirements through accredited online courses.",
      },
    },
  ],
};

const breadcrumbs = [
  { name: "Home", url: BASE },
  { name: "Pharmacists", url: `${BASE}/pharmacists` },
];

export default function PharmacistsPage() {
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
              <span className="text-4xl" aria-hidden="true">ðŸ’Š</span>
              <span className="text-xs font-bold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full uppercase tracking-wide">Pharmacists Â· GCC & Global</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-5 leading-tight max-w-3xl">
              CME requirements for pharmacists â€” every country, every authority
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-8">
              Pharmacists worldwide must complete CME or CPD to renew their pharmacy license.
              Whether you're a hospital pharmacist in Qatar, a clinical pharmacist in Saudi Arabia,
              or a community pharmacist in the UAE â€” Hayya Med Pro tracks your compliance automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my pharmacy CME â€” free
              </Link>
              <Link href="/pharmacist-cme" className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                Pharmacist CME guide â†’
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-14">

          {/* Country requirements */}
          <section aria-labelledby="requirements-heading">
            <h2 id="requirements-heading" className="text-2xl font-bold text-[#0f1f3d] mb-5">Pharmacist CME requirements by country</h2>
            <div className="space-y-3">
              {[
                { flag: "ðŸ‡¶ðŸ‡¦", country: "Qatar", authority: "QCHP / DHP-AS", credits: "80 CPD", cycle: "2 years", slug: "qatar" },
                { flag: "ðŸ‡¸ðŸ‡¦", country: "Saudi Arabia", authority: "SCFHS", credits: "40â€“60 CME", cycle: "1â€“3 years", slug: "saudi-arabia" },
                { flag: "ðŸ‡¦ðŸ‡ª", country: "UAE (Dubai)", authority: "DHA", credits: "40 CME", cycle: "2 years", slug: "uae" },
                { flag: "ðŸ‡§ðŸ‡­", country: "Bahrain", authority: "NHRA", credits: "40 CPD", cycle: "2 years", slug: "bahrain" },
                { flag: "ðŸ‡°ðŸ‡¼", country: "Kuwait", authority: "MOH", credits: "30 CME", cycle: "1 year", slug: "kuwait" },
                { flag: "ðŸ‡´ðŸ‡²", country: "Oman", authority: "OMSB", credits: "40 CME", cycle: "2 years", slug: "oman" },
                { flag: "ðŸ‡¬ðŸ‡§", country: "United Kingdom", authority: "GPhC", credits: "35 hours CPD", cycle: "Annual", slug: "united-kingdom" },
                { flag: "ðŸ‡¦ðŸ‡º", country: "Australia", authority: "AHPRA / PSA", credits: "40 hours CPD", cycle: "Annual", slug: "australia" },
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
                      Full guide â†’
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">Pharmacist CME â€” frequently asked questions</h2>
            <div className="space-y-4">
              {faqLd.mainEntity.map(q => (
                <div key={q.name} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                  <h3 className="font-semibold text-[#0f1f3d] mb-2">{q.name}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Other professions */}
          <section aria-labelledby="professions-heading">
            <h2 id="professions-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">Other healthcare professions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Doctors", url: "/doctors", icon: "ðŸ©º" },
                { name: "Nurses", url: "/nurses", icon: "ðŸ‘©â€âš•ï¸" },
                { name: "Dentists", url: "/dentists", icon: "ðŸ¦·" },
                { name: "Physiotherapists", url: "/physiotherapists", icon: "ðŸƒ" },
              ].map(({ name, url: href, icon }) => (
                <Link key={href} href={href} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all text-center">
                  <span className="text-2xl block mb-2" aria-hidden="true">{icon}</span>
                  <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">{name}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-[#1a56a0] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Track your pharmacy CME â€” free</h2>
            <p className="text-white/75 mb-6 max-w-md mx-auto text-sm">
              Hayya Med Pro is built for pharmacists in GCC and globally. Track credits, upload certificates, download your compliance report.
            </p>
            <Link href="/register" className="inline-block bg-white text-[#1a56a0] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              Start free â€” 3 minutes
            </Link>
          </section>

          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports CME/CPD tracking for pharmacists. It does not issue licenses.
            Verify requirements with QCHP, SCFHS, GPhC, AHPRA, or your relevant authority.
          </p>
        </main>
      </div>
    </>
  );
}



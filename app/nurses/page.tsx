import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CPD Requirements for Nurses 2026 â€” Nurse CME Guide (GCC & Global) | Hayya Med Pro",
  description:
    "Complete CPD and CME requirements for nurses worldwide. Qatar QCHP (80 CPD/2yr), Saudi SCFHS (40-60 CME/yr), UAE DHA (40/2yr), UK NMC (35 hours/yr), Australia AHPRA. Track nurse CPD automatically.",
  keywords: [
    "CPD requirements for nurses",
    "nurse CME requirements",
    "nurse CPD GCC",
    "QCHP nurse CPD",
    "SCFHS nurse CME",
    "NMC CPD nurses UK",
    "AHPRA CPD nurses Australia",
    "ICU nurse CME",
    "registered nurse CPD",
    "nurse license renewal CPD",
    "nursing continuing education",
  ],
  openGraph: {
    title: "CPD Requirements for Nurses 2026 â€” All Countries",
    description: "Qatar Â· Saudi Arabia Â· UAE Â· UK Â· Australia â€” nurse CPD and CME requirements worldwide.",
    url: `${BASE}/nurses`,
    type: "website",
    images: [{ url: `${BASE}/api/og?title=CPD+Requirements+for+Nurses+2026`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CPD Requirements for Nurses 2026 â€” All Countries",
    description: "Nurse CPD and CME requirements for Qatar, Saudi Arabia, UAE, UK, Australia and more.",
  },
  alternates: { canonical: `${BASE}/nurses` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do nurses need in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GCC CPD requirements for nurses: Qatar (QCHP) â€” 80 CPD credits per 2-year cycle; Saudi Arabia (SCFHS) â€” 40â€“60 credits per 1â€“3 years; UAE Dubai (DHA) â€” 40 credits per 2 years; UAE Abu Dhabi (DOH) â€” 30â€“50 credits per 2 years; Kuwait (MOH) â€” 30 credits annually; Bahrain (NHRA) â€” 40 credits per 2 years; Oman (OMSB) â€” 40 credits per 2 years.",
      },
    },
    {
      "@type": "Question",
      name: "Can nurses complete CPD online in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All GCC licensing authorities accept online CPD for nurses, including QCHP Qatar, SCFHS Saudi Arabia, and DHA Dubai. Online nursing CPD â€” webinars, e-learning modules, and accredited online courses â€” counts toward the same credit requirement as in-person attendance. Many nurses in GCC prefer online CPD for flexibility around shift work.",
      },
    },
    {
      "@type": "Question",
      name: "Do nurses and doctors have the same CME requirements in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nurses and doctors typically have the same credit requirement within a given country (e.g., both need 80 CPD per 2 years in Qatar), but the accepted categories and mandatory topics may differ. Nursing CPD may place more emphasis on clinical skills, patient safety, and specialty nursing competencies. Hayya Med Pro tracks CPD for both nurses and physicians with the same system.",
      },
    },
    {
      "@type": "Question",
      name: "What CPD activities count for nurses in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS accepts: accredited conferences and workshops; accredited online courses; clinical skills training; peer learning and journal clubs; research participation; and teaching activities. SCFHS Mumaris+ portal is where Saudi nurses submit CPD records for license renewal.",
      },
    },
  ],
};

const breadcrumbs = [
  { name: "Home", url: BASE },
  { name: "Nurses", url: `${BASE}/nurses` },
];

const NURSING_SPECIALTIES = [
  { name: "ICU / Critical Care", url: "/cme/critical-care/qatar", icon: "ðŸ¥" },
  { name: "Emergency Nursing", url: "/cme/emergency-medicine/saudi-arabia", icon: "ðŸš¨" },
  { name: "Paediatric Nursing", url: "/cme/pediatrics/uae", icon: "ðŸ‘¶" },
  { name: "Oncology Nursing", url: "/cme/oncology/qatar", icon: "ðŸŽ—ï¸" },
  { name: "Midwifery", url: "/nurse-cpd", icon: "ðŸ¤°" },
  { name: "Theatre / OR Nursing", url: "/nurse-cpd", icon: "ðŸ”¬" },
  { name: "Ward / General Nursing", url: "/nurse-cpd", icon: "ðŸ©º" },
  { name: "Community Nursing", url: "/nurse-cpd", icon: "ðŸ¡" },
];

export default function NursesPage() {
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
            <Link href="/pharmacists" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">Pharmacists</Link>
            <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">Start free</Link>
          </div>
        </nav>

        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl" aria-hidden="true">ðŸ‘©â€âš•ï¸</span>
              <span className="text-xs font-bold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full uppercase tracking-wide">Registered Nurses Â· GCC & Global</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-5 leading-tight max-w-3xl">
              CPD requirements for nurses â€” every country, every authority
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-8">
              Registered nurses worldwide must complete CPD or CME to renew their nursing license.
              Requirements differ by country and nursing specialty. Hayya Med Pro tracks your compliance
              automatically, whether you practice in Qatar, Saudi Arabia, UAE, UK, or Australia.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my nursing CPD â€” free
              </Link>
              <Link href="/nurse-cpd" className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                Nurse CPD guide â†’
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-14">

          {/* GCC requirements */}
          <section aria-labelledby="gcc-heading">
            <h2 id="gcc-heading" className="text-2xl font-bold text-[#0f1f3d] mb-5">Nurse CPD requirements by GCC country</h2>
            <div className="space-y-3">
              {[
                { flag: "ðŸ‡¶ðŸ‡¦", country: "Qatar", authority: "QCHP / DHP-AS", credits: "80 CPD", cycle: "2 years", terminology: "CPD", slug: "qatar" },
                { flag: "ðŸ‡¸ðŸ‡¦", country: "Saudi Arabia", authority: "SCFHS", credits: "40â€“60 CME", cycle: "1â€“3 years", terminology: "CME", slug: "saudi-arabia" },
                { flag: "ðŸ‡¦ðŸ‡ª", country: "UAE (Dubai)", authority: "DHA", credits: "40 CME", cycle: "2 years", terminology: "CME", slug: "uae" },
                { flag: "ðŸ‡¦ðŸ‡ª", country: "UAE (Abu Dhabi)", authority: "DOH", credits: "30â€“50 CPD", cycle: "2 years", terminology: "CPD", slug: "uae" },
                { flag: "ðŸ‡§ðŸ‡­", country: "Bahrain", authority: "NHRA", credits: "40 CPD", cycle: "2 years", terminology: "CPD", slug: "bahrain" },
                { flag: "ðŸ‡°ðŸ‡¼", country: "Kuwait", authority: "MOH", credits: "30 CME", cycle: "1 year", terminology: "CME", slug: "kuwait" },
                { flag: "ðŸ‡´ðŸ‡²", country: "Oman", authority: "OMSB", credits: "40 CME", cycle: "2 years", terminology: "CME", slug: "oman" },
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

          {/* Nursing specialties */}
          <section aria-labelledby="specialties-heading">
            <h2 id="specialties-heading" className="text-2xl font-bold text-[#0f1f3d] mb-5">CPD by nursing specialty</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {NURSING_SPECIALTIES.map(({ name, url: href, icon }) => (
                <Link key={name} href={href} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all text-center">
                  <span className="text-2xl block mb-2" aria-hidden="true">{icon}</span>
                  <p className="text-xs font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0] leading-tight">{name}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">Nurse CPD â€” frequently asked questions</h2>
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
                { name: "Pharmacists", url: "/pharmacists", icon: "ðŸ’Š" },
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
            <h2 className="text-2xl font-bold mb-3">Track your nursing CPD â€” free</h2>
            <p className="text-white/75 mb-6 max-w-md mx-auto text-sm">
              Hayya Med Pro tracks nursing CPD for all GCC countries and alerts you before every renewal deadline.
            </p>
            <Link href="/register" className="inline-block bg-white text-[#1a56a0] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              Start free â€” 3 minutes
            </Link>
          </section>

          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports CPD tracking and licensing readiness for nurses. It does not issue licenses.
            Verify requirements with QCHP, SCFHS, DHA, NMC, AHPRA, or your relevant authority.
          </p>
        </main>
      </div>
    </>
  );
}



import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CME Requirements for Doctors 2026 â€” Physician CME Guide (GCC & Global) | Hayya Med Pro",
  description:
    "Complete CME and CPD requirements for doctors and physicians worldwide. Qatar QCHP (80 CPD/2yr), Saudi SCFHS (40-60 CME/yr), UAE DHA/DOH (40/2yr), UK GMC (50 CPD/yr), Australia AHPRA. Track your physician CME automatically.",
  keywords: [
    "CME requirements for doctors",
    "physician CME requirements",
    "doctor CPD requirements",
    "CME requirements GCC doctors",
    "physician license renewal CME",
    "QCHP doctor CPD",
    "SCFHS physician CME",
    "DHA doctor CME",
    "GMC CPD requirements doctors",
    "AHPRA CPD doctors",
    "continuing medical education doctors",
    "doctor license renewal CME",
  ],
  openGraph: {
    title: "CME Requirements for Doctors 2026 â€” All Countries",
    description: "Qatar Â· Saudi Arabia Â· UAE Â· UK Â· Australia Â· India â€” physician CME and CPD requirements worldwide. Track compliance automatically.",
    url: `${BASE}/doctors`,
    type: "website",
    images: [{ url: `${BASE}/api/og?title=CME+Requirements+for+Doctors+2026`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CME Requirements for Doctors 2026 â€” All Countries",
    description: "Physician CME and CPD requirements for Qatar, Saudi Arabia, UAE, UK, Australia and more.",
  },
  alternates: { canonical: `${BASE}/doctors` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a doctor need per year?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CME requirements for doctors vary by country: Qatar (QCHP) requires 80 CPD credits per 2-year cycle (40/year minimum); Saudi Arabia (SCFHS) requires 40â€“60 CME credits per 1â€“3 year cycle; UAE (DHA) requires 40 credits per 2 years; UK (GMC) requires 50 CPD credits annually; Australia (AHPRA) requires CPD activities annually based on specialty. Hayya Med Pro tracks your requirements for each country you're licensed in.",
      },
    },
    {
      "@type": "Question",
      name: "Do CME credits from one country count in another?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each licensing authority has its own requirements and recognition policies. Generally, activities accredited by internationally recognised bodies (AMA-PRA, EACCME, Royal Colleges) are accepted by multiple authorities. However, you must always verify with your specific licensing body. Hayya Med Pro lets you track compliance per country independently.",
      },
    },
    {
      "@type": "Question",
      name: "Can doctors complete CME online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All major licensing authorities accept online CME for doctors. QCHP Qatar, SCFHS Saudi Arabia, DHA Dubai, and GMC UK all accept accredited online learning modules. Online CME offers the same credit value as in-person learning when properly accredited. Hayya Med Pro lets you log online CME activities from any platform.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if a doctor doesn't complete their CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Failure to complete required CME credits can result in: license non-renewal (cannot legally practice); requirement for additional education before reinstatement; disciplinary proceedings in some jurisdictions. Hayya Med Pro prevents this by sending alerts 90, 60, and 30 days before every renewal deadline.",
      },
    },
  ],
};

const breadcrumbs = [
  { name: "Home", url: BASE },
  { name: "Doctors", url: `${BASE}/doctors` },
];

const COUNTRY_REQUIREMENTS = [
  { flag: "ðŸ‡¶ðŸ‡¦", country: "Qatar", authority: "QCHP / DHP-AS", credits: "80 CPD", cycle: "2 years", slug: "qatar" },
  { flag: "ðŸ‡¸ðŸ‡¦", country: "Saudi Arabia", authority: "SCFHS", credits: "40â€“60 CME", cycle: "1â€“3 years", slug: "saudi-arabia" },
  { flag: "ðŸ‡¦ðŸ‡ª", country: "UAE (Dubai)", authority: "DHA", credits: "40 CME", cycle: "2 years", slug: "uae" },
  { flag: "ðŸ‡¦ðŸ‡ª", country: "UAE (Abu Dhabi)", authority: "DOH", credits: "30â€“50 CPD", cycle: "2 years", slug: "uae" },
  { flag: "ðŸ‡§ðŸ‡­", country: "Bahrain", authority: "NHRA", credits: "40 CPD", cycle: "2 years", slug: "bahrain" },
  { flag: "ðŸ‡°ðŸ‡¼", country: "Kuwait", authority: "MOH", credits: "30 CME", cycle: "1 year", slug: "kuwait" },
  { flag: "ðŸ‡´ðŸ‡²", country: "Oman", authority: "OMSB", credits: "40 CME", cycle: "2 years", slug: "oman" },
  { flag: "ðŸ‡¬ðŸ‡§", country: "United Kingdom", authority: "GMC", credits: "50 CPD", cycle: "Annual", slug: "united-kingdom" },
  { flag: "ðŸ‡¦ðŸ‡º", country: "Australia", authority: "AHPRA", credits: "Varies by specialty", cycle: "Annual", slug: "australia" },
  { flag: "ðŸ‡®ðŸ‡³", country: "India", authority: "NMC", credits: "30 CME", cycle: "5 years", slug: "india" },
];

export default function DoctorsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Nav */}
        <nav className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-[#1a56a0] text-lg">
            <span className="w-7 h-7 rounded-lg bg-[#1a56a0] flex items-center justify-center text-white text-sm font-black">H</span>
            Hayya Med Pro
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/nurses" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">Nurses</Link>
            <Link href="/pharmacists" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">Pharmacists</Link>
            <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">Start free</Link>
          </div>
        </nav>

        {/* Hero */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl" aria-hidden="true">ðŸ©º</span>
              <span className="text-xs font-bold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full uppercase tracking-wide">Global Â· All Specialties</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-5 leading-tight max-w-3xl">
              CME requirements for doctors â€” every country, every authority
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-8">
              Physicians and doctors worldwide must complete CME or CPD to renew their medical license.
              Credits required, renewal cycles, and accepted activities differ by country.
              Hayya Med Pro tracks your compliance automatically across all countries where you hold a license.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my CME â€” free
              </Link>
              <Link href="/physician-cme" className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                Physician CME guide â†’
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-14">

          {/* Country requirements table */}
          <section aria-labelledby="countries-heading">
            <h2 id="countries-heading" className="text-2xl font-bold text-[#0f1f3d] mb-5">CME requirements for doctors by country</h2>
            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    {["Country", "Authority", "Credits required", "Cycle", "Guide"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {COUNTRY_REQUIREMENTS.map(({ flag, country, authority, credits, cycle, slug }) => (
                    <tr key={`${country}-${authority}`} className="hover:bg-[#f8fafc]">
                      <td className="px-5 py-3.5 font-medium text-[#0f1f3d]">{flag} {country}</td>
                      <td className="px-5 py-3.5 text-[#374151]">{authority}</td>
                      <td className="px-5 py-3.5 font-semibold text-[#1a56a0]">{credits}</td>
                      <td className="px-5 py-3.5 text-[#374151]">{cycle}</td>
                      <td className="px-5 py-3.5">
                        <Link href={`/${slug}/cme`} className="text-xs font-semibold text-[#1a56a0] hover:underline">
                          View â†’
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CME by specialty */}
          <section aria-labelledby="specialty-heading">
            <h2 id="specialty-heading" className="text-2xl font-bold text-[#0f1f3d] mb-5">CME requirements by medical specialty</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Cardiology", url: "/cardiology-cme", icon: "â¤ï¸" },
                { name: "Emergency Medicine", url: "/emergency-medicine-cme", icon: "ðŸš¨" },
                { name: "Internal Medicine", url: "/internal-medicine-cme", icon: "ðŸ©º" },
                { name: "General Surgery", url: "/surgery-cme", icon: "ðŸ”¬" },
                { name: "Paediatrics", url: "/pediatrics-cme", icon: "ðŸ‘¶" },
                { name: "OB/GYN", url: "/obstetrics-gynecology-cme", icon: "ðŸ¤°" },
                { name: "Anaesthesia", url: "/anesthesia-cme", icon: "ðŸ’‰" },
                { name: "Radiology", url: "/radiology-cme", icon: "ðŸ”­" },
                { name: "Psychiatry", url: "/psychiatry-cme", icon: "ðŸ§ " },
                { name: "Neurology", url: "/neurology-cme", icon: "ðŸ§¬" },
                { name: "Oncology", url: "/oncology-cme", icon: "ðŸŽ—ï¸" },
                { name: "Dermatology", url: "/dermatology-cme", icon: "ðŸ§´" },
              ].map(({ name, url: href, icon }) => (
                <Link key={href} href={href} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all text-center">
                  <span className="text-2xl block mb-2" aria-hidden="true">{icon}</span>
                  <p className="text-xs font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0] leading-tight">{name}</p>
                </Link>
              ))}
            </div>
            <Link href="/physician-cme" className="inline-block mt-4 text-sm font-semibold text-[#1a56a0] hover:underline">
              View all 23 medical specialties â†’
            </Link>
          </section>

          {/* How Hayya Med Pro helps */}
          <section className="bg-[#f0f7ff] border border-[#c7daf7] rounded-2xl p-8">
            <div className="grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-xl font-bold text-[#0f1f3d] mb-3">Built for doctors managing multiple licenses</h2>
                <p className="text-sm text-[#64748b] leading-relaxed mb-5">
                  Many doctors hold licenses in multiple GCC countries â€” or hold both a home country and a GCC license.
                  Hayya Med Pro tracks each independently and alerts you before every deadline.
                </p>
                <Link href="/register" className="inline-block bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors">
                  Track my CME free
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  "Track CME across all countries simultaneously",
                  "Log activities in 30 seconds â€” photo your certificate",
                  "Automated alerts 90/60/30 days before each deadline",
                  "Download compliance PDF for any authority",
                  "AI gap analysis â€” tells you exactly what you're missing (Pro)",
                  "Works on mobile â€” log CME from the conference floor",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-sm text-[#374151]">
                    <span className="w-5 h-5 rounded-full bg-[#dcfce7] flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3" aria-hidden="true">
                        <path d="M2 6l2.5 2.5 5.5-5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">CME for doctors â€” frequently asked questions</h2>
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
                { name: "Nurses", url: "/nurses", icon: "ðŸ‘©â€âš•ï¸" },
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

          {/* CTA */}
          <section className="bg-[#1a56a0] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Start tracking your CME today â€” free</h2>
            <p className="text-white/75 mb-6 max-w-md mx-auto text-sm">
              Join physicians tracking CME compliance across 26+ countries with Hayya Med Pro.
            </p>
            <Link href="/register" className="inline-block bg-white text-[#1a56a0] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              Create free account
            </Link>
          </section>

          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace
            official licensing authorities. Verify requirements with your specific authority.
          </p>
        </main>
      </div>
    </>
  );
}



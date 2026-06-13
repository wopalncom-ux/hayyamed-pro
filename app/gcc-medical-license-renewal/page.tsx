import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "GCC Medical License Renewal â€” CME & CPD Requirements by Country | Hayya Med Pro",
  description:
    "Complete guide to medical license renewal across GCC countries. QCHP (Qatar), SCFHS (Saudi Arabia), DHA and DOH (UAE), NHRA (Bahrain), OMSB (Oman), MOH Kuwait. CME/CPD requirements, renewal checklists, and step-by-step processes for every GCC authority.",
  keywords: [
    "GCC medical license renewal",
    "GCC healthcare license renewal",
    "CME requirements GCC",
    "medical license renewal Qatar Saudi Arabia UAE",
    "GCC CPD renewal",
    "QCHP SCFHS DHA renewal",
    "renew medical license GCC",
    "GCC healthcare professional license renewal",
    "CME credits GCC renewal",
    "healthcare license renewal Middle East",
  ],
  openGraph: {
    title: "GCC Medical License Renewal â€” All Country Requirements",
    description:
      "QCHP, SCFHS, DHA, DOH, NHRA, OMSB, MOH Kuwait. CME/CPD requirements and renewal process for every GCC healthcare licensing authority. Complete renewal checklists.",
    url: `${APP_URL}/gcc-medical-license-renewal`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=GCC+Medical+License+Renewal+Guide&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%C2%B7+DOH+%C2%B7+NHRA+%C2%B7+OMSB+%C2%B7+MOH+Kuwait&a=%F0%9F%87%AC%F0%9F%87%A7+GCC&k=Regional+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GCC Medical License Renewal â€” CME & CPD by Country",
    description: "Renewal guides for every GCC country â€” Qatar, Saudi Arabia, UAE Dubai, UAE Abu Dhabi, Bahrain, Oman, Kuwait. CME/CPD requirements and step-by-step renewal processes.",
  },
  alternates: { canonical: `${APP_URL}/gcc-medical-license-renewal` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does medical license renewal work in GCC countries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each GCC country has its own healthcare licensing authority with separate CME/CPD requirements and renewal processes. Qatar uses QCHP (80 CPD per 2 years), Saudi Arabia uses SCFHS (30â€“60 CME per year), Dubai uses DHA (40 CME per 2 years), Abu Dhabi uses DOH (30â€“50 CPD per cycle), Bahrain uses NHRA (40 CPD per 2 years), Oman uses OMSB (40 CME per 2 years), and Kuwait uses MOH (30 CME per year). You must maintain a valid license with each authority where you practise.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the same CME activities for multiple GCC license renewals?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generally yes â€” CME activities from internationally recognised providers and major regional conferences (Arab Health, Saudi Health, QCHP Annual Conference) are typically accepted by multiple GCC authorities. However, each authority has its own accreditation requirements. You should verify that a specific activity is accepted by each authority you are renewing with. Hayya Med Pro lets you tag activities to multiple licensing jurisdictions.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between CME and CPD in GCC countries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CME (Continuing Medical Education) and CPD (Continuing Professional Development) describe essentially the same concept of ongoing professional learning, but different GCC authorities use different terminology. Qatar (QCHP), UAE Abu Dhabi (DOH), and Bahrain (NHRA) use CPD. Saudi Arabia (SCFHS), UAE Dubai (DHA), Oman (OMSB), and Kuwait (MOH) use CME. The learning activities themselves are similar â€” conferences, workshops, online courses, and self-directed learning.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I let my GCC medical license expire?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Practising healthcare with an expired license is illegal in all GCC countries and can result in serious professional and legal consequences. If your license has lapsed, contact the relevant authority immediately. Reinstatement may require completing all outstanding CME/CPD credits, paying reinstatement fees, and in some cases undergoing a fitness-to-practise review. Do not delay â€” most GCC authorities send renewal reminders 60â€“90 days before expiry.",
      },
    },
    {
      "@type": "Question",
      name: "Which GCC country has the strictest CME renewal requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Saudi Arabia (SCFHS) has among the strictest requirements â€” physicians, pharmacists, and dentists need 60 CME credits per year (the highest annual requirement in the GCC). Qatar (QCHP) requires 80 CPD over 2 years (40/year minimum). DHA requires 40 CME per 2 years. All GCC authorities have mandatory patient safety credit requirements on top of the general CME/CPD total.",
      },
    },
  ],
};

const GCC_AUTHORITIES = [
  {
    flag: "ðŸ‡¶ðŸ‡¦",
    country: "Qatar",
    authority: "QCHP",
    fullName: "Qatar Council for Healthcare Practitioners",
    credits: "80 CPD",
    cycle: "2-year cycle (40/year min)",
    term: "CPD",
    urgency: "High",
    renewalHref: "/qchp-renewal",
    trackerHref: "/qchp",
  },
  {
    flag: "ðŸ‡¸ðŸ‡¦",
    country: "Saudi Arabia",
    authority: "SCFHS",
    fullName: "Saudi Commission for Health Specialties",
    credits: "30â€“60 CME",
    cycle: "1-year cycle (profession-specific)",
    term: "CME",
    urgency: "High",
    renewalHref: "/scfhs-renewal",
    trackerHref: "/scfhs",
  },
  {
    flag: "ðŸ‡¦ðŸ‡ª",
    country: "UAE â€” Dubai",
    authority: "DHA",
    fullName: "Dubai Health Authority",
    credits: "40 CME",
    cycle: "2-year cycle",
    term: "CME",
    urgency: "Medium",
    renewalHref: "/dha-renewal",
    trackerHref: "/dha",
  },
  {
    flag: "ðŸ‡¦ðŸ‡ª",
    country: "UAE â€” Abu Dhabi",
    authority: "DOH",
    fullName: "Department of Health Abu Dhabi",
    credits: "30â€“50 CPD",
    cycle: "1â€“2 year cycle",
    term: "CPD",
    urgency: "Medium",
    renewalHref: "/doh-renewal",
    trackerHref: "/doh",
  },
  {
    flag: "ðŸ‡§ðŸ‡­",
    country: "Bahrain",
    authority: "NHRA",
    fullName: "National Health Regulatory Authority",
    credits: "40 CPD",
    cycle: "2-year cycle",
    term: "CPD",
    urgency: "Medium",
    renewalHref: null,
    trackerHref: "/nhra",
  },
  {
    flag: "ðŸ‡´ðŸ‡²",
    country: "Oman",
    authority: "OMSB",
    fullName: "Oman Medical Specialty Board",
    credits: "40 CME",
    cycle: "2-year cycle",
    term: "CME",
    urgency: "Medium",
    renewalHref: null,
    trackerHref: "/omsb",
  },
  {
    flag: "ðŸ‡°ðŸ‡¼",
    country: "Kuwait",
    authority: "MOH Kuwait",
    fullName: "Ministry of Health Kuwait",
    credits: "30 CME",
    cycle: "1-year cycle",
    term: "CME",
    urgency: "Medium",
    renewalHref: null,
    trackerHref: "/moh-kuwait",
  },
];

const COMMON_STEPS = [
  {
    step: "1",
    title: "Find your license expiry date",
    desc: "Log in to your licensing authority portal. Most GCC authorities send renewal reminders 60â€“90 days before expiry â€” don't wait for the reminder. Set your own 90-day alert in Hayya Med Pro.",
  },
  {
    step: "2",
    title: "Check your CME/CPD total and category gaps",
    desc: "Review how many credits you have and whether mandatory categories (patient safety is required by all GCC authorities) are complete. Know your shortfall before you start planning activities.",
  },
  {
    step: "3",
    title: "Complete remaining CME/CPD",
    desc: "Register for accredited conferences, workshops, or online courses to close your credit gap. All activities must be from providers accredited by your specific licensing authority.",
  },
  {
    step: "4",
    title: "Collect certificates and build your portfolio",
    desc: "Gather every certificate with provider name, accreditation number, date, and credit value. Hayya Med Pro organises these automatically and generates a single PDF portfolio for authority submission.",
  },
  {
    step: "5",
    title: "Submit renewal through the authority portal",
    desc: "Upload your CME/CPD portfolio through the official authority portal (SCFHS, Salama for DHA, DOH portal, etc.) and complete the renewal application. Submit at least 30 days before expiry.",
  },
];

export default function GccMedicalLicenseRenewalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Nav */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <span className="font-bold text-base text-[#111]">
                Hayya Med <span className="text-[#1a56a0]">Pro</span>
              </span>
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors"
            >
              Start free â†’
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">

          {/* Hero */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111] mb-4 leading-tight">
              GCC medical license renewal â€” CME &amp; CPD requirements by country
            </h1>
            <p className="text-base text-[#475569] max-w-3xl leading-relaxed mb-6">
              Every GCC country has its own healthcare licensing authority, renewal timeline, and
              CME or CPD credit requirement. This guide covers all 7 GCC authorities with complete
              renewal checklists, step-by-step processes, and credit requirements by profession.
            </p>
            <div className="flex flex-wrap gap-2">
              {GCC_AUTHORITIES.map((a) => (
                <span key={a.authority} className="text-xs font-medium text-[#374151] bg-white border border-[#e2e8f0] px-3 py-1.5 rounded-full">
                  {a.flag} {a.authority}
                </span>
              ))}
            </div>
          </div>

          {/* Authority cards */}
          <div className="mb-14">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              Medical license renewal by GCC authority
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {GCC_AUTHORITIES.map((a) => (
                <div key={a.authority} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xl mr-2">{a.flag}</span>
                      <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">{a.country}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.term === "CPD" ? "bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]" : "bg-[#f0f7ff] text-[#1a56a0] border border-[#bfdbfe]"}`}>
                      {a.term}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#111] mb-0.5">{a.authority}</h3>
                  <p className="text-xs text-[#64748b] mb-4">{a.fullName}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#f8fafc] rounded-lg p-3">
                      <p className="text-lg font-black text-[#1a56a0]">{a.credits}</p>
                      <p className="text-[11px] text-[#64748b]">{a.cycle}</p>
                    </div>
                    <div className="bg-[#f8fafc] rounded-lg p-3">
                      <p className="text-xs font-semibold text-[#374151] mb-0.5">Patient safety</p>
                      <p className="text-[11px] text-[#64748b]">5 credits mandatory</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={a.trackerHref}
                      className="flex-1 text-center text-xs font-medium text-[#1a56a0] border border-[#bfdbfe] bg-[#f0f7ff] py-2 rounded-lg hover:bg-[#dbeafe] transition-colors"
                    >
                      Track {a.authority} compliance
                    </Link>
                    {a.renewalHref ? (
                      <Link
                        href={a.renewalHref}
                        className="flex-1 text-center text-xs font-semibold text-white bg-[#1a56a0] py-2 rounded-lg hover:bg-[#154890] transition-colors"
                      >
                        Renewal guide â†’
                      </Link>
                    ) : (
                      <span className="flex-1 text-center text-xs font-medium text-[#94a3b8] bg-[#f8fafc] border border-[#e2e8f0] py-2 rounded-lg">
                        Guide coming soon
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common renewal process */}
          <div className="mb-14">
            <h2 className="text-xl font-bold text-[#111] mb-2">
              The GCC license renewal process â€” what all countries have in common
            </h2>
            <p className="text-sm text-[#64748b] mb-6">
              While each authority has different credit requirements and portals, the renewal workflow
              follows the same 5-step pattern across all GCC countries.
            </p>
            <div className="space-y-4">
              {COMMON_STEPS.map((s) => (
                <div key={s.step} className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#1a56a0] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111] mb-1">{s.title}</h3>
                    <p className="text-sm text-[#64748b] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CME vs CPD note */}
          <div className="mb-12 bg-white rounded-xl border border-[#e2e8f0] p-6">
            <h2 className="text-base font-bold text-[#111] mb-3">CME vs CPD in GCC â€” what is the difference?</h2>
            <p className="text-sm text-[#475569] leading-relaxed mb-3">
              Both terms describe the same concept â€” structured professional learning to maintain clinical
              competence and licensing. The terminology difference is administrative, not substantive.
              The actual activities (conferences, workshops, online courses, hospital education sessions)
              are the same regardless of which term your authority uses.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#f0fdf4] rounded-lg p-4 border border-[#bbf7d0]">
                <p className="text-xs font-bold text-[#15803d] mb-1.5">Uses CPD</p>
                <p className="text-sm text-[#374151]">Qatar (QCHP), UAE Abu Dhabi (DOH), Bahrain (NHRA)</p>
              </div>
              <div className="bg-[#f0f7ff] rounded-lg p-4 border border-[#bfdbfe]">
                <p className="text-xs font-bold text-[#1a56a0] mb-1.5">Uses CME</p>
                <p className="text-sm text-[#374151]">Saudi Arabia (SCFHS), UAE Dubai (DHA), Oman (OMSB), Kuwait (MOH)</p>
              </div>
            </div>
            <p className="text-xs text-[#64748b] mt-3">
              See the full breakdown: <Link href="/cme-vs-cpd" className="text-[#1a56a0] hover:underline">CME vs CPD â€” complete guide â†’</Link>
            </p>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              GCC medical license renewal â€” frequently asked questions
            </h2>
            <div className="space-y-3">
              {faqLd.mainEntity.map((faq) => (
                <details key={faq.name} className="bg-white rounded-xl border border-[#e2e8f0] group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-[#111] list-none">
                    {faq.name}
                    <svg
                      className="w-4 h-4 text-[#64748b] flex-shrink-0 ml-4 group-open:rotate-180 transition-transform"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-[#64748b] border-t border-[#f1f5f9] pt-3 leading-relaxed">
                    {faq.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Dark CTA */}
          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] rounded-2xl p-10 text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">
              Track all your GCC licenses in one dashboard
            </h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-lg mx-auto text-sm">
              Hayya Med Pro supports QCHP, SCFHS, DHA, DOH, NHRA, OMSB, and MOH Kuwait in a single
              dashboard. Track your CME/CPD progress, manage certificates, and generate PDF compliance
              reports for any GCC authority. Free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-block bg-white text-[#1a56a0] font-semibold px-8 py-3 rounded-lg hover:bg-[#f0f4f8] transition-colors text-sm"
              >
                Start tracking my GCC licenses â€” free â†’
              </Link>
              <Link
                href="/countries"
                className="inline-block border border-[rgba(255,255,255,0.25)] text-white font-medium px-8 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors text-sm"
              >
                View all country requirements
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-3 text-xs text-[#64748b] text-center leading-relaxed">
            Hayya Med Pro supports CME/CPD tracking and licensing readiness across GCC countries.
            It does not issue licenses and does not replace official licensing authority guidance.
            Always verify final requirements with QCHP, SCFHS, DHA, DOH, NHRA, OMSB, or MOH Kuwait directly.
          </div>
        </main>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Nurse CPD Requirements in GCC â€” Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, Oman",
  description:
    "Complete guide to nursing CPD and CME requirements across the GCC. QCHP Qatar (80 CPD/2yr), SCFHS Saudi Arabia (30 CME/yr), DHA UAE (40 CME/2yr), Kuwait MOH (20 CME/yr). Track all requirements in one app.",
  keywords: [
    "nurse CPD requirements GCC",
    "nursing CPD Saudi Arabia",
    "QCHP nurse CPD requirements",
    "SCFHS nursing CME",
    "nurse CME tracker",
    "DHA nurse CME requirements",
    "nursing license renewal GCC",
    "nursing CPD tracker",
    "GCC nurse continuing education",
    "RN CME requirements Qatar",
  ],
  openGraph: {
    title: "Nurse CPD Requirements Across the GCC â€” Complete Guide",
    description:
      "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB â€” nursing CPD and CME requirements across all 7 GCC countries in one guide.",
    url: `${APP_URL}/nurse-cpd`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Nurse+CPD+Requirements+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%C2%B7+MOH+Kuwait+%E2%80%94+all+7+countries&a=%F0%9F%91%A9%E2%80%8D%E2%9A%95%EF%B8%8F+Nursing&k=Profession+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nurse CPD Requirements in GCC â€” Track All 7 Countries",
    description: "Complete nursing CPD guide for Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
  },
  alternates: { canonical: `${APP_URL}/nurse-cpd` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits does a nurse need in Qatar (QCHP)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nurses registered with QCHP in Qatar must complete 80 CPD credits per 2-year renewal cycle. A minimum of 40 credits must be completed each year. At least 2 CPD credits per cycle must be from patient safety activities. Qatar uses the same 80-credit requirement for all healthcare professions including nurses.",
      },
    },
    {
      "@type": "Question",
      name: "How many CME credits does a nurse need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nurses registered with SCFHS in Saudi Arabia must complete 30 CME credits per year. This is lower than the 60-credit requirement for physicians. No more than 50% of credits may come from online activities, and no more than 50% from self-directed learning.",
      },
    },
    {
      "@type": "Question",
      name: "What are the nursing CPD requirements in Kuwait?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nurses licensed with the Kuwait Ministry of Health (MOH) must complete 20 CME credits per year. Kuwait has the strictest online activity cap in the GCC â€” a maximum of 30% of credits (6 credits) may come from online sources.",
      },
    },
    {
      "@type": "Question",
      name: "Are nursing CPD requirements different from physician CME requirements in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes â€” in Saudi Arabia and Kuwait, nurses have lower credit requirements than physicians. SCFHS requires physicians to complete 60 CME credits per year, compared to 30 for nurses. Kuwait MOH requires 30 credits per year for physicians and 20 for nurses. Qatar (QCHP), UAE (DHA and DOH), Bahrain (NHRA), and Oman (OMSB) apply the same requirements regardless of profession.",
      },
    },
    {
      "@type": "Question",
      name: "Can nurses count online CPD activities toward their requirements in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but caps apply. Qatar (QCHP) allows up to 50% online (40 of 80 credits). Saudi Arabia (SCFHS) allows up to 50% online (15 of 30 for nurses). UAE DHA allows up to 20 online credits per 2-year cycle. Kuwait MOH applies a strict 30% cap. Hayya Med Pro tracks your online credit count automatically and warns you if you approach the cap.",
      },
    },
  ],
};

const GCC_REQUIREMENTS = [
  {
    country: "ðŸ‡¶ðŸ‡¦ Qatar",
    authority: "QCHP / DHP-AS",
    credits: "80 credits",
    cycle: "2 years",
    term: "CPD",
    onlineCap: "50% (40 credits)",
    note: "Same as physicians",
    href: "/qchp",
  },
  {
    country: "ðŸ‡¸ðŸ‡¦ Saudi Arabia",
    authority: "SCFHS",
    credits: "30 credits",
    cycle: "Per year",
    term: "CME",
    onlineCap: "50% (15 credits)",
    note: "Lower than physicians (60)",
    href: "/scfhs",
  },
  {
    country: "ðŸ‡¦ðŸ‡ª UAE â€” Dubai",
    authority: "DHA",
    credits: "40 credits",
    cycle: "2 years",
    term: "CME",
    onlineCap: "50% (20 credits)",
    note: "Same as physicians",
    href: "/dha",
  },
  {
    country: "ðŸ‡¦ðŸ‡ª UAE â€” Abu Dhabi",
    authority: "DOH",
    credits: "40 credits",
    cycle: "2 years",
    term: "CPD",
    onlineCap: "50% (20 credits)",
    note: "Same as physicians",
    href: "/doh",
  },
  {
    country: "ðŸ‡°ðŸ‡¼ Kuwait",
    authority: "MOH Kuwait",
    credits: "20 credits",
    cycle: "Per year",
    term: "CME",
    onlineCap: "30% (6 credits)",
    note: "Lower than physicians (30)",
    href: "/moh-kuwait",
  },
  {
    country: "ðŸ‡§ðŸ‡­ Bahrain",
    authority: "NHRA",
    credits: "40 credits",
    cycle: "2 years",
    term: "CPD",
    onlineCap: "50% (20 credits)",
    note: "Same as physicians",
    href: "/nhra",
  },
  {
    country: "ðŸ‡´ðŸ‡² Oman",
    authority: "OMSB",
    credits: "30 credits",
    cycle: "2 years",
    term: "CME",
    onlineCap: "50% (15 credits)",
    note: "Lower than physicians (40)",
    href: "/omsb",
  },
];

const CATEGORIES = [
  { icon: "ðŸ¥", name: "Clinical Practice", desc: "Ward-based learning, clinical workshops, simulation, skills labs, case-based discussions" },
  { icon: "ðŸ’»", name: "Online / E-Learning", desc: "Accredited nursing e-learning modules, webinars, virtual nursing conferences (capped per country)" },
  { icon: "ðŸŽ“", name: "Formal Education", desc: "Postgraduate nursing diplomas, specialist certifications (BLS/ACLS/PALS), university coursework" },
  { icon: "ðŸ“„", name: "Research & Publications", desc: "Authoring nursing research papers, quality improvement projects, presenting clinical findings" },
  { icon: "ðŸ«", name: "Teaching & Mentorship", desc: "Clinical nursing mentorship, preceptoring student nurses, developing nursing education materials" },
  { icon: "ðŸ›¡ï¸", name: "Patient Safety", desc: "Mandatory in Qatar (2 credits/cycle) and UAE Dubai (5 credits/cycle). Includes adverse events, infection control, medication safety" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Add your nursing license details", desc: "Enter your country, specialty (general nursing, ICU, pediatrics, etc.), cycle start date, and licensing authority. Hayya Med Pro applies the correct credit rules automatically." },
  { step: "2", title: "Log CPD activities as you complete them", desc: "Record conferences, workshops, e-learning, and in-service training. Upload your certificate for verification. AI suggests the correct category." },
  { step: "3", title: "Track your compliance in real time", desc: "See your total credits, online activity cap status, and mandatory category progress. Get alerts when you're behind pace for your renewal deadline." },
  { step: "4", title: "Download your renewal report", desc: "Generate a PDF CPD portfolio with all your activities, ready to submit to QCHP, SCFHS, DHA, or your licensing authority at renewal time." },
];

export default function NurseCpdPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Nav */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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

        <main className="max-w-4xl mx-auto px-6 py-12">

          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1a56a0] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              ðŸ‘©â€âš•ï¸ Nurses Â· All GCC Countries Â· CPD & CME
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Nursing CPD requirements<br className="hidden sm:block" /> across the GCC â€” one tracker
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Requirements differ by country: SCFHS nurses need 30 CME credits per year, Kuwait MOH nurses need 20, QCHP nurses need 80 per 2-year cycle.
              Hayya Med Pro tracks your compliance against any â€” or all â€” of these authorities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors"
              >
                Track my nursing CPD â€” free â†’
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors"
              >
                See what&apos;s free vs Pro
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-3">No credit card required Â· 14-day Pro trial included</p>
          </div>

          {/* GCC comparison table */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-5 border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111]">Nursing CPD / CME requirements â€” GCC at a glance</h2>
              <p className="text-sm text-[#64748b] mt-1">Requirements as of 2025. Always verify current requirements with your licensing authority.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Country</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Authority</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Credits</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Cycle</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Online Cap</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {GCC_REQUIREMENTS.map((r, i) => (
                    <tr key={r.authority} className={`border-b border-[#f8fafc] ${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}>
                      <td className="px-5 py-3.5 font-medium text-[#111]">{r.country}</td>
                      <td className="px-5 py-3.5">
                        <Link href={r.href} className="text-[#1a56a0] hover:underline font-medium text-xs">{r.authority}</Link>
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-[#1a56a0]">{r.credits}</td>
                      <td className="px-4 py-3.5 text-center text-[#374151]">{r.cycle}</td>
                      <td className="px-4 py-3.5 text-center text-[#64748b] text-xs">{r.onlineCap}</td>
                      <td className="px-4 py-3.5 text-xs text-[#64748b]">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-[#f0fdf4] border-t border-[#f1f5f9]">
              <p className="text-xs text-[#15803d] font-medium">
                ðŸ’¡ Working across borders? Hayya Med Pro tracks your nursing CPD progress against multiple GCC authorities simultaneously â€” no spreadsheets.
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-2">CPD activity categories accepted for nurses</h2>
            <p className="text-sm text-[#64748b] mb-6">
              GCC authorities accept a wide range of nursing CPD activities. Category caps and mandatory minimums vary by country.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map((c) => (
                <div key={c.name} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xl">{c.icon}</span>
                    <h3 className="text-sm font-semibold text-[#111]">{c.name}</h3>
                  </div>
                  <p className="text-xs text-[#64748b] leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-6">How Hayya Med Pro works for nursing CPD tracking</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HOW_IT_WORKS.map((s) => (
                <div key={s.step} className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a56a0] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111] mb-1">{s.title}</h3>
                    <p className="text-xs text-[#64748b] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-6">Frequently asked questions â€” nursing CPD in GCC</h2>
            <div className="space-y-3">
              {faqLd.mainEntity.map((faq) => (
                <details
                  key={faq.name}
                  className="bg-white rounded-xl border border-[#e2e8f0] group"
                >
                  <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-[#111] list-none flex items-center justify-between gap-4 hover:bg-[#f8fafc] rounded-xl transition-colors">
                    {faq.name}
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f1f5f9] text-[#64748b] text-xs flex items-center justify-center font-bold group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-[#64748b] leading-relaxed border-t border-[#f1f5f9] pt-3">
                    {faq.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Country links */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-4">Detailed requirements by country</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GCC_REQUIREMENTS.map((r) => (
                <Link
                  key={r.authority}
                  href={r.href}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-4 hover:border-[#1a56a0] hover:shadow-sm transition-all text-center"
                >
                  <p className="text-xl mb-1">{r.country.split(" ")[0]}</p>
                  <p className="text-xs font-semibold text-[#111] leading-tight">{r.country.split(" ").slice(1).join(" ")}</p>
                  <p className="text-[10px] text-[#64748b] mt-0.5">{r.authority}</p>
                  <p className="text-xs font-bold text-[#1a56a0] mt-1.5">{r.credits} / {r.cycle}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Profession cross-links */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#111] mb-4">CME requirements by profession</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: "ðŸ©º", title: "Physicians", href: "/physician-cme" },
                { icon: "ðŸ’Š", title: "Pharmacists", href: "/pharmacist-cme" },
                { icon: "ðŸ¦·", title: "Dentists", href: "/dentist-cme" },
                { icon: "ðŸ¦¿", title: "Allied Health", href: "/allied-health-cpd" },
              ].map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-4 hover:border-[#1a56a0] hover:shadow-sm transition-all text-center"
                >
                  <p className="text-xl mb-1.5">{p.icon}</p>
                  <p className="text-xs font-semibold text-[#111]">{p.title}</p>
                  <p className="text-[10px] text-[#1a56a0] mt-1">View guide â†’</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Dark CTA */}
          <div className="rounded-2xl bg-[#0f1f3d] px-8 py-10 text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Never miss a nursing CPD deadline
            </h2>
            <p className="text-[#94a3b8] text-sm max-w-xl mx-auto mb-6">
              Hayya Med Pro tracks your credits, enforces online caps, flags mandatory requirements, and sends renewal reminders â€”
              for Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Start tracking free â†’ 14-day Pro trial
            </Link>
            <p className="text-[#475569] text-xs mt-3">No credit card required Â· Cancel anytime</p>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e]">
            Hayya Med Pro supports CPD tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities.
            Users must verify final requirements with their relevant regulatory body (QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, or OMSB).
            Requirements shown are based on official publications and are subject to change.
          </div>
        </main>
      </div>
    </>
  );
}

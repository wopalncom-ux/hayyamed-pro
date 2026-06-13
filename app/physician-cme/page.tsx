import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Physician CME Requirements in GCC â€” Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, Oman",
  description:
    "Complete guide to physician CME and CPD requirements across the GCC. QCHP Qatar (80 CPD/2yr), SCFHS Saudi Arabia (60 CME/yr), DHA UAE (40 CME/2yr), and more. Track all requirements in one place.",
  keywords: [
    "physician CME requirements GCC",
    "doctor CPD requirements Qatar",
    "SCFHS CME physician",
    "QCHP physician CPD",
    "physician CME tracker",
    "doctor CME requirements Saudi Arabia",
    "UAE physician CME",
    "GCC doctor CME compliance",
    "physician license renewal CME",
    "continuing medical education physician GCC",
  ],
  openGraph: {
    title: "Physician CME Requirements Across the GCC â€” Complete Guide",
    description:
      "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB â€” physician CME and CPD requirements across all 7 GCC countries in one guide.",
    url: `${APP_URL}/physician-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Physician+CME+Requirements+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%C2%B7+DOH+%C2%B7+all+7+GCC+countries+in+one+guide&a=%F0%9F%A9%BA+Physician&k=Profession+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Physician CME Requirements in GCC â€” Track All 7 Countries",
    description: "Complete physician CME guide for Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
  },
  alternates: { canonical: `${APP_URL}/physician-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a physician need in Saudi Arabia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Physicians registered with SCFHS in Saudi Arabia must complete 60 CME credits per year. No more than 50% of these credits may come from online activities, and no more than 50% from self-directed learning. SCFHS renewal cycles vary from 1 to 3 years depending on the specialty.",
      },
    },
    {
      "@type": "Question",
      name: "What are the QCHP CPD requirements for physicians in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Physicians in Qatar regulated by QCHP (DHP-AS under MOPH) must complete 80 CPD credits per 2-year cycle. A minimum of 40 credits must be completed each year. At least 2 credits per cycle must come from patient safety activities.",
      },
    },
    {
      "@type": "Question",
      name: "How many CME credits do physicians need in UAE (Dubai)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Physicians licensed with the Dubai Health Authority (DHA) must complete 40 CME credits every 2 years. At least 5 credits per cycle must be from patient safety activities. A maximum of 20 credits (50%) may come from online activities.",
      },
    },
    {
      "@type": "Question",
      name: "Do physician CME requirements differ by specialty?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. In Saudi Arabia (SCFHS), the renewal cycle length varies by specialty, though the 60-credit-per-year requirement applies across most specialties. Most other GCC countries apply uniform credit requirements across physician specialties, but category minimums (patient safety, clinical practice) may vary.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the same CME activities to meet requirements in multiple GCC countries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on the accrediting body. Internationally accredited activities (ACCME, EACCME, Royal Colleges) are generally recognized across GCC countries. However, each authority requires separate submission and has its own cycle dates. Hayya Med Pro lets you track activities against multiple country requirements simultaneously.",
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
    mandatory: "2 credits patient safety",
    href: "/qchp",
  },
  {
    country: "ðŸ‡¸ðŸ‡¦ Saudi Arabia",
    authority: "SCFHS",
    credits: "60 credits",
    cycle: "Per year",
    term: "CME",
    onlineCap: "50% (30 credits)",
    mandatory: "None specified",
    href: "/scfhs",
  },
  {
    country: "ðŸ‡¦ðŸ‡ª UAE â€” Dubai",
    authority: "DHA",
    credits: "40 credits",
    cycle: "2 years",
    term: "CME",
    onlineCap: "50% (20 credits)",
    mandatory: "5 credits patient safety",
    href: "/dha",
  },
  {
    country: "ðŸ‡¦ðŸ‡ª UAE â€” Abu Dhabi",
    authority: "DOH",
    credits: "40 credits",
    cycle: "2 years",
    term: "CPD",
    onlineCap: "50% (20 credits)",
    mandatory: "None specified",
    href: "/doh",
  },
  {
    country: "ðŸ‡°ðŸ‡¼ Kuwait",
    authority: "MOH Kuwait",
    credits: "30 credits",
    cycle: "Per year",
    term: "CME",
    onlineCap: "30% (9 credits)",
    mandatory: "None specified",
    href: "/moh-kuwait",
  },
  {
    country: "ðŸ‡§ðŸ‡­ Bahrain",
    authority: "NHRA",
    credits: "40 credits",
    cycle: "2 years",
    term: "CPD",
    onlineCap: "50% (20 credits)",
    mandatory: "None specified",
    href: "/nhra",
  },
  {
    country: "ðŸ‡´ðŸ‡² Oman",
    authority: "OMSB",
    credits: "40 credits",
    cycle: "2 years",
    term: "CME",
    onlineCap: "50% (20 credits)",
    mandatory: "None specified",
    href: "/omsb",
  },
];

const CATEGORIES = [
  { icon: "ðŸ¥", name: "Clinical Practice", desc: "Conferences, workshops, case presentations, grand rounds, simulation labs" },
  { icon: "ðŸ’»", name: "Online / E-Learning", desc: "Accredited e-learning modules, webinars, virtual conferences (capped at 30â€“50% depending on country)" },
  { icon: "ðŸ“„", name: "Research & Publications", desc: "Authoring peer-reviewed papers, presenting at conferences, participating in clinical trials" },
  { icon: "ðŸŽ“", name: "Postgraduate Education", desc: "Fellowship programs, subspecialty diplomas, master's degrees â€” typically earn 10â€“25 credits per semester" },
  { icon: "ðŸ«", name: "Teaching & Supervision", desc: "Supervising residents, lecturing at medical schools, developing clinical education programs" },
  { icon: "ðŸ›¡ï¸", name: "Patient Safety", desc: "Mandatory in Qatar (2 credits) and UAE Dubai (5 credits). Covers adverse events, quality improvement, risk management" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Select your country (or countries)", desc: "If you hold licenses in multiple GCC countries, add each compliance wallet. Hayya Med Pro tracks your progress against each authority's specific rules." },
  { step: "2", title: "Log CME activities as you complete them", desc: "Add conferences, workshops, and online courses with provider name, date, and credit value. AI auto-categorizes activities by title." },
  { step: "3", title: "Monitor your readiness dashboard", desc: "See your total credits, category breakdown, online cap status, and whether mandatory activities (patient safety) are met â€” for every country at once." },
  { step: "4", title: "Download your compliance report", desc: "Generate a PDF compliance portfolio formatted for QCHP, SCFHS, DHA, or any GCC authority â€” ready to submit at renewal." },
];

export default function PhysicianCmePage() {
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
              ðŸ©º Physicians Â· All GCC Countries Â· CME & CPD
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Physician CME requirements<br className="hidden sm:block" /> across the GCC â€” one tracker
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, Oman â€” every GCC authority sets different CME and CPD requirements for physicians.
              Hayya Med Pro tracks all of them automatically so you never miss a renewal deadline.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors"
              >
                Track my physician CME â€” free â†’
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

          {/* GCC requirements table */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-5 border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111]">Physician CME / CPD requirements â€” GCC at a glance</h2>
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Mandatory</th>
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
                      <td className="px-4 py-3.5 text-xs text-[#64748b]">{r.mandatory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-[#f8fafc] border-t border-[#f1f5f9] flex items-center justify-between gap-4">
              <p className="text-xs text-[#64748b]">Hayya Med Pro tracks your progress against every authority in this table â€” simultaneously.</p>
              <Link
                href="/register"
                className="flex-shrink-0 text-xs font-semibold text-white bg-[#1a56a0] px-3 py-2 rounded-lg hover:bg-[#154890] transition-colors"
              >
                Start tracking â†’
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-2">CME activity categories accepted across GCC</h2>
            <p className="text-sm text-[#64748b] mb-6">
              Most GCC authorities accept the same core activity types. Requirements for minimums and caps vary by country.
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
            <h2 className="text-xl font-bold text-[#111] mb-6">How Hayya Med Pro works for physician CME tracking</h2>
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
            <h2 className="text-xl font-bold text-[#111] mb-6">Frequently asked questions â€” physician CME in GCC</h2>
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

          {/* Country pages */}
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
                { icon: "ðŸ‘©â€âš•ï¸", title: "Nurses", href: "/nurse-cpd" },
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
              Stop tracking CME on a spreadsheet
            </h2>
            <p className="text-[#94a3b8] text-sm max-w-xl mx-auto mb-6">
              Hayya Med Pro calculates your compliance score, flags category gaps, tracks mandatory requirements,
              and generates your submission-ready PDF report â€” for every GCC country you&apos;re licensed in.
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
            Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities.
            Users must verify final requirements with their relevant regulatory body (QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, or OMSB).
            Requirements shown are based on official publications and are subject to change.
          </div>
        </main>
      </div>
    </>
  );
}

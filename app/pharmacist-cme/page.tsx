import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Pharmacist CME Requirements in GCC â€” SCFHS, QCHP, DHA, Kuwait MOH, NHRA, OMSB",
  description:
    "Complete guide to pharmacist CME and CPD requirements across the GCC. QCHP Qatar (80 CPD/2yr), SCFHS Saudi Arabia (60 CME/yr), DHA UAE (40 CME/2yr). Track all requirements in one professional compliance app.",
  keywords: [
    "pharmacist CME requirements GCC",
    "SCFHS pharmacist CME",
    "QCHP pharmacist CPD",
    "pharmacist license renewal Saudi Arabia",
    "pharmacy CME tracker",
    "DHA pharmacist CME",
    "pharmacist CPD Qatar",
    "GCC pharmacy continuing education",
    "pharmacist CME compliance",
    "pharmacy CPD portfolio",
  ],
  openGraph: {
    title: "Pharmacist CME Requirements Across the GCC â€” Complete Guide",
    description:
      "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB â€” pharmacist CME and CPD requirements across all 7 GCC countries in one guide.",
    url: `${APP_URL}/pharmacist-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Pharmacist+CME+Requirements+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+all+7+GCC+countries+in+one+guide&a=%F0%9F%92%8A+Pharmacy&k=Profession+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pharmacist CME Requirements in GCC â€” Track All 7 Countries",
    description: "Complete pharmacist CME guide for Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
  },
  alternates: { canonical: `${APP_URL}/pharmacist-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a pharmacist need for SCFHS renewal in Saudi Arabia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pharmacists registered with SCFHS in Saudi Arabia must complete 60 CME credits per year â€” the same requirement as physicians. No more than 50% of credits (30 credits) may come from online activities. SCFHS renewal cycles range from 1 to 3 years depending on the specialty.",
      },
    },
    {
      "@type": "Question",
      name: "What are the CPD requirements for pharmacists in Qatar (QCHP)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pharmacists licensed by QCHP (DHP-AS under MOPH Qatar) must complete 80 CPD credits per 2-year renewal cycle. A minimum of 40 credits must be completed each year. Qatar applies the same 80-credit requirement to all licensed healthcare professionals including pharmacists.",
      },
    },
    {
      "@type": "Question",
      name: "What CME activities are accepted for pharmacists in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GCC authorities accept: accredited pharmacy conferences and seminars, hands-on clinical workshops, online accredited pharmacy courses (subject to caps), research and publications in pharmacy journals, teaching at pharmacy schools, and patient safety programs. Hayya Med Pro tracks all category types and enforces per-country caps automatically.",
      },
    },
    {
      "@type": "Question",
      name: "Can pharmacists count online CME activities in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, but online caps apply. SCFHS allows up to 50% online (30 of 60 credits). QCHP Qatar allows up to 50% online (40 of 80). DHA Dubai allows a maximum of 20 online credits per 2-year cycle. Kuwait MOH applies the strictest cap at 30% (9 of 30 credits). Hayya Med Pro automatically tracks your online credit count and alerts you if you approach the cap.",
      },
    },
    {
      "@type": "Question",
      name: "Do pharmacists in UAE need different CME requirements for DHA vs DOH?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Pharmacists licensed with DHA (Dubai Health Authority) require 40 CME credits per 2-year cycle with a mandatory 5 patient safety credits. Pharmacists licensed with DOH (Department of Health Abu Dhabi) require 40 CPD credits per 2-year cycle with a maximum of 20 online credits and 15 self-directed credits. If you hold licenses in both emirates, Hayya Med Pro tracks both simultaneously.",
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
  { icon: "ðŸ’Š", name: "Pharmacy Practice", desc: "Clinical pharmacy conferences, medication management workshops, drug interaction seminars, pharmacovigilance training" },
  { icon: "ðŸ’»", name: "Online / E-Learning", desc: "Accredited pharmacy e-learning modules, virtual conferences, online drug information courses (capped at 30â€“50% depending on country)" },
  { icon: "ðŸ“„", name: "Research & Publications", desc: "Authoring pharmacy journal articles, presenting at professional conferences, contributing to drug utilization reviews" },
  { icon: "ðŸŽ“", name: "Postgraduate Education", desc: "Clinical pharmacy specialty diplomas, fellowship programs, MSc or PharmD coursework (typically 10â€“25 credits per semester)" },
  { icon: "ðŸ«", name: "Teaching", desc: "Lecturing at pharmacy schools, supervising pharmacy students or interns, developing clinical training programs" },
  { icon: "ðŸ›¡ï¸", name: "Patient Safety", desc: "Mandatory in Qatar (2 credits/cycle) and UAE Dubai (5 credits/cycle). Covers medication errors, adverse drug reactions, safe dispensing practices" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Set up your pharmacy compliance wallet", desc: "Select your country (or multiple countries), enter your cycle dates, and confirm your specialty. Hayya Med Pro configures the correct credit rules and caps for each authority." },
  { step: "2", title: "Log CME activities as you complete them", desc: "Record conferences, e-learning modules, and research outputs. Upload your certificate for verification. AI suggests the correct activity category from the title." },
  { step: "3", title: "Track your compliance score in real time", desc: "Your dashboard shows total credits earned, online credit count vs. cap, patient safety credits (where mandatory), and whether you're on pace for renewal." },
  { step: "4", title: "Download your compliance portfolio", desc: "Generate a PDF CME/CPD report with all your pharmacy activities, formatted for submission to QCHP, SCFHS, DHA, or any GCC licensing authority." },
];

export default function PharmacistCmePage() {
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
              ðŸ’Š Pharmacists Â· All GCC Countries Â· CME & CPD
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Pharmacist CME requirements<br className="hidden sm:block" /> across the GCC â€” one tracker
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              SCFHS Saudi Arabia requires 60 CME credits per year. QCHP Qatar requires 80 CPD credits per 2-year cycle.
              DHA Dubai requires 40 CME per 2 years. Hayya Med Pro tracks your progress against all of these â€” simultaneously.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors"
              >
                Track my pharmacist CME â€” free â†’
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
              <h2 className="text-lg font-bold text-[#111]">Pharmacist CME / CPD requirements â€” GCC at a glance</h2>
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
              <p className="text-xs text-[#64748b]">Working across multiple GCC countries? Hayya Med Pro tracks your compliance against every authority simultaneously.</p>
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
            <h2 className="text-xl font-bold text-[#111] mb-2">CME activity categories accepted for pharmacists</h2>
            <p className="text-sm text-[#64748b] mb-6">
              GCC authorities accept a wide range of pharmacy CPD activities. Caps and mandatory minimums vary by country and authority.
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
            <h2 className="text-xl font-bold text-[#111] mb-6">How Hayya Med Pro works for pharmacist CME tracking</h2>
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
            <h2 className="text-xl font-bold text-[#111] mb-6">Frequently asked questions â€” pharmacist CME in GCC</h2>
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
                { icon: "ðŸ‘©â€âš•ï¸", title: "Nurses", href: "/nurse-cpd" },
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
              Your pharmacy license renewal starts here
            </h2>
            <p className="text-[#94a3b8] text-sm max-w-xl mx-auto mb-6">
              Hayya Med Pro tracks every credit, enforces online caps, flags patient safety requirements,
              and generates your submission-ready PDF portfolio â€” for every GCC authority you&apos;re licensed with.
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

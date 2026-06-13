import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "GCC CME Requirements â€” Compare Healthcare CME by Country | Hayya Med Pro",
  description:
    "Compare CME and CPD requirements for healthcare professionals across all GCC countries: Qatar (QCHP), Saudi Arabia (SCFHS), UAE (DHA, DOH), Kuwait (MOH), Bahrain (NHRA), and Oman (OMSB). Credits, cycles, and key rules at a glance.",
  keywords: [
    "GCC CME requirements",
    "GCC healthcare CPD",
    "QCHP vs SCFHS requirements",
    "healthcare CME comparison GCC",
    "CME credits by country",
    "GCC medical license renewal",
    "healthcare compliance GCC countries",
    "QCHP SCFHS DHA comparison",
    "GCC CPD requirements comparison",
  ],
  openGraph: {
    title: "GCC CME Requirements â€” All Countries Compared",
    description:
      "Compare QCHP, SCFHS, DHA, DOH, MOH, NHRA, and OMSB CME requirements side by side. Credits, cycles, and rules for every GCC country.",
    url: `${APP_URL}/countries`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=GCC+CME+Requirements+%E2%80%94+All+Countries&s=Compare+QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%C2%B7+DOH+%C2%B7+NHRA+%C2%B7+OMSB+side+by+side&a=%F0%9F%87%AC%F0%9F%87%A7+GCC&k=Country+Hub`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GCC CME Requirements â€” Compare All GCC Countries",
    description:
      "Credits, cycles, and requirements for Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/countries` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which GCC country has the highest CME credit requirement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Saudi Arabia (SCFHS) has the highest requirement for physicians, pharmacists, and dentists at 60 CME credits per year. Qatar (QCHP) requires 80 CPD credits over a 2-year cycle (40 per year minimum). Most other GCC countries require 30â€“40 credits per year or per 2-year cycle.",
      },
    },
    {
      "@type": "Question",
      name: "Can CME credits earned in Qatar count toward SCFHS requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not automatically. Each GCC licensing authority has its own list of approved providers and accreditation bodies. However, activities accredited by internationally recognised bodies (such as AMA PRA, RCPCH, or GMC) may be accepted by multiple authorities. Always verify with the specific authority before submitting cross-border activities.",
      },
    },
    {
      "@type": "Question",
      name: "Do all GCC countries require patient safety CME credits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most GCC countries require at least some patient safety training as part of their CME programme. QCHP (Qatar) requires 2 patient safety credits per cycle. SCFHS (Saudi Arabia) and DHA (UAE Dubai) require 5 patient safety credits per year. Requirements vary by country and profession.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track CME requirements for multiple GCC countries in one place?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-jurisdiction tracking. Healthcare professionals licensed in multiple GCC countries can add separate CME wallets for each authority â€” QCHP, SCFHS, DHA, DOH, NHRA, OMSB, and MOH Kuwait â€” within the same account. Each wallet tracks credits independently against its authority's specific requirements.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I miss my CME renewal deadline in a GCC country?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The consequences vary by country. Most GCC licensing authorities will not renew your license until CME requirements are satisfied. In some countries, a lapsed license may require a new application with additional documentation. Hayya Med Pro sends automated alerts at 90, 30, and 7 days before renewal deadlines to prevent this situation.",
      },
    },
  ],
};

const COUNTRIES_DATA = [
  {
    name: "Qatar",
    flag: "ðŸ‡¶ðŸ‡¦",
    authority: "QCHP",
    authorityFull: "Qatar Council for Healthcare Practitioners",
    term: "CPD",
    cycle: "2 years",
    credits: 80,
    creditsLabel: "80 CPD credits / 2yr",
    minPerYear: "40 min per year",
    onlineCap: "No specific cap",
    patientSafety: "2 credits mandatory",
    professionNote: "All licensed healthcare professions",
    href: "/qchp",
    color: "#8B1A1A",
    bg: "#fff1f1",
    border: "#fecaca",
    text: "#8B1A1A",
  },
  {
    name: "Saudi Arabia",
    flag: "ðŸ‡¸ðŸ‡¦",
    authority: "SCFHS",
    authorityFull: "Saudi Commission for Health Specialties",
    term: "CME",
    cycle: "1 year",
    credits: 60,
    creditsLabel: "30â€“60 credits / year",
    minPerYear: "Profession-specific",
    onlineCap: "50% max online",
    patientSafety: "5 credits mandatory",
    professionNote: "Physicians/Pharmacists/Dentists: 60. Nurses/AHP: 30.",
    href: "/scfhs",
    color: "#15803d",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    text: "#15803d",
  },
  {
    name: "UAE â€” Dubai",
    flag: "ðŸ‡¦ðŸ‡ª",
    authority: "DHA",
    authorityFull: "Dubai Health Authority",
    term: "CME",
    cycle: "2 years",
    credits: 40,
    creditsLabel: "40 CME credits / 2yr",
    minPerYear: "No minimum per year",
    onlineCap: "Max 20 (50%)",
    patientSafety: "5 credits mandatory",
    professionNote: "All DHA-licensed professionals",
    href: "/dha",
    color: "#0c4a6e",
    bg: "#f0f9ff",
    border: "#bae6fd",
    text: "#0c4a6e",
  },
  {
    name: "UAE â€” Abu Dhabi",
    flag: "ðŸ‡¦ðŸ‡ª",
    authority: "DOH",
    authorityFull: "Department of Health â€“ Abu Dhabi",
    term: "CPD",
    cycle: "1â€“2 years",
    credits: 50,
    creditsLabel: "30â€“50 CPD credits",
    minPerYear: "Profession-specific",
    onlineCap: "Max 20 online",
    patientSafety: "Included in accredited CPD",
    professionNote: "Requirements vary by profession and specialty",
    href: "/doh",
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#1d4ed8",
  },
  {
    name: "Kuwait",
    flag: "ðŸ‡°ðŸ‡¼",
    authority: "MOH Kuwait",
    authorityFull: "Ministry of Health â€” Kuwait",
    term: "CME",
    cycle: "1 year",
    credits: 30,
    creditsLabel: "30 CME credits / year",
    minPerYear: "30 per year",
    onlineCap: "30% max online",
    patientSafety: "Varies by profession",
    professionNote: "Physicians/Pharmacists: 30/yr. Nurses/AHP: 20/yr.",
    href: "/moh-kuwait",
    color: "#92400e",
    bg: "#fff7ed",
    border: "#fed7aa",
    text: "#92400e",
  },
  {
    name: "Bahrain",
    flag: "ðŸ‡§ðŸ‡­",
    authority: "NHRA",
    authorityFull: "National Health Regulatory Authority",
    term: "CPD",
    cycle: "2 years",
    credits: 40,
    creditsLabel: "40 CPD credits / 2yr",
    minPerYear: "No minimum per year",
    onlineCap: "Max 20 online",
    patientSafety: "Included in structured CPD",
    professionNote: "All NHRA-licensed healthcare professionals",
    href: "/nhra",
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#ddd6fe",
    text: "#7c3aed",
  },
  {
    name: "Oman",
    flag: "ðŸ‡´ðŸ‡²",
    authority: "OMSB",
    authorityFull: "Oman Medical Specialty Board",
    term: "CME",
    cycle: "2 years",
    credits: 40,
    creditsLabel: "40 CME credits / 2yr",
    minPerYear: "No minimum per year",
    onlineCap: "Max 20 (Cat A online)",
    patientSafety: "Included in Cat A credits",
    professionNote: "Physicians: 40/2yr. Nurses/AHP: 30/2yr.",
    href: "/omsb",
    color: "#0f766e",
    bg: "#f0fdfa",
    border: "#99f6e4",
    text: "#0f766e",
  },
];

const COMPARISON_ROWS = [
  { label: "Authority", key: "authority" as const },
  { label: "Terminology", key: "term" as const },
  { label: "Cycle length", key: "cycle" as const },
  { label: "Credits required", key: "creditsLabel" as const },
  { label: "Online cap", key: "onlineCap" as const },
  { label: "Patient safety", key: "patientSafety" as const },
];

export default function CountriesPage() {
  const gccs = COUNTRIES_DATA;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Nav */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <span className="font-bold text-base text-[#111]">
                Hayya Med <span className="text-[#1a56a0]">Pro</span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-[#64748b] hover:text-[#111] transition-colors hidden sm:block">
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors"
              >
                Start free â†’
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-12">

          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              GCC Â· 7 countries Â· 8 licensing authorities
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              GCC CME requirements,<br className="hidden sm:block" /> compared country by country
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Every GCC licensing authority has different credit requirements, cycle lengths, and mandatory categories.
              Use this guide to understand what&apos;s required where â€” and track it all in one account.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors"
            >
              Track my compliance â€” free â†’
            </Link>
            <p className="text-xs text-[#94a3b8] mt-3">Supports all 7 GCC countries Â· No credit card required</p>
          </div>

          {/* Country cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-14">
            {gccs.map((c) => (
              <div
                key={c.authority}
                className="bg-white rounded-2xl border overflow-hidden"
                style={{ borderColor: c.border }}
              >
                <div className="px-5 py-4" style={{ background: c.bg }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.flag}</span>
                      <span className="text-sm font-bold" style={{ color: c.text }}>{c.authority}</span>
                    </div>
                    <Link
                      href={c.href!}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                      style={{ color: c.text }}
                    >
                      Full guide â†’
                    </Link>
                  </div>
                  <p className="text-xs text-[#64748b]">{c.name}</p>
                </div>
                <div className="px-5 py-4 space-y-2.5">
                  <div>
                    <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide mb-0.5">Credits</p>
                    <p className="text-sm font-bold text-[#111]">{c.creditsLabel}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide mb-0.5">Cycle</p>
                    <p className="text-sm text-[#374151]">{c.cycle}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide mb-0.5">Patient safety</p>
                    <p className="text-sm text-[#374151]">{c.patientSafety}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide mb-0.5">Term used</p>
                    <p className="text-sm text-[#374151]">{c.term}</p>
                  </div>
                  <p className="text-[11px] text-[#94a3b8] border-t border-[#f1f5f9] pt-2 leading-relaxed">
                    {c.professionNote}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Side-by-side comparison table */}
          <div className="mb-14">
            <h2 className="text-2xl font-bold text-[#111] mb-2">Side-by-side comparison</h2>
            <p className="text-sm text-[#64748b] mb-6">
              Key requirements for each GCC licensing authority at a glance. Requirements may vary by profession â€” click &ldquo;Full guide&rdquo; for profession-specific rules.
            </p>
            <div className="overflow-x-auto rounded-xl border border-[#e2e8f0]">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-[#0f1f3d] text-white">
                    <th className="text-left px-4 py-3 text-xs font-semibold w-32">Requirement</th>
                    {gccs.map((c) => (
                      <th key={c.authority} className="text-center px-3 py-3 text-xs font-semibold">
                        <div className="flex flex-col items-center gap-0.5">
                          <span>{c.flag}</span>
                          <span>{c.authority}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {COMPARISON_ROWS.map((row, ri) => (
                    <tr key={row.label} className={ri % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
                      <td className="px-4 py-3 text-xs font-semibold text-[#64748b]">{row.label}</td>
                      {gccs.map((c) => (
                        <td key={c.authority} className="px-3 py-3 text-center text-xs text-[#374151]">
                          {c[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-white">
                    <td className="px-4 py-3 text-xs font-semibold text-[#64748b]">Full guide</td>
                    {gccs.map((c) => (
                      <td key={c.authority} className="px-3 py-3 text-center">
                        <Link
                          href={c.href!}
                          className="inline-block text-[11px] font-semibold text-[#1a56a0] hover:underline"
                        >
                          View â†’
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-[#94a3b8] mt-2">
              * Credits shown are typical maximums. Always verify current requirements with the relevant licensing authority before renewal.
            </p>
          </div>

          {/* Multi-country professionals callout */}
          <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-2xl p-6 mb-14 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-shrink-0 text-3xl">ðŸŒ</div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-[#92400e] mb-1">Licensed in more than one GCC country?</h2>
              <p className="text-sm text-[#92400e] leading-relaxed">
                Many GCC healthcare professionals hold licenses in two or more countries. Hayya Med Pro supports separate CME wallets per jurisdiction in a single account â€” each tracking credits independently against its authority&apos;s specific rules.
              </p>
            </div>
            <Link
              href="/register"
              className="flex-shrink-0 text-sm font-semibold bg-[#d97706] text-white px-5 py-2.5 rounded-xl hover:bg-[#b45309] transition-colors"
            >
              Track multiple jurisdictions â†’
            </Link>
          </div>

          {/* Deep-link authority cards */}
          <div className="mb-14">
            <h2 className="text-xl font-bold text-[#111] mb-2">Authority-specific guides</h2>
            <p className="text-sm text-[#64748b] mb-6">
              Detailed requirements, category breakdowns, FAQs, and how Hayya Med Pro tracks each authority.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {gccs.map((c) => (
                <Link
                  key={c.authority}
                  href={c.href!}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:border-[#1a56a0] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{c.flag}</span>
                    <div>
                      <p className="text-sm font-bold text-[#111] group-hover:text-[#1a56a0] transition-colors">
                        {c.authority} â€” {c.name}
                      </p>
                      <p className="text-xs text-[#64748b]">{c.authorityFull}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                    <span>{c.creditsLabel} Â· {c.cycle} cycle</span>
                    <span className="text-[#1a56a0] font-semibold group-hover:translate-x-1 transition-transform inline-block">â†’</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">GCC CME requirements â€” frequently asked questions</h2>
            <div className="space-y-3">
              {faqLd.mainEntity.map((item) => (
                <details key={item.name} className="bg-white rounded-xl border border-[#e2e8f0] group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-[#111] list-none">
                    {item.name}
                    <svg className="w-4 h-4 text-[#64748b] flex-shrink-0 ml-4 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-[#64748b] border-t border-[#f1f5f9] pt-3 leading-relaxed">
                    {item.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Track your GCC compliance â€” all in one place</h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-xl mx-auto text-sm">
              Add one wallet per jurisdiction and Hayya Med Pro tracks each country&apos;s credits, caps, and deadlines independently. Free to start, upgrade for PDF reports and AI gap analysis.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3 rounded-xl hover:bg-[#f0f7ff] transition-colors"
              >
                Start tracking â€” free â†’
              </Link>
              <Link
                href="/pricing"
                className="border border-[rgba(255,255,255,0.3)] text-white font-semibold text-sm px-7 py-3 rounded-xl hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              >
                Compare plans
              </Link>
            </div>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">
              For healthcare employers: <Link href="/employers" className="underline hover:text-white/60">manage staff compliance â†’</Link>
            </p>
          </div>

          {/* CME vs CPD callout */}
          <div className="mt-8 mb-6 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#1e3a5f]">Not sure if your authority uses CME or CPD?</p>
              <p className="text-xs text-[#3b5a8a] mt-0.5">QCHP says CPD. SCFHS says CME. Here&apos;s the difference â€” and why it doesn&apos;t change how you track.</p>
            </div>
            <Link href="/cme-vs-cpd" className="flex-shrink-0 text-xs font-semibold text-[#1a56a0] border border-[#1a56a0]/30 rounded-lg px-3 py-2 hover:bg-white transition-colors whitespace-nowrap">
              CME vs CPD explained â†’
            </Link>
          </div>

          {/* Browse by profession */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#111] mb-2">Browse requirements by profession</h2>
            <p className="text-sm text-[#64748b] mb-4">
              Requirements vary by profession in Saudi Arabia, Kuwait, and Oman. See profession-specific guides:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { href: "/physician-cme",    icon: "ðŸ©º",  title: "Physicians",    sub: "Doctor CME requirements across all GCC authorities" },
                { href: "/nurse-cpd",        icon: "ðŸ‘©â€âš•ï¸", title: "Nurses",        sub: "Nursing CPD â€” lower in Saudi (30/yr) and Kuwait (20/yr)" },
                { href: "/pharmacist-cme",   icon: "ðŸ’Š",  title: "Pharmacists",   sub: "Pharmacy CME â€” same as physicians in most GCC countries" },
                { href: "/dentist-cme",      icon: "ðŸ¦·",  title: "Dentists",      sub: "Dental CME requirements across SCFHS, QCHP, DHA, and more" },
                { href: "/allied-health-cpd",icon: "ðŸ¦¿",  title: "Allied Health", sub: "Physiotherapists, radiographers, lab techs, OTs â€” 30/yr SCFHS" },
              ].map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:border-[#1a56a0] hover:shadow-sm transition-all flex gap-4 items-start"
                >
                  <span className="text-2xl flex-shrink-0">{p.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#111] mb-0.5">{p.title}</p>
                    <p className="text-xs text-[#64748b] leading-relaxed">{p.sub}</p>
                    <p className="text-xs text-[#1a56a0] font-medium mt-1.5">View guide â†’</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e] text-center">
            Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Always verify final requirements with QCHP, SCFHS, DHA, DOH, NHRA, OMSB, or MOH Kuwait directly.
          </div>
        </main>
      </div>
    </>
  );
}

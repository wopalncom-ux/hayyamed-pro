import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "QCHP CME Tracker â€” Track Your Qatar CPD Requirements | Hayya Med Pro",
  description:
    "Track your QCHP CPD requirements automatically. Qatar healthcare professionals need 80 CPD credits every 2 years. Hayya Med Pro calculates your progress, sends renewal reminders, and generates your QCHP-ready compliance report.",
  keywords: [
    "QCHP CME tracker",
    "Qatar CPD requirements",
    "QCHP compliance",
    "Qatar healthcare professional CPD",
    "QCHP license renewal",
    "Qatar CME tracking",
    "QCHP 80 credits",
    "CPD tracker Qatar",
  ],
  openGraph: {
    title: "QCHP CPD Tracker â€” Track Your Qatar Healthcare Compliance",
    description:
      "80 CPD credits every 2 years. Hayya Med Pro tracks your QCHP progress, flags gaps, and generates your compliance report. Free to start.",
    url: `${APP_URL}/qchp`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=QCHP+CPD+Tracker+%E2%80%94+Qatar&s=80+CPD+credits+%C2%B7+2-year+cycle+%C2%B7+Free+for+GCC+healthcare+professionals&a=%F0%9F%87%B6%F0%9F%87%A6+QCHP&k=Authority+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "QCHP CPD Tracker â€” Qatar Healthcare Compliance",
    description: "Track your 80 QCHP credits automatically. Free for Qatar healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/qchp` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do I need for QCHP renewal in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QCHP-licensed healthcare professionals in Qatar must complete 80 CPD credits per 2-year renewal cycle. A minimum of 40 credits must be completed in each year of the cycle.",
      },
    },
    {
      "@type": "Question",
      name: "What is the QCHP CPD renewal cycle in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The QCHP CPD renewal cycle is 2 years. Healthcare professionals must accumulate 80 CPD credits across the 2-year period and submit a CPD portfolio before their license renewal date.",
      },
    },
    {
      "@type": "Question",
      name: "Can I count online CPD activities toward my QCHP requirement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Up to 50% of your total CPD credits (40 out of 80) can come from accredited online activities. The remaining credits must come from in-person activities such as conferences, workshops, or clinical training.",
      },
    },
    {
      "@type": "Question",
      name: "What categories of CPD activities does QCHP accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QCHP accepts: Clinical practice activities (conferences, workshops, clinical training), Professional development (management, leadership, communication), Research & publications (authoring or presenting), and Self-directed learning (journal reading, e-learning). Patient safety activities are mandatory (minimum 2 credits per cycle).",
      },
    },
    {
      "@type": "Question",
      name: "How do I submit my CPD portfolio to QCHP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CPD portfolios are submitted through the QCHP online portal (careers.moph.gov.qa) before your license renewal date. You need a documented record of all completed activities with provider names, dates, and credit values. Hayya Med Pro generates a ready-to-submit PDF compliance report.",
      },
    },
  ],
};

const CATEGORIES = [
  {
    name: "Clinical Practice",
    icon: "ðŸ¥",
    description: "Conferences, workshops, clinical training, case presentations",
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#1e40af",
  },
  {
    name: "Professional Development",
    icon: "ðŸ“ˆ",
    description: "Leadership, management, communication, ethics",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    text: "#15803d",
  },
  {
    name: "Research & Publications",
    icon: "ðŸ“„",
    description: "Authoring papers, presentations, research participation",
    bg: "#fff7ed",
    border: "#fed7aa",
    text: "#c2410c",
  },
  {
    name: "Self-Directed Learning",
    icon: "ðŸ“š",
    description: "E-learning modules, journal reading, online courses",
    bg: "#faf5ff",
    border: "#e9d5ff",
    text: "#7e22ce",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Set up your QCHP wallet",
    desc: "Enter your profession, specialty, and cycle dates. Hayya Med Pro knows the 80-credit rule and applies it automatically.",
  },
  {
    step: "2",
    title: "Log each CPD activity",
    desc: "Add conferences, workshops, and online courses as you complete them. Upload your certificate for verification.",
  },
  {
    step: "3",
    title: "Track your progress in real time",
    desc: "Your dashboard shows exactly how many credits you have, how many you need, and whether you're on track for renewal.",
  },
  {
    step: "4",
    title: "Download your QCHP report",
    desc: "Generate a PDF compliance report formatted for QCHP submission â€” with all activities, providers, and credit totals.",
  },
];

export default function QchpPage() {
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
              ðŸ‡¶ðŸ‡¦ Qatar Â· QCHP / DHP-AS Â· Ministry of Public Health
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Track your QCHP CPD<br className="hidden sm:block" /> requirements â€” automatically
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Qatar healthcare professionals must complete <strong className="text-[#111]">80 CPD credits</strong> every 2 years.
              Hayya Med Pro tracks your progress, flags category gaps, and generates your QCHP-ready compliance report.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors"
              >
                Track my QCHP compliance â€” free â†’
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

          {/* Requirement summary card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-10 shadow-sm">
            <h2 className="text-lg font-bold text-[#111] mb-6">QCHP CPD requirements at a glance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: "Total credits required", value: "80", sub: "per 2-year cycle", color: "#1a56a0" },
                { label: "Minimum per year", value: "40", sub: "credits each year", color: "#1a56a0" },
                { label: "Online activity cap", value: "50%", sub: "max 40 credits online", color: "#d97706" },
                { label: "Patient safety", value: "2+", sub: "credits mandatory", color: "#dc2626" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs font-semibold text-[#374151] mb-0.5 leading-snug">{s.label}</p>
                  <p className="text-[11px] text-[#94a3b8]">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[#f1f5f9] flex flex-wrap gap-4 text-xs text-[#64748b]">
              <span><strong className="text-[#374151]">Authority:</strong> Department of Healthcare Professionals â€“ Accreditation Section (DHP-AS)</span>
              <span><strong className="text-[#374151]">Under:</strong> Ministry of Public Health Qatar (MOPH)</span>
              <span><strong className="text-[#374151]">Terminology:</strong> CPD (Continuing Professional Development)</span>
            </div>
          </div>

          {/* CPD categories */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-2">Accepted CPD activity categories</h2>
            <p className="text-sm text-[#64748b] mb-6">
              QCHP accepts activities across four categories. Hayya Med Pro tracks credits and caps for each automatically.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CATEGORIES.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border p-5"
                  style={{ background: c.bg, borderColor: c.border }}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xl">{c.icon}</span>
                    <h3 className="text-sm font-bold" style={{ color: c.text }}>{c.name}</h3>
                  </div>
                  <p className="text-xs text-[#374151] leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e]">
              <strong>Mandatory:</strong> At least 2 CPD credits must come from patient safety activities each renewal cycle. Hayya Med Pro flags this requirement and alerts you if it&apos;s unmet.
            </div>
          </div>

          {/* How it works */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-6">How Hayya Med Pro works for QCHP tracking</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.step} className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a56a0] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111] mb-1">{step.title}</h3>
                    <p className="text-xs text-[#64748b] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manual vs platform comparison */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-4 border-b border-[#f1f5f9]">
              <h2 className="text-base font-bold text-[#111]">Manual tracking vs Hayya Med Pro</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f1f5f9]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide w-1/3"></th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Spreadsheet / Manual</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#1a56a0] uppercase tracking-wide bg-[#f0f7ff]">Hayya Med Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f8fafc]">
                  {[
                    ["Real-time compliance status", "âŒ", "âœ…"],
                    ["Automatic credit calculation", "âŒ", "âœ…"],
                    ["Category cap warnings", "âŒ", "âœ…"],
                    ["License renewal reminders", "âŒ", "âœ…"],
                    ["PDF report for QCHP submission", "âŒ", "âœ… Pro"],
                    ["AI compliance gap analysis", "âŒ", "âœ… Pro"],
                    ["Certificate storage", "âŒ", "âœ… Pro"],
                    ["Employer compliance view", "âŒ", "âœ… Employer"],
                  ].map(([feature, manual, platform]) => (
                    <tr key={feature}>
                      <td className="px-6 py-3 text-sm text-[#374151]">{feature}</td>
                      <td className="px-4 py-3 text-center text-sm text-[#94a3b8]">{manual}</td>
                      <td className="px-4 py-3 text-center text-sm bg-[#f8fbff]">{platform}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">QCHP CPD â€” frequently asked questions</h2>
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

          {/* Renewal guide link */}
          <div className="mb-10 bg-[#fef9c3] border border-[#fde68a] rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#92400e]">Ready to renew? Step-by-step QCHP renewal guide â†’</p>
              <p className="text-xs text-[#a16207] mt-0.5">Checklist, submission tips, and how to prepare your CPD portfolio for QCHP.</p>
            </div>
            <Link href="/qchp-renewal" className="flex-shrink-0 bg-[#d97706] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#b45309] transition-colors whitespace-nowrap">
              QCHP Renewal Guide â†’
            </Link>
          </div>

          {/* Profession cross-links */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-5">CPD requirements by profession</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { icon: "ðŸ©º", title: "Physicians", href: "/physician-cme" },
                { icon: "ðŸ‘©â€âš•ï¸", title: "Nurses", href: "/nurse-cpd" },
                { icon: "ðŸ’Š", title: "Pharmacists", href: "/pharmacist-cme" },
                { icon: "ðŸ¦·", title: "Dentists", href: "/dentist-cme" },
                { icon: "ðŸ¦¿", title: "Allied Health", href: "/allied-health-cpd" },
              ].map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#1a56a0] hover:shadow-sm transition-all group"
                >
                  <span className="text-2xl block mb-2">{p.icon}</span>
                  <p className="text-sm font-semibold text-[#111] group-hover:text-[#1a56a0] transition-colors">{p.title}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Specialty cross-links */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-2">QCHP CPD requirements by specialty</h2>
            <p className="text-sm text-[#64748b] mb-5">Select your specialty for Qatar-specific CPD notes and mandatory activity types.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { icon: "â¤ï¸", title: "Cardiology",      href: "/cardiology-cme" },
                { icon: "ðŸ©º", title: "Internal Med",    href: "/internal-medicine-cme" },
                { icon: "ðŸš‘", title: "Emergency Med",   href: "/emergency-medicine-cme" },
                { icon: "ðŸ”ª", title: "Surgery",         href: "/surgery-cme" },
                { icon: "ðŸ‘¶", title: "Pediatrics",      href: "/pediatrics-cme" },
                { icon: "ðŸ©»", title: "Radiology",       href: "/radiology-cme" },
                { icon: "ðŸ§ ", title: "Psychiatry",      href: "/psychiatry-cme" },
                { icon: "ðŸ¤±", title: "OB / Gyn",       href: "/obstetrics-gynecology-cme" },
                { icon: "ðŸ’‰", title: "Anesthesia",      href: "/anesthesia-cme" },
                { icon: "ðŸ¦´", title: "Orthopedics",     href: "/orthopedics-cme" },
                { icon: "ðŸ¡", title: "Family Medicine", href: "/family-medicine-cme" },
                { icon: "ðŸ©º", title: "Dermatology",    href: "/dermatology-cme" },
                { icon: "ðŸ§ ", title: "Neurology",      href: "/neurology-cme" },
                { icon: "ðŸ«", title: "Nephrology",     href: "/nephrology-cme" },
                { icon: "ðŸ‘", title: "Ophthalmology",  href: "/ophthalmology-cme" },
              ].map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#1a56a0] hover:shadow-sm transition-all group"
                >
                  <span className="text-2xl block mb-2">{p.icon}</span>
                  <p className="text-sm font-semibold text-[#111] group-hover:text-[#1a56a0] transition-colors">{p.title}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] rounded-2xl p-10 text-center">
            <div className="inline-block text-3xl mb-3">ðŸ‡¶ðŸ‡¦</div>
            <h2 className="text-2xl font-bold text-white mb-2">Start tracking your QCHP compliance today</h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Join Qatar healthcare professionals who track their 80-credit CPD requirement with Hayya Med Pro. Free to start â€” upgrade for PDF reports and AI compliance tools.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f7ff] transition-colors"
            >
              Track my QCHP compliance â€” free â†’
            </Link>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">
              No credit card required Â· 14-day Pro trial included
            </p>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e] text-center">
            Hayya Med Pro supports CPD tracking and licensing readiness. It does not issue licenses and does not replace official QCHP or MOPH requirements. Always verify final requirements with the Department of Healthcare Professionals â€“ Accreditation Section (DHP-AS).
          </div>
        </main>
      </div>
    </>
  );
}

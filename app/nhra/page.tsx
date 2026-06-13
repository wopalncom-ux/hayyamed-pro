import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Bahrain CPD Tracker â€” NHRA CPD Requirements | Hayya Med Pro",
  description:
    "Track your NHRA Bahrain CPD requirements automatically. Bahrain healthcare professionals need 40 CPD credits every 2 years. Hayya Med Pro tracks structured and unstructured CPD, enforces caps, and generates your NHRA compliance report.",
  keywords: [
    "NHRA CPD tracker",
    "Bahrain CPD requirements",
    "NHRA Bahrain compliance",
    "Bahrain healthcare CPD",
    "NHRA CPD credits",
    "Bahrain CPD tracking",
    "NHRA 40 credits",
    "CPD tracker Bahrain",
  ],
  openGraph: {
    title: "NHRA CPD Tracker â€” Bahrain Healthcare Compliance",
    description:
      "40 CPD credits every 2 years. Track structured and unstructured Bahrain NHRA CPD automatically â€” free to start.",
    url: `${APP_URL}/nhra`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=NHRA+CPD+Tracker+%E2%80%94+Bahrain&s=40+CPD+credits+%C2%B7+2-year+cycle+%C2%B7+Structured+%2B+unstructured+CPD&a=%F0%9F%87%A7%F0%9F%87%AD+NHRA&k=Authority+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NHRA CPD Tracker â€” Bahrain Healthcare Compliance",
    description: "Track your 40 NHRA CPD credits automatically. Free for Bahrain healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/nhra` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do I need for NHRA Bahrain license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The National Health Regulatory Authority (NHRA) in Bahrain requires 40 CPD credits per 2-year renewal cycle for all licensed healthcare professionals, regardless of profession or specialty.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between structured and unstructured CPD in Bahrain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NHRA divides CPD into Structured (accredited activities like conferences, workshops, and accredited online courses) and Unstructured (self-directed learning like journal reading, case studies, and teaching). A maximum of 20 credits can come from unstructured activities per 2-year cycle.",
      },
    },
    {
      "@type": "Question",
      name: "What is the online CPD limit for NHRA Bahrain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NHRA Bahrain allows a maximum of 20 online CPD credits per 2-year cycle. Online activities must be from accredited providers. Hayya Med Pro tracks your online credit total and warns you when you approach the cap.",
      },
    },
    {
      "@type": "Question",
      name: "What categories of CPD does NHRA Bahrain accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NHRA accepts: Structured Accredited Activities (conferences, workshops), Online Accredited Activities (max 20 per cycle), Unstructured Self-Directed Learning (max 20 per cycle), Teaching and Training, and Research and Publications.",
      },
    },
    {
      "@type": "Question",
      name: "How do I submit my CPD portfolio to NHRA Bahrain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CPD portfolios are submitted through the NHRA online portal (nhra.bh) before your 2-year license renewal date. Hayya Med Pro generates a structured CPD report listing all activities by category â€” ready for NHRA submission.",
      },
    },
  ],
};

const CATEGORIES = [
  {
    name: "Structured Accredited",
    icon: "ðŸ›ï¸",
    description: "Conferences, workshops, seminars â€” all accredited by NHRA or recognized bodies",
    bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af",
  },
  {
    name: "Online (Accredited)",
    icon: "ðŸ’»",
    description: "Accredited e-learning platforms and online courses (max 20 credits per cycle)",
    bg: "#fff7ed", border: "#fed7aa", text: "#c2410c",
  },
  {
    name: "Unstructured Self-Directed",
    icon: "ðŸ“š",
    description: "Journal reading, case studies, independent study (max 20 credits per cycle)",
    bg: "#faf5ff", border: "#e9d5ff", text: "#7e22ce",
  },
  {
    name: "Teaching & Research",
    icon: "ðŸ“„",
    description: "Teaching clinical staff, research participation, academic publications",
    bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Set up your NHRA CPD wallet",
    desc: "Select Bahrain as your country. Hayya Med Pro sets the 40-credit 2-year rule and tracks the 20-credit caps for online and unstructured CPD.",
  },
  {
    step: "2",
    title: "Log each CPD activity",
    desc: "Record conferences, online courses, and self-directed learning as you complete them. Upload certificates for verified accredited credit.",
  },
  {
    step: "3",
    title: "Monitor structured vs unstructured balance",
    desc: "Your dashboard shows how many structured and unstructured credits you've earned, cap usage, and your overall 40-credit progress.",
  },
  {
    step: "4",
    title: "Generate your NHRA CPD report",
    desc: "Download a PDF CPD report categorized for NHRA Bahrain â€” structured, unstructured, online, and teaching activities all listed.",
  },
];

export default function NhraPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="min-h-screen bg-[#f8fafc]">
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <span className="font-bold text-base text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
            </Link>
            <Link href="/register" className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors">
              Start free â†’
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">

          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1a56a0] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              ðŸ‡§ðŸ‡­ Bahrain Â· National Health Regulatory Authority (NHRA)
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Track your NHRA Bahrain CPD<br className="hidden sm:block" /> requirements â€” automatically
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Bahrain healthcare professionals must complete <strong className="text-[#111]">40 CPD credits</strong> every 2 years.
              Hayya Med Pro tracks structured and unstructured CPD, enforces category caps, and generates your NHRA-ready report.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">
                Track my NHRA compliance â€” free â†’
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors">
                See what&apos;s free vs Pro
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-3">No credit card required Â· 14-day Pro trial included</p>
          </div>

          {/* Requirements card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-10 shadow-sm">
            <h2 className="text-lg font-bold text-[#111] mb-6">NHRA Bahrain CPD requirements at a glance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: "Total credits required", value: "40", sub: "per 2-year cycle", color: "#1a56a0" },
                { label: "Online CPD cap", value: "20", sub: "credits max online", color: "#d97706" },
                { label: "Unstructured cap", value: "20", sub: "self-directed max", color: "#7e22ce" },
                { label: "Renewal cycle", value: "2 yrs", sub: "biennial requirement", color: "#16a34a" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs font-semibold text-[#374151] mb-0.5 leading-snug">{s.label}</p>
                  <p className="text-[11px] text-[#94a3b8]">{s.sub}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-[#f1f5f9] flex flex-wrap gap-4 text-xs text-[#64748b]">
              <span><strong className="text-[#374151]">Authority:</strong> National Health Regulatory Authority (NHRA)</span>
              <span><strong className="text-[#374151]">Website:</strong> nhra.bh</span>
              <span><strong className="text-[#374151]">Terminology:</strong> CPD (Continuing Professional Development)</span>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-2">Accepted CPD activity categories</h2>
            <p className="text-sm text-[#64748b] mb-6">
              NHRA splits CPD into structured and unstructured activities. Hayya Med Pro enforces both category caps automatically.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CATEGORIES.map((c) => (
                <div key={c.name} className="rounded-xl border p-5" style={{ background: c.bg, borderColor: c.border }}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xl">{c.icon}</span>
                    <h3 className="text-sm font-bold" style={{ color: c.text }}>{c.name}</h3>
                  </div>
                  <p className="text-xs text-[#374151] leading-relaxed">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-6">How Hayya Med Pro works for NHRA CPD tracking</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.step} className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a56a0] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{step.step}</div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111] mb-1">{step.title}</h3>
                    <p className="text-xs text-[#64748b] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison */}
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
                    ["Structured vs unstructured tracking", "âŒ", "âœ…"],
                    ["Online CPD cap enforcement (20 max)", "âŒ", "âœ…"],
                    ["Real-time 2-year cycle progress", "âŒ", "âœ…"],
                    ["License renewal reminders", "âŒ", "âœ…"],
                    ["PDF report for NHRA submission", "âŒ", "âœ… Pro"],
                    ["AI CPD gap analysis", "âŒ", "âœ… Pro"],
                    ["Certificate storage", "âŒ", "âœ… Pro"],
                    ["Employer compliance dashboard", "âŒ", "âœ… Employer"],
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
            <h2 className="text-xl font-bold text-[#111] mb-6">NHRA Bahrain CPD â€” frequently asked questions</h2>
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
              <p className="text-sm font-semibold text-[#92400e]">Ready to renew? GCC license renewal guide â†’</p>
              <p className="text-xs text-[#a16207] mt-0.5">Step-by-step NHRA renewal checklist and CPD portfolio tips for Bahrain healthcare professionals.</p>
            </div>
            <Link href="/gcc-medical-license-renewal" className="flex-shrink-0 bg-[#d97706] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#b45309] transition-colors whitespace-nowrap">
              GCC Renewal Guides â†’
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
            <h2 className="text-xl font-bold text-[#111] mb-2">NHRA CPD requirements by specialty</h2>
            <p className="text-sm text-[#64748b] mb-5">Select your specialty for Bahrain-specific CPD notes and mandatory activity types.</p>
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
            <div className="inline-block text-3xl mb-3">ðŸ‡§ðŸ‡­</div>
            <h2 className="text-2xl font-bold text-white mb-2">Start tracking your NHRA CPD today</h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Hayya Med Pro automatically applies NHRA Bahrain rules â€” 40 credits per 2-year cycle, structured/unstructured balance, and online cap tracking. Free to start.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f7ff] transition-colors">
              Track my NHRA CPD â€” free â†’
            </Link>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">No credit card required Â· 14-day Pro trial included</p>
          </div>

          <div className="mt-6 bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e] text-center">
            Hayya Med Pro supports CPD tracking and licensing readiness. It does not issue licenses and does not replace official NHRA requirements. Always verify final requirements with the National Health Regulatory Authority Bahrain (nhra.bh).
          </div>
        </main>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Kuwait CME Tracker â€” MOH Kuwait CME Requirements | Hayya Med Pro",
  description:
    "Track your Kuwait Ministry of Health CME requirements automatically. Physicians need 30 CME credits per year. Hayya Med Pro calculates your progress, alerts you to gaps, and generates your compliance report.",
  keywords: [
    "Kuwait CME tracker",
    "MOH Kuwait CME requirements",
    "Kuwait healthcare CME",
    "Kuwait physician CME",
    "Kuwait nurse CME",
    "Kuwait CME credits",
    "Ministry of Health Kuwait CME",
    "CME tracker Kuwait",
  ],
  openGraph: {
    title: "Kuwait CME Tracker â€” MOH Kuwait Requirements",
    description:
      "Physicians: 30 CME/year. Nurses: 20 CME/year. Track your Kuwait MOH compliance automatically â€” free to start.",
    url: `${APP_URL}/moh-kuwait`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=MOH+Kuwait+CME+Requirements&s=30+CME%2Fyear+%28physicians%29+%C2%B7+20%2Fyear+%28nurses%29+%C2%B7+Annual+renewal+cycle&a=%F0%9F%87%B0%F0%9F%87%BC+MOH+Kuwait&k=Authority+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuwait CME Tracker â€” MOH Requirements",
    description: "Track Kuwait MOH CME requirements automatically. Free for Kuwait healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/moh-kuwait` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do I need for Kuwait MOH license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kuwait Ministry of Health requires 30 CME credits per year for physicians and pharmacists, and 20 CME credits per year for nurses and allied health professionals. The annual cycle resets each year based on your license registration date.",
      },
    },
    {
      "@type": "Question",
      name: "What is Kuwait's limit on online CME activities?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kuwait has the strictest online CME cap in the GCC â€” a maximum of 30% of your total annual credits (9 out of 30 for physicians) can come from online activities. The remaining 70% must come from in-person activities such as conferences, workshops, or seminars.",
      },
    },
    {
      "@type": "Question",
      name: "What categories of CME does Kuwait MOH accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kuwait MOH accepts: Conferences and Seminars (accredited events), Workshops (hands-on practical training), Online Activities (capped at 30%), and Self-Directed Learning (journal reading, case studies â€” capped). All activities must be accredited by MOH Kuwait or a recognized accrediting body.",
      },
    },
    {
      "@type": "Question",
      name: "Is the CME cycle in Kuwait the same for all healthcare professions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Kuwait MOH has profession-specific requirements: Physicians and Pharmacists require 30 CME credits per year; Nurses and Allied Health Professionals require 20 CME credits per year. The annual cycle applies equally across all professions.",
      },
    },
    {
      "@type": "Question",
      name: "How do I submit my CME record to Kuwait MOH?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CME records are submitted through the Kuwait MOH health professional portal before your annual license renewal date. Hayya Med Pro helps you maintain a complete, organized record of all completed activities and generates a summary report you can submit with your renewal application.",
      },
    },
  ],
};

const CATEGORIES = [
  {
    name: "Conferences & Seminars",
    icon: "ðŸ›ï¸",
    description: "Accredited medical conferences, symposia, and professional seminars",
    bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af",
  },
  {
    name: "Workshops",
    icon: "ðŸ”¬",
    description: "Hands-on practical workshops and clinical skills training",
    bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d",
  },
  {
    name: "Online Activities",
    icon: "ðŸ’»",
    description: "Accredited e-learning (max 30% of annual credits)",
    bg: "#fff7ed", border: "#fed7aa", text: "#c2410c",
  },
  {
    name: "Self-Directed Learning",
    icon: "ðŸ“š",
    description: "Journal reading, case studies, independent study (capped)",
    bg: "#faf5ff", border: "#e9d5ff", text: "#7e22ce",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Set up your Kuwait CME wallet",
    desc: "Select Kuwait as your country and your profession. Hayya Med Pro automatically applies the 30 or 20 credit annual rule and 30% online cap.",
  },
  {
    step: "2",
    title: "Log your CME activities",
    desc: "Add conferences, workshops, and online courses as you complete them. Upload certificates for verified credit.",
  },
  {
    step: "3",
    title: "Monitor your annual progress",
    desc: "Your dashboard shows your credit total, category breakdown, online cap usage, and whether you're on track before your renewal date.",
  },
  {
    step: "4",
    title: "Generate your compliance report",
    desc: "Download a PDF summary of all CME activities formatted for Kuwait MOH â€” with providers, dates, credits, and totals.",
  },
];

export default function MohKuwaitPage() {
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
              ðŸ‡°ðŸ‡¼ Kuwait Â· Ministry of Health (MOH)
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Track your Kuwait MOH CME<br className="hidden sm:block" /> requirements â€” automatically
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Kuwait physicians must complete <strong className="text-[#111]">30 CME credits per year</strong>. Nurses and allied health: <strong className="text-[#111]">20 credits per year</strong>.
              Hayya Med Pro tracks your progress, enforces the 30% online cap, and generates your MOH-ready report.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">
                Track my Kuwait CME â€” free â†’
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors">
                See what&apos;s free vs Pro
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-3">No credit card required Â· 14-day Pro trial included</p>
          </div>

          {/* Requirements card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-10 shadow-sm">
            <h2 className="text-lg font-bold text-[#111] mb-6">Kuwait MOH CME requirements at a glance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: "Physician / Pharmacist", value: "30", sub: "credits per year", color: "#1a56a0" },
                { label: "Nurse / Allied Health", value: "20", sub: "credits per year", color: "#1a56a0" },
                { label: "Online activity cap", value: "30%", sub: "strictest in GCC", color: "#d97706" },
                { label: "Renewal cycle", value: "1 yr", sub: "annual requirement", color: "#16a34a" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs font-semibold text-[#374151] mb-0.5 leading-snug">{s.label}</p>
                  <p className="text-[11px] text-[#94a3b8]">{s.sub}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-[#f1f5f9] flex flex-wrap gap-4 text-xs text-[#64748b]">
              <span><strong className="text-[#374151]">Authority:</strong> Ministry of Health Kuwait (MOH)</span>
              <span><strong className="text-[#374151]">Terminology:</strong> CME (Continuing Medical Education)</span>
              <span><strong className="text-[#374151]">Note:</strong> Kuwait has the strictest online cap in the GCC (30% vs 50% elsewhere)</span>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-2">Accepted CME activity categories</h2>
            <p className="text-sm text-[#64748b] mb-6">
              Kuwait MOH accepts four categories. Hayya Med Pro tracks your credits and online cap automatically.
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
            <div className="mt-4 bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e]">
              <strong>Important:</strong> Kuwait&apos;s 30% online cap is the strictest in the GCC. For a physician needing 30 credits, only 9 credits can come from online activities. Hayya Med Pro warns you when you approach this cap.
            </div>
          </div>

          {/* How it works */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-6">How Hayya Med Pro works for Kuwait CME tracking</h2>
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

          {/* Comparison table */}
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
                    ["Annual credit tracking", "âŒ", "âœ…"],
                    ["30% online cap enforcement", "âŒ", "âœ…"],
                    ["Profession-specific rules", "âŒ", "âœ…"],
                    ["License renewal reminders", "âŒ", "âœ…"],
                    ["PDF report for MOH submission", "âŒ", "âœ… Pro"],
                    ["AI gap analysis", "âŒ", "âœ… Pro"],
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
            <h2 className="text-xl font-bold text-[#111] mb-6">Kuwait MOH CME â€” frequently asked questions</h2>
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
              <p className="text-xs text-[#a16207] mt-0.5">Step-by-step MOH Kuwait renewal checklist and CME portfolio tips for Kuwait healthcare professionals.</p>
            </div>
            <Link href="/gcc-medical-license-renewal" className="flex-shrink-0 bg-[#d97706] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#b45309] transition-colors whitespace-nowrap">
              GCC Renewal Guides â†’
            </Link>
          </div>

          {/* Profession cross-links */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-5">CME requirements by profession</h2>
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
            <h2 className="text-xl font-bold text-[#111] mb-2">Kuwait MOH CME requirements by specialty</h2>
            <p className="text-sm text-[#64748b] mb-5">Select your specialty for Kuwait-specific CME notes and mandatory activity types.</p>
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
            <div className="inline-block text-3xl mb-3">ðŸ‡°ðŸ‡¼</div>
            <h2 className="text-2xl font-bold text-white mb-2">Start tracking your Kuwait CME today</h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Hayya Med Pro automatically applies Kuwait MOH rules â€” profession-specific credits, the 30% online cap, and annual renewal tracking. Free to start.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f7ff] transition-colors">
              Track my Kuwait CME â€” free â†’
            </Link>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">No credit card required Â· 14-day Pro trial included</p>
          </div>

          <div className="mt-6 bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e] text-center">
            Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official Ministry of Health Kuwait requirements. Always verify final requirements with MOH Kuwait (moh.gov.kw).
          </div>
        </main>
      </div>
    </>
  );
}

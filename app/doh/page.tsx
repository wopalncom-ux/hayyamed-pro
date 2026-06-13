import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "UAE Abu Dhabi CPD Tracker â€” DOH CPD Requirements | Hayya Med Pro",
  description:
    "Track your DOH Abu Dhabi CPD requirements automatically. UAE Abu Dhabi healthcare professionals must complete 30â€“50 CPD credits per cycle depending on profession. Hayya Med Pro tracks accredited, online, and self-directed CPD and generates your DOH-ready compliance report.",
  keywords: [
    "DOH CPD tracker",
    "UAE Abu Dhabi CPD requirements",
    "DOH Abu Dhabi compliance",
    "Department of Health Abu Dhabi CPD",
    "DOH CPD credits",
    "Abu Dhabi healthcare CPD",
    "DOH license renewal CPD",
    "CPD tracker Abu Dhabi",
  ],
  openGraph: {
    title: "DOH Abu Dhabi CPD Tracker â€” UAE Healthcare Compliance",
    description:
      "30â€“50 CPD credits per cycle for UAE Abu Dhabi healthcare professionals. Track accredited and self-directed CPD, enforce caps, and generate your DOH compliance report â€” free to start.",
    url: `${APP_URL}/doh`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=DOH+CPD+Tracker+%E2%80%94+Abu+Dhabi&s=40+CPD+credits+%C2%B7+2-year+cycle+%C2%B7+Accredited+%2B+self-directed+categories&a=%F0%9F%87%A6%F0%9F%87%AA+DOH&k=Authority+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DOH Abu Dhabi CPD Tracker â€” UAE Healthcare Compliance",
    description: "Track your DOH Abu Dhabi CPD requirements automatically. Free for UAE healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/doh` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do I need for DOH Abu Dhabi license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Department of Health â€“ Abu Dhabi (DOH) requires healthcare professionals to complete 30â€“50 CPD credits per renewal cycle, depending on profession and specialty. Requirements are reviewed periodically. Hayya Med Pro applies the correct target based on your registered profession and country selection.",
      },
    },
    {
      "@type": "Question",
      name: "What is the online CPD limit for DOH Abu Dhabi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DOH Abu Dhabi allows a maximum of 20 online CPD credits per cycle. Online activities must be from accredited providers recognized by DOH or international equivalents. Hayya Med Pro tracks your online credit total and alerts you when you approach the cap.",
      },
    },
    {
      "@type": "Question",
      name: "What categories of CPD does DOH Abu Dhabi accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DOH Abu Dhabi accepts: Accredited Educational Activities (conferences, workshops), Online Accredited CPD (max 20 per cycle), Self-Directed Learning (max 15 per cycle), Postgraduate Study (per semester), Research and Publications, and Teaching and Clinical Training.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between DOH and DHA requirements in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DOH (Department of Health) governs Abu Dhabi, while DHA (Dubai Health Authority) governs Dubai. They are separate licensing authorities with distinct CPD frameworks. DHA requires 40 CME credits over 2 years, including 5 mandatory patient safety credits. DOH requirements vary by profession. Hayya Med Pro applies the correct rules for each authority.",
      },
    },
    {
      "@type": "Question",
      name: "How do I submit my CPD portfolio to DOH Abu Dhabi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CPD portfolios are submitted through the DOH Abu Dhabi online portal (doh.gov.ae) before your license renewal date. Hayya Med Pro generates a structured CPD activity report listing all activities by category â€” accredited, online, self-directed, postgraduate, research, and teaching â€” ready for DOH submission.",
      },
    },
  ],
};

const CATEGORIES = [
  {
    name: "Accredited Educational",
    icon: "ðŸ›ï¸",
    description: "Conferences, workshops, symposia, and certified training courses accredited by DOH or recognized bodies",
    bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af",
  },
  {
    name: "Online (Accredited, max 20)",
    icon: "ðŸ’»",
    description: "Accredited e-learning from DOH-recognized providers (maximum 20 credits per cycle)",
    bg: "#fff7ed", border: "#fed7aa", text: "#c2410c",
  },
  {
    name: "Self-Directed (max 15)",
    icon: "ðŸ“š",
    description: "Journal reading, clinical guidelines review, and independent self-study (maximum 15 per cycle)",
    bg: "#faf5ff", border: "#e9d5ff", text: "#7e22ce",
  },
  {
    name: "Postgraduate / Research / Teaching",
    icon: "ðŸ”¬",
    description: "Postgraduate study (per semester), research & publications, and clinical teaching activities",
    bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Set your profession and DOH cycle",
    desc: "Select UAE â€” Abu Dhabi as your country and your profession. Hayya Med Pro applies the correct DOH credit target for your profession and tracks accredited, online, self-directed, and postgraduate CPD separately.",
  },
  {
    step: "2",
    title: "Log each CPD activity by category",
    desc: "Record each activity under the correct category. Upload certificates for verified accredited credit. Hayya Med Pro enforces the 20-credit online cap and 15-credit self-directed cap automatically.",
  },
  {
    step: "3",
    title: "Monitor your CPD balance and caps",
    desc: "Your dashboard shows accredited vs self-directed totals, online cap usage, and your overall progress toward the DOH requirement. Renewal date reminders are sent at 90, 30, and 7 days.",
  },
  {
    step: "4",
    title: "Generate your DOH CPD report",
    desc: "Download a PDF CPD report organized by DOH category â€” accredited, online, self-directed, postgraduate, research, and teaching â€” ready for DOH portal submission.",
  },
];

export default function DohPage() {
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
              ðŸ‡¦ðŸ‡ª UAE â€” Abu Dhabi Â· Department of Health (DOH)
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Track your DOH Abu Dhabi CPD<br className="hidden sm:block" /> requirements â€” automatically
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              UAE Abu Dhabi healthcare professionals need <strong className="text-[#111]">30â€“50 CPD credits</strong> per renewal cycle.
              Hayya Med Pro tracks all DOH-accepted categories, enforces online and self-directed caps, and generates your DOH-ready compliance report.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">
                Track my DOH compliance â€” free â†’
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors">
                See what&apos;s free vs Pro
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-3">No credit card required Â· 14-day Pro trial included</p>
          </div>

          {/* Requirements card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-10 shadow-sm">
            <h2 className="text-lg font-bold text-[#111] mb-6">DOH Abu Dhabi CPD requirements at a glance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: "Credits required", value: "30â€“50", sub: "varies by profession", color: "#1a56a0" },
                { label: "Online CPD cap", value: "20", sub: "credits max online", color: "#d97706" },
                { label: "Self-directed cap", value: "15", sub: "credits max self-directed", color: "#7e22ce" },
                { label: "Renewal cycle", value: "1â€“2 yrs", sub: "profession-specific", color: "#16a34a" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs font-semibold text-[#374151] mb-0.5 leading-snug">{s.label}</p>
                  <p className="text-[11px] text-[#94a3b8]">{s.sub}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-[#f1f5f9] flex flex-wrap gap-4 text-xs text-[#64748b]">
              <span><strong className="text-[#374151]">Authority:</strong> Department of Health â€“ Abu Dhabi (DOH)</span>
              <span><strong className="text-[#374151]">Website:</strong> doh.gov.ae</span>
              <span><strong className="text-[#374151]">Terminology:</strong> CPD (Continuing Professional Development)</span>
            </div>
            <div className="mt-4 p-3 bg-[#eff6ff] border border-[#bfdbfe] rounded-lg text-xs text-[#1e40af]">
              <strong>Note:</strong> DOH Abu Dhabi and DHA Dubai are separate licensing authorities with different requirements. Healthcare professionals licensed in both must track compliance for each independently.{" "}
              <Link href="/dha" className="underline hover:no-underline">See DHA Dubai requirements â†’</Link>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-2">Accepted CPD activity categories</h2>
            <p className="text-sm text-[#64748b] mb-6">
              DOH Abu Dhabi accepts structured, online, and self-directed CPD activities. Category caps apply per cycle â€” Hayya Med Pro enforces them automatically.
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
            <h2 className="text-xl font-bold text-[#111] mb-6">How Hayya Med Pro works for DOH CPD tracking</h2>
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
                    ["Category tracking (accredited, online, self-directed)", "âŒ", "âœ…"],
                    ["Online CPD cap enforcement (20 max)", "âŒ", "âœ…"],
                    ["Self-directed cap enforcement (15 max)", "âŒ", "âœ…"],
                    ["Real-time cycle progress", "âŒ", "âœ…"],
                    ["License renewal reminders", "âŒ", "âœ…"],
                    ["PDF report for DOH submission", "âŒ", "âœ… Pro"],
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

          {/* DOH vs DHA comparison */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-4 border-b border-[#f1f5f9]">
              <h2 className="text-base font-bold text-[#111]">DOH Abu Dhabi vs DHA Dubai â€” key differences</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide"></th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#1d4ed8] uppercase tracking-wide">DOH â€” Abu Dhabi</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#0c4a6e] uppercase tracking-wide">DHA â€” Dubai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f8fafc]">
                  {[
                    ["Emirate covered", "Abu Dhabi", "Dubai"],
                    ["Terminology", "CPD", "CME"],
                    ["Credits required", "30â€“50 (by profession)", "40 per 2-year cycle"],
                    ["Mandatory patient safety", "Not specified", "5 credits mandatory"],
                    ["Online cap", "Max 20 per cycle", "Max 20 per cycle"],
                    ["Self-directed cap", "Max 15 per cycle", "Max 10 per cycle"],
                  ].map(([label, doh, dha]) => (
                    <tr key={label}>
                      <td className="px-6 py-3 text-xs font-semibold text-[#64748b]">{label}</td>
                      <td className="px-4 py-3 text-center text-sm text-[#374151]">{doh}</td>
                      <td className="px-4 py-3 text-center text-sm text-[#374151]">{dha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-[#f8fafc] border-t border-[#f1f5f9]">
              <Link href="/dha" className="text-xs font-semibold text-[#1a56a0] hover:underline">
                See full DHA Dubai requirements guide â†’
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">DOH Abu Dhabi CPD â€” frequently asked questions</h2>
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
              <p className="text-sm font-semibold text-[#92400e]">Ready to renew? Step-by-step DOH renewal guide â†’</p>
              <p className="text-xs text-[#a16207] mt-0.5">Renewal checklist, DOH portal submission steps, and how to prepare your CPD portfolio for Abu Dhabi license renewal.</p>
            </div>
            <Link href="/doh-renewal" className="flex-shrink-0 bg-[#d97706] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#b45309] transition-colors whitespace-nowrap">
              DOH Renewal Guide â†’
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
            <h2 className="text-xl font-bold text-[#111] mb-2">DOH CPD requirements by specialty</h2>
            <p className="text-sm text-[#64748b] mb-5">Select your specialty for DOH Abu Dhabi-specific CPD notes and recognised providers.</p>
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
            <div className="inline-block text-3xl mb-3">ðŸ‡¦ðŸ‡ª</div>
            <h2 className="text-2xl font-bold text-white mb-2">Start tracking your DOH Abu Dhabi CPD today</h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Hayya Med Pro applies DOH Abu Dhabi rules automatically â€” profession-specific credit targets, online and self-directed caps, and renewal reminders. Free to start.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f7ff] transition-colors">
              Track my DOH CPD â€” free â†’
            </Link>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">No credit card required Â· 14-day Pro trial included</p>
          </div>

          <div className="mt-6 bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e] text-center">
            Hayya Med Pro supports CPD tracking and licensing readiness. It does not issue licenses and does not replace official DOH requirements. Always verify final requirements with the Department of Health â€“ Abu Dhabi (doh.gov.ae).
          </div>
        </main>
      </div>
    </>
  );
}

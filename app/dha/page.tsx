import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "DHA CME Tracker â€” Track Dubai Healthcare CME Requirements | Hayya Med Pro",
  description:
    "Track your DHA CME requirements automatically. Dubai healthcare professionals need 40 CME credits per 2-year cycle. Hayya Med Pro tracks your progress and generates your DHA-ready compliance report.",
  keywords: [
    "DHA CME tracker",
    "Dubai healthcare CME requirements",
    "DHA compliance",
    "Dubai Health Authority CME",
    "DHA license renewal",
    "CME tracker Dubai",
    "DHA 40 credits",
    "Dubai healthcare professional CME",
    "DHA CPD requirements",
  ],
  openGraph: {
    title: "DHA CME Tracker â€” Dubai Healthcare Compliance",
    description:
      "40 CME credits per 2-year cycle. Hayya Med Pro tracks your DHA progress and generates your compliance report. Free to start.",
    url: `${APP_URL}/dha`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=DHA+CME+Tracker+%E2%80%94+Dubai&s=40+CME+credits+%C2%B7+2-year+cycle+%C2%B7+Track+all+categories+%C2%B7+Free+to+start&a=%F0%9F%87%A6%F0%9F%87%AA+DHA&k=Authority+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DHA CME Tracker â€” Dubai Healthcare CME",
    description: "Track your DHA CME credits automatically. Free for Dubai healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/dha` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do I need for DHA license renewal in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dubai Health Authority (DHA) requires all licensed healthcare professionals to complete 40 CME credits per 2-year renewal cycle. Credits must come from DHA-accredited or internationally recognized providers.",
      },
    },
    {
      "@type": "Question",
      name: "What is the DHA CME renewal cycle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The DHA CME cycle is 2 years. Healthcare professionals must accumulate 40 CME credits across the 2-year period and document their activities before license renewal through the Dubai Health Authority portal.",
      },
    },
    {
      "@type": "Question",
      name: "Is patient safety CME mandatory for DHA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The DHA requires at least 5 CME credits in patient safety per 2-year cycle. These must be from DHA-approved patient safety programs.",
      },
    },
    {
      "@type": "Question",
      name: "Can online CME activities count toward DHA requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. DHA allows up to 20 CME credits (50% of the 40-credit requirement) from accredited online activities per cycle. Online activities must be from providers accredited by DHA or an internationally recognized CME accreditor.",
      },
    },
    {
      "@type": "Question",
      name: "How does DHA CME differ from DOH (Abu Dhabi) requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both DHA (Dubai) and DOH (Abu Dhabi) require 40 CPD credits per 2-year cycle. The main differences are: DHA calls it CME while DOH uses CPD terminology; the approved provider lists differ; and category structures vary slightly. Hayya Med Pro tracks both separately for professionals licensed in multiple Emirates.",
      },
    },
  ],
};

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Set up your DHA CME wallet",
    desc: "Select UAE â€” Dubai and your profession. Hayya Med Pro applies the 40-credit/2-year rule with patient safety tracking automatically.",
  },
  {
    step: "2",
    title: "Log your DHA CME activities",
    desc: "Add conferences, workshops, and online courses from DHA-accredited providers. Upload certificates for verification.",
  },
  {
    step: "3",
    title: "Monitor your 2-year progress",
    desc: "See your running credit total, days until renewal, and whether your 5-credit patient safety requirement is met.",
  },
  {
    step: "4",
    title: "Generate your DHA CME report",
    desc: "Download a PDF compliance report with all activity details â€” ready to submit to the Dubai Health Authority portal.",
  },
];

export default function DhaPage() {
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
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              ðŸ‡¦ðŸ‡ª UAE â€” Dubai Â· DHA Â· Dubai Health Authority
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Track your DHA CME<br className="hidden sm:block" /> requirements â€” automatically
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Dubai Health Authority requires{" "}
              <strong className="text-[#111]">40 CME credits per 2-year cycle</strong> including mandatory patient safety credits.
              Hayya Med Pro tracks your progress and generates your DHA-ready compliance report.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors"
              >
                Track my DHA compliance â€” free â†’
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

          {/* Requirement summary */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-10 shadow-sm">
            <h2 className="text-lg font-bold text-[#111] mb-6">DHA CME requirements at a glance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: "Total credits required", value: "40", sub: "per 2-year cycle", color: "#1a56a0" },
                { label: "Max online credits", value: "20", sub: "50% of total max", color: "#d97706" },
                { label: "Patient safety", value: "5", sub: "credits mandatory", color: "#dc2626" },
                { label: "Renewal cycle", value: "2yr", sub: "submit before expiry", color: "#16a34a" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs font-semibold text-[#374151] mb-0.5 leading-snug">{s.label}</p>
                  <p className="text-[11px] text-[#94a3b8]">{s.sub}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-[#f1f5f9] flex flex-wrap gap-4 text-xs text-[#64748b]">
              <span><strong className="text-[#374151]">Authority:</strong> Dubai Health Authority (DHA)</span>
              <span><strong className="text-[#374151]">Terminology:</strong> CME (Continuing Medical Education)</span>
              <span><strong className="text-[#374151]">Professions:</strong> All DHA-licensed healthcare professionals</span>
            </div>
          </div>

          {/* DHA vs DOH note */}
          <div className="bg-[#fef9c3] border border-[#fde68a] rounded-xl px-5 py-4 mb-10">
            <p className="text-sm font-semibold text-[#92400e] mb-1">Licensed in both Dubai (DHA) and Abu Dhabi (DOH)?</p>
            <p className="text-xs text-[#92400e] leading-relaxed">
              Hayya Med Pro supports multi-jurisdiction tracking. Add separate wallets for DHA and DOH within the same account â€” credits are tracked independently since they have different approved provider lists and category structures.
            </p>
          </div>

          {/* How it works */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-6">How Hayya Med Pro works for DHA tracking</h2>
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

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">DHA CME â€” frequently asked questions</h2>
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
              <p className="text-sm font-semibold text-[#92400e]">Ready to renew? Step-by-step DHA renewal guide â†’</p>
              <p className="text-xs text-[#a16207] mt-0.5">Renewal checklist, Salama submission steps, category caps, and how to prepare your CME portfolio for DHA.</p>
            </div>
            <Link href="/dha-renewal" className="flex-shrink-0 bg-[#d97706] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#b45309] transition-colors whitespace-nowrap">
              DHA Renewal Guide â†’
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
            <h2 className="text-xl font-bold text-[#111] mb-2">DHA CME requirements by specialty</h2>
            <p className="text-sm text-[#64748b] mb-5">Select your specialty for DHA-specific CME notes and mandatory activity types.</p>
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
            <h2 className="text-2xl font-bold text-white mb-2">Start tracking your DHA compliance today</h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Join Dubai healthcare professionals tracking their CME requirements with Hayya Med Pro. Free to start â€” upgrade for PDF reports and AI compliance tools.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f7ff] transition-colors"
            >
              Track my DHA compliance â€” free â†’
            </Link>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">
              No credit card required Â· 14-day Pro trial included
            </p>
          </div>

          <div className="mt-6 bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e] text-center">
            Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official DHA requirements. Always verify final requirements with the Dubai Health Authority.
          </div>
        </main>
      </div>
    </>
  );
}

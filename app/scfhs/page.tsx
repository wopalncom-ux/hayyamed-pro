import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "SCFHS CME Tracker â€” Track Saudi Arabia CPD Requirements | Hayya Med Pro",
  description:
    "Track your SCFHS CME requirements automatically. Saudi healthcare professionals need 40â€“60 CME credits per year depending on profession. Hayya Med Pro tracks your progress and generates your SCFHS-ready compliance report.",
  keywords: [
    "SCFHS CME tracker",
    "Saudi Arabia CME requirements",
    "SCFHS compliance",
    "Saudi healthcare CME credits",
    "SCFHS license renewal",
    "CME tracker Saudi Arabia",
    "SCFHS 60 credits",
    "Saudi healthcare professional CME",
  ],
  openGraph: {
    title: "SCFHS CME Tracker â€” Track Saudi Arabia Healthcare CME",
    description:
      "40â€“60 CME credits per year. Hayya Med Pro tracks your SCFHS progress, flags gaps, and generates your compliance report. Free to start.",
    url: `${APP_URL}/scfhs`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=SCFHS+CME+Tracker+%E2%80%94+Saudi+Arabia&s=60+CME+credits%2Fyear+%28physicians%29+%C2%B7+30%2Fyear+%28nurses%2FAHP%29&a=%F0%9F%87%B8%F0%9F%87%A6+SCFHS&k=Authority+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SCFHS CME Tracker â€” Saudi Arabia Healthcare CME",
    description: "Track your SCFHS CME credits automatically. Free for Saudi healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/scfhs` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do I need for SCFHS renewal in Saudi Arabia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS requirements vary by profession: Physicians, Pharmacists, and Dentists need 60 CME credits per year. Nurses and Allied Health Professionals need 30 CME credits per year. Credits must be from SCFHS-accredited providers.",
      },
    },
    {
      "@type": "Question",
      name: "What is the SCFHS CME renewal cycle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The SCFHS CME cycle is 1 year for most healthcare professions. Some specialist certifications have 3-year cycles. All professionals must submit documented CME activities before their annual license renewal.",
      },
    },
    {
      "@type": "Question",
      name: "Can online CME activities count toward SCFHS requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Up to 50% of SCFHS CME credits can come from accredited online activities. Activities must be from SCFHS-approved providers and include an accreditation certificate.",
      },
    },
    {
      "@type": "Question",
      name: "Is patient safety CME mandatory for SCFHS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. SCFHS requires at least 5 CME credits in patient safety per year for all licensed healthcare professionals. These must come from SCFHS-accredited patient safety programs.",
      },
    },
    {
      "@type": "Question",
      name: "How do I renew my SCFHS license?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS license renewal is completed through the SCFHS portal (scfhs.org.sa). You need a complete CME portfolio documenting all activities with provider names, accreditation numbers, dates, and credit values. Hayya Med Pro generates a ready-to-submit PDF compliance report.",
      },
    },
  ],
};

const PROFESSIONS = [
  { label: "Physician", credits: 60, cycle: "1 year", icon: "ðŸ©º" },
  { label: "Pharmacist", credits: 60, cycle: "1 year", icon: "ðŸ’Š" },
  { label: "Dentist", credits: 60, cycle: "1 year", icon: "ðŸ¦·" },
  { label: "Nurse", credits: 30, cycle: "1 year", icon: "ðŸ‘©â€âš•ï¸" },
  { label: "Allied Health", credits: 30, cycle: "1 year", icon: "ðŸ¥" },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Set up your SCFHS wallet",
    desc: "Select Saudi Arabia and your profession. Hayya Med Pro applies the correct credit requirement (30 or 60 credits/year) automatically.",
  },
  {
    step: "2",
    title: "Log your CME activities",
    desc: "Add conferences, workshops, and online courses with your accreditation certificate. Each entry is verified against SCFHS category rules.",
  },
  {
    step: "3",
    title: "Track your progress and gaps",
    desc: "See exactly where you stand on the 5-credit patient safety requirement, online cap, and total annual target. AI gap analysis recommends what to do next.",
  },
  {
    step: "4",
    title: "Download your SCFHS report",
    desc: "Export a PDF compliance report with all activities, providers, accreditation numbers, and credit totals â€” ready for SCFHS submission.",
  },
];

export default function ScfhsPage() {
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
            <div className="inline-flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              ðŸ‡¸ðŸ‡¦ Saudi Arabia Â· SCFHS Â· Saudi Commission for Health Specialties
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Track your SCFHS CME<br className="hidden sm:block" /> requirements â€” automatically
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Saudi Arabia healthcare professionals must complete{" "}
              <strong className="text-[#111]">30â€“60 CME credits per year</strong> depending on their profession.
              Hayya Med Pro tracks your progress, flags gaps, and generates your SCFHS-ready report.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors"
              >
                Track my SCFHS compliance â€” free â†’
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

          {/* Credits by profession */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 mb-10 shadow-sm">
            <h2 className="text-lg font-bold text-[#111] mb-6">SCFHS CME requirements by profession</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {PROFESSIONS.map((p) => (
                <div key={p.label} className="text-center bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
                  <div className="text-2xl mb-1.5">{p.icon}</div>
                  <p className="text-xs font-semibold text-[#374151] mb-1">{p.label}</p>
                  <p className="text-2xl font-black text-[#1a56a0]">{p.credits}</p>
                  <p className="text-[11px] text-[#94a3b8]">credits/{p.cycle}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#f1f5f9]">
              <div className="text-center">
                <p className="text-xl font-black text-[#d97706]">50%</p>
                <p className="text-xs font-medium text-[#374151]">Max online credits</p>
                <p className="text-[11px] text-[#94a3b8]">e.g. max 30 of 60</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-[#dc2626]">5</p>
                <p className="text-xs font-medium text-[#374151]">Patient safety credits</p>
                <p className="text-[11px] text-[#94a3b8]">mandatory per year</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-[#16a34a]">50%</p>
                <p className="text-xs font-medium text-[#374151]">Max self-learning</p>
                <p className="text-[11px] text-[#94a3b8]">structured activities preferred</p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-6">How Hayya Med Pro works for SCFHS tracking</h2>
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
            <h2 className="text-xl font-bold text-[#111] mb-6">SCFHS CME â€” frequently asked questions</h2>
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
              <p className="text-sm font-semibold text-[#92400e]">Ready to renew? Step-by-step SCFHS renewal guide â†’</p>
              <p className="text-xs text-[#a16207] mt-0.5">Renewal checklist, submission steps, profession-specific CME requirements, and how to prepare your portfolio.</p>
            </div>
            <Link href="/scfhs-renewal" className="flex-shrink-0 bg-[#d97706] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#b45309] transition-colors whitespace-nowrap">
              SCFHS Renewal Guide â†’
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
            <h2 className="text-xl font-bold text-[#111] mb-2">SCFHS CME requirements by specialty</h2>
            <p className="text-sm text-[#64748b] mb-5">Select your specialty for SCFHS-specific CME notes and recognised accreditors.</p>
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
            <div className="inline-block text-3xl mb-3">ðŸ‡¸ðŸ‡¦</div>
            <h2 className="text-2xl font-bold text-white mb-2">Start tracking your SCFHS CME today</h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Join Saudi Arabia healthcare professionals tracking their annual CME requirements with Hayya Med Pro. Free to start â€” upgrade for PDF reports and AI compliance tools.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f7ff] transition-colors"
            >
              Track my SCFHS compliance â€” free â†’
            </Link>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">
              No credit card required Â· 14-day Pro trial included
            </p>
          </div>

          <div className="mt-6 bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e] text-center">
            Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official SCFHS requirements. Always verify final requirements with the Saudi Commission for Health Specialties.
          </div>
        </main>
      </div>
    </>
  );
}

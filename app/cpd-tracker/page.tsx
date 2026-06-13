import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CPD Tracker for GCC Healthcare Professionals â€” Track QCHP, DOH, NHRA Credits",
  description:
    "The leading CPD tracker for GCC healthcare professionals. Track CPD credits for QCHP Qatar, DOH Abu Dhabi, NHRA Bahrain, and all GCC licensing authorities. Free to start. Web and mobile.",
  keywords: [
    "CPD tracker",
    "CPD tracking app",
    "QCHP CPD tracker",
    "healthcare CPD tracker",
    "CPD portfolio Qatar",
    "CPD management software",
    "CPD credits tracker",
    "continuing professional development tracker",
    "Qatar CPD tracker",
    "GCC CPD compliance",
  ],
  openGraph: {
    title: "CPD Tracker for GCC Healthcare Professionals â€” QCHP Â· DOH Â· NHRA",
    description:
      "Track CPD credits for every GCC licensing authority in one place. QCHP Qatar, DOH Abu Dhabi, NHRA Bahrain. Free to start.",
    url: `${APP_URL}/cpd-tracker`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=CPD+Tracker+for+GCC+Healthcare+Professionals&s=QCHP+%C2%B7+DOH+%C2%B7+NHRA+%C2%B7+all+GCC+authorities+%C2%B7+Free+to+start&a=%F0%9F%8E%AF+CPD&k=Tracker`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CPD Tracker for GCC Healthcare Professionals",
    description: "Track QCHP, DOH, NHRA, and all GCC CPD requirements in one professional app. Free to start.",
  },
  alternates: { canonical: `${APP_URL}/cpd-tracker` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a CPD tracker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A CPD tracker is software that records a healthcare professional's Continuing Professional Development activities, calculates their progress toward their licensing authority's credit requirements, stores certificates, and alerts them to renewal deadlines. Hayya Med Pro is a CPD tracker built for GCC authorities including QCHP Qatar, DOH Abu Dhabi, and NHRA Bahrain.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a CPD tracker and a CME tracker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CPD (Continuing Professional Development) and CME (Continuing Medical Education) refer to the same concept â€” ongoing learning activities that healthcare professionals must complete to renew their license. Qatar (QCHP), UAE Abu Dhabi (DOH), and Bahrain (NHRA) use the term CPD. Saudi Arabia (SCFHS), UAE Dubai (DHA), Kuwait (MOH), and Oman (OMSB) use CME. Hayya Med Pro tracks both under the same platform.",
      },
    },
    {
      "@type": "Question",
      name: "How many CPD credits do I need in Qatar (QCHP)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Healthcare professionals licensed by QCHP in Qatar must complete 80 CPD credits per 2-year renewal cycle, with a minimum of 40 credits each year. At least 2 credits must come from patient safety activities. This requirement applies to all licensed healthcare professions â€” physicians, nurses, pharmacists, dentists, and allied health.",
      },
    },
    {
      "@type": "Question",
      name: "Is Hayya Med Pro free to use as a CPD tracker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Free plan allows tracking up to 10 CPD activities with a compliance dashboard at no cost. The Pro plan ($6/month) adds unlimited activity tracking, PDF report generation, AI-powered gap analysis, certificate storage, and multi-jurisdiction wallets. All new accounts receive a 14-day Pro trial.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track CPD for multiple GCC countries in one app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multiple jurisdiction wallets in one account. Healthcare professionals licensed in Qatar (QCHP) and UAE (DOH) can maintain separate CPD wallets for each authority, each tracking credits independently against its specific requirements.",
      },
    },
  ],
};

const cpdAuthorities = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP Qatar", credits: "80 CPD / 2yr", href: "/qchp" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH Abu Dhabi", credits: "30â€“40 CPD / 2yr", href: "/doh" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA Bahrain", credits: "40 CPD / 2yr", href: "/nhra" },
];

const allAuthorities = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP â€” Qatar", href: "/qchp", term: "CPD" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS â€” Saudi Arabia", href: "/scfhs", term: "CME" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA â€” Dubai", href: "/dha", term: "CME" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH â€” Abu Dhabi", href: "/doh", term: "CPD" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH â€” Kuwait", href: "/moh-kuwait", term: "CME" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA â€” Bahrain", href: "/nhra", term: "CPD" },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB â€” Oman", href: "/omsb", term: "CME" },
];

export default function CpdTrackerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Header nav */}
      <header className="border-b border-[#e2e8f0] bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-[#1a56a0] text-sm">
            Hayya Med Pro
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">
              Pricing
            </Link>
            <Link href="/login" className="text-sm text-[#64748b] hover:text-[#1a56a0]">
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-[#1a56a0] text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-[#1547a0] transition-colors"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-white border-b border-[#e2e8f0] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block bg-[#eff6ff] text-[#1a56a0] text-xs font-semibold px-3 py-1 rounded-full mb-4">
              CPD Tracker â€” GCC Healthcare Professionals
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111] mb-5 leading-tight">
              The CPD tracker built<br className="hidden sm:block" /> for GCC authorities
            </h1>
            <p className="text-lg text-[#475569] mb-6 max-w-2xl mx-auto leading-relaxed">
              Track QCHP, DOH, NHRA, and all GCC CPD requirements in one place.
              Qatar requires 80 CPD per 2 years â€” Hayya Med Pro tracks every credit,
              enforces category caps, and generates your submission-ready report.
            </p>

            {/* CPD authority highlights */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {cpdAuthorities.map((a) => (
                <div
                  key={a.name}
                  className="inline-flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-full px-4 py-2 text-sm"
                >
                  <span>{a.flag}</span>
                  <span className="font-medium text-[#111]">{a.name}</span>
                  <span className="text-[#64748b] text-xs">{a.credits}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <Link
                href="/register"
                className="bg-[#1a56a0] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#1547a0] transition-colors text-sm"
              >
                Start tracking CPD free â†’
              </Link>
              <Link
                href="/qchp"
                className="border border-[#e2e8f0] text-[#374151] font-medium px-8 py-3.5 rounded-xl hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors text-sm"
              >
                QCHP requirements
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8]">Free plan available Â· 14-day Pro trial Â· No credit card required</p>
          </div>
        </section>

        {/* CME vs CPD callout */}
        <section className="py-8 bg-[#eff6ff] border-b border-[#bfdbfe]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-xl border border-[#bfdbfe] px-5 py-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1e3a5f] mb-1">CPD in Qatar â€” the same as CME, different name</p>
                <p className="text-sm text-[#475569]">
                  QCHP uses &ldquo;CPD.&rdquo; SCFHS uses &ldquo;CME.&rdquo; Both mean the same thing â€” ongoing learning requirements for license renewal.
                  Hayya Med Pro handles both terminologies in the same platform.
                </p>
              </div>
              <Link
                href="/cme-vs-cpd"
                className="flex-shrink-0 text-xs font-semibold text-[#1a56a0] border border-[#1a56a0]/30 rounded-lg px-3 py-2 hover:bg-[#eff6ff] transition-colors whitespace-nowrap"
              >
                CME vs CPD explained â†’
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-10 text-center">
              How it works â€” set up in 3 minutes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Create free account",
                  body: "Sign up with your work email. No credit card. Your 14-day Pro trial starts automatically.",
                },
                {
                  step: "2",
                  title: "Choose QCHP (or any GCC authority)",
                  body: "Select your licensing authority. Credit requirements, cycle length, and category caps load instantly.",
                },
                {
                  step: "3",
                  title: "Log CPD activities",
                  body: "Add conferences, online modules, workshops. Upload certificates â€” AI reads the credits automatically.",
                },
                {
                  step: "4",
                  title: "See your progress",
                  body: "Track credits toward your renewal, get deadline reminders, and download your CPD report.",
                },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[#1a56a0] text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-[#111] mb-1 text-sm">{s.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/register"
                className="inline-block bg-[#1a56a0] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#1547a0] transition-colors text-sm"
              >
                Start tracking CPD â€” free â†’
              </Link>
            </div>
          </div>
        </section>

        {/* All authorities â€” CPD and CME */}
        <section className="py-12 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">
              All GCC licensing authorities supported
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-8">
              Whether your authority calls it CPD or CME, Hayya Med Pro tracks it.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {allAuthorities.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] px-4 py-3 hover:border-[#1a56a0] hover:bg-white transition-all flex items-center gap-3"
                >
                  <span className="text-xl">{a.flag}</span>
                  <div>
                    <p className="text-sm font-medium text-[#111]">{a.name}</p>
                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${a.term === "CPD" ? "bg-[#eff6ff] text-[#1a56a0]" : "bg-[#f0fdf4] text-[#16a34a]"}`}>
                      {a.term}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Professions */}
        <section className="py-12 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-bold text-[#111] mb-6 text-center">
              CPD requirements by profession
            </h2>
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
                  <p className="text-xs text-[#1a56a0] mt-1">View guide â†’</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-8 text-center">
              CPD tracker â€” frequently asked questions
            </h2>
            <div className="space-y-3">
              {faqLd.mainEntity.map((faq) => (
                <details key={faq.name} className="group border border-[#e2e8f0] rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none bg-white hover:bg-[#f8fafc] transition-colors">
                    <span className="font-medium text-[#111] text-sm pr-4">{faq.name}</span>
                    <span className="text-[#64748b] flex-shrink-0 transition-transform duration-200 group-open:rotate-45 text-lg leading-none">+</span>
                  </summary>
                  <div className="px-5 pb-4 pt-2 text-sm text-[#475569] leading-relaxed bg-[#f8fafc] border-t border-[#f0f4f8]">
                    {faq.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Renewal guides cross-link */}
        <section className="py-10 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-lg font-bold text-[#111] mb-4">CPD renewal guides for GCC healthcare professionals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { href: "/qchp-renewal", label: "ðŸ‡¶ðŸ‡¦ QCHP renewal guide", sub: "80 CPD, 2-year cycle" },
                { href: "/doh-renewal", label: "ðŸ‡¦ðŸ‡ª DOH renewal guide â€” Abu Dhabi", sub: "30â€“50 CPD per cycle" },
                { href: "/scfhs-renewal", label: "ðŸ‡¸ðŸ‡¦ SCFHS renewal guide", sub: "30â€“60 CME per year" },
                { href: "/dha-renewal", label: "ðŸ‡¦ðŸ‡ª DHA renewal guide â€” Dubai", sub: "40 CME, 2-year cycle" },
                { href: "/gcc-medical-license-renewal", label: "ðŸŒ All GCC renewal guides", sub: "All 7 authorities" },
                { href: "/cme-compliance-report", label: "ðŸ“„ Generate CPD compliance report", sub: "Download PDF for renewal" },
              ].map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="bg-white rounded-xl border border-[#e2e8f0] px-4 py-3 hover:border-[#1a56a0] hover:shadow-sm transition-all group"
                >
                  <p className="text-sm font-semibold text-[#111] group-hover:text-[#1a56a0] transition-colors">{g.label}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">{g.sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#0f1f3d]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Track your CPD the easy way
            </h2>
            <p className="text-[#94a3b8] mb-8 text-sm max-w-xl mx-auto">
              Healthcare professionals across Qatar, UAE, and Bahrain use Hayya Med Pro to track CPD
              credits for QCHP, DOH, and NHRA renewal. Free to start â€” no credit card needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-white text-[#1a56a0] font-semibold px-8 py-3 rounded-lg hover:bg-[#f0f4f8] transition-colors text-sm"
              >
                Start tracking CPD free â†’
              </Link>
              <Link
                href="/cme-vs-cpd"
                className="border border-[rgba(255,255,255,0.25)] text-white font-medium px-8 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors text-sm"
              >
                CME vs CPD explained
              </Link>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <footer className="py-6 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
              Hayya Med Pro supports CPD tracking and licensing readiness. It does not issue licenses
              and does not replace official licensing authorities. Users must verify final CPD requirements
              with QCHP, DOH, NHRA, or their relevant regulatory body.
            </p>
            <p className="text-xs text-[#94a3b8] text-center mt-2">
              <Link href="/privacy" className="hover:text-[#64748b]">Privacy</Link>
              {" Â· "}
              <Link href="/terms" className="hover:text-[#64748b]">Terms</Link>
              {" Â· "}
              <Link href="/cme-tracker" className="hover:text-[#64748b]">CME Tracker</Link>
              {" Â· "}
              <Link href="/cme-vs-cpd" className="hover:text-[#64748b]">CME vs CPD</Link>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

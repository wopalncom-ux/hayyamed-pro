import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CME Tracker for GCC Healthcare Professionals â€” Track QCHP, SCFHS, DHA Credits",
  description:
    "The #1 CME tracker for GCC healthcare professionals. Track CME and CPD credits for QCHP Qatar, SCFHS Saudi Arabia, DHA UAE, and all GCC licensing authorities. Free to start. Web and mobile.",
  keywords: [
    "CME tracker",
    "CME tracking app",
    "CPD tracker GCC",
    "QCHP CME tracker",
    "SCFHS CME tracker",
    "CME credit tracker",
    "healthcare CME app",
    "CPD tracking software",
    "CME management platform",
    "GCC CME compliance tracker",
  ],
  openGraph: {
    title: "CME Tracker for GCC Healthcare Professionals â€” QCHP Â· SCFHS Â· DHA",
    description:
      "Track CME credits for every GCC licensing authority in one place. Free for individual professionals. Web + PWA + mobile.",
    url: `${APP_URL}/cme-tracker`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=CME+Tracker+for+GCC+Healthcare+Professionals&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%C2%B7+all+GCC+authorities+%C2%B7+Free+to+start&a=%F0%9F%8E%AF+CME&k=Tracker`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CME Tracker for GCC Healthcare Professionals",
    description: "Track QCHP, SCFHS, DHA, and all GCC CME/CPD requirements in one professional app. Free to start.",
  },
  alternates: { canonical: `${APP_URL}/cme-tracker` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a CME tracker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A CME tracker is software that records a healthcare professional's Continuing Medical Education activities, calculates their progress toward their licensing authority's annual or biennial credit requirements, stores certificates, and alerts them to upcoming renewal deadlines. Hayya Med Pro is a CME tracker built specifically for GCC licensing authorities including QCHP, SCFHS, DHA, DOH, NHRA, and OMSB.",
      },
    },
    {
      "@type": "Question",
      name: "Is Hayya Med Pro free to use as a CME tracker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Free plan allows you to track up to 10 CME activities, view your compliance dashboard, and manage your licensing details at no cost. The Pro plan ($6/month) adds unlimited activity tracking, PDF report downloads, AI compliance gap analysis, certificate storage, and multi-license management. All new accounts receive a 14-day Pro trial.",
      },
    },
    {
      "@type": "Question",
      name: "Which GCC countries does the CME tracker support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayya Med Pro tracks CME and CPD requirements for Qatar (QCHP/DHP-AS), Saudi Arabia (SCFHS), UAE Dubai (DHA), UAE Abu Dhabi (DOH), Kuwait (MOH), Bahrain (NHRA), and Oman (OMSB). Professionals licensed in multiple GCC countries can add separate CME wallets for each authority within the same account.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this CME tracker on my phone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro is a Progressive Web App (PWA) â€” you can add it to your home screen from any mobile browser (Chrome, Safari) and use it like a native app. Core features including CME activity logging work offline and sync when you reconnect. Native iOS and Android apps are planned.",
      },
    },
    {
      "@type": "Question",
      name: "Does the CME tracker generate a PDF report for license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Pro plan generates a formatted PDF compliance report that lists all verified CME activities, categories, credit totals, and compliance status â€” formatted for submission to your licensing authority. This is available for QCHP, SCFHS, DHA, and all other supported GCC authorities.",
      },
    },
  ],
};

const features = [
  {
    icon: "ðŸ“Š",
    title: "Real-time compliance dashboard",
    body: "See your credit progress toward your renewal deadline at a glance. Separate wallets for each jurisdiction.",
  },
  {
    icon: "ðŸ“",
    title: "Certificate storage",
    body: "Upload CME certificates (PDF or image). Stored securely in a private bucket with signed URL access.",
  },
  {
    icon: "ðŸ¤–",
    title: "AI certificate reading",
    body: "Take a photo of your certificate â€” AI reads the title, date, credits, and accreditor automatically.",
  },
  {
    icon: "ðŸ“…",
    title: "Deadline reminders",
    body: "Automated alerts at 90, 30, and 7 days before your renewal deadline. Never miss a deadline.",
  },
  {
    icon: "ðŸ“„",
    title: "PDF compliance report",
    body: "Download a formatted report for QCHP, SCFHS, DHA, or any GCC authority. Ready for submission.",
  },
  {
    icon: "ðŸŒ",
    title: "Multi-country tracking",
    body: "Licensed in Qatar and Saudi Arabia? Add both â€” separate wallets, separate credit counters, separate deadlines.",
  },
];

const vsSpreadsheet = [
  { pain: "Manually calculate credits by hand", solution: "Automatic credit counting and category caps" },
  { pain: "PDFs scattered across email and WhatsApp", solution: "Centralized certificate storage with search" },
  { pain: "No deadline alerts until it's too late", solution: "Automated reminders at 90, 30, and 7 days" },
  { pain: "No idea if you've met the online activity cap", solution: "Category caps enforced automatically per authority" },
  { pain: "No formatted report for authority submission", solution: "One-click PDF report formatted for each authority" },
  { pain: "Doesn't work if you're licensed in 2+ countries", solution: "Multi-jurisdiction wallets in one account" },
];

const professions = [
  { icon: "ðŸ©º", title: "Physicians", href: "/physician-cme" },
  { icon: "ðŸ‘©â€âš•ï¸", title: "Nurses", href: "/nurse-cpd" },
  { icon: "ðŸ’Š", title: "Pharmacists", href: "/pharmacist-cme" },
  { icon: "ðŸ¦·", title: "Dentists", href: "/dentist-cme" },
  { icon: "ðŸ¦¿", title: "Allied Health", href: "/allied-health-cpd" },
];

export default function CmeTrackerPage() {
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
              CME Tracker â€” GCC Healthcare Professionals
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111] mb-5 leading-tight">
              The CME tracker built<br className="hidden sm:block" /> for GCC licensing authorities
            </h1>
            <p className="text-lg text-[#475569] mb-8 max-w-2xl mx-auto leading-relaxed">
              Track QCHP, SCFHS, DHA, DOH, NHRA, and OMSB CME credits in one place.
              Automatic credit counting, deadline reminders, certificate storage, and
              PDF reports â€” free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link
                href="/register"
                className="bg-[#1a56a0] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#1547a0] transition-colors text-sm"
              >
                Start tracking free â†’
              </Link>
              <Link
                href="/pricing"
                className="border border-[#e2e8f0] text-[#374151] font-medium px-8 py-3.5 rounded-xl hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors text-sm"
              >
                See pricing
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8]">Free plan available Â· 14-day Pro trial Â· No credit card required</p>
          </div>
        </section>

        {/* vs Spreadsheet */}
        <section className="py-14 bg-[#f8fafc]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">
              Why not a spreadsheet?
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-8">
              Most GCC healthcare professionals track CME in a spreadsheet or a folder of PDFs. Here&apos;s why that breaks.
            </p>
            <div className="rounded-xl border border-[#e2e8f0] overflow-hidden bg-white">
              <div className="grid grid-cols-2 border-b border-[#e2e8f0]">
                <div className="px-4 py-3 bg-[#fef2f2] text-xs font-semibold text-[#dc2626] uppercase tracking-wide">
                  Spreadsheet / folder
                </div>
                <div className="px-4 py-3 bg-[#f0fdf4] text-xs font-semibold text-[#16a34a] uppercase tracking-wide">
                  Hayya Med Pro
                </div>
              </div>
              {vsSpreadsheet.map((r, i) => (
                <div
                  key={r.pain}
                  className={`grid grid-cols-2 ${i < vsSpreadsheet.length - 1 ? "border-b border-[#f0f4f8]" : ""}`}
                >
                  <div className="px-4 py-3.5 text-sm text-[#64748b] flex items-start gap-2 border-r border-[#f0f4f8]">
                    <span className="text-[#dc2626] flex-shrink-0 mt-0.5">âœ—</span>
                    {r.pain}
                  </div>
                  <div className="px-4 py-3.5 text-sm text-[#374151] flex items-start gap-2">
                    <span className="text-[#16a34a] flex-shrink-0 mt-0.5">âœ“</span>
                    {r.solution}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-14 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">
              Everything you need to track CME compliance
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-10">
              Built for the way GCC healthcare professionals actually work.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <div key={f.title} className="border border-[#e2e8f0] rounded-xl p-5 bg-[#f8fafc]">
                  <span className="text-2xl mb-3 block">{f.icon}</span>
                  <h3 className="font-semibold text-[#111] mb-1.5 text-sm">{f.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-10 text-center">
              Set up in under 3 minutes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Create free account",
                  body: "Sign up with your work email. No credit card required. 14-day Pro trial starts automatically.",
                },
                {
                  step: "2",
                  title: "Select your authority",
                  body: "Choose QCHP, SCFHS, DHA, or any GCC authority. Your credit requirements and deadlines load instantly.",
                },
                {
                  step: "3",
                  title: "Log your CME activities",
                  body: "Add conferences, online courses, and workshops. Upload certificates â€” AI reads the credits for you.",
                },
                {
                  step: "4",
                  title: "Track to renewal",
                  body: "Dashboard shows your progress. You get deadline reminders. Download your PDF report when you need it.",
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
                Start tracking â€” free â†’
              </Link>
            </div>
          </div>
        </section>

        {/* Professions */}
        <section className="py-12 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-bold text-[#111] mb-2 text-center">
              CME requirements by profession
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-6">
              Requirements vary by profession. Select yours to see exactly what you need.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {professions.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#1a56a0] hover:bg-white transition-all group"
                >
                  <span className="text-2xl block mb-2">{p.icon}</span>
                  <p className="text-sm font-semibold text-[#111] group-hover:text-[#1a56a0] transition-colors">{p.title}</p>
                  <p className="text-xs text-[#1a56a0] mt-1">See requirements â†’</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Countries */}
        <section className="py-12 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-bold text-[#111] mb-6 text-center">
              CME tracker for every GCC country
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { label: "QCHP Qatar", href: "/qchp", flag: "ðŸ‡¶ðŸ‡¦" },
                { label: "SCFHS Saudi Arabia", href: "/scfhs", flag: "ðŸ‡¸ðŸ‡¦" },
                { label: "DHA Dubai", href: "/dha", flag: "ðŸ‡¦ðŸ‡ª" },
                { label: "DOH Abu Dhabi", href: "/doh", flag: "ðŸ‡¦ðŸ‡ª" },
                { label: "MOH Kuwait", href: "/moh-kuwait", flag: "ðŸ‡°ðŸ‡¼" },
                { label: "NHRA Bahrain", href: "/nhra", flag: "ðŸ‡§ðŸ‡­" },
                { label: "OMSB Oman", href: "/omsb", flag: "ðŸ‡´ðŸ‡²" },
                { label: "Compare all GCC", href: "/countries", flag: "ðŸŒ" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="border border-[#e2e8f0] rounded-lg px-3 py-3 text-sm text-[#374151] hover:border-[#1a56a0] hover:text-[#1a56a0] bg-white transition-colors flex items-center gap-2"
                >
                  <span>{l.flag}</span>
                  <span className="font-medium">{l.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-8 text-center">
              CME tracker â€” frequently asked questions
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
            <h2 className="text-lg font-bold text-[#111] mb-4">Renewal guides for GCC healthcare professionals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { href: "/qchp-renewal", label: "ðŸ‡¶ðŸ‡¦ QCHP renewal guide", sub: "80 CPD, 2-year cycle" },
                { href: "/scfhs-renewal", label: "ðŸ‡¸ðŸ‡¦ SCFHS renewal guide", sub: "30â€“60 CME per year" },
                { href: "/dha-renewal", label: "ðŸ‡¦ðŸ‡ª DHA renewal guide", sub: "40 CME, 2-year cycle" },
                { href: "/doh-renewal", label: "ðŸ‡¦ðŸ‡ª DOH renewal guide", sub: "30â€“50 CPD per cycle" },
                { href: "/gcc-medical-license-renewal", label: "ðŸŒ All GCC renewal guides", sub: "All 7 authorities covered" },
                { href: "/cme-compliance-report", label: "ðŸ“„ CME compliance report", sub: "Download PDF for renewal submission" },
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
              Start tracking your CME today
            </h2>
            <p className="text-[#94a3b8] mb-8 text-sm max-w-xl mx-auto">
              Join healthcare professionals across Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman
              who track their compliance with Hayya Med Pro. Free to start â€” no credit card needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-white text-[#1a56a0] font-semibold px-8 py-3 rounded-lg hover:bg-[#f0f4f8] transition-colors text-sm"
              >
                Start tracking free â†’
              </Link>
              <Link
                href="/employers"
                className="border border-[rgba(255,255,255,0.25)] text-white font-medium px-8 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors text-sm"
              >
                For employers
              </Link>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <footer className="py-6 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
              Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses
              and does not replace official licensing authorities. Users must verify final requirements
              with QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, or OMSB as applicable.
            </p>
            <p className="text-xs text-[#94a3b8] text-center mt-2">
              <Link href="/privacy" className="hover:text-[#64748b]">Privacy</Link>
              {" Â· "}
              <Link href="/terms" className="hover:text-[#64748b]">Terms</Link>
              {" Â· "}
              <Link href="/about" className="hover:text-[#64748b]">About</Link>
              {" Â· "}
              <Link href="/countries" className="hover:text-[#64748b]">All Countries</Link>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

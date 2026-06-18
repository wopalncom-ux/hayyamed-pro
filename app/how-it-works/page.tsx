import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "How Hayya Med Pro Works — CME & CPD Tracking for GCC Healthcare Professionals",
  description:
    "See exactly how Hayya Med Pro tracks your CME and CPD credits, monitors your compliance status across all GCC licensing authorities, and generates your PDF renewal report. Free for all healthcare professionals.",
  keywords: [
    "how CME tracking works GCC",
    "how to track CPD credits Qatar",
    "CME tracking software how it works",
    "QCHP CPD tracking",
    "SCFHS CME tracker",
    "DHA CME tracking",
    "healthcare CME compliance tracking",
    "CPD tracker GCC physicians",
  ],
  openGraph: {
    title: "How Hayya Med Pro Works — CME & CPD Tracking for GCC",
    description: "See exactly how Hayya Med Pro tracks your CME credits, monitors compliance for all GCC authorities, and generates your PDF renewal report.",
    url: `${APP_URL}/how-it-works`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/how-it-works` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Hayya Med Pro track my CME credits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You log each CME or CPD activity manually — including the activity name, date, accreditor, credit type, and number of credits. You can upload the certificate PDF alongside each entry. Hayya Med Pro automatically adds your credits toward your authority-specific target and shows your real-time compliance status.",
      },
    },
    {
      "@type": "Question",
      name: "Does Hayya Med Pro connect to QCHP, SCFHS, or DHA portals automatically?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not automatically — GCC authority portals do not currently offer public APIs for third-party integration. You log your activities in Hayya Med Pro alongside (or instead of) logging them in the authority portal. Hayya Med Pro's value is as your master record across all your licenses — not all activities are submitted to authority portals, especially international conferences and online CME.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track CME for multiple GCC licenses at the same time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can set up multiple license profiles — one for each active GCC license (e.g., QCHP Qatar + DHA Dubai, or SCFHS Saudi Arabia + NHRA Bahrain). Each license has its own compliance dashboard with the correct credit target and renewal date for that authority. Activities you log can be assigned to one or multiple licenses.",
      },
    },
    {
      "@type": "Question",
      name: "Is Hayya Med Pro free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The free tier is fully functional for CME tracking — you can log unlimited activities, upload certificates, and see your compliance status for all your active GCC licenses. The Pro plan adds the PDF compliance report download (the primary conversion path for license renewal submissions), AI-powered gap analysis, and priority support.",
      },
    },
  ],
};

const STEPS = [
  {
    number: "01",
    title: "Set up your license profile",
    description: "Tell Hayya Med Pro which country you are licensed in, which authority (QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, or OMSB), and your profession. The correct credit target and renewal date are automatically applied — no manual calculation required.",
    details: ["Select your authority and profession", "Enter your current license expiry date", "Hayya Med Pro sets the exact CPD/CME target for your profile", "Add multiple licenses if you practice in more than one GCC country"],
  },
  {
    number: "02",
    title: "Log each CME activity",
    description: "Every time you attend a conference, complete an online module, or finish a hospital grand round — log it in Hayya Med Pro. Include the activity name, date, accreditor, credit type, and number of credits. Attach the certificate PDF so everything is in one place.",
    details: ["Manual entry: activity name, date, accreditor, credits", "Upload certificate PDF alongside each entry", "Tag activities to one or multiple active licenses", "Log conferences, webinars, online modules, journal CME, hospital rounds"],
  },
  {
    number: "03",
    title: "Track your compliance status in real time",
    description: "Your compliance dashboard shows exactly where you stand — credits earned, credits remaining, and how many days until your renewal. A compliance ring visualizes your progress against your authority-specific target. No more guessing whether you have enough credits.",
    details: ["Real-time compliance ring: credits earned vs target", "Credits remaining shown prominently", "Days until renewal deadline", "Per-license status if you hold multiple GCC licenses"],
  },
  {
    number: "04",
    title: "Get renewal alerts before it is too late",
    description: "Hayya Med Pro sends automated email reminders at 90, 60, and 30 days before your renewal deadline — and an alert if your credits are falling behind pace. Most missed CME deadlines happen because the physician simply forgot. Hayya Med Pro makes sure you never forget.",
    details: ["90-day pre-renewal email alert", "60-day alert with current credit status", "30-day final reminder", "Behind-pace alert if you are tracking to fall short"],
  },
  {
    number: "05",
    title: "Download your PDF compliance report",
    description: "When you are ready to renew, generate a formatted PDF compliance report showing all your logged activities, certificates, and your total CPD/CME credits — ready to submit to your authority or share with your employer HR team. This is the feature that converts free users to Pro.",
    details: ["Formatted PDF with all activities, dates, accreditors, and credits", "Certificate evidence referenced in the report", "Authority-branded formatting for professional submission", "Share link for employer HR teams (Employer plan)"],
    badge: "Pro feature",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="min-h-screen bg-[#f8fafc]">
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center"><span className="text-white text-sm font-bold">H</span></div>
              <span className="font-bold text-base text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/pricing" className="text-sm text-[#64748b] hover:text-[#111] font-medium">Pricing</Link>
              <Link href="/register" className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors">Start free →</Link>
            </div>
          </div>
        </header>

        <main>
          {/* Hero */}
          <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              Built for all 7 GCC licensing authorities
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-5 leading-tight">
              Track your CME in 5 minutes.<br />Never miss a renewal again.
            </h1>
            <p className="text-lg text-[#64748b] max-w-xl mx-auto mb-8">
              Hayya Med Pro knows the exact CPD and CME requirements for QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, and OMSB. Log your activities, track your compliance, and generate your renewal report — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#154890] text-white font-bold px-8 py-4 rounded-xl text-sm transition-colors">
                Start tracking free — no card needed
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-[#64748b] hover:text-[#111] px-4 py-4">
                See pricing →
              </Link>
            </div>
          </section>

          {/* Steps */}
          <section className="max-w-4xl mx-auto px-6 pb-16">
            <div className="space-y-6">
              {STEPS.map((step, i) => (
                <div key={step.number} className="bg-white rounded-2xl border border-[#e2e8f0] p-8 relative">
                  {step.badge && (
                    <span className="absolute top-6 right-6 text-xs font-semibold bg-[#1a56a0] text-white px-2.5 py-1 rounded-full">
                      {step.badge}
                    </span>
                  )}
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center">
                      <span className="text-sm font-bold text-[#1a56a0]">{step.number}</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-[#111] mb-2">{step.title}</h2>
                      <p className="text-[#64748b] leading-relaxed mb-4">{step.description}</p>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {step.details.map((d) => (
                          <li key={d} className="flex items-center gap-2 text-sm text-[#374151]">
                            <span className="w-4 h-4 rounded-full bg-[#16a34a] flex-shrink-0 flex items-center justify-center">
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="absolute left-[2.75rem] -bottom-4 w-0.5 h-4 bg-[#e2e8f0]" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Authority coverage */}
          <section className="bg-white border-y border-[#e2e8f0] py-12">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-[#111] text-center mb-3">All 7 GCC authorities supported</h2>
              <p className="text-[#64748b] text-center mb-8 max-w-lg mx-auto">Credit targets, cycle dates, and profession-specific rules built in — no manual configuration required.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { code: "QCHP", country: "Qatar", credits: "80 CPD / 2 years", href: "/qchp" },
                  { code: "SCFHS", country: "Saudi Arabia", credits: "60 CME / year", href: "/scfhs" },
                  { code: "DHA", country: "Dubai, UAE", credits: "40 CME / 2 years", href: "/dha" },
                  { code: "DOH", country: "Abu Dhabi, UAE", credits: "30–50 CPD / 2 years", href: "/doh" },
                  { code: "MOH", country: "Kuwait", credits: "30 CME / year", href: "/moh-kuwait" },
                  { code: "NHRA", country: "Bahrain", credits: "40 CPD / 2 years", href: "/nhra" },
                  { code: "OMSB", country: "Oman", credits: "40 CME / 2 years", href: "/omsb" },
                  { code: "More", country: "UK, India, Australia", credits: "Coming soon", href: "/global-cme-requirements" },
                ].map((a) => (
                  <Link key={a.code} href={a.href} className="bg-[#f8fafc] hover:bg-[#eff6ff] border border-[#e2e8f0] hover:border-[#1a56a0] rounded-xl p-4 transition-all group">
                    <p className="text-sm font-bold text-[#1a56a0]">{a.code}</p>
                    <p className="text-xs text-[#374151] font-medium">{a.country}</p>
                    <p className="text-xs text-[#64748b] mt-1">{a.credits}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Plan comparison */}
          <section className="max-w-4xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-bold text-[#111] text-center mb-8">Free vs Pro</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <p className="text-sm font-bold text-[#64748b] uppercase tracking-wide mb-1">Free</p>
                <p className="text-3xl font-bold text-[#111] mb-4">QAR 0<span className="text-sm font-normal text-[#64748b]">/mo</span></p>
                <ul className="space-y-3">
                  {[
                    "Unlimited CME activity logging",
                    "Certificate PDF storage",
                    "Multi-license dashboard (all GCC authorities)",
                    "Real-time compliance status ring",
                    "Renewal deadline alerts",
                    "Authority-specific credit targets built in",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#374151]">
                      <span className="w-4 h-4 rounded-full bg-[#16a34a] flex-shrink-0 flex items-center justify-center">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="mt-6 block text-center text-sm font-semibold text-[#1a56a0] border border-[#1a56a0] px-4 py-3 rounded-xl hover:bg-[#eff6ff] transition-colors">Start free →</Link>
              </div>

              <div className="bg-[#1a56a0] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-xs font-bold bg-white text-[#1a56a0] px-2.5 py-1 rounded-full">Most popular</div>
                <p className="text-sm font-bold text-[#93c5fd] uppercase tracking-wide mb-1">Pro</p>
                <p className="text-3xl font-bold text-white mb-4">QAR 49<span className="text-sm font-normal text-[#93c5fd]">/mo</span></p>
                <ul className="space-y-3">
                  {[
                    "Everything in Free",
                    "PDF compliance report download",
                    "AI-powered CME gap analysis",
                    "Priority email support",
                    "Multi-country license tracking (unlimited)",
                    "Early access to new features",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white">
                      <span className="w-4 h-4 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="mt-6 block text-center text-sm font-bold text-[#1a56a0] bg-white px-4 py-3 rounded-xl hover:bg-[#f0f9ff] transition-colors">Start Pro free trial →</Link>
              </div>
            </div>
            <p className="text-center text-xs text-[#64748b] mt-4">No credit card required for the free tier. Pro trial starts after registration.</p>
          </section>

          {/* FAQ */}
          <section className="bg-white border-t border-[#e2e8f0] py-16">
            <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-[#111] text-center mb-8">Frequently asked questions</h2>
              <div className="space-y-4">
                {faqLd.mainEntity.map((faq) => (
                  <div key={faq.name} className="bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] p-6">
                    <h3 className="font-bold text-[#111] mb-2">{faq.name}</h3>
                    <p className="text-sm text-[#64748b] leading-relaxed">{faq.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[#0f1f3d] py-16">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to stop worrying about CME?</h2>
              <p className="text-[#64748b] mb-8 max-w-md mx-auto">Set up your license profile in 2 minutes. Log your first activity in under 60 seconds. Free for every GCC healthcare professional.</p>
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-8 py-4 rounded-xl text-sm transition-colors">
                Start tracking free — no card needed
              </Link>
              <p className="text-[#64748b] text-xs mt-4">Trusted by healthcare professionals across Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.</p>
            </div>
          </section>

          {/* Related links */}
          <section className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: "GCC CME requirements", href: "/gcc-cme-requirements" },
                { label: "CME calculator", href: "/cme-calculator" },
                { label: "Pricing", href: "/pricing" },
                { label: "For employers", href: "/employers" },
                { label: "Blog", href: "/blog" },
                { label: "Security", href: "/security" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-[#1a56a0] hover:underline bg-[#eff6ff] px-3 py-1.5 rounded-lg">{l.label}</Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

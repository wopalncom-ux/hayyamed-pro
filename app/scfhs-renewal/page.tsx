import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "SCFHS License Renewal â€” CME Requirements for Saudi Healthcare Professionals",
  description:
    "Complete guide to SCFHS license renewal in Saudi Arabia. CME requirements by profession: 60 credits/year (physicians, dentists, pharmacists) and 30 credits/year (nurses, allied health). Renewal steps, categories, and how to track CME.",
  keywords: [
    "SCFHS license renewal",
    "SCFHS CME renewal",
    "SCFHS renewal requirements",
    "Saudi Arabia medical license renewal",
    "renew SCFHS license",
    "SCFHS physician CME renewal",
    "SCFHS nurse CME renewal",
    "SCFHS pharmacist CME renewal",
    "Saudi Commission Health Specialties renewal",
    "SCFHS 2024 renewal",
  ],
  openGraph: {
    title: "SCFHS License Renewal Guide â€” Saudi Arabia Healthcare Professionals",
    description:
      "60 CME credits/year for physicians, dentists, pharmacists. 30 CME credits/year for nurses and allied health. Step-by-step SCFHS renewal guide.",
    url: `${APP_URL}/scfhs-renewal`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=SCFHS+License+Renewal+%E2%80%94+Saudi+Arabia&s=CME+requirements+%C2%B7+renewal+checklist+%C2%B7+step-by-step+process&a=%F0%9F%87%B8%F0%9F%87%A6+SCFHS&k=Renewal+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SCFHS Renewal Guide â€” CME Requirements for Saudi Healthcare Professionals",
    description: "Profession-specific CME requirements for SCFHS renewal. Track with Hayya Med Pro.",
  },
  alternates: { canonical: `${APP_URL}/scfhs-renewal` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do I need for SCFHS renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS CME requirements depend on your profession. Physicians, dentists, and pharmacists need 60 CME credits per year. Nurses and allied health professionals need 30 CME credits per year. The renewal cycle varies by specialty from 1 to 3 years. Always verify current requirements at the SCFHS official portal (scfhs.org.sa).",
      },
    },
    {
      "@type": "Question",
      name: "How do I renew my SCFHS license?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS license renewal is done through the SCFHS online services portal (mumaris.scfhs.org.sa). You must submit your CME portfolio showing all activities with certificates, verify your credits meet the annual requirement, and pay the renewal fee. Applications should be submitted 3 months before your license expiry.",
      },
    },
    {
      "@type": "Question",
      name: "What categories of CME count for SCFHS renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS accepts CME activities in several categories: Category 1 â€” Accredited conferences, seminars, and workshops. Category 2 â€” Online modules and e-learning (caps apply). Category 3 â€” Postgraduate qualifications. Category 4 â€” Research and publications. Category 5 â€” Teaching and training activities. Category 6 â€” Self-directed learning. Categories 1 and 2 are the most commonly used. Caps on online learning apply.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use international CME activities for SCFHS renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, SCFHS accepts internationally accredited CME activities from recognized bodies. The activity must be accredited by a body recognized by SCFHS. Evidence of attendance and a certificate stating the CME credits awarded are required. Hayya Med Pro can store your international certificates and calculate credits automatically.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if my SCFHS license expires?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An expired SCFHS license means you cannot legally practice healthcare in Saudi Arabia. SCFHS has a grace period, but practicing with an expired license is a regulatory violation. It is essential to complete your annual CME requirements and submit the renewal application on time. Set reminders at least 3 months before your expiry date.",
      },
    },
  ],
};

const PROFESSION_REQUIREMENTS = [
  { profession: "Physicians", icon: "ðŸ©º", credits: 60, cycle: "Annual", note: "Required every year" },
  { profession: "Dentists", icon: "ðŸ¦·", credits: 60, cycle: "Annual", note: "Required every year" },
  { profession: "Pharmacists", icon: "ðŸ’Š", credits: 60, cycle: "Annual", note: "Required every year" },
  { profession: "Nurses", icon: "ðŸ‘©â€âš•ï¸", credits: 30, cycle: "Annual", note: "Required every year" },
  { profession: "Allied Health", icon: "ðŸ¦¿", credits: 30, cycle: "Annual", note: "Physiotherapists, lab technicians, etc." },
];

const RENEWAL_STEPS = [
  {
    step: "1",
    title: "Check your renewal date",
    body: "Log in to the SCFHS portal (mumaris.scfhs.org.sa) to find your license expiry date. Start accumulating CME from the first day of your new licensing cycle.",
    icon: "ðŸ“…",
  },
  {
    step: "2",
    title: "Complete your annual CME requirement",
    body: "Physicians, dentists, and pharmacists need 60 CME credits per year. Nurses and allied health need 30. Attend accredited conferences, complete online modules, or participate in research activities.",
    icon: "ðŸ“š",
  },
  {
    step: "3",
    title: "Collect all certificates",
    body: "For every CME activity, obtain an official certificate showing the activity name, accrediting body, date, and CME credits. SCFHS can request certificates for any activity in your portfolio.",
    icon: "ðŸ“œ",
  },
  {
    step: "4",
    title: "Prepare your CME portfolio",
    body: "Your portfolio must show total annual credits, category breakdown, and all supporting certificates. Hayya Med Pro generates your SCFHS-ready CME report as a PDF automatically.",
    icon: "ðŸ“‹",
  },
  {
    step: "5",
    title: "Submit renewal at least 3 months early",
    body: "Log in to the SCFHS portal and submit your renewal application with your CME portfolio. Pay the renewal fee. Processing can take several weeks â€” submit early to avoid gaps in licensure.",
    icon: "âœ…",
  },
];

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to renew your SCFHS healthcare license in Saudi Arabia",
  description: "Step-by-step process to renew an SCFHS license in Saudi Arabia, including CME credit requirements, portfolio preparation, and online submission through the SCFHS portal.",
  totalTime: "P90D",
  step: RENEWAL_STEPS.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.body,
    position: parseInt(s.step),
  })),
};

export default function ScfhsRenewalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />

      {/* Header */}
      <header className="border-b border-[#e2e8f0] bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-[#1a56a0] text-sm">
            Hayya Med Pro
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/scfhs" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">
              SCFHS requirements
            </Link>
            <Link href="/login" className="text-sm text-[#64748b] hover:text-[#1a56a0]">
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-[#1a56a0] text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-[#1547a0] transition-colors"
            >
              Track CME free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-white border-b border-[#e2e8f0] py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">ðŸ‡¸ðŸ‡¦</span>
              <span className="text-xs font-semibold text-[#1a56a0] bg-[#eff6ff] px-2.5 py-1 rounded-full">
                SCFHS â€” Saudi Arabia Healthcare License Renewal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111] mb-4 leading-tight">
              SCFHS license renewal â€”<br className="hidden sm:block" /> CME requirements guide
            </h1>
            <p className="text-lg text-[#475569] mb-6 max-w-2xl leading-relaxed">
              Everything you need to renew your healthcare license with the Saudi Commission
              for Health Specialties. CME requirements differ by profession â€”
              60 credits/year for physicians, 30 for nurses and allied health.
            </p>

            {/* Quick profession stats */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-4 py-2.5 text-center">
                <p className="text-base font-black text-[#1a56a0]">60 CME/yr</p>
                <p className="text-[11px] text-[#475569]">Physicians Â· Dentists Â· Pharmacists</p>
              </div>
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-2.5 text-center">
                <p className="text-base font-black text-[#16a34a]">30 CME/yr</p>
                <p className="text-[11px] text-[#475569]">Nurses Â· Allied Health</p>
              </div>
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-center">
                <p className="text-base font-black text-[#111]">1â€“3 yr</p>
                <p className="text-[11px] text-[#475569]">License cycle (by specialty)</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-block bg-[#1a56a0] text-white font-semibold px-7 py-3 rounded-xl hover:bg-[#1547a0] transition-colors text-sm"
              >
                Start tracking SCFHS CME free â†’
              </Link>
              <Link
                href="/scfhs"
                className="inline-block border border-[#e2e8f0] text-[#374151] font-medium px-7 py-3 rounded-xl hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors text-sm"
              >
                Full SCFHS requirements guide
              </Link>
            </div>
          </div>
        </section>

        {/* Profession requirements table */}
        <section className="py-12 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-6">
              SCFHS CME requirements by profession
            </h2>
            <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Profession</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">CME credits/year</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide hidden sm:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f8fafc]">
                  {PROFESSION_REQUIREMENTS.map((p) => (
                    <tr key={p.profession}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl" aria-hidden>{p.icon}</span>
                          <span className="text-sm font-semibold text-[#111]">{p.profession}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-sm font-black ${p.credits === 60 ? "text-[#1a56a0]" : "text-[#16a34a]"}`}>
                          {p.credits}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#64748b] hidden sm:table-cell">{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 bg-[#fef9c3] border-t border-[#fde68a]">
                <p className="text-xs text-[#92400e]">
                  <strong>Important:</strong> Requirements may vary by specialty and license type. Always verify your specific
                  requirements at the official SCFHS portal (scfhs.org.sa) before submitting your renewal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Renewal steps */}
        <section className="py-12 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-8">The SCFHS renewal process â€” step by step</h2>
            <div className="space-y-5">
              {RENEWAL_STEPS.map((s) => (
                <div key={s.step} className="bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] p-6 flex gap-5 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#1a56a0] text-white font-bold text-sm flex items-center justify-center">
                      {s.step}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg" aria-hidden>{s.icon}</span>
                      <h3 className="text-base font-semibold text-[#111]">{s.title}</h3>
                    </div>
                    <p className="text-sm text-[#475569] leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Hayya Med Pro helps */}
        <section className="py-12 bg-[#eff6ff] border-t border-[#bfdbfe]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#111] mb-3">Track SCFHS CME automatically</h2>
                <p className="text-sm text-[#475569] mb-6 leading-relaxed">
                  Hayya Med Pro applies your SCFHS requirements based on your profession â€”
                  60 credits/year for physicians, 30 for nurses â€” and tracks your progress
                  automatically throughout the year.
                </p>
                <ul className="space-y-3">
                  {[
                    "Profession-specific credit targets applied automatically",
                    "Annual CME progress tracked in real time",
                    "Certificate storage for every activity",
                    "Category A/B split and online cap enforcement",
                    "PDF CME report ready for SCFHS submission (Pro)",
                    "Deadline reminders before your renewal date",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#334e7a]">
                      <svg className="w-4 h-4 text-[#1a56a0] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-[#bfdbfe] p-6">
                <p className="text-sm font-semibold text-[#1e3a5f] mb-2">Free to start â€” no credit card required</p>
                <p className="text-sm text-[#475569] mb-5 leading-relaxed">
                  Start tracking your SCFHS CME for free. Upgrade to Pro ($6/month) for
                  PDF reports, AI gap analysis, and certificate storage.
                </p>
                <Link
                  href="/register"
                  className="block w-full text-center bg-[#1a56a0] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#1547a0] transition-colors mb-3"
                >
                  Start tracking SCFHS CME â€” free â†’
                </Link>
                <div className="flex justify-center gap-4 text-xs text-[#64748b]">
                  <span>14-day Pro trial</span>
                  <span>Â·</span>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-8">
              SCFHS renewal â€” frequently asked questions
            </h2>
            <div className="space-y-3">
              {faqLd.mainEntity.map((faq) => (
                <details key={faq.name} className="group border border-[#e2e8f0] rounded-xl overflow-hidden bg-white">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none hover:bg-[#f8fafc] transition-colors">
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

        {/* Related guides */}
        <section className="py-10 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-lg font-bold text-[#111] mb-5">Related SCFHS and CME guides</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "SCFHS requirements", href: "/scfhs", desc: "Full guide" },
                { label: "CME tracker", href: "/cme-tracker", desc: "Track credits" },
                { label: "Physician CME", href: "/physician-cme", desc: "Physician requirements" },
                { label: "All GCC countries", href: "/countries", desc: "Compare requirements" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-4 hover:border-[#1a56a0] hover:bg-white transition-all"
                >
                  <p className="text-sm font-semibold text-[#111]">{l.label}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">{l.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-[#0f1f3d]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready for SCFHS renewal? Start tracking now.
            </h2>
            <p className="text-[#94a3b8] mb-8 text-sm max-w-xl mx-auto">
              Hayya Med Pro applies your profession-specific SCFHS CME requirement automatically.
              Track activities, store certificates, and download your submission-ready report.
              Free to start â€” no credit card needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-white text-[#1a56a0] font-semibold px-8 py-3 rounded-lg hover:bg-[#f0f4f8] transition-colors text-sm"
              >
                Start tracking CME free â†’
              </Link>
              <Link
                href="/scfhs"
                className="border border-[rgba(255,255,255,0.25)] text-white font-medium px-8 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors text-sm"
              >
                Full SCFHS requirements â†’
              </Link>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <footer className="py-6 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
              Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace
              the official SCFHS renewal process. Always verify final CME requirements and renewal procedures with the
              Saudi Commission for Health Specialties (scfhs.org.sa).
            </p>
            <p className="text-xs text-[#94a3b8] text-center mt-2">
              <Link href="/scfhs" className="hover:text-[#64748b]">SCFHS Guide</Link>
              {" Â· "}
              <Link href="/cme-tracker" className="hover:text-[#64748b]">CME Tracker</Link>
              {" Â· "}
              <Link href="/privacy" className="hover:text-[#64748b]">Privacy</Link>
              {" Â· "}
              <Link href="/terms" className="hover:text-[#64748b]">Terms</Link>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

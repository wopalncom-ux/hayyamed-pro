import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "QCHP License Renewal â€” Complete Guide for Qatar Healthcare Professionals",
  description:
    "Step-by-step guide to QCHP license renewal in Qatar. 80 CPD credits required per 2-year cycle. Find out what you need, how to submit, and how to track your CPD with Hayya Med Pro.",
  keywords: [
    "QCHP license renewal",
    "QCHP renewal process",
    "QCHP CPD requirements renewal",
    "Qatar healthcare license renewal",
    "renew medical license Qatar",
    "QCHP renewal 2024",
    "QCHP CPD submission",
    "DHP-AS license renewal Qatar",
    "QCHP renewal checklist",
  ],
  openGraph: {
    title: "QCHP License Renewal â€” Step-by-Step Guide for Qatar Healthcare Professionals",
    description:
      "Everything you need to renew your QCHP healthcare license in Qatar. 80 CPD credits, patient safety requirements, and how to submit your portfolio.",
    url: `${APP_URL}/qchp-renewal`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=QCHP+License+Renewal+%E2%80%94+Qatar&s=80+CPD+credits+%C2%B7+patient+safety+requirement+%C2%B7+step-by-step+checklist&a=%F0%9F%87%B6%F0%9F%87%A6+QCHP&k=Renewal+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "QCHP License Renewal Guide â€” Qatar Healthcare Professionals",
    description: "80 CPD credits per 2-year cycle. Step-by-step QCHP renewal checklist and CPD tracking with Hayya Med Pro.",
  },
  alternates: { canonical: `${APP_URL}/qchp-renewal` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits are required for QCHP license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QCHP requires 80 CPD credits per 2-year renewal cycle, with a minimum of 40 credits per year. At least 2 credits must be from patient safety activities. Requirements apply to all licensed healthcare professions: physicians, nurses, pharmacists, dentists, and allied health professionals.",
      },
    },
    {
      "@type": "Question",
      name: "How do I submit my CPD portfolio to QCHP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CPD submissions are made through the QCHP online portal (qchp.org.qa). You submit your CPD portfolio showing all activities, certificates, and credit totals. Hayya Med Pro's PDF CPD report is formatted to show all the information QCHP requires â€” activity title, category, date, credits, and accrediting body.",
      },
    },
    {
      "@type": "Question",
      name: "What counts as CPD for QCHP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QCHP accepts activities in several categories: accredited conferences and workshops (Category 1), online learning modules (Category 2), postgraduate qualifications (Category 3), research and publications (Category 4), teaching and mentoring (Category 5), and self-directed learning (Category 6). Category caps may apply â€” Hayya Med Pro enforces these automatically.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I don't complete my QCHP CPD requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Failure to meet QCHP CPD requirements can result in your license not being renewed, which means you cannot legally practice healthcare in Qatar. It is essential to track your credits throughout the 2-year cycle rather than trying to accumulate them close to the renewal deadline.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use online CME/CPD activities for QCHP renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, QCHP accepts online learning activities as part of your CPD portfolio. However, there are caps on how many credits can come from online sources â€” the exact limit depends on the category. QCHP requires that a meaningful portion of your CPD comes from accredited live or interactive activities.",
      },
    },
  ],
};

const RENEWAL_STEPS = [
  {
    step: "1",
    title: "Check your renewal date",
    body: "Your QCHP license has a 2-year validity period. Log in to the QCHP portal (qchp.org.qa) or check your license certificate to find your expiry date. Start tracking CPD at least 18 months before renewal.",
    icon: "ðŸ“…",
  },
  {
    step: "2",
    title: "Accumulate 80 CPD credits",
    body: "You need 80 CPD credits across the 2-year cycle, with a minimum of 40 per year. Credits come from conferences, workshops, online modules, research, teaching, and self-directed learning. At least 2 credits must be patient safety activities.",
    icon: "ðŸ“š",
  },
  {
    step: "3",
    title: "Keep your certificates",
    body: "For every activity, keep the official certificate showing: activity name, accrediting body, date, and credits awarded. QCHP may request evidence for any or all activities in your portfolio.",
    icon: "ðŸ“œ",
  },
  {
    step: "4",
    title: "Prepare your CPD portfolio",
    body: "Your portfolio must show: total credits (80+), a minimum of 40 per year, at least 2 patient safety credits, activity categories, and dates. Hayya Med Pro generates this portfolio as a PDF automatically.",
    icon: "ðŸ“‹",
  },
  {
    step: "5",
    title: "Submit renewal application",
    body: "Submit your renewal application through the QCHP portal with your CPD portfolio. Applications should be submitted 3 months before your license expiry. Renewal fee applies.",
    icon: "âœ…",
  },
];

const CHECKLIST_ITEMS = [
  { check: true, item: "80 CPD credits total (2-year cycle)" },
  { check: true, item: "Minimum 40 CPD credits per year" },
  { check: true, item: "At least 2 patient safety activity credits" },
  { check: true, item: "Valid certificates for every activity" },
  { check: true, item: "Activities from QCHP-accepted accreditors" },
  { check: true, item: "CPD portfolio PDF ready for submission" },
  { check: false, item: "Application submitted â‰¥3 months before expiry" },
  { check: false, item: "Renewal fee paid" },
];

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to renew your QCHP healthcare license in Qatar",
  description: "Step-by-step process to renew a QCHP license in Qatar, including CPD credit requirements, portfolio preparation, and online submission.",
  totalTime: "PT90D",
  step: RENEWAL_STEPS.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.body,
    position: parseInt(s.step),
  })),
};

export default function QchpRenewalPage() {
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
            <Link href="/qchp" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">
              QCHP requirements
            </Link>
            <Link href="/login" className="text-sm text-[#64748b] hover:text-[#1a56a0]">
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-[#1a56a0] text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-[#1547a0] transition-colors"
            >
              Track CPD free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-white border-b border-[#e2e8f0] py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">ðŸ‡¶ðŸ‡¦</span>
              <span className="text-xs font-semibold text-[#1a56a0] bg-[#eff6ff] px-2.5 py-1 rounded-full">
                QCHP â€” Qatar Healthcare License Renewal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111] mb-4 leading-tight">
              QCHP license renewal â€”<br className="hidden sm:block" /> complete guide
            </h1>
            <p className="text-lg text-[#475569] mb-6 max-w-2xl leading-relaxed">
              Everything you need to renew your healthcare license in Qatar.
              80 CPD credits, patient safety requirements, certificate documentation,
              and how to prepare your portfolio for QCHP submission.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { label: "Credits required", value: "80 CPD" },
                { label: "Renewal cycle", value: "2 years" },
                { label: "Minimum per year", value: "40 CPD" },
                { label: "Patient safety", value: "2 CPD min" },
              ].map((s) => (
                <div key={s.label} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-center min-w-[110px]">
                  <p className="text-lg font-black text-[#1a56a0]">{s.value}</p>
                  <p className="text-[11px] text-[#64748b] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="inline-block bg-[#1a56a0] text-white font-semibold px-7 py-3 rounded-xl hover:bg-[#1547a0] transition-colors text-sm"
              >
                Start tracking QCHP CPD free â†’
              </Link>
              <Link
                href="/qchp"
                className="inline-block border border-[#e2e8f0] text-[#374151] font-medium px-7 py-3 rounded-xl hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors text-sm"
              >
                Full QCHP requirements guide
              </Link>
            </div>
          </div>
        </section>

        {/* Renewal steps */}
        <section className="py-12 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-8">The QCHP renewal process â€” step by step</h2>
            <div className="space-y-5">
              {RENEWAL_STEPS.map((s) => (
                <div key={s.step} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 flex gap-5 items-start">
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

        {/* Renewal checklist */}
        <section className="py-12 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#111] mb-6">QCHP renewal checklist</h2>
                <div className="space-y-3">
                  {CHECKLIST_ITEMS.map((item) => (
                    <div key={item.item} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center mt-0.5 ${item.check ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fef9c3] text-[#d97706]"}`}>
                        {item.check ? (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-[#374151]">{item.item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#94a3b8] mt-4">
                  Green items are requirements Hayya Med Pro tracks automatically.
                </p>
              </div>

              <div>
                <div className="bg-[#eff6ff] rounded-2xl border border-[#bfdbfe] p-6">
                  <h3 className="text-base font-bold text-[#1e3a5f] mb-3">
                    Track your QCHP CPD automatically
                  </h3>
                  <p className="text-sm text-[#334e7a] mb-5 leading-relaxed">
                    Hayya Med Pro tracks your CPD credits, enforces the 40/year minimum,
                    ensures patient safety credits are counted, and generates your
                    submission-ready PDF portfolio â€” all automatically.
                  </p>
                  <ul className="space-y-2 mb-5">
                    {[
                      "Real-time credit progress toward 80-credit target",
                      "Annual 40-credit minimum tracked separately",
                      "Patient safety credit flag and alert",
                      "PDF portfolio for QCHP submission (Pro)",
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
                  <Link
                    href="/register"
                    className="block w-full text-center bg-[#1a56a0] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#1547a0] transition-colors"
                  >
                    Start tracking QCHP CPD â€” free â†’
                  </Link>
                  <p className="text-xs text-[#64748b] text-center mt-2">Free plan available Â· 14-day Pro trial Â· No card required</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-8">
              QCHP renewal â€” frequently asked questions
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
        <section className="py-10 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-lg font-bold text-[#111] mb-5">Related QCHP and CPD guides</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "QCHP requirements", href: "/qchp", desc: "Full guide" },
                { label: "CPD tracker", href: "/cpd-tracker", desc: "Track credits" },
                { label: "CPD vs CME", href: "/cme-vs-cpd", desc: "What's the difference?" },
                { label: "All GCC countries", href: "/countries", desc: "Compare requirements" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-4 hover:border-[#1a56a0] hover:bg-white transition-all"
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
              Ready for QCHP renewal? Start tracking today.
            </h2>
            <p className="text-[#94a3b8] mb-8 text-sm max-w-xl mx-auto">
              Hayya Med Pro tracks your 80-credit QCHP CPD requirement automatically.
              Log activities, upload certificates, and download your submission-ready report.
              Free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="bg-white text-[#1a56a0] font-semibold px-8 py-3 rounded-lg hover:bg-[#f0f4f8] transition-colors text-sm"
              >
                Start tracking CPD free â†’
              </Link>
              <Link
                href="/qchp"
                className="border border-[rgba(255,255,255,0.25)] text-white font-medium px-8 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors text-sm"
              >
                Full QCHP requirements â†’
              </Link>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <footer className="py-6 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
              Hayya Med Pro supports CPD tracking and licensing readiness. It does not issue licenses and does not replace
              the official QCHP renewal process. Always verify final CPD requirements and renewal procedures with the
              Department of Healthcare Professionals â€“ Accreditation Section (DHP-AS) at qchp.org.qa.
            </p>
            <p className="text-xs text-[#94a3b8] text-center mt-2">
              <Link href="/qchp" className="hover:text-[#64748b]">QCHP Guide</Link>
              {" Â· "}
              <Link href="/cpd-tracker" className="hover:text-[#64748b]">CPD Tracker</Link>
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

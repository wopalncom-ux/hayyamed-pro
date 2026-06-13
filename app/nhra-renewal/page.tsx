import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "NHRA License Renewal â€” CPD Requirements for Bahrain Healthcare Professionals",
  description:
    "Complete guide to renewing your NHRA license in Bahrain. 40 CPD credits per 2-year renewal cycle. Step-by-step NHRA renewal process for physicians, nurses, pharmacists, and all Bahrain healthcare professionals.",
  keywords: [
    "NHRA license renewal",
    "NHRA CPD renewal Bahrain",
    "renew NHRA healthcare license",
    "Bahrain healthcare license renewal",
    "National Health Regulatory Authority renewal",
    "NHRA renewal process",
    "NHRA CPD requirements renewal",
    "NHRA renewal checklist",
    "renew medical license Bahrain",
    "NHRA CPD credits renewal",
  ],
  openGraph: {
    title: "NHRA License Renewal â€” Complete Guide for Bahrain Healthcare Professionals",
    description:
      "40 CPD credits per 2-year cycle. Step-by-step NHRA renewal process, checklist, and how Hayya Med Pro tracks your CPD progress automatically.",
    url: `${APP_URL}/nhra-renewal`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=NHRA+License+Renewal+%E2%80%94+Bahrain&s=40+CPD+credits+%C2%B7+2-year+cycle+%C2%B7+NHRA+portal+renewal+guide&a=%F0%9F%87%A7%F0%9F%87%AD+NHRA&k=Renewal+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NHRA License Renewal Guide â€” Bahrain Healthcare CPD",
    description: "40 CPD credits per 2-year cycle. Complete NHRA renewal checklist, step-by-step process, and CPD compliance tracking for Bahrain healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/nhra-renewal` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do I need to renew my NHRA license in Bahrain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NHRA (National Health Regulatory Authority Bahrain) requires 40 CPD credits per 2-year renewal cycle. The cycle runs from the date of your initial registration or last renewal. You must accumulate 40 CPD hours/points across accepted categories before applying for renewal.",
      },
    },
    {
      "@type": "Question",
      name: "How do I renew my NHRA license online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NHRA license renewal is completed through the NHRA e-services portal (nhra.bh). You will need to upload your CPD portfolio including activity certificates, provider details, and credit values. Complete the renewal form, pay the renewal fee, and submit. Apply at least 30 days before your license expiry to allow processing time.",
      },
    },
    {
      "@type": "Question",
      name: "What CPD activities does NHRA accept for license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NHRA accepts CPD from NHRA-recognised providers and international accrediting bodies. Accepted activities include conferences, accredited workshops, hospital-based education, online accredited courses, journal-based CPD, research, and teaching activities. Activities must be documented with a certificate from an accredited provider.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I miss my NHRA renewal deadline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Practising in Bahrain with an expired NHRA license is not permitted. Late renewal may incur additional fees and administrative review. If your license expires, you cannot legally provide healthcare services until renewal is complete. NHRA recommends beginning the renewal process at least 60 days before expiry.",
      },
    },
    {
      "@type": "Question",
      name: "Does Hayya Med Pro track NHRA CPD requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports NHRA CPD tracking for Bahrain healthcare professionals. It tracks your 40-credit requirement, logs CPD activities with certificates, monitors your license expiry date, and generates a PDF CPD portfolio formatted for NHRA renewal submission. The Free plan covers basic tracking; Pro includes PDF reports and AI gap analysis.",
      },
    },
  ],
};

const RENEWAL_STEPS = [
  {
    step: "1",
    title: "Confirm your NHRA license expiry and CPD requirement",
    desc: "Log in to the NHRA e-services portal (nhra.bh) to confirm your license expiry date and your specific CPD requirement. Requirements may vary slightly by profession category. Verify your exact total before planning your renewal activities.",
  },
  {
    step: "2",
    title: "Check your CPD credit total and category gaps",
    desc: "Review your accumulated CPD credits against the 40-credit requirement. Identify any gaps in specific categories if required by your profession. Hayya Med Pro tracks your NHRA CPD progress in real time, showing your credit total and renewal readiness at a glance.",
  },
  {
    step: "3",
    title: "Complete remaining CPD activities",
    desc: "Register for NHRA-recognised conferences, workshops, or accredited online courses to close any credit gaps. Confirm the provider is on the NHRA recognised accreditors list or holds international accreditation accepted by NHRA before booking.",
  },
  {
    step: "4",
    title: "Collect and organise CPD certificates",
    desc: "Gather all CPD certificates with provider name, accreditation details, activity date, and credit value. Hayya Med Pro securely stores certificates and generates a PDF CPD portfolio sorted by category and date â€” ready for NHRA portal upload.",
  },
  {
    step: "5",
    title: "Submit renewal through NHRA portal",
    desc: "Log in to nhra.bh, complete the license renewal application, upload your CPD portfolio and any other required documents, pay the renewal fee, and submit. Begin the process at least 30â€“60 days before your license expires to account for processing time.",
  },
];

const CHECKLIST_ITEMS = [
  "40 CPD credits completed within the 2-year cycle",
  "All activities from NHRA-recognised or internationally accredited providers",
  "CPD certificates collected with provider and accreditation details",
  "CPD portfolio PDF ready for upload",
  "Professional indemnity insurance current",
  "NHRA e-services account active and accessible",
  "Renewal submitted at least 30 days before expiry",
  "Renewal fee prepared",
];

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to renew your NHRA healthcare license in Bahrain",
  description: "Step-by-step process to renew a National Health Regulatory Authority (NHRA) Bahrain license, including CPD requirements, NHRA portal submission, and portfolio preparation.",
  totalTime: "P60D",
  step: RENEWAL_STEPS.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.desc,
    position: parseInt(s.step),
  })),
};

export default function NhraRenewalPage() {
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
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-[#f0f9ff] border border-[#bae6fd] text-[#0369a1] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              ðŸ‡§ðŸ‡­ Bahrain Â· National Health Regulatory Authority (NHRA)
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111] mb-4 leading-tight">
              NHRA license renewal â€” complete guide for Bahrain healthcare professionals
            </h1>
            <p className="text-base text-[#475569] max-w-2xl leading-relaxed">
              NHRA (National Health Regulatory Authority) requires <strong className="text-[#111]">40 CPD credits
              per 2-year renewal cycle</strong> for licensed healthcare professionals in Bahrain. This guide walks you through
              the full renewal process, a printable checklist, and how to prepare your CPD portfolio for NHRA submission.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { value: "40", label: "CPD credits", sub: "per renewal cycle" },
              { value: "2", label: "Year cycle", sub: "from registration date" },
              { value: "CPD", label: "Terminology", sub: "not CME" },
              { value: "60", label: "Days before", sub: "start renewal process" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center">
                <p className="text-3xl font-black text-[#1a56a0]">{s.value}</p>
                <p className="text-xs font-semibold text-[#374151] mt-0.5">{s.label}</p>
                <p className="text-[11px] text-[#94a3b8]">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div className="mb-10 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-5">
            <div className="flex gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">â„¹ï¸</span>
              <div>
                <p className="text-sm font-semibold text-[#0369a1] mb-1">
                  NHRA is Bahrain&apos;s national healthcare licensing authority
                </p>
                <p className="text-sm text-[#0c4a6e] leading-relaxed">
                  All healthcare professionals licensed to practise in Bahrain are regulated by NHRA.
                  If you also hold licenses in Qatar, Saudi Arabia, or the UAE, each authority has separate
                  CPD requirements and renewal processes. Hayya Med Pro tracks all GCC licenses in one dashboard.
                  See the{" "}
                  <Link href="/nhra" className="underline font-medium hover:text-[#1a56a0]">
                    NHRA CPD tracker
                  </Link>{" "}
                  for your ongoing compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Step-by-step */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              NHRA license renewal â€” step by step
            </h2>
            <div className="space-y-4">
              {RENEWAL_STEPS.map((s) => (
                <div key={s.step} className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#1a56a0] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111] mb-1">{s.title}</h3>
                    <p className="text-sm text-[#64748b] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist + CTA box */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
              <h2 className="text-base font-bold text-[#111] mb-4">NHRA renewal checklist</h2>
              <ul className="space-y-2.5">
                {CHECKLIST_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 mt-0.5 flex-shrink-0 rounded border-2 border-[#d1d5db]" aria-hidden />
                    <span className="text-sm text-[#374151] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#1a56a0] rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-white mb-2">
                  Track your NHRA CPD automatically
                </h2>
                <p className="text-sm text-[rgba(255,255,255,0.75)] leading-relaxed mb-4">
                  Hayya Med Pro tracks your 40-credit NHRA CPD requirement in real time,
                  stores your certificates securely, and generates a PDF CPD portfolio for
                  NHRA portal upload in one click.
                </p>
                <ul className="space-y-2 mb-5">
                  {[
                    "Real-time CPD progress for NHRA 40-credit requirement",
                    "Secure certificate storage with AI OCR",
                    "PDF compliance report for NHRA portal upload",
                    "License expiry reminders at 90, 60, 30 days",
                    "Track NHRA and other GCC licenses in one dashboard",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-white">
                      <span className="text-[#4ade80]">âœ“</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/register"
                className="block w-full text-center bg-white text-[#1a56a0] font-semibold text-sm py-3 rounded-lg hover:bg-[#f0f7ff] transition-colors"
              >
                Start tracking NHRA CPD â€” free â†’
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              NHRA license renewal â€” frequently asked questions
            </h2>
            <div className="space-y-3">
              {faqLd.mainEntity.map((faq) => (
                <details key={faq.name} className="bg-white rounded-xl border border-[#e2e8f0] group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-[#111] list-none">
                    {faq.name}
                    <svg
                      className="w-4 h-4 text-[#64748b] flex-shrink-0 ml-4 group-open:rotate-180 transition-transform"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-[#64748b] border-t border-[#f1f5f9] pt-3 leading-relaxed">
                    {faq.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Related guides */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-[#111] mb-4">Related guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/nhra", label: "ðŸ‡§ðŸ‡­ NHRA CPD tracker", sub: "Track your Bahrain compliance" },
                { href: "/omsb-renewal", label: "ðŸ‡´ðŸ‡² OMSB renewal guide", sub: "Oman license renewal" },
                { href: "/qchp-renewal", label: "ðŸ‡¶ðŸ‡¦ QCHP renewal guide", sub: "Qatar license renewal" },
              ].map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="bg-white rounded-xl border border-[#e2e8f0] px-4 py-4 hover:border-[#1a56a0] hover:shadow-sm transition-all group"
                >
                  <p className="text-sm font-semibold text-[#111] group-hover:text-[#1a56a0] transition-colors">{g.label}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">{g.sub}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Dark CTA */}
          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] rounded-2xl p-10 text-center mb-8">
            <div className="inline-block text-3xl mb-3">ðŸ‡§ðŸ‡­</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Start tracking your NHRA CPD today
            </h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Track your NHRA Bahrain CPD requirement automatically, store all certificates in one place,
              and generate a PDF report for your renewal application. Free to start.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f7ff] transition-colors"
            >
              Track my NHRA compliance â€” free â†’
            </Link>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">
              No credit card required Â· 14-day Pro trial included
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-3 text-xs text-[#64748b] text-center leading-relaxed">
            Hayya Med Pro supports CPD tracking and licensing readiness for NHRA Bahrain requirements.
            It does not issue licenses and does not replace official NHRA guidance.
            Always verify final requirements with the National Health Regulatory Authority Bahrain (nhra.bh).
          </div>
        </main>
      </div>
    </>
  );
}

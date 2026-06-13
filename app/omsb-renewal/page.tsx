import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "OMSB License Renewal â€” CME Requirements for Oman Healthcare Professionals",
  description:
    "Complete guide to renewing your OMSB license in Oman. 40 CME credits per 2-year renewal cycle. Step-by-step OMSB renewal process for physicians, nurses, pharmacists, and all Oman healthcare professionals.",
  keywords: [
    "OMSB license renewal",
    "OMSB CME renewal Oman",
    "renew OMSB healthcare license",
    "Oman healthcare license renewal",
    "Oman Medical Specialty Board renewal",
    "OMSB renewal process",
    "OMSB CME requirements renewal",
    "OMSB renewal checklist",
    "renew medical license Oman",
    "OMSB CME credits renewal",
  ],
  openGraph: {
    title: "OMSB License Renewal â€” Complete Guide for Oman Healthcare Professionals",
    description:
      "40 CME credits per 2-year cycle. Step-by-step OMSB renewal process, checklist, and how Hayya Med Pro tracks your CME progress automatically.",
    url: `${APP_URL}/omsb-renewal`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=OMSB+License+Renewal+%E2%80%94+Oman&s=40+CME%2F2yr+%C2%B7+Category+A+%26+B+%C2%B7+OMSB+portal+renewal+checklist&a=%F0%9F%87%B4%F0%9F%87%B2+OMSB&k=Renewal+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OMSB License Renewal Guide â€” Oman Healthcare CME",
    description: "40 CME credits per 2-year cycle. Complete OMSB renewal checklist, step-by-step process, and CME compliance tracking for Oman healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/omsb-renewal` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do I need to renew my OMSB license in Oman?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OMSB (Oman Medical Specialty Board) requires 40 CME credits per 2-year renewal cycle for licensed healthcare professionals in Oman. This requirement applies to physicians, specialists, and other regulated healthcare professionals. Verify your specific requirement with OMSB as requirements may vary by profession and specialty.",
      },
    },
    {
      "@type": "Question",
      name: "How do I renew my OMSB license online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OMSB license renewal is completed through the OMSB online portal (omsb.org). You will need to log your CME activities, upload certificates, and complete the renewal application. Ensure all CME activities are from OMSB-accredited providers or internationally recognised accreditation bodies. Apply before your license expires to avoid any interruption to your ability to practise.",
      },
    },
    {
      "@type": "Question",
      name: "What CME activities does OMSB accept for license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OMSB accepts CME from OMSB-accredited providers and internationally recognised accrediting bodies including AMA, ACCME, RCPSC, and similar organisations. Accepted activities include conferences, workshops, accredited online courses, hospital-based education sessions, journal-based CME, and research activities. Activities must be documented with a valid certificate from an accredited provider.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if my OMSB license expires?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Practising in Oman with an expired OMSB license is not permitted. If your license lapses, you must apply for reinstatement which may require meeting additional CME requirements beyond the standard 40 credits. Start the renewal process at least 60 days before expiry to avoid any risk of interruption to practice.",
      },
    },
    {
      "@type": "Question",
      name: "Does Hayya Med Pro track OMSB CME requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports OMSB CME tracking for Oman healthcare professionals. It tracks your 40-credit requirement over the 2-year cycle, logs CME activities with uploaded certificates, monitors your license expiry date, and generates a PDF CME portfolio for OMSB renewal submission. The Free plan covers basic tracking; Pro includes PDF reports and AI gap analysis.",
      },
    },
  ],
};

const RENEWAL_STEPS = [
  {
    step: "1",
    title: "Confirm your OMSB license expiry and CME requirement",
    desc: "Log in to the OMSB portal (omsb.org) to confirm your license expiry date, license category, and your specific CME requirement. Check whether your specialty has any mandatory category requirements in addition to the general 40-credit total.",
  },
  {
    step: "2",
    title: "Review your CME credit total and identify gaps",
    desc: "Assess your accumulated CME credits against the 40-credit requirement for your renewal cycle. Identify any category-specific gaps if applicable to your specialty. Hayya Med Pro tracks your OMSB CME progress in real time so you always know where you stand.",
  },
  {
    step: "3",
    title: "Complete remaining CME activities",
    desc: "Register for OMSB-accredited conferences, workshops, or online CME courses to close any credit gaps. Verify the provider is recognised by OMSB or holds international accreditation (AMA, ACCME, RCPSC, or equivalent) before booking. International conferences with CME accreditation are commonly accepted.",
  },
  {
    step: "4",
    title: "Collect and organise CME certificates",
    desc: "Gather all CME certificates with provider name, accreditation reference, activity date, and credit value. Hayya Med Pro stores certificates securely with AI-powered OCR to extract credit details automatically, and generates a PDF CME portfolio sorted by category and date.",
  },
  {
    step: "5",
    title: "Submit renewal through OMSB portal",
    desc: "Log in to omsb.org, complete the license renewal form, upload your CME portfolio and required documents, pay the renewal fee, and submit. Begin the renewal process at least 60 days before your license expires to allow for processing and any documentation queries.",
  },
];

const CHECKLIST_ITEMS = [
  "40 CME credits completed within the 2-year cycle",
  "All activities from OMSB-recognised or internationally accredited providers",
  "CME certificates collected with provider and accreditation details",
  "CME portfolio PDF ready for upload",
  "Professional indemnity insurance current",
  "OMSB portal account active and accessible",
  "Renewal submitted at least 30 days before expiry",
  "Renewal fee prepared",
];

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to renew your OMSB healthcare license in Oman",
  description: "Step-by-step process to renew an Oman Medical Specialty Board (OMSB) license, including CME requirements, OMSB portal submission, and portfolio preparation.",
  totalTime: "P60D",
  step: RENEWAL_STEPS.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.desc,
    position: parseInt(s.step),
  })),
};

export default function OmsbRenewalPage() {
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
              ðŸ‡´ðŸ‡² Oman Â· Oman Medical Specialty Board (OMSB)
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111] mb-4 leading-tight">
              OMSB license renewal â€” complete guide for Oman healthcare professionals
            </h1>
            <p className="text-base text-[#475569] max-w-2xl leading-relaxed">
              OMSB (Oman Medical Specialty Board) requires <strong className="text-[#111]">40 CME credits
              per 2-year renewal cycle</strong> for licensed healthcare professionals in Oman. This guide covers
              the full renewal process, a printable checklist, and how to prepare your CME portfolio for OMSB submission.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { value: "40", label: "CME credits", sub: "per renewal cycle" },
              { value: "2", label: "Year cycle", sub: "from registration date" },
              { value: "CME", label: "Terminology", sub: "Continuing Medical Education" },
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
                  OMSB is Oman&apos;s primary medical licensing and specialty board
                </p>
                <p className="text-sm text-[#0c4a6e] leading-relaxed">
                  OMSB regulates specialist medical practice in Oman and manages CME requirements for license renewal.
                  If you also hold licenses in other GCC countries, each authority has separate CME requirements and
                  renewal processes. Hayya Med Pro tracks all GCC licenses in one dashboard.
                  See the{" "}
                  <Link href="/omsb" className="underline font-medium hover:text-[#1a56a0]">
                    OMSB CME tracker
                  </Link>{" "}
                  for your ongoing compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Step-by-step */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              OMSB license renewal â€” step by step
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
              <h2 className="text-base font-bold text-[#111] mb-4">OMSB renewal checklist</h2>
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
                  Track your OMSB CME automatically
                </h2>
                <p className="text-sm text-[rgba(255,255,255,0.75)] leading-relaxed mb-4">
                  Hayya Med Pro tracks your 40-credit OMSB CME requirement in real time,
                  stores your certificates securely, and generates a PDF CME portfolio for
                  OMSB portal upload in one click.
                </p>
                <ul className="space-y-2 mb-5">
                  {[
                    "Real-time CME progress for OMSB 40-credit requirement",
                    "Secure certificate storage with AI OCR extraction",
                    "PDF compliance report for OMSB portal upload",
                    "License expiry reminders at 90, 60, 30 days",
                    "Track OMSB and other GCC licenses in one dashboard",
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
                Start tracking OMSB CME â€” free â†’
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              OMSB license renewal â€” frequently asked questions
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
                { href: "/omsb", label: "ðŸ‡´ðŸ‡² OMSB CME tracker", sub: "Track your Oman compliance" },
                { href: "/nhra-renewal", label: "ðŸ‡§ðŸ‡­ NHRA renewal guide", sub: "Bahrain license renewal" },
                { href: "/scfhs-renewal", label: "ðŸ‡¸ðŸ‡¦ SCFHS renewal guide", sub: "Saudi Arabia license renewal" },
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
            <div className="inline-block text-3xl mb-3">ðŸ‡´ðŸ‡²</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Start tracking your OMSB CME today
            </h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Track your OMSB Oman CME requirement automatically, store all certificates in one place,
              and generate a PDF report for your renewal application. Free to start.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f7ff] transition-colors"
            >
              Track my OMSB compliance â€” free â†’
            </Link>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">
              No credit card required Â· 14-day Pro trial included
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-3 text-xs text-[#64748b] text-center leading-relaxed">
            Hayya Med Pro supports CME tracking and licensing readiness for OMSB Oman requirements.
            It does not issue licenses and does not replace official OMSB guidance.
            Always verify final requirements with the Oman Medical Specialty Board (omsb.org).
          </div>
        </main>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "DOH License Renewal â€” CPD Requirements for Abu Dhabi Healthcare Professionals",
  description:
    "Complete guide to renewing your DOH license in Abu Dhabi. 30â€“50 CPD credits per renewal cycle depending on profession. Step-by-step DOH renewal process for physicians, nurses, pharmacists, and all Abu Dhabi healthcare professionals.",
  keywords: [
    "DOH license renewal",
    "DOH CPD renewal Abu Dhabi",
    "renew DOH healthcare license",
    "Abu Dhabi healthcare license renewal",
    "Department of Health Abu Dhabi renewal",
    "DOH renewal process",
    "DOH CPD requirements renewal",
    "DOH renewal checklist",
    "renew medical license Abu Dhabi",
    "DOH CPD credits renewal",
  ],
  openGraph: {
    title: "DOH License Renewal â€” Complete Guide for Abu Dhabi Healthcare Professionals",
    description:
      "30â€“50 CPD credits per cycle. Step-by-step DOH renewal process, checklist, and how Hayya Med Pro tracks your CPD progress automatically.",
    url: `${APP_URL}/doh-renewal`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=DOH+License+Renewal+%E2%80%94+Abu+Dhabi&s=30%E2%80%9350+CPD+credits+%C2%B7+Malaffi+portal+%C2%B7+step-by-step+renewal+guide&a=%F0%9F%87%A6%F0%9F%87%AA+DOH&k=Renewal+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DOH License Renewal Guide â€” Abu Dhabi Healthcare CPD",
    description: "30â€“50 CPD credits per cycle. Complete DOH renewal checklist, step-by-step process, and CPD compliance tracking for Abu Dhabi healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/doh-renewal` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do I need to renew my DOH license in Abu Dhabi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DOH (Department of Health Abu Dhabi) requires 30â€“50 CPD credits per renewal cycle depending on your profession and registration type. Most physicians and senior clinicians need 50 CPD credits per 2-year cycle. Nurses and allied health professionals typically need 30 CPD credits. Always verify your specific requirement via the DOH portal as requirements may vary by specialty.",
      },
    },
    {
      "@type": "Question",
      name: "How do I renew my DOH license online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DOH license renewal is completed through the DOH portal (doh.gov.ae) or via the Tamm Abu Dhabi digital services platform (tamm.abudhabi). You will need to upload your CPD portfolio with all activity certificates, provider names, accreditation details, and credit values. Complete the online renewal form and submit. Processing times vary â€” start at least 60 days before your license expiry.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between DHA (Dubai) and DOH (Abu Dhabi) license requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DHA and DOH are separate UAE licensing authorities. DHA covers healthcare professionals licensed to practise in Dubai; DOH covers Abu Dhabi, Al Ain, and the Western Region. Each has separate CPD requirements, accredited provider lists, and renewal portals. You need separate valid licenses for each emirate. Hayya Med Pro tracks both jurisdictions in a single dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "What CPD activities does DOH accept for license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DOH accepts CPD from DOH-recognised providers including international and regional conferences, accredited workshops, hospital-based education sessions, online accredited courses, journal-based CPD, and self-directed learning. Activities must have an accreditation certificate or be from a provider on the DOH recognised accreditors list. Patient safety CPD is typically required as a mandatory component.",
      },
    },
    {
      "@type": "Question",
      name: "Can I transfer CPD credits between DOH and DHA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generally, CPD activities accredited by one UAE authority are recognised by other UAE authorities. However, you should confirm with each authority whether a specific activity is recognised for renewal purposes. Hayya Med Pro lets you tag activities to the correct licensing authority so your compliance tracking stays accurate for both DHA and DOH renewals.",
      },
    },
  ],
};

const RENEWAL_STEPS = [
  {
    step: "1",
    title: "Confirm your DOH license type and renewal date",
    desc: "Log in to the DOH portal (doh.gov.ae) or Tamm platform to confirm your license category, expiry date, and the exact CPD credit requirement for your profession. Different license types have different credit targets â€” verify your specific requirement before planning.",
  },
  {
    step: "2",
    title: "Check your CPD credit total and gaps",
    desc: "Review your accumulated CPD credits against the required total. Note any mandatory category requirements (patient safety is typically required). Hayya Med Pro tracks your CPD total, mandatory categories, and renewal readiness in real time for DOH standards.",
  },
  {
    step: "3",
    title: "Complete remaining CPD activities",
    desc: "Register for DOH-recognised conferences, workshops, or accredited online courses to fill any credit gaps. Ensure patient safety activities are included if required for your license category. Check the DOH approved providers list before registering for activities.",
  },
  {
    step: "4",
    title: "Collect and organise CPD certificates",
    desc: "Gather every CPD certificate with provider name, accreditation reference, activity date, and credit value. Hayya Med Pro stores certificates securely and generates a PDF CPD portfolio sorted by category and date, ready for DOH submission.",
  },
  {
    step: "5",
    title: "Submit renewal through DOH portal",
    desc: "Log in to the DOH portal or Tamm, complete the license renewal application, upload your CPD portfolio and any other required documents (indemnity insurance, good standing certificates if required), and submit. Begin the renewal process at least 60 days before your license expires.",
  },
];

const CHECKLIST_ITEMS = [
  "CPD credits completed (30â€“50 depending on profession)",
  "Patient safety CPD included (check your license category requirement)",
  "All activities from DOH-recognised providers",
  "CPD certificates collected with accreditation details",
  "CPD portfolio PDF ready for upload",
  "Professional indemnity insurance current",
  "Good standing certificate obtained if required",
  "DOH portal / Tamm account active and accessible",
  "Renewal submitted at least 30 days before expiry",
];

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to renew your DOH healthcare license in Abu Dhabi",
  description: "Step-by-step process to renew a Department of Health Abu Dhabi (DOH) license, including CPD requirements, DOH portal or Tamm submission, and portfolio preparation.",
  totalTime: "P60D",
  step: RENEWAL_STEPS.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.desc,
    position: parseInt(s.step),
  })),
};

export default function DohRenewalPage() {
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
              ðŸ‡¦ðŸ‡ª Abu Dhabi Â· Department of Health â€” Abu Dhabi (DOH)
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111] mb-4 leading-tight">
              DOH license renewal â€” complete guide for Abu Dhabi healthcare professionals
            </h1>
            <p className="text-base text-[#475569] max-w-2xl leading-relaxed">
              DOH (Department of Health Abu Dhabi) requires <strong className="text-[#111]">30â€“50 CPD credits
              per renewal cycle</strong> depending on your profession. This guide walks you through the
              full renewal process, a downloadable-ready checklist, and how to prepare your CPD portfolio
              for DOH submission.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { value: "30â€“50", label: "CPD credits", sub: "per renewal cycle" },
              { value: "1â€“2", label: "Year cycle", sub: "by profession" },
              { value: "DOH", label: "Terminology", sub: "CPD (not CME)" },
              { value: "60", label: "Days before", sub: "start renewal process" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center">
                <p className="text-3xl font-black text-[#1a56a0]">{s.value}</p>
                <p className="text-xs font-semibold text-[#374151] mt-0.5">{s.label}</p>
                <p className="text-[11px] text-[#94a3b8]">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* DOH vs DHA clarification */}
          <div className="mb-10 bg-[#f0f9ff] border border-[#bae6fd] rounded-xl p-5">
            <div className="flex gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">â„¹ï¸</span>
              <div>
                <p className="text-sm font-semibold text-[#0369a1] mb-1">
                  DOH (Abu Dhabi) and DHA (Dubai) are separate licensing authorities
                </p>
                <p className="text-sm text-[#0c4a6e] leading-relaxed">
                  If you practise in both Dubai and Abu Dhabi, you hold two separate UAE licenses and
                  must renew each independently. DOH covers Abu Dhabi, Al Ain, and the Western Region.
                  DHA covers Dubai only. See the{" "}
                  <Link href="/dha-renewal" className="underline font-medium hover:text-[#1a56a0]">
                    DHA renewal guide
                  </Link>{" "}
                  for Dubai requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Step-by-step */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              DOH license renewal â€” step by step
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
              <h2 className="text-base font-bold text-[#111] mb-4">DOH renewal checklist</h2>
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
                  Track your DOH CPD automatically
                </h2>
                <p className="text-sm text-[rgba(255,255,255,0.75)] leading-relaxed mb-4">
                  Hayya Med Pro tracks your CPD credits, mandatory categories, and renewal
                  readiness for DOH Abu Dhabi requirements. See your progress in real time
                  and generate a PDF CPD report for DOH portal upload in one click.
                </p>
                <ul className="space-y-2 mb-5">
                  {[
                    "Real-time CPD progress for DOH requirements",
                    "Mandatory patient safety credit tracker",
                    "PDF compliance report for DOH portal upload",
                    "License expiry reminders at 90, 60, 30 days",
                    "Track DHA and DOH licenses in one dashboard",
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
                Start tracking DOH CPD â€” free â†’
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              DOH license renewal â€” frequently asked questions
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
                { href: "/doh", label: "ðŸ‡¦ðŸ‡ª DOH CPD tracker", sub: "Track your DOH compliance" },
                { href: "/dha-renewal", label: "ðŸ‡¦ðŸ‡ª DHA renewal guide", sub: "Dubai license renewal" },
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
            <div className="inline-block text-3xl mb-3">ðŸ‡¦ðŸ‡ª</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Start tracking your DOH CPD today
            </h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Track your DOH Abu Dhabi CPD requirement automatically, with mandatory category tracking
              and a one-click PDF report for your renewal application. Free to start.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f7ff] transition-colors"
            >
              Track my DOH compliance â€” free â†’
            </Link>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">
              No credit card required Â· 14-day Pro trial included
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-3 text-xs text-[#64748b] text-center leading-relaxed">
            Hayya Med Pro supports CPD tracking and licensing readiness for Department of Health Abu Dhabi requirements.
            It does not issue licenses and does not replace official DOH guidance.
            Always verify final requirements with the Department of Health Abu Dhabi (doh.gov.ae) or via the Tamm platform.
          </div>
        </main>
      </div>
    </>
  );
}

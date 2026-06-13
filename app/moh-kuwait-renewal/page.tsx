import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "MOH Kuwait License Renewal â€” CME Requirements for Kuwait Healthcare Professionals",
  description:
    "Complete guide to renewing your MOH Kuwait license. 30 CME credits required per annual renewal cycle. Step-by-step MOH Kuwait renewal process for physicians, nurses, pharmacists, and all Kuwait healthcare professionals.",
  keywords: [
    "MOH Kuwait license renewal",
    "MOH Kuwait CME renewal",
    "renew MOH Kuwait healthcare license",
    "Kuwait healthcare license renewal",
    "Ministry of Health Kuwait renewal",
    "MOH Kuwait renewal process",
    "Kuwait CME requirements renewal",
    "MOH Kuwait renewal checklist",
    "renew medical license Kuwait",
    "Kuwait CME credits renewal",
  ],
  openGraph: {
    title: "MOH Kuwait License Renewal â€” Complete Guide for Kuwait Healthcare Professionals",
    description:
      "30 CME credits per annual cycle. Step-by-step MOH Kuwait renewal process, checklist, and how Hayya Med Pro tracks your CME progress automatically.",
    url: `${APP_URL}/moh-kuwait-renewal`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=MOH+Kuwait+License+Renewal&s=30+CME%2Fyear+%28physicians%29+%C2%B7+annual+cycle+%C2%B7+renewal+checklist+%26+timeline&a=%F0%9F%87%B0%F0%9F%87%BC+MOH+Kuwait&k=Renewal+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MOH Kuwait License Renewal Guide â€” Kuwait Healthcare CME",
    description: "30 CME credits per year. Complete MOH Kuwait renewal checklist and CME compliance tracking for Kuwait healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/moh-kuwait-renewal` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do I need to renew my MOH Kuwait license?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MOH (Ministry of Health) Kuwait requires 30 CME credits per annual renewal cycle for licensed healthcare professionals. Licenses are renewed annually, so you must accumulate 30 CME credits each year before your license expires. Requirements may vary by profession â€” always verify with MOH Kuwait directly.",
      },
    },
    {
      "@type": "Question",
      name: "How do I renew my MOH Kuwait license?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MOH Kuwait license renewal is completed through the MOH Kuwait e-services portal. You will need to provide documentation of completed CME activities, valid certificates from accredited providers, and complete the renewal application form. Annual renewal must be completed before your current license expires. Contact the MOH Kuwait registration department for the most current renewal procedures.",
      },
    },
    {
      "@type": "Question",
      name: "What CME activities does MOH Kuwait accept for license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MOH Kuwait accepts CME from MOH-recognised providers and major international accrediting bodies. Accepted activities typically include conferences, accredited workshops, hospital-based education, accredited online courses, and medical education programmes. Activities must be documented with a valid certificate from an accredited provider. Check with MOH Kuwait for the current list of recognised accrediting bodies.",
      },
    },
    {
      "@type": "Question",
      name: "How often do I need to renew my MOH Kuwait license?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MOH Kuwait healthcare licenses are renewed annually. You must complete 30 CME credits within each annual renewal period and submit the renewal application before your current license expires. Unlike some GCC countries that use 2-year cycles, Kuwait uses a 1-year renewal cycle.",
      },
    },
    {
      "@type": "Question",
      name: "Does Hayya Med Pro track MOH Kuwait CME requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports MOH Kuwait CME tracking for Kuwait healthcare professionals. It tracks your 30-credit annual requirement, logs CME activities with uploaded certificates, monitors your license expiry date, and generates a PDF CME portfolio for renewal submission. The Free plan covers basic tracking; Pro includes PDF reports and AI gap analysis.",
      },
    },
  ],
};

const RENEWAL_STEPS = [
  {
    step: "1",
    title: "Confirm your MOH Kuwait license expiry and annual CME requirement",
    desc: "Log in to the MOH Kuwait e-services portal to confirm your license expiry date and the exact CME requirement for your profession. Kuwait licenses renew annually, so you must complete the 30 CME credits within each 12-month cycle.",
  },
  {
    step: "2",
    title: "Review your CME credit total for the current year",
    desc: "Check your CME credits accumulated in the current annual renewal period. You need 30 credits before applying for renewal. Hayya Med Pro tracks your Kuwait CME requirement in real time, showing your progress toward the 30-credit annual target.",
  },
  {
    step: "3",
    title: "Complete remaining CME activities before renewal",
    desc: "Register for MOH Kuwait-accepted conferences, workshops, or accredited online CME to close any credit gaps. Verify the provider holds MOH Kuwait recognition or accreditation from a major international body (AMA, RCPSC, or equivalent). Many GCC and international conferences offer accredited CME hours.",
  },
  {
    step: "4",
    title: "Collect and organise all CME certificates",
    desc: "Gather CME certificates with provider name, accreditation reference, activity date, and credit value. Hayya Med Pro stores certificates securely and generates a PDF CME portfolio ready for MOH Kuwait submission â€” saving hours of manual collation at renewal time.",
  },
  {
    step: "5",
    title: "Submit annual renewal through MOH Kuwait portal",
    desc: "Log in to the MOH Kuwait e-services portal, complete the annual license renewal form, upload your CME documentation, pay the renewal fee, and submit. Because Kuwait renewals are annual, set a calendar reminder 60 days before your license expires each year.",
  },
];

const CHECKLIST_ITEMS = [
  "30 CME credits completed within the current annual cycle",
  "All activities from MOH Kuwait-accepted or internationally accredited providers",
  "CME certificates collected with provider and accreditation details",
  "CME portfolio PDF ready for upload",
  "Professional indemnity insurance current",
  "MOH Kuwait portal account active and accessible",
  "Renewal submitted before annual expiry",
  "Renewal fee prepared",
];

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to renew your MOH Kuwait healthcare license",
  description: "Step-by-step process to renew a Ministry of Health Kuwait license, including CME requirements, portal submission, and certificate portfolio preparation.",
  totalTime: "P60D",
  step: RENEWAL_STEPS.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.desc,
    position: parseInt(s.step),
  })),
};

export default function MohKuwaitRenewalPage() {
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
              ðŸ‡°ðŸ‡¼ Kuwait Â· Ministry of Health Kuwait (MOH)
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111] mb-4 leading-tight">
              MOH Kuwait license renewal â€” complete guide for Kuwait healthcare professionals
            </h1>
            <p className="text-base text-[#475569] max-w-2xl leading-relaxed">
              MOH Kuwait (Ministry of Health) requires <strong className="text-[#111]">30 CME credits per annual
              renewal cycle</strong> for licensed healthcare professionals. This guide covers the full renewal process,
              a printable checklist, and how to prepare your CME portfolio for MOH Kuwait submission.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { value: "30", label: "CME credits", sub: "per annual cycle" },
              { value: "1", label: "Year cycle", sub: "annual renewal" },
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
          <div className="mb-10 bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-5">
            <div className="flex gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">âš¡</span>
              <div>
                <p className="text-sm font-semibold text-[#c2410c] mb-1">
                  Kuwait uses annual renewal â€” not a 2-year cycle
                </p>
                <p className="text-sm text-[#9a3412] leading-relaxed">
                  Unlike Qatar (2-year) and Saudi Arabia (1â€“3 year), Kuwait MOH licenses renew every year.
                  This means you need to accumulate 30 CME credits and submit your renewal application annually.
                  Set a recurring reminder 60 days before your license expires each year. Hayya Med Pro sends
                  automatic license expiry reminders at 90, 60, and 30 days.
                </p>
              </div>
            </div>
          </div>

          {/* Step-by-step */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              MOH Kuwait license renewal â€” step by step
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
              <h2 className="text-base font-bold text-[#111] mb-4">MOH Kuwait renewal checklist</h2>
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
                  Track your Kuwait CME automatically
                </h2>
                <p className="text-sm text-[rgba(255,255,255,0.75)] leading-relaxed mb-4">
                  Hayya Med Pro tracks your 30-credit annual Kuwait CME requirement, stores
                  certificates securely, and generates a PDF CME portfolio for MOH Kuwait renewal
                  submission â€” every year without the manual effort.
                </p>
                <ul className="space-y-2 mb-5">
                  {[
                    "Annual 30-credit CME progress tracker for MOH Kuwait",
                    "Secure certificate storage with AI OCR extraction",
                    "PDF compliance report for MOH Kuwait renewal",
                    "Annual license expiry reminders at 90, 60, 30 days",
                    "Track Kuwait and other GCC licenses in one dashboard",
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
                Start tracking Kuwait CME â€” free â†’
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              MOH Kuwait license renewal â€” frequently asked questions
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
                { href: "/moh-kuwait", label: "ðŸ‡°ðŸ‡¼ MOH Kuwait CME tracker", sub: "Track your Kuwait compliance" },
                { href: "/nhra-renewal", label: "ðŸ‡§ðŸ‡­ NHRA renewal guide", sub: "Bahrain license renewal" },
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
            <div className="inline-block text-3xl mb-3">ðŸ‡°ðŸ‡¼</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Start tracking your Kuwait CME today
            </h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Track your annual 30-credit Kuwait CME requirement automatically, store all certificates
              in one place, and generate a PDF report for your annual MOH Kuwait renewal. Free to start.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f7ff] transition-colors"
            >
              Track my Kuwait CME â€” free â†’
            </Link>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">
              No credit card required Â· 14-day Pro trial included
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-3 text-xs text-[#64748b] text-center leading-relaxed">
            Hayya Med Pro supports CME tracking and licensing readiness for MOH Kuwait requirements.
            It does not issue licenses and does not replace official MOH Kuwait guidance.
            Always verify final requirements with the Ministry of Health Kuwait (moh.gov.kw).
          </div>
        </main>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "DHA License Renewal â€” CME Requirements for Dubai Healthcare Professionals",
  description:
    "Complete guide to renewing your DHA license in Dubai. 40 CME credits required per 2-year cycle, 5 mandatory patient safety credits. Step-by-step DHA renewal process for physicians, nurses, pharmacists, and all Dubai healthcare professionals.",
  keywords: [
    "DHA license renewal",
    "DHA CME renewal Dubai",
    "renew DHA healthcare license",
    "Dubai healthcare license renewal",
    "DHA renewal process",
    "DHA CME requirements renewal",
    "Dubai Health Authority license renewal",
    "DHA renewal checklist",
    "DHA CME credits renewal",
    "renew medical license Dubai",
  ],
  openGraph: {
    title: "DHA License Renewal â€” Complete Guide for Dubai Healthcare Professionals",
    description:
      "40 CME credits per 2 years. Step-by-step DHA renewal process, checklist, and how Hayya Med Pro tracks your CME progress automatically.",
    url: `${APP_URL}/dha-renewal`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=DHA+License+Renewal+%E2%80%94+Dubai&s=40+CME+credits+%C2%B7+Salama+portal+submission+%C2%B7+step-by-step+guide&a=%F0%9F%87%A6%F0%9F%87%AA+DHA&k=Renewal+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DHA License Renewal Guide â€” Dubai Healthcare CME",
    description: "40 CME credits per 2-year cycle. Complete DHA renewal checklist, step-by-step process, and compliance tracking for Dubai healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/dha-renewal` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do I need to renew my DHA license?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DHA requires 40 CME credits per 2-year renewal cycle. You must complete at least 5 credits in patient safety. Online CME is permitted but capped at 20 credits maximum (50% of the total). Self-directed learning is capped at 10 credits maximum. Activities must be from DHA-accredited providers.",
      },
    },
    {
      "@type": "Question",
      name: "How do I renew my DHA license online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DHA license renewal is completed through the Salama system (salama.ae). You will need your CME portfolio with all activity certificates, provider names, accreditation numbers, and credit values. Log in to Salama, go to license renewal, upload your CME documentation, and submit. Processing typically takes 5â€“15 working days.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I don't complete my DHA CME before renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Practicing in Dubai without a valid DHA license is illegal under UAE healthcare law. If you are short on CME credits, complete the deficit before submitting your renewal. Hayya Med Pro shows your real-time credit gap so you can plan remediation activities well before your renewal deadline.",
      },
    },
    {
      "@type": "Question",
      name: "What CME activities are accepted by DHA?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DHA accepts CME from DHA-approved providers including international conferences (with DHA recognition), online courses from accredited platforms, hospital-based grand rounds, workshops, and self-directed learning (e-modules, journal reading â€” up to 10 credits). Activities must have a DHA accreditation certificate or be from a provider listed on the DHA approved accreditors list.",
      },
    },
    {
      "@type": "Question",
      name: "Is the 40 CME requirement the same for all professions in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The 40 CME per 2-year cycle applies broadly across DHA-licensed healthcare professions including physicians, nurses, pharmacists, dentists, and allied health professionals. Some specialist categories may have additional requirements. Always verify your specific professional category with DHA or check the latest DHA CME policy document.",
      },
    },
  ],
};

const RENEWAL_STEPS = [
  {
    step: "1",
    title: "Check your DHA renewal date",
    desc: "Log in to Salama (salama.ae) to confirm your license expiry date. DHA recommends starting the renewal process 60 days before expiry. Set a reminder at 90 days out to begin collecting CME documentation.",
  },
  {
    step: "2",
    title: "Audit your CME portfolio",
    desc: "Review your 40-credit total, the mandatory 5 patient safety credits, the 20-credit online cap, and the 10-credit self-directed learning cap. Hayya Med Pro tracks all four limits in real time so you know exactly where you stand.",
  },
  {
    step: "3",
    title: "Fill remaining credit gaps",
    desc: "If you are short on credits, check the DHA-approved provider list and register for accredited conferences, workshops, or online courses. Patient safety CME is often available from your hospital's education department.",
  },
  {
    step: "4",
    title: "Collect and organise your certificates",
    desc: "Gather every CME certificate with the provider name, DHA accreditation number, activity date, and credit value. Hayya Med Pro stores certificates securely and generates a PDF portfolio sorted by category.",
  },
  {
    step: "5",
    title: "Submit renewal on Salama",
    desc: "Log in to Salama, navigate to license renewal, upload your CME portfolio (individual certificates or generated PDF report), complete the application form, and submit. Ensure your professional indemnity insurance is also current.",
  },
];

const CHECKLIST_ITEMS = [
  { done: false, text: "40 CME credits completed (full 2-year cycle)" },
  { done: false, text: "5 patient safety credits completed (mandatory)" },
  { done: false, text: "Online CME total does not exceed 20 credits" },
  { done: false, text: "Self-directed learning total does not exceed 10 credits" },
  { done: false, text: "All activities from DHA-accredited providers" },
  { done: false, text: "Certificates collected with accreditation numbers" },
  { done: false, text: "CME portfolio PDF ready for upload" },
  { done: false, text: "Professional indemnity insurance current" },
  { done: false, text: "Salama account active and accessible" },
  { done: false, text: "Renewal submitted at least 30 days before expiry" },
];

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to renew your DHA healthcare license in Dubai",
  description: "Step-by-step process to renew a DHA license in Dubai, including CME category caps, Salama portal submission, and CPD portfolio preparation.",
  totalTime: "P60D",
  step: RENEWAL_STEPS.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: s.desc,
    position: parseInt(s.step),
  })),
};

export default function DhaRenewalPage() {
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
              ðŸ‡¦ðŸ‡ª Dubai Â· Dubai Health Authority (DHA)
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111] mb-4 leading-tight">
              DHA license renewal â€” complete guide for Dubai healthcare professionals
            </h1>
            <p className="text-base text-[#475569] max-w-2xl leading-relaxed">
              DHA requires <strong className="text-[#111]">40 CME credits per 2-year renewal cycle</strong>,
              including 5 mandatory patient safety credits. This guide walks you through the full
              renewal process, checklist, and how to prepare your CME portfolio for Salama submission.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { value: "40", label: "CME credits", sub: "per 2-year cycle" },
              { value: "5", label: "Patient safety", sub: "mandatory credits" },
              { value: "20", label: "Online cap", sub: "max online credits" },
              { value: "10", label: "Self-directed cap", sub: "max self-learning" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center">
                <p className="text-3xl font-black text-[#1a56a0]">{s.value}</p>
                <p className="text-xs font-semibold text-[#374151] mt-0.5">{s.label}</p>
                <p className="text-[11px] text-[#94a3b8]">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* CME requirement callout */}
          <div className="mb-10 bg-[#fffbeb] border border-[#fcd34d] rounded-xl p-5">
            <div className="flex gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">âš ï¸</span>
              <div>
                <p className="text-sm font-semibold text-[#92400e] mb-1">Important: DHA CME category caps</p>
                <p className="text-sm text-[#78350f] leading-relaxed">
                  DHA has strict caps on how credits can be distributed: <strong>online activities max 20 credits</strong>,
                  and <strong>self-directed learning max 10 credits</strong>. Even if you have 40 total credits,
                  exceeding these caps means the surplus credits in that category will not count.
                  Always verify your category breakdown before submitting your renewal.
                </p>
              </div>
            </div>
          </div>

          {/* Step-by-step renewal process */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              DHA license renewal â€” step by step
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
              <h2 className="text-base font-bold text-[#111] mb-4">DHA renewal checklist</h2>
              <ul className="space-y-2.5">
                {CHECKLIST_ITEMS.map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 mt-0.5 flex-shrink-0 rounded border-2 border-[#d1d5db]" aria-hidden />
                    <span className="text-sm text-[#374151] leading-snug">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#1a56a0] rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-white mb-2">
                  Track your DHA CME automatically
                </h2>
                <p className="text-sm text-[rgba(255,255,255,0.75)] leading-relaxed mb-4">
                  Hayya Med Pro tracks all four DHA limits in real time â€” total credits,
                  patient safety, online cap, and self-directed cap. See your renewal
                  readiness at a glance and generate a PDF report for Salama in one click.
                </p>
                <ul className="space-y-2 mb-5">
                  {[
                    "Real-time progress toward 40-credit target",
                    "Patient safety credit counter",
                    "Online cap tracker (max 20)",
                    "PDF compliance report for Salama upload",
                    "License expiry reminders at 90, 60, 30 days",
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
                Start tracking DHA CME â€” free â†’
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              DHA license renewal â€” frequently asked questions
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
                { href: "/dha", label: "ðŸ‡¦ðŸ‡ª DHA CME tracker", sub: "Track your DHA compliance" },
                { href: "/qchp-renewal", label: "ðŸ‡¶ðŸ‡¦ QCHP renewal guide", sub: "Qatar license renewal" },
                { href: "/scfhs-renewal", label: "ðŸ‡¸ðŸ‡¦ SCFHS renewal guide", sub: "Saudi license renewal" },
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
              Start tracking your DHA CME today
            </h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Track your 40-credit DHA requirement, patient safety credits, and online caps
              automatically. Generate your Salama-ready PDF compliance report in one click. Free to start.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f7ff] transition-colors"
            >
              Track my DHA compliance â€” free â†’
            </Link>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">
              No credit card required Â· 14-day Pro trial included
            </p>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-3 text-xs text-[#64748b] text-center leading-relaxed">
            Hayya Med Pro supports CME tracking and licensing readiness for Dubai Health Authority requirements.
            It does not issue licenses and does not replace official DHA guidance.
            Always verify final requirements with the Dubai Health Authority (dha.gov.ae) or through the Salama system.
          </div>
        </main>
      </div>
    </>
  );
}

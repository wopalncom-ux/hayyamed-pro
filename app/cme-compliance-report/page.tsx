import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CME Compliance Report â€” Generate Your QCHP, SCFHS, or DHA Portfolio PDF | Hayya Med Pro",
  description:
    "Generate a professional CME compliance report for QCHP, SCFHS, DHA, or any GCC licensing authority. One-click PDF showing credit totals, categories, certificates, and renewal readiness. Required for license renewal submission.",
  keywords: [
    "CME compliance report",
    "CME report template",
    "CPD compliance report QCHP",
    "SCFHS CME report",
    "DHA CME portfolio",
    "CME portfolio PDF download",
    "generate CME report",
    "QCHP CPD portfolio format",
    "how to format CME report for renewal",
    "CME compliance certificate PDF",
  ],
  openGraph: {
    title: "Generate Your CME Compliance Report â€” QCHP, SCFHS, DHA Ready",
    description:
      "One-click PDF CME compliance report for any GCC licensing authority. Hayya Med Pro generates your portfolio automatically â€” credit totals, categories, certificates, and renewal readiness. Pro feature.",
    url: `${APP_URL}/cme-compliance-report`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CME Compliance Report Generator â€” GCC Healthcare Professionals",
    description: "Generate a professional CME compliance report for QCHP, SCFHS, or DHA in one click. PDF formatted for renewal submission.",
  },
  alternates: { canonical: `${APP_URL}/cme-compliance-report` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What should a CME compliance report include for QCHP renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A QCHP CPD compliance report should include: (1) Professional name, license number, and renewal cycle dates, (2) Total CPD credits (must be â‰¥80 for the 2-year cycle, â‰¥40 per year), (3) Category breakdown â€” structured activities, self-directed learning, patient safety (minimum 2 credits), (4) A list of all activities with provider name, accreditation body, activity date, and credit value for each, (5) Copies or references to certificates for each activity.",
      },
    },
    {
      "@type": "Question",
      name: "How do I generate a CME compliance report for SCFHS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For SCFHS submission, your CME compliance report should show your annual CME total (60 credits for physicians/dentists/pharmacists; 30 for nurses/allied health), with a breakdown by category (conference, online, research, self-directed), mandatory 5 patient safety credits, and all supporting certificates. Hayya Med Pro generates this as a formatted PDF that is ready for upload to the SCFHS portal.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download a CME report for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The CME compliance report PDF download is a Pro feature in Hayya Med Pro. Free plan users can track unlimited CME activities and see their compliance dashboard, but the PDF portfolio export requires a Pro subscription (from $6/month, or $61.20/year). All new accounts include a 14-day Pro trial â€” no credit card required â€” so you can generate and test your first compliance report for free.",
      },
    },
    {
      "@type": "Question",
      name: "What format does the CME compliance report use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Hayya Med Pro CME compliance report is a formatted PDF document suitable for direct attachment to your QCHP, SCFHS, DHA, DOH, or other GCC authority renewal application. It includes your personal and license details, credit summary, year-by-year breakdown (for multi-year cycles), full activity list with dates and providers, and a compliance status summary.",
      },
    },
    {
      "@type": "Question",
      name: "Does the DHA accept Hayya Med Pro PDF reports?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DHA Salama renewal requires you to upload your CME portfolio. A Hayya Med Pro PDF compliance report contains all the information DHA requires: activity names, providers, DHA accreditation numbers (where applicable), dates, credit values, and category totals. You can upload the PDF directly to the Salama renewal portal. Individual certificates should be kept in case DHA requests verification.",
      },
    },
  ],
};

const REPORT_SECTIONS = [
  {
    number: "01",
    title: "Professional & license details",
    items: ["Full name", "License number", "Licensing authority (QCHP, SCFHS, DHA, etc.)", "Renewal cycle start and end dates"],
  },
  {
    number: "02",
    title: "Credit summary",
    items: ["Total CME/CPD credits (vs requirement)", "Annual minimum check (where applicable)", "Patient safety credits (vs mandatory minimum)", "Category cap compliance status"],
  },
  {
    number: "03",
    title: "Year-by-year breakdown",
    items: ["Credits per calendar year", "Annual minimum tracking", "Progress chart for multi-year cycles"],
  },
  {
    number: "04",
    title: "Full activity list",
    items: ["Activity title and type", "Provider name and accreditation body", "Activity date", "Credit value"],
  },
  {
    number: "05",
    title: "Compliance status",
    items: ["Overall compliance status (compliant / at risk / non-compliant)", "Gap analysis â€” credits needed to complete", "Renewal readiness summary"],
  },
];

const AUTHORITY_FORMATS = [
  {
    flag: "ðŸ‡¶ðŸ‡¦",
    authority: "QCHP",
    requirement: "80 CPD / 2yr (40/yr min)",
    mandatory: "2 patient safety",
    reportUse: "Attach to QCHP portal renewal application",
  },
  {
    flag: "ðŸ‡¸ðŸ‡¦",
    authority: "SCFHS",
    requirement: "30â€“60 CME / yr (profession-specific)",
    mandatory: "5 patient safety",
    reportUse: "Upload to SCFHS/Mumaris portal",
  },
  {
    flag: "ðŸ‡¦ðŸ‡ª",
    authority: "DHA",
    requirement: "40 CME / 2yr",
    mandatory: "5 patient safety (online cap: 20)",
    reportUse: "Upload to Salama (salama.ae)",
  },
  {
    flag: "ðŸ‡¦ðŸ‡ª",
    authority: "DOH",
    requirement: "30â€“50 CPD / cycle",
    mandatory: "Patient safety required",
    reportUse: "Upload to DOH portal / Tamm",
  },
];

export default function CmeComplianceReportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
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
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-[#64748b] hover:text-[#1a56a0]">Sign in</Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors"
              >
                Start free â†’
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">

          {/* Hero */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-[#fdf4ff] border border-[#e9d5ff] text-[#7c3aed] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              âœ¦ Pro feature
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111] mb-4 leading-tight">
              CME compliance report â€” generate your renewal-ready portfolio PDF
            </h1>
            <p className="text-base text-[#475569] max-w-2xl leading-relaxed">
              Your licensing authority requires a complete CME/CPD portfolio at renewal. Hayya Med Pro
              generates this as a formatted PDF â€” credit totals, categories, certificates, and
              compliance status â€” ready to attach to your QCHP, SCFHS, DHA, or DOH renewal application.
            </p>
          </div>

          {/* Upgrade CTA â€” inline */}
          <div className="bg-[#1a56a0] rounded-2xl p-6 mb-12 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-semibold text-base mb-1">Generate your CME compliance report now</p>
              <p className="text-[rgba(255,255,255,0.75)] text-sm">Start free â†’ add your activities â†’ download your PDF report with Pro. 14-day trial â€” no credit card required.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <Link
                href="/register"
                className="text-center bg-white text-[#1a56a0] font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-[#f0f7ff] transition-colors whitespace-nowrap"
              >
                Start free trial â†’
              </Link>
              <Link
                href="/pricing"
                className="text-center border border-white/30 text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                See pricing
              </Link>
            </div>
          </div>

          {/* What the report includes */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">What your CME compliance report includes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REPORT_SECTIONS.map((s) => (
                <div key={s.number} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                  <span className="text-xs font-black text-[#1a56a0] bg-[#f0f7ff] px-2 py-0.5 rounded mb-3 inline-block">{s.number}</span>
                  <h3 className="text-sm font-semibold text-[#111] mb-2">{s.title}</h3>
                  <ul className="space-y-1.5">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-[#64748b]">
                        <span className="text-[#16a34a] mt-0.5 flex-shrink-0">âœ“</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Format by authority */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-2">
              Report format for each GCC authority
            </h2>
            <p className="text-sm text-[#64748b] mb-5">
              Hayya Med Pro automatically applies the correct requirements for your licensing authority when generating your report.
            </p>
            <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Authority</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide hidden sm:table-cell">Requirement</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide hidden md:table-cell">Mandatory</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Report used for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f8fafc]">
                  {AUTHORITY_FORMATS.map((a) => (
                    <tr key={a.authority}>
                      <td className="px-5 py-3 text-sm font-semibold text-[#111]">
                        <span className="mr-1.5">{a.flag}</span>{a.authority}
                      </td>
                      <td className="px-5 py-3 text-xs text-[#374151] hidden sm:table-cell">{a.requirement}</td>
                      <td className="px-5 py-3 text-xs text-[#374151] hidden md:table-cell">{a.mandatory}</td>
                      <td className="px-5 py-3 text-xs text-[#64748b]">{a.reportUse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">
              CME compliance report â€” frequently asked questions
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

          {/* Related links */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-[#111] mb-4">Related renewal guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: "/qchp-renewal", label: "ðŸ‡¶ðŸ‡¦ QCHP renewal guide", sub: "80 CPD credits, 2-year cycle" },
                { href: "/scfhs-renewal", label: "ðŸ‡¸ðŸ‡¦ SCFHS renewal guide", sub: "30â€“60 CME per year" },
                { href: "/dha-renewal", label: "ðŸ‡¦ðŸ‡ª DHA renewal guide", sub: "40 CME, 2-year cycle" },
                { href: "/doh-renewal", label: "ðŸ‡¦ðŸ‡ª DOH renewal guide", sub: "30â€“50 CPD per cycle" },
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
            <h2 className="text-2xl font-bold text-white mb-3">
              Start tracking. Download your report when you&apos;re ready.
            </h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Free plan: unlimited CME activity tracking, compliance dashboard, gap analysis.
              Pro plan: one-click PDF compliance report download, AI chat, certificate storage.
              Your 14-day Pro trial starts automatically when you complete onboarding.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-block bg-white text-[#1a56a0] font-semibold px-8 py-3 rounded-lg hover:bg-[#f0f4f8] transition-colors text-sm"
              >
                Start free â€” 14-day Pro trial â†’
              </Link>
              <Link
                href="/pricing"
                className="inline-block border border-[rgba(255,255,255,0.25)] text-white font-medium px-8 py-3 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors text-sm"
              >
                See Pro pricing
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-3 text-xs text-[#64748b] text-center leading-relaxed">
            Hayya Med Pro CME compliance reports support license renewal preparation. Always verify final
            requirements with QCHP, SCFHS, DHA, DOH, or your relevant GCC licensing authority. The PDF
            report is a summary of activities you have logged â€” accuracy of certificate data is your responsibility.
          </div>
        </main>
      </div>
    </>
  );
}

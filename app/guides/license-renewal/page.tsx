import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Healthcare License Renewal Guide 2026 — GCC & Global | Hayya Med Pro",
  description:
    "Complete healthcare license renewal guide for 2026. Step-by-step renewal process for Qatar QCHP, Saudi SCFHS, UAE DHA/DOH, Bahrain NHRA, Kuwait MOH, Oman OMSB, UK GMC, Australia AHPRA, and more.",
  keywords: [
    "healthcare license renewal 2026",
    "medical license renewal guide",
    "QCHP license renewal",
    "SCFHS license renewal",
    "DHA license renewal",
    "GCC license renewal",
    "doctor license renewal",
    "nurse license renewal",
    "pharmacist license renewal",
    "healthcare professional renewal",
  ],
  openGraph: {
    title: "Healthcare License Renewal Guide 2026",
    description:
      "Step-by-step renewal process for QCHP, SCFHS, DHA, DOH, NHRA, MOH, OMSB, GMC, AHPRA. Never miss a renewal deadline again.",
    url: `${BASE}/guides/license-renewal`,
    type: "article",
    images: [{ url: `${BASE}/api/og?title=Healthcare+License+Renewal+Guide+2026`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healthcare License Renewal Guide 2026",
    description: "Step-by-step renewal guide for GCC and global healthcare professionals.",
  },
  alternates: { canonical: `${BASE}/guides/license-renewal` },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Healthcare License Renewal Guide 2026",
  description: "Step-by-step guide to renewing your healthcare license across GCC and global authorities.",
  author: { "@type": "Organization", name: "Hayya Med Pro", url: BASE },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: BASE },
  datePublished: "2026-06-19",
  dateModified: "2026-06-19",
  mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/guides/license-renewal` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How early should I apply for healthcare license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You should apply for healthcare license renewal at least 60–90 days before your license expires. Most licensing authorities (QCHP, SCFHS, DHA, NHRA, OMSB) have processing times of 2–4 weeks, but can take longer during busy periods. Hayya Med Pro sends you automated alerts 90, 60, and 30 days before your renewal deadline so you never run out of time.",
      },
    },
    {
      "@type": "Question",
      name: "What documents do I need for healthcare license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most healthcare licensing authorities require: (1) CME/CPD compliance certificate showing required credits completed; (2) Certificates of attendance for individual activities; (3) Updated CV; (4) Valid professional indemnity insurance; (5) Existing license details. Hayya Med Pro generates the compliance report needed for step 1, saving you hours of manual paperwork.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if my healthcare license expires?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If your healthcare license expires, you are no longer legally permitted to practice until it is renewed. Reinstatement can be more complex than standard renewal and may require additional CME/CPD credits or assessments. Hayya Med Pro prevents this by tracking your compliance year-round and alerting you before your deadline.",
      },
    },
    {
      "@type": "Question",
      name: "Can I renew my license if I haven't completed all my CME/CPD credits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each licensing authority has its own policy on partial completion. Some authorities may grant a short extension; others will not renew until requirements are met. The safest approach is always to complete your required credits before your renewal deadline. Hayya Med Pro helps you identify your gap early — while there is still time to close it.",
      },
    },
  ],
};

const breadcrumbs = [
  { name: "Home", url: BASE },
  { name: "Guides", url: `${BASE}/guides` },
  { name: "License Renewal Guide", url: `${BASE}/guides/license-renewal` },
];

const AUTHORITIES = [
  { authority: "QCHP / DHP-AS", country: "Qatar", flag: "🇶🇦", credits: "80 CPD", cycle: "2 years", slug: "qatar" },
  { authority: "SCFHS", country: "Saudi Arabia", flag: "🇸🇦", credits: "40–60 CME", cycle: "1–3 years", slug: "saudi-arabia" },
  { authority: "DHA", country: "UAE (Dubai)", flag: "🇦🇪", credits: "40 CME", cycle: "2 years", slug: "uae" },
  { authority: "DOH", country: "UAE (Abu Dhabi)", flag: "🇦🇪", credits: "30–50 CPD", cycle: "2 years", slug: "uae" },
  { authority: "NHRA", country: "Bahrain", flag: "🇧🇭", credits: "40 CPD", cycle: "2 years", slug: "bahrain" },
  { authority: "MOH", country: "Kuwait", flag: "🇰🇼", credits: "30 CME", cycle: "1 year", slug: "kuwait" },
  { authority: "OMSB", country: "Oman", flag: "🇴🇲", credits: "40 CME", cycle: "2 years", slug: "oman" },
  { authority: "GMC / NMC", country: "United Kingdom", flag: "🇬🇧", credits: "50 CPD", cycle: "Annual", slug: "united-kingdom" },
  { authority: "AHPRA", country: "Australia", flag: "🇦🇺", credits: "Varies", cycle: "Annual", slug: "australia" },
  { authority: "NMC / PMDC", country: "India / Pakistan", flag: "🇮🇳", credits: "30 / 20", cycle: "5 / 1 year", slug: "india" },
];

export default function LicenseRenewalGuidePage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Nav */}
        <nav className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-[#1a56a0] text-lg">
            <span className="w-7 h-7 rounded-lg bg-[#1a56a0] flex items-center justify-center text-white text-sm font-black">H</span>
            Hayya Med Pro
          </Link>
          <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">
            Start free
          </Link>
        </nav>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-sm text-[#64748b]">
            <li><Link href="/" className="hover:text-[#1a56a0]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/guides" className="hover:text-[#1a56a0]">Guides</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#0f1f3d] font-medium">License Renewal</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <span className="text-xs font-bold text-[#d97706] bg-[#fef9c3] px-2.5 py-1 rounded-full uppercase tracking-wide">Global guide</span>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mt-4 mb-4 leading-tight max-w-2xl">
              Healthcare license renewal guide 2026 — every authority, every step
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-8">
              A missed renewal deadline means you can't practice. This guide covers the exact steps, documents,
              and CME/CPD requirements for renewing your healthcare license with every major authority globally.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my renewal — free
              </Link>
              <Link href="/gcc-cme-requirements" className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                GCC CME requirements →
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-14">

          {/* Universal steps */}
          <section aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">The 4-step renewal process — works for every authority</h2>
            <div className="space-y-4">
              {[
                { step: "01", title: "Complete your required CME/CPD credits", desc: "Log every qualifying activity throughout the year — don't leave it to the last minute. Hayya Med Pro tracks your progress automatically and shows you exactly how many credits you still need." },
                { step: "02", title: "Collect certificates of attendance", desc: "Save physical or digital certificates for every accredited activity. Without evidence, credits cannot be claimed. Hayya Med Pro lets you upload and attach certificates to each logged activity." },
                { step: "03", title: "Generate your compliance report", desc: "Hayya Med Pro produces a formatted compliance report listing all your activities, dates, credit values, and totals — ready to submit to any licensing authority." },
                { step: "04", title: "Submit to your licensing authority", desc: "Log into your authority's online portal (QCHP, Mumaris+, DHA portal, etc.) and submit your renewal application with your compliance report at least 60 days before expiry." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="bg-white border border-[#e2e8f0] rounded-xl p-6 flex items-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-[#1a56a0] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0f1f3d] mb-1">{title}</h3>
                    <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline alert */}
          <section className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#92400e] mb-4">Renewal timeline — start this early</h2>
            <div className="space-y-3">
              {[
                { days: "12 months before", action: "Ensure you're logging CME/CPD activities as you go — not at the end" },
                { days: "90 days before", action: "Check your credit total and identify any gap" },
                { days: "60 days before", action: "Complete remaining credits. Gather all certificates." },
                { days: "45 days before", action: "Generate compliance report from Hayya Med Pro" },
                { days: "30 days before", action: "Submit renewal application through official portal" },
                { days: "Expiry date", action: "License expired without renewal = cannot practice" },
              ].map(({ days, action }) => (
                <div key={days} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-[#d97706] w-36 flex-shrink-0">{days}</span>
                  <span className="text-sm text-[#92400e]">{action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Authority table */}
          <section aria-labelledby="authorities-heading">
            <h2 id="authorities-heading" className="text-2xl font-bold text-[#0f1f3d] mb-4">License renewal requirements by authority</h2>
            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    {["Authority", "Country", "Credits required", "Cycle", "Renewal guide"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {AUTHORITIES.map(({ authority, country, flag, credits, cycle, slug }) => (
                    <tr key={`${authority}-${country}`} className="hover:bg-[#f8fafc]">
                      <td className="px-5 py-3.5 font-semibold text-[#0f1f3d]">{authority}</td>
                      <td className="px-5 py-3.5 text-[#374151]">{flag} {country}</td>
                      <td className="px-5 py-3.5 text-[#374151]">{credits}</td>
                      <td className="px-5 py-3.5 text-[#374151]">{cycle}</td>
                      <td className="px-5 py-3.5">
                        <Link href={`/${slug}/license-renewal`} className="text-xs font-semibold text-[#1a56a0] hover:underline">
                          View guide →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">License renewal — frequently asked questions</h2>
            <div className="space-y-4">
              {faqLd.mainEntity.map((q) => (
                <div key={q.name} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                  <h3 className="font-semibold text-[#0f1f3d] mb-2">{q.name}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[#1a56a0] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Never miss a license renewal again</h2>
            <p className="text-white/75 mb-6 max-w-md mx-auto text-sm leading-relaxed">
              Hayya Med Pro tracks your CME/CPD compliance year-round and alerts you 90, 60, and 30 days before every renewal deadline — for every country where you hold a license.
            </p>
            <Link href="/register" className="inline-block bg-white text-[#1a56a0] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
              Start free — 3 minutes
            </Link>
          </section>

          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports CME/CPD tracking and licensing readiness. It does not issue licenses.
            Users must verify final requirements with their relevant licensing authority.
          </p>
        </main>
      </div>
    </>
  );
}

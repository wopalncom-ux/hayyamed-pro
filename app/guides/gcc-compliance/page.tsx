import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "GCC Healthcare Compliance Guide 2026 — CME, CPD & Licensing for All 7 GCC Countries | Hayya Med Pro",
  description:
    "Complete guide to healthcare professional compliance across Qatar, Saudi Arabia, UAE, Bahrain, Kuwait, Oman, and Bahrain. CME/CPD requirements, license renewal, QCHP, SCFHS, DHA, DOH, NHRA, MOH, OMSB — all in one place.",
  keywords: [
    "GCC healthcare compliance",
    "GCC CME CPD requirements",
    "healthcare professional compliance GCC",
    "QCHP SCFHS DHA compliance",
    "GCC medical license",
    "healthcare compliance Qatar Saudi UAE",
    "GCC doctor compliance",
    "GCC nurse compliance",
    "Gulf healthcare license renewal",
    "GCC healthcare professional guide",
  ],
  openGraph: {
    title: "GCC Healthcare Compliance Guide 2026 — All 7 Countries",
    description:
      "Qatar · Saudi Arabia · UAE · Bahrain · Kuwait · Oman — CME credits, renewal cycles, governing authorities, and compliance tips for all GCC healthcare professionals.",
    url: `${BASE}/guides/gcc-compliance`,
    type: "article",
    images: [{ url: `${BASE}/api/og?title=GCC+Healthcare+Compliance+Guide+2026`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GCC Healthcare Compliance Guide 2026 — All 7 Countries",
    description:
      "CME/CPD requirements, authorities, renewal cycles for all 7 GCC countries — one complete guide.",
  },
  alternates: { canonical: `${BASE}/guides/gcc-compliance` },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "GCC Healthcare Compliance Guide 2026",
  description: "Complete guide to CME, CPD and license renewal requirements across all 7 GCC countries.",
  author: { "@type": "Organization", name: "Hayya Med Pro", url: BASE },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: BASE },
  datePublished: "2026-06-19",
  dateModified: "2026-06-19",
  mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/guides/gcc-compliance` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do CME credits from one GCC country count in another?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GCC countries each have separate licensing authorities and each requires you to maintain compliance independently. CME/CPD activities may be recognised across countries if accredited by a mutual authority, but you must always verify with the specific licensing body in each country where you hold a license. Hayya Med Pro allows you to manage multiple country licenses in one dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "Which GCC country has the most CME credits required?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Qatar requires the most CME/CPD credits in the GCC — 80 credits per 2-year cycle (40 per year minimum). Saudi Arabia (SCFHS) requires 40-60 credits per 1-3 year cycle. UAE (DHA) requires 40 credits per 2 years. Kuwait requires 30 credits annually. Bahrain and Oman each require 40 credits per 2-year cycle.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track all my GCC country licenses in one place?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro is designed specifically for healthcare professionals who hold licenses in multiple GCC countries. You can track compliance against Qatar QCHP, Saudi SCFHS, UAE DHA/DOH, Bahrain NHRA, Kuwait MOH, and Oman OMSB requirements simultaneously in a single dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between CME and CPD in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CME (Continuing Medical Education) and CPD (Continuing Professional Development) refer to the same concept — ongoing professional education for healthcare professionals — but different GCC countries use different terminology. Qatar uses CPD. Saudi Arabia uses CME. UAE authorities use both CME and CPD. Oman and Kuwait use CME. Bahrain uses CPD. Hayya Med Pro uses both terms interchangeably and tracks whichever applies to your specific country's requirements.",
      },
    },
  ],
};

const breadcrumbs = [
  { name: "Home", url: BASE },
  { name: "Guides", url: `${BASE}/guides` },
  { name: "GCC Healthcare Compliance Guide", url: `${BASE}/guides/gcc-compliance` },
];

const GCC_COUNTRIES = [
  {
    flag: "🇶🇦", name: "Qatar", slug: "qatar",
    authority: "QCHP / DHP-AS", terminology: "CPD",
    credits: "80", cycle: "2 years",
    professions: ["Physicians", "Nurses", "Pharmacists", "Allied Health"],
    tip: "40 credits minimum per year. Category A (accredited education) is most valued.",
    color: "#8b0000",
  },
  {
    flag: "🇸🇦", name: "Saudi Arabia", slug: "saudi-arabia",
    authority: "SCFHS", terminology: "CME",
    credits: "40–60", cycle: "1–3 years",
    professions: ["Physicians", "Nurses", "Pharmacists", "Dentists", "Allied Health"],
    tip: "Requirements vary by specialty and license type. Verify with SCFHS Mumaris+ portal.",
    color: "#14532d",
  },
  {
    flag: "🇦🇪", name: "UAE (Dubai / Abu Dhabi)", slug: "uae",
    authority: "DHA / DOH", terminology: "CME/CPD",
    credits: "40 (DHA) / 30–50 (DOH)", cycle: "2 years",
    professions: ["Physicians", "Nurses", "Pharmacists", "Dentists"],
    tip: "Dubai (DHA) and Abu Dhabi (DOH) have separate portals and requirements. Verify for your emirate.",
    color: "#1c1c3b",
  },
  {
    flag: "🇧🇭", name: "Bahrain", slug: "bahrain",
    authority: "NHRA", terminology: "CPD",
    credits: "40", cycle: "2 years",
    professions: ["Physicians", "Nurses", "Pharmacists", "Allied Health"],
    tip: "NHRA accepts both local and international accredited CPD activities.",
    color: "#7f1d1d",
  },
  {
    flag: "🇰🇼", name: "Kuwait", slug: "kuwait",
    authority: "MOH Kuwait", terminology: "CME",
    credits: "30", cycle: "1 year",
    professions: ["Physicians", "Nurses", "Dentists"],
    tip: "Annual cycle means compliance is reset each year. Stay on top of it monthly.",
    color: "#14532d",
  },
  {
    flag: "🇴🇲", name: "Oman", slug: "oman",
    authority: "OMSB", terminology: "CME",
    credits: "40", cycle: "2 years",
    professions: ["Physicians", "Nurses", "Pharmacists", "Dentists", "Allied Health"],
    tip: "OMSB requires evidence of all CME activities. Certificates must be kept for 5 years.",
    color: "#7c2d12",
  },
];

export default function GccCompliancePage() {
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
          <div className="flex items-center gap-4">
            <Link href="/gcc-cme-requirements" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">GCC CME Guide</Link>
            <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">Start free</Link>
          </div>
        </nav>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-sm text-[#64748b] flex-wrap">
            <li><Link href="/" className="hover:text-[#1a56a0]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/guides" className="hover:text-[#1a56a0]">Guides</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#0f1f3d] font-medium">GCC Healthcare Compliance</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-14">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {GCC_COUNTRIES.map(c => (
                <span key={c.slug} className="text-2xl" aria-label={c.name}>{c.flag}</span>
              ))}
              <span className="text-xs font-bold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full uppercase tracking-wide ml-2">GCC Region</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-4 leading-tight max-w-3xl">
              GCC healthcare compliance guide 2026 — CME, CPD &amp; license renewal for all 7 countries
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-8">
              Everything a GCC healthcare professional needs to stay compliant — credit requirements, renewal cycles, governing authorities,
              and how to manage multiple licenses across Qatar, Saudi Arabia, UAE, Bahrain, Kuwait, and Oman.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track all my GCC licenses — free
              </Link>
              <Link href="/gcc-cme-requirements" className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                GCC CME comparison table →
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-14">

          {/* Country cards */}
          <section aria-labelledby="countries-heading">
            <h2 id="countries-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">CME / CPD requirements by GCC country</h2>
            <div className="space-y-5">
              {GCC_COUNTRIES.map(({ flag, name, slug, authority, terminology, credits, cycle, professions, tip }) => (
                <div key={slug} className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-[#f1f5f9]">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl" aria-hidden="true">{flag}</span>
                        <div>
                          <h3 className="font-bold text-[#0f1f3d] text-lg">{name}</h3>
                          <p className="text-sm text-[#64748b]">{authority} · {terminology}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xl font-bold text-[#1a56a0]">{credits}</p>
                          <p className="text-xs text-[#64748b]">credits / {cycle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 flex items-start justify-between gap-6 flex-wrap">
                    <div>
                      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2">Professions covered</p>
                      <div className="flex flex-wrap gap-1.5">
                        {professions.map(p => (
                          <span key={p} className="text-xs px-2.5 py-1 bg-[#f8fafc] border border-[#e2e8f0] text-[#374151] rounded-full">{p}</span>
                        ))}
                      </div>
                      <p className="text-xs text-[#64748b] mt-3 italic">Tip: {tip}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 mt-2">
                      <Link href={`/${slug}/cme`} className="text-xs font-semibold text-[#1a56a0] border border-[#c7daf7] bg-white px-3 py-1.5 rounded-lg hover:bg-[#f0f7ff] transition-colors">
                        {terminology} guide
                      </Link>
                      <Link href={`/${slug}/license-renewal`} className="text-xs font-semibold text-[#1a56a0] border border-[#c7daf7] bg-white px-3 py-1.5 rounded-lg hover:bg-[#f0f7ff] transition-colors">
                        Renewal guide
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Platform section */}
          <section className="bg-[#f0f7ff] border border-[#c7daf7] rounded-2xl p-8">
            <div className="grid sm:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-xl font-bold text-[#0f1f3d] mb-3">Manage all your GCC licenses in one place</h2>
                <p className="text-sm text-[#64748b] leading-relaxed mb-5">
                  Many GCC healthcare professionals hold licenses in multiple countries. Hayya Med Pro lets you track Qatar CPD,
                  Saudi CME, UAE DHA/DOH compliance, and more — all from a single dashboard.
                </p>
                <Link href="/register" className="inline-block bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors">
                  Start free — 3 minutes
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  "Tracks all 7 GCC countries simultaneously",
                  "Separate compliance ring per country",
                  "Alerts before each renewal deadline",
                  "Download compliance PDF per authority",
                  "Upload certificates as evidence",
                  "AI gap analysis per country (Pro)",
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5 text-sm text-[#374151]">
                    <span className="w-5 h-5 rounded-full bg-[#dcfce7] flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3" aria-hidden="true">
                        <path d="M2 6l2.5 2.5 5.5-5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">GCC healthcare compliance — frequently asked questions</h2>
            <div className="space-y-4">
              {faqLd.mainEntity.map((q) => (
                <div key={q.name} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                  <h3 className="font-semibold text-[#0f1f3d] mb-2">{q.name}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related guides */}
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">Related resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "Qatar CPD Guide 2026", href: "/guides/qatar-cme-guide", desc: "Full QCHP CPD guide" },
                { title: "GCC CME Requirements", href: "/gcc-cme-requirements", desc: "Side-by-side comparison table" },
                { title: "License Renewal Guide", href: "/guides/license-renewal", desc: "Renewal steps by country" },
                { title: "QCHP Tracker", href: "/qchp", desc: "Track Qatar QCHP compliance" },
                { title: "SCFHS CME Tracker", href: "/scfhs", desc: "Saudi Arabia SCFHS compliance" },
                { title: "DHA CPD Guide", href: "/uae/cme", desc: "UAE Dubai DHA compliance" },
              ].map(({ title, href, desc }) => (
                <Link key={href} href={href} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                  <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">{title}</p>
                  <p className="text-xs text-[#64748b] mt-1">{desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports CME/CPD tracking and licensing readiness for GCC healthcare professionals.
            It does not issue licenses. Users must verify final requirements with their respective licensing authority
            (QCHP, SCFHS, DHA, DOH, NHRA, MOH Kuwait, OMSB).
          </p>
        </main>
      </div>
    </>
  );
}

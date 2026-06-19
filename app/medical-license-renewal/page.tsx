import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Medical License Renewal 2026 — CME Requirements & Checklist | Hayya Med Pro",
  description:
    "Medical license renewal guide for GCC, UK, and global healthcare professionals. QCHP renewal (Qatar), SCFHS renewal (Saudi), DHA renewal (UAE), GMC revalidation (UK). CME requirements and step-by-step checklist.",
  keywords: [
    "medical license renewal",
    "medical licence renewal",
    "healthcare license renewal",
    "medical license renewal requirements",
    "CME for license renewal",
    "medical license renewal GCC",
    "QCHP license renewal",
    "SCFHS license renewal",
    "DHA license renewal",
    "GMC revalidation",
    "how to renew medical license",
    "medical license renewal checklist",
    "doctor license renewal",
    "nurse license renewal",
    "pharmacist license renewal",
  ],
  openGraph: {
    title: "Medical License Renewal 2026 — CME Requirements & Checklist",
    description: "Step-by-step medical license renewal guide for QCHP, SCFHS, DHA, GMC and more — including CME requirements.",
    url: `${BASE}/medical-license-renewal`,
    type: "article",
    images: [{ url: `${BASE}/api/og?title=Medical+License+Renewal+2026+%E2%80%94+Guide+%26+Checklist`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Medical License Renewal 2026",
    description: "QCHP, SCFHS, DHA, GMC renewal checklists — CME requirements and step-by-step guide.",
  },
  alternates: { canonical: `${BASE}/medical-license-renewal` },
};

const breadcrumbs = [
  { name: "Home", url: BASE },
  { name: "Medical License Renewal", url: `${BASE}/medical-license-renewal` },
];

const AUTHORITIES = [
  {
    flag: "🇶🇦",
    country: "Qatar",
    authority: "QCHP / DHP-AS",
    slug: "qchp-renewal",
    cycle: "2 years",
    cme: "80 CPD points",
    fee: "Yes — renewal fee applies",
    steps: ["Complete 80 CPD points over 2-year cycle", "Submit CPD portfolio via QCHP portal", "Verify all certificates uploaded", "Pay renewal fee", "Receive renewed licence"],
  },
  {
    flag: "🇸🇦",
    country: "Saudi Arabia",
    authority: "SCFHS",
    slug: "scfhs-renewal",
    cycle: "1–3 years (profession-specific)",
    cme: "40–60 CME credits/year",
    fee: "Yes",
    steps: ["Accumulate required CME credits", "Ensure minimum structured CME (Category A)", "Log into SCFHS portal", "Submit CME certificates", "Pay renewal fee and receive licence"],
  },
  {
    flag: "🇦🇪",
    country: "UAE (Dubai)",
    authority: "DHA",
    slug: "dha-renewal",
    cycle: "2 years",
    cme: "40 CME credits",
    fee: "Yes",
    steps: ["Complete 40 CME credits over 2-year cycle", "Maintain active employment in Dubai", "Submit through Sheryan portal", "Upload CME certificates", "Pay licence renewal fee"],
  },
  {
    flag: "🇦🇪",
    country: "UAE (Abu Dhabi)",
    authority: "DOH",
    slug: "doh-renewal",
    cycle: "2 years",
    cme: "30–50 CPD credits",
    fee: "Yes",
    steps: ["Complete CPD requirements for your profession", "Submit through DOH Health Professional Portal", "Upload supporting certificates", "Pay renewal fee"],
  },
  {
    flag: "🇰🇼",
    country: "Kuwait",
    authority: "MOH",
    slug: "moh-kuwait-renewal",
    cycle: "1 year",
    cme: "30 CME credits",
    fee: "Yes",
    steps: ["Complete 30 CME credits in 12 months", "Submit CME proof to MOH", "Pass renewal assessment if required", "Pay annual renewal fee"],
  },
  {
    flag: "🇧🇭",
    country: "Bahrain",
    authority: "NHRA",
    slug: "nhra-renewal",
    cycle: "2 years",
    cme: "40 CPD credits",
    fee: "Yes",
    steps: ["Accumulate 40 CPD credits", "Submit through NHRA Professionals portal", "Provide proof of active practice", "Pay renewal fee"],
  },
  {
    flag: "🇴🇲",
    country: "Oman",
    authority: "OMSB",
    slug: "omsb-renewal",
    cycle: "2 years",
    cme: "40 CME credits",
    fee: "Yes",
    steps: ["Complete 40 CME credits", "Submit CME documentation to OMSB", "Confirm active registration status", "Pay renewal fee"],
  },
  {
    flag: "🇬🇧",
    country: "United Kingdom",
    authority: "GMC",
    slug: "united-kingdom",
    cycle: "Annual appraisal + 5-yr revalidation",
    cme: "50 CPD credits/year",
    fee: "Annual registration fee",
    steps: ["Complete annual appraisal with a designated appraiser", "Collect supporting information (CPD, QI, SEA, patient feedback)", "Build a portfolio over 5 years", "Revalidate with the GMC every 5 years"],
  },
];

const COMMON_REASONS_REJECTED = [
  { icon: "📋", title: "CME credit shortfall", desc: "Most rejections happen because the professional didn't meet the minimum CME requirement before the renewal deadline. Track credits continuously." },
  { icon: "🗂️", title: "Missing certificate documentation", desc: "Certificates uploaded without correct issuing authority details, dates, or accreditation codes are routinely rejected. Keep originals organised." },
  { icon: "⏰", title: "Late submission", desc: "GCC authorities often require renewal submissions 30–60 days before expiry. Many professionals miss this window." },
  { icon: "💳", title: "Unpaid renewal fees", desc: "Even with full CME compliance, an unpaid renewal fee will block issuance. Pay early to avoid processing delays." },
  { icon: "🔗", title: "Employment status mismatch", desc: "Some authorities (e.g., DHA) require active employment in their jurisdiction. Gaps in employment records can cause delays." },
];

const FAQ = [
  {
    q: "When should I start the medical license renewal process?",
    a: "Start at least 3 months before your licence expiry date. Most GCC authorities recommend submitting renewal applications 60 days before expiry. Hayya Med Pro sends reminders at 90, 60, and 30 days before your renewal date.",
  },
  {
    q: "What CME credits do I need to renew my medical licence?",
    a: "It depends on your licensing authority. Qatar QCHP requires 80 CPD credits over 2 years. Saudi SCFHS requires 40–60 CME credits per year. UAE DHA requires 40 CME credits per 2-year cycle. UK GMC requires 50 CPD credits per year plus annual appraisal. Hayya Med Pro automatically tracks the right target for your authority.",
  },
  {
    q: "Can I renew my licence if I have less than the required CME credits?",
    a: "Generally no — most licensing authorities will not issue a renewal without proof that CME requirements are met. Some allow a grace period or a deficiency plan for borderline cases. Avoid this situation entirely by tracking your CME year-round.",
  },
  {
    q: "What happens if my medical licence expires?",
    a: "Practising on an expired medical licence is illegal in all GCC countries and the UK. You may face immediate practice suspension, criminal liability for continuing to work, and additional requirements to reinstate (such as a competence assessment). If your licence is close to expiry, prioritise renewal immediately.",
  },
  {
    q: "Can CME activities from one country count for renewal in another?",
    a: "Usually not automatically — each authority has its own list of approved accreditors. However, CME activities accredited by internationally recognised bodies (AMA PRA, RCPCH, Royal College equivalents) may be accepted by multiple authorities. Confirm with your specific authority before relying on cross-border credits.",
  },
  {
    q: "How do I track my CME for licence renewal?",
    a: "Hayya Med Pro is designed specifically for this. It tracks CME credits against your licensing authority's requirements, alerts you when approaching your renewal date, and generates a PDF compliance report in the format required by QCHP, SCFHS, DHA, and other GCC authorities.",
  },
];

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Medical License Renewal 2026 — CME Requirements & Checklist",
  description: "Step-by-step medical license renewal guide for GCC, UK, and global healthcare professionals.",
  datePublished: "2026-06-19",
  dateModified: "2026-06-19",
  author: { "@type": "Organization", name: "Hayya Med Pro", url: BASE },
  publisher: { "@type": "Organization", name: "Hayya Med AI", url: BASE },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/medical-license-renewal` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function MedicalLicenseRenewalPage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="min-h-screen bg-[#f8fafc]">
        <nav className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-[#1a56a0] text-lg">
            <span className="w-7 h-7 rounded-lg bg-[#1a56a0] flex items-center justify-center text-white text-sm font-black">H</span>
            Hayya Med Pro
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/cme-requirements" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">CME Requirements</Link>
            <Link href="/gcc-cme-requirements" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">GCC Guide</Link>
            <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">Track CME free</Link>
          </div>
        </nav>

        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full uppercase tracking-wide">2026 Guide</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-5 leading-tight max-w-3xl">
              Medical license renewal — CME requirements and checklist for every authority
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-6">
              Medical licence renewal requires proof of completed CME or CPD credits. This guide covers renewal requirements
              for healthcare professionals across GCC countries, the UK, and beyond — with step-by-step checklists for each authority.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my CME — free
              </Link>
              <Link href="#checklist" className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                Jump to checklists →
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-14">

          {/* Quick overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { n: "7", label: "GCC authorities covered" },
              { n: "30–80", label: "CME credits required" },
              { n: "90 days", label: "Recommended lead time" },
              { n: "Free", label: "CME tracker to get started" },
            ].map(({ n, label }) => (
              <div key={label} className="bg-white border border-[#e2e8f0] rounded-xl p-5 text-center">
                <p className="text-3xl font-black text-[#1a56a0] mb-1">{n}</p>
                <p className="text-xs text-[#64748b]">{label}</p>
              </div>
            ))}
          </div>

          {/* Authority checklists */}
          <section id="checklist" aria-labelledby="checklist-heading">
            <h2 id="checklist-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">Renewal checklist by licensing authority</h2>
            <div className="space-y-6">
              {AUTHORITIES.map(({ flag, country, authority, slug, cycle, cme, fee, steps }) => (
                <div key={`${country}-${authority}`} className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
                  <div className="bg-[#0f1f3d] px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">{flag}</span>
                      <div>
                        <h3 className="text-base font-bold text-white">{country}</h3>
                        <p className="text-xs text-white/60">{authority}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/70 flex-wrap">
                      <span>🔄 {cycle}</span>
                      <span>📋 {cme}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <ol className="space-y-2.5 mb-4">
                      {steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[#374151]">
                          <span className="w-5 h-5 rounded-full bg-[#1a56a0] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    <div className="flex items-center justify-between flex-wrap gap-2 pt-4 border-t border-[#f1f5f9]">
                      <p className="text-xs text-[#64748b]">Renewal fee: {fee}</p>
                      <Link href={`/${slug}`} className="text-sm font-semibold text-[#1a56a0] hover:underline">
                        Full {authority} guide →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why renewals fail */}
          <section aria-labelledby="failures-heading">
            <h2 id="failures-heading" className="text-2xl font-bold text-[#0f1f3d] mb-5">Why medical licence renewals are rejected</h2>
            <p className="text-sm text-[#64748b] mb-5">Understanding common rejection reasons helps you avoid them with proper preparation.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COMMON_REASONS_REJECTED.map(({ icon, title, desc }) => (
                <div key={title} className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex items-start gap-4">
                  <span className="text-2xl flex-shrink-0" aria-hidden="true">{icon}</span>
                  <div>
                    <h3 className="font-semibold text-[#0f1f3d] text-sm mb-1">{title}</h3>
                    <p className="text-xs text-[#64748b] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Platform CTA */}
          <section className="bg-[#f0f7ff] border border-[#c7daf7] rounded-2xl p-8">
            <div className="flex items-start gap-5 flex-wrap">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-[#0f1f3d] mb-3">Never face a renewal problem with Hayya Med Pro</h2>
                <p className="text-sm text-[#64748b] leading-relaxed mb-5 max-w-2xl">
                  Hayya Med Pro automatically tracks your CME and CPD credits against the correct requirements for your licensing authority.
                  It tells you exactly how many credits you have, how many you need, and sends deadline reminders so you are always renewal-ready.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                  {[
                    "Tracks CME for QCHP, SCFHS, DHA, DOH, NHRA, OMSB, MOH Kuwait",
                    "Sends reminders 90, 60, and 30 days before renewal",
                    "Generates PDF compliance report for submission",
                    "Stores certificates securely — accessible anytime",
                    "AI gap analysis shows exactly what CME you need",
                    "Multi-country wallet for dual-licensed professionals",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-[#374151]">
                      <svg className="w-4 h-4 text-[#1a56a0] flex-shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors">
                    Start tracking free
                  </Link>
                  <Link href="/pricing" className="inline-flex items-center gap-2 border border-[#1a56a0]/30 text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                    View Pro features →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">Medical licence renewal — frequently asked questions</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                  <h3 className="font-semibold text-[#0f1f3d] mb-2">{f.q}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related guides */}
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">Related guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { title: "CME Requirements Guide", desc: "Credits needed by country", href: "/cme-requirements" },
                { title: "CPD Requirements Guide", desc: "UK, Australia, GCC CPD", href: "/cpd-requirements" },
                { title: "QCHP Renewal", desc: "Qatar 80 CPD / 2 yr", href: "/qchp-renewal" },
                { title: "SCFHS Renewal", desc: "Saudi Arabia CME renewal", href: "/scfhs-renewal" },
                { title: "DHA Renewal", desc: "UAE Dubai CME renewal", href: "/dha-renewal" },
                { title: "GCC CME Comparison", desc: "All 7 GCC authorities", href: "/gcc-cme-requirements" },
                { title: "Doctors CME Guide", desc: "By profession", href: "/doctors" },
                { title: "Nurses CPD Guide", desc: "Nursing-specific CPD", href: "/nurses" },
                { title: "License Renewal Process", desc: "Step-by-step walkthrough", href: "/guides/license-renewal" },
              ].map(({ title, desc, href }) => (
                <Link key={href} href={href} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                  <p className="font-semibold text-[#0f1f3d] text-sm group-hover:text-[#1a56a0]">{title}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">{desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-[#1a56a0] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Start renewal-ready today</h2>
            <p className="text-white/75 mb-6 max-w-md mx-auto text-sm leading-relaxed">
              Track every CME activity, set renewal reminders, and generate authority-ready PDF reports.
              Free to start — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="inline-block bg-white text-[#1a56a0] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                Create free account
              </Link>
              <Link href="/demo" className="inline-block border border-white/30 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors">
                See how it works →
              </Link>
            </div>
          </section>

          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licences and does not replace
            official licensing authorities. Users must verify final requirements directly with QCHP, SCFHS, DHA, GMC, or their relevant authority.
          </p>
        </main>
      </div>
    </>
  );
}

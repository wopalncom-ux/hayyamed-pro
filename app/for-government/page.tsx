import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CME Platform for Government Health Authorities — White-Label Licensing | Hayya Med Pro",
  description:
    "License the complete CME/CPD compliance platform to your health authority. White-label branding, GCC data residency, API-first architecture, and full authority rules engine. Built for QCHP, SCFHS, DHA, MOH, NHRA, and OMSB scale.",
  keywords: [
    "government CME platform GCC",
    "white-label CME system health authority",
    "QCHP CME platform licensing",
    "national CPD platform GCC",
    "health authority CME software",
    "MOH CME tracking system",
    "digital health compliance platform government",
    "CME authority platform Qatar",
    "national CME system licensing",
    "healthcare workforce compliance government",
  ],
  openGraph: {
    title: "CME Platform for Government Health Authorities — White-Label Licensing",
    description: "License a complete, GCC-ready CME/CPD compliance platform to your health authority. Authority-branded, data-sovereign, API-first.",
    url: `${APP_URL}/for-government`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=CME+Platform+for+Health+Authorities&s=White-Label+%C2%B7+GCC+Data+Residency+%C2%B7+API-First&a=%F0%9F%8F%9B%EF%B8%8F+Government&k=Enterprise+Licensing`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "CME Platform for Government Health Authorities", description: "White-label CME/CPD compliance platform for GCC health authorities. Data-sovereign, API-first, authority-branded." },
  alternates: { canonical: `${APP_URL}/for-government` },
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Hayya Med Pro — Government Authority Licensing",
  description: "White-label CME/CPD compliance platform licensing for GCC government health authorities. Includes branded portal, national rules engine, API access, and GCC data residency.",
  provider: { "@type": "Organization", name: "Hayya Med AI", url: APP_URL },
  areaServed: ["QA", "SA", "AE", "KW", "BH", "OM"],
  serviceType: "Healthcare Compliance Software Licensing",
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can a health authority white-label Hayya Med Pro under their own brand?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. The Government Authority License includes full white-label branding: your authority's name, logo, domain, and color system applied to every screen. Healthcare professionals see a platform that looks and feels like your authority's official compliance portal — not a third-party app." },
    },
    {
      "@type": "Question",
      name: "Does the platform support GCC data residency requirements?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Hayya Med Pro is deployed on Google Cloud Platform in the me-central1 region (Doha, Qatar). All healthcare professional data is stored in Qatar by default. For Saudi Arabia deployments, data can be routed to the GCP me-west1 (Dammam) region. We support Qatar PDPL (Law No. 13 of 2016) and Saudi data localization requirements." },
    },
    {
      "@type": "Question",
      name: "Can the platform integrate with existing health authority IT systems?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. The platform exposes a versioned REST API (v1/v2) that supports professional registry integration, real-time CME status queries, bulk credential exports, and webhook-based event notifications. We support standard HRIS/HR system integration patterns and SSO via SAML 2.0 and OAuth 2.0." },
    },
    {
      "@type": "Question",
      name: "How are country-specific CME rules managed and updated?",
      acceptedAnswer: { "@type": "Answer", text: "All compliance rules — credit requirements, cycle lengths, category caps, accreditor lists, profession-specific rules — are stored in a configuration database, not hardcoded. Authority administrators update rules via an admin panel without a code deployment. Rule changes take effect immediately and historical compliance is calculated against rules active at the relevant date." },
    },
    {
      "@type": "Question",
      name: "What security certifications does the platform target?",
      acceptedAnswer: { "@type": "Answer", text: "The platform is built to SOC 2 Type II standards (target Year 2 certification). All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We maintain append-only audit logs with 7-year retention, conduct annual VAPT, and follow OWASP Top 10 security guidelines. ISO 27001 certification is targeted for Year 3." },
    },
    {
      "@type": "Question",
      name: "What is the pricing model for government authority licensing?",
      acceptedAnswer: { "@type": "Answer", text: "Government authority licensing is priced as an annual platform fee based on the number of licensed healthcare professionals in your registry — typically structured as a per-professional fee with a minimum commitment. Enterprise support, custom integrations, and training are included. Contact us to request a proposal tailored to your authority's scale and requirements." },
    },
  ],
};

const CAPABILITIES = [
  {
    icon: "🏛️",
    title: "Full white-label branding",
    body: "Your authority's name, logo, domain, and visual identity on every screen. Healthcare professionals interact with your branded portal — not a third-party app.",
  },
  {
    icon: "🗺️",
    title: "Authority-specific rules engine",
    body: "Every compliance rule — credit requirements, cycle lengths, category caps, profession rules, accreditor lists — configured in your admin panel. No code deployment needed to update rules.",
  },
  {
    icon: "🔌",
    title: "API-first integration",
    body: "REST API (v1/v2) for professional registry sync, real-time CME status queries, bulk exports, and webhook notifications. SAML 2.0 and OAuth 2.0 SSO supported.",
  },
  {
    icon: "🛡️",
    title: "GCC data residency",
    body: "Deployed on GCP me-central1 (Doha, Qatar). Saudi deployments on GCP me-west1 (Dammam). Qatar PDPL and Saudi data localization compliant.",
  },
  {
    icon: "📊",
    title: "National compliance dashboard",
    body: "Authority-level analytics: compliance rates by profession, specialty, region, and employer. Identify at-risk professional cohorts before renewal deadlines.",
  },
  {
    icon: "📋",
    title: "Automated renewal workflows",
    body: "Rule-based renewal eligibility checks, automated professional notifications, and digital certificate submission — reducing authority staff workload at renewal periods.",
  },
  {
    icon: "🏥",
    title: "Employer and hospital integration",
    body: "Hospitals and healthcare organizations can view their staff's compliance status (with professional consent). Supports JCI/CBAHI audit evidence generation.",
  },
  {
    icon: "🤖",
    title: "AI-assisted compliance analysis",
    body: "Optional AI features: CME gap analysis, activity classification assistance, and certificate OCR. All AI calls are anonymized, audited, and fully explainable.",
  },
];

const TIERS = [
  {
    name: "Authority License",
    target: "Single licensing authority",
    features: [
      "White-label portal (your brand)",
      "Authority rules engine (your rules)",
      "Professional registry integration",
      "Compliance reporting dashboard",
      "Annual VAPT and security review",
      "Dedicated implementation team",
    ],
    cta: "Request proposal →",
    href: "/request-demo",
  },
  {
    name: "National Platform",
    target: "Ministry of Health / national system",
    highlight: true,
    features: [
      "Everything in Authority License",
      "Multi-authority management",
      "Cross-profession compliance analytics",
      "API access for all government systems",
      "HRIS / HR system connectors",
      "Custom reporting for leadership",
      "24/7 enterprise support SLA",
    ],
    cta: "Request proposal →",
    href: "/request-demo",
  },
  {
    name: "Government Cloud",
    target: "Full national deployment",
    features: [
      "Everything in National Platform",
      "Dedicated GCP tenant (your region)",
      "Custom data residency configuration",
      "SSO across all government portals",
      "SOC 2 Type II audit access",
      "On-site implementation and training",
      "Joint press release and endorsement",
    ],
    cta: "Request proposal →",
    href: "/request-demo",
  },
];

const AUTHORITIES = [
  { flag: "🇶🇦", name: "QCHP / DHP-AS", country: "Qatar", professionals: "80,000+", note: "Official national CME authority" },
  { flag: "🇸🇦", name: "SCFHS", country: "Saudi Arabia", professionals: "700,000+", note: "Largest GCC authority by volume" },
  { flag: "🇦🇪", name: "DHA", country: "UAE (Dubai)", professionals: "120,000+", note: "Dubai healthcare licensing" },
  { flag: "🇦🇪", name: "DOH", country: "UAE (Abu Dhabi)", professionals: "90,000+", note: "Abu Dhabi healthcare licensing" },
  { flag: "🇰🇼", name: "MOH Kuwait", country: "Kuwait", professionals: "40,000+", note: "National health workforce" },
  { flag: "🇧🇭", name: "NHRA", country: "Bahrain", professionals: "20,000+", note: "National health regulatory" },
  { flag: "🇴🇲", name: "OMSB", country: "Oman", professionals: "35,000+", note: "Medical specialty board" },
];

export default function ForGovernmentPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center"><span className="text-white text-sm font-bold">H</span></div>
            <span className="font-bold text-sm text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/for-hospitals" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block transition-colors">For Hospitals</Link>
            <Link href="/employers" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block transition-colors">For Employers</Link>
            <Link href="/request-demo" className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors">Request proposal →</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-[#0f1f3d] py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.15)] text-[#93c5fd] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              🏛️ Government Authority Licensing · White-Label Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
              License the complete CME platform<br className="hidden lg:block" /> to your health authority
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-10 leading-relaxed">
              A production-ready, GCC-data-sovereign, API-first CME compliance platform — white-labeled under your authority's brand. From 20,000 to 700,000+ licensed professionals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/request-demo" className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-bold text-sm px-8 py-4 rounded-xl hover:bg-[#f0f4f8] transition-colors">
                Request a proposal →
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.25)] text-white font-medium text-sm px-8 py-4 rounded-xl hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                Schedule a call
              </Link>
            </div>
            <p className="text-xs text-[#475569] mt-5">All government engagements are signed under a formal MSA and DPA before any data access.</p>
          </div>
        </section>

        {/* GCC Authorities */}
        <section className="py-14 bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-xl font-bold text-[#111] mb-2 text-center">Built for the scale of every GCC authority</h2>
            <p className="text-sm text-[#64748b] text-center mb-8">The rules engine is already configured for all 7 GCC licensing authorities. White-label your instance in weeks, not years.</p>
            <div className="overflow-x-auto rounded-2xl border border-[#e2e8f0]">
              <table className="w-full text-sm">
                <thead><tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">{["Authority", "Country", "Licensed Professionals", "Note"].map(h => <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#64748b] uppercase tracking-wide">{h}</th>)}</tr></thead>
                <tbody>
                  {AUTHORITIES.map((a, i) => (
                    <tr key={a.name} className={`${i < AUTHORITIES.length - 1 ? "border-b border-[#f1f5f9]" : ""} ${i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}`}>
                      <td className="px-5 py-4 font-semibold text-[#111]">{a.flag} {a.name}</td>
                      <td className="px-5 py-4 text-[#374151]">{a.country}</td>
                      <td className="px-5 py-4 font-bold text-[#1a56a0]">{a.professionals}</td>
                      <td className="px-5 py-4 text-xs text-[#64748b]">{a.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-16 bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">Everything a health authority needs</h2>
            <p className="text-sm text-[#64748b] text-center mb-10">Built to the standards of a national compliance platform — not adapted from a consumer app.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CAPABILITIES.map(c => (
                <div key={c.title} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                  <div className="text-2xl mb-3">{c.icon}</div>
                  <h3 className="text-sm font-semibold text-[#111] mb-1.5">{c.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data sovereignty */}
        <section className="py-16 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">🛡️ Data Sovereignty & Security</div>
                <h2 className="text-3xl font-bold text-[#111] mb-4 leading-tight">Healthcare data stays in your region — by design</h2>
                <p className="text-[#64748b] mb-6 leading-relaxed">Hayya Med Pro is deployed on Google Cloud Platform, with primary infrastructure in <strong>me-central1 (Doha, Qatar)</strong>. No healthcare professional data leaves your jurisdiction without explicit configuration.</p>
                <ul className="space-y-3">
                  {[
                    "Qatar PDPL (Law No. 13 of 2016) compliant",
                    "Saudi data localization: GCP me-west1 (Dammam)",
                    "AES-256 encryption at rest, TLS 1.3 in transit",
                    "Append-only audit logs — 7-year retention",
                    "SOC 2 Type II target (Year 2) · ISO 27001 target (Year 3)",
                    "Annual VAPT by independent security firm",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#374151]">
                      <span className="text-[#16a34a] flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Data region", value: "me-central1", sub: "Doha, Qatar" },
                  { label: "Encryption", value: "AES-256", sub: "At rest + in transit" },
                  { label: "Audit retention", value: "7 years", sub: "Append-only logs" },
                  { label: "Uptime SLA", value: "99.9%", sub: "43 min/month max" },
                  { label: "API response", value: "< 500ms", sub: "p95 target" },
                  { label: "Deployment", value: "< 10 min", sub: "Cloud Run rollout" },
                ].map(s => (
                  <div key={s.label} className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-4 text-center">
                    <p className="text-xs text-[#64748b] mb-1">{s.label}</p>
                    <p className="text-lg font-bold text-[#1a56a0]">{s.value}</p>
                    <p className="text-xs text-[#64748b]">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing tiers */}
        <section className="py-16 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-2 text-center">Government licensing tiers</h2>
            <p className="text-sm text-[#64748b] text-center mb-10">All engagements are scoped, contracted, and signed under a formal MSA before implementation begins.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TIERS.map(t => (
                <div key={t.name} className={`rounded-2xl border p-6 flex flex-col ${t.highlight ? "border-[#1a56a0] bg-white shadow-lg shadow-[#1a56a0]/10" : "border-[#e2e8f0] bg-white"}`}>
                  {t.highlight && <div className="inline-flex self-start items-center gap-1 bg-[#1a56a0] text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-3">Most common</div>}
                  <h3 className="text-base font-bold text-[#111] mb-1">{t.name}</h3>
                  <p className="text-xs text-[#64748b] mb-5">{t.target}</p>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {t.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-[#374151]">
                        <span className="text-[#16a34a] flex-shrink-0 mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={t.href} className={`text-center text-sm font-semibold py-3 rounded-xl transition-colors ${t.highlight ? "bg-[#1a56a0] text-white hover:bg-[#154890]" : "border border-[#e2e8f0] text-[#374151] hover:border-[#1a56a0] hover:text-[#1a56a0]"}`}>
                    {t.cta}
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#64748b] text-center mt-6">Pricing is per licensed professional per year, with minimum commitment. Volume discounts available at 50K+ professionals.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 bg-white border-t border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-[#111] mb-8 text-center">Government licensing — frequently asked questions</h2>
            <div className="space-y-3">
              {faqLd.mainEntity.map(item => (
                <details key={item.name} className="bg-white rounded-xl border border-[#e2e8f0] group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-[#111] list-none">
                    {item.name}
                    <svg className="w-4 h-4 text-[#64748b] flex-shrink-0 ml-4 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                  </summary>
                  <div className="px-5 pb-4"><p className="text-sm text-[#374151] leading-relaxed">{item.acceptedAnswer.text}</p></div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#0f1f3d]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">Ready to discuss a national deployment?</h2>
            <p className="text-[#64748b] mb-8 text-sm max-w-lg mx-auto leading-relaxed">
              We engage directly with health authority leadership, IT departments, and procurement teams. All proposals are tailored to your authority's scale, existing systems, and regulatory requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/request-demo" className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-bold text-sm px-8 py-4 rounded-xl hover:bg-[#f0f4f8] transition-colors">
                Request a formal proposal →
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.25)] text-white font-medium text-sm px-8 py-4 rounded-xl hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                Contact us directly
              </Link>
            </div>
            <p className="text-xs text-[#475569] mt-6">All engagements are signed under a formal MSA + DPA before any data access or technical integration begins.</p>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="py-6 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-xs text-[#64748b]">
              Hayya Med Pro is an independent technology platform. It is not officially endorsed by QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, or OMSB unless a formal partnership agreement has been signed.{" "}
              <Link href="/contact" className="hover:text-[#64748b]">Contact us</Link> to discuss a partnership.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

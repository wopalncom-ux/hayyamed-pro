import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Hospital Staff CME Compliance Tracking Software | Hayya Med Pro",
  description:
    "Track CME compliance for every doctor, nurse, and allied health professional on your hospital staff. Real-time dashboards, QCHP employer reporting, department-level analytics, and audit-ready PDF exports. Built for GCC hospitals.",
  keywords: [
    "hospital CME compliance software",
    "hospital staff CME tracking",
    "QCHP employer reporting",
    "healthcare workforce compliance management",
    "hospital CME management system",
    "staff continuing education tracking hospital",
    "GCC hospital compliance software",
    "healthcare staff CPD tracking",
    "Hamad medical corporation CME",
    "hospital accreditation CME compliance",
  ],
  openGraph: {
    title: "Hospital Staff CME Compliance Tracking | Hayya Med Pro",
    description:
      "Real-time CME compliance for every staff member. QCHP employer reporting, department dashboards, audit-ready exports. Built for GCC hospitals and health systems.",
    url: `${APP_URL}/for-hospitals`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Hospital+CME+Compliance+Software&s=Real-time+tracking+%C2%B7+QCHP+employer+reporting+%C2%B7+Audit-ready+exports&a=%F0%9F%8F%A5+Enterprise&k=For+Hospitals`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hospital CME Compliance Tracking — Hayya Med Pro",
    description:
      "Full-staff CME compliance visibility for GCC hospitals. QCHP reporting, department dashboards, audit exports.",
  },
  alternates: { canonical: `${APP_URL}/for-hospitals` },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Hospital Staff CME Compliance Management",
  provider: {
    "@type": "Organization",
    name: "Hayya Med",
    url: APP_URL,
  },
  serviceType: "Healthcare Workforce Compliance Software",
  description:
    "Real-time CME and CPD compliance tracking for hospital staff across all GCC licensing authorities, including QCHP employer reporting, department-level dashboards, and audit-ready PDF exports.",
  areaServed: [
    { "@type": "Country", name: "Qatar" },
    { "@type": "Country", name: "Saudi Arabia" },
    { "@type": "Country", name: "United Arab Emirates" },
    { "@type": "Country", name: "Kuwait" },
    { "@type": "Country", name: "Bahrain" },
    { "@type": "Country", name: "Oman" },
  ],
  audience: {
    "@type": "Audience",
    audienceType: "Hospital HR Directors, Medical Directors, Compliance Officers",
  },
  offers: {
    "@type": "Offer",
    name: "Employer Hospital Plan",
    price: "350",
    priceCurrency: "USD",
    billingDuration: "P1M",
    description: "Up to 200 staff members. Department dashboards, bulk PDF reports, QCHP employer exports.",
  },
  url: `${APP_URL}/for-hospitals`,
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are QCHP's CME requirements for employers in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hospitals and healthcare facilities licensed in Qatar must ensure all licensed staff maintain an up-to-date CPD portfolio as a condition of institutional license renewal. QCHP requires 80 CPD credits per 2-year cycle per licensed professional. Employers are responsible for supporting and evidencing staff compliance. Hayya Med Pro generates QCHP-ready compliance reports for every staff member.",
      },
    },
    {
      "@type": "Question",
      name: "How does Hayya Med Pro help hospitals track CME compliance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayya Med Pro gives hospital HR and compliance teams a real-time dashboard showing every staff member's CME progress, compliance status, and renewal deadlines. Automated reminders reduce non-compliance, and bulk PDF reports can be exported for JCI audits, CBAHI accreditation, or QCHP reporting.",
      },
    },
    {
      "@type": "Question",
      name: "Can we import our existing staff list into Hayya Med Pro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports bulk staff onboarding via CSV import. Each staff member receives an invite email and can set up their compliance profile in minutes. Staff retain ownership of their own data, with visibility settings they control.",
      },
    },
    {
      "@type": "Question",
      name: "Does Hayya Med Pro support multiple departments and specialties?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Staff can be grouped by department (Emergency, ICU, Surgery, Pharmacy, etc.) and filtered by profession and specialty. Department heads receive weekly compliance digests. Compliance officers see a single view across the entire hospital.",
      },
    },
    {
      "@type": "Question",
      name: "Is our staff's personal data secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The application layer runs on GCP infrastructure in Doha, Qatar; database storage does not currently reside in-region. Row-level security ensures no staff member can see another's records. Hayya Med Pro signs a Data Processing Agreement (DPA) with every hospital account before any data is shared.",
      },
    },
    {
      "@type": "Question",
      name: "How does Hayya Med Pro help with JCI and CBAHI accreditation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Audit-ready compliance reports can be downloaded for every staff member at any time. Reports show verified CME activities, credit totals, authority-specific compliance status, and activity categories — the exact evidence surveyors request during JCI and CBAHI reviews.",
      },
    },
  ],
};

const FEATURES = [
  {
    icon: "📊",
    title: "Real-time compliance dashboard",
    body: "See every staff member's CME progress at a glance. Filter by department, profession, or compliance status. Identify at-risk staff before renewal deadlines.",
  },
  {
    icon: "🏥",
    title: "QCHP employer reporting",
    body: "Generate QCHP-formatted compliance reports for individual staff or your entire workforce. One-click export — no manual data entry.",
  },
  {
    icon: "📂",
    title: "Department-level views",
    body: "Group staff by department — Emergency, Surgery, ICU, Pharmacy, Nursing. Department heads receive weekly compliance digest emails automatically.",
  },
  {
    icon: "📋",
    title: "Audit-ready PDF exports",
    body: "Bulk compliance PDF reports for JCI, CBAHI, and MOPH audits. Each report includes activity category breakdown, credit totals, and compliance status per licensing authority.",
  },
  {
    icon: "📧",
    title: "Automated renewal reminders",
    body: "Staff receive email reminders at 30 days and 7 days before renewal deadlines. Compliance managers see a non-compliance alert dashboard.",
  },
  {
    icon: "📥",
    title: "CSV bulk import",
    body: "Import your entire staff roster via CSV. Invite emails sent automatically. Staff onboard in minutes — no IT integration required.",
  },
  {
    icon: "🔒",
    title: "GCC data residency",
    body: "All data stored in Qatar (GCP me-central1). Signed DPA included. Row-level security — staff control their own data visibility. Full Qatar PDPL compliance.",
  },
  {
    icon: "🤖",
    title: "AI compliance gap analysis",
    body: "AI identifies which staff are at risk of non-compliance based on current activity levels and remaining cycle time. Flag and prioritize before deadlines hit.",
  },
];

const AUTHORITIES = [
  { code: "QCHP", name: "Qatar", credits: "80 CPD / 2yr", flag: "🇶🇦" },
  { code: "SCFHS", name: "Saudi Arabia", credits: "40–60 CME / yr", flag: "🇸🇦" },
  { code: "DHA", name: "UAE Dubai", credits: "40 CME / 2yr", flag: "🇦🇪" },
  { code: "DOH", name: "UAE Abu Dhabi", credits: "30–50 CPD / 2yr", flag: "🇦🇪" },
  { code: "MOH", name: "Kuwait", credits: "30 CME / yr", flag: "🇰🇼" },
  { code: "NHRA", name: "Bahrain", credits: "40 CPD / 2yr", flag: "🇧🇭" },
  { code: "OMSB", name: "Oman", credits: "40 CME / 2yr", flag: "🇴🇲" },
];

const FAQS = [
  {
    q: "What are QCHP's CME requirements for employers in Qatar?",
    a: "Hospitals must ensure all licensed staff maintain an up-to-date CPD portfolio as a condition of institutional license renewal. QCHP requires 80 CPD credits per 2-year cycle per professional. Hayya Med Pro generates QCHP-ready compliance reports for every staff member.",
  },
  {
    q: "Can we import our existing staff list?",
    a: "Yes. Bulk staff onboarding via CSV import. Each staff member receives an invite email and can set up their profile in minutes. Staff retain ownership of their own data.",
  },
  {
    q: "Does it support multiple departments and specialties?",
    a: "Yes. Staff grouped by department (Emergency, ICU, Surgery, Pharmacy, etc.). Department heads receive weekly digest emails. Compliance officers see a single view across the entire hospital.",
  },
  {
    q: "How does this help with JCI and CBAHI accreditation?",
    a: "Audit-ready reports can be downloaded for every staff member at any time — showing verified activities, credit totals, authority-specific compliance status, and category breakdown. Exactly what surveyors require.",
  },
  {
    q: "Is staff personal data secure?",
    a: "The application layer runs in Doha, Qatar (GCP me-central1); database storage does not currently reside in-region. Hayya Med Pro signs a DPA with every hospital account before data is shared. Row-level security ensures staff cannot access each other's records.",
  },
  {
    q: "What does it cost for a hospital?",
    a: "Hospital plans start at $350/month for up to 200 staff. Larger hospitals and government health authorities can request a custom quote. We also offer annual billing with 15% savings. Contact us to discuss your specific requirements.",
  },
];

export default function ForHospitalsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#1a56a0] flex items-center justify-center" aria-hidden="true">
              <span className="text-white text-xs font-bold">H</span>
            </div>
            <span className="font-bold text-sm text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/employers" className="text-sm text-[#64748b] hover:text-[#111] transition-colors">For Employers</Link>
            <Link href="/for-providers" className="text-sm text-[#64748b] hover:text-[#111] transition-colors">For Providers</Link>
            <Link href="/pricing" className="text-sm text-[#64748b] hover:text-[#111] transition-colors">Pricing</Link>
            <Link href="/request-demo" className="text-sm font-semibold text-white bg-[#1a56a0] hover:bg-[#1547a0] px-4 py-2 rounded-lg transition-colors">Request a demo</Link>
          </nav>
          <Link href="/request-demo" className="md:hidden text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg">Demo</Link>
        </div>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section className="bg-[#0f1f3d] px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#1a56a0]/30 border border-[#1a56a0]/40 text-[#93c5fd] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              🏥 For Hospitals &amp; Health Systems
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
              CME compliance tracking for<br className="hidden sm:block" /> every staff member, automatically
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-10 leading-relaxed">
              Real-time compliance dashboards, QCHP employer reporting, department-level analytics, and audit-ready PDF exports — for hospitals across Qatar, Saudi Arabia, UAE, and the GCC.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/request-demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
              >
                Request a hospital demo
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#93c5fd] hover:text-white border border-[#1a56a0]/50 hover:border-[#1a56a0] px-8 py-4 rounded-xl text-base font-semibold transition-colors"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Authority coverage */}
        <section className="bg-[#f8fafc] px-6 py-10 border-b border-[#e2e8f0]">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-widest text-center mb-6">Covers all 7 GCC licensing authorities</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {AUTHORITIES.map((a) => (
                <div key={a.code} className="bg-white border border-[#e2e8f0] rounded-xl p-3 text-center">
                  <div className="text-xl mb-1" aria-hidden="true">{a.flag}</div>
                  <div className="font-bold text-sm text-[#111]">{a.code}</div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">{a.name}</div>
                  <div className="text-[10px] text-[#64748b] mt-1">{a.credits}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem / Solution */}
        <section className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#111] mb-4">The old way is a compliance liability</h2>
                <ul className="space-y-3">
                  {[
                    "Spreadsheets break as staff count grows",
                    "Manual follow-ups miss renewal deadlines",
                    "No visibility across departments",
                    "QCHP audits require hours of manual report preparation",
                    "Staff CME data lives in personal email — not auditable",
                    "JCI and CBAHI surveyors demand evidence you can't produce quickly",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#374151]">
                      <span className="text-[#dc2626] mt-0.5 flex-shrink-0" aria-hidden="true">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-2xl p-8">
                <h3 className="text-xl font-bold text-[#1a56a0] mb-4">Hayya Med Pro gives you visibility</h3>
                <ul className="space-y-3">
                  {[
                    "Dashboard shows compliance status for every staff member",
                    "Automated reminders — 30 days and 7 days before deadlines",
                    "Department views for heads of department",
                    "QCHP-formatted reports generated in one click",
                    "Audit-ready PDF exports for JCI and CBAHI surveyors",
                    "Data stored in Qatar — PDPL compliant, DPA signed",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#111]">
                      <span className="text-[#16a34a] mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-[#f8fafc] px-6 py-20 border-y border-[#e2e8f0]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-[#111] mb-3">Everything hospital compliance needs</h2>
              <p className="text-[#64748b] text-lg max-w-xl mx-auto">Built for the specific workflow of hospital HR, compliance officers, and medical directors in the GCC.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                  <div className="text-2xl mb-3" aria-hidden="true">{f.icon}</div>
                  <h3 className="font-semibold text-[#111] mb-2 text-sm">{f.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#111] text-center mb-14">How a hospital goes live</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Request a demo", body: "Our team walks you through the employer dashboard, compliance reporting, and data security setup in 30 minutes." },
                { step: "2", title: "Import your staff", body: "Upload your staff roster via CSV. Invite emails sent automatically. Staff set up compliance profiles in minutes." },
                { step: "3", title: "Dashboard goes live", body: "Real-time compliance visibility for your entire workforce from day one. Reminders, reports, and audits on demand." },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#1a56a0] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-[#111] mb-2">{s.title}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance stats */}
        <section className="bg-[#0f1f3d] px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {[
                { n: "7", label: "GCC licensing authorities" },
                { n: "100%", label: "Rules-engine driven" },
                { n: "< 2s", label: "Dashboard load time" },
                { n: "QA 🇶🇦", label: "App hosted in Qatar" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-extrabold text-white mb-1">{s.n}</div>
                  <div className="text-sm text-[#64748b]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-6 py-20 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#111] text-center mb-12">Frequently asked questions</h2>
            <div className="space-y-4">
              {FAQS.map((item) => (
                <details key={item.q} className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden group">
                  <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer font-semibold text-[#111] text-sm select-none list-none">
                    {item.q}
                    <span className="text-[#64748b] flex-shrink-0 group-open:rotate-180 transition-transform" aria-hidden="true">↓</span>
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-sm text-[#374151] leading-relaxed">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1a56a0] px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to bring your hospital into compliance?</h2>
            <p className="text-[#bfdbfe] text-lg mb-10 leading-relaxed">
              Book a 30-minute demo. We'll walk through your current compliance workflow and show you exactly how Hayya Med Pro fits your hospital's requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-demo"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#f1f5f9] text-[#1a56a0] font-bold px-8 py-4 rounded-xl text-base transition-colors"
              >
                Request a hospital demo
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/employers"
                className="inline-flex items-center justify-center gap-2 text-[#bfdbfe] hover:text-white border border-[#3b82f6]/40 hover:border-white/60 px-8 py-4 rounded-xl text-base font-semibold transition-colors"
              >
                See employer plans
              </Link>
            </div>
            <p className="text-[#93c5fd] text-xs mt-8">
              All hospital accounts include a signed DPA, onboarding support, and dedicated account management.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <Link href="/developers"  className="text-xs text-[#93c5fd] hover:text-white underline transition-colors">API Documentation</Link>
              <Link href="/legal/sla"   className="text-xs text-[#93c5fd] hover:text-white underline transition-colors">Service Level Agreement</Link>
              <Link href="/security"    className="text-xs text-[#93c5fd] hover:text-white underline transition-colors">Security Overview</Link>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-[#f8fafc] border-t border-[#e2e8f0] px-6 py-6 text-center">
          <p className="text-xs text-[#64748b] max-w-2xl mx-auto">
            Hayya Med Pro supports CME/CPD tracking and compliance reporting. It does not issue licenses and does not replace official licensing authorities. Hospitals must verify final requirements directly with QCHP, SCFHS, DHA, DOH, NHRA, OMSB, or MOH Kuwait.
          </p>
        </div>
      </main>
    </>
  );
}

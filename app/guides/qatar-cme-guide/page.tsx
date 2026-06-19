import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Qatar CPD Guide 2026 — QCHP CME Requirements for Healthcare Professionals | Hayya Med Pro",
  description:
    "Complete guide to Qatar CPD requirements for 2026. 80 credits per 2-year cycle, QCHP/DHP-AS approved activities, renewal process, accepted categories, and how to track compliance automatically.",
  keywords: [
    "Qatar CPD requirements 2026",
    "QCHP CME guide",
    "Qatar healthcare license renewal",
    "DHP-AS CPD Qatar",
    "Qatar doctor CPD",
    "Qatar nurse CPD",
    "Qatar pharmacist CPD",
    "Qatar CPD activities",
    "MOPH Qatar CPD",
    "Qatar medical professional CPD",
  ],
  openGraph: {
    title: "Qatar CPD Guide 2026 — Complete QCHP Requirements",
    description:
      "80 CPD credits per 2-year cycle. Everything Qatar healthcare professionals need to know about QCHP CPD requirements, accepted activities, and license renewal.",
    url: `${BASE}/guides/qatar-cme-guide`,
    type: "article",
    images: [{ url: `${BASE}/api/og?title=Qatar+CPD+Guide+2026`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qatar CPD Guide 2026 — Complete QCHP Requirements",
    description:
      "80 CPD credits per 2-year cycle. Everything Qatar healthcare professionals need about QCHP CPD requirements and license renewal.",
  },
  alternates: { canonical: `${BASE}/guides/qatar-cme-guide` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do I need in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Healthcare professionals in Qatar must complete 80 CPD credits per 2-year cycle, with a minimum of 40 credits per year. This is required by the Department of Healthcare Professionals – Accreditation Section (DHP-AS) under the Ministry of Public Health (MOPH) Qatar.",
      },
    },
    {
      "@type": "Question",
      name: "Which activities are accepted for Qatar QCHP CPD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QCHP accepts four categories of CPD activity: Category A (Accredited education — conferences, workshops, online courses), Category B (Self-directed learning — journal reading, case review), Category C (Professional activities — presentations, committee work), and Category D (Teaching and research — supervising students, publishing research).",
      },
    },
    {
      "@type": "Question",
      name: "How do I renew my QCHP license in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "To renew your QCHP license in Qatar: (1) Complete 80 CPD credits within your 2-year cycle; (2) Log all activities with evidence (certificates of attendance); (3) Submit your CPD compliance report through the QCHP portal; (4) Pay the renewal fee. Hayya Med Pro generates an official PDF compliance report you can submit directly to QCHP.",
      },
    },
    {
      "@type": "Question",
      name: "Can I complete Qatar QCHP CPD online?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. QCHP accepts online CPD activities under Category A. There is no official cap on online credits, making online learning a flexible and convenient way to accumulate your 80 credits. Accredited online platforms, webinars, and e-learning modules all qualify.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I miss my Qatar CPD deadline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Failure to complete 80 CPD credits per 2-year cycle can result in your QCHP license not being renewed, which means you may not be legally permitted to practice in Qatar. Hayya Med Pro sends automatic alerts 90, 60, and 30 days before your CPD renewal deadline so you never miss it.",
      },
    },
    {
      "@type": "Question",
      name: "Does Qatar CME count as Qatar CPD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Qatar uses the terminology CPD (Continuing Professional Development) rather than CME (Continuing Medical Education), though they refer to the same concept of ongoing professional education for healthcare professionals. QCHP / DHP-AS is the governing body in Qatar.",
      },
    },
  ],
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Qatar CPD Guide 2026 — QCHP CME Requirements for Healthcare Professionals",
  description: "Complete guide to Qatar CPD requirements. 80 credits per 2-year cycle. QCHP/DHP-AS approved activities, renewal, tracking.",
  author: { "@type": "Organization", name: "Hayya Med Pro", url: BASE },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: BASE, logo: { "@type": "ImageObject", url: `${BASE}/icons/icon-192.png` } },
  datePublished: "2026-06-19",
  dateModified: "2026-06-19",
  mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/guides/qatar-cme-guide` },
};

const breadcrumbs = [
  { name: "Home", url: BASE },
  { name: "Guides", url: `${BASE}/guides` },
  { name: "Qatar CPD Guide 2026", url: `${BASE}/guides/qatar-cme-guide` },
];

const CATEGORIES = [
  {
    letter: "A",
    name: "Accredited Education",
    color: "#dbeafe",
    textColor: "#1a56a0",
    desc: "Conferences, workshops, seminars, accredited online courses, grand rounds. These are the highest-quality CPD activities and have no official cap.",
    examples: ["International medical conferences", "QCHP-accredited workshops", "Accredited online CME/CPD modules", "Hospital grand rounds", "Skills labs and simulation"],
  },
  {
    letter: "B",
    name: "Self-Directed Learning",
    color: "#dcfce7",
    textColor: "#16a34a",
    desc: "Journal reading, case-based self-assessment, podcast and webinar consumption. Flexible activities you can complete at your own pace.",
    examples: ["Peer-reviewed journal reading", "Online case-based learning", "Medical podcasts (accredited)", "Self-assessment modules", "Textbook study programs"],
  },
  {
    letter: "C",
    name: "Professional Activities",
    color: "#fef9c3",
    textColor: "#d97706",
    desc: "Presentations, peer review, quality improvement activities, committee participation. Recognises your contribution to the profession beyond formal education.",
    examples: ["Presenting at local/international conferences", "Journal peer review", "Quality improvement projects", "Clinical audit", "Professional committee participation"],
  },
  {
    letter: "D",
    name: "Teaching & Research",
    color: "#f3e8ff",
    textColor: "#7c3aed",
    desc: "Supervising trainees, lecturing, publishing research, mentoring. Recognises your contribution to the education of the next generation of healthcare professionals.",
    examples: ["Supervising medical students", "Lecturing at universities", "Publishing research papers", "Mentoring junior colleagues", "Developing educational materials"],
  },
];

export default function QatarCmeGuidePage() {
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
            <Link href="/gcc-cme-requirements" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">GCC Guide</Link>
            <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">
              Start free
            </Link>
          </div>
        </nav>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto px-6 py-3">
          <ol className="flex items-center gap-2 text-sm text-[#64748b]">
            <li><Link href="/" className="hover:text-[#1a56a0]">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/guides" className="hover:text-[#1a56a0]">Guides</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#0f1f3d] font-medium">Qatar CPD Guide 2026</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-6 py-14">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-4xl" aria-hidden="true">🇶🇦</span>
              <span className="text-xs font-bold text-[#1a56a0] bg-[#dbeafe] px-3 py-1 rounded-full uppercase tracking-wide">QCHP · DHP-AS · MOPH Qatar</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-5 leading-tight max-w-2xl">
              Qatar CPD guide 2026 — everything healthcare professionals need to know
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-8">
              Qatar requires 80 CPD credits every 2 years for all licensed healthcare professionals. This guide covers accepted categories,
              the renewal process, deadlines, and how to track compliance automatically — so you can focus on patient care, not paperwork.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my Qatar CPD — free
              </Link>
              <Link href="/qchp" className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                QCHP tracker →
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-4xl mx-auto px-6 py-12 space-y-14">

          {/* At a glance */}
          <section aria-labelledby="glance-heading">
            <h2 id="glance-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">Qatar CPD requirements at a glance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total credits", value: "80 CPD", sub: "per 2-year cycle" },
                { label: "Minimum per year", value: "40 CPD", sub: "annually" },
                { label: "Governing body", value: "QCHP", sub: "DHP-AS · MOPH" },
                { label: "Terminology", value: "CPD", sub: "not CME" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-white border border-[#e2e8f0] rounded-xl p-5 text-center">
                  <p className="text-lg font-bold text-[#1a56a0] mb-0.5">{value}</p>
                  <p className="text-xs text-[#64748b]">{sub}</p>
                  <p className="text-[10px] text-[#94a3b8] mt-1 uppercase tracking-wide font-medium">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Who must comply */}
          <section aria-labelledby="who-heading">
            <h2 id="who-heading" className="text-2xl font-bold text-[#0f1f3d] mb-4">Who must complete Qatar CPD?</h2>
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-6">
              <p className="text-sm text-[#374151] leading-relaxed mb-4">
                All healthcare professionals licensed by QCHP (Qatar Council for Healthcare Practitioners) and registered with the Department of Healthcare Professionals – Accreditation Section (DHP-AS) under the Ministry of Public Health must complete CPD requirements. This includes:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["Physicians / Doctors", "Registered Nurses", "Pharmacists", "Dentists", "Allied Health Professionals", "Radiographers", "Laboratory Professionals", "Physiotherapists", "Midwives"].map((p) => (
                  <div key={p} className="flex items-center gap-2 text-sm text-[#374151]">
                    <span className="w-4 h-4 rounded-full bg-[#dbeafe] flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5" aria-hidden="true">
                        <path d="M2 6l2.5 2.5 5.5-5" stroke="#1a56a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CPD Categories */}
          <section aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">QCHP CPD categories — what counts?</h2>
            <div className="space-y-4">
              {CATEGORIES.map(({ letter, name, color, textColor, desc, examples }) => (
                <div key={letter} className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
                  <div className="flex items-center gap-4 px-6 py-4 border-b border-[#f1f5f9]">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0" style={{ backgroundColor: color, color: textColor }}>
                      {letter}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0f1f3d]">Category {letter} — {name}</h3>
                      <p className="text-sm text-[#64748b]">{desc}</p>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Examples</p>
                    <div className="flex flex-wrap gap-2">
                      {examples.map((ex) => (
                        <span key={ex} className="text-xs px-3 py-1 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-[#374151]">{ex}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Renewal process */}
          <section aria-labelledby="renewal-heading">
            <h2 id="renewal-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">How to renew your QCHP license</h2>
            <div className="space-y-4">
              {[
                { step: "01", title: "Complete 80 CPD credits in your 2-year cycle", desc: "Ensure you have at least 40 credits per year. Log every activity — conferences, online modules, journal reading, teaching — in Hayya Med Pro as you go." },
                { step: "02", title: "Collect certificates of attendance", desc: "Keep physical or digital certificates for all Category A activities. Hayya Med Pro lets you upload and attach certificates directly to each logged activity." },
                { step: "03", title: "Generate your compliance report", desc: "Hayya Med Pro produces an official PDF compliance report showing all completed activities, dates, credit values, and totals — formatted for QCHP submission." },
                { step: "04", title: "Submit to QCHP through the official portal", desc: "Log into the QCHP portal and submit your renewal application with your compliance report. Apply at least 60 days before your license expiry date to avoid gaps in practice." },
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

          {/* Profession table */}
          <section aria-labelledby="profession-heading">
            <h2 id="profession-heading" className="text-2xl font-bold text-[#0f1f3d] mb-4">Qatar CPD requirements by profession</h2>
            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    {["Profession", "Credits required", "Cycle length", "Minimum per year", "Authority"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {["Physician", "Nurse", "Pharmacist", "Dentist", "Allied Health"].map((prof) => (
                    <tr key={prof} className="hover:bg-[#f8fafc]">
                      <td className="px-5 py-3.5 font-medium text-[#0f1f3d]">{prof}</td>
                      <td className="px-5 py-3.5 text-[#374151]">80 CPD credits</td>
                      <td className="px-5 py-3.5 text-[#374151]">2 years</td>
                      <td className="px-5 py-3.5 text-[#374151]">40 per year</td>
                      <td className="px-5 py-3.5 text-[#1a56a0] font-medium">QCHP / DHP-AS</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Platform CTA */}
          <section className="bg-[#f0f7ff] border border-[#c7daf7] rounded-2xl p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-xl font-bold text-[#0f1f3d] mb-3">Track your Qatar CPD automatically</h2>
                <p className="text-sm text-[#64748b] leading-relaxed mb-5">
                  Hayya Med Pro is built specifically for Qatar and GCC healthcare professionals.
                  Log activities in seconds, upload certificates, and download your QCHP compliance report when you need it.
                </p>
                <Link href="/register" className="inline-block bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors">
                  Start free — 3 minutes
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  "Tracks all 4 QCHP CPD categories",
                  "Alerts 90/60/30 days before renewal deadline",
                  "Generates official QCHP compliance PDF",
                  "AI compliance gap analysis (Pro)",
                  "Supports multiple licenses and countries",
                ].map((f) => (
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
            <h2 id="faq-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">Frequently asked questions — Qatar CPD</h2>
            <div className="space-y-4">
              {faqLd.mainEntity.map((q) => (
                <div key={q.name} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                  <h3 className="font-semibold text-[#0f1f3d] mb-2">{q.name}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related */}
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">Related guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "QCHP CPD Tracker", href: "/qchp", desc: "Track and submit QCHP compliance" },
                { title: "QCHP License Renewal", href: "/qchp-renewal", desc: "Step-by-step renewal guide" },
                { title: "GCC CME Comparison", href: "/gcc-cme-requirements", desc: "All 7 GCC countries compared" },
                { title: "Qatar CPD page", href: "/qatar/cme", desc: "Qatar CME requirements overview" },
                { title: "Qatar license renewal", href: "/qatar/license-renewal", desc: "Full renewal process guide" },
                { title: "GCC Compliance Guide", href: "/guides/gcc-compliance", desc: "Healthcare compliance across GCC" },
              ].map(({ title, href, desc }) => (
                <Link key={href} href={href} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                  <p className="text-sm font-semibold text-[#0f1f3d] group-hover:text-[#1a56a0]">{title}</p>
                  <p className="text-xs text-[#64748b] mt-1">{desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports CPD tracking and licensing readiness for Qatar healthcare professionals.
            It does not issue licenses and does not replace the official QCHP / DHP-AS authority.
            Users must verify final requirements with the Department of Healthcare Professionals – Accreditation Section (DHP-AS), Ministry of Public Health, Qatar.
          </p>
        </main>
      </div>
    </>
  );
}

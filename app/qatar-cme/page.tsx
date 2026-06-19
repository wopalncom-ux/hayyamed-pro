import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Qatar CME Requirements 2025 — QCHP CPD Credits & Renewal Guide",
  description:
    "Complete guide to CME and CPD requirements in Qatar. QCHP requires 80 CPD credits every 2 years for all licensed healthcare professionals. Track your Qatar CPD automatically with Hayya Med Pro.",
  keywords: [
    "Qatar CME requirements",
    "Qatar CPD requirements",
    "QCHP CPD requirements 2025",
    "Qatar healthcare CME",
    "Qatar doctor CPD credits",
    "Qatar nurse CPD",
    "QCHP 80 CPD credits",
    "Qatar medical license renewal",
    "Qatar healthcare professional CPD",
    "DHP-AS CPD requirements",
    "Qatar continuing medical education",
    "QCHP renewal requirements",
  ],
  openGraph: {
    title: "Qatar CME Requirements 2025 — QCHP CPD Guide | Hayya Med Pro",
    description:
      "QCHP requires 80 CPD credits per 2-year cycle for all Qatar-licensed healthcare professionals. Complete country guide with profession breakdown, category rules, and renewal checklist.",
    url: `${APP_URL}/qatar-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Qatar+CME+Requirements+2025&s=80+CPD+credits+%C2%B7+2-year+cycle+%C2%B7+QCHP+%2F+DHP-AS&a=%F0%9F%87%B6%F0%9F%87%A6+Qatar&k=Country+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qatar CME Requirements 2025 — QCHP CPD Guide",
    description: "80 CPD credits every 2 years. Track your Qatar QCHP compliance automatically. Free.",
  },
  alternates: { canonical: `${APP_URL}/qatar-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do healthcare professionals need in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All QCHP-licensed healthcare professionals in Qatar must complete 80 CPD credits per 2-year renewal cycle, with a minimum of 40 credits in each year. Requirements apply equally to physicians, nurses, dentists, pharmacists, and allied health professionals.",
      },
    },
    {
      "@type": "Question",
      name: "What authority governs CME requirements in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Department of Healthcare Professions (DHP-AS), under the Ministry of Public Health (MOPH), governs CPD requirements for all healthcare professionals in Qatar. The system is commonly referred to as QCHP — Qatar Council for Healthcare Practitioners. Qatar uses the term CPD (continuing professional development) rather than CME.",
      },
    },
    {
      "@type": "Question",
      name: "Can I complete CPD online in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Up to 50% of your 2-year QCHP CPD requirement (40 out of 80 credits) can come from accredited online activities. The remaining 40 credits must come from in-person activities such as conferences, workshops, or clinical training programs.",
      },
    },
    {
      "@type": "Question",
      name: "What CPD categories does QCHP accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QCHP accepts four main CPD categories: (1) Clinical practice — conferences, workshops, clinical training; (2) Professional development — leadership, management, communication; (3) Research and publications — authoring or presenting; (4) Self-directed learning — journal reading, e-learning. Patient safety activities are mandatory (minimum 2 credits per 2-year cycle).",
      },
    },
    {
      "@type": "Question",
      name: "How do I submit my CPD portfolio to QCHP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CPD portfolios are submitted through the QCHP online portal at qchp.org.qa. You must log in with your QCHP credentials and submit each activity with provider details, accreditation number, dates, and credit values. Certificates must be uploaded for verification. Hayya Med Pro generates a QCHP-ready PDF portfolio you can submit directly.",
      },
    },
    {
      "@type": "Question",
      name: "Is CPD in Qatar the same as CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Qatar officially uses the term CPD (Continuing Professional Development) rather than CME (Continuing Medical Education). The two frameworks are similar — both use credit-based systems to track professional education. When Qatari professionals encounter 'CME' on international programs, these activities may still count toward QCHP CPD requirements if the provider is accredited.",
      },
    },
  ],
};

const breadcrumbs = [
  { name: "Home", url: APP_URL },
  { name: "CME Requirements", url: `${APP_URL}/cme-requirements` },
  { name: "Qatar CPD Requirements", url: `${APP_URL}/qatar-cme` },
];

const PROFESSIONS = [
  { label: "Physician", credits: 80, cycle: "2 years", minPerYear: 40, flag: "🩺" },
  { label: "Nurse", credits: 80, cycle: "2 years", minPerYear: 40, flag: "👩‍⚕️" },
  { label: "Dentist", credits: 80, cycle: "2 years", minPerYear: 40, flag: "🦷" },
  { label: "Pharmacist", credits: 80, cycle: "2 years", minPerYear: 40, flag: "💊" },
  { label: "Allied Health Professional", credits: 80, cycle: "2 years", minPerYear: 40, flag: "🏥" },
];

const CATEGORIES = [
  {
    name: "Clinical Practice",
    examples: "Medical conferences, workshops, grand rounds, clinical skills training, simulation",
    limit: "Unlimited",
    note: "Minimum 40 credits from in-person activities",
    highlight: false,
  },
  {
    name: "Professional Development",
    examples: "Leadership, management, communication, ethics, quality improvement",
    limit: "Up to 20 credits",
    note: "Non-clinical competencies",
    highlight: false,
  },
  {
    name: "Research & Publications",
    examples: "Authoring peer-reviewed articles, presenting at conferences, textbook chapters",
    limit: "Up to 20 credits",
    note: "Documentation of publication required",
    highlight: false,
  },
  {
    name: "Self-Directed Learning",
    examples: "Accredited e-learning, journal reading programs, online CME modules",
    limit: "Up to 40 credits (50%)",
    note: "Provider must be QCHP-accredited",
    highlight: false,
  },
  {
    name: "Patient Safety",
    examples: "Patient safety programs, incident review, risk management, infection control",
    limit: "Minimum 2 credits mandatory",
    note: "Required for all healthcare professionals",
    highlight: true,
  },
];

const RENEWAL_STEPS = [
  { step: "1", title: "Track your CPD throughout the cycle", desc: "Log activities as you complete them. Don't wait until renewal — a 2-year cycle means most professionals need ~3 activities per month." },
  { step: "2", title: "Verify the patient safety requirement", desc: "Confirm at least 2 CPD credits from accredited patient safety programs. Missing this blocks renewal regardless of total credit count." },
  { step: "3", title: "Check your in-person vs online balance", desc: "QCHP requires 40+ credits from in-person activities. Online-only portfolios will not satisfy the 80-credit requirement." },
  { step: "4", title: "Log in to qchp.org.qa", desc: "Access the QCHP practitioner portal. Navigate to 'CPD Activities' and enter each activity with provider, accreditation number, date, and credits." },
  { step: "5", title: "Upload certificates", desc: "Upload completion certificates for each activity. QCHP verifiers may request originals — keep all certificates for 5 years." },
  { step: "6", title: "Submit and pay the renewal fee", desc: "Complete your license renewal application and pay the applicable fee. Renewal confirmation is usually issued within 3–5 working days." },
];

const RELATED = [
  { title: "QCHP CPD Tracker", href: "/qchp", desc: "Authority-specific tracker" },
  { title: "QCHP Renewal Guide", href: "/qchp-renewal", desc: "Step-by-step renewal" },
  { title: "GCC CME Comparison", href: "/gcc-cme-requirements", desc: "All 6 GCC countries" },
  { title: "CME Requirements Guide", href: "/cme-requirements", desc: "Global CME breakdown" },
  { title: "Saudi Arabia CME", href: "/saudi-arabia-cme", desc: "SCFHS requirements" },
  { title: "UAE CME Guide", href: "/uae-cme", desc: "DHA & DOH requirements" },
];

export default function QatarCmePage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="min-h-screen bg-[#f8fafc]">
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
            <Link href="/register" className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors">
              Start free →
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              🇶🇦 Qatar · QCHP / DHP-AS · Ministry of Public Health
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Qatar CME & CPD Requirements<br className="hidden sm:block" /> 2025 Guide
            </h1>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto mb-8">
              All Qatar-licensed healthcare professionals must complete 80 CPD credits per 2-year QCHP cycle. Complete category breakdown, compliance rules, and renewal checklist.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-[#154890] transition-colors">
                Track your Qatar CPD free →
              </Link>
              <Link href="/qchp" className="inline-flex items-center justify-center gap-2 bg-white border border-[#e2e8f0] text-[#374151] font-semibold px-8 py-3.5 rounded-xl text-sm hover:border-[#1a56a0]/40 transition-colors">
                QCHP authority guide →
              </Link>
            </div>
          </div>

          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3 mb-10 text-xs text-[#92400e] leading-relaxed">
            <strong>Note:</strong> Requirements sourced from QCHP / DHP-AS official documentation. Always verify current rules at{" "}
            <a href="https://www.moph.gov.qa" target="_blank" rel="noopener noreferrer" className="underline">moph.gov.qa</a>{" "}
            before submitting your renewal.
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { label: "All professions", value: "80", unit: "CPD credits / 2 years" },
              { label: "Minimum per year", value: "40", unit: "credits per year" },
              { label: "Online cap", value: "50%", unit: "max from online" },
              { label: "Patient safety", value: "2", unit: "credits mandatory" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-[#1a56a0]">{s.value}</p>
                <p className="text-[10px] text-[#64748b] mt-0.5">{s.unit}</p>
                <p className="text-[11px] font-semibold text-[#111] mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Professions table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-2">CPD requirements by profession</h2>
            <p className="text-sm text-[#64748b] mb-6">
              Unlike Saudi Arabia where requirements differ by profession, Qatar QCHP applies the same 80 CPD credits per 2-year cycle to all licensed healthcare professions.
            </p>
            <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    <th className="text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide px-5 py-3">Profession</th>
                    <th className="text-center text-xs font-semibold text-[#64748b] uppercase tracking-wide px-4 py-3">Credits / 2 years</th>
                    <th className="text-center text-xs font-semibold text-[#64748b] uppercase tracking-wide px-4 py-3">Min / year</th>
                    <th className="text-center text-xs font-semibold text-[#64748b] uppercase tracking-wide px-4 py-3">Cycle</th>
                  </tr>
                </thead>
                <tbody>
                  {PROFESSIONS.map((p, i) => (
                    <tr key={p.label} className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                      <td className="px-5 py-3.5 font-medium text-[#111]">
                        <span className="mr-2">{p.flag}</span>{p.label}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-[#1a56a0]">{p.credits}</td>
                      <td className="px-4 py-3.5 text-center text-[#64748b]">{p.minPerYear}</td>
                      <td className="px-4 py-3.5 text-center text-[#64748b]">{p.cycle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-2">QCHP CPD activity categories</h2>
            <p className="text-sm text-[#64748b] mb-6">
              QCHP classifies CPD activities across four categories, each with its own rules. The in-person activity requirement (minimum 40 credits) is the most commonly missed rule.
            </p>
            <div className="space-y-3">
              {CATEGORIES.map((c) => (
                <div key={c.name} className={`border rounded-xl px-5 py-4 ${c.highlight ? "bg-[#fef2f2] border-[#fecaca]" : "bg-white border-[#e2e8f0]"}`}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <p className="font-semibold text-[#111] text-sm mb-1">{c.name}</p>
                      <p className="text-xs text-[#64748b]">{c.examples}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${c.highlight ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#eff6ff] text-[#1a56a0]"}`}>
                        {c.limit}
                      </span>
                      <p className="text-[10px] text-[#64748b] mt-1">{c.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Qatar context */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-4">CPD vs CME in Qatar</h2>
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 prose prose-sm max-w-none text-[#374151] space-y-4">
              <p>
                Qatar officially uses the term <strong>CPD (Continuing Professional Development)</strong> rather than CME (Continuing Medical Education). The QCHP CPD system is administered by the <strong>Department of Healthcare Professions (DHP-AS)</strong> under the <strong>Ministry of Public Health (MOPH)</strong>.
              </p>
              <p>
                The framework is <strong>profession-neutral</strong> — unlike Saudi Arabia (SCFHS) where physicians require more credits than nurses, Qatar applies the same 80-credit requirement to all licensed healthcare professionals. This reflects Qatar National Health Strategy&apos;s approach to equitable professional development standards.
              </p>
              <p>
                <strong>International CME programs</strong> can count toward QCHP renewal if the provider is accredited by a recognized body (AMA, EACCME, Royal Colleges). Many CME activities from major international medical conferences (Arab Health, AACE, ESC) are QCHP-accepted. Always verify accreditation before attending.
              </p>
              <p>
                The <strong>Qatar National Health Strategy 2024–2030</strong> places increased emphasis on digital health competencies and patient safety. Healthcare professionals should expect these themes to become more prominent in CME requirements in upcoming renewal cycles.
              </p>
            </div>
          </section>

          {/* Renewal steps */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-6">How to renew your QCHP license — step by step</h2>
            <div className="space-y-4">
              {RENEWAL_STEPS.map((s) => (
                <div key={s.step} className="flex gap-4 bg-white border border-[#e2e8f0] rounded-xl px-5 py-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a56a0] text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <p className="font-semibold text-[#111] text-sm">{s.title}</p>
                    <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mb-12 bg-[#0f1f3d] rounded-2xl px-8 py-10 text-center">
            <div className="inline-flex items-center gap-2 bg-[#1a56a0]/30 text-[#93c5fd] text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🇶🇦 Built in Qatar · QCHP-aligned compliance tracking
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Track your Qatar CPD automatically</h2>
            <p className="text-[#94a3b8] mb-6 text-sm max-w-md mx-auto leading-relaxed">
              Set up your QCHP wallet, log activities, and track your 80-credit progress in real time. Hayya Med Pro applies the correct category caps — including the in-person minimum and patient safety requirement.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors">
              Start tracking free →
            </Link>
            <p className="text-[#475569] text-xs mt-3">Free forever · No credit card · 14-day Pro trial · Built in Doha, Qatar</p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-6">Frequently asked questions</h2>
            <div className="space-y-4">
              {faqLd.mainEntity.map((q) => (
                <div key={q.name} className="bg-white border border-[#e2e8f0] rounded-xl px-5 py-4">
                  <p className="font-semibold text-[#111] text-sm mb-1.5">{q.name}</p>
                  <p className="text-xs text-[#475569] leading-relaxed">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#111] mb-4">Related CME guides</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {RELATED.map((r) => (
                <Link key={r.href} href={r.href} className="group bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 hover:border-[#1a56a0]/40 hover:bg-[#f0f7ff] transition-all">
                  <p className="text-xs font-semibold text-[#111] group-hover:text-[#1a56a0] transition-colors">{r.title}</p>
                  <p className="text-[11px] text-[#64748b] mt-0.5">{r.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="pt-6 border-t border-[#e2e8f0]">
            <Link href="/cme-requirements" className="text-sm text-[#1a56a0] hover:underline">← Back to CME Requirements Guide</Link>
          </div>
        </main>
      </div>
    </>
  );
}

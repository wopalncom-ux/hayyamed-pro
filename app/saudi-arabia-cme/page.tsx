import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Saudi Arabia CME Requirements 2025 — SCFHS Credits & Renewal Guide",
  description:
    "Complete guide to CME requirements in Saudi Arabia. SCFHS requires 60 credits/year for physicians and 30 credits/year for nurses. Track your progress automatically with Hayya Med Pro.",
  keywords: [
    "Saudi Arabia CME requirements",
    "Saudi Arabia CME credits",
    "SCFHS CME requirements 2025",
    "Saudi Arabia continuing medical education",
    "Saudi healthcare CME",
    "Saudi doctor CME requirements",
    "Saudi Arabia medical license renewal CME",
    "Saudi Arabia CPD requirements",
    "SCFHS 60 credits per year",
    "Saudi Arabia nurse CME",
    "healthcare CME Saudi Arabia",
    "Saudi Arabia allied health CME",
  ],
  openGraph: {
    title: "Saudi Arabia CME Requirements 2025 — SCFHS Guide | Hayya Med Pro",
    description:
      "SCFHS requires 60 CME credits/year for physicians and 30/year for nurses. Complete Saudi Arabia CME guide with profession-by-profession breakdown and renewal checklist.",
    url: `${APP_URL}/saudi-arabia-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Saudi+Arabia+CME+Requirements+2025&s=60+credits%2Fyear+%28physicians%29+%C2%B7+30%2Fyear+%28nurses%29+%C2%B7+SCFHS&a=%F0%9F%87%B8%F0%9F%87%A6+Saudi+Arabia&k=Country+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saudi Arabia CME Requirements 2025 — SCFHS Guide",
    description: "Track your Saudi Arabia SCFHS CME credits automatically. Free for healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/saudi-arabia-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do I need in Saudi Arabia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS CME requirements vary by profession. Physicians, dentists, and pharmacists need 60 CME credits per year. Nurses and allied health professionals need 30 CME credits per year. At least 5 credits must be in patient safety annually for all professionals.",
      },
    },
    {
      "@type": "Question",
      name: "Who governs CME requirements in Saudi Arabia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Saudi Commission for Health Specialties (SCFHS), also known as الهيئة السعودية للتخصصات الصحية, governs CME requirements for all licensed healthcare professionals in Saudi Arabia. CME activities must be accredited by SCFHS to count toward renewal.",
      },
    },
    {
      "@type": "Question",
      name: "Can I complete CME online in Saudi Arabia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Up to 50% of your annual SCFHS CME credits can come from accredited online activities. You may also count up to 30 CME units from self-learning activities (journals, textbooks, e-learning). Online activities must be from SCFHS-approved providers.",
      },
    },
    {
      "@type": "Question",
      name: "What is the SCFHS CME renewal cycle?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The SCFHS CME cycle is annual (1 year) for most healthcare professions. Some specialist certifications have a 3-year cycle. License renewal is completed through the SCFHS portal at scfhs.org.sa with a documented CME portfolio.",
      },
    },
    {
      "@type": "Question",
      name: "What is the patient safety CME requirement in Saudi Arabia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All SCFHS-licensed healthcare professionals must complete at least 5 CME credits in patient safety every year. These must come from SCFHS-accredited patient safety programs and are mandatory for renewal regardless of total credit count.",
      },
    },
    {
      "@type": "Question",
      name: "Does CME earned in Qatar or UAE count toward SCFHS renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CME activities accredited by other GCC health authorities (QCHP, DHA, DOH, NHRA, OMSB) may be accepted by SCFHS on a case-by-case basis, particularly for activities at accredited international conferences. Always verify acceptance with SCFHS before including cross-authority activities in your renewal portfolio.",
      },
    },
  ],
};

const breadcrumbs = [
  { name: "Home", url: APP_URL },
  { name: "CME Requirements", url: `${APP_URL}/cme-requirements` },
  { name: "Saudi Arabia CME", url: `${APP_URL}/saudi-arabia-cme` },
];

const PROFESSIONS = [
  { label: "Physician", credits: 60, cycle: "Annual", safety: 5, flag: "🩺" },
  { label: "Dentist", credits: 60, cycle: "Annual", safety: 5, flag: "🦷" },
  { label: "Pharmacist", credits: 60, cycle: "Annual", safety: 5, flag: "💊" },
  { label: "Nurse", credits: 30, cycle: "Annual", safety: 5, flag: "👩‍⚕️" },
  { label: "Allied Health Professional", credits: 30, cycle: "Annual", safety: 5, flag: "🏥" },
];

const CATEGORIES = [
  {
    name: "Live Activities",
    examples: "Conferences, workshops, grand rounds, hands-on training",
    limit: "Unlimited",
    note: "Must be SCFHS-accredited",
  },
  {
    name: "Online / E-Learning",
    examples: "Webinars, online CME courses, virtual conferences",
    limit: "Up to 50% of annual requirement",
    note: "Provider must be SCFHS-approved",
  },
  {
    name: "Self-Learning",
    examples: "Journal articles, textbooks, point-of-care tools",
    limit: "Up to 30 CME units",
    note: "Documentation required",
  },
  {
    name: "Patient Safety",
    examples: "Patient safety programs, quality improvement, risk management",
    limit: "Minimum 5 credits mandatory",
    note: "Required for ALL professions",
  },
  {
    name: "Teaching & Assessment",
    examples: "Lecturing, mentoring, exam committee participation",
    limit: "Up to 20% of total credits",
    note: "Faculty / trainer role required",
  },
];

const RENEWAL_STEPS = [
  { step: "1", title: "Gather your CME portfolio", desc: "Collect all certificates, accreditation numbers, provider names, and credit values for activities completed during the cycle." },
  { step: "2", title: "Verify the patient safety requirement", desc: "Confirm you have at least 5 CME credits from accredited patient safety programs. This is mandatory and blocks renewal if missing." },
  { step: "3", title: "Log in to scfhs.org.sa", desc: "Access the SCFHS professional portal using your national ID or Iqama number. Navigate to 'CME Activities'." },
  { step: "4", title: "Submit your CME activities", desc: "Enter each activity with provider name, accreditation number, date, and credits. Upload certificates where required." },
  { step: "5", title: "Pay the renewal fee", desc: "Complete the license renewal payment through the SCFHS portal. Fees vary by profession and specialty board." },
  { step: "6", title: "Download your renewed license", desc: "Your updated SCFHS license certificate is available immediately after approval — usually within 24–48 hours of complete submission." },
];

const RELATED = [
  { title: "SCFHS CME Tracker", href: "/scfhs", desc: "Authority-specific tracker" },
  { title: "SCFHS Renewal Guide", href: "/scfhs-renewal", desc: "Step-by-step renewal" },
  { title: "GCC CME Comparison", href: "/gcc-cme-requirements", desc: "Compare all 6 GCC countries" },
  { title: "CME Requirements Guide", href: "/cme-requirements", desc: "Global CME breakdown" },
  { title: "Qatar QCHP CME", href: "/qchp", desc: "Qatar authority tracker" },
  { title: "UAE DHA CME", href: "/dha", desc: "Dubai authority tracker" },
];

export default function SaudiArabiaCmePage() {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
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
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors"
            >
              Start free →
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">

          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              🇸🇦 Saudi Arabia · SCFHS · Saudi Commission for Health Specialties
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Saudi Arabia CME Requirements<br className="hidden sm:block" /> 2025 Guide
            </h1>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto mb-8">
              SCFHS requires 60 CME credits per year for physicians and 30 per year for nurses. Complete profession-by-profession breakdown, category rules, and renewal checklist.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-[#154890] transition-colors"
              >
                Track your SCFHS CME free →
              </Link>
              <Link
                href="/scfhs"
                className="inline-flex items-center justify-center gap-2 bg-white border border-[#e2e8f0] text-[#374151] font-semibold px-8 py-3.5 rounded-xl text-sm hover:border-[#1a56a0]/40 transition-colors"
              >
                SCFHS authority guide →
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3 mb-10 text-xs text-[#92400e] leading-relaxed">
            <strong>Note:</strong> CME requirements are sourced from SCFHS official documentation. Requirements may change — always verify current rules at{" "}
            <a href="https://scfhs.org.sa" target="_blank" rel="noopener noreferrer" className="underline">scfhs.org.sa</a>{" "}
            before submitting your renewal.
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Physicians & Dentists", value: "60", unit: "credits/year" },
              { label: "Nurses & Allied Health", value: "30", unit: "credits/year" },
              { label: "Patient safety (all)", value: "5", unit: "credits mandatory" },
              { label: "Online cap", value: "50%", unit: "of annual total" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-[#e2e8f0] rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-[#1a56a0]">{s.value}</p>
                <p className="text-[10px] text-[#64748b] mt-0.5">{s.unit}</p>
                <p className="text-[11px] font-semibold text-[#111] mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Profession table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-2">CME requirements by profession</h2>
            <p className="text-sm text-[#64748b] mb-6">
              SCFHS applies different credit requirements based on your licensed profession. All professionals must meet the patient safety minimum.
            </p>
            <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    <th className="text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide px-5 py-3">Profession</th>
                    <th className="text-center text-xs font-semibold text-[#64748b] uppercase tracking-wide px-4 py-3">Credits / year</th>
                    <th className="text-center text-xs font-semibold text-[#64748b] uppercase tracking-wide px-4 py-3">Patient safety</th>
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
                      <td className="px-4 py-3.5 text-center text-[#64748b]">{p.safety} min.</td>
                      <td className="px-4 py-3.5 text-center text-[#64748b]">{p.cycle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#64748b] mt-3">Source: SCFHS CME Bylaws. Some specialist boards may have additional requirements.</p>
          </section>

          {/* CME categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-2">SCFHS CME activity categories</h2>
            <p className="text-sm text-[#64748b] mb-6">
              SCFHS classifies CME activities into categories with different caps and rules. Understanding these prevents submitting credits that may be rejected at renewal.
            </p>
            <div className="space-y-3">
              {CATEGORIES.map((c) => (
                <div key={c.name} className="bg-white border border-[#e2e8f0] rounded-xl px-5 py-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <p className="font-semibold text-[#111] text-sm mb-1">{c.name}</p>
                      <p className="text-xs text-[#64748b]">{c.examples}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${c.name === "Patient Safety" ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#eff6ff] text-[#1a56a0]"}`}>
                        {c.limit}
                      </span>
                      <p className="text-[10px] text-[#64748b] mt-1">{c.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SCFHS context */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-4">About SCFHS and CME in Saudi Arabia</h2>
            <div className="prose prose-sm max-w-none text-[#374151] space-y-4">
              <p>
                The <strong>Saudi Commission for Health Specialties (SCFHS)</strong> — known in Arabic as الهيئة السعودية للتخصصات الصحية — is the sole authority governing CME requirements and license renewal for all healthcare professionals practicing in Saudi Arabia. SCFHS licenses over 600,000 healthcare professionals across medicine, nursing, dentistry, pharmacy, and allied health.
              </p>
              <p>
                CME in Saudi Arabia follows a <strong>continuing medical education (CME)</strong> model rather than the CPD (continuing professional development) terminology used in Qatar and some other GCC countries. The two terms describe similar credit-based frameworks; SCFHS uses "CME" officially.
              </p>
              <p>
                The <strong>Vision 2030 healthcare reform</strong> has significantly expanded SCFHS CME accreditation infrastructure. The number of accredited CME providers, including local hospitals, medical societies, and international academic institutions offering Saudi-accredited programs, has grown substantially since 2018. This means Saudi healthcare professionals generally have more accessible local CME options than in smaller GCC countries.
              </p>
              <p>
                <strong>International conferences and programs</strong> can count toward SCFHS renewal if accredited by SCFHS or recognized international CME bodies. SCFHS maintains a list of accepted international accreditors including AMA (American Medical Association), EACCME (European Accreditation Council for CME), and recognized medical royal colleges.
              </p>
            </div>
          </section>

          {/* Renewal steps */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-6">How to renew your SCFHS license — step by step</h2>
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

          {/* Tracker CTA */}
          <section className="mb-12 bg-[#0f1f3d] rounded-2xl px-8 py-10 text-center">
            <div className="inline-flex items-center gap-2 bg-[#1a56a0]/30 text-[#93c5fd] text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🇸🇦 Built for Saudi Arabia · SCFHS-aligned credit tracking
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Track your SCFHS CME automatically
            </h2>
            <p className="text-[#94a3b8] mb-6 text-sm max-w-md mx-auto leading-relaxed">
              Set your profession, log activities, and watch your compliance ring fill — Hayya Med Pro applies the correct SCFHS credit rules automatically, including the 5-credit patient safety requirement.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors"
            >
              Start tracking free →
            </Link>
            <p className="text-[#475569] text-xs mt-3">Free forever · No credit card required · 14-day Pro trial</p>
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

          {/* Related guides */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#111] mb-4">Related CME guides</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {RELATED.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group bg-white border border-[#e2e8f0] rounded-xl px-4 py-3 hover:border-[#1a56a0]/40 hover:bg-[#f0f7ff] transition-all"
                >
                  <p className="text-xs font-semibold text-[#111] group-hover:text-[#1a56a0] transition-colors">{r.title}</p>
                  <p className="text-[11px] text-[#64748b] mt-0.5">{r.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Back */}
          <div className="pt-6 border-t border-[#e2e8f0]">
            <Link href="/cme-requirements" className="text-sm text-[#1a56a0] hover:underline">
              ← Back to CME Requirements Guide
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}

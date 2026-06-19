import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "UAE CME Requirements 2025 — DHA & DOH CME Credits Guide",
  description:
    "Complete guide to UAE CME requirements. Dubai DHA requires 40 CME credits / 2 years. Abu Dhabi DOH requires 30–50 CPD credits per year. Track your UAE healthcare compliance with Hayya Med Pro.",
  keywords: [
    "UAE CME requirements",
    "UAE CPD requirements 2025",
    "Dubai CME requirements",
    "Abu Dhabi CME requirements",
    "DHA CME requirements",
    "DOH CPD requirements",
    "UAE healthcare CME",
    "UAE doctor CME credits",
    "UAE nurse CPD",
    "UAE medical license renewal CME",
    "Dubai Health Authority CME",
    "Department of Health Abu Dhabi CPD",
    "UAE continuing medical education",
  ],
  openGraph: {
    title: "UAE CME Requirements 2025 — DHA & DOH Guide | Hayya Med Pro",
    description:
      "UAE has two licensing authorities: DHA for Dubai (40 CME / 2 years) and DOH for Abu Dhabi (30–50 CPD / year). Complete country guide covering both emirates with profession breakdown.",
    url: `${APP_URL}/uae-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=UAE+CME+Requirements+2025&s=DHA+40+CME+%C2%B7+DOH+30-50+CPD+%C2%B7+Dubai+%26+Abu+Dhabi&a=%F0%9F%87%A6%F0%9F%87%AA+UAE&k=Country+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UAE CME Requirements 2025 — DHA & DOH Guide",
    description: "DHA (Dubai) needs 40 CME / 2 years. DOH (Abu Dhabi) needs 30–50 CPD / year. Track both automatically.",
  },
  alternates: { canonical: `${APP_URL}/uae-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do healthcare professionals need in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UAE requirements vary by emirate. Dubai (DHA-licensed): 40 CME credits per 2-year renewal cycle. Abu Dhabi (DOH-licensed): 30–50 CPD hours per annual cycle, varying by profession and speciality. Professionals licensed in other emirates may fall under MOH (Federal Ministry of Health) requirements.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between DHA and DOH in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DHA (Dubai Health Authority) regulates healthcare professionals in Dubai and issues the Sheryan license. DOH (Department of Health – Abu Dhabi) regulates professionals in Abu Dhabi. Both operate independently. A DHA license does not cover Abu Dhabi practice, and vice versa. Each authority has separate CME/CPD requirements.",
      },
    },
    {
      "@type": "Question",
      name: "Can UAE CME credits transfer from DHA to DOH?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CME credits do not automatically transfer between DHA and DOH. Professionals holding dual licenses must fulfill each authority's requirements independently. However, a single CME activity attended can be logged toward both DHA and DOH requirements if the provider is accepted by both authorities.",
      },
    },
    {
      "@type": "Question",
      name: "Which activities count for DHA CME in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DHA accepts CME activities in three categories: (1) Category A — attendance at accredited conferences, workshops, and symposia; (2) Category B — online learning, journal reading, self-study; (3) Category C — teaching, research, and publications. Category A carries higher credit values. DHA also accepts CME accredited by international bodies including AMA, EACCME, and Royal Medical Colleges.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I don't complete my UAE CME requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Failure to meet DHA CME requirements results in non-renewal of your Sheryan license, blocking your ability to legally practice in Dubai. DOH non-compliance results in license suspension. Both authorities may impose fees and additional requirements for reinstatement.",
      },
    },
    {
      "@type": "Question",
      name: "Does the DHA Sheryan system track CME automatically?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The DHA Sheryan system (sheryan.ae) allows professionals to log and track CME activities online. Some accredited providers submit credits directly to Sheryan. For others, professionals must manually log activities with provider details and upload certificates. Hayya Med Pro syncs your UAE CME progress and generates a DHA-ready report.",
      },
    },
  ],
};

const breadcrumbs = [
  { name: "Home", url: APP_URL },
  { name: "CME Requirements", url: `${APP_URL}/cme-requirements` },
  { name: "UAE CME Requirements", url: `${APP_URL}/uae-cme` },
];

const DHA_PROFESSIONS = [
  { label: "Physicians (all specialities)", credits: 40, cycle: "2 years" },
  { label: "Dentists", credits: 40, cycle: "2 years" },
  { label: "Pharmacists", credits: 40, cycle: "2 years" },
  { label: "Nurses & Midwives", credits: 20, cycle: "2 years" },
  { label: "Allied Health Professionals", credits: 30, cycle: "2 years" },
];

const DOH_PROFESSIONS = [
  { label: "Physicians (primary care)", credits: 50, cycle: "Annual" },
  { label: "Physicians (specialists)", credits: 50, cycle: "Annual" },
  { label: "Dentists", credits: 40, cycle: "Annual" },
  { label: "Pharmacists", credits: 40, cycle: "Annual" },
  { label: "Nurses & Midwives", credits: 30, cycle: "Annual" },
  { label: "Allied Health Professionals", credits: 30, cycle: "Annual" },
];

const DHA_CATEGORIES = [
  { name: "Category A — Accredited events", desc: "Medical conferences, workshops, symposia, accredited hospital programs, simulation courses", value: "Up to 25 credits per event", weight: "High" },
  { name: "Category B — Self-directed learning", desc: "Online CME modules, journal reading, webinars, accredited e-learning platforms", value: "Up to 15 credits (DHA limit)", weight: "Medium" },
  { name: "Category C — Teaching & research", desc: "Teaching medical students/residents, peer-reviewed publications, conference presentations", value: "Up to 10 credits", weight: "Medium" },
];

const RELATED = [
  { title: "DHA CME Tracker", href: "/dha", desc: "Dubai authority guide" },
  { title: "DOH CPD Guide", href: "/doh", desc: "Abu Dhabi authority guide" },
  { title: "GCC CME Comparison", href: "/gcc-cme-requirements", desc: "All 6 GCC countries" },
  { title: "Qatar CPD Guide", href: "/qatar-cme", desc: "QCHP 80 credits / 2 years" },
  { title: "Saudi Arabia CME", href: "/saudi-arabia-cme", desc: "SCFHS requirements" },
  { title: "CME Requirements Guide", href: "/cme-requirements", desc: "Global CME breakdown" },
];

export default function UaeCmePage() {
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
              🇦🇪 UAE · DHA (Dubai) · DOH (Abu Dhabi) · MOH (Other Emirates)
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              UAE CME Requirements 2025<br className="hidden sm:block" /> — DHA & DOH Guide
            </h1>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto mb-8">
              The UAE has two main licensing authorities with different CME requirements. Dubai (DHA) requires 40 CME credits per 2-year cycle. Abu Dhabi (DOH) requires 30–50 CPD hours annually by profession.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-[#1a56a0] text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-[#154890] transition-colors">
                Track your UAE CME free →
              </Link>
              <Link href="/dha" className="inline-flex items-center justify-center gap-2 bg-white border border-[#e2e8f0] text-[#374151] font-semibold px-8 py-3.5 rounded-xl text-sm hover:border-[#1a56a0]/40 transition-colors">
                DHA authority guide →
              </Link>
            </div>
          </div>

          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl px-4 py-3 mb-10 text-xs text-[#92400e] leading-relaxed">
            <strong>Note:</strong> Requirements sourced from DHA and DOH official documentation. Always verify current rules at{" "}
            <a href="https://sheryan.ae" target="_blank" rel="noopener noreferrer" className="underline">sheryan.ae</a>{" "}
            (DHA) and{" "}
            <a href="https://www.doh.gov.ae" target="_blank" rel="noopener noreferrer" className="underline">doh.gov.ae</a>{" "}
            (DOH) before renewal.
          </div>

          {/* Authority comparison cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-6">UAE licensing authorities at a glance</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {/* DHA Card */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
                <div className="bg-[#0f1f3d] px-5 py-4">
                  <p className="text-[#93c5fd] text-xs font-semibold uppercase tracking-wide mb-1">Dubai</p>
                  <h3 className="text-white font-bold text-lg">Dubai Health Authority</h3>
                  <p className="text-[#94a3b8] text-xs">DHA · Sheryan License</p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748b]">Physicians</span>
                    <span className="font-bold text-[#1a56a0]">40 CME / 2 years</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748b]">Nurses</span>
                    <span className="font-bold text-[#1a56a0]">20 CME / 2 years</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748b]">Allied Health</span>
                    <span className="font-bold text-[#1a56a0]">30 CME / 2 years</span>
                  </div>
                  <div className="pt-2 border-t border-[#f1f5f9]">
                    <p className="text-xs text-[#64748b]">Terminology: <strong>CME</strong> · Portal: sheryan.ae</p>
                  </div>
                  <Link href="/dha" className="block w-full text-center text-sm font-semibold text-[#1a56a0] border border-[#1a56a0]/30 rounded-lg py-2 hover:bg-[#eff6ff] transition-colors">
                    Full DHA guide →
                  </Link>
                </div>
              </div>

              {/* DOH Card */}
              <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
                <div className="bg-[#0f1f3d] px-5 py-4">
                  <p className="text-[#93c5fd] text-xs font-semibold uppercase tracking-wide mb-1">Abu Dhabi</p>
                  <h3 className="text-white font-bold text-lg">Department of Health</h3>
                  <p className="text-[#94a3b8] text-xs">DOH · MOHAP / Malaffi</p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748b]">Physicians</span>
                    <span className="font-bold text-[#1a56a0]">50 CPD / year</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748b]">Nurses</span>
                    <span className="font-bold text-[#1a56a0]">30 CPD / year</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#64748b]">Allied Health</span>
                    <span className="font-bold text-[#1a56a0]">30 CPD / year</span>
                  </div>
                  <div className="pt-2 border-t border-[#f1f5f9]">
                    <p className="text-xs text-[#64748b]">Terminology: <strong>CPD</strong> · Portal: doh.gov.ae</p>
                  </div>
                  <Link href="/doh" className="block w-full text-center text-sm font-semibold text-[#1a56a0] border border-[#1a56a0]/30 rounded-lg py-2 hover:bg-[#eff6ff] transition-colors">
                    Full DOH guide →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* DHA profession table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-2">DHA CME requirements by profession — Dubai</h2>
            <p className="text-sm text-[#64748b] mb-6">
              Dubai Health Authority (DHA) uses a 2-year renewal cycle for all healthcare professionals, with requirements varying by profession.
            </p>
            <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    <th className="text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide px-5 py-3">Profession</th>
                    <th className="text-center text-xs font-semibold text-[#64748b] uppercase tracking-wide px-4 py-3">Credits required</th>
                    <th className="text-center text-xs font-semibold text-[#64748b] uppercase tracking-wide px-4 py-3">Renewal cycle</th>
                  </tr>
                </thead>
                <tbody>
                  {DHA_PROFESSIONS.map((p, i) => (
                    <tr key={p.label} className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                      <td className="px-5 py-3.5 font-medium text-[#111]">{p.label}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-[#1a56a0]">{p.credits}</td>
                      <td className="px-4 py-3.5 text-center text-[#64748b]">{p.cycle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* DOH profession table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-2">DOH CPD requirements by profession — Abu Dhabi</h2>
            <p className="text-sm text-[#64748b] mb-6">
              Abu Dhabi Department of Health (DOH) uses an annual renewal cycle with higher requirements than DHA for physicians and dentists.
            </p>
            <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    <th className="text-left text-xs font-semibold text-[#64748b] uppercase tracking-wide px-5 py-3">Profession</th>
                    <th className="text-center text-xs font-semibold text-[#64748b] uppercase tracking-wide px-4 py-3">CPD hours / year</th>
                    <th className="text-center text-xs font-semibold text-[#64748b] uppercase tracking-wide px-4 py-3">Cycle</th>
                  </tr>
                </thead>
                <tbody>
                  {DOH_PROFESSIONS.map((p, i) => (
                    <tr key={p.label} className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                      <td className="px-5 py-3.5 font-medium text-[#111]">{p.label}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-[#1a56a0]">{p.credits}</td>
                      <td className="px-4 py-3.5 text-center text-[#64748b]">{p.cycle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* DHA categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-2">DHA CME activity categories — Dubai</h2>
            <p className="text-sm text-[#64748b] mb-6">
              DHA classifies CME across three categories. Category A (in-person events) carries the highest credit allocation per activity.
            </p>
            <div className="space-y-3">
              {DHA_CATEGORIES.map((c) => (
                <div key={c.name} className="bg-white border border-[#e2e8f0] rounded-xl px-5 py-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <p className="font-semibold text-[#111] text-sm mb-1">{c.name}</p>
                      <p className="text-xs text-[#64748b]">{c.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#eff6ff] text-[#1a56a0]">
                        {c.value}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contextual explanation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-4">UAE CME explained — what dual-licensed professionals need to know</h2>
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 prose prose-sm max-w-none text-[#374151] space-y-4">
              <p>
                The UAE healthcare regulatory landscape is unique in the GCC: it has <strong>no single national licensing authority</strong>. Instead, each emirate licenses healthcare professionals independently. Dubai professionals are licensed by <strong>DHA (Sheryan)</strong> and Abu Dhabi professionals by <strong>DOH</strong>. Professionals in other emirates — Sharjah, Ajman, Ras Al Khaimah, Umm Al Quwain, Fujairah — fall under the <strong>Federal Ministry of Health (MOHAP)</strong>.
              </p>
              <p>
                This creates a common challenge for UAE healthcare professionals: <strong>dual licensing</strong>. Many professionals hold both a DHA and a DOH license, particularly those who work across Dubai and Abu Dhabi or who seek broader practice rights. Each license carries its own independent CME requirements — a DHA license requires 40 credits over 2 years, while a DOH license requires 30–50 CPD hours every year. A single CME activity can be claimed toward both licenses if the provider is accepted by both authorities.
              </p>
              <p>
                International CME programs from bodies such as <strong>AMA PRA (American Medical Association), EACCME (European Accreditation Council for CME), and UK Royal Colleges</strong> are generally accepted by both DHA and DOH, subject to verification. The Arab Board of Medical Specializations and GCC country conferences are also widely accepted.
              </p>
              <p>
                <strong>UAE Vision 2031</strong> and the <strong>Abu Dhabi Economic Vision 2030</strong> both emphasize healthcare workforce quality, signaling that CPD requirements are likely to increase or become more speciality-specific in future cycles. Professionals investing in continuous learning now are well-positioned for upcoming regulatory changes.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-12 bg-[#0f1f3d] rounded-2xl px-8 py-10 text-center">
            <div className="inline-flex items-center gap-2 bg-[#1a56a0]/30 text-[#93c5fd] text-xs font-semibold px-3 py-1 rounded-full mb-4">
              🇦🇪 Track DHA + DOH in one dashboard
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Track your UAE CME requirements automatically</h2>
            <p className="text-[#94a3b8] mb-6 text-sm max-w-md mx-auto leading-relaxed">
              Set up separate DHA and DOH wallets in Hayya Med Pro. Each wallet applies the correct authority rules — 2-year DHA cycle vs. annual DOH cycle — and warns you when either falls behind.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors">
              Start tracking free →
            </Link>
            <p className="text-[#475569] text-xs mt-3">Free forever · No credit card · 14-day Pro trial</p>
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

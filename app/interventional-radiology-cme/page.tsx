import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Interventional Radiology CME Requirements in GCC — IR Physician CME Guide | Hayya Med Pro",
  description:
    "CME and CPD requirements for interventional radiologists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track IR CME across all 7 GCC licensing authorities.",
  keywords: [
    "interventional radiology CME requirements GCC",
    "interventional radiologist CME Saudi Arabia",
    "SCFHS interventional radiology CME",
    "QCHP IR CPD",
    "interventional radiology CPD Qatar",
    "IR CME tracker",
    "CIRSE CME GCC",
    "SIR CME GCC",
    "interventional radiology license renewal GCC",
    "continuing medical education interventional radiology",
  ],
  openGraph: {
    title: "Interventional Radiology CME Requirements in GCC — Complete IR Guide",
    description:
      "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB — CME and CPD requirements for interventional radiologists across all 7 GCC countries.",
    url: `${APP_URL}/interventional-radiology-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Interventional+Radiology+CME+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+all+7+GCC+authorities+%C2%B7+Free+to+track&a=%F0%9F%94%AC+IR&k=Specialty+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interventional Radiology CME Requirements in GCC",
    description: "Complete CME guide for interventional radiologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
  },
  alternates: { canonical: `${APP_URL}/interventional-radiology-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does an interventional radiologist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Interventional radiologists registered with SCFHS must complete 60 CME credits per year. CIRSE, SIR, ASER, and Saudi Radiology Society events carry EACCME or ACCME accreditation recognized by SCFHS. No more than 50% may come from online activities. Hands-on procedural workshops in IR typically count toward clinical category credits.",
      },
    },
    {
      "@type": "Question",
      name: "Do CIRSE or SIR Annual Meeting credits count toward QCHP CPD for IR in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. QCHP accepts EACCME-accredited events (CIRSE Annual Meeting, EuroIntervention, ECIO) and ACCME-accredited events (SIR Annual Scientific Meeting). Both CIRSE and SIR carry the requisite accreditation for QCHP CPD. The Qatar Radiology Society also organizes QCHP-recognized local CME events. Always retain your attendance certificate with the credit count.",
      },
    },
    {
      "@type": "Question",
      name: "Do IR simulation courses and hands-on training count as CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hands-on IR training — catheter and wire simulation, EVAR/TAVI procedural workshops, TACE simulation courses, and endovascular skills training — counts as CME when organized by an accredited provider (CIRSE Education, SIR Foundation, or equivalent). These activities typically carry higher credit weights per hour than didactic lectures and are recognized by QCHP, SCFHS, and DHA.",
      },
    },
    {
      "@type": "Question",
      name: "Is radiation protection training mandatory for IR physicians in GCC and does it count as CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Radiation protection training is a requirement for all physicians working in fluoroscopic and radiation environments in GCC — including IR. Radiation safety courses and fluoroscopy operator certification carry CME credit toward QCHP and SCFHS requirements when offered by an accredited training provider. This should be renewed per the interval specified by your hospital's radiation safety officer.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track IR CME for QCHP (Qatar) and DHA (Dubai) simultaneously?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-jurisdiction tracking for dual-licensed IR physicians. Create separate wallets for QCHP and DHA within one account. A CIRSE or SIR conference can be logged once and assigned to both wallets — EACCME and ACCME accreditation are both recognized by QCHP and DHA.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "🇶🇦", name: "QCHP", country: "Qatar", term: "CPD", credits: "80", cycle: "2 years", note: "40/yr min" },
  { flag: "🇸🇦", name: "SCFHS", country: "Saudi Arabia", term: "CME", credits: "60", cycle: "1 year", note: "CIRSE/SIR recognized" },
  { flag: "🇦🇪", name: "DHA", country: "UAE (Dubai)", term: "CME", credits: "40", cycle: "2 years", note: "5 patient safety" },
  { flag: "🇦🇪", name: "DOH", country: "UAE (Abu Dhabi)", term: "CPD", credits: "40", cycle: "2 years", note: "Mixed categories" },
  { flag: "🇰🇼", name: "MOH", country: "Kuwait", term: "CME", credits: "30", cycle: "1 year", note: "Annual renewal" },
  { flag: "🇧🇭", name: "NHRA", country: "Bahrain", term: "CPD", credits: "40", cycle: "2 years", note: "Structured + unstr." },
  { flag: "🇴🇲", name: "OMSB", country: "Oman", term: "CME", credits: "40", cycle: "2 years", note: "Category A & B" },
];

const SPECIALTY_NOTES = [
  {
    icon: "🔬",
    title: "CIRSE and SIR — the primary IR CME organizations",
    body: "CIRSE (Cardiovascular and Interventional Radiological Society of Europe) Annual Meeting carries EACCME accreditation. SIR (Society of Interventional Radiology) Annual Scientific Meeting carries ACCME accreditation. Both are accepted by all GCC authorities. CIRSE also offers dedicated CIRSE Academy online modules — EACCME-accredited year-round.",
  },
  {
    icon: "💉",
    title: "Simulation and procedural training",
    body: "Hands-on IR procedural courses — TACE, TARE, embolization techniques, EVAR, TIPS — carry CME credits when organized by CIRSE Education, SIR Foundation, or equivalent. GCC IR fellows attending structured simulation training programs can claim CME credit for procedural competency training.",
  },
  {
    icon: "☢️",
    title: "Radiation protection is both mandatory and CME-eligible",
    body: "Radiation safety officer certification, fluoroscopy operator training, and radiation protection updates carry CME credit at QCHP and SCFHS. Given the high procedural volume in GCC IR — UAE and Saudi IR departments are among the busiest in MENA — radiation protection competency renewal is practically annual.",
  },
  {
    icon: "📊",
    title: "Vascular and oncologic IR expanding rapidly in GCC",
    body: "Tumor ablation, locoregional liver cancer therapy, and renal mass ablation are expanding specialties in GCC tertiary centers. ASCO and ESMO CME events covering interventional oncology carry ACCME/EACCME accreditation and count toward IR physician CME at all GCC authorities.",
  },
];

export default function InterventionalRadiologyCmePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://hayyamed.pro" },
        { name: "Interventional Radiology CME", url: "https://hayyamed.pro/interventional-radiology-cme" },
      ]} />

      <div className="min-h-screen bg-[#f8fafc]">
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <span className="font-bold text-base text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
            </Link>
            <Link href="/register" className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors">
              Start free →
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              🔬 Interventional Radiology · All GCC Licensing Authorities
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Interventional radiology CME requirements<br className="hidden sm:block" /> across the GCC
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Track CME and CPD credits for your IR license across every GCC authority — QCHP, SCFHS, DHA, and more — in one compliance platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">
                Track my IR CME — free →
              </Link>
              <Link href="/radiology-cme" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors">
                See general radiology CME requirements
              </Link>
            </div>
            <p className="text-xs text-[#64748b] mt-3">No credit card required · 14-day Pro trial included</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-5 border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111]">CME/CPD requirements by GCC authority</h2>
              <p className="text-sm text-[#64748b] mt-1">General physician requirements apply to interventional radiologists — specialty-specific notes below</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Authority</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Country</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Term</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Credits</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Cycle</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {AUTHORITIES.map((a, i) => (
                    <tr key={a.name} className={i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
                      <td className="px-6 py-3.5 font-semibold text-[#111]">{a.flag} {a.name}</td>
                      <td className="px-4 py-3.5 text-[#374151]">{a.country}</td>
                      <td className="px-4 py-3.5"><span className="bg-[#eff6ff] text-[#1a56a0] text-xs font-semibold px-2 py-0.5 rounded">{a.term}</span></td>
                      <td className="px-4 py-3.5 font-bold text-[#1a56a0]">{a.credits}</td>
                      <td className="px-4 py-3.5 text-[#374151]">{a.cycle}</td>
                      <td className="px-4 py-3.5 text-xs text-[#64748b]">{a.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-5">What interventional radiologists need to know about GCC CME</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SPECIALTY_NOTES.map((n) => (
                <div key={n.title} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                  <div className="text-2xl mb-3">{n.icon}</div>
                  <h3 className="text-sm font-semibold text-[#111] mb-1.5">{n.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{n.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">Interventional radiology CME — frequently asked questions</h2>
            <div className="space-y-3">
              {faqLd.mainEntity.map((item) => (
                <details key={item.name} className="bg-white rounded-xl border border-[#e2e8f0] group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-[#111] list-none">
                    {item.name}
                    <svg className="w-4 h-4 text-[#64748b] flex-shrink-0 ml-4 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-[#64748b] border-t border-[#f1f5f9] pt-3 leading-relaxed">
                    {item.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1f3d] rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Track your IR CME across all GCC authorities</h2>
            <p className="text-[#64748b] text-sm mb-6 max-w-lg mx-auto">
              Log CIRSE, SIR, and radiation protection credits once — Hayya Med Pro calculates compliance for every active GCC license automatically.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f6ff] transition-colors">
              Start tracking free →
            </Link>
            <p className="text-xs text-[#64748b] mt-3">No credit card required · Free plan available</p>
          </div>
        </main>
      </div>
    </>
  );
}

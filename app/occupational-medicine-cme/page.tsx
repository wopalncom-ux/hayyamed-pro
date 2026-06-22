import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { MedicalWebPageJsonLd } from "@/components/seo/MedicalWebPageJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Occupational Medicine CME Requirements in GCC 2026 | Hayya Med Pro",
  description:
    "CME and CPD requirements for occupational health physicians in Qatar, Saudi Arabia, UAE, and all GCC countries. QCHP, SCFHS, DHA occupational medicine CME credits, ACOEM and ICOH accreditors, and workplace health training.",
  keywords: [
    "occupational medicine CME GCC",
    "occupational health physician CME",
    "QCHP occupational medicine CPD",
    "SCFHS occupational health CME",
    "DHA occupational medicine CME",
    "occupational medicine continuing education GCC",
    "ACOEM CME GCC",
    "workplace health CME GCC",
    "GCC occupational physician license renewal",
  ],
  openGraph: {
    title: "Occupational Medicine CME in GCC 2026",
    description: "CME and CPD requirements for GCC occupational health physicians. QCHP, SCFHS, DHA credit targets, ACOEM and ICOH accreditors, and workplace medicine training.",
    url: `${APP_URL}/occupational-medicine-cme`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/occupational-medicine-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do occupational medicine physicians need in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Occupational medicine physicians in Qatar (QCHP) require 80 CPD credits per 2-year cycle (40/year minimum). In Saudi Arabia (SCFHS), 60 CME credits per year. In Dubai (DHA), 40 CME credits per 2-year cycle. All GCC authorities classify occupational medicine as a physician specialty subject to standard physician CME requirements.",
      },
    },
    {
      "@type": "Question",
      name: "Is occupational medicine a large specialty in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, occupational medicine is a critical and growing specialty in GCC. Qatar, UAE, Saudi Arabia, and Kuwait all have large expatriate workforces in construction, oil and gas, and manufacturing — requiring comprehensive occupational health programs. QatarEnergy, ADNOC, Saudi Aramco, and major construction companies employ occupational health physicians under GCC licensing requirements.",
      },
    },
    {
      "@type": "Question",
      name: "Does ACOEM CME count toward GCC license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. ACOEM (American College of Occupational and Environmental Medicine) is ACCME-accredited and its educational activities carry AMA PRA Category 1 Credits™, recognized by QCHP, SCFHS, DHA, and all major GCC licensing authorities. ACOEM conferences and online CME modules are among the most commonly used occupational medicine CME sources for GCC physicians.",
      },
    },
  ],
};

const AUTHORITIES = [
  { name: "QCHP — Qatar", credits: "80 CPD / 2 years (40/yr min)", term: "CPD", cycle: "Biennial" },
  { name: "SCFHS — Saudi Arabia", credits: "60 CME / year (physicians)", term: "CME", cycle: "Annual" },
  { name: "DHA — Dubai", credits: "40 CME / 2 years", term: "CME", cycle: "Biennial" },
  { name: "DOH — Abu Dhabi", credits: "30–50 CPD / 2 years", term: "CPD", cycle: "Biennial" },
  { name: "MOH — Kuwait", credits: "30 CME / year", term: "CME", cycle: "Annual" },
  { name: "NHRA — Bahrain", credits: "40 CPD / 2 years", term: "CPD", cycle: "Biennial" },
  { name: "OMSB — Oman", credits: "40 CME / 2 years", term: "CME", cycle: "Biennial" },
];

const SPECIALTY_NOTES = [
  {
    title: "Workplace injury & musculoskeletal medicine",
    body: "Work-related musculoskeletal disorders (WRMSDs), ergonomics, and injury prevention CME is foundational for GCC occupational physicians. Large construction projects — including Qatar's rapid infrastructure expansion and NEOM in Saudi Arabia — generate high volumes of workplace injury cases requiring specialist occupational medicine.",
  },
  {
    title: "Oil, gas & petrochemical health",
    body: "Chemical exposure assessment, respiratory protection programs, confined space entry medical clearance, and petrochemical toxicology CME are essential for occupational physicians working with QatarEnergy, ADNOC, Saudi Aramco, or Kuwait Oil Company. ACOEM's occupational toxicology content is the primary accredited CME source.",
  },
  {
    title: "Heat illness & thermal stress",
    body: "GCC climate makes heat illness prevention a mandatory competency. Occupational physicians managing outdoor workers (construction, oil field, agriculture) require updated CME on heat stress assessment, work-rest ratios, acclimatization protocols, and Qatar's outdoor work ban compliance. ACGIH TLVs and ISO 7933 heat stress standards training.",
  },
  {
    title: "Fitness for work assessments",
    body: "Pre-employment medical screening, return-to-work assessment, and fitness-for-duty evaluation CME. ACOEM and ICOH publish evidence-based guidance on medical fitness standards for safety-critical roles — construction, driving, crane operation, chemical handling — that GCC occupational physicians must document and apply.",
  },
  {
    title: "Occupational lung disease",
    body: "Silicosis (from construction/quarrying), asbestosis, asthma, and construction dust-related respiratory CME. High construction activity across GCC makes silica exposure a significant occupational lung disease risk. ATS and ERS provide specialized occupational respiratory medicine CME.",
  },
  {
    title: "Travel & expedition medicine",
    body: "GCC-based occupational physicians managing mobile workforces (oil field workers, construction crews in remote sites, expatriate health programs) require travel medicine CME. ISTM (International Society of Travel Medicine — ACCME-accredited) and FFTM certification training are widely recognized.",
  },
];

export default function OccupationalMedicineCme() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://hayyamed.pro" },
        { name: "Occupational Medicine CME", url: "https://hayyamed.pro/occupational-medicine-cme" },
      ]} />
      <MedicalWebPageJsonLd
        name="Occupational Medicine CME"
        url="https://hayyamed.pro/occupational-medicine-cme"
        description="CME and CPD requirements for occupational health physicians in Qatar, Saudi Arabia, UAE, and all GCC countries. QCHP, SCFHS, DHA occupational medicine CME credits, ACOEM and ICOH accreditors, and workplace health training."
        keywords={["occupational medicine CME GCC", "occupational health physician CME", "QCHP occupational medicine CPD", "SCFHS occupational health CME", "DHA occupational medicine CME", "occupational medicine continuing education GCC"]}
      />

      <div className="min-h-screen bg-[#f8fafc]">
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center"><span className="text-white text-sm font-bold">H</span></div>
              <span className="font-bold text-base text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
            </Link>
            <Link href="/register" className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors">Track my CME free →</Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="mb-10">
            <div className="flex items-center gap-2 text-sm text-[#64748b] mb-4">
              <Link href="/gcc-cme-requirements" className="hover:text-[#1a56a0]">GCC CME requirements</Link>
              <span>›</span>
              <span>Occupational Medicine</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4">Occupational Medicine CME in GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl">
              CME and CPD requirements for occupational health physicians across all GCC licensing authorities — credit targets, ACOEM and ICOH accreditors, and specialty training for the GCC's large industrial workforce.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10">
            <div className="px-6 py-4 border-b border-[#e2e8f0]">
              <h2 className="text-lg font-bold text-[#111]">CME/CPD requirements by GCC authority</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Authority</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Credits required</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Term</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Cycle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {AUTHORITIES.map((a) => (
                    <tr key={a.name}>
                      <td className="px-6 py-3 text-sm font-semibold text-[#111]">{a.name}</td>
                      <td className="px-6 py-3 text-sm text-[#374151]">{a.credits}</td>
                      <td className="px-6 py-3 text-sm text-[#374151]">{a.term}</td>
                      <td className="px-6 py-3 text-sm text-[#374151]">{a.cycle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#111] mb-6">Occupational medicine CME by subspecialty</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {SPECIALTY_NOTES.map((note) => (
              <div key={note.title} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h3 className="font-bold text-[#111] mb-2">{note.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{note.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-10">
            <h2 className="text-lg font-bold text-[#111] mb-4">Key occupational medicine CME societies recognized in GCC</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { body: "ACOEM (American College of Occupational and Environmental Medicine)", note: "ACCME-accredited — AMA PRA Category 1 Credits™ — recognized across all GCC" },
                { body: "ICOH (International Commission on Occupational Health)", note: "Global body — world congress CME via EACCME-affiliated providers" },
                { body: "SOEM (Society of Occupational and Environmental Health)", note: "ACCME-affiliated — occupational and environmental medicine CME" },
                { body: "ISTM (International Society of Travel Medicine)", note: "ACCME-accredited — travel and expedition medicine CME" },
                { body: "EOM (European Society of Occupational Medicine)", note: "EACCME-affiliated — recognized by QCHP, DHA, and most GCC authorities" },
                { body: "ATS / ERS Occupational Health Sections", note: "Occupational respiratory disease CME — accepted where ATS/ERS is recognized" },
              ].map((s) => (
                <div key={s.body} className="flex gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#1a56a0] flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#111]">{s.body}</p>
                    <p className="text-xs text-[#64748b]">{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#111] mb-6">Frequently asked questions</h2>
            <div className="space-y-4">
              {faqLd.mainEntity.map((faq) => (
                <div key={faq.name} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                  <h3 className="font-bold text-[#111] mb-2">{faq.name}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1f3d] rounded-2xl px-8 py-10 text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Track your occupational medicine CME</h2>
            <p className="text-[#64748b] mb-6 max-w-md mx-auto">Log ACOEM, ICOH, and ISTM certificates — monitor all GCC license requirements in one dashboard. Free for all occupational health physicians.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors">Start tracking free →</Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Family Medicine CME", href: "/family-medicine-cme" },
              { label: "Pulmonology CME", href: "/pulmonology-cme" },
              { label: "Physical Medicine CME", href: "/physical-medicine-cme" },
              { label: "QCHP — Qatar", href: "/qchp" },
              { label: "SCFHS — Saudi Arabia", href: "/scfhs" },
              { label: "CME calculator", href: "/cme-calculator" },
              { label: "All specialties", href: "/gcc-cme-requirements" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-[#1a56a0] hover:underline bg-[#eff6ff] px-3 py-1.5 rounded-lg">{l.label}</Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

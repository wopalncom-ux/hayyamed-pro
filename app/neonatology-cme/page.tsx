import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { MedicalWebPageJsonLd } from "@/components/seo/MedicalWebPageJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Neonatology CME Requirements in GCC 2026 | Hayya Med Pro",
  description:
    "CME and CPD requirements for neonatologists and neonatal nurses in Qatar, Saudi Arabia, UAE, and all GCC countries. QCHP, SCFHS, DHA neonatology CME credits, NRP training, ESPR and NNF accreditors.",
  keywords: [
    "neonatology CME GCC",
    "neonatologist CME requirements",
    "neonatal medicine CME",
    "QCHP neonatology CPD",
    "SCFHS neonatology CME",
    "DHA neonatology CME",
    "NRP training GCC",
    "ESPR CME GCC",
    "GCC neonatologist license renewal",
    "neonatal CME GCC",
  ],
  openGraph: {
    title: "Neonatology CME in GCC 2026",
    description: "CME and CPD requirements for GCC neonatologists and neonatal nurses. QCHP, SCFHS, DHA credit targets, NRP and ESPR accreditors.",
    url: `${APP_URL}/neonatology-cme`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/neonatology-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do neonatologists need in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Neonatologists in Qatar (QCHP) require 80 CPD credits per 2-year cycle (40/year minimum). In Saudi Arabia (SCFHS), 60 CME credits per year. In Dubai (DHA), 40 CME credits per 2-year cycle. GCC authorities classify neonatology as a physician subspecialty subject to standard physician CME requirements.",
      },
    },
    {
      "@type": "Question",
      name: "Does NRP (Neonatal Resuscitation Program) count as CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NRP (Neonatal Resuscitation Program) from the American Academy of Pediatrics (AAP) carries continuing education credits and is widely accepted across GCC authorities. AAP is ACCME-accredited and NRP certificates are recognized by QCHP, SCFHS, DHA, and most GCC licensing bodies. Always verify the specific credit type with your authority portal.",
      },
    },
    {
      "@type": "Question",
      name: "Are there neonatology CME events in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The GCC has a strong neonatology CME calendar. Key regional events include the GCC Neonatology Society symposia, Sidra Medicine neonatal educational events (Qatar), King Faisal Specialist Hospital neonatology CME (Saudi Arabia), and Cleveland Clinic Abu Dhabi neonatal programs. Many carry AMA-PRA or EACCME accreditation recognized across GCC.",
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
    title: "Neonatal resuscitation (NRP)",
    body: "NRP certification and renewal is a mandatory competency requirement for neonatologists and neonatal nurses in all GCC countries. AAP (ACCME-accredited) NRP courses carry CE credit recognized across GCC. Sidra Medicine and major GCC pediatric hospitals run accredited NRP instructor courses.",
  },
  {
    title: "Preterm infant care & NICU management",
    body: "Respiratory distress syndrome (RDS), surfactant therapy, CPAP/high-flow nasal cannula, and bronchopulmonary dysplasia (BPD) CME. ESPR (European Society for Paediatric Research) and PAS (Pediatric Academic Societies — ACCME-accredited) are primary accredited CME sources for preterm infant management.",
  },
  {
    title: "Neonatal neurology",
    body: "Hypoxic-ischemic encephalopathy (HIE), therapeutic hypothermia, neonatal seizures, and brain MRI interpretation CME. The International Neonatal Neurology Group and Child Neurology Society (ACCME-accredited) provide specialized neonatal neurology CME. GCC NICUs have widely adopted therapeutic hypothermia protocols.",
  },
  {
    title: "Congenital anomalies & surgery",
    body: "Neonatal surgical conditions (gastroschisis, tracheoesophageal fistula, CDH, NEC), cardiac defects (critical congenital heart disease screening), and surgical NICU management CME. High-level quaternary NICUs at KFSH, Sidra, and Al Jalila Children's Hospital require multidisciplinary neonatology training.",
  },
  {
    title: "Neonatal infection & antimicrobials",
    body: "Early-onset sepsis (GBS, E.coli), late-onset sepsis, antimicrobial stewardship in the NICU, and fungal prophylaxis CME. High-acuity NICUs in GCC quaternary centers are microbiology-intensive environments. ESPID and IDSA provide accredited neonatal infection management CME.",
  },
  {
    title: "Nutrition & growth in NICU",
    body: "Human milk support, donor breast milk programs, total parenteral nutrition (TPN), enteral feeding strategies, and post-discharge nutrition CME. The European Foundation for the Care of Newborn Infants (EFCNI) and ESPGHAN provide NICU nutrition CME recognized by European and GCC authorities.",
  },
];

export default function NeonatologyCme() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://hayyamed.pro" },
        { name: "Neonatology CME", url: "https://hayyamed.pro/neonatology-cme" },
      ]} />
      <MedicalWebPageJsonLd
        name="Neonatology CME"
        url="https://hayyamed.pro/neonatology-cme"
        description="CME and CPD requirements for neonatologists and neonatal nurses in Qatar, Saudi Arabia, UAE, and all GCC countries. QCHP, SCFHS, DHA neonatology CME credits, NRP training, ESPR and NNF accreditors."
        keywords={["neonatology CME GCC", "neonatologist CME requirements", "neonatal medicine CME", "QCHP neonatology CPD", "SCFHS neonatology CME", "DHA neonatology CME"]}
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
              <span>Neonatology</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4">Neonatology CME in GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl">
              CME and CPD requirements for neonatologists across all GCC licensing authorities — credit targets, NRP and ESPR accreditors, and subspecialty training programs for NICU physicians.
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

          <h2 className="text-2xl font-bold text-[#111] mb-6">Neonatology CME by subspecialty</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {SPECIALTY_NOTES.map((note) => (
              <div key={note.title} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h3 className="font-bold text-[#111] mb-2">{note.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{note.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-10">
            <h2 className="text-lg font-bold text-[#111] mb-4">Key neonatology CME societies recognized in GCC</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { body: "AAP (American Academy of Pediatrics)", note: "ACCME-accredited — NRP, PedsCCM — AMA PRA Category 1 Credits™ — recognized across GCC" },
                { body: "ESPR (European Society for Paediatric Research)", note: "EACCME-affiliated — neonatal and perinatal research CME" },
                { body: "PAS (Pediatric Academic Societies)", note: "ACCME-accredited — broad pediatric/neonatal CME at annual meeting" },
                { body: "EFCNI (European Foundation for Care of Newborn Infants)", note: "Neonatal nutrition and family-centred care CME" },
                { body: "Child Neurology Society", note: "ACCME-accredited — neonatal neurology CME" },
                { body: "GCC Neonatology Society", note: "Regional society — events accredited for multiple GCC authorities" },
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your neonatology CME</h2>
            <p className="text-[#64748b] mb-6 max-w-md mx-auto">Log AAP, NRP, and ESPR certificates — monitor all GCC licensing authority targets from one dashboard. Free for all neonatologists.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors">Start tracking free →</Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Pediatrics CME", href: "/pediatrics-cme" },
              { label: "Critical Care CME", href: "/critical-care-cme" },
              { label: "OB/Gynecology CME", href: "/obstetrics-gynecology-cme" },
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

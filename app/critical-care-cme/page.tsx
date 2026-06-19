import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Critical Care & Intensive Care Medicine CME in GCC 2026 | Hayya Med Pro",
  description:
    "CME and CPD requirements for intensivists and critical care physicians in Qatar, Saudi Arabia, UAE, and all GCC countries. QCHP, SCFHS, DHA ICU CME credits, ESICM and SCCM accreditors, and FCCS/ACLS training.",
  keywords: [
    "critical care CME GCC",
    "intensive care medicine CME",
    "ICU physician CME requirements",
    "QCHP critical care CPD",
    "SCFHS critical care CME",
    "DHA intensive care CME",
    "SCCM CME GCC",
    "ESICM CME GCC",
    "GCC intensivist license renewal",
    "FCCS course GCC",
  ],
  openGraph: {
    title: "Critical Care & Intensive Care Medicine CME in GCC 2026",
    description: "CME and CPD requirements for GCC intensivists and critical care physicians. QCHP, SCFHS, DHA credit targets, SCCM and ESICM accreditors, FCCS training.",
    url: `${APP_URL}/critical-care-cme`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/critical-care-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do critical care physicians need in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Critical care physicians in Qatar (QCHP) need 80 CPD credits per 2-year cycle (40/year minimum). In Saudi Arabia (SCFHS), 60 CME credits per year. In Dubai (DHA), 40 CME credits per 2-year cycle. All GCC authorities classify critical care as a physician specialty subject to standard physician CME requirements.",
      },
    },
    {
      "@type": "Question",
      name: "Does the FCCS (Fundamental Critical Care Support) course count as CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The FCCS course, administered by SCCM (Society of Critical Care Medicine), carries AMA PRA Category 1 Credits™ and is accepted by QCHP, SCFHS, DHA, and all major GCC licensing authorities. FCCS is one of the most attended critical care CME courses among GCC intensivists.",
      },
    },
    {
      "@type": "Question",
      name: "Is ACLS renewal CME-eligible in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ACLS (Advanced Cardiovascular Life Support) provider and renewal courses from the American Heart Association (AHA) carry continuing education contact hours. Recognition varies by GCC authority — check with your specific authority portal whether AHA CE credits count toward your annual CME requirement. For QCHP, SCFHS, and DHA, AHA ACLS is generally recognized when certificates are presented.",
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
    title: "General ICU / multi-system critical care",
    body: "SCCM (Society of Critical Care Medicine) Annual Congress and ESICM LIVES Congress are the primary accredited CME events for intensivists. Both carry ACCME/EACCME-accredited credits recognized across all GCC authorities. GCC ICUs have grown significantly since COVID-19, increasing demand for advanced ventilator management and organ support CME.",
  },
  {
    title: "Mechanical ventilation & respiratory support",
    body: "Advanced mechanical ventilation, ARDS management, high-flow nasal oxygen (HFNO), and non-invasive ventilation (NIV) CME. SCCM, ATS (American Thoracic Society — ACCME-accredited), and ERS (European Respiratory Society — EACCME-accredited) provide comprehensive respiratory critical care CME.",
  },
  {
    title: "Sepsis & infection management",
    body: "Sepsis bundle implementation, antimicrobial stewardship, and infection prevention CME is a critical care priority. SCCM Sepsis CME and IDSA (Infectious Diseases Society of America — ACCME-accredited) infection management courses are directly applicable to GCC ICU practice.",
  },
  {
    title: "Hemodynamic monitoring & shock",
    body: "Point-of-care ultrasound (POCUS), arterial line management, central venous monitoring, and vasoactive drug CME. Critical care ultrasound courses from WINFOCUS and ACEP Ultrasound Division are widely attended in GCC and carry recognized CME credits.",
  },
  {
    title: "Neuro-critical care",
    body: "Raised ICP management, post-cardiac arrest care, status epilepticus, and TBI management. The Neurocritical Care Society (NCS — ACCME-accredited) provides specialized neuro-ICU CME. Hamad Medical's neurosurgery and neurocritical care programs in Doha are regionally recognized teaching centers.",
  },
  {
    title: "Pediatric critical care (PICU)",
    body: "PICU CME covering pediatric sepsis, PARDS, congenital heart disease post-op management, and PALS. SCCM Pediatric Section and AAP (ACCME-accredited) pediatric critical care programs provide recognized CME. Every major GCC children's hospital (Al Jalila, Sidra, King Abdullah Specialist Children's) runs accredited PICU education.",
  },
];

export default function CriticalCareCme() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://hayyamed.pro" },
        { name: "Critical Care CME", url: "https://hayyamed.pro/critical-care-cme" },
      ]} />

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
              <span>Critical Care & ICU</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4">Critical Care & Intensive Care Medicine CME in GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl">
              CME and CPD requirements for intensivists and critical care physicians across all GCC licensing authorities — credit targets, SCCM and ESICM accreditors, and subspecialty training.
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

          <h2 className="text-2xl font-bold text-[#111] mb-6">Critical care CME by subspecialty</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {SPECIALTY_NOTES.map((note) => (
              <div key={note.title} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h3 className="font-bold text-[#111] mb-2">{note.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{note.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-10">
            <h2 className="text-lg font-bold text-[#111] mb-4">Key critical care CME societies recognized in GCC</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { body: "SCCM (Society of Critical Care Medicine)", note: "ACCME-accredited — AMA PRA Category 1 Credits™ — recognized across all GCC; FCCS courses" },
                { body: "ESICM (European Society of Intensive Care Medicine)", note: "EACCME-accredited — LIVES Congress — recognized by QCHP, DHA, and most GCC" },
                { body: "ATS (American Thoracic Society)", note: "ACCME-accredited — respiratory critical care CME" },
                { body: "NCS (Neurocritical Care Society)", note: "ACCME-accredited — neuro-ICU CME — recognized across GCC" },
                { body: "SSCCM (Saudi Society of Critical Care Medicine)", note: "SCFHS-accredited — directly recognized for Saudi CME" },
                { body: "AHA (American Heart Association)", note: "ACLS, BLS, PALS provider courses — CE credit recognition varies by GCC authority" },
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your critical care CME</h2>
            <p className="text-[#64748b] mb-6 max-w-md mx-auto">Log SCCM, ESICM, and FCCS certificates — track all GCC authority requirements in one dashboard. Free for all intensivists.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors">Start tracking free →</Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Emergency Medicine CME", href: "/emergency-medicine-cme" },
              { label: "Pulmonology CME", href: "/pulmonology-cme" },
              { label: "Anesthesia CME", href: "/anesthesia-cme" },
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

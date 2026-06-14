import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Nuclear Medicine CME Requirements in GCC 2026 | Hayya Med Pro",
  description:
    "CME and CPD requirements for nuclear medicine physicians in Qatar, Saudi Arabia, UAE, and all GCC countries. QCHP, SCFHS, DHA nuclear medicine CME credits, SNMMI and EANM accreditors, and PET/CT training.",
  keywords: [
    "nuclear medicine CME GCC",
    "nuclear medicine physician CME",
    "QCHP nuclear medicine CPD",
    "SCFHS nuclear medicine CME",
    "DHA nuclear medicine CME",
    "SNMMI CME GCC",
    "EANM CME GCC",
    "PET CT CME GCC",
    "GCC nuclear medicine license renewal",
    "nuclear medicine continuing education",
  ],
  openGraph: {
    title: "Nuclear Medicine CME in GCC 2026",
    description: "CME and CPD requirements for GCC nuclear medicine physicians. QCHP, SCFHS, DHA credit targets, SNMMI and EANM accreditors, and PET/CT training.",
    url: `${APP_URL}/nuclear-medicine-cme`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/nuclear-medicine-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do nuclear medicine physicians need in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nuclear medicine physicians in Qatar (QCHP) require 80 CPD credits per 2-year cycle (40/year minimum). In Saudi Arabia (SCFHS), 60 CME credits per year. In Dubai (DHA), 40 CME credits per 2-year cycle. All GCC authorities classify nuclear medicine as a physician specialty subject to standard physician CME requirements.",
      },
    },
    {
      "@type": "Question",
      name: "Does SNMMI CME count in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. SNMMI (Society of Nuclear Medicine and Molecular Imaging) is ACCME-accredited and its educational activities carry AMA PRA Category 1 Credits™, recognized by QCHP, SCFHS, DHA, and all major GCC licensing authorities. The SNMMI Annual Meeting is the primary accredited nuclear medicine CME event globally.",
      },
    },
    {
      "@type": "Question",
      name: "Is nuclear medicine growing in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, significantly. GCC countries are investing heavily in nuclear medicine infrastructure — PET/CT scanners are now present in all major GCC hospitals including Hamad Medical (Qatar), KFSH (Saudi Arabia), Cleveland Clinic Abu Dhabi, and Dubai Hospital. Theranostics (PSMA, DOTATATE, Lu-177) is an emerging high-growth area in GCC oncology centers.",
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
    title: "PET/CT & oncologic imaging",
    body: "FDG PET/CT interpretation, PSMA PET for prostate cancer, DOTATATE for neuroendocrine tumors, and emerging PET tracers CME. SNMMI annual meeting and EANM congress are the primary accredited sources. GCC's growing oncology infrastructure (Qatar's National Cancer Center, KFSH Oncology) drives demand for advanced PET/CT training.",
  },
  {
    title: "Theranostics & radionuclide therapy",
    body: "Lu-177 PSMA therapy, Lu-177 DOTATATE (Lutathera), Ra-223 for bone metastases, and I-131 therapy CME. Theranostics is one of the fastest-growing areas in oncology and nuclear medicine worldwide, with GCC centers rapidly expanding therapeutic nuclear medicine programs. SNMMI and EANM provide dedicated theranostics CME tracks.",
  },
  {
    title: "Cardiac nuclear medicine",
    body: "Myocardial perfusion imaging (MPI), cardiac PET, and hybrid SPECT/CT cardiac imaging CME. ASNC (American Society of Nuclear Cardiology — ACCME-accredited) provides specialized cardiac nuclear medicine CME. Cardiovascular disease is the leading cause of death in GCC, making cardiac nuclear medicine clinically high-priority.",
  },
  {
    title: "Thyroid & endocrine nuclear medicine",
    body: "Thyroid scan interpretation, I-131 therapy for thyroid cancer and hyperthyroidism, parathyroid scintigraphy, and adrenal imaging CME. Thyroid disease is among the most common endocrine conditions in GCC — thyroid nuclear medicine is a high-volume clinical service in all major GCC hospitals.",
  },
  {
    title: "SPECT/CT & general nuclear medicine",
    body: "Bone scan, renal scintigraphy, hepatobiliary imaging, lung V/Q scanning, and sentinel node biopsy CME. These are the foundational SPECT studies that form the backbone of any nuclear medicine department. SNMMI, EANM, and regional nuclear medicine society workshops provide accredited general nuclear medicine CME.",
  },
  {
    title: "Radiation safety & regulatory compliance",
    body: "Radiation protection, nuclear medicine regulatory compliance, radiation safety officer training, and dosimetry CME are mandatory competencies for nuclear medicine physicians. GCC countries have strict nuclear regulatory frameworks (Qatar's FANR equivalent, UAE FANR, Saudi Nuclear and Radiological Regulatory Commission).",
  },
];

export default function NuclearMedicineCme() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

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
              <span>Nuclear Medicine</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4">Nuclear Medicine CME in GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl">
              CME and CPD requirements for nuclear medicine physicians across all GCC licensing authorities — credit targets, SNMMI and EANM accreditors, PET/CT training, and theranostics programs.
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

          <h2 className="text-2xl font-bold text-[#111] mb-6">Nuclear medicine CME by subspecialty</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {SPECIALTY_NOTES.map((note) => (
              <div key={note.title} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h3 className="font-bold text-[#111] mb-2">{note.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{note.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-10">
            <h2 className="text-lg font-bold text-[#111] mb-4">Key nuclear medicine CME societies recognized in GCC</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { body: "SNMMI (Society of Nuclear Medicine and Molecular Imaging)", note: "ACCME-accredited — AMA PRA Category 1 Credits™ — recognized across all GCC" },
                { body: "EANM (European Association of Nuclear Medicine)", note: "EACCME-accredited — recognized by QCHP, DHA, and most GCC authorities" },
                { body: "ASNC (American Society of Nuclear Cardiology)", note: "ACCME-accredited — cardiac nuclear medicine CME" },
                { body: "WFNMB (World Federation of Nuclear Medicine & Biology)", note: "Global body — member society events carry recognized CME" },
                { body: "ARRS / RSNA", note: "Radiology societies with nuclear medicine sessions — ACCME-accredited" },
                { body: "Arab Nuclear Medicine Society", note: "Regional society — events accredited for multiple GCC authorities" },
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your nuclear medicine CME</h2>
            <p className="text-[#94a3b8] mb-6 max-w-md mx-auto">Log SNMMI, EANM, and ASNC certificates — track all GCC authority requirements from one dashboard. Free for all nuclear medicine physicians.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors">Start tracking free →</Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Radiology CME", href: "/radiology-cme" },
              { label: "Oncology CME", href: "/oncology-cme" },
              { label: "Pathology CME", href: "/pathology-cme" },
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

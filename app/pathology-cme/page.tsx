import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { MedicalWebPageJsonLd } from "@/components/seo/MedicalWebPageJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Pathology & Laboratory Medicine CME Requirements in GCC 2026 | Hayya Med Pro",
  description:
    "CME and CPD requirements for pathologists and laboratory medicine specialists in Qatar, Saudi Arabia, UAE, and all GCC countries. QCHP, SCFHS, DHA pathology CME credits, accepted accreditors, and tracking tools.",
  keywords: [
    "pathology CME GCC",
    "laboratory medicine CME",
    "pathologist CME requirements",
    "QCHP pathology CPD",
    "SCFHS pathology CME",
    "DHA laboratory medicine CME",
    "pathology continuing education GCC",
    "anatomical pathology CME",
    "clinical pathology CME",
    "GCC pathologist license renewal",
  ],
  openGraph: {
    title: "Pathology & Laboratory Medicine CME in GCC 2026",
    description: "CME and CPD requirements for GCC pathologists and lab medicine specialists. QCHP, SCFHS, DHA credit requirements, accreditors, and tracking.",
    url: `${APP_URL}/pathology-cme`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/pathology-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do pathologists need in Qatar (QCHP)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pathologists licensed by QCHP in Qatar require 80 CPD credits per 2-year renewal cycle, with a minimum of 40 credits per year. This applies equally to anatomical pathologists, clinical pathologists, and laboratory medicine specialists.",
      },
    },
    {
      "@type": "Question",
      name: "What CME activities count for pathology in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Accepted pathology CME includes: attending CAP (College of American Pathologists) accredited conferences, ESP (European Society of Pathology) congresses, digital pathology workshops, cytopathology courses, molecular pathology training, quality management programs, and laboratory accreditation training. Online CME from ACCME-accredited providers also counts.",
      },
    },
    {
      "@type": "Question",
      name: "Is the CAP (College of American Pathologists) accreditation recognized in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CAP accreditation is recognized by most GCC authorities for laboratory quality standards. For CME credits specifically, CAP-accredited educational activities that carry AMA PRA Category 1 Credits™ are accepted by QCHP, SCFHS, DHA, and most GCC licensing bodies.",
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
    title: "Anatomical & clinical pathology",
    body: "Both anatomical (surgical, autopsy, cytology) and clinical (chemistry, microbiology, haematology, immunology) pathologists must meet the same GCC authority CME targets. Subspecialty societies such as ESP and CAP provide the primary accredited educational events.",
  },
  {
    title: "Digital pathology & AI",
    body: "Whole-slide imaging, AI-assisted diagnostics, and telepathology are rapidly growing CME topics in GCC labs. QCHP and SCFHS accept training in these areas from ACCME-accredited providers — check specific course accreditation before registering.",
  },
  {
    title: "Laboratory accreditation (CAP, ISO 15189)",
    body: "CAP laboratory accreditation and ISO 15189 quality management training carry CME credits from recognized bodies. Many GCC hospital labs pursue CAP accreditation, making this training both professionally valuable and CME-eligible.",
  },
  {
    title: "Molecular pathology & genomics",
    body: "Molecular diagnostics, next-generation sequencing (NGS), and precision medicine CME is increasingly required for pathologists in KFSH, Hamad Medical, and other GCC quaternary centers. ASCP and AMP provide accredited molecular pathology programs.",
  },
  {
    title: "Cytopathology",
    body: "Cytopathology (FNA, cervical cytology, liquid-based cytology) CME is available through ASC (American Society of Cytopathology), IAC (International Academy of Cytology), and ESP. GCC gynecological cancer screening programs make cervical cytology training especially relevant.",
  },
  {
    title: "Forensic & autopsy pathology",
    body: "Forensic pathologists in GCC countries (particularly Qatar and UAE, which have mandatory autopsy requirements) can count forensic medicine CME from NAME (National Association of Medical Examiners) and IAFS toward GCC licensing requirements where accreditors are recognized.",
  },
];

export default function PathologyCme() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://hayyamed.pro" },
        { name: "Pathology CME", url: "https://hayyamed.pro/pathology-cme" },
      ]} />
      <MedicalWebPageJsonLd
        name="Pathology CME"
        url="https://hayyamed.pro/pathology-cme"
        description="CME and CPD requirements for pathologists and laboratory medicine specialists in Qatar, Saudi Arabia, UAE, and all GCC countries. QCHP, SCFHS, DHA pathology CME credits, accepted accreditors, and tracking tools."
        keywords={["pathology CME GCC", "laboratory medicine CME", "pathologist CME requirements", "QCHP pathology CPD", "SCFHS pathology CME", "DHA laboratory medicine CME"]}
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
              <span>Pathology & Laboratory Medicine</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4">Pathology & Laboratory Medicine CME in GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl">
              CME and CPD requirements for pathologists and laboratory medicine specialists across all GCC licensing authorities — credit targets, accepted accreditors, and specialty-specific training.
            </p>
          </div>

          {/* Authority table */}
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

          {/* Specialty notes */}
          <h2 className="text-2xl font-bold text-[#111] mb-6">Pathology CME by subspecialty</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {SPECIALTY_NOTES.map((note) => (
              <div key={note.title} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h3 className="font-bold text-[#111] mb-2">{note.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{note.body}</p>
              </div>
            ))}
          </div>

          {/* Recognized societies */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-10">
            <h2 className="text-lg font-bold text-[#111] mb-4">Key pathology CME accreditors recognized in GCC</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { body: "CAP (College of American Pathologists)", note: "AMA PRA Category 1 via ACCME — accepted across all GCC authorities" },
                { body: "ASCP (American Society for Clinical Pathology)", note: "ACCME-accredited — widely accepted" },
                { body: "ESP (European Society of Pathology)", note: "EACCME-accredited — recognized across GCC" },
                { body: "IAC (International Academy of Cytology)", note: "Cytopathology focus — verify per authority" },
                { body: "AMP (Association for Molecular Pathology)", note: "ACCME-accredited — molecular pathology CME" },
                { body: "ISCP (International Society for Clinical Pathology)", note: "Verify recognition with your specific authority" },
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

          {/* FAQ */}
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

          {/* CTA */}
          <div className="bg-[#0f1f3d] rounded-2xl px-8 py-10 text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">Track your pathology CME automatically</h2>
            <p className="text-[#64748b] mb-6 max-w-md mx-auto">Log activities, upload CAP or ESP certificates, and monitor your progress toward every GCC authority target — free for all healthcare professionals.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors">Start tracking free →</Link>
          </div>

          {/* Related links */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "QCHP — Qatar", href: "/qchp" },
              { label: "SCFHS — Saudi Arabia", href: "/scfhs" },
              { label: "DHA — Dubai", href: "/dha" },
              { label: "Physician CME", href: "/physician-cme" },
              { label: "Radiology CME", href: "/radiology-cme" },
              { label: "Oncology CME", href: "/oncology-cme" },
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

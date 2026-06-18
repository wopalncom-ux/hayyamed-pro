import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Physical Medicine & Rehabilitation CME in GCC 2026 | Hayya Med Pro",
  description:
    "CME and CPD requirements for physiatrists, sports medicine physicians, and rehabilitation specialists in Qatar, Saudi Arabia, UAE, and all GCC countries. QCHP, SCFHS, DHA PM&R CME credits and accreditors.",
  keywords: [
    "physical medicine rehabilitation CME GCC",
    "PM&R CME GCC",
    "physiatrist CME requirements",
    "sports medicine CME GCC",
    "rehabilitation medicine CME",
    "QCHP rehabilitation CPD",
    "SCFHS PM&R CME",
    "DHA rehabilitation CME",
    "GCC sports medicine CME",
  ],
  openGraph: {
    title: "Physical Medicine & Rehabilitation CME in GCC 2026",
    description: "CME and CPD requirements for PM&R and sports medicine physicians across GCC licensing authorities.",
    url: `${APP_URL}/physical-medicine-cme`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/physical-medicine-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do PM&R physicians need in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Physical medicine and rehabilitation physicians in Qatar (QCHP) need 80 CPD credits per 2-year cycle (40/year minimum). In Saudi Arabia (SCFHS), 60 CME credits per year. In Dubai (DHA), 40 CME credits per 2-year cycle. PM&R is classified as a physician specialty subject to standard physician CME requirements in all GCC countries.",
      },
    },
    {
      "@type": "Question",
      name: "Does sports medicine CME count for PM&R license renewal in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, sports medicine CME from accredited providers counts toward PM&R license renewal in GCC. ACSM (American College of Sports Medicine — ACCME-accredited), FIMS (Fédération Internationale de Médecine du Sport), and AMSSM (American Medical Society for Sports Medicine — ACCME-accredited) activities are recognized by most GCC authorities.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a growing demand for PM&R CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, significantly. Qatar's hosting of sporting events, Saudi Arabia's Vision 2030 sports strategy, and the UAE's high-profile sports sector have dramatically increased demand for sports medicine and rehabilitation physicians. QCHP, SCFHS, and DHA have all seen growth in PM&R licensed professionals in recent years.",
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
    title: "Sports medicine",
    body: "A high-growth specialty in GCC following Qatar 2022 FIFA World Cup, Saudi Arabia's Vision 2030 sports investment, and the UAE's Formula 1 and endurance sports industry. FIMS World Congress, ACSM Annual Meeting, and ECSS (European College of Sport Science) are primary accredited CME sources.",
  },
  {
    title: "Neurorehabilitation",
    body: "Stroke rehabilitation, traumatic brain injury (TBI), and spinal cord injury (SCI) rehabilitation CME. ISPRM (International Society of Physical and Rehabilitation Medicine) and ESPRM (European Society of PM&R) provide accredited neurorehabilitation CME recognized by GCC authorities via EACCME and ACCME affiliates.",
  },
  {
    title: "Musculoskeletal rehabilitation",
    body: "CME for back pain, post-surgical rehabilitation, joint replacement recovery, and sports injury management. AAPMR (American Academy of PM&R — ACCME-accredited) annual assembly covers musculoskeletal PM&R comprehensively and carries AMA PRA Category 1 Credits™.",
  },
  {
    title: "Pain management",
    body: "Chronic pain management, interventional pain procedures, and multidisciplinary pain program CME. Relevant to PM&R physicians managing complex pain presentations. IASP (International Association for the Study of Pain) world congress activities are recognized by most GCC authorities via ACCME or EACCME affiliates.",
  },
  {
    title: "Pediatric rehabilitation",
    body: "Cerebral palsy, neurodevelopmental disorders, and pediatric musculoskeletal rehabilitation CME. AAP (American Academy of Pediatrics — ACCME-accredited) and AACPDM (American Academy for Cerebral Palsy and Developmental Medicine) provide targeted pediatric rehabilitation CME.",
  },
  {
    title: "Electrodiagnostic medicine",
    body: "Nerve conduction studies (NCS) and electromyography (EMG) CME is core to PM&R training. AANEM (American Association of Neuromuscular & Electrodiagnostic Medicine — ACCME-accredited) provides the leading electrodiagnostic CME recognized across GCC.",
  },
];

export default function PhysicalMedicineCme() {
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
              <span>Physical Medicine & Rehabilitation</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4">Physical Medicine & Rehabilitation CME in GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl">
              CME and CPD requirements for physiatrists and sports medicine physicians across all GCC licensing authorities — credit targets, ISPRM and ACSM accreditors, and subspecialty training.
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

          <h2 className="text-2xl font-bold text-[#111] mb-6">PM&R CME by subspecialty</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {SPECIALTY_NOTES.map((note) => (
              <div key={note.title} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h3 className="font-bold text-[#111] mb-2">{note.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{note.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-10">
            <h2 className="text-lg font-bold text-[#111] mb-4">Key PM&R and sports medicine CME societies recognized in GCC</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { body: "AAPMR (American Academy of PM&R)", note: "ACCME-accredited — AMA PRA Category 1 Credits™ — recognized across GCC" },
                { body: "ISPRM (International Society of PM&R)", note: "EACCME-affiliated — global body — recognized by QCHP, DHA, and most GCC" },
                { body: "ACSM (American College of Sports Medicine)", note: "ACCME-accredited — sports medicine CME — accepted across GCC" },
                { body: "FIMS (International Federation of Sports Medicine)", note: "Global body — world congress CME — verify per authority" },
                { body: "AANEM (American Association of Neuromuscular & Electrodiagnostic Medicine)", note: "ACCME-accredited — EMG/NCS CME — accepted across GCC" },
                { body: "AMSSM (American Medical Society for Sports Medicine)", note: "ACCME-accredited — primary care sports medicine CME" },
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your PM&R and sports medicine CME</h2>
            <p className="text-[#64748b] mb-6 max-w-md mx-auto">Log AAPMR, ACSM, and ISPRM certificates — monitor all GCC license targets from one dashboard. Free for all physicians.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors">Start tracking free →</Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Orthopedics CME", href: "/orthopedics-cme" },
              { label: "Neurology CME", href: "/neurology-cme" },
              { label: "QCHP — Qatar", href: "/qchp" },
              { label: "SCFHS — Saudi Arabia", href: "/scfhs" },
              { label: "Physician CME", href: "/physician-cme" },
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

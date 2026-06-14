import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Neurosurgery CME Requirements in GCC 2026 | Hayya Med Pro",
  description:
    "CME and CPD requirements for neurosurgeons in Qatar, Saudi Arabia, UAE, and all GCC countries. QCHP, SCFHS, DHA neurosurgery CME credits, WFNS and EANS accreditors, and brain and spine surgery training.",
  keywords: [
    "neurosurgery CME GCC",
    "neurosurgeon CME requirements",
    "QCHP neurosurgery CPD",
    "SCFHS neurosurgery CME",
    "DHA neurosurgery CME",
    "brain surgery CME",
    "spine surgery CME GCC",
    "neurosurgery continuing education",
    "GCC neurosurgeon license renewal",
  ],
  openGraph: {
    title: "Neurosurgery CME in GCC 2026",
    description: "CME and CPD requirements for neurosurgeons across GCC licensing authorities. QCHP, SCFHS, DHA credit targets, WFNS and EANS accreditors.",
    url: `${APP_URL}/neurosurgery-cme`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/neurosurgery-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do neurosurgeons need in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Neurosurgeons in Qatar (QCHP) need 80 CPD credits per 2-year cycle (40/year minimum). In Saudi Arabia (SCFHS), neurosurgeons need 60 CME credits per year. In Dubai (DHA), 40 CME credits per 2-year cycle. All GCC authorities treat neurosurgery as a physician specialty subject to the standard physician CME requirement.",
      },
    },
    {
      "@type": "Question",
      name: "What societies provide recognized neurosurgery CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Key recognized societies for neurosurgery CME in GCC include: WFNS (World Federation of Neurosurgical Societies), EANS (European Association of Neurosurgical Societies), CNS (Congress of Neurological Surgeons — ACCME-accredited), AANS (American Association of Neurological Surgeons — ACCME-accredited), and SNS (Saudi Neurosurgery Society). AANS and CNS activities carry AMA PRA Category 1 Credits™ recognized across GCC.",
      },
    },
    {
      "@type": "Question",
      name: "Does neurosurgery simulation training count as CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, simulation training for neurosurgical skills (endoscopy simulators, microsurgery trainers, vascular clip training) counts as CME when accredited by a recognized body such as AANS, CNS, or an ACCME-accredited provider. Hands-on skills workshops and cadaveric labs also carry CME credit when formally accredited.",
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
    title: "Cranial neurosurgery",
    body: "CME for brain tumor surgery, aneurysm clipping, AVM management, and skull base surgery. The EANS annual congress and CNS annual meeting are primary CME sources. Hamad Medical and King Fahad Medical City run regional neurosurgery symposia with GCC-recognized accreditation.",
  },
  {
    title: "Spine surgery",
    body: "Spine surgery CME covers lumbar/cervical disc disease, spinal instrumentation, deformity correction, and minimally invasive spine surgery (MISS). AOSpine courses are widely attended in GCC and carry CME credits from ACCME-accredited providers.",
  },
  {
    title: "Neuroendoscopy",
    body: "Endoscopic skull base surgery and endoscopic third ventriculostomy are growing CME areas. WFNS neuroendoscopy workshops and EANS endoscopy courses offer hands-on simulation credits recognized across GCC authorities.",
  },
  {
    title: "Pediatric neurosurgery",
    body: "Pediatric neurosurgery CME (hydrocephalus, craniosynostosis, pediatric brain tumors, tethered cord) is available through ISPN (International Society for Pediatric Neurosurgery) and AANS Pediatric Section — ACCME-accredited, accepted in GCC.",
  },
  {
    title: "Neuro-oncology",
    body: "Multidisciplinary neuro-oncology CME is critical as glioblastoma, meningioma, and spinal cord tumor management evolves rapidly. SNO (Society for Neuro-Oncology) meetings carry AMA PRA Category 1 Credits™ recognized by QCHP, SCFHS, and DHA.",
  },
  {
    title: "Neurovascular & interventional",
    body: "Endovascular neurosurgery (coiling, flow diversion, thrombectomy) CME is accredited through SNIS (Society of NeuroInterventional Surgery) and ESMINT (European Society of Minimally Invasive Neurological Therapy). Verify GCC authority recognition per activity.",
  },
];

export default function NeurosurgeryCme() {
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
              <span>Neurosurgery</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4">Neurosurgery CME in GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl">
              CME and CPD requirements for neurosurgeons across all GCC licensing authorities — credit targets, WFNS and AANS accreditors, and subspecialty training programs.
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

          <h2 className="text-2xl font-bold text-[#111] mb-6">Neurosurgery CME by subspecialty</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {SPECIALTY_NOTES.map((note) => (
              <div key={note.title} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h3 className="font-bold text-[#111] mb-2">{note.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{note.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-10">
            <h2 className="text-lg font-bold text-[#111] mb-4">Key neurosurgery CME societies recognized in GCC</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { body: "AANS (American Association of Neurological Surgeons)", note: "ACCME-accredited — AMA PRA Category 1 Credits™ — recognized across GCC" },
                { body: "CNS (Congress of Neurological Surgeons)", note: "ACCME-accredited — AMA PRA Category 1 Credits™ — recognized across GCC" },
                { body: "EANS (European Association of Neurosurgical Societies)", note: "EACCME-accredited — recognized by QCHP, DHA, and most GCC authorities" },
                { body: "WFNS (World Federation of Neurosurgical Societies)", note: "Global body — member society events carry CME from recognized accreditors" },
                { body: "SNS (Saudi Neurosurgery Society)", note: "SCFHS-accredited — directly recognized for Saudi CME" },
                { body: "AOSpine International", note: "Spine surgery CME — ACCME-accredited — widely recognized" },
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your neurosurgery CME</h2>
            <p className="text-[#94a3b8] mb-6 max-w-md mx-auto">Log AANS, CNS, and EANS certificates — track all GCC license targets in one place. Free for all neurosurgeons.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors">Start tracking free →</Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Neurology CME", href: "/neurology-cme" },
              { label: "Surgery CME", href: "/surgery-cme" },
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

import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Vascular Surgery CME Requirements in GCC 2026 | Hayya Med Pro",
  description:
    "CME and CPD requirements for vascular surgeons in Qatar, Saudi Arabia, UAE, and all GCC countries. QCHP, SCFHS, DHA vascular surgery CME credits, SVS and ESVS accreditors, and endovascular training.",
  keywords: [
    "vascular surgery CME GCC",
    "vascular surgeon CME requirements",
    "QCHP vascular surgery CPD",
    "SCFHS vascular surgery CME",
    "DHA vascular surgery CME",
    "endovascular CME GCC",
    "vascular surgery continuing education",
    "SVS CME",
    "GCC vascular surgeon license renewal",
  ],
  openGraph: {
    title: "Vascular Surgery CME in GCC 2026",
    description: "CME and CPD requirements for vascular surgeons across GCC licensing authorities. QCHP, SCFHS, DHA credit targets, SVS and ESVS accreditors.",
    url: `${APP_URL}/vascular-surgery-cme`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/vascular-surgery-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do vascular surgeons need in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vascular surgeons in Qatar (QCHP) need 80 CPD credits per 2-year cycle with a minimum of 40 per year. In Saudi Arabia (SCFHS), 60 CME credits per year. In Dubai (DHA), 40 CME credits per 2-year cycle. GCC authorities apply standard physician CME requirements to vascular surgeons.",
      },
    },
    {
      "@type": "Question",
      name: "Does SVS (Society for Vascular Surgery) CME count in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The Society for Vascular Surgery (SVS) is ACCME-accredited and its educational activities carry AMA PRA Category 1 Credits™, which are recognized by QCHP, SCFHS, DHA, and all major GCC licensing authorities. SVS Vascular Annual Meeting (VAM) is the largest source of accredited vascular surgery CME globally.",
      },
    },
    {
      "@type": "Question",
      name: "Is diabetes-related vascular disease a focus for GCC vascular surgery CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The GCC has some of the world's highest rates of type 2 diabetes (prevalence exceeding 15–20% in Qatar, UAE, and Saudi Arabia). Peripheral arterial disease (PAD), diabetic foot, and limb salvage surgery are therefore high-priority CME topics for GCC vascular surgeons. Endovascular treatment of PAD and diabetic wound management conferences frequently occur in Dubai, Riyadh, and Doha.",
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
    title: "Peripheral arterial disease (PAD)",
    body: "PAD and lower limb ischemia management is the highest-volume vascular surgery CME topic in GCC, given diabetes prevalence exceeding 20% in several GCC countries. SVS VAM, CIRSE (Cardiovascular and Interventional Radiological Society of Europe), and LINC (Leipzig Interventional Course) provide accredited PAD CME.",
  },
  {
    title: "Aortic surgery & EVAR",
    body: "Open aortic surgery and endovascular aortic repair (EVAR/TEVAR) CME. SVS Vascular Annual Meeting, VEITH Symposium, and CXSYMPOSIUM are premier accredited sources. The increasing use of complex aortic endovascular techniques in GCC quaternary centers drives strong demand for this CME.",
  },
  {
    title: "Carotid & cerebrovascular disease",
    body: "Carotid endarterectomy (CEA), carotid artery stenting (CAS), and vertebrobasilar disease CME from SVS, ESVS (European Society for Vascular Surgery), and ACTRIMS-affiliated societies. Stroke prevention in high-cardiovascular-risk GCC populations makes this a priority training area.",
  },
  {
    title: "Venous disease & interventions",
    body: "Chronic venous insufficiency (CVI), varicose vein treatment (thermal ablation, sclerotherapy), and deep vein thrombosis (DVT) management CME. AVF (American Venous Forum — ACCME-accredited) and UIP (International Union of Phlebology) provide recognized venous CME.",
  },
  {
    title: "Diabetic foot & limb salvage",
    body: "A critical GCC subspecialty given the world's highest diabetes rates. Multidisciplinary diabetic foot team CME covers wound management, vascular reconstruction, infectious disease, and prosthetics. IWGDF (International Working Group on the Diabetic Foot) guidelines training is highly relevant.",
  },
  {
    title: "Dialysis access surgery",
    body: "Arteriovenous fistula (AVF) and graft creation for renal dialysis access. High relevance in GCC given elevated rates of end-stage renal disease (ESRD) secondary to diabetes and hypertension. VASA (Vascular Access Society of the Americas) and VASBI provide accredited CME.",
  },
];

export default function VascularSurgeryCme() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://hayyamed.pro" },
        { name: "Vascular Surgery CME", url: "https://hayyamed.pro/vascular-surgery-cme" },
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
              <span>Vascular Surgery</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4">Vascular Surgery CME in GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl">
              CME and CPD requirements for vascular surgeons across all GCC licensing authorities — credit targets, SVS and ESVS accreditors, and subspecialty training programs.
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

          <h2 className="text-2xl font-bold text-[#111] mb-6">Vascular surgery CME by subspecialty</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {SPECIALTY_NOTES.map((note) => (
              <div key={note.title} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h3 className="font-bold text-[#111] mb-2">{note.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{note.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-10">
            <h2 className="text-lg font-bold text-[#111] mb-4">Key vascular surgery CME societies recognized in GCC</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { body: "SVS (Society for Vascular Surgery)", note: "ACCME-accredited — AMA PRA Category 1 Credits™ — recognized across all GCC" },
                { body: "ESVS (European Society for Vascular Surgery)", note: "EACCME-accredited — recognized by QCHP, DHA, and most GCC authorities" },
                { body: "CIRSE (Cardiovascular and Interventional Radiological Society of Europe)", note: "EACCME-accredited — endovascular CME — recognized across GCC" },
                { body: "AVF (American Venous Forum)", note: "ACCME-accredited — venous disease CME" },
                { body: "SSQSVS (Saudi Society for Vascular Surgery)", note: "SCFHS-accredited — directly recognized for Saudi CME" },
                { body: "WFVS (World Federation of Vascular Societies)", note: "Global umbrella body — member society events carry recognized CME" },
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your vascular surgery CME</h2>
            <p className="text-[#64748b] mb-6 max-w-md mx-auto">Log SVS, ESVS, and CIRSE certificates — monitor all GCC authority targets in one place. Free for all vascular surgeons.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors">Start tracking free →</Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Surgery CME", href: "/surgery-cme" },
              { label: "Cardiology CME", href: "/cardiology-cme" },
              { label: "Nephrology CME", href: "/nephrology-cme" },
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

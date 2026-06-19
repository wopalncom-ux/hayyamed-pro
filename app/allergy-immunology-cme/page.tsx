import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Allergy & Immunology CME Requirements in GCC 2026 | Hayya Med Pro",
  description:
    "CME and CPD requirements for allergists and clinical immunologists in Qatar, Saudi Arabia, UAE, and all GCC countries. QCHP, SCFHS, DHA allergy CME credits, AAAAI and EAACI accreditors, and subspecialty training.",
  keywords: [
    "allergy immunology CME GCC",
    "allergist CME requirements",
    "QCHP allergy immunology CPD",
    "SCFHS allergy CME",
    "DHA allergy immunology CME",
    "AAAAI CME GCC",
    "EAACI CME GCC",
    "clinical immunology CME",
    "GCC allergist license renewal",
    "allergy CME Middle East",
  ],
  openGraph: {
    title: "Allergy & Immunology CME in GCC 2026",
    description: "CME and CPD requirements for GCC allergists and clinical immunologists. QCHP, SCFHS, DHA credit targets, AAAAI and EAACI accreditors.",
    url: `${APP_URL}/allergy-immunology-cme`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/allergy-immunology-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do allergists need in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Allergists and clinical immunologists in Qatar (QCHP) require 80 CPD credits per 2-year cycle (40/year minimum). In Saudi Arabia (SCFHS), 60 CME credits per year. In Dubai (DHA), 40 CME credits per 2-year cycle. All GCC authorities classify allergy and immunology as a physician specialty subject to standard physician CME requirements.",
      },
    },
    {
      "@type": "Question",
      name: "Is allergy and immunology a growing specialty in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Allergic diseases are highly prevalent in the GCC — asthma rates in Qatar and UAE exceed 10%, allergic rhinitis affects up to 30% of the GCC population, and food allergy rates are rising. The GCC has invested significantly in allergy and immunology services, with KFSH (Riyadh), Hamad Medical Corporation (Doha), and Cleveland Clinic Abu Dhabi running major allergy immunology programs.",
      },
    },
    {
      "@type": "Question",
      name: "Does AAAAI CME count toward GCC license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. AAAAI (American Academy of Allergy, Asthma & Immunology) is ACCME-accredited and its educational activities carry AMA PRA Category 1 Credits™, recognized by QCHP, SCFHS, DHA, and all major GCC licensing authorities. The AAAAI Annual Scientific Meeting and AAAAI online CME are widely used by GCC allergists.",
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
    title: "Asthma & respiratory allergy",
    body: "GCC asthma prevalence exceeds 10% in Qatar and UAE, driven by indoor allergen sensitization, outdoor humidity-driven mold, and desert dust. AAAAI, ERS, and GINA-based CME on asthma biologics (dupilumab, benralizumab, mepolizumab, tezepelumab) are high-priority topics for GCC allergists. All carry AMA-PRA or EACCME accreditation.",
  },
  {
    title: "Food allergy & anaphylaxis",
    body: "Food allergy CME (sesame, tree nut, peanut, shellfish sensitization in GCC populations) and anaphylaxis management. WAO (World Allergy Organization) symposia and AAAAI food allergy CME provide up-to-date guidance. Oral immunotherapy (OIT) training is an emerging CME requirement for allergists offering food allergy desensitization.",
  },
  {
    title: "Allergen immunotherapy",
    body: "Subcutaneous immunotherapy (SCIT), sublingual immunotherapy (SLIT), and component-resolved diagnostics (CRD) CME. EAACI Immunotherapy Guidelines CME and AAAAI immunotherapy courses are the primary accredited sources. Desert-specific allergen panels (house dust mite, Salsola pollen, Bermuda grass) require GCC-specific training.",
  },
  {
    title: "Primary immunodeficiency (PID)",
    body: "Diagnosis and management of primary immunodeficiency disorders — common variable immunodeficiency (CVID), X-linked agammaglobulinemia, SCID, and complement deficiencies. IUIS (International Union of Immunological Societies) and ESID (European Society for Immunodeficiencies) provide accredited PID CME.",
  },
  {
    title: "Drug allergy & adverse reactions",
    body: "Beta-lactam allergy assessment, NSAID hypersensitivity, radiocontrast media reactions, and biologic drug allergy CME. Drug allergy is among the most clinically impactful allergy subspecialties in GCC hospitals. ENDA (European Network for Drug Allergy) and AAAAI drug allergy sections provide specialized CME.",
  },
  {
    title: "Allergic skin disease",
    body: "Atopic dermatitis (eczema), contact dermatitis, urticaria/angioedema, and mastocytosis CME. Biologic therapy for atopic dermatitis (dupilumab, tralokinumab) is rapidly evolving — EAACI, AAD, and AAAAI joint sessions provide updated accredited CME on biologic prescribing for skin allergy.",
  },
];

export default function AllergyImmunologyCme() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://hayyamed.pro" },
        { name: "Allergy & Immunology CME", url: "https://hayyamed.pro/allergy-immunology-cme" },
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
              <span>Allergy & Immunology</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4">Allergy & Immunology CME in GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl">
              CME and CPD requirements for allergists and clinical immunologists across all GCC licensing authorities — credit targets, AAAAI and EAACI accreditors, and subspecialty training.
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

          <h2 className="text-2xl font-bold text-[#111] mb-6">Allergy & immunology CME by subspecialty</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {SPECIALTY_NOTES.map((note) => (
              <div key={note.title} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h3 className="font-bold text-[#111] mb-2">{note.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{note.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-10">
            <h2 className="text-lg font-bold text-[#111] mb-4">Key allergy & immunology CME societies recognized in GCC</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { body: "AAAAI (American Academy of Allergy, Asthma & Immunology)", note: "ACCME-accredited — AMA PRA Category 1 Credits™ — recognized across all GCC" },
                { body: "EAACI (European Academy of Allergy and Clinical Immunology)", note: "EACCME-accredited — recognized by QCHP, DHA, and most GCC authorities" },
                { body: "WAO (World Allergy Organization)", note: "Global body — symposia carry EACCME/ACCME-affiliated CME credits" },
                { body: "ACAAI (American College of Allergy, Asthma & Immunology)", note: "ACCME-accredited — AMA PRA Category 1 Credits™ — recognized across GCC" },
                { body: "ESID (European Society for Immunodeficiencies)", note: "Primary immunodeficiency CME — EACCME-affiliated" },
                { body: "SACA (Saudi Allergy, Asthma, Immunology Society)", note: "SCFHS-accredited — directly recognized for Saudi CME" },
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your allergy & immunology CME</h2>
            <p className="text-[#64748b] mb-6 max-w-md mx-auto">Log AAAAI, EAACI, and WAO certificates — monitor all GCC licensing authority targets from one dashboard. Free for all allergists.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors">Start tracking free →</Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Dermatology CME", href: "/dermatology-cme" },
              { label: "Pulmonology CME", href: "/pulmonology-cme" },
              { label: "Rheumatology CME", href: "/rheumatology-cme" },
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

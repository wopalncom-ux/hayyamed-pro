import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Plastic & Reconstructive Surgery CME in GCC 2026 | Hayya Med Pro",
  description:
    "CME and CPD requirements for plastic surgeons in Qatar, Saudi Arabia, UAE, and all GCC countries. QCHP, SCFHS, DHA plastic surgery CME credits, IPRAS and ISAPS accreditors, and aesthetic surgery training.",
  keywords: [
    "plastic surgery CME GCC",
    "plastic surgeon CME requirements",
    "QCHP plastic surgery CPD",
    "SCFHS plastic surgery CME",
    "DHA plastic surgery CME",
    "reconstructive surgery CME",
    "aesthetic surgery CME GCC",
    "ISAPS CME",
    "GCC plastic surgeon license renewal",
  ],
  openGraph: {
    title: "Plastic & Reconstructive Surgery CME in GCC 2026",
    description: "CME and CPD requirements for GCC plastic surgeons. QCHP, SCFHS, DHA credit targets, IPRAS and ISAPS accreditors.",
    url: `${APP_URL}/plastic-surgery-cme`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/plastic-surgery-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do plastic surgeons need in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Plastic surgeons in Qatar (QCHP) need 80 CPD credits per 2-year cycle with a minimum of 40 per year. In Saudi Arabia (SCFHS), 60 CME credits per year. In Dubai (DHA), 40 CME credits per 2-year cycle. All GCC authorities apply the standard physician CME requirement to plastic surgeons.",
      },
    },
    {
      "@type": "Question",
      name: "Does aesthetic/cosmetic surgery CME count toward GCC license renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, aesthetic and cosmetic surgery CME from accredited providers counts toward GCC license renewal. ISAPS (International Society of Aesthetic Plastic Surgery) meetings, ASAPS courses, and EAPS (European Association of Plastic Surgeons) congresses carry CME credits from recognized accreditors accepted by QCHP, SCFHS, and DHA.",
      },
    },
    {
      "@type": "Question",
      name: "Is the GCC growing market for plastic surgery CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the GCC is one of the fastest-growing markets for aesthetic and reconstructive plastic surgery. Dubai and Riyadh are major aesthetic surgery centers. GCC plastic surgeons face both high CME demand from their licensing authorities and a rapidly evolving specialty requiring regular procedural training in liposuction, rhinoplasty, breast surgery, and burn reconstruction.",
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
    title: "Aesthetic & cosmetic surgery",
    body: "Rhinoplasty, breast augmentation, blepharoplasty, liposuction, and body contouring CME. Dubai and Riyadh are major aesthetic surgery hubs — ISAPS Middle East, Dubai Derma, and Arab Health sessions carry recognized CME. GCC's growing medical tourism market makes aesthetic surgery a high-demand specialty.",
  },
  {
    title: "Reconstructive surgery",
    body: "Breast reconstruction, trauma reconstruction, and post-cancer flap surgery CME from IPRAS (International Confederation for Plastic Reconstructive and Aesthetic Surgery) and ESPRS (European Society of Plastic, Reconstructive and Aesthetic Surgery). Burn reconstruction is especially relevant in GCC occupational health settings.",
  },
  {
    title: "Burn surgery",
    body: "Burn care CME is critical in GCC countries given high rates of industrial and domestic burns. The International Society for Burn Injuries (ISBI) provides burn surgery CME — verify accreditor recognition with your specific authority. Many GCC hospitals have dedicated burn units requiring specialized CME.",
  },
  {
    title: "Hand surgery",
    body: "Hand and upper extremity surgery CME from IFSSH (International Federation of Societies for Surgery of the Hand) and ASSH (American Society for Surgery of the Hand — ACCME-accredited). Peripheral nerve repair, tendon reconstruction, and microsurgery training carry CME credits recognized across GCC.",
  },
  {
    title: "Microsurgery & flap training",
    body: "Free flap reconstruction, perforator flaps, and microsurgical technique workshops carry CME credit from ACCME-accredited providers. Cadaveric microsurgery courses are widely recognized for CME purposes when run by accredited institutions.",
  },
  {
    title: "Craniofacial & pediatric plastic surgery",
    body: "Cleft lip/palate, craniosynostosis, and pediatric reconstructive surgery CME from IPRAS Craniofacial Society and ACPA (American Cleft Palate-Craniofacial Association — ACCME-accredited). Relevant to GCC countries with higher rates of consanguinity-associated congenital conditions.",
  },
];

export default function PlasticSurgeryCme() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://hayyamed.pro" },
        { name: "Plastic Surgery CME", url: "https://hayyamed.pro/plastic-surgery-cme" },
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
              <span>Plastic & Reconstructive Surgery</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111] tracking-tight mb-4">Plastic & Reconstructive Surgery CME in GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl">
              CME and CPD requirements for plastic surgeons across all GCC licensing authorities — credit targets, IPRAS and ISAPS accreditors, and subspecialty training programs.
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

          <h2 className="text-2xl font-bold text-[#111] mb-6">Plastic surgery CME by subspecialty</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {SPECIALTY_NOTES.map((note) => (
              <div key={note.title} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h3 className="font-bold text-[#111] mb-2">{note.title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">{note.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-10">
            <h2 className="text-lg font-bold text-[#111] mb-4">Key plastic surgery CME societies recognized in GCC</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { body: "IPRAS (International Confederation for Plastic Reconstructive and Aesthetic Surgery)", note: "Global umbrella body — member society events carry CME from recognized accreditors" },
                { body: "ISAPS (International Society of Aesthetic Plastic Surgery)", note: "Aesthetic surgery focus — ACCME-accredited CME activities" },
                { body: "ASPS (American Society of Plastic Surgeons)", note: "ACCME-accredited — AMA PRA Category 1 Credits™ — recognized across GCC" },
                { body: "ESPRS (European Society of Plastic, Reconstructive and Aesthetic Surgery)", note: "EACCME-accredited — recognized by QCHP, DHA, and most GCC authorities" },
                { body: "ASSH (American Society for Surgery of the Hand)", note: "ACCME-accredited — hand surgery CME" },
                { body: "SSPS (Saudi Society of Plastic Surgeons)", note: "SCFHS-accredited — directly recognized for Saudi CME" },
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your plastic surgery CME</h2>
            <p className="text-[#64748b] mb-6 max-w-md mx-auto">Log ISAPS, ASPS, and ESPRS certificates — track all GCC authority requirements in one place. Free for all surgeons.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors">Start tracking free →</Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Surgery CME", href: "/surgery-cme" },
              { label: "Dermatology CME", href: "/dermatology-cme" },
              { label: "QCHP — Qatar", href: "/qchp" },
              { label: "DHA — Dubai", href: "/dha" },
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

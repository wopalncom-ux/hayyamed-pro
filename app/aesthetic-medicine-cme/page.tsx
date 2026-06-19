import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Aesthetic Medicine CME Requirements in GCC — Aesthetic Physician CME Guide | Hayya Med Pro",
  description:
    "CME and CPD requirements for aesthetic medicine physicians in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track aesthetic medicine CME across all 7 GCC licensing authorities.",
  keywords: [
    "aesthetic medicine CME requirements GCC",
    "aesthetic physician CME Dubai",
    "DHA aesthetic medicine CME",
    "QCHP aesthetic medicine CPD",
    "aesthetic medicine CPD Qatar",
    "BCAM CME GCC",
    "aesthetic medicine license renewal GCC",
    "cosmetic medicine CME GCC",
    "aesthetic medicine CME tracker",
    "continuing medical education aesthetic GCC",
  ],
  openGraph: {
    title: "Aesthetic Medicine CME Requirements in GCC — Complete Aesthetic Physician Guide",
    description:
      "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB — CME and CPD requirements for aesthetic medicine physicians across all 7 GCC countries.",
    url: `${APP_URL}/aesthetic-medicine-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Aesthetic+Medicine+CME+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+all+7+GCC+authorities+%C2%B7+Free+to+track&a=%E2%9C%A8+Aesthetic+Medicine&k=Specialty+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aesthetic Medicine CME Requirements in GCC",
    description: "Complete CME guide for aesthetic medicine physicians in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
  },
  alternates: { canonical: `${APP_URL}/aesthetic-medicine-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does an aesthetic medicine physician need in Dubai (DHA)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aesthetic medicine physicians licensed by DHA must complete 40 CME credits per 2-year cycle, including 5 credits in patient safety. DHA is the primary licensing authority for the large private aesthetic medicine sector in Dubai. CME events from BCAM, AAAM, AMWC, and IMCAS carry EACCME or ACCME accreditation recognized by DHA. Botulinum toxin and filler training workshops from accredited providers also carry DHA CME credit.",
      },
    },
    {
      "@type": "Question",
      name: "Do IMCAS, AMWC, or Esthetic World events count toward QCHP CPD for aesthetic medicine in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. IMCAS (International Master Course on Aging Science) and AMWC (Aesthetic & Anti-Aging Medicine World Congress) are major aesthetic medicine conferences that carry EACCME accreditation. EACCME is recognized by QCHP. The Qatar Dermatology Society and Qatar Medical Association also organize QCHP-accredited aesthetic medicine CME events locally. Always obtain a certificate with the accreditor and credit count.",
      },
    },
    {
      "@type": "Question",
      name: "Do botulinum toxin and dermal filler training courses count as CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hands-on training courses in botulinum toxin injection, hyaluronic acid filler techniques, and advanced aesthetic procedures count as CME when offered by an accredited provider. Major aesthetic training centers (Allergan Medical Institute, Galderma Academy, Merz Institute) issue completion certificates that carry CE credit. Verify that the specific training course has formal ACCME or EACCME accreditation before assuming the credits will count for your GCC license.",
      },
    },
    {
      "@type": "Question",
      name: "Is aesthetic medicine a recognized specialty for licensing in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aesthetic medicine is a recognized sub-specialty in GCC, but licensing requirements vary by country. DHA and DOH in UAE have the most developed aesthetic medicine licensing frameworks, with specific scope-of-practice rules for aesthetic procedures. QCHP in Qatar and SCFHS in Saudi Arabia license aesthetic procedures under general medicine or dermatology scope, with DHA's and DOH's aesthetic medicine sub-specialty being the most clearly defined in GCC. Always verify your specific scope of practice license before advertising aesthetic services.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track aesthetic medicine CME for both DHA (Dubai) and DOH (Abu Dhabi) simultaneously?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-jurisdiction tracking. Aesthetic medicine physicians licensed in both Dubai (DHA) and Abu Dhabi (DOH) can maintain separate wallets within one account. EACCME and ACCME-accredited conference credits can be assigned to both wallets — both DHA and DOH recognize international accreditation from these bodies.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "🇶🇦", name: "QCHP", country: "Qatar", term: "CPD", credits: "80", cycle: "2 years", note: "40/yr min" },
  { flag: "🇸🇦", name: "SCFHS", country: "Saudi Arabia", term: "CME", credits: "60", cycle: "1 year", note: "Annual renewal" },
  { flag: "🇦🇪", name: "DHA", country: "UAE (Dubai)", term: "CME", credits: "40", cycle: "2 years", note: "5 patient safety req." },
  { flag: "🇦🇪", name: "DOH", country: "UAE (Abu Dhabi)", term: "CPD", credits: "40", cycle: "2 years", note: "Mixed categories" },
  { flag: "🇰🇼", name: "MOH", country: "Kuwait", term: "CME", credits: "30", cycle: "1 year", note: "Annual renewal" },
  { flag: "🇧🇭", name: "NHRA", country: "Bahrain", term: "CPD", credits: "40", cycle: "2 years", note: "Structured + unstr." },
  { flag: "🇴🇲", name: "OMSB", country: "Oman", term: "CME", credits: "40", cycle: "2 years", note: "Category A & B" },
];

const SPECIALTY_NOTES = [
  {
    icon: "✨",
    title: "GCC is the fastest-growing aesthetic market",
    body: "UAE (especially Dubai) and Saudi Arabia are among the fastest-growing aesthetic medicine markets globally. DHA licenses hundreds of aesthetic medicine practitioners and has the most clearly defined sub-specialty licensing in GCC. Aesthetic physicians at private clinics in Dubai, Abu Dhabi, and Riyadh are individually responsible for their CME compliance — no employer typically manages this for them.",
  },
  {
    icon: "💉",
    title: "IMCAS and AMWC — key aesthetic CME events",
    body: "IMCAS World Congress (January, Paris) and AMWC Monaco carry EACCME accreditation recognized by all GCC authorities. The Esthetic World Arabia congress (Dubai) and Arab Aesthetic Congress are regional events that carry DHA and DOH recognition. GCC aesthetic physicians attending international courses should confirm EACCME or ACCME accreditation before attendance.",
  },
  {
    icon: "🏥",
    title: "Manufacturer training academies",
    body: "Allergan Medical Institute, Galderma Academy, Merz Institute, and Ipsen Aesthetics all offer physician training with CME/CE credit. These manufacturer-sponsored programs carry varying levels of accreditation — Allergan Medical Institute courses carry AMA PRA Category 1 Credit. Verify accreditation per course before counting toward your GCC license renewal.",
  },
  {
    icon: "📊",
    title: "Patient safety CME is mandatory in DHA",
    body: "DHA requires 5 of your 40 CME credits to be in patient safety topics. For aesthetic medicine physicians, this could include complication management, anaphylaxis protocols, filler vascular occlusion response, and infection prevention in aesthetic procedures. Patient safety courses from JCI, ISQUA, and IHI carry DHA-recognized accreditation.",
  },
];

export default function AestheticMedicineCmePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="min-h-screen bg-[#f8fafc]">
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <span className="font-bold text-base text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
            </Link>
            <Link href="/register" className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors">
              Start free →
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              ✨ Aesthetic Medicine · All GCC Licensing Authorities
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Aesthetic medicine CME requirements<br className="hidden sm:block" /> across the GCC
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Track CME and CPD credits for your aesthetic medicine license across every GCC authority — DHA, QCHP, SCFHS, and more — in one compliance platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">
                Track my aesthetic CME — free →
              </Link>
              <Link href="/physician-cme" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors">
                See all physician CME requirements
              </Link>
            </div>
            <p className="text-xs text-[#64748b] mt-3">No credit card required · 14-day Pro trial included</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-5 border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111]">CME/CPD requirements by GCC authority</h2>
              <p className="text-sm text-[#64748b] mt-1">General physician requirements apply — aesthetic medicine specific notes and DHA patient safety requirement below</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Authority</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Country</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Term</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Credits</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Cycle</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {AUTHORITIES.map((a, i) => (
                    <tr key={a.name} className={i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
                      <td className="px-6 py-3.5 font-semibold text-[#111]">{a.flag} {a.name}</td>
                      <td className="px-4 py-3.5 text-[#374151]">{a.country}</td>
                      <td className="px-4 py-3.5"><span className="bg-[#eff6ff] text-[#1a56a0] text-xs font-semibold px-2 py-0.5 rounded">{a.term}</span></td>
                      <td className="px-4 py-3.5 font-bold text-[#1a56a0]">{a.credits}</td>
                      <td className="px-4 py-3.5 text-[#374151]">{a.cycle}</td>
                      <td className="px-4 py-3.5 text-xs text-[#64748b]">{a.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-5">What aesthetic medicine physicians need to know about GCC CME</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SPECIALTY_NOTES.map((n) => (
                <div key={n.title} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                  <div className="text-2xl mb-3">{n.icon}</div>
                  <h3 className="text-sm font-semibold text-[#111] mb-1.5">{n.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{n.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">Aesthetic medicine CME — frequently asked questions</h2>
            <div className="space-y-3">
              {faqLd.mainEntity.map((item) => (
                <details key={item.name} className="bg-white rounded-xl border border-[#e2e8f0] group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-[#111] list-none">
                    {item.name}
                    <svg className="w-4 h-4 text-[#64748b] flex-shrink-0 ml-4 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-[#64748b] border-t border-[#f1f5f9] pt-3 leading-relaxed">
                    {item.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1f3d] rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Track your aesthetic medicine CME across all GCC authorities</h2>
            <p className="text-[#64748b] text-sm mb-6 max-w-lg mx-auto">
              Log IMCAS, AMWC, and manufacturer academy credits — Hayya Med Pro tracks compliance for DHA, QCHP, SCFHS, and every other active GCC license.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f6ff] transition-colors">
              Start tracking free →
            </Link>
            <p className="text-xs text-[#64748b] mt-3">No credit card required · Free plan available</p>
          </div>
        </main>
      </div>
    </>
  );
}

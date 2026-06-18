import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Palliative Care CME Requirements in GCC — Palliative Medicine CME Guide | Hayya Med Pro",
  description:
    "CME and CPD requirements for palliative care and pain medicine physicians in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track palliative care CME across all 7 GCC licensing authorities.",
  keywords: [
    "palliative care CME requirements GCC",
    "palliative medicine CME Saudi Arabia",
    "SCFHS palliative care CME",
    "QCHP palliative care CPD",
    "palliative care CPD Qatar",
    "pain medicine CME GCC",
    "EAPC CME GCC",
    "AAHPM CME GCC",
    "palliative care license renewal GCC",
    "continuing medical education palliative care",
  ],
  openGraph: {
    title: "Palliative Care CME Requirements in GCC — Complete Palliative Medicine Guide",
    description:
      "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB — CME and CPD requirements for palliative care and pain medicine physicians across all 7 GCC countries.",
    url: `${APP_URL}/palliative-care-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Palliative+Care+CME+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+all+7+GCC+authorities+%C2%B7+Free+to+track&a=%F0%9F%92%99+Palliative+Care&k=Specialty+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Palliative Care CME Requirements in GCC",
    description: "Complete CME guide for palliative care physicians in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
  },
  alternates: { canonical: `${APP_URL}/palliative-care-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a palliative care physician need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Palliative care and pain medicine physicians registered with SCFHS must complete 60 CME credits per year. EAPC (European Association for Palliative Care), AAHPM (American Academy of Hospice and Palliative Medicine), and IASP (International Association for the Study of Pain) events carry EACCME or ACCME accreditation recognized by SCFHS. The Saudi Palliative Care Society also organizes SCFHS-accredited CME events.",
      },
    },
    {
      "@type": "Question",
      name: "Do EAPC or AAHPM conferences count toward QCHP CPD for palliative care in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. QCHP accepts EACCME-accredited events (EAPC World Research Congress, European Pain Congress) and ACCME-accredited events (AAHPM Annual Assembly, ASCO Palliative Care sessions). The National Center for Cancer Care and Research (NCCCR) in Qatar and Qatar Cancer Society organize QCHP-recognized palliative care CME locally. Always obtain a certificate with the accreditor and credit count.",
      },
    },
    {
      "@type": "Question",
      name: "Is palliative care a recognized specialty in GCC and how does it affect CME requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Palliative care is a recognized specialty in all GCC countries, with Qatar and Saudi Arabia leading in dedicated palliative care infrastructure. Qatar's National Cancer Strategy and Saudi Arabia's Vision 2030 healthcare expansion have both driven significant investment in palliative care services. CME requirements for palliative care specialists are the same as general physicians — the specialty designation determines scope of practice and training, not the CME credit targets.",
      },
    },
    {
      "@type": "Question",
      name: "Do pain management procedures (interventional pain, nerve blocks) count as CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hands-on pain management training — spinal cord stimulation workshops, nerve block simulation, interventional pain procedures — counts as CME when offered by accredited providers. ASRA (American Society of Regional Anesthesia — ACCME) and ESRA (EACCME) events covering pain procedures are recognized by all GCC authorities. Simulation-based procedural training typically earns more credits per hour than lecture-based activities.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track palliative care CME for multiple GCC authorities in one platform?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-jurisdiction CME tracking. Palliative care physicians working across Qatar and Saudi Arabia (or any GCC combination) can maintain separate wallets within one account. EACCME and ACCME-accredited conference credits can be assigned to both wallets — both QCHP and SCFHS recognize these international accreditation bodies.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "🇶🇦", name: "QCHP", country: "Qatar", term: "CPD", credits: "80", cycle: "2 years", note: "40/yr min" },
  { flag: "🇸🇦", name: "SCFHS", country: "Saudi Arabia", term: "CME", credits: "60", cycle: "1 year", note: "EAPC/AAHPM recognized" },
  { flag: "🇦🇪", name: "DHA", country: "UAE (Dubai)", term: "CME", credits: "40", cycle: "2 years", note: "5 patient safety" },
  { flag: "🇦🇪", name: "DOH", country: "UAE (Abu Dhabi)", term: "CPD", credits: "40", cycle: "2 years", note: "Mixed categories" },
  { flag: "🇰🇼", name: "MOH", country: "Kuwait", term: "CME", credits: "30", cycle: "1 year", note: "Annual renewal" },
  { flag: "🇧🇭", name: "NHRA", country: "Bahrain", term: "CPD", credits: "40", cycle: "2 years", note: "Structured + unstr." },
  { flag: "🇴🇲", name: "OMSB", country: "Oman", term: "CME", credits: "40", cycle: "2 years", note: "Category A & B" },
];

const SPECIALTY_NOTES = [
  {
    icon: "💙",
    title: "GCC national cancer strategies driving palliative care",
    body: "Qatar National Cancer Strategy 2023–2030, Saudi Vision 2030 health pillar, and UAE Cancer Control Program have all identified palliative care expansion as a priority. NCCCR (Qatar), King Hussein Cancer Center (Jordan regional influence), and King Faisal Specialist Hospital all run active palliative care CME programs with GCC authority recognition.",
  },
  {
    icon: "🌿",
    title: "EAPC and AAHPM — primary palliative care CME organizations",
    body: "EAPC (European Association for Palliative Care) World Research Congress carries EACCME accreditation. AAHPM (American Academy of Hospice and Palliative Medicine) Annual Assembly carries ACCME accreditation. Both are accepted by all GCC authorities. EAPC also offers the EAPC Online Education program with modular EACCME-accredited content.",
  },
  {
    icon: "💊",
    title: "Pain medicine and opioid prescribing CME",
    body: "GCC countries have developed specific opioid regulatory frameworks for palliative and cancer pain management. CME focused on opioid prescribing in palliative settings, cancer pain protocols, and GCC-specific controlled substance regulations is highly relevant. IASP (International Association for the Study of Pain) Pain School events carry EACCME accreditation.",
  },
  {
    icon: "📊",
    title: "Communication skills and ethics — CME category eligible",
    body: "Structured communication skills courses in end-of-life discussions, family meetings, and goals-of-care conversations carry CME credit at GCC authorities under the non-clinical or professional development category. VitalTalk, SPIKES training, and similar programs with ACCME accreditation are recognized. These typically count toward the non-clinical credit category.",
  },
];

export default function PalliativeCareCmePage() {
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
              💙 Palliative Care · All GCC Licensing Authorities
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Palliative care CME requirements<br className="hidden sm:block" /> across the GCC
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Track CME and CPD credits for your palliative care or pain medicine license across every GCC authority — QCHP, SCFHS, DHA, and more — in one compliance platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">
                Track my palliative care CME — free →
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
              <p className="text-sm text-[#64748b] mt-1">General physician requirements apply to palliative care specialists — specialty notes below</p>
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
            <h2 className="text-xl font-bold text-[#111] mb-5">What palliative care physicians need to know about GCC CME</h2>
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
            <h2 className="text-xl font-bold text-[#111] mb-6">Palliative care CME — frequently asked questions</h2>
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your palliative care CME across all GCC authorities</h2>
            <p className="text-[#64748b] text-sm mb-6 max-w-lg mx-auto">
              Log EAPC, AAHPM, and pain medicine credits once — Hayya Med Pro calculates compliance for every active GCC license automatically.
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

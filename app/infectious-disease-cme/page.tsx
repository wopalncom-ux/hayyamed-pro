import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Infectious Disease CME Requirements in GCC — ID Specialist CME Guide | Hayya Med Pro",
  description:
    "CME and CPD requirements for infectious disease specialists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track ID CME across all 7 GCC licensing authorities.",
  keywords: [
    "infectious disease CME requirements GCC",
    "infectious disease CME Saudi Arabia",
    "SCFHS infectious disease CME",
    "QCHP infectious disease CPD",
    "ID specialist CME GCC",
    "infection control CME GCC",
    "antimicrobial stewardship CME",
    "infectious disease license renewal GCC",
    "tropical medicine CME GCC",
    "COVID CME infectious disease",
  ],
  openGraph: {
    title: "Infectious Disease CME Requirements in GCC — Complete ID Specialist Guide",
    description: "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB — CME and CPD requirements for infectious disease specialists across all 7 GCC countries.",
    url: `${APP_URL}/infectious-disease-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Infectious+Disease+CME+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+all+7+GCC+authorities&a=%F0%9F%A6%A0+ID&k=Specialty+Guide`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Infectious Disease CME Requirements in GCC", description: "Complete CME guide for infectious disease specialists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman." },
  alternates: { canonical: `${APP_URL}/infectious-disease-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does an infectious disease specialist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: { "@type": "Answer", text: "Infectious disease specialists registered with SCFHS must complete 60 CME credits per year. Activities from IDSA, ESCMID, Saudi Society for Infectious Diseases and Clinical Microbiology (SSIDCM), and other internationally accredited bodies count when accredited by SCFHS-approved accreditors." },
    },
    {
      "@type": "Question",
      name: "Does infection control and antimicrobial stewardship CME count in Qatar?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Infection prevention and control (IPC) training and antimicrobial stewardship programs offered by accredited providers count as CME at QCHP. These activities are particularly valued by hospital employers working toward JCI and CBAHI accreditation, which require documented IPC competency." },
    },
    {
      "@type": "Question",
      name: "Do MERS-CoV and emerging pathogen CME activities count for GCC infectious disease specialists?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Accredited activities on MERS-CoV, COVID-19, respiratory infectious diseases, and emerging pathogens count as CME at QCHP and SCFHS. Given the GCC's geographic proximity to MERS-endemic regions, many authorities actively encourage this type of continuing education." },
    },
    {
      "@type": "Question",
      name: "Does tropical medicine and travel health CME count for infectious disease in GCC?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Tropical medicine, parasitology, and travel health are recognized subspecialties within infectious disease. Accredited activities in these areas count toward your ID CME requirements at QCHP and SCFHS. The GCC sees a high volume of healthcare workers with international travel exposure, making this especially relevant." },
    },
    {
      "@type": "Question",
      name: "Can I track infectious disease CME for multiple GCC countries in Hayya Med Pro?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Hayya Med Pro supports multi-jurisdiction wallets. Log an activity once and assign it to both your QCHP and SCFHS wallets. Each wallet tracks its own credit total, cycle dates, and compliance status independently." },
    },
  ],
};

const AUTHORITIES = [
  { flag: "🇶🇦", name: "QCHP", country: "Qatar", term: "CPD", credits: "80", cycle: "2 years", note: "40/yr min" },
  { flag: "🇸🇦", name: "SCFHS", country: "Saudi Arabia", term: "CME", credits: "60", cycle: "1 year", note: "SSIDCM events recognized" },
  { flag: "🇦🇪", name: "DHA", country: "UAE (Dubai)", term: "CME", credits: "40", cycle: "2 years", note: "5 patient safety" },
  { flag: "🇦🇪", name: "DOH", country: "UAE (Abu Dhabi)", term: "CPD", credits: "50", cycle: "2 years", note: "Physicians" },
  { flag: "🇰🇼", name: "MOH", country: "Kuwait", term: "CME", credits: "30", cycle: "1 year", note: "Annual renewal" },
  { flag: "🇧🇭", name: "NHRA", country: "Bahrain", term: "CPD", credits: "40", cycle: "2 years", note: "Structured + unstr." },
  { flag: "🇴🇲", name: "OMSB", country: "Oman", term: "CME", credits: "40", cycle: "2 years", note: "Category A & B" },
];

const SPECIALTY_NOTES = [
  { icon: "🦠", title: "IDSA, ESCMID, and SSIDCM recognized", body: "IDSA, ESCMID, ASM, ISID, and Saudi Society for Infectious Diseases and Clinical Microbiology (SSIDCM) accredited activities count toward ID CME at QCHP and SCFHS. Annual IDSA conference activities qualify as Category A CME." },
  { icon: "🏥", title: "IPC and antimicrobial stewardship CME", body: "Infection prevention and control training and antimicrobial stewardship programs are increasingly mandatory for GCC hospital accreditation (JCI, CBAHI). These activities count as CME and are often required by hospital employers regardless of licensing authority requirements." },
  { icon: "✈️", title: "Tropical medicine and travel health", body: "Tropical medicine, parasitology, HIV/AIDS management, and travel medicine are recognized subspecialties. GCC healthcare sees diverse pathogen exposure given the region's international healthcare workforce — these CME activities are well-recognized." },
  { icon: "⚠️", title: "MERS-CoV and emerging pathogen relevance", body: "The GCC has unique infectious disease priorities: MERS-CoV surveillance, hajj and umrah mass gathering medicine, and emerging respiratory pathogens. Accredited activities in these areas count as CME and are strongly encouraged by QCHP and SCFHS." },
];

export default function InfectiousDiseaseCmePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="min-h-screen bg-[#f8fafc]">
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center"><span className="text-white text-sm font-bold">H</span></div>
              <span className="font-bold text-base text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
            </Link>
            <Link href="/register" className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors">Start free →</Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">🦠 Infectious Disease · All GCC Licensing Authorities</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">Infectious disease CME requirements<br className="hidden sm:block" /> across the GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">Track CME and CPD credits for your infectious disease license across every GCC authority — QCHP, SCFHS, DHA, and more — in one compliance platform.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">Track my ID CME — free →</Link>
              <Link href="/cme-calculator" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors">Calculate my CME gap →</Link>
            </div>
            <p className="text-xs text-[#64748b] mt-3">No credit card required · 14-day Pro trial included</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-5 border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111]">CME/CPD requirements by GCC authority</h2>
              <p className="text-sm text-[#64748b] mt-1">Physician-level requirements apply to all ID subspecialties including clinical microbiology and infection control</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-[#f8fafc]">{["Authority", "Country", "Term", "Credits", "Cycle", "Note"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">{h}</th>)}</tr></thead>
                <tbody>
                  {AUTHORITIES.map((a, i) => (
                    <tr key={a.name} className={i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"}>
                      <td className="px-4 py-3.5 font-semibold text-[#111]">{a.flag} {a.name}</td>
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
            <h2 className="text-xl font-bold text-[#111] mb-5">What ID specialists need to know about GCC CME</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SPECIALTY_NOTES.map(n => (
                <div key={n.title} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                  <div className="text-2xl mb-3">{n.icon}</div>
                  <h3 className="text-sm font-semibold text-[#111] mb-1.5">{n.title}</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">{n.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">Infectious disease CME — frequently asked questions</h2>
            <div className="space-y-3">
              {faqLd.mainEntity.map(item => (
                <details key={item.name} className="bg-white rounded-xl border border-[#e2e8f0] group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-[#111] list-none">
                    {item.name}
                    <svg className="w-4 h-4 text-[#64748b] flex-shrink-0 ml-4 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                  </summary>
                  <div className="px-5 pb-4"><p className="text-sm text-[#374151] leading-relaxed">{item.acceptedAnswer.text}</p></div>
                </details>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1f3d] rounded-2xl px-8 py-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Track your infectious disease CME automatically</h2>
            <p className="text-[#64748b] mb-6 text-sm max-w-md mx-auto">Log activities, monitor your compliance ring, and get renewal alerts — free for all GCC healthcare professionals.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors">Start tracking free →</Link>
            <p className="text-[#64748b] text-xs mt-4">Hayya Med Pro supports CME/CPD tracking. It does not issue licenses. Always verify requirements with your licensing authority.</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {[{ label: "← All physician CME", href: "/physician-cme" }, { label: "QCHP CPD guide", href: "/qchp" }, { label: "SCFHS CME guide", href: "/scfhs" }, { label: "CME calculator", href: "/cme-calculator" }, { label: "Internal medicine CME", href: "/internal-medicine-cme" }].map(l => (
              <Link key={l.href} href={l.href} className="text-xs text-[#64748b] hover:text-[#1a56a0] border border-[#e2e8f0] bg-white rounded-lg px-3 py-1.5 transition-colors">{l.label}</Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

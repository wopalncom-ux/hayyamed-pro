import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Radiology CME Requirements in GCC â€” Radiologist CME Guide | Hayya Med Pro",
  description:
    "CME and CPD requirements for radiologists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Radiation safety, AI imaging, and Saudi Radiology Society CME guidance.",
  keywords: [
    "radiology CME requirements GCC",
    "radiologist CME Saudi Arabia",
    "SCFHS radiology CME",
    "QCHP radiologist CPD",
    "radiology CPD Qatar",
    "radiation safety CME GCC",
    "Saudi Radiology Society CME",
    "AI radiology CME",
    "radiologist license renewal GCC",
    "continuing medical education radiology",
  ],
  openGraph: {
    title: "Radiology CME Requirements in GCC â€” Complete Radiologist Guide",
    description:
      "QCHP, SCFHS, DHA, DOH â€” CME requirements for radiologists. Radiation safety, AI imaging, Saudi Radiology Society events, and GCC licensing guidance.",
    url: `${APP_URL}/radiology-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Radiology+CME+Requirements+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+radiation+safety+%C2%B7+AI+imaging+CME&a=%F0%9F%A9%BB+Radiology&k=Specialty+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Radiology CME Requirements in GCC",
    description: "Complete CME guide for radiologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
  },
  alternates: { canonical: `${APP_URL}/radiology-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a radiologist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Radiologists registered with SCFHS must complete 60 CME credits per year. Events from the Saudi Radiology Society (SRS), Saudi Society of Radiology, and internationally recognized radiology bodies (RSNA, ESR, ACR) count when accredited by ACCME, EACCME, or an equivalent body. SCFHS also recognizes online radiology CME up to 50% of the annual total.",
      },
    },
    {
      "@type": "Question",
      name: "Is radiation safety training mandatory CME for radiologists in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Radiation safety training is required as part of hospital and regulatory compliance across GCC countries, and counts toward CME requirements in most authorities. QCHP and DHA both require relevant patient safety activities, which includes radiation protection and safety. Annual radiation safety updates mandated by hospital physics departments also qualify as CME.",
      },
    },
    {
      "@type": "Question",
      name: "Do RSNA or ECR conference credits count toward QCHP CPD for radiologists in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. RSNA Annual Meeting, ECR (European Congress of Radiology), and other internationally accredited radiology conferences are accepted by QCHP when the CME is from an ACCME, EACCME, or Royal College-recognized provider. Retain your CME certificate showing the accreditor and contact hours. QCHP requires 80 CPD credits per 2-year cycle.",
      },
    },
    {
      "@type": "Question",
      name: "Does AI in radiology training count as CME for GCC licensing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. AI and machine learning in radiology courses, when offered by accredited providers (RSNA AI courses, ACR AI programs, European School of Radiology), count as CME toward GCC licensing requirements. This is an emerging category recognized by SCFHS and QCHP as it falls under new imaging modalities and professional development.",
      },
    },
    {
      "@type": "Question",
      name: "How do I track radiology CME for multiple GCC licenses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayya Med Pro supports multi-wallet tracking. Create separate wallets for each licensing authority (QCHP, SCFHS, DHA) within one account. Each wallet has its own credit total, cycle dates, and compliance status. RSNA credits recognized by both QCHP and SCFHS can be assigned to both wallets with a single activity log entry.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP", country: "Qatar", term: "CPD", credits: "80", cycle: "2 years", note: "40/yr min" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia", term: "CME", credits: "60", cycle: "1 year", note: "SRS events recognized" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA", country: "UAE (Dubai)", term: "CME", credits: "40", cycle: "2 years", note: "5 patient safety" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH", country: "UAE (Abu Dhabi)", term: "CPD", credits: "40", cycle: "2 years", note: "Mixed categories" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH", country: "Kuwait", term: "CME", credits: "30", cycle: "1 year", note: "Annual renewal" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA", country: "Bahrain", term: "CPD", credits: "40", cycle: "2 years", note: "Structured + unstr." },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB", country: "Oman", term: "CME", credits: "40", cycle: "2 years", note: "Category A & B" },
];

const SPECIALTY_NOTES = [
  {
    icon: "â˜¢ï¸",
    title: "Radiation safety is mandatory",
    body: "Annual radiation safety and protection updates count as CME in all GCC authorities and are required as a condition of hospital radiation-use privileges. These typically earn 2-4 CME credits per session.",
  },
  {
    icon: "ðŸ¤–",
    title: "AI imaging courses count",
    body: "RSNA AI courses, ACR AI programs, and European School of Radiology AI modules count as CME toward SCFHS and QCHP requirements as new modality / professional development activities.",
  },
  {
    icon: "ðŸ†",
    title: "RSNA, ECR, ACR recognized",
    body: "RSNA Annual Meeting, ECR, and ACR events are accepted by SCFHS and QCHP when ACCME/EACCME accredited. Saudi Radiology Society events are directly recognized by SCFHS.",
  },
  {
    icon: "ðŸ“¡",
    title: "Teleradiology and reporting quality",
    body: "Teleradiology governance, structured reporting, and radiology quality improvement programs count as CPD in QCHP and other GCC authorities under the quality improvement category.",
  },
];

export default function RadiologyCmePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="min-h-screen bg-[#f8fafc]">
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <span className="font-bold text-base text-[#111]">
                Hayya Med <span className="text-[#1a56a0]">Pro</span>
              </span>
            </Link>
            <Link href="/register" className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors">
              Start free â†’
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              ðŸ©» Radiology Â· All GCC Licensing Authorities
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Radiology CME requirements<br className="hidden sm:block" /> across the GCC
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Track radiation safety, RSNA credits, AI imaging courses, and all radiology CME across every GCC licensing authority in one platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">
                Track my radiology CME â€” free â†’
              </Link>
              <Link href="/physician-cme" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors">
                See all physician CME requirements
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-3">No credit card required Â· 14-day Pro trial included</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-5 border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111]">CME/CPD requirements by GCC authority</h2>
              <p className="text-sm text-[#64748b] mt-1">General physician requirements apply to radiologists â€” radiation safety and specialty CME all count</p>
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
            <h2 className="text-xl font-bold text-[#111] mb-5">What radiologists need to know about GCC CME</h2>
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
            <h2 className="text-xl font-bold text-[#111] mb-6">Radiology CME â€” frequently asked questions</h2>
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

          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-5">Related CME guides</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { href: "/physician-cme", label: "All Physicians", icon: "ðŸ©º" },
                { href: "/allied-health-cpd", label: "Allied Health", icon: "ðŸ¦¿" },
                { href: "/qchp", label: "QCHP (Qatar)", icon: "ðŸ‡¶ðŸ‡¦" },
                { href: "/scfhs", label: "SCFHS (Saudi)", icon: "ðŸ‡¸ðŸ‡¦" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#1a56a0] hover:shadow-sm transition-all group">
                  <span className="text-2xl block mb-2">{l.icon}</span>
                  <p className="text-xs font-semibold text-[#111] group-hover:text-[#1a56a0] transition-colors">{l.label}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] rounded-2xl p-10 text-center">
            <div className="text-3xl mb-3">ðŸ©»</div>
            <h2 className="text-2xl font-bold text-white mb-2">Track your radiology CME â€” free</h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Log RSNA credits, radiation safety courses, AI imaging modules, and online CME all in one wallet. Set up your QCHP or SCFHS wallet in under 2 minutes.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#f0f7ff] transition-colors">
              Track my CME â€” free â†’
            </Link>
            <p className="text-xs text-[rgba(255,255,255,0.4)] mt-3">No credit card required Â· 14-day Pro trial included</p>
          </div>

          <div className="mt-6 bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e] text-center">
            Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Always verify final requirements with QCHP, SCFHS, DHA, or your relevant GCC authority.
          </div>
        </main>
      </div>
    </>
  );
}

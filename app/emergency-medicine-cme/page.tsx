import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Emergency Medicine CME Requirements in GCC â€” EM Physician CME Guide | Hayya Med Pro",
  description:
    "CME and CPD requirements for emergency medicine physicians in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track EM CME across all GCC authorities.",
  keywords: [
    "emergency medicine CME requirements GCC",
    "EM physician CME Saudi Arabia",
    "SCFHS emergency medicine CME",
    "QCHP emergency medicine CPD",
    "emergency physician CPD Qatar",
    "EM doctor CME tracker GCC",
    "ACLS ATLS CME GCC",
    "emergency medicine license renewal GCC",
    "continuing medical education emergency medicine",
    "Saudi Board Emergency Medicine CME",
  ],
  openGraph: {
    title: "Emergency Medicine CME Requirements in GCC â€” EM Physician Guide",
    description:
      "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB â€” CME requirements for emergency medicine physicians across all 7 GCC countries. ACLS, ATLS, simulation CME guidance.",
    url: `${APP_URL}/emergency-medicine-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Emergency+Medicine+CME+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+ACLS+%C2%B7+ATLS+%C2%B7+simulation+CME+guidance&a=%F0%9F%9A%91+Emergency+Med&k=Specialty+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emergency Medicine CME in GCC",
    description: "Complete CME guide for EM physicians in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
  },
  alternates: { canonical: `${APP_URL}/emergency-medicine-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does an emergency medicine physician need in Saudi Arabia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Emergency medicine physicians registered with SCFHS must complete 60 CME credits per year. ACLS and ATLS renewal courses are counted as CME when offered by an accredited provider (AHA, ATLS International, or SCFHS-recognized equivalent). Simulation-based training courses are also recognized. No more than 50% of credits may be from online activities.",
      },
    },
    {
      "@type": "Question",
      name: "Does ACLS renewal count as CME toward QCHP requirements in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. ACLS renewal from an AHA-accredited training center counts as CPD toward QCHP requirements. The credit hours awarded by the training center are accepted. Most QCHP-licensed emergency physicians also require ATLS, PALS, and BLS as hospital privilege requirements â€” these all count toward the 80 CPD/2yr total.",
      },
    },
    {
      "@type": "Question",
      name: "Does ATLS count as CME for DHA-licensed emergency physicians in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. ATLS (Advanced Trauma Life Support) renewal counts as CME toward DHA requirements when provided by an ACS-accredited training center. DHA requires 40 CME credits per 2-year cycle, so ATLS renewal (typically 8-16 hours) covers a meaningful portion of the total requirement.",
      },
    },
    {
      "@type": "Question",
      name: "Is simulation-based emergency medicine training recognized as CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. High-fidelity simulation training from accredited simulation centers is recognized as CME by QCHP, SCFHS, and DHA. Simulation CME often earns more credits per hour than lecture-based activities due to its active learning format. GCC has several SSIH-affiliated simulation centers whose courses count toward licensing authority requirements.",
      },
    },
    {
      "@type": "Question",
      name: "What emergency medicine conferences are recognized by SCFHS and QCHP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Saudi Emergency Medicine Conference (SEMC), Arab Emergency Medicine meetings, ACEP Scientific Assembly, and IFEM congresses are recognized by SCFHS and QCHP when accredited by an ACCME, EACCME, or equivalent body. Always retain certificates showing accreditor and credit hours. Hayya Med Pro lets you upload and store these certificates securely.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP", country: "Qatar", term: "CPD", credits: "80", cycle: "2 years", note: "40/yr min" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia", term: "CME", credits: "60", cycle: "1 year", note: "Simulation recognized" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA", country: "UAE (Dubai)", term: "CME", credits: "40", cycle: "2 years", note: "5 patient safety" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH", country: "UAE (Abu Dhabi)", term: "CPD", credits: "40", cycle: "2 years", note: "Mixed categories" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH", country: "Kuwait", term: "CME", credits: "30", cycle: "1 year", note: "Annual renewal" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA", country: "Bahrain", term: "CPD", credits: "40", cycle: "2 years", note: "Structured + unstr." },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB", country: "Oman", term: "CME", credits: "40", cycle: "2 years", note: "Category A & B" },
];

const SPECIALTY_NOTES = [
  {
    icon: "ðŸš‘",
    title: "ACLS + ATLS + PALS count as CME",
    body: "Life support certifications renewed through accredited training centers count toward CME/CPD across all GCC authorities. ACLS = 8 hrs, ATLS = 14 hrs, PALS = 14 hrs per renewal cycle.",
  },
  {
    icon: "ðŸŽ¯",
    title: "Simulation training recognized",
    body: "High-fidelity simulation from SSIH-affiliated centers is recognized by QCHP and SCFHS. Simulation courses typically earn more credits per contact hour than lecture-based CME.",
  },
  {
    icon: "ðŸ¥",
    title: "Point-of-care ultrasound (POCUS) courses",
    body: "POCUS training and credentialing courses count as procedural CME. Many GCC hospitals now require POCUS credentialing for EM privileges, making this double-value CME.",
  },
  {
    icon: "ðŸ“‹",
    title: "EM quality improvement counts",
    body: "Participating in departmental QI projects, triage audits, and mortality/morbidity reviews counts toward CPD in most GCC authorities. QCHP specifically recognizes quality improvement activities.",
  },
];

export default function EmergencyMedicineCmePage() {
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
              ðŸš‘ Emergency Medicine Â· All GCC Licensing Authorities
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Emergency medicine CME<br className="hidden sm:block" /> requirements in GCC
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Track ACLS, ATLS, simulation CME, and all EM continuing education credits across every GCC licensing authority in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">
                Track my EM CME â€” free â†’
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
              <p className="text-sm text-[#64748b] mt-1">General physician requirements apply to EM physicians â€” ACLS/ATLS/PALS count toward these totals</p>
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
            <h2 className="text-xl font-bold text-[#111] mb-5">What EM physicians need to know about GCC CME</h2>
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
            <h2 className="text-xl font-bold text-[#111] mb-6">Emergency medicine CME â€” frequently asked questions</h2>
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
                { href: "/surgery-cme", label: "Surgery CME", icon: "ðŸ”ª" },
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
            <div className="text-3xl mb-3">ðŸš‘</div>
            <h2 className="text-2xl font-bold text-white mb-2">Track your EM CME â€” free</h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Log ACLS, ATLS, PALS, simulation courses, and conferences all in one place. Set up your QCHP or SCFHS wallet in under 2 minutes.
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

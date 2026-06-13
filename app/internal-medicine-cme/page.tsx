import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Internal Medicine CME Requirements in GCC â€” Internist CME Guide | Hayya Med Pro",
  description:
    "Complete CME and CPD guide for internal medicine specialists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track all requirements in one compliance app.",
  keywords: [
    "internal medicine CME requirements GCC",
    "internist CME Saudi Arabia",
    "SCFHS internal medicine CME",
    "QCHP internist CPD",
    "internal medicine CPD Qatar",
    "general internal medicine CME tracker",
    "internist license renewal GCC",
    "internal medicine CME credits",
    "GCC internist compliance",
    "continuing medical education internal medicine",
  ],
  openGraph: {
    title: "Internal Medicine CME Requirements in GCC â€” Complete Internist Guide",
    description:
      "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB â€” CME and CPD requirements for internal medicine specialists across all 7 GCC countries.",
    url: `${APP_URL}/internal-medicine-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Internal+Medicine+CME+%E2%80%94+GCC+Guide&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+all+7+GCC+authorities+%C2%B7+Free+to+track&a=%F0%9F%A9%BA+Internal+Medicine&k=Specialty+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Internal Medicine CME Requirements in GCC",
    description: "Complete CME guide for internists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
  },
  alternates: { canonical: `${APP_URL}/internal-medicine-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does an internal medicine specialist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Internal medicine specialists registered with SCFHS must complete 60 CME credits per year. No more than 50% may come from online activities. SCFHS renewal cycles for internal medicine range from 1 to 3 years depending on the sub-specialization. Credits from ACP, ASN, or other internationally recognized bodies are accepted when the activity is accredited by ACCME, EACCME, or a recognized equivalent.",
      },
    },
    {
      "@type": "Question",
      name: "What are the QCHP CPD requirements for internists in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Internists in Qatar licensed by QCHP (DHP-AS under MOPH) must complete 80 CPD credits per 2-year renewal cycle. A minimum of 40 credits must be earned each year. QCHP requires at least 2 credits per cycle from patient safety activities. Subspecialty CME (nephrology, endocrinology, etc.) counts toward the general physician CPD total when the activity is from a recognized accreditor.",
      },
    },
    {
      "@type": "Question",
      name: "Do subspecialty conferences (ACP, ERS, EASD) count toward GCC CME requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Activities from internationally recognized bodies (ACCME/AMA-PRA in the US, EACCME in Europe, Royal Colleges in the UK) are generally accepted across GCC licensing authorities. Each authority may require the activity to be logged with proof of accreditation. Hayya Med Pro lets you record the accreditor for each activity so it's clear which credits are verified.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a mandatory ethics or patient safety CME component for internists in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. QCHP requires at least 2 CPD credits per cycle from patient safety and quality improvement activities. DHA requires at least 5 CME credits per 2-year cycle from patient safety programs. SCFHS requires ethics CME within the annual total but does not publish a separate minimum credit count. DOH, NHRA, and OMSB also include patient safety as a mandatory category.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track CME for multiple GCC licenses (Qatar and Saudi Arabia) in one place?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-wallet tracking â€” one wallet per licensing authority, all within the same account. Your QCHP (Qatar) and SCFHS (Saudi Arabia) requirements are tracked independently with separate credit totals, cycle dates, and compliance status. You can log one CME activity once and assign it to multiple wallets if the accreditor is recognized by each authority.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP", country: "Qatar", term: "CPD", credits: "80", cycle: "2 years", note: "40/yr min" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia", term: "CME", credits: "60", cycle: "1 year", note: "50% online max" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA", country: "UAE (Dubai)", term: "CME", credits: "40", cycle: "2 years", note: "5 patient safety" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH", country: "UAE (Abu Dhabi)", term: "CPD", credits: "40", cycle: "2 years", note: "Mixed categories" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH", country: "Kuwait", term: "CME", credits: "30", cycle: "1 year", note: "Annual renewal" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA", country: "Bahrain", term: "CPD", credits: "40", cycle: "2 years", note: "Structured + unstr." },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB", country: "Oman", term: "CME", credits: "40", cycle: "2 years", note: "Category A & B" },
];

const SPECIALTY_NOTES = [
  {
    icon: "ðŸ©º",
    title: "Subspecialty CME counts",
    body: "CME from nephrology, endocrinology, gastroenterology, rheumatology, and other IM subspecialty societies counts toward general physician requirements across all GCC authorities.",
  },
  {
    icon: "ðŸ†",
    title: "Specialty board recognition",
    body: "The Saudi Board of Internal Medicine (SBIM) accredits events that count toward SCFHS renewal. Arab Board events are recognized by QCHP and other GCC authorities.",
  },
  {
    icon: "ðŸ”¬",
    title: "Research and publications",
    body: "Published research, case reports, and teaching activities typically count toward SCFHS Category B and C credits (up to 20/yr). QCHP accepts similar academic activities toward CPD.",
  },
  {
    icon: "âš ï¸",
    title: "ACLS required by most hospitals",
    body: "While not always a licensing authority requirement, most GCC hospital privileges require valid ACLS certification. ACLS renewal counts as CME toward most authority requirements.",
  },
];

export default function InternalMedicineCmePage() {
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
          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              ðŸ©º Internal Medicine Â· All GCC Licensing Authorities
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Internal medicine CME<br className="hidden sm:block" /> requirements in GCC
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Track your CME and CPD requirements across every GCC licensing authority â€” QCHP, SCFHS, DHA, DOH, and more â€” in one compliance app built for internists.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">
                Track my CME â€” free â†’
              </Link>
              <Link href="/physician-cme" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors">
                See all physician CME requirements
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-3">No credit card required Â· 14-day Pro trial included</p>
          </div>

          {/* Requirements table */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-5 border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111]">CME/CPD requirements by GCC authority</h2>
              <p className="text-sm text-[#64748b] mt-1">General physician requirements apply to internal medicine specialists unless stated otherwise</p>
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Key rule</th>
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

          {/* Specialty notes */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-5">What internal medicine specialists need to know</h2>
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

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-[#111] mb-6">Internal medicine CME â€” frequently asked questions</h2>
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

          {/* Cross-links */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-5">Related CME guides</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { href: "/physician-cme", label: "All Physicians", icon: "ðŸ©º" },
                { href: "/qchp", label: "QCHP (Qatar)", icon: "ðŸ‡¶ðŸ‡¦" },
                { href: "/scfhs", label: "SCFHS (Saudi)", icon: "ðŸ‡¸ðŸ‡¦" },
                { href: "/cardiology-cme", label: "Cardiology CME", icon: "â¤ï¸" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#1a56a0] hover:shadow-sm transition-all group">
                  <span className="text-2xl block mb-2">{l.icon}</span>
                  <p className="text-xs font-semibold text-[#111] group-hover:text-[#1a56a0] transition-colors">{l.label}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] rounded-2xl p-10 text-center">
            <div className="text-3xl mb-3">ðŸ©º</div>
            <h2 className="text-2xl font-bold text-white mb-2">Start tracking your CME â€” free</h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Set up your wallet for QCHP, SCFHS, or any GCC authority in under 2 minutes. Free to start â€” upgrade for PDF reports and AI gap analysis.
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

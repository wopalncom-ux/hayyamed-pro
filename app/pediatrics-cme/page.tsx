import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Pediatrics CME Requirements in GCC â€” Pediatrician CME Guide | Hayya Med Pro",
  description:
    "CME and CPD requirements for pediatricians in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. PALS, NRP, and pediatric conference CME guidance.",
  keywords: [
    "pediatrics CME requirements GCC",
    "pediatrician CME Saudi Arabia",
    "SCFHS pediatrics CME",
    "QCHP pediatrician CPD",
    "pediatrics CPD Qatar",
    "PALS NRP CME GCC",
    "pediatrician CME tracker",
    "Saudi Pediatric Society CME",
    "pediatric license renewal GCC",
    "continuing medical education pediatrics",
  ],
  openGraph: {
    title: "Pediatrics CME Requirements in GCC â€” Complete Pediatrician Guide",
    description:
      "QCHP, SCFHS, DHA, DOH â€” CME requirements for pediatricians. PALS, NRP, Saudi Pediatric Society events, and all pediatric CME guidance for GCC authorities.",
    url: `${APP_URL}/pediatrics-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Pediatrics+CME+Requirements+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+PALS+%C2%B7+NRP+%C2%B7+Saudi+Pediatric+Society&a=%F0%9F%91%B6+Pediatrics&k=Specialty+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pediatrics CME Requirements in GCC",
    description: "Complete CME guide for pediatricians in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
  },
  alternates: { canonical: `${APP_URL}/pediatrics-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a pediatrician need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pediatricians registered with SCFHS must complete 60 CME credits per year. Events from the Saudi Pediatric Association (SPA), Saudi Neonatology Society, and internationally recognized pediatric bodies (AAP, ESPID) count when accredited by an ACCME, EACCME, or equivalent body. No more than 50% may come from online activities.",
      },
    },
    {
      "@type": "Question",
      name: "Does PALS count as CME for pediatricians in QCHP (Qatar)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. PALS (Pediatric Advanced Life Support) renewal from an AHA-accredited training center counts toward QCHP CPD requirements. PALS typically awards 14 hours of CME per renewal cycle. NRP (Neonatal Resuscitation Program) for neonatologists also counts. Both are commonly required for hospital privileges in addition to being valuable CME.",
      },
    },
    {
      "@type": "Question",
      name: "Is NRP (neonatal resuscitation program) recognized as CME in DHA Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. NRP renewal from an AAP-accredited training center is recognized as CME by DHA. DHA requires 40 CME credits per 2-year cycle for pediatricians. NRP renewal (typically 6-8 hours) plus annual PALS renewal accounts for a significant portion of this requirement.",
      },
    },
    {
      "@type": "Question",
      name: "Are AAP or ESPID conference credits accepted by GCC licensing authorities?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. AAP National Conference, ESPID, ESPR, and other internationally recognized pediatric conference credits are accepted by SCFHS, QCHP, and other GCC authorities when the activity is ACCME or EACCME accredited. Retain your certificate showing the accreditation body and credit hours for documentation.",
      },
    },
    {
      "@type": "Question",
      name: "Is child protection training mandatory CME for pediatricians in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Child protection training is increasingly required as a condition of hospital privileges across GCC, particularly in Qatar (QCHP) and UAE (DHA, DOH). While not always explicitly stated in licensing authority credit requirements, completing child safeguarding courses counts toward the mandatory patient safety or ethics CME component required by most GCC authorities.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP", country: "Qatar", term: "CPD", credits: "80", cycle: "2 years", note: "40/yr min" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia", term: "CME", credits: "60", cycle: "1 year", note: "SPA events recognized" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA", country: "UAE (Dubai)", term: "CME", credits: "40", cycle: "2 years", note: "5 patient safety" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH", country: "UAE (Abu Dhabi)", term: "CPD", credits: "40", cycle: "2 years", note: "Mixed categories" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH", country: "Kuwait", term: "CME", credits: "30", cycle: "1 year", note: "Annual renewal" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA", country: "Bahrain", term: "CPD", credits: "40", cycle: "2 years", note: "Structured + unstr." },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB", country: "Oman", term: "CME", credits: "40", cycle: "2 years", note: "Category A & B" },
];

const SPECIALTY_NOTES = [
  {
    icon: "ðŸ‘¶",
    title: "PALS and NRP count as CME",
    body: "PALS renewal (14 hrs, every 2 years) and NRP renewal (6-8 hrs, every 2 years) from accredited centers count as CME toward QCHP, SCFHS, and DHA requirements.",
  },
  {
    icon: "ðŸ¥",
    title: "Saudi Pediatric Association recognized",
    body: "Saudi Pediatric Association (SPA) and Saudi Neonatology Society events are recognized by SCFHS. Arab Board pediatrics events are recognized by QCHP and other GCC authorities.",
  },
  {
    icon: "ðŸ›¡ï¸",
    title: "Child protection training",
    body: "Child safeguarding and protection courses count toward the patient safety and ethics CME component required by QCHP, DHA, and other GCC authorities.",
  },
  {
    icon: "ðŸ’‰",
    title: "Vaccine and infection control updates",
    body: "Immunization update courses, infection control, and antimicrobial stewardship CME are recognized across all GCC authorities and are especially relevant for pediatricians.",
  },
];

export default function PediatricsCmePage() {
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
              ðŸ‘¶ Pediatrics Â· All GCC Licensing Authorities
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Pediatrics CME requirements<br className="hidden sm:block" /> across the GCC
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Track PALS, NRP, pediatric conference CME, and all continuing education credits for your pediatrics license across every GCC authority.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">
                Track my pediatrics CME â€” free â†’
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
              <p className="text-sm text-[#64748b] mt-1">General physician requirements apply to pediatricians â€” PALS, NRP, and pediatric CME all count</p>
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
            <h2 className="text-xl font-bold text-[#111] mb-5">What pediatricians need to know about GCC CME</h2>
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
            <h2 className="text-xl font-bold text-[#111] mb-6">Pediatrics CME â€” frequently asked questions</h2>
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
                { href: "/nurse-cpd", label: "Nursing CPD", icon: "ðŸ‘©â€âš•ï¸" },
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
            <div className="text-3xl mb-3">ðŸ‘¶</div>
            <h2 className="text-2xl font-bold text-white mb-2">Track your pediatrics CME â€” free</h2>
            <p className="text-[rgba(255,255,255,0.65)] mb-6 max-w-md mx-auto text-sm">
              Log PALS, NRP, AAP conferences, and online courses all in one wallet. Never miss a renewal deadline again.
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

import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Sports Medicine CME Requirements in GCC — Sports Physician CME Guide | Hayya Med Pro",
  description:
    "CME and CPD requirements for sports medicine physicians in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track sports medicine CME across all 7 GCC licensing authorities.",
  keywords: [
    "sports medicine CME requirements GCC",
    "sports physician CME Saudi Arabia",
    "SCFHS sports medicine CME",
    "QCHP sports medicine CPD",
    "sports medicine CPD Qatar",
    "sports medicine CME tracker",
    "FIMS CME GCC",
    "ACSM CME GCC",
    "sports medicine license renewal GCC",
    "continuing medical education sports medicine",
  ],
  openGraph: {
    title: "Sports Medicine CME Requirements in GCC — Complete Sports Physician Guide",
    description:
      "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB — CME and CPD requirements for sports medicine physicians across all 7 GCC countries.",
    url: `${APP_URL}/sports-medicine-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Sports+Medicine+CME+Requirements+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+all+7+GCC+authorities+%C2%B7+Free+to+track&a=%F0%9F%8F%83+Sports+Medicine&k=Specialty+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sports Medicine CME Requirements in GCC",
    description: "Complete CME guide for sports medicine physicians in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
  },
  alternates: { canonical: `${APP_URL}/sports-medicine-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a sports medicine physician need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sports medicine physicians registered with SCFHS must complete 60 CME credits per year. Events accredited by ACSM, FIMS, Saudi Sports Medicine Society, and other internationally recognized sports medicine bodies count toward this requirement when they carry ACCME or EACCME accreditation. No more than 50% may come from online activities.",
      },
    },
    {
      "@type": "Question",
      name: "Do ACSM or FIFA Medical courses count toward QCHP CPD for sports medicine in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. QCHP accepts CME activities from internationally accredited bodies including AMA-PRA (ACCME) and EACCME. ACSM Annual Meeting, FIMS Congress, and FIFA Medical courses with ACCME or equivalent accreditation qualify as CPD for QCHP. The Qatar Sports Medicine Association (QSMA) also runs QCHP-recognized events. Always retain your attendance certificate.",
      },
    },
    {
      "@type": "Question",
      name: "What sports medicine CME is most relevant for team physicians in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Team physicians at GCC football clubs (Saudi Pro League, Qatar Stars League, UAE Pro League) and national sports programs have specific CPD needs: pitch-side emergency care (FIMS Emergency Care in Sport), concussion management (Concussion in Sport Group protocols), anti-doping (WADA physician education — earns CE credit), musculoskeletal ultrasound, and mass gathering medicine (relevant for stadium events). All of these carry ACCME or EACCME accreditation recognized across GCC.",
      },
    },
    {
      "@type": "Question",
      name: "Does FIFA Medical Center of Excellence accreditation affect CME requirements in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Qatar's Aspetar Orthopaedic and Sports Medicine Hospital is a FIFA Medical Center of Excellence. Physicians working at Aspetar or other FIFA-affiliated centers may have access to institutional CME programs aligned with FIFA Medical accreditation standards. These institutional activities typically carry QCHP recognition. Physicians at FIFA-affiliated centers should verify that internally organized CME is formally accredited by QCHP for renewal purposes.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track sports medicine CME for both QCHP (Qatar) and SCFHS (Saudi Arabia) in one platform?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-jurisdiction CME tracking. Create separate wallets for QCHP and SCFHS within one account. Each wallet tracks independently with its own credit totals and renewal dates. Log an ACCME-accredited ACSM conference once and assign it to both wallets — ACCME accreditation is recognized by both QCHP and SCFHS.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "🇶🇦", name: "QCHP", country: "Qatar", term: "CPD", credits: "80", cycle: "2 years", note: "40/yr min" },
  { flag: "🇸🇦", name: "SCFHS", country: "Saudi Arabia", term: "CME", credits: "60", cycle: "1 year", note: "ACSM/FIMS recognized" },
  { flag: "🇦🇪", name: "DHA", country: "UAE (Dubai)", term: "CME", credits: "40", cycle: "2 years", note: "5 patient safety" },
  { flag: "🇦🇪", name: "DOH", country: "UAE (Abu Dhabi)", term: "CPD", credits: "40", cycle: "2 years", note: "Mixed categories" },
  { flag: "🇰🇼", name: "MOH", country: "Kuwait", term: "CME", credits: "30", cycle: "1 year", note: "Annual renewal" },
  { flag: "🇧🇭", name: "NHRA", country: "Bahrain", term: "CPD", credits: "40", cycle: "2 years", note: "Structured + unstr." },
  { flag: "🇴🇲", name: "OMSB", country: "Oman", term: "CME", credits: "40", cycle: "2 years", note: "Category A & B" },
];

const SPECIALTY_NOTES = [
  {
    icon: "🏃",
    title: "GCC sports investment driving demand",
    body: "Saudi Vision 2030, Qatar 2022 legacy programs, and UAE sports infrastructure expansion have created one of the fastest-growing sports medicine markets globally. Aspetar (Qatar), Saudi Sports Medicine Federation, and DHA sports medicine programs all generate QCHP/SCFHS-recognized CME events.",
  },
  {
    icon: "⚽",
    title: "Team physician CME — FIFA and FIMS",
    body: "FIMS (International Federation of Sports Medicine) congress and courses carry EACCME accreditation recognized across all GCC authorities. FIFA Medical courses carry CME credit for team physicians at affiliated clubs. The Gulf Cooperation Council Sports Medicine Federation (GCCSMF) events also carry GCC-authority recognition.",
  },
  {
    icon: "🔬",
    title: "WADA anti-doping education earns CE",
    body: "WADA's online anti-doping education program for physicians earns continuing education credits. Anti-doping certification and renewal is practically mandatory for team physicians in GCC professional sports — and it counts toward CME requirements at all 7 GCC authorities.",
  },
  {
    icon: "📊",
    title: "Mass gathering medicine in GCC",
    body: "With major sporting events (Formula 1 Saudi Arabia, Qatar Stars League, Abu Dhabi GP, Gulf Cup) and Hajj/Umrah mass gatherings, mass gathering medicine is a high-demand subspecialty. RCPCH and FIMS mass gathering medicine courses carry ACCME/EACCME accreditation recognized in GCC.",
  },
];

export default function SportsMedicineCmePage() {
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
              🏃 Sports Medicine · All GCC Licensing Authorities
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Sports medicine CME requirements<br className="hidden sm:block" /> across the GCC
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Track CME and CPD credits for your sports medicine license across every GCC authority — QCHP, SCFHS, DHA, and more — in one compliance platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">
                Track my sports medicine CME — free →
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
              <p className="text-sm text-[#64748b] mt-1">General physician requirements apply to sports medicine physicians — specialty-specific notes below</p>
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
            <h2 className="text-xl font-bold text-[#111] mb-5">What sports medicine physicians need to know about GCC CME</h2>
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
            <h2 className="text-xl font-bold text-[#111] mb-6">Sports medicine CME — frequently asked questions</h2>
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your sports medicine CME across all GCC authorities</h2>
            <p className="text-[#64748b] text-sm mb-6 max-w-lg mx-auto">
              Log FIMS, ACSM, and WADA CE credits once — Hayya Med Pro calculates compliance for every active GCC license automatically.
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

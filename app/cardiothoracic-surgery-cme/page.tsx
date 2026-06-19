import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Cardiothoracic Surgery CME Requirements in GCC — CT Surgeon CME Guide | Hayya Med Pro",
  description:
    "CME and CPD requirements for cardiothoracic surgeons in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track cardiothoracic surgery CME across all 7 GCC licensing authorities.",
  keywords: [
    "cardiothoracic surgery CME requirements GCC",
    "cardiac surgeon CME Saudi Arabia",
    "SCFHS cardiothoracic surgery CME",
    "QCHP cardiac surgery CPD",
    "cardiothoracic surgery CPD Qatar",
    "EACTS CME GCC",
    "STS CME GCC",
    "cardiac surgery license renewal GCC",
    "thoracic surgery CME GCC",
    "continuing medical education cardiac surgery",
  ],
  openGraph: {
    title: "Cardiothoracic Surgery CME Requirements in GCC — Complete CT Surgeon Guide",
    description:
      "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB — CME and CPD requirements for cardiothoracic surgeons across all 7 GCC countries.",
    url: `${APP_URL}/cardiothoracic-surgery-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Cardiothoracic+Surgery+CME+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+all+7+GCC+authorities+%C2%B7+Free+to+track&a=%F0%9F%AB%80+CT+Surgery&k=Specialty+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardiothoracic Surgery CME Requirements in GCC",
    description: "Complete CME guide for cardiothoracic surgeons in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman.",
  },
  alternates: { canonical: `${APP_URL}/cardiothoracic-surgery-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a cardiothoracic surgeon need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cardiothoracic surgeons registered with SCFHS must complete 60 CME credits per year. EACTS, STS, AATS, and Saudi Cardiac Society events carry EACCME or ACCME accreditation recognized by SCFHS. No more than 50% may come from online activities. Simulation-based surgical training typically earns higher credits per hour than lecture-based CME.",
      },
    },
    {
      "@type": "Question",
      name: "Do EACTS or STS Annual Meeting credits count toward QCHP CPD for cardiac surgeons in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. QCHP accepts EACCME-accredited events (EACTS Annual Meeting, ESCVS International Congress) and ACCME-accredited events (STS Annual Meeting, AATS Annual Meeting). The Qatar Heart Centre at HMC also organizes locally accredited QCHP CPD events in cardiothoracic surgery. Always retain your attendance certificate with credit count.",
      },
    },
    {
      "@type": "Question",
      name: "Do TAVI, LVAD, and MitraClip procedural training programs count as CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Structural heart disease training — TAVI implant courses, LVAD implant and management certification, MitraClip training programs, and transcatheter heart valve simulation — counts as CME when offered by an accredited provider. Medtronic, Edwards Lifesciences, and Abbott structural heart training programs issue completion certificates that typically carry AMA PRA Category 1 Credit or equivalent EACCME credit recognized across GCC.",
      },
    },
    {
      "@type": "Question",
      name: "Is robotic and minimally invasive cardiac surgery training counted as CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Robotic cardiac surgery training (da Vinci surgical system certification), minimally invasive thoracoscopic surgery courses, and VATS lobectomy workshops carry CME credit when organized by accredited providers. Intuitive Surgical's da Vinci training programs and EACTS MICS (Minimally Invasive Cardiac Surgery) courses carry EACCME accreditation recognized across GCC. Documentation of proctored cases may also constitute CME in some GCC authorities.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track CT surgery CME for both QCHP (Qatar) and SCFHS (Saudi Arabia) simultaneously?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-jurisdiction tracking for cardiothoracic surgeons with active licenses in multiple GCC countries. Create separate wallets for QCHP and SCFHS within one account. EACCME-accredited EACTS credits and ACCME-accredited STS credits can be assigned to both wallets — both authorities recognize these international accreditation bodies.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "🇶🇦", name: "QCHP", country: "Qatar", term: "CPD", credits: "80", cycle: "2 years", note: "40/yr min" },
  { flag: "🇸🇦", name: "SCFHS", country: "Saudi Arabia", term: "CME", credits: "60", cycle: "1 year", note: "EACTS/STS recognized" },
  { flag: "🇦🇪", name: "DHA", country: "UAE (Dubai)", term: "CME", credits: "40", cycle: "2 years", note: "5 patient safety" },
  { flag: "🇦🇪", name: "DOH", country: "UAE (Abu Dhabi)", term: "CPD", credits: "40", cycle: "2 years", note: "Mixed categories" },
  { flag: "🇰🇼", name: "MOH", country: "Kuwait", term: "CME", credits: "30", cycle: "1 year", note: "Annual renewal" },
  { flag: "🇧🇭", name: "NHRA", country: "Bahrain", term: "CPD", credits: "40", cycle: "2 years", note: "Structured + unstr." },
  { flag: "🇴🇲", name: "OMSB", country: "Oman", term: "CME", credits: "40", cycle: "2 years", note: "Category A & B" },
];

const SPECIALTY_NOTES = [
  {
    icon: "🫀",
    title: "EACTS and STS — primary CT surgery CME organizations",
    body: "EACTS (European Association for Cardio-Thoracic Surgery) Annual Meeting carries EACCME accreditation. STS (Society of Thoracic Surgeons) Annual Meeting carries ACCME accreditation. AATS (American Association for Thoracic Surgery) Annual Meeting also carries ACCME accreditation. All are accepted by all 7 GCC authorities. EACTS also offers an online education platform with modular EACCME-credited content.",
  },
  {
    icon: "🔬",
    title: "Structural heart disease training — a rapidly growing CME category",
    body: "TAVI, LVAD, transcatheter mitral valve repair (MitraClip, PASCAL), and transcatheter tricuspid valve programs all carry formal CE accreditation through manufacturer-organized proctoring and training programs. These programs typically issue AMA PRA Category 1 Credit certificates. Given the high case volumes at HMC Heart Centre (Qatar) and KFSH (Saudi Arabia), structural heart CME is in high demand.",
  },
  {
    icon: "🤖",
    title: "Robotic and MIS cardiac surgery certification",
    body: "Robotic cardiac surgery (Intuitive Surgical da Vinci) and minimally invasive cardiac surgery (EACTS MICS program, STS mini-thoracotomy courses) carry EACCME or ACCME accreditation. These advanced surgical technique programs are particularly relevant for GCC CT surgeons at tertiary centers adopting robotic platforms.",
  },
  {
    icon: "📊",
    title: "GCC CT surgery capacity expanding rapidly",
    body: "Hamad Medical Corporation Heart Centre (Qatar), King Faisal Specialist Hospital (Saudi Arabia), Cleveland Clinic Abu Dhabi, and Burjeel Medical City are all expanding CT surgery volumes. Gulf Cardiac Society (GCS) and Gulf Association for Cardiothoracic Surgery (GACS) organize GCC-authority-recognized CME events specifically for the regional CT surgical community.",
  },
];

export default function CardiothoracicSurgeryCmePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://hayyamed.pro" },
        { name: "Cardiothoracic Surgery CME", url: "https://hayyamed.pro/cardiothoracic-surgery-cme" },
      ]} />

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
              🫀 Cardiothoracic Surgery · All GCC Licensing Authorities
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              Cardiothoracic surgery CME requirements<br className="hidden sm:block" /> across the GCC
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              Track CME and CPD credits for your cardiothoracic surgery license across every GCC authority — QCHP, SCFHS, DHA, and more — in one compliance platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">
                Track my CT surgery CME — free →
              </Link>
              <Link href="/surgery-cme" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors">
                See general surgery CME requirements
              </Link>
            </div>
            <p className="text-xs text-[#64748b] mt-3">No credit card required · 14-day Pro trial included</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-5 border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111]">CME/CPD requirements by GCC authority</h2>
              <p className="text-sm text-[#64748b] mt-1">General physician requirements apply to cardiothoracic surgeons — specialty-specific notes below</p>
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
            <h2 className="text-xl font-bold text-[#111] mb-5">What cardiothoracic surgeons need to know about GCC CME</h2>
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
            <h2 className="text-xl font-bold text-[#111] mb-6">Cardiothoracic surgery CME — frequently asked questions</h2>
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your cardiothoracic surgery CME across all GCC authorities</h2>
            <p className="text-[#64748b] text-sm mb-6 max-w-lg mx-auto">
              Log EACTS, STS, AATS, and procedural training credits — Hayya Med Pro calculates compliance for every active GCC license automatically.
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

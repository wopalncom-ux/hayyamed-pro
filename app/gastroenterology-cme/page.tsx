import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { MedicalWebPageJsonLd } from "@/components/seo/MedicalWebPageJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Gastroenterology CME Requirements in GCC — GI CME Guide | Hayya Med Pro",
  description:
    "CME and CPD requirements for gastroenterologists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track GI CME across all 7 GCC licensing authorities.",
  keywords: [
    "gastroenterology CME requirements GCC",
    "gastroenterologist CME Saudi Arabia",
    "SCFHS gastroenterology CME",
    "QCHP gastroenterologist CPD",
    "GI CME requirements GCC",
    "gastroenterology license renewal",
    "hepatology CME GCC",
    "endoscopy CME requirements",
    "continuing medical education gastroenterology",
    "gastroenterologist CPD Qatar",
  ],
  openGraph: {
    title: "Gastroenterology CME Requirements in GCC — Complete GI Guide",
    description: "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB — CME and CPD requirements for gastroenterologists across all 7 GCC countries.",
    url: `${APP_URL}/gastroenterology-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Gastroenterology+CME+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+all+7+GCC+authorities&a=%F0%9F%AB%80+GI&k=Specialty+Guide`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Gastroenterology CME Requirements in GCC", description: "Complete CME guide for gastroenterologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman." },
  alternates: { canonical: `${APP_URL}/gastroenterology-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a gastroenterologist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: { "@type": "Answer", text: "Gastroenterologists registered with SCFHS must complete 60 CME credits per year. Activities from the Saudi Gastroenterology Association (SGA), WGO, UEGW, and DDW accredited by approved bodies count toward this requirement." },
    },
    {
      "@type": "Question",
      name: "Do endoscopy skills courses count as CME for GI doctors in Qatar?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Hands-on endoscopy skills courses (upper GI, colonoscopy, ERCP simulation) offered by accredited providers count as CME at QCHP and SCFHS. They typically qualify under the clinical practice or procedural skills category and often earn more credits per hour than lecture-based activities." },
    },
    {
      "@type": "Question",
      name: "Does hepatology training count toward gastroenterology CME requirements in GCC?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Hepatology, including liver disease management, viral hepatitis, and liver transplant medicine, is recognized as a subspecialty within gastroenterology. CME activities from liver societies (EASL, AASLD, APASL) count toward GI CME requirements in QCHP and SCFHS when the activity is accredited." },
    },
    {
      "@type": "Question",
      name: "Is there a minimum requirement for endoscopy-specific CME in GCC?",
      acceptedAnswer: { "@type": "Answer", text: "GCC authorities do not currently mandate a specific minimum for endoscopy CME, unlike some Western frameworks. However, hospitals performing accreditation (JCI, CBAHI) typically require that gastroenterologists maintain documented endoscopy competency, which can be evidenced through accredited hands-on courses." },
    },
    {
      "@type": "Question",
      name: "Can I track gastroenterology CME for multiple GCC countries at once?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Hayya Med Pro supports multi-jurisdiction wallets. Log an activity once and assign it to both your QCHP and SCFHS wallets simultaneously. Each wallet tracks its own cycle, credit total, and renewal deadline independently." },
    },
  ],
};

const AUTHORITIES = [
  { flag: "🇶🇦", name: "QCHP", country: "Qatar", term: "CPD", credits: "80", cycle: "2 years", note: "40/yr min" },
  { flag: "🇸🇦", name: "SCFHS", country: "Saudi Arabia", term: "CME", credits: "60", cycle: "1 year", note: "SGA events recognized" },
  { flag: "🇦🇪", name: "DHA", country: "UAE (Dubai)", term: "CME", credits: "40", cycle: "2 years", note: "5 patient safety" },
  { flag: "🇦🇪", name: "DOH", country: "UAE (Abu Dhabi)", term: "CPD", credits: "50", cycle: "2 years", note: "Physicians" },
  { flag: "🇰🇼", name: "MOH", country: "Kuwait", term: "CME", credits: "30", cycle: "1 year", note: "Annual renewal" },
  { flag: "🇧🇭", name: "NHRA", country: "Bahrain", term: "CPD", credits: "40", cycle: "2 years", note: "Structured + unstr." },
  { flag: "🇴🇲", name: "OMSB", country: "Oman", term: "CME", credits: "40", cycle: "2 years", note: "Category A & B" },
];

const SPECIALTY_NOTES = [
  { icon: "🔭", title: "Endoscopy courses count", body: "Upper GI, colonoscopy, ERCP, and EUS simulation courses from accredited providers qualify as CME under the procedural skills or clinical category. These often earn more credits per hour than lecture-based activities." },
  { icon: "🫀", title: "Hepatology and liver disease", body: "EASL, AASLD, and APASL accredited hepatology activities count toward GI CME at QCHP and SCFHS. Liver disease is a major subspecialty with high CME activity availability in the GCC." },
  { icon: "🏥", title: "GI society events recognized", body: "Saudi Gastroenterology Association (SGA), Arab Society of Gastroenterology (ASG), WGO, and DDW events are recognized by SCFHS and QCHP when accredited by an approved international or national body." },
  { icon: "📊", title: "IBD and endoscopy quality standards", body: "Participating in GI quality improvement programs and IBD management guidelines development earns academic CPD credits at QCHP and Category B credits at SCFHS." },
];

export default function GastroenterologyCmePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://hayyamed.pro" },
        { name: "Gastroenterology CME", url: "https://hayyamed.pro/gastroenterology-cme" },
      ]} />
      <MedicalWebPageJsonLd
        name="Gastroenterology CME"
        url="https://hayyamed.pro/gastroenterology-cme"
        description="CME and CPD requirements for gastroenterologists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track GI CME across all 7 GCC licensing authorities."
        keywords={["gastroenterology CME requirements GCC", "gastroenterologist CME Saudi Arabia", "SCFHS gastroenterology CME", "QCHP gastroenterologist CPD", "GI CME requirements GCC", "gastroenterology license renewal"]}
      />
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
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">🫁 Gastroenterology · All GCC Licensing Authorities</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">Gastroenterology CME requirements<br className="hidden sm:block" /> across the GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">Track CME and CPD credits for your gastroenterology license across every GCC authority — QCHP, SCFHS, DHA, and more — in one compliance platform.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">Track my GI CME — free →</Link>
              <Link href="/cme-calculator" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors">Calculate my CME gap →</Link>
            </div>
            <p className="text-xs text-[#64748b] mt-3">No credit card required · 14-day Pro trial included</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-5 border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111]">CME/CPD requirements by GCC authority</h2>
              <p className="text-sm text-[#64748b] mt-1">Physician-level requirements apply to all GI subspecialties including hepatology and endoscopy</p>
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
            <h2 className="text-xl font-bold text-[#111] mb-5">What gastroenterologists need to know about GCC CME</h2>
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
            <h2 className="text-xl font-bold text-[#111] mb-6">Gastroenterology CME — frequently asked questions</h2>
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your gastroenterology CME automatically</h2>
            <p className="text-[#64748b] mb-6 text-sm max-w-md mx-auto">Log activities, monitor your compliance ring, and get renewal alerts — free for all GCC healthcare professionals.</p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors">Start tracking free →</Link>
            <p className="text-[#64748b] text-xs mt-4">Hayya Med Pro supports CME/CPD tracking. It does not issue licenses. Always verify requirements with your licensing authority.</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {[{ label: "← All physician CME", href: "/physician-cme" }, { label: "QCHP CPD guide", href: "/qchp" }, { label: "SCFHS CME guide", href: "/scfhs" }, { label: "CME calculator", href: "/cme-calculator" }, { label: "Compare GCC authorities", href: "/countries" }].map(l => (
              <Link key={l.href} href={l.href} className="text-xs text-[#64748b] hover:text-[#1a56a0] border border-[#e2e8f0] bg-white rounded-lg px-3 py-1.5 transition-colors">{l.label}</Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

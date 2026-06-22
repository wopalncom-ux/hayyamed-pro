import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { MedicalWebPageJsonLd } from "@/components/seo/MedicalWebPageJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Pulmonology CME Requirements in GCC — Respiratory Medicine CME Guide | Hayya Med Pro",
  description:
    "CME and CPD requirements for pulmonologists and respiratory medicine specialists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track respiratory CME across all 7 GCC authorities.",
  keywords: [
    "pulmonology CME requirements GCC",
    "respiratory medicine CME GCC",
    "pulmonologist CME Saudi Arabia",
    "SCFHS pulmonology CME",
    "QCHP pulmonologist CPD",
    "respiratory medicine CPD Qatar",
    "pulmonology license renewal GCC",
    "critical care CME GCC",
    "sleep medicine CME GCC",
    "pulmonologist continuing education",
  ],
  openGraph: {
    title: "Pulmonology & Respiratory Medicine CME Requirements in GCC",
    description: "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB — CME and CPD requirements for pulmonologists across all 7 GCC countries.",
    url: `${APP_URL}/pulmonology-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Pulmonology+CME+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+Respiratory+Medicine&a=%F0%9F%AB%81+Pulmonology&k=Specialty+Guide`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Pulmonology CME Requirements in GCC", description: "Complete CME guide for pulmonologists and respiratory medicine specialists in Qatar, Saudi Arabia, UAE, and the GCC." },
  alternates: { canonical: `${APP_URL}/pulmonology-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a pulmonologist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: { "@type": "Answer", text: "Pulmonologists registered with SCFHS must complete 60 CME credits per year. Activities from the Saudi Thoracic Society (STS), ERS, ATS, CHEST, and other internationally accredited respiratory societies count toward this requirement when accredited by SCFHS-approved bodies." },
    },
    {
      "@type": "Question",
      name: "Do critical care and ICU training courses count as pulmonology CME in Qatar?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Many pulmonologists in GCC practice critical care as a combined specialty. Accredited ICU and critical care courses — including ventilator management, ARDS protocols, and sepsis management — count as CME at QCHP and SCFHS under the clinical practice category." },
    },
    {
      "@type": "Question",
      name: "Why is pulmonology CME especially important in GCC countries?",
      acceptedAnswer: { "@type": "Answer", text: "GCC countries face unique respiratory disease challenges: among the world's highest smoking rates, significant air pollution from sandstorms and industrial activity, high rates of obstructive sleep apnea (linked to obesity prevalence), and post-COVID respiratory complications. Pulmonologists in GCC are in high demand and authorities encourage up-to-date CME in these areas." },
    },
    {
      "@type": "Question",
      name: "Does sleep medicine training count as pulmonology CME in GCC?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Sleep medicine, including polysomnography interpretation, CPAP management, and obstructive sleep apnea, is a recognized subspecialty within pulmonology. Accredited sleep medicine activities from AASM, ESRS, and national societies count toward your pulmonology CME requirements at QCHP and SCFHS." },
    },
    {
      "@type": "Question",
      name: "Can I track pulmonology CME for multiple GCC countries in Hayya Med Pro?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Hayya Med Pro supports multi-jurisdiction wallets. Log an activity once and assign it to both your QCHP and SCFHS wallets simultaneously. Each wallet tracks its own credit total, cycle dates, and compliance status independently." },
    },
  ],
};

const AUTHORITIES = [
  { flag: "🇶🇦", name: "QCHP", country: "Qatar", term: "CPD", credits: "80", cycle: "2 years", note: "40/yr min" },
  { flag: "🇸🇦", name: "SCFHS", country: "Saudi Arabia", term: "CME", credits: "60", cycle: "1 year", note: "STS events recognized" },
  { flag: "🇦🇪", name: "DHA", country: "UAE (Dubai)", term: "CME", credits: "40", cycle: "2 years", note: "5 patient safety" },
  { flag: "🇦🇪", name: "DOH", country: "UAE (Abu Dhabi)", term: "CPD", credits: "50", cycle: "2 years", note: "Physicians" },
  { flag: "🇰🇼", name: "MOH", country: "Kuwait", term: "CME", credits: "30", cycle: "1 year", note: "Annual renewal" },
  { flag: "🇧🇭", name: "NHRA", country: "Bahrain", term: "CPD", credits: "40", cycle: "2 years", note: "Structured + unstr." },
  { flag: "🇴🇲", name: "OMSB", country: "Oman", term: "CME", credits: "40", cycle: "2 years", note: "Category A & B" },
];

const SPECIALTY_NOTES = [
  { icon: "🌬️", title: "ERS, ATS, CHEST, and STS recognized", body: "European Respiratory Society (ERS), American Thoracic Society (ATS), CHEST, and Saudi Thoracic Society (STS) accredited activities count toward pulmonology CME at QCHP and SCFHS. ERS Congress and ATS International Conference activities are widely recognized." },
  { icon: "💨", title: "GCC context: air quality and smoking", body: "GCC countries face among the world's highest smoking rates and significant air pollution from sandstorms and industrial activity. COPD and occupational lung disease are prevalent. Authorities strongly encourage CME in evidence-based COPD management and respiratory rehabilitation." },
  { icon: "😴", title: "Sleep medicine and OSA subspecialty", body: "Obstructive sleep apnea (OSA) prevalence is high in GCC due to obesity rates. Sleep medicine — polysomnography, CPAP management, and OSA protocols — is a recognized pulmonology subspecialty. AASM-accredited activities count at QCHP and SCFHS." },
  { icon: "🏥", title: "Critical care CME counts", body: "Pulmonologists who practice critical care can count accredited ICU courses — ventilator management, ARDS, prone positioning protocols, and sepsis management — toward their pulmonology CME requirements at all GCC authorities." },
];

export default function PulmonologyCmePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://hayyamed.pro" },
        { name: "Pulmonology CME", url: "https://hayyamed.pro/pulmonology-cme" },
      ]} />
      <MedicalWebPageJsonLd
        name="Pulmonology CME"
        url="https://hayyamed.pro/pulmonology-cme"
        description="CME and CPD requirements for pulmonologists and respiratory medicine specialists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track respiratory CME across all 7 GCC authorities."
        keywords={["pulmonology CME requirements GCC", "respiratory medicine CME GCC", "pulmonologist CME Saudi Arabia", "SCFHS pulmonology CME", "QCHP pulmonologist CPD", "respiratory medicine CPD Qatar"]}
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
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">🫁 Pulmonology & Respiratory Medicine · All GCC Licensing Authorities</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">Pulmonology CME requirements<br className="hidden sm:block" /> across the GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">Track CME and CPD credits for your pulmonology license across every GCC authority — QCHP, SCFHS, DHA, and more — in one compliance platform.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">Track my pulmonology CME — free →</Link>
              <Link href="/cme-calculator" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors">Calculate my CME gap →</Link>
            </div>
            <p className="text-xs text-[#64748b] mt-3">No credit card required · 14-day Pro trial included</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-5 border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111]">CME/CPD requirements by GCC authority</h2>
              <p className="text-sm text-[#64748b] mt-1">Physician-level requirements apply to all respiratory medicine subspecialties including critical care</p>
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
            <h2 className="text-xl font-bold text-[#111] mb-5">What pulmonologists need to know about GCC CME</h2>
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
            <h2 className="text-xl font-bold text-[#111] mb-6">Pulmonology CME — frequently asked questions</h2>
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your pulmonology CME automatically</h2>
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

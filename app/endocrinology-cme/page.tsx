import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Endocrinology CME Requirements in GCC — Diabetes & Endocrine CME Guide | Hayya Med Pro",
  description:
    "CME and CPD requirements for endocrinologists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track diabetes and endocrine CME across all 7 GCC authorities.",
  keywords: [
    "endocrinology CME requirements GCC",
    "endocrinologist CME Saudi Arabia",
    "diabetes CME requirements GCC",
    "SCFHS endocrinology CME",
    "QCHP endocrinologist CPD",
    "diabetes CME Qatar",
    "endocrinology license renewal GCC",
    "diabetes specialist CME",
    "continuing medical education endocrinology",
    "Gulf diabetes CME",
  ],
  openGraph: {
    title: "Endocrinology & Diabetes CME Requirements in GCC",
    description: "QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, OMSB — CME and CPD requirements for endocrinologists across all 7 GCC countries.",
    url: `${APP_URL}/endocrinology-cme`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=Endocrinology+CME+%E2%80%94+GCC&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+Diabetes+%26+Endocrine&a=%F0%9F%A9%BA+Endocrinology&k=Specialty+Guide`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Endocrinology & Diabetes CME Requirements in GCC", description: "Complete CME guide for endocrinologists and diabetes specialists in Qatar, Saudi Arabia, UAE, and the GCC." },
  alternates: { canonical: `${APP_URL}/endocrinology-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does an endocrinologist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: { "@type": "Answer", text: "Endocrinologists and diabetes specialists registered with SCFHS must complete 60 CME credits per year. Activities from the Saudi Diabetes and Endocrinology Association (SDEA), ADA, EASD, and The Endocrine Society are recognized when accredited by approved bodies." },
    },
    {
      "@type": "Question",
      name: "Do diabetes education programs count as CME for endocrinologists in Qatar?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. QCHP accepts accredited diabetes management programs, including structured diabetes educator training, insulin management courses, and patient diabetes education coordinator programs when offered by accredited providers. These count under clinical or professional development categories." },
    },
    {
      "@type": "Question",
      name: "Why is endocrinology CME especially important in GCC countries?",
      acceptedAnswer: { "@type": "Answer", text: "GCC countries have among the world's highest rates of type 2 diabetes and obesity. Qatar, UAE, and Saudi Arabia all have diabetes prevalence above 15%. Endocrinology is a high-demand specialty and authorities place particular emphasis on current diabetes management guidelines, making regular CME in this area critical." },
    },
    {
      "@type": "Question",
      name: "Do thyroid and osteoporosis management courses count as endocrinology CME?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Thyroid disease management, osteoporosis, adrenal disorders, and reproductive endocrinology are all recognized subspecialties. Accredited activities in these areas count toward your endocrinology CME requirements at QCHP and SCFHS." },
    },
    {
      "@type": "Question",
      name: "Can I track endocrinology CME for multiple GCC countries in Hayya Med Pro?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Hayya Med Pro supports multi-jurisdiction wallets. Log an activity once and assign it to both your QCHP and SCFHS wallets. Each wallet tracks independently — separate credit totals, different cycle dates, and separate compliance statuses." },
    },
  ],
};

const AUTHORITIES = [
  { flag: "🇶🇦", name: "QCHP", country: "Qatar", term: "CPD", credits: "80", cycle: "2 years", note: "40/yr min" },
  { flag: "🇸🇦", name: "SCFHS", country: "Saudi Arabia", term: "CME", credits: "60", cycle: "1 year", note: "SDEA events recognized" },
  { flag: "🇦🇪", name: "DHA", country: "UAE (Dubai)", term: "CME", credits: "40", cycle: "2 years", note: "5 patient safety" },
  { flag: "🇦🇪", name: "DOH", country: "UAE (Abu Dhabi)", term: "CPD", credits: "50", cycle: "2 years", note: "Physicians" },
  { flag: "🇰🇼", name: "MOH", country: "Kuwait", term: "CME", credits: "30", cycle: "1 year", note: "Annual renewal" },
  { flag: "🇧🇭", name: "NHRA", country: "Bahrain", term: "CPD", credits: "40", cycle: "2 years", note: "Structured + unstr." },
  { flag: "🇴🇲", name: "OMSB", country: "Oman", term: "CME", credits: "40", cycle: "2 years", note: "Category A & B" },
];

const SPECIALTY_NOTES = [
  { icon: "🩸", title: "Diabetes management societies recognized", body: "Saudi Diabetes and Endocrinology Association (SDEA), Gulf Diabetes Association, ADA, EASD, and The Endocrine Society events are recognized by SCFHS and QCHP when accredited by an approved international or national body." },
  { icon: "🌍", title: "GCC context: diabetes prevalence", body: "Qatar, UAE, and Saudi Arabia have diabetes prevalence above 15% — among the world's highest. Endocrinologists are in very high demand, and CME in diabetes management is heavily weighted by GCC hospital employers and licensing authorities." },
  { icon: "🔬", title: "Thyroid, osteoporosis, adrenal CME", body: "Accredited activities covering thyroid disease, osteoporosis, adrenal disorders, reproductive endocrinology, and pituitary disease all count toward your endocrinology CME requirements." },
  { icon: "📱", title: "Digital diabetes CME growing", body: "With the rise of CGM and digital therapeutics for diabetes, GCC authorities increasingly accept accredited e-learning and virtual conference CME. Up to 40–50% of your cycle can be completed online depending on your authority." },
];

export default function EndocrinologyCmePage() {
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
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">🩺 Endocrinology & Diabetes · All GCC Licensing Authorities</div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">Endocrinology CME requirements<br className="hidden sm:block" /> across the GCC</h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">Track CME and CPD credits for your endocrinology license across every GCC authority — QCHP, SCFHS, DHA, and more — in one compliance platform.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors">Track my endocrinology CME — free →</Link>
              <Link href="/cme-calculator" className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors">Calculate my CME gap →</Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-3">No credit card required · 14-day Pro trial included</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-5 border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111]">CME/CPD requirements by GCC authority</h2>
              <p className="text-sm text-[#64748b] mt-1">Physician-level requirements apply to endocrinologists and diabetes specialists</p>
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
            <h2 className="text-xl font-bold text-[#111] mb-5">What endocrinologists need to know about GCC CME</h2>
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
            <h2 className="text-xl font-bold text-[#111] mb-6">Endocrinology CME — frequently asked questions</h2>
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
            <h2 className="text-2xl font-bold text-white mb-3">Track your endocrinology CME automatically</h2>
            <p className="text-[#94a3b8] mb-6 text-sm max-w-md mx-auto">Log activities, monitor your compliance ring, and get renewal alerts — free for all GCC healthcare professionals.</p>
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

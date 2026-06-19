import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CPD Requirements 2026 — Complete Guide for Healthcare Professionals | Hayya Med Pro",
  description:
    "CPD requirements for healthcare professionals: UK GMC (50 CPD/yr), NMC (35 hrs/3yr), Qatar QCHP (80 CPD/2yr), UAE DHA/DOH, Saudi SCFHS, Australia AHPRA. Track CPD and CME automatically.",
  keywords: [
    "CPD requirements",
    "continuing professional development requirements",
    "CPD requirements for doctors",
    "CPD requirements for nurses",
    "CPD requirements UK",
    "CPD requirements GCC",
    "GMC CPD requirements",
    "NMC CPD requirements",
    "QCHP CPD requirements",
    "how many CPD hours",
    "CPD credits required",
    "CPD hours per year",
    "CPD vs CME requirements",
    "CPD healthcare professionals",
  ],
  openGraph: {
    title: "CPD Requirements 2026 — Complete Guide for Healthcare Professionals",
    description: "CPD and CME requirements for healthcare professionals in UK, GCC, Australia, and globally.",
    url: `${BASE}/cpd-requirements`,
    type: "article",
    images: [{ url: `${BASE}/api/og?title=CPD+Requirements+2026+%E2%80%94+Global+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CPD Requirements 2026 — Complete Guide",
    description: "CPD requirements for doctors, nurses, pharmacists — UK, GCC, Australia and more.",
  },
  alternates: { canonical: `${BASE}/cpd-requirements` },
};

const breadcrumbs = [
  { name: "Home", url: BASE },
  { name: "CPD Requirements", url: `${BASE}/cpd-requirements` },
];

const AUTHORITIES = [
  { flag: "🇬🇧", country: "UK — Doctors",       authority: "GMC",        type: "Annual appraisal + revalidation every 5 years",     credits: "50 CPD credits", cycle: "Annual" },
  { flag: "🇬🇧", country: "UK — Nurses",         authority: "NMC",        type: "Practice hours + CPD",                              credits: "35 hrs CPD",     cycle: "3 years" },
  { flag: "🇬🇧", country: "UK — Pharmacists",    authority: "GPhC",       type: "CPD entries",                                       credits: "9 CPD entries",  cycle: "Annual" },
  { flag: "🇬🇧", country: "UK — Dentists",       authority: "GDC",        type: "Verifiable + non-verifiable CPD",                   credits: "100 hrs",        cycle: "5 years" },
  { flag: "🇬🇧", country: "UK — Allied Health",  authority: "HCPC",       type: "CPD activity log + continuing fitness to practice", credits: "30 hrs",         cycle: "2 years" },
  { flag: "🇮🇪", country: "Ireland — Doctors",   authority: "IMC",        type: "Structured + non-structured CPD",                   credits: "40 credits",     cycle: "Annual" },
  { flag: "🇮🇪", country: "Ireland — Nurses",    authority: "NMBI",       type: "Continuing education units",                        credits: "40 CEUs",        cycle: "Annual" },
  { flag: "🇦🇺", country: "Australia — Doctors", authority: "AHPRA / AMC", type: "College-specific CPD",                             credits: "Varies",         cycle: "Annual" },
  { flag: "🇦🇺", country: "Australia — Nurses",  authority: "AHPRA Nursing", type: "CPD hours + practice hours",                    credits: "20 hrs",         cycle: "Annual" },
  { flag: "🇦🇺", country: "Australia — Pharmacy", authority: "AHPRA Pharmacy", type: "CPD hours",                                   credits: "40 hrs",         cycle: "Annual" },
  { flag: "🇳🇿", country: "New Zealand",         authority: "MCNZ / Nursing Council", type: "Annual practising certificate",         credits: "Varies",         cycle: "Annual" },
  { flag: "🇸🇬", country: "Singapore",           authority: "SMC / SNB",  type: "CME credits per licence period",                    credits: "50 CME",         cycle: "Annual" },
  { flag: "🇮🇳", country: "India",               authority: "NMC",        type: "CME points",                                        credits: "30 CME",         cycle: "5 years" },
  { flag: "🇶🇦", country: "Qatar",               authority: "QCHP / DHP-AS", type: "CPD points — A, B, C categories",               credits: "80 CPD",         cycle: "2 years" },
  { flag: "🇸🇦", country: "Saudi Arabia",        authority: "SCFHS",      type: "CME credits — structured + non-structured",         credits: "40–60 CME",      cycle: "1–3 yrs" },
  { flag: "🇦🇪", country: "UAE",                 authority: "DHA / DOH",  type: "CME/CPD credits",                                   credits: "30–50 CME",      cycle: "2 years" },
  { flag: "🇵🇰", country: "Pakistan",            authority: "PMC",        type: "CPD hours",                                         credits: "25 CPD",         cycle: "Annual" },
  { flag: "🇲🇾", country: "Malaysia",            authority: "MMC / MPC",  type: "CPD points",                                        credits: "25 CPD",         cycle: "Annual" },
];

const CPD_CATEGORIES = [
  {
    name: "Formal education & training",
    icon: "🎓",
    desc: "Accredited courses, postgraduate certificates, diplomas, degrees, and formal healthcare training programmes.",
    examples: ["Hospital grand rounds", "Postgraduate diplomas", "CPD courses from royal colleges", "Accredited online modules"],
  },
  {
    name: "Learning from practice",
    icon: "🏥",
    desc: "Activities arising directly from your clinical work — reviewing cases, reflective practice, and quality improvement.",
    examples: ["Significant event analysis", "Case reviews", "Mortality & morbidity meetings", "Clinical audit"],
  },
  {
    name: "Self-directed learning",
    icon: "📚",
    desc: "Reading, research, e-learning, and study that you direct yourself without a formal programme.",
    examples: ["Medical journal reading", "Podcasts & webinars", "Textbooks", "Online resources"],
  },
  {
    name: "Peer learning",
    icon: "👥",
    desc: "Learning from and with colleagues — mentoring, peer review, journal clubs, and team learning.",
    examples: ["Journal clubs", "Peer mentoring", "Team learning sessions", "Multi-disciplinary team meetings"],
  },
  {
    name: "Teaching & supervision",
    icon: "👨‍🏫",
    desc: "Preparing and delivering education to students, trainees, or colleagues counts as CPD in most frameworks.",
    examples: ["Teaching medical students", "Supervising junior doctors", "Presenting at conferences", "Writing educational content"],
  },
  {
    name: "Research & publication",
    icon: "🔬",
    desc: "Conducting clinical research, systematic reviews, or writing for publication contributes to CPD.",
    examples: ["Clinical trials", "Systematic reviews", "Publishing in peer-reviewed journals", "Research presentations"],
  },
];

const FAQ = [
  {
    q: "What does CPD stand for?",
    a: "CPD stands for Continuing Professional Development. It is the umbrella term used in the UK, Australia, Qatar, Bahrain, and many Commonwealth countries to describe ongoing learning that keeps healthcare professionals' skills and knowledge up to date. In the USA and many parts of the Middle East, the equivalent term is CME (Continuing Medical Education).",
  },
  {
    q: "How many CPD hours do I need per year?",
    a: "It depends on your profession and licensing authority. In the UK: GPs need 50 CPD credits per year (GMC); nurses need 35 hours of CPD every 3 years (NMC); pharmacists need 9 CPD entries per year (GPhC). In Qatar (QCHP), all healthcare professionals need 80 CPD points every 2 years (40 minimum per year). Hayya Med Pro tracks the right requirement for your authority automatically.",
  },
  {
    q: "What's the difference between CPD and CME?",
    a: "CPD (Continuing Professional Development) and CME (Continuing Medical Education) are often used interchangeably, but CPD is the broader term covering all professional development activities — including non-clinical skills like leadership and communication. CME typically refers specifically to medical education content directly related to clinical practice. Most UK, Australian, and GCC authorities use CPD, while the USA primarily uses CME.",
  },
  {
    q: "Do online CPD activities count?",
    a: "Yes — in virtually all frameworks, accredited online CPD activities count toward requirements. The UK GMC, NMC, GPhC, and GDC all accept online learning. Qatar QCHP allows up to 50% of credits to come from online learning (Category B). Most authorities require that online activities are accredited by a recognised body.",
  },
  {
    q: "What happens if I don't complete my CPD requirements?",
    a: "Failure to meet CPD requirements can result in licence suspension or non-renewal. In the UK, the GMC can remove a doctor from the medical register for failing to complete revalidation (which includes CPD). The NMC can refuse a nurse's practicing certificate renewal. In Qatar, QCHP will not renew a licence without proof of completed CPD. Hayya Med Pro sends reminders at 90, 60, and 30 days before your deadline.",
  },
  {
    q: "Can I track CPD for multiple countries at once?",
    a: "Yes — Hayya Med Pro supports multi-country CPD tracking. Healthcare professionals licensed in both Qatar and the UK, for example, can maintain separate wallets for each authority with the correct credit targets applied automatically for each country.",
  },
];

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "CPD Requirements 2026 — Complete Guide for Healthcare Professionals",
  description: "CPD and CME requirements for healthcare professionals in UK, GCC, Australia, and globally.",
  datePublished: "2026-06-19",
  dateModified: "2026-06-19",
  author: { "@type": "Organization", name: "Hayya Med Pro", url: BASE },
  publisher: { "@type": "Organization", name: "Hayya Med AI", url: BASE },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/cpd-requirements` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function CpdRequirementsPage() {
  const ukRows = AUTHORITIES.filter((a) => ["🇬🇧", "🇮🇪", "🇦🇺", "🇳🇿"].includes(a.flag));
  const gccRows = AUTHORITIES.filter((a) => ["🇶🇦", "🇸🇦", "🇦🇪", "🇧🇭", "🇰🇼", "🇴🇲"].includes(a.flag));
  const asiaRows = AUTHORITIES.filter((a) => ["🇸🇬", "🇮🇳", "🇵🇰", "🇲🇾"].includes(a.flag));

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="min-h-screen bg-[#f8fafc]">
        <nav className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-[#1a56a0] text-lg">
            <span className="w-7 h-7 rounded-lg bg-[#1a56a0] flex items-center justify-center text-white text-sm font-black">H</span>
            Hayya Med Pro
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/cme-requirements" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">CME Guide</Link>
            <Link href="/cme-vs-cpd" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">CME vs CPD</Link>
            <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">Track CPD free</Link>
          </div>
        </nav>

        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full uppercase tracking-wide">Global · 2026 Guide</span>
              <span className="text-xs font-bold text-[#64748b] bg-[#f1f5f9] px-2.5 py-1 rounded-full">CPD · CME</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-5 leading-tight max-w-3xl">
              CPD requirements for healthcare professionals — UK, GCC, Australia, and beyond
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-6">
              Continuing Professional Development (CPD) requirements vary significantly by profession, country, and licensing authority.
              This guide covers credit targets, accepted activity types, and renewal cycles for healthcare professionals worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my CPD — free
              </Link>
              <Link href="/cme-requirements" className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                Also see CME requirements →
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-14">

          {/* Quick diff */}
          <div className="bg-[#f0f7ff] border border-[#c7daf7] rounded-2xl p-6">
            <h2 className="text-base font-bold text-[#0f1f3d] mb-3">CPD vs CME — what's the difference?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-[#1a56a0] mb-2">CPD (Continuing Professional Development)</p>
                <p className="text-[#374151] leading-relaxed">Broader term covering all professional development — clinical and non-clinical. Used in the UK, Australia, Qatar, Bahrain, Oman, and most Commonwealth countries.</p>
              </div>
              <div>
                <p className="font-semibold text-[#1a56a0] mb-2">CME (Continuing Medical Education)</p>
                <p className="text-[#374151] leading-relaxed">Primarily refers to clinical/medical education activities. Used in the USA, Saudi Arabia (SCFHS), UAE (DHA), Kuwait, and much of the Middle East.</p>
              </div>
            </div>
            <p className="text-xs text-[#64748b] mt-4">In practice, both serve the same purpose. Hayya Med Pro tracks both CPD and CME depending on your licensing authority.</p>
          </div>

          {/* UK & Commonwealth */}
          <section aria-labelledby="uk-heading">
            <h2 id="uk-heading" className="text-2xl font-bold text-[#0f1f3d] mb-5">UK, Ireland, Australia, New Zealand</h2>
            <div className="space-y-2">
              {[...ukRows, ...asiaRows].map(({ flag, country, authority, type, credits, cycle }) => (
                <div key={`${country}-${authority}`} className="bg-white border border-[#e2e8f0] rounded-xl px-5 py-4">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">{flag}</span>
                      <div>
                        <p className="font-semibold text-[#0f1f3d] text-sm">{country}</p>
                        <p className="text-xs text-[#64748b]">{authority}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="font-bold text-[#1a56a0] text-sm">{credits}</p>
                        <p className="text-xs text-[#64748b]">{cycle}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748b] mt-2 ml-11">{type}</p>
                </div>
              ))}
            </div>
          </section>

          {/* GCC */}
          <section aria-labelledby="gcc-heading">
            <h2 id="gcc-heading" className="text-2xl font-bold text-[#0f1f3d] mb-5">GCC countries (Qatar, Saudi Arabia, UAE)</h2>
            <p className="text-sm text-[#64748b] mb-4 leading-relaxed">
              In the GCC, CPD and CME are used interchangeably. Qatar QCHP uses CPD terminology; Saudi SCFHS and UAE DHA primarily use CME.
              All track structured learning activities for healthcare professionals.
            </p>
            <div className="space-y-2">
              {gccRows.map(({ flag, country, authority, type, credits, cycle }) => (
                <div key={`${country}-${authority}`} className="bg-white border border-[#e2e8f0] rounded-xl px-5 py-4">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">{flag}</span>
                      <div>
                        <p className="font-semibold text-[#0f1f3d] text-sm">{country}</p>
                        <p className="text-xs text-[#64748b]">{authority}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="font-bold text-[#1a56a0] text-sm">{credits}</p>
                        <p className="text-xs text-[#64748b]">{cycle}</p>
                      </div>
                      <Link href="/gcc-cme-requirements" className="text-xs font-semibold text-[#1a56a0] border border-[#c7daf7] px-3 py-1.5 rounded-lg hover:bg-[#f0f7ff] transition-colors whitespace-nowrap">
                        GCC guide →
                      </Link>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748b] mt-2 ml-11">{type}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CPD activity types */}
          <section aria-labelledby="activities-heading">
            <h2 id="activities-heading" className="text-2xl font-bold text-[#0f1f3d] mb-5">Types of CPD activities accepted</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CPD_CATEGORIES.map(({ name, icon, desc, examples }) => (
                <div key={name} className="bg-white border border-[#e2e8f0] rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl" aria-hidden="true">{icon}</span>
                    <h3 className="font-semibold text-[#0f1f3d] text-sm">{name}</h3>
                  </div>
                  <p className="text-xs text-[#64748b] leading-relaxed mb-3">{desc}</p>
                  <ul className="space-y-1">
                    {examples.map((e) => (
                      <li key={e} className="text-xs text-[#374151] flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#1a56a0] flex-shrink-0" aria-hidden="true" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* GMC Revalidation explanation */}
          <section aria-labelledby="gmc-heading" className="bg-white border border-[#e2e8f0] rounded-2xl p-8">
            <h2 id="gmc-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">UK GMC Revalidation and CPD</h2>
            <p className="text-sm text-[#64748b] leading-relaxed mb-4">
              UK doctors must complete annual appraisal AND GMC revalidation every 5 years. CPD is a key component of both.
              The GMC requires doctors to collect and reflect on CPD activity — there is no prescribed minimum credit count,
              but 50 CPD credits per year is the widely accepted benchmark from the royal colleges.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
                <p className="font-bold text-[#1a56a0] text-lg mb-1">50</p>
                <p className="text-xs text-[#64748b]">CPD credits per year — recommended benchmark</p>
              </div>
              <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
                <p className="font-bold text-[#1a56a0] text-lg mb-1">Annual</p>
                <p className="text-xs text-[#64748b]">Appraisal cycle with your appraiser</p>
              </div>
              <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0]">
                <p className="font-bold text-[#1a56a0] text-lg mb-1">5 years</p>
                <p className="text-xs text-[#64748b]">GMC revalidation cycle</p>
              </div>
            </div>
          </section>

          {/* Platform CTA */}
          <section className="bg-[#f0f7ff] border border-[#c7daf7] rounded-2xl p-8">
            <h2 className="text-xl font-bold text-[#0f1f3d] mb-3">Track your CPD automatically</h2>
            <p className="text-sm text-[#64748b] leading-relaxed mb-5 max-w-2xl">
              Hayya Med Pro tracks CPD and CME credits for all GCC licensing authorities (QCHP, SCFHS, DHA, DOH, NHRA, OMSB, MOH Kuwait)
              and is expanding to UK, Australian, and Indian frameworks. Automatically applies the correct credit rules for your authority.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {[
                "Tracks CPD per category against authority caps",
                "PDF compliance report for QCHP, SCFHS, DHA and more",
                "AI gap analysis — shows exactly what CPD you still need",
                "Multi-country wallet for dual-licensed professionals",
                "Deadline reminders at 90/60/30 days",
                "Offline access via mobile app",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-[#374151]">
                  <svg className="w-4 h-4 text-[#1a56a0] flex-shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                  </svg>
                  {f}
                </div>
              ))}
            </div>
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors">
              Start tracking CPD free
            </Link>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">CPD requirements — frequently asked questions</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                  <h3 className="font-semibold text-[#0f1f3d] mb-2">{f.q}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related */}
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">Related guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { title: "CME Requirements", desc: "CME vs CPD — global guide", href: "/cme-requirements" },
                { title: "CME vs CPD Explained", desc: "Key differences and overlap", href: "/cme-vs-cpd" },
                { title: "Qatar QCHP CPD Guide", desc: "80 CPD / 2-year cycle", href: "/qchp" },
                { title: "Saudi Arabia SCFHS", desc: "CME requirements guide", href: "/scfhs" },
                { title: "GCC CME Comparison", desc: "All 7 GCC countries", href: "/gcc-cme-requirements" },
                { title: "Doctors CME/CPD Guide", desc: "By profession", href: "/doctors" },
                { title: "Nurses CPD Guide", desc: "NMC and GCC nursing CPD", href: "/nurses" },
                { title: "Allied Health CPD", desc: "HCPC and international", href: "/allied-health-cpd" },
                { title: "License Renewal Guide", desc: "Step-by-step renewal", href: "/guides/license-renewal" },
              ].map(({ title, desc, href }) => (
                <Link key={href} href={href} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                  <p className="font-semibold text-[#0f1f3d] text-sm group-hover:text-[#1a56a0]">{title}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">{desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-[#1a56a0] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Never miss a CPD deadline</h2>
            <p className="text-white/75 mb-6 max-w-md mx-auto text-sm leading-relaxed">
              Hayya Med Pro tracks your CPD points, sends deadline reminders, and generates
              authority-ready compliance reports — free to start, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="inline-block bg-white text-[#1a56a0] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                Start tracking free
              </Link>
              <Link href="/pricing" className="inline-block border border-white/30 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors">
                View Pro features →
              </Link>
            </div>
          </section>

          <p className="text-xs text-[#94a3b8] text-center leading-relaxed">
            Hayya Med Pro supports CPD tracking and compliance readiness. It does not issue licences and does not replace
            official licensing authorities. Always verify final requirements with GMC, NMC, QCHP, SCFHS, or your relevant authority.
          </p>
        </main>
      </div>
    </>
  );
}

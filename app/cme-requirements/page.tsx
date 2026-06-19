import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const BASE = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CME Requirements 2026 — Complete Global Guide for Healthcare Professionals | Hayya Med Pro",
  description:
    "CME requirements for healthcare professionals worldwide: Qatar QCHP (80 CPD/2yr), Saudi SCFHS (40–60 CME/yr), UAE DHA (40/2yr), UK GMC (50 CPD/yr), USA (varies by state), Australia AHPRA. Track CME automatically.",
  keywords: [
    "CME requirements",
    "continuing medical education requirements",
    "CME requirements by country",
    "CME requirements doctors",
    "CME requirements nurses",
    "CME requirements pharmacists",
    "QCHP CME requirements",
    "SCFHS CME requirements",
    "DHA CME requirements",
    "GMC CPD requirements",
    "CME credits required",
    "CME requirements GCC",
    "how many CME credits",
    "CME renewal requirements",
  ],
  openGraph: {
    title: "CME Requirements 2026 — Complete Global Guide",
    description: "CME and CPD requirements for healthcare professionals in GCC, UK, USA, Australia, and 20+ countries.",
    url: `${BASE}/cme-requirements`,
    type: "article",
    images: [{ url: `${BASE}/api/og?title=CME+Requirements+2026+%E2%80%94+Global+Guide`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CME Requirements 2026 — Complete Global Guide",
    description: "CME/CPD requirements for GCC, UK, USA, Australia — all countries in one place.",
  },
  alternates: { canonical: `${BASE}/cme-requirements` },
};

const breadcrumbs = [
  { name: "Home", url: BASE },
  { name: "CME Requirements", url: `${BASE}/cme-requirements` },
];

const AUTHORITIES = [
  { flag: "🇶🇦", country: "Qatar",             authority: "QCHP / DHP-AS",  credits: "80 CPD",    cycle: "2 years",    slug: "qatar",           tag: "Gulf" },
  { flag: "🇸🇦", country: "Saudi Arabia",       authority: "SCFHS",          credits: "40–60 CME", cycle: "1–3 years",  slug: "saudi-arabia",    tag: "Gulf" },
  { flag: "🇦🇪", country: "UAE (Dubai)",        authority: "DHA",            credits: "40 CME",    cycle: "2 years",    slug: "uae",             tag: "Gulf" },
  { flag: "🇦🇪", country: "UAE (Abu Dhabi)",    authority: "DOH",            credits: "30–50 CPD", cycle: "2 years",    slug: "uae",             tag: "Gulf" },
  { flag: "🇰🇼", country: "Kuwait",             authority: "MOH",            credits: "30 CME",    cycle: "1 year",     slug: "kuwait",          tag: "Gulf" },
  { flag: "🇧🇭", country: "Bahrain",            authority: "NHRA",           credits: "40 CPD",    cycle: "2 years",    slug: "bahrain",         tag: "Gulf" },
  { flag: "🇴🇲", country: "Oman",              authority: "OMSB",           credits: "40 CME",    cycle: "2 years",    slug: "oman",            tag: "Gulf" },
  { flag: "🇬🇧", country: "United Kingdom",     authority: "GMC / NMC",      credits: "50 CPD",    cycle: "Annual",     slug: "united-kingdom",  tag: "Europe" },
  { flag: "🇮🇪", country: "Ireland",            authority: "IMC / NMBI",     credits: "40 CPD",    cycle: "Annual",     slug: "ireland",         tag: "Europe" },
  { flag: "🇦🇺", country: "Australia",          authority: "AHPRA",          credits: "Varies",    cycle: "Annual",     slug: "australia",       tag: "Asia-Pacific" },
  { flag: "🇳🇿", country: "New Zealand",        authority: "MCNZ / Nursing", credits: "Varies",    cycle: "Annual",     slug: "new-zealand",     tag: "Asia-Pacific" },
  { flag: "🇸🇬", country: "Singapore",          authority: "SMC / SNB",      credits: "50 CME",    cycle: "Annual",     slug: "singapore",       tag: "Asia-Pacific" },
  { flag: "🇲🇾", country: "Malaysia",           authority: "MMC / MPC",      credits: "25 CPD",    cycle: "Annual",     slug: "malaysia",        tag: "Asia-Pacific" },
  { flag: "🇮🇳", country: "India",              authority: "NMC",            credits: "30 CME",    cycle: "5 years",    slug: "india",           tag: "South Asia" },
  { flag: "🇵🇰", country: "Pakistan",           authority: "PMC",            credits: "25 CPD",    cycle: "Annual",     slug: "pakistan",        tag: "South Asia" },
  { flag: "🇵🇭", country: "Philippines",        authority: "PRC / PMA",      credits: "45 CPD",    cycle: "3 years",    slug: "philippines",     tag: "Asia-Pacific" },
  { flag: "🇩🇪", country: "Germany",            authority: "Ärztekammer",    credits: "250 CME",   cycle: "5 years",    slug: "germany",         tag: "Europe" },
  { flag: "🇫🇷", country: "France",             authority: "CNOM",           credits: "Varies",    cycle: "Annual",     slug: "france",          tag: "Europe" },
  { flag: "🇳🇱", country: "Netherlands",        authority: "BIG / KNMG",     credits: "200 hrs",   cycle: "5 years",    slug: "netherlands",     tag: "Europe" },
  { flag: "🇺🇸", country: "USA",               authority: "State boards",   credits: "20–50 CME", cycle: "1–3 years",  slug: "usa",             tag: "North America" },
  { flag: "🇨🇦", country: "Canada",             authority: "CPSO / CPSNS",   credits: "400 hrs",   cycle: "5 years",    slug: "canada",          tag: "North America" },
  { flag: "🇿🇦", country: "South Africa",       authority: "HPCSA",          credits: "30 CEUs",   cycle: "Annual",     slug: "south-africa",    tag: "Africa" },
  { flag: "🇪🇬", country: "Egypt",              authority: "Egyptian MOH",   credits: "Varies",    cycle: "Annual",     slug: "egypt",           tag: "MENA" },
  { flag: "🇯🇴", country: "Jordan",             authority: "JMS / JNCAP",    credits: "Varies",    cycle: "Annual",     slug: "jordan",          tag: "MENA" },
];

const PROFESSION_REQUIREMENTS = [
  {
    profession: "Physicians (Doctors)",
    icon: "🩺",
    href: "/doctors",
    gcc: "80 CPD / 2 yr (QCHP) · 60 CME / yr (SCFHS) · 40 CME / 2 yr (DHA)",
    uk: "50 CPD / year (GMC)",
    aus: "Varies by college (RACGP: 150/3yr)",
  },
  {
    profession: "Nurses",
    icon: "👩‍⚕️",
    href: "/nurses",
    gcc: "80 CPD / 2 yr (QCHP) · 60 / yr (SCFHS) · 40 / 2 yr (DHA)",
    uk: "35 hrs CPD / 3 years (NMC)",
    aus: "20 hrs CPD / year (AHPRA Nursing)",
  },
  {
    profession: "Pharmacists",
    icon: "💊",
    href: "/pharmacists",
    gcc: "80 CPD / 2 yr (QCHP) · 60 CME / yr (SCFHS) · 40 CME / 2 yr (DHA)",
    uk: "9 CPD entries / year (GPhC)",
    aus: "40 CPD / year (AHPRA Pharmacy)",
  },
  {
    profession: "Dentists",
    icon: "🦷",
    href: "/dentists",
    gcc: "80 CPD / 2 yr (QCHP) · 60 CME / yr (SCFHS) · 40 CME / 2 yr (DHA)",
    uk: "100 hrs CPD / 5 years (GDC)",
    aus: "60 CPD hrs / 3 years (AHPRA Dental)",
  },
  {
    profession: "Physiotherapists",
    icon: "🏃",
    href: "/physiotherapists",
    gcc: "80 CPD / 2 yr (QCHP) · 60 / yr (SCFHS) · 40 / 2 yr (DHA)",
    uk: "30 hrs CPD / 2 years (HCPC)",
    aus: "20 hrs CPD / year (AHPRA PT)",
  },
];

const FAQ = [
  {
    q: "How many CME credits do I need per year?",
    a: "It depends on your licensing authority. Most GCC authorities require 40 credits per year (Qatar QCHP: 80 over 2 years; Saudi SCFHS: 40–60 per year; UAE DHA: 40 per 2-year cycle). The UK GMC requires 50 CPD credits per year. US state boards vary from 20 to 50 CME credits per 1–3 year cycle. Hayya Med Pro tracks the right target for your authority automatically.",
  },
  {
    q: "What activities count as CME?",
    a: "Accepted CME activities typically include: accredited conferences and workshops (Category A), online CME modules, journal reading and research (Category B/C), teaching and mentoring activities, and mandatory/patient safety training. Each licensing authority sets its own category caps and conversion factors. Hayya Med Pro applies the correct rules for your authority.",
  },
  {
    q: "Can online CME count toward my license renewal?",
    a: "Yes — in most countries, online CME activities accredited by recognised bodies (such as ACCME, AMA PRA, RCPCH, or GMC Online) count toward license renewal. Some authorities cap the percentage of online learning (e.g., QCHP allows up to 50% online). Check your specific authority's category caps.",
  },
  {
    q: "Do CME credits earned in one country transfer to another?",
    a: "Not automatically. Each licensing authority maintains its own approved provider list. However, activities from internationally recognised accreditors (AMA PRA, CME Outfitters, RCPCH) are accepted by many authorities. Multi-country professionals need to track credits separately per country — Hayya Med Pro's multi-country wallet handles this automatically.",
  },
  {
    q: "What happens if I don't complete my CME requirements?",
    a: "Failure to meet CME requirements can result in license suspension, non-renewal, or financial penalties. In GCC countries, incomplete CPD may result in QCHP/SCFHS/DHA refusing license renewal. In the UK, failure to complete revalidation CPD can result in GMC removal from the register. Prevention is far easier than remediation — Hayya Med Pro sends reminders 90, 60, and 30 days before your deadline.",
  },
  {
    q: "How do I track my CME activities?",
    a: "Hayya Med Pro is the recommended tool for GCC-based healthcare professionals. It tracks CME credits across all GCC licensing authorities (QCHP, SCFHS, DHA, DOH, NHRA, OMSB, MOH Kuwait), generates PDF compliance reports in the format required by each authority, and provides AI-powered gap analysis to show exactly which activities you still need.",
  },
];

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "CME Requirements 2026 — Complete Global Guide for Healthcare Professionals",
  description: "CME and CPD credit requirements for healthcare professionals in GCC, UK, USA, Australia, and 20+ countries.",
  datePublished: "2026-06-19",
  dateModified: "2026-06-19",
  author: { "@type": "Organization", name: "Hayya Med Pro", url: BASE },
  publisher: { "@type": "Organization", name: "Hayya Med AI", url: BASE },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/cme-requirements` },
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

export default function CmeRequirementsPage() {
  const regions = [...new Set(AUTHORITIES.map((a) => a.tag))];

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
            <Link href="/gcc-cme-requirements" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">GCC Guide</Link>
            <Link href="/global-cme-requirements" className="text-sm text-[#64748b] hover:text-[#1a56a0] hidden sm:block">Global</Link>
            <Link href="/register" className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#1547a0] transition-colors">Track CME free</Link>
          </div>
        </nav>

        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-[#1a56a0] bg-[#dbeafe] px-2.5 py-1 rounded-full uppercase tracking-wide">Global · 2026 Guide</span>
            </div>
            <h1 className="text-4xl font-bold text-[#0f1f3d] tracking-tight mb-5 leading-tight max-w-3xl">
              CME requirements for healthcare professionals — every country, every authority
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl leading-relaxed mb-6">
              Continuing Medical Education (CME) and CPD requirements differ significantly by country and licensing authority.
              This guide covers credit targets, renewal cycles, and accepted activity types for healthcare professionals worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors shadow-md shadow-blue-900/15">
                Track my CME — free
              </Link>
              <Link href="/gcc-cme-requirements" className="inline-flex items-center gap-2 border border-[#c7daf7] text-[#1a56a0] bg-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f7ff] transition-colors">
                GCC detailed guide →
              </Link>
            </div>
          </div>
        </header>

        <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 space-y-14">

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { n: "24+", label: "Countries covered" },
              { n: "30–80", label: "Credits required / cycle" },
              { n: "7", label: "GCC authorities" },
              { n: "Free", label: "CME tracker to get started" },
            ].map(({ n, label }) => (
              <div key={label} className="bg-white border border-[#e2e8f0] rounded-xl p-5 text-center">
                <p className="text-3xl font-black text-[#1a56a0] mb-1">{n}</p>
                <p className="text-xs text-[#64748b]">{label}</p>
              </div>
            ))}
          </div>

          {/* Requirements by country */}
          <section aria-labelledby="country-heading">
            <h2 id="country-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">CME requirements by country</h2>

            {regions.map((region) => (
              <div key={region} className="mb-8">
                <h3 className="text-sm font-bold text-[#64748b] uppercase tracking-wide mb-3">{region}</h3>
                <div className="space-y-2">
                  {AUTHORITIES.filter((a) => a.tag === region).map(({ flag, country, authority, credits, cycle, slug }) => (
                    <div key={`${country}-${authority}`} className="bg-white border border-[#e2e8f0] rounded-xl px-5 py-4 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl" aria-hidden="true">{flag}</span>
                        <div>
                          <p className="font-semibold text-[#0f1f3d] text-sm">{country}</p>
                          <p className="text-xs text-[#64748b]">{authority}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="font-bold text-[#1a56a0] text-sm">{credits}</p>
                          <p className="text-xs text-[#64748b]">{cycle}</p>
                        </div>
                        <Link href={`/${slug}/cme`} className="text-xs font-semibold text-[#1a56a0] border border-[#c7daf7] px-3 py-1.5 rounded-lg hover:bg-[#f0f7ff] transition-colors whitespace-nowrap">
                          Full guide →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* By profession */}
          <section aria-labelledby="profession-heading">
            <h2 id="profession-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">CME requirements by profession</h2>
            <div className="space-y-4">
              {PROFESSION_REQUIREMENTS.map(({ profession, icon, href, gcc, uk, aus }) => (
                <div key={profession} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl" aria-hidden="true">{icon}</span>
                      <h3 className="text-base font-bold text-[#0f1f3d]">{profession}</h3>
                    </div>
                    <Link href={href} className="text-sm font-semibold text-[#1a56a0] hover:underline">
                      Full guide →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-bold text-[#64748b] uppercase mb-1">GCC</p>
                      <p className="text-[#374151] text-xs leading-relaxed">{gcc}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#64748b] uppercase mb-1">United Kingdom</p>
                      <p className="text-[#374151] text-xs">{uk}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#64748b] uppercase mb-1">Australia</p>
                      <p className="text-[#374151] text-xs">{aus}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What counts as CME */}
          <section aria-labelledby="activities-heading">
            <h2 id="activities-heading" className="text-2xl font-bold text-[#0f1f3d] mb-5">What activities count as CME?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { cat: "Category A — Accredited Education", icon: "🎓", desc: "Accredited conferences, workshops, symposia, hospital grand rounds, and accredited online courses. Typically the highest-value category with no cap." },
                { cat: "Category B — Structured Learning", icon: "📚", desc: "Accredited e-learning modules, medical journal clubs, structured self-directed study programs, and webinars with assessment components." },
                { cat: "Category C — Self-Directed Learning", icon: "📖", desc: "Journal reading, case studies, medical textbooks, podcasts, and unaccredited online learning. Often capped at 20–30% of total credits." },
                { cat: "Category D — Professional Activities", icon: "🏥", desc: "Teaching, mentoring, research, publications, presentations, and quality improvement projects. Usually capped at 10–20% of required credits." },
                { cat: "Patient Safety & Ethics", icon: "🛡️", desc: "Many GCC authorities require a minimum number of credits in patient safety, medical ethics, and clinical governance each renewal cycle." },
                { cat: "Mandatory Topics", icon: "✅", desc: "Some authorities mandate credits in specific areas: infection control, BLS/ACLS recertification, cultural competency. Hayya Med Pro tracks these separately." },
              ].map(({ cat, icon, desc }) => (
                <div key={cat} className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0" aria-hidden="true">{icon}</span>
                  <div>
                    <h3 className="font-semibold text-[#0f1f3d] text-sm mb-1">{cat}</h3>
                    <p className="text-xs text-[#64748b] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Platform section */}
          <section className="bg-[#f0f7ff] border border-[#c7daf7] rounded-2xl p-8">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-[#0f1f3d] mb-3">Track CME automatically with Hayya Med Pro</h2>
                <p className="text-sm text-[#64748b] leading-relaxed mb-4">
                  Hayya Med Pro tracks CME credits for all GCC licensing authorities (QCHP, SCFHS, DHA, DOH, NHRA, OMSB, MOH Kuwait),
                  applies the correct category caps and credit conversion factors for your authority, and generates PDF compliance
                  reports in the format required for license renewal.
                </p>
                <ul className="space-y-1.5 mb-5">
                  {[
                    "Tracks credits per category against authority limits",
                    "Sends deadline reminders 90/60/30 days before renewal",
                    "Downloads PDF compliance report for any GCC authority",
                    "AI gap analysis shows exactly what CME you still need",
                    "Multi-country wallet for professionals licensed in multiple countries",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#374151]">
                      <svg className="w-4 h-4 text-[#1a56a0] flex-shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a56a0] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1547a0] transition-colors">
                  Start tracking free
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-[#0f1f3d] mb-6">CME requirements — frequently asked questions</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.q} className="bg-white border border-[#e2e8f0] rounded-xl p-6">
                  <h3 className="font-semibold text-[#0f1f3d] mb-2">{f.q}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related links */}
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl font-bold text-[#0f1f3d] mb-4">Related guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { title: "CPD Requirements Guide", desc: "UK, Australia & GCC CPD explained", href: "/cpd-requirements" },
                { title: "Medical Licence Renewal", desc: "QCHP, SCFHS, DHA, GMC checklists", href: "/medical-license-renewal" },
                { title: "GCC CME Requirements", desc: "All 7 GCC countries compared", href: "/gcc-cme-requirements" },
                { title: "Global CME Comparison", desc: "International authority comparison", href: "/global-cme-requirements" },
                { title: "Qatar CPD Guide", desc: "80 CPD / 2-year QCHP cycle", href: "/qatar-cme" },
                { title: "UAE CME Guide", desc: "DHA & DOH requirements", href: "/uae-cme" },
                { title: "Saudi Arabia CME Guide", desc: "SCFHS requirements 2025", href: "/saudi-arabia-cme" },
                { title: "Saudi Arabia SCFHS", desc: "40–60 CME per year", href: "/scfhs" },
                { title: "UAE DHA Guide", desc: "40 CME / 2-year cycle", href: "/dha" },
                { title: "CME vs CPD Explained", desc: "What's the difference?", href: "/cme-vs-cpd" },
                { title: "Doctors CME Guide", desc: "CME by profession", href: "/doctors" },
                { title: "Nurse CME Requirements", desc: "GCC nursing CME by authority", href: "/nurse-cme" },
                { title: "Nurses CPD Guide", desc: "CPD requirements for nurses", href: "/nurses" },
                { title: "License Renewal Guide", desc: "Step-by-step renewal process", href: "/guides/license-renewal" },
              ].map(({ title, desc, href }) => (
                <Link key={href} href={href} className="group bg-white border border-[#e2e8f0] rounded-xl p-4 hover:border-[#1a56a0]/30 hover:shadow-sm transition-all">
                  <p className="font-semibold text-[#0f1f3d] text-sm group-hover:text-[#1a56a0]">{title}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">{desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-[#1a56a0] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Track your CME requirements automatically</h2>
            <p className="text-white/75 mb-6 max-w-md mx-auto text-sm leading-relaxed">
              Stop tracking CME on spreadsheets. Hayya Med Pro calculates your compliance, tracks every category, and tells
              you exactly what you need before your renewal deadline.
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
            Hayya Med Pro supports CME tracking and compliance readiness. It does not issue licenses and does not replace
            official licensing authorities. Always verify final requirements directly with QCHP, SCFHS, DHA, GMC, or your relevant authority.
          </p>
        </main>
      </div>
    </>
  );
}

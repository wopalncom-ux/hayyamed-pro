import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "CME vs CPD â€” What's the Difference? GCC Healthcare Professional Guide",
  description:
    "CME (Continuing Medical Education) and CPD (Continuing Professional Development) are both used in GCC healthcare. Learn the difference, which term your licensing authority uses, and how credits count toward your renewal.",
  keywords: [
    "CME vs CPD",
    "difference between CME and CPD",
    "CME or CPD GCC",
    "continuing medical education vs continuing professional development",
    "CME CPD healthcare GCC",
    "QCHP CPD vs SCFHS CME",
    "what is CME",
    "what is CPD healthcare",
    "CME credits explained",
    "CPD portfolio healthcare",
  ],
  openGraph: {
    title: "CME vs CPD â€” What's the Difference for GCC Healthcare Professionals?",
    description:
      "QCHP uses CPD. SCFHS uses CME. DHA uses CME. What does each term mean â€” and do credits from one count toward the other? Complete GCC guide.",
    url: `${APP_URL}/cme-vs-cpd`,
    type: "website",
    images: [{ url: `${APP_URL}/api/og?t=CME+vs+CPD+%E2%80%94+What%27s+the+Difference%3F&s=QCHP+uses+CPD+%C2%B7+SCFHS+uses+CME+%C2%B7+DHA+uses+CME+%E2%80%94+the+complete+GCC+guide&a=%F0%9F%93%9A+Guide&k=Explainer`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CME vs CPD: The Complete GCC Healthcare Guide",
    description: "Which term does your licensing authority use? How are credits counted? The definitive answer for GCC healthcare professionals.",
  },
  alternates: { canonical: `${APP_URL}/cme-vs-cpd` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the difference between CME and CPD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CME (Continuing Medical Education) and CPD (Continuing Professional Development) are both frameworks for healthcare professionals to maintain their knowledge and skills after qualifying. CME is the older, more medically-focused term used widely in North America and adopted by many GCC countries including Saudi Arabia (SCFHS) and UAE Dubai (DHA). CPD is a broader concept used in UK and Commonwealth countries that encompasses not just clinical education but also management, communication, and leadership skills â€” adopted by Qatar (QCHP) and Bahrain (NHRA). In practice, both frameworks require healthcare professionals to log educational activities and earn credits toward license renewal. The credits are structured similarly; the main difference is terminology and which activities qualify.",
      },
    },
    {
      "@type": "Question",
      name: "Does QCHP use CME or CPD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "QCHP (Qatar Council for Healthcare Practitioners), now known as DHP-AS (Department of Healthcare Professionals â€“ Accreditation Section) under the Ministry of Public Health Qatar, uses the term CPD (Continuing Professional Development). Qatar requires all licensed healthcare professionals to complete 80 CPD credits per 2-year renewal cycle.",
      },
    },
    {
      "@type": "Question",
      name: "Does SCFHS use CME or CPD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS (Saudi Commission for Health Specialties) uses the term CME (Continuing Medical Education). Saudi healthcare professionals must complete 60 CME credits per year for physicians, pharmacists, and dentists, or 30 CME credits per year for nurses and allied health professionals.",
      },
    },
    {
      "@type": "Question",
      name: "Can CME credits from Saudi Arabia (SCFHS) count toward QCHP requirements in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not automatically. Each licensing authority maintains its own list of approved providers. However, activities accredited by internationally recognised bodies (such as AMA PRA Category 1, RCPCH, EACCME, or GMC) are often accepted by multiple GCC authorities. The activity itself may qualify for both â€” but you must submit it separately to each authority and verify it meets their specific category requirements. Hayya Med Pro lets you log each activity once and track its contribution to multiple jurisdiction wallets simultaneously.",
      },
    },
    {
      "@type": "Question",
      name: "Are CPD credits worth the same as CME credits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generally yes â€” 1 CPD credit is equivalent to approximately 1 hour of educational activity, as is 1 CME credit (1 AMA PRA Category 1 Credit = 1 hour of instruction). Both are typically awarded in increments of 0.5 or 1.0. However, the conversion may differ for certain activity types (e.g., research publications, teaching hours) where different authorities apply different multipliers. Always check the specific authority's credit calculation rules.",
      },
    },
    {
      "@type": "Question",
      name: "Which GCC countries use CPD vs CME terminology?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CPD terminology: Qatar (QCHP/DHP-AS), Bahrain (NHRA), UAE Abu Dhabi (DOH). CME terminology: Saudi Arabia (SCFHS), UAE Dubai (DHA), Kuwait (MOH), Oman (OMSB). Despite the different terms, all seven GCC licensing authorities require healthcare professionals to earn credits through continuing education activities and maintain a portfolio for license renewal.",
      },
    },
  ],
};

const AUTHORITY_TERMS = [
  { country: "ðŸ‡¶ðŸ‡¦ Qatar", authority: "QCHP / DHP-AS", term: "CPD", credits: "80 / 2yr", href: "/qchp" },
  { country: "ðŸ‡¸ðŸ‡¦ Saudi Arabia", authority: "SCFHS", term: "CME", credits: "60 / yr (physicians)", href: "/scfhs" },
  { country: "ðŸ‡¦ðŸ‡ª UAE â€” Dubai", authority: "DHA", term: "CME", credits: "40 / 2yr", href: "/dha" },
  { country: "ðŸ‡¦ðŸ‡ª UAE â€” Abu Dhabi", authority: "DOH", term: "CPD", credits: "40 / 2yr", href: "/doh" },
  { country: "ðŸ‡°ðŸ‡¼ Kuwait", authority: "MOH Kuwait", term: "CME", credits: "30 / yr (physicians)", href: "/moh-kuwait" },
  { country: "ðŸ‡§ðŸ‡­ Bahrain", authority: "NHRA", term: "CPD", credits: "40 / 2yr", href: "/nhra" },
  { country: "ðŸ‡´ðŸ‡² Oman", authority: "OMSB", term: "CME", credits: "40 / 2yr (physicians)", href: "/omsb" },
];

const SIMILARITIES = [
  { icon: "ðŸŽ¯", title: "Both require credit accumulation", desc: "Whether called CME or CPD, healthcare professionals must earn a set number of credits per renewal cycle through approved educational activities." },
  { icon: "ðŸ“‹", title: "Both use activity logs", desc: "Every authority requires you to maintain a portfolio or log of activities â€” provider name, date, credit value, and often a certificate of attendance." },
  { icon: "âœ…", title: "Both accept similar activity types", desc: "Conferences, workshops, online courses, research, and teaching activities are accepted by virtually every GCC authority under both frameworks." },
  { icon: "ðŸ”„", title: "Both link to license renewal", desc: "Failing to meet CME or CPD requirements means your license renewal application will be rejected. Both are mandatory, not optional." },
];

const DIFFERENCES = [
  { aspect: "Origin", cme: "North American medical education system (ACCME)", cpd: "UK/Commonwealth professional regulation (GMC, NMC)" },
  { aspect: "Scope", cme: "Primarily clinical and medical knowledge", cpd: "Broader: clinical + management, communication, leadership" },
  { aspect: "Portfolio style", cme: "Credit-based log with certificates", cpd: "Reflective portfolio â€” learning needs, outcomes, and reflection" },
  { aspect: "Who uses it", cme: "SCFHS, DHA, MOH Kuwait, OMSB", cpd: "QCHP, DOH, NHRA" },
  { aspect: "Online cap", cme: "Typically 30â€“50% of total credits", cpd: "Typically 30â€“50% of total credits (same in practice)" },
];

export default function CmeVsCpdPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Nav */}
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
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors"
            >
              Start free â†’
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12">

          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1a56a0] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              ðŸ“š CME vs CPD Â· GCC Healthcare Professionals Â· Complete Guide
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-4 leading-tight">
              CME vs CPD â€” what&apos;s the difference<br className="hidden sm:block" /> for GCC healthcare professionals?
            </h1>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
              QCHP Qatar calls it <strong className="text-[#111]">CPD</strong>. SCFHS Saudi Arabia calls it <strong className="text-[#111]">CME</strong>.
              DHA Dubai calls it <strong className="text-[#111]">CME</strong>. Bahrain NHRA calls it <strong className="text-[#111]">CPD</strong> again.
              Here&apos;s what it all means â€” and why it matters for your license renewal.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#1a56a0] text-white font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-[#154890] transition-colors"
              >
                Track my CME / CPD â€” free â†’
              </Link>
              <Link
                href="/countries"
                className="inline-flex items-center gap-1 text-sm text-[#64748b] hover:text-[#1a56a0] transition-colors"
              >
                Compare all GCC requirements â†’
              </Link>
            </div>
            <p className="text-xs text-[#94a3b8] mt-3">Works for both CME and CPD Â· All GCC authorities supported</p>
          </div>

          {/* Short answer card */}
          <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-8 mb-10">
            <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">The short answer</h2>
            <p className="text-sm text-[#374151] leading-relaxed mb-4">
              <strong>CME</strong> and <strong>CPD</strong> are two names for the same fundamental concept: healthcare professionals must keep
              their knowledge and skills up to date after qualifying, and their licensing authority requires proof of this to renew their license.
            </p>
            <p className="text-sm text-[#374151] leading-relaxed mb-4">
              The terminology differs by country and licensing authority. In GCC countries, the term depends entirely on which authority
              regulates your profession and license. Some authorities use CME; others use CPD. In practice, the requirements are
              structurally identical â€” you earn credits by completing approved educational activities and submit a portfolio at renewal time.
            </p>
            <p className="text-sm text-[#1a56a0] font-semibold">
              Hayya Med Pro tracks both â€” you log activities once and it applies them to whichever framework your authority uses.
            </p>
          </div>

          {/* Which authority uses which term */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-5 border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111]">Which GCC authority uses CME vs CPD?</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Country</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Authority</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Term used</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Credits required</th>
                  </tr>
                </thead>
                <tbody>
                  {AUTHORITY_TERMS.map((r, i) => (
                    <tr key={r.authority} className={`border-b border-[#f8fafc] ${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}>
                      <td className="px-5 py-3.5 font-medium text-[#111]">{r.country}</td>
                      <td className="px-5 py-3.5">
                        <Link href={r.href} className="text-[#1a56a0] hover:underline font-medium text-xs">{r.authority}</Link>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          r.term === "CPD"
                            ? "bg-[#eff6ff] text-[#1e40af]"
                            : "bg-[#f0fdf4] text-[#15803d]"
                        }`}>
                          {r.term}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center text-sm font-bold text-[#1a56a0]">{r.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* What they have in common */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-2">What CME and CPD have in common</h2>
            <p className="text-sm text-[#64748b] mb-6">
              Despite the different names, both frameworks work almost identically across the GCC.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SIMILARITIES.map((s) => (
                <div key={s.title} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xl">{s.icon}</span>
                    <h3 className="text-sm font-semibold text-[#111]">{s.title}</h3>
                  </div>
                  <p className="text-xs text-[#64748b] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Where they differ */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-10 shadow-sm">
            <div className="px-6 py-5 border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111]">Where CME and CPD differ</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9] bg-[#f8fafc]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide w-1/4"></th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#15803d] uppercase tracking-wide w-3/8">CME</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#1e40af] uppercase tracking-wide w-3/8">CPD</th>
                  </tr>
                </thead>
                <tbody>
                  {DIFFERENCES.map((d, i) => (
                    <tr key={d.aspect} className={`border-b border-[#f8fafc] ${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}>
                      <td className="px-5 py-3.5 text-xs font-semibold text-[#64748b] uppercase tracking-wide">{d.aspect}</td>
                      <td className="px-4 py-3.5 text-xs text-[#374151] text-center">{d.cme}</td>
                      <td className="px-4 py-3.5 text-xs text-[#374151] text-center">{d.cpd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-6">Frequently asked questions</h2>
            <div className="space-y-3">
              {faqLd.mainEntity.map((faq) => (
                <details
                  key={faq.name}
                  className="bg-white rounded-xl border border-[#e2e8f0] group"
                >
                  <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-[#111] list-none flex items-center justify-between gap-4 hover:bg-[#f8fafc] rounded-xl transition-colors">
                    {faq.name}
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f1f5f9] text-[#64748b] text-xs flex items-center justify-center font-bold group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-[#64748b] leading-relaxed border-t border-[#f1f5f9] pt-3">
                    {faq.acceptedAnswer.text}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Profession guides */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-4">Requirements by profession</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/physician-cme",  icon: "ðŸ©º", title: "Physicians",   sub: "60 CME/yr in Saudi Â· 80 CPD/2yr in Qatar Â· 40/2yr in UAE" },
                { href: "/nurse-cpd",      icon: "ðŸ‘©â€âš•ï¸", title: "Nurses",      sub: "30 CME/yr in Saudi Â· 20/yr in Kuwait Â· 80 CPD/2yr in Qatar" },
                { href: "/pharmacist-cme", icon: "ðŸ’Š", title: "Pharmacists",  sub: "60 CME/yr in Saudi Â· 80 CPD/2yr in Qatar Â· 40/2yr in UAE" },
              ].map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:border-[#1a56a0] hover:shadow-sm transition-all"
                >
                  <p className="text-2xl mb-2">{p.icon}</p>
                  <p className="text-sm font-semibold text-[#111] mb-1">{p.title}</p>
                  <p className="text-xs text-[#64748b] leading-relaxed">{p.sub}</p>
                  <p className="text-xs text-[#1a56a0] font-medium mt-2">Full guide â†’</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Country guides */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#111] mb-4">Requirements by country</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {AUTHORITY_TERMS.map((r) => (
                <Link
                  key={r.authority}
                  href={r.href}
                  className="bg-white rounded-xl border border-[#e2e8f0] p-4 hover:border-[#1a56a0] hover:shadow-sm transition-all text-center"
                >
                  <p className="text-xl mb-1">{r.country.split(" ")[0]}</p>
                  <p className="text-xs font-semibold text-[#111] leading-tight">{r.country.split(" ").slice(1).join(" ")}</p>
                  <p className="text-[10px] text-[#64748b] mt-0.5">{r.authority}</p>
                  <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    r.term === "CPD" ? "bg-[#eff6ff] text-[#1e40af]" : "bg-[#f0fdf4] text-[#15803d]"
                  }`}>{r.term}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Dark CTA */}
          <div className="rounded-2xl bg-[#0f1f3d] px-8 py-10 text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              One app for CME and CPD â€” across every GCC authority
            </h2>
            <p className="text-[#94a3b8] text-sm max-w-xl mx-auto mb-6">
              Whether your authority calls it CME or CPD, Hayya Med Pro tracks your credits, enforces category caps,
              sends renewal reminders, and generates your submission-ready compliance report.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#1a56a0] font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Start tracking free â†’ 14-day Pro trial
            </Link>
            <p className="text-[#475569] text-xs mt-3">No credit card required Â· Works for QCHP, SCFHS, DHA, DOH, NHRA, OMSB, MOH Kuwait</p>
          </div>

          {/* Disclaimer */}
          <div className="bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e]">
            Hayya Med Pro supports CME and CPD tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities.
            Users must verify final requirements with their relevant regulatory body. Requirements shown are based on official publications and are subject to change.
          </div>
        </main>
      </div>
    </>
  );
}

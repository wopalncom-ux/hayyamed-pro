import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Global CME Requirements 2025 â€” International CME Guide by Country | Hayya Med Pro",
  description:
    "Complete guide to CME and CPD requirements for healthcare professionals worldwide. GCC (QCHP, SCFHS, DHA), UK (GMC), Australia (AHPRA), India (NMC), Egypt (EMS), Jordan (JMC), and more. Track any licence in one app.",
  keywords: [
    "global CME requirements",
    "CME requirements by country",
    "international CME requirements 2025",
    "global doctor CME credits",
    "healthcare professional CME worldwide",
    "international medical CME guide",
    "CME requirements GCC UK Australia India",
    "global medical license renewal CME",
    "continuing medical education international",
    "CME credits by country comparison",
    "global CPD requirements healthcare",
    "international physician CME tracker",
  ],
  openGraph: {
    title: "Global CME Requirements 2025 â€” International CME Guide by Country",
    description:
      "GCC Â· UK GMC Â· Australia AHPRA Â· India NMC Â· Egypt EMS Â· Jordan JMC â€” CME requirements for every major healthcare market. Track any licence in one app.",
    url: `${APP_URL}/global-cme-requirements`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Global+CME+Requirements+2025&s=GCC+%C2%B7+UK+%C2%B7+Australia+%C2%B7+India+%C2%B7+Egypt+%C2%B7+Jordan+%E2%80%94+every+major+market&a=%F0%9F%8C%90+Global&k=International+Hub`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/global-cme-requirements` },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
    { "@type": "ListItem", position: 2, name: "Global CME Requirements", item: `${APP_URL}/global-cme-requirements` },
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do doctors need internationally?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CME credit requirements vary widely by country and regulatory authority. In the GCC: QCHP Qatar requires 80 CPD credits per 2-year cycle; SCFHS Saudi Arabia requires 60 CME credits per year; DHA Dubai requires 40 CME credits per 2-year cycle. Outside GCC: UK GMC requires 50 CPD hours per year (250 over 5 years); Australia AHPRA requires ~50 hours per year; India NMC requires 30 CME credits per 5-year cycle; Egypt EMS requires 25 CME credits per year; Jordan JMC requires 30 CME credits per year.",
      },
    },
    {
      "@type": "Question",
      name: "Do international CME credits (AMA-PRA, EACCME) count across multiple countries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Many international CME accreditations are mutually recognised across markets. AMA-PRA Category 1 credits (USA) are accepted by QCHP, SCFHS, DHA, and many other authorities. EACCME credits (European CME) are accepted in GCC, UK, and most European markets. Royal College credits (UK) are accepted by QCHP and some other GCC authorities. However, mutual recognition is not universal â€” always verify with your specific licensing authority before relying on credits from another country.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track CME for multiple countries in one app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-jurisdiction CME tracking. You can set up separate compliance wallets for each country or authority â€” for example, QCHP (Qatar), SCFHS (Saudi Arabia), and UK GMC simultaneously. Each wallet tracks independently with separate credit totals, cycle dates, and compliance status. Log an activity once and assign it to the relevant wallets.",
      },
    },
    {
      "@type": "Question",
      name: "Which countries have the strictest CME requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Saudi Arabia (SCFHS) has among the highest annual CME requirements globally â€” 60 CME credits per year for physicians. Qatar (QCHP) requires 80 CPD credits per 2-year cycle (40 per year). The UK GMC requires 50 CPD hours per year with a detailed portfolio review every 5 years. Australia AHPRA requires approximately 50 hours per year across mandatory CPD domains. Kuwait MOH is notable for a strict annual renewal cycle (30 CME/year) and the tightest online cap in the GCC region (30%).",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between CME and CPD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CME (Continuing Medical Education) and CPD (Continuing Professional Development) are terms used interchangeably in many contexts but differ in emphasis. CME traditionally refers to formal educational activities focused on clinical knowledge, while CPD is broader â€” including leadership, communication, ethics, quality improvement, and professional skills. GCC countries like Qatar (QCHP), Bahrain (NHRA), and UAE Abu Dhabi (DOH) use 'CPD'. Saudi Arabia (SCFHS), Kuwait (MOH), and Oman (OMSB) use 'CME'. The UK, Australia, and India all use 'CPD'. The activities that qualify are broadly similar regardless of terminology.",
      },
    },
  ],
};

const REGIONS = [
  {
    region: "GCC â€” Gulf Cooperation Council",
    flag: "ðŸŒ",
    countries: [
      { flag: "ðŸ‡¶ðŸ‡¦", name: "Qatar â€” QCHP",         term: "CPD",  credits: "80",  cycle: "2 years",  link: "/qchp" },
      { flag: "ðŸ‡¸ðŸ‡¦", name: "Saudi Arabia â€” SCFHS",  term: "CME",  credits: "60",  cycle: "1 year",   link: "/scfhs" },
      { flag: "ðŸ‡¦ðŸ‡ª", name: "UAE Dubai â€” DHA",       term: "CME",  credits: "40",  cycle: "2 years",  link: "/dha" },
      { flag: "ðŸ‡¦ðŸ‡ª", name: "UAE Abu Dhabi â€” DOH",   term: "CPD",  credits: "40",  cycle: "2 years",  link: "/doh" },
      { flag: "ðŸ‡°ðŸ‡¼", name: "Kuwait â€” MOH",          term: "CME",  credits: "30",  cycle: "1 year",   link: "/moh-kuwait" },
      { flag: "ðŸ‡§ðŸ‡­", name: "Bahrain â€” NHRA",        term: "CPD",  credits: "40",  cycle: "2 years",  link: "/nhra" },
      { flag: "ðŸ‡´ðŸ‡²", name: "Oman â€” OMSB",           term: "CME",  credits: "40",  cycle: "2 years",  link: "/omsb" },
    ],
  },
  {
    region: "Phase 2 â€” MENA Expansion",
    flag: "ðŸŒ",
    countries: [
      { flag: "ðŸ‡ªðŸ‡¬", name: "Egypt â€” EMS",           term: "CME",  credits: "25",  cycle: "1 year",   link: "/egypt-cme" },
      { flag: "ðŸ‡¯ðŸ‡´", name: "Jordan â€” JMC",          term: "CME",  credits: "30",  cycle: "1 year",   link: "/jordan-cme" },
    ],
  },
  {
    region: "International Markets",
    flag: "ðŸŒ",
    countries: [
      { flag: "ðŸ‡¬ðŸ‡§", name: "UK â€” GMC (Physicians)", term: "CPD",  credits: "50",  cycle: "1 year",   link: "/gmc-cpd" },
      { flag: "ðŸ‡¦ðŸ‡º", name: "Australia â€” AHPRA",     term: "CPD",  credits: "~50", cycle: "1 year",   link: "/ahpra-cpd" },
      { flag: "ðŸ‡®ðŸ‡³", name: "India â€” NMC",           term: "CME",  credits: "30",  cycle: "5 years",  link: "/nmc-india-cme" },
    ],
  },
];

const ACCREDITOR_TABLE = [
  { accreditor: "AMA-PRA Category 1 (USA)", accepted: ["QCHP", "SCFHS", "DHA", "DOH", "OMSB", "NMC (India)"] },
  { accreditor: "EACCME (Europe)", accepted: ["QCHP", "SCFHS", "DHA", "UK GMC", "AHPRA"] },
  { accreditor: "Royal College (UK)", accepted: ["QCHP", "GMC", "AHPRA", "some GCC authorities"] },
  { accreditor: "ACGME / ACCME (USA)", accepted: ["QCHP", "SCFHS", "DHA"] },
  { accreditor: "RACGP / RANZCP (Australia)", accepted: ["AHPRA", "recognised by some GCC authorities"] },
  { accreditor: "ICO (Ophthalmology)", accepted: ["QCHP", "SCFHS", "DHA", "AAN", "worldwide"] },
];

export default function GlobalCmeRequirementsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸŒ International CME Hub
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,52px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
            Global CME Requirements 2025
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 660, margin: "0 auto 20px" }}>
            CME and CPD credit requirements for every major healthcare market â€” GCC, UK, Australia, India, Egypt, Jordan, and more.
            Track any licence in one compliance dashboard.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            {["7 GCC Countries", "UK GMC", "Australia AHPRA", "India NMC", "Egypt EMS", "Jordan JMC"].map((t) => (
              <span key={t} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "4px 12px", fontSize: 13, color: "#e2e8f0" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{ background: "#1a56a0", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}>
              Track my CME â€” free â†’
            </Link>
            <Link href="/gcc-cme-requirements" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}>
              GCC guide â†’
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: "#1a56a0", padding: "24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { n: "10+", label: "Countries covered" },
            { n: "3", label: "Regions" },
            { n: "15+", label: "Licensing authorities" },
            { n: "1", label: "App to track them all" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 2 }}>{s.n}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Requirements by region */}
      {REGIONS.map((r) => (
        <section key={r.region} style={{ background: r.region.includes("GCC") ? "#fff" : "#f8fafc", padding: "64px 24px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>
              {r.flag} {r.region}
            </h2>
            <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40, fontSize: 15 }}>
              CME/CPD credit requirements by country and licensing authority
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <thead>
                  <tr style={{ background: "#1a56a0", color: "#fff" }}>
                    {["Country / Authority", "Term", "Credits Required", "Renewal Cycle", "Guide"].map((h) => (
                      <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600, fontSize: 14 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.countries.map((c, i) => (
                    <tr key={c.name} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#0f172a" }}>{c.flag} {c.name}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: "#eff6ff", color: "#1a56a0", fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 4 }}>{c.term}</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#1a56a0", fontSize: 18 }}>{c.credits}</td>
                      <td style={{ padding: "14px 16px", color: "#374151" }}>{c.cycle}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <Link href={c.link} style={{ color: "#1a56a0", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                          View guide â†’
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ))}

      {/* Accreditor cross-recognition */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>
            International CME accreditor cross-recognition
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40, fontSize: 15 }}>
            Where your international CME credits may count. Always verify with your licensing authority.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600, fontSize: 14, color: "#374151" }}>Accreditor</th>
                  <th style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600, fontSize: 14, color: "#374151" }}>Accepted by</th>
                </tr>
              </thead>
              <tbody>
                {ACCREDITOR_TABLE.map((row, i) => (
                  <tr key={row.accreditor} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "#0f172a" }}>{row.accreditor}</td>
                    <td style={{ padding: "14px 16px", color: "#64748b", fontSize: 14 }}>{row.accepted.join(" Â· ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, marginTop: 16 }}>
            Cross-recognition rules change. Always verify directly with your licensing authority before attending an event.
          </p>
        </div>
      </section>

      {/* Regional guide cards */}
      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>
            Explore CME guides by region
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              {
                title: "GCC â€” All 7 Countries",
                icon: "ðŸŒ",
                desc: "Complete requirements for QCHP, SCFHS, DHA, DOH, MOH Kuwait, NHRA, and OMSB in one comparison table.",
                href: "/gcc-cme-requirements",
                cta: "View GCC guide â†’",
              },
              {
                title: "UK â€” GMC CPD",
                icon: "ðŸ‡¬ðŸ‡§",
                desc: "GMC revalidation â€” 50 CPD hours/year, 250 over 5 years. Annual appraisal + enhanced portfolio review.",
                href: "/gmc-cpd",
                cta: "View UK GMC guide â†’",
              },
              {
                title: "Australia â€” AHPRA CPD",
                icon: "ðŸ‡¦ðŸ‡º",
                desc: "2023 AHPRA framework â€” 50 CPD hours/year across 4 mandatory domains including Practice Review.",
                href: "/ahpra-cpd",
                cta: "View AHPRA guide â†’",
              },
              {
                title: "India â€” NMC CME",
                icon: "ðŸ‡®ðŸ‡³",
                desc: "NMC Medical Education Regulations â€” 30 CME credits per 5-year cycle. 1.2M+ Indian doctors in GCC.",
                href: "/nmc-india-cme",
                cta: "View NMC guide â†’",
              },
              {
                title: "Egypt â€” EMS CME",
                icon: "ðŸ‡ªðŸ‡¬",
                desc: "Egyptian Medical Syndicate â€” 25 CME credits/year. 600K+ Egyptian healthcare professionals in GCC.",
                href: "/egypt-cme",
                cta: "View Egypt guide â†’",
              },
              {
                title: "Jordan â€” JMC CME",
                icon: "ðŸ‡¯ðŸ‡´",
                desc: "Jordan Medical Council â€” 30 CME credits/year. Arab world's medical education hub â€” large GCC diaspora.",
                href: "/jordan-cme",
                cta: "View Jordan guide â†’",
              },
            ].map((card) => (
              <div key={card.href} style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{card.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{card.title}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: 15, marginBottom: 16 }}>{card.desc}</p>
                <Link href={card.href} style={{ color: "#1a56a0", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                  {card.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>
            Global CME â€” Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {faqLd.mainEntity.map((q) => (
              <div key={q.name} style={{ background: "#f8fafc", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{q.name}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 15 }}>{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CME vs CPD callout */}
      <section style={{ background: "#eff6ff", padding: "48px 24px", borderTop: "1px solid #bfdbfe", borderBottom: "1px solid #bfdbfe" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", marginBottom: 12 }}>CME vs CPD â€” What's the difference?</h3>
          <p style={{ color: "#1e40af", fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
            CME (Continuing Medical Education) focuses on clinical knowledge. CPD (Continuing Professional Development) is broader â€” including ethics, leadership, and quality improvement. Most GCC authorities use one term but accept the same activity types.
          </p>
          <Link href="/cme-vs-cpd" style={{ color: "#1a56a0", fontWeight: 600, fontSize: 14 }}>
            Read the full CME vs CPD guide â†’
          </Link>
        </div>
      </section>

      {/* Dark CTA */}
      <section style={{ background: "#0f1f3d", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
            Track CME for any country â€” in one app
          </h2>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginBottom: 32 }}>
            Set up compliance wallets for every licence you hold. GCC, UK, Australia, India, Egypt, Jordan â€” all in one dashboard. Free to start.
          </p>
          <Link href="/register" style={{ background: "#1a56a0", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 17, display: "inline-block" }}>
            Start tracking free â†’
          </Link>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 16 }}>No credit card required Â· Free plan always available</p>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ background: "#f8fafc", padding: "32px 24px", borderTop: "1px solid #e2e8f0" }}>
        <p style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. CME requirements change â€” always verify current requirements directly with your licensing authority before your renewal date.
        </p>
      </section>
    </>
  );
}

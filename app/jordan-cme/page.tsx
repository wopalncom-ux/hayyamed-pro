import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Jordan CME Requirements â€” Jordan Medical Council CME Guide | Hayya Med Pro",
  description:
    "Complete CME guide for Jordanian healthcare professionals. Jordan Medical Council (JMC): 30 CME credits/year. Hundreds of thousands of Jordanian doctors work in GCC â€” track your Jordanian and GCC licences in one app.",
  keywords: [
    "Jordan CME requirements",
    "Jordan Medical Council CME",
    "JMC CME credits Jordan",
    "Jordanian doctor CME",
    "Jordan medical license renewal CME",
    "Jordanian healthcare professional GCC",
    "Jordanian doctor Saudi Arabia CME",
    "continuing medical education Jordan",
    "Jordanian physician CME tracker",
    "Jordan nurse CPD",
    "Jordan GCC dual license CME",
    "High Health Council Jordan CME",
  ],
  openGraph: {
    title: "Jordan CME Requirements â€” Jordan Medical Council Guide",
    description:
      "Jordan Medical Council (JMC): 30 CME credits/year. Large Jordanian healthcare diaspora in GCC â€” track Jordan + GCC licences in one app.",
    url: `${APP_URL}/jordan-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Jordan+CME+Requirements+2025&s=Jordan+Medical+Council+%C2%B7+30+CME%2Fyr+%C2%B7+GCC+dual+licence+tracking&a=%F0%9F%87%AF%F0%9F%87%B4+Jordan&k=Country+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/jordan-cme` },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
    { "@type": "ListItem", position: 2, name: "CME by Country", item: `${APP_URL}/countries` },
    { "@type": "ListItem", position: 3, name: "Jordan CME", item: `${APP_URL}/jordan-cme` },
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do Jordanian doctors need per year?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Jordan Medical Council (JMC) requires physicians to complete a minimum of 30 CME credits per year to renew their medical licence. The High Health Council (HHC) oversees CME accreditation and provider approval in Jordan. Specialist physicians may have additional CME requirements set by their respective Jordanian specialty boards.",
      },
    },
    {
      "@type": "Question",
      name: "Do Jordanian CME credits count toward GCC licence requirements (QCHP, SCFHS, DHA)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Jordanian CME activities count toward GCC requirements if they are accredited by an internationally recognised body (AMA-PRA, EACCME, Royal Colleges) or a body approved by the GCC licensing authority. JMC-only accreditation is not automatically accepted by QCHP or SCFHS. Activities at Jordan University Hospital, King Hussein Cancer Centre, or international society-accredited conferences are more likely to meet dual requirements.",
      },
    },
    {
      "@type": "Question",
      name: "I have both a Jordanian and a Saudi SCFHS licence â€” how do I track both?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayya Med Pro supports multi-jurisdiction CME tracking. You can set up separate compliance wallets for your Jordan Medical Council requirements (30 CME/yr) and your SCFHS requirements (60 CME/yr for physicians). Each wallet tracks independently with separate cycle dates, credit totals, and compliance status. Log an activity once and assign it to the wallet(s) it qualifies for.",
      },
    },
    {
      "@type": "Question",
      name: "What CME activities does the Jordan Medical Council accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Jordan Medical Council (JMC) and High Health Council (HHC) accept: accredited conferences and scientific meetings, workshops and skills-based training, approved online CME courses, published peer-reviewed research, and postgraduate training programmes. International meetings accredited by AMA, EACCME, RCPCH, or other recognised bodies also count. Activities must be from HHC-approved providers or internationally recognised accreditors.",
      },
    },
    {
      "@type": "Question",
      name: "Can Jordanian doctors working in GCC maintain their Jordanian licence while abroad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Jordanian doctors working in GCC countries can fulfil JMC CME requirements through international conferences, GCC-based accredited workshops, and approved online CME programmes. CME activities at GCC hospitals â€” particularly those with international accreditation (JCI) â€” often qualify for JMC credit if the accreditor is recognised. Hayya Med Pro tracks both your GCC and Jordanian CME requirements simultaneously.",
      },
    },
  ],
};

const KEY_FACTS = [
  { label: "Authority", value: "Jordan Medical Council (JMC)" },
  { label: "CME Credits", value: "30 credits / year" },
  { label: "Accreditor", value: "High Health Council (HHC)" },
  { label: "Renewal Cycle", value: "Annual" },
  { label: "Known for", value: "Medical education hub â€” trains for GCC" },
];

const GCC_COMPARISON = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP",  country: "Qatar",        cycle: "80 CPD / 2 yr",  note: "40/yr minimum" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia", cycle: "60 CME / yr",    note: "Physicians + dentists" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA",   country: "UAE (Dubai)",  cycle: "40 CME / 2 yr",  note: "5 patient safety mandatory" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH",   country: "UAE (Abu Dhabi)", cycle: "40 CPD / cycle", note: "Verify per category" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH",   country: "Kuwait",       cycle: "30 CME / yr",    note: "Annual renewal" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA",  country: "Bahrain",      cycle: "40 CPD / 2 yr",  note: "Structured + unstructured" },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB",  country: "Oman",         cycle: "40 CME / 2 yr",  note: "Category A & B" },
];

const NOTES = [
  {
    icon: "ðŸ¥",
    title: "Jordan is a regional medical education hub",
    body: "Jordan has some of the highest physician-to-population ratios in the Arab world and trains doctors for the entire MENA region. Many Jordanian doctors pursue careers in GCC while maintaining their JMC registration â€” often holding simultaneous SCFHS, QCHP, or DHA licences.",
  },
  {
    icon: "ðŸ“‹",
    title: "Track both licences in one app",
    body: "Hayya Med Pro lets you set up compliance wallets for Jordan Medical Council requirements (30 CME/yr) and your GCC licence (QCHP, SCFHS, DHA, etc.) simultaneously. Never let either licence lapse while managing a dual-country healthcare career.",
  },
  {
    icon: "ðŸŒ",
    title: "Dataflow and credential verification for GCC",
    body: "Jordanian healthcare professionals entering GCC typically need to complete Dataflow (primary source verification) for their Jordanian credentials before receiving a GCC licence. QCHP, SCFHS, and DHA all require this step. Hayya Med Pro tracks your CME while credential verification is in progress.",
  },
  {
    icon: "ðŸ›",
    title: "Major Jordanian academic centres",
    body: "University of Jordan Hospital, Jordan University of Science and Technology (JUST), King Abdullah University Hospital, and King Hussein Cancer Centre all host accredited CME activities. These are recognised by JMC and, when internationally accredited, by GCC authorities as well.",
  },
];

export default function JordanCmePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸ‡¯ðŸ‡´ Country CME Guide
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Jordan CME Requirements<br />Jordan Medical Council
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 620, margin: "0 auto 32px" }}>
            JMC requires 30 CME credits per year. Jordan is the Arab world's medical
            education hub â€” track your Jordanian and GCC licences in one compliance app.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{ background: "#1a56a0", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}>
              Track my CME free â†’
            </Link>
            <Link href="/gcc-cme-requirements" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}>
              GCC CME requirements
            </Link>
          </div>
        </div>
      </section>

      {/* Key facts */}
      <section style={{ background: "#f8fafc", padding: "48px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {KEY_FACTS.map((f) => (
              <div key={f.label} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e2e8f0", textAlign: "center" }}>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GCC Comparison */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>
            Also licensed in GCC? Track all authorities in one app
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>
            Many Jordanian professionals hold both a JMC and a GCC licence. Each authority has different CME requirements.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <thead>
                <tr style={{ background: "#1a56a0", color: "#fff" }}>
                  {["Authority", "Country", "CME/CPD Cycle", "Notes"].map((h) => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600, fontSize: 14 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GCC_COMPARISON.map((a, i) => (
                  <tr key={a.name} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#0f172a" }}>{a.flag} {a.name}</td>
                    <td style={{ padding: "14px 16px", color: "#374151" }}>{a.country}</td>
                    <td style={{ padding: "14px 16px", color: "#374151" }}>{a.cycle}</td>
                    <td style={{ padding: "14px 16px", color: "#64748b", fontSize: 14 }}>{a.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>
            What Jordanian Healthcare Professionals Need to Know
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {NOTES.map((n) => (
              <div key={n.title} style={{ background: "#fff", borderRadius: 12, padding: 28, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{n.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{n.title}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: 15 }}>{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#f0f4f8", padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>
            Jordan CME â€” Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {faqLd.mainEntity.map((q) => (
              <div key={q.name} style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{q.name}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 15 }}>{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section style={{ background: "#fff", padding: "48px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 32 }}>
            Related CME guides
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {[
              { href: "/qchp",                    label: "ðŸ‡¶ðŸ‡¦ QCHP Qatar" },
              { href: "/scfhs",                   label: "ðŸ‡¸ðŸ‡¦ SCFHS Saudi" },
              { href: "/dha",                     label: "ðŸ‡¦ðŸ‡ª DHA Dubai" },
              { href: "/gcc-cme-requirements",    label: "ðŸŒ All GCC Requirements" },
              { href: "/egypt-cme",               label: "ðŸ‡ªðŸ‡¬ Egypt CME" },
              { href: "/global-cme-requirements", label: "ðŸŒ Global CME Hub" },
              { href: "/physician-cme",           label: "ðŸ©º Physician CME" },
              { href: "/cme-tracker",             label: "ðŸ“Š CME Tracker" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", textAlign: "center", textDecoration: "none", color: "#1a56a0", fontWeight: 600, fontSize: 14 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dark CTA */}
      <section style={{ background: "#0f1f3d", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 16 }}>
            Track your Jordanian and GCC CME â€” free
          </h2>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginBottom: 32 }}>
            Set up wallets for Jordan Medical Council and all 7 GCC authorities in one compliance dashboard.
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
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with the Jordan Medical Council, High Health Council, or their relevant regulatory body.
        </p>
      </section>
    </>
  );
}

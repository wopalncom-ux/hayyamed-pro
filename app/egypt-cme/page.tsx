import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Egypt CME Requirements â€” Egyptian Medical Syndicate CME Guide | Hayya Med Pro",
  description:
    "Complete CME guide for Egyptian healthcare professionals. Egyptian Medical Syndicate (EMS): 25 CME credits/year. Plus: hundreds of thousands of Egyptian doctors working in GCC â€” track both your Egyptian and GCC licences in one app.",
  keywords: [
    "Egypt CME requirements",
    "Egyptian Medical Syndicate CME",
    "EMS CME credits Egypt",
    "Egyptian doctor CME",
    "Egypt medical license renewal CME",
    "Egyptian healthcare professional GCC",
    "Egyptian doctor Saudi Arabia CME",
    "Egypt HCHET CME requirements",
    "continuing medical education Egypt",
    "Egyptian physician CME tracker",
    "Egyptian nurse CPD",
    "Egypt GCC dual license CME",
  ],
  openGraph: {
    title: "Egypt CME Requirements â€” Egyptian Medical Syndicate Guide",
    description:
      "Egyptian Medical Syndicate (EMS): 25 CME credits/year. 600K+ Egyptian healthcare professionals in GCC â€” track Egypt + GCC licences in one app.",
    url: `${APP_URL}/egypt-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Egypt+CME+Requirements+2025&s=Egyptian+Medical+Syndicate+%C2%B7+25+CME%2Fyr+%C2%B7+GCC+dual+licence+tracking&a=%F0%9F%87%AA%F0%9F%87%AC+Egypt&k=Country+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/egypt-cme` },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
    { "@type": "ListItem", position: 2, name: "CME by Country", item: `${APP_URL}/countries` },
    { "@type": "ListItem", position: 3, name: "Egypt CME", item: `${APP_URL}/egypt-cme` },
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do Egyptian doctors need per year?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Egyptian Medical Syndicate (EMS) requires physicians to complete a minimum of 25 CME credits per year to maintain their licence in good standing. The High Commission for Health Education and Training (HCHET) oversees accreditation of CME providers. For specialist registration, additional CME requirements may apply based on the Egyptian Medical Speciality Board (EMSB) standards.",
      },
    },
    {
      "@type": "Question",
      name: "Do Egyptian CME credits count toward GCC licence requirements (QCHP, SCFHS, DHA)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Egyptian CME activities count toward GCC requirements if they were accredited by a recognised international body (AMA-PRA, EACCME, Royal Colleges) or by an authority that the GCC licensing body accepts. Simply attending an Egyptian Medical Syndicate-accredited event is not automatically sufficient for QCHP or SCFHS â€” the accreditor must be on the approved list. Always check with your GCC authority before relying on Egyptian CME credits for a GCC licence.",
      },
    },
    {
      "@type": "Question",
      name: "I have both an Egyptian licence and a Saudi SCFHS licence â€” how do I track both?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hayya Med Pro supports multi-jurisdiction tracking. You can set up separate compliance wallets for your Egyptian Medical Syndicate requirements (25 CME/yr) and your SCFHS requirements (60 CME/yr for physicians). Each wallet tracks independently with separate cycle dates, credit totals, and compliance status. Log an activity once and assign it to the relevant wallet.",
      },
    },
    {
      "@type": "Question",
      name: "What CME activities does the Egyptian Medical Syndicate accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Egyptian Medical Syndicate (EMS) and HCHET accept: accredited conferences and symposia, workshops and hands-on training, approved online CME courses, published research (peer-reviewed journals), and postgraduate training programmes. International conferences accredited by AMA, EACCME, or Royal Colleges also count. Activities must be from HCHET-approved providers to earn EMS CME credit.",
      },
    },
    {
      "@type": "Question",
      name: "Can Egyptian doctors working in GCC maintain their Egyptian licence while abroad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Egyptian doctors working in GCC countries can fulfil EMS CME requirements through international conferences, GCC-based accredited workshops, and approved online CME programmes. CME activities attended at GCC hospitals (QCHP, SCFHS, DHA-accredited) often qualify for EMS credits if the accreditor is recognised. Hayya Med Pro tracks both your GCC and Egyptian CME simultaneously so you never let either licence lapse.",
      },
    },
  ],
};

const KEY_FACTS = [
  { label: "Authority", value: "Egyptian Medical Syndicate (EMS)" },
  { label: "CME Credits", value: "25 credits / year" },
  { label: "Accreditor", value: "HCHET (High Commission for Health Education & Training)" },
  { label: "Renewal Cycle", value: "Annual" },
  { label: "GCC Diaspora", value: "600K+ Egyptian healthcare professionals in GCC" },
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
    icon: "ðŸŒ",
    title: "600K+ Egyptians work in GCC",
    body: "Egypt is the single largest source of healthcare professionals in the GCC. Hundreds of thousands of Egyptian doctors, nurses, pharmacists, and allied health professionals work in Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, and Oman â€” many holding both an Egyptian and at least one GCC licence.",
  },
  {
    icon: "ðŸ“‹",
    title: "Track both licences in one app",
    body: "Hayya Med Pro lets you set up compliance wallets for your Egyptian Medical Syndicate requirements and your GCC licence (QCHP, SCFHS, DHA, etc.) simultaneously. Never let either licence lapse while managing a dual-country career.",
  },
  {
    icon: "ðŸ¥",
    title: "Dataflow and primary source verification",
    body: "Egyptian healthcare professionals entering the GCC typically need to complete Dataflow (primary source verification) for their Egyptian licence before receiving a GCC licence. QCHP, SCFHS, and DHA all require this. Hayya Med Pro helps you track your CME while Dataflow is in progress.",
  },
  {
    icon: "ðŸ“š",
    title: "Egyptian Medical Speciality Board (EMSB)",
    body: "For specialist physicians, the EMSB may require additional CME beyond the EMS baseline. Board-certified specialists should verify their specific CME requirements with the relevant Egyptian specialty board. International fellowship programmes also carry their own CME requirements.",
  },
];

export default function EgyptCmePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸ‡ªðŸ‡¬ Country CME Guide
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Egypt CME Requirements<br />Egyptian Medical Syndicate
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 620, margin: "0 auto 32px" }}>
            EMS requires 25 CME credits per year. Over 600,000 Egyptian healthcare professionals
            work in GCC â€” track your Egyptian and GCC licences in one compliance app.
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
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
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
            Most Egyptian professionals in GCC hold both an Egyptian and a GCC licence. Each authority has different CME requirements.
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
            What Egyptian Healthcare Professionals Need to Know
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
            Egypt CME â€” Frequently Asked Questions
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
              { href: "/qchp",                  label: "ðŸ‡¶ðŸ‡¦ QCHP Qatar" },
              { href: "/scfhs",                 label: "ðŸ‡¸ðŸ‡¦ SCFHS Saudi" },
              { href: "/dha",                   label: "ðŸ‡¦ðŸ‡ª DHA Dubai" },
              { href: "/gcc-cme-requirements",  label: "ðŸŒ All GCC Requirements" },
              { href: "/jordan-cme",            label: "ðŸ‡¯ðŸ‡´ Jordan CME" },
              { href: "/global-cme-requirements", label: "ðŸŒ Global CME Hub" },
              { href: "/physician-cme",         label: "ðŸ©º Physician CME" },
              { href: "/cme-tracker",           label: "ðŸ“Š CME Tracker" },
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
            Track your Egyptian and GCC CME â€” free
          </h2>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginBottom: 32 }}>
            Set up wallets for Egyptian Medical Syndicate and all 7 GCC authorities in one compliance dashboard.
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
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with the Egyptian Medical Syndicate, HCHET, or their relevant regulatory body.
        </p>
      </section>
    </>
  );
}

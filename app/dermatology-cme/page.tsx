import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Dermatology CME Requirements in GCC â€” Dermatologist CME Guide | Hayya Med Pro",
  description:
    "Complete CME and CPD guide for dermatologists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Laser, cosmetic, and procedural workshops count. Track all 7 authorities in one app.",
  keywords: [
    "dermatology CME requirements GCC",
    "dermatologist CME Saudi Arabia",
    "SCFHS dermatology CME",
    "QCHP dermatologist CPD",
    "dermatology CPD Qatar",
    "cosmetic dermatology CME GCC",
    "laser training CME dermatology",
    "dermatologist license renewal GCC",
    "AAD EADV CME recognition GCC",
    "continuing medical education dermatology",
    "GCC dermatologist compliance",
    "dermatopathology CME",
  ],
  openGraph: {
    title: "Dermatology CME Requirements in GCC â€” Dermatologist Guide",
    description:
      "QCHP Qatar 80 CPD/2yr Â· SCFHS Saudi 60 CME/yr Â· DHA Dubai 40 CME/2yr. Laser + cosmetic procedures count. Track all GCC dermatology requirements.",
    url: `${APP_URL}/dermatology-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Dermatology+CME+%E2%80%94+GCC+Guide&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+laser+%2B+procedural+CME+%C2%B7+Free+to+track&a=%F0%9F%A9%BA+Dermatology&k=Specialty+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/dermatology-cme` },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
    { "@type": "ListItem", position: 2, name: "CME by Specialty", item: `${APP_URL}/physician-cme` },
    { "@type": "ListItem", position: 3, name: "Dermatology CME", item: `${APP_URL}/dermatology-cme` },
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a dermatologist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dermatologists registered with SCFHS must complete 60 CME credits per year. Events accredited by the Saudi Dermatology Society (SDS), AAD, EADV, and other internationally recognised dermatology bodies count. No more than 50% of credits may come from online activities. Procedural workshops â€” including laser, cosmetic dermatology, and dermatosurgery courses â€” count toward the clinical activity category.",
      },
    },
    {
      "@type": "Question",
      name: "Does laser training and cosmetic dermatology certification count as CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Accredited laser safety and practical training courses, botulinum toxin workshops, filler certification programmes, and cosmetic dermatology masterclasses count as CME when offered by an approved training provider. QCHP, SCFHS, and DHA recognise hands-on procedural workshops as clinical CME credits, often with higher credit weights than lecture-based activities.",
      },
    },
    {
      "@type": "Question",
      name: "Are AAD and EADV conferences recognised for CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. AAD (American Academy of Dermatology) Annual Meeting and EADV (European Academy of Dermatology and Venereology) Congress are widely recognised by QCHP, SCFHS, and DHA when credits are awarded by AMA-PRA, EACCME, or a Royal College. Always retain your certificate of attendance with the credit hours listed. QCHP recommends confirming acceptance of the specific accrediting body before attending.",
      },
    },
    {
      "@type": "Question",
      name: "Does dermatopathology training count as CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Accredited dermatopathology workshops, histopathology case review sessions, and dermoscopy certification programmes count as CME. These typically fall under the clinical knowledge category. The British Society for Dermatopathology and the International Society of Dermatopathology offer programmes that are generally accepted by GCC authorities when the accreditation body is recognised.",
      },
    },
    {
      "@type": "Question",
      name: "Can a dermatologist track CME for both QCHP (Qatar) and DHA (Dubai) simultaneously?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-jurisdiction tracking. Dermatologists with licences in both Qatar and Dubai can maintain separate QCHP and DHA wallets within one account. Each wallet tracks independently â€” separate credit totals, cycle dates, and compliance statuses â€” so both licences stay current without any double-counting confusion.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP",  country: "Qatar",        cycle: "80 CPD / 2 yr",  note: "40/yr minimum, ethics mandatory" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia", cycle: "60 CME / yr",    note: "SDS & international societies recognised" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA",   country: "UAE (Dubai)",  cycle: "40 CME / 2 yr",  note: "5 patient safety credits mandatory" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH",   country: "UAE (Abu Dhabi)", cycle: "40 CPD / cycle", note: "Verify per licence category" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH",   country: "Kuwait",       cycle: "30 CME / yr",    note: "Annual renewal, 30% online cap" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA",  country: "Bahrain",      cycle: "40 CPD / 2 yr",  note: "Structured + unstructured split" },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB",  country: "Oman",         cycle: "40 CME / 2 yr",  note: "Category A & B framework" },
];

const SPECIALTY_NOTES = [
  {
    icon: "ðŸ’†",
    title: "Procedural workshops fully count",
    body: "Laser safety training, injectables masterclasses (botulinum toxin, fillers), chemical peel workshops, and dermatosurgery courses count as clinical CME across all 7 GCC authorities when from an accredited provider.",
  },
  {
    icon: "ðŸ”¬",
    title: "Dermoscopy certification",
    body: "Accredited dermoscopy courses (Level 1/2 certificat programmes by the International Dermoscopy Society) are recognised by QCHP and SCFHS under the clinical skills category. They can contribute 5â€“15 CME credits per course.",
  },
  {
    icon: "ðŸ§¬",
    title: "Dermatopathology & histopathology",
    body: "Dermatopathology review sessions, histopathology reporting workshops, and immunohistochemistry interpretation courses count toward SCFHS and QCHP clinical CME credits â€” particularly relevant for dermatologists with lab affiliations.",
  },
  {
    icon: "ðŸŒ",
    title: "Saudi Dermatology Society (SDS)",
    body: "SDS-accredited events are the primary source of dermatology-specific CME recognised by SCFHS in Saudi Arabia. The annual SDS congress typically offers 15â€“25 CME credits and is highly recommended for SCFHS-registered dermatologists.",
  },
];

export default function DermatologyCmePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸ©º Specialty CME Guide
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Dermatology CME Requirements<br />Across GCC
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 620, margin: "0 auto 32px" }}>
            QCHP Qatar Â· SCFHS Saudi Arabia Â· DHA Dubai Â· and 4 more authorities.
            Laser training, cosmetic procedures, and dermatopathology workshops all count.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{ background: "#1a56a0", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}>
              Start tracking free â†’
            </Link>
            <Link href="/pricing" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}>
              View plans
            </Link>
          </div>
        </div>
      </section>

      {/* Requirements Table */}
      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>
            Dermatology CME Requirements by Authority
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>
            General physician requirements apply to dermatologists. Verify current rules with your licensing authority.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <thead>
                <tr style={{ background: "#1a56a0", color: "#fff" }}>
                  {["Authority", "Country", "CME/CPD Cycle", "Dermatology Notes"].map((h) => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontWeight: 600, fontSize: 14 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AUTHORITIES.map((a, i) => (
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

      {/* Specialty Notes */}
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>
            What GCC Dermatologists Need to Know
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {SPECIALTY_NOTES.map((n) => (
              <div key={n.title} style={{ background: "#f8fafc", borderRadius: 12, padding: 28, border: "1px solid #e2e8f0" }}>
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
            Dermatology CME â€” Frequently Asked Questions
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
      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 40 }}>
            More CME Specialty Guides
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {[
              { href: "/cardiology-cme",         label: "â¤ï¸ Cardiology" },
              { href: "/neurology-cme",           label: "ðŸ§  Neurology" },
              { href: "/internal-medicine-cme",   label: "ðŸ©º Internal Medicine" },
              { href: "/emergency-medicine-cme",  label: "ðŸš‘ Emergency Med" },
              { href: "/ophthalmology-cme",       label: "ðŸ‘ Ophthalmology" },
              { href: "/nephrology-cme",          label: "ðŸ©» Nephrology" },
              { href: "/psychiatry-cme",          label: "ðŸ§© Psychiatry" },
              { href: "/physician-cme",           label: "ðŸ‘¨â€âš•ï¸ All Physicians" },
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
            Never miss a dermatology CME deadline
          </h2>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginBottom: 32 }}>
            Track QCHP, SCFHS, DHA, and 4 more authorities in one compliance dashboard. Free to start.
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
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with QCHP, SCFHS, DHA, or their relevant GCC authority.
        </p>
      </section>
    </>
  );
}

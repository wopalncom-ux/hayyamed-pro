import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Nephrology CME Requirements in GCC â€” Nephrologist CME Guide | Hayya Med Pro",
  description:
    "Complete CME and CPD guide for nephrologists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Dialysis training, renal biopsy, and transplant CME count. Track all 7 authorities.",
  keywords: [
    "nephrology CME requirements GCC",
    "nephrologist CME Saudi Arabia",
    "SCFHS nephrology CME",
    "QCHP nephrologist CPD",
    "nephrology CPD Qatar",
    "dialysis training CME GCC",
    "renal biopsy workshop CME",
    "nephrology license renewal GCC",
    "ERA EDTA ISN CME recognition GCC",
    "continuing medical education nephrology",
    "GCC nephrologist compliance",
    "kidney transplant CME GCC",
  ],
  openGraph: {
    title: "Nephrology CME Requirements in GCC â€” Nephrologist Guide",
    description:
      "QCHP Qatar 80 CPD/2yr Â· SCFHS Saudi 60 CME/yr Â· DHA Dubai 40 CME/2yr. Dialysis + renal biopsy workshops count. Track all GCC nephrology requirements.",
    url: `${APP_URL}/nephrology-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Nephrology+CME+%E2%80%94+GCC+Guide&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+dialysis+%2B+transplant+CME+%C2%B7+Free+to+track&a=%F0%9F%AB%81+Nephrology&k=Specialty+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/nephrology-cme` },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
    { "@type": "ListItem", position: 2, name: "CME by Specialty", item: `${APP_URL}/physician-cme` },
    { "@type": "ListItem", position: 3, name: "Nephrology CME", item: `${APP_URL}/nephrology-cme` },
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a nephrologist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS-registered nephrologists must complete 60 CME credits per year. Events accredited by the Saudi Society of Nephrology and Transplantation (SSNT), ERA-EDTA, ISN, and ASN count toward this requirement. No more than 50% may come from online activities. Dialysis training, renal biopsy workshops, peritoneal dialysis (PD) certification, and transplant medicine CME all count under clinical credits.",
      },
    },
    {
      "@type": "Question",
      name: "Does haemodialysis and peritoneal dialysis training count as CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Accredited HD machine training, PD catheter insertion workshops, dialysis adequacy assessment courses, and vascular access management programmes all count as clinical CME in QCHP, SCFHS, and DHA. These are recognised under the procedural competency or clinical skills category and typically earn 1.0â€“2.0 CME credits per contact hour.",
      },
    },
    {
      "@type": "Question",
      name: "Does renal biopsy training count as CME for nephrologists in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Accredited renal biopsy workshops covering ultrasound-guided biopsy technique, complication management, and histopathology interpretation are recognised as clinical CME by QCHP, SCFHS, and DHA. These hands-on workshops typically fall under the procedural or clinical skills category. Most GCC hospitals also require documented renal biopsy competency for credentialing.",
      },
    },
    {
      "@type": "Question",
      name: "Are ERA-EDTA and ISN conferences recognised for CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. ERA-EDTA Congress (EACCME credits) and ISN World Congress of Nephrology (AMA-PRA / ISN credits) are recognised by QCHP, SCFHS, and DHA. Retain your certificate of attendance listing credit hours and the accrediting body. Both QCHP and SCFHS accept EACCME and AMA-PRA Category 1 as recognised accreditation standards.",
      },
    },
    {
      "@type": "Question",
      name: "Can a nephrologist track CME for both QCHP and DHA licences in one app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-jurisdiction tracking. Nephrologists with both QCHP and DHA licences maintain separate wallets for each authority within one account. Each wallet independently tracks credits, cycle dates, and compliance status â€” so you can see at a glance which licence needs attention before renewal.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP",  country: "Qatar",        cycle: "80 CPD / 2 yr",  note: "Ethics CPD mandatory (â‰¥5 credits)" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia", cycle: "60 CME / yr",    note: "SSNT & ERA-EDTA/ISN/ASN recognised" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA",   country: "UAE (Dubai)",  cycle: "40 CME / 2 yr",  note: "5 patient safety credits mandatory" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH",   country: "UAE (Abu Dhabi)", cycle: "40 CPD / cycle", note: "Verify per licence category" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH",   country: "Kuwait",       cycle: "30 CME / yr",    note: "Annual renewal, 30% online cap" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA",  country: "Bahrain",      cycle: "40 CPD / 2 yr",  note: "Structured + unstructured split" },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB",  country: "Oman",         cycle: "40 CME / 2 yr",  note: "Category A & B framework" },
];

const SPECIALTY_NOTES = [
  {
    icon: "ðŸ«",
    title: "Dialysis training counts",
    body: "HD machine training, PD catheter insertion workshops, dialysis adequacy courses, and vascular access management programmes all count as clinical CME across GCC authorities under procedural competency.",
  },
  {
    icon: "ðŸ”¬",
    title: "Renal biopsy & histopathology",
    body: "Accredited renal biopsy workshops (ultrasound-guided technique, complication management) and histopathology interpretation sessions count as clinical CME at QCHP, SCFHS, and DHA â€” and are often required for hospital credentialing.",
  },
  {
    icon: "ðŸ’Š",
    title: "Transplant medicine CME",
    body: "Kidney transplant medicine courses â€” immunosuppression protocols, rejection management, post-transplant monitoring â€” count as specialty CME and are recognised by SSNT, ISN, and major GCC authorities. Highly valued for nephrologists in transplant centres.",
  },
  {
    icon: "ðŸ“Š",
    title: "Saudi Society of Nephrology (SSNT)",
    body: "SSNT-accredited events are the primary source of nephrology-specific CME recognised by SCFHS. The annual SSNT congress typically offers 15â€“20 CME credits. Active SSNT membership also provides CME credit opportunities through scientific committee activities.",
  },
];

export default function NephrologyCmePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸ« Specialty CME Guide
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Nephrology CME Requirements<br />Across GCC
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 620, margin: "0 auto 32px" }}>
            QCHP Qatar Â· SCFHS Saudi Arabia Â· DHA Dubai Â· and 4 more authorities.
            Dialysis training, renal biopsy, and transplant CME all count toward your licence.
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
            Nephrology CME Requirements by Authority
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>
            General physician requirements apply to nephrologists. Verify current rules with your licensing authority.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <thead>
                <tr style={{ background: "#1a56a0", color: "#fff" }}>
                  {["Authority", "Country", "CME/CPD Cycle", "Nephrology Notes"].map((h) => (
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
            What GCC Nephrologists Need to Know
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
            Nephrology CME â€” Frequently Asked Questions
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
              { href: "/cardiology-cme",        label: "â¤ï¸ Cardiology" },
              { href: "/internal-medicine-cme", label: "ðŸ©º Internal Medicine" },
              { href: "/dermatology-cme",       label: "ðŸ©º Dermatology" },
              { href: "/neurology-cme",         label: "ðŸ§  Neurology" },
              { href: "/ophthalmology-cme",     label: "ðŸ‘ Ophthalmology" },
              { href: "/surgery-cme",           label: "ðŸ”ª Surgery" },
              { href: "/psychiatry-cme",        label: "ðŸ§© Psychiatry" },
              { href: "/physician-cme",         label: "ðŸ‘¨â€âš•ï¸ All Physicians" },
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
            Never miss a nephrology CME deadline
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

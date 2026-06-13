import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Orthopedic Surgery CME Requirements in GCC â€” Orthopedic Surgeon CME Guide | Hayya Med Pro",
  description:
    "Complete CME and CPD guide for orthopedic surgeons in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. ATLS mandatory. Track all requirements in one compliance app.",
  keywords: [
    "orthopedic surgery CME requirements GCC",
    "orthopedic surgeon CME Saudi Arabia",
    "SCFHS orthopedics CME",
    "QCHP orthopedic CPD",
    "orthopaedic CME Qatar",
    "ATLS CME orthopedic surgeon",
    "surgical skills workshop CME GCC",
    "orthopedics license renewal GCC",
    "SICOT CME recognised SCFHS",
    "orthopedic CME tracker",
    "continuing medical education orthopedics",
    "orthopaedic surgery CPD GCC",
  ],
  openGraph: {
    title: "Orthopedic Surgery CME Requirements in GCC â€” Orthopedic Surgeon CME Guide",
    description:
      "QCHP Qatar 80 CPD/2yr Â· SCFHS Saudi 60 CME/yr Â· DHA Dubai 40 CME/2yr. ATLS mandatory. Track all GCC orthopedic CME requirements in one app.",
    url: `${APP_URL}/orthopedics-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Orthopedics+CME+%E2%80%94+GCC+Guide&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+ATLS+mandatory+%C2%B7+Free+to+track&a=%F0%9F%A6%B4+Orthopedics&k=Specialty+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/orthopedics-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does an orthopedic surgeon need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS-registered orthopedic surgeons must complete 60 CME credits per year. The Saudi Orthopaedic Society (SOS) is a recognised accreditor. At least 20 credits should come from orthopaedics-specific activities, and ATLS certification is recommended as part of the CME portfolio.",
      },
    },
    {
      "@type": "Question",
      name: "Is ATLS mandatory for QCHP CPD renewal for orthopedic surgeons?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ATLS (Advanced Trauma Life Support) certification earns CPD credits for QCHP-licensed orthopedic surgeons and is widely required for surgeons managing trauma. QCHP recommends ATLS renewal every 4 years. Each renewal course earns approximately 8 CPD credits.",
      },
    },
    {
      "@type": "Question",
      name: "Do surgical skills workshops count as CME for DHA-licensed orthopedic surgeons?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. DHA recognises hands-on surgical skills workshops for orthopedic surgeons, including arthroscopy, joint replacement techniques, spinal surgery workshops, and fracture fixation courses. These typically earn 4â€“16 CME credits depending on duration and the accrediting body.",
      },
    },
    {
      "@type": "Question",
      name: "Are SICOT, AAOS, and COA conferences recognised for GCC orthopedic CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SICOT (SociÃ©tÃ© Internationale de Chirurgie OrthopÃ©dique et de Traumatologie), AAOS (American Academy of Orthopaedic Surgeons) Annual Meeting, and COA (Canadian Orthopaedic Association) events are recognised by SCFHS and DHA. The Arab Orthopaedic Association (AOA) annual congress is especially relevant for GCC surgeons.",
      },
    },
    {
      "@type": "Question",
      name: "Can an orthopedic surgeon track CME for multiple GCC licences in one app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-licence tracking. Orthopedic surgeons holding QCHP, SCFHS, and DHA licences can log CME activities against each profile simultaneously, with separate compliance dashboards and renewal deadline alerts for each authority.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP",  country: "Qatar",        cycle: "80 CPD / 2 yr",   note: "ATLS recommended Â· trauma CME counts" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia",  cycle: "60 CME / yr",     note: "SOS recognised Â· surgical skills count" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA",   country: "Dubai",         cycle: "40 CME / 2 yr",   note: "Hands-on workshops recognised" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH",   country: "Abu Dhabi",     cycle: "40 CPD / cycle",  note: "Verify per licence category" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH",   country: "Kuwait",        cycle: "30 CME / yr",     note: "Ministry of Health approved" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA",  country: "Bahrain",       cycle: "40 CPD / 2 yr",   note: "NHRA accredited events" },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB",  country: "Oman",          cycle: "40 CME / 2 yr",   note: "Oman Medical Specialty Board" },
];

const SPECIALTY_NOTES = [
  {
    icon: "ðŸ†˜",
    title: "ATLS â€” Trauma Standard",
    body: "Advanced Trauma Life Support (ATLS) certification is the global standard for trauma surgeons and earns CPD credits across all GCC authorities. ATLS renewal every 4 years is recommended. Courses are available at accredited trauma centres across Qatar, Saudi Arabia, and UAE.",
  },
  {
    icon: "ðŸ”§",
    title: "Surgical Skills Workshops Count",
    body: "Arthroscopy, joint replacement, spinal instrumentation, and fracture fixation workshops earn hands-on CME credits. SCFHS and DHA both recognise laboratory-based surgical skills courses run by industry and academic medical centres, provided they are accredited.",
  },
  {
    icon: "ðŸŒ",
    title: "SICOT, AAOS & Arab Orthopaedic Association",
    body: "SICOT World Congress, AAOS Annual Meeting, and Arab Orthopaedic Association (AOA) events generate internationally recognised CME credits. SCFHS and DHA recognise credits from these events. The Saudi Orthopaedic Society (SOS) annual meeting is the premier GCC-focused event.",
  },
  {
    icon: "ðŸ“",
    title: "Biomechanics & Implant Training",
    body: "Industry-sponsored courses on implant biomechanics, surgical technique, and new fixation systems can earn CME credits when offered through accredited providers. QCHP and SCFHS limit commercially sponsored credits to a percentage of total CME â€” check your authority's cap before claiming.",
  },
];

export default function OrthopedicsCmePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸ¦´ Specialty CME Guide
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Orthopedic Surgery CME<br />Requirements Across GCC
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 620, margin: "0 auto 32px" }}>
            QCHP Qatar Â· SCFHS Saudi Arabia Â· DHA Dubai Â· and 4 more authorities.
            ATLS mandatory. Track every credit in one compliance dashboard.
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

      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>Orthopedic CME Requirements by Authority</h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>Verify current rules with your licensing authority before your renewal date.</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <thead>
                <tr style={{ background: "#1a56a0", color: "#fff" }}>
                  {["Authority", "Country", "CME/CPD Cycle", "Orthopedic Notes"].map((h) => (
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

      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>What GCC Orthopedic Surgeons Need to Know</h2>
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

      <section style={{ background: "#f0f4f8", padding: "64px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 48 }}>Orthopedic CME â€” Frequently Asked Questions</h2>
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

      <section style={{ background: "#fff", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 40 }}>More CME Specialty Guides</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {[
              { href: "/surgery-cme", label: "ðŸ”ª Surgery" },
              { href: "/cardiology-cme", label: "â¤ï¸ Cardiology" },
              { href: "/emergency-medicine-cme", label: "ðŸš‘ Emergency Med" },
              { href: "/anesthesia-cme", label: "ðŸ’‰ Anesthesia" },
              { href: "/radiology-cme", label: "ðŸ©» Radiology" },
              { href: "/internal-medicine-cme", label: "ðŸ©º Internal Med" },
              { href: "/physician-cme", label: "ðŸ‘¨â€âš•ï¸ All Physicians" },
              { href: "/nurse-cpd", label: "ðŸ‘©â€âš•ï¸ Nursing CPD" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", textAlign: "center", textDecoration: "none", color: "#1a56a0", fontWeight: 600, fontSize: 14 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#0f1f3d", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Never miss an orthopedic CME deadline</h2>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginBottom: 32 }}>Track QCHP, SCFHS, DHA, and 4 more authorities in one compliance dashboard. Free to start.</p>
          <Link href="/register" style={{ background: "#1a56a0", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 17, display: "inline-block" }}>
            Start tracking free â†’
          </Link>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 16 }}>No credit card required Â· Free plan always available</p>
        </div>
      </section>

      <section style={{ background: "#f8fafc", padding: "32px 24px", borderTop: "1px solid #e2e8f0" }}>
        <p style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
          Hayya Med PRO supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with their relevant regulatory body.
        </p>
      </section>
    </>
  );
}

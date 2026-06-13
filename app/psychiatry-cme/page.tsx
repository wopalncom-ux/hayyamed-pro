import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Psychiatry CME Requirements in GCC â€” Psychiatrist CME Guide | Hayya Med Pro",
  description:
    "Complete CME and CPD guide for psychiatrists in GCC. QCHP Qatar 80 CPD/2yr (ethics mandatory), SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. Track all requirements in one compliance app.",
  keywords: [
    "psychiatry CME requirements GCC",
    "psychiatrist CME Saudi Arabia",
    "SCFHS psychiatrist CME",
    "QCHP psychiatrist CPD",
    "psychiatry CPD Qatar",
    "mental health CME GCC",
    "psychiatrist license renewal Saudi Arabia",
    "ethics CME psychiatry",
    "psychiatry CME tracker",
    "continuing medical education psychiatry",
    "GCC psychiatrist compliance",
    "mental health law training CME",
  ],
  openGraph: {
    title: "Psychiatry CME Requirements in GCC â€” Psychiatrist CME Guide",
    description:
      "QCHP Qatar 80 CPD/2yr Â· SCFHS Saudi 60 CME/yr Â· DHA Dubai 40 CME/2yr. Ethics CPD mandatory. Track all GCC psychiatry requirements in one app.",
    url: `${APP_URL}/psychiatry-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Psychiatry+CME+%E2%80%94+GCC+Guide&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+ethics+mandatory+%C2%B7+Free+to+track&a=%F0%9F%A7%A0+Psychiatry&k=Specialty+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/psychiatry-cme` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a psychiatrist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS-registered psychiatrists must complete 60 CME credits per year. At least 20 credits must be in psychiatry-specific activities. Ethics and patient rights training is required in every renewal cycle. The Saudi Board of Psychiatry (SBP) and Saudi Mental Health Association (SMHA) are recognised accreditors.",
      },
    },
    {
      "@type": "Question",
      name: "Is ethics CPD mandatory for psychiatrists in Qatar (QCHP)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. QCHP requires all licensed psychiatrists to complete at least 5 CPD credits in medical ethics or patient rights per 2-year cycle. Mental health law training related to Qatar's Mental Health Law (2016) and involuntary admission procedures also counts toward CPD credits.",
      },
    },
    {
      "@type": "Question",
      name: "Does mental health law training count as CME for DHA-licensed psychiatrists?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. DHA-licensed psychiatrists can claim CME credits for accredited mental health law workshops, patient rights training, and safeguarding courses. A minimum of 5 CME credits in ethics or law is strongly recommended per renewal cycle in the UAE.",
      },
    },
    {
      "@type": "Question",
      name: "Which psychiatry conferences are recognised for CME across GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Saudi Mental Health Association (SMHA) annual congress, Gulf Psychiatry Association (GPA) meetings, Arab Board of Psychiatry conferences, and international meetings such as the World Psychiatric Association (WPA) congress are widely recognised. QCHP, SCFHS, and DHA each publish their own recognised accreditor lists â€” always verify before attendance.",
      },
    },
    {
      "@type": "Question",
      name: "Can a psychiatrist track CME for multiple GCC licenses in one app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-license tracking, allowing psychiatrists to log CME against separate QCHP, SCFHS, DHA, and DOH license profiles simultaneously. The compliance dashboard shows a separate status indicator for each authority, so nothing is missed at renewal.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP", country: "Qatar",        term: "2 years",  credits: 80,  cycle: "80 CPD / 2 yr",  note: "Ethics CPD mandatory (â‰¥5 credits)" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia", term: "Annual",   credits: 60,  cycle: "60 CME / yr",    note: "SBP & SMHA recognised" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA",   country: "Dubai",        term: "2 years",  credits: 40,  cycle: "40 CME / 2 yr",  note: "Ethics CME recommended" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH",   country: "Abu Dhabi",    term: "1â€“2 years",credits: 40,  cycle: "40 CPD / cycle", note: "Verify per licence category" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH",   country: "Kuwait",       term: "Annual",   credits: 30,  cycle: "30 CME / yr",    note: "Ministry of Health approved" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA",  country: "Bahrain",      term: "2 years",  credits: 40,  cycle: "40 CPD / 2 yr",  note: "NHRA accredited events" },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB",  country: "Oman",         term: "2 years",  credits: 40,  cycle: "40 CME / 2 yr",  note: "Oman Medical Specialty Board" },
];

const SPECIALTY_NOTES = [
  {
    icon: "âš–ï¸",
    title: "Ethics & Law â€” Non-Negotiable",
    body: "Ethics and patient rights credits are required (not optional) for QCHP renewal. Mental health law workshops covering Qatar Law No. 2 (2016) count toward CPD. DHA and SCFHS strongly recommend ethics credits each cycle.",
  },
  {
    icon: "ðŸ§ ",
    title: "Saudi Mental Health Association (SMHA)",
    body: "SMHA-accredited events are recognised by SCFHS and are the primary source of psychiatry-specific CME in Saudi Arabia. The annual SMHA congress typically offers 15â€“20 CME credits.",
  },
  {
    icon: "ðŸŒ",
    title: "Cultural Psychiatry & GCC Context",
    body: "Workshops addressing cultural competency, Arabic-language mental health communication, and GCC-specific patient presentations are increasingly recognised by QCHP and SCFHS. These distinguish GCC-trained psychiatrists internationally.",
  },
  {
    icon: "ðŸ“‹",
    title: "Quality Improvement & Clinical Audit",
    body: "Quality improvement projects, morbidity and mortality reviews, and clinical audit activities are accepted by QCHP and DHA for up to 10 CPD credits per cycle â€” valuable for psychiatrists in academic or hospital settings.",
  },
];

export default function PsychiatryCmePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/* Hero */}
      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸ§  Specialty CME Guide
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Psychiatry CME Requirements<br />Across GCC
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 620, margin: "0 auto 32px" }}>
            QCHP Qatar Â· SCFHS Saudi Arabia Â· DHA Dubai Â· and 4 more authorities.
            Ethics CPD mandatory. Track every credit in one compliance dashboard.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/register"
              style={{ background: "#1a56a0", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}
            >
              Start tracking free â†’
            </Link>
            <Link
              href="/pricing"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, textDecoration: "none", fontSize: 16 }}
            >
              View plans
            </Link>
          </div>
        </div>
      </section>

      {/* Requirements Table */}
      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", textAlign: "center", marginBottom: 8 }}>
            Psychiatry CME Requirements by Authority
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>
            Requirements for psychiatrists. Verify current rules with your licensing authority.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <thead>
                <tr style={{ background: "#1a56a0", color: "#fff" }}>
                  {["Authority", "Country", "CME/CPD Cycle", "Psychiatry Notes"].map((h) => (
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
            What GCC Psychiatrists Need to Know
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
            Psychiatry CME â€” Frequently Asked Questions
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
              { href: "/cardiology-cme", label: "â¤ï¸ Cardiology" },
              { href: "/internal-medicine-cme", label: "ðŸ©º Internal Medicine" },
              { href: "/emergency-medicine-cme", label: "ðŸš‘ Emergency Med" },
              { href: "/surgery-cme", label: "ðŸ”ª Surgery" },
              { href: "/pediatrics-cme", label: "ðŸ‘¶ Pediatrics" },
              { href: "/radiology-cme", label: "ðŸ©» Radiology" },
              { href: "/physician-cme", label: "ðŸ‘¨â€âš•ï¸ All Physicians" },
              { href: "/nurse-cpd", label: "ðŸ‘©â€âš•ï¸ Nursing CPD" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", textAlign: "center", textDecoration: "none", color: "#1a56a0", fontWeight: 600, fontSize: 14 }}
              >
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
            Never miss a psychiatry CME deadline
          </h2>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginBottom: 32 }}>
            Track QCHP, SCFHS, DHA, and 4 more authorities in one compliance dashboard. Free to start.
          </p>
          <Link
            href="/register"
            style={{ background: "#1a56a0", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 17, display: "inline-block" }}
          >
            Start tracking free â†’
          </Link>
          <p style={{ color: "#64748b", fontSize: 13, marginTop: 16 }}>
            No credit card required Â· Free plan always available
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ background: "#f8fafc", padding: "32px 24px", borderTop: "1px solid #e2e8f0" }}>
        <p style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", color: "#94a3b8", fontSize: 13, lineHeight: 1.7 }}>
          Hayya Med PRO supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with their relevant regulatory body.
        </p>
      </section>
    </>
  );
}

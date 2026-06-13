import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Neurology CME Requirements in GCC â€” Neurologist CME Guide | Hayya Med Pro",
  description:
    "Complete CME and CPD guide for neurologists in GCC. QCHP Qatar 80 CPD/2yr, SCFHS Saudi Arabia 60 CME/yr, DHA Dubai 40 CME/2yr. EEG, EMG workshops and stroke simulation count. Track all 7 GCC authorities in one app.",
  keywords: [
    "neurology CME requirements GCC",
    "neurologist CME Saudi Arabia",
    "SCFHS neurology CME",
    "QCHP neurologist CPD",
    "neurology CPD Qatar",
    "stroke CME GCC",
    "EEG EMG workshop CME",
    "neurologist license renewal GCC",
    "WFN AAN EAN CME recognition GCC",
    "continuing medical education neurology",
    "GCC neurologist compliance",
    "epilepsy CME GCC",
  ],
  openGraph: {
    title: "Neurology CME Requirements in GCC â€” Neurologist Guide",
    description:
      "QCHP Qatar 80 CPD/2yr Â· SCFHS Saudi 60 CME/yr Â· DHA Dubai 40 CME/2yr. EEG + stroke simulation count. Track all GCC neurology CME requirements.",
    url: `${APP_URL}/neurology-cme`,
    type: "website",
    images: [
      {
        url: `${APP_URL}/api/og?t=Neurology+CME+%E2%80%94+GCC+Guide&s=QCHP+%C2%B7+SCFHS+%C2%B7+DHA+%E2%80%94+EEG+%2B+stroke+CME+%C2%B7+Free+to+track&a=%F0%9F%A7%A0+Neurology&k=Specialty+Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: `${APP_URL}/neurology-cme` },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
    { "@type": "ListItem", position: 2, name: "CME by Specialty", item: `${APP_URL}/physician-cme` },
    { "@type": "ListItem", position: 3, name: "Neurology CME", item: `${APP_URL}/neurology-cme` },
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits does a neurologist need in Saudi Arabia (SCFHS)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS-registered neurologists must complete 60 CME credits per year. Events accredited by the Saudi Neurological Society (SNS), World Federation of Neurology (WFN), American Academy of Neurology (AAN), and European Academy of Neurology (EAN) count toward this requirement. No more than 50% of credits may come from online sources. Hands-on workshops â€” EEG, EMG, neurosonology, and stroke simulation â€” count as clinical credits.",
      },
    },
    {
      "@type": "Question",
      name: "Does EEG or EMG certification count as CME for GCC-licensed neurologists?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Accredited EEG interpretation workshops, EMG and nerve conduction study training programmes, and neurosonology (TCD/carotid duplex) certification courses count as clinical CME across QCHP, SCFHS, and DHA. These are typically awarded under the clinical skills or procedural competency category and often earn 1.5â€“2.0 CME credits per contact hour.",
      },
    },
    {
      "@type": "Question",
      name: "Is stroke management training mandatory for neurologists in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Stroke management training is not universally mandated by name in GCC CME rules, but most GCC hospital credentialing committees require current training in stroke protocols (including tPA administration and thrombectomy decision pathways). Accredited stroke simulation courses and NIHSS certification count as CME toward QCHP and SCFHS requirements in the clinical skills category.",
      },
    },
    {
      "@type": "Question",
      name: "Are AAN and EAN annual meetings recognised for CME in GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. AAN Annual Meeting (AMA-PRA Category 1 credits) and EAN Congress (EACCME credits) are recognised by QCHP, SCFHS, and DHA. Retain your certificate of attendance listing the credit hours and the accrediting body. QCHP and SCFHS both accept AMA-PRA Category 1 and EACCME as approved accreditation standards.",
      },
    },
    {
      "@type": "Question",
      name: "Can a neurologist track CME for both QCHP and DHA licences in one app?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hayya Med Pro supports multi-jurisdiction CME tracking. Neurologists with both QCHP and DHA licences can maintain separate wallets for each authority within a single account. Each wallet independently tracks credit totals, cycle dates, and compliance status â€” so you can see at a glance which licence needs attention.",
      },
    },
  ],
};

const AUTHORITIES = [
  { flag: "ðŸ‡¶ðŸ‡¦", name: "QCHP",  country: "Qatar",        cycle: "80 CPD / 2 yr",  note: "Ethics CPD mandatory (â‰¥5 credits)" },
  { flag: "ðŸ‡¸ðŸ‡¦", name: "SCFHS", country: "Saudi Arabia", cycle: "60 CME / yr",    note: "SNS & WFN/AAN/EAN recognised" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DHA",   country: "UAE (Dubai)",  cycle: "40 CME / 2 yr",  note: "5 patient safety credits mandatory" },
  { flag: "ðŸ‡¦ðŸ‡ª", name: "DOH",   country: "UAE (Abu Dhabi)", cycle: "40 CPD / cycle", note: "Verify per licence category" },
  { flag: "ðŸ‡°ðŸ‡¼", name: "MOH",   country: "Kuwait",       cycle: "30 CME / yr",    note: "Annual renewal, 30% online cap" },
  { flag: "ðŸ‡§ðŸ‡­", name: "NHRA",  country: "Bahrain",      cycle: "40 CPD / 2 yr",  note: "Structured + unstructured split" },
  { flag: "ðŸ‡´ðŸ‡²", name: "OMSB",  country: "Oman",         cycle: "40 CME / 2 yr",  note: "Category A & B framework" },
];

const SPECIALTY_NOTES = [
  {
    icon: "âš¡",
    title: "EEG, EMG & neurosonology count",
    body: "Accredited EEG interpretation workshops, EMG training programmes, nerve conduction studies, and transcranial Doppler (TCD) courses count as clinical CME across all 7 GCC authorities under the procedural competency category.",
  },
  {
    icon: "ðŸ¥",
    title: "Stroke simulation & NIHSS",
    body: "NIHSS certification and accredited stroke simulation courses count as clinical CME in QCHP and SCFHS. Most GCC hospitals require these for credentialing â€” combining CME and hospital privilege maintenance.",
  },
  {
    icon: "ðŸ§¬",
    title: "Saudi Neurological Society (SNS)",
    body: "SNS-accredited events are the primary source of neurology-specific CME recognised by SCFHS. The annual SNS convention offers 15â€“25 CME credits and is the most efficient single-event route to SCFHS compliance.",
  },
  {
    icon: "ðŸ“‹",
    title: "Epilepsy & headache specialisation",
    body: "Accredited epilepsy management workshops, EEG interpretation for epilepsy, and headache medicine CME courses (migraine, cluster) all count as clinical CME. The International League Against Epilepsy (ILAE) runs recognised GCC courses.",
  },
];

export default function NeurologyCmePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Hero */}
      <section style={{ background: "#0f1f3d", color: "#fff", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#93c5fd", marginBottom: 16 }}>
            ðŸ§  Specialty CME Guide
          </p>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
            Neurology CME Requirements<br />Across GCC
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", maxWidth: 620, margin: "0 auto 32px" }}>
            QCHP Qatar Â· SCFHS Saudi Arabia Â· DHA Dubai Â· and 4 more authorities.
            EEG, stroke simulation, and EMG workshops all count toward your licence.
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
            Neurology CME Requirements by Authority
          </h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 40 }}>
            General physician requirements apply to neurologists. Verify current rules with your licensing authority.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <thead>
                <tr style={{ background: "#1a56a0", color: "#fff" }}>
                  {["Authority", "Country", "CME/CPD Cycle", "Neurology Notes"].map((h) => (
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
            What GCC Neurologists Need to Know
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
            Neurology CME â€” Frequently Asked Questions
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
              { href: "/dermatology-cme",       label: "ðŸ©º Dermatology" },
              { href: "/internal-medicine-cme", label: "ðŸ”¬ Internal Medicine" },
              { href: "/emergency-medicine-cme",label: "ðŸš‘ Emergency Med" },
              { href: "/ophthalmology-cme",     label: "ðŸ‘ Ophthalmology" },
              { href: "/nephrology-cme",        label: "ðŸ« Nephrology" },
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
            Never miss a neurology CME deadline
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

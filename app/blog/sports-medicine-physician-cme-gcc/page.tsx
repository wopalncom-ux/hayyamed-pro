import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sports Medicine Physician CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for sports medicine physicians in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, event coverage credentials, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Sports Medicine Physician CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for sports medicine physicians practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Sports Medicine Physician CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Sports Medicine Physician CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Sports medicine in the GCC has expanded significantly with Qatar hosting FIFA World Cup 2022, Saudi Arabia's Vision 2030 sport investments, and elite athletic infrastructure across the region. Physicians in this specialty must maintain CME compliance alongside sport-specific credentialing."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Sports Medicine Physician CME Requirements by Authority</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Authority</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Country</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Credits</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Cycle</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year minimum; ASPIRE Academy accepted"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Sports medicine specialty board track"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "Annual reporting"],
              ["DOH", "UAE (Abu Dhabi)", "30–50 CPD", "1–2 years", "By classification"],
              ["MOH Kuwait", "Kuwait", "30 CME", "1 year", "Annual renewal"],
              ["NHRA", "Bahrain", "40 CPD", "2 years", "Verified activities required"],
              ["OMSB", "Oman", "40 CME", "2 years", "OMSB-accepted formats"],
            ].map(([auth, country, credits, cycle, note]) => (
              <tr key={auth} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", fontWeight: 600 }}>{auth}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{country}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{credits}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{cycle}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", color: "#64748b", fontSize: "0.85em" }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>The GCC Sports Medicine Context</h2>
        <p>Qatar&apos;s Aspire Zone, the Mohammed bin Rashid Al Maktoum Sports Hub in Dubai, and Saudi Arabia&apos;s Saudi Pro League expansion have created significant demand for qualified sports medicine physicians. The region hosts elite football clubs, national Olympic programmes, and international sporting events year-round. QCHP recognises sports medicine as a standalone specialty; physicians working with national federations or elite academies should confirm that their institutional credentials (e.g. FIFA Medical Centre of Excellence, FIFPro) align with their CME documentation.</p>

        <h2>Key CME Topics for Sports Medicine Physicians</h2>
        <ul>
          <li><strong>Musculoskeletal injury management</strong> — ACL rehabilitation protocols, shoulder instability, tendinopathy management</li>
          <li><strong>Concussion and head injury</strong> — Sport Concussion Assessment Tool (SCAT6), return-to-play protocols, pitchside assessment</li>
          <li><strong>Cardiac screening in athletes</strong> — ECG interpretation, sudden cardiac death prevention, pre-participation evaluation</li>
          <li><strong>Heat illness</strong> — critical in the GCC; exertional heat stroke management, cooling protocols, hydration science</li>
          <li><strong>Anti-doping</strong> — WADA Code updates, TUE applications, prohibited substances list</li>
          <li><strong>Imaging in sports medicine</strong> — MSK ultrasound, MRI interpretation for soft tissue injuries</li>
          <li><strong>Exercise physiology</strong> — altitude training, performance optimisation, overtraining syndrome</li>
          <li><strong>Sports nutrition and supplementation</strong> — evidence base, permitted vs prohibited supplements, GCC dietary considerations</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>FIFA Medical Conference</li>
          <li>International Federation of Sports Medicine (FIMS) World Congress</li>
          <li>British Association of Sport and Exercise Medicine (BASEM) Annual Conference</li>
          <li>Qatar Orthopaedics and Sports Medicine Hospital (QOSMH) symposia — QCHP credited</li>
          <li>Arab Health — sports medicine and rehabilitation sessions</li>
          <li>Saudi Sports Medicine Federation Annual Meeting</li>
        </ul>

        <h2>Anti-Doping CME Requirements</h2>
        <p>Physicians working with athletes competing under WADA-governed sports must complete anti-doping education. WADA&apos;s ADEL online platform provides structured modules that are recognised as CME by several GCC authorities. This is particularly important for team physicians working with national federations — Qatar Olympic Committee and Saudi Olympic Committee both require team physicians to hold current anti-doping credentials.</p>

        <h2>Track Your Sports Medicine CME</h2>
        <p>Hayya Med Pro tracks CME credits per country with automated renewal alerts, so you can focus on your athletes without missing a licensing deadline.</p>

        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}

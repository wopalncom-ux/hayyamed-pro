import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geriatric Psychiatrist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for geriatric psychiatrists and old age psychiatry specialists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, dementia, late-life depression, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Geriatric Psychiatrist CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for geriatric psychiatrists practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Geriatric Psychiatrist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Geriatric Psychiatrist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Geriatric psychiatry addresses mental health in older adults — dementia, late-life depression, delirium, and psychosis in ageing populations. The GCC faces a rapidly growing older adult demographic as expatriate populations age and national longevity increases, creating strong demand for this specialist expertise."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Geriatric Psychiatrist CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year; NHMC mental health units"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Psychiatry specialty board track"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "Annual reporting"],
              ["DOH", "UAE (Abu Dhabi)", "30–50 CPD", "1–2 years", "By professional classification"],
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

        <h2>The Growing GCC Geriatric Psychiatry Demand</h2>
        <p>The GCC&apos;s demographic profile is shifting. Qatar&apos;s National Mental Health Strategy and Saudi Arabia&apos;s National Programme for Mental Health both include explicit sections on older adult mental health as a priority area. The UAE&apos;s Healthy Ageing strategy (part of Vision 2021&apos;s successor) identifies cognitive health and late-life depression as targets. GCC hospitals increasingly have dedicated Memory Clinics or Old Age Psychiatry units — and the psychiatrists working in those units are expected to hold specialty-specific CME documentation beyond the general psychiatry requirement.</p>

        <h2>Key CME Topics for Geriatric Psychiatrists</h2>
        <ul>
          <li><strong>Dementia diagnosis and management</strong> — Alzheimer&apos;s disease, Lewy body dementia, frontotemporal dementia, vascular dementia — NIA-AA diagnostic criteria updates, lecanemab and donanemab clinical implications</li>
          <li><strong>Behavioural and psychological symptoms of dementia (BPSD)</strong> — non-pharmacological interventions first-line, antipsychotic prescribing risks in dementia, carer education</li>
          <li><strong>Late-life depression</strong> — differential diagnosis from dementia, ECT in older adults, antidepressant safety profile in comorbid cardiac and renal disease</li>
          <li><strong>Delirium</strong> — prevention protocols, hyperactive vs hypoactive delirium, delirium in the ICU, post-operative delirium management</li>
          <li><strong>Late-onset psychosis</strong> — very late onset schizophrenia-like psychosis, antipsychotic prescribing in older adults, metabolic monitoring</li>
          <li><strong>Capacity assessment and guardianship</strong> — GCC legal frameworks, cognitive assessment tools (ACE-III, MoCA), decision-making capacity documentation</li>
          <li><strong>Caregiver burden and family systems</strong> — the cultural context of family caregiving in GCC societies, respite services, carer mental health</li>
          <li><strong>Palliative psychiatry</strong> — mental health at end of life, existential distress, terminal agitation management</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>International Psychogeriatric Association (IPA) World Congress</li>
          <li>Royal College of Psychiatrists (RCPsych) International Congress — Old Age Psychiatry faculty</li>
          <li>American Association for Geriatric Psychiatry (AAGP) Annual Meeting</li>
          <li>Alzheimer&apos;s Association International Conference (AAIC)</li>
          <li>Arab Board of Psychiatry CME days — GCC-region credited</li>
          <li>Gulf Psychiatry Forum — QCHP and SCFHS recognised activity</li>
        </ul>

        <h2>Capacity Assessment and Legal Frameworks</h2>
        <p>GCC jurisdictions vary in their legal frameworks for guardianship and incapacity. Qatar operates under Law No. 4 of 2004 on Mental Health; Saudi Arabia under the Mental Health System regulations. Geriatric psychiatrists must be familiar with capacity assessment tools and with the procedural requirements in each country where they practise. CME courses covering medico-legal aspects of old age psychiatry — including documentation standards and court preparation — are accepted as formal CME by GCC authorities when accredited by a recognised body.</p>

        <h2>Track Your Geriatric Psychiatry CME</h2>
        <p>Hayya Med Pro tracks CME per country and per cycle with automated gap analysis. Upload international congress certificates and GCC-region workshop documentation — all stored securely with signed URL access.</p>

        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}

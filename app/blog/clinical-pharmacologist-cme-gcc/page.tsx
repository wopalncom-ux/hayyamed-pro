import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Pharmacologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for clinical pharmacologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, pharmacovigilance, drug regulation, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Clinical Pharmacologist CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for clinical pharmacologists practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Clinical Pharmacologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Clinical Pharmacologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Clinical pharmacology bridges medicine and pharmacy, with GCC professionals working across hospital clinical pharmacology units, pharmaceutical industry, drug regulatory agencies, and academic medical centres. CME requirements reflect this breadth — spanning pharmacovigilance, therapeutics, and clinical trial methodology."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Clinical Pharmacologist CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year; MOPH drug regulatory alignment"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "SFDA-regulated professionals"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "MOHAP-registered practitioners"],
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

        <h2>Clinical Pharmacology in the GCC Context</h2>
        <p>GCC drug regulatory agencies — Qatar&apos;s Ministry of Public Health, Saudi Arabia&apos;s SFDA, UAE&apos;s Ministry of Health and Prevention (MOHAP) — have significantly expanded their clinical pharmacology workforce requirements as part of regional pharmaceutical sector development strategies. Clinical pharmacologists working in regulatory roles must maintain current knowledge of ICH guidelines, SFDA/MOHAP drug registration procedures, and GCC pharmacovigilance frameworks. Those in hospital clinical pharmacology units face additional CME requirements around therapeutic drug monitoring and adverse drug reaction management.</p>

        <h2>Key CME Topics for Clinical Pharmacologists</h2>
        <ul>
          <li><strong>Pharmacovigilance</strong> — GCC pharmacovigilance reporting systems, signal detection, periodic safety update reports (PSURs), ICH E2 guidelines</li>
          <li><strong>Clinical pharmacokinetics</strong> — population PK modelling, TDM in special populations (renal/hepatic impairment, obesity), narrow therapeutic index drugs</li>
          <li><strong>Drug regulatory affairs</strong> — GCC drug registration, SFDA and MOHAP submission dossiers, bioequivalence study requirements</li>
          <li><strong>Clinical trial methodology</strong> — Phase I–III design, adaptive trial designs, GCP compliance, ICH E6 update</li>
          <li><strong>Precision medicine and pharmacogenomics</strong> — CYP450 polymorphisms in GCC populations, genotype-guided dosing, biomarker-guided prescribing</li>
          <li><strong>Drug interactions</strong> — CYP-mediated interactions, transporter-mediated interactions, P-glycoprotein, OATP</li>
          <li><strong>Pharmacoepidemiology</strong> — real-world evidence, observational study design, GCC health data utilisation</li>
          <li><strong>Biologics and biosimilars</strong> — GCC biosimilar regulatory pathway, immunogenicity, substitution policies</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>British Pharmacological Society (BPS) Annual Meeting</li>
          <li>American Society for Clinical Pharmacology and Therapeutics (ASCPT) Annual Meeting</li>
          <li>ICH International Conference — regulatory science focus</li>
          <li>Gulf Pharmacists Association Conferences — GCC-credited activity</li>
          <li>Arab Health — clinical pharmacology and pharmacy sessions</li>
          <li>SFDA Scientific Forum (Saudi Arabia)</li>
        </ul>

        <h2>Track Your Clinical Pharmacology CME</h2>
        <p>Hayya Med Pro tracks CME credits per country and per cycle with automated gap analysis. Whether your CME comes from international pharmacology congresses or GCC regulatory body-endorsed workshops, the platform handles both for renewal compliance tracking.</p>

        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}

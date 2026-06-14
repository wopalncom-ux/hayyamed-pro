import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Endocrinologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Diabetes Guide",
  description:
    "CME requirements for endocrinologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, diabetes and metabolic disease CME priorities, thyroid disease updates, MRCP and Arab Board recognition, and top endocrinology conferences for GCC CME.",
  openGraph: {
    title: "Endocrinologist CME GCC 2026 — Diabetes and Metabolic Medicine Guide",
    description:
      "CME guide for endocrinologists in GCC countries: per-authority credit requirements, type 2 diabetes CME priorities (GLP-1, SGLT2, CGM), thyroid cancer management, MRCP recognition, and best endocrinology conferences for GCC CME.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Endocrinologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Endocrinologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Diabetes Guide"
        description="Endocrinology is one of the most clinically active specialties in the GCC, given the region's extremely high prevalence of type 2 diabetes, obesity, and thyroid disorders. GCC endocrinologists face a disproportionate burden of complex metabolic disease and must maintain CME portfolios that reflect this reality."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Endocrinologist CME Requirements by Authority</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Authority</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Country</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Credits</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Cycle</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Term</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["QCHP", "Qatar", "80 (40/year)", "2 years", "CPD"],
              ["SCFHS", "Saudi Arabia", "40–60", "Per renewal", "CME"],
              ["DHA", "Dubai", "40", "2 years", "CME"],
              ["DOH", "Abu Dhabi", "30–50", "1–2 years", "CPD"],
              ["NHRA", "Bahrain", "40", "2 years", "CPD"],
              ["MOH Kuwait", "Kuwait", "30", "Annual", "CME"],
              ["OMSB", "Oman", "40", "2 years", "CME"],
            ].map(([auth, country, credits, cycle, term], i) => (
              <tr key={auth} style={{ background: i % 2 === 1 ? "#f8fafc" : undefined }}>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{auth}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{country}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{credits}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{cycle}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{term}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Subspecialty CME Priorities for GCC Endocrinologists</h2>

        <h3>Type 2 Diabetes — The Defining Clinical Priority</h3>
        <p>
          Qatar, Saudi Arabia, UAE, Kuwait, and Bahrain all rank among the world&apos;s top 10
          countries for diabetes prevalence. CME must reflect the latest evidence:
        </p>
        <ul>
          <li>GLP-1 receptor agonists (semaglutide, tirzepatide) — cardiovascular outcomes, weight management, renal protection</li>
          <li>SGLT2 inhibitors (empagliflozin, dapagliflozin, canagliflozin) — heart failure, CKD, and T2DM outcomes data</li>
          <li>Continuous glucose monitoring (CGM) — Flash/Libre and Dexcom G7, time-in-range targets, clinic workflow</li>
          <li>Insulin pump therapy (CSII) and hybrid closed-loop systems — patient selection and management</li>
          <li>Diabetes remission — bariatric surgery outcomes, very-low-calorie diet, updated ADA/EASD position statement</li>
          <li>Diabetic kidney disease — CKD progression prevention, RAS blockade, SGLT2 evidence</li>
        </ul>

        <h3>Thyroid Disease</h3>
        <ul>
          <li>Thyroid nodule evaluation — updated ATA/ACR TI-RADS sonographic classification</li>
          <li>Thyroid cancer management — updated ATA guidelines, risk stratification, active surveillance</li>
          <li>Molecular testing for thyroid nodules — Bethesda V/VI cytology, Afirma, ThyroSeq</li>
          <li>Radioactive iodine therapy — updated dosimetry, post-therapy management</li>
          <li>Thyroid disease in pregnancy — TSH targets, anti-thyroid drug choice, monitoring</li>
        </ul>

        <h3>Obesity Medicine</h3>
        <ul>
          <li>Obesity as a chronic disease — updated adiposity-based chronic disease (ABCD) framework</li>
          <li>Dual/triple incretin agonists — tirzepatide, retatrutide, and next-generation agents</li>
          <li>Obesity pharmacotherapy combinations — clinical evidence, practical management</li>
          <li>Pre- and post-bariatric endocrinology — endocrine evaluation, post-op monitoring</li>
        </ul>

        <h3>Adrenal and Pituitary Disease</h3>
        <ul>
          <li>Incidentaloma evaluation — adrenal and pituitary incidentaloma workup and surveillance protocols</li>
          <li>Adrenal insufficiency — updated diagnosis (SST vs. insulin tolerance test), sick-day rules</li>
          <li>Cushing&apos;s syndrome — updated diagnostic algorithm, treatment options (steroidogenesis inhibitors, pasireotide)</li>
          <li>Acromegaly — post-surgical medical management, somatostatin analogues, pegvisomant</li>
        </ul>

        <h2>Best Endocrinology Conferences for GCC CME</h2>

        <h3>ENDO Annual Meeting (Endocrine Society)</h3>
        <p>
          ENDO Annual (June, USA) generates AMA PRA Category 1 CME credits. The world&apos;s largest
          endocrinology conference — comprehensive coverage of diabetes, thyroid, adrenal, pituitary,
          obesity, and reproductive endocrinology. One of the highest-value GCC CME conferences
          for endocrinologists.
        </p>

        <h3>EASD Annual Meeting (European Association for the Study of Diabetes)</h3>
        <p>
          EASD Annual Meeting (September) generates EACCME credits. The premier diabetes conference
          globally alongside ADA — major trial results (SUSTAIN, EMPA-REG, DAPA-HF) are regularly
          presented here.
        </p>

        <h3>ADA Scientific Sessions (American Diabetes Association)</h3>
        <p>
          ADA Scientific Sessions (June) generate AMA PRA Category 1 credits. The premier diabetes
          conference in North America; all major diabetes drug trials present late-breaking results
          here. Highly relevant to GCC endocrinologists managing large type 2 diabetes populations.
        </p>

        <h3>Gulf Chapter of Endocrinology and Diabetes (GCED)</h3>
        <p>
          The Gulf Endocrinology meetings provide QCHP/DHA-accredited CME with GCC-specific content —
          Arab-population diabetes data, regional clinical guidelines, and locally relevant case series.
        </p>

        <h2>MRCP, ABIM, and Arab Board Recognition</h2>
        <ul>
          <li><strong>MRCP (Member of the Royal Colleges of Physicians, UK):</strong> MRCP Part 1 and 2 plus SCE (Specialty Certificate Examination) in Endocrinology and Diabetes recognized by QCHP, DHA, DOH, and SCFHS.</li>
          <li><strong>American Board of Internal Medicine (ABIM) — Endocrinology subspecialty:</strong> Recognized by GCC authorities. ABIM MOC activities count toward GCC CME renewal.</li>
          <li><strong>Arab Board in Internal Medicine/Endocrinology:</strong> Recognized across all GCC countries.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Endocrinologist CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}

import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Genetics CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for clinical genetics and genomics specialists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: inherited disease CPD, genomic medicine, carrier screening, precision oncology genetics, and medical genetics conferences in the GCC.",
  openGraph: {
    title: "Medical Genetics CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description:
      "CME guide for medical genetics practitioners in GCC countries: credit requirements, genomic medicine CPD, consanguinity-related inherited diseases, NICU genetics, and GCC precision medicine conferences.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Medical Genetics CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Medical Genetics CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Medical genetics in the GCC addresses a uniquely high burden of inherited conditions driven by historically elevated consanguinity rates. Qatar, Saudi Arabia, and UAE are investing heavily in national genomics programmes, creating both an urgent demand for qualified clinical geneticists and a rapidly evolving CME landscape."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Medical Genetics CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 (40/year)", "2 years", "CPD"],
              ["SCFHS", "Saudi Arabia", "40–60", "Per renewal", "CME"],
              ["DHA", "Dubai", "40", "2 years", "CME"],
              ["DOH", "Abu Dhabi", "30–50", "1–2 years", "CPD"],
              ["NHRA", "Bahrain", "40", "2 years", "CPD"],
              ["MOH Kuwait", "Kuwait", "30", "Annual", "CME"],
              ["OMSB", "Oman", "40", "2 years", "CME"],
            ].map(([auth, country, credits, cycle, term], i) => (
              <tr key={auth} style={{ background: i % 2 === 1 ? "#f8fafc" : undefined }}>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", fontWeight: 600 }}>{auth}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{country}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{credits}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{cycle}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{term}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>The GCC Genetics Context: Why Specialist CME Matters</h2>

        <p>
          The Arabian Peninsula has historically had consanguinity rates of 40–60% in several Gulf populations,
          resulting in a substantially elevated burden of autosomal recessive disorders. Conditions including
          sickle cell disease, beta-thalassaemia, G6PD deficiency, familial hypercholesterolaemia, congenital
          hypothyroidism, spinal muscular atrophy, and PKU are significantly over-represented compared to
          global averages. National newborn screening programmes in Qatar (QNBS), Saudi Arabia, and UAE
          have expanded dramatically since 2015, generating growing referral volumes to clinical genetics services.
        </p>

        <p>
          Qatar Genome Programme, Saudi Human Genome Program, and UAE Genome Programme represent major national
          investments in population genomics. CME that integrates genomic medicine skills is increasingly
          valued by GCC employers and regulators.
        </p>

        <h2>Core CME Topics for Medical Genetics in the GCC</h2>

        <h3>1. Next-Generation Sequencing: Interpretation and Clinical Reporting</h3>
        <p>
          Whole exome sequencing (WES), whole genome sequencing (WGS), chromosomal microarray, and gene panels
          are now routine in GCC tertiary genetics centres. CME covering variant classification per ACMG/AMP
          2015 guidelines and the emerging 2023 updates, copy number variant interpretation, variant of uncertain
          significance (VUS) counselling, and clinical report writing for non-geneticist colleagues is a
          primary CPD priority. Reanalysis of WES/WGS as the variant databases grow is an evolving competency.
        </p>

        <h3>2. Prenatal Genetics and Carrier Screening</h3>
        <p>
          Expanded carrier screening panels — increasingly available in UAE and Qatar private healthcare —
          test couples for 200–500 recessive conditions simultaneously. Preconception and prenatal counselling
          for consanguineous couples, interpretation of cell-free DNA NIPT results, invasive prenatal
          diagnostic procedures (CVS, amniocentesis), and the ethical framework for termination of affected
          pregnancies within Islamic bioethical guidance (the GCC standard remains permissive before ensoulment,
          typically 120 days gestation) are essential CPD areas.
        </p>

        <h3>3. Metabolic Disease and Inborn Errors of Metabolism</h3>
        <p>
          The elevated burden of inborn errors of metabolism in GCC newborn populations has driven investment
          in metabolic disease programmes at Hamad Medical Corporation, King Faisal Specialist Hospital,
          and Cleveland Clinic Abu Dhabi. CME covering amino acid disorders, organic acidaemias, fatty acid
          oxidation disorders, lysosomal storage diseases, and mitochondrial disease management — including
          enzyme replacement therapies and the emerging gene therapy landscape — is critical for GCC-based
          clinical geneticists.
        </p>

        <h3>4. Cancer Genetics and Hereditary Cancer Syndromes</h3>
        <p>
          BRCA1/2 pathogenic variant prevalence in GCC populations, Lynch syndrome identification and
          surveillance, hereditary diffuse gastric cancer, FAP/MAP, and Li-Fraumeni syndrome management
          are increasing referral drivers. CME covering multi-gene panel testing for cancer predisposition,
          the Manchester Scoring System for BRCA testing, and cascade testing protocols within extended
          Gulf family structures (where first-cousin marriage creates complex pedigrees) is a growing
          competency area.
        </p>

        <h3>5. Paediatric and Dysmorphology Genetics</h3>
        <p>
          Recognition of malformation syndromes, chromosomal disorders (trisomies, microdeletion/microduplication
          syndromes), and single-gene neurodevelopmental disorders is a foundational genetics competency.
          CME covering OMIM-based differential diagnosis approaches, dysmorphology examination technique,
          and the integration of artificial intelligence in syndrome recognition (Face2Gene and similar
          tools available in GCC genetics units) updates clinical practice.
        </p>

        <h2>Recommended Conferences for Medical Genetics CME</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Conference</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Organiser</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Credits</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["ASHG Annual Meeting", "American Society of Human Genetics", "15–22"],
              ["ESHG Annual Conference", "European Society of Human Genetics", "12–18"],
              ["Qatar Genome and Precision Medicine Summit", "Qatar Genome Programme", "8–12"],
              ["Arab Society of Human Genetics Conference", "ASHG-Arab", "8–12"],
              ["ACMG Annual Clinical Genetics Meeting", "ACMG", "12–18"],
            ].map(([conf, org, credits], i) => (
              <tr key={conf} style={{ background: i % 2 === 1 ? "#f8fafc" : undefined }}>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", fontWeight: 600 }}>{conf}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{org}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{credits}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Ethical and Legal Dimensions of Genetics Practice in the GCC</h2>

        <p>
          Genetics practice in the GCC raises specific ethical questions that differ from Western contexts:
          Islamic bioethical guidance on prenatal diagnosis and selective termination, family autonomy versus
          individual autonomy in carrier result disclosure (GCC cultures often favour family-level decision-making),
          data privacy in national genome databases under Qatar PDPL and UAE data protection law, and the
          handling of incidental findings in WGS for consanguineous family pedigrees. CME addressing the
          interface of clinical genetics and GCC bioethics is an area of growing regulatory interest.
        </p>

        <blockquote>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does
          not replace official licensing authorities. Users must verify final requirements with their relevant
          regulatory body.
        </blockquote>
      </BlogPostLayout>
    </>
  );
}

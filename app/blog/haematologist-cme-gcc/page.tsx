import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haematologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for haematologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, haematological malignancy and haemoglobin disorder CPD priorities, EHA/ASH conference CME recognition, and MRCP/FRCPath qualification recognition.",
  openGraph: {
    title: "Haematologist CME GCC 2026 — QCHP, SCFHS, DHA Haematology Guide",
    description:
      "CME guide for haematologists in GCC countries: credit requirements by authority, AML/ALL/CML management, lymphoma biologics, sickle cell disease, haemophilia gene therapy, EHA/ASH conference CME, and MRCP/FRCPath qualification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Haematologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Haematologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Haematology in the GCC carries a distinctive clinical profile. The region has one of the world's highest prevalences of sickle cell disease and thalassaemia — inherited haemoglobin disorders are endemic in Qatar, Saudi Arabia, UAE, Bahrain, and Oman. Alongside this is a full spectrum of haematological malignancy managed at tertiary centres, with active bone marrow transplant and CAR-T cell therapy programmes at Hamad Medical Corporation, KAMC, and Cleveland Clinic Abu Dhabi."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Haematologist CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Haematologists</h2>

        <h3>Haemoglobin Disorders — Sickle Cell Disease and Thalassaemia</h3>
        <p>
          GCC haematologists carry a global leadership responsibility in haemoglobin disorder management.
          CME priorities include:
        </p>
        <ul>
          <li>Hydroxyurea optimisation in SCD — updated dosing strategies, L-glutamine evidence, voxelotor (haemoglobin polymerisation inhibition), crizanlizumab (P-selectin inhibitor) for vaso-occlusive crises</li>
          <li>Gene therapy for SCD and thalassaemia — betibeglogene spartacus (beti-cel) for transfusion-dependent beta-thalassaemia; lovotibeglogene autotemcel (lovo-cel) for severe SCD — landmark curative therapies</li>
          <li>CRISPR gene editing — casgevy (exagamglogene autotemcel, exa-cel) — first CRISPR-based approved therapy; eligibility criteria and GCC centre development</li>
          <li>Allogeneic BMT in SCD — updated selection criteria, reduced-intensity conditioning</li>
          <li>Chelation therapy in thalassaemia major — updated deferasirox monitoring, cardiac iron MRI surveillance</li>
        </ul>

        <h3>Haematological Malignancies</h3>
        <ul>
          <li>AML — updated European LeukemiaNet (ELN) 2022 classification; venetoclax + azacitidine for unfit patients; FLT3 (midostaurin, gilteritinib), IDH1/IDH2 inhibitors (ivosidenib, enasidenib)</li>
          <li>CML — dasatinib, nilotinib, bosutinib TKI selection; asciminib (BCR-ABL STAMP inhibitor) for T315I mutation; treatment-free remission (TFR) protocols</li>
          <li>ALL — blinatumomab (BiTE) in Ph-negative ALL; inotuzumab ozogamicin; CAR-T cell therapy (tisagenlecleucel in B-ALL)</li>
          <li>Lymphoma — R-CHOP vs. polatuzumab-R-CHP (POLARIX trial) in DLBCL; CAR-T (axicabtagene, lisocabtagene) in relapsed/refractory DLBCL; bispecific antibodies (epcoritamab, glofitamab, mosunetuzumab)</li>
          <li>Multiple myeloma — quadruplet induction (Dara-VRd), CRAB vs. SLiM-CRAB criteria, teclistamab and talquetamab (BCMA/GPRC5D bispecifics), idecabtagene vicleucel (ide-cel) CAR-T</li>
        </ul>

        <h3>Haemostasis and Thrombosis</h3>
        <ul>
          <li>Haemophilia gene therapy — valoctocogene roxaparvovec (gene therapy for HemA), fitusiran (antithrombin-targeting RNA), marstacimab — transformative therapies changing haematologist practice</li>
          <li>VTE management — updated ISTH extended anticoagulation criteria; factor Xa inhibitors in cancer-associated thrombosis (HOKUSAI-VTE Cancer, CARAVAGGIO)</li>
          <li>HIT (Heparin-induced thrombocytopenia) — updated 4T score, argatroban and fondaparinux management</li>
          <li>ITP (Immune thrombocytopenia) — TPO receptor agonists (eltrombopag, romiplostim, avatrombopag), fostamatinib, rituximab sequencing</li>
        </ul>

        <h2>Best Haematology Conferences for GCC CME</h2>

        <h3>ASH Annual Meeting (American Society of Hematology)</h3>
        <p>
          ASH Annual Meeting (December, USA) generates AMA PRA Category 1 CME credits recognised by QCHP, DHA,
          DOH, SCFHS, NHRA, MOH Kuwait, and OMSB. The world&apos;s most important haematology meeting — late-breaking
          clinical trials simultaneously published in Blood and NEJM, covering all haematological malignancies and
          benign haematology.
        </p>

        <h3>EHA Congress (European Hematology Association)</h3>
        <p>
          EHA Congress (June, European cities) generates EACCME credits with transfer provisions for GCC authorities.
          The premier European haematology meeting — strong lymphoma, myeloma, leukaemia, and haemoglobin disorder
          content.
        </p>

        <h3>Gulf Haematology Society (GHS) Annual Congress</h3>
        <p>
          The Gulf Haematology Society Congress generates QCHP and SCFHS-recognised CME directly. GCC-specific content:
          sickle cell disease management in the Gulf, thalassaemia programme updates, and regional bone marrow transplant
          network outcomes.
        </p>

        <h2>MRCP, FRCPath, and Arab Board Recognition</h2>
        <ul>
          <li><strong>MRCP (Member of the Royal Colleges of Physicians, UK):</strong> The standard internal medicine qualification gateway for haematology specialist credentialing across QCHP, DHA, DOH, and SCFHS.</li>
          <li><strong>FRCPath in Haematology (Fellow of the Royal College of Pathologists, UK):</strong> Recognized across QCHP, DHA, DOH, and SCFHS for laboratory haematologists. Distinctly valuable for haematologists managing both clinical and laboratory haematology services — common in GCC hospital structures.</li>
          <li><strong>FRCP (Fellow of the Royal College of Physicians):</strong> Recognized as a consultant-grade qualification for clinical haematologists across QCHP, DHA, and DOH.</li>
          <li><strong>Arab Board in Clinical Haematology:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia (SCFHS) and Kuwait (MOH) for candidates trained in GCC institutions.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Haematologist CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}

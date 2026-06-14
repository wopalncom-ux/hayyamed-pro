import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rheumatologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for rheumatologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, RA biologic therapy and treat-to-target CPD, lupus and vasculitis updates, EULAR/ACR conference CME recognition, and MRCP/FRCPath qualification recognition.",
  openGraph: {
    title: "Rheumatologist CME GCC 2026 — QCHP, SCFHS, DHA Rheumatology Guide",
    description:
      "CME guide for rheumatologists in GCC countries: credit requirements by authority, RA biologic and JAK inhibitor therapy, lupus nephritis management, vasculitis updates, gout treat-to-target, EULAR/ACR conference CME, and MRCP qualification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Rheumatologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Rheumatologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Rheumatology in the GCC is shaped by high gout burden (driven by diet, metabolic syndrome, and obesity), significant lupus incidence in the young female population, and a full spectrum of inflammatory arthritis and connective tissue disease managed at tertiary centres. The rapid expansion of biologic and small molecule therapy — JAK inhibitors, IL-17 inhibitors, IL-23 inhibitors — generates a high ongoing CME demand."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Rheumatologist CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Rheumatologists</h2>

        <h3>Rheumatoid Arthritis</h3>
        <ul>
          <li>Treat-to-target (T2T) strategy — updated EULAR T2T recommendations; DAS28, CDAI, SDAI remission targets; tight control scheduling</li>
          <li>Biologic therapy selection — TNF inhibitors (biosimilars now dominant in GCC cost-conscious formularies), IL-6 inhibitors (tocilizumab, sarilumab), IL-17A inhibitors, B-cell depletion (rituximab)</li>
          <li>JAK inhibitors — tofacitinib, baricitinib, upadacitinib, filgotinib — updated cardiovascular and VTE risk data (ORAL Surveillance), EULAR safety guidance, GCC formulary positioning</li>
          <li>Biosimilar switching — evidence base, nocebo effect management, patient communication</li>
          <li>Cardiovascular risk in RA — CVD risk screening (SCORE2, QRISK), statin therapy, blood pressure management in RA</li>
        </ul>

        <h3>Spondyloarthritis and Psoriatic Arthritis</h3>
        <ul>
          <li>Axial SpA — updated ASAS classification criteria; IL-17A inhibitors (secukinumab, ixekizumab) and IL-23 inhibitors (risankizumab) in nr-axSpA; JAK inhibitor (upadacitinib) efficacy in AS</li>
          <li>Psoriatic arthritis — updated ACR/EULAR PsA guidelines; biologic choice by domain (skin vs. joint vs. enthesis vs. dactylitis); guselkumab and risankizumab in PsA</li>
          <li>Reactive arthritis — updated antibiotic stewardship, DMARDs, management in GCC context (chlamydia and salmonella triggers)</li>
        </ul>

        <h3>Systemic Lupus Erythematosus and Lupus Nephritis</h3>
        <ul>
          <li>Belimumab in SLE — updated IV and SC formulations, BLISS-LN trial in lupus nephritis, treatment sequencing</li>
          <li>Anifrolumab — type I IFN receptor antagonist; TULIP-1 and TULIP-2 trial outcomes; positioning in moderate-severe SLE</li>
          <li>Voclosporin in lupus nephritis — AURORA trial outcomes; combination with MMF and low-dose steroids</li>
          <li>Updated ACR lupus nephritis guidelines 2024 — induction and maintenance therapy, biopsy indications</li>
          <li>Antiphospholipid syndrome — updated ISTH classification criteria; hydroxychloroquine in primary APS prevention; direct oral anticoagulants (DOACs) controversy in high-risk APS</li>
        </ul>

        <h3>Gout</h3>
        <ul>
          <li>Treat-to-target urate strategy — updated ACR/EULAR gout guidelines; serum urate target &lt;360 µmol/L in most patients</li>
          <li>Urate-lowering therapy (ULT) — allopurinol titration, febuxostat updated safety (FAST trial), lesinurad (in combination, where available)</li>
          <li>Acute gout management — colchicine updated dosing (low-dose evidence), IL-1 inhibition (canakinumab, anakinra) in refractory gout</li>
          <li>Pegloticase — indications in chronic refractory gout, immunomodulation with MTX to extend response</li>
          <li>Diet and lifestyle in gout — updated evidence on purine restriction, alcohol, fructose; GCC dietary context</li>
        </ul>

        <h3>Vasculitis and Myositis</h3>
        <ul>
          <li>GCA (giant cell arteritis) — tocilizumab (GiACTA trial) as steroid-sparing agent; updated imaging (PET-CT, MRI) in diagnosis</li>
          <li>ANCA-associated vasculitis — avacopan (C5a receptor inhibitor, ADVOCATE trial) replacing high-dose steroids; rituximab vs. cyclophosphamide; maintenance rituximab</li>
          <li>Inflammatory myopathies — updated ENMC classification; anti-synthetase syndrome management; IVIG in IIM, JAK inhibitors in refractory IIM</li>
        </ul>

        <h2>Best Rheumatology Conferences for GCC CME</h2>

        <h3>EULAR Congress (European Alliance of Associations for Rheumatology)</h3>
        <p>
          EULAR Congress (June, European cities) generates EACCME credits with transfer provisions for GCC authorities.
          The premier European rheumatology meeting — late-breaking clinical trials, guideline launches, and expert
          sessions across all inflammatory diseases.
        </p>

        <h3>ACR Convergence (American College of Rheumatology)</h3>
        <p>
          ACR Convergence (November, USA) generates AMA PRA Category 1 CME credits recognised by QCHP, DHA, DOH,
          SCFHS, NHRA, MOH Kuwait, and OMSB. The world&apos;s largest rheumatology meeting — abstract presentations,
          clinical practice updates, and biosimilar and biologic sessions.
        </p>

        <h2>MRCP and Arab Board Recognition</h2>
        <ul>
          <li><strong>MRCP (Member of the Royal Colleges of Physicians, UK):</strong> The standard internal medicine qualification prerequisite for rheumatology specialist credentialing across QCHP, DHA, DOH, and SCFHS. MRCP with rheumatology specialty training (SCE in Rheumatology) is required for consultant-grade registration.</li>
          <li><strong>FRCP (Fellow of the Royal College of Physicians):</strong> Recognized as a consultant-grade qualification for rheumatologists across QCHP, DHA, and DOH.</li>
          <li><strong>Arab Board in Rheumatology:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia (SCFHS) and Kuwait (MOH) for candidates trained in GCC institutions.</li>
          <li><strong>FACR (Fellow of the American College of Rheumatology):</strong> Recognized as a specialist distinction by DHA, DOH, and several private hospital credentialing systems across the GCC.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Rheumatologist CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}

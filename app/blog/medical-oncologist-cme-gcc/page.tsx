import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Oncologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for medical oncologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, immunotherapy toxicity management, targeted therapy (EGFR/ALK/KRAS), precision oncology, ESMO/ASCO conference CME recognition, and MRCP/ESMO qualification recognition.",
  openGraph: {
    title: "Medical Oncologist CME GCC 2026 — QCHP, SCFHS, DHA Oncology Guide",
    description:
      "CME guide for medical oncologists in GCC countries: checkpoint inhibitor immunotherapy, targeted oncology (EGFR, ALK, HER2, KRAS G12C), breast/lung/colorectal cancer updates, ESMO/ASCO conference CME, and MRCP/ESMO certification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Medical Oncologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Medical Oncologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Oncology in the GCC is growing in volume and complexity. Cancer incidence is rising across all GCC countries as populations age and screening programmes expand. The region has invested heavily in oncology infrastructure — the National Centre for Cancer Care and Research (NCCCR) in Qatar, KFSH&RC in Saudi Arabia, and Burjeel Medical City in the UAE operate fully integrated cancer centres delivering systemic therapy, radiation oncology, haematological malignancy management, and clinical trials. Medical oncologists in the GCC must stay current with a field that is advancing faster than any other specialty."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={9}
      >
        <h2>GCC Medical Oncologist CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Medical Oncologists</h2>

        <h3>Immunotherapy — Checkpoint Inhibitors</h3>
        <ul>
          <li>PD-1/PD-L1 inhibitors — pembrolizumab, nivolumab, atezolizumab, durvalumab; cross-tumour indications update; biomarker selection (PD-L1 CPS, TPS, TMB, MSI-H/dMMR)</li>
          <li>CTLA-4 inhibitors — ipilimumab in melanoma and RCC combination; tremelimumab + durvalumab in HCC; ipilimumab dose optimization</li>
          <li>Immune-related adverse events (irAEs) — updated ESMO/ASCO management guidelines; steroid protocols; infliximab, mycophenolate mofetil in steroid-refractory irAE; cardiotoxicity (myocarditis), pneumonitis, colitis, hepatitis, endocrinopathies</li>
          <li>Bispecific antibodies — blinatumomab, mosunetuzumab, epcoritamab (CD20×CD3), teclistamab (BCMA×CD3); cytokine release syndrome management</li>
          <li>CAR-T cell therapy — axicabtagene, tisagenlecleucel, lisocabtagene, idecabtagene, ciltacabtagene; patient selection, leukapheresis, CRS/ICANS management; bridging therapy</li>
        </ul>

        <h3>Targeted Therapy — Key Mutations</h3>
        <ul>
          <li>EGFR-mutant NSCLC — osimertinib (LAURA, ADAURA adjuvant trials); amivantamab + lazertinib (MARIPOSA trial) for first-line; osimertinib resistance mechanisms and sequencing</li>
          <li>ALK+ NSCLC — lorlatinib (CROWN trial long-term outcomes); alectinib vs. brigatinib in first line; ALK CNS penetration</li>
          <li>KRAS G12C — sotorasib (CodeBreaK 100/200), adagrasib (KRYSTAL-1); combination strategies (KRAS + MEK, KRAS + SHP2); emerging pan-KRAS inhibitors</li>
          <li>HER2-positive breast cancer — trastuzumab deruxtecan (T-DXd, DESTINY-Breast04/06), tucatinib + trastuzumab + capecitabine (HER2CLIMB); T-DXd in HER2-low and HER2-ultralow</li>
          <li>BRCA1/2 — olaparib, niraparib, rucaparib in breast/ovarian/prostate cancer; germline testing protocols; BRCA somatic testing in the tumour</li>
          <li>RET/MET/NTRK/FGFR — selpercatinib, tepotinib, larotrectinib, erdafitinib; tumour-agnostic indication approvals</li>
        </ul>

        <h3>Breast Cancer</h3>
        <ul>
          <li>Early breast cancer — updated monarchE, NATALEE (ribociclib adjuvant), PENELOPE-B, PALLAS; adjuvant CDK4/6 inhibitors in HR+ HER2- disease</li>
          <li>Metastatic HR+ HER2- — CDK4/6 inhibitor + AI (standard of care); elacestrant (EMERALD) and camizestrant for ESR1-mutant disease post-CDK4/6</li>
          <li>Triple negative breast cancer — immunotherapy (pembrolizumab + chemotherapy, KEYNOTE-522 adjuvant); antibody-drug conjugates (sacituzumab govitecan ASCENT)</li>
          <li>de-escalation strategies — MINDACT, TAILORx, RxPONDER genomic testing; omission of adjuvant chemotherapy in low-risk HR+ patients</li>
        </ul>

        <h3>Lung, Colorectal, and GI Cancers</h3>
        <ul>
          <li>NSCLC — perioperative immunotherapy (CheckMate 77T, KEYNOTE-671); neoadjuvant IO+chemo; osimertinib adjuvant in stage IB-IIIA EGFR+ (ADAURA)</li>
          <li>Colorectal cancer — FOLFOX vs. FOLFIRI in first-line mCRC; MSI-H first-line pembrolizumab (KEYNOTE-177); BRAF V600E (encorafenib + cetuximab BEACON); HER2 amplification (trastuzumab + pertuzumab MOUNTAINEER)</li>
          <li>Gastric/GEJ cancer — nivolumab + FOLFOX (CheckMate 649), pembrolizumab (KEYNOTE-590, 811); trastuzumab in HER2+ gastric; claudin 18.2 (zolbetuximab SPOTLIGHT/GLOW)</li>
          <li>Hepatocellular carcinoma — atezolizumab + bevacizumab (IMbrave150); tremelimumab + durvalumab (HIMALAYA); second-line options; TACE candidacy vs. systemic therapy</li>
        </ul>

        <h2>Best Oncology Conferences for GCC CME</h2>

        <h3>ESMO Congress (European Society for Medical Oncology)</h3>
        <p>
          ESMO Annual Congress (September, European cities) generates EACCME credits. The premier European oncology
          meeting — the most important venue for late-breaking randomised controlled trial results in solid tumours.
          ESMO Certified tumour-specific conference modules generate 5–15 credits each.
        </p>

        <h3>ASCO Annual Meeting (American Society of Clinical Oncology)</h3>
        <p>
          ASCO Annual Meeting (June, Chicago) generates AMA PRA Category 1 CME credits recognised by QCHP, DHA, DOH,
          SCFHS, NHRA, MOH Kuwait, and OMSB. The world&apos;s largest oncology meeting — plenary sessions, oral presentations,
          and practice-changing abstract releases.
        </p>

        <h3>Gulf Oncology Society Annual Congress</h3>
        <p>
          The Gulf Oncology Society Congress generates QCHP and SCFHS-recognised CME. GCC-specific oncology content:
          cancer registry data, treatment access and formulary, clinical trial participation in GCC centres, and
          multi-disciplinary tumour board case presentations.
        </p>

        <h2>MRCP, ESMO Certified Oncologist, and Arab Board Recognition</h2>
        <ul>
          <li><strong>MRCP (Member of the Royal Colleges of Physicians, UK):</strong> The standard internal medicine qualification prerequisite for medical oncology specialist credentialing across QCHP, DHA, DOH, and SCFHS. MRCP with medical oncology specialty training (SCE in Medical Oncology) is required for consultant-grade registration.</li>
          <li><strong>ESMO Certified Oncologist Programme:</strong> ESMO certification is not a licensing qualification but is recognized as a significant specialty distinction by many GCC hospital credentialing systems and is increasingly referenced in SCFHS and QCHP specialist registration reviews.</li>
          <li><strong>FRCP (Fellow of the Royal College of Physicians):</strong> Recognized as a consultant-grade qualification for medical oncologists across QCHP, DHA, and DOH.</li>
          <li><strong>Arab Board in Medical Oncology:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia (SCFHS) and Kuwait (MOH) for candidates trained in GCC institutions.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Medical oncologist CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}

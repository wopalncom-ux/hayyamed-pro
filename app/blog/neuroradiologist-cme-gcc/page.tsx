import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neuroradiologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for neuroradiologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, interventional neuroradiology, AI imaging, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Neuroradiologist CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for neuroradiologists practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Neuroradiologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Neuroradiologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Neuroradiology has been transformed by AI-assisted lesion detection, 7T MRI protocols, and the expansion of mechanical thrombectomy windows for ischaemic stroke. GCC neuroradiologists — working in centres like Hamad General Hospital, Sidra Medicine, and King Faisal Specialist Hospital — face the highest clinical expectations and must demonstrate continuous learning across both diagnostic and interventional neuroradiology."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Neuroradiologist CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year; Radiology subspecialty board"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Radiology specialty track, INR subspecialty"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "Annual reporting portal"],
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

        <h2>Neuroradiology in the GCC: High-Acuity, High-Demand</h2>
        <p>Qatar&apos;s Hamad Medical Corporation operates the GCC&apos;s flagship stroke programme — Primary Stroke Centre certification requires 24/7 neuroradiology coverage for CT perfusion and thrombectomy guidance. Saudi Arabia&apos;s Vision 2030 health transformation has driven investment in neuroradiology capacity at NGHA, King Abdulaziz Medical City, and King Faisal Specialist Hospital, where functional MRI, diffusion tensor imaging, and MR spectroscopy are now standard. The UAE&apos;s Cleveland Clinic Abu Dhabi and Mediclinic City Hospital Dubai have created demand for Western-trained neuroradiologists who can also support interventional neuroradiology (INR) workflows. The SCFHS has a distinct interventional neuroradiology track for practitioners performing mechanical thrombectomy, aneurysm coiling, and AVM embolisation.</p>

        <h2>Key CME Topics for Neuroradiologists</h2>
        <ul>
          <li><strong>Stroke imaging</strong> — CT perfusion post-DAWN/DEFUSE-3 (extended thrombectomy window to 24 hours), ASPECTS scoring reliability, DWI-FLAIR mismatch, collateral grading systems</li>
          <li><strong>AI in neuroradiology</strong> — FDA-cleared triage AI for LVO detection (Viz.AI, RapidAI, Aidoc), automated ASPECTS, white matter lesion quantification, AI false-negative rates and liability</li>
          <li><strong>Brain tumour imaging</strong> — 2021 WHO CNS tumour classification (molecular IDH/1p19q/TERT status), MR perfusion in glioma grading, pseudoprogression vs true progression post-chemoradiotherapy</li>
          <li><strong>Spine interventions</strong> — vertebral augmentation (kyphoplasty/vertebroplasty), epidural injection imaging guidance, spinal cord stimulator placement</li>
          <li><strong>Interventional neuroradiology</strong> — mechanical thrombectomy technique (ADAPT vs stent retriever), flow diversion for aneurysms (Pipeline embolisation device), WLST and Onyx for AVM</li>
          <li><strong>Dementia imaging</strong> — amyloid PET reporting, tau PET, Centiloid scale, white matter hyperintensity progression, lecanemab-related ARIA (amyloid-related imaging abnormalities) monitoring</li>
          <li><strong>Paediatric neuroradiology</strong> — hypoxic-ischaemic injury patterns by gestational age, congenital brain malformations, phakomatoses</li>
          <li><strong>Radiation dose optimisation</strong> — low-dose CT protocols for head CT, iterative reconstruction algorithms, dose tracking for fluoroscopy-guided INR procedures</li>
          <li><strong>Multiple sclerosis imaging</strong> — 2017 McDonald criteria update, MAGNIMS recommendations, PRE-DISPOSITION for lesion classification, iron-rim lesions at 7T</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>European Society of Neuroradiology (ESNR) Annual Meeting</li>
          <li>American Society of Neuroradiology (ASNR) Annual Meeting</li>
          <li>Society of Interventional Neuroradiology (SNIS) Annual Meeting</li>
          <li>European Stroke Organisation Conference (ESOC)</li>
          <li>Arab Society of Neuroradiology and Interventional Radiology (ASNIR)</li>
          <li>Saudi Radiology Society Annual Meeting — SCFHS credited</li>
          <li>RSNA (Radiological Society of North America) — Neuroradiology sessions</li>
          <li>ECR (European Congress of Radiology) — Neuroradiology track</li>
        </ul>

        <h2>ARIA Monitoring: The New Neuroradiology CME Requirement</h2>
        <p>The approval of lecanemab (Leqembi) and donanemab for early Alzheimer&apos;s disease creates a new CME imperative for neuroradiologists: ARIA monitoring protocols. GCC memory clinics and neurology centres are beginning to evaluate anti-amyloid infusion therapy — and the neuroradiologist is the pivotal specialist for ARIA-E and ARIA-H detection, grading, and management guidance. CME covering ARIA protocols, MRI sequence requirements (SWI, GRE), and stopping/resumption criteria is now a high-value credentialing area for neuroradiologists practising in tertiary GCC centres.</p>

        <h2>Track Your Neuroradiology CME</h2>
        <p>Hayya Med Pro tracks CME credits across QCHP, SCFHS, DHA, and other GCC authorities simultaneously. Upload international conference certificates and local workshop documentation — your compliance status updates automatically against the rules of each authority you&apos;re registered with.</p>

        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}

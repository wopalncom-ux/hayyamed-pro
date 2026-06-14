import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neurologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for neurologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, stroke and epilepsy management updates, multiple sclerosis biologics, interventional neurology, AAN/ECTRIMS conference CME recognition, and MRCP/FAAN qualification recognition.",
  openGraph: {
    title: "Neurologist CME GCC 2026 — QCHP, SCFHS, DHA Neurology Guide",
    description:
      "CME guide for neurologists in GCC countries: credit requirements by authority, stroke thrombolysis and thrombectomy, epilepsy, MS disease-modifying therapy, AAN/ECTRIMS conference CME, and MRCP/FAAN qualification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Neurologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Neurologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Neurology in the GCC is shaped by one of the world's highest stroke rates (driven by hypertension, diabetes, and atrial fibrillation), a rapidly growing multiple sclerosis incidence in the young adult population, and significant headache burden. Neurologists in Qatar, Saudi Arabia, and UAE lead some of the region's most advanced stroke programmes with mechanical thrombectomy capabilities. CME must reflect this evolving clinical landscape."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Neurologist CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Neurologists</h2>

        <h3>Stroke and Cerebrovascular Disease</h3>
        <ul>
          <li>Mechanical thrombectomy — updated patient selection (DAWN, DEFUSE 3 — extended window to 24 hours), imaging-guided selection (CTP/DWI mismatch), technique updates</li>
          <li>IV thrombolysis — tenecteplase vs. alteplase (NOR-TEST 2, TASTE trials), updated AHA/ASA guidelines</li>
          <li>Secondary prevention — POINT and CHANCE-2 trial outcomes; dual antiplatelet therapy for minor ischaemic stroke (aspirin + ticagrelor); anticoagulation timing in AF-related stroke</li>
          <li>Stroke unit management — updated care bundle, swallowing assessment, early mobilisation, fever management</li>
          <li>Haemorrhagic stroke — INTERACT3 bundle, tranexamic acid (TICH-2), blood pressure target, reversal of anticoagulation in ICH</li>
        </ul>

        <h3>Multiple Sclerosis</h3>
        <ul>
          <li>DMT selection in newly diagnosed MS — treat-to-target vs. escalation debate; updated ECTRIMS/AAN guidelines</li>
          <li>High-efficacy DMTs — natalizumab (extended interval dosing, JCV risk stratification), ocrelizumab (PPMS indication update), ofatumumab (s.c. anti-CD20), ublituximab</li>
          <li>Cladribine and alemtuzumab — long-term safety data, lymphocyte monitoring, secondary autoimmunity</li>
          <li>Progressive MS — siponimod in SPMS, ibudilast and tolebrutinib emerging data</li>
          <li>Pregnancy and MS — DMT management peripartum, natalizumab extended interval in pregnancy, breastfeeding guidance</li>
          <li>MRI monitoring in MS — updated MAGNIMS criteria, T2 lesion load vs. atrophy as outcome measures</li>
        </ul>

        <h3>Epilepsy</h3>
        <ul>
          <li>Seizure classification — updated ILAE 2017 classification; focal vs. generalised, known vs. unknown aetiology</li>
          <li>New ASMs (anti-seizure medications) — cenobamate (focal seizures), lacosamide in status epilepticus, brivaracetam, fenfluramine (Dravet syndrome)</li>
          <li>Drug-resistant epilepsy — ketogenic diet evidence, VNS, responsive neurostimulation (RNS), DBS for epilepsy</li>
          <li>Status epilepticus — updated treatment algorithm (benzodiazepine → levetiracetam/valproate → general anaesthesia); EEG monitoring in non-convulsive SE</li>
          <li>Epilepsy in women — SANAD II outcomes; contraception interactions, valproate teratogenicity, EURAP registry</li>
        </ul>

        <h3>Headache</h3>
        <ul>
          <li>Migraine prevention — CGRP monoclonal antibodies (erenumab, fremanezumab, galcanezumab, eptinezumab) — updated real-world evidence and treatment sequencing</li>
          <li>Acute migraine — lasmiditan (gepant class), rimegepant and zavegepant — integration with triptans</li>
          <li>Cluster headache — CGRP pathway treatments in cluster; galcanezumab for episodic cluster; VNS</li>
          <li>Medication overuse headache (MOH) — withdrawal strategy, preventive agent selection after withdrawal</li>
        </ul>

        <h2>Best Neurology Conferences for GCC CME</h2>

        <h3>AAN Annual Meeting (American Academy of Neurology)</h3>
        <p>
          AAN Annual Meeting (April, USA) generates AMA PRA Category 1 CME credits recognised by QCHP, DHA, DOH,
          SCFHS, NHRA, MOH Kuwait, and OMSB. The world&apos;s largest neurology meeting — clinical science sessions,
          practice updates, and FAAN recognition.
        </p>

        <h3>ECTRIMS Congress (European Committee for Treatment and Research in Multiple Sclerosis)</h3>
        <p>
          ECTRIMS Congress (September, European cities) generates EACCME credits. The global MS conference —
          late-breaking DMT trial data, MRI biomarker updates, and progressive MS management.
        </p>

        <h3>WSO World Stroke Congress</h3>
        <p>
          World Stroke Organization Congress (held biennially) generates internationally recognised CME. The most
          important stroke conference globally — thrombectomy technique, acute stroke unit management, and
          secondary prevention guidelines.
        </p>

        <h2>MRCP, FAAN, and Arab Board Recognition</h2>
        <ul>
          <li><strong>MRCP (Member of the Royal Colleges of Physicians, UK):</strong> The standard internal medicine qualification prerequisite for neurology specialist credentialing across QCHP, DHA, DOH, and SCFHS. MRCP with neurology specialty training (SCE in Neurology) is required for consultant-grade registration.</li>
          <li><strong>FAAN (Fellow of the American Academy of Neurology):</strong> Recognized as a specialist distinction by DHA, DOH, and several private hospital credentialing systems across the GCC.</li>
          <li><strong>FRCP (Fellow of the Royal College of Physicians):</strong> Recognized as a consultant-grade qualification for neurologists across QCHP, DHA, and DOH.</li>
          <li><strong>Arab Board in Neurology:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia (SCFHS) and Kuwait (MOH) for candidates trained in GCC institutions.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Neurologist CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}

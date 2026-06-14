import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pulmonologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for pulmonologists and chest physicians in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, COPD and asthma management updates, interventional pulmonology, sleep medicine, ATS/ERS conference CME recognition, and MRCP/FCCP qualification recognition.",
  openGraph: {
    title: "Pulmonologist CME GCC 2026 — QCHP, SCFHS, DHA Pulmonology Guide",
    description:
      "CME guide for pulmonologists in GCC countries: credit requirements by authority, COPD and asthma, interventional pulmonology, lung cancer, sleep medicine, ATS/ERS conference CME, and MRCP/FCCP qualification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Pulmonologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Pulmonologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Pulmonology in the GCC faces a unique disease burden — a historically high smoking prevalence in adult males, significant occupational lung disease among construction and industrial workers, a rising lung cancer incidence, and a substantial obesity-related sleep-disordered breathing epidemic. CME must cover this breadth alongside the evidence updates in interventional pulmonology and critical care."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Pulmonologist CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Pulmonologists</h2>

        <h3>COPD and Smoking-Related Lung Disease</h3>
        <ul>
          <li>GOLD 2025 COPD management update — ABE classification, treatable traits approach, triple inhaler therapy (LABA+LAMA+ICS) evidence</li>
          <li>COPD and type 2 diabetes interaction — high GCC prevalence of both; management considerations for obese patients with COPD</li>
          <li>Tobacco cessation pharmacotherapy — varenicline updated safety data, cytisinicline, combination NRT; GCC cultural context for male tobacco users</li>
          <li>Non-pharmacological COPD management — pulmonary rehabilitation evidence, bronchoscopic lung volume reduction (BLVR) for severe emphysema</li>
          <li>Exacerbation management — updated antibiotic stewardship in COPD, non-invasive ventilation in acute exacerbation</li>
        </ul>

        <h3>Asthma</h3>
        <ul>
          <li>GINA 2025 update — anti-inflammatory reliever (AIR) therapy replacing SABA-only reliever; biologic eligibility criteria</li>
          <li>Severe asthma biologics — anti-IL-5 (mepolizumab, benralizumab, reslizumab), anti-IL-4/13 (dupilumab), anti-IgE (omalizumab), anti-TSLP (tezepelumab) — updated patient selection and treat-to-target approaches</li>
          <li>Asthma-COPD overlap (ACO) — diagnostic criteria, management strategy</li>
          <li>Occupational asthma — important in GCC construction and industrial sectors; latent sensitiser exposure, workplace assessment</li>
          <li>Biologic switching — when to switch, how to taper, bridge therapy</li>
        </ul>

        <h3>Interventional Pulmonology</h3>
        <ul>
          <li>Endobronchial ultrasound (EBUS) — TBNA technique, staging of lung cancer and lymphoma, competency assessment</li>
          <li>Medical thoracoscopy and pleural procedures — indwelling pleural catheters (IPC) for malignant pleural effusion, thoracoscopic biopsy</li>
          <li>Bronchoscopic lung volume reduction — endobronchial valves (Zephyr) — growing adoption in GCC centres with severe COPD programmes</li>
          <li>Robotic bronchoscopy — ion robotic bronchoscopy and Monarch system for peripheral pulmonary nodule biopsy</li>
          <li>Cryobiopsy — transbronchial cryobiopsy technique and yield in ILD diagnosis</li>
        </ul>

        <h3>Interstitial Lung Disease and Fibrosis</h3>
        <ul>
          <li>IPF management — updated pirfenidone and nintedanib evidence, patient selection, monitoring LFTs and tolerability</li>
          <li>Progressive fibrosing ILD — nintedanib in non-IPF fibrotic ILD (INBUILD trial); systemic sclerosis-ILD management</li>
          <li>HP (Hypersensitivity Pneumonitis) — updated ATS/ERS diagnostic guidelines, antigen avoidance, immunosuppression</li>
          <li>Sarcoidosis — diagnosis, staging (Scadding), treatment thresholds, multi-organ involvement management</li>
        </ul>

        <h3>Sleep Medicine and Pulmonary Hypertension</h3>
        <ul>
          <li>OSA management in obesity — CPAP adherence strategies, mandibular advancement devices, weight loss pharmacotherapy (GLP-1 RA) impact on OSA</li>
          <li>Pulmonary hypertension — updated ESC/ERS PH guidelines, Group 1 PAH combination therapy, risk stratification tools</li>
          <li>Sleep study interpretation — updated AASM scoring rules, home sleep testing indications</li>
        </ul>

        <h2>Best Pulmonology Conferences for GCC CME</h2>

        <h3>ATS International Conference (American Thoracic Society)</h3>
        <p>
          ATS International Conference (May, USA) generates AMA PRA Category 1 CME credits recognised by QCHP, DHA,
          DOH, SCFHS, NHRA, MOH Kuwait, and OMSB. The world&apos;s largest pulmonology meeting — 3,000+ abstracts,
          clinical sessions, and meet-the-professor workshops across respiratory medicine, critical care, and sleep.
        </p>

        <h3>ERS International Congress (European Respiratory Society)</h3>
        <p>
          ERS International Congress (September, European cities) generates EACCME credits with transfer provisions
          for GCC authorities. The premier European respiratory meeting — strong ILD, asthma biologics, COPD, and
          interventional pulmonology content.
        </p>

        <h3>CHEST Annual Meeting (American College of Chest Physicians)</h3>
        <p>
          CHEST Annual Meeting (October, USA) generates AMA PRA Category 1 CME credits. Strong critical care,
          sleep medicine, pleural disease, and interventional pulmonology content — the home of the FCCP award.
          Widely recognised across all GCC licensing authorities.
        </p>

        <h2>MRCP, FCCP, and Arab Board Recognition</h2>
        <ul>
          <li><strong>MRCP (Member of the Royal Colleges of Physicians, UK):</strong> The standard internal medicine qualification prerequisite for pulmonology specialist credentialing across QCHP, DHA, DOH, and SCFHS. MRCP with respiratory medicine specialty training is required for consultant-grade registration.</li>
          <li><strong>FCCP (Fellow of the American College of Chest Physicians):</strong> One of the most widely held pulmonology fellowship awards among GCC chest physicians. Recognized by QCHP, DHA, DOH, and SCFHS as a specialist distinction, with CHEST conference CME well-regarded across GCC authorities.</li>
          <li><strong>FRCP (Fellow of the Royal College of Physicians):</strong> Recognized as a consultant-grade qualification across QCHP, DHA, and DOH for pulmonologists with UK specialty training.</li>
          <li><strong>Arab Board in Pulmonology and Respiratory Medicine:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia (SCFHS), Kuwait (MOH), and Qatar (QCHP) for candidates trained in GCC institutions.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Pulmonologist CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}

import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Endoscopist & Gastroenterologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for gastroenterologists and advanced endoscopists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, ESD/EUS/ERCP competency, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Gastroenterologist & Endoscopist CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for gastroenterologists and advanced endoscopists practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Endoscopist & Gastroenterologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Endoscopist & Gastroenterologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Gastroenterology and advanced endoscopy are among the fastest-evolving medical specialties. ESD, EUS-guided interventions, and AI-assisted colonoscopy have transformed the scope of practice — and GCC authorities expect practitioners to keep pace. This guide covers CME requirements for gastroenterologists and advanced endoscopists across all seven GCC licensing authorities."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={9}
      >
        <h2>GCC Gastroenterologist CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year; Hamad/Sidra GI units"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Surgery + Internal Medicine GI track"],
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

        <h2>Advanced Endoscopy in the GCC Context</h2>
        <p>Qatar&apos;s Hamad Medical Corporation and Sidra Medicine both run advanced endoscopy training programmes — the only two centres in the GCC accredited for comprehensive therapeutic endoscopy fellowships. Saudi Arabia&apos;s SCFHS gastroenterology board includes a dedicated endoscopy competency track. The UAE&apos;s Dubai Academic Health Corporation and SEHA network expect GI specialists to maintain current credentialing for advanced procedures including EUS and ERCP. GCC hospitals increasingly require proctored log books for ESD and advanced colonoscopy before granting independent practice privileges — CME in procedural skills is therefore directly tied to hospital credentialing.</p>

        <h2>Key CME Topics for Gastroenterologists and Endoscopists</h2>
        <ul>
          <li><strong>Endoscopic submucosal dissection (ESD)</strong> — technique updates, Eastern vs Western approaches, training pathways, complication management (perforation, bleeding), knife selection</li>
          <li><strong>Endoscopic ultrasound (EUS)</strong> — tissue acquisition (FNA vs FNB), EUS-guided hepaticogastrostomy, EUS-guided gallbladder drainage, pancreatic cyst surveillance</li>
          <li><strong>ERCP advances</strong> — single-operator cholangioscopy, electrohydraulic lithotripsy, biliary stenting strategies, post-ERCP pancreatitis prevention</li>
          <li><strong>AI-assisted endoscopy</strong> — computer-aided detection (CADe) and diagnosis (CADx) for polyp detection, real-time adenoma detection rate improvement, regulatory status in GCC</li>
          <li><strong>Barrett&apos;s oesophagus and early oesophageal cancer</strong> — surveillance protocols, Prague classification update, endoscopic eradication therapy (RFA, EMR, cryotherapy)</li>
          <li><strong>Colorectal cancer screening</strong> — Qatar and Saudi CRC screening programme updates, FIT testing integration, polypectomy technique and quality metrics (ADR, CIR)</li>
          <li><strong>IBD management</strong> — newer biologics and small molecules (JAK inhibitors, S1P modulators), treat-to-target strategies, endoscopic healing definitions (STRIDE-II)</li>
          <li><strong>NAFLD/MASLD</strong> — resmetirom approval implications for GI practice, non-invasive fibrosis assessment, vibration-controlled transient elastography</li>
          <li><strong>Third-space endoscopy</strong> — POEM for achalasia and gastric outlet obstruction, GERD after POEM, outcome data</li>
          <li><strong>Capsule endoscopy and deep enteroscopy</strong> — SB Crohn&apos;s disease evaluation, DBE technique, patency capsule use</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>United European Gastroenterology Week (UEG Week)</li>
          <li>American College of Gastroenterology (ACG) Annual Meeting</li>
          <li>Digestive Disease Week (DDW) — ASGE/AGA/AASLD/SSAT</li>
          <li>Arab Journal of Gastroenterology — associated CME days</li>
          <li>Saudi Gastroenterology Association (SGA) Annual Congress — SCFHS credited</li>
          <li>Emirates Gastroenterology Conference — DHA and DOH credited</li>
          <li>ESGE Days (European Society of Gastrointestinal Endoscopy)</li>
          <li>World Endoscopy Organization (WEO) — live endoscopy workshops</li>
        </ul>

        <h2>Procedural Credentialing and CME Documentation</h2>
        <p>GCC hospitals — particularly JCI-accredited institutions — require documented competency for advanced endoscopic procedures. CME specifically in ESD, ERCP, and EUS is increasingly required not just for renewal but for hospital privileging. QCHP&apos;s continuing professional development framework accepts structured workshops with procedural simulation as formal CPD hours. Gastroenterologists should maintain separate procedural log books alongside CME certificates, as some institutions require both for re-credentialing.</p>

        <h2>Track Your Gastroenterology CME</h2>
        <p>Hayya Med Pro tracks CME credits per GCC authority, per specialty, and per renewal cycle. Upload conference certificates, workshop completion documents, and online module completions — all stored securely with signed URL access and searchable by category.</p>

        <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}

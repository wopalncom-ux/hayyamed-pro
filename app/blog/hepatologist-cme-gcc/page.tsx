import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hepatologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for hepatologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, NAFLD/MASLD, viral hepatitis, transplant hepatology, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Hepatologist CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for hepatologists practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Hepatologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Hepatologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Hepatology carries an exceptionally high CME burden in the GCC — the region has among the world's highest rates of NAFLD/MASLD, significant viral hepatitis burden, and growing liver transplant programmes. Hepatologists must stay current with rapidly evolving treatment guidelines."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Hepatologist CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year minimum"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Gastroenterology/hepatology board track"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "Annual reporting"],
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

        <h2>The GCC Hepatology Context</h2>
        <p>The GCC faces a significant liver disease burden shaped by a combination of high obesity and diabetes rates (driving NAFLD/MASLD), historical HCV endemicity in Egypt and the Levant diaspora population, HBV in migrant worker communities, and growing alcohol-related liver disease in some jurisdictions. Qatar&apos;s National Programme for Obesity Management and Saudi Arabia&apos;s Vision 2030 health transformation both explicitly prioritise non-communicable disease management — placing hepatologists at the centre of a growing clinical workload. Liver transplant programmes at Hamad Medical Corporation, King Faisal Specialist Hospital, and Mafraq Hospital all require their hepatologists to maintain up-to-date CME in transplant hepatology.</p>

        <h2>Key CME Topics for Hepatologists</h2>
        <ul>
          <li><strong>NAFLD/MASLD</strong> — new nomenclature (MASLD/MASH), GLP-1 receptor agonists in hepatic steatosis, NASH cirrhosis management, FIB-4 and non-invasive fibrosis scoring</li>
          <li><strong>Viral hepatitis</strong> — HCV direct-acting antiviral cure strategies, HBV functional cure, HBV/HDV co-infection, HEV in immunocompromised patients</li>
          <li><strong>Hepatocellular carcinoma (HCC)</strong> — Barcelona Clinic Liver Cancer (BCLC) algorithm updates, immunotherapy combinations, locoregional therapy sequencing</li>
          <li><strong>Liver transplant hepatology</strong> — waitlist management, post-transplant immunosuppression, HCC within Milan criteria, living donor evaluation</li>
          <li><strong>Portal hypertension</strong> — TIPS indications and outcomes, prevention of variceal rebleeding, hepatorenal syndrome management</li>
          <li><strong>Autoimmune liver disease</strong> — AIH, PBC, PSC — diagnostic workup and treatment algorithm updates</li>
          <li><strong>Liver biopsy and non-invasive assessment</strong> — Fibroscan, MRI-PDFF, Enhanced Liver Fibrosis (ELF) panel</li>
          <li><strong>Drug-induced liver injury</strong> — DILI case recognition, LiverTox database, herbal and traditional medicine in the GCC context</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>European Association for the Study of the Liver (EASL) International Liver Congress</li>
          <li>American Association for the Study of Liver Diseases (AASLD) — The Liver Meeting</li>
          <li>Arab Association for the Study of the Liver (AASL) — GCC-region credited activity</li>
          <li>Gulf Gastroenterology and Hepatology Congress</li>
          <li>Arab Health — hepatology and gastroenterology sessions</li>
          <li>Saudi Society of Gastroenterology Annual Meeting</li>
        </ul>

        <h2>Track Your Hepatology CME</h2>
        <p>Hayya Med Pro tracks CME per country and per cycle with automated gap analysis. Upload certificates from international liver congresses and regional GCC meetings — the platform recognises both for compliance tracking.</p>

        <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}

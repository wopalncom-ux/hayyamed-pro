import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gastroenterologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA GI Guide",
  description:
    "CME requirements for gastroenterologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, hepatology and liver disease CME (NAFLD, viral hepatitis), advanced endoscopy CPD, IBD management updates, MRCP and Arab Board recognition.",
  openGraph: {
    title: "Gastroenterologist CME GCC 2026 — GI and Hepatology CME Guide",
    description:
      "Complete CME guide for gastroenterologists in GCC countries: QCHP, DHA, SCFHS credit requirements, NAFLD/NASH hepatology CME, advanced endoscopy (EUS, ERCP, EMR), IBD biologics updates, and best GI conferences for GCC CME.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Gastroenterologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Gastroenterologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA GI Guide"
        description="Gastroenterology in the GCC faces a unique epidemiological landscape — extremely high NAFLD prevalence driven by metabolic syndrome, significant viral hepatitis burden (hepatitis B and C), and a rising incidence of colorectal cancer and IBD in rapidly westernised populations."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Gastroenterologist CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Gastroenterologists</h2>

        <h3>Hepatology and Liver Disease</h3>
        <p>
          Liver disease is a critical area for GCC gastroenterologists given the extremely
          high NAFLD prevalence and persistent viral hepatitis burden:
        </p>
        <ul>
          <li>MASLD/MASH (formerly NAFLD/NASH) — new nomenclature, fibrosis staging, resmetirom (first approved MASH drug), evolving treatment landscape</li>
          <li>Viral hepatitis B — updated EASL/AASLD treatment guidelines, functional cure targets, nucleos(t)ide analogue selection</li>
          <li>Viral hepatitis C — pan-genotypic DAA regimens, treatment of difficult populations (cirrhosis, renal impairment)</li>
          <li>Hepatocellular carcinoma — updated BCLC staging, immunotherapy (atezolizumab+bevacizumab, tremelimumab+durvalumab), ablation selection</li>
          <li>Liver cirrhosis complications — variceal bleeding management (updated Baveno VII consensus), SBP prevention, HRS management</li>
        </ul>

        <h3>Advanced Endoscopy</h3>
        <ul>
          <li>Endoscopic retrograde cholangiopancreatography (ERCP) — difficult cannulation, self-expanding metal stents, cholangioscopy</li>
          <li>Endoscopic ultrasound (EUS) — EUS-guided FNA/FNB, EUS-guided drainage (biliary, pancreatic pseudocyst, abscess)</li>
          <li>Endoscopic mucosal resection (EMR) and submucosal dissection (ESD) — colorectal and gastric lesions</li>
          <li>Per-oral endoscopic myotomy (POEM) — achalasia management, procedural updates</li>
          <li>Colonoscopy quality indicators — adenoma detection rate benchmarks, withdrawal time, serrated lesion detection</li>
        </ul>

        <h3>Inflammatory Bowel Disease</h3>
        <ul>
          <li>IBD biologics — anti-TNF agents (infliximab, adalimumab), vedolizumab, ustekinumab, ozanimod, risankizumab, mirikizumab</li>
          <li>IBD treat-to-target strategy — endoscopic remission targets, biomarker monitoring (calprotectin, CRP)</li>
          <li>IBD in pregnancy — updated safety data for biologics, JAK inhibitors</li>
          <li>Microbiome and FMT — updated evidence for C. diff and IBD</li>
        </ul>

        <h3>Colorectal Cancer Screening</h3>
        <ul>
          <li>Updated colonoscopy quality metrics and reporting standards</li>
          <li>Non-invasive screening options — FIT, mt-sDNA (Cologuard), CT colonography</li>
          <li>GCC national colorectal cancer screening programmes — Qatar, UAE, Saudi national programme updates</li>
          <li>Management of serrated polyps — updated classification and surveillance</li>
        </ul>

        <h2>Best GI Conferences for GCC CME</h2>

        <h3>DDW (Digestive Disease Week, USA)</h3>
        <p>
          DDW (May/June, USA) is the world&apos;s largest GI conference, generating AMA PRA Category 1
          CME credits accepted by all GCC authorities. The definitive conference for hepatology,
          advanced endoscopy, IBD, and GI oncology updates.
        </p>

        <h3>UEG Week (United European Gastroenterology Week)</h3>
        <p>
          UEG Week (October, European cities) generates EACCME credits. The premier European GI
          conference — very strong hepatology and IBD content.
        </p>

        <h3>EASL Congress (European Association for the Study of the Liver)</h3>
        <p>
          EASL Congress (April/May) generates EACCME credits. The global hepatology benchmark
          meeting — MASLD, viral hepatitis, HCC, and cirrhosis complications guidelines originate here.
          High value for GCC hepatologists given the regional liver disease burden.
        </p>

        <h2>MRCP, ABIM, and Arab Board Recognition</h2>
        <ul>
          <li><strong>MRCP (UK) + SCE in Gastroenterology:</strong> Recognized by QCHP, DHA, DOH, and SCFHS as the consultant-grade specialist qualification for gastroenterologists.</li>
          <li><strong>ABIM Gastroenterology subspecialty certification:</strong> Recognized by GCC authorities. ABIM MOC activities count toward GCC CME renewal.</li>
          <li><strong>Arab Board in Internal Medicine/Gastroenterology:</strong> Recognized across all GCC countries.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Gastroenterologist CME requirements vary by licensing authority. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}

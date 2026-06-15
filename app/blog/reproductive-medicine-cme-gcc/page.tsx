import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reproductive Medicine CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for reproductive medicine and fertility specialists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, ESHRE/ASRM recognition, ART regulatory compliance, and renewal timelines.",
  openGraph: {
    title: "Reproductive Medicine CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description:
      "A complete guide to CME and CPD requirements for reproductive medicine and fertility specialists practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Reproductive Medicine CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Reproductive Medicine CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="GCC countries are investing heavily in world-class fertility centres, and specialists in reproductive medicine operate within a complex environment combining rapidly evolving clinical evidence with stringent cultural and religious regulatory considerations. CME compliance is non-negotiable for maintaining a license to practice."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={9}
      >
        <h2>GCC Reproductive Medicine CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year minimum; 5 domains"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Category A/B split required"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "ART regulatory compliance required"],
              ["DOH", "UAE (Abu Dhabi)", "30–50 CPD", "1–2 years", "By professional classification"],
              ["NHRA", "Bahrain", "40 CPD", "2 years", "Verified activities only"],
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

        <h2>The Unique CME Context for Reproductive Medicine in the GCC</h2>
        <p>
          Unlike most specialties, reproductive medicine in the GCC operates within specific ethical and legal frameworks that differ from Western jurisdictions. GCC authorities recognise this and expect reproductive medicine CME to reflect both clinical advances and culturally appropriate practice parameters. CME activities addressing Islamic jurisprudence perspectives on assisted reproduction are specifically valued by some authorities, particularly in Saudi Arabia.
        </p>

        <h2>Qatar — QCHP Detail</h2>
        <p>
          Reproductive medicine specialists in Qatar accumulate 80 CPD points per two-year cycle across five QCHP domains: medical expertise, scholarship and teaching, communication, collaboration, and health advocacy. Qatar&apos;s Sidra Medicine and HMC&apos;s Women&apos;s Wellness and Research Centre run active QCHP-accredited internal CME programmes. The QCHP accepts ESHRE, ASRM, and GCC fertility society meetings.
        </p>

        <h2>Saudi Arabia — SCFHS Detail</h2>
        <p>
          SCFHS classifies reproductive endocrinology under Obstetrics and Gynaecology sub-specialties. Requirements are 40–60 hours per cycle, with Category A covering direct clinical or procedural education (including IVF laboratory training and embryology updates). All activities must be logged on Mumaris+.
        </p>

        <h2>UAE Detail</h2>
        <p>
          DHA requires 40 CME credits over two years; DOH requires 30–50 credits. Both accept ESHRE and ASRM accredited activities. DHA specifically expects that specialists practising IVF remain current with the UAE&apos;s ART regulatory framework, which is periodically revised.
        </p>

        <h2>Key CME Topics for Reproductive Medicine Specialists</h2>
        <ul>
          <li><strong>IVF laboratory quality and embryology</strong> — time-lapse imaging, PGT-A/M/SR updates</li>
          <li><strong>Ovarian stimulation protocols</strong> — GnRH antagonist protocols, DuoStim, POSEIDON classification</li>
          <li><strong>Endometriosis and fertility</strong> — surgical vs medical management, fertility preservation</li>
          <li><strong>Male factor infertility</strong> — ICSI advances, surgical sperm retrieval</li>
          <li><strong>Fertility preservation</strong> — oocyte vitrification, ovarian tissue cryopreservation, oncofertility</li>
          <li><strong>Recurrent pregnancy loss</strong> — immunological factors, thrombophilia, uterine anomalies</li>
          <li><strong>Reproductive genetics</strong> — PGT, karyotyping, carrier screening</li>
          <li><strong>Endometrial receptivity</strong> — ERA testing, personalised embryo transfer timing</li>
          <li><strong>AI in reproductive medicine</strong> — embryo selection algorithms, outcome prediction</li>
          <li><strong>Ethics in ART</strong> — consent, donor anonymity, surrogacy in GCC context</li>
        </ul>

        <h2>Key Accepted Conferences</h2>
        <ul>
          <li>ESHRE (European Society of Human Reproduction and Embryology) Annual Meeting</li>
          <li>ASRM (American Society for Reproductive Medicine) Annual Meeting</li>
          <li>Middle East Fertility Society (MEFS) Annual Meeting — highly valued in GCC</li>
          <li>Arab World IVF (AIVF) Meeting</li>
          <li>Saudi Society of Obstetrics and Gynaecology (SSOG) Annual Congress</li>
          <li>FIGO World Congress (Obstetrics and Gynaecology)</li>
        </ul>

        <h2>Documentation and Audit Readiness</h2>
        <p>
          All GCC authorities may audit CME submissions at renewal. Specialists should retain original certificates, conference programmes, and registration confirmations. ESHRE and ASRM issue digital certificates accepted by GCC authorities, but the accreditation number and credit value must be clearly visible.
        </p>

        <h2>Track Your Reproductive Medicine CME with Hayya Med Pro</h2>
        <p>
          Hayya Med Pro&apos;s centralised CME portfolio lets specialists upload certificates, tag them to the correct authority and category, and track compliance against their renewal deadline — across every GCC jurisdiction where they practice.
        </p>

        <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}

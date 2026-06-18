import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paediatric Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for paediatric surgeons in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, neonatal surgery, minimally invasive paediatric techniques, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Paediatric Surgeon CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for paediatric surgeons practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Paediatric Surgeon CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Paediatric Surgeon CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Paediatric surgery covers a uniquely broad scope — from neonatal emergencies to complex reconstructive procedures in adolescents. GCC licensing authorities require paediatric surgeons to maintain CME compliance across this full spectrum, with specialist children's hospitals setting additional credentialing standards."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Paediatric Surgeon CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year; Sidra Medicine recognised"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Paediatric surgery specialty board"],
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

        <h2>Why CME Is Critical for Paediatric Surgeons</h2>
        <p>Paediatric surgery spans neonatal emergencies (oesophageal atresia, congenital diaphragmatic hernia) through to complex oncological resections and adolescent bariatric procedures. The GCC&apos;s rapidly growing paediatric population and the concentration of major children&apos;s hospitals — Sidra Medicine in Qatar, King Faisal Specialist Hospital in Saudi Arabia, Great Ormond Street Hospital for Children affiliate at Cleveland Clinic Abu Dhabi — mean paediatric surgeons must maintain international-standard CME. JCI paediatric standards require documented specialty-specific CME.</p>

        <h2>Key CME Topics for Paediatric Surgeons</h2>
        <ul>
          <li><strong>Neonatal surgery</strong> — CDH management, EA/TEF repair, exomphalos, NEC surgery, hirschsprung disease</li>
          <li><strong>Minimally invasive paediatric surgery</strong> — laparoscopic pyloromyotomy, thoracoscopic repair of CDH, laparoscopic Kasai</li>
          <li><strong>Paediatric oncology surgery</strong> — Wilms tumour, neuroblastoma, hepatoblastoma, rhabdomyosarcoma, lymphoma staging</li>
          <li><strong>Paediatric urological surgery</strong> — hypospadias repair, pyeloplasty, orchidopexy, vesicoureteric reflux management</li>
          <li><strong>Paediatric trauma</strong> — non-operative management of solid organ injury, damage control in children</li>
          <li><strong>Paediatric colorectal surgery</strong> — Hirschsprung pull-through, anorectal malformations, inflammatory bowel disease</li>
          <li><strong>Paediatric liver and biliary surgery</strong> — biliary atresia, choledochal cyst, Kasai portoenterostomy</li>
          <li><strong>Anaesthesia considerations</strong> — age-specific pharmacology, fluid management in neonates and infants</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>British Association of Paediatric Surgeons (BAPS) Annual Congress</li>
          <li>American Pediatric Surgical Association (APSA) Annual Meeting</li>
          <li>International Paediatric Endosurgery Group (IPEG) Annual Congress</li>
          <li>World Congress of Paediatric Surgery (WOFAPS)</li>
          <li>Arab Health — paediatric surgery sessions</li>
          <li>Saudi Paediatric Surgery Society Annual Meeting</li>
        </ul>

        <h2>Simulation and Skills Laboratories</h2>
        <p>Neonatal and paediatric surgery simulation — including suturing on neonatal models and box-trainer laparoscopy in paediatric-sized ports — is recognised as formal CME by most GCC authorities when delivered by accredited institutions. Sidra Medicine&apos;s simulation centre in Qatar and the Saudi Commission for Health Specialties Skills Centres both provide structured training programmes that generate certified CME.</p>

        <h2>Track Your Paediatric Surgery CME</h2>
        <p>Hayya Med Pro tracks CME per country and per cycle. Store your conference certificates and skills course documentation securely with signed URL access and automated renewal alerts.</p>

        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}

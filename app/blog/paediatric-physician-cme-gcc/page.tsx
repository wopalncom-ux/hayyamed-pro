import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paediatric Physician CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for paediatricians in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: per-authority credit requirements, neonatal and general paediatric CPD priorities, paediatric emergency and subspecialty updates, AAP/ESPID conference CME recognition, and MRCPCH/ABP qualification recognition.",
  openGraph: {
    title: "Paediatric Physician CME GCC 2026 — QCHP, SCFHS, DHA Paediatrics Guide",
    description:
      "CME guide for paediatricians in GCC countries: credit requirements by authority, neonatology updates, paediatric infectious disease, obesity and metabolic health, childhood vaccination, AAP/ESPR conference CME, and MRCPCH/ABP qualification recognition.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Paediatric Physician CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Paediatric Physician CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Paediatrics in the GCC serves a young, rapidly growing population with a unique disease profile: high birth rates (particularly in Saudi Arabia and Qatar), a significant congenital heart disease and metabolic disease burden, rapidly rising childhood obesity, and infectious disease patterns that differ from Western markets — including MERS-CoV exposure risk and a high burden of respiratory syncytial virus (RSV) in neonates and infants."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Paediatric Physician CME Requirements by Authority</h2>

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

        <h2>Subspecialty CME Priorities for GCC Paediatric Physicians</h2>

        <h3>Neonatology</h3>
        <ul>
          <li>Preterm infant management — updated surfactant therapy (INSURE vs. LISA/MIST techniques), non-invasive ventilation (CPAP, HFNC, NIPPV), caffeine therapy</li>
          <li>Neonatal resuscitation — updated NRP 2024 algorithm; delayed cord clamping evidence; hypothermia protocol for HIE</li>
          <li>RSV prevention — nirsevimab (Beyfortus) monoclonal antibody prophylaxis for all infants — new standard replacing palivizumab in low-risk neonates; GCC national RSV immunisation programme development</li>
          <li>Neonatal infection — updated early-onset sepsis calculator; blood culture stewardship; antibiotic de-escalation</li>
          <li>Retinopathy of prematurity (ROP) — updated screening criteria, anti-VEGF therapy (bevacizumab, ranibizumab) vs. laser photocoagulation</li>
        </ul>

        <h3>Paediatric Infectious Disease</h3>
        <ul>
          <li>Childhood vaccination schedules — updated QCHP, SCFHS, DHA, and MOH Kuwait national immunisation programmes; meningococcal ACWY and B, HPV, rotavirus — country-specific schedules</li>
          <li>COVID-19 in children — MIS-C (multisystem inflammatory syndrome) diagnostic criteria, management, long-term follow-up</li>
          <li>Antimicrobial stewardship in paediatrics — updated guidelines for acute otitis media, streptococcal pharyngitis, community-acquired pneumonia</li>
          <li>Tuberculosis in children — updated WHO paediatric TB treatment guidelines; paediatric drug-resistant TB; IGRA vs. TST in children</li>
          <li>Dengue and arboviral disease — rising incidence in some expatriate communities in GCC; paediatric dengue management</li>
        </ul>

        <h3>Childhood Obesity and Metabolic Health</h3>
        <ul>
          <li>Childhood obesity prevalence — GCC has among the world&apos;s highest rates of childhood obesity (UAE, Saudi Arabia, Kuwait); updated paediatric obesity management guidelines (AAP 2023 intensive health behaviour and lifestyle treatment)</li>
          <li>Paediatric type 2 diabetes — rising incidence; updated ADA/ISPAD treatment guidelines; GLP-1 receptor agonists in adolescents (liraglutide, semaglutide — FDA-approved from age 12)</li>
          <li>MASLD in children — screening, staging, lifestyle intervention</li>
          <li>Metabolic syndrome in children — lipid screening, blood pressure targets, insulin resistance</li>
        </ul>

        <h3>Paediatric Emergency Medicine</h3>
        <ul>
          <li>PALS (Paediatric Advanced Life Support) — biennial recertification is a mandatory requirement for most GCC hospital credentialing systems</li>
          <li>Paediatric sepsis — updated Pediatric Sepsis-3 criteria, fluid resuscitation updated evidence (FEAST trial implications), vasopressor thresholds in paediatric septic shock</li>
          <li>Febrile seizures — updated management, antipyretic evidence, parental education</li>
          <li>Paediatric asthma exacerbation — magnesium sulfate, heliox, high-flow oxygen, paediatric-specific SABA dosing</li>
          <li>Head injury — updated paediatric TBI management guidelines (PECARN rule for CT decision), mild TBI return-to-school protocol</li>
        </ul>

        <h3>Developmental and Behavioural Paediatrics</h3>
        <ul>
          <li>Autism spectrum disorder (ASD) — updated screening tools (M-CHAT-R), early intervention evidence, GCC diagnostic pathways</li>
          <li>ADHD — updated AAP diagnostic and treatment guidelines; methylphenidate and amphetamine formulations; non-stimulant options (atomoxetine, viloxazine)</li>
          <li>Child safeguarding — mandatory reporting requirements in Qatar and UAE; clinical recognition of abuse and neglect</li>
        </ul>

        <h2>Best Paediatrics Conferences for GCC CME</h2>

        <h3>AAP National Conference and Exhibition (American Academy of Pediatrics)</h3>
        <p>
          AAP National Conference (October, USA) generates AMA PRA Category 1 CME credits recognised by QCHP, DHA,
          DOH, SCFHS, NHRA, MOH Kuwait, and OMSB. The world&apos;s largest paediatrics meeting — clinical updates,
          sub-specialty content, and policy sessions.
        </p>

        <h3>ESPID Congress (European Society for Paediatric Infectious Diseases)</h3>
        <p>
          ESPID Congress (May, European cities) generates EACCME credits. The premier paediatric infectious disease
          meeting — vaccination policy, antimicrobial resistance in children, emerging infections.
        </p>

        <h3>Gulf Paediatric Society Annual Congress</h3>
        <p>
          The Gulf Paediatric Society Congress generates QCHP and SCFHS-recognised CME directly. GCC-specific paediatric
          content — childhood obesity epidemiology, neonatal care in high-volume delivery centres, vaccination policy.
        </p>

        <h2>MRCPCH, ABP, and Arab Board Recognition</h2>
        <ul>
          <li><strong>MRCPCH (Member of the Royal College of Paediatrics and Child Health, UK):</strong> One of the most widely held paediatric specialist qualifications among GCC paediatricians. Recognized by QCHP, DHA, DOH, and SCFHS for consultant-grade credentialing. The RCPCH-UAE partnership has made MRCPCH examination access local in Abu Dhabi.</li>
          <li><strong>ABP (American Board of Pediatrics):</strong> Recognized by DHA, DOH, and several private hospital credentialing systems. ABP diplomates with subspecialty certification (neonatology, paediatric cardiology, paediatric ID) are well-regarded in GCC specialist credentialing.</li>
          <li><strong>Arab Board in Paediatrics:</strong> Recognized across all GCC countries; particularly valued in Saudi Arabia (SCFHS) and Kuwait (MOH) for candidates trained in GCC institutions.</li>
          <li><strong>FRCPCH (Fellow of the Royal College of Paediatrics and Child Health):</strong> Recognized as a consultant-grade qualification across QCHP, DHA, and DOH.</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Paediatric physician CME requirements vary by licensing authority and subspecialty. Verify requirements directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}

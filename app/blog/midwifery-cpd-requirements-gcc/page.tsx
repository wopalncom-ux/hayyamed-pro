import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Midwifery CPD Requirements in the GCC 2026 — QCHP, DHA, DOH, NHRA",
  description:
    "Midwifery CPD requirements across GCC countries: how many credits midwives and midwife specialists need, which activities count, NICU-adjacent CPD, and how dual-registered midwives manage parallel obligations.",
  openGraph: {
    title: "Midwifery CPD GCC 2026 — Per-Authority Requirements & Accepted Activities",
    description:
      "Complete CPD guide for registered midwives in the GCC: credit requirements per authority, specialty-specific requirements, accepted activities, and compliance tips for midwives working across multiple GCC countries.",
    type: "article",
    publishedTime: "2026-06-14T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Midwifery CPD Requirements in the GCC 2026 — QCHP, DHA, DOH, NHRA",
  datePublished: "2026-06-14",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
  description: "Midwifery CPD requirements across GCC authorities for 2026.",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Midwifery CPD Requirements in the GCC 2026 — QCHP, DHA, DOH, NHRA"
        description="Registered midwives and specialist midwives in the GCC face CPD requirements that differ from those of nurses and physicians. This guide explains what each authority requires and how to build a compliant CPD portfolio."
        category="profession"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-14"
        readingMinutes={7}
      >
        <h2>Midwifery as a Distinct Profession in GCC Licensing</h2>
        <p>
          In most GCC health authorities, midwifery is licensed as a distinct profession
          separate from general nursing. Midwives hold their own license category with specific
          CPD requirements — midwifery CPD is not interchangeable with general nursing CPD,
          though some activities overlap.
        </p>
        <p>
          The midwifery workforce in the GCC is predominantly drawn from the Philippines, India,
          Jordan, Egypt, and the UK — each bringing different pre-registration training backgrounds
          that affect how their qualifications are classified and which examination requirements
          apply at licensing.
        </p>

        <h2>CPD Requirements by Authority — Midwifery</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Authority</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Country</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>CPD Credits Required</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Cycle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>QCHP / DHP-AS</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Qatar</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>80 CPD (40/year min)</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>DHA</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Dubai</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40 CME / 2 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
            </tr>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>DOH</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Abu Dhabi</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>30–50 CPD</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>1–2 years</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>SCFHS</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Saudi Arabia</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40–60 CME</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Per renewal</td>
            </tr>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>NHRA</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Bahrain</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40 CPD / 2 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>OMSB</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Oman</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40 CME / 2 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
            </tr>
          </tbody>
        </table>

        <h2>Midwifery-Specific CPD Activities</h2>

        <h3>Mandatory Competency Renewals</h3>
        <p>
          Beyond generic CPD credits, midwifery practice in GCC hospitals typically requires
          periodic renewal of specific competencies. These are tracked by employer credentialing
          departments independently of your licensing authority CPD record:
        </p>
        <ul>
          <li>
            <strong>CTG interpretation competency:</strong> Most GCC maternity units require
            annual or biennial CTG (cardiotocography) interpretation re-certification. Hospital
            in-house training is typical; some units use external providers.
          </li>
          <li>
            <strong>Shoulder dystocia drills:</strong> Mandatory simulation drills in most
            accredited maternity units. Counts as CPD credit at many authorities.
          </li>
          <li>
            <strong>Neonatal resuscitation (NRP):</strong> American Academy of Pediatrics
            Neonatal Resuscitation Program — required by most GCC hospital credentialing
            committees for midwives in birth settings. Valid 2 years. Accepted as CPD credit.
          </li>
          <li>
            <strong>ALSO (Advanced Life Support in Obstetrics):</strong> Strongly recommended
            for midwives in high-acuity settings. Accepted as CPD credit by DHA and DOH.
          </li>
          <li>
            <strong>PROMPT (PRactical Obstetric Multi-Professional Training):</strong>
            Inter-professional simulation training for obstetric emergencies. Highly valued by
            GCC hospital quality departments.
          </li>
        </ul>

        <h3>Midwifery-Specific Continuing Education</h3>
        <ul>
          <li>ICM (International Confederation of Midwives) accredited education activities</li>
          <li>RCOG/RCM (Royal College of Obstetricians and Gynaecologists / Royal College of Midwives) education events — accepted as CPD credit by QCHP, DHA, DOH</li>
          <li>WHO Safe Childbirth Checklist training</li>
          <li>Perinatal mental health training (increasingly required for midwife licensing renewal in UAE)</li>
          <li>Cultural competence in childbirth care — specific modules available through GCC hospital education departments</li>
          <li>Lactation counseling certification (IBCLC preparation courses)</li>
          <li>Bereavement care training (pregnancy loss, stillbirth)</li>
        </ul>

        <h2>UK-Registered Midwives in the GCC</h2>
        <p>
          UK-registered midwives (registered with the NMC) working in the GCC have dual CPD
          obligations: NMC revalidation (35 hours of CPD per 3-year revalidation cycle, with
          additional practice hour requirements) and their GCC licensing authority's CPD requirement.
        </p>
        <p>
          The good news: activities completed for GCC CPD purposes generally count toward NMC
          revalidation. The key difference is that NMC revalidation requires:
        </p>
        <ul>
          <li>450 practice hours over 3 years</li>
          <li>35 CPD hours including 20 hours of participatory learning</li>
          <li>5 written reflective accounts</li>
          <li>Reflective discussion with an NMC registrant</li>
          <li>Confirmation from a third party (employer or colleague)</li>
        </ul>
        <p>
          The CPD credits accumulate easily from GCC practice; the reflective accounts and
          confirmation processes require deliberate record-keeping that is different from
          certificate-based GCC CPD.
        </p>

        <h2>Midwives Transitioning to Nurse-Midwife or Advanced Practice Roles</h2>
        <p>
          Some GCC countries license "nurse-midwives" rather than treating midwifery as a
          fully separate profession. If you hold both nursing and midwifery qualifications,
          your licensing authority may require CPD credits across both professional scopes.
          Verify with your specific authority whether you need to meet nursing CPD requirements
          separately from midwifery CPD requirements when holding a combined registration.
        </p>

        <h2>Practical CPD Strategy for GCC Midwives</h2>
        <ul>
          <li>
            <strong>Use your hospital's accredited education program:</strong> Most large
            maternity units in GCC hospitals (Sidra Medicine, King Faisal Specialist Hospital,
            Cleveland Clinic Abu Dhabi) have internal education departments offering accredited
            CPD. These sessions happen during or adjacent to your working hours — highest
            efficiency for CPD accumulation.
          </li>
          <li>
            <strong>Target simulation drills for dual credit:</strong> Obstetric emergency
            drills (shoulder dystocia, postpartum haemorrhage, eclampsia) serve both hospital
            competency requirements and CPD credit accumulation simultaneously.
          </li>
          <li>
            <strong>Plan one external event per year:</strong> A regional obstetrics/midwifery
            conference (GCC OB/GYN Society, RCOG World Congress, ICM Congress) generates 4–20
            credits in a single event and builds professional networks.
          </li>
          <li>
            <strong>Photograph your certificates immediately:</strong> In busy maternity units
            it is easy to misplace certificates. Scan or photograph each certificate within
            24 hours and upload to a digital portfolio.
          </li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Midwifery CPD requirements are set by individual
          GCC health authorities and may differ by license category and registration date.
          Verify current requirements directly with your licensing authority before your
          renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}

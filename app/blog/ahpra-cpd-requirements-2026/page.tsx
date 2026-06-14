import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AHPRA CPD Requirements 2026 — Complete Guide for Australian Healthcare Professionals",
  description:
    "AHPRA CPD requirements explained: how many hours, which activities count, the CPD Standard, recording requirements, and what AHPRA does when you can't meet your CPD obligations.",
  openGraph: {
    title: "AHPRA CPD 2026 — Hours, Activities, Evidence & Audit Rules",
    description:
      "Complete guide to AHPRA CPD requirements across medical, nursing, pharmacy and allied health professions. Evidence types, recording requirements, and what happens if you fall short.",
    type: "article",
    publishedTime: "2026-06-14T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "AHPRA CPD Requirements 2026 — Complete Guide for Australian Healthcare Professionals",
  datePublished: "2026-06-14",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
  description:
    "AHPRA CPD requirements for 2026: hours, activities, evidence, and how to stay compliant across all Australian health professions.",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="AHPRA CPD Requirements 2026 — Complete Guide for Australian Healthcare Professionals"
        description="The Australian Health Practitioner Regulation Agency CPD framework explained: how many hours you need, which activities count, what evidence you must keep, and how to stay audit-ready."
        category="country"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-14"
        readingMinutes={9}
      >
        <h2>AHPRA and the CPD Standard</h2>
        <p>
          The Australian Health Practitioner Regulation Agency (AHPRA) administers registration for
          15 health professions in Australia through the National Boards. CPD (Continuing Professional
          Development) requirements are set by each National Board, meaning they differ by profession —
          but all follow the CPD Standard principles established by AHPRA.
        </p>
        <p>
          The CPD Standard requires that CPD activities be relevant to your area of practice, reflect
          genuine learning that improves competence, and be recorded with sufficient evidence to
          demonstrate completion.
        </p>

        <h2>CPD Requirements by Profession</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Profession</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Board</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Annual CPD</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Cycle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Medical Practitioners</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Medical Board of Australia</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>50 CPD hours/year (incl. 12.5h CPR/Performance/Outcome)</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Annual</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Nurses & Midwives</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Nursing & Midwifery Board</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>20 hours/year</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Annual</td>
            </tr>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Pharmacists</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Pharmacy Board</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40 hours over 3 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>3 years</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Dentists</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Dental Board</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>60 hours/3 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>3 years</td>
            </tr>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Physiotherapists</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Physiotherapy Board</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>20 hours/year</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Annual</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Psychologists</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Psychology Board</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>30 hours/year</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Annual</td>
            </tr>
          </tbody>
        </table>

        <h2>The Medical Board CPD Framework (Most Complex)</h2>
        <p>
          The Medical Board of Australia redesigned its CPD framework in 2023. Under the current
          framework, medical practitioners must complete:
        </p>
        <ul>
          <li>
            <strong>50 CPD hours per year total</strong>, split across three activity categories:
          </li>
          <li>
            <strong>Reviewing performance (minimum 12.5 hours):</strong> Activities that involve
            reviewing and reflecting on your own clinical performance — audit and feedback, peer
            review, mortality and morbidity review, multisource feedback, clinical indicator monitoring
          </li>
          <li>
            <strong>Measuring outcomes (minimum 12.5 hours):</strong> Activities that measure
            actual patient or system outcomes — case conferences, structured discussions with
            colleagues about patient outcomes, peer-to-peer consultation
          </li>
          <li>
            <strong>Educational activities (no minimum per se — balance fills the 25+ hours):</strong>
            Conferences, workshops, online learning, journal clubs, simulation — any formal learning
          </li>
        </ul>
        <p>
          <strong>Why the two mandatory categories?</strong> The Medical Board recognizes that
          educational activities alone do not guarantee improved practice. The reviewing performance
          and measuring outcomes categories ensure CPD creates direct practice improvement — not
          just attendance at educational events.
        </p>

        <h2>What Activities Count as AHPRA CPD?</h2>

        <h3>Educational Activities</h3>
        <ul>
          <li>Conferences, workshops, webinars, seminars — as both delegate and presenter/faculty</li>
          <li>Online CME/CPD modules (accredited and non-accredited — but non-accredited must demonstrate genuine learning)</li>
          <li>Simulation training</li>
          <li>Postgraduate academic study (each unit of study at postgraduate level typically = substantial CPD hours)</li>
          <li>Journal club participation (reading plus structured discussion)</li>
          <li>Case presentations</li>
        </ul>

        <h3>Reviewing Performance</h3>
        <ul>
          <li>Clinical audit (reviewing your own patient outcomes against standards)</li>
          <li>Peer review (structured review of clinical practice by colleagues)</li>
          <li>Mortality and morbidity review participation</li>
          <li>External review of own practice by specialist society or hospital quality program</li>
          <li>Multisource feedback (360-degree feedback from colleagues, patients, etc.)</li>
        </ul>

        <h3>Measuring Outcomes</h3>
        <ul>
          <li>Case discussions with colleagues focused on patient outcomes</li>
          <li>Root cause analysis participation</li>
          <li>Structured reflective practice using real patient cases</li>
          <li>Quality improvement project participation with measured outcomes</li>
        </ul>

        <h2>Evidence You Must Keep</h2>
        <p>
          AHPRA does not require CPD activities to be logged in a central portal (unlike many GCC
          authorities). Instead, you maintain your own CPD record and must be able to provide it
          on request — typically during the annual renewal declaration or if selected for a CPD audit.
        </p>
        <p>
          <strong>Required evidence per activity:</strong>
        </p>
        <ul>
          <li>Activity title and description</li>
          <li>Date completed</li>
          <li>Hours spent</li>
          <li>Activity category (educational, reviewing performance, or measuring outcomes)</li>
          <li>Evidence of completion — certificate, attendance record, reflection notes, or for self-directed activities, a written record of what you did and what you learned</li>
          <li>Reflection on how the activity will change or improve your practice</li>
        </ul>
        <p>
          <strong>Keep records for 5 years</strong> — AHPRA can request CPD evidence going back
          up to 5 years if concerns arise about practice.
        </p>

        <h2>The AHPRA CPD Audit Process</h2>
        <p>
          AHPRA randomly selects a proportion of registrants each year for CPD audit. Being selected
          for audit does not mean you are under investigation — it is a routine compliance check.
        </p>
        <p>
          If audited, you will be asked to:
        </p>
        <ol>
          <li>Submit your CPD record for the relevant period</li>
          <li>Provide evidence documents for the activities you claimed</li>
          <li>Respond within the stated timeframe (typically 30–60 days)</li>
        </ol>
        <p>
          <strong>Non-compliance outcomes:</strong> If your CPD record is incomplete or evidence
          is insufficient, AHPRA may require you to undertake specific CPD activities, impose
          conditions on your registration, or in serious cases of repeated non-compliance, take
          further regulatory action. First-time minor shortfalls are typically handled with
          remediation requirements rather than immediate sanctions.
        </p>

        <h2>AHPRA CPD for Australian Professionals Now Working in the GCC</h2>
        <p>
          Australian-qualified health professionals working in GCC countries are a growing cohort —
          particularly in UAE, Qatar, and Saudi Arabia. If you maintain active AHPRA registration
          while working overseas, you must still meet AHPRA CPD requirements:
        </p>
        <ul>
          <li>
            <strong>GCC activities are generally accepted</strong> — as long as they fit within
            one of the AHPRA CPD categories (educational activities, reviewing performance, or
            measuring outcomes). A DHA-accredited conference in Dubai counts as an educational
            activity for AHPRA purposes.
          </li>
          <li>
            <strong>Keep your records in English</strong> — AHPRA requires records in English.
            For GCC CME certificates in Arabic, retain the Arabic original plus a self-certified
            English translation.
          </li>
          <li>
            <strong>Reflection is non-negotiable</strong> — Australian CPD culture emphasizes
            reflection on how activities change practice. This is different from GCC-style
            attendance-certificate-based CME. Record a brief reflection note for each significant
            activity, even if the GCC certificate does not require it.
          </li>
          <li>
            <strong>Non-practicing status:</strong> If you hold AHPRA registration but are not
            practicing (non-practicing registration), CPD requirements are different — non-practicing
            registrants have reduced obligations but must still meet them at renewal.
          </li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> AHPRA CPD requirements are set by individual National Boards
          and may change. Always verify current requirements on the AHPRA website (ahpra.gov.au)
          and with your specific National Board before your registration renewal.
        </p>
      </BlogPostLayout>
    </>
  );
}

import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Addiction Medicine CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for addiction medicine and psychiatry specialists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: substance use disorder CPD, mental health law compliance, opioid management, and addiction conferences recognized in the GCC.",
  openGraph: {
    title: "Addiction Medicine CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description:
      "CME guide for addiction medicine specialists in GCC countries: credit requirements, substance use disorder training, GCC mental health legislation, harm reduction, and addiction psychiatry conferences.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Addiction Medicine CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Addiction Medicine CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Addiction medicine in the GCC operates within a uniquely complex regulatory and cultural landscape. Practitioners must maintain rigorous CME standards while navigating region-specific legislation on substance use, harm reduction policy, and psychiatric co-morbidity management."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Addiction Medicine CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 (40/year)", "2 years", "CPD"],
              ["SCFHS", "Saudi Arabia", "40–60", "Per renewal", "CME"],
              ["DHA", "Dubai", "40", "2 years", "CME"],
              ["DOH", "Abu Dhabi", "30–50", "1–2 years", "CPD"],
              ["NHRA", "Bahrain", "40", "2 years", "CPD"],
              ["MOH Kuwait", "Kuwait", "30", "Annual", "CME"],
              ["OMSB", "Oman", "40", "2 years", "CME"],
            ].map(([auth, country, credits, cycle, term], i) => (
              <tr key={auth} style={{ background: i % 2 === 1 ? "#f8fafc" : undefined }}>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", fontWeight: 600 }}>{auth}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{country}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{credits}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{cycle}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{term}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          Addiction medicine specialists in the GCC — whether practising as psychiatrists with a sub-specialty focus,
          as dedicated addiction physicians, or within dual-diagnosis inpatient settings — must fulfil the same base
          CPD/CME credit requirements as their general psychiatry counterparts. The distinction lies in the <em>content</em>
          : regulators increasingly expect evidence of addiction-specific learning within the portfolio.
        </p>

        <h2>Core CPD Topics for Addiction Medicine in the GCC</h2>

        <h3>1. Substance Use Disorders: Diagnosis and Pharmacotherapy</h3>
        <p>
          DSM-5-TR and ICD-11 classification of alcohol use disorder, opioid use disorder (OUD), stimulant use disorder,
          and cannabis use disorder form the diagnostic foundation. Pharmacotherapy CME must cover opioid agonist treatment
          (buprenorphine/naloxone, methadone where licensed), naltrexone for alcohol and OUD, acamprosate, and emerging
          agents. GCC-specific prescribing restrictions — particularly for opioid agonists, which vary significantly by
          country — are a mandatory competence area.
        </p>

        <h3>2. Dual Diagnosis and Psychiatric Co-morbidity</h3>
        <p>
          Co-occurring depression, anxiety disorders, PTSD, ADHD, and psychotic disorders are highly prevalent in
          addiction populations. CME addressing integrated treatment models, sequencing of pharmacotherapy, and
          evidence-based psychotherapy (CBT, motivational interviewing, contingency management) is strongly
          recommended across all GCC jurisdictions.
        </p>

        <h3>3. GCC Mental Health and Narcotic Legislation</h3>
        <p>
          Each GCC country has distinct legislation governing substance-related offences and the clinical management
          of patients with substance use disorders:
        </p>
        <ul>
          <li><strong>Qatar:</strong> Law No. 2 of 2011 on Combating Drugs and Psychotropic Substances; treatment
          courts and diversion programmes are expanding.</li>
          <li><strong>Saudi Arabia:</strong> Anti-Narcotics Law; mandatory reporting obligations and designated
          treatment facilities under the Drug Control General Directorate.</li>
          <li><strong>UAE:</strong> Federal Law No. 14 of 1995 (amended); the Abu Dhabi Judicial Department and
          Dubai courts operate drug rehabilitation programmes with clinical referral pathways.</li>
          <li><strong>Kuwait, Bahrain, Oman:</strong> National narcotics laws include provisions for voluntary
          treatment admission; forced treatment remains available in some jurisdictions.</li>
        </ul>
        <p>
          Practitioners should include at least one annual CPD activity covering the current legal framework
          applicable to their country of practice.
        </p>

        <h3>4. Harm Reduction and Public Health Approaches</h3>
        <p>
          Harm reduction is an evolving area in the GCC. While needle exchange and supervised consumption are
          not available, naloxone training, overdose prevention education, and in-patient detoxification
          protocols are gaining traction. CPD covering evidence-based harm reduction frameworks — including
          the WHO guidelines on management of substance use disorders — prepares clinicians to advocate for
          evidence-based policy while operating within their local context.
        </p>

        <h3>5. Addiction in Specific Populations</h3>
        <p>
          The GCC healthcare workforce serves a uniquely diverse expatriate population alongside national
          communities. Addiction presentation patterns vary by national origin, religious background, and
          occupational context. CME addressing cultural competency in addiction counselling, gender-sensitive
          treatment approaches for women with substance use disorders, and workplace-related substance misuse
          (particularly in high-pressure expatriate professional environments) strengthens clinical practice.
        </p>

        <h2>Category Requirements and Credit Distribution</h2>

        <p>
          Under most GCC frameworks, addiction medicine CPD falls predominantly into psychiatric or internal
          medicine categories, depending on the specialist's base qualification:
        </p>

        <ul>
          <li><strong>Conferences (Category A / Category 1):</strong> Regional psychiatry and addiction conferences
          — Arab Board-recognised events, the World Psychiatry Association regional meetings, and the International
          Society of Addiction Medicine (ISAM) conference — generate the highest per-event credit yield.</li>
          <li><strong>Online learning (Category B / Category 2):</strong> UpToDate, PsychOnline, the ASAM
          eLearning platform, and WHO Training Package on Substance Use Disorders are widely accepted.
          Most GCC authorities cap online credits at 30–50% of the total requirement.</li>
          <li><strong>Journal reading and publications (Category C):</strong> Addiction, Drug and Alcohol
          Dependence, the Journal of Substance Abuse Treatment, and the American Journal on Addictions
          are the primary peer-reviewed sources. Publications and case presentations generate academic credits
          under SCFHS and QCHP frameworks.</li>
          <li><strong>Teaching and supervision (Category D):</strong> Supervising addiction medicine trainees,
          delivering grand rounds, and contributing to institutional training programmes generate teaching credits.</li>
        </ul>

        <h2>Recommended Conferences for Addiction Medicine CME in the GCC</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Conference</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Organiser</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Region</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Typical Credits</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Arab Psychiatry Congress", "Arab Federation of Psychiatrists", "GCC / MENA", "8–12"],
              ["ISAM Annual Conference", "Int'l Society of Addiction Medicine", "International", "10–16"],
              ["Gulf Mental Health Forum", "Various / MOH-hosted", "GCC rotating", "6–10"],
              ["ASAM Annual Conference", "American Society of Addiction Medicine", "USA (online access)", "15–20"],
              ["WPA World Congress of Psychiatry", "World Psychiatry Association", "International", "12–18"],
            ].map(([conf, org, region, credits], i) => (
              <tr key={conf} style={{ background: i % 2 === 1 ? "#f8fafc" : undefined }}>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", fontWeight: 600 }}>{conf}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{org}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{region}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{credits}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Building an Addiction Medicine CPD Portfolio for GCC Revalidation</h2>

        <p>
          A strong addiction medicine CPD portfolio for GCC renewal includes evidence across five domains:
        </p>
        <ol>
          <li><strong>Clinical learning:</strong> At least one addiction-specific conference or accredited workshop per cycle.</li>
          <li><strong>Self-directed learning:</strong> Online modules covering current pharmacotherapy and diagnostic criteria.</li>
          <li><strong>Quality improvement:</strong> Audit of prescribing practice, outcome tracking in your addiction unit, or case review.</li>
          <li><strong>Patient safety:</strong> Overdose recognition, naloxone administration, and safe opioid prescribing modules (mandatory for most GCC renewal pathways).</li>
          <li><strong>Reflective practice:</strong> Written reflection on a challenging case or a significant event in your clinical practice — increasingly required by GMC and AHPRA for revalidation and accepted as evidence by QCHP.</li>
        </ol>

        <p>
          Hayya Med Pro tracks your credits across all five categories, flags upcoming deadlines, and generates
          a PDF compliance portfolio ready for authority submission. The Reflection Journal feature helps you
          document reflective practice entries linked to individual CME activities — critical for GMC and
          AHPRA revalidation.
        </p>

        <blockquote>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does
          not replace official licensing authorities. Users must verify final requirements with their relevant
          regulatory body.
        </blockquote>
      </BlogPostLayout>
    </>
  );
}

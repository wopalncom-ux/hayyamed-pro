import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sleep Medicine CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for sleep medicine specialists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: obstructive sleep apnoea CPD, polysomnography interpretation, CPAP titration, chronobiology, and sleep conferences recognized in the GCC.",
  openGraph: {
    title: "Sleep Medicine CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description:
      "CME guide for sleep medicine practitioners in GCC countries: credit requirements, OSA management, polysomnography CPD, paediatric sleep disorders, and GCC sleep medicine conferences.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Sleep Medicine CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Sleep Medicine CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Sleep medicine in the GCC faces a dual challenge: the region has among the highest prevalence rates of obstructive sleep apnoea globally, driven by obesity, metabolic syndrome, and lifestyle factors — while specialist sleep medicine services remain relatively under-developed compared to demand."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={7}
      >
        <h2>GCC Sleep Medicine CME Requirements by Authority</h2>

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
          Sleep medicine specialists in the GCC typically hold primary qualifications in pulmonology, neurology,
          internal medicine, or psychiatry, with sleep as a sub-specialty focus. CME requirements are governed
          by the base specialty registration — but the content of CPD portfolios should reflect the full scope
          of sleep medicine practice, including technical interpretation, device management, and multi-disciplinary
          collaboration.
        </p>

        <h2>Priority CME Topics for Sleep Medicine in the GCC</h2>

        <h3>1. Obstructive Sleep Apnoea: Diagnosis, Severity Classification, and Management</h3>
        <p>
          OSA prevalence in the GCC is estimated at 15–25% of the adult population, substantially higher than
          global averages, correlating with the region's elevated rates of obesity and type 2 diabetes.
          CME must cover the updated AASM and ESRS diagnostic criteria, AHI and RDI interpretation,
          home sleep apnoea testing (HSAT) versus polysomnography selection criteria, CPAP titration protocols,
          auto-titrating CPAP, bilevel PAP, and adaptive servo-ventilation. Long-term adherence monitoring and
          follow-up pathways are increasingly emphasised in accreditation curricula.
        </p>

        <h3>2. Polysomnography Interpretation and Sleep Staging</h3>
        <p>
          Technical competence in PSG scoring — sleep staging per AASM 2.6 rules, respiratory event scoring,
          limb movement scoring, cardiac arrhythmia recognition, and PAP titration studies — is a core
          competency for sleep medicine practitioners. Annual updates to AASM scoring rules and signal acquisition
          standards appear regularly in CME curricula from the American Academy of Sleep Medicine and the
          European Sleep Research Society.
        </p>

        <h3>3. Insomnia: CBT-I and Pharmacological Management</h3>
        <p>
          Cognitive behavioural therapy for insomnia (CBT-I) is the first-line treatment for chronic insomnia
          per AASM, NICE, and European guidelines. Pharmacological options — eszopiclone, zolpidem, suvorexant,
          lemborexant, doxepin — and their regulatory availability in GCC countries vary. CME should cover the
          latest evidence for dual orexin receptor antagonists, appropriate sedative prescribing in older adults,
          and the integration of digital CBT-I tools available to GCC patients.
        </p>

        <h3>4. Narcolepsy and Central Disorders of Hypersomnolence</h3>
        <p>
          Narcolepsy type 1 (with cataplexy) and type 2, idiopathic hypersomnia, Kleine-Levin syndrome, and
          hypersomnolence due to medical conditions represent a diagnostically challenging group. CME covering
          the MSLT protocol, hypocretin-1 CSF measurement, and current pharmacotherapy (modafinil, sodium
          oxybate, pitolisant — availability and narcotics scheduling differ across GCC states) is essential.
        </p>

        <h3>5. Paediatric Sleep Medicine</h3>
        <p>
          Paediatric OSA, behavioural insomnia of childhood, circadian rhythm sleep-wake disorders in adolescents,
          and sleep-disordered breathing in children with craniofacial anomalies or neurodevelopmental conditions
          represent a growing referral burden across GCC tertiary centres. CME covering AASM paediatric scoring
          rules, adenotonsillectomy outcomes, and non-PAP therapies for children is increasingly expected in
          academic sleep medicine portfolios.
        </p>

        <h3>6. Circadian Rhythm Sleep-Wake Disorders</h3>
        <p>
          The GCC's extreme temperature cycle, Ramadan fasting period (with documented circadian disruption),
          and high proportion of shift-working expatriate populations create a uniquely relevant context for
          circadian medicine. CME covering light therapy, melatonin use, chronotherapy, and occupational
          health approaches to shift work disorder prepares clinicians for a substantial patient population.
        </p>

        <h2>Top Sleep Medicine CME Events for GCC Practitioners</h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Event</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Organiser</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Format</th>
              <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Typical Credits</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["SLEEP Annual Meeting", "AASM / SLEEP Research Society", "In-person + online", "15–22"],
              ["European Sleep Congress", "European Sleep Research Society", "In-person", "12–18"],
              ["CHEST Annual Meeting", "American College of Chest Physicians", "In-person + online", "12–20"],
              ["Arab Thoracic Society Congress", "Arab Thoracic Society", "GCC / MENA", "8–14"],
              ["Gulf Chest Disease Conference", "Gulf Chest Disease Society", "GCC rotating", "6–10"],
            ].map(([event, org, format, credits], i) => (
              <tr key={event} style={{ background: i % 2 === 1 ? "#f8fafc" : undefined }}>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0", fontWeight: 600 }}>{event}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{org}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{format}</td>
                <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>{credits}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Online CME Resources for Sleep Medicine</h2>

        <p>
          The AASM offers a comprehensive learning management system — AASM Sleep Education — with CME modules
          covering all core sleep medicine competencies. ResMed University and Philips Respironics both provide
          device-specific education accepted for CPD credit in many GCC jurisdictions. UpToDate maintains
          up-to-date evidence summaries for sleep medicine that count toward self-directed learning credits.
          The ESRS offers e-learning modules with ESR accreditation.
        </p>

        <h2>Tracking Sleep Medicine CME with Hayya Med Pro</h2>

        <p>
          Sleep medicine practitioners in the GCC often hold dual registrations — for example, under QCHP as
          a pulmonologist and under a home-country authority. Hayya Med Pro supports multi-jurisdiction wallets,
          allowing you to track credits separately for each licensing authority and monitor compliance status
          in real time. The AI Learning Pathway feature generates a customised 12-month CPD plan calibrated
          to your specific gaps and renewal deadline.
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

import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Addiction Psychiatrist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for addiction psychiatrists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, opioid use disorder, substance use in GCC context, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Addiction Psychiatrist CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for addiction psychiatrists and addiction medicine specialists practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Addiction Psychiatrist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Addiction Psychiatrist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Addiction psychiatry is practised within a distinctive legal and cultural framework across the GCC. While alcohol and many substances are legally prohibited across most of the region, substance use disorders — including alcohol use disorder among non-Muslim expatriate populations, opioid use disorder, stimulant use (captagon, methamphetamine), and prescription drug misuse — are recognised public health challenges. GCC addiction psychiatrists must maintain CME that reflects both international clinical evidence and the region&apos;s specific substance use epidemiology, legal context, and available treatment modalities."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={9}
      >
        <h2>GCC Addiction Psychiatrist CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year; NHMC addiction services"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Psychiatry board; addiction medicine subspecialty"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "Annual reporting; National Rehabilitation Centre context"],
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

        <h2>Addiction Psychiatry in the GCC: A Sensitive Specialty</h2>
        <p>The GCC&apos;s substance use disorder landscape is shaped by strict legal frameworks alongside a high-volume expatriate workforce with access to varied substances. Qatar&apos;s National Mental Health Service — including its addiction treatment unit at Rumailah Hospital — operates within the MOPH&apos;s Mental Health Strategy, which explicitly addresses substance use disorder as a treatable medical condition. Saudi Arabia&apos;s National Mental Health Programme includes addiction medicine services at psychiatric hospitals in Riyadh, Jeddah, and Dammam; the SCFHS has recognised addiction medicine as a subspecialty. The UAE&apos;s National Rehabilitation Centre (NRC) in Abu Dhabi is the flagship regional addiction treatment facility — a reference centre that sets standards for the entire GCC. Captagon (fenethylline) use — predominantly in Saudi Arabia and the Levant — and pharmaceutical opioid misuse (tramadol, codeine, fentanyl patches) are the GCC-specific substances that addiction psychiatrists must be current on.</p>

        <h2>Key CME Topics for Addiction Psychiatrists</h2>
        <ul>
          <li><strong>Opioid use disorder (OUD)</strong> — buprenorphine-naloxone (Suboxone) maintenance, methadone programmes (where available), extended-release naltrexone, GCC OUD treatment access and regulatory landscape</li>
          <li><strong>Alcohol use disorder (AUD)</strong> — CIWA-Ar protocol, benzodiazepine-managed withdrawal, acamprosate, naltrexone, disulfiram — management in GCC hospitals treating non-Muslim expatriate patients</li>
          <li><strong>Stimulant use disorders</strong> — captagon (fenethylline) neuropharmacology and withdrawal, methamphetamine use disorder, GCC-specific epidemiology, contingency management evidence</li>
          <li><strong>Cannabis use disorder</strong> — increasing prevalence across GCC expatriate populations, DSM-5-TR criteria, cognitive-behavioural therapy (CBT) as first-line</li>
          <li><strong>Prescription drug misuse</strong> — tramadol misuse (high prevalence across South Asian expatriate populations), benzodiazepine dependence management, codeine/promethazine misuse</li>
          <li><strong>Dual diagnosis</strong> — comorbid substance use and depression, PTSD and alcohol use disorder, psychosis and cannabis — integrated treatment models</li>
          <li><strong>Motivational interviewing (MI)</strong> — evidence base update, MI in brief intervention settings, FRAMES model in GCC cultural contexts</li>
          <li><strong>Harm reduction</strong> — international evidence vs GCC legal and regulatory context, naloxone access for opioid overdose reversal, needle exchange considerations</li>
          <li><strong>Adolescent substance use</strong> — vaping/nicotine use disorder in GCC adolescents (high prevalence), gaming disorder (ICD-11 classification), early intervention evidence</li>
          <li><strong>Gambling disorder</strong> — ICD-11 classification, prevalence in online gambling contexts, treatment models — relevant for GCC professionals who see patients from higher-risk populations</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>International Society of Addiction Medicine (ISAM) World Congress</li>
          <li>American Society of Addiction Medicine (ASAM) Annual Conference</li>
          <li>European Federation of Addiction Societies (EUFAS) Congress</li>
          <li>World Psychiatric Association (WPA) — Addiction Psychiatry section</li>
          <li>Arab Society of Addiction Medicine — GCC authority credited</li>
          <li>Saudi Psychiatry Association Annual Meeting — SCFHS credited, addiction medicine track</li>
          <li>UAE National Rehabilitation Centre Symposium — DHA and DOH credited</li>
        </ul>

        <h2>Buprenorphine Prescribing in the GCC: A Rapidly Changing Landscape</h2>
        <p>Buprenorphine-naloxone for opioid use disorder maintenance has been available in Qatar and some UAE facilities for several years; Saudi Arabia&apos;s approval and rollout has been more gradual under SFDA oversight. Addiction psychiatrists must maintain current CME on buprenorphine induction, dosing, drug-drug interactions (particularly with benzodiazepines), and the management of precipitated withdrawal. QCHP accepts international conference presentations and online accredited modules covering OUD pharmacotherapy as formal CPD hours. The CME requirements in this area are non-negotiable for practitioners seeking hospital credentialing in addiction medicine roles.</p>

        <h2>Track Your Addiction Psychiatry CME</h2>
        <p>Hayya Med Pro tracks CME credits per GCC authority and per renewal cycle with automated gap analysis. Upload ISAM, ASAM, and GCC society certificates alongside hospital-based grand round certificates — all stored securely and searchable by category for renewal submissions.</p>

        <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}

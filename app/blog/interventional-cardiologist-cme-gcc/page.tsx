import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interventional Cardiologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide",
  description:
    "CME requirements for interventional cardiologists in Qatar, Saudi Arabia, UAE, Kuwait, Bahrain, and Oman: credit totals, cath lab credentialing, structural heart training, accepted conferences, and renewal timelines.",
  openGraph: {
    title: "Interventional Cardiologist CME GCC 2026 — QCHP, SCFHS, DHA Guide",
    description: "A complete guide to CME and CPD requirements for interventional cardiologists practising in the GCC.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Interventional Cardiologist CME Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Interventional Cardiologist CME Requirements in the GCC 2026 — QCHP, SCFHS, DHA Guide"
        description="Interventional cardiology is one of the most procedurally intensive specialties in GCC hospitals. Cardiologists performing PCI, TAVR, and structural heart interventions must maintain rigorous CME compliance alongside their procedural credentialing."
        category="specialty"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Interventional Cardiologist CME Requirements by Authority</h2>

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
              ["QCHP / DHP-AS", "Qatar", "80 CPD", "2 years", "40/year; Hamad Heart Centre recognised"],
              ["SCFHS", "Saudi Arabia", "40–60 CME", "1–3 years", "Cardiology specialty board track"],
              ["DHA", "UAE (Dubai)", "40 CME", "2 years", "Annual reporting"],
              ["DOH", "UAE (Abu Dhabi)", "30–50 CPD", "1–2 years", "Cleveland Clinic Abu Dhabi affiliated"],
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

        <h2>Why CME Is Critical for Interventional Cardiologists</h2>
        <p>Interventional cardiology evolves faster than almost any other specialty — TAVR indications now include low-risk patients, MitraClip and Tendyne expand structural heart options, and coronary physiology-guided PCI has become standard practice. GCC facilities performing structural heart interventions require their interventional cardiologists to demonstrate training currency both through CME credits and through documented procedural volumes. JCI hospital standards require credential files to include relevant CME alongside case logs.</p>

        <h2>Key CME Topics for Interventional Cardiologists</h2>
        <ul>
          <li><strong>Percutaneous coronary intervention (PCI)</strong> — complex PCI, chronic total occlusion (CTO), bifurcation techniques, intravascular imaging-guided PCI</li>
          <li><strong>TAVR and structural heart</strong> — transcatheter mitral and tricuspid interventions, left atrial appendage occlusion, ASD/PFO closure</li>
          <li><strong>Coronary physiology</strong> — FFR, iFR, non-hyperaemic pressure ratios in clinical decision-making</li>
          <li><strong>Intravascular imaging</strong> — IVUS, OCT — guidance, optimisation, and complication assessment</li>
          <li><strong>Shock and haemodynamic support</strong> — IABP, Impella, ECMO in acute MI and cardiogenic shock</li>
          <li><strong>Radiation safety</strong> — mandatory for cath lab operators in most GCC facilities; dose reduction strategies</li>
          <li><strong>Antithrombotic therapy</strong> — DAPT duration, P2Y12 switching, anticoagulation in complex PCI</li>
          <li><strong>Cardiac imaging integration</strong> — CT angiography planning for structural procedures, TAVI sizing</li>
        </ul>

        <h2>Accepted Conferences</h2>
        <ul>
          <li>EuroPCR (Paris) — primary interventional cardiology meeting</li>
          <li>Transcatheter Cardiovascular Therapeutics (TCT)</li>
          <li>American College of Cardiology (ACC) Annual Scientific Session</li>
          <li>Gulf Cardiovascular Congress — GCC-credited</li>
          <li>Arab Heart Congress — QCHP and SCFHS recognised</li>
          <li>Saudi Heart Association Annual Meeting</li>
        </ul>

        <h2>Radiation Safety CME Requirements</h2>
        <p>All GCC facilities with cardiac catheterisation laboratories require their operators to hold current radiation protection training. Most GCC licensing authorities accept formal radiation safety courses from internationally recognised providers. This should be documented separately in your credentials file. Qatar Health, DHA, and SCFHS all review radiation protection training during facility accreditation inspections.</p>

        <h2>Track Your Interventional Cardiology CME</h2>
        <p>Hayya Med Pro tracks CME per country and per cycle with automated gap analysis. Upload your conference certificates and course completions — they&apos;re stored securely with signed URL access.</p>

        <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verify requirements with QCHP, SCFHS, DHA, or the relevant GCC regulatory body.
        </p>
      </BlogPostLayout>
    </>
  );
}

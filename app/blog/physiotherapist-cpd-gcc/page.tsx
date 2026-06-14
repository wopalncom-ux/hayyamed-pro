import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Physiotherapist CPD Requirements in the GCC 2026 — QCHP, DHA, SCFHS Guide",
  description:
    "CPD requirements for physiotherapists in Qatar, UAE, Saudi Arabia, Bahrain, Kuwait, and Oman: per-authority credit requirements, specialty CPD (sports physiotherapy, neurological rehab, MSK, pediatrics), international qualifications recognition, and top physiotherapy CPD platforms for GCC compliance.",
  openGraph: {
    title: "Physiotherapist CPD GCC 2026 — QCHP, DHA, SCFHS Guide",
    description:
      "Complete CPD guide for physiotherapists practicing in the GCC: per-authority credit requirements, MSK and sports physio CPD priorities, MCSP and APTA recognition in the GCC, and the best online CPD sources for physiotherapy license renewal.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Physiotherapist CPD Requirements in the GCC 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
  description: "CPD requirements for physiotherapists across GCC authorities in 2026.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD hours do physiotherapists need in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Physiotherapists in Qatar must complete 80 CPD credits per 2-year renewal cycle under QCHP. This equates to a minimum of 40 CPD credits per year.",
      },
    },
    {
      "@type": "Question",
      name: "Is the MCSP qualification recognized in the GCC for physiotherapists?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. MCSP (Member of the Chartered Society of Physiotherapy, UK) is recognized by QCHP, DHA, DOH, and SCFHS as meeting the physiotherapy qualification standard for GCC licensing.",
      },
    },
    {
      "@type": "Question",
      name: "Do online CPD platforms count for physiotherapist license renewal in the GCC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Online CPD from accredited providers is accepted by GCC authorities. Platforms with WCPT (World Confederation of Physical Therapy) affiliated national member organization accreditation, or with recognized international accreditation, are accepted for physiotherapy CPD in most GCC countries.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <BlogPostLayout
        title="Physiotherapist CPD Requirements in the GCC 2026 — QCHP, DHA, SCFHS Guide"
        description="Physiotherapy is one of the largest allied health professional groups in GCC healthcare systems. From sports rehabilitation at major sports events to neurological rehab at specialist centres, GCC physiotherapists need a structured CPD approach to maintain licensure while managing demanding clinical workloads."
        category="profession"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={8}
      >
        <h2>GCC Physiotherapist CPD Requirements by Authority</h2>

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
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>QCHP</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Qatar</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>80 (40/year)</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>CPD</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>SCFHS</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Saudi Arabia</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40–60</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Per renewal</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>CME</td>
            </tr>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>DHA</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Dubai</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>CPD</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>DOH</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Abu Dhabi</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>30–50</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>1–2 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>CPD</td>
            </tr>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>NHRA</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Bahrain</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>CPD</td>
            </tr>
            <tr style={{ background: "#f8fafc" }}>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>MOH Kuwait</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Kuwait</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>30</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Annual</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>CME</td>
            </tr>
            <tr>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>OMSB</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>Oman</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>40</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>2 years</td>
              <td style={{ padding: "0.75rem", border: "1px solid #e2e8f0" }}>CME</td>
            </tr>
          </tbody>
        </table>

        <h2>Physiotherapy Specialty CPD Priorities in the GCC</h2>

        <h3>Musculoskeletal (MSK) Physiotherapy</h3>
        <p>
          MSK physiotherapy is the highest-volume physiotherapy specialty in GCC
          healthcare, driven by high rates of occupational injuries, sports injuries,
          and degenerative joint disease:
        </p>
        <ul>
          <li>Manual therapy techniques — McKenzie, Maitland, Mulligan updates</li>
          <li>ACL rehabilitation protocols — return-to-sport criteria, functional testing</li>
          <li>Low back pain management — updated clinical practice guidelines (avoiding over-imaging)</li>
          <li>Post-joint replacement rehabilitation — TKR, THR, shoulder arthroplasty</li>
          <li>Dry needling / trigger point therapy — certification and regulation varies by GCC country</li>
        </ul>

        <h3>Sports Physiotherapy</h3>
        <p>
          Sports physiotherapy has grown significantly in the GCC with Qatar hosting FIFA
          World Cup 2022, UAE hosting major athletics events, and Saudi Arabia&apos;s expanding
          sports sector under Vision 2030. CPD priorities:
        </p>
        <ul>
          <li>FIFA 11+ injury prevention program — implementation and evidence updates</li>
          <li>Concussion management — SCAT5 assessment, graduated return-to-play protocols</li>
          <li>Load monitoring and overuse injury prevention</li>
          <li>Sports cardiology — sudden cardiac death screening protocols for athletes</li>
          <li>Elite athlete performance optimization — recovery, nutrition interface with physiotherapy</li>
        </ul>

        <h3>Neurological Rehabilitation</h3>
        <ul>
          <li>Stroke rehabilitation — early mobilization, constraint-induced movement therapy (CIMT)</li>
          <li>Neuroplasticity-based rehabilitation approaches</li>
          <li>Parkinson&apos;s disease physiotherapy — LSVT BIG certification</li>
          <li>Spinal cord injury rehabilitation — functional electrical stimulation, exoskeleton-assisted walking</li>
          <li>Multiple sclerosis management — fatigue, balance, falls prevention</li>
        </ul>

        <h3>Respiratory Physiotherapy</h3>
        <ul>
          <li>ICU physiotherapy — ventilator weaning, early rehabilitation</li>
          <li>COPD pulmonary rehabilitation programs</li>
          <li>Cystic fibrosis airway clearance techniques</li>
          <li>Post-COVID-19 respiratory rehabilitation</li>
        </ul>

        <h3>Paediatric Physiotherapy</h3>
        <ul>
          <li>Cerebral palsy management — Bobath/NDT certification</li>
          <li>Developmental physiotherapy — gross motor assessment (GMFM)</li>
          <li>Torticollis and plagiocephaly management</li>
          <li>Paediatric sports injury management</li>
        </ul>

        <h2>Best Online CPD Platforms for GCC Physiotherapists</h2>

        <h3>Physio-pedia (Physiopedia)</h3>
        <p>
          Physiopedia Plus offers CPD certificates for online physiotherapy learning modules.
          Widely used by GCC physiotherapists; content covers MSK, neurological, cardiorespiratory,
          and paediatric physiotherapy. WCPT-affiliate accredited content is accepted by GCC
          licensing authorities.
        </p>

        <h3>IFOMPT and National Member Organization CPD</h3>
        <p>
          For musculoskeletal physiotherapists, IFOMPT (International Federation of Orthopaedic
          Manipulative Physical Therapists) recognized courses are accepted by GCC authorities.
          MACP (Manipulative Association of Chartered Physiotherapists, UK) courses are
          recognized in particular.
        </p>

        <h3>WCPT (World Confederation for Physical Therapy)</h3>
        <p>
          WCPT-affiliated national member organization CPD — including CSP (UK), APTA (USA),
          APA (Australia) — is the standard accreditation reference for GCC physiotherapy
          licensing authorities. CPD from WCPT member organizations is accepted across all GCC.
        </p>

        <h3>Conferences for GCC Physiotherapy CPD</h3>
        <ul>
          <li>Gulf Physiotherapy Conference — regional, DHA/QCHP-accredited, GCC-relevant content</li>
          <li>WCPT World Congress — quadrennial; internationally recognized credits</li>
          <li>CSP Annual Conference UK — generates CPD accepted by QCHP, DHA</li>
          <li>Arab Health Allied Health sessions — DHA-accredited sessions at Dubai annual event</li>
        </ul>

        <h2>MCSP and APTA Recognition in the GCC</h2>
        <ul>
          <li>
            <strong>MCSP (Member of the Chartered Society of Physiotherapy, UK):</strong>
            Recognized by QCHP, DHA, DOH, and SCFHS as the standard UK physiotherapy qualification.
            The most common qualification among UK-trained GCC physiotherapists.
          </li>
          <li>
            <strong>APTA Certified Clinical Specialist (e.g., OCS, SCS, NCS):</strong>
            American clinical specialty certifications are recognized as specialty qualifications
            by GCC authorities for credentialing purposes. CPD activities for recertification
            overlap with GCC renewal requirements.
          </li>
          <li>
            <strong>Australian APA membership:</strong> Recognized by GCC authorities as
            meeting qualification standards for Australian-trained physiotherapists.
          </li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> Physiotherapist CPD requirements vary by licensing
          authority, specialty classification, and renewal cycle. Verify current requirements
          directly with QCHP, DHA, DOH, SCFHS, NHRA, MOH Kuwait, or OMSB before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}

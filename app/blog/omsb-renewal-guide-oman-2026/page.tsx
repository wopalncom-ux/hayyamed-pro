import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMSB License Renewal Guide 2026 — Oman Medical Specialty Board CME Requirements",
  description:
    "Step-by-step guide to renewing your OMSB license in 2026: CME credit requirements, accepted accreditors, how to submit CME to the Oman Medical Specialty Board, common renewal pitfalls, and how to manage multi-country GCC license renewals alongside OMSB.",
  openGraph: {
    title: "OMSB Renewal Guide 2026 — Oman License CME Requirements",
    description:
      "Complete guide to OMSB license renewal in Oman: 40 CME credits per 2-year cycle, accepted providers, submission process, and tips for healthcare professionals managing renewal alongside QCHP or SCFHS licenses.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "OMSB License Renewal Guide 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
  description: "Step-by-step OMSB license renewal guide for Oman in 2026.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CME credits do I need for OMSB renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Oman Medical Specialty Board (OMSB) requires 40 CME credits per 2-year renewal cycle for licensed healthcare professionals in Oman.",
      },
    },
    {
      "@type": "Question",
      name: "What accreditors does OMSB accept for CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OMSB accepts CME from internationally recognized accreditors including EACCME (European Accreditation Council for CME), AMA PRA Category 1 (USA), ANCC (for nursing CE), and OMSB-directly accredited Omani CME providers.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use the same CME certificates for both OMSB and QCHP renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. CME certificates from international conferences (AAO, ESC, AAD, etc.) can be submitted to both OMSB and QCHP portals separately. Save your original certificates in digital form and upload them to each portal independently.",
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
        title="OMSB License Renewal Guide 2026 — Oman Medical Specialty Board CME Requirements"
        description="The Oman Medical Specialty Board (OMSB) is the licensing authority for healthcare professionals in the Sultanate of Oman. This guide covers everything you need to know for your 2026 OMSB renewal — from credit requirements to submission process."
        category="guide"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={7}
      >
        <h2>OMSB at a Glance</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <tbody>
            {[
              ["Authority", "Oman Medical Specialty Board (OMSB)"],
              ["CME term", "CME (Continuing Medical Education)"],
              ["Required credits", "40 CME credits"],
              ["Renewal cycle", "2 years"],
              ["License validity", "2 years from issue"],
              ["Accepted accreditors", "EACCME, AMA PRA Category 1, ANCC, OMSB-accredited providers"],
            ].map(([label, value]) => (
              <tr key={label}>
                <td style={{ padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0", fontWeight: 600, background: "#f8fafc", width: "40%" }}>{label}</td>
                <td style={{ padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Who Needs OMSB Renewal?</h2>
        <p>
          All healthcare professionals licensed to practice in the Sultanate of Oman
          (physicians, surgeons, dentists, pharmacists, nurses, allied health professionals)
          are issued OMSB licenses and must complete renewal every 2 years.
        </p>
        <p>
          Oman&apos;s healthcare workforce is significantly comprised of expatriate professionals
          from India, Pakistan, Philippines, UK, Egypt, and Jordan — all of whom hold OMSB
          licenses and must meet the same CME requirements as Omani nationals.
        </p>

        <h2>CME Credit Requirements</h2>
        <p>
          OMSB requires <strong>40 CME credits per 2-year renewal cycle</strong> for all
          licensed healthcare professionals. There are no mandatory category splits for most
          professionals — the 40 credits may come from any combination of:
        </p>
        <ul>
          <li>Scientific conferences and congresses</li>
          <li>Workshops and training courses</li>
          <li>Online/e-learning CME modules</li>
          <li>In-hospital CME sessions (if accredited by OMSB-recognized provider)</li>
          <li>Teaching and presenting at accredited events</li>
          <li>Self-directed learning (journal reading — capped at limited credits)</li>
        </ul>
        <p>
          <strong>20 credits per year minimum:</strong> While the cycle is 2 years, OMSB
          recommends a minimum of 20 credits per year to avoid accumulating a backlog in
          the renewal year.
        </p>

        <h2>Accepted CME Providers and Accreditors</h2>

        <h3>International Accreditors Recognized by OMSB</h3>
        <ul>
          <li><strong>EACCME</strong> — European Accreditation Council for Continuing Medical Education; European conference CME</li>
          <li><strong>AMA PRA Category 1</strong> — American Medical Association; North American conference and online CME</li>
          <li><strong>ANCC</strong> — American Nurses Credentialing Center; nursing-specific CE</li>
          <li><strong>Royal College of Physicians and Surgeons of Canada</strong> — RCPSC-accredited events</li>
          <li><strong>CPD UK</strong> — CPD-certified activities from UK providers</li>
        </ul>

        <h3>Domestic Omani CME Providers</h3>
        <ul>
          <li>OMSB-accredited Omani medical associations and specialty societies</li>
          <li>Royal Hospital Muscat CME department</li>
          <li>Sultan Qaboos University Hospital education programmes</li>
          <li>Oman Medical Association (OMA) accredited events</li>
        </ul>

        <h2>Step-by-Step OMSB Renewal Process</h2>
        <ol>
          <li>
            <strong>Track your CME throughout the cycle:</strong> Do not wait until the
            renewal month. Use a CME tracking platform to log activities as they occur.
            Keep original certificates in a digital folder for each 2-year cycle.
          </li>
          <li>
            <strong>Access the OMSB eServices portal:</strong> OMSB renewal applications
            are submitted through the OMSB eServices platform. Ensure your login credentials
            are current and your Omani residence visa/work permit is valid.
          </li>
          <li>
            <strong>Submit CME activities:</strong> Log all CME activities with:
            <ul>
              <li>Activity title</li>
              <li>Date and location</li>
              <li>Accrediting body</li>
              <li>Credits awarded</li>
              <li>Certificate upload (PDF or JPG)</li>
            </ul>
          </li>
          <li>
            <strong>Confirm 40-credit threshold:</strong> The portal displays a running
            total. Do not submit renewal until all 40 credits are confirmed as verified.
          </li>
          <li>
            <strong>Submit renewal application:</strong> Complete the renewal form, confirm
            personal and employment details, and pay the renewal fee.
          </li>
          <li>
            <strong>Receive renewed license:</strong> OMSB issues renewed licenses
            electronically. Processing time is typically 5–15 business days once CME
            is verified and payment confirmed.
          </li>
        </ol>

        <h2>Common OMSB Renewal Mistakes</h2>
        <ul>
          <li>
            <strong>Submitting activities too late:</strong> CME must be completed within
            the 2-year cycle, not in arrears. Activities completed outside the cycle period
            are not counted toward the renewal requirement.
          </li>
          <li>
            <strong>Non-accredited online courses:</strong> Not all online CE platforms are
            accepted by OMSB. Verify that online CME is from EACCME, ACCME, or ANCC-accredited
            providers before completing.
          </li>
          <li>
            <strong>Expired work visa during renewal:</strong> Your Omani residence visa
            must be valid at the time of renewal application. Coordinate license renewal
            timing with your work permit renewal.
          </li>
          <li>
            <strong>Name discrepancy:</strong> Your certificate name must match your OMSB
            license name exactly. Request corrections from conference organisers before
            submission.
          </li>
        </ul>

        <h2>Managing OMSB Alongside Other GCC Licenses</h2>
        <p>
          Many Omani-licensed professionals also hold QCHP (Qatar), SCFHS (Saudi Arabia),
          or DHA (Dubai) licenses. The same CME certificates can be submitted to multiple
          portals:
        </p>
        <ul>
          <li>Save certificates in cloud storage, organized by year</li>
          <li>Submit the same PDF to OMSB eServices, QCHP portal, and Mumaris+ (SCFHS) separately</li>
          <li>Note the different renewal cycle timing — QCHP is 2 years, SCFHS cycle varies by specialty</li>
          <li>Set calendar reminders 3 months before each authority&apos;s renewal deadline</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> OMSB license renewal requirements and processes are updated
          periodically. Verify current requirements directly with the Oman Medical Specialty Board
          before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}

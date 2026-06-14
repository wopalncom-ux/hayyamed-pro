import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NHRA License Renewal Guide 2026 — Bahrain CPD Requirements for Healthcare Professionals",
  description:
    "Complete guide to renewing your NHRA license in Bahrain in 2026: 40 CPD credits per 2-year cycle, accepted accreditors, the NHRA eServices renewal process, common rejection reasons, and how to manage Bahrain renewal alongside other GCC licenses.",
  openGraph: {
    title: "NHRA Renewal Guide 2026 — Bahrain Healthcare License CPD Requirements",
    description:
      "Step-by-step guide to NHRA license renewal in Bahrain: National Health Regulatory Authority CPD credit requirements, accepted providers, submission process, and tips for managing multi-country GCC renewal simultaneously.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "NHRA License Renewal Guide Bahrain 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
  description: "Step-by-step NHRA license renewal guide for Bahrain healthcare professionals in 2026.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do I need for NHRA renewal in Bahrain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The National Health Regulatory Authority (NHRA) of Bahrain requires 40 CPD credits per 2-year renewal cycle for all licensed healthcare professionals in Bahrain.",
      },
    },
    {
      "@type": "Question",
      name: "What is the NHRA eServices portal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The NHRA eServices portal is the official digital platform for submitting license renewal applications, CPD activity submissions, and requesting good standing certificates from the National Health Regulatory Authority of Bahrain.",
      },
    },
    {
      "@type": "Question",
      name: "Does NHRA accept online CPD certificates?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. NHRA accepts online CPD from internationally accredited providers including EACCME, AMA PRA Category 1, ANCC, and NHRA-directly accredited Bahraini providers. Verify accreditation before completing any online course.",
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
        title="NHRA License Renewal Guide 2026 — Bahrain CPD Requirements for Healthcare Professionals"
        description="The National Health Regulatory Authority (NHRA) of Bahrain regulates all healthcare professionals working in the Kingdom of Bahrain. Whether you are a physician at Salmaniya Medical Complex, a nurse at the American Mission Hospital, or a pharmacist at a private clinic, your license renewal goes through NHRA."
        category="guide"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={7}
      >
        <h2>NHRA at a Glance</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <tbody>
            {[
              ["Authority", "National Health Regulatory Authority (NHRA), Bahrain"],
              ["CPD term", "CPD (Continuing Professional Development)"],
              ["Required credits", "40 CPD credits"],
              ["Renewal cycle", "2 years"],
              ["License validity", "2 years from issue"],
              ["Accepted accreditors", "EACCME, AMA PRA Category 1, ANCC, NHRA-accredited Bahraini providers"],
            ].map(([label, value]) => (
              <tr key={label}>
                <td style={{ padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0", fontWeight: 600, background: "#f8fafc", width: "40%" }}>{label}</td>
                <td style={{ padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0" }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Who Needs NHRA Renewal?</h2>
        <p>
          All healthcare professionals licensed to practice in the Kingdom of Bahrain must
          hold a valid NHRA license and renew it every 2 years. This includes:
        </p>
        <ul>
          <li>Physicians and surgeons (all specialties)</li>
          <li>Dentists and dental specialists</li>
          <li>Pharmacists and pharmacy technicians</li>
          <li>Registered nurses and midwives</li>
          <li>Allied health professionals (physiotherapists, radiographers, laboratory staff)</li>
          <li>Healthcare managers and administrators (clinical roles)</li>
        </ul>
        <p>
          Bahrain&apos;s healthcare workforce includes a large proportion of expatriate professionals
          from India, Pakistan, Philippines, UK, Egypt, and Jordan — all subject to the same
          NHRA renewal requirements.
        </p>

        <h2>CPD Credit Requirements</h2>
        <p>
          NHRA requires <strong>40 CPD credits per 2-year renewal cycle</strong>. There is
          no mandatory category split for most healthcare professions — credits may come from:
        </p>
        <ul>
          <li>Scientific conferences and congresses (domestic and international)</li>
          <li>Workshops and hands-on training courses</li>
          <li>Online/e-learning modules from accredited providers</li>
          <li>In-hospital education and grand rounds (NHRA/JCI-recognized)</li>
          <li>Teaching and presenting at accredited events</li>
          <li>Journal reading (self-directed — capped, verify current limits with NHRA)</li>
        </ul>

        <h2>NHRA eServices Portal — License Renewal Process</h2>

        <h3>Step 1 — Access the NHRA eServices Portal</h3>
        <p>
          The NHRA eServices platform is the only accepted channel for license renewal applications.
          Log in with your NHRA credentials. Ensure your CPR (Central Population Registry)
          number and contact details are current.
        </p>

        <h3>Step 2 — Submit CPD Activities</h3>
        <p>
          Navigate to the CPD section and add your activities. For each activity provide:
        </p>
        <ul>
          <li>Activity title (as shown on certificate)</li>
          <li>Provider/organizer name</li>
          <li>Activity dates</li>
          <li>Credits awarded</li>
          <li>Accrediting body name</li>
          <li>Certificate upload (PDF or JPG)</li>
        </ul>

        <h3>Step 3 — Verify CPD Balance</h3>
        <p>
          The NHRA portal shows your running CPD total. Verify that all submitted activities
          show as approved/verified before submitting the renewal application. NHRA reviews
          submitted activities; verification typically takes 3–10 business days.
        </p>

        <h3>Step 4 — Submit Renewal Application</h3>
        <p>
          Once 40 CPD credits are verified, complete the renewal form: confirm personal data,
          employer details, and specialty. Pay the renewal fee online via debit/credit card.
          NHRA licenses are issued electronically.
        </p>

        <h2>Accepted International CPD Accreditors</h2>
        <ul>
          <li><strong>EACCME</strong> — European Accreditation Council for Continuing Medical Education. Most European specialist society conferences.</li>
          <li><strong>AMA PRA Category 1</strong> — American Medical Association. North American specialist conferences (AAO, ASH, ASCO, STS, etc.).</li>
          <li><strong>ANCC</strong> — American Nurses Credentialing Center. Nursing-specific CPD.</li>
          <li><strong>RCPSC</strong> — Royal College of Physicians and Surgeons of Canada. Canadian specialist conferences.</li>
          <li><strong>CPD-certified UK</strong> — UK CPD-certified events from recognized providers.</li>
        </ul>

        <h2>Common NHRA Renewal Issues and Solutions</h2>
        <ul>
          <li>
            <strong>Non-accredited online course:</strong> Verify EACCME or AMA PRA Category 1
            accreditation before completing any online CE. Certificates without a recognized
            accreditor reference are rejected.
          </li>
          <li>
            <strong>Name mismatch:</strong> Certificate name must match your NHRA license name.
            If you legally changed your name, update your NHRA records before submitting certificates.
          </li>
          <li>
            <strong>Activity outside the renewal cycle:</strong> Only activities completed within
            your current 2-year cycle count. Activities from prior cycles cannot be carried forward.
          </li>
          <li>
            <strong>Work permit expiry:</strong> Your Bahraini work permit must be valid at renewal.
            Coordinate NHRA renewal with your LMRA (Labour Market Regulatory Authority) permit renewal.
          </li>
        </ul>

        <h2>Bahrain NHRA and Multi-Country GCC Renewal</h2>
        <p>
          Many Bahrain-licensed professionals also practice in Saudi Arabia (SCFHS), Qatar (QCHP),
          or UAE (DHA/DOH). Managing multiple renewals is straightforward with organisation:
        </p>
        <ul>
          <li>
            <strong>Same certificates, separate portals:</strong> Submit your international
            conference certificates to NHRA eServices and QCHP/Mumaris+/DHA portals separately.
            1 AMA PRA Category 1 credit = 1 CPD credit on NHRA; same ratio applies at QCHP and DHA.
          </li>
          <li>
            <strong>Cycle alignment:</strong> NHRA and QCHP are both 2-year cycles. If your cycles
            are synchronized, renewal periods will align and require simultaneous planning.
          </li>
          <li>
            <strong>Start early:</strong> Do not wait until the renewal month. Begin CME accumulation
            in year 1 of each cycle to avoid a final-month scramble.
          </li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> NHRA license renewal requirements and processes are updated
          periodically. Verify current requirements directly with the National Health Regulatory
          Authority of Bahrain before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}

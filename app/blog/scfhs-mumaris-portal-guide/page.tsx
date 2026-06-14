import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SCFHS Mumaris+ Portal Guide 2026 — Saudi CME Submission and License Renewal",
  description:
    "Step-by-step guide to using the SCFHS Mumaris+ portal for Saudi license renewal: account setup, CME credit submission, supported document types, common errors, and how to submit CME from international conferences to the Saudi Commission for Health Specialties.",
  openGraph: {
    title: "SCFHS Mumaris+ Portal 2026 — Complete CME Submission Guide",
    description:
      "How to use SCFHS Mumaris+ to submit CME credits and renew your Saudi health professional license: account verification, activity submission process, document requirements, supported credit types, and how to avoid the most common renewal errors.",
    type: "article",
    publishedTime: "2026-06-15T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "SCFHS Mumaris+ Portal Guide 2026",
  datePublished: "2026-06-15",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
  description: "Step-by-step guide to using SCFHS Mumaris+ for CME submission and Saudi license renewal in 2026.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Mumaris+ and who uses it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mumaris+ is the official digital portal of the Saudi Commission for Health Specialties (SCFHS). It is used by all licensed healthcare professionals in Saudi Arabia to submit CME activities, track credit accumulation, and submit license renewal applications.",
      },
    },
    {
      "@type": "Question",
      name: "How do I submit international conference CME credits on Mumaris+?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Log into Mumaris+, navigate to CME Activities, select 'Add Activity', choose 'External Activity' (for international conferences), upload the accredited certificate showing the provider, accrediting body, and credit hours. International CME from EACCME or AMA PRA Category 1 accredited conferences is accepted.",
      },
    },
    {
      "@type": "Question",
      name: "How many CME hours do I need for SCFHS renewal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS requires 40–60 CME credit hours per renewal cycle depending on your specialty and license category. Verify your specific requirement in your Mumaris+ account under 'Renewal Requirements'.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I submit the wrong CME certificate on Mumaris+?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Incorrectly submitted CME activities on Mumaris+ can be deleted or modified before the renewal application is submitted. Once the renewal application is submitted, contact SCFHS support to request a correction. Rejected submissions generate a notification with the rejection reason.",
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
        title="SCFHS Mumaris+ Portal Guide 2026 — Saudi CME Submission and License Renewal"
        description="The SCFHS Mumaris+ portal is the central system for CME tracking and license renewal for all healthcare professionals licensed in Saudi Arabia. This step-by-step guide covers everything from account access to CME submission, common errors, and how to navigate the renewal process efficiently."
        category="guide"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-15"
        readingMinutes={9}
      >
        <h2>What is Mumaris+ and What Does It Do?</h2>
        <p>
          Mumaris+ (مُمارِس+) is the official digital services portal of the Saudi Commission
          for Health Specialties (SCFHS — الهيئة السعودية للتخصصات الصحية). All healthcare
          professionals licensed in Saudi Arabia use Mumaris+ to:
        </p>
        <ul>
          <li>View and manage their SCFHS professional license</li>
          <li>Track accumulated CME credit hours toward renewal requirements</li>
          <li>Submit CME activities (conferences, online courses, workshops, in-hospital sessions)</li>
          <li>Apply for license renewal when requirements are met</li>
          <li>Manage contact information and correspondence with SCFHS</li>
          <li>Check specialty classification and upgrade eligibility</li>
          <li>Apply for verification letters and good standing certificates</li>
        </ul>
        <p>
          Mumaris+ replaced the older SCFHS portal system and is the only accepted channel
          for CME submission and renewal applications. Paper submissions are not accepted.
        </p>

        <h2>Accessing Mumaris+</h2>

        <h3>First-Time Login</h3>
        <p>
          Mumaris+ is accessed via the official SCFHS website. To log in for the first time:
        </p>
        <ol>
          <li>Go to the official SCFHS portal (scfhs.org.sa)</li>
          <li>Select &quot;Mumaris+ Login&quot;</li>
          <li>Enter your National ID (Saudi citizens) or Iqama number (expats) and date of birth</li>
          <li>Verify via OTP sent to your registered mobile number — ensure this mobile number is current with SCFHS. If your number has changed, update it first via the SCFHS service center</li>
          <li>Set a secure password on first login</li>
        </ol>

        <h3>Expat Professionals — Common Login Issues</h3>
        <ul>
          <li>
            <strong>Iqama expiry:</strong> If your Iqama has expired, Mumaris+ login may be blocked.
            Renew your Iqama with your employer before attempting portal access.
          </li>
          <li>
            <strong>Mobile number mismatch:</strong> The OTP goes to the mobile number registered
            with SCFHS — not your current number if it has changed. Contact SCFHS to update your
            mobile before renewal season.
          </li>
          <li>
            <strong>Absher integration:</strong> Some Mumaris+ functions require Absher identity
            verification. Expats should ensure their Absher account is active and linked.
          </li>
        </ul>

        <h2>Step-by-Step: Submitting CME Activities on Mumaris+</h2>

        <h3>Step 1 — Navigate to CME Activities</h3>
        <p>
          From the Mumaris+ dashboard, select &quot;CME/CPD Activities&quot; from the left navigation panel.
          This displays your current credit balance, renewal deadline, and required credits.
        </p>

        <h3>Step 2 — Add a New Activity</h3>
        <p>Click &quot;Add New Activity&quot; to open the submission form. You will be asked to select:</p>
        <ul>
          <li>
            <strong>Activity Type:</strong>
            <ul>
              <li>Scientific Conference/Symposium</li>
              <li>Workshop/Training Course</li>
              <li>Online/E-Learning Course</li>
              <li>Hospital Grand Rounds / In-Hospital CME</li>
              <li>Journal Article Reading (self-directed — limited credits)</li>
              <li>Teaching / Mentoring (limited credits)</li>
            </ul>
          </li>
          <li>
            <strong>Activity Location:</strong> Saudi Arabia (domestic) or International
          </li>
          <li>
            <strong>Accrediting Body:</strong> The organization that accredited the activity.
            For international conferences: EACCME, AMA PRA Category 1, CME accreditor name.
          </li>
        </ul>

        <h3>Step 3 — Fill Activity Details</h3>
        <ul>
          <li>Activity title (as shown on the certificate)</li>
          <li>Organizer/provider name</li>
          <li>Activity date(s) — start and end date</li>
          <li>Credit hours awarded (as stated on the certificate)</li>
          <li>Accreditation reference number (if shown on certificate)</li>
        </ul>

        <h3>Step 4 — Upload Certificate</h3>
        <p>
          Upload the completion certificate in PDF or JPG format. SCFHS requires certificates to clearly show:
        </p>
        <ul>
          <li>Your full name (must match your SCFHS license name exactly)</li>
          <li>Activity title</li>
          <li>Date of completion</li>
          <li>Credit hours or CME units awarded</li>
          <li>Accrediting body name and logo (or accreditation statement)</li>
          <li>Provider/organizer signature or stamp</li>
        </ul>
        <p>
          <strong>Critical — name matching:</strong> If your certificate shows a name variant
          that doesn&apos;t exactly match your SCFHS license (e.g., different spelling, missing
          middle name, initials only), SCFHS may reject the submission. Contact the conference
          organizer for a corrected certificate before submission.
        </p>

        <h3>Step 5 — Submit and Wait for Verification</h3>
        <p>
          After submission, the activity status shows as &quot;Pending Review.&quot; SCFHS staff review
          submitted activities — verification typically takes 3–14 business days for standard
          activities, longer for international conference certificates.
        </p>
        <ul>
          <li>Approved activities show as &quot;Verified&quot; and credits are added to your balance</li>
          <li>Rejected activities show the rejection reason — common reasons are covered below</li>
        </ul>

        <h2>Common Mumaris+ Submission Errors and How to Avoid Them</h2>

        <h3>Error 1 — Certificate Name Does Not Match License</h3>
        <p>
          The most frequent rejection reason. Always check that the name on your conference
          certificate matches your SCFHS license name before the conference. Request corrections
          from the organizer immediately after the event if there is a discrepancy.
        </p>

        <h3>Error 2 — Accrediting Body Not Recognized</h3>
        <p>
          SCFHS recognizes EACCME, AMA PRA Category 1, ACCME, and several other international
          accreditors. If your certificate states the accrediting body but SCFHS rejects it,
          contact the organizer to confirm the accreditation details and re-upload with a
          clarification note.
        </p>

        <h3>Error 3 — Certificate Does Not State Credit Hours</h3>
        <p>
          Some conference certificates show attendance hours but not &quot;CME credit hours.&quot; SCFHS
          requires the certificate to explicitly state CME/CPD credits awarded. If the certificate
          shows only attendance, request a supplementary accreditation letter from the organizer.
        </p>

        <h3>Error 4 — Activity Submitted After Renewal Deadline</h3>
        <p>
          CME activities must be completed and submitted to Mumaris+ before the renewal
          application is submitted. Activities completed before the renewal date but submitted
          to Mumaris+ after the application window closes may not be counted.
        </p>

        <h3>Error 5 — Online Course Without SCFHS-Recognized Accreditation</h3>
        <p>
          Not all online CE platforms are accepted. Check that your online course is from an
          ACCME-accredited provider (for AMA PRA Category 1), or a SCFHS directly registered
          Saudi CME provider, or an EACCME-accredited European provider.
        </p>

        <h2>How to Check Your CME Progress Before Renewal</h2>
        <p>
          Log into Mumaris+, navigate to &quot;CME/CPD Activities,&quot; and view your credit summary.
          The portal shows:
        </p>
        <ul>
          <li>Total verified credits accumulated</li>
          <li>Required credits for your renewal cycle</li>
          <li>Deficit (credits still needed) with countdown to renewal date</li>
          <li>Category breakdown (if category caps apply to your specialty)</li>
        </ul>

        <h2>Applying for License Renewal via Mumaris+</h2>
        <ol>
          <li>Ensure all CME activities are submitted and verified (don&apos;t wait for the deadline)</li>
          <li>Navigate to &quot;Renewal Application&quot; in Mumaris+</li>
          <li>Confirm personal data and contact information is current</li>
          <li>Upload current practice certificate (from your Saudi employer) if required</li>
          <li>Pay the renewal fee via Mada/Visa/Mastercard through the portal</li>
          <li>Print the renewal receipt — renewal license is issued electronically</li>
        </ol>

        <h2>Mumaris+ and International Portals — Managing Both</h2>
        <p>
          Healthcare professionals licensed in both Saudi Arabia and another GCC country
          (Qatar, UAE) face the challenge of submitting the same CME certificates to multiple
          portals. Key tips:
        </p>
        <ul>
          <li>Same certificate, multiple submissions: save your original certificates in a cloud folder; upload the same file to Mumaris+ and QCHP/DHA portals separately</li>
          <li>Credit hour equivalence: 1 AMA PRA Category 1 hour = 1 CME credit on Mumaris+; same ratio on QCHP and DHA</li>
          <li>Do not wait until the final month — process both portals simultaneously to avoid a deadline crunch</li>
        </ul>

        <p style={{ marginTop: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "0.5rem", borderLeft: "4px solid #1a56a0" }}>
          <strong>Disclaimer:</strong> SCFHS portal features and CME submission requirements
          are updated periodically. Always verify current procedures directly with SCFHS or
          through the official Mumaris+ portal before your renewal date.
        </p>
      </BlogPostLayout>
    </>
  );
}

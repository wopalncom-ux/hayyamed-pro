import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";

const APP_URL = "https://hayyamed.pro";
const SLUG = "doh-renewal-guide-2026";

export const metadata: Metadata = {
  title: "DOH License Renewal Guide 2026: CPD Requirements for Abu Dhabi Healthcare Professionals | Hayya Med Pro",
  description:
    "Complete guide to renewing your DOH (Department of Health) healthcare license in Abu Dhabi 2026. CPD credits, accepted accreditors, renewal process via Malaffi and DOH portals, and common mistakes to avoid.",
  keywords: [
    "DOH license renewal 2026",
    "DOH CPD requirements Abu Dhabi",
    "Abu Dhabi healthcare license renewal",
    "Department of Health Abu Dhabi CPD",
    "how to renew DOH license",
    "Abu Dhabi healthcare professional renewal",
    "DOH CPD credits",
    "UAE healthcare license renewal Abu Dhabi",
  ],
  openGraph: {
    title: "DOH License Renewal Guide 2026: CPD Requirements for Abu Dhabi Healthcare Professionals",
    description: "Step-by-step guide to renewing your DOH license in Abu Dhabi. CPD credits per 2-year cycle, accepted accreditors, and the Malaffi portal renewal process explained.",
    url: `${APP_URL}/blog/${SLUG}`,
    type: "article",
    publishedTime: "2026-06-14",
    authors: ["Hayya Med Pro Editorial"],
  },
  twitter: { card: "summary_large_image", title: "DOH License Renewal Guide 2026 — Abu Dhabi", description: "How to renew your DOH healthcare license in Abu Dhabi. CPD requirements, accepted accreditors, and renewal process explained." },
  alternates: { canonical: `${APP_URL}/blog/${SLUG}` },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "DOH License Renewal Guide 2026: CPD Requirements for Abu Dhabi Healthcare Professionals",
  description: "Complete guide to renewing your DOH healthcare license in Abu Dhabi 2026.",
  datePublished: "2026-06-14",
  dateModified: "2026-06-14",
  author: { "@type": "Organization", name: "Hayya Med Pro", url: APP_URL },
  publisher: { "@type": "Organization", name: "Hayya Med AI", url: APP_URL },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${APP_URL}/blog/${SLUG}` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many CPD credits do I need to renew my DOH license in Abu Dhabi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DOH (Department of Health Abu Dhabi) requires 30–50 CPD credits per 2-year renewal cycle, with the exact amount varying by profession. Physicians and surgical specialties typically require 50 credits per 2 years; allied health professions may require 30. Check your specific profession's requirement in the DOH Tasneef portal.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between DHA and DOH in UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DHA (Dubai Health Authority) licenses healthcare professionals practicing in Dubai. DOH (Department of Health) licenses healthcare professionals practicing in Abu Dhabi. They are entirely separate regulatory bodies with different requirements and portals. A DHA license does not satisfy a DOH requirement and vice versa — if you practice in both emirates, you must hold and renew both licenses independently.",
      },
    },
    {
      "@type": "Question",
      name: "How do I renew my DOH license in Abu Dhabi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DOH license renewal is managed through the DOH Tasneef portal (tasneef.doh.gov.ae). Log in, ensure your CPD credits are recorded and your professional data is current, then submit the renewal application within the renewal window (typically 90 days before expiry) and pay the renewal fee. DOH sends email reminders to your registered address.",
      },
    },
    {
      "@type": "Question",
      name: "Does DOH accept online CPD courses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, DOH accepts online CPD from accredited providers. There is no publicly stated hard cap on the percentage of online CPD, but DOH encourages a balanced mix of in-person and online activities. Activities must be from DOH-recognized accreditors — the same major international bodies accepted by DHA: AMA-PRA, EACCME, Royal Colleges, and ACCME-accredited providers.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if my DOH license expires?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If your DOH license expires, you cannot legally practice healthcare in Abu Dhabi. You will need to apply for reinstatement through the Tasneef portal, which requires updated documentation and potentially additional CPD credits. Practicing with an expired license is a serious regulatory violation in Abu Dhabi.",
      },
    },
  ],
};

export default function DohRenewalGuide2026() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BlogPostLayout
        title="DOH License Renewal Guide 2026: CPD Requirements for Abu Dhabi Healthcare Professionals"
        description="Complete guide to renewing your DOH (Department of Health) healthcare license in Abu Dhabi. CPD credits per 2-year cycle, accepted accreditors, the Tasneef portal renewal process, and the most common mistakes to avoid."
        publishedAt="2026-06-14"
        category="country"
        readingMinutes={9}
        relatedLinks={[
          { label: "DOH authority guide", href: "/doh" },
          { label: "DOH renewal overview", href: "/doh-renewal" },
          { label: "DHA renewal guide (Dubai)", href: "/blog/dha-renewal-guide-2026" },
          { label: "CME calculator", href: "/cme-calculator" },
          { label: "GCC CME requirements", href: "/gcc-cme-requirements" },
        ]}
      >
        <h2>What is DOH and who does it license?</h2>
        <p>
          The Department of Health (DOH) — previously known as Health Authority Abu Dhabi (HAAD) — is the regulatory body responsible for licensing all healthcare professionals practicing in the Emirate of Abu Dhabi, including the cities of Abu Dhabi, Al Ain, and Al Dhafra region. With over 90,000 licensed healthcare professionals, DOH is one of the largest healthcare licensing bodies in the UAE.
        </p>
        <p>
          If you work in an Abu Dhabi government hospital (such as Sheikh Khalifa Medical City, Tawam Hospital, or Al Ain Hospital), a Cleveland Clinic Abu Dhabi, a private clinic in Abu Dhabi city, or any other healthcare facility within the emirate of Abu Dhabi, your license is issued by DOH.
        </p>

        <h2>DOH vs DHA: the critical UAE distinction</h2>
        <p>
          The UAE has two major healthcare licensing authorities — one per emirate:
        </p>
        <table>
          <thead>
            <tr>
              <th>Authority</th>
              <th>Emirate</th>
              <th>CPD/CME required</th>
              <th>Term used</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><strong>DOH</strong> (Dept. of Health)</td><td>Abu Dhabi</td><td>30–50 CPD / 2 years</td><td><strong>CPD</strong></td></tr>
            <tr><td><strong>DHA</strong> (Dubai Health Authority)</td><td>Dubai</td><td>40 CME / 2 years</td><td><strong>CME</strong></td></tr>
          </tbody>
        </table>
        <p>
          These are entirely separate licenses. A DOH license does not allow practice in Dubai, and a DHA license does not allow practice in Abu Dhabi. Many UAE healthcare professionals hold both — if you do, track each license independently with separate renewal dates and CPD requirements.
        </p>
        <p>
          Other UAE emirates (Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah) are regulated by the UAE Ministry of Health and Prevention (MOHAP) — a third separate authority not covered by DOH or DHA.
        </p>

        <h2>DOH CPD requirements at a glance (2026)</h2>
        <table>
          <thead>
            <tr>
              <th>Requirement</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Total CPD credits</td><td><strong>30–50 credits per 2-year cycle</strong> (by profession)</td></tr>
            <tr><td>Physicians & surgical specialties</td><td><strong>50 CPD credits per 2 years</strong></td></tr>
            <tr><td>Allied health & nursing</td><td><strong>30 CPD credits per 2 years</strong> (varies by category)</td></tr>
            <tr><td>Renewal cycle</td><td>2 years (biennial)</td></tr>
            <tr><td>Terminology</td><td>DOH uses <strong>CPD</strong> (Continuing Professional Development)</td></tr>
            <tr><td>Online CPD</td><td>Accepted from DOH-recognized accreditors</td></tr>
            <tr><td>Renewal portal</td><td>DOH Tasneef portal (tasneef.doh.gov.ae)</td></tr>
          </tbody>
        </table>
        <p>
          Note: DOH updated its CPD framework when the authority rebranded from HAAD to DOH. If you have historical HAAD CPD records, these remain valid — check the Tasneef portal for historical activity import.
        </p>

        <h2>What CPD activities count for DOH renewal?</h2>
        <p>DOH accepts a broad range of CPD activity types:</p>

        <h3>Formal education (Category 1)</h3>
        <ul>
          <li>Attending accredited conferences, workshops, and symposia</li>
          <li>Online CPD courses from DOH-recognized accreditors</li>
          <li>Accredited hospital grand rounds and case presentations</li>
          <li>Journal reading programs with formal assessment</li>
          <li>Simulation and procedural skills training (when accredited)</li>
          <li>Board certification examination preparation courses</li>
        </ul>

        <h3>Professional activities (Category 2)</h3>
        <ul>
          <li>Teaching and clinical supervision (formally documented)</li>
          <li>Publication of peer-reviewed research (first or co-authorship)</li>
          <li>Presenting at recognized medical conferences</li>
          <li>Participation in hospital quality improvement committees</li>
          <li>Clinical governance and accreditation activities (JCI, CBAHI)</li>
        </ul>
        <p>
          DOH applies credit caps to Category 2 activities — check the Tasneef portal for your profession's current maximum allowed per cycle.
        </p>

        <h2>Which accreditors does DOH recognize for CPD?</h2>
        <p>
          DOH recognizes the same major international accreditors as DHA. Key recognized bodies include:
        </p>
        <ul>
          <li><strong>AMA-PRA</strong> (American Medical Association Physician Recognition Award) — 1 AMA PRA Category 1 Credit™ = 1 DOH CPD point</li>
          <li><strong>ACCME-accredited providers</strong> (Accreditation Council for Continuing Medical Education, USA)</li>
          <li><strong>EACCME</strong> (European Accreditation Council for Continuing Medical Education)</li>
          <li><strong>Royal College of Physicians and Surgeons of Canada</strong></li>
          <li><strong>UK Royal Colleges</strong> (RCP, RCS, RCN, RCPsych, and others)</li>
          <li><strong>DOH-accredited local providers</strong> in Abu Dhabi — check the Tasneef provider directory</li>
        </ul>
        <p>
          DOH does not recognize all accreditors that DHA recognizes, and vice versa. Always verify a specific activity against the DOH Tasneef portal before logging it.
        </p>

        <h2>Abu Dhabi-specific CPD opportunities</h2>
        <p>
          Abu Dhabi hosts several major healthcare events generating DOH-recognized CPD credits:
        </p>
        <ul>
          <li><strong>SEHA educational programs</strong> — Abu Dhabi Health Services Company (SEHA) runs regular accredited educational events for licensed professionals</li>
          <li><strong>Cleveland Clinic Abu Dhabi CME</strong> — CCAD runs AMA-PRA accredited educational events open to DOH-licensed professionals</li>
          <li><strong>Sheikh Khalifa Medical City grand rounds</strong> — accredited hospital-based education</li>
          <li><strong>Abu Dhabi Global Healthcare Week</strong> — annual healthcare event with CME/CPD accredited sessions</li>
          <li><strong>DOH-organized training events</strong> — DOH runs periodic professional development programs with direct CPD recognition</li>
        </ul>

        <h2>Step-by-step: How to renew your DOH license</h2>

        <h3>Step 1: Know your license expiry date</h3>
        <p>
          Log in to the DOH Tasneef portal (tasneef.doh.gov.ae) to confirm your license expiry date. DOH sends renewal reminders by email — but your registered email must be current. Do not rely solely on email reminders.
        </p>

        <h3>Step 2: Track CPD from the start of your cycle</h3>
        <p>
          Begin logging CPD from the first day of your license cycle. For physicians, that means building toward 50 credits over 24 months — roughly 25 credits per year, or 2 credits per month. For allied health professionals, work toward your specific profession's requirement (30 credits for most categories).
        </p>

        <h3>Step 3: Log activities in the Tasneef portal</h3>
        <p>
          The DOH Tasneef portal is the official system for CPD activity logging. Log each activity as you complete it with the activity title, date, accreditor, and credit count. Upload your certificate for each activity.
        </p>

        <h3>Step 4: Open your renewal application (90 days before expiry)</h3>
        <p>
          DOH opens the renewal window approximately 90 days before your license expiry date. In the Tasneef portal, navigate to your license and complete the renewal form:
        </p>
        <ul>
          <li>Confirm your CPD activities are fully logged and verified</li>
          <li>Update your current employment and facility information</li>
          <li>Submit any required specialty-specific renewal documents</li>
          <li>Provide a Good Standing Certificate if required by your profession</li>
        </ul>

        <h3>Step 5: Pay the renewal fee</h3>
        <p>
          DOH charges a renewal fee payable through the Tasneef portal. Fee amounts vary by profession. Check the current DOH fee schedule on doh.gov.ae before applying.
        </p>

        <h3>Step 6: Await approval</h3>
        <p>
          Processing typically takes 5–15 working days for complete applications. Your renewed DOH license is issued digitally through the Tasneef portal.
        </p>

        <h2>Common DOH renewal mistakes</h2>
        <ul>
          <li>
            <strong>Confusing DOH with DHA.</strong> Many professionals — especially those who moved from Dubai to Abu Dhabi — apply for DHA renewal when they should be renewing their DOH license. Check your license certificate for which authority issued it.
          </li>
          <li>
            <strong>Outdated profession category.</strong> If your role or specialty changed since your last renewal, your CPD requirement may have changed too. Update your profession details in Tasneef before applying.
          </li>
          <li>
            <strong>Not verifying accreditor recognition before the course.</strong> A non-recognized provider's certificate cannot be added to your Tasneef record. Verify before you attend.
          </li>
          <li>
            <strong>Missing the renewal window.</strong> DOH licenses expire on a fixed date. If you miss the window and your license lapses, reinstatement requires additional steps and documentation.
          </li>
          <li>
            <strong>Lost certificates.</strong> DOH may audit CPD records. Keep original certificates — especially for high-credit activities — for the full duration of at least one cycle after submission.
          </li>
          <li>
            <strong>Holding multiple UAE licenses without tracking separately.</strong> If you hold both DOH and DHA licenses, each has its own CPD cycle, portal, and renewal deadline. There is no shared tracking between the two — manage them independently.
          </li>
        </ul>

        <h2>Tracking DOH CPD with Hayya Med Pro</h2>
        <p>
          Hayya Med Pro tracks CPD requirements for DOH alongside DHA, QCHP, SCFHS, and all other GCC authorities. If you hold both a DOH and DHA license, log an activity once and assign it to both wallets if the accreditor is recognized by both authorities. Each wallet tracks its own independent CPD total and renewal deadline.
        </p>
        <p>
          The platform is free to start. The Pro plan adds a PDF compliance report — useful for producing a documented CPD history during DOH renewal — and AI-powered gap analysis showing which types of activities you need to complete your cycle.
        </p>
      </BlogPostLayout>
    </>
  );
}

import BlogPostLayout from "@/components/BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Transfer Your License from HAAD to DHA — Complete Guide",
  description:
    "Step-by-step guide to transferring your healthcare professional license from Abu Dhabi's Department of Health (formerly HAAD) to Dubai Health Authority (DHA). Requirements, timelines, and CME implications.",
  openGraph: {
    title: "HAAD to DHA License Transfer — Complete Guide for Healthcare Professionals",
    description:
      "Moving from Abu Dhabi to Dubai? Here's exactly how to transfer your healthcare license, what CME credits carry over, and what new requirements apply.",
    type: "article",
    publishedTime: "2026-06-14T00:00:00Z",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Transfer Your Healthcare License from HAAD/DOH to DHA",
  datePublished: "2026-06-14",
  author: { "@type": "Organization", name: "Hayya Med Pro" },
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
  description:
    "Complete step-by-step guide to transferring your UAE healthcare license from Abu Dhabi DOH (formerly HAAD) to Dubai DHA. CME transfer, timelines, fees.",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="How to Transfer Your License from HAAD to DHA — Complete Guide"
        description="Moving from Abu Dhabi to Dubai? Here's exactly how to transfer your healthcare license, what CME credits carry over, and what new requirements apply."
        category="country"
        author="Hayya Med Pro Editorial Team"
        publishedAt="2026-06-14"
        readingMinutes={10}
      >
        <h2>Understanding UAE Healthcare Licensing Authorities</h2>
        <p>
          The UAE has an emirate-based licensing system. Each emirate manages its own healthcare professional
          licensing authority:
        </p>
        <ul>
          <li><strong>Abu Dhabi:</strong> Department of Health (DOH) — formerly the Health Authority of Abu Dhabi (HAAD)</li>
          <li><strong>Dubai:</strong> Dubai Health Authority (DHA)</li>
          <li><strong>Northern Emirates (Sharjah, Ajman, RAK, UAQ, Fujairah):</strong> Ministry of Health and Prevention (MOHAP)</li>
        </ul>
        <p>
          This means a license issued by DOH (Abu Dhabi) does not automatically permit you to practice in Dubai.
          If you move from Abu Dhabi to a Dubai-licensed facility, you need a DHA license — regardless of how long
          you have held your Abu Dhabi license.
        </p>

        <h2>Step-by-Step: HAAD/DOH to DHA License Transfer</h2>
        <p>
          Note: "HAAD" no longer exists as a separate entity — it was rebranded to the Department of Health (DOH)
          Abu Dhabi in 2018. The process described here applies to transferring from a DOH (Abu Dhabi) license to
          a DHA (Dubai) license.
        </p>

        <h3>Step 1 — Gather Your Documents</h3>
        <p>Before initiating the DHA application, prepare:</p>
        <ul>
          <li>Current DOH (Abu Dhabi) license — must be valid and in good standing</li>
          <li>Primary source verification (PSV) from Dataflow Group — required for all UAE licenses</li>
          <li>Passport copy (valid for at least 6 months)</li>
          <li>UAE residence visa copy</li>
          <li>Recent passport-size photograph (white background, per DHA specification)</li>
          <li>CME completion certificate from your current DOH cycle</li>
          <li>Professional indemnity insurance (required for DHA applications)</li>
          <li>Employer letter (facility or hospital employment confirmation)</li>
        </ul>

        <h3>Step 2 — Verify Dataflow Primary Source Verification</h3>
        <p>
          Both DOH and DHA use Dataflow Group for primary source verification. If you already completed Dataflow
          for your DOH license, DHA may accept the existing verification report — but only if it is within the
          validity period (typically 2–3 years from issue date).
        </p>
        <p>
          If your Dataflow report has expired, you will need to initiate a new verification request. This typically
          takes 4–8 weeks and costs AED 400–700 depending on the number of documents to be verified.
        </p>

        <h3>Step 3 — Create a DHA Account on Sheryan Platform</h3>
        <p>
          DHA's licensing portal is called Sheryan (sheryan.dha.gov.ae). Create an account if you don't have one,
          then select "Healthcare Professional Licensing" and choose "New License Application."
        </p>
        <p>
          If you previously held a DHA license that lapsed, use the reinstatement pathway instead — not a new
          application. Reinstatement has different CME requirements.
        </p>

        <h3>Step 4 — Submit the Application</h3>
        <p>
          Complete the Sheryan application form. You will be asked to select your profession, specialty, and
          sub-specialty. Choose carefully — the scope of practice on your DHA license is defined by these
          selections, and amendments require a separate process.
        </p>
        <p>Current DHA application fee: AED 1,030 (subject to change — verify on Sheryan before applying).</p>

        <h3>Step 5 — Credential Evaluation</h3>
        <p>
          DHA evaluates your qualifications, work experience, and CME record. Common reasons for delay:
        </p>
        <ul>
          <li>Incomplete Dataflow verification</li>
          <li>CME shortfall (DHA requires evidence of ongoing education)</li>
          <li>Qualification not on DHA's approved specialty list</li>
          <li>Gap in employment history not explained</li>
        </ul>
        <p>Timeline: typically 4–12 weeks from complete submission to license decision.</p>

        <h3>Step 6 — Assessment (if Required)</h3>
        <p>
          For certain specialties, DHA requires a clinical assessment — either a written exam or a structured
          competency-based evaluation at a DHA-approved assessment center. Not all professions require this:
        </p>
        <ul>
          <li>Physicians: assessment often required for first-time DHA applicants</li>
          <li>Nurses: assessment waived if holding a recognized qualification with 2+ years UAE experience</li>
          <li>Pharmacists: assessment varies by qualification origin</li>
        </ul>

        <h3>Step 7 — License Issuance</h3>
        <p>
          Once approved, pay the final license fee (AED 310–620 depending on duration and profession) and download
          your DHA license card. You can now legally practice in Dubai-licensed facilities.
        </p>

        <h2>What Happens to Your Abu Dhabi DOH License?</h2>
        <p>
          Your DOH license remains valid and you can hold both simultaneously. Many professionals maintain both
          licenses if they work across emirates. However, DOH and DHA CPD/CME requirements are tracked separately:
        </p>
        <ul>
          <li>DOH requires 40 CPD credits per 2-year cycle</li>
          <li>DHA requires 40 CME credits per 2-year cycle</li>
          <li>The same activity <em>may</em> count toward both if the accreditor is recognized by both authorities</li>
        </ul>
        <p>
          The Gulf Health Council is working toward cross-emirate recognition, but as of 2026 this is still not
          fully implemented. Always confirm with both DOH and DHA directly before assuming credit crossover.
        </p>

        <h2>CME Credits After Transferring to DHA</h2>
        <p>
          When you obtain a new DHA license, your CME cycle clock resets from the license issue date. DHA requires:
        </p>
        <ul>
          <li><strong>40 CME/CPD credits</strong> per 2-year renewal cycle</li>
          <li>Minimum of <strong>25 credits must come from clinical/professional activities</strong> (not self-learning)</li>
          <li>Maximum <strong>15 credits from self-learning</strong> (online modules, reading, etc.)</li>
          <li>At least <strong>3 credits in patient safety</strong> per cycle</li>
        </ul>
        <p>
          CME activities must be accredited by DHA or a recognized international body (AMA PRA, RCPCH, ACGME, etc.).
          The full list of recognized accreditors is in DHA's CME Guidelines, available on Sheryan.
        </p>

        <h2>Common Mistakes to Avoid</h2>
        <ul>
          <li>
            <strong>Starting work before the license is issued.</strong> Practicing in a Dubai facility without
            a valid DHA license is a serious violation — even with a valid DOH license.
          </li>
          <li>
            <strong>Assuming DOH credits transfer automatically.</strong> They do not. DHA starts your CME cycle
            fresh from your new license issue date.
          </li>
          <li>
            <strong>Letting Dataflow expire.</strong> If your Dataflow PSV expires, it can add 4–8 weeks to your
            DHA application. Renew proactively.
          </li>
          <li>
            <strong>Incorrect specialty selection on the Sheryan form.</strong> Changing your scope of practice
            after issuance requires a formal amendment with additional fees and documentation.
          </li>
        </ul>

        <h2>Timeline Summary</h2>
        <ul>
          <li><strong>Document preparation:</strong> 1–2 weeks</li>
          <li><strong>Dataflow PSV (if new):</strong> 4–8 weeks</li>
          <li><strong>DHA application review:</strong> 4–12 weeks</li>
          <li><strong>Assessment (if required):</strong> 2–6 weeks additional</li>
          <li><strong>Total realistic timeline:</strong> 6–20 weeks from starting to receiving a new DHA license</li>
        </ul>

        <h2>Track Your CME Across UAE Authorities</h2>
        <p>
          Managing CME for two UAE licensing authorities — or tracking what's accepted by each — is one of the
          most common pain points for multi-emirate professionals. Hayya Med Pro tracks your CME credits against
          both DOH and DHA requirements in one place, flags when an activity is recognized by one authority but
          not the other, and alerts you separately for each renewal deadline.
        </p>
      </BlogPostLayout>
    </>
  );
}

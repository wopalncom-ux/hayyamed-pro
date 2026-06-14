import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";

const APP_URL = "https://hayyamed.pro";
const SLUG = "omsb-renewal-guide-2026";

export const metadata: Metadata = {
  title: "OMSB License Renewal Guide 2026: CME Requirements for Oman Healthcare Professionals | Hayya Med Pro",
  description:
    "Complete guide to renewing your OMSB (Oman Medical Specialty Board) healthcare license in 2026. 40 CME credits per 2-year cycle, accepted accreditors, renewal process, and tips for Oman-based professionals.",
  keywords: [
    "OMSB license renewal 2026",
    "Oman healthcare license renewal",
    "OMSB CME requirements",
    "Oman Medical Specialty Board renewal",
    "how to renew OMSB license",
    "Oman physician license renewal",
    "OMSB CME credits",
    "Oman CME requirements 2026",
  ],
  openGraph: {
    title: "OMSB License Renewal Guide 2026: CME Requirements for Oman Healthcare Professionals",
    description: "Step-by-step guide to renewing your OMSB license in Oman. 40 CME credits per 2-year cycle, accepted accreditors, and biennial renewal process explained.",
    url: `${APP_URL}/blog/${SLUG}`,
    type: "article",
    publishedTime: "2026-06-14",
    authors: ["Hayya Med Pro Editorial"],
  },
  twitter: { card: "summary_large_image", title: "OMSB License Renewal Guide 2026 — Oman", description: "How to renew your OMSB healthcare license in Oman. 40 CME credits per 2-year cycle, accepted accreditors, and renewal process." },
  alternates: { canonical: `${APP_URL}/blog/${SLUG}` },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "OMSB License Renewal Guide 2026: CME Requirements for Oman Healthcare Professionals",
  description: "Complete guide to renewing your OMSB healthcare license in Oman 2026.",
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
      name: "How many CME credits do I need to renew my OMSB license?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OMSB (Oman Medical Specialty Board) requires 40 CME credits per 2-year biennial license renewal cycle. This applies to all OMSB-licensed healthcare professionals in Oman, including physicians, nurses, pharmacists, dentists, and allied health professionals.",
      },
    },
    {
      "@type": "Question",
      name: "Is OMSB renewal annual or biennial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OMSB operates on a biennial (2-year) renewal cycle. This means you need 40 CME credits over 2 years — approximately 20 credits per year, or about 1–2 credits per month. This is a more moderate requirement than Kuwait (30/year, annual) or SCFHS Saudi Arabia (60/year, annual).",
      },
    },
    {
      "@type": "Question",
      name: "What CME accreditors does OMSB recognize?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OMSB recognizes major international CME accreditors including AMA-PRA (American Medical Association), ACCME-accredited providers, EACCME (European Accreditation Council for CME), and Royal Colleges. OMSB also recognizes activities from Oman Medical Association (OMA)-accredited providers and OMSB-accredited local programs.",
      },
    },
    {
      "@type": "Question",
      name: "Does OMSB accept online CME?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, OMSB accepts online CME from recognized accreditors. There is no publicly stated hard cap on the percentage of online credits for OMSB, but a balanced mix of in-person and online activities is encouraged. Verify specific activity recognition through the OMSB professional portal before logging.",
      },
    },
  ],
};

export default function OmsbRenewalGuide2026() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BlogPostLayout
        title="OMSB License Renewal Guide 2026: CME Requirements for Oman Healthcare Professionals"
        description="Complete guide to renewing your OMSB healthcare license in Oman in 2026. 40 CME credits per 2-year biennial cycle, accepted accreditors, step-by-step renewal process, and common mistakes to avoid."
        publishedAt="2026-06-14"
        category="country"
        readingMinutes={8}
        relatedLinks={[
          { label: "OMSB authority guide", href: "/omsb" },
          { label: "OMSB renewal overview", href: "/omsb-renewal" },
          { label: "How many CME credits in GCC?", href: "/blog/how-many-cme-credits-gcc" },
          { label: "CME vs CPD explained", href: "/blog/cme-vs-cpd-gcc" },
          { label: "CME calculator", href: "/cme-calculator" },
        ]}
      >
        <h2>What is OMSB?</h2>
        <p>
          The Oman Medical Specialty Board (OMSB) is the national authority responsible for licensing healthcare professionals practicing in the Sultanate of Oman. OMSB manages postgraduate medical education, specialty certification, and continuing medical education requirements for over 35,000 licensed healthcare professionals working in Oman's public and private healthcare sectors.
        </p>
        <p>
          OMSB was established under the Ministry of Health and operates Oman's national residency training programs in addition to its licensing and CME functions. For established practitioners, OMSB's CME framework is the key compliance requirement for license renewal.
        </p>

        <h2>OMSB CME requirements at a glance (2026)</h2>
        <table>
          <thead>
            <tr>
              <th>Requirement</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Total CME credits</td><td><strong>40 credits per 2-year cycle</strong></td></tr>
            <tr><td>Renewal cycle</td><td>2 years (biennial)</td></tr>
            <tr><td>Annual equivalent</td><td>~20 credits per year, ~1.7 credits per month</td></tr>
            <tr><td>Terminology</td><td>OMSB uses <strong>CME</strong> (Continuing Medical Education)</td></tr>
            <tr><td>Applies to</td><td>All OMSB-licensed healthcare professions</td></tr>
            <tr><td>Online CME</td><td>Accepted from OMSB-recognized accreditors</td></tr>
            <tr><td>Renewal portal</td><td>OMSB professional portal</td></tr>
          </tbody>
        </table>

        <h2>How OMSB compares to other GCC authorities</h2>
        <p>
          OMSB's 40-credit biennial requirement places it alongside DHA Dubai and NHRA Bahrain as one of the more accessible CME targets in the GCC:
        </p>
        <table>
          <thead>
            <tr>
              <th>Authority</th>
              <th>Annual equivalent</th>
              <th>Cycle type</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>SCFHS (Saudi Arabia) — physicians</td><td>60/year</td><td>Annual</td></tr>
            <tr><td>QCHP (Qatar)</td><td>40/year equivalent</td><td>Biennial</td></tr>
            <tr><td>MOH Kuwait</td><td>30/year</td><td>Annual</td></tr>
            <tr><td>DOH (Abu Dhabi)</td><td>25/year equivalent</td><td>Biennial</td></tr>
            <tr><td>DHA (Dubai)</td><td>20/year equivalent</td><td>Biennial</td></tr>
            <tr><td>NHRA (Bahrain)</td><td>20/year equivalent</td><td>Biennial</td></tr>
            <tr><td><strong>OMSB (Oman)</strong></td><td><strong>20/year equivalent</strong></td><td><strong>Biennial</strong></td></tr>
          </tbody>
        </table>
        <p>
          For professionals holding multiple GCC licenses, OMSB is one of the easiest CME requirements to maintain — 1–2 credits per month over 24 months is a manageable pace for any active clinician.
        </p>

        <h2>What CME activities count for OMSB renewal?</h2>

        <h3>Category 1: Accredited educational activities</h3>
        <ul>
          <li>Attending accredited national and international conferences, workshops, and seminars</li>
          <li>Online CME modules from OMSB-recognized accredited providers</li>
          <li>Hospital-based grand rounds and educational sessions (when formally accredited)</li>
          <li>Simulation and procedural skills training workshops</li>
          <li>Journal reading programs with formal assessment component</li>
        </ul>

        <h3>Category 2: Professional and academic activities</h3>
        <ul>
          <li>Teaching and supervision of medical students, residents, or colleagues</li>
          <li>Publication of peer-reviewed research articles</li>
          <li>Presenting research at recognized medical conferences</li>
          <li>Participation in hospital clinical audit and quality improvement activities</li>
          <li>Contributing to clinical guideline development</li>
        </ul>
        <p>
          OMSB applies caps on Category 2 credits per cycle — check the OMSB portal for your profession's current limits.
        </p>

        <h2>Which accreditors does OMSB recognize?</h2>
        <ul>
          <li><strong>AMA-PRA</strong> (American Medical Association Physician Recognition Award) — 1 AMA PRA Category 1 Credit™ = 1 OMSB CME credit; accepted across all GCC</li>
          <li><strong>ACCME-accredited providers</strong> (Accreditation Council for Continuing Medical Education, USA)</li>
          <li><strong>EACCME</strong> (European Accreditation Council for Continuing Medical Education)</li>
          <li><strong>Royal Colleges</strong> (UK and Canada)</li>
          <li><strong>Oman Medical Association (OMA)</strong> — OMA-accredited events carry direct OMSB recognition</li>
          <li><strong>OMSB-accredited local providers</strong> — organizations specifically accredited by OMSB in Oman</li>
        </ul>

        <h2>Oman-specific CME opportunities</h2>
        <ul>
          <li><strong>Oman Medical Specialty Board (OMSB) educational events</strong> — OMSB runs national CME conferences and workshops directly accredited for Oman renewal</li>
          <li><strong>Oman Medical Association (OMA) events</strong> — OMA holds regular CME symposia across Muscat and regional cities</li>
          <li><strong>Sultan Qaboos University Hospital (SQUH) CME</strong> — SQUH hosts the primary academic medical CME program in Oman, covering multiple specialties with OMSB-recognized events</li>
          <li><strong>Royal Hospital Muscat educational events</strong> — the Royal Hospital runs specialty-focused CME programs for Oman-based professionals</li>
          <li><strong>Oman College of Medicine and Health Sciences events</strong> — health science education events with CME accreditation</li>
          <li><strong>International events recognized by OMSB</strong> — AMA-PRA and EACCME-accredited international conferences attended by Oman-licensed professionals are accepted</li>
        </ul>

        <h2>Step-by-step: How to renew your OMSB license</h2>

        <h3>Step 1: Know your license expiry date</h3>
        <p>
          Log in to the OMSB professional portal to confirm your license expiry date. OMSB licenses are issued for 2 years. Make a note of the renewal date and set your own reminder 6 months before — do not rely solely on OMSB notifications.
        </p>

        <h3>Step 2: Build your CME log throughout the 2-year cycle</h3>
        <p>
          Target approximately 20 CME credits per year — or roughly 1.7 credits per month. Practically, attending one or two accredited conferences per year (each providing 8–15 credits) combined with periodic online CME modules achieves this target comfortably.
        </p>

        <h3>Step 3: Log activities in the OMSB portal</h3>
        <p>
          The OMSB professional portal is the official CME tracking system. Log each activity with the date, title, accreditor, and credit hours. Upload your certificate for each activity. Do not leave logging until the renewal period — backlogs are error-prone and slowing.
        </p>

        <h3>Step 4: Apply for renewal</h3>
        <p>
          OMSB opens the renewal window before your license expiry. Through the portal:
        </p>
        <ul>
          <li>Confirm your 40 CME credits are fully logged and verified</li>
          <li>Update current employment information (facility name, license number)</li>
          <li>Submit any required renewal documents</li>
          <li>Pay the OMSB renewal fee</li>
        </ul>

        <h3>Step 5: Receive your renewed license</h3>
        <p>
          Processing for complete applications typically takes 5–15 working days. Your renewed OMSB license is issued through the portal.
        </p>

        <h2>Oman's healthcare landscape and CME context</h2>
        <p>
          Oman's healthcare system has undergone significant expansion in recent years as part of the Oman Vision 2040 health strategy. Sultan Qaboos University Hospital and the Royal Hospital Muscat are the primary academic medical centers, with growing networks of regional hospitals in Salalah, Sohar, Ibri, Sur, and other cities.
        </p>
        <p>
          For CME purposes, this means accredited educational opportunities are concentrated in Muscat but increasingly accessible online for professionals based in regional hospitals. OMSB's acceptance of online CME from recognized providers is particularly valuable for professionals practicing outside Muscat.
        </p>

        <h2>Common OMSB renewal mistakes</h2>
        <ul>
          <li><strong>Conflating OMSB with MOH licensing.</strong> Some Oman-based professionals are licensed by the Ministry of Health (MOH) rather than OMSB — check which authority issued your license. OMSB primarily licenses specialists and postgraduate-trained professionals; MOH handles general licensing for some categories.</li>
          <li><strong>Attending international conferences without verifying OMSB accreditor recognition.</strong> A prestigious conference whose accreditor is not on OMSB's recognized list does not count.</li>
          <li><strong>Not uploading certificates promptly.</strong> Certificates for older activities can be difficult to retrieve if the provider's system changes. Upload immediately after receipt.</li>
          <li><strong>Letting the renewal window close without applying.</strong> OMSB's biennial window requires active action — the license does not auto-renew.</li>
        </ul>

        <h2>Tracking OMSB CME with Hayya Med Pro</h2>
        <p>
          Hayya Med Pro tracks OMSB CME requirements alongside QCHP, SCFHS, DHA, DOH, NHRA, and MOH Kuwait in one platform. For professionals holding licenses in multiple GCC countries — for example, Oman-based physicians who also hold SCFHS Saudi registration — log each activity once and assign it to multiple authority wallets simultaneously.
        </p>
        <p>
          The platform is free to start, with a Pro plan that adds a PDF compliance report showing your full OMSB CME history — useful during the renewal process — and AI-powered analysis identifying which credit types you still need to complete your 2-year cycle.
        </p>
      </BlogPostLayout>
    </>
  );
}

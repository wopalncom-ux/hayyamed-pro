import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";

const APP_URL = "https://hayyamed.pro";
const SLUG = "scfhs-cme-requirements-2026";

export const metadata: Metadata = {
  title: "SCFHS CME Requirements 2026: Complete Guide for Healthcare Professionals | Hayya Med Pro",
  description:
    "Everything you need to know about SCFHS CME requirements in 2026. Credit hours by profession (physicians 60, nurses 30), accepted accreditors, category caps, and how to track your progress.",
  keywords: [
    "SCFHS CME requirements 2026",
    "SCFHS CME hours",
    "Saudi Arabia CME requirements",
    "SCFHS continuing medical education",
    "how many CME credits SCFHS",
    "SCFHS license renewal CME",
    "Saudi healthcare professional CME",
    "SCFHS accredited activities",
  ],
  openGraph: {
    title: "SCFHS CME Requirements 2026: Complete Guide",
    description: "CME credit requirements by profession, accepted accreditors, category caps, and renewal process for SCFHS in Saudi Arabia.",
    url: `${APP_URL}/blog/${SLUG}`,
    type: "article",
    publishedTime: "2026-06-08",
    authors: ["Hayya Med Pro Editorial"],
  },
  twitter: { card: "summary_large_image", title: "SCFHS CME Requirements 2026: Complete Guide", description: "How many CME credits you need for SCFHS renewal, which activities count, and how to track your progress." },
  alternates: { canonical: `${APP_URL}/blog/${SLUG}` },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "SCFHS CME Requirements 2026: Complete Guide for Healthcare Professionals",
  description: "Everything you need to know about SCFHS CME requirements in 2026.",
  datePublished: "2026-06-08",
  dateModified: "2026-06-08",
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
      name: "How many CME credits does a physician need for SCFHS renewal?",
      acceptedAnswer: { "@type": "Answer", text: "Physicians registered with SCFHS must complete 60 CME credits per year. This applies to all physician specialties. The credits must come from SCFHS-approved accreditors." },
    },
    {
      "@type": "Question",
      name: "How many CME credits does a nurse need for SCFHS renewal?",
      acceptedAnswer: { "@type": "Answer", text: "Nurses registered with SCFHS must complete 30 CME credits per year. Accredited nursing education programs and conferences count toward this requirement." },
    },
    {
      "@type": "Question",
      name: "What is the maximum percentage of online CME for SCFHS?",
      acceptedAnswer: { "@type": "Answer", text: "SCFHS generally allows up to 50% of your annual CME requirement to be fulfilled through online or e-learning activities. The remaining percentage should come from in-person events, workshops, or structured activities." },
    },
  ],
};

export default function ScfhsCmeRequirements2026() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BlogPostLayout
        title="SCFHS CME Requirements 2026: Complete Guide for Healthcare Professionals"
        description="Everything healthcare professionals need to know about SCFHS CME in 2026. Credit hours by profession, accepted accreditors, category caps, and how to track your progress toward renewal."
        publishedAt="2026-06-08"
        category="country"
        readingMinutes={10}
        relatedLinks={[
          { label: "SCFHS authority guide", href: "/scfhs" },
          { label: "SCFHS renewal guide", href: "/scfhs-renewal" },
          { label: "Physician CME in GCC", href: "/physician-cme" },
          { label: "CME calculator", href: "/cme-calculator" },
          { label: "GCC CME requirements", href: "/gcc-cme-requirements" },
        ]}
      >
        <h2>What is SCFHS?</h2>
        <p>
          The Saudi Commission for Health Specialties (SCFHS) is the national authority responsible for licensing all healthcare professionals practicing in Saudi Arabia. It sets CME standards, accredits training programs, and manages license renewal for over 700,000 licensed healthcare professionals — the largest healthcare licensing body in the GCC.
        </p>
        <p>
          SCFHS uses the term <strong>CME (Continuing Medical Education)</strong> — not CPD. For SCFHS licensing purposes, CME and CPD refer to the same thing: structured learning activities that keep healthcare professionals current in their field.
        </p>

        <h2>CME requirements by profession (2026)</h2>
        <p>SCFHS CME requirements are <strong>profession-specific</strong> — unlike QCHP, which applies the same 80/2yr requirement to all professions. This is one of the most important things to understand about SCFHS:</p>

        <table>
          <thead>
            <tr>
              <th>Profession</th>
              <th>CME credits required</th>
              <th>Cycle</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Physicians (all specialties)</td><td><strong>60 credits/year</strong></td><td>Annual</td></tr>
            <tr><td>Pharmacists</td><td><strong>60 credits/year</strong></td><td>Annual</td></tr>
            <tr><td>Dentists</td><td><strong>60 credits/year</strong></td><td>Annual</td></tr>
            <tr><td>Nurses</td><td><strong>30 credits/year</strong></td><td>Annual</td></tr>
            <tr><td>Allied health professionals</td><td><strong>30 credits/year</strong></td><td>Annual</td></tr>
          </tbody>
        </table>

        <p>Note: SCFHS renewal is <strong>annual</strong>, unlike QCHP's 2-year cycle. This means you must accumulate your full CME requirement every 12 months.</p>

        <h2>Category A vs Category B CME</h2>
        <p>SCFHS classifies CME activities into two categories:</p>

        <h3>Category A: Structured educational activities</h3>
        <p>These are formal, accredited activities designed specifically for educational purposes:</p>
        <ul>
          <li>Accredited conferences, workshops, and seminars</li>
          <li>Accredited online courses and e-learning modules</li>
          <li>Hospital grand rounds (when formally SCFHS-accredited)</li>
          <li>Accredited journal reading programs</li>
          <li>Board review courses</li>
        </ul>

        <h3>Category B: Professional and academic activities</h3>
        <p>These are activities that contribute to professional development beyond structured education:</p>
        <ul>
          <li>Teaching and lecturing (medical students, residents, colleagues)</li>
          <li>Publishing peer-reviewed research (as first author or co-author)</li>
          <li>Presenting research at SCFHS-recognized conferences</li>
          <li>Serving on medical committees or professional society boards</li>
          <li>Clinical supervision and mentoring (documented)</li>
        </ul>
        <p>SCFHS places limits on how many Category B credits can count toward your annual total — check your SCFHS professional portal for current limits by profession.</p>

        <h2>Online CME limit</h2>
        <p>
          SCFHS allows <strong>up to 50% of your annual CME requirement</strong> to be completed through online or e-learning activities. For physicians (60 credits/year), this means a maximum of 30 credits can come from online sources. For nurses (30 credits/year), this means a maximum of 15 online credits.
        </p>
        <p>
          The remaining credits must come from in-person activities — conferences, workshops, or structured hospital-based education.
        </p>

        <h2>Which accreditors does SCFHS recognize?</h2>
        <p>SCFHS maintains an approved list of CME accreditors. Key recognized bodies include:</p>
        <ul>
          <li><strong>SCFHS-accredited Saudi medical societies</strong> — including Saudi Heart Association, Saudi Diabetes and Endocrinology Association, Saudi Thoracic Society, and many others</li>
          <li><strong>AMA-PRA Category 1</strong> (American Medical Association)</li>
          <li><strong>ACCME-accredited providers</strong> (Accreditation Council for CME)</li>
          <li><strong>EACCME</strong> (European Accreditation Council for CME)</li>
          <li><strong>Royal Colleges</strong> (UK, Canada, Australia)</li>
          <li><strong>Other SCFHS-recognized international bodies</strong> — check the SCFHS portal for the current complete list</li>
        </ul>
        <p>
          Activities from providers not on the SCFHS approved list do <strong>not</strong> count toward your CME requirement, even if accredited by another body.
        </p>

        <h2>How to log CME on the SCFHS portal</h2>
        <p>SCFHS provides a professional portal (komisyon.sa) where you can:</p>
        <ul>
          <li>View your current CME balance and annual requirement</li>
          <li>Log CME activities with supporting evidence</li>
          <li>Upload certificates for each activity</li>
          <li>Track progress toward your renewal deadline</li>
          <li>Apply for license renewal when you meet the requirements</li>
        </ul>
        <p>Log activities as you complete them — do not wait until renewal. Retroactive logging is permitted but slows the process if certificates are lost.</p>

        <h2>SCFHS license renewal process</h2>
        <p>SCFHS operates on an <strong>annual renewal cycle</strong>. The process:</p>
        <ol>
          <li><strong>Complete your CME requirement</strong> — 60 credits (physicians/pharmacists/dentists) or 30 credits (nurses/allied health) within the calendar year</li>
          <li><strong>Log all activities</strong> on the SCFHS professional portal with certificates uploaded</li>
          <li><strong>Apply for renewal</strong> when SCFHS opens the renewal window (typically 60–90 days before your license expiry)</li>
          <li><strong>Pay the renewal fee</strong> — fee schedules are published on the SCFHS website</li>
          <li><strong>Receive your renewed license</strong> — digitally via the SCFHS portal</li>
        </ol>

        <h2>What happens if you don't meet CME requirements?</h2>
        <p>
          If you fail to complete the required CME by your renewal date, SCFHS will not renew your license. You will need to make up the deficit before renewal can proceed. Practicing without a valid license in Saudi Arabia is a serious regulatory violation.
        </p>
        <p>
          SCFHS may also conduct random audits of CME claims. Always keep original certificates for at least the duration of one full renewal cycle after submission.
        </p>

        <h2>Common mistakes with SCFHS CME</h2>
        <ul>
          <li><strong>Exceeding the online CME cap.</strong> More than 50% online = those extra online credits don't count. You still need in-person activities.</li>
          <li><strong>Using unrecognized providers.</strong> A high-quality international conference that isn't on SCFHS's approved accreditor list does not count.</li>
          <li><strong>Confusing subspecialty requirements.</strong> Some SCFHS specialties have specific CME requirements beyond the baseline — check your specialty board.</li>
          <li><strong>Missing the renewal window.</strong> SCFHS licenses expire on a specific date. Apply early — do not wait for the last day.</li>
          <li><strong>Lost certificates.</strong> SCFHS may audit your CME claims. Keep every certificate.</li>
        </ul>

        <h2>Tracking SCFHS CME with Hayya Med Pro</h2>
        <p>
          Hayya Med Pro tracks CME requirements for SCFHS, QCHP, DHA, and all GCC authorities in one place. Log an activity once, and it automatically updates the correct wallet for your authority. The platform enforces the 50% online cap and Category B limits for your profession, so you always know your true compliant credit balance.
        </p>
      </BlogPostLayout>
    </>
  );
}

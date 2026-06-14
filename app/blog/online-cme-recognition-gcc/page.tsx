import type { Metadata } from "next";
import BlogPostLayout from "@/components/BlogPostLayout";

const APP_URL = "https://hayyamed.pro";
const SLUG = "online-cme-recognition-gcc";

export const metadata: Metadata = {
  title: "Does Online CME Count in GCC? Authority-by-Authority Guide 2026 | Hayya Med Pro",
  description:
    "Does online CME count for QCHP, SCFHS, DHA, DOH, and other GCC authorities? Complete 2026 guide with percentage caps, recognized platforms, and which online courses are accepted.",
  keywords: [
    "online CME GCC",
    "does online CME count QCHP",
    "online CME SCFHS",
    "e-learning CME GCC",
    "online CPD GCC",
    "online CME recognized DHA",
    "how much online CME GCC",
    "online CME percentage limit GCC",
    "CME online courses GCC healthcare",
  ],
  openGraph: {
    title: "Does Online CME Count in GCC? Authority-by-Authority Guide 2026",
    description: "Online CME rules for every GCC licensing authority — percentage caps, accepted platforms, and what counts for QCHP, SCFHS, DHA, DOH, and more.",
    url: `${APP_URL}/blog/${SLUG}`,
    type: "article",
    publishedTime: "2026-06-14",
    authors: ["Hayya Med Pro Editorial"],
  },
  twitter: { card: "summary_large_image", title: "Does Online CME Count in GCC? 2026 Guide", description: "Online CME rules, percentage caps, and accepted platforms for QCHP, SCFHS, DHA, DOH, and all GCC authorities." },
  alternates: { canonical: `${APP_URL}/blog/${SLUG}` },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Does Online CME Count in GCC? Authority-by-Authority Guide 2026",
  description: "Complete guide to online CME recognition across all GCC healthcare licensing authorities.",
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
      name: "Does online CME count for QCHP renewal in Qatar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, online CME counts toward QCHP CPD requirements in Qatar, provided the course is from a QCHP-recognized accreditor (AMA-PRA, EACCME, Royal Colleges, or QCHP-accredited local providers). QCHP does not publicly cap the percentage of online credits, but in-person attendance at conferences and workshops is encouraged for clinical skills.",
      },
    },
    {
      "@type": "Question",
      name: "How much of my SCFHS CME can be from online courses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SCFHS allows a maximum of 50% of your annual CME requirement to come from online or e-learning activities. For physicians (60 credits/year), a maximum of 30 credits can be online. For nurses (30 credits/year), a maximum of 15 credits can be online. The remaining credits must come from in-person activities.",
      },
    },
    {
      "@type": "Question",
      name: "Which online CME platforms are recognized by GCC authorities?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GCC authorities recognize online CME based on the accreditor, not the platform itself. Courses accredited by AMA-PRA (American Medical Association), ACCME-accredited providers, EACCME (European Accreditation Council for CME), or Royal Colleges are accepted by most GCC authorities. Always verify the specific accreditor listed on the course certificate matches your authority's approved list.",
      },
    },
    {
      "@type": "Question",
      name: "Does Coursera or Medscape CME count for QCHP or SCFHS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Some courses on Coursera or Medscape are accredited by AMA-PRA or ACCME-accredited providers, which are recognized by most GCC authorities. However, not all courses on these platforms carry recognized accreditation. Always check the specific course's accreditor and credit type before registering — the platform name alone does not determine recognition.",
      },
    },
  ],
};

export default function OnlineCmeRecognitionGcc() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BlogPostLayout
        title="Does Online CME Count in GCC? Authority-by-Authority Guide 2026"
        description="Online CME and e-learning rules for every GCC licensing authority — percentage caps, which accreditors are recognized, which platforms to use, and what actually counts toward your license renewal."
        publishedAt="2026-06-14"
        category="guide"
        readingMinutes={8}
        relatedLinks={[
          { label: "How many CME credits do I need?", href: "/blog/how-many-cme-credits-gcc" },
          { label: "CME vs CPD in GCC", href: "/blog/cme-vs-cpd-gcc" },
          { label: "SCFHS CME guide", href: "/blog/scfhs-cme-requirements-2026" },
          { label: "CME calculator", href: "/cme-calculator" },
          { label: "GCC CME requirements", href: "/gcc-cme-requirements" },
        ]}
      >
        <h2>The short answer</h2>
        <p>
          Yes, online CME counts toward license renewal requirements in every GCC country — but the amount that counts varies significantly by authority. SCFHS Saudi Arabia caps online CME at 50% of your annual requirement. QCHP Qatar and DHA Dubai accept online CME without a published hard cap, provided the accreditor is recognized.
        </p>
        <p>
          The critical factor in all cases is the <strong>accreditor, not the platform</strong>. An online course from an AMA-PRA accredited provider counts toward most GCC licenses. An online course from an unaccredited provider counts toward none of them, regardless of how well-produced the content is.
        </p>

        <h2>Online CME rules by GCC authority (2026)</h2>
        <table>
          <thead>
            <tr>
              <th>Authority</th>
              <th>Country</th>
              <th>Online CME accepted?</th>
              <th>Online cap</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>QCHP / DHP-AS</strong></td>
              <td>Qatar</td>
              <td>Yes</td>
              <td>No published hard cap — in-person encouraged for procedural skills</td>
            </tr>
            <tr>
              <td><strong>SCFHS</strong></td>
              <td>Saudi Arabia</td>
              <td>Yes</td>
              <td><strong>50% maximum</strong> (30 credits for physicians, 15 for nurses)</td>
            </tr>
            <tr>
              <td><strong>DHA</strong></td>
              <td>UAE (Dubai)</td>
              <td>Yes</td>
              <td>No published hard cap — verify via Sheryan portal per activity</td>
            </tr>
            <tr>
              <td><strong>DOH</strong></td>
              <td>UAE (Abu Dhabi)</td>
              <td>Yes</td>
              <td>No published hard cap — in-person activities required for certain professions</td>
            </tr>
            <tr>
              <td><strong>MOH Kuwait</strong></td>
              <td>Kuwait</td>
              <td>Yes (limited)</td>
              <td>In-person activities are strongly preferred; online caps apply by profession</td>
            </tr>
            <tr>
              <td><strong>NHRA</strong></td>
              <td>Bahrain</td>
              <td>Yes</td>
              <td>No published hard cap — check NHRA approved provider list</td>
            </tr>
            <tr>
              <td><strong>OMSB</strong></td>
              <td>Oman</td>
              <td>Yes</td>
              <td>No published hard cap — accreditor recognition required</td>
            </tr>
          </tbody>
        </table>

        <h2>The SCFHS 50% online rule explained</h2>
        <p>
          SCFHS is the only GCC authority with a clearly published, strictly enforced online CME cap: <strong>50% of your annual CME requirement can come from online or e-learning activities</strong>.
        </p>
        <p>
          In practice, this means:
        </p>
        <ul>
          <li><strong>Physicians (60 credits/year):</strong> Maximum 30 credits from online courses. Minimum 30 from in-person activities.</li>
          <li><strong>Pharmacists (60 credits/year):</strong> Maximum 30 credits from online courses. Minimum 30 from in-person activities.</li>
          <li><strong>Dentists (60 credits/year):</strong> Maximum 30 credits from online courses. Minimum 30 from in-person activities.</li>
          <li><strong>Nurses (30 credits/year):</strong> Maximum 15 credits from online courses. Minimum 15 from in-person activities.</li>
          <li><strong>Allied health (30 credits/year):</strong> Maximum 15 credits from online courses. Minimum 15 from in-person activities.</li>
        </ul>
        <p>
          This is one of the most common mistakes SCFHS-licensed professionals make: completing more than 50% of their credits online, then discovering at renewal that the excess online credits don't count and they are short of in-person requirements.
        </p>
        <p>
          <strong>Tip:</strong> Track your online vs. in-person credit split separately throughout the year. A CME tracker like Hayya Med Pro can enforce this cap automatically — flagging when you're approaching the 50% limit and prompting you to balance with in-person activities.
        </p>

        <h2>Which accreditors are recognized for online CME?</h2>
        <p>
          The accreditor listed on your certificate determines whether an online course counts — not the platform it was hosted on. The following accreditors are recognized for online CME by most or all GCC authorities:
        </p>

        <h3>Universally recognized (all 7 GCC authorities)</h3>
        <ul>
          <li><strong>AMA-PRA Category 1</strong> (American Medical Association Physician Recognition Award) — the most widely accepted credit type across all GCC countries</li>
          <li><strong>EACCME</strong> (European Accreditation Council for Continuing Medical Education)</li>
          <li><strong>Royal College of Physicians and Surgeons of Canada</strong></li>
          <li><strong>UK Royal Colleges</strong> (RCP London, RCS England, RCN, and others)</li>
          <li><strong>ACCME-accredited providers</strong> (Accreditation Council for Continuing Medical Education, USA)</li>
        </ul>

        <h3>Authority-specific recognized accreditors</h3>
        <ul>
          <li><strong>SCFHS-accredited Saudi medical societies</strong> — recognized by SCFHS only; may or may not be recognized by DHA or QCHP</li>
          <li><strong>QCHP-accredited local providers</strong> — recognized by QCHP; check if recognized by DHA or SCFHS</li>
          <li><strong>DHA-accredited providers</strong> — verified through the Sheryan portal</li>
          <li><strong>NHRA-approved providers</strong> — listed on the NHRA provider portal</li>
        </ul>
        <p>
          When in doubt: if the certificate says "AMA PRA Category 1 Credits™" or "EACCME credits," it will count in almost every GCC country. If it says a bespoke organization name you don't recognize, verify against your specific authority's approved list before logging the activity.
        </p>

        <h2>Popular online CME platforms: what's recognized and what's not</h2>
        <p>
          Healthcare professionals commonly ask about specific platforms. The answer is always: it depends on the specific course and its accreditor, not the platform.
        </p>

        <h3>Medscape Education (medscape.org/education)</h3>
        <p>
          Many Medscape CME courses are accredited by the Postgraduate Institute for Medicine (PIM), which is ACCME-accredited. This means AMA PRA Category 1 Credits™ — accepted by all major GCC authorities. Always check the individual course for its ACCME accreditor and credit type.
        </p>

        <h3>UpToDate CME</h3>
        <p>
          UpToDate Continuing Medical Education is ACCME-accredited, offering AMA PRA Category 1 Credits™. Accepted by QCHP, SCFHS, DHA, and most GCC authorities.
        </p>

        <h3>BMJ Learning</h3>
        <p>
          BMJ Learning courses carry Royal College of Physicians (London) CPD credits. Accepted by most GCC authorities that recognize UK Royal Colleges (QCHP, DHA, NHRA, OMSB). Check with SCFHS for specific course recognition.
        </p>

        <h3>Coursera (medical/health courses)</h3>
        <p>
          Coursera's healthcare courses vary widely in accreditation. Some carry continuing education credit from university partners; most do not carry AMA-PRA or EACCME credits. Check each course individually. A "certificate of completion" from a Coursera course without a recognized accreditor does not count for GCC CME purposes.
        </p>

        <h3>LinkedIn Learning</h3>
        <p>
          LinkedIn Learning courses do not carry recognized CME accreditation and do not count toward any GCC healthcare license renewal requirement.
        </p>

        <h3>Local GCC platforms</h3>
        <p>
          Several GCC health authorities run or accredit their own e-learning platforms:
        </p>
        <ul>
          <li><strong>SCFHS e-learning portal</strong> — directly accredited SCFHS CME, counts at face value for Saudi renewal</li>
          <li><strong>QCHP provider directory courses</strong> — QCHP-accredited local providers in Qatar run online modules</li>
          <li><strong>DHA Sheryan-linked courses</strong> — DHA-accredited providers in Dubai</li>
        </ul>
        <p>
          Local GCC platform courses are often the safest choice for authority-specific compliance — they're directly accredited and there's no question about recognition. However, they may count only toward the specific authority that accredited them (a QCHP-accredited online course may not count for SCFHS, for example).
        </p>

        <h2>How to check if an online course will count</h2>
        <p>Before registering for any online CME course, check:</p>
        <ol>
          <li><strong>Who is the accreditor?</strong> — Look for "accredited by [name]" on the course registration page. Note the full accreditor name.</li>
          <li><strong>What type of credit does it award?</strong> — "AMA PRA Category 1 Credits™," "EACCME credits," or "[Royal College] CPD points" are the most recognized.</li>
          <li><strong>Is that accreditor on your authority's approved list?</strong> — Check your specific authority's portal: QCHP portal, SCFHS komisyon.sa, DHA Sheryan, NHRA portal.</li>
          <li><strong>Will this push you past your online credit cap?</strong> — Specifically for SCFHS users: are you already at 50% online? If yes, skip this course and find in-person alternatives.</li>
        </ol>
        <p>
          If all four boxes check out, register with confidence. If any are uncertain, contact the course provider or your licensing authority before registering.
        </p>

        <h2>Online CME logistics: completing and uploading certificates</h2>
        <p>
          Most online CME courses require you to:
        </p>
        <ul>
          <li>Complete all course modules or video sessions (completion percentage is tracked)</li>
          <li>Pass a post-course assessment (typically 70–80% pass score required for CME credit)</li>
          <li>Complete a course evaluation form</li>
          <li>Request or download your CME certificate — this is issued only after all requirements are met</li>
        </ul>
        <p>
          Your CME certificate for an online course should show: your name, the course title, date of completion, accreditor name, credit type (e.g., "AMA PRA Category 1"), and number of credits. Screenshot certificates or informal "completion badges" are not sufficient — you need the formal certificate issued by the accreditor.
        </p>
        <p>
          Download every certificate immediately when it's available and upload it to your authority's portal (and your own CME tracking system). Providers sometimes retire courses and older certificates become harder to verify retroactively.
        </p>

        <h2>Practical tips for maximizing online CME</h2>
        <ul>
          <li><strong>Use a CME tracker that enforces caps.</strong> Don't manage your SCFHS 50% online cap in a spreadsheet. A dedicated tracker tells you immediately when you're approaching the limit.</li>
          <li><strong>Complete online CME during downtime.</strong> Short online modules (1–2 credits) fit into any schedule. 15 minutes a week can generate 1–2 credits per month.</li>
          <li><strong>Check accreditation before purchase.</strong> Some online CME platforms charge fees. Confirm the course is recognized before you pay.</li>
          <li><strong>Download certificates immediately.</strong> Do not wait. Platforms shut down, courses expire, and certificate retrieval becomes impossible.</li>
          <li><strong>Log activities as you complete them.</strong> A 12-month backlog of certificates to upload during renewal is a recipe for errors and stress.</li>
        </ul>
      </BlogPostLayout>
    </>
  );
}

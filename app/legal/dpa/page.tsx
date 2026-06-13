import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Data Processing Agreement — Hayya Med Pro",
  description: "Template Data Processing Agreement between Hayya Med Pro and employer organisations for healthcare professional compliance data.",
};

const LAST_UPDATED = "10 June 2026";
const PROCESSOR = "Hayya Med Pro";
const PROCESSOR_ENTITY = "Hayya Med Pro (operated by its registered operator)";
const SUPPORT_EMAIL = "support@hayyamed.pro";
const DPA_VERSION = "1.0";

export default function DpaPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-base font-bold text-[#1a56a0]">{PROCESSOR}</Link>
          <div className="flex items-center gap-4">
            <Link href="/terms"   className="text-sm text-[#64748b] hover:text-[#111]">Terms</Link>
            <Link href="/privacy" className="text-sm text-[#64748b] hover:text-[#111]">Privacy</Link>
            <PrintButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-[#e2e8f0] px-8 py-10 prose prose-sm max-w-none">

          <div className="text-center mb-10 not-prose">
            <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-widest mb-3">Legal Document</p>
            <h1 className="text-3xl font-bold text-[#111] mb-2">Data Processing Agreement</h1>
            <p className="text-sm text-[#64748b]">Version {DPA_VERSION} · Last updated {LAST_UPDATED}</p>
          </div>

          <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-xl p-5 mb-8 not-prose">
            <p className="text-sm text-[#1e3a5f] font-medium mb-1">For Employer Organisations</p>
            <p className="text-sm text-[#374151]">
              This Data Processing Agreement (&ldquo;DPA&rdquo;) governs the processing of personal data by {PROCESSOR}
              on behalf of your organisation. It must be signed before your organisation accesses the
              compliance data of any linked healthcare professional.
              Contact <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#1a56a0] underline">{SUPPORT_EMAIL}</a> to
              execute a signed copy.
            </p>
          </div>

          <Section title="1. Definitions">
            <p>In this Agreement:</p>
            <ul>
              <li><strong>Controller</strong> means the employer organisation that determines the purposes and means of processing personal data of its healthcare professional staff.</li>
              <li><strong>Processor</strong> means {PROCESSOR_ENTITY}, which processes personal data on behalf of the Controller.</li>
              <li><strong>Data Subject</strong> means the individual healthcare professional whose personal data is processed.</li>
              <li><strong>Personal Data</strong> has the meaning given in Qatar Law No. 13 of 2016 on Personal Data Protection (PDPL) and, where applicable, the EU General Data Protection Regulation (GDPR).</li>
              <li><strong>Processing</strong> means any operation performed on personal data, including collection, storage, use, disclosure, or deletion.</li>
              <li><strong>Services</strong> means the {PROCESSOR} platform including CME tracking, compliance monitoring, license management, and employer compliance dashboards.</li>
              <li><strong>Sub-processor</strong> means any third-party processor engaged by the Processor to assist in providing the Services.</li>
            </ul>
          </Section>

          <Section title="2. Subject Matter and Duration">
            <p>
              The Processor processes personal data on behalf of the Controller solely for the purpose of
              providing the Services as described in the applicable Master Services Agreement or subscription terms.
              This DPA remains in effect for the duration of the Services agreement and terminates automatically
              upon its expiry or termination.
            </p>
          </Section>

          <Section title="3. Categories of Personal Data and Purposes of Processing">
            <p>The Processor processes the following categories of personal data on behalf of the Controller:</p>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Data Elements</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Identity Data</td>
                  <td>Full name, profession, specialty, date of birth, nationality</td>
                  <td>Professional profile management</td>
                </tr>
                <tr>
                  <td>Contact Data</td>
                  <td>Email address, mobile number</td>
                  <td>Account management, compliance notifications</td>
                </tr>
                <tr>
                  <td>Professional Credentials</td>
                  <td>License number, licensing authority, license expiry date</td>
                  <td>License readiness tracking and renewal alerts</td>
                </tr>
                <tr>
                  <td>CME / CPD Records</td>
                  <td>Activity titles, dates, credit values, verification status, certificates</td>
                  <td>Continuing education compliance tracking</td>
                </tr>
                <tr>
                  <td>Compliance Status</td>
                  <td>Computed compliance status, credits completed vs required</td>
                  <td>Employer compliance reporting (with data subject consent)</td>
                </tr>
                <tr>
                  <td>Employment Data</td>
                  <td>Organisation link status, department assignment</td>
                  <td>Employer dashboard and workforce compliance management</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-[#64748b] mt-2">
              <strong>Important:</strong> Employer access to individual compliance data is subject to explicit consent
              granted by each data subject through the platform privacy settings. The Processor does not grant
              employer access to any data element for which consent has not been given.
            </p>
          </Section>

          <Section title="4. Processor Obligations">
            <p>The Processor agrees to:</p>
            <ul>
              <li>Process personal data only on the documented instructions of the Controller, except where required to do so by applicable law.</li>
              <li>Ensure that persons authorised to process personal data are bound by confidentiality obligations.</li>
              <li>Implement appropriate technical and organisational security measures in accordance with Clause 7 of this Agreement.</li>
              <li>Not engage any new sub-processor without prior written notification to the Controller.</li>
              <li>Assist the Controller in fulfilling its obligations to respond to data subject requests within legally required timeframes.</li>
              <li>Notify the Controller without undue delay upon becoming aware of a personal data breach that affects data processed under this Agreement.</li>
              <li>At the choice of the Controller, delete or return all personal data upon termination of the Services, and delete existing copies unless retention is required by applicable law.</li>
              <li>Make available to the Controller all information necessary to demonstrate compliance with the obligations set out in this DPA.</li>
            </ul>
          </Section>

          <Section title="5. Controller Obligations">
            <p>The Controller agrees to:</p>
            <ul>
              <li>Ensure it has a lawful basis for the processing activities described in this DPA, including obtaining valid consent from data subjects where required.</li>
              <li>Provide clear and accurate processing instructions to the Processor.</li>
              <li>Inform data subjects of the processing of their personal data in accordance with applicable data protection law.</li>
              <li>Ensure that any employer-side access credentials are kept confidential and not shared with unauthorised persons.</li>
              <li>Notify the Processor promptly of any changes that affect the lawfulness of processing.</li>
            </ul>
          </Section>

          <Section title="6. Sub-processors">
            <p>
              The Controller grants general authorisation for the Processor to engage sub-processors.
              The Processor currently uses the following sub-processors in the delivery of the Services:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Sub-processor</th>
                  <th>Purpose</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Supabase Inc.</td>
                  <td>Database hosting, authentication, file storage</td>
                  <td>EU (AWS Frankfurt)</td>
                </tr>
                <tr>
                  <td>Google Cloud Platform</td>
                  <td>Application hosting (Cloud Run)</td>
                  <td>Middle East (Qatar — me-central1)</td>
                </tr>
                <tr>
                  <td>Postmark (Wildbit LLC)</td>
                  <td>Transactional email delivery</td>
                  <td>United States</td>
                </tr>
                <tr>
                  <td>Anthropic PBC</td>
                  <td>AI compliance analysis (anonymised inputs only)</td>
                  <td>United States</td>
                </tr>
                <tr>
                  <td>Paddle.com</td>
                  <td>Subscription billing and payment processing</td>
                  <td>United Kingdom</td>
                </tr>
              </tbody>
            </table>
            <p>
              The Processor will notify the Controller at least 14 days before engaging any new sub-processor.
              The Controller may object to such engagement in writing within that period.
            </p>
          </Section>

          <Section title="7. Security Measures">
            <p>
              The Processor implements the following technical and organisational measures to protect personal data:
            </p>
            <ul>
              <li><strong>Encryption in transit:</strong> All data transmitted over public networks uses TLS 1.2 or higher. HSTS enforced on all endpoints.</li>
              <li><strong>Encryption at rest:</strong> Database storage encrypted at rest by the hosting provider (AES-256).</li>
              <li><strong>Access control:</strong> Row-level security (RLS) enforced at the database layer. Role-based access (professional, employer_admin, master_admin). Admin operations require two-factor authentication.</li>
              <li><strong>Certificate storage:</strong> Professional certificates stored in private object storage. Access via time-limited signed URLs (maximum 1-hour validity). No public URLs.</li>
              <li><strong>Audit logging:</strong> All data access and modification events logged with actor identity, timestamp, and action. Logs retained for 7 years and cannot be modified or deleted.</li>
              <li><strong>Vulnerability management:</strong> Dependencies scanned on every build. OWASP Top 10 self-audit completed pre-launch. Annual penetration testing planned.</li>
              <li><strong>Incident response:</strong> Documented incident response procedure with 72-hour breach notification capability.</li>
            </ul>
          </Section>

          <Section title="8. Data Subject Rights">
            <p>
              The Processor will assist the Controller in responding to data subject requests regarding access,
              rectification, erasure, restriction, portability, and objection within the legally required timeframe.
              Data subjects may also contact the Processor directly at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> for requests relating to data processed by the platform.
            </p>
            <p>
              Data subjects may delete their own account and associated personal data directly through the platform
              Settings page. Account deletion cascades to all associated records. Audit logs are retained for
              compliance purposes as permitted by applicable law.
            </p>
          </Section>

          <Section title="9. Data Retention and Deletion">
            <p>
              Personal data processed under this Agreement will be retained for the duration of the Services
              agreement and for a reasonable period thereafter to facilitate any transition or export requests.
              Upon termination, the Controller may request export of its data in machine-readable format
              (CSV / JSON) within 30 days of termination. After export or 90 days from termination (whichever
              is earlier), personal data will be deleted, except where retention is required by applicable law.
              Audit logs are retained for 7 years as required by platform compliance policy.
            </p>
          </Section>

          <Section title="10. International Data Transfers">
            <p>
              Some personal data may be transferred to sub-processors located outside Qatar and the GCC.
              Where such transfers occur, the Processor ensures an adequate level of protection through one
              or more of the following mechanisms:
            </p>
            <ul>
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>Adequacy decisions by relevant supervisory authorities</li>
              <li>Appropriate contractual protections with sub-processors</li>
            </ul>
            <p>
              AI processing via Anthropic uses anonymised inputs only — no personally identifiable information
              (name, license number, email, date of birth) is included in prompts sent to external AI APIs.
            </p>
          </Section>

          <Section title="11. Breach Notification">
            <p>
              The Processor will notify the Controller without undue delay, and no later than 72 hours after
              becoming aware of a personal data breach that is likely to result in a risk to the rights and
              freedoms of data subjects. The notification will include, to the extent known: the nature of the
              breach, categories and approximate number of data subjects affected, likely consequences, and
              measures taken or proposed. The Processor will also cooperate fully with the Controller in
              any regulatory notifications required by applicable law.
            </p>
          </Section>

          <Section title="12. Audit Rights">
            <p>
              The Controller may, upon providing 30 days&apos; written notice and at its own expense, audit the
              Processor&apos;s compliance with this DPA, or request that the Processor provide a summary of its
              most recent third-party security assessment. Audits shall not be conducted more than once per
              calendar year unless required following a confirmed security incident.
            </p>
          </Section>

          <Section title="13. Liability and Indemnity">
            <p>
              Each party shall be liable for the damages caused by its own processing that infringes applicable
              data protection law. The Processor&apos;s liability under this DPA shall be subject to any limitations
              set out in the applicable Master Services Agreement between the parties.
            </p>
          </Section>

          <Section title="14. Governing Law">
            <p>
              This DPA is governed by the laws of Qatar. For Employers located in the European Union or
              United Kingdom, EU GDPR or UK GDPR (as applicable) takes precedence over this DPA to the
              extent of any inconsistency.
            </p>
          </Section>

          <Section title="15. Execution">
            <p>
              This DPA takes effect when a signed copy is exchanged between the parties. For enterprise and
              employer accounts, please contact{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#1a56a0] underline">{SUPPORT_EMAIL}</a> to
              initiate the DPA execution process.
            </p>
          </Section>

          <div className="mt-10 pt-6 border-t border-[#e2e8f0] not-prose">
            <p className="text-xs text-[#94a3b8]">
              {PROCESSOR} · Data Processing Agreement · Version {DPA_VERSION} · {LAST_UPDATED}
            </p>
            <p className="text-xs text-[#94a3b8] mt-1">
              Questions? Email <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#1a56a0] hover:underline">{SUPPORT_EMAIL}</a>
            </p>
            <div className="flex gap-4 mt-3">
              <Link href="/terms"   className="text-xs text-[#1a56a0] hover:underline">Terms of Service</Link>
              <Link href="/privacy" className="text-xs text-[#1a56a0] hover:underline">Privacy Policy</Link>
              <Link href="/"        className="text-xs text-[#1a56a0] hover:underline">Home</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold text-[#111] mb-3">{title}</h2>
      <div className="text-sm text-[#374151] leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Service Level Agreement — Hayya Med Pro",
  description:
    "Hayya Med Pro SLA — platform availability targets, support response times, maintenance windows, and remedies for enterprise and hospital accounts.",
  alternates: { canonical: "https://hayyamed.pro/legal/sla" },
};

const LAST_UPDATED = "22 June 2026";
const SLA_VERSION = "1.0";
const SUPPORT_EMAIL = "support@hayyamed.pro";
const ENTERPRISE_EMAIL = "enterprise@hayyamed.pro";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-20">
      <h2 className="text-lg font-bold text-[#0f1f3d] mb-4 border-b border-[#e2e8f0] pb-2">{title}</h2>
      <div className="space-y-4 text-sm text-[#374151] leading-relaxed">{children}</div>
    </section>
  );
}

function Table({ rows, headers }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#e2e8f0]">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-[#f8fafc]">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#374151] uppercase tracking-wide border-b border-[#e2e8f0]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f1f5f9]">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-[#f8fafc] transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-[#374151]">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SlaPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-[#e2e8f0] print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</Link>
          <div className="flex items-center gap-4">
            <Link href="/legal/dpa"  className="text-sm text-[#64748b] hover:text-[#111]">DPA</Link>
            <Link href="/terms"      className="text-sm text-[#64748b] hover:text-[#111]">Terms</Link>
            <Link href="/privacy"    className="text-sm text-[#64748b] hover:text-[#111]">Privacy</Link>
            <Link href="/developers" className="text-sm text-[#64748b] hover:text-[#111]">API</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1a56a0] text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Version {SLA_VERSION} · Effective {LAST_UPDATED}
          </div>
          <h1 className="text-3xl font-bold text-[#0f1f3d] mb-3">Service Level Agreement</h1>
          <p className="text-base text-[#64748b] leading-relaxed max-w-2xl">
            This Service Level Agreement (<strong>"SLA"</strong>) defines the availability commitments, support
            response targets, and remedies provided by <strong>Hayya Med Pro</strong> (<strong>"Service Provider"</strong>)
            to customers on Employer, University, Government, and Enterprise plans (<strong>"Customer"</strong>).
          </p>
          <div className="mt-6 p-4 bg-[#fef3c7] border border-[#fde68a] rounded-xl">
            <p className="text-sm text-[#92400e]">
              <strong>Healthcare note:</strong> Hayya Med Pro is a compliance tracking and workforce management
              platform. It does not issue licenses and does not replace official licensing authorities.
              This SLA covers platform availability, not the accuracy of external regulatory data.
            </p>
          </div>
        </div>

        <Section id="definitions" title="1. Definitions">
          <ul className="space-y-2">
            {[
              ["Uptime",        "The percentage of time the Hayya Med Pro platform (hayyamed.pro) is accessible and operational within a calendar month, excluding Scheduled Maintenance."],
              ["Downtime",      "Any period during which the platform is unavailable or returns HTTP 5xx errors for more than 50% of requests over a 5-minute window."],
              ["Response Time", "Time from when a support request is received to when a substantive response (not an automated acknowledgment) is provided."],
              ["Resolution Time","Time from when a support request is received to when the underlying issue is fully resolved or a workaround is provided."],
              ["Incident",      "An unplanned interruption to the Service or degradation in Service quality."],
              ["Scheduled Maintenance","Planned maintenance notified to the Customer at least 48 hours in advance. Does not count toward Downtime."],
              ["Emergency Maintenance","Unplanned maintenance required to address an active security incident or imminent data risk. Notification given as soon as practicable."],
            ].map(([term, def]) => (
              <li key={term} className="flex gap-3">
                <span className="font-semibold text-[#0f1f3d] w-44 flex-shrink-0">{term}</span>
                <span>{def}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="availability" title="2. Availability Commitment">
          <p>
            Hayya Med Pro commits to the following monthly Uptime targets for each plan tier.
            Uptime is measured from our external uptime monitoring service (60-second check intervals).
          </p>
          <Table
            headers={["Plan", "Monthly Uptime Target", "Maximum Monthly Downtime", "Measurement"]}
            rows={[
              ["Pro (individual)",    "99.5%",  "~3 h 39 min",   "Calendar month"],
              ["Employer",            "99.7%",  "~2 h 12 min",   "Calendar month"],
              ["University",          "99.7%",  "~2 h 12 min",   "Calendar month"],
              ["Government",          "99.9%",  "~43 min",        "Calendar month"],
              ["Enterprise (custom)", "99.9%+", "Per MSA",        "Per MSA"],
            ]}
          />
          <p className="text-xs text-[#64748b]">
            Uptime calculations exclude Scheduled Maintenance windows and force-majeure events
            (power grid failures, internet backbone outages, acts of government).
          </p>
        </Section>

        <Section id="api" title="3. API Performance Targets">
          <p>
            The following performance targets apply to the Hayya Med Pro REST API (v1) used by
            Employer, University, and Government integrations.
          </p>
          <Table
            headers={["Endpoint Category", "p50 Target", "p95 Target", "p99 Target"]}
            rows={[
              ["Staff / Faculty list",    "< 200 ms", "< 500 ms", "< 1 000 ms"],
              ["Compliance status",       "< 300 ms", "< 600 ms", "< 1 200 ms"],
              ["Registry (Government)",   "< 400 ms", "< 800 ms", "< 2 000 ms"],
              ["Webhook delivery",        "< 10 s",   "< 30 s",   "< 60 s"],
            ]}
          />
          <p className="text-xs text-[#64748b]">
            Latency measured server-side at the GCP Cloud Run instance (me-central1, Doha, Qatar).
            Network latency between the Customer's servers and GCP is not included.
          </p>
        </Section>

        <Section id="support" title="4. Support Tiers & Response Times">
          <Table
            headers={["Plan", "Channel", "Initial Response", "Resolution Target", "Hours"]}
            rows={[
              ["Pro",         "Email",              "24 hours",  "5 business days",  "Business hours (GST)"],
              ["Employer",    "Email + Chat",        "8 hours",   "2 business days",  "Business hours (GST)"],
              ["University",  "Email + Chat",        "8 hours",   "2 business days",  "Business hours (GST)"],
              ["Government",  "Email + Chat + Phone","4 hours",   "1 business day",   "Extended (07:00–22:00 GST)"],
              ["Enterprise",  "Dedicated CSM",       "1 hour",    "Per MSA",          "24/7 for Sev-1"],
            ]}
          />

          <div className="mt-5 space-y-4">
            <div>
              <p className="font-semibold text-[#0f1f3d] mb-2">Severity Definitions</p>
              <Table
                headers={["Severity", "Definition", "Example"]}
                rows={[
                  ["Sev-1 (Critical)", "Service is completely unavailable or there is a confirmed data breach.", "Platform returns 503; database unreachable; GDPR-reportable incident"],
                  ["Sev-2 (High)",     "Core features are significantly degraded for a large number of users.", "CME activity submission failing; compliance scores not updating"],
                  ["Sev-3 (Medium)",   "Non-core features affected or workaround available.", "PDF report slow; webhook delivery delayed"],
                  ["Sev-4 (Low)",      "Minor issue with no user impact or a feature request.", "UI alignment; new endpoint request"],
                ]}
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl text-sm">
            <p className="font-semibold text-[#15803d] mb-1">How to contact support</p>
            <ul className="space-y-1 text-[#374151]">
              <li>General: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#1a56a0] underline">{SUPPORT_EMAIL}</a></li>
              <li>Enterprise / government: <a href={`mailto:${ENTERPRISE_EMAIL}`} className="text-[#1a56a0] underline">{ENTERPRISE_EMAIL}</a></li>
              <li>Urgent (Sev-1 Enterprise): include <strong>[SEV-1]</strong> in the subject line for priority routing</li>
            </ul>
          </div>
        </Section>

        <Section id="maintenance" title="5. Maintenance Windows">
          <Table
            headers={["Type", "Typical Schedule", "Notice Given", "Notification Channel"]}
            rows={[
              ["Scheduled",  "Sundays 02:00–04:00 GST (UTC+3)", "≥ 48 hours",  "In-app banner + status page + email"],
              ["Emergency",  "As required",                       "ASAP",        "Status page + email (Employer+ plans)"],
            ]}
          />
          <p>
            Customers can subscribe to real-time status updates at{" "}
            <Link href="/status" className="text-[#1a56a0] underline">hayyamed.pro/status</Link>.
            Government and Enterprise customers receive push notifications to a designated operations
            email address for all maintenance events.
          </p>
        </Section>

        <Section id="remedies" title="6. SLA Remedies (Service Credits)">
          <p>
            If Hayya Med Pro fails to meet the Uptime commitment in any calendar month, the Customer
            is entitled to a Service Credit against their next invoice, applied automatically upon
            written request submitted within 30 days of the end of the affected month.
          </p>
          <Table
            headers={["Actual Monthly Uptime", "Service Credit (% of Monthly Fee)"]}
            rows={[
              ["≥ 99.9% (Government / Enterprise SLA)", "None — SLA met"],
              ["99.5% – 99.89%",                        "5%"],
              ["99.0% – 99.49%",                        "10%"],
              ["95.0% – 98.99%",                        "20%"],
              ["< 95.0%",                               "30%"],
            ]}
          />
          <div className="space-y-2">
            <p className="font-medium text-[#0f1f3d]">Exclusions — the following do not count as Downtime:</p>
            <ul className="list-disc pl-5 space-y-1 text-[#374151]">
              <li>Scheduled Maintenance within the notified window</li>
              <li>Customer-caused outages (invalid API keys, IP blocks, misconfigured HRIS)</li>
              <li>Third-party service failures outside Hayya Med Pro control (Supabase, GCP, Cloudflare global outages)</li>
              <li>Force-majeure events (war, natural disaster, government action)</li>
              <li>Beta or preview features explicitly marked as not covered by this SLA</li>
            </ul>
          </div>
          <p className="text-xs text-[#64748b]">
            Service Credits are the Customer's sole remedy for SLA breaches. Credits do not
            constitute a waiver of any other rights under the Master Subscription Agreement.
          </p>
        </Section>

        <Section id="data-residency" title="7. Data Residency & Security">
          <Table
            headers={["Item", "Commitment"]}
            rows={[
              ["Application region",     "GCP me-central1 (Doha, Qatar)"],
              ["Database region",        "Managed database infrastructure outside the GCC region — contact us to discuss in-region data residency requirements"],
              ["Encryption in transit",  "TLS 1.2+ for all connections — TLS 1.3 preferred"],
              ["Encryption at rest",     "AES-256 at rest for all Postgres data, via the database provider's infrastructure"],
              ["Access control",         "Row-Level Security (RLS) enforced on every database table"],
              ["Audit logging",          "All admin and employer actions logged; 7-year retention; append-only"],
              ["Certificate storage",    "Private GCS bucket; signed URLs only; 1-hour expiry"],
              ["Incident notification",  "Sev-1 security incidents notified to Customer within 72 hours (GDPR Art. 33)"],
            ]}
          />
        </Section>

        <Section id="monitoring" title="8. Monitoring & Transparency">
          <ul className="space-y-2">
            <li><strong>External uptime monitoring:</strong> 60-second checks from multiple global locations via a third-party monitoring service.</li>
            <li><strong>Public status page:</strong> <Link href="/status" className="text-[#1a56a0] underline">hayyamed.pro/status</Link> — live and historical uptime, open incidents, maintenance schedule.</li>
            <li><strong>Monthly uptime reports:</strong> Government and Enterprise customers receive a monthly SLA performance report by email by the 5th of the following month.</li>
            <li><strong>Incident post-mortems:</strong> Sev-1 and Sev-2 incidents receive a written post-mortem within 5 business days of resolution, shared with affected Employer-tier and above customers.</li>
          </ul>
        </Section>

        <Section id="enterprise" title="9. Enterprise & Government Additions">
          <p>
            Enterprise and Government customers may negotiate additional SLA terms in a{" "}
            <Link href="/legal/dpa" className="text-[#1a56a0] underline">Master Subscription Agreement (MSA)</Link>{" "}
            and corresponding Schedule. Additional provisions may include:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Custom uptime targets above 99.9%</li>
            <li>Dedicated GCP project with Customer-managed encryption keys (CMEK)</li>
            <li>Named Technical Account Manager (TAM)</li>
            <li>Quarterly business reviews (QBR) with executive-level reporting</li>
            <li>White-label or sub-domain deployment</li>
            <li>Custom data retention periods beyond 7-year default</li>
            <li>On-premise or GCC private cloud deployment (roadmap — Phase 3)</li>
          </ul>
          <div className="mt-4 p-4 bg-[#0f1f3d] rounded-xl">
            <p className="text-sm text-white mb-1 font-semibold">Hospital and government procurement</p>
            <p className="text-sm text-[#8ea5c8] mb-3">
              We support formal procurement requirements including RFP responses, vendor security
              questionnaires, and reference site visits. Contact our enterprise team.
            </p>
            <a href={`mailto:${ENTERPRISE_EMAIL}`} className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors inline-block">
              Contact enterprise team →
            </a>
          </div>
        </Section>

        <Section id="changelog" title="10. SLA Changelog">
          <Table
            headers={["Version", "Date", "Summary of Changes"]}
            rows={[
              ["1.0", "22 June 2026", "Initial SLA — covers Employer, University, Government, and Enterprise plans."],
            ]}
          />
        </Section>

        {/* Footer */}
        <div className="border-t border-[#e2e8f0] pt-8 mt-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#64748b]">
                Hayya Med Pro · Version {SLA_VERSION} · Last updated {LAST_UPDATED}
              </p>
              <p className="text-xs text-[#94a3b8] mt-1">
                Questions?{" "}
                <a href={`mailto:${ENTERPRISE_EMAIL}`} className="text-[#1a56a0] underline">
                  {ENTERPRISE_EMAIL}
                </a>
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/legal/dpa"  className="text-[#1a56a0] hover:underline">DPA</Link>
              <Link href="/terms"      className="text-[#1a56a0] hover:underline">Terms</Link>
              <Link href="/privacy"    className="text-[#1a56a0] hover:underline">Privacy</Link>
              <Link href="/security"   className="text-[#1a56a0] hover:underline">Security</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

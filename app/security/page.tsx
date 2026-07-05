import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Security & Data Protection — Hayya Med Pro",
  description:
    "Hayya Med Pro security architecture for healthcare data: Qatar PDPL compliance, GCP me-central1 data residency, row-level security, private certificate storage, AI privacy controls, and audit logging. Built for hospital enterprise procurement.",
  keywords: [
    "Hayya Med Pro security",
    "CME tracker data security",
    "Qatar PDPL compliance",
    "healthcare data security GCC",
    "CME tracking HIPAA equivalent",
    "GCP healthcare data Qatar",
    "hospital CME software security",
    "healthcare SaaS data protection",
  ],
  openGraph: {
    title: "Security & Data Protection — Hayya Med Pro",
    description: "Healthcare-grade data security for GCC CME tracking. PDPL compliance, Qatar data residency, row-level security, and full audit logging.",
    url: `${APP_URL}/security`,
    type: "website",
  },
  alternates: { canonical: `${APP_URL}/security` },
};

const SECURITY_SECTIONS = [
  {
    icon: "🏛",
    title: "Data residency — Qatar (GCC)",
    body: "All data is stored and processed in Google Cloud Platform's me-central1 region, located in Doha, Qatar. Healthcare professional records, CME activity data, and certificate files never leave the GCC region. This satisfies Qatar PDPL data residency requirements and supports hospital procurement teams operating under Qatar government data sovereignty policies.",
    tags: ["GCP me-central1 (Doha)", "Qatar data residency", "No cross-border data transfer"],
  },
  {
    icon: "🔒",
    title: "Row-level security on every table",
    body: "Every database table in Hayya Med Pro is protected by PostgreSQL Row-Level Security (RLS). No query — from any part of the application — can access data belonging to another user. This is enforced at the database level, not the application level, meaning a bug in the application code cannot bypass the access control. Employer compliance data is only accessible to that employer's authorized administrators.",
    tags: ["PostgreSQL RLS on every table", "Zero-trust data access", "No application-layer bypass"],
  },
  {
    icon: "📄",
    title: "Certificate storage — private bucket, signed URLs",
    body: "CME and CPD certificates uploaded by healthcare professionals are stored in a private Google Cloud Storage bucket. Files are never publicly accessible. Access is granted only via time-limited signed URLs that expire after 1 hour — ensuring that even if a URL is shared accidentally, it cannot be accessed after expiry. Certificate storage paths are protected against directory traversal attacks.",
    tags: ["Private GCS bucket", "1-hour signed URL expiry", "Path traversal protection"],
  },
  {
    icon: "🔐",
    title: "Authentication & access control",
    body: "Hayya Med Pro uses Supabase Auth for all authentication flows — including secure token management, session refresh, and email verification. Every API route begins with `supabase.auth.getUser()` — there are no unauthenticated routes that access personal data. Admin and employer routes additionally verify the user's role against the organization_members table before any data operation. Multi-factor authentication (MFA) is available for all accounts.",
    tags: ["Supabase Auth", "MFA supported", "Role-based access control", "Server-side auth verification on every route"],
  },
  {
    icon: "🤖",
    title: "AI privacy — no PII in prompts",
    body: "Hayya Med Pro uses AI (Google Gemini via Vertex AI) for compliance gap analysis and renewal prediction. All AI calls are anonymized — only a professional_id identifier (not name, license number, or contact details) is passed to the AI model. No personally identifiable information is included in any prompt sent to an external AI API. Every AI call is logged with model, token count, latency, and the anonymized professional_id — never with the professional's personal data.",
    tags: ["No PII in AI prompts", "Anonymized professional_id only", "Google Vertex AI (GCP — in-region)", "Every AI call logged"],
  },
  {
    icon: "📋",
    title: "Audit logging — append-only, 7-year retention",
    body: "Every administrative action, employer data access event, and AI call is recorded in an append-only audit log. Audit log entries cannot be modified or deleted by any user — including administrators. Logs are retained for a minimum of 7 years, satisfying Qatar PDPL and GCC healthcare data retention requirements. Hospital procurement teams requiring audit trail evidence can request a log export for their records.",
    tags: ["Append-only audit log", "7-year retention", "Admin and employer actions logged", "AI call logging"],
  },
  {
    icon: "🏥",
    title: "Employer data separation",
    body: "Employer accounts access staff compliance data only for professionals who have explicitly linked their account to that employer and enabled employer visibility in their privacy settings. Employers see compliance status — not raw CME activity details — unless the professional has granted full access. Profile privacy settings are controlled entirely by the healthcare professional.",
    tags: ["Professional controls employer visibility", "Privacy settings per professional", "Compliance status vs activity detail separation"],
  },
  {
    icon: "🛡",
    title: "Infrastructure & application security",
    body: "Hayya Med Pro is deployed on Google Cloud Run with containerized deployments, HTTPS-only access, and environment-based secret management via GCP Secret Manager. API keys and service credentials are never hardcoded or exposed to the client. All user-supplied input is validated server-side via Zod schema validation before any database operation. Rate limiting is applied on authentication, AI, and webhook endpoints.",
    tags: ["GCP Cloud Run", "GCP Secret Manager", "Zod input validation", "Rate limiting on auth and AI endpoints"],
  },
];

const COMPLIANCE_ITEMS = [
  {
    standard: "Qatar PDPL (Law No. 13 of 2016)",
    status: "Compliant",
    note: "Data residency in Qatar (GCP me-central1 Doha), consent-based data processing, data subject rights supported.",
  },
  {
    standard: "SOC 2 Type II",
    status: "Roadmap — Year 2",
    note: "SOC 2 controls in place. Formal audit and certification planned for Year 2 of operation.",
  },
  {
    standard: "ISO 27001",
    status: "Roadmap — Year 3",
    note: "Information security management system implementation planned for Year 3.",
  },
  {
    standard: "OWASP Top 10",
    status: "Mitigated",
    note: "Security controls address all OWASP Top 10 vulnerabilities including injection, broken auth, XSS, and CSRF.",
  },
  {
    standard: "GCC Data Residency",
    status: "Compliant",
    note: "All healthcare professional data stored in Qatar (GCP me-central1). No cross-border transfer.",
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center"><span className="text-white text-sm font-bold">H</span></div>
            <span className="font-bold text-base text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/request-demo" className="text-sm text-[#64748b] hover:text-[#111] font-medium">Request demo</Link>
            <Link href="/register" className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors">Start free →</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-14 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            Built for hospital enterprise procurement
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#111] tracking-tight mb-5">
            Healthcare-grade security.<br />Qatar data residency.
          </h1>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-8">
            Hayya Med Pro is built to meet the security and data protection requirements of GCC hospitals, government health authorities, and enterprise procurement teams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/request-demo" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#154890] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors">
              Request security documentation
            </Link>
            <Link href="/register" className="text-sm font-medium text-[#64748b] hover:text-[#111] px-4 py-3.5">
              Start free →
            </Link>
          </div>
        </section>

        {/* Compliance status bar */}
        <section className="bg-white border-y border-[#e2e8f0] py-8">
          <div className="max-w-5xl mx-auto px-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Standard</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {COMPLIANCE_ITEMS.map((item) => (
                    <tr key={item.standard}>
                      <td className="px-4 py-3 text-sm font-semibold text-[#111]">{item.standard}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          item.status === "Compliant" || item.status === "Mitigated"
                            ? "bg-[#f0fdf4] text-[#166534]"
                            : "bg-[#fff7ed] text-[#9a3412]"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#64748b]">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Security sections */}
        <section className="max-w-5xl mx-auto px-6 py-14">
          <div className="grid sm:grid-cols-2 gap-6">
            {SECURITY_SECTIONS.map((s) => (
              <div key={s.title} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <div className="text-2xl mb-3">{s.icon}</div>
                <h2 className="text-lg font-bold text-[#111] mb-2">{s.title}</h2>
                <p className="text-sm text-[#64748b] leading-relaxed mb-4">{s.body}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium bg-[#f8fafc] border border-[#e2e8f0] text-[#374151] px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Responsible disclosure */}
        <section className="bg-white border-t border-[#e2e8f0] py-12">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-[#111] mb-3">Responsible disclosure</h2>
            <p className="text-[#64748b] mb-6">
              We welcome responsible disclosure of security vulnerabilities from security researchers. If you discover a vulnerability, please contact us at{" "}
              <span className="font-semibold text-[#1a56a0]">security@hayyamed.pro</span> with a detailed description. We commit to acknowledging reports within 48 hours and resolving critical issues within 72 hours.
            </p>
            <p className="text-sm text-[#64748b]">
              We do not pursue legal action against researchers who discover and responsibly disclose vulnerabilities in good faith.
            </p>
          </div>
        </section>

        {/* Enterprise CTA */}
        <section className="bg-[#0f1f3d] py-14">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Need security documentation for procurement?</h2>
            <p className="text-[#64748b] mb-7 max-w-md mx-auto">
              We provide security questionnaire responses, architecture documentation, and data processing agreements (DPA) for hospital and government procurement reviews. Request a demo to speak with our team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/request-demo" className="inline-flex items-center gap-2 bg-[#1a56a0] hover:bg-[#1d4ed8] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors">
                Request security documentation
              </Link>
              <Link href="/contact" className="text-sm font-medium text-[#64748b] hover:text-white px-4 py-3.5 transition-colors">
                Contact us →
              </Link>
            </div>
          </div>
        </section>

        {/* Related links */}
        <section className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "How it works", href: "/how-it-works" },
              { label: "Pricing", href: "/pricing" },
              { label: "For hospitals", href: "/for-hospitals" },
              { label: "For employers", href: "/employers" },
              { label: "Privacy policy", href: "/privacy" },
              { label: "Data Processing Agreement", href: "/legal/dpa" },
              { label: "Request a demo", href: "/request-demo" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-[#1a56a0] hover:underline bg-[#eff6ff] px-3 py-1.5 rounded-lg">{l.label}</Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

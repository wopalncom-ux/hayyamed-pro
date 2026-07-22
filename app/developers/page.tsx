import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

const APP_URL = "https://hayyamed.pro";

export const metadata: Metadata = {
  title: "Hayya Med Pro API — Developer Documentation",
  description:
    "REST API for HRIS integration, staff compliance reporting, and healthcare workforce management. Connect your hospital, university, or government system to Hayya Med Pro.",
  alternates: { canonical: `${APP_URL}/developers` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Hayya Med Pro API — Developer Documentation",
    description: "REST API for hospital HRIS integration, staff compliance, and workforce management.",
    url: `${APP_URL}/developers`,
    type: "website",
  },
};

const BASE = "https://hayyamed.pro/api/v1";

interface Endpoint {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  summary: string;
  scope: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  response: string;
  tier: "Employer" | "University" | "Government" | "Provider";
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET", path: "/staff", summary: "List staff directory",
    scope: "read:staff", tier: "Employer",
    params: [
      { name: "department", type: "string", required: false, description: "Filter by department name" },
      { name: "profession", type: "string", required: false, description: "Filter by profession (physician, nurse, pharmacist…)" },
      { name: "status", type: "enum", required: false, description: "compliant | at_risk | non_compliant" },
      { name: "q", type: "string", required: false, description: "Name prefix search" },
      { name: "page", type: "integer", required: false, description: "Page number (default: 1)" },
      { name: "per_page", type: "integer", required: false, description: "Results per page (max: 200, default: 100)" },
    ],
    response: `{
  "data": [
    {
      "professional_id": "uuid",
      "name": "Dr. Sara Al-Hassan",
      "profession": "physician",
      "specialty": "Cardiology",
      "department": "Cardiac Sciences",
      "compliance_status": "compliant",
      "data_visible": true,
      "platform_joined_at": "2025-01-15T10:30:00Z"
    }
  ],
  "meta": { "total": 248, "page": 1, "per_page": 100 }
}`,
  },
  {
    method: "GET", path: "/staff/compliance", summary: "Staff compliance summary",
    scope: "read:compliance", tier: "Employer",
    params: [
      { name: "status", type: "enum", required: false, description: "compliant | at_risk | non_compliant" },
      { name: "department", type: "string", required: false, description: "Filter by department" },
      { name: "page", type: "integer", required: false, description: "Page number" },
      { name: "per_page", type: "integer", required: false, description: "Results per page" },
    ],
    response: `{
  "data": [
    {
      "professional_id": "uuid",
      "name": "Dr. Sara Al-Hassan",
      "compliance_status": "compliant",
      "completed_credits": 67,
      "required_credits": 80,
      "cycle_end_date": "2026-12-31",
      "data_visible": true
    }
  ],
  "meta": { "total": 248, "page": 1, "per_page": 100 },
  "summary": {
    "total": 248, "compliant": 210,
    "at_risk": 24, "non_compliant": 14
  }
}`,
  },
  {
    method: "GET", path: "/staff/departments", summary: "List departments",
    scope: "read:staff", tier: "Employer",
    params: [],
    response: `{
  "departments": [
    { "name": "Cardiac Sciences", "staff_count": 42 },
    { "name": "Emergency Medicine", "staff_count": 31 }
  ]
}`,
  },
  {
    method: "GET", path: "/staff/licenses", summary: "Staff license expiry status",
    scope: "read:staff", tier: "Employer",
    params: [
      { name: "expiring_within_days", type: "integer", required: false, description: "Filter licenses expiring within N days" },
    ],
    response: `{
  "data": [
    {
      "professional_id": "uuid",
      "name": "Dr. Khalid Mansoor",
      "license_authority": "QCHP",
      "license_expiry": "2026-03-31",
      "days_until_expiry": 182
    }
  ]
}`,
  },
  {
    method: "POST", path: "/staff/sync", summary: "Push HRIS roster update",
    scope: "write:staff", tier: "Employer",
    params: [],
    response: `// Request body
{
  "staff": [
    { "employee_id": "EMP-1234", "email": "sara@hospital.qa", "department": "Cardiac Sciences" }
  ]
}

// Response
{
  "matched": 1, "unmatched": 0,
  "errors": []
}`,
  },
  {
    method: "GET", path: "/faculty", summary: "University faculty directory",
    scope: "read:faculty", tier: "University",
    params: [
      { name: "faculty_type", type: "string", required: false, description: "clinical | academic | adjunct" },
      { name: "page", type: "integer", required: false, description: "Page number" },
    ],
    response: `{
  "data": [
    {
      "professional_id": "uuid",
      "name": "Prof. Ahmad Al-Rashid",
      "faculty_type": "clinical",
      "compliance_status": "compliant",
      "data_visible": true
    }
  ]
}`,
  },
  {
    method: "GET", path: "/faculty/compliance", summary: "Faculty compliance status",
    scope: "read:compliance", tier: "University",
    params: [{ name: "status", type: "enum", required: false, description: "compliant | at_risk | non_compliant" }],
    response: `{
  "data": [...],
  "summary": { "total": 86, "compliant": 74, "at_risk": 9, "non_compliant": 3 }
}`,
  },
  {
    method: "GET", path: "/registry", summary: "National professional registry",
    scope: "read:registry", tier: "Government",
    params: [
      { name: "country", type: "string", required: true, description: "ISO 3166-1 alpha-2 country code (e.g. QA, SA)" },
      { name: "profession", type: "string", required: false, description: "Filter by profession" },
      { name: "status", type: "enum", required: false, description: "compliant | non_compliant" },
      { name: "page", type: "integer", required: false, description: "Page number" },
      { name: "per_page", type: "integer", required: false, description: "Results per page (max: 500)" },
    ],
    response: `{
  "data": [
    {
      "professional_id": "uuid",
      "profession": "physician",
      "specialty": "Cardiology",
      "country": "QA",
      "authority": "QCHP",
      "compliance_status": "compliant",
      "data_visible": true
    }
  ],
  "meta": { "total": 12840, "page": 1, "per_page": 500 }
}`,
  },
  {
    method: "GET", path: "/registry/summary", summary: "Workforce compliance aggregate",
    scope: "read:registry", tier: "Government",
    params: [
      { name: "country", type: "string", required: true, description: "ISO 3166-1 alpha-2 country code" },
    ],
    response: `{
  "country": "QA",
  "authority": "QCHP",
  "total_registered": 12840,
  "compliant": 10920,
  "at_risk": 1120,
  "non_compliant": 800,
  "compliance_rate": 85.0,
  "by_profession": {
    "physician": { "total": 6200, "compliant": 5400 },
    "nurse": { "total": 4800, "compliant": 4020 },
    "pharmacist": { "total": 1840, "compliant": 1500 }
  }
}`,
  },
  {
    method: "GET", path: "/courses", summary: "Training provider course catalog",
    scope: "read:courses", tier: "Provider",
    params: [
      { name: "status", type: "enum", required: false, description: "published | draft | archived" },
      { name: "page", type: "integer", required: false, description: "Page number" },
    ],
    response: `{
  "data": [
    {
      "id": "uuid",
      "title": "Advanced Cardiac Life Support (ACLS)",
      "credits": 6,
      "accreditor": "AHA",
      "status": "published",
      "enrollment_count": 148
    }
  ]
}`,
  },
  {
    method: "GET", path: "/enrollments", summary: "Course enrollments and completion",
    scope: "read:enrollments", tier: "Provider",
    params: [
      { name: "course_id", type: "uuid", required: false, description: "Filter by course" },
      { name: "status", type: "enum", required: false, description: "enrolled | completed | dropped" },
    ],
    response: `{
  "data": [
    {
      "enrollment_id": "uuid",
      "course_id": "uuid",
      "professional_id": "uuid",
      "status": "completed",
      "completed_at": "2025-06-10T14:22:00Z",
      "certificate_issued": true
    }
  ]
}`,
  },
];

const TIER_COLORS: Record<string, string> = {
  Employer:   "bg-[#eff6ff] text-[#1a56a0] border-[#bfdbfe]",
  University: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
  Government: "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]",
  Provider:   "bg-[#fdf4ff] text-[#7e22ce] border-[#e9d5ff]",
};

const METHOD_COLORS: Record<string, string> = {
  GET:    "bg-[#dbeafe] text-[#1e40af]",
  POST:   "bg-[#d1fae5] text-[#065f46]",
  PATCH:  "bg-[#fef3c7] text-[#92400e]",
  DELETE: "bg-[#fee2e2] text-[#991b1b]",
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <h2 className="text-xl font-bold text-[#111] mb-6 pb-3 border-b border-[#e2e8f0]">{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  return (
    <pre className="bg-[#0f1f3d] text-[#e2e8f0] rounded-xl p-5 text-xs leading-relaxed overflow-x-auto">
      <code>{code.trim()}</code>
    </pre>
  );
}

function EndpointCard({ ep }: { ep: Endpoint }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden mb-4">
      <div className="flex items-start gap-3 px-5 py-4 border-b border-[#f1f5f9]">
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono flex-shrink-0 mt-0.5 ${METHOD_COLORS[ep.method]}`}>
          {ep.method}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-sm font-mono text-[#1a56a0]">{BASE}{ep.path}</code>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TIER_COLORS[ep.tier]}`}>
              {ep.tier} plan
            </span>
          </div>
          <p className="text-sm text-[#64748b] mt-0.5">{ep.summary}</p>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Required scope: <code className="font-mono">{ep.scope}</code>
          </p>
        </div>
      </div>

      {ep.params && ep.params.length > 0 && (
        <div className="px-5 py-4 border-b border-[#f1f5f9]">
          <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-3">Query Parameters</p>
          <div className="space-y-2">
            {ep.params.map((p) => (
              <div key={p.name} className="flex items-start gap-3 text-xs">
                <code className="font-mono text-[#1a56a0] w-36 flex-shrink-0">{p.name}</code>
                <span className="text-[#94a3b8] w-16 flex-shrink-0">{p.type}</span>
                {p.required && (
                  <span className="text-[#dc2626] text-[10px] font-semibold flex-shrink-0">required</span>
                )}
                <span className="text-[#64748b]">{p.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 py-4">
        <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-3">Response</p>
        <CodeBlock code={ep.response} language="json" />
      </div>
    </div>
  );
}

const tiers = ["Employer", "University", "Government", "Provider"] as const;

export default function DevelopersPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: APP_URL },
        { name: "API Documentation", url: `${APP_URL}/developers` },
      ]} />

      <div className="min-h-screen bg-white">
        {/* Nav */}
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <span className="font-bold text-base text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <a href="#authentication" className="text-[#64748b] hover:text-[#111] transition-colors hidden sm:block">Auth</a>
              <a href="#endpoints" className="text-[#64748b] hover:text-[#111] transition-colors hidden sm:block">Endpoints</a>
              <a href="#webhooks" className="text-[#64748b] hover:text-[#111] transition-colors hidden sm:block">Webhooks</a>
              <Link href="/login" className="text-[#1a56a0] font-medium hover:underline">Sign in</Link>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-12 flex gap-10">
          {/* Sidebar ToC */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-[#374151] uppercase tracking-wider mb-3">On this page</p>
              <nav className="space-y-1">
                {[
                  ["#overview",        "Overview"],
                  ["#authentication",  "Authentication"],
                  ["#rate-limits",     "Rate Limits"],
                  ["#endpoints",       "Endpoints"],
                  ["#employer-api",    "— Employer"],
                  ["#university-api",  "— University"],
                  ["#government-api",  "— Government"],
                  ["#provider-api",    "— Provider"],
                  ["#webhooks",        "Webhooks"],
                  ["#errors",          "Error Codes"],
                  ["#sdks",            "SDKs & Tools"],
                  ["#access",          "Request Access"],
                ].map(([href, label]) => (
                  <a
                    key={href}
                    href={href}
                    className={`block text-sm py-1 transition-colors ${
                      label.startsWith("—")
                        ? "pl-4 text-[#94a3b8] hover:text-[#64748b]"
                        : "text-[#64748b] hover:text-[#111]"
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 max-w-3xl">
            {/* Hero */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#bfdbfe] text-[#1a56a0] text-xs font-semibold px-3 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a56a0] inline-block" />
                REST API v1
              </div>
              <h1 className="text-3xl font-bold text-[#111] mb-3">Hayya Med Pro API</h1>
              <p className="text-base text-[#64748b] max-w-xl leading-relaxed">
                Connect your hospital HRIS, university system, or government registry to Hayya Med Pro.
                Read-only endpoints are available at launch. Write access (HRIS sync) requires an Enterprise plan.
              </p>
              <div className="flex items-center gap-3 mt-5 flex-wrap">
                <code className="text-sm bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-4 py-2 text-[#374151]">
                  Base URL: https://hayyamed.pro/api/v1
                </code>
                <span className="text-xs bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] rounded-full px-3 py-1 font-semibold">
                  ✓ Live
                </span>
              </div>
            </div>

            <Section id="overview" title="Overview">
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: "🔑", title: "API Key auth", body: "Static API keys with configurable scopes. Keys are prefixed hmp_live_ or hmp_test_." },
                  { icon: "📄", title: "JSON everywhere", body: "All responses are application/json. Errors follow RFC 7807 Problem Details." },
                  { icon: "⚡", title: "Rate limited", body: "1 000 requests / 15 min per key by default. Enterprise customers get custom limits." },
                  { icon: "🔒", title: "Privacy-first", body: "Staff who set employer visibility to private are returned with data_visible: false." },
                ].map((c) => (
                  <div key={c.title} className="border border-[#e2e8f0] rounded-xl p-4">
                    <p className="text-xl mb-2">{c.icon}</p>
                    <p className="text-sm font-semibold text-[#111] mb-1">{c.title}</p>
                    <p className="text-xs text-[#64748b] leading-relaxed">{c.body}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 text-xs text-[#64748b] leading-relaxed">
                <strong className="text-[#111]">Application region:</strong> All API requests are handled by servers in{" "}
                <strong className="text-[#374151]">me-central1 (Doha, Qatar)</strong>. Database storage does not currently reside in the GCC region.
                A GDPR-compliant EU region is planned for Phase 3.
              </div>
            </Section>

            <Section id="authentication" title="Authentication">
              <p className="text-sm text-[#64748b] mb-5 leading-relaxed">
                Every request must include your API key in the{" "}
                <code className="font-mono bg-[#f8fafc] px-1.5 py-0.5 rounded border border-[#e2e8f0] text-[#374151]">X-Api-Key</code>{" "}
                header. API keys are generated in the{" "}
                <Link href="/dashboard/settings" className="text-[#1a56a0] underline hover:no-underline">Settings → API Keys</Link>{" "}
                section of your Employer, University, or Government dashboard.
              </p>

              <CodeBlock language="bash" code={`curl https://hayyamed.pro/api/v1/staff \\
  -H "X-Api-Key: hmp_live_your_key_here"`} />

              <div className="mt-5 space-y-3">
                <p className="text-sm font-semibold text-[#111]">Available scopes</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#e2e8f0]">
                        <th className="text-left py-2 pr-4 text-[#374151] font-semibold">Scope</th>
                        <th className="text-left py-2 pr-4 text-[#374151] font-semibold">Access</th>
                        <th className="text-left py-2 text-[#374151] font-semibold">Plan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      {[
                        ["read:staff",       "Read staff directory and profile data",    "Employer"],
                        ["read:compliance",  "Read CME compliance status per staff",     "Employer"],
                        ["write:staff",      "Push HRIS department/roster updates",      "Enterprise"],
                        ["read:faculty",     "Read university faculty directory",        "University"],
                        ["read:registry",   "Read national professional registry",      "Government"],
                        ["read:courses",    "Read training provider course catalog",    "Provider"],
                        ["read:enrollments","Read course enrollments and completions",  "Provider"],
                      ].map(([scope, desc, plan]) => (
                        <tr key={scope}>
                          <td className="py-2 pr-4"><code className="font-mono text-[#1a56a0]">{scope}</code></td>
                          <td className="py-2 pr-4 text-[#64748b]">{desc}</td>
                          <td className="py-2">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TIER_COLORS[plan] ?? "bg-[#f1f5f9] text-[#374151] border-[#e2e8f0]"}`}>
                              {plan}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            <Section id="rate-limits" title="Rate Limits">
              <p className="text-sm text-[#64748b] mb-5 leading-relaxed">
                Rate limit headers are included in every response. Requests exceeding the limit receive a{" "}
                <code className="font-mono bg-[#f8fafc] px-1.5 py-0.5 rounded border border-[#e2e8f0] text-[#374151]">429 Too Many Requests</code>{" "}
                response with a <code className="font-mono">Retry-After</code> header.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="text-left py-2 pr-4 text-[#374151] font-semibold">Plan</th>
                      <th className="text-left py-2 pr-4 text-[#374151] font-semibold">Requests / 15 min</th>
                      <th className="text-left py-2 text-[#374151] font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {[
                      ["Employer",    "1 000",   "Per API key"],
                      ["University",  "1 000",   "Per API key"],
                      ["Government",  "5 000",   "Per API key — bulk registry access"],
                      ["Enterprise",  "Custom",  "Agreed in MSA — no hard cap"],
                    ].map(([plan, limit, note]) => (
                      <tr key={plan}>
                        <td className="py-2 pr-4 font-medium text-[#111]">{plan}</td>
                        <td className="py-2 pr-4"><code className="font-mono">{limit}</code></td>
                        <td className="py-2 text-[#64748b]">{note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <CodeBlock code={`# Rate limit headers on every response
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1719316800`} />
              </div>
            </Section>

            <Section id="endpoints" title="Endpoints">
              <p className="text-sm text-[#64748b] mb-6">
                All endpoints are namespaced under <code className="font-mono text-[#1a56a0]">https://hayyamed.pro/api/v1</code>.
              </p>

              {tiers.map((tier) => (
                <div key={tier} id={`${tier.toLowerCase()}-api`} className="mb-10 scroll-mt-24">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TIER_COLORS[tier]}`}>
                      {tier} plan
                    </span>
                    <h3 className="text-base font-semibold text-[#111]">{tier} API</h3>
                  </div>
                  {ENDPOINTS.filter((ep) => ep.tier === tier).map((ep) => (
                    <EndpointCard key={ep.method + ep.path} ep={ep} />
                  ))}
                </div>
              ))}
            </Section>

            <Section id="webhooks" title="Webhooks">
              <p className="text-sm text-[#64748b] mb-5 leading-relaxed">
                Hayya Med Pro sends webhook events to your endpoint when compliance events occur.
                Configure webhook URLs in <Link href="/employer" className="text-[#1a56a0] underline">Employer Settings → Webhooks</Link>.
              </p>

              <div className="mb-5">
                <p className="text-sm font-semibold text-[#111] mb-3">Available events</p>
                <div className="space-y-2">
                  {[
                    ["staff.compliance_changed",  "A staff member's compliance status changed (compliant → at_risk, etc.)"],
                    ["staff.license_expiring",    "A staff member's license expires within 90, 60, or 30 days"],
                    ["staff.activity_verified",   "A CME activity was verified for a staff member"],
                    ["staff.linked",              "A professional accepted an employer link request"],
                    ["staff.unlinked",            "A professional removed themselves from the organisation"],
                    ["course.enrolled",           "A professional enrolled in a course (Provider plans)"],
                    ["course.completed",          "A professional completed a course and received a certificate"],
                  ].map(([event, desc]) => (
                    <div key={event} className="flex items-start gap-3 text-xs">
                      <code className="font-mono text-[#1a56a0] w-48 flex-shrink-0">{event}</code>
                      <span className="text-[#64748b]">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs font-semibold text-[#374151] uppercase tracking-wide mb-3">Webhook payload</p>
              <CodeBlock code={`POST https://your-endpoint.example.com/hayya-webhook
Content-Type: application/json
X-HMP-Signature: sha256=<hmac>
X-HMP-Event: staff.compliance_changed
X-HMP-Delivery: uuid

{
  "event": "staff.compliance_changed",
  "organization_id": "uuid",
  "professional_id": "uuid",
  "timestamp": "2025-06-22T10:15:00Z",
  "payload": {
    "previous_status": "at_risk",
    "current_status": "non_compliant",
    "completed_credits": 15,
    "required_credits": 80
  }
}`} />

              <div className="mt-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 text-xs text-[#64748b]">
                <strong className="text-[#111]">Signature verification:</strong> Validate the{" "}
                <code className="font-mono">X-HMP-Signature</code> header using HMAC-SHA256 with your webhook secret.
                Reject any delivery where the signature does not match.
              </div>
            </Section>

            <Section id="errors" title="Error Codes">
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      <th className="text-left py-2 pr-4 text-[#374151] font-semibold">HTTP Status</th>
                      <th className="text-left py-2 pr-4 text-[#374151] font-semibold">Code</th>
                      <th className="text-left py-2 text-[#374151] font-semibold">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {[
                      ["401", "unauthorized",      "Missing or invalid API key"],
                      ["403", "forbidden",         "API key lacks the required scope"],
                      ["404", "not_found",         "Resource does not exist"],
                      ["422", "validation_error",  "Request body failed validation"],
                      ["429", "rate_limited",      "Too many requests — check Retry-After header"],
                      ["500", "internal_error",    "Unexpected server error — contact support"],
                    ].map(([status, code, meaning]) => (
                      <tr key={status}>
                        <td className="py-2 pr-4"><code className="font-mono text-[#dc2626]">{status}</code></td>
                        <td className="py-2 pr-4"><code className="font-mono text-[#374151]">{code}</code></td>
                        <td className="py-2 text-[#64748b]">{meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <CodeBlock code={`// Error response shape (RFC 7807)
{
  "error": "forbidden",
  "message": "API key lacks scope read:compliance",
  "status": 403
}`} />
              </div>
            </Section>

            <Section id="sdks" title="SDKs & Tools">
              <p className="text-sm text-[#64748b] mb-5">
                Official SDKs are on the roadmap (JavaScript/TypeScript, Python). In the meantime, any HTTP client works.
              </p>

              <p className="text-sm font-semibold text-[#111] mb-3">JavaScript (fetch)</p>
              <CodeBlock language="javascript" code={`const API_KEY = "hmp_live_your_key_here";
const BASE    = "https://hayyamed.pro/api/v1";

async function getStaffCompliance({ page = 1 } = {}) {
  const res = await fetch(\`\${BASE}/staff/compliance?page=\${page}\`, {
    headers: { "X-Api-Key": API_KEY },
  });
  if (!res.ok) throw new Error(\`API error \${res.status}\`);
  return res.json();
}

// Fetch all pages
async function getAllCompliance() {
  let page = 1, all = [];
  while (true) {
    const { data, meta } = await getStaffCompliance({ page });
    all = all.concat(data);
    if (all.length >= meta.total) break;
    page++;
  }
  return all;
}`} />

              <p className="text-sm font-semibold text-[#111] mt-6 mb-3">Python (httpx)</p>
              <CodeBlock language="python" code={`import httpx

API_KEY = "hmp_live_your_key_here"
BASE    = "https://hayyamed.pro/api/v1"

def get_staff_compliance(page=1):
    resp = httpx.get(
        f"{BASE}/staff/compliance",
        headers={"X-Api-Key": API_KEY},
        params={"page": page},
    )
    resp.raise_for_status()
    return resp.json()

# Iterate all pages
def all_compliance():
    page, records = 1, []
    while True:
        data = get_staff_compliance(page)
        records.extend(data["data"])
        if len(records) >= data["meta"]["total"]:
            break
        page += 1
    return records`} />
            </Section>

            <Section id="access" title="Request API Access">
              <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] rounded-2xl p-8 text-center">
                <p className="text-2xl mb-3">🔑</p>
                <h3 className="text-xl font-bold text-white mb-2">Ready to integrate?</h3>
                <p className="text-sm text-[#8ea5c8] mb-6 max-w-md mx-auto leading-relaxed">
                  API access requires an Employer, University, or Government plan. Keys are generated instantly
                  from your dashboard after subscribing.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/pricing"
                    className="text-sm font-semibold bg-white text-[#0f1f3d] px-6 py-2.5 rounded-xl hover:bg-[#f0f4f8] transition-colors"
                  >
                    View plans →
                  </Link>
                  <a
                    href="mailto:tech@hayyamed.pro"
                    className="text-sm font-medium text-[#93c5fd] hover:text-white transition-colors"
                  >
                    Talk to a developer
                  </a>
                </div>
                <p className="text-xs text-[#4a6a9f] mt-5">
                  Already have an Employer plan?{" "}
                  <Link href="/employer/api-keys" className="underline text-[#7daee0] hover:text-white transition-colors">
                    Generate your API key →
                  </Link>
                </p>
              </div>
            </Section>

          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#e2e8f0] py-8 px-6 text-center">
          <p className="text-xs text-[#94a3b8]">
            Hayya Med Pro API v1 · Questions?{" "}
            <a href="mailto:tech@hayyamed.pro" className="text-[#1a56a0] hover:underline">tech@hayyamed.pro</a>
            {" "}·{" "}
            <Link href="/status" className="text-[#1a56a0] hover:underline">System status</Link>
            {" "}·{" "}
            <Link href="/legal/privacy" className="text-[#1a56a0] hover:underline">Privacy</Link>
          </p>
        </footer>
      </div>
    </>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LMS Integration | Hayya Med Pro Provider",
  description: "Connect your LMS or CRM to Hayya Med Pro to sync course enrollments and completion data.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-[#111] mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="bg-[#0f1f3d] text-[#e2e8f0] text-sm rounded-lg p-4 overflow-x-auto leading-relaxed">
      <code>{children.trim()}</code>
    </pre>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border bg-blue-50 text-blue-700 border-blue-200">
      {label}
    </span>
  );
}

function EndpointCard({
  method, path, scope, description, params, response,
}: {
  method: "GET";
  path: string;
  scope: string;
  description: string;
  params: { name: string; type: string; required?: boolean; description: string }[];
  response: string;
}) {
  return (
    <div className="border border-[#e2e8f0] rounded-lg overflow-hidden mb-6">
      <div className="flex items-center gap-3 bg-[#f8fafc] px-4 py-3 border-b border-[#e2e8f0]">
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-600 text-white">{method}</span>
        <code className="text-sm font-mono text-[#1a56a0] font-medium">{path}</code>
        <span className="ml-auto"><Badge label={scope} /></span>
      </div>
      <div className="p-4 space-y-4">
        <p className="text-sm text-[#475569]">{description}</p>
        {params.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2">Parameters</p>
            <table className="w-full text-sm border border-[#e2e8f0] rounded">
              <thead className="bg-[#f8fafc]">
                <tr>
                  {["Name", "Type", "Required", "Description"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 text-xs font-medium text-[#64748b] border-b border-[#e2e8f0]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {params.map((p) => (
                  <tr key={p.name} className="border-b border-[#f1f5f9] last:border-0">
                    <td className="px-3 py-2 font-mono text-xs text-[#1a56a0]">{p.name}</td>
                    <td className="px-3 py-2 font-mono text-xs text-[#64748b]">{p.type}</td>
                    <td className="px-3 py-2 text-xs text-[#64748b]">{p.required ? "Yes" : "No"}</td>
                    <td className="px-3 py-2 text-xs text-[#475569]">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2">Example response</p>
          <Code>{response}</Code>
        </div>
      </div>
    </div>
  );
}

export default function ProviderIntegrationPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111] mb-2">LMS Integration</h1>
        <p className="text-[#475569]">
          Connect your learning management system or CRM to Hayya Med Pro.
          Sync course enrollments, completions, and learner data directly into your existing workflows.
        </p>
      </div>

      <Section title="Quick start">
        <ol className="space-y-3 text-sm text-[#475569]">
          {[
            <>Go to <a href="/provider/api-keys" className="text-[#1a56a0] font-medium hover:underline">API Keys</a> and generate a key with the scopes you need.</>,
            <>Add the key as the <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">X-Api-Key</code> header on every request. Store it in your secrets manager — shown only once.</>,
            <>Call <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">GET /api/v1/courses</code> to retrieve your course catalog with live enrollment and completion stats.</>,
            <>Call <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">GET /api/v1/enrollments</code> to pull individual learner records for LMS sync or reporting.</>,
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-none w-6 h-6 rounded-full bg-[#1a56a0] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Authentication">
        <p className="text-sm text-[#475569] mb-4">
          All requests require the{" "}
          <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">X-Api-Key</code> header.
          A key created with <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">read:courses</code> cannot
          access enrollment records without <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">read:enrollments</code>.
        </p>
        <Code>{`curl https://hayyamed.pro/api/v1/courses \\
  -H "X-Api-Key: hmp_live_xxxxxxxxxxxxxxxxxxxx"`}</Code>
        <div className="mt-4 p-4 bg-[#fff7ed] border border-[#fed7aa] rounded-lg">
          <p className="text-sm font-semibold text-[#92400e] mb-1">Rate limiting</p>
          <p className="text-sm text-[#92400e]">
            100 requests per minute per API key. Returns HTTP 429 with a{" "}
            <code className="bg-[#fef3c7] px-1 rounded text-xs font-mono">Retry-After</code> header when exceeded.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { scope: "read:courses",     desc: "List your courses with live enrollment counts and completion rates." },
            { scope: "read:enrollments", desc: "Pull individual enrollment records for LMS or CRM sync." },
          ].map(({ scope, desc }) => (
            <div key={scope} className="border border-[#e2e8f0] rounded-lg p-3">
              <Badge label={scope} />
              <p className="mt-2 text-xs text-[#475569]">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="REST API endpoints">
        <EndpointCard
          method="GET"
          path="/api/v1/courses"
          scope="read:courses"
          description="Returns a paginated list of your courses with live enrollment and completion statistics. Only returns courses owned by the API key's provider account."
          params={[
            { name: "page",     type: "integer", description: "Page number, starting at 1. Default: 1." },
            { name: "per_page", type: "integer", description: "Records per page. Max 200. Default: 100." },
            { name: "status",   type: "string",  description: "Filter: active | draft | closed | cancelled" },
            { name: "category", type: "string",  description: "Filter by category slug, e.g. cardiology, pharmacology." },
          ]}
          response={`{
  "data": [
    {
      "course_id": "c1b2d3e4-...",
      "title": "Advanced Cardiac Life Support (ACLS)",
      "category": "cardiology",
      "credits": 8,
      "credit_type": "CME",
      "delivery_mode": "online",
      "is_free": false,
      "price_usd": 99,
      "status": "active",
      "enrollment_count": 142,
      "completion_count": 98,
      "completion_rate_pct": 69,
      "created_at": "2025-09-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1, "per_page": 100, "total": 12, "total_pages": 1
  },
  "meta": {
    "provider_id": "prov-uuid",
    "provider_name": "Qatar Medical Training Institute",
    "generated_at": "2026-06-16T08:00:00Z",
    "api_version": "v1"
  }
}`}
        />

        <EndpointCard
          method="GET"
          path="/api/v1/enrollments"
          scope="read:enrollments"
          description="Returns individual enrollment records across all your courses. Learner names are never returned — only professional_id (UUID) and profession for privacy compliance. Filter by course or status."
          params={[
            { name: "course_id", type: "uuid",    description: "Filter to enrollments for a specific course." },
            { name: "status",    type: "string",  description: "Filter: enrolled | completed | cancelled" },
            { name: "page",      type: "integer", description: "Page number, starting at 1. Default: 1." },
            { name: "per_page",  type: "integer", description: "Records per page. Max 200. Default: 100." },
          ]}
          response={`{
  "data": [
    {
      "enrollment_id": "e1b2c3d4-...",
      "course_id": "c1b2d3e4-...",
      "course_title": "Advanced Cardiac Life Support (ACLS)",
      "professional_id": "a1b2c3d4-...",
      "profession": "physician",
      "status": "completed",
      "enrolled_at": "2026-01-10T09:00:00Z",
      "completed_at": "2026-01-25T14:30:00Z"
    },
    {
      "enrollment_id": "f2c3d4e5-...",
      "course_id": "c1b2d3e4-...",
      "course_title": "Advanced Cardiac Life Support (ACLS)",
      "professional_id": "b2c3d4e5-...",
      "profession": "nurse",
      "status": "enrolled",
      "enrolled_at": "2026-02-01T11:00:00Z",
      "completed_at": null
    }
  ],
  "pagination": {
    "page": 1, "per_page": 100, "total": 142, "total_pages": 2
  },
  "meta": {
    "provider_id": "prov-uuid",
    "generated_at": "2026-06-16T08:00:00Z",
    "api_version": "v1"
  }
}`}
        />
      </Section>

      <Section title="Privacy & compliance">
        <div className="space-y-3 text-sm text-[#475569]">
          <p>
            The enrollments endpoint uses <strong className="text-[#111]">professional_id</strong> (UUID) as the learner identifier.
            Names, license numbers, and contact details are never returned. Profession is included as it is non-personally-identifying
            aggregate information relevant to course planning.
          </p>
          <p>
            Your provider agreement with Hayya Med Pro covers the use of this data for reporting and LMS sync purposes.
            Contact <a href="mailto:privacy@hayyamed.pro" className="text-[#1a56a0] hover:underline">privacy@hayyamed.pro</a> if
            you need a separate Data Processing Agreement for enterprise integration.
          </p>
        </div>
      </Section>

      <Section title="Support">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <a href="/provider/api-keys" className="flex items-center gap-3 p-4 border border-[#e2e8f0] rounded-lg hover:border-[#1a56a0] hover:bg-[#f0f4f8] transition-colors">
            <span className="text-2xl">🔑</span>
            <div>
              <p className="font-semibold text-[#111]">Manage API keys</p>
              <p className="text-[#64748b] text-xs">Create, rotate, and revoke keys</p>
            </div>
          </a>
          <a href="/provider/analytics" className="flex items-center gap-3 p-4 border border-[#e2e8f0] rounded-lg hover:border-[#1a56a0] hover:bg-[#f0f4f8] transition-colors">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-semibold text-[#111]">Analytics dashboard</p>
              <p className="text-[#64748b] text-xs">Revenue, enrollments, and completion trends</p>
            </div>
          </a>
        </div>
      </Section>
    </div>
  );
}

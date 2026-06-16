import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LMS Integration | Hayya Med Pro University",
  description: "Connect your learning management system to Hayya Med Pro using the REST API.",
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

export default function UniversityIntegrationPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111] mb-2">LMS Integration</h1>
        <p className="text-[#475569]">
          Connect your learning management system or student information system to Hayya Med Pro.
          Sync faculty CME compliance data and course completion records directly into your reporting workflows.
        </p>
      </div>

      <Section title="Quick start">
        <ol className="space-y-3 text-sm text-[#475569]">
          {[
            <>Go to <a href="/university/api-keys" className="text-[#1a56a0] font-medium hover:underline">API Keys</a> and create a key with the scopes you need.</>,
            <>Add the key as the <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">X-Api-Key</code> header on every request. Store it in your secrets manager — it is shown only once.</>,
            <>Call <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">GET /api/v1/faculty</code> to retrieve your linked faculty list with compliance status.</>,
            <>Call <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">GET /api/v1/faculty/compliance</code> for aggregated department and profession breakdowns.</>,
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
          All API requests must include your API key in the{" "}
          <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">X-Api-Key</code> header.
          Keys are scoped — a key with <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">read:faculty</code> only cannot
          access compliance data without <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">read:compliance</code>.
        </p>
        <Code>{`curl https://hayyamed.pro/api/v1/faculty \\
  -H "X-Api-Key: hmp_live_xxxxxxxxxxxxxxxxxxxx"`}</Code>
        <div className="mt-4 p-4 bg-[#fff7ed] border border-[#fed7aa] rounded-lg">
          <p className="text-sm font-semibold text-[#92400e] mb-1">Rate limiting</p>
          <p className="text-sm text-[#92400e]">
            100 requests per minute per API key. Exceeded requests return HTTP 429 with a
            <code className="bg-[#fef3c7] px-1 rounded text-xs font-mono mx-1">Retry-After</code>
            header indicating seconds to wait.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { scope: "read:faculty",    desc: "List faculty members with names, professions, departments, and compliance status." },
            { scope: "read:compliance", desc: "Query aggregated compliance data by department and profession." },
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
          path="/api/v1/faculty"
          scope="read:faculty"
          description="Returns a paginated list of faculty members linked to your institution. Includes compliance status (masked as 'private' for members who have opted out of visibility). Max 200 per page."
          params={[
            { name: "page",       type: "integer", description: "Page number, starting at 1. Default: 1." },
            { name: "per_page",   type: "integer", description: "Records per page. Max 200. Default: 100." },
            { name: "department", type: "string",  description: "Filter by department name (case-insensitive)." },
            { name: "profession", type: "string",  description: "Filter by profession slug, e.g. physician, nurse." },
            { name: "status",     type: "string",  description: "Filter: compliant | at_risk | non_compliant | unknown" },
            { name: "q",          type: "string",  description: "Name search (case-insensitive partial match)." },
          ]}
          response={`{
  "data": [
    {
      "professional_id": "a1b2c3d4-...",
      "department": "Internal Medicine",
      "name": "Dr. Layla Hassan",
      "profession": "physician",
      "specialty": "internal_medicine",
      "compliance_status": "compliant",
      "data_visible": true,
      "platform_joined_at": "2025-09-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1, "per_page": 100, "total": 42, "total_pages": 1
  },
  "meta": {
    "organization_id": "org-uuid",
    "generated_at": "2026-06-16T08:00:00Z",
    "api_version": "v1"
  }
}`}
        />

        <EndpointCard
          method="GET"
          path="/api/v1/faculty/compliance"
          scope="read:compliance"
          description="Returns aggregate CME compliance statistics for all linked faculty. Includes totals and breakdowns by department and profession. Ideal for dashboard and reporting integrations."
          params={[]}
          response={`{
  "total_faculty": 42,
  "compliant_count": 28,
  "at_risk_count": 9,
  "non_compliant_count": 3,
  "unknown_count": 2,
  "by_department": [
    {
      "department": "Internal Medicine",
      "total": 15,
      "compliant": 11,
      "at_risk": 3,
      "non_compliant": 1,
      "unknown": 0
    }
  ],
  "by_profession": [
    {
      "profession": "physician",
      "total": 30,
      "compliant": 20,
      "at_risk": 7,
      "non_compliant": 2,
      "unknown": 1
    }
  ],
  "meta": {
    "organization_id": "org-uuid",
    "generated_at": "2026-06-16T08:00:00Z",
    "api_version": "v1"
  }
}`}
        />
      </Section>

      <Section title="Compliance & privacy">
        <div className="space-y-3 text-sm text-[#475569]">
          <p>
            All API responses use <strong className="text-[#111]">professional_id</strong> (UUID) as the primary identifier.
            Names are only returned for faculty members who have consented by linking to your institution on the platform.
          </p>
          <p>
            When a faculty member has disabled employer CME visibility in their privacy settings,
            their <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">compliance_status</code> is returned as{" "}
            <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">&quot;private&quot;</code> and{" "}
            <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">data_visible</code> is <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">false</code>.
          </p>
          <p>
            Ensure your integration with Hayya Med Pro includes a signed Data Processing Agreement (DPA).
            Contact <a href="mailto:privacy@hayyamed.pro" className="text-[#1a56a0] hover:underline">privacy@hayyamed.pro</a>.
          </p>
        </div>
      </Section>

      <Section title="Support">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <a href="/university/api-keys" className="flex items-center gap-3 p-4 border border-[#e2e8f0] rounded-lg hover:border-[#1a56a0] hover:bg-[#f0f4f8] transition-colors">
            <span className="text-2xl">🔑</span>
            <div>
              <p className="font-semibold text-[#111]">Manage API keys</p>
              <p className="text-[#64748b] text-xs">Create, rotate, and revoke keys</p>
            </div>
          </a>
          <a href="/university/faculty" className="flex items-center gap-3 p-4 border border-[#e2e8f0] rounded-lg hover:border-[#1a56a0] hover:bg-[#f0f4f8] transition-colors">
            <span className="text-2xl">👥</span>
            <div>
              <p className="font-semibold text-[#111]">Faculty management</p>
              <p className="text-[#64748b] text-xs">Approve link requests and view compliance</p>
            </div>
          </a>
        </div>
      </Section>
    </div>
  );
}

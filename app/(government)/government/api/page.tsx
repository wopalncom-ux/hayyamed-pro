import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Integration | Hayya Med Pro Regulatory Authority",
  description: "Connect your regulatory information system to the Hayya Med Pro professional registry via REST API.",
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

export default function GovernmentApiPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111] mb-2">Registry API Integration</h1>
        <p className="text-[#475569]">
          Connect your regulatory information system or licensing portal to the Hayya Med Pro professional registry.
          Pull compliance data, profession breakdowns, and license expiry information directly into your authority&apos;s workflows.
        </p>
      </div>

      <Section title="Quick start">
        <ol className="space-y-3 text-sm text-[#475569]">
          {[
            <>Go to <a href="/government/api-keys" className="text-[#1a56a0] font-medium hover:underline">API Keys</a> and create a key with the scopes you need.</>,
            <>Add the key as the <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">X-Api-Key</code> header on every request. Store it securely — it is shown only once.</>,
            <>Call <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">GET /api/v1/registry</code> to retrieve the professionals linked to your authority.</>,
            <>Call <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">GET /api/v1/registry/summary</code> for aggregate counts by profession, country, and compliance status.</>,
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
          All API requests require the <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">X-Api-Key</code> header.
          Keys are scoped — <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">read:registry</code> is required
          for both registry endpoints.
        </p>
        <Code>{`curl https://hayyamed.pro/api/v1/registry \\
  -H "X-Api-Key: hmp_live_xxxxxxxxxxxxxxxxxxxx"`}</Code>
        <div className="mt-4 p-4 bg-[#fff7ed] border border-[#fed7aa] rounded-lg">
          <p className="text-sm font-semibold text-[#92400e] mb-1">Rate limiting</p>
          <p className="text-sm text-[#92400e]">
            100 requests per minute per API key. Exceeded requests return HTTP 429 with a
            <code className="bg-[#fef3c7] px-1 rounded text-xs font-mono mx-1">Retry-After</code> header.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { scope: "read:registry",   desc: "Access the professional registry, filter by profession, country, and compliance status." },
            { scope: "read:compliance", desc: "Aggregate compliance data by profession and country for reporting." },
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
          path="/api/v1/registry"
          scope="read:registry"
          description="Returns a paginated list of professionals linked to your authority. Names and license expiry are only returned for professionals who have enabled organisation visibility in their privacy settings."
          params={[
            { name: "page",       type: "integer", description: "Page number, starting at 1. Default: 1." },
            { name: "per_page",   type: "integer", description: "Records per page. Max 200. Default: 100." },
            { name: "profession", type: "string",  description: "Filter by profession slug, e.g. physician, nurse, pharmacist." },
            { name: "status",     type: "string",  description: "Filter: compliant | at_risk | non_compliant | unknown | private" },
            { name: "country",    type: "string",  description: "Filter by license country (ISO 3166-1 alpha-2), e.g. QA, SA, AE." },
            { name: "q",          type: "string",  description: "Name search — only matches professionals with data_visible: true." },
          ]}
          response={`{
  "data": [
    {
      "professional_id": "a1b2c3d4-...",
      "name": "Dr. Ahmad Al Khaldi",
      "profession": "physician",
      "specialty": "cardiology",
      "country": "QA",
      "license_expiry": "2026-12-31",
      "compliance_status": "compliant",
      "data_visible": true,
      "platform_joined_at": "2025-03-15T00:00:00Z"
    },
    {
      "professional_id": "b2c3d4e5-...",
      "name": null,
      "profession": "nurse",
      "specialty": null,
      "country": "QA",
      "license_expiry": null,
      "compliance_status": "private",
      "data_visible": false,
      "platform_joined_at": "2025-07-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1, "per_page": 100, "total": 1250, "total_pages": 13
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
          path="/api/v1/registry/summary"
          scope="read:registry"
          description="Returns aggregate statistics for the authority's professional registry. No pagination — returns totals and breakdowns in a single response. Ideal for compliance dashboards and periodic reporting."
          params={[]}
          response={`{
  "total": 1250,
  "compliant_count": 820,
  "at_risk_count": 230,
  "non_compliant_count": 95,
  "unknown_count": 105,
  "by_profession": [
    { "profession": "physician",   "count": 680 },
    { "profession": "nurse",       "count": 410 },
    { "profession": "pharmacist",  "count": 160 }
  ],
  "by_country": [
    { "country": "QA", "count": 1250 }
  ],
  "by_compliance_status": [
    { "status": "compliant",     "count": 820 },
    { "status": "at_risk",       "count": 230 },
    { "status": "non_compliant", "count": 95 },
    { "status": "unknown",       "count": 105 }
  ],
  "meta": {
    "organization_id": "org-uuid",
    "generated_at": "2026-06-16T08:00:00Z",
    "api_version": "v1"
  }
}`}
        />
      </Section>

      <Section title="Data privacy & consent">
        <div className="space-y-3 text-sm text-[#475569]">
          <p>
            Only professionals who explicitly linked their profile to your authority appear in the registry.
            The platform uses a consent-based model — professionals must approve the link request to be visible.
          </p>
          <p>
            Professionals control their visibility. When a professional disables employer/authority visibility
            in their privacy settings, their <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">compliance_status</code> is
            returned as <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">&quot;private&quot;</code> and name/expiry fields
            return <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">null</code>.
          </p>
          <p>
            A signed Data Processing Agreement (DPA) is required before processing personal data via this API.
            Contact <a href="mailto:privacy@hayyamed.pro" className="text-[#1a56a0] hover:underline">privacy@hayyamed.pro</a> for
            the DPA template and government-tier agreement.
          </p>
        </div>
      </Section>

      <Section title="Support">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <a href="/government/api-keys" className="flex items-center gap-3 p-4 border border-[#e2e8f0] rounded-lg hover:border-[#1a56a0] hover:bg-[#f0f4f8] transition-colors">
            <span className="text-2xl">🔑</span>
            <div>
              <p className="font-semibold text-[#111]">Manage API keys</p>
              <p className="text-[#64748b] text-xs">Create, rotate, and revoke keys</p>
            </div>
          </a>
          <a href="/government/registry" className="flex items-center gap-3 p-4 border border-[#e2e8f0] rounded-lg hover:border-[#1a56a0] hover:bg-[#f0f4f8] transition-colors">
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-semibold text-[#111]">Browse registry</p>
              <p className="text-[#64748b] text-xs">View and filter the professional registry in-portal</p>
            </div>
          </a>
        </div>
      </Section>
    </div>
  );
}

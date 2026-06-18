import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HRIS Integration | Hayya Med Pro Employer",
  description: "Connect your HR system to Hayya Med Pro using the REST API and webhook events.",
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

function Badge({ label, color }: { label: string; color: "blue" | "green" | "orange" }) {
  const cls = {
    blue:   "bg-blue-50 text-blue-700 border-blue-200",
    green:  "bg-green-50 text-green-700 border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  }[color];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium border ${cls}`}>
      {label}
    </span>
  );
}

function EndpointCard({
  method, path, scope, description, params, response,
}: {
  method: "GET" | "POST";
  path: string;
  scope: string;
  description: string;
  params: { name: string; type: string; required?: boolean; description: string }[];
  response: string;
}) {
  const methodColor = method === "POST"
    ? "bg-[#1a56a0] text-white"
    : "bg-green-600 text-white";

  return (
    <div className="border border-[#e2e8f0] rounded-lg overflow-hidden mb-6">
      <div className="flex items-center gap-3 bg-[#f8fafc] px-4 py-3 border-b border-[#e2e8f0]">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${methodColor}`}>{method}</span>
        <code className="text-sm font-mono text-[#1a56a0] font-medium">{path}</code>
        <span className="ml-auto">
          <Badge label={scope} color="blue" />
        </span>
      </div>
      <div className="p-4 space-y-4">
        <p className="text-sm text-[#475569]">{description}</p>

        {params.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2">Parameters</p>
            <table className="w-full text-sm border border-[#e2e8f0] rounded">
              <thead className="bg-[#f8fafc]">
                <tr>
                  <th className="text-left px-3 py-2 text-xs font-medium text-[#64748b] border-b border-[#e2e8f0]">Name</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-[#64748b] border-b border-[#e2e8f0]">Type</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-[#64748b] border-b border-[#e2e8f0]">Required</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-[#64748b] border-b border-[#e2e8f0]">Description</th>
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

function WebhookEventCard({
  event, description, payload,
}: { event: string; description: string; payload: string }) {
  return (
    <div className="border border-[#e2e8f0] rounded-lg overflow-hidden mb-4">
      <div className="flex items-center gap-3 bg-[#f8fafc] px-4 py-3 border-b border-[#e2e8f0]">
        <code className="text-sm font-mono font-semibold text-[#1a56a0]">{event}</code>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-sm text-[#475569]">{description}</p>
        <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">Example payload</p>
        <Code>{payload}</Code>
      </div>
    </div>
  );
}

export default function IntegrationPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111] mb-2">HRIS Integration</h1>
        <p className="text-[#475569]">
          Connect your HR information system to Hayya Med Pro using the REST API and real-time
          webhook events. Sync staff compliance data, license renewal dates, and course completions
          directly into your existing workflows.
        </p>
      </div>

      <Section title="Quick start">
        <ol className="space-y-3 text-sm text-[#475569]">
          <li className="flex gap-3">
            <span className="flex-none w-6 h-6 rounded-full bg-[#1a56a0] text-white text-xs font-bold flex items-center justify-center">1</span>
            <span>Go to <a href="/employer/api-keys" className="text-[#1a56a0] font-medium hover:underline">API Keys</a> and create a key with the scopes you need.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-none w-6 h-6 rounded-full bg-[#1a56a0] text-white text-xs font-bold flex items-center justify-center">2</span>
            <span>Add the key as the <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">X-Api-Key</code> header on every request. The key is shown once — store it in your secrets manager.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-none w-6 h-6 rounded-full bg-[#1a56a0] text-white text-xs font-bold flex items-center justify-center">3</span>
            <span>Register a webhook endpoint at <a href="/employer/webhooks" className="text-[#1a56a0] font-medium hover:underline">Webhooks</a> to receive real-time events.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-none w-6 h-6 rounded-full bg-[#1a56a0] text-white text-xs font-bold flex items-center justify-center">4</span>
            <span>Use <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">POST /api/v1/staff/sync</code> to bulk-invite your workforce by email — no manual approvals needed.</span>
          </li>
        </ol>
      </Section>

      <Section title="Authentication">
        <p className="text-sm text-[#475569] mb-4">
          All API requests must include your API key in the <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">X-Api-Key</code> header.
          Keys are scoped — a key created with <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">read:compliance</code> cannot
          access license data unless it also has <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">read:licenses</code>.
        </p>
        <Code>{`curl https://hayyamed.pro/api/v1/staff/compliance \\
  -H "X-Api-Key: hmp_live_xxxxxxxxxxxxxxxxxxxx"`}</Code>

        <div className="mt-4 p-4 bg-[#fff7ed] border border-[#fed7aa] rounded-lg">
          <p className="text-sm font-semibold text-[#92400e] mb-1">Rate limiting</p>
          <p className="text-sm text-[#92400e]">
            100 requests per minute per API key. Exceeded requests return HTTP 429 with a
            <code className="bg-[#fef3c7] px-1 rounded text-xs font-mono mx-1">Retry-After</code>
            header indicating seconds to wait.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {[
            { scope: "read:compliance", desc: "Read CME compliance status and credit progress for all linked staff." },
            { scope: "read:licenses",   desc: "Read license records, expiry dates, and renewal status." },
            { scope: "read:staff",      desc: "Push staff email lists to create bulk link requests." },
          ].map(({ scope, desc }) => (
            <div key={scope} className="border border-[#e2e8f0] rounded-lg p-3">
              <Badge label={scope} color="blue" />
              <p className="mt-2 text-xs text-[#475569]">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="REST API endpoints">
        <EndpointCard
          method="GET"
          path="/api/v1/staff/compliance"
          scope="read:compliance"
          description="Returns CME compliance status for all staff linked to your organisation. Filterable by status and profession. Paginated — max 200 per page."
          params={[
            { name: "page",       type: "integer", description: "Page number, starting at 1. Default: 1." },
            { name: "per_page",   type: "integer", description: "Records per page. Max 200. Default: 100." },
            { name: "status",     type: "string",  description: "Filter: compliant | non_compliant | at_risk" },
            { name: "profession", type: "string",  description: "Filter by profession slug, e.g. physician" },
          ]}
          response={`{
  "data": [
    {
      "professional_id": "a1b2c3d4-...",
      "full_name": "Dr. Fatima Al Rashid",
      "profession": "physician",
      "compliance_status": "at_risk",
      "completed_credits": 24,
      "required_credits": 40,
      "completion_pct": 60
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 100,
    "total": 48
  }
}`}
        />

        <EndpointCard
          method="GET"
          path="/api/v1/staff/licenses"
          scope="read:licenses"
          description="Returns license records for all linked staff. Filter by country and expiry window to build automated renewal reminders in your HRIS."
          params={[
            { name: "expiring_within_days", type: "integer", description: "Only return licenses expiring within N days." },
            { name: "country_code",         type: "string",  description: "ISO 3166-1 alpha-2 country code, e.g. QA" },
            { name: "page",                 type: "integer", description: "Page number. Default: 1." },
            { name: "per_page",             type: "integer", description: "Max 200. Default: 100." },
          ]}
          response={`{
  "data": [
    {
      "professional_id": "a1b2c3d4-...",
      "full_name": "Dr. Khalid Al Mulla",
      "license_number": "QCHP-2024-XXXXX",
      "country_code": "QA",
      "expiry_date": "2026-09-30",
      "days_until_expiry": 107
    }
  ],
  "meta": { "page": 1, "per_page": 100, "total": 12 }
}`}
        />

        <EndpointCard
          method="POST"
          path="/api/v1/staff/sync"
          scope="read:staff"
          description="Push a list of employee emails to create link requests in bulk. Idempotent — existing pending or approved links are skipped, not duplicated. Accepts up to 500 emails per call."
          params={[
            { name: "staff",            type: "array",   required: true,  description: "Array of staff objects." },
            { name: "staff[].email",    type: "string",  required: true,  description: "Employee email address registered on Hayya Med Pro." },
            { name: "staff[].department", type: "string", description: "Optional department label stored on the link request." },
          ]}
          response={`# Request body
{
  "staff": [
    { "email": "dr.khalid@hmc.org.qa", "department": "Cardiology" },
    { "email": "nurse.sara@hmc.org.qa", "department": "ICU" }
  ]
}

# Response
{
  "total_submitted": 2,
  "found": 2,
  "already_linked": 0,
  "new_requests": 2,
  "not_found": 0,
  "not_found_emails": []
}`}
        />
      </Section>

      <Section title="Webhook events">
        <p className="text-sm text-[#475569] mb-4">
          Webhooks deliver real-time POST requests to your endpoint whenever staff activity changes.
          Configure your endpoint and signing secret at{" "}
          <a href="/employer/webhooks" className="text-[#1a56a0] font-medium hover:underline">Webhooks</a>.
          Failed deliveries are retried automatically with exponential back-off.
        </p>

        <div className="mb-4 p-4 bg-[#f0f4f8] border border-[#e2e8f0] rounded-lg">
          <p className="text-sm font-semibold text-[#111] mb-2">Delivery format</p>
          <Code>{`POST https://your-hris.example.com/webhook/hayyamed
Content-Type: application/json
X-HMP-Event: staff.compliance_changed
X-HMP-Signature: sha256=...

{
  "event": "staff.compliance_changed",
  "organization_id": "org-uuid",
  "timestamp": "2026-06-15T09:00:00Z",
  "data": { ... }
}`}</Code>
        </div>

        <WebhookEventCard
          event="staff.linked"
          description="Fired when a professional accepts a link request and joins your organisation on the platform."
          payload={`{
  "professional_id": "prof-uuid",
  "link_request_id": "link-uuid"
}`}
        />

        <WebhookEventCard
          event="staff.unlinked"
          description="Fired when an employer admin removes a staff member from the organisation."
          payload={`{
  "professional_id": "prof-uuid",
  "link_request_id": "link-uuid"
}`}
        />

        <WebhookEventCard
          event="staff.compliance_changed"
          description="Fired when a staff member's CME compliance percentage changes. Only dispatched if the professional has not opted out of employer CME visibility in their privacy settings."
          payload={`{
  "professional_id": "prof-uuid",
  "compliance_pct": 60,
  "completed_credits": 24,
  "required_credits": 40,
  "threshold_pct": 80
}`}
        />

        <WebhookEventCard
          event="cme.verified"
          description="Fired when a CME activity submitted by a staff member is verified by a platform admin."
          payload={`{
  "professional_id": "prof-uuid",
  "activity_title": "Advanced Cardiac Life Support",
  "credits": 4
}`}
        />

        <WebhookEventCard
          event="course.completed"
          description="Fired when a staff member marks a marketplace course as complete and CME credits are issued."
          payload={`{
  "professional_id": "prof-uuid",
  "course_id": "course-uuid",
  "course_title": "Qatar Patient Safety Framework",
  "credits": 6,
  "enrollment_id": "enrollment-uuid"
}`}
        />

        <WebhookEventCard
          event="license.expiring"
          description="Fired for each employer org when a linked professional's license is 30 days or 7 days from expiry."
          payload={`{
  "professional_id": "prof-uuid",
  "license_expiry": "2026-09-30",
  "days_remaining": 30
}`}
        />
      </Section>

      <Section title="Webhook signature verification">
        <p className="text-sm text-[#475569] mb-4">
          Every webhook delivery includes an{" "}
          <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">X-HMP-Signature</code> header
          containing <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">sha256=HMAC_HEX</code>.
          Always verify this before processing the payload to prevent replay attacks.
          Your webhook secret is shown when you register the endpoint at{" "}
          <a href="/employer/webhooks" className="text-[#1a56a0] hover:underline">Webhooks</a>.
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2">Node.js / TypeScript</p>
            <Code>{`import { createHmac } from "crypto";

function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string
): boolean {
  const expected = "sha256=" + createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  // Constant-time comparison prevents timing attacks
  return expected.length === signatureHeader.length &&
    Buffer.from(expected).equals(Buffer.from(signatureHeader));
}

// In your webhook handler (Express / Next.js API route):
const rawBody = await req.text();
const signature = req.headers.get("x-hmp-signature") ?? "";
if (!verifyWebhookSignature(rawBody, signature, process.env.WEBHOOK_SECRET!)) {
  return new Response("Invalid signature", { status: 401 });
}
const event = JSON.parse(rawBody);
console.log("Event type:", req.headers.get("x-hmp-event"));`}</Code>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-2">Python</p>
            <Code>{`import hmac, hashlib

def verify_webhook_signature(raw_body: bytes, signature_header: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(
        secret.encode(), raw_body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature_header)

# In your Flask / FastAPI handler:
raw_body = request.get_data()
signature = request.headers.get("X-HMP-Signature", "")
if not verify_webhook_signature(raw_body, signature, os.environ["WEBHOOK_SECRET"]):
    return {"error": "Invalid signature"}, 401
event = request.get_json(force=True)`}</Code>
          </div>
        </div>
      </Section>

      <Section title="Compliance & privacy">
        <div className="space-y-3 text-sm text-[#475569]">
          <p>
            All API responses and webhook payloads use <strong className="text-[#111]">professional_id</strong> (UUID), never
            names or license numbers, except where the staff member has explicitly consented by joining your
            organisation on the platform.
          </p>
          <p>
            Professionals can toggle employer CME visibility in their Privacy Settings. When
            <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono mx-1">employer_can_view_cme_summary</code>
            is disabled, their data is excluded from <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">staff.compliance_changed</code> webhooks
            and the <code className="bg-[#f1f5f9] px-1 py-0.5 rounded text-xs font-mono">read:compliance</code> endpoint.
          </p>
          <p>
            Ensure your integration agreement with Hayya Med Pro includes a signed Data Processing
            Agreement (DPA) before processing staff health data. Contact{" "}
            <a href="mailto:privacy@hayyamed.pro" className="text-[#1a56a0] hover:underline">privacy@hayyamed.pro</a>{" "}
            for the DPA template.
          </p>
        </div>
      </Section>

      <Section title="Support">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <a
            href="/employer/api-keys"
            className="flex items-center gap-3 p-4 border border-[#e2e8f0] rounded-lg hover:border-[#1a56a0] hover:bg-[#f0f4f8] transition-colors"
          >
            <span className="text-2xl">🔑</span>
            <div>
              <p className="font-semibold text-[#111]">Manage API keys</p>
              <p className="text-[#64748b] text-xs">Create, rotate, and revoke keys</p>
            </div>
          </a>
          <a
            href="/employer/webhooks"
            className="flex items-center gap-3 p-4 border border-[#e2e8f0] rounded-lg hover:border-[#1a56a0] hover:bg-[#f0f4f8] transition-colors"
          >
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-semibold text-[#111]">Configure webhooks</p>
              <p className="text-[#64748b] text-xs">Endpoints, events, delivery history</p>
            </div>
          </a>
        </div>
      </Section>
    </div>
  );
}

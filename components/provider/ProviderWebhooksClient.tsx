"use client";

import { useState, useTransition, useCallback } from "react";

const ALL_EVENTS = [
  { key: "course.enrolled",  label: "Course Enrolled",  desc: "A professional enrols in one of your courses" },
  { key: "course.completed", label: "Course Completed", desc: "A professional completes one of your courses" },
  { key: "course.reviewed",  label: "Course Reviewed",  desc: "A professional submits a review on one of your courses" },
] as const;

type EventKey = typeof ALL_EVENTS[number]["key"];

type Endpoint = {
  id: string;
  url: string;
  events: string[];
  description: string | null;
  is_active: boolean;
  created_at: string;
  deliveries_7d: { delivered: number; failed: number; pending: number };
};

function SecretReveal({ secret }: { secret: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4 bg-[#0f1f3d] rounded-xl p-4">
      <p className="text-xs font-semibold text-[#fcd34d] mb-2">
        Save this signing secret — it will never be shown again.
      </p>
      <div className="flex items-center gap-2">
        <code className="text-xs text-[#a5f3fc] font-mono break-all flex-1">{secret}</code>
        <button
          type="button"
          onClick={() => { navigator.clipboard.writeText(secret); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1547a0] whitespace-nowrap"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="text-[10px] text-[#94a3b8] mt-2">
        Verify incoming requests: <code>X-Hayya-Signature: sha256=HMAC-SHA256(secret, body)</code>
      </p>
    </div>
  );
}

function EndpointCard({
  endpoint,
  onToggle,
  onDelete,
  onTest,
}: {
  endpoint: Endpoint;
  onToggle: (id: string, active: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onTest: (id: string) => Promise<{ ok: boolean; status?: number; error?: string }>;
}) {
  const [toggling, startToggle] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [testResult, setTestResult] = useState<{ ok: boolean; status?: number; error?: string } | null>(null);
  const [testing, startTest] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { delivered, failed, pending } = endpoint.deliveries_7d;

  return (
    <div className={`bg-white rounded-xl border transition-all ${endpoint.is_active ? "border-[#e2e8f0]" : "border-dashed border-[#e2e8f0] opacity-70"}`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${endpoint.is_active ? "bg-[#dcfce7] text-[#15803d]" : "bg-[#f1f5f9] text-[#64748b]"}`}>
                {endpoint.is_active ? "Active" : "Paused"}
              </span>
            </div>
            <p className="text-sm font-mono text-[#0f1f3d] break-all">{endpoint.url}</p>
            {endpoint.description && (
              <p className="text-xs text-[#64748b] mt-0.5">{endpoint.description}</p>
            )}
          </div>
          <button
            type="button"
            disabled={toggling}
            onClick={() => startToggle(() => onToggle(endpoint.id, !endpoint.is_active))}
            aria-label={endpoint.is_active ? "Pause endpoint" : "Resume endpoint"}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${endpoint.is_active ? "bg-[#1a56a0]" : "bg-[#e2e8f0]"}`}
          >
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${endpoint.is_active ? "translate-x-4" : "translate-x-0.5"}`} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {endpoint.events.map((ev) => (
            <span key={ev} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f0f7ff] text-[#1a56a0] border border-[#bfdbfe]">
              {ev}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-[#64748b] mb-4 pt-3 border-t border-[#f8fafc]">
          <span>Last 7 days:</span>
          <span className="text-[#16a34a] font-medium">{delivered} delivered</span>
          {failed > 0 && <span className="text-[#dc2626] font-medium">{failed} failed</span>}
          {pending > 0 && <span className="text-[#d97706] font-medium">{pending} pending</span>}
          {delivered === 0 && failed === 0 && pending === 0 && <span className="text-[#94a3b8]">No deliveries yet</span>}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={testing}
            onClick={() => {
              setTestResult(null);
              startTest(async () => {
                const r = await onTest(endpoint.id);
                setTestResult(r);
              });
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#e2e8f0] text-[#374151] hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors"
          >
            {testing ? "Sending…" : "Send test"}
          </button>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#fee2e2] text-[#dc2626] hover:bg-[#fef2f2] transition-colors ml-auto"
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-[#dc2626]">Sure?</span>
              <button
                type="button"
                disabled={deleting}
                onClick={() => startDelete(() => onDelete(endpoint.id))}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#dc2626] text-white hover:bg-[#b91c1c]"
              >
                {deleting ? "…" : "Yes, delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-[#64748b] hover:text-[#374151]"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {testResult && (
          <div className={`mt-3 rounded-lg px-3 py-2 text-xs ${testResult.ok ? "bg-[#f0fdf4] text-[#15803d]" : "bg-[#fef2f2] text-[#dc2626]"}`}>
            {testResult.ok
              ? `Test delivered — HTTP ${testResult.status}`
              : `Test failed — ${testResult.error ?? `HTTP ${testResult.status}`}`
            }
          </div>
        )}
      </div>
    </div>
  );
}

function AddEndpointForm({ onCreated }: { onCreated: (ep: Endpoint & { secret: string }) => void }) {
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [events, setEvents] = useState<Set<EventKey>>(new Set(["course.enrolled", "course.completed"]));
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = (key: EventKey) => {
    setEvents((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const submit = () => {
    if (!url || events.size === 0) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/provider/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, description: desc || undefined, events: Array.from(events) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to create endpoint");
        return;
      }
      const data = await res.json();
      onCreated(data.endpoint);
      setUrl(""); setDesc(""); setEvents(new Set(["course.enrolled", "course.completed"]));
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
      <h3 className="text-sm font-semibold text-[#0f1f3d] mb-4">Add webhook endpoint</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="wh-url" className="block text-xs font-semibold text-[#374151] mb-1">
            Endpoint URL <span className="text-[#dc2626]">*</span>
          </label>
          <input
            id="wh-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-lms.com/webhook"
            className="w-full text-sm px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0]"
          />
        </div>

        <div>
          <label htmlFor="wh-desc" className="block text-xs font-semibold text-[#374151] mb-1">Description (optional)</label>
          <input
            id="wh-desc"
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="e.g. LMS enrollment sync"
            maxLength={200}
            className="w-full text-sm px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0]"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-[#374151] mb-2">Events to subscribe</p>
          <div className="space-y-2">
            {ALL_EVENTS.map((ev) => (
              <label
                key={ev.key}
                className={`flex items-start gap-2.5 cursor-pointer p-2.5 rounded-lg border transition-colors ${events.has(ev.key) ? "border-[#1a56a0] bg-[#f0f7ff]" : "border-[#e2e8f0] hover:border-[#bfdbfe]"}`}
              >
                <input
                  type="checkbox"
                  checked={events.has(ev.key)}
                  onChange={() => toggle(ev.key)}
                  className="mt-0.5 rounded border-[#e2e8f0] text-[#1a56a0]"
                />
                <div>
                  <p className="text-xs font-semibold text-[#0f1f3d]">{ev.label}</p>
                  <p className="text-[10px] text-[#64748b]">{ev.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-[#dc2626]">{error}</p>}

        <button
          type="button"
          disabled={pending || !url || events.size === 0}
          onClick={submit}
          className="w-full bg-[#1a56a0] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
        >
          {pending ? "Creating…" : "Create endpoint"}
        </button>
      </div>
    </div>
  );
}

export default function ProviderWebhooksClient({ initialEndpoints }: { initialEndpoints: Endpoint[] }) {
  const [endpoints, setEndpoints] = useState<Endpoint[]>(initialEndpoints);
  const [newSecret, setNewSecret] = useState<string | null>(null);

  const handleCreated = useCallback((ep: Endpoint & { secret: string }) => {
    const { secret, ...rest } = ep;
    setEndpoints((prev) => [rest, ...prev]);
    setNewSecret(secret);
  }, []);

  const handleToggle = useCallback(async (id: string, active: boolean) => {
    await fetch("/api/provider/webhooks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: active }),
    });
    setEndpoints((prev) => prev.map((ep) => ep.id === id ? { ...ep, is_active: active } : ep));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    await fetch("/api/provider/webhooks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setEndpoints((prev) => prev.filter((ep) => ep.id !== id));
  }, []);

  const handleTest = useCallback(async (id: string) => {
    const res = await fetch("/api/provider/webhooks/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    return res.json();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f1f3d] mb-1">Webhook Integrations</h1>
        <p className="text-sm text-[#64748b]">
          Send real-time course events to your LMS, CRM, or any HTTPS endpoint — enrolments, completions, and reviews.
        </p>
      </div>

      {newSecret && (
        <div className="mb-6">
          <SecretReveal secret={newSecret} />
          <button
            type="button"
            onClick={() => setNewSecret(null)}
            className="mt-2 text-xs text-[#64748b] hover:text-[#374151] underline"
          >
            I&apos;ve saved my secret — dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {endpoints.length === 0 && !newSecret && (
            <div className="bg-[#f8fafc] border border-dashed border-[#e2e8f0] rounded-xl px-5 py-8 text-center">
              <p className="text-sm font-medium text-[#374151] mb-1">No webhook endpoints yet</p>
              <p className="text-xs text-[#94a3b8]">Add an endpoint to receive enrolment and completion events in your LMS.</p>
            </div>
          )}
          {endpoints.map((ep) => (
            <EndpointCard
              key={ep.id}
              endpoint={ep}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onTest={handleTest}
            />
          ))}
        </div>

        <div className="space-y-4">
          {endpoints.length < 5 && <AddEndpointForm onCreated={handleCreated} />}

          <div className="bg-[#f0f7ff] border border-[#bfdbfe] rounded-xl px-5 py-4">
            <p className="text-xs font-semibold text-[#1e40af] mb-2">Signature verification</p>
            <p className="text-xs text-[#1e40af] leading-relaxed mb-2">
              Every delivery includes an <code>X-Hayya-Signature</code> header. Verify it in your LMS:
            </p>
            <pre className="text-[10px] text-[#1e40af] bg-[#dbeafe] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
{`const sig = req.headers["x-hayya-signature"];
const expected = "sha256=" +
  createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
if (sig !== expected) throw new Error("Invalid signature");`}
            </pre>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-5 py-4">
            <p className="text-xs font-semibold text-[#374151] mb-3">Event payload examples</p>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-semibold text-[#64748b] mb-1">course.enrolled</p>
                <pre className="text-[10px] bg-[#0f1f3d] text-[#a5f3fc] rounded-lg p-2.5 overflow-x-auto">{`{
  "event": "course.enrolled",
  "provider_id": "prov-uuid",
  "data": {
    "enrollment_id": "enr-uuid",
    "course_id": "course-uuid",
    "professional_id": "prof-uuid"
  }
}`}</pre>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#64748b] mb-1">course.completed</p>
                <pre className="text-[10px] bg-[#0f1f3d] text-[#a5f3fc] rounded-lg p-2.5 overflow-x-auto">{`{
  "event": "course.completed",
  "provider_id": "prov-uuid",
  "data": {
    "enrollment_id": "enr-uuid",
    "course_id": "course-uuid",
    "professional_id": "prof-uuid",
    "completed_at": "2026-06-16T10:00:00Z"
  }
}`}</pre>
              </div>
            </div>
          </div>

          <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-5 py-4">
            <p className="text-xs font-semibold text-[#374151] mb-2">Retry policy</p>
            <ul className="text-xs text-[#64748b] space-y-1 list-disc list-inside">
              <li>Hayya Med Pro retries failed deliveries up to 5 times</li>
              <li>Exponential backoff: 2, 4, 8, 16, 32 minutes between retries</li>
              <li>Your endpoint must respond with HTTP 2xx within 10 seconds</li>
              <li>Deliveries exceeding 5 attempts are marked permanently failed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

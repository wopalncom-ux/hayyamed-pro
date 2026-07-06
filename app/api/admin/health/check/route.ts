import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["founder", "master_admin", "super_admin"])
    .limit(1)
    .maybeSingle();
  return member ? user : null;
}

type CheckResult = { status: "ok" | "degraded" | "down"; latency_ms: number; detail: string };

async function checkSupabase(): Promise<CheckResult> {
  try {
    const admin = createAdminClient();
    const t = Date.now();
    await admin.from("professional_profiles").select("id", { count: "exact", head: true });
    const ms = Date.now() - t;
    return { status: ms > 2000 ? "degraded" : "ok", latency_ms: ms, detail: `Query responded in ${ms}ms` };
  } catch (e) {
    return { status: "down", latency_ms: 0, detail: String(e) };
  }
}

async function checkStorage(): Promise<CheckResult> {
  try {
    const admin = createAdminClient();
    const t = Date.now();
    await admin.storage.from("media-library").list("", { limit: 1 });
    const ms = Date.now() - t;
    return { status: ms > 3000 ? "degraded" : "ok", latency_ms: ms, detail: `Storage responded in ${ms}ms` };
  } catch (e) {
    return { status: "down", latency_ms: 0, detail: String(e) };
  }
}

async function checkPostmark(): Promise<CheckResult> {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  if (!token) return { status: "down", latency_ms: 0, detail: "POSTMARK_SERVER_TOKEN not set" };
  try {
    const t = Date.now();
    const res = await fetch("https://api.postmarkapp.com/server", {
      headers: { Accept: "application/json", "X-Postmark-Server-Token": token },
    });
    const ms = Date.now() - t;
    if (!res.ok) return { status: "down", latency_ms: ms, detail: `HTTP ${res.status}` };
    const json = await res.json() as { Name?: string };
    return { status: ms > 3000 ? "degraded" : "ok", latency_ms: ms, detail: `Server: ${json.Name ?? "OK"}` };
  } catch (e) {
    return { status: "down", latency_ms: 0, detail: String(e) };
  }
}

async function checkVertex(): Promise<CheckResult> {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!project) return { status: "down", latency_ms: 0, detail: "GOOGLE_CLOUD_PROJECT not set" };
  const region = process.env.VERTEX_REGION ?? "us-east5";
  return { status: "ok", latency_ms: 0, detail: `Project ${project} (${region}) — Gemini via Vertex AI, GCP service-account auth` };
}

async function checkPaddle(): Promise<CheckResult> {
  const key = process.env.PADDLE_API_KEY;
  const webhook = process.env.PADDLE_WEBHOOK_SECRET;
  if (!key || !webhook) {
    const missing = [!key && "PADDLE_API_KEY", !webhook && "PADDLE_WEBHOOK_SECRET"].filter(Boolean).join(", ");
    return { status: "down", latency_ms: 0, detail: `Missing: ${missing}` };
  }
  return { status: "ok", latency_ms: 0, detail: "API key + webhook secret configured" };
}

async function checkVapid(): Promise<CheckResult> {
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub && !priv) return { status: "down", latency_ms: 0, detail: "VAPID keys not set — push disabled" };
  if (!pub)  return { status: "degraded", latency_ms: 0, detail: "NEXT_PUBLIC_VAPID_PUBLIC_KEY missing" };
  if (!priv) return { status: "degraded", latency_ms: 0, detail: "VAPID_PRIVATE_KEY missing" };
  return { status: "ok", latency_ms: 0, detail: "Both VAPID keys configured" };
}

async function checkSelf(): Promise<CheckResult> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";
  try {
    const t = Date.now();
    const res = await fetch(`${base}/api/health`, { cache: "no-store" });
    const ms = Date.now() - t;
    if (!res.ok) return { status: "degraded", latency_ms: ms, detail: `HTTP ${res.status}` };
    return { status: ms > 2000 ? "degraded" : "ok", latency_ms: ms, detail: `App responded in ${ms}ms` };
  } catch (e) {
    return { status: "down", latency_ms: 0, detail: String(e) };
  }
}

const CHECKS: Record<string, () => Promise<CheckResult>> = {
  supabase:  checkSupabase,
  storage:   checkStorage,
  postmark:  checkPostmark,
  vertex:    checkVertex,
  paddle:    checkPaddle,
  vapid:     checkVapid,
  app:       checkSelf,
};

// POST /api/admin/health/check  body: { service: 'supabase' | ... }
export async function POST(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { service } = await req.json();
  const checker = CHECKS[service];
  if (!checker) return NextResponse.json({ error: "Unknown service" }, { status: 400 });

  const result = await checker();
  return NextResponse.json(result);
}

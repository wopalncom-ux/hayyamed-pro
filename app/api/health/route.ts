import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const critical: Record<string, string> = {};
  const optional: Record<string, string> = {};

  // DB connectivity — critical: if this fails, platform is down
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("professional_profiles").select("id").limit(1);
    critical.database = error ? "error" : "ok";
  } catch {
    critical.database = "error";
  }

  // Required env vars — critical: platform cannot function without these
  critical.supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL ? "ok" : "missing";

  // AI provider — Vertex AI via ADC (no API key needed on Cloud Run)
  critical.vertex_ai = process.env.GOOGLE_CLOUD_PROJECT ? "ok" : "missing";

  // Optional services — degraded if missing but not critical
  optional.paddle   = process.env.PADDLE_API_KEY   ? "ok" : "missing";
  optional.postmark = process.env.POSTMARK_API_TOKEN ? "ok" : "missing";
  optional.cron     = process.env.CRON_SECRET       ? "ok" : "missing";
  optional.push     = process.env.VAPID_PRIVATE_KEY  ? "ok" : "missing";

  const healthy = Object.values(critical).every((v) => v === "ok");

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      critical,
      optional,
      ts: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 },
  );
}

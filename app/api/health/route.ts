import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {};
  let healthy = true;

  // DB connectivity check
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("professional_profiles").select("id").limit(1);
    checks.database = error ? "error" : "ok";
    if (error) healthy = false;
  } catch {
    checks.database = "error";
    healthy = false;
  }

  // Required env vars present
  checks.supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL ? "ok" : "missing";
  checks.paddle = process.env.PADDLE_API_KEY ? "ok" : "missing";
  checks.postmark = process.env.POSTMARK_API_TOKEN ? "ok" : "missing";
  checks.anthropic = process.env.ANTHROPIC_API_KEY ? "ok" : "missing";

  if (Object.values(checks).some((v) => v !== "ok")) healthy = false;

  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", checks, ts: new Date().toISOString() },
    { status: healthy ? 200 : 503 }
  );
}

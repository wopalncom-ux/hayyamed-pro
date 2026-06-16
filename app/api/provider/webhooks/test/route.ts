import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createHmac } from "crypto";

export const runtime = "nodejs";

const Schema = z.object({ id: z.string().uuid() });

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Missing endpoint id" }, { status: 400 });

  const admin = createAdminClient();

  const { data: provider } = await admin
    .from("training_providers")
    .select("id")
    .eq("created_by", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!provider) return NextResponse.json({ error: "No active training provider" }, { status: 403 });

  const { data: endpoint } = await admin
    .from("webhook_endpoints")
    .select("id, url, secret, training_provider_id")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (!endpoint || endpoint.training_provider_id !== provider.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const payload = JSON.stringify({
    event: "test",
    timestamp: new Date().toISOString(),
    provider_id: endpoint.training_provider_id,
    data: { message: "This is a test delivery from Hayya Med Pro." },
  });

  const sig = `sha256=${createHmac("sha256", endpoint.secret).update(payload).digest("hex")}`;

  try {
    const res = await fetch(endpoint.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hayya-Signature": sig,
        "X-Hayya-Event": "test",
        "User-Agent": "HayyaMed-Webhooks/1.0",
      },
      body: payload,
      signal: AbortSignal.timeout(10_000),
    });

    const responseBody = (await res.text()).slice(0, 200);
    return NextResponse.json({ ok: res.ok, status: res.status, body: responseBody });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 502 });
  }
}

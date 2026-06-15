import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { randomBytes } from "crypto";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const VALID_EVENTS = [
  "staff.compliance_changed",
  "license.expiring",
  "course.completed",
  "cme.verified",
  "staff.linked",
  "staff.unlinked",
] as const;

async function getEmployerOrg(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", userId)
    .eq("role", "employer_admin")
    .maybeSingle();
  return data?.organization_id ?? null;
}

// GET — list endpoints for this employer org
export async function GET() {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = await getEmployerOrg(user.id);
  if (!orgId) return NextResponse.json({ error: "No employer organisation" }, { status: 403 });

  const admin = createAdminClient();
  const { data: endpoints } = await admin
    .from("webhook_endpoints")
    .select("id, url, events, description, is_active, created_at")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  // Fetch recent delivery counts per endpoint
  const ids = (endpoints ?? []).map((e) => e.id);
  const { data: deliveries } = ids.length
    ? await admin
        .from("webhook_deliveries")
        .select("endpoint_id, status")
        .in("endpoint_id", ids)
        .gte("created_at", new Date(Date.now() - 7 * 86400_000).toISOString())
    : { data: [] };

  const deliveryMap: Record<string, { delivered: number; failed: number; pending: number }> = {};
  for (const d of deliveries ?? []) {
    deliveryMap[d.endpoint_id] = deliveryMap[d.endpoint_id] ?? { delivered: 0, failed: 0, pending: 0 };
    const s = d.status as "delivered" | "failed" | "pending";
    if (s in deliveryMap[d.endpoint_id]) deliveryMap[d.endpoint_id][s]++;
  }

  const enriched = (endpoints ?? []).map((ep) => ({
    ...ep,
    deliveries_7d: deliveryMap[ep.id] ?? { delivered: 0, failed: 0, pending: 0 },
  }));

  return NextResponse.json({ endpoints: enriched });
}

const CreateSchema = z.object({
  url: z.string().url().max(500),
  events: z.array(z.enum(VALID_EVENTS)).min(1),
  description: z.string().max(200).optional(),
});

// POST — create endpoint with auto-generated secret (returned once)
export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = await getEmployerOrg(user.id);
  if (!orgId) return NextResponse.json({ error: "No employer organisation" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });

  // Check org has ≤ 5 endpoints (fair use limit)
  const admin = createAdminClient();
  const { count } = await admin
    .from("webhook_endpoints")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", orgId);

  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: "Maximum 5 webhook endpoints per organisation" }, { status: 400 });
  }

  const secret = `whsec_${randomBytes(32).toString("hex")}`;

  const { data: endpoint, error } = await admin
    .from("webhook_endpoints")
    .insert({
      organization_id: orgId,
      url: parsed.data.url,
      secret,
      events: parsed.data.events,
      description: parsed.data.description ?? null,
      created_by: user.id,
    })
    .select("id, url, events, description, is_active, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: "employer.webhook_endpoint.created",
    targetTable: "webhook_endpoints",
    targetId: endpoint.id,
    metadata: { url: parsed.data.url, events: parsed.data.events },
  });

  // Return secret ONCE — not stored retrievably after this
  return NextResponse.json({ endpoint: { ...endpoint, secret } }, { status: 201 });
}

const UpdateSchema = z.object({
  id: z.string().uuid(),
  is_active: z.boolean().optional(),
  events: z.array(z.enum(VALID_EVENTS)).min(1).optional(),
  description: z.string().max(200).optional(),
});

// PATCH — toggle active / update events
export async function PATCH(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = await getEmployerOrg(user.id);
  if (!orgId) return NextResponse.json({ error: "No employer organisation" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id, ...update } = parsed.data;
  const admin = createAdminClient();

  // Verify ownership
  const { data: existing } = await admin
    .from("webhook_endpoints")
    .select("organization_id")
    .eq("id", id)
    .maybeSingle();

  if (!existing || existing.organization_id !== orgId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await admin
    .from("webhook_endpoints")
    .update(update)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: "employer.webhook_endpoint.updated",
    targetTable: "webhook_endpoints",
    targetId: id,
    metadata: update,
  });

  return NextResponse.json({ ok: true });
}

// DELETE — remove endpoint
export async function DELETE(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = await getEmployerOrg(user.id);
  if (!orgId) return NextResponse.json({ error: "No employer organisation" }, { status: 403 });

  const { id } = await req.json().catch(() => ({ id: null }));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("webhook_endpoints")
    .select("organization_id, url")
    .eq("id", id)
    .maybeSingle();

  if (!existing || existing.organization_id !== orgId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await admin.from("webhook_endpoints").delete().eq("id", id);

  await logAudit({
    actorAuthId: user.id,
    action: "employer.webhook_endpoint.deleted",
    targetTable: "webhook_endpoints",
    targetId: id,
    metadata: { url: existing.url },
  });

  return NextResponse.json({ ok: true });
}

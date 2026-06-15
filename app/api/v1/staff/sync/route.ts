import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyApiKey, requireScope } from "@/lib/apiKeyAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { checkApiKeyRateLimit } from "@/lib/rateLimit";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const StaffSchema = z.object({
  staff: z
    .array(
      z.object({
        email: z.string().email(),
        department: z.string().max(100).optional(),
      })
    )
    .min(1)
    .max(500),
});

/**
 * POST /api/v1/staff/sync
 *
 * HRIS integration endpoint — push a list of employee emails to create
 * employer link requests in bulk. Idempotent: existing pending/approved
 * links are skipped, not duplicated.
 *
 * Authentication: X-Api-Key: hmp_live_...
 * Required scope:  read:staff   (read:staff grants implicit write for link requests)
 *
 * Body: { "staff": [{ "email": "dr@hospital.qa", "department": "Cardiology" }] }
 *
 * Returns:
 *   total_submitted  — number of emails sent in the request
 *   found            — matched to a Hayya Med Pro professional profile
 *   already_linked   — already have an approved or pending link (skipped)
 *   new_requests     — new pending link requests created
 *   not_found        — email not registered on the platform
 *   not_found_emails — list of unmatched emails (max 50 returned)
 */
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? req.headers.get("authorization")?.replace("Bearer ", "");
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing X-Api-Key header", docs: "https://hayyamed.pro/docs/api" },
      { status: 401 }
    );
  }

  const ctx = await verifyApiKey(apiKey);
  if (!ctx) return NextResponse.json({ error: "Invalid or expired API key" }, { status: 401 });

  if (!requireScope(ctx, "read:staff")) {
    return NextResponse.json({ error: "Insufficient scope — requires read:staff" }, { status: 403 });
  }

  const rl = await checkApiKeyRateLimit(ctx.keyId, 20); // lower limit — sync is expensive
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded — 20 sync requests per minute per API key" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = StaffSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { staff } = parsed.data;
  const emails = staff.map((s) => s.email.toLowerCase());

  const admin = createAdminClient();

  // Look up professional profiles by email
  const { data: profiles } = await admin
    .from("professional_profiles")
    .select("auth_id, email")
    .in("email", emails);

  const emailToAuthId = Object.fromEntries(
    (profiles ?? []).map((p) => [p.email?.toLowerCase() ?? "", p.auth_id])
  );

  const foundIds = Object.values(emailToAuthId);

  // Find existing link requests for this org + these professionals
  const { data: existingLinks } = foundIds.length
    ? await admin
        .from("employer_link_requests")
        .select("professional_id, status")
        .eq("organization_id", ctx.organizationId)
        .in("professional_id", foundIds)
    : { data: [] };

  const existingLinkMap = Object.fromEntries(
    (existingLinks ?? []).map((l) => [l.professional_id, l.status])
  );

  // Build inserts — only for profiles with no existing link
  const toInsert: { organization_id: string; professional_id: string; status: string; department: string | null }[] = [];
  const notFoundEmails: string[] = [];
  let alreadyLinked = 0;

  for (const entry of staff) {
    const email = entry.email.toLowerCase();
    const authId = emailToAuthId[email];

    if (!authId) {
      notFoundEmails.push(entry.email);
      continue;
    }

    const existingStatus = existingLinkMap[authId];
    if (existingStatus === "approved" || existingStatus === "pending") {
      alreadyLinked++;
      continue;
    }

    toInsert.push({
      organization_id: ctx.organizationId,
      professional_id: authId,
      status: "pending",
      department: entry.department ?? null,
    });
  }

  let newRequests = 0;
  if (toInsert.length > 0) {
    const { error } = await admin
      .from("employer_link_requests")
      .insert(toInsert);

    if (!error) {
      newRequests = toInsert.length;
    }
  }

  await logAudit({
    actorAuthId: ctx.keyId,
    action: "api.v1.staff.sync",
    targetTable: "employer_link_requests",
    metadata: {
      organization_id: ctx.organizationId,
      total_submitted: staff.length,
      found: foundIds.length,
      already_linked: alreadyLinked,
      new_requests: newRequests,
      not_found: notFoundEmails.length,
    },
  });

  return NextResponse.json({
    summary: {
      total_submitted: staff.length,
      found: foundIds.length,
      already_linked: alreadyLinked,
      new_requests: newRequests,
      not_found: notFoundEmails.length,
    },
    not_found_emails: notFoundEmails.slice(0, 50),
    meta: {
      organization_id: ctx.organizationId,
      generated_at: new Date().toISOString(),
      api_version: "v1",
    },
  });
}

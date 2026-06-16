import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { checkAndLogRateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const CERT_BUCKET = "certificates";
const STORAGE_BATCH = 100;

export const runtime = "nodejs";

const BodySchema = z.object({
  confirm: z.literal(true),
});

/**
 * POST /api/account/delete
 *
 * Permanently deletes the authenticated user's account.
 * Implements PDPL (Qatar Law No. 13 of 2016) and GDPR Article 17 right to erasure.
 *
 * Body: { confirm: true }  — explicit confirmation required.
 *
 * What is deleted:
 *   - auth.users row → cascades to professional_profiles, cme_activities,
 *     subscriptions, push_subscriptions, all linked tables (ON DELETE CASCADE)
 *   - Mobile device registrations, API keys, passkeys
 *
 * What is retained (legal obligation):
 *   - audit_logs entries (actor_auth_id → NULL after cascade; retained 7 years)
 *   - ai_call_logs entries (actor → NULL; cost audit retained)
 *   - Anonymized analytics events in PostHog (no PII stored there)
 *
 * The Paddle subscription must be cancelled separately via the billing portal
 * before deletion; active subscriptions are not forcibly cancelled here to
 * avoid triggering unintended refund flows.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await checkAndLogRateLimit({ action: "account.delete_attempt", userId: user.id, maxPerHour: 3 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many deletion attempts. Please contact support@hayyamed.pro if this is unexpected." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Body must be { confirm: true } to confirm account deletion" },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Check for active paid subscription — warn the user before deletion
  const { data: sub } = await admin
    .from("subscriptions")
    .select("plan, status, paddle_subscription_id")
    .eq("professional_id", user.id)
    .maybeSingle();

  const hasActivePaidSub =
    sub &&
    sub.plan !== "free" &&
    sub.status === "active" &&
    sub.paddle_subscription_id;

  if (hasActivePaidSub) {
    return NextResponse.json(
      {
        error: "ACTIVE_SUBSCRIPTION",
        message:
          "You have an active paid subscription. Please cancel it from the billing portal before deleting your account.",
      },
      { status: 409 }
    );
  }

  // Purge certificate files from private storage bucket (PDPL right to erasure).
  // Must happen BEFORE auth user deletion — ON DELETE CASCADE removes the
  // certificate_storage_records rows, so paths would be unqueryable after deletion.
  const { data: certFiles } = await admin
    .from("certificate_storage_records")
    .select("storage_path")
    .eq("professional_id", user.id)
    .eq("is_deleted", false);

  let filesDeleted = 0;
  if (certFiles && certFiles.length > 0) {
    const allPaths = certFiles.map((f) => f.storage_path as string);
    for (let i = 0; i < allPaths.length; i += STORAGE_BATCH) {
      await admin.storage.from(CERT_BUCKET).remove(allPaths.slice(i, i + STORAGE_BATCH));
    }
    filesDeleted = allPaths.length;
  }

  // Audit log BEFORE deletion — actor_auth_id will become NULL after cascade
  await logAudit({
    actorAuthId: user.id,
    action: "account.deleted",
    targetTable: "auth.users",
    targetId: user.id,
    metadata: {
      email: user.email,
      deleted_at: new Date().toISOString(),
      initiated_by: "user",
      reason: "user_requested_erasure",
      certificate_files_deleted: filesDeleted,
    },
  });

  // Delete the auth user — Supabase cascades to all linked tables
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Failed to delete account. Please contact support@hayyamed.pro." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, message: "Account permanently deleted." });
}

import { createAdminClient } from "@/lib/supabase/server";

interface RateLimitConfig {
  action: string;
  userId: string;
  maxPerHour: number;
  metadata?: Record<string, unknown>;
}

interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export async function checkAndLogRateLimit({
  action,
  userId,
  maxPerHour,
  metadata,
}: RateLimitConfig): Promise<RateLimitResult> {
  const admin = createAdminClient();
  const windowStart = new Date(Date.now() - 3600_000).toISOString();

  const { count } = await admin
    .from("audit_logs")
    .select("*", { count: "exact", head: true })
    .eq("actor_auth_id", userId)
    .eq("action", action)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= maxPerHour) {
    return { allowed: false, retryAfterSeconds: 3600 };
  }

  await admin.from("audit_logs").insert({
    actor_auth_id: userId,
    action,
    target_table: null,
    target_id: null,
    metadata: metadata ?? null,
  });

  return { allowed: true };
}

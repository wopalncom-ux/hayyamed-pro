import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
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
  remaining?: number;
}

// Cache Redis + Ratelimit instances at module level (safe for Cloud Run long-running containers)
let _redis: Redis | null = null;
const _limiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
}

function getLimiter(action: string, maxPerHour: number): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  const key = `${action}:${maxPerHour}`;
  if (!_limiters.has(key)) {
    _limiters.set(
      key,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(maxPerHour, "1 h"),
        prefix: `hayyamed:rl:${action}`,
        analytics: false,
      })
    );
  }
  return _limiters.get(key)!;
}

export async function checkAndLogRateLimit({
  action,
  userId,
  maxPerHour,
  metadata,
}: RateLimitConfig): Promise<RateLimitResult> {
  const limiter = getLimiter(action, maxPerHour);

  if (limiter) {
    // Upstash path — sub-millisecond, no DB write needed
    const result = await limiter.limit(userId);
    if (!result.success) {
      const retryAfter = result.reset
        ? Math.ceil((result.reset - Date.now()) / 1000)
        : 3600;
      return { allowed: false, retryAfterSeconds: retryAfter, remaining: 0 };
    }
    return { allowed: true, remaining: result.remaining };
  }

  // Fallback: DB-based rate limiting (no Upstash configured)
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

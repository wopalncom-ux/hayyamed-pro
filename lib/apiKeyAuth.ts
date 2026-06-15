import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/server";

export type ApiKeyContext = {
  organizationId: string;
  keyId: string;
  scopes: string[];
};

export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export function generateApiKey(): { key: string; prefix: string; hash: string } {
  const { randomBytes } = require("crypto") as typeof import("crypto");
  const raw = randomBytes(32).toString("hex");
  const key = `hmp_live_${raw}`;
  const prefix = key.slice(0, 18); // "hmp_live_" + first 9 chars
  const hash = hashApiKey(key);
  return { key, prefix, hash };
}

/**
 * Verify an API key from the X-Api-Key header.
 * Returns the org context if valid, null if invalid/expired/revoked.
 * Updates last_used_at as a fire-and-forget side effect.
 */
export async function verifyApiKey(key: string): Promise<ApiKeyContext | null> {
  if (!key || !key.startsWith("hmp_live_")) return null;

  const hash = hashApiKey(key);
  const admin = createAdminClient();

  const { data } = await admin
    .from("api_keys")
    .select("id, organization_id, scopes, expires_at")
    .eq("key_hash", hash)
    .eq("is_active", true)
    .maybeSingle();

  if (!data) return null;

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null;

  // Update last_used_at fire-and-forget
  void admin
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return {
    organizationId: data.organization_id,
    keyId: data.id,
    scopes: (data.scopes as string[]) ?? [],
  };
}

export function requireScope(ctx: ApiKeyContext, scope: string): boolean {
  return ctx.scopes.includes(scope) || ctx.scopes.includes("*");
}

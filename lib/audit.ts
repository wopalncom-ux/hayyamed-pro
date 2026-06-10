import { createAdminClient } from "./supabase/server";

type AuditEntry = {
  actorAuthId: string | null;
  action: string;
  targetTable?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Fire-and-forget audit log entry.
 * Never throws — logging must never break the main request flow.
 * PDPL/compliance requirement: all data mutations must be traceable.
 */
export async function logAudit({ actorAuthId, action, targetTable, targetId, metadata }: AuditEntry) {
  try {
    const admin = createAdminClient();
    await admin.from("audit_logs").insert({
      actor_auth_id: actorAuthId,
      action,
      target_table: targetTable ?? null,
      target_id: targetId ?? null,
      metadata: metadata ?? null,
    });
  } catch {
    // Intentionally swallowed
  }
}

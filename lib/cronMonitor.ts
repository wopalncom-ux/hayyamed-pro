/**
 * Pings a Dead Man's Snitch (or compatible) heartbeat URL at the end of each
 * cron job run AND writes a structured audit_log entry so the admin monitoring
 * page can display last-run times without external dependencies.
 *
 * Compatible with: Dead Man's Snitch, Cronitor, Better Uptime, Healthchecks.io
 *
 * Env vars (set in GCP Secret Manager / .env.local):
 *   CRON_MONITOR_TRIAL_REMINDERS      — trial-reminders heartbeat URL
 *   CRON_MONITOR_LICENSE_REMINDERS    — license-reminders heartbeat URL
 *   CRON_MONITOR_CME_DEADLINE         — cme-deadline heartbeat URL
 *   CRON_MONITOR_LICENSE_EXPIRY       — license-expiry heartbeat URL
 *   CRON_MONITOR_EMPLOYER_DIGEST      — employer-digest heartbeat URL
 *   CRON_MONITOR_PROFESSIONAL_DIGEST  — professional-digest heartbeat URL
 *   CRON_MONITOR_ONBOARDING_REMINDER  — onboarding-reminder heartbeat URL
 */

import { createAdminClient } from "@/lib/supabase/server";

const JOB_ENV_MAP: Record<string, string> = {
  "trial-reminders":        "CRON_MONITOR_TRIAL_REMINDERS",
  "license-reminders":      "CRON_MONITOR_LICENSE_REMINDERS",
  "cme-deadline":           "CRON_MONITOR_CME_DEADLINE",
  "license-expiry":         "CRON_MONITOR_LICENSE_EXPIRY",
  "employer-digest":        "CRON_MONITOR_EMPLOYER_DIGEST",
  "professional-digest":    "CRON_MONITOR_PROFESSIONAL_DIGEST",
  "onboarding-reminder":    "CRON_MONITOR_ONBOARDING_REMINDER",
  "onboarding-drip":        "CRON_MONITOR_ONBOARDING_DRIP",
  "training-deadline":      "CRON_MONITOR_TRAINING_DEADLINE",
  "compliance-alerts":      "CRON_MONITOR_COMPLIANCE_ALERTS",
  "compliance-snapshot":    "CRON_MONITOR_COMPLIANCE_SNAPSHOT",
  "cycle-renewal":          "CRON_MONITOR_CYCLE_RENEWAL",
  "storage-cleanup":        "CRON_MONITOR_STORAGE_CLEANUP",
  "process-notifications":  "CRON_MONITOR_PROCESS_NOTIFICATIONS",
  "process-webhooks":       "CRON_MONITOR_PROCESS_WEBHOOKS",
};

export async function pingCronMonitor(
  jobSlug: string,
  meta?: { sent?: number; processed?: number; skipped?: number; error?: string },
): Promise<void> {
  // 1 — Heartbeat ping (optional external service)
  const envKey = JOB_ENV_MAP[jobSlug];
  if (envKey) {
    const url = process.env[envKey];
    if (url) {
      try {
        await fetch(url, { method: "GET", signal: AbortSignal.timeout(5000) });
      } catch {
        // Never let monitoring failure affect cron execution
      }
    }
  }

  // 2 — Persist run record to audit_logs so /admin/monitoring can read it.
  // target_id is a UUID column — never pass the slug string there.
  // The monitoring page filters by metadata->>'job' instead.
  try {
    const admin = createAdminClient();
    await admin.from("audit_logs").insert({
      actor_auth_id: null,
      action: "cron.completed",
      target_table: "cron_jobs",
      metadata: {
        job: jobSlug,
        sent: meta?.sent ?? 0,
        processed: meta?.processed ?? 0,
        skipped: meta?.skipped ?? 0,
        ...(meta?.error ? { error: meta.error } : {}),
      },
    });
  } catch {
    // Audit log failure must never crash the cron job
  }
}

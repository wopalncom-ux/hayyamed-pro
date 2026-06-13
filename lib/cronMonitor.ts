/**
 * Pings a Dead Man's Snitch (or compatible) heartbeat URL at the end of each
 * cron job run. Configure via env vars — omitting the var silently disables
 * monitoring for that job without breaking anything.
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

const JOB_ENV_MAP: Record<string, string> = {
  "trial-reminders":      "CRON_MONITOR_TRIAL_REMINDERS",
  "license-reminders":    "CRON_MONITOR_LICENSE_REMINDERS",
  "cme-deadline":         "CRON_MONITOR_CME_DEADLINE",
  "license-expiry":       "CRON_MONITOR_LICENSE_EXPIRY",
  "employer-digest":      "CRON_MONITOR_EMPLOYER_DIGEST",
  "professional-digest":  "CRON_MONITOR_PROFESSIONAL_DIGEST",
  "onboarding-reminder":  "CRON_MONITOR_ONBOARDING_REMINDER",
};

export async function pingCronMonitor(jobSlug: string): Promise<void> {
  const envKey = JOB_ENV_MAP[jobSlug];
  if (!envKey) return;

  const url = process.env[envKey];
  if (!url) return;

  try {
    await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Never let monitoring failure affect cron execution — silently ignored
  }
}

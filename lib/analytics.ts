/**
 * Analytics module — thin typed wrapper around PostHog.
 *
 * Rules enforced here:
 *  - No PII ever. Use professional_id (UUID), plan tier, country code — never email or name.
 *  - All events are typed. Add to AnalyticsEvent before using.
 *  - SSR-safe: every export guards typeof window.
 */

// posthog-js is loaded lazily (dynamic import), not bundled into every page's
// initial JS — analytics is not render-critical, and this was measured to be
// a meaningful chunk of main-thread boot time on the homepage. All exports
// below stay synchronous-looking so none of their ~40 call sites need to
// change; calls made before the module resolves just queue on the promise.
type PostHog = typeof import("posthog-js")["default"];

// The currently-configured NEXT_PUBLIC_POSTHOG_KEY returns 404 on both
// PostHog Cloud regions (confirmed 2026-07-22 by curling
// https://{us,eu}-assets.i.posthog.com/array/<key>/config.js directly) — the
// project it belonged to looks deleted/invalid. Rather than let every page
// spend a request cycle finding that out at runtime, analytics is disabled
// at the source here. Flip this back to true once a real, verified key is
// in NEXT_PUBLIC_POSTHOG_KEY.
const ANALYTICS_ENABLED = false;

// No-op stand-in used while analytics is disabled — every call site keeps
// working (same shape as the real PostHog client for the methods used here),
// it just does nothing, and posthog-js is never even fetched.
const noopPostHog = {
  init: () => {},
  identify: () => {},
  reset: () => {},
  capture: () => {},
  debug: () => {},
} as unknown as PostHog;

let phPromise: Promise<PostHog> | null = null;

function loadPostHog(): Promise<PostHog> {
  if (!ANALYTICS_ENABLED) return Promise.resolve(noopPostHog);
  if (!phPromise) phPromise = import("posthog-js").then((m) => m.default);
  return phPromise;
}

// Exposed for PostHogProvider's pageview tracking — keeps that file from
// needing its own static `import posthog from "posthog-js"`, which would
// re-introduce the same eager-bundling problem this lazy loader exists to fix.
export { loadPostHog };

// ── Initialisation (call once from PostHogProvider) ─────────────────────────
export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  loadPostHog().then((posthog) => {
    posthog.init(key, {
      api_host: apiHost,
      ui_host: "https://us.posthog.com",
      capture_pageview: false,   // manual page views via PostHogPageView component
      capture_pageleave: true,
      autocapture: false,         // manual events only — clean, intentional data
      persistence: "localStorage+cookie",
      cross_subdomain_cookie: false,
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug();
      },
    });
  });
}

// ── User identity ────────────────────────────────────────────────────────────
// Always identify by Supabase user UUID — never name or email.
export function identifyUser(
  userId: string,
  properties?: {
    plan?: "free" | "pro" | "employer" | "university" | "government";
    country?: string;
    profession?: string;
  }
): void {
  if (typeof window === "undefined") return;
  loadPostHog().then((posthog) => posthog.identify(userId, properties));
}

export function resetAnalytics(): void {
  if (typeof window === "undefined") return;
  loadPostHog().then((posthog) => posthog.reset());
}

// ── Conversion funnel chain (configure in PostHog UI → Funnels) ─────────────
//   Step 1: signup_completed
//   Step 2: onboarding_completed
//   Step 3: cme_activity_submitted   ← activation ("aha moment")
//   Step 4: pdf_report_blocked       ← paywall hit
//   Step 5: upgrade_clicked          ← intent signal
//   Step 6: subscription_activated   ← conversion

// ── Typed event catalogue ────────────────────────────────────────────────────
export type AnalyticsEvent =
  // Auth funnel
  | "signup_started"
  | "signup_submitted"
  | "signup_completed"
  | "login_completed"
  | "login_failed"
  // Onboarding funnel (activation)
  | "onboarding_step_completed"
  | "onboarding_completed"
  // Core product (activation signal)
  | "cme_activity_submitted"
  | "cme_activity_queued_offline"
  | "cme_activity_verified"
  // AI features (engagement + value)
  | "ai_categorization_used"
  | "ai_ocr_used"
  | "ai_chat_message_sent"
  | "ai_recommendation_viewed"
  | "ai_gap_analysis_viewed"
  // Revenue funnel (conversion signals)
  | "pricing_page_viewed"
  | "pdf_report_downloaded"
  | "pdf_report_blocked"
  | "upgrade_clicked"
  | "upgrade_payment_not_configured"
  | "upgrade_whatsapp_clicked"
  | "upgrade_email_clicked"
  | "subscription_started"
  | "subscription_activated"
  | "subscription_cancelled"
  | "promo_code_applied"
  // Employer funnel
  | "employer_link_requested"
  | "employer_link_approved"
  | "employer_task_assigned"
  | "employer_reminder_sent"
  | "employer_setup_started"
  | "employer_setup_completed"
  | "employer_invite_link_copied"
  | "employer_qr_code_viewed"
  | "employer_qr_code_downloaded"
  | "employer_qr_code_downloaded_png"
  | "employer_audit_export_clicked"
  // Profile
  | "license_added"
  | "settings_updated"
  | "profile_completed"
  // Bulk import
  | "cme_activities_bulk_imported"
  // PDF report paywall
  | "pdf_paywall_shown"
  | "pdf_report_upgrade_clicked"
  // Badge
  | "badge_link_copied"
  | "badge_downloaded"
  | "badge_shared_linkedin"
  | "badge_shared_whatsapp"
  // Public profile
  | "profile_link_copied"
  | "profile_shared_linkedin"
  // NPS
  | "nps_submitted"
  | "nps_dismissed"
  // Referral
  | "referral_link_generated"
  | "referral_link_copied"
  | "referral_link_shared_linkedin"
  | "referral_banner_shown"
  // QPay
  | "qpay_checkout_opened"
  | "qpay_payment_initiated"
  | "qpay_payment_confirmed";

// ── Core tracker ─────────────────────────────────────────────────────────────
export function track(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean | null | undefined>
): void {
  if (typeof window === "undefined") return;
  loadPostHog().then((posthog) => posthog.capture(event, properties));
}

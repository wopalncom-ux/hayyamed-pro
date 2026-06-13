/**
 * Analytics module — thin typed wrapper around PostHog.
 *
 * Rules enforced here:
 *  - No PII ever. Use professional_id (UUID), plan tier, country code — never email or name.
 *  - All events are typed. Add to AnalyticsEvent before using.
 *  - SSR-safe: every export guards typeof window.
 */

import posthog from "posthog-js";

// ── Initialisation (call once from PostHogProvider) ─────────────────────────
export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
    ui_host: "https://eu.posthog.com",
    capture_pageview: false,   // manual page views via PostHogPageView component
    capture_pageleave: true,
    autocapture: false,         // manual events only — clean, intentional data
    persistence: "localStorage+cookie",
    cross_subdomain_cookie: false,
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") ph.debug();
    },
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
  posthog.identify(userId, properties);
}

export function resetAnalytics(): void {
  if (typeof window === "undefined") return;
  posthog.reset();
}

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
  | "cme_activity_verified"
  // AI features (engagement + value)
  | "ai_categorization_used"
  | "ai_ocr_used"
  | "ai_chat_message_sent"
  | "ai_recommendation_viewed"
  // Revenue funnel (conversion signals)
  | "pricing_page_viewed"
  | "pdf_report_downloaded"
  | "pdf_report_blocked"
  | "upgrade_clicked"
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
  | "referral_banner_shown";

// ── Core tracker ─────────────────────────────────────────────────────────────
export function track(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean | null | undefined>
): void {
  if (typeof window === "undefined") return;
  posthog.capture(event, properties);
}

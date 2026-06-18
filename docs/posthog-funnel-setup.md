# PostHog Funnel Setup Guide

## URL
Log in at https://us.posthog.com → select the Hayya Med Pro project.

---

## Conversion Funnel — Free → Pro

**Path:** Funnels → Create Funnel → name it "Free → Pro Conversion"

| Step | Event Name | Notes |
|------|-----------|-------|
| 1 | `signup_completed` | User completes registration |
| 2 | `onboarding_completed` | User finishes 7-step onboarding |
| 3 | `cme_activity_submitted` | **Activation** — first CME logged |
| 4 | `pdf_report_blocked` | User hits the PDF paywall |
| 5 | `upgrade_clicked` | User clicks any upgrade CTA |
| 6 | `subscription_activated` | Paddle webhook confirms payment |

**Time window:** 30 days (typical trial-to-paid cycle)
**Breakdown:** by `plan` property (should be `free` at funnel entry)

---

## Engagement Funnel — Onboarding Activation

**Path:** Funnels → Create Funnel → "Onboarding Activation"

| Step | Event | Notes |
|------|-------|-------|
| 1 | `signup_completed` | |
| 2 | `onboarding_step_completed` | Filter: `step = 1` |
| 3 | `onboarding_completed` | Full 7 steps done |
| 4 | `cme_activity_submitted` | First value moment |

---

## Retention Cohort — Activated Users

**Path:** Retention → Retention Table
- **Starting event:** `cme_activity_submitted`
- **Returning event:** `cme_activity_submitted`
- **Period:** Weekly
- **Target:** 40%+ week-2 retention

---

## Dashboards to Create

1. **Acquisition** — daily signups, source breakdown by `$referrer`
2. **Activation** — % reaching `cme_activity_submitted` within 7 days of signup
3. **Revenue** — `subscription_activated` count × plan tier, monthly trend
4. **AI Usage** — `ai_gap_analysis_viewed`, `ai_chat_message_sent`, `ai_ocr_used` daily counts

---

## Event Properties Reference

All events track these standard properties (set via `identifyUser`):
- `plan` — `free | pro | employer | university | government`
- `country` — ISO 3166-1 alpha-2 (QA, SA, AE, …)
- `profession` — `physician | nurse | pharmacist | dentist | allied_health`

Revenue events additionally carry:
- `source` — upgrade CTA source (`pdf_wall | banner | pricing | settings | …`)
- `promo_code` — applied promo code (if any)

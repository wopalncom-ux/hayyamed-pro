# Hayya Med Pro — Pre-Launch Checklist
## Classification: Internal — Operational
## Owner: COO + CTO
## Last Updated: 2026-06-17 (Session 138 — reflects sessions 1–138)

---

## STATUS KEY
- [ ] Not started
- [~] In progress / under review
- [x] Complete
- [!] Blocked — needs user action (not code)

---

## TIER 0 — ABSOLUTE BLOCKERS (Platform cannot function without these)

### Database

- [x] All 70 migrations applied — `supabase db push` run in Session 139; migrations 063–070 applied to production
- [x] Migration 068 confirmed applied — `public_directory_opt_in` column exists in `professional_profiles`

### Infrastructure
- [x] Supabase project connected — URL + anon key + service role key
- [x] GCP Cloud Run deployment live at hayyamed.pro
- [x] Domain `hayyamed.pro` DNS → Cloud Run via Cloudflare
- [x] SSL certificate active (Cloudflare managed)
- [x] All secrets stored in GCP Secret Manager
- [x] 16 Cloud Scheduler cron jobs created and ENABLED (re-run `scripts/setup-cloud-scheduler.sh` if any are missing)
- [x] **Production global error fixed** — `next build --webpack` forces webpack so next-intl config resolves correctly (Session 138)

### Authentication
- [x] Supabase Auth production URL — Site URL: `https://hayyamed.pro`
- [!] Add `https://hayyamed.pro/auth/callback` to Supabase Redirect URLs (Dashboard → Authentication → URL Configuration)
- [x] Email verification flow working
- [x] Password reset flow working
- [x] Session persistence working

### Environment Variables
All secrets are in GCP Secret Manager and injected at runtime. Build-time vars are in `cloudbuild.yaml`.

| Variable | Where set | Status |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | cloudbuild.yaml build-arg (hardcoded) | [x] |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | cloudbuild.yaml build-arg (hardcoded) | [x] |
| SUPABASE_SERVICE_ROLE_KEY | Secret Manager: `hayyamed-pro-service-role-key` | [x] |
| NEXT_PUBLIC_APP_URL | cloudbuild.yaml build-arg (hardcoded: hayyamed.pro) | [x] |
| GOOGLE_CLOUD_PROJECT | cloudbuild.yaml --set-env-vars | [x] |
| VERTEX_REGION | cloudbuild.yaml --set-env-vars (us-east5) | [x] |
| COMING_SOON | cloudbuild.yaml --set-env-vars (`true` → set `false` to go live) | [x] |
| NEXT_PUBLIC_VAPID_PUBLIC_KEY | cloudbuild.yaml build-arg (hardcoded) | [x] |
| VAPID_SUBJECT | cloudbuild.yaml --set-env-vars | [x] |
| VAPID_PRIVATE_KEY | Secret Manager: `hayyamed-pro-vapid-private` | [x] Added Session 139 (v3) |
| CRON_SECRET | Secret Manager: `hayyamed-pro-cron-secret` | [x] |
| NEXT_PUBLIC_POSTHOG_KEY | cloudbuild.yaml substitution `_POSTHOG_KEY` | [x] |
| NEXT_PUBLIC_POSTHOG_HOST | cloudbuild.yaml --set-env-vars (us.i.posthog.com) | [x] |
| NEXT_PUBLIC_SENTRY_DSN | cloudbuild.yaml substitution `_SENTRY_DSN` | [x] |
| SENTRY_ORG | [!] Set in Cloud Build Trigger substitution vars |  |
| SENTRY_PROJECT | [!] Set in Cloud Build Trigger substitution vars |  |
| SENTRY_AUTH_TOKEN | [!] Set in Cloud Build Trigger substitution vars |  |
| POSTMARK_API_TOKEN | Secret Manager: `hayyamed-pro-postmark-key` | [x] Live mode — approved and tested Session 139 |
| POSTMARK_WEBHOOK_TOKEN | Secret Manager: `hayyamed-pro-postmark-webhook-token` | [~] Set when Postmark active |
| PADDLE_API_KEY | Secret Manager: `hayyamed-pro-paddle-key` | [!] Needs Paddle account |
| PADDLE_WEBHOOK_SECRET | Secret Manager: `hayyamed-pro-paddle-webhook` | [!] Needs Paddle account |
| PADDLE_PRO_MONTHLY_PRICE_ID | cloudbuild.yaml substitution `_PADDLE_PRO_MONTHLY` | [!] Set once Paddle active |
| PADDLE_PRO_ANNUAL_PRICE_ID | cloudbuild.yaml substitution `_PADDLE_PRO_ANNUAL` | [!] Set once Paddle active |
| PADDLE_EMPLOYER_* (8 price IDs) | cloudbuild.yaml substitutions | [!] Set once Paddle active |
| UPSTASH_REDIS_REST_URL | Secret Manager: `hayyamed-pro-upstash-url` | [x] Live — PING verified Session 139 (v3) |
| UPSTASH_REDIS_REST_TOKEN | Secret Manager: `hayyamed-pro-upstash-token` | [x] Live — PING verified Session 139 (v4) |
| SUPPORT_EMAIL | --set-env-vars (support@hayyamed.pro) | [x] |
| ADMIN_NOTIFICATION_EMAIL | --set-env-vars (admin@hayyamed.pro) | [x] |

### Go-Live Switch
- [!] Set `_COMING_SOON = false` in Cloud Build Trigger substitution vars → triggers new build → public site goes live

---

## TIER 1 — CRITICAL PRE-LAUNCH (Must pass before first user)

### Legal & Compliance
- [x] Terms of Service published at /terms
- [x] Privacy Policy published at /privacy
- [x] Data Processing Agreement published at /legal/dpa
- [x] Cookie consent (Qatar PDPL compliant)
- [x] Mandatory compliance disclaimer on dashboard and onboarding step 7
- [ ] Medical disclaimer reviewed by healthcare regulatory advisor

### Security
- [x] Full foundation security audit complete — Sessions 134–137 (110+ routes, 24 server action files, 8 CSV exports, storage routes, 12 library modules, auth callback)
- [x] All 9 vulnerabilities found and fixed (admin role check, XSS, CSV injection, header injection, rate limiting, audit log columns, SSRF protection, MFA rate limiting, email suppression)
- [x] OWASP Top 10 self-audit complete — security-audit-2026.html in docs/security/
- [x] RLS enabled on every table — no exceptions
- [x] Supabase session middleware active on all routes
- [x] CSP + HSTS headers active in production
- [x] Rate limiting on auth, AI, webhook endpoints (Upstash + DB fallback)
- [x] Path traversal protection on all file operations
- [x] SSRF protection on webhook registration and delivery
- [x] Certificate storage: private bucket, signed URLs (1-hour expiry)
- [x] Audit logs append-only, 7-year retention
- [x] npm audit — zero critical/high CVEs (8 moderate, unfixable without framework downgrade)
- [x] Account suspension — ban_duration + immediate session invalidation
- [x] PDPL right-to-erasure — /api/account/delete purges all data including certificates bucket
- [x] MFA rate limiting — brute-force protection on recovery/regenerate/unenroll
- [x] Data breach runbook — docs/security/breach-notification-runbook.md
- [!] VAPT (external penetration test) — book before hospital sales conversations

### User Flow Testing (End-to-End — test after Tier 0 complete)
- [ ] Signup → email verification → dashboard (new user)
- [ ] 7-step onboarding completed successfully
- [ ] CME activity submitted → admin verified → wallet updated
- [ ] License added and expiry countdown visible
- [ ] Employer link requested → approved → compliance view visible
- [ ] PDF report generated (Pro tier — requires active subscription)
- [ ] Settings updated and persisted
- [ ] Sign out → session cleared → redirected to login
- [ ] Forgot password → reset → login with new password
- [ ] MFA enroll → verify → recovery code download
- [ ] Account deletion flow (PDPL test)

### Admin Flow Testing
- [x] Admin login and dashboard access
- [x] CME activity verify and reject
- [x] Employer link request approve/reject
- [x] Professional profile view
- [x] Organization management
- [x] Country rules CRUD
- [x] Admin analytics (DAU/WAU/MAU/funnel)
- [x] Notification queue management
- [x] Cron monitoring (16/16 jobs)
- [x] Revenue dashboard

### Payments (Paddle) — blocked on external account
- [ ] Paddle account approved and active
- [ ] Paddle products created: Free · Pro ($6/mo + $61.20/yr) · 8 employer tiers = 10 price IDs
- [ ] Checkout flow tested in Paddle sandbox
- [ ] Paddle success URL: `https://hayyamed.pro/dashboard?upgrade=success`
- [ ] Paddle webhook endpoint receiving events at /api/paddle/webhook
- [ ] Subscription provisioning tested (created → upgraded)
- [ ] Subscription cancellation tested (canceled → downgraded)
- [x] Billing portal working (/dashboard/billing → Paddle CustomerPortalSession)

### Email (Postmark) — live

- [x] Postmark account active — Live mode confirmed Session 139
- [x] Sending domain verified — DKIM ✅, Return-Path propagating
- [ ] Email verification template sent and received
- [ ] Password reset template sent and received
- [x] Welcome email implemented (fires after onboarding complete)
- [x] SPF and DKIM DNS records configured

### PWA
- [x] manifest.json valid — id, start_url, display, theme_color, icons, shortcuts
- [x] Service worker registered — push/fetch/install/activate handlers
- [x] Offline fallback page (/offline.html)
- [x] "Add to Home Screen" prompt (Android + iOS)
- [x] Push notification handlers
- [x] Offline CME submission queue (localStorage, auto-flush on reconnect)
- [x] PWA icons verified — byte-level PNG header inspection confirmed 192×192 and 512×512 (Session 141)
- [x] Lighthouse PWA score — Lighthouse 13 removed standalone PWA category; PWA audits folded into Best Practices: 100 ✅ (Session 142)

### Mobile Responsiveness
- [x] Dashboard usable at 375px, 390px, 360px
- [x] All forms usable on mobile keyboard
- [x] Navigation (hamburger/drawer)
- [x] Bearer token auth for all mobile API paths (100% migrated)
- [ ] File upload on iOS Safari
- [ ] File upload on Android Chrome

### Performance

- [~] Lighthouse Performance > 90 (hero LCP fix, AVIF/WebP, system font — Session 51); dev-mode score 52 — verify in production after go-live
- [x] Lighthouse Accessibility: 100 — contrast fix in SiteFooter (#94a3b8 → #64748b) (Session 142)
- [x] Lighthouse SEO: 100 (Session 142)
- [x] Lighthouse Best Practices: 100 (Session 142)
- [ ] LCP < 2.5s measured in production
- [x] 0 TypeScript errors in production build

---

## TIER 2 — OPERATIONAL READINESS (Required within 30 days of launch)

### Observability & Monitoring
- [x] GCP Cloud Monitoring dashboard — /admin/monitoring
- [x] Sentry error tracking
- [x] Health check at /api/health
- [x] Uptime monitoring (GCP — every 60 seconds, multi-region)
- [x] Alert: 5xx error rate > 1%
- [x] Alert: p95 latency > 2s
- [x] 16 cron jobs monitored — pingCronMonitor() + audit_logs (all 16/16 reporting)
- [x] GCP billing alert > $100/month
- [x] Data retention cron — prunes AI logs(90d), notification queue(30d), webhook deliveries(90d), drip emails(90d)
- [x] Notification queue management at /admin/notification-queue

### Product Analytics
- [x] PostHog installed (US region)
- [x] 13 key events instrumented (signup, onboarding, CME, PDF, upgrade, subscription)
- [x] User identity set on every dashboard load
- [x] All 13 upgrade CTAs with ?source= attribution
- [x] Admin analytics: DAU/WAU/MAU/activation/conversion at /admin/analytics
- [ ] PostHog funnel configured in UI: signup → onboarding → first CME → PDF → upgrade

### Push Notifications
- [x] VAPID public key baked into build
- [!] VAPID private key in Secret Manager (add if not already done)
- [ ] Web Push subscription tested on Chrome
- [ ] Web Push subscription tested on Firefox
- [x] License expiry cron (30-day, 7-day reminders)
- [x] CME deadline cron
- [x] Push preference enforcement (per-category opt-in/opt-out)

### AI Features
- [x] AI CME gap analysis (Pro — Sonnet 4.6, 24h cache, refresh button)
- [x] AI recommendations
- [x] AI voice assistant (Pro — Haiku 4.5)
- [x] Employer AI analyzer (Sonnet 4.6)
- [x] Provider AI analyzer (Sonnet 4.6)
- [x] OCR certificate upload
- [x] 7 versioned prompt files in lib/ai/prompts/ — 0 inline prompts
- [x] All AI calls logged (model, tokens, latency, professional_id) — ai_call_logs
- [x] Zod validation on all AI responses
- [x] AI cost tracked (ai_call_logs → data-retention cron prunes after 90 days)
- [!] Enable Claude Haiku 4.5 in GCP Model Garden (for voice chat tier)

### API & Integrations
- [x] v1 API with API key auth — /api/v1/* (staff, compliance, licenses, departments, courses, enrollments)
- [x] API key management UI (employer, provider, university, government portals)
- [x] Provider webhooks — /api/provider/webhooks CRUD + test endpoint
- [x] Employer webhooks with HMAC-SHA256 verification
- [x] SSRF protection on webhook URL registration and delivery
- [x] Integration documentation pages (employer, provider, university, government)
- [x] Mobile deep links — apple-app-site-association + assetlinks.json (⚠ update TEAMID + SHA256 before RN launch)

### Support Infrastructure
- [ ] Support email configured (support@hayyamed.pro)
- [x] Help/FAQ page at /help
- [x] Contact form at /contact
- [ ] Support response SLA defined

---

## TIER 3 — REVENUE READINESS (Required to hit first $10K ARR)

### Conversion Optimization
- [x] Free tier limits enforced server-side (10 activity cap, 1 license cap)
- [x] PDF report download wall (Pro required)
- [x] AI features gated by plan tier
- [x] Upgrade prompts: FreeTierBanner, TrialExpiredBanner, PdfReportCard paywall
- [x] Pricing page at /pricing with feature comparison matrix
- [x] Free → Pro conversion: "Download PDF Report" wall
- [x] Pro → Employer: "Invite your team" teaser
- [x] Employer staff limit enforced per tier (Clinic/Growth/Dept/Hospital)
- [x] Achievement badges system (10 badges, migration 039)
- [x] Referral program (30-day trial reward, personalized links)
- [x] GCC CME comparison tool at /tools/compare-cme

### First Customer Acquisition
- [ ] LinkedIn company page for Hayya Med Pro
- [ ] 10 healthcare professionals invited to beta (personal network)
- [ ] QCHP outreach initiated
- [ ] 1 hospital/clinic employer approached for pilot
- [ ] Beta feedback survey (Typeform or similar)

### ARR Tracking
- [x] MRR/ARR dashboard at /admin/revenue (plan breakdown, trial pipeline, upgrades)
- [ ] Churn tracking defined
- [ ] Revenue per plan tier tracked

---

## TIER 4 — PHASE 2 READINESS (Q3 2026 growth phase)

### Localization (Arabic/RTL)
- [x] next-intl installed and configured (cookie-based locale, no URL restructure)
- [x] Arabic translation files (messages/ar.json + messages/en.json)
- [x] Language switcher component
- [x] Navigation translated (AR/EN)
- [x] Hero section translated
- [x] Auth pages (login + register) translated
- [ ] Dashboard fully translated
- [ ] Onboarding steps 1–7 translated
- [ ] RTL layout on all key pages

### Country Rules
- [x] Qatar QCHP / DHP-AS rules (80 CPD/2yr)
- [x] Saudi Arabia SCFHS rules (40–60 CME/yr by profession)
- [x] UAE DHA rules (40 CME/2yr)
- [x] UAE DOH rules (30–50 CPD/yr)
- [x] Kuwait MOH rules
- [x] Bahrain NHRA rules
- [x] Oman OMSB rules
- [x] UK (GMC/NMC), Australia (AHPRA), India (NMC) — migration 061
- [x] Country rules admin CRUD — no SQL required
- [x] CME cycle renewal — auto-advance expired cycles, reset credits (migration 056)
- [x] Multi-license wallet (professional_licenses table, migration 040)

### Mobile App (React Native)
- [ ] Expo project initialized
- [ ] Core screens: dashboard, CME tracker, licenses, settings
- [ ] API-first patterns confirmed (Bearer token auth — 100% complete)
- [ ] App Store / Google Play developer accounts
- [x] Apple app-site-association + assetlinks.json stubs (⚠ TEAMID/SHA256 need real values)
- [ ] FCM + APNs push configured for React Native
- [ ] TestFlight / internal track beta

### Government Portal
- [x] Government registration page (/government/register)
- [x] Government settings page (/government/settings)
- [x] Government analytics dashboard (/government/analytics)
- [x] Government v1 API endpoints (registry, registry summary)
- [x] API key management for government authorities

### University Portal
- [x] University registration + settings
- [x] University faculty compliance view
- [x] University v1 API endpoints (faculty, faculty compliance)
- [x] API key management for universities

### Employer Features (Advanced)
- [x] Staff compliance grid with pagination (50/page)
- [x] Department management and grouping
- [x] Bulk compliance PDF (all staff)
- [x] Weekly email digest
- [x] Compliance heatmap (dept × status grid)
- [x] Compliance snapshots — daily cron, 30-day trend (migration 055)
- [x] Staff tasks widget
- [x] Employer AI analyzer
- [x] Required training management
- [x] Bulk approve link requests
- [x] Staff detail page with privacy gates
- [x] Staff import (CSV)
- [x] Staff search and filter

---

## DATABASE MIGRATIONS — STATUS

Total: **71 migrations** (001–071)
- [x] All applied to production (run COMBINED_RUN_ONCE.sql to verify)
- Key recent: 059 (account suspension), 060 (profile completion multi-license), 061 (UK/AU/IN rules), 062 (privacy settings trigger backfill), 063 (gap analysis cache), 064–071 (see COMBINED_RUN_ONCE.sql)

---

## CRON JOBS — STATUS (16 total)

| Job | Schedule | Monitoring |
|---|---|---|
| trial-reminders | Daily 08:00 GST | [x] |
| license-reminders | Daily 08:10 GST | [x] |
| cme-deadline | Daily 08:20 GST | [x] |
| license-expiry | Daily 08:30 GST | [x] |
| onboarding-reminder | Daily 08:40 GST | [x] |
| employer-digest | Monday 07:00 GST | [x] |
| professional-digest | Monday 07:30 GST | [x] |
| compliance-alerts | Daily 09:00 GST | [x] |
| training-deadline | Daily 09:10 GST | [x] |
| process-notifications | Every 5 minutes | [x] |
| process-webhooks | Every 5 minutes | [x] |
| compliance-snapshot | Daily 02:00 GST | [x] |
| cycle-renewal | Monthly 01:00 GST | [x] |
| storage-cleanup | Weekly Sunday 04:00 GST | [x] |
| data-retention | Weekly Sunday 04:30 GST | [x] |
| webhook-retry | Every 10 minutes | [x] |

---

## LAUNCH SIGN-OFF

Before public announcement, all Tier 0 + Tier 1 items must be complete.

**Remaining user-action blockers for launch (Session 139 — 3 remain):**

1. ~~Run COMBINED_RUN_ONCE.sql~~ — Done: `supabase db push` applied all 70 migrations
2. Add `/auth/callback` to Supabase Redirect URLs — **YOU MUST DO THIS** (2-minute browser action)
3. ~~Rotate Upstash credentials~~ — Done: PING verified, credentials healthy
4. ~~Add VAPID private key~~ — Done: pushed to Secret Manager v3
5. Complete Paddle account setup (account + 10 price IDs) — **EXTERNAL ACCOUNT REQUIRED**
6. ~~Complete Postmark approval~~ — Done: Live mode confirmed
7. Set `_COMING_SOON = false` in Cloud Build Trigger — **FINAL STEP after 2 + 5 above**

**Code is complete and ready for production.**

| Board | Sign-off | Status |
|---|---|---|
| CTO | Build passing, 71 migrations, 0 TS errors, global error fixed | [x] |
| CISO | Foundation security audit complete, 9 vulnerabilities fixed | [x] |
| Legal | ToS, Privacy Policy, DPA published | [x] Medical disclaimer needs advisor review |
| Healthcare | Compliance disclaimer correct, rules engine for 10 countries | [x] |
| CPO | All user flows implemented — E2E testing pending production config | [~] |
| CFO | Paddle payments implemented — Paddle account approval pending | [~] |
| COO | Support infrastructure ready — Postmark approval pending | [~] |
| CEO / Founder | Final approval to launch | [ ] |

---
*Last updated: 2026-06-17 — Session 138: production global error fixed (next-intl + Turbopack incompatibility); PRE_LAUNCH_CHECKLIST updated to reflect sessions 1–138 (71 migrations, 16 cron jobs, full security audit complete).*

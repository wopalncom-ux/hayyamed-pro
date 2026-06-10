# Hayya Med Pro — Pre-Launch Checklist
## Classification: Internal — Operational
## Owner: COO + CTO
## Review: Weekly until live

---

## STATUS KEY
- [ ] Not started
- [~] In progress
- [x] Complete
- [!] Blocked — needs action

---

## TIER 0 — ABSOLUTE BLOCKERS (Platform cannot function without these)

### Infrastructure
- [x] Supabase project connected — URL + anon key + service role key in .env.local
- [x] All 9 database migrations run against production Supabase project
- [x] GCP Cloud Run deployment tested end-to-end (revision 16 live)
- [x] Domain `pro.hayyamed.pro` DNS pointed to Cloud Run via Cloudflare Worker proxy
- [x] SSL certificate active and verified (Cloudflare managed SSL)
- [x] All secrets stored in GCP Secret Manager (not .env files)

### Authentication
- [x] Supabase Auth production URL configured — Site URL: https://pro.hayyamed.pro, Redirect URLs: https://pro.hayyamed.pro/**, localhost:3000/**, localhost:3001/**
- [x] Email verification flow tested end-to-end
- [x] Password reset flow tested end-to-end (forgot-password form + reset page both working)
- [x] Session persistence tested across page refresh

### Environment Variables
- [ ] NEXT_PUBLIC_SUPABASE_URL — set
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY — set
- [ ] SUPABASE_SERVICE_ROLE_KEY — set
- [ ] NEXT_PUBLIC_APP_URL — set to https://pro.hayyamed.pro
- [ ] ANTHROPIC_API_KEY — set
- [ ] PADDLE_API_KEY — set
- [ ] PADDLE_WEBHOOK_SECRET — set
- [ ] POSTMARK_API_TOKEN — set
- [ ] VAPID_PUBLIC_KEY — set (push notifications)
- [ ] VAPID_PRIVATE_KEY — set (push notifications)

---

## TIER 1 — CRITICAL PRE-LAUNCH (Must pass before first user)

### Legal & Compliance
- [x] Terms of Service written and published at /terms
- [x] Privacy Policy written and published at /privacy
- [x] Mandatory compliance disclaimer visible on dashboard and step 7
- [ ] Cookie consent (if required by Qatar PDPL)
- [ ] Data Processing Agreement template ready for employer sign-off
- [ ] Medical disclaimer reviewed by healthcare regulatory advisor

### Security
- [x] OWASP Top 10 self-audit completed — all 10 categories reviewed, field injection bug found and fixed
- [x] All API routes verified: auth check before any data operation (Paddle webhook uses signature auth)
- [ ] RLS policies tested on all 9 migrations — attempt unauthorized data access
- [x] CSP headers verified in production — content-security-policy present and correct in response headers
- [x] HSTS active in production — strict-transport-security configured in next.config.ts + Cloudflare edge
- [x] No secrets in client-side code or git history — all secrets behind process.env, server-side only
- [x] npm audit — zero critical or high vulnerabilities (2 moderate in next/node_modules/postcss — Next.js internal, unfixable without downgrading framework)
- [x] Rate limiting active on /api/ai/* and /api/pdf/* endpoints — DB-backed via audit_logs, 429 with Retry-After header (auth routes rate-limited by Supabase Auth)

### User Flow Testing (End-to-End)
- [ ] Signup → email verification → dashboard (new user)
- [ ] 7-step onboarding completed successfully
- [ ] CME activity submitted → admin verified → wallet updated
- [ ] License added and expiry countdown visible
- [ ] Employer link requested → approved → compliance view visible
- [ ] PDF report generated (Pro tier)
- [ ] Settings updated and persisted
- [ ] Sign out → session cleared → redirected to login
- [ ] Forgot password → reset → login with new password

### Admin Flow Testing
- [x] Admin login and dashboard access — master_admin role working at /admin
- [x] CME activity verify and reject — both actions working, moves to Resolved with correct badge
- [x] Employer link request approve and reject — Create & Approve modal working, approved badge confirmed
- [ ] Professional profile view
- [ ] Organization management
- [ ] Country rules view

### Payments (Paddle)
- [ ] Paddle account approved and active
- [ ] Paddle products created: Free, Pro ($49/year), Employer Starter ($199/year)
- [ ] Checkout flow tested in Paddle sandbox
- [ ] Paddle webhook endpoint receiving events
- [ ] Subscription provisioning tested (subscription created → user upgraded)
- [ ] Subscription cancellation tested (canceled → user downgraded)
- [ ] Billing portal tested (user can manage their subscription)

### Email (Postmark)
- [~] Postmark account active — approval submitted, under review
- [~] Sending domain verified — DKIM verified ✅, Return-Path CNAME added (propagating, up to 48h)
- [ ] Email verification template sent and received
- [ ] Password reset template sent and received
- [ ] Welcome email sent after onboarding complete
- [x] SPF and DKIM DNS records configured — DKIM verified, SPF handled automatically by Postmark

### PWA
- [ ] manifest.json valid (lighthouse check)
- [ ] Service worker registered and caching correctly
- [ ] Offline fallback page displayed when offline
- [ ] "Add to Home Screen" prompt works on Android Chrome
- [ ] "Add to Home Screen" prompt works on iOS Safari
- [ ] PWA icons display correctly (192×192 and 512×512)
- [ ] Lighthouse PWA score: 100

### Mobile Responsiveness
- [x] Dashboard usable on 375px (iPhone SE) — no horizontal scroll confirmed
- [x] Dashboard usable on 390px (iPhone 14) — no overflow, all cards and buttons render correctly
- [x] Dashboard usable on 360px (Android standard) — no overflow, CME Wallet, Licenses, Settings all clean
- [x] All forms usable on mobile keyboard — inputs full-width at 360px, labels readable, confirmed in DevTools
- [ ] Navigation works on mobile (hamburger/drawer)
- [ ] File upload works on iOS Safari
- [ ] File upload works on Android Chrome

### Performance
- [ ] Lighthouse Performance score: > 90 (mobile and desktop)
- [ ] Lighthouse Best Practices: 100
- [ ] Lighthouse Accessibility: > 90
- [ ] First Contentful Paint (FCP): < 2 seconds
- [ ] Largest Contentful Paint (LCP): < 2.5 seconds
- [ ] No console errors in production build

---

## TIER 2 — OPERATIONAL READINESS (Required within 30 days of launch)

### Observability & Monitoring
- [ ] GCP Cloud Monitoring dashboard configured
- [ ] Sentry error tracking installed and receiving errors
- [ ] Uptime monitoring active (external check every 60 seconds)
- [ ] Alert: 5xx error rate > 1% → notify on-call
- [ ] Alert: Response time p95 > 2 seconds → notify on-call
- [ ] Alert: Supabase connection failures → notify immediately
- [ ] Cron job monitoring: 4 jobs monitored — alert if missed
- [ ] GCP billing alert: > $100/month → review

### Product Analytics
- [ ] PostHog (or Mixpanel) installed
- [ ] Key events instrumented:
  - [ ] signup_started
  - [ ] signup_completed
  - [ ] onboarding_step_completed (step 1–7)
  - [ ] onboarding_completed
  - [ ] cme_activity_submitted
  - [ ] cme_activity_verified
  - [ ] pdf_report_downloaded (conversion signal)
  - [ ] upgrade_clicked
  - [ ] subscription_started
  - [ ] employer_link_requested
  - [ ] employer_link_approved
- [ ] Funnel: signup → onboarding complete → first CME activity → PDF download → upgrade
- [ ] Dashboard: DAU, WAU, MAU, activation rate, conversion rate

### Push Notifications
- [ ] VAPID keys generated and stored in GCP Secret Manager
- [ ] Web Push subscription tested on Chrome
- [ ] Web Push subscription tested on Firefox
- [ ] License expiry cron job running (30-day, 7-day)
- [ ] CME deadline cron job running

### Support Infrastructure
- [ ] Support email configured (support@hayyamed.pro or similar)
- [ ] Help documentation / FAQ page live at /help
- [ ] Contact form or chat widget available
- [ ] Support response SLA defined: < 24 hours for Pro, < 72 hours for Free

---

## TIER 3 — REVENUE READINESS (Required to hit first $10K ARR)

### Conversion Optimization
- [ ] Free tier limits enforced server-side (10 activity cap)
- [ ] PDF report download wall implemented (Pro required)
- [ ] Upgrade prompt visible on dashboard for Free users
- [ ] Pricing page live at /pricing with all plan details
- [ ] Upgrade CTA in every feature that requires Pro

### First Customer Acquisition
- [ ] LinkedIn profile for Hayya Med Pro company page — live
- [ ] 10 healthcare professionals invited to beta (personal network)
- [ ] QCHP outreach initiated (intro email or meeting requested)
- [ ] 1 hospital or clinic employer approached for pilot
- [ ] Beta feedback survey configured (Typeform or similar)

### ARR Tracking
- [ ] MRR/ARR tracking spreadsheet or dashboard live
- [ ] Churn tracking defined
- [ ] Revenue per plan tier tracked

---

## TIER 4 — PHASE 2 READINESS (Required for Q3 2026 growth phase)

### Localization
- [ ] next-intl framework installed and configured
- [ ] Arabic language toggle functional in UI
- [ ] RTL layout working on all key pages
- [ ] Arabic translation for onboarding steps 1–7
- [ ] Arabic translation for dashboard and CME tracker

### Country Rules Expansion
- [ ] Saudi Arabia (SCFHS) rules configured in admin panel
- [ ] UAE DHA rules configured in admin panel
- [ ] UAE DOH rules configured in admin panel
- [ ] Country rules admin UI tested by business analyst (no-code configuration)

### Employer Dashboard Enhancement
- [ ] Staff compliance grid view (all linked staff in one table)
- [ ] Department grouping and filtering
- [ ] Bulk compliance PDF report (all staff, one download)
- [ ] Weekly email digest for employer HR

### UI Polish
- [ ] Loading skeletons on all data tables
- [ ] Error boundaries on all pages
- [ ] Toast notification system on all key actions
- [ ] Empty states designed for zero-data screens

---

## LAUNCH SIGN-OFF CHECKLIST

Before announcing the platform publicly, all Tier 0 and Tier 1 items must be complete.
Tier 2 must be complete within 30 days.

| Board | Sign-off Required | Status |
|---|---|---|
| CTO | Tier 0 infrastructure complete, build passing, no critical errors | [ ] |
| CISO | Security audit complete, no critical vulnerabilities | [ ] |
| Legal | ToS and Privacy Policy reviewed and published | [ ] |
| Healthcare | Compliance disclaimer correct, rules engine verified | [ ] |
| CPO | All user flows tested and approved | [ ] |
| CFO | Paddle payments tested, revenue tracking live | [ ] |
| COO | Support infrastructure operational | [ ] |
| CEO / Founder | Final approval to launch | [ ] |

---

*Last updated: 2026-06-10*
*Next review: Weekly — every Monday*

# Hayya Med Pro â€” Pre-Launch Checklist
## Classification: Internal â€” Operational
## Owner: COO + CTO
## Review: Weekly until live

---

## STATUS KEY
- [ ] Not started
- [~] In progress
- [x] Complete
- [!] Blocked â€” needs action

---

## TIER 0 â€” ABSOLUTE BLOCKERS (Platform cannot function without these)

### Infrastructure
- [x] Supabase project connected â€” URL + anon key + service role key in .env.local
- [ ] All 28 database migrations run against production Supabase project (run all .sql files in supabase/migrations/ against production Supabase SQL editor)
- [x] GCP Cloud Run deployment tested end-to-end (revision 16 live)
- [x] Domain `hayyamed.pro` DNS pointed to Cloud Run via Cloudflare Worker proxy
- [x] SSL certificate active and verified (Cloudflare managed SSL)
- [x] All secrets stored in GCP Secret Manager (not .env files)
- [ ] GCP Cloud Scheduler configured â€” run `./scripts/setup-cloud-scheduler.sh` once after first deploy (required for trial emails, license alerts, employer digest, engagement reminders â€” all 7 cron jobs are dead without this)

### Authentication
- [x] Supabase Auth production URL configured â€” Site URL: https://hayyamed.pro, Redirect URLs: https://hayyamed.pro/**, localhost:3000/**, localhost:3001/**
- [ ] Supabase Redirect URLs include https://hayyamed.pro/auth/callback â€” required for PKCE email verification and password reset flows (add in Supabase Dashboard â†’ Authentication â†’ URL Configuration â†’ Redirect URLs)
- [x] Email verification flow tested end-to-end
- [x] Password reset flow tested end-to-end (forgot-password form + reset page both working)
- [x] Session persistence tested across page refresh

### Environment Variables
- [ ] NEXT_PUBLIC_SUPABASE_URL â€” set
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY â€” set
- [ ] SUPABASE_SERVICE_ROLE_KEY â€” set
- [ ] NEXT_PUBLIC_APP_URL â€” set to https://hayyamed.pro
- [ ] ANTHROPIC_API_KEY â€” set
- [ ] PADDLE_API_KEY â€” set
- [ ] PADDLE_WEBHOOK_SECRET â€” set
- [ ] PADDLE_PRO_MONTHLY_PRICE_ID â€” set (Pro $6/month)
- [ ] PADDLE_PRO_ANNUAL_PRICE_ID â€” set (Pro $61.20/year)
- [ ] PADDLE_EMPLOYER_CLINIC_MONTHLY_PRICE_ID â€” set ($50/month, â‰¤10 staff)
- [ ] PADDLE_EMPLOYER_CLINIC_ANNUAL_PRICE_ID â€” set ($510/year)
- [ ] PADDLE_EMPLOYER_GROWTH_MONTHLY_PRICE_ID â€” set ($100/month, â‰¤25 staff)
- [ ] PADDLE_EMPLOYER_GROWTH_ANNUAL_PRICE_ID â€” set ($1,020/year)
- [ ] PADDLE_EMPLOYER_DEPT_MONTHLY_PRICE_ID â€” set ($180/month, â‰¤50 staff)
- [ ] PADDLE_EMPLOYER_DEPT_ANNUAL_PRICE_ID â€” set ($1,836/year)
- [ ] PADDLE_EMPLOYER_HOSP_MONTHLY_PRICE_ID â€” set ($350/month, â‰¤200 staff)
- [ ] PADDLE_EMPLOYER_HOSP_ANNUAL_PRICE_ID â€” set ($3,570/year)
- [ ] POSTMARK_API_TOKEN â€” set (lib/email.ts uses POSTMARK_API_TOKEN)
- [ ] POSTMARK_WEBHOOK_TOKEN â€” set (secret token for /api/webhooks/postmark bounce handler; configure in Postmark â†’ Servers â†’ your server â†’ Webhooks â†’ Bounces & Spam Complaints â†’ Add webhook URL: `https://hayyamed.pro/api/webhooks/postmark`, Header: X-Webhook-Token)
- [ ] SUPPORT_EMAIL â€” set (defaults to `support@hayyamed.pro` if unset)
- [ ] EMAIL_FROM â€” set to verified sending address (e.g. `Hayya Med Pro <noreply@hayyamed.pro>`); must match the domain configured in Postmark; defaults to `noreply@hayyamed.pro` if unset
- [ ] NEXT_PUBLIC_VAPID_PUBLIC_KEY â€” set (push notifications, browser-accessible)
- [ ] VAPID_PRIVATE_KEY â€” set (push notifications, server-only)
- [ ] VAPID_SUBJECT â€” set (e.g. mailto:support@hayyamed.pro â€” required by web-push)
- [ ] CRON_SECRET â€” set (Authorization header for all /api/cron/* routes)
- [ ] UPSTASH_REDIS_REST_URL â€” set (Upstash Redis endpoint â€” rate limiting on AI + PDF routes)
- [ ] UPSTASH_REDIS_REST_TOKEN â€” set (Upstash Redis token â€” if not set, falls back to DB-based limiting)
- [ ] NEXT_PUBLIC_POSTHOG_KEY â€” **set as Cloud Build Trigger substitution variable `_POSTHOG_KEY`** (GCP Console â†’ Cloud Build â†’ Triggers â†’ Edit â†’ Substitution variables; baked into Next.js client bundle at build time; analytics silently disabled if missing â€” all 13 conversion events dead; graceful empty-string default so build does not fail if not yet set)
- [ ] NEXT_PUBLIC_POSTHOG_HOST â€” hardcoded to `https://eu.i.posthog.com` in cloudbuild.yaml; no action required
- [ ] Paddle price IDs (10 total) â€” **add to `--set-env-vars` in cloudbuild.yaml deploy step once Paddle account is active and products created**: PADDLE_PRO_MONTHLY_PRICE_ID, PADDLE_PRO_ANNUAL_PRICE_ID, PADDLE_EMPLOYER_CLINIC_MONTHLY_PRICE_ID, PADDLE_EMPLOYER_CLINIC_ANNUAL_PRICE_ID, PADDLE_EMPLOYER_GROWTH_MONTHLY_PRICE_ID, PADDLE_EMPLOYER_GROWTH_ANNUAL_PRICE_ID, PADDLE_EMPLOYER_DEPT_MONTHLY_PRICE_ID, PADDLE_EMPLOYER_DEPT_ANNUAL_PRICE_ID, PADDLE_EMPLOYER_HOSP_MONTHLY_PRICE_ID, PADDLE_EMPLOYER_HOSP_ANNUAL_PRICE_ID â€” checkout returns 500 until these are set
- [ ] SENTRY_ORG â€” set (Sentry organisation slug)
- [ ] SENTRY_PROJECT â€” set (Sentry project slug)
- [ ] SENTRY_AUTH_TOKEN â€” set (source map upload token)
- [ ] ADMIN_NOTIFICATION_EMAIL â€” set (email address to receive new CME activity pending notifications; graceful no-op if unset)
- [ ] CRON_MONITOR_TRIAL_REMINDERS â€” set (Dead Man's Snitch / Healthchecks.io URL for trial-reminders cron; optional â€” no-op if unset)
- [ ] CRON_MONITOR_LICENSE_REMINDERS â€” set (heartbeat URL for license-reminders cron)
- [ ] CRON_MONITOR_CME_DEADLINE â€” set (heartbeat URL for cme-deadline cron)
- [ ] CRON_MONITOR_LICENSE_EXPIRY â€” set (heartbeat URL for license-expiry cron)
- [ ] CRON_MONITOR_EMPLOYER_DIGEST â€” set (heartbeat URL for employer-digest cron)
- [ ] CRON_MONITOR_PROFESSIONAL_DIGEST â€” set (heartbeat URL for professional-digest cron)
- [ ] CRON_MONITOR_ONBOARDING_REMINDER â€” set (heartbeat URL for onboarding-reminder cron)

---

## TIER 1 â€” CRITICAL PRE-LAUNCH (Must pass before first user)

### Legal & Compliance
- [x] Terms of Service written and published at /terms
- [x] Privacy Policy written and published at /privacy
- [x] Mandatory compliance disclaimer visible on dashboard and step 7
- [x] Cookie consent (if required by Qatar PDPL)
- [x] Data Processing Agreement template ready for employer sign-off â€” DPA v1.0 published at /legal/dpa (15 sections, print/download button, Supabase/GCP/Postmark/Anthropic/Paddle sub-processors listed)
- [ ] Medical disclaimer reviewed by healthcare regulatory advisor

### Security
- [x] OWASP Top 10 self-audit completed â€” all 29 API routes audited; 3 admin routes missing role check fixed; cron secret in query param fixed; country code mismatch in 3 routes fixed; email XSS patched
- [x] All API routes verified: auth check before any data operation (Paddle webhook uses signature auth; admin API routes verify master_admin/super_admin role via requireAdminUser â€” critical fix applied 2026-06-11)
- [x] Supabase session middleware active â€” `middleware.ts` created at project root; calls `updateSession` on every non-static request; refreshes access token and writes updated cookies so users aren't silently logged out after 1 hour; middleware uses protected-prefix approach so all new SEO/marketing pages are public by default (fix applied 2026-06-12)
- [x] Employer registration gated by active employer subscription â€” page + server action both check subscriptions.plan === "employer" before granting employer_admin role; unauthenticated access redirects to /pricing (fix applied 2026-06-12)
- [x] Employer staff limit enforced per tier â€” approveLinkRequest checks subscription employer_tier and current approved staff count against EMPLOYER_TIERS maxStaff before approving; returns clear error if limit reached (fix applied 2026-06-12)
- [~] RLS policies tested â€” supabase/tests/rls_verification.sql written; run each block against live DB with two real user IDs to sign off
- [x] CSP headers verified in production â€” content-security-policy present and correct in response headers
- [x] HSTS active in production â€” strict-transport-security configured in next.config.ts + Cloudflare edge
- [x] No secrets in client-side code or git history â€” all secrets behind process.env, server-side only
- [x] npm audit â€” zero critical or high vulnerabilities (2 moderate in next/node_modules/postcss â€” Next.js internal, unfixable without downgrading framework)
- [x] Rate limiting active on /api/ai/* and /api/pdf/* endpoints â€” Upstash Redis sliding window (falls back to DB-backed audit_logs if UPSTASH env vars not set), 429 with Retry-After header

### User Flow Testing (End-to-End)
- [ ] Signup â†’ email verification â†’ dashboard (new user)
- [ ] 7-step onboarding completed successfully
- [ ] CME activity submitted â†’ admin verified â†’ wallet updated
- [ ] License added and expiry countdown visible
- [ ] Employer link requested â†’ approved â†’ compliance view visible
- [ ] PDF report generated (Pro tier)
- [ ] Settings updated and persisted
- [ ] Sign out â†’ session cleared â†’ redirected to login
- [ ] Forgot password â†’ reset â†’ login with new password

### Admin Flow Testing
- [x] Admin login and dashboard access â€” master_admin role working at /admin
- [x] CME activity verify and reject â€” both actions working, moves to Resolved with correct badge
- [x] Employer link request approve and reject â€” Create & Approve modal working, approved badge confirmed
- [x] Professional profile view (admin/professionals â€” Name, Profession, Specialty, License days, Completion %, Onboarding status)
- [x] Organization management (admin/organizations â€” Name, Type, City, Country, Verified badge + Verify/Unverify toggle action + name search)
- [x] Country rules view (admin/country-rules â€” card per country, credits/cycle/online-max, links to detail page)

### Payments (Paddle)
- [ ] Paddle account approved and active
- [ ] Paddle products created: Free Â· Pro ($6/mo + $61.20/yr) Â· Employer Clinic/Growth/Department/Hospital (monthly + annual) = 10 price IDs total
- [ ] Checkout flow tested in Paddle sandbox
- [ ] Paddle success URL configured â†’ `https://hayyamed.pro/dashboard?upgrade=success` (Paddle Dashboard â†’ Checkout â†’ Settings â†’ Return URL â€” applied globally; employer setup email + EmployerTeaserCard handles the employer post-purchase flow)
- [ ] Paddle webhook endpoint receiving events
- [ ] Subscription provisioning tested (subscription created â†’ user upgraded)
- [ ] Subscription cancellation tested (canceled â†’ user downgraded)
- [x] Billing portal tested (user can manage their subscription) â€” /api/paddle/portal creates Paddle CustomerPortalSession and redirects; /dashboard/billing page shows plan/billing/renewal, links to portal, shows upgrade CTA for free/trialing users

### Email (Postmark)
- [~] Postmark account active â€” approval submitted, under review
- [~] Sending domain verified â€” DKIM verified âœ…, Return-Path CNAME added (propagating, up to 48h)
- [ ] Email verification template sent and received
- [ ] Password reset template sent and received
- [x] Welcome email sent after onboarding complete (sendWelcomeEmail in lib/email.ts, called fire-and-forget from completeOnboarding server action)
- [x] SPF and DKIM DNS records configured â€” DKIM verified, SPF handled automatically by Postmark

### PWA

- [x] manifest.json valid â€” id, start_url, display, theme_color, icons, shortcuts all present
- [x] Service worker registered â€” PWARegister component in root layout; sw.js handles install/activate/push/fetch
- [x] Offline fallback page â€” /offline.html precached; network-first fetch falls back to it
- [x] "Add to Home Screen" prompt â€” PWAInstallPrompt shows for Android (beforeinstallprompt) and iOS (share guide), dismissable for 7 days
- [x] Push notification handlers â€” push and notificationclick events in sw.js; notification opens correct URL
- [x] worker-src 'self' in CSP â€” explicit directive added, not relying on script-src fallback
- [ ] PWA icons verified on-device (192Ã—192 and 512Ã—512 .png files exist; test on real device)
- [ ] Lighthouse PWA score: 100 (run after deploy to production)

### Mobile Responsiveness
- [x] Dashboard usable on 375px (iPhone SE) â€” no horizontal scroll confirmed
- [x] Dashboard usable on 390px (iPhone 14) â€” no overflow, all cards and buttons render correctly
- [x] Dashboard usable on 360px (Android standard) â€” no overflow, CME Wallet, Licenses, Settings all clean
- [x] All forms usable on mobile keyboard â€” inputs full-width at 360px, labels readable, confirmed in DevTools
- [x] Navigation works on mobile (hamburger/drawer)
- [ ] File upload works on iOS Safari
- [ ] File upload works on Android Chrome

### Performance
- [ ] Lighthouse Performance score: > 90 (mobile and desktop)
- [ ] Lighthouse Best Practices: 100
- [ ] Lighthouse Accessibility: > 90
- [ ] First Contentful Paint (FCP): < 2 seconds
- [ ] Largest Contentful Paint (LCP): < 2.5 seconds
- [x] No console errors in production build (clean build â€” 82+ routes, 0 TypeScript errors, 27 migrations; root app/error.tsx added)

---

## TIER 2 â€” OPERATIONAL READINESS (Required within 30 days of launch)

### Observability & Monitoring
- [ ] GCP Cloud Monitoring dashboard configured
- [x] Sentry error tracking installed and receiving errors
- [x] Health check endpoint live at /api/health â€” returns `{status:"ok"|"degraded", checks:{database,supabase_url,paddle,postmark,anthropic}, ts}` with HTTP 200 (ok) or 503 (degraded); checks DB connectivity + required env vars
- [ ] Uptime monitoring active (external check every 60 seconds) â€” configure GCP uptime check against /api/health (200 = ok, 503 = degraded)
- [ ] Alert: 5xx error rate > 1% â†’ notify on-call
- [ ] Alert: Response time p95 > 2 seconds â†’ notify on-call
- [ ] Alert: Supabase connection failures â†’ notify immediately
- [x] Cron job monitoring: 7 jobs instrumented â€” pingCronMonitor() in all 7 cron routes (cme-deadline, license-reminders, license-expiry, employer-digest, professional-digest, trial-reminders, onboarding-reminder); requires CRON_MONITOR_* env vars to activate (Dead Man's Snitch or compatible)
- [ ] GCP billing alert: > $100/month â†’ review

### Product Analytics
- [x] PostHog (or Mixpanel) installed
- [x] Key events instrumented:
  - [x] signup_started
  - [x] signup_completed
  - [x] onboarding_step_completed (step 1â€“7)
  - [x] onboarding_completed
  - [x] cme_activity_submitted
  - [x] cme_activity_verified
  - [x] pdf_report_downloaded (conversion signal)
  - [x] upgrade_clicked
  - [x] subscription_started
  - [x] pricing_page_viewed (with source attribution â€” which CTA drove user to pricing)
  - [x] subscription_activated (fires on /dashboard?upgrade=success â€” confirms end-to-end conversion, 2026-06-12)
  - [x] employer_link_requested
  - [x] employer_link_approved
  - [x] PostHog user identity set on every dashboard load â€” PostHogIdentify component in DashboardLayout calls identifyUser(user.id); all events now linked to authenticated user (fix applied 2026-06-12)
  - [x] All 13 upgrade CTAs include ?source=X in pricing URL â€” pdf_report, ai_chat, ai_recommendations, add_activity_modal, multi_country_wallet, chat_widget, free_tier_banner, trial_banner, trial_expired_banner, billing_page, settings_trial, settings_billing, cme_activity_limit, ai_page (fix applied 2026-06-12)
- [ ] Funnel: signup â†’ onboarding complete â†’ first CME activity â†’ PDF download â†’ upgrade
- [ ] Dashboard: DAU, WAU, MAU, activation rate, conversion rate

### Push Notifications
- [x] VAPID keys generated â€” public key already baked into cloudbuild.yaml `--build-arg NEXT_PUBLIC_VAPID_PUBLIC_KEY=...`; VAPID_SUBJECT set in `--set-env-vars`; VAPID_PRIVATE_KEY slot in `--set-secrets`
- [ ] VAPID private key added to GCP Secret Manager â€” `echo "<your-private-key>" | gcloud secrets versions add hayyamed-pro-vapid-private --data-file=-` (or use `node scripts/generate-vapid-keys.mjs` if regenerating)
- [ ] Web Push subscription tested on Chrome
- [ ] Web Push subscription tested on Firefox
- [ ] License expiry cron job running (30-day, 7-day)
- [ ] CME deadline cron job running

### Support Infrastructure
- [ ] Support email configured (support@hayyamed.pro or similar)
- [x] Help documentation / FAQ page live at /help
- [x] Contact form or chat widget available (/contact â€” name, email, subject dropdown, message â†’ Postmark to support@hayyamed.pro)
- [ ] Support response SLA defined: < 24 hours for Pro, < 72 hours for Free

---

## TIER 3 â€” REVENUE READINESS (Required to hit first $10K ARR)

### Conversion Optimization
- [x] Free tier limits enforced server-side (10 activity cap)
- [x] PDF report download wall implemented (Pro required)
- [x] Upgrade prompt visible on dashboard for Free users (FreeTierBanner: state-aware blue/orange/red, activity progress bar, upgrade CTA)
- [x] Pricing page live at /pricing with all plan details
- [x] Upgrade CTA in every feature that requires Pro

### First Customer Acquisition
- [ ] LinkedIn profile for Hayya Med Pro company page â€” live
- [ ] 10 healthcare professionals invited to beta (personal network)
- [ ] QCHP outreach initiated (intro email or meeting requested)
- [ ] 1 hospital or clinic employer approached for pilot
- [ ] Beta feedback survey configured (Typeform or similar)

### ARR Tracking
- [ ] MRR/ARR tracking spreadsheet or dashboard live
- [ ] Churn tracking defined
- [ ] Revenue per plan tier tracked

---

## TIER 4 â€” PHASE 2 READINESS (Required for Q3 2026 growth phase)

### Localization
- [ ] next-intl framework installed and configured
- [ ] Arabic language toggle functional in UI
- [ ] RTL layout working on all key pages
- [ ] Arabic translation for onboarding steps 1â€“7
- [ ] Arabic translation for dashboard and CME tracker

### Country Rules Expansion

- [x] Saudi Arabia (SCFHS) rules configured â€” migration 024 inserted profession-specific rules (physician/pharmacist/dentist 60/yr, nurse/AHP 30/yr) + 7 categories
- [x] UAE DHA rules configured â€” migration 024 inserted all-profession 40 CME/2yr rule + 6 categories (patient safety mandatory, online cap 20)
- [x] UAE DOH rules configured â€” migration 024 inserted all-profession 40 CPD/2yr rule + 6 categories
- [x] Kuwait, Bahrain, Oman rules configured â€” migration 024 inserted all 3 countries
- [x] Country rules admin UI complete â€” admins can edit existing rules, add new profession rules for any country, add new countries, and add/edit/delete activity categories â€” no SQL required (Session 43)

### Employer Dashboard Enhancement
- [x] Staff compliance grid view (all linked staff in one table â€” Name, Profession, CME mini-bar, Status badge, License days, Actions)
- [x] Department grouping and filtering (departments as collapsible sections with per-dept status counts; assign/reassign from row)
- [x] Bulk compliance PDF report (all staff, one download â€” BulkReportButton â†’ /api/pdf/org-report)
- [x] Weekly email digest for employer HR (cron at /api/cron/employer-digest â†’ sendEmployerDigestEmail)

### UI Polish
- [x] Loading skeletons on all data tables (dashboard, CME, licenses, analytics, AI, marketplace, my-courses, settings)
- [x] Error boundaries on all pages (dashboard/error.tsx catches all child routes; fixed invalid hover hex bug)
- [x] Toast notification system on all key actions (CME submit, employer link, profile edit, privacy toggles inline, notification bell subscribe/error)
- [x] Empty states designed for zero-data screens (CME wallet: icon + examples + CTA; no-wallet: icon + setup guide)
- [x] Profile completion guidance card on dashboard (shows specific missing fields with point values + links to Settings/CME; hides at 100%)

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

*Last updated: 2026-06-13 - Session 46: (1) Landing page redesign -- 14 to 8 sections, NeuralCanvas particle animation, Hayya Med AI branding, Vision/Mission section. (2) AI Module Control Center /admin/ai-modules -- 9 modules, 8 model options (Claude/GPT/Gemini), cost estimator, stored in platform_settings. (3) Hayya AI Voice Assistant -- floating orb, Web Speech API STT, /api/ai/voice-chat (Haiku 4.5 Pro-gated), browser TTS, conversation panel, mounted in dashboard layout. (4) Employer AI Analyzer /employer/ai-analyzer -- /api/ai/employer-analyzer (Sonnet 4.6), heatmap, risk gauge, severity alerts, PDF download, zero PII to AI. (5) Training Provider AI Analyzer /provider/ai-analyzer -- /api/ai/provider-analyzer (Sonnet 4.6), demand prediction, gap opportunity cards, revenue insights. (6) QPay Qatar -- lib/qpay.ts, /api/qpay/checkout, /api/qpay/callback (verify-first not blind trust), QPayCheckout component, migration 029 qpay_invoices with RLS, wired into pricing Pro card. COMBINED_RUN_ONCE.sql updated with migration 029. Provider analyzer bug fixed: courses table correct, enrollment aggregate via course_enrollments join. Build: 0 TypeScript errors.*


*Last updated: 2026-06-12 â€” Session 39: (1) Employer layout infinite redirect fix â€” added `isRegisterPage` null-safe render path so `member.organizations` is never dereferenced when `member=null` on the register page. (2) Paddle webhook `SubscriptionActivated` handler â€” added case to fill `current_period_end` from first successful payment (was never set by `TransactionCompleted`); fixes billing page showing no renewal date and renewal reminder emails. (3) Email "14-day" cleanup â€” onboarding reminder and employer invite emails now say "Pro trial" (generic) not "14-day Pro trial" (wrong for 30-day referred users). (4) Migration 026 critical RLS fix â€” `employer_required_courses` RLS policies referenced `org_id` from `organization_members` but the actual column is `organization_id`; fixed in migration SQL. (5) Required-training page + actions â€” same `org_id` â†’ `organization_id` bug in app code fixed. Build: 0 TypeScript errors.*

*Previous â€” Session 37/38: (1) Onboarding Step 7 trial display fix â€” `completeOnboarding` server action now returns `{ pct, trialDays }`; step page computes correct trial days (14 vs 30 for referred users) from `user.user_metadata.referred_by` and passes as prop; Step7Activate uses `actualTrialDays` state updated post-server-call â€” referred users now see "30-Day Pro Trial" not "14-Day". (2) `scripts/generate-vapid-keys.mjs` â€” Node.js script using `web-push` to generate VAPID keys with exact GCP Secret Manager and cloudbuild.yaml instructions; clarified checklist: VAPID public key already baked into cloudbuild.yaml, only private key remains in Secret Manager. (3) Pricing consistency fix â€” homepage JSON-LD, homepage FAQ, and LandingPage FAQ all said `$49/year`; corrected to `$61.20/year` (15% off $6/month) to match pricing page and Paddle configuration. (4) Training provider email notifications â€” `sendAdminProviderPendingEmail` wired to provider registration; `sendTrainingProviderApprovedEmail` wired to admin PATCH approve action. (5) Admin setup status card â€” checks 8 critical services, shows only when unconfigured. Build: 0 TypeScript errors.*

*Previous â€” Session 35: (1) `NEXT_PUBLIC_POSTHOG_KEY` critical fix â€” was missing from Docker ARG list and cloudbuild.yaml entirely, causing all PostHog analytics to silently fail in production (initAnalytics exits early when key is undefined); fixed Dockerfile to add ARG NEXT_PUBLIC_POSTHOG_KEY + ENV, and cloudbuild.yaml to use Cloud Build substitution `$_POSTHOG_KEY` (safe empty default, user sets in Trigger settings when PostHog is active; no build failure if not yet set). Also added `NEXT_PUBLIC_SENTRY_DSN` ARG. (2) Paddle checkout `free_upgrade` fix â€” checkout route checked price ID BEFORE checking for free_upgrade discount, so admin-granted free upgrades failed with 500 even without Paddle configured; restructured to: resolve discount first â†’ if free_upgrade, grant Pro directly and return â†’ only then check priceId for Paddle path. (3) Checklist updated: Paddle price ID deployment instructions, POSTHOG_KEY substitution var instructions. Build: 0 TypeScript errors.*

*Previous â€” Session 34: (1) GCP Cloud Scheduler setup â€” `scripts/setup-cloud-scheduler.sh` created; configures all 7 cron jobs (trial-reminders, license-reminders, cme-deadline, license-expiry, onboarding-reminder, employer-digest, professional-digest) against GCP project via gcloud; fetches CRON_SECRET from Secret Manager automatically; staggered schedules (08:00â€“09:00 GST daily + Monday 07:00/07:30 GST weekly); supports `--delete` flag. Added as Tier 0 blocker. (2) Sessions 25â€“33 completed: NHRA/OMSB/MOH-Kuwait renewal pages (all 7 GCC renewal guides now live), cloudbuild.yaml POSTMARK_API_KEYâ†’POSTMARK_API_TOKEN critical fix, PostHog identity on every dashboard load, 13 upgrade CTAs with source attribution, EmployerTeaserCard, TrialExpiredBanner, second-country wall, NPS survey, per-page OG images, referral reward emails, analytics wallet fix, multi-wallet support, employer staff grid/departments/bulk PDF/digest, UI polish (skeletons, error boundaries, toasts, empty states, profile completion card), DPA published, OWASP audit complete, rate limiting, CSP/HSTS headers, employer registration gating, staff tier limits, PostHog subscription_activated event. Build: 0 TypeScript errors.*

*Previous â€” Session 24 (continued): (1) Employer link request notification system â€” 6-file fix across `lib/email.ts`, `settings/actions.ts`, `AddEmployerForm`, `Step4Employer`, `employer/actions.ts`, `onboarding/actions.ts`; server action dedup, audit log, fire-and-forget email at every link lifecycle event. (2) `sendCmeVerifiedEmail` free-user upgrade CTA. (3) cronMonitor fix â€” `professional-digest` and `onboarding-reminder` were missing from JOB_ENV_MAP; both now registered. Cron count corrected to 7. (4) AI audit logging â€” all 4 AI routes were missing mandatory audit log; added fire-and-forget logAudit with model, input_tokens, output_tokens, latency_ms to all 4 routes. (5) AI Zod validation â€” 3 non-streaming AI routes now validate Claude responses against Zod schemas before use (CategorizeResponseSchema, OcrResponseSchema, RecommendationsResponseSchema). Build clean: 0 TypeScript errors.*

*Previous: Session 24 complete: (1) PDF report critical fix â€” now fetches verified + pending activities; PDF shows two sections: "Verified CME Activities" (counted toward compliance) and "Pending Activities â€” Awaiting Verification" (labeled clearly as not counted); free users who upgrade no longer get an empty PDF; footer URL fixed pro.hayyamed.com â†’ hayyamed.pro. (2) WhatsApp sharing in ComplianceBadgeCard â€” wa.me/?text= share button with pre-written GCC-appropriate message including referral link; `badge_shared_whatsapp` analytics event registered. (3) Help page QCHP accuracy fix: "50 CME/year" â†’ "80 CPD/2yr (40/yr min)". Build clean: 0 TypeScript errors.*

*Previous: Session 23 complete: (1) Bahrain NHRA CPD page at /nhra â€” FAQPage JSON-LD, ðŸ‡§ðŸ‡­, 40 CPD/2yr requirements, structured/unstructured split, comparison table, 5-question FAQ, dark CTA. (2) Oman OMSB CME page at /omsb â€” FAQPage JSON-LD, ðŸ‡´ðŸ‡², physicians 40/nurses 30 per 2yr, Category A/B framework, profession-specific comparison table. (3) UAE Abu Dhabi DOH CPD page at /doh â€” FAQPage JSON-LD, ðŸ‡¦ðŸ‡ª, 30â€“50 credits by profession, online cap 20, self-directed cap 15, DOH vs DHA comparison table. (4) /countries hub page updated â€” all 7 GCC country pages now linked (removed "Coming soon" entries), accurate per-country data, full guide links in country cards + comparison table. (5) /doh, /nhra, /omsb added to sitemap.ts at priority 0.9. (6) Help page QCHP accuracy fix â€” 50/yr â†’ 80/2yr (40/yr min). Build clean: 0 TypeScript errors. GCC SEO coverage now complete: QCHP Â· SCFHS Â· DHA Â· DOH Â· MOH-Kuwait Â· NHRA Â· OMSB.*

*Previous: Session 22 complete: (1) Routing fix â€” merged /p/[code] referral-code lookup into /p/[id] (UUID + referral code both handled by single route; duplicate [code] directory removed to prevent Next.js routing conflict). (2) Trial start email â€” added "Earn 30 more days" referral section with personalized link if referral_code exists on profile; referralCode threaded from completeOnboarding action â†’ sendTrialStartEmail. (3) Referral code auto-generated at onboarding completion so every user has a personalized link immediately. (4) Paddle checkout rate limiting â€” 10 requests/user/hour via checkAndLogRateLimit, 429 with Retry-After. (5) ComplianceBadgeCard â€” "Copy LinkedIn post" button copies pre-written post template with compliance status + referral link; referralCode prop threaded from dashboard page. Build clean: 0 TypeScript errors.*

*Previous: Session 21 complete: SEO acquisition pages â€” /qchp (Qatar, QCHP/DHP-AS, 80 CPD/2yr), /scfhs (Saudi Arabia, SCFHS, 30â€“60 CME/yr by profession), /dha (UAE Dubai, DHA, 40 CME/2yr). Each page: hero with authority chip + flag, requirements card, categories/profession breakdown, 4-step how-it-works, comparison table, FAQ accordion with JSON-LD FAQPage schema, dark CTA, regulatory disclaimer. All 3 added to sitemap.ts at priority 0.9. Pages target "QCHP CME tracker", "SCFHS CME requirements", "DHA compliance" search intent. Build clean: 0 TypeScript errors.*

*Previous: Session 20 complete: (1) Trial activation drip â€” added Day 3 (sendTrialDay3Email: activation nudge if 0 activities logged) and Day 7 (sendTrialDay7Email: midpoint compliance snapshot + upgrade push if not yet paid) to trial-reminders cron; cron now handles all 4 trial touchpoints (Day 3, 7, 11, 14). (2) Pricing page CRO â€” added: 3-column guarantee strip (14-day money-back / your data is yours / cancel anytime), 6-item accordion FAQ (visible on page, not just JSON-LD), dark navy bottom CTA section with contextual CTAs based on plan state. Build clean: 0 TypeScript errors.*

*Previous: Session 19 complete: PdfReportCard â€” replaced 12px gray "Upgrade for PDF export â†—" text link (the #1 conversion driver) with a full-width paywall card: blurred CSS report preview, 5-feature checklist, "$6/month Â· Save 15% annual" pricing, "Unlock PDF Report â†’" primary CTA, "14-day money-back guarantee" trust signal. Pro users see compact card with instant download. analytics: pdf_paywall_shown impression + upgrade_clicked with source=pdf_report_card. Build clean: 0 TypeScript errors.*

*Previous: Session 18 complete: Public professional profile page at /p/[id] â€” dark hero, compliance ring %, multi-wallet jurisdiction chips, regulatory disclaimer, "Create free account" CTA for non-users. generateMetadata with OG images from existing /api/badge/compliance endpoint. ComplianceBadgeCard: "Copy profile link" + "Share profile on LinkedIn" buttons (separate from badge sharing). Analytics events: profile_link_copied, profile_shared_linkedin. Build clean: 0 TypeScript errors.*

*Previous: Session 17 complete: (1) Analytics multi-wallet fix â€” ?wallet= param, WalletTabs, wallet_id filter. (2) Per-page OG images â€” pricing + register. (3) NPS survey â€” migration 027, NpsSurveyBanner. (4) Referral rewards â€” 30-day trials, sendReferralRewardEmail, ReferralSection redesign. (5) Second country wall â€” Free users gated server-side, inline upgrade card. (6) Employer teaser card â€” Pro dashboard â†’ See Employer plans. (7) TrialExpiredBanner â€” shown 0â€“14 days after trial ends for Free users; lists 5 lost features (PDF reports, AI chat, AI gap analysis, unlimited activities, cert storage); "Resume Pro â€” $6/month" CTA; replaces FreeTierBanner during expiry window to maximise conversion signal. Build clean: 0 TypeScript errors.*
*Next review: Weekly â€” every Monday*

# Hayya Med PRO â€” AI Operating Instructions

@AGENTS.md
@EXECUTIVE_MANDATE.md

## Platform Identity

Global healthcare SaaS â€” CME tracking, CPD, licensing readiness, employer compliance,
healthcare workforce management, training marketplace, universities, conferences.
Built for Qatar â†’ GCC â†’ MENA â†’ Global.
Platforms: Web + PWA + Android + iOS.

---

## Operating Role

Act as the complete integrated executive leadership team defined in EXECUTIVE_MANDATE.md.
Not a developer. Not a single contributor. The full coordinated board.
Every decision, code change, and architectural choice is evaluated across all 20 dimensions
in the Mandatory Evaluation Framework before execution.

---

## Technical Stack

- Next.js 16.2.6 App Router â€” read node_modules/next/dist/docs/ before writing any code
- React 19, TypeScript strict mode
- Supabase (Postgres + RLS + Auth + Storage + Edge Functions)
- Tailwind CSS v4
- Paddle (payments), Postmark (email), Anthropic Claude (AI), Web Push (notifications)
- GCP Cloud Run â€” me-central1 (Doha, Qatar) â€” hayyamed.pro

---

## Supabase Client Patterns

- Browser component: `createClient` from `@/lib/supabase/client`
- Server component: `await createClient()` from `@/lib/supabase/server`
- Admin (bypasses RLS â€” use sparingly, log all calls): `createAdminClient()` from `@/lib/supabase/server`

---

## Route Groups

- `(auth)` â€” /login, /register, /forgot-password, /reset-password, /verify-email
- `(onboarding)` â€” /onboarding/[1-7]
- `(dashboard)` â€” /dashboard, /cme, /licenses, /analytics, /marketplace, /settings
- `(employer)` â€” /employer (employer_admin only)
- `(provider)` â€” /provider (training_provider_admin only)
- `(admin)` â€” /admin (master_admin / super_admin only)

---

## Roles

- `healthcare_professional` â€” default after signup
- `employer_admin` â€” manages staff compliance for an organization
- `training_provider_admin` â€” manages courses and certificates on marketplace
- `university_admin` â€” manages faculty and alumni CME (future)
- `master_admin` / `super_admin` â€” full platform management

---

## Key Database Tables

- `professional_profiles` â€” auth_id, all profile fields, onboarding_step, onboarding_complete
- `organizations` â€” verified hospitals, clinics, universities
- `organization_members` â€” auth users â†” orgs with roles
- `employer_link_requests` â€” pending/approved/rejected professional â†” employer links
- `profile_privacy_settings` â€” per-professional employer visibility toggles
- `cme_wallets` â€” required/completed credits, compliance_status (auto-computed by trigger)
- `cme_activities` â€” individual CME entries; verified activities auto-sync wallet via trigger
- `subscriptions` â€” Paddle subscription lifecycle per user
- `country_compliance_rules` â€” all compliance rules live in DB, not in code
- `compliance_activity_categories` â€” category caps and credit conversion factors
- `audit_logs` â€” append-only, 7-year retention, every admin and AI action logged

---

## Non-Negotiable Database Rules

- RLS enabled on EVERY table â€” no exceptions, ever
- Every table has `id uuid`, `created_at timestamptz`, `updated_at timestamptz`
- Every foreign key explicitly declared and indexed
- No country-specific compliance logic hardcoded â€” rules engine governs all compliance
- Migrations are idempotent: `CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS`
- Never `DROP COLUMN` or `DROP TABLE` â€” use soft deprecation
- Audit logs are append-only â€” no UPDATE or DELETE policy on audit_logs

---

## Non-Negotiable Security Rules

- Every API route starts with `supabase.auth.getUser()` â€” no exceptions
- Admin routes additionally verify role via `organization_members`
- Service role key used only server-side â€” never expose to client
- Certificate storage: private bucket, signed URLs only (1-hour expiry)
- Path traversal protection on all file operations (block `..`, `\0`, `//`)
- All AI calls: anonymized (professional_id not name/license), logged, validated via Zod
- No PII in prompts sent to external AI APIs
- Rate limiting on auth, AI, and webhook endpoints before production launch

---

## Non-Negotiable AI Rules

- AI model selection follows the tier table in EXECUTIVE_MANDATE.md
- Every AI API response validated against a Zod schema before use
- All prompts versioned in `lib/ai/prompts/` â€” never inline in route handlers
- Fallback to rule-based response if AI unavailable â€” compliance cannot depend on AI uptime
- Free tier: no AI features. Pro: Haiku chatbot + Sonnet gap analysis. Enterprise: Opus.
- Every AI call logged: model, token count, latency, professional_id, action

---

## Non-Negotiable Mobile Rules

- Every feature evaluated for Web, PWA, React Native, iOS, Android before shipping
- No cookies in mobile API paths â€” Bearer tokens for mobile
- No in-app subscription purchases â€” web checkout only (App Store reader app exemption)
- Offline-first: CME submission queued offline, synced when online

---

## Non-Negotiable Revenue Rules

- Every feature has a revenue path identified before building
- Free tier limits enforced server-side â€” never client-side only
- PDF report download wall = primary Free â†’ Pro conversion driver
- Every upgrade opportunity surfaced in UI at the right friction point

---

## Mandatory Compliance Disclaimer

Always visible on dashboard and onboarding step 7:

> "Hayya Med PRO supports CME tracking and licensing readiness. It does not issue
> licenses and does not replace official licensing authorities. Users must verify
> final requirements with their relevant regulatory body."

---

## Design System

- Primary blue: `#1a56a0`
- Background: `#f8fafc` / `#f0f4f8`
- Border: `#e2e8f0`
- Muted text: `#64748b`
- Success: `#16a34a`
- Warning: `#d97706`
- Error: `#dc2626`
- Font: System font stack (no external font dependency)
- Direction: LTR default â€” RTL toggle planned (Phase 2 â€” next-intl)

---

## Governance Documents

- EXECUTIVE_MANDATE.md â€” Operating roles, 12 skill domains, evaluation framework
- PRODUCT_VISION.md â€” Mission, market positioning, expansion strategy
- PRODUCT_REQUIREMENTS.md â€” Feature specifications
- REVENUE_MODEL.md â€” 7 revenue streams, ARR projections
- SUBSCRIPTION_PLANS.md â€” Free / Pro / Employer / University / Government
- COUNTRY_RULES_ENGINE.md â€” Per-country compliance rules (never hardcode)
- SECURITY_STANDARDS.md â€” Auth, RLS, API, certificate, audit standards
- DATABASE_STANDARDS.md â€” Naming, RLS patterns, migration rules, indexing
- UI_UX_STANDARDS.md â€” Design system, accessibility, mobile-first
- MOBILE_APP_STRATEGY.md â€” PWA now, React Native trigger, native iOS/Android
- AI_ARCHITECTURE.md â€” Model selection, RAG, prompt governance, cost targets
- PARTNERSHIP_STRATEGY.md â€” QCHP, hospitals, universities, pharma tiers
- DEVELOPMENT_ROADMAP.md â€” 5-phase roadmap with ARR targets
- PRE_LAUNCH_CHECKLIST.md â€” Tier 0â€“4 launch requirements and sign-off

---

## Phase Status

Current: **Phase 1 â€” Foundation & GTM**

Target: Live at hayyamed.pro â†’ first paying Pro subscriber â†’ first employer account.

Immediate next steps:

1. Connect Supabase (URL + keys)
2. Run 9 migrations
3. Set all env vars (Anthropic, Paddle, Postmark, VAPID)
4. Deploy to GCP Cloud Run
5. Complete Tier 0 and Tier 1 of PRE_LAUNCH_CHECKLIST.md

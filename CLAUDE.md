@AGENTS.md

# Hayya Med PRO

Healthcare professional CME tracking, licensing, and compliance SaaS platform.

## Stack
- Next.js 16.2.6 App Router, React, TypeScript strict mode
- Supabase (Postgres + RLS + Auth) — new isolated project
- Tailwind CSS v4
- Hosted on GCP Cloud Run (me-central1, Doha Qatar) at pro.hayyamed.pro

## Supabase client patterns
- Browser client: `createClient` from `@/lib/supabase/client`
- Server component: `await createClient()` from `@/lib/supabase/server`
- Admin (bypasses RLS): `createAdminClient()` from `@/lib/supabase/server`

## Roles
- healthcare_professional — default after signup
- employer_admin — manages staff compliance for an organization
- training_provider_admin / university_admin — future
- master_admin / super_admin — platform management

## Route structure
- `(auth)` — /login, /register, /verify-email
- `(onboarding)` — /onboarding/[1-7]
- `(dashboard)` — /dashboard, /dashboard/cme, /dashboard/licenses, /dashboard/settings
- `(employer)` — /employer (employer_admin only)
- `(admin)` — /admin (master_admin/super_admin only)

## Key tables
- `professional_profiles` — auth_id, all profile fields, onboarding_step, onboarding_complete
- `organizations` — verified list of hospitals/clinics
- `organization_members` — links auth users to orgs with roles
- `employer_link_requests` — pending/approved/rejected links between professionals and employers
- `profile_privacy_settings` — per-professional employer visibility toggles
- `cme_wallets` — required/completed credits, compliance_status (auto-computed by trigger)
- `cme_activities` — individual CME entries; verified activities auto-sync wallet credits via trigger

## Mandatory compliance disclaimer
Always show on dashboard and step 7:
"Hayya Med PRO supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with their relevant regulatory body."

## Colors
- Primary blue: #1a56a0
- Background: #f8fafc / #f0f4f8
- Border: #e2e8f0
- Muted text: #64748b
- Success: #16a34a
- Warning: #d97706
- Error: #dc2626

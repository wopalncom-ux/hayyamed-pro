# Hayya Med Pro — Database Schema Audit
_Generated: 2026-06-15 | Updated: 2026-06-16 | Migrations: 001–063 | Reviewer: Foundation Review Sprint_

---

## Audit Summary

| Category | Count | Status |
|----------|-------|--------|
| Tables | 36 | ✅ All have RLS enabled |
| Indexes | 40+ | ⚠️ Several missing (see below) |
| Triggers | 30+ | ✅ updated_at on every mutable table |
| Functions | 8 | ✅ All security-definer where needed |
| Enums | 6 | ✅ Reasonable coverage |
| RLS Policies | 80+ | ⚠️ 3 gaps identified |
| Foreign Keys | 35+ | ✅ All declared |
| Migrations | 40 | ✅ All idempotent (IF NOT EXISTS) |

---

## ✅ Strengths

### 1. RLS on Every Table
Every table has `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`. The only intentional exception is `audit_logs` which uses `USING (false)` to block direct access — all writes go through service role. This is correct.

### 2. Append-Only Audit Logs
`audit_logs` has no UPDATE or DELETE policy. Enforced correctly. 7-year retention via Cloud Scheduler (cron) is the right architecture.

### 3. Trigger-Based Compliance Scoring
`update_compliance_status()` triggers on every wallet INSERT or UPDATE, auto-computing `compliance_status` from `completed_credits / required_credits`. This is correct and avoids stale reads.

### 4. Wallet Credit Sync via Trigger
`sync_cme_wallet_credits()` fires after every `cme_activities` INSERT/UPDATE/DELETE, recalculating `completed_credits` from verified activities. Correct pattern — no manual credit management needed.

### 5. Multi-Wallet Support (Migration 026)
Dropped the `UNIQUE` constraint on `professional_id` in `cme_wallets` to allow multiple wallets (one per country/authority). Added `is_primary` flag. Correct design for multi-country professionals.

### 6. Rules Engine in DB
`country_compliance_rules` and `compliance_activity_categories` store all compliance logic. No hardcoded country rules in application code. This is the correct architecture for global expansion.

---

## ⚠️ Gaps and Risks

### ✅ RESOLVED — Previously Missing Tables (migrations 041–058 applied)

The following tables were identified as missing during the original audit (migrations 001–040). All have since been implemented.

#### 1. `ai_call_logs` — ✅ DONE (migration 041)
**Risk: HIGH — Compliance + Cost**

Every AI call must be logged (per CLAUDE.md: model, token count, latency, professional_id, action). Currently, AI calls write to `audit_logs` via `logAudit()`, but `audit_logs` is a generic event store not optimised for AI call analytics.

**Missing columns:** `model`, `input_tokens`, `output_tokens`, `latency_ms`, `cost_usd`, `prompt_version`, `success`, `error_message`

**Impact:** Cannot track AI cost per user, cannot enforce token budgets, cannot identify model hallucinations by audit.

```sql
-- Required migration: 041_ai_call_logs.sql
CREATE TABLE ai_call_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action          text NOT NULL,  -- 'gap_analysis' | 'compliance_chat' | 'ocr' | etc.
  model           text NOT NULL,
  input_tokens    integer,
  output_tokens   integer,
  latency_ms      integer,
  cost_usd        numeric(10,6),
  prompt_version  text,
  success         boolean NOT NULL DEFAULT true,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now()
);
-- No UPDATE/DELETE — append-only cost log
-- Partition by month at 100K users
```

---

#### 2. `certificate_storage_records` — ✅ DONE (migration 042)
**Was: HIGH — Security + Compliance**

Certificate files are stored in Supabase private bucket but there is no database table tracking which files belong to which `cme_activity_id`, their storage paths, expiry of signed URLs, or deletion status. Currently `cme_activities.certificate_url` stores the raw storage path — this bypasses the signed URL pattern.

**Impact:** Cannot audit file access, cannot implement certificate expiry, cannot enforce 1-hour signed URL policy from a central table.

```sql
-- Required migration: 042_certificate_storage.sql
CREATE TABLE certificate_storage_records (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cme_activity_id uuid REFERENCES cme_activities(id) ON DELETE SET NULL,
  storage_path    text NOT NULL,
  file_name       text,
  file_size_bytes integer,
  mime_type       text,
  uploaded_at     timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  is_deleted      boolean NOT NULL DEFAULT false
);
```

---

#### 3. `mobile_device_registrations` — ✅ DONE (migration 043)
**Was: MEDIUM — Mobile + Push**

`push_subscriptions` stores Web Push endpoints but there is no table for React Native / mobile device tokens (FCM for Android, APNs for iOS). When the mobile app ships, push notification dispatch will need both Web Push and FCM/APNs records per user.

```sql
-- Required migration: 043_mobile_devices.sql
CREATE TABLE mobile_device_registrations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_token    text NOT NULL,
  platform        text NOT NULL CHECK (platform IN ('ios', 'android')),
  app_version     text,
  os_version      text,
  device_model    text,
  is_active       boolean NOT NULL DEFAULT true,
  last_active_at  timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (professional_id, device_token)
);
```

---

#### 4. `notification_queue` — ✅ DONE (migrations 044 + 053)
**Was: MEDIUM — Reliability** | Retry logic added in migration 053 (`next_retry_at`, `attempts`)

All emails are sent synchronously in API routes and cron jobs. If Postmark is down or the cron fails mid-batch, emails are lost with no retry mechanism. An email queue table enables: retry logic, deduplication, delivery confirmation tracking, and observability.

```sql
-- Required migration: 044_notification_queue.sql
CREATE TABLE notification_queue (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  channel         text NOT NULL CHECK (channel IN ('email', 'push', 'sms')),
  template_id     text NOT NULL,
  payload         jsonb NOT NULL,
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  attempts        integer NOT NULL DEFAULT 0,
  max_attempts    integer NOT NULL DEFAULT 3,
  scheduled_at    timestamptz NOT NULL DEFAULT now(),
  sent_at         timestamptz,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notification_queue_pending ON notification_queue (scheduled_at) WHERE status = 'pending';
```

---

#### 5. `feature_flags` — ✅ DONE (migration 045)
**Was: LOW-MEDIUM — Product**

`platform_settings` handles price/limit configuration but has no structured feature flag system. Feature flags enable: A/B testing, gradual rollouts, per-plan feature control, and emergency kill switches.

```sql
-- Required migration: 045_feature_flags.sql
CREATE TABLE feature_flags (
  key             text PRIMARY KEY,
  enabled         boolean NOT NULL DEFAULT false,
  enabled_plans   text[] DEFAULT NULL,  -- NULL = all plans
  rollout_pct     smallint DEFAULT 100 CHECK (rollout_pct BETWEEN 0 AND 100),
  description     text,
  updated_at      timestamptz DEFAULT now()
);
```

---

#### 6. `webhook_endpoints` / `webhook_deliveries` — ✅ DONE (migration 046)
**Was: MEDIUM — Enterprise**

For enterprise hospital/government integrations (HRIS sync, compliance reporting), the platform needs an outbound webhook system where organisations can register endpoints to receive real-time events (staff compliance change, license expiry, course completion).

```sql
-- Required migration: 046_webhook_management.sql
CREATE TABLE webhook_endpoints (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  url             text NOT NULL,
  secret          text NOT NULL,  -- HMAC signing key
  events          text[] NOT NULL,  -- ['staff.compliance_changed', 'license.expiring']
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE webhook_deliveries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id     uuid NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  event_type      text NOT NULL,
  payload         jsonb NOT NULL,
  status          text NOT NULL DEFAULT 'pending',
  response_status integer,
  attempts        integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);
```

---

### ✅ RESOLVED — Missing Indexes (migration 047 applied)

| Table | Missing Index | Impact |
|-------|--------------|--------|
| `cme_activities` | `(professional_id, activity_date DESC)` | Dashboard queries scan all activities by wallet |
| `cme_activities` | `(verification_status)` | Admin verification queue full-table scans |
| `employer_link_requests` | `(organization_id, status)` | Employer dashboard slow at 500+ staff |
| `professional_profiles` | `(country_of_residence)` | Admin analytics by country full-table scans |
| `subscriptions` | `(plan, status)` | Revenue analytics queries |
| `audit_logs` | `(actor_auth_id, created_at DESC)` | Admin per-user audit log views |
| `cme_wallets` | `(compliance_status)` | Employer compliance heatmap queries |
| `professional_licenses` | `(country_code, expiry_date)` | License expiry cron |

```sql
-- Required migration: 047_performance_indexes.sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cme_activities_professional_date
  ON cme_activities (professional_id, activity_date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cme_activities_verification
  ON cme_activities (verification_status) WHERE verification_status = 'pending';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employer_link_requests_org_status
  ON employer_link_requests (organization_id, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_professional_profiles_country
  ON professional_profiles (country_of_residence);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_plan_status
  ON subscriptions (plan, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_actor_date
  ON audit_logs (actor_auth_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cme_wallets_compliance
  ON cme_wallets (compliance_status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_professional_licenses_expiry
  ON professional_licenses (country_code, expiry_date);
```

---

### ✅ RESOLVED — RLS Policy Gaps (migration 048 applied)

| Table | Gap | Risk |
|-------|-----|------|
| `cme_activities` | No employer read policy — employers cannot view staff CME even when `employer_link_requests.status = 'approved'` AND privacy allows it | Employer dashboard relies on admin client workaround |
| `professional_profiles` | No employer read policy — same issue | Employer staff directory bypasses RLS |
| `push_subscriptions` | Only owner can read/write — no admin policy for broadcast | Admin broadcast uses service role; fine for now |

The employer-read workaround using `createAdminClient()` works but bypasses RLS. A proper multi-tenant RLS policy should be added:

```sql
-- Required: employer read policy on cme_activities
CREATE POLICY "employer reads approved staff activities"
ON cme_activities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM employer_link_requests elr
    JOIN organization_members om ON om.organization_id = elr.organization_id
    JOIN profile_privacy_settings pps ON pps.professional_id = cme_activities.professional_id
    WHERE elr.professional_id = cme_activities.professional_id
      AND elr.status = 'approved'
      AND om.auth_id = auth.uid()
      AND om.role = 'employer_admin'
      AND pps.employer_can_view_detailed_cme_activities = true
  )
);
```

---

### Schema Improvements Status (migrations 058–062 applied)

| Issue | Table | Status |
|-------|-------|--------|
| `professional_profiles.license_number` | single text field | ⚠️ OPEN — legacy field is the primary license from onboarding; `professional_licenses` (040) holds additional licenses. Both crons + HRIS endpoints check both sources. No migration needed. |
| `organizations.type` enum | was 6 values | ✅ DONE (058) — added `government`, `regulatory_body`, `ngo` |
| `subscriptions.plan` constraint | was `free/pro/employer` | ✅ DONE (058) — added `university`, `government` |
| `cme_activities` accreditor | missing column | ✅ DONE (058) — `accreditor text` column added |
| Account suspension fields | `professional_profiles` | ✅ DONE (059) — `is_suspended`, `suspended_at`, `suspended_reason` |
| Profile completion includes multi-license wallet | `professional_profiles` | ✅ DONE (060) — trigger now checks `professional_licenses` table for license credit |
| Phase 3 market rules | `country_compliance_rules` | ✅ DONE (061) — UK (GB), Australia (AU), India (IN) — 12 profession rules + 20 categories |
| `profile_privacy_settings` auto-create gap | trigger missing | ✅ DONE (062) — SECURITY DEFINER trigger fires on every `professional_profiles` INSERT; idempotent backfill for existing users |

---

### Migrations 059–062 Summary

| Migration | Description | Tables Affected |
|-----------|-------------|----------------|
| 059 | Account suspension | `professional_profiles` — 3 columns + index |
| 060 | Profile completion fix | Rewrites `compute_profile_completion_pct()` to check `professional_licenses`; cross-table trigger on license INSERT/DELETE |
| 061 | UK / AU / IN compliance rules | `country_compliance_rules` (12 rows), `compliance_activity_categories` (20 rows) |
| 062 | Privacy settings auto-create | New SECURITY DEFINER trigger + backfill; fixes employer RLS gap for users who never reached onboarding Step 6 |

---

## Scalability Assessment

| Scale | Assessment |
|-------|------------|
| 100 users | ✅ Current schema handles comfortably |
| 1,000 users | ✅ No changes needed |
| 10,000 users | ⚠️ Add missing indexes (migration 047) |
| 100,000 users | ⚠️ Partition `audit_logs` by month; partition `cme_activities` by year |
| 1,000,000 users | 🔴 Requires: table partitioning, read replicas, pgBouncer connection pooling, row sharding for `audit_logs` |

### Partitioning Plan (100K+ users)

```sql
-- audit_logs: partition by month (append-only, high volume)
-- Requires pg_partman or manual range partitions

-- cme_activities: partition by created_at year
-- Professional_id index remains on parent table
```

---

## Migration Status — All 58 Applied

| Migration | Description | Status |
|-----------|-------------|--------|
| 041–058 | See individual migration files | ✅ ALL DONE |

**Remaining open item (not yet a migration):**
- `professional_profiles.license_number` deprecation — legacy field should be soft-deprecated once all reads go through `professional_licenses` (migration 040). No data loss risk; no rush.


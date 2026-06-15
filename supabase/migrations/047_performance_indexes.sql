-- ════════════════════════════════════════════════════════════
-- MIGRATION 047: Performance Indexes
-- 8 missing indexes identified in schema audit.
-- All use CONCURRENTLY to avoid locking production tables.
-- Required at 10K+ users; safe to run now.
-- ════════════════════════════════════════════════════════════

-- Dashboard queries: professional's activities ordered by date
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cme_activities_professional_date
  ON cme_activities (professional_id, activity_date DESC);

-- Admin verification queue: filter pending without full table scan
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cme_activities_verification_status
  ON cme_activities (verification_status)
  WHERE verification_status = 'pending';

-- Employer dashboard: staff link status lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employer_link_requests_org_status
  ON employer_link_requests (organization_id, status);

-- Admin analytics: breakdown by country of residence
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_professional_profiles_country
  ON professional_profiles (country_of_residence);

-- Revenue analytics: plan/status counts
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_plan_status
  ON subscriptions (plan, status);

-- Admin per-user audit log view (actor + date range)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_actor_date
  ON audit_logs (actor_auth_id, created_at DESC);

-- Employer compliance heatmap: filter by status
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cme_wallets_compliance_status
  ON cme_wallets (compliance_status);

-- License expiry cron: scan upcoming expiries by country
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_professional_licenses_country_expiry
  ON professional_licenses (country_code, expiry_date)
  WHERE expiry_date IS NOT NULL;

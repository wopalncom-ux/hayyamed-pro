-- ════════════════════════════════════════════════════════════
-- MIGRATION 071: Missing FK Indexes
-- Five high-traffic FK columns on core tables (001) that
-- predate the indexing discipline introduced in migration 047.
-- All use CONCURRENTLY — no table locks on production.
-- ════════════════════════════════════════════════════════════

-- cme_activities: wallet_id is the primary join for wallet → activities
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cme_activities_wallet_id
  ON cme_activities (wallet_id);

-- employer_link_requests: professional_id looked up in professional dashboard
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employer_link_requests_professional_id
  ON employer_link_requests (professional_id);

-- organization_members: both FKs queried heavily in employer + admin paths
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_organization_members_auth_id
  ON organization_members (auth_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_organization_members_organization_id
  ON organization_members (organization_id);

-- professional_profiles: licensing_authority_id FK added in migration 002
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_professional_profiles_licensing_authority_id
  ON professional_profiles (licensing_authority_id)
  WHERE licensing_authority_id IS NOT NULL;

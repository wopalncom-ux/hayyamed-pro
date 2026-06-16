-- ════════════════════════════════════════════════════════════
-- MIGRATION 055: Organization Compliance Snapshots
-- Daily point-in-time compliance state per organization.
-- Populated by /api/cron/compliance-snapshot (daily 23:30 GST).
-- Enables 30-day trend reporting in the employer analytics page.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS organization_compliance_snapshots (
  id               uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid    NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  snapshot_date    date    NOT NULL,
  total_staff      integer NOT NULL DEFAULT 0,
  compliant        integer NOT NULL DEFAULT 0,
  at_risk          integer NOT NULL DEFAULT 0,
  non_compliant    integer NOT NULL DEFAULT 0,
  unknown          integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_org_compliance_snapshots_org_date
  ON organization_compliance_snapshots (organization_id, snapshot_date DESC);

ALTER TABLE organization_compliance_snapshots ENABLE ROW LEVEL SECURITY;

-- Employer admins can read their own org's snapshots
DROP POLICY IF EXISTS "employer reads own snapshots" ON organization_compliance_snapshots;
CREATE POLICY "employer reads own snapshots" ON organization_compliance_snapshots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND organization_id = organization_compliance_snapshots.organization_id
         AND role = 'employer_admin'
    )
  );

-- Platform admins can read all snapshots
DROP POLICY IF EXISTS "admin reads all snapshots" ON organization_compliance_snapshots;
CREATE POLICY "admin reads all snapshots" ON organization_compliance_snapshots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND role IN ('master_admin', 'super_admin')
    )
  );

-- No direct INSERT/UPDATE/DELETE from client — cron uses service role only

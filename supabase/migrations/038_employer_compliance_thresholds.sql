-- Employer Compliance Alert Thresholds
-- One row per organization; when enabled, the compliance-alerts cron
-- emails the alert_email address if any staff member's compliance % < threshold_pct.
CREATE TABLE IF NOT EXISTS employer_compliance_thresholds (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  threshold_pct   smallint    NOT NULL DEFAULT 80
                  CHECK (threshold_pct BETWEEN 0 AND 100),
  alert_email     text        NOT NULL,
  enabled         boolean     NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id)
);

CREATE INDEX IF NOT EXISTS idx_compliance_thresholds_org ON employer_compliance_thresholds (organization_id);

CREATE OR REPLACE FUNCTION compliance_thresholds_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS compliance_thresholds_updated_at ON employer_compliance_thresholds;
CREATE TRIGGER compliance_thresholds_updated_at
  BEFORE UPDATE ON employer_compliance_thresholds
  FOR EACH ROW EXECUTE FUNCTION compliance_thresholds_set_updated_at();

-- RLS: employer admins can read and write their own org's threshold
ALTER TABLE employer_compliance_thresholds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "employer admin manages own threshold" ON employer_compliance_thresholds;
CREATE POLICY "employer admin manages own threshold" ON employer_compliance_thresholds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND organization_id = employer_compliance_thresholds.organization_id
        AND role = 'employer_admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND organization_id = employer_compliance_thresholds.organization_id
        AND role = 'employer_admin'
    )
  );

DROP POLICY IF EXISTS "admin reads all thresholds" ON employer_compliance_thresholds;
CREATE POLICY "admin reads all thresholds" ON employer_compliance_thresholds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

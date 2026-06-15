-- ════════════════════════════════════════════════════════════
-- MIGRATION 040: Multi-License Wallet
-- Allows professionals to track multiple GCC licenses simultaneously.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS professional_licenses (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  license_number      text        NOT NULL,
  licensing_authority text        NOT NULL,
  country_code        text        NOT NULL DEFAULT 'QA',
  profession          text,
  specialty           text,
  issue_date          date,
  expiry_date         date,
  notes               text,
  is_primary          boolean     NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pro_licenses_professional ON professional_licenses (professional_id);
CREATE INDEX IF NOT EXISTS idx_pro_licenses_expiry       ON professional_licenses (expiry_date);

-- Updated-at trigger
CREATE OR REPLACE FUNCTION pro_licenses_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS pro_licenses_updated_at ON professional_licenses;
CREATE TRIGGER pro_licenses_updated_at
  BEFORE UPDATE ON professional_licenses
  FOR EACH ROW EXECUTE FUNCTION pro_licenses_set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE professional_licenses ENABLE ROW LEVEL SECURITY;

-- Professional manages their own licenses
DROP POLICY IF EXISTS "professional manages own licenses" ON professional_licenses;
CREATE POLICY "professional manages own licenses" ON professional_licenses
  FOR ALL
  USING  (auth.uid() = professional_id)
  WITH CHECK (auth.uid() = professional_id);

-- Employer admins can read linked staff licenses (for compliance verification)
DROP POLICY IF EXISTS "employer reads linked staff licenses" ON professional_licenses;
CREATE POLICY "employer reads linked staff licenses" ON professional_licenses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
        FROM employer_link_requests elr
        JOIN organization_members   om  ON om.organization_id = elr.organization_id
       WHERE elr.professional_id = professional_licenses.professional_id
         AND elr.status          = 'approved'
         AND om.auth_id          = auth.uid()
         AND om.role             = 'employer_admin'
    )
  );

-- Admins read all
DROP POLICY IF EXISTS "admin reads all licenses" ON professional_licenses;
CREATE POLICY "admin reads all licenses" ON professional_licenses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND role IN ('master_admin', 'super_admin')
    )
  );

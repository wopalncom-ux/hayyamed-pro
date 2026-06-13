-- 018_partners.sql
-- Platform partners: accreditors, hospitals, universities, technology partners
-- Shown on landing page and in professional dashboard (when linked to their org)

CREATE TABLE IF NOT EXISTS partners (
  id               uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  name             text    NOT NULL,
  logo_url         text,
  website_url      text,
  country_code     text,
  -- 'accreditor' | 'employer' | 'technology' | 'government' | 'hospital' | 'university'
  partner_type     text    CHECK (partner_type IN ('accreditor','employer','technology','government','hospital','university')),
  -- optional link to an organization record
  organization_id  uuid    REFERENCES organizations(id) ON DELETE SET NULL,
  display_order    integer NOT NULL DEFAULT 0,
  is_active        boolean NOT NULL DEFAULT true,
  show_on_landing  boolean NOT NULL DEFAULT true,
  show_on_dashboard boolean NOT NULL DEFAULT true,
  tagline          text,   -- short one-liner shown on landing page
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partners_active ON partners (display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_partners_org ON partners (organization_id) WHERE organization_id IS NOT NULL;

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manage partners" ON partners;
CREATE POLICY "Admin manage partners" ON partners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Public read active partners" ON partners;
CREATE POLICY "Public read active partners" ON partners
  FOR SELECT USING (is_active = true);

CREATE OR REPLACE FUNCTION set_partners_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_partners_updated_at ON partners;
CREATE TRIGGER trg_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION set_partners_updated_at();

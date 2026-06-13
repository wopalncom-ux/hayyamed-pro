-- 016_platform_settings.sql
-- Admin-configurable platform settings: pricing, limits, feature flags
-- All prices stored as text to avoid float precision issues; cast to numeric at read time

CREATE TABLE IF NOT EXISTS platform_settings (
  key         text PRIMARY KEY,
  value       text NOT NULL,
  description text,
  updated_at  timestamptz DEFAULT now(),
  updated_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- RLS: only master_admin / super_admin can write; anyone authenticated can read
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin write platform_settings" ON platform_settings;
CREATE POLICY "Admin write platform_settings" ON platform_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Authenticated read platform_settings" ON platform_settings;
CREATE POLICY "Authenticated read platform_settings" ON platform_settings
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Default pricing values
INSERT INTO platform_settings (key, value, description) VALUES
  -- Pro individual
  ('pro_price_monthly',           '6.00',    'Pro plan monthly price (USD)'),
  ('pro_price_annual',            '61.20',   'Pro plan annual price (USD) — 15% off $72'),
  ('pro_annual_discount_pct',     '15',      'Annual discount % shown on Pro plan'),

  -- Employer tiers
  ('employer_clinic_monthly',     '50.00',   'Employer Clinic tier — monthly (USD)'),
  ('employer_clinic_annual',      '510.00',  'Employer Clinic tier — annual (USD)'),
  ('employer_clinic_max_staff',   '10',      'Employer Clinic tier — max staff seats'),

  ('employer_growth_monthly',     '100.00',  'Employer Growth tier — monthly (USD)'),
  ('employer_growth_annual',      '1020.00', 'Employer Growth tier — annual (USD)'),
  ('employer_growth_max_staff',   '25',      'Employer Growth tier — max staff seats'),

  ('employer_dept_monthly',       '180.00',  'Employer Department tier — monthly (USD)'),
  ('employer_dept_annual',        '1836.00', 'Employer Department tier — annual (USD)'),
  ('employer_dept_max_staff',     '50',      'Employer Department tier — max staff seats'),

  ('employer_hospital_monthly',   '350.00',  'Employer Hospital tier — monthly (USD)'),
  ('employer_hospital_annual',    '3570.00', 'Employer Hospital tier — annual (USD)'),
  ('employer_hospital_max_staff', '200',     'Employer Hospital tier — max staff seats'),

  ('employer_annual_discount_pct','15',      'Annual discount % shown on all Employer plans'),

  -- Free tier limits
  ('free_cme_activity_limit',     '10',      'Max CME activities for Free plan'),
  ('free_license_limit',          '1',       'Max licenses for Free plan')

ON CONFLICT (key) DO NOTHING;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION set_platform_settings_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_platform_settings_updated_at ON platform_settings;
CREATE TRIGGER trg_platform_settings_updated_at
  BEFORE UPDATE ON platform_settings
  FOR EACH ROW EXECUTE FUNCTION set_platform_settings_updated_at();

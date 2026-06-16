-- Migration 065: Government / Regulatory Body settings table
-- Stores per-authority configuration: jurisdiction country, authority code, profession scope.

CREATE TABLE IF NOT EXISTS public.government_settings (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  jurisdiction_country char(2) NOT NULL,
  authority_code      text,               -- e.g. QCHP, SCFHS, DHA, DOH, GMC, NMC
  authority_subtype   text NOT NULL DEFAULT 'national_authority',
  profession_scope    text[] NOT NULL DEFAULT '{}', -- empty = all professions
  license_renewal_url text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_government_settings_org
  ON public.government_settings(organization_id);

ALTER TABLE public.government_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "government_settings_admin_all" ON public.government_settings;
CREATE POLICY "government_settings_admin_all"
  ON public.government_settings
  FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE auth_id = auth.uid() AND role = 'government_admin'
    )
  );

DROP POLICY IF EXISTS "government_settings_service_all" ON public.government_settings;
CREATE POLICY "government_settings_service_all"
  ON public.government_settings FOR ALL TO service_role USING (true);

CREATE OR REPLACE TRIGGER set_updated_at_government_settings
  BEFORE UPDATE ON public.government_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

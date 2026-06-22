-- Migration 080: Organisation white-label branding
-- Adds brand_color, brand_logo_url, and brand_name_override to organizations
-- so employer/government accounts can apply custom branding to their dashboard views.
-- Values are optional — NULL means "use platform defaults".

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS brand_color        text
    CHECK (brand_color IS NULL OR brand_color ~ '^#[0-9a-fA-F]{6}$'),
  ADD COLUMN IF NOT EXISTS brand_logo_url     text,
  ADD COLUMN IF NOT EXISTS brand_name_override text,
  ADD COLUMN IF NOT EXISTS brand_email_from   text;

-- RLS: employer admins can read branding for their org (already covered by existing policy)
-- employer admins can UPDATE branding columns for their org

DROP POLICY IF EXISTS "employer_admin_update_branding" ON organizations;
CREATE POLICY "employer_admin_update_branding"
  ON organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
        AND organization_members.auth_id = auth.uid()
        AND organization_members.role = 'employer_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
        AND organization_members.auth_id = auth.uid()
        AND organization_members.role = 'employer_admin'
    )
  );

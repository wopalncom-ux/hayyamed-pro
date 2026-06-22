-- Migration 078: Changelog / Release Notes
CREATE TABLE IF NOT EXISTS changelog_entries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version      text NOT NULL,
  title        text NOT NULL,
  summary      text,
  items        jsonb NOT NULL DEFAULT '[]',
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE changelog_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage changelog" ON changelog_entries;
CREATE POLICY "Admins manage changelog" ON changelog_entries FOR ALL USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE auth_id = auth.uid() AND role IN ('master_admin', 'super_admin')
  )
);

DROP POLICY IF EXISTS "Users read published changelog" ON changelog_entries;
CREATE POLICY "Users read published changelog" ON changelog_entries FOR SELECT USING (
  auth.uid() IS NOT NULL AND is_published = true
);

CREATE INDEX IF NOT EXISTS idx_changelog_published ON changelog_entries (is_published, published_at DESC);

CREATE OR REPLACE FUNCTION update_changelog_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS trg_changelog_updated_at ON changelog_entries;
CREATE TRIGGER trg_changelog_updated_at
  BEFORE UPDATE ON changelog_entries
  FOR EACH ROW EXECUTE FUNCTION update_changelog_updated_at();

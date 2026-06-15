-- ════════════════════════════════════════════════════════════
-- MIGRATION 049: API Keys for HRIS / LMS Integrations
-- Employer admins generate API keys that external systems
-- (Workday, SAP, Oracle HCM, custom HIS) use to query
-- compliance data without browser-based auth sessions.
-- Full key shown once at creation; only SHA-256 hash stored.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS api_keys (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  key_prefix      text        NOT NULL,              -- first 12 chars of full key (shown in UI)
  key_hash        text        NOT NULL UNIQUE,       -- SHA-256 of full key (never stored in plain)
  scopes          text[]      NOT NULL DEFAULT '{}', -- ['read:staff', 'read:compliance']
  last_used_at    timestamptz,
  expires_at      timestamptz,
  is_active       boolean     NOT NULL DEFAULT true,
  created_by      uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_org      ON api_keys (organization_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_api_keys_hash     ON api_keys (key_hash) WHERE is_active = true;

CREATE OR REPLACE FUNCTION api_keys_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS api_keys_updated_at ON api_keys;
CREATE TRIGGER api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION api_keys_set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Employer admins manage their own org's keys
DROP POLICY IF EXISTS "employer admin manages api keys" ON api_keys;
CREATE POLICY "employer admin manages api keys" ON api_keys
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE organization_id = api_keys.organization_id
         AND auth_id = auth.uid()
         AND role = 'employer_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE organization_id = api_keys.organization_id
         AND auth_id = auth.uid()
         AND role = 'employer_admin'
    )
  );

-- Master admins read all keys
DROP POLICY IF EXISTS "admin reads all api keys" ON api_keys;
CREATE POLICY "admin reads all api keys" ON api_keys
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND role IN ('master_admin', 'super_admin')
    )
  );

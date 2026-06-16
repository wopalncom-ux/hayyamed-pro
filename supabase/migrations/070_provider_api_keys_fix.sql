-- ════════════════════════════════════════════════════════════
-- MIGRATION 070: Provider API Keys FK Fix
--
-- api_keys.organization_id references organizations(id) but the
-- provider API key route passed training_providers.id as organization_id
-- — a FK violation. Same root cause as the webhook_endpoints bug (069).
-- Solution: make organization_id nullable, add training_provider_id FK,
-- enforce that at least one owner column is set.
-- ════════════════════════════════════════════════════════════

ALTER TABLE api_keys
  ALTER COLUMN organization_id DROP NOT NULL;

ALTER TABLE api_keys
  ADD COLUMN IF NOT EXISTS training_provider_id uuid
    REFERENCES training_providers(id) ON DELETE CASCADE;

ALTER TABLE api_keys
  DROP CONSTRAINT IF EXISTS api_keys_has_owner;
ALTER TABLE api_keys
  ADD CONSTRAINT api_keys_has_owner CHECK (
    (organization_id IS NOT NULL) OR (training_provider_id IS NOT NULL)
  );

CREATE INDEX IF NOT EXISTS idx_api_keys_provider
  ON api_keys (training_provider_id)
  WHERE training_provider_id IS NOT NULL AND is_active = true;

-- RLS: training provider admin manages own API keys
DROP POLICY IF EXISTS "provider admin manages own api keys" ON api_keys;
CREATE POLICY "provider admin manages own api keys" ON api_keys
  FOR ALL
  USING (
    training_provider_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM training_providers tp
       WHERE tp.id = api_keys.training_provider_id
         AND tp.created_by = auth.uid()
         AND tp.status = 'active'
    )
  )
  WITH CHECK (
    training_provider_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM training_providers tp
       WHERE tp.id = api_keys.training_provider_id
         AND tp.created_by = auth.uid()
         AND tp.status = 'active'
    )
  );

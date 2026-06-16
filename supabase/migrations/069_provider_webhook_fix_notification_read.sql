-- ════════════════════════════════════════════════════════════
-- MIGRATION 069: Provider Webhook FK Fix + Notification Read Tracking
--
-- Fix 1: webhook_endpoints.organization_id was NOT NULL REFERENCES organizations(id).
--   Provider webhook routes passed training_providers.id as organization_id — a FK
--   violation because training_providers and organizations are separate tables.
--   Solution: make organization_id nullable, add training_provider_id column,
--   enforce that at least one owner column is set.
--
-- Fix 2: notification_queue had no read_at column. The inbox used status='sent'
--   as a proxy for "unread", making it impossible to mark notifications as read.
--   Solution: add read_at timestamptz; unread = read_at IS NULL AND status='sent'.
-- ════════════════════════════════════════════════════════════

-- ─── Part 1: webhook_endpoints provider FK ───────────────────────────────────

-- Make organization_id nullable so provider-only endpoints don't need an org entry
ALTER TABLE webhook_endpoints
  ALTER COLUMN organization_id DROP NOT NULL;

-- Add training_provider_id FK
ALTER TABLE webhook_endpoints
  ADD COLUMN IF NOT EXISTS training_provider_id uuid
    REFERENCES training_providers(id) ON DELETE CASCADE;

-- Ensure every endpoint has at least one owner
ALTER TABLE webhook_endpoints
  DROP CONSTRAINT IF EXISTS webhook_has_owner;
ALTER TABLE webhook_endpoints
  ADD CONSTRAINT webhook_has_owner CHECK (
    (organization_id IS NOT NULL) OR (training_provider_id IS NOT NULL)
  );

-- Index for fast provider webhook lookups
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_provider
  ON webhook_endpoints (training_provider_id)
  WHERE training_provider_id IS NOT NULL AND is_active = true;

-- RLS: training provider admin manages own webhooks (via training_providers.created_by)
DROP POLICY IF EXISTS "provider admin manages own webhooks" ON webhook_endpoints;
CREATE POLICY "provider admin manages own webhooks" ON webhook_endpoints
  FOR ALL
  USING (
    training_provider_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM training_providers tp
       WHERE tp.id = webhook_endpoints.training_provider_id
         AND tp.created_by = auth.uid()
         AND tp.status = 'active'
    )
  )
  WITH CHECK (
    training_provider_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM training_providers tp
       WHERE tp.id = webhook_endpoints.training_provider_id
         AND tp.created_by = auth.uid()
         AND tp.status = 'active'
    )
  );

-- RLS: provider admin reads their own deliveries
DROP POLICY IF EXISTS "provider admin reads own deliveries" ON webhook_deliveries;
CREATE POLICY "provider admin reads own deliveries" ON webhook_deliveries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
        FROM webhook_endpoints we
        JOIN training_providers tp ON tp.id = we.training_provider_id
       WHERE we.id = webhook_deliveries.endpoint_id
         AND tp.created_by = auth.uid()
         AND tp.status = 'active'
    )
  );

-- ─── Part 2: notification_queue read tracking ────────────────────────────────

ALTER TABLE notification_queue
  ADD COLUMN IF NOT EXISTS read_at timestamptz;

-- Fast unread count per user
CREATE INDEX IF NOT EXISTS idx_notification_queue_unread
  ON notification_queue (professional_id, created_at DESC)
  WHERE read_at IS NULL;

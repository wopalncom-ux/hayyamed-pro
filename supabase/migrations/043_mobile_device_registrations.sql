-- ════════════════════════════════════════════════════════════
-- MIGRATION 043: Mobile Device Registrations
-- Stores FCM (Android) and APNs (iOS) device tokens for
-- React Native push notification dispatch.
-- Separate from push_subscriptions which is Web Push / VAPID only.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS mobile_device_registrations (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_token    text        NOT NULL,
  platform        text        NOT NULL CHECK (platform IN ('ios', 'android')),
  app_version     text,
  os_version      text,
  device_model    text,
  is_active       boolean     NOT NULL DEFAULT true,
  last_active_at  timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (professional_id, device_token)
);

CREATE INDEX IF NOT EXISTS idx_mobile_devices_professional ON mobile_device_registrations (professional_id);
CREATE INDEX IF NOT EXISTS idx_mobile_devices_active       ON mobile_device_registrations (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_mobile_devices_platform     ON mobile_device_registrations (platform);

CREATE OR REPLACE FUNCTION mobile_devices_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS mobile_devices_updated_at ON mobile_device_registrations;
CREATE TRIGGER mobile_devices_updated_at
  BEFORE UPDATE ON mobile_device_registrations
  FOR EACH ROW EXECUTE FUNCTION mobile_devices_set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE mobile_device_registrations ENABLE ROW LEVEL SECURITY;

-- Professional manages their own device tokens
DROP POLICY IF EXISTS "professional manages own devices" ON mobile_device_registrations;
CREATE POLICY "professional manages own devices" ON mobile_device_registrations
  FOR ALL
  USING  (auth.uid() = professional_id)
  WITH CHECK (auth.uid() = professional_id);

-- Admins read all (for broadcast push dispatch)
DROP POLICY IF EXISTS "admin reads all device registrations" ON mobile_device_registrations;
CREATE POLICY "admin reads all device registrations" ON mobile_device_registrations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND role IN ('master_admin', 'super_admin')
    )
  );

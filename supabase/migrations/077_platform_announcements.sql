-- Migration 077: Platform Announcements
-- Admin-managed banners shown in the user dashboard

CREATE TABLE IF NOT EXISTS platform_announcements (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  message        text NOT NULL,
  type           text NOT NULL DEFAULT 'info'
                   CHECK (type IN ('info', 'warning', 'success', 'error')),
  target_audience text NOT NULL DEFAULT 'all'
                   CHECK (target_audience IN ('all', 'pro', 'free', 'employer')),
  is_active      boolean NOT NULL DEFAULT true,
  dismissible    boolean NOT NULL DEFAULT true,
  cta_label      text,
  cta_url        text,
  starts_at      timestamptz NOT NULL DEFAULT now(),
  ends_at        timestamptz,
  created_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE platform_announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage announcements" ON platform_announcements;
CREATE POLICY "Admins manage announcements" ON platform_announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid() AND role IN ('master_admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Authenticated users read active announcements" ON platform_announcements;
CREATE POLICY "Authenticated users read active announcements" ON platform_announcements
  FOR SELECT USING (
    auth.uid() IS NOT NULL
    AND is_active = true
    AND starts_at <= now()
    AND (ends_at IS NULL OR ends_at >= now())
  );

CREATE INDEX IF NOT EXISTS idx_announcements_active_dates
  ON platform_announcements (is_active, starts_at, ends_at);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_announcements_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_announcements_updated_at ON platform_announcements;
CREATE TRIGGER trg_announcements_updated_at
  BEFORE UPDATE ON platform_announcements
  FOR EACH ROW EXECUTE FUNCTION update_announcements_updated_at();

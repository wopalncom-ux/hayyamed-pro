-- Migration 033: onboarding drip email log
-- Tracks which drip-sequence emails have been delivered to each user.
-- UNIQUE (user_id, sequence_day) prevents double-sends across cron runs.

CREATE TABLE IF NOT EXISTS drip_email_log (
  id              uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sequence_day    integer     NOT NULL,
  sent_at         timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, sequence_day)
);

CREATE INDEX IF NOT EXISTS idx_drip_email_log_user_id ON drip_email_log(user_id);
CREATE INDEX IF NOT EXISTS idx_drip_email_log_sent_at  ON drip_email_log(sent_at);

CREATE OR REPLACE TRIGGER drip_email_log_updated_at
  BEFORE UPDATE ON drip_email_log
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE drip_email_log ENABLE ROW LEVEL SECURITY;

-- Admins can read send history for analytics / debugging
DROP POLICY IF EXISTS "drip_email_log_admin_select" ON drip_email_log;
CREATE POLICY "drip_email_log_admin_select"
  ON drip_email_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

-- Inserts are done exclusively by cron (service role) — no user-facing policy needed

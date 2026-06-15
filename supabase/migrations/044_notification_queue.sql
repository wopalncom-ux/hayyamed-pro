-- ════════════════════════════════════════════════════════════
-- MIGRATION 044: Notification Queue
-- Reliable delivery queue for email, push, and SMS.
-- Enables retry logic, deduplication, and delivery auditing.
-- Prevents silent notification loss when Postmark is down
-- or cron jobs fail mid-batch.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS notification_queue (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid        REFERENCES auth.users(id) ON DELETE CASCADE,
  channel         text        NOT NULL CHECK (channel IN ('email', 'push', 'sms')),
  template_id     text        NOT NULL,    -- e.g. 'cme_deadline_reminder', 'license_expiry_30d'
  payload         jsonb       NOT NULL,    -- template variables (to_email, to_name, etc.)
  status          text        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  attempts        integer     NOT NULL DEFAULT 0,
  max_attempts    integer     NOT NULL DEFAULT 3,
  scheduled_at    timestamptz NOT NULL DEFAULT now(),
  sent_at         timestamptz,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Partial index for the cron job: only scan pending items due now
CREATE INDEX IF NOT EXISTS idx_notification_queue_pending
  ON notification_queue (scheduled_at)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_notification_queue_professional
  ON notification_queue (professional_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notification_queue_template
  ON notification_queue (template_id, status);

CREATE OR REPLACE FUNCTION notification_queue_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notification_queue_updated_at ON notification_queue;
CREATE TRIGGER notification_queue_updated_at
  BEFORE UPDATE ON notification_queue
  FOR EACH ROW EXECUTE FUNCTION notification_queue_set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

-- No direct user access — queue is managed exclusively by service role (cron jobs)
DROP POLICY IF EXISTS "no direct access to notification_queue" ON notification_queue;
CREATE POLICY "no direct access to notification_queue" ON notification_queue
  FOR ALL
  USING (false);

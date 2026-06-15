-- ════════════════════════════════════════════════════════════
-- MIGRATION 053: Notification Queue Retry Column
-- Adds next_retry_at to notification_queue to enable
-- exponential backoff between retry attempts.
-- Without this column, the process-notifications cron retries
-- every run without any delay, causing burst sends on failure.
-- ════════════════════════════════════════════════════════════

ALTER TABLE notification_queue
  ADD COLUMN IF NOT EXISTS next_retry_at timestamptz;

-- Replace partial index to include next_retry_at for efficient cron queries
DROP INDEX IF EXISTS idx_notification_queue_pending;
CREATE INDEX IF NOT EXISTS idx_notification_queue_pending
  ON notification_queue (scheduled_at, next_retry_at)
  WHERE status = 'pending';

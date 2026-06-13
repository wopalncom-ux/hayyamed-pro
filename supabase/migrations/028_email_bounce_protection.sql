-- Migration 028: Email bounce and spam protection
-- Tracks hard bounces and spam reports from Postmark webhooks.
-- Emails to bounced/spam-reported addresses are suppressed automatically.

ALTER TABLE professional_profiles
  ADD COLUMN IF NOT EXISTS email_hard_bounced  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_spam_reported boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN professional_profiles.email_hard_bounced  IS 'True when Postmark reports a hard bounce — all transactional emails suppressed';
COMMENT ON COLUMN professional_profiles.email_spam_reported IS 'True when Postmark reports a spam complaint — all transactional emails suppressed';

-- Index for fast webhook lookup by email address
CREATE INDEX IF NOT EXISTS idx_professional_profiles_email
  ON professional_profiles (email);

-- ── migration 022: email notification preferences ───────────────────────────
-- Adds per-user opt-out flags for each transactional email category.
-- All default to true so existing users receive emails unchanged.
-- Cron routes and admin actions check these flags before sending.

ALTER TABLE professional_profiles
  ADD COLUMN IF NOT EXISTS email_cme_verified   boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_cme_deadline   boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_license_expiry boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_trial_reminders boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_employer_tasks boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN professional_profiles.email_cme_verified    IS 'Receive email when a CME activity is verified or rejected';
COMMENT ON COLUMN professional_profiles.email_cme_deadline    IS 'Receive CME cycle deadline reminder emails';
COMMENT ON COLUMN professional_profiles.email_license_expiry  IS 'Receive license expiry countdown emails';
COMMENT ON COLUMN professional_profiles.email_trial_reminders IS 'Receive Pro trial ending soon and expired emails';
COMMENT ON COLUMN professional_profiles.email_employer_tasks  IS 'Receive emails when an employer assigns a compliance task';

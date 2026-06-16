-- ════════════════════════════════════════════════════════════
-- MIGRATION 068: Public Directory Opt-In
-- Adds public_directory_opt_in boolean to profile_privacy_settings.
-- Default FALSE — professionals must explicitly opt in.
-- Powers /professionals public discovery page.
-- Privacy-by-design: no PII exposed without consent.
-- ════════════════════════════════════════════════════════════

ALTER TABLE profile_privacy_settings
  ADD COLUMN IF NOT EXISTS public_directory_opt_in boolean NOT NULL DEFAULT false;

-- Index for the public directory query: only scan opted-in rows
CREATE INDEX IF NOT EXISTS idx_privacy_public_directory
  ON profile_privacy_settings (public_directory_opt_in)
  WHERE public_directory_opt_in = true;

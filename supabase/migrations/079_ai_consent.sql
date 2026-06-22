-- Migration 079: Add explicit AI data consent to profile_privacy_settings
-- Required by Qatar PDPL and GDPR Art. 6(1)(a) for AI processing of professional data
-- Default FALSE — users must opt in explicitly during onboarding Step 6

ALTER TABLE profile_privacy_settings
  ADD COLUMN IF NOT EXISTS ai_data_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_data_consent_at timestamptz;

COMMENT ON COLUMN profile_privacy_settings.ai_data_consent IS 'Explicit consent for AI analysis of professional compliance data (PDPL/GDPR Art. 6(1)(a))';
COMMENT ON COLUMN profile_privacy_settings.ai_data_consent_at IS 'Timestamp when consent was last given or withdrawn';

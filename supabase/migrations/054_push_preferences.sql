-- Migration 054: Per-category push notification preferences on professional_profiles

ALTER TABLE professional_profiles
  ADD COLUMN IF NOT EXISTS push_license_expiry     boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS push_cme_deadline       boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS push_employer_tasks     boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS push_compliance_alerts  boolean NOT NULL DEFAULT true;

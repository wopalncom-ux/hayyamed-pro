-- 014_timestamp_standards.sql
-- Adds missing created_at / updated_at columns to tables that were created without them.
-- DATABASE_STANDARDS.md: "Every table has id uuid, created_at timestamptz, updated_at timestamptz"
-- Note: employer_link_requests uses requested_at (semantic equivalent of created_at — left intact)
--       course_enrollments uses enrolled_at (semantic equivalent of created_at — left intact)
-- Run after 013_schema_standards.sql.

-- ── created_at additions ─────────────────────────────────────────────────────

ALTER TABLE professions
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE specialties
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE profile_privacy_settings
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE cme_wallets
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- ── updated_at additions + triggers ──────────────────────────────────────────

ALTER TABLE organization_members
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS organization_members_updated_at ON organization_members;
CREATE TRIGGER organization_members_updated_at
  BEFORE UPDATE ON organization_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE employer_link_requests
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS employer_link_requests_updated_at ON employer_link_requests;
CREATE TRIGGER employer_link_requests_updated_at
  BEFORE UPDATE ON employer_link_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE cme_activities
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS cme_activities_updated_at ON cme_activities;
CREATE TRIGGER cme_activities_updated_at
  BEFORE UPDATE ON cme_activities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE course_enrollments
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS course_enrollments_updated_at ON course_enrollments;
CREATE TRIGGER course_enrollments_updated_at
  BEFORE UPDATE ON course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

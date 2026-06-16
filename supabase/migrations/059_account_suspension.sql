-- ============================================================
-- Migration 059 — Account Suspension Fields
-- Allows admins to suspend accounts without permanent deletion.
-- Supabase auth ban_duration handles session invalidation;
-- these columns store the reason and timestamp for audit purposes.
-- ============================================================

ALTER TABLE professional_profiles
  ADD COLUMN IF NOT EXISTS is_suspended    boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS suspended_at    timestamptz,
  ADD COLUMN IF NOT EXISTS suspended_reason text;

-- Partial index — only indexes suspended accounts (small, cheap)
CREATE INDEX IF NOT EXISTS idx_professional_profiles_suspended
  ON professional_profiles (is_suspended) WHERE is_suspended = true;

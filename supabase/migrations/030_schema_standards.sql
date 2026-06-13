-- ============================================================
-- MIGRATION 030 — Schema Standards: licensing_authorities updated_at
-- Adds missing updated_at column and trigger to the only table
-- that was missing them. Idempotent.
-- ============================================================

ALTER TABLE licensing_authorities
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS licensing_authorities_updated_at ON licensing_authorities;
CREATE TRIGGER licensing_authorities_updated_at
  BEFORE UPDATE ON licensing_authorities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

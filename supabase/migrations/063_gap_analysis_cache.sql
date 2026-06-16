-- Migration 063: Gap Analysis Cache
--
-- POST /api/ai/gap-analysis hits claude-sonnet-4-6 ($0.018/call) on every request
-- with no result persistence. Learning pathways (migration 050) already use a cache
-- table. This migration adds the equivalent for gap analysis.
--
-- Cache key: professional_id + completed_credits (invalidates automatically when
-- credits change). TTL: 24 hours (controlled by expires_at). is_current = false
-- marks superseded rows without deleting them (soft history for debugging).
--
-- All writes are via service role (admin client in route handler) — no INSERT/UPDATE
-- policies for users. SELECT policy lets professionals read their own cached results
-- directly if needed (e.g. mobile GET endpoint in future).

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gap_analysis_cache (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id  uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country          text        NOT NULL,
  profession       text        NOT NULL,
  completed_credits numeric    NOT NULL,
  result_json      jsonb       NOT NULL,
  model            text        NOT NULL DEFAULT 'claude-sonnet-4-6',
  is_current       boolean     NOT NULL DEFAULT true,
  expires_at       timestamptz NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE gap_analysis_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner reads own gap_analysis_cache" ON gap_analysis_cache;
CREATE POLICY "owner reads own gap_analysis_cache"
  ON gap_analysis_cache FOR SELECT
  USING (auth.uid() = professional_id);

-- No INSERT/UPDATE/DELETE policies — service role only via createAdminClient()

-- ─────────────────────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_gap_analysis_cache_lookup
  ON gap_analysis_cache (professional_id, is_current, expires_at)
  WHERE is_current = true;

-- ─────────────────────────────────────────────────────────────────────────────
-- updated_at trigger
-- ─────────────────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS set_gap_analysis_cache_updated_at ON gap_analysis_cache;
CREATE TRIGGER set_gap_analysis_cache_updated_at
  BEFORE UPDATE ON gap_analysis_cache
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

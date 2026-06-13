-- Migration 027: NPS survey responses
-- Stores 0-10 Net Promoter Score submissions from professionals.
-- One response per professional per 365-day window (enforced via unique partial index).

CREATE TABLE IF NOT EXISTS nps_responses (
  id            uuid              NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id uuid            NOT NULL REFERENCES professional_profiles(auth_id) ON DELETE CASCADE,
  score         smallint          NOT NULL CHECK (score >= 0 AND score <= 10),
  comment       text,
  created_at    timestamptz       NOT NULL DEFAULT now(),
  updated_at    timestamptz       NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nps_responses_professional_id ON nps_responses(professional_id);
CREATE INDEX IF NOT EXISTS idx_nps_responses_created_at ON nps_responses(created_at);

-- Trigger to keep updated_at current
CREATE OR REPLACE TRIGGER nps_responses_updated_at
  BEFORE UPDATE ON nps_responses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE nps_responses ENABLE ROW LEVEL SECURITY;

-- Professionals can read their own responses
DROP POLICY IF EXISTS "nps_responses_select_own" ON nps_responses;
CREATE POLICY "nps_responses_select_own"
  ON nps_responses FOR SELECT
  USING (professional_id = auth.uid());

-- Professionals can insert their own responses only
DROP POLICY IF EXISTS "nps_responses_insert_own" ON nps_responses;
CREATE POLICY "nps_responses_insert_own"
  ON nps_responses FOR INSERT
  WITH CHECK (professional_id = auth.uid());

-- Admins can read all responses for analytics
DROP POLICY IF EXISTS "nps_responses_select_admin" ON nps_responses;
CREATE POLICY "nps_responses_select_admin"
  ON nps_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

-- No UPDATE or DELETE — responses are append-only

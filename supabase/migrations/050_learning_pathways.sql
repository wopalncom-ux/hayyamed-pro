-- ════════════════════════════════════════════════════════════
-- MIGRATION 050: AI Learning Pathway Storage
-- Stores generated 12-month CME pathways so professionals
-- can revisit without re-calling the AI on every page load.
-- Only the latest pathway per professional + country is
-- marked is_current = true; old ones retained for history.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS learning_pathways (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country         text        NOT NULL,
  profession      text        NOT NULL,
  model           text        NOT NULL DEFAULT 'claude-sonnet-4-6',
  prompt_version  text        NOT NULL DEFAULT 'v1',
  pathway_json    jsonb       NOT NULL,
  credits_gap     numeric(5,1),
  cycle_end_date  date,
  is_current      boolean     NOT NULL DEFAULT true,
  generated_at    timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_learning_pathways_professional
  ON learning_pathways (professional_id, generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_pathways_current
  ON learning_pathways (professional_id, country)
  WHERE is_current = true;

CREATE OR REPLACE FUNCTION learning_pathways_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS learning_pathways_updated_at ON learning_pathways;
CREATE TRIGGER learning_pathways_updated_at
  BEFORE UPDATE ON learning_pathways
  FOR EACH ROW EXECUTE FUNCTION learning_pathways_set_updated_at();

-- When a new pathway is inserted, mark all previous pathways
-- for this professional + country as not current.
CREATE OR REPLACE FUNCTION mark_previous_pathways_stale()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE learning_pathways
  SET    is_current = false
  WHERE  professional_id = NEW.professional_id
    AND  country         = NEW.country
    AND  id             != NEW.id
    AND  is_current      = true;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS learning_pathway_mark_stale ON learning_pathways;
CREATE TRIGGER learning_pathway_mark_stale
  AFTER INSERT ON learning_pathways
  FOR EACH ROW EXECUTE FUNCTION mark_previous_pathways_stale();

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE learning_pathways ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional reads own pathways" ON learning_pathways;
CREATE POLICY "professional reads own pathways" ON learning_pathways
  FOR SELECT USING (auth.uid() = professional_id);

DROP POLICY IF EXISTS "professional inserts own pathways" ON learning_pathways;
CREATE POLICY "professional inserts own pathways" ON learning_pathways
  FOR INSERT WITH CHECK (auth.uid() = professional_id);

DROP POLICY IF EXISTS "admin reads all pathways" ON learning_pathways;
CREATE POLICY "admin reads all pathways" ON learning_pathways
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND role IN ('master_admin', 'super_admin')
    )
  );

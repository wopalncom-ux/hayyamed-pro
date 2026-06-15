-- CPD Reflection Journal
-- Structured reflective practice entries linked (optionally) to CME activities.
-- Required by GMC, NMC, AHPRA for revalidation evidence portfolios.
CREATE TABLE IF NOT EXISTS cpd_reflections (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cme_activity_id     uuid        REFERENCES cme_activities(id) ON DELETE SET NULL,
  reflection_date     date        NOT NULL DEFAULT CURRENT_DATE,
  reflection_type     text        NOT NULL DEFAULT 'learning'
                      CHECK (reflection_type IN ('learning', 'practice_change', 'significant_event', 'feedback', 'research')),
  what_learned        text        NOT NULL CHECK (char_length(what_learned) >= 10),
  how_applied         text,
  impact_on_practice  text,
  further_learning    text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cpd_reflections_professional ON cpd_reflections (professional_id);
CREATE INDEX IF NOT EXISTS idx_cpd_reflections_activity     ON cpd_reflections (cme_activity_id) WHERE cme_activity_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cpd_reflections_date         ON cpd_reflections (professional_id, reflection_date DESC);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION cpd_reflections_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS cpd_reflections_updated_at ON cpd_reflections;
CREATE TRIGGER cpd_reflections_updated_at
  BEFORE UPDATE ON cpd_reflections
  FOR EACH ROW EXECUTE FUNCTION cpd_reflections_set_updated_at();

-- RLS
ALTER TABLE cpd_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional reads own reflections" ON cpd_reflections;
CREATE POLICY "professional reads own reflections" ON cpd_reflections
  FOR SELECT USING (professional_id = auth.uid());

DROP POLICY IF EXISTS "professional inserts own reflections" ON cpd_reflections;
CREATE POLICY "professional inserts own reflections" ON cpd_reflections
  FOR INSERT WITH CHECK (professional_id = auth.uid());

DROP POLICY IF EXISTS "professional updates own reflections" ON cpd_reflections;
CREATE POLICY "professional updates own reflections" ON cpd_reflections
  FOR UPDATE USING (professional_id = auth.uid()) WITH CHECK (professional_id = auth.uid());

DROP POLICY IF EXISTS "professional deletes own reflections" ON cpd_reflections;
CREATE POLICY "professional deletes own reflections" ON cpd_reflections
  FOR DELETE USING (professional_id = auth.uid());

DROP POLICY IF EXISTS "admin reads all reflections" ON cpd_reflections;
CREATE POLICY "admin reads all reflections" ON cpd_reflections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

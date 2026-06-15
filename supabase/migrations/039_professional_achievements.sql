-- Professional Achievement Badges
-- One row per earned badge per professional; UNIQUE prevents duplicate awards.
CREATE TABLE IF NOT EXISTS professional_achievements (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_key       text        NOT NULL,
  awarded_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (professional_id, badge_key)
);

CREATE INDEX IF NOT EXISTS idx_achievements_professional ON professional_achievements (professional_id);

-- RLS: professionals read own badges; admins read all
ALTER TABLE professional_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional reads own achievements" ON professional_achievements;
CREATE POLICY "professional reads own achievements" ON professional_achievements
  FOR SELECT USING (auth.uid() = professional_id);

DROP POLICY IF EXISTS "admin reads all achievements" ON professional_achievements;
CREATE POLICY "admin reads all achievements" ON professional_achievements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

-- No UPDATE or DELETE — badges are permanent once awarded
-- Inserts are server-side only (admin client) — no INSERT policy for auth users

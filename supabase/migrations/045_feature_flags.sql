-- ════════════════════════════════════════════════════════════
-- MIGRATION 045: Feature Flags
-- Admin-configurable feature gates for A/B testing,
-- per-plan feature control, and emergency kill switches.
-- Replaces scattered platform_settings boolean values
-- with a structured, queryable flag system.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS feature_flags (
  key             text        PRIMARY KEY,
  enabled         boolean     NOT NULL DEFAULT false,
  enabled_plans   text[]      DEFAULT NULL,    -- NULL = all plans; ['pro', 'employer'] = restricted
  rollout_pct     smallint    NOT NULL DEFAULT 100 CHECK (rollout_pct BETWEEN 0 AND 100),
  description     text,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  updated_by      uuid        REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Seed essential flags
INSERT INTO feature_flags (key, enabled, enabled_plans, rollout_pct, description) VALUES
  ('ai_compliance_chat',     true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'AI compliance chatbot — Pro+ feature'),
  ('ai_gap_analysis',        true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'AI CME gap analysis — Pro+ feature'),
  ('ai_certificate_ocr',     true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'AI certificate OCR extraction — Pro+ feature'),
  ('ai_renewal_prediction',  true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'AI renewal risk prediction — Pro+ feature'),
  ('ai_learning_pathway',    true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'AI 12-month learning pathway — Pro+ feature'),
  ('ai_voice_chat',          true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'HayyaVoice AI orb — Pro+ feature'),
  ('offline_cme_queue',      true,  NULL, 100, 'Offline CME submission queue — all users'),
  ('referral_programme',     true,  NULL, 100, 'Referral code generation + tracking'),
  ('achievement_badges',     true,  NULL, 100, 'Gamification badges'),
  ('compliance_certificate', true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'PDF compliance certificate download — Pro+ feature'),
  ('marketplace',            true,  NULL, 100, 'Training marketplace browsing'),
  ('coming_soon_mode',       false, NULL, 100, 'Show coming-soon page instead of app (env var also controls this)')
ON CONFLICT (key) DO NOTHING;

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read flags (to check their own entitlements client-side)
DROP POLICY IF EXISTS "authenticated users read feature flags" ON feature_flags;
CREATE POLICY "authenticated users read feature flags" ON feature_flags
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only admins can write flags
DROP POLICY IF EXISTS "admin manages feature flags" ON feature_flags;
CREATE POLICY "admin manages feature flags" ON feature_flags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND role IN ('master_admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND role IN ('master_admin', 'super_admin')
    )
  );

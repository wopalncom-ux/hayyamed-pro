-- Migration 074: Hayya Med Passport™
-- Verified healthcare professional digital identity with QR code verification.
-- Each professional may have one passport; QR token is revocable and rotatable.

CREATE TABLE IF NOT EXISTS professional_passports (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id               uuid        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  passport_number       text        NOT NULL UNIQUE,
  qr_token              uuid        NOT NULL DEFAULT gen_random_uuid(),
  qr_token_rotated_at   timestamptz NOT NULL DEFAULT now(),
  is_active             boolean     NOT NULL DEFAULT true,
  visibility_config     jsonb       NOT NULL DEFAULT '{"show_name":true,"show_specialty":true,"show_profession":true,"show_cme_status":true,"show_cme_credits":false,"show_authority":true}'::jsonb,
  total_scans           integer     NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_passports_auth_id      ON professional_passports (auth_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_passports_qr_token     ON professional_passports (qr_token);
CREATE INDEX        IF NOT EXISTS idx_passports_passport_num ON professional_passports (passport_number);

ALTER TABLE professional_passports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional reads own passport" ON professional_passports;
CREATE POLICY "professional reads own passport" ON professional_passports
  FOR SELECT USING (auth.uid() = auth_id);

DROP POLICY IF EXISTS "professional updates own passport" ON professional_passports;
CREATE POLICY "professional updates own passport" ON professional_passports
  FOR UPDATE USING (auth.uid() = auth_id)
  WITH CHECK  (auth.uid() = auth_id);

DROP POLICY IF EXISTS "admin reads all passports" ON professional_passports;
CREATE POLICY "admin reads all passports" ON professional_passports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid() AND role IN ('master_admin', 'super_admin')
    )
  );

-- No INSERT policy: created server-side via admin client only
-- No DELETE policy: use is_active = false for deactivation

DROP TRIGGER IF EXISTS trg_professional_passports_updated_at ON professional_passports;
CREATE TRIGGER trg_professional_passports_updated_at
  BEFORE UPDATE ON professional_passports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Passport verifications: append-only scan audit log ────────────────────

CREATE TABLE IF NOT EXISTS passport_verifications (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  passport_id         uuid        NOT NULL REFERENCES professional_passports(id) ON DELETE CASCADE,
  verifier_auth_id    uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  verifier_ip         text,
  verifier_user_agent text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_passport_verif_passport_id ON passport_verifications (passport_id);
CREATE INDEX IF NOT EXISTS idx_passport_verif_created_at  ON passport_verifications (created_at DESC);

ALTER TABLE passport_verifications ENABLE ROW LEVEL SECURITY;

-- Professional can read their own scan history
DROP POLICY IF EXISTS "professional reads own passport verifications" ON passport_verifications;
CREATE POLICY "professional reads own passport verifications" ON passport_verifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM professional_passports
      WHERE id = passport_verifications.passport_id AND auth_id = auth.uid()
    )
  );

-- No INSERT, UPDATE, or DELETE policies — inserts are server-side admin only

DROP POLICY IF EXISTS "admin reads all passport verifications" ON passport_verifications;
CREATE POLICY "admin reads all passport verifications" ON passport_verifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid() AND role IN ('master_admin', 'super_admin')
    )
  );

-- Auto-increment total_scans when a verification is logged
CREATE OR REPLACE FUNCTION increment_passport_scans()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE professional_passports
  SET total_scans = total_scans + 1
  WHERE id = NEW.passport_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_increment_passport_scans ON passport_verifications;
CREATE TRIGGER trg_increment_passport_scans
  AFTER INSERT ON passport_verifications
  FOR EACH ROW EXECUTE FUNCTION increment_passport_scans();

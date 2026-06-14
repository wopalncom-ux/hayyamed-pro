-- Referrals tracking table
-- Stores who referred whom; one row per referred user (UNIQUE on referred_auth_id)
CREATE TABLE IF NOT EXISTS referrals (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_auth_id  uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_auth_id  uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code     text        NOT NULL,
  status            text        NOT NULL DEFAULT 'signed_up'
                    CHECK (status IN ('signed_up', 'converted')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  converted_at      timestamptz,
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referred_auth_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals (referrer_auth_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals (referral_code);

-- Trigger: update updated_at
CREATE OR REPLACE FUNCTION referrals_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS referrals_updated_at ON referrals;
CREATE TRIGGER referrals_updated_at
  BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION referrals_set_updated_at();

-- RLS: professionals can read their own referrals as referrer
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "referrer reads own referrals" ON referrals;
CREATE POLICY "referrer reads own referrals" ON referrals
  FOR SELECT USING (referrer_auth_id = auth.uid());

-- Admins can read all
DROP POLICY IF EXISTS "admin reads all referrals" ON referrals;
CREATE POLICY "admin reads all referrals" ON referrals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

-- Service role handles inserts (called at signup via admin client)
-- No INSERT policy needed for regular users

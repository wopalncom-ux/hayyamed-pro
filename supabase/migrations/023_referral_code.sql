-- Add referral_code to professional_profiles for PLG referral tracking
ALTER TABLE professional_profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

-- Index for fast lookup by referral code (used at signup)
CREATE INDEX IF NOT EXISTS idx_professional_profiles_referral_code
  ON professional_profiles (referral_code)
  WHERE referral_code IS NOT NULL;

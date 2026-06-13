-- 021 pro_trial — 14-day Pro trial for new professionals on onboarding completion

ALTER TABLE professional_profiles ADD COLUMN IF NOT EXISTS pro_trial_ends_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_professional_profiles_trial
  ON professional_profiles(pro_trial_ends_at)
  WHERE pro_trial_ends_at IS NOT NULL;

-- Allow select on new column (RLS policies already cover the row via existing policies)
COMMENT ON COLUMN professional_profiles.pro_trial_ends_at IS
  'Set to NOW() + 14 days when onboarding completes. getUserPlan returns trialing while this is in the future.';

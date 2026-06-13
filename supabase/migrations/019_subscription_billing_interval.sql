-- 019_subscription_billing_interval.sql
-- Add billing_interval (monthly/annual) and employer_tier (clinic/growth/dept/hospital)
-- to the subscriptions table; update RLS policies accordingly

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS billing_interval text
    CHECK (billing_interval IN ('monthly', 'annual'))
    DEFAULT 'annual',
  ADD COLUMN IF NOT EXISTS employer_tier text
    CHECK (employer_tier IN ('clinic', 'growth', 'department', 'hospital', 'enterprise'));

COMMENT ON COLUMN subscriptions.billing_interval IS 'monthly or annual — determines which Paddle price ID was used';
COMMENT ON COLUMN subscriptions.employer_tier IS 'employer plan tier (clinic/growth/department/hospital/enterprise) — NULL for non-employer plans';

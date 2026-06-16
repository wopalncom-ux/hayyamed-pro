-- ============================================================
-- Migration 058 — Schema Improvements
-- Three gaps identified in the Session 81 schema audit:
--   1. org_type enum missing government / regulatory bodies
--   2. subscriptions.plan missing university / government tiers
--   3. cme_activities missing accreditor column
-- ============================================================

-- 1. Extend org_type enum for government and regulatory partners
--    Needed for QCHP, MOH, SCFHS organisation accounts and partner records.
ALTER TYPE org_type ADD VALUE IF NOT EXISTS 'government';
ALTER TYPE org_type ADD VALUE IF NOT EXISTS 'regulatory_body';
ALTER TYPE org_type ADD VALUE IF NOT EXISTS 'ngo';

-- 2. Expand subscriptions.plan to cover upcoming university and government tiers.
--    The constraint is replaced; existing rows ('free', 'pro', 'employer') are valid.
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS plan_values;
ALTER TABLE subscriptions
  ADD CONSTRAINT plan_values
  CHECK (plan IN ('free', 'pro', 'employer', 'university', 'government'));

-- 3. Accreditor column on cme_activities.
--    Stores the issuing accreditation body for each CME entry (e.g. "QCHP", "SCFHS",
--    "AHA", "EBMLS"). Used for compliance reporting and country-rules matching.
ALTER TABLE cme_activities
  ADD COLUMN IF NOT EXISTS accreditor text;

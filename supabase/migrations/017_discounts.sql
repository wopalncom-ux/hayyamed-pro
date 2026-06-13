-- 017_discounts.sql
-- Discount management: per-user, per-org, or global promo codes
-- Integrates at checkout time — discounted price passed to Paddle custom amount

CREATE TABLE IF NOT EXISTS discounts (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name             text        NOT NULL,
  description      text,
  -- 'percentage' | 'fixed_amount' | 'free_upgrade'
  discount_type    text        NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_upgrade')),
  -- % for percentage, $ amount for fixed_amount, 0 for free_upgrade
  discount_value   numeric(10,2) NOT NULL DEFAULT 0 CHECK (discount_value >= 0),
  -- which entity this discount targets
  target_type      text        NOT NULL CHECK (target_type IN ('user', 'organization', 'global')),
  -- NULL for global; uuid of user or organization for targeted
  target_id        uuid,
  -- which plans this discount applies to (array of plan keys)
  applicable_plans text[]      NOT NULL DEFAULT ARRAY['pro'],
  valid_from       timestamptz DEFAULT now(),
  valid_until      timestamptz,         -- NULL = no expiry
  max_uses         integer,             -- NULL = unlimited
  current_uses     integer     NOT NULL DEFAULT 0 CHECK (current_uses >= 0),
  is_active        boolean     NOT NULL DEFAULT true,
  -- optional promo code for global discounts
  promo_code       text        UNIQUE,
  notes            text,
  created_by       uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discounts_target ON discounts (target_type, target_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_discounts_promo_code ON discounts (promo_code) WHERE promo_code IS NOT NULL;

ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manage discounts" ON discounts;
CREATE POLICY "Admin manage discounts" ON discounts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

-- Authenticated users can read discounts that target them (for checkout display)
DROP POLICY IF EXISTS "User read own discounts" ON discounts;
CREATE POLICY "User read own discounts" ON discounts
  FOR SELECT USING (
    is_active = true
    AND (
      target_type = 'global'
      OR (target_type = 'user' AND target_id = auth.uid())
      OR (
        target_type = 'organization'
        AND target_id IN (
          SELECT organization_id FROM organization_members WHERE auth_id = auth.uid()
        )
      )
    )
  );

CREATE OR REPLACE FUNCTION set_discounts_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_discounts_updated_at ON discounts;
CREATE TRIGGER trg_discounts_updated_at
  BEFORE UPDATE ON discounts
  FOR EACH ROW EXECUTE FUNCTION set_discounts_updated_at();

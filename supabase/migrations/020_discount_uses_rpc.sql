-- 020_discount_uses_rpc.sql
-- Atomic increment for discount use counter — called after successful checkout

CREATE OR REPLACE FUNCTION increment_discount_uses(discount_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE discounts
  SET current_uses = current_uses + 1
  WHERE id = discount_id;
END;
$$;

-- Only service role can call this (checkout route uses admin client)
REVOKE ALL ON FUNCTION increment_discount_uses(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_discount_uses(uuid) TO service_role;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 056 — Cycle-Scoped Credit Sync
--
-- Updates sync_cme_wallet_credits() to count only activities
-- within the current renewal cycle (activity_date >= cycle_start_date).
--
-- Why: Without this filter, activities from past cycles kept
-- contributing to completed_credits after a cycle renewal, making
-- compliance appear higher than it actually is for the new cycle.
--
-- Impact on existing data: Any activities with activity_date before
-- cycle_start_date will no longer count toward completed_credits.
-- This is the correct regulatory behaviour (QCHP, SCFHS, DHA all
-- require activities to fall within the licensed cycle window).
--
-- After running this migration, trigger a manual recompute by running:
--   UPDATE cme_activities SET updated_at = now()
--       WHERE verification_status = 'verified';
-- (fires the trigger on every verified activity, recomputing all wallets)
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.sync_cme_wallet_credits()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_wallet_id    uuid := COALESCE(NEW.wallet_id, OLD.wallet_id);
  v_cycle_start  date;
BEGIN
  -- Read the current cycle start once (before the wallet update) to avoid
  -- repeated subqueries and ensure consistency within the trigger execution.
  SELECT cycle_start_date INTO v_cycle_start
  FROM cme_wallets WHERE id = v_wallet_id;

  UPDATE cme_wallets
  SET completed_credits = (
    SELECT COALESCE(SUM(credits), 0)
    FROM cme_activities
    WHERE wallet_id           = v_wallet_id
      AND verification_status = 'verified'
      AND activity_date       >= COALESCE(v_cycle_start, '-infinity'::date)
  )
  WHERE id = v_wallet_id;

  RETURN NULL;
END;
$$;

-- The trigger itself is already registered (migration 001). No DROP/CREATE needed.
-- Replacing the function body is sufficient.

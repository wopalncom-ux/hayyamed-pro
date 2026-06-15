-- ════════════════════════════════════════════════════════════
-- MIGRATION 051 — Profile Completion Auto-Trigger
-- profile_completion_pct has existed since migration 001 but
-- was never auto-calculated — it stayed at 0 permanently.
-- This trigger fires BEFORE INSERT OR UPDATE and recomputes
-- the percentage from a weighted field checklist so the
-- dashboard, admin view, and activation metrics are accurate.
--
-- Field weights (total = 100):
--   full_name            15
--   profession           15
--   license_number       15
--   licensing_authority  10
--   license_expiry       10
--   specialty            10
--   mobile                5
--   date_of_birth         5
--   nationality           5
--   onboarding_complete  10
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.compute_profile_completion_pct()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  score smallint := 0;
BEGIN
  IF NEW.full_name           IS NOT NULL AND trim(NEW.full_name)            <> '' THEN score := score + 15; END IF;
  IF NEW.profession          IS NOT NULL AND trim(NEW.profession)           <> '' THEN score := score + 15; END IF;
  IF NEW.license_number      IS NOT NULL AND trim(NEW.license_number)       <> '' THEN score := score + 15; END IF;
  IF NEW.licensing_authority IS NOT NULL AND trim(NEW.licensing_authority)  <> '' THEN score := score + 10; END IF;
  IF NEW.license_expiry      IS NOT NULL                                          THEN score := score + 10; END IF;
  IF NEW.specialty           IS NOT NULL AND trim(NEW.specialty)            <> '' THEN score := score + 10; END IF;
  IF NEW.mobile              IS NOT NULL AND trim(NEW.mobile)               <> '' THEN score := score + 5;  END IF;
  IF NEW.date_of_birth       IS NOT NULL                                          THEN score := score + 5;  END IF;
  IF NEW.nationality         IS NOT NULL AND trim(NEW.nationality)          <> '' THEN score := score + 5;  END IF;
  IF NEW.onboarding_complete = true                                               THEN score := score + 10; END IF;

  NEW.profile_completion_pct := score;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profile_completion_pct_trigger ON professional_profiles;
CREATE TRIGGER profile_completion_pct_trigger
  BEFORE INSERT OR UPDATE ON professional_profiles
  FOR EACH ROW EXECUTE FUNCTION public.compute_profile_completion_pct();

-- Back-fill all existing rows so they reflect the correct %
-- (the trigger only fires on future writes, not historical rows)
UPDATE professional_profiles SET updated_at = now()
WHERE true;
-- The above UPDATE triggers the BEFORE UPDATE trigger on every row,
-- which calls compute_profile_completion_pct() and sets the correct pct.

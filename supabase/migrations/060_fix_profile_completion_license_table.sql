-- ════════════════════════════════════════════════════════════
-- MIGRATION 060 — Fix Profile Completion: Professional Licenses Table
--
-- Problem: compute_profile_completion_pct checks only the legacy
-- license_number / licensing_authority / license_expiry fields on
-- professional_profiles for the 35-point license block (15+10+10).
-- But users who add licenses via /api/licenses write to the
-- professional_licenses table instead, so they permanently score 0
-- on all three license-related fields no matter how many licenses
-- they add through the dashboard.
--
-- Fix:
--   1. Replace the three legacy-field checks with EXISTS subqueries
--      that accept either the legacy field OR a row in
--      professional_licenses. Legacy onboarding path continues to work.
--   2. Add a trigger on professional_licenses that fires on INSERT/DELETE
--      and touches professional_profiles.updated_at, which fires the
--      existing profile_completion_pct_trigger automatically.
--   3. Backfill only the affected rows (those with data in
--      professional_licenses but empty legacy fields).
-- ════════════════════════════════════════════════════════════

-- ── 1. Updated trigger function ────────────────────────────

CREATE OR REPLACE FUNCTION public.compute_profile_completion_pct()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  score        smallint := 0;
  has_license  boolean;
  has_authority boolean;
  has_expiry   boolean;
BEGIN
  IF NEW.full_name  IS NOT NULL AND trim(NEW.full_name)  <> '' THEN score := score + 15; END IF;
  IF NEW.profession IS NOT NULL AND trim(NEW.profession) <> '' THEN score := score + 15; END IF;

  -- License number (15 pts): legacy field OR any row in professional_licenses
  has_license := (
    (NEW.license_number IS NOT NULL AND trim(NEW.license_number) <> '') OR
    EXISTS (
      SELECT 1 FROM public.professional_licenses
      WHERE professional_id = NEW.auth_id LIMIT 1
    )
  );
  IF has_license THEN score := score + 15; END IF;

  -- Licensing authority (10 pts): legacy field OR any license with authority set
  has_authority := (
    (NEW.licensing_authority IS NOT NULL AND trim(NEW.licensing_authority) <> '') OR
    EXISTS (
      SELECT 1 FROM public.professional_licenses
      WHERE professional_id = NEW.auth_id
        AND licensing_authority IS NOT NULL
        AND trim(licensing_authority) <> ''
      LIMIT 1
    )
  );
  IF has_authority THEN score := score + 10; END IF;

  -- License expiry (10 pts): legacy field OR any license with expiry date set
  has_expiry := (
    NEW.license_expiry IS NOT NULL OR
    EXISTS (
      SELECT 1 FROM public.professional_licenses
      WHERE professional_id = NEW.auth_id
        AND expiry_date IS NOT NULL
      LIMIT 1
    )
  );
  IF has_expiry THEN score := score + 10; END IF;

  IF NEW.specialty         IS NOT NULL AND trim(NEW.specialty)         <> '' THEN score := score + 10; END IF;
  IF NEW.mobile            IS NOT NULL AND trim(NEW.mobile)            <> '' THEN score := score + 5;  END IF;
  IF NEW.date_of_birth     IS NOT NULL                                       THEN score := score + 5;  END IF;
  IF NEW.nationality       IS NOT NULL AND trim(NEW.nationality)       <> '' THEN score := score + 5;  END IF;
  IF NEW.onboarding_complete = true                                          THEN score := score + 10; END IF;

  NEW.profile_completion_pct := score;
  RETURN NEW;
END;
$$;

-- trigger was already created in migration 051; no need to recreate

-- ── 2. Cross-table trigger: professional_licenses → professional_profiles ──

CREATE OR REPLACE FUNCTION public.refresh_completion_on_license_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.professional_profiles
  SET updated_at = NOW()
  WHERE auth_id = COALESCE(NEW.professional_id, OLD.professional_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_refresh_completion_on_license ON public.professional_licenses;
CREATE TRIGGER trg_refresh_completion_on_license
  AFTER INSERT OR DELETE ON public.professional_licenses
  FOR EACH ROW EXECUTE FUNCTION public.refresh_completion_on_license_change();

-- ── 3. Backfill: fix rows where professional_licenses exists but legacy fields empty ──

UPDATE public.professional_profiles pp
SET updated_at = NOW()
WHERE EXISTS (
  SELECT 1 FROM public.professional_licenses pl
  WHERE pl.professional_id = pp.auth_id
  LIMIT 1
)
AND (
  pp.license_number      IS NULL OR trim(pp.license_number)      = '' OR
  pp.licensing_authority IS NULL OR trim(pp.licensing_authority) = '' OR
  pp.license_expiry      IS NULL
);

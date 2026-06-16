-- Migration 062: Privacy Settings Auto-Create Trigger + Backfill
--
-- Problem: profile_privacy_settings rows are only created when a user reaches
-- onboarding Step 6 or visits /dashboard/settings. Users who are employer-linked
-- before completing Step 6 (e.g. via QR invite, manual admin link) have no row,
-- causing all employer RLS policies (migration 048) to silently return no data —
-- the INNER JOIN on profile_privacy_settings finds nothing → EXISTS = false.
--
-- Fix:
--   1. New trigger: auto-create a default privacy_settings row immediately after
--      the professional_profiles row is created (which is itself triggered by
--      auth.users INSERT via handle_new_user).
--   2. Idempotent backfill: insert default rows for all existing professionals
--      who are missing their privacy_settings record.

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1: Trigger function — creates default privacy settings on profile create
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_default_privacy_settings()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profile_privacy_settings (professional_id)
  VALUES (NEW.auth_id)
  ON CONFLICT (professional_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- SECURITY DEFINER is required because profile_privacy_settings has RLS enabled
-- and the trigger fires in the context of the inserting user (not service_role).
-- The function bypasses RLS to guarantee the row is always created.

DROP TRIGGER IF EXISTS trg_create_default_privacy_settings ON public.professional_profiles;
CREATE TRIGGER trg_create_default_privacy_settings
  AFTER INSERT ON public.professional_profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_default_privacy_settings();

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 2: Backfill existing professionals missing their privacy settings row
-- Uses INSERT ... SELECT to create default rows atomically.
-- ON CONFLICT DO NOTHING makes this safe to re-run.
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.profile_privacy_settings (professional_id)
SELECT pp.auth_id
FROM   public.professional_profiles pp
WHERE  NOT EXISTS (
  SELECT 1 FROM public.profile_privacy_settings pps
  WHERE pps.professional_id = pp.auth_id
)
ON CONFLICT (professional_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFY (uncomment to check post-migration):
-- SELECT COUNT(*) FROM professional_profiles;
-- SELECT COUNT(*) FROM profile_privacy_settings;
-- -- Both counts should be equal after migration.
-- SELECT pp.auth_id FROM professional_profiles pp
-- LEFT JOIN profile_privacy_settings pps ON pps.professional_id = pp.auth_id
-- WHERE pps.professional_id IS NULL;
-- -- Should return 0 rows.
-- ─────────────────────────────────────────────────────────────────────────────

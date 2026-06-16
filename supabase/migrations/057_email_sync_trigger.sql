-- ============================================================
-- MIGRATION 057 — Auth Email Sync Trigger
--
-- Problem: professional_profiles.email is set on INSERT from
-- auth.users but never updated when the user changes their email
-- in Supabase Auth. This causes email delivery failures (drip,
-- bounce tracking, reminders) because all email sends query
-- professional_profiles.email.
--
-- Fix: trigger on auth.users AFTER UPDATE OF email that keeps
-- professional_profiles.email in sync.
-- ============================================================

CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    UPDATE public.professional_profiles
    SET email     = NEW.email,
        updated_at = now()
    WHERE auth_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_email();

-- One-time back-fill: sync any rows where email has already drifted.
-- Safe to run multiple times (IS DISTINCT FROM prevents no-op updates).
UPDATE public.professional_profiles pp
SET    email      = u.email,
       updated_at = now()
FROM   auth.users u
WHERE  pp.auth_id = u.id
  AND  pp.email IS DISTINCT FROM u.email;

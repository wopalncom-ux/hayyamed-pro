-- ════════════════════════════════════════════════════════════════════════════
-- MIGRATION 086: Profession targeting for authority announcements
--
-- Lets a regulatory authority target a jurisdiction announcement at specific
-- professions (e.g. only Nurses, or only Doctors + Pharmacists) instead of every
-- professional in the country. NULL or empty array = all professions (the prior
-- jurisdiction-wide behaviour, so existing rows keep working unchanged).
--
-- Enforced in RLS: a professional only reads announcements whose target list is
-- empty OR contains their own `professional_profiles.profession`.
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.authority_announcements
  ADD COLUMN IF NOT EXISTS target_professions text[];

-- Rebuild the jurisdiction read policy to also honour profession targeting.
DROP POLICY IF EXISTS "authority_announcements_jurisdiction_read" ON public.authority_announcements;
CREATE POLICY "authority_announcements_jurisdiction_read"
  ON public.authority_announcements
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND is_active = true
    AND starts_at <= now()
    AND (ends_at IS NULL OR ends_at >= now())
    AND jurisdiction_country = public.country_to_code(
      COALESCE((SELECT p.country_of_residence FROM public.professional_profiles p
                WHERE p.auth_id = auth.uid()), '')
    )
    AND (
      target_professions IS NULL
      OR cardinality(target_professions) = 0
      OR (SELECT p.profession FROM public.professional_profiles p
          WHERE p.auth_id = auth.uid()) = ANY (target_professions)
    )
  );

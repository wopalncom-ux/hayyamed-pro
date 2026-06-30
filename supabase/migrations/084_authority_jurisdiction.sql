-- ════════════════════════════════════════════════════════════════════════════
-- MIGRATION 084: Regulator (Government Authority) Portal v2 — Jurisdiction model
--
-- Shifts the government portal from the employer-style opt-in linking model to
-- jurisdiction-wide oversight: a regulatory authority (e.g. DHP Qatar) sees every
-- professional whose country of residence falls in its jurisdiction.
--
-- LEGAL BASIS (Qatar PDPL / GDPR Art. 6(1)(e) public task): a licensing authority
-- has a statutory mandate to oversee compliance of professionals it licenses.
-- Every regulator read of professional data is audit-logged in application code
-- (see lib/government/jurisdiction.ts). Certificate files remain private/audited.
--
-- Adds:
--   1. public.country_to_code()      — SQL mirror of lib/countryCode.ts (for RLS)
--   2. authority_announcements        — country-scoped banners posted by a regulator
--   3. authority_announcement_dismissals
--   4. index on professional_profiles(country_of_residence) for jurisdiction sweeps
-- ════════════════════════════════════════════════════════════════════════════

-- ─── 1. country name → ISO code (mirrors lib/countryCode.ts) ──────────────────
-- IMMUTABLE so it can be used inside RLS policy expressions.
CREATE OR REPLACE FUNCTION public.country_to_code(name_or_code text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE name_or_code
    WHEN 'Qatar'                THEN 'QA'
    WHEN 'Saudi Arabia'         THEN 'SA'
    WHEN 'UAE'                  THEN 'AE'
    WHEN 'United Arab Emirates' THEN 'AE'
    WHEN 'Kuwait'               THEN 'KW'
    WHEN 'Bahrain'              THEN 'BH'
    WHEN 'Oman'                 THEN 'OM'
    WHEN 'Egypt'                THEN 'EG'
    WHEN 'Jordan'               THEN 'JO'
    WHEN 'UK'                   THEN 'GB'
    WHEN 'United Kingdom'       THEN 'GB'
    WHEN 'India'                THEN 'IN'
    WHEN 'Australia'            THEN 'AU'
    WHEN 'USA'                  THEN 'US'
    WHEN 'United States'        THEN 'US'
    WHEN 'Canada'               THEN 'CA'
    ELSE name_or_code  -- already a code, or unknown — return unchanged
  END;
$$;

-- ─── 2. authority_announcements ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.authority_announcements (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id      uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  jurisdiction_country char(2) NOT NULL,
  title                text NOT NULL,
  message              text NOT NULL,
  type                 text NOT NULL DEFAULT 'info'
                         CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_active            boolean NOT NULL DEFAULT true,
  dismissible          boolean NOT NULL DEFAULT true,
  cta_label            text,
  cta_url              text,
  starts_at            timestamptz NOT NULL DEFAULT now(),
  ends_at              timestamptz,
  created_by           uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_authority_announcements_lookup
  ON public.authority_announcements (jurisdiction_country, is_active, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_authority_announcements_org
  ON public.authority_announcements (organization_id);

ALTER TABLE public.authority_announcements ENABLE ROW LEVEL SECURITY;

-- Government admins of the owning authority manage their announcements
DROP POLICY IF EXISTS "authority_announcements_admin_manage" ON public.authority_announcements;
CREATE POLICY "authority_announcements_admin_manage"
  ON public.authority_announcements
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members m
      WHERE m.auth_id = auth.uid()
        AND m.organization_id = authority_announcements.organization_id
        AND m.role = 'government_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organization_members m
      WHERE m.auth_id = auth.uid()
        AND m.organization_id = authority_announcements.organization_id
        AND m.role = 'government_admin'
    )
  );

-- Any authenticated user reads active announcements for THEIR country (code-matched)
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
  );

DROP TRIGGER IF EXISTS set_authority_announcements_updated_at ON public.authority_announcements;
CREATE TRIGGER set_authority_announcements_updated_at
  BEFORE UPDATE ON public.authority_announcements
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ─── 3. authority_announcement_dismissals ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.authority_announcement_dismissals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES public.authority_announcements(id) ON DELETE CASCADE,
  auth_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dismissed_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (announcement_id, auth_id)
);

CREATE INDEX IF NOT EXISTS idx_authority_dismissals_user
  ON public.authority_announcement_dismissals (auth_id);

ALTER TABLE public.authority_announcement_dismissals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authority_dismissals_own" ON public.authority_announcement_dismissals;
CREATE POLICY "authority_dismissals_own"
  ON public.authority_announcement_dismissals
  FOR ALL
  USING (auth_id = auth.uid())
  WITH CHECK (auth_id = auth.uid());

-- ─── 4. jurisdiction sweep index ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_professional_profiles_country
  ON public.professional_profiles (country_of_residence);

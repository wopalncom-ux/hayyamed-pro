-- ════════════════════════════════════════════════════════════
-- MIGRATION 048: Employer RLS Policies
-- Adds proper RLS policies so employer_admins can read linked
-- staff CME data and profiles at the DB level.
-- Removes dependency on createAdminClient() bypass for
-- employer dashboard queries — critical for SOC 2 / multi-tenant
-- isolation compliance.
-- ════════════════════════════════════════════════════════════

-- ── cme_activities: employer read ────────────────────────────────────────────
DROP POLICY IF EXISTS "employer reads approved staff activities" ON cme_activities;
CREATE POLICY "employer reads approved staff activities" ON cme_activities
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
        FROM employer_link_requests elr
        JOIN organization_members   om  ON om.organization_id = elr.organization_id
        JOIN profile_privacy_settings pps ON pps.professional_id = cme_activities.professional_id
       WHERE elr.professional_id = cme_activities.professional_id
         AND elr.status          = 'approved'
         AND om.auth_id          = auth.uid()
         AND om.role             = 'employer_admin'
         AND pps.employer_can_view_detailed_cme_activities = true
    )
  );

-- Employer read of summary (no individual activity detail) when only summary allowed
DROP POLICY IF EXISTS "employer reads approved staff cme summary" ON cme_activities;
CREATE POLICY "employer reads approved staff cme summary" ON cme_activities
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
        FROM employer_link_requests elr
        JOIN organization_members   om  ON om.organization_id = elr.organization_id
        JOIN profile_privacy_settings pps ON pps.professional_id = cme_activities.professional_id
       WHERE elr.professional_id = cme_activities.professional_id
         AND elr.status          = 'approved'
         AND om.auth_id          = auth.uid()
         AND om.role             = 'employer_admin'
         AND pps.employer_can_view_cme_summary = true
         AND cme_activities.employer_visible    = true
    )
  );

-- ── professional_profiles: employer read ─────────────────────────────────────
DROP POLICY IF EXISTS "employer reads approved staff profiles" ON professional_profiles;
CREATE POLICY "employer reads approved staff profiles" ON professional_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
        FROM employer_link_requests elr
        JOIN organization_members   om  ON om.organization_id = elr.organization_id
        JOIN profile_privacy_settings pps ON pps.professional_id = professional_profiles.auth_id
       WHERE elr.professional_id = professional_profiles.auth_id
         AND elr.status          = 'approved'
         AND om.auth_id          = auth.uid()
         AND om.role             = 'employer_admin'
         AND pps.employer_can_view_profile_details = true
    )
  );

-- ── cme_wallets: employer read (compliance overview) ─────────────────────────
DROP POLICY IF EXISTS "employer reads approved staff wallets" ON cme_wallets;
CREATE POLICY "employer reads approved staff wallets" ON cme_wallets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
        FROM employer_link_requests elr
        JOIN organization_members   om  ON om.organization_id = elr.organization_id
        JOIN profile_privacy_settings pps ON pps.professional_id = cme_wallets.professional_id
       WHERE elr.professional_id = cme_wallets.professional_id
         AND elr.status          = 'approved'
         AND om.auth_id          = auth.uid()
         AND om.role             = 'employer_admin'
         AND pps.employer_can_view_cme_summary = true
    )
  );

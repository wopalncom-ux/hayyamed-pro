-- ════════════════════════════════════════════════════════════
-- MIGRATION 088: Security hardening
-- Addresses WARN-level findings from `supabase db advisors --type security`
-- (2026-07-22). Nothing here is a live data-exposure issue (RLS itself is
-- clean, 0 ERROR-level findings) — this closes routine pre-launch hardening
-- gaps: search_path hijacking surface + unneeded anon/authenticated RPC
-- access to functions that are only ever called via the service-role client.
-- ════════════════════════════════════════════════════════════

-- ── Fix mutable search_path on all flagged functions ─────────────────────
-- Without an explicit search_path, a role with CREATE privilege on a schema
-- earlier in the resolution order could shadow an unqualified reference
-- inside these functions. Pins each to public (+ pg_temp for temp tables).

ALTER FUNCTION public.handle_new_subscription() SET search_path = public, pg_temp;
ALTER FUNCTION public.set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_compliance_status() SET search_path = public, pg_temp;
ALTER FUNCTION public.set_platform_settings_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.set_discounts_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.set_partners_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.increment_discount_uses(uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.cpd_reflections_set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.compliance_thresholds_set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.pro_licenses_set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.cert_storage_set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.mobile_devices_set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.notification_queue_set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.webhook_endpoints_set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.compute_profile_completion_pct() SET search_path = public, pg_temp;
ALTER FUNCTION public.refresh_completion_on_license_change() SET search_path = public, pg_temp;
ALTER FUNCTION public.referrals_set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.api_keys_set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.learning_pathways_set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.mark_previous_pathways_stale() SET search_path = public, pg_temp;
ALTER FUNCTION public.increment_passport_scans() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_announcements_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_changelog_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.country_to_code(text) SET search_path = public, pg_temp;
ALTER FUNCTION public.match_knowledge_chunks(vector, integer, text, double precision) SET search_path = public, pg_temp;
ALTER FUNCTION public.assistant_rules_set_updated_at() SET search_path = public, pg_temp;

-- ── Revoke anon/authenticated EXECUTE on service-role-only functions ─────
-- Every real call site for these 8 functions uses the admin (service-role)
-- client — confirmed via grep across app/ and lib/, zero browser-side RPC
-- calls found. Must REVOKE FROM PUBLIC specifically, not "FROM anon,
-- authenticated" — Postgres created these with EXECUTE granted to PUBLIC,
-- which anon/authenticated inherit automatically; revoking from the two
-- named roles alone leaves the PUBLIC grant intact and does nothing
-- (confirmed via information_schema.routine_privileges after the first
-- attempt). postgres and service_role each hold their own separate direct
-- grant already, so revoking PUBLIC doesn't affect them. This closes
-- get_auth_user_id_by_email as a public email->UUID enumeration vector and
-- removes the ability for any anon/authenticated client to directly invoke
-- trigger-only functions (handle_new_user, sync_user_email, etc.) out of
-- their intended trigger context.

REVOKE EXECUTE ON FUNCTION public.create_default_privacy_settings() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_auth_user_id_by_email(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_subscription() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_discount_uses(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.refresh_completion_on_license_change() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.semantic_course_search(vector, integer, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sync_cme_wallet_credits() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sync_user_email() FROM PUBLIC;

-- ── platform_emergency_controls: close an open public INSERT ────────────
-- Despite its name, "service_role_emergency_insert" was declared with no
-- role restriction (applies to anon/authenticated/everyone). app code
-- (app/api/owner/emergency/route.ts) only ever UPDATEs the single seed row
-- and reads it with .select().single() — an anonymous INSERT of a second
-- row would make .single() throw, breaking the founder/admin emergency
-- kill-switch panel entirely (a DoS on that panel, not a data leak — SELECT
-- and UPDATE are already correctly restricted to founder/master_admin/
-- super_admin). service_role bypasses RLS regardless of policies present,
-- so it doesn't need a replacement INSERT policy to keep working.
DROP POLICY IF EXISTS "service_role_emergency_insert" ON platform_emergency_controls;

-- demo_requests / waitlist_signups: verified their WITH CHECK(true) INSERT
-- is correctly paired with a "select_none" (qual: false) SELECT policy —
-- the standard, safe write-only public lead-capture-form pattern. No
-- change needed; the advisor WARN here is a false-positive-by-design.

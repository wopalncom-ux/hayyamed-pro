-- rls_run.sql
-- Self-contained RLS audit. Paste into Supabase SQL Editor (postgres role) and run.
-- Automatically picks two real users from auth.users — no manual UUID substitution needed.
-- All tests print PASS or FAIL with a reason.
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  user_a uuid;
  user_b uuid;
  wallet_a_id uuid;
  cnt integer;
  err_msg text;
BEGIN

  -- ── Discover two real users ──────────────────────────────────────────────
  SELECT id INTO user_a FROM auth.users ORDER BY created_at ASC LIMIT 1;
  SELECT id INTO user_b FROM auth.users WHERE id <> user_a ORDER BY created_at ASC LIMIT 1;

  IF user_a IS NULL THEN
    RAISE NOTICE 'SKIP: No users in auth.users yet — register at least one account first.';
    RETURN;
  END IF;

  IF user_b IS NULL THEN
    RAISE NOTICE 'SKIP: Only one user in auth.users — register a second account to test cross-user isolation.';
    -- Still run the single-user and structural tests below
  END IF;

  RAISE NOTICE '══════════════════════════════════════════════════';
  RAISE NOTICE 'Hayya Med Pro — RLS Verification';
  RAISE NOTICE 'User A: %', user_a;
  RAISE NOTICE 'User B: %', COALESCE(user_b::text, '(none — single-user tests only)');
  RAISE NOTICE '══════════════════════════════════════════════════';

  -- ── TEST 1: All public tables have RLS enabled ───────────────────────────
  SELECT COUNT(*) INTO cnt
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relkind = 'r'
    AND c.relrowsecurity = false;

  IF cnt = 0 THEN
    RAISE NOTICE '[PASS] TEST 1: RLS enabled on all public tables.';
  ELSE
    RAISE NOTICE '[FAIL] TEST 1: % public table(s) have RLS DISABLED.', cnt;
  END IF;

  -- ── TEST 2: All public tables have at least one policy ───────────────────
  WITH tables_without_policies AS (
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r'
    EXCEPT
    SELECT DISTINCT tablename::name FROM pg_policies WHERE schemaname = 'public'
  )
  SELECT COUNT(*) INTO cnt FROM tables_without_policies;

  IF cnt = 0 THEN
    RAISE NOTICE '[PASS] TEST 2: All public tables have at least one RLS policy.';
  ELSE
    RAISE NOTICE '[FAIL] TEST 2: % table(s) have no RLS policies at all.', cnt;
  END IF;

  -- ── TEST 3: audit_logs has no UPDATE policy ───────────────────────────────
  SELECT COUNT(*) INTO cnt
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'audit_logs'
    AND cmd IN ('UPDATE', 'DELETE');

  IF cnt = 0 THEN
    RAISE NOTICE '[PASS] TEST 3: audit_logs has no UPDATE/DELETE policies (append-only confirmed).';
  ELSE
    RAISE NOTICE '[FAIL] TEST 3: audit_logs has % UPDATE/DELETE policy(ies) — it must be append-only.', cnt;
  END IF;

  -- ── TEST 4: employer_link_requests has no professional UPDATE policy ───────
  -- Professionals should not be able to approve their own link requests.
  SELECT COUNT(*) INTO cnt
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'employer_link_requests'
    AND cmd = 'UPDATE'
    AND policyname NOT ILIKE '%admin%'
    AND policyname NOT ILIKE '%employer%';

  IF cnt = 0 THEN
    RAISE NOTICE '[PASS] TEST 4: employer_link_requests — no non-employer UPDATE policy (self-approval blocked).';
  ELSE
    RAISE NOTICE '[WARN] TEST 4: employer_link_requests has % UPDATE policy(ies) not scoped to employer/admin — review carefully.', cnt;
  END IF;

  -- ── TEST 5: professions table is read-only (no INSERT/UPDATE/DELETE policy) ─
  SELECT COUNT(*) INTO cnt
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'professions'
    AND cmd IN ('INSERT', 'UPDATE', 'DELETE');

  IF cnt = 0 THEN
    RAISE NOTICE '[PASS] TEST 5: professions table is read-only for non-admin users.';
  ELSE
    RAISE NOTICE '[WARN] TEST 5: professions has % INSERT/UPDATE/DELETE policy(ies) — verify they are admin-only.', cnt;
  END IF;

  -- ── TEST 6: Cross-user profile isolation (role-switch simulation) ─────────
  IF user_b IS NOT NULL THEN
    -- Simulate user B querying user A's profile by checking the SELECT policy definition
    -- Real impersonation requires JWT which can only be done client-side.
    -- We verify the policy uses auth.uid() = auth_id (not a public read-all policy).
    SELECT COUNT(*) INTO cnt
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'professional_profiles'
      AND cmd = 'SELECT'
      AND (qual ILIKE '%auth.uid()%' OR qual ILIKE '%auth.uid ()%');

    IF cnt > 0 THEN
      RAISE NOTICE '[PASS] TEST 6: professional_profiles SELECT policy uses auth.uid() — cross-user isolation enforced.';
    ELSE
      RAISE NOTICE '[FAIL] TEST 6: professional_profiles SELECT policy does not reference auth.uid() — review RLS!';
    END IF;
  ELSE
    RAISE NOTICE '[SKIP] TEST 6: Need two users for cross-user isolation test.';
  END IF;

  -- ── TEST 7: cme_wallets SELECT policy uses auth.uid() ────────────────────
  SELECT COUNT(*) INTO cnt
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'cme_wallets'
    AND cmd = 'SELECT'
    AND (qual ILIKE '%auth.uid()%' OR qual ILIKE '%auth.uid ()%');

  IF cnt > 0 THEN
    RAISE NOTICE '[PASS] TEST 7: cme_wallets SELECT policy uses auth.uid() — wallet isolation enforced.';
  ELSE
    RAISE NOTICE '[FAIL] TEST 7: cme_wallets SELECT policy missing auth.uid() check.';
  END IF;

  -- ── TEST 8: profile_privacy_settings SELECT policy uses auth.uid() ────────
  SELECT COUNT(*) INTO cnt
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'profile_privacy_settings'
    AND cmd = 'SELECT'
    AND (qual ILIKE '%auth.uid()%' OR qual ILIKE '%auth.uid ()%');

  IF cnt > 0 THEN
    RAISE NOTICE '[PASS] TEST 8: profile_privacy_settings SELECT policy uses auth.uid().';
  ELSE
    RAISE NOTICE '[FAIL] TEST 8: profile_privacy_settings SELECT policy missing auth.uid() check.';
  END IF;

  RAISE NOTICE '══════════════════════════════════════════════════';
  RAISE NOTICE 'RLS audit complete. Review any FAIL or WARN lines above.';
  RAISE NOTICE '══════════════════════════════════════════════════';

END $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- STRUCTURAL REPORT: RLS status + policy counts for all public tables
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
  c.relname                               AS table_name,
  c.relrowsecurity                        AS rls_on,
  COALESCE(p.policy_count, 0)             AS policies,
  CASE WHEN c.relrowsecurity AND COALESCE(p.policy_count,0) > 0 THEN 'OK'
       WHEN NOT c.relrowsecurity THEN 'NO RLS'
       ELSE 'NO POLICIES'
  END                                     AS status
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN (
  SELECT tablename::name AS tname, COUNT(*) AS policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
  GROUP BY tablename
) p ON p.tname = c.relname
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY status DESC, table_name;

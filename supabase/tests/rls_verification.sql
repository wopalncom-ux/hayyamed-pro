-- rls_verification.sql
-- Manual RLS audit script. Run each block in Supabase SQL editor (as postgres / service role)
-- to verify that row-level security is working correctly.
-- All tests should return 0 rows where marked (cross-user access denied).
-- Replace the UUIDs with real user IDs from your auth.users table before running.

-- ─────────────────────────────────────────────────────────────────────────────
-- SETUP: replace these with two real auth.users IDs from your database
-- ─────────────────────────────────────────────────────────────────────────────
-- \set user_a 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  -- user A (owns data)
-- \set user_b 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'  -- user B (must not see A's data)

-- ─────────────────────────────────────────────────────────────────────────────
-- TEST 1: RLS is enabled on every table
-- Expected: every row shows rowsecurity = true
-- ─────────────────────────────────────────────────────────────────────────────
select
  relname as table_name,
  relrowsecurity as rls_enabled
from pg_class
join pg_namespace on pg_namespace.oid = pg_class.relnamespace
where
  pg_namespace.nspname = 'public'
  and pg_class.relkind = 'r'
order by relname;

-- ─────────────────────────────────────────────────────────────────────────────
-- TEST 2: professional_profiles — user B cannot read user A's profile
-- Expected: 0 rows when run as user B
-- ─────────────────────────────────────────────────────────────────────────────
-- Run this block as user B (set role / use Supabase anon key with user B's JWT):
--   select * from professional_profiles where auth_id = '<user_a_id>';
--
-- With service role (bypasses RLS — use only to seed test data, never in app code):
--   set role authenticated;
--   set request.jwt.claims to '{"sub": "<user_b_id>", "role": "authenticated"}';
--   select * from professional_profiles where auth_id = '<user_a_id>';
--   reset role;

-- ─────────────────────────────────────────────────────────────────────────────
-- TEST 3: cme_wallets — user B cannot read or write user A's wallet
-- ─────────────────────────────────────────────────────────────────────────────
-- As user B:
--   select * from cme_wallets where professional_id = '<user_a_id>';
--   -- Expected: 0 rows

--   insert into cme_wallets (professional_id, profession, cycle_end_date, required_credits)
--   values ('<user_a_id>', 'Physician', current_date + interval '2 years', 80);
--   -- Expected: error — violates RLS policy (with check: auth.uid() = professional_id)

-- ─────────────────────────────────────────────────────────────────────────────
-- TEST 4: cme_activities — cross-wallet injection attempt (migration 012 fix)
-- ─────────────────────────────────────────────────────────────────────────────
-- As user B, try inserting an activity with user A's wallet_id:
--   insert into cme_activities (professional_id, wallet_id, title, activity_date, credits_claimed, category)
--   values (
--     '<user_b_id>',          -- own professional_id (passes the basic check)
--     '<user_a_wallet_id>',   -- user A's wallet_id (should be REJECTED by 012 policy)
--     'Test',
--     current_date,
--     10,
--     'conference'
--   );
--   -- Expected: error — wallet_id must belong to authenticated user

-- ─────────────────────────────────────────────────────────────────────────────
-- TEST 5: employer_link_requests — professional cannot self-approve (migration 012 fix)
-- ─────────────────────────────────────────────────────────────────────────────
-- As user A (who has a pending request):
--   update employer_link_requests set status = 'approved' where professional_id = '<user_a_id>';
--   -- Expected: error — no UPDATE policy exists for professionals (012 removed it)

-- ─────────────────────────────────────────────────────────────────────────────
-- TEST 6: audit_logs — append-only (no UPDATE or DELETE permitted)
-- ─────────────────────────────────────────────────────────────────────────────
-- As any authenticated user:
--   update audit_logs set action = 'tampered' where id = '<any_audit_log_id>';
--   -- Expected: error — no UPDATE policy on audit_logs

--   delete from audit_logs where id = '<any_audit_log_id>';
--   -- Expected: error — no DELETE policy on audit_logs

-- ─────────────────────────────────────────────────────────────────────────────
-- TEST 7: profile_privacy_settings — only the owner can see their settings
-- ─────────────────────────────────────────────────────────────────────────────
-- As user B:
--   select * from profile_privacy_settings where professional_id = '<user_a_id>';
--   -- Expected: 0 rows

-- ─────────────────────────────────────────────────────────────────────────────
-- TEST 8: professions and specialties — any authenticated user can read, none can write
-- ─────────────────────────────────────────────────────────────────────────────
-- As any authenticated user:
--   select * from professions;   -- Expected: rows returned (public reference data)
--   select * from specialties;   -- Expected: rows returned (public reference data)

--   insert into professions (name) values ('Fake Profession');
--   -- Expected: error — no INSERT policy on professions (read-only for authenticated users)

-- ─────────────────────────────────────────────────────────────────────────────
-- QUICK CHECK: count policies per table (should be ≥ 1 for every table)
-- Expected: all user tables have at least one policy
-- ─────────────────────────────────────────────────────────────────────────────
select
  tablename,
  count(*) as policy_count
from pg_policies
where schemaname = 'public'
group by tablename
order by tablename;

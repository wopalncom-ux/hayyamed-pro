-- 012_rls_hardening.sql
-- Fixes three RLS security gaps found in audit:
--   1. professions/specialties had no RLS — any authenticated user could mutate reference data
--   2. cme_activities INSERT allowed wallet_id pointing to another user's wallet
--   3. employer_link_requests was "for all" — professional could self-approve their own request

-- ── 1. Enable RLS on reference tables ────────────────────────────────────────

alter table professions enable row level security;
alter table specialties  enable row level security;

drop policy if exists "professions_public_read" on professions;
drop policy if exists "specialties_public_read"  on specialties;

create policy "professions_public_read" on professions
  for select using (auth.uid() is not null);

create policy "specialties_public_read" on specialties
  for select using (auth.uid() is not null);

-- No INSERT/UPDATE/DELETE via JWT — write access requires service role (admin only)

-- ── 2. Tighten cme_activities INSERT/UPDATE to validate wallet ownership ──────

drop policy if exists "professionals_own_activities" on cme_activities;

create policy "professionals_own_activities_select" on cme_activities
  for select using (auth.uid() = professional_id);

create policy "professionals_own_activities_insert" on cme_activities
  for insert with check (
    auth.uid() = professional_id
    and wallet_id in (
      select id from cme_wallets where professional_id = auth.uid()
    )
  );

create policy "professionals_own_activities_update" on cme_activities
  for update
  using (auth.uid() = professional_id)
  with check (
    auth.uid() = professional_id
    and wallet_id in (
      select id from cme_wallets where professional_id = auth.uid()
    )
  );

create policy "professionals_own_activities_delete" on cme_activities
  for delete using (auth.uid() = professional_id);

-- ── 3. Split employer_link_requests — remove professional UPDATE/DELETE ───────
-- A professional can submit and view their own requests, but cannot change status.
-- Status transitions (pending → approved/rejected) are employer_admin/service role only.

drop policy if exists "professionals_own_link_requests" on employer_link_requests;

create policy "professionals_own_link_requests_select" on employer_link_requests
  for select using (auth.uid() = professional_id);

create policy "professionals_own_link_requests_insert" on employer_link_requests
  for insert with check (auth.uid() = professional_id);

-- employer_admins_see_link_requests (select-only) from migration 001 is retained as-is.
-- Employer admins update status via createAdminClient() (service role, bypasses RLS).

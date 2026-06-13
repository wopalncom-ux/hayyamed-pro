-- Multi-country CME wallet support
-- Professionals practicing in multiple GCC countries can now track separate compliance cycles.

-- 1. Drop the old single-wallet-per-user constraint
alter table cme_wallets drop constraint if exists cme_wallets_professional_id_key;

-- 2. Add is_primary and label columns
alter table cme_wallets add column if not exists is_primary boolean not null default false;
alter table cme_wallets add column if not exists label text;

-- 3. Mark all existing wallets as primary (every existing user has exactly one)
update cme_wallets set is_primary = true where true;

-- 4. Unique constraint: one row per (professional, country)
alter table cme_wallets
  add constraint cme_wallets_professional_country_unique
  unique (professional_id, country);

-- 5. Index for primary wallet lookups
create index if not exists idx_cme_wallets_primary
  on cme_wallets (professional_id)
  where is_primary = true;

-- ── Employer Required Courses ─────────────────────────────────────────────

create table if not exists employer_required_courses (
  id              uuid        primary key default gen_random_uuid(),
  org_id          uuid        not null references organizations (id) on delete cascade,
  course_id       uuid        not null references courses (id) on delete cascade,
  assigned_by     uuid        references auth.users (id) on delete set null,
  due_date        date,
  note            text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint employer_required_courses_unique unique (org_id, course_id)
);

create index if not exists idx_employer_required_courses_org
  on employer_required_courses (org_id);

create index if not exists idx_employer_required_courses_course
  on employer_required_courses (course_id);

create trigger employer_required_courses_updated_at
  before update on employer_required_courses
  for each row execute function public.set_updated_at();

-- RLS
alter table employer_required_courses enable row level security;

-- ── Auth user lookup helper (used by employer bulk import) ────────────────

create or replace function public.get_auth_user_id_by_email(p_email text)
returns uuid language sql security definer set search_path = public as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1;
$$;

-- Only service_role can call this function
revoke all on function public.get_auth_user_id_by_email(text) from anon, authenticated;
grant execute on function public.get_auth_user_id_by_email(text) to service_role;

drop policy if exists "employer_required_courses_org_read" on employer_required_courses;
create policy "employer_required_courses_org_read"
  on employer_required_courses for select
  using (
    org_id in (
      select organization_id from organization_members where auth_id = auth.uid()
    )
  );

drop policy if exists "employer_required_courses_admin_write" on employer_required_courses;
create policy "employer_required_courses_admin_write"
  on employer_required_courses for all
  using (
    org_id in (
      select organization_id from organization_members
      where auth_id = auth.uid() and role in ('employer_admin', 'master_admin', 'super_admin')
    )
  );

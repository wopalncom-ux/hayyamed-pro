-- ============================================================
-- Hayya Med PRO — Initial Schema
-- Run in Supabase SQL Editor (new project)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── professions / specialties lookup (reference tables) ──────────────────

create table if not exists professions (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists specialties (
  id            uuid primary key default gen_random_uuid(),
  profession_id uuid references professions(id) on delete cascade,
  name          text not null
);

-- ── organizations ─────────────────────────────────────────────────────────

create type org_type as enum ('hospital', 'clinic', 'pharmacy', 'university', 'lab', 'other');

create table if not exists organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       org_type not null default 'other',
  country    text,
  city       text,
  verified   boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── professional_profiles ─────────────────────────────────────────────────

create table if not exists professional_profiles (
  id                     uuid primary key default gen_random_uuid(),
  auth_id                uuid not null unique references auth.users(id) on delete cascade,
  email                  text not null,
  full_name              text,
  date_of_birth          date,
  nationality            text,
  country_of_residence   text default 'Qatar',
  mobile                 text,
  -- professional info
  profession             text,
  specialty              text,
  subspecialty           text,
  license_number         text,
  licensing_authority    text,
  license_expiry         date,
  -- onboarding state
  onboarding_step        smallint not null default 1 check (onboarding_step between 1 and 7),
  onboarding_complete    boolean not null default false,
  profile_completion_pct smallint not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.professional_profiles (auth_id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger professional_profiles_updated_at
  before update on professional_profiles
  for each row execute function public.set_updated_at();

-- ── organization_members ──────────────────────────────────────────────────

create type user_role as enum (
  'healthcare_professional',
  'employer_admin',
  'training_provider_admin',
  'university_admin',
  'master_admin',
  'super_admin'
);

create table if not exists organization_members (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  auth_id         uuid not null references auth.users(id) on delete cascade,
  role            user_role not null default 'employer_admin',
  created_at      timestamptz not null default now(),
  unique (organization_id, auth_id)
);

-- ── employer_link_requests ────────────────────────────────────────────────

create type link_status as enum ('pending', 'approved', 'rejected');

create table if not exists employer_link_requests (
  id                      uuid primary key default gen_random_uuid(),
  professional_id         uuid not null references auth.users(id) on delete cascade,
  organization_id         uuid references organizations(id) on delete set null,
  unverified_employer_name text,
  status                  link_status not null default 'pending',
  requested_at            timestamptz not null default now(),
  resolved_at             timestamptz,
  resolved_by             uuid references auth.users(id) on delete set null,
  check (organization_id is not null or unverified_employer_name is not null)
);

-- ── profile_privacy_settings ──────────────────────────────────────────────

create table if not exists profile_privacy_settings (
  id                                      uuid primary key default gen_random_uuid(),
  professional_id                         uuid not null unique references auth.users(id) on delete cascade,
  employer_can_view_cme_summary           boolean not null default true,
  employer_can_view_certificates          boolean not null default false,
  employer_can_view_license_expiry        boolean not null default true,
  employer_can_view_detailed_cme_activities boolean not null default false,
  employer_can_view_profile_details       boolean not null default true,
  updated_at                              timestamptz not null default now()
);

create trigger privacy_settings_updated_at
  before update on profile_privacy_settings
  for each row execute function public.set_updated_at();

-- ── cme_wallets ───────────────────────────────────────────────────────────

create type compliance_status as enum ('compliant', 'at_risk', 'non_compliant');

create table if not exists cme_wallets (
  id                   uuid primary key default gen_random_uuid(),
  professional_id      uuid not null unique references auth.users(id) on delete cascade,
  country              text not null default 'Qatar',
  profession           text not null,
  specialty            text,
  required_credits     integer not null default 50,
  completed_credits    integer not null default 0,
  renewal_cycle_years  integer not null default 3,
  cycle_start_date     date not null default current_date,
  cycle_end_date       date not null,
  compliance_status    compliance_status not null default 'non_compliant',
  updated_at           timestamptz not null default now()
);

create trigger cme_wallets_updated_at
  before update on cme_wallets
  for each row execute function public.set_updated_at();

-- Auto-update compliance status when credits change
create or replace function public.update_compliance_status()
returns trigger language plpgsql as $$
declare
  pct numeric;
begin
  pct := new.completed_credits::numeric / nullif(new.required_credits, 0) * 100;
  if pct >= 100 then
    new.compliance_status := 'compliant';
  elsif pct >= 60 then
    new.compliance_status := 'at_risk';
  else
    new.compliance_status := 'non_compliant';
  end if;
  return new;
end;
$$;

create trigger cme_wallet_compliance_check
  before insert or update on cme_wallets
  for each row execute function public.update_compliance_status();

-- ── cme_activities ────────────────────────────────────────────────────────

create type verification_status as enum ('pending', 'verified', 'rejected');

create table if not exists cme_activities (
  id                  uuid primary key default gen_random_uuid(),
  wallet_id           uuid not null references cme_wallets(id) on delete cascade,
  professional_id     uuid not null references auth.users(id) on delete cascade,
  title               text not null,
  provider            text,
  activity_date       date not null,
  credits             numeric(5,1) not null check (credits > 0),
  certificate_url     text,
  verification_status verification_status not null default 'pending',
  employer_visible    boolean not null default true,
  created_at          timestamptz not null default now()
);

-- Update wallet completed_credits when activity is verified
create or replace function public.sync_cme_wallet_credits()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update cme_wallets
  set completed_credits = (
    select coalesce(sum(credits), 0)
    from cme_activities
    where wallet_id = coalesce(new.wallet_id, old.wallet_id)
      and verification_status = 'verified'
  )
  where id = coalesce(new.wallet_id, old.wallet_id);
  return null;
end;
$$;

create trigger cme_activity_sync
  after insert or update or delete on cme_activities
  for each row execute function public.sync_cme_wallet_credits();

-- ── audit_logs ─────────────────────────────────────────────────────────────

create table if not exists audit_logs (
  id            uuid primary key default gen_random_uuid(),
  actor_auth_id uuid references auth.users(id) on delete set null,
  action        text not null,
  target_table  text,
  target_id     uuid,
  metadata      jsonb,
  created_at    timestamptz not null default now()
);

-- ── Row Level Security ─────────────────────────────────────────────────────

alter table professional_profiles enable row level security;
alter table profile_privacy_settings enable row level security;
alter table cme_wallets enable row level security;
alter table cme_activities enable row level security;
alter table employer_link_requests enable row level security;
alter table organization_members enable row level security;
alter table organizations enable row level security;
alter table audit_logs enable row level security;

-- professional_profiles: users see only their own row
create policy "professionals_own_profile"
  on professional_profiles for all
  using (auth.uid() = auth_id)
  with check (auth.uid() = auth_id);

-- profile_privacy_settings: user owns their settings
create policy "professionals_own_privacy"
  on profile_privacy_settings for all
  using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);

-- cme_wallets: user owns their wallet
create policy "professionals_own_wallet"
  on cme_wallets for all
  using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);

-- cme_activities: user owns their activities
create policy "professionals_own_activities"
  on cme_activities for all
  using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);

-- employer_link_requests: professional sees their requests; employer_admin sees requests for their org
create policy "professionals_own_link_requests"
  on employer_link_requests for all
  using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);

create policy "employer_admins_see_link_requests"
  on employer_link_requests for select
  using (
    organization_id in (
      select organization_id from organization_members
      where auth_id = auth.uid() and role = 'employer_admin'
    )
  );

-- organizations: anyone authenticated can read; only super_admin can write
create policy "organizations_public_read"
  on organizations for select
  using (auth.uid() is not null);

-- organization_members: members see their own row
create policy "members_own_row"
  on organization_members for select
  using (auth.uid() = auth_id);

-- audit_logs: only super_admin (handled via service role)
create policy "no_direct_audit_access"
  on audit_logs for all
  using (false);

-- ── Seed data: common organizations in Qatar ──────────────────────────────

insert into organizations (name, type, country, city, verified) values
  ('Hamad Medical Corporation', 'hospital', 'Qatar', 'Doha', true),
  ('Sidra Medicine', 'hospital', 'Qatar', 'Doha', true),
  ('Al Ahli Hospital', 'hospital', 'Qatar', 'Doha', true),
  ('The View Hospital', 'hospital', 'Qatar', 'Doha', true),
  ('Aster DM Healthcare', 'clinic', 'Qatar', 'Doha', true),
  ('Al Emadi Hospital', 'hospital', 'Qatar', 'Doha', true),
  ('Qatar University Health', 'university', 'Qatar', 'Doha', true),
  ('Weill Cornell Medicine Qatar', 'university', 'Qatar', 'Doha', true),
  ('Primary Health Care Corporation', 'clinic', 'Qatar', 'Doha', true)
on conflict do nothing;

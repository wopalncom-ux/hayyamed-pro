-- ============================================================
-- Hayya Med PRO — ALL 28 MIGRATIONS COMBINED
-- Paste this entire file into the Supabase SQL Editor and Run.
-- Idempotent: safe to run on a fresh project.
-- Generated: 2026-06-13
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- MIGRATION 001 — Initial Schema
-- ════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";

create table if not exists professions (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists specialties (
  id            uuid primary key default gen_random_uuid(),
  profession_id uuid references professions(id) on delete cascade,
  name          text not null
);

DO $$ BEGIN CREATE TYPE org_type AS ENUM ('hospital', 'clinic', 'pharmacy', 'university', 'lab', 'other'); EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

create table if not exists organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       org_type not null default 'other',
  country    text,
  city       text,
  verified   boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists professional_profiles (
  id                     uuid primary key default gen_random_uuid(),
  auth_id                uuid not null unique references auth.users(id) on delete cascade,
  email                  text not null,
  full_name              text,
  date_of_birth          date,
  nationality            text,
  country_of_residence   text default 'Qatar',
  mobile                 text,
  profession             text,
  specialty              text,
  subspecialty           text,
  license_number         text,
  licensing_authority    text,
  license_expiry         date,
  onboarding_step        smallint not null default 1 check (onboarding_step between 1 and 7),
  onboarding_complete    boolean not null default false,
  profile_completion_pct smallint not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

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

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists professional_profiles_updated_at on professional_profiles;
create trigger professional_profiles_updated_at
  before update on professional_profiles
  for each row execute function public.set_updated_at();

DO $$ BEGIN CREATE TYPE user_role AS ENUM ('healthcare_professional','employer_admin','training_provider_admin','university_admin','master_admin','super_admin'); EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

create table if not exists organization_members (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  auth_id         uuid not null references auth.users(id) on delete cascade,
  role            user_role not null default 'employer_admin',
  created_at      timestamptz not null default now(),
  unique (organization_id, auth_id)
);

DO $$ BEGIN CREATE TYPE link_status AS ENUM ('pending', 'approved', 'rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

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

drop trigger if exists privacy_settings_updated_at on profile_privacy_settings;
create trigger privacy_settings_updated_at
  before update on profile_privacy_settings
  for each row execute function public.set_updated_at();

DO $$ BEGIN CREATE TYPE compliance_status AS ENUM ('compliant', 'at_risk', 'non_compliant'); EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

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

drop trigger if exists cme_wallets_updated_at on cme_wallets;
create trigger cme_wallets_updated_at
  before update on cme_wallets
  for each row execute function public.set_updated_at();

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

drop trigger if exists cme_wallet_compliance_check on cme_wallets;
create trigger cme_wallet_compliance_check
  before insert or update on cme_wallets
  for each row execute function public.update_compliance_status();

DO $$ BEGIN CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

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

drop trigger if exists cme_activity_sync on cme_activities;
create trigger cme_activity_sync
  after insert or update or delete on cme_activities
  for each row execute function public.sync_cme_wallet_credits();

create table if not exists audit_logs (
  id            uuid primary key default gen_random_uuid(),
  actor_auth_id uuid references auth.users(id) on delete set null,
  action        text not null,
  target_table  text,
  target_id     uuid,
  metadata      jsonb,
  created_at    timestamptz not null default now()
);

alter table professional_profiles    enable row level security;
alter table profile_privacy_settings enable row level security;
alter table cme_wallets              enable row level security;
alter table cme_activities           enable row level security;
alter table employer_link_requests   enable row level security;
alter table organization_members     enable row level security;
alter table organizations            enable row level security;
alter table audit_logs               enable row level security;

drop policy if exists "professionals_own_profile" on professional_profiles;
create policy "professionals_own_profile"
  on professional_profiles for all
  using (auth.uid() = auth_id)
  with check (auth.uid() = auth_id);

drop policy if exists "professionals_own_privacy" on profile_privacy_settings;
create policy "professionals_own_privacy"
  on profile_privacy_settings for all
  using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);

drop policy if exists "professionals_own_wallet" on cme_wallets;
create policy "professionals_own_wallet"
  on cme_wallets for all
  using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);

drop policy if exists "professionals_own_activities" on cme_activities;
create policy "professionals_own_activities"
  on cme_activities for all
  using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);

drop policy if exists "professionals_own_link_requests" on employer_link_requests;
create policy "professionals_own_link_requests"
  on employer_link_requests for all
  using (auth.uid() = professional_id)
  with check (auth.uid() = professional_id);

drop policy if exists "employer_admins_see_link_requests" on employer_link_requests;
create policy "employer_admins_see_link_requests"
  on employer_link_requests for select
  using (
    organization_id in (
      select organization_id from organization_members
      where auth_id = auth.uid() and role = 'employer_admin'
    )
  );

drop policy if exists "organizations_public_read" on organizations;
create policy "organizations_public_read"
  on organizations for select
  using (auth.uid() is not null);

drop policy if exists "members_own_row" on organization_members;
create policy "members_own_row"
  on organization_members for select
  using (auth.uid() = auth_id);

drop policy if exists "no_direct_audit_access" on audit_logs;
create policy "no_direct_audit_access"
  on audit_logs for all
  using (false);

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

-- ════════════════════════════════════════════════════════════
-- MIGRATION 002 — GCC Licensing Authorities
-- ════════════════════════════════════════════════════════════

create table if not exists licensing_authorities (
  id                  uuid        primary key default gen_random_uuid(),
  country             text        not null,
  country_code        text        not null,
  authority_name      text        not null,
  abbreviation        text        not null unique,
  required_credits    integer     not null default 50,
  renewal_cycle_years integer     not null default 3,
  website_url         text,
  is_active           boolean     not null default true,
  created_at          timestamptz not null default now(),

  constraint country_code_gcc check (
    country_code in ('QA', 'AE', 'SA', 'KW', 'BH', 'OM')
  )
);

alter table licensing_authorities enable row level security;

drop policy if exists "licensing_authorities_public_read" on licensing_authorities;
create policy "licensing_authorities_public_read"
  on licensing_authorities for select using (true);

alter table professional_profiles
  add column if not exists licensing_authority_id uuid
    references licensing_authorities (id) on delete set null;

insert into licensing_authorities
  (country, country_code, authority_name, abbreviation, required_credits, renewal_cycle_years, website_url)
values
  ('Qatar',        'QA', 'Qatar Council for Healthcare Practitioners',   'QCHP',    50, 3, 'https://www.qchp.org.qa'),
  ('UAE',          'AE', 'Department of Health – Abu Dhabi',             'DOH-AD',  60, 3, 'https://www.doh.gov.ae'),
  ('UAE',          'AE', 'Dubai Health Authority',                       'DHA',     60, 3, 'https://www.dha.gov.ae'),
  ('UAE',          'AE', 'Ministry of Health and Prevention UAE',        'MOH-UAE', 60, 3, 'https://www.mohap.gov.ae'),
  ('Saudi Arabia', 'SA', 'Saudi Commission for Health Specialties',      'SCFHS',   60, 5, 'https://www.scfhs.org.sa'),
  ('Kuwait',       'KW', 'Ministry of Health Kuwait',                    'MOH-KW',  30, 2, null),
  ('Bahrain',      'BH', 'National Health Regulatory Authority',         'NHRA',    50, 3, 'https://www.nhra.bh'),
  ('Oman',         'OM', 'Oman Medical Specialty Board',                 'OMSB',    50, 3, 'https://www.omsb.org')
on conflict (abbreviation) do nothing;

update professional_profiles pp
set    licensing_authority_id = la.id
from   licensing_authorities la
where  pp.licensing_authority_id is null
  and  (
    upper(pp.licensing_authority) like '%' || la.abbreviation || '%'
    or upper(pp.licensing_authority) like '%' || upper(la.abbreviation) || '%'
  );

-- ════════════════════════════════════════════════════════════
-- MIGRATION 003 — Subscriptions (Paddle)
-- ════════════════════════════════════════════════════════════

create table if not exists subscriptions (
  id                       uuid        primary key default gen_random_uuid(),
  professional_id          uuid        not null unique references professional_profiles (auth_id) on delete cascade,
  paddle_customer_id       text        unique,
  paddle_subscription_id   text        unique,
  plan                     text        not null default 'free',
  status                   text        not null default 'active',
  current_period_end       timestamptz,
  cancel_at_period_end     boolean     not null default false,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),

  constraint plan_values   check (plan   in ('free', 'pro', 'employer')),
  constraint status_values check (status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete'))
);

alter table subscriptions enable row level security;

drop policy if exists "subscriptions_own_read" on subscriptions;
create policy "subscriptions_own_read"
  on subscriptions for select
  using (professional_id = auth.uid());

drop trigger if exists set_subscriptions_updated_at on subscriptions;
create trigger set_subscriptions_updated_at
  before update on subscriptions
  for each row execute function public.set_updated_at();

create or replace function handle_new_subscription()
returns trigger language plpgsql security definer as $$
begin
  insert into subscriptions (professional_id, plan, status)
  values (new.auth_id, 'free', 'active')
  on conflict (professional_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created_subscription on professional_profiles;
create trigger on_profile_created_subscription
  after insert on professional_profiles
  for each row execute function handle_new_subscription();

insert into subscriptions (professional_id, plan, status)
select auth_id, 'free', 'active'
from   professional_profiles
on conflict (professional_id) do nothing;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 004 — Country Rules Engine
-- ════════════════════════════════════════════════════════════

create table if not exists country_compliance_rules (
  id                        uuid        primary key default gen_random_uuid(),
  country_code              text        not null,
  authority_id              uuid        references licensing_authorities (id) on delete set null,
  profession_code           text        not null default 'all',
  cycle_years               int         not null default 1,
  total_credits_required    int         not null default 50,
  credit_terminology        text        not null default 'CME',
  online_credits_max_pct    int         not null default 50,
  mandatory_credits_min     int         not null default 0,
  self_reported_allowed     boolean     not null default true,
  grace_period_days         int         not null default 30,
  employer_report_required  boolean     not null default false,
  employer_report_format    text,
  notes                     text,
  effective_from            date        not null default current_date,
  effective_to              date,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),

  constraint credit_terminology_values check (credit_terminology in ('CME', 'CPD', 'PDU', 'CE')),
  constraint cycle_years_positive check (cycle_years > 0),
  constraint credits_positive check (total_credits_required > 0),
  constraint online_pct_range check (online_credits_max_pct between 0 and 100)
);

create index if not exists idx_country_rules_country on country_compliance_rules (country_code);
create index if not exists idx_country_rules_authority on country_compliance_rules (authority_id);

alter table country_compliance_rules enable row level security;

drop policy if exists "country_rules_public_read" on country_compliance_rules;
create policy "country_rules_public_read" on country_compliance_rules
  for select using (true);

drop trigger if exists set_country_compliance_rules_updated_at on country_compliance_rules;
create trigger set_country_compliance_rules_updated_at
  before update on country_compliance_rules
  for each row execute function public.set_updated_at();

create table if not exists compliance_activity_categories (
  id                      uuid    primary key default gen_random_uuid(),
  country_code            text    not null,
  authority_id            uuid    references licensing_authorities (id) on delete set null,
  category_name           text    not null,
  max_credits_per_cycle   int,
  min_credits_per_cycle   int     not null default 0,
  credits_per_hour        numeric(4,2) not null default 1.0,
  accreditation_required  boolean not null default false,
  accepted_accreditors    jsonb,
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_activity_categories_country on compliance_activity_categories (country_code);

alter table compliance_activity_categories enable row level security;

drop policy if exists "activity_categories_public_read" on compliance_activity_categories;
create policy "activity_categories_public_read" on compliance_activity_categories
  for select using (true);

drop trigger if exists set_compliance_activity_categories_updated_at on compliance_activity_categories;
create trigger set_compliance_activity_categories_updated_at
  before update on compliance_activity_categories
  for each row execute function public.set_updated_at();

-- Seed placeholder rules (replaced by migration 010 for QA and migration 024 for others)
insert into country_compliance_rules
  (country_code, profession_code, cycle_years, total_credits_required, credit_terminology,
   online_credits_max_pct, mandatory_credits_min, self_reported_allowed,
   grace_period_days, employer_report_required, notes)
values
  ('QA', 'all',    1, 50, 'CME', 50, 0,  true,  30, false, 'QCHP general rule — placeholder, replaced by migration 010'),
  ('SA', 'all',    1, 50, 'CME', 50, 10, false, 60, true,  'SCFHS — placeholder, replaced by migration 024'),
  ('AE-DU', 'all', 2, 40, 'CME', 50, 5,  false, 90, true,  'DHA Dubai — placeholder, replaced by migration 024'),
  ('AE-AZ', 'all', 2, 40, 'CPD', 50, 0,  true,  60, false, 'DOH Abu Dhabi — placeholder, replaced by migration 024'),
  ('KW', 'all',    1, 30, 'CME', 30, 0,  true,  30, false, 'MOH Kuwait — placeholder, replaced by migration 024'),
  ('BH', 'all',    2, 40, 'CPD', 50, 0,  true,  60, false, 'NHRA Bahrain — placeholder, replaced by migration 024'),
  ('OM', 'all',    2, 40, 'CME', 50, 0,  true,  30, false, 'OMSB Oman — placeholder, replaced by migration 024')
on conflict do nothing;

insert into compliance_activity_categories
  (country_code, category_name, max_credits_per_cycle, credits_per_hour, accreditation_required, notes)
values
  ('QA', 'conference', 25, 1.0, true,  'Placeholder — replaced by migration 010'),
  ('QA', 'online',     25, 1.0, true,  'Placeholder — replaced by migration 010'),
  ('QA', 'workshop',   null, 1.0, true,'Placeholder — replaced by migration 010'),
  ('SA', 'conference', 25, 1.0, true,  'Placeholder — replaced by migration 024'),
  ('SA', 'online',     25, 1.0, true,  'Placeholder — replaced by migration 024'),
  ('SA', 'mandatory',  10, 1.0, true,  'Placeholder — replaced by migration 024'),
  ('AE-DU', 'conference',    20, 1.0, true, 'Placeholder — replaced by migration 024'),
  ('AE-DU', 'online',        20, 1.0, true, 'Placeholder — replaced by migration 024'),
  ('AE-DU', 'patient_safety', 5, 1.0, true, 'Placeholder — replaced by migration 024')
on conflict do nothing;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 005 — Push Subscriptions
-- ════════════════════════════════════════════════════════════

create table if not exists push_subscriptions (
  id              uuid        primary key default gen_random_uuid(),
  professional_id uuid        not null references auth.users (id) on delete cascade,
  endpoint        text        not null,
  p256dh          text        not null,
  auth            text        not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint push_subscriptions_unique unique (professional_id, endpoint)
);

create index if not exists idx_push_subscriptions_professional on push_subscriptions (professional_id);

alter table push_subscriptions enable row level security;

drop policy if exists "push_own_read" on push_subscriptions;
create policy "push_own_read" on push_subscriptions
  for select using (auth.uid() = professional_id);

drop policy if exists "push_own_insert" on push_subscriptions;
create policy "push_own_insert" on push_subscriptions
  for insert with check (auth.uid() = professional_id);

drop policy if exists "push_own_delete" on push_subscriptions;
create policy "push_own_delete" on push_subscriptions
  for delete using (auth.uid() = professional_id);

drop trigger if exists set_push_subscriptions_updated_at on push_subscriptions;
create trigger set_push_subscriptions_updated_at
  before update on push_subscriptions
  for each row execute function public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- MIGRATION 006 — Training Marketplace
-- ════════════════════════════════════════════════════════════

create table if not exists training_providers (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  description     text,
  website_url     text,
  country_code    text        not null default 'QA',
  is_accredited   boolean     not null default false,
  accreditor      text,
  logo_url        text,
  contact_email   text,
  status          text        not null default 'pending',
  created_by      uuid        references auth.users (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint provider_status_values check (status in ('pending', 'active', 'suspended'))
);

create table if not exists courses (
  id                  uuid        primary key default gen_random_uuid(),
  provider_id         uuid        not null references training_providers (id) on delete cascade,
  title               text        not null,
  description         text,
  category            text        not null,
  credits             numeric(5,2) not null default 1,
  credit_type         text        not null default 'CME',
  delivery_mode       text        not null default 'online',
  duration_hours      numeric(5,1),
  price_usd           numeric(10,2),
  is_free             boolean     not null default false,
  country_codes       text[]      not null default '{QA}',
  professions         text[]      not null default '{all}',
  start_date          date,
  end_date            date,
  enrollment_deadline date,
  max_enrollments     int,
  status              text        not null default 'draft',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint course_status_values check (status in ('draft', 'active', 'closed', 'cancelled')),
  constraint delivery_mode_values check (delivery_mode in ('online', 'in_person', 'hybrid')),
  constraint credits_positive check (credits > 0)
);

create index if not exists idx_courses_provider on courses (provider_id);
create index if not exists idx_courses_status on courses (status);
create index if not exists idx_courses_country on courses using gin (country_codes);

create table if not exists course_enrollments (
  id              uuid        primary key default gen_random_uuid(),
  course_id       uuid        not null references courses (id) on delete cascade,
  professional_id uuid        not null references auth.users (id) on delete cascade,
  enrolled_at     timestamptz not null default now(),
  completed_at    timestamptz,
  credits_issued  numeric(5,2),
  status          text        not null default 'enrolled',
  certificate_url text,

  constraint enrollment_unique unique (course_id, professional_id),
  constraint enrollment_status_values check (status in ('enrolled', 'in_progress', 'completed', 'cancelled'))
);

create index if not exists idx_enrollments_professional on course_enrollments (professional_id);
create index if not exists idx_enrollments_course on course_enrollments (course_id);

alter table training_providers enable row level security;
alter table courses             enable row level security;
alter table course_enrollments  enable row level security;

drop policy if exists "providers_public_read" on training_providers;
create policy "providers_public_read" on training_providers for select using (status = 'active');

drop policy if exists "courses_public_read" on courses;
create policy "courses_public_read" on courses for select using (status = 'active');

drop policy if exists "enrollments_own" on course_enrollments;
create policy "enrollments_own" on course_enrollments for all using (auth.uid() = professional_id);

drop trigger if exists set_training_providers_updated_at on training_providers;
create trigger set_training_providers_updated_at
  before update on training_providers
  for each row execute function public.set_updated_at();

drop trigger if exists set_courses_updated_at on courses;
create trigger set_courses_updated_at
  before update on courses
  for each row execute function public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- MIGRATION 007 — CME Activity Category
-- ════════════════════════════════════════════════════════════

alter table cme_activities
  add column if not exists category text
    check (
      category is null
      or category in (
        'conference', 'online', 'workshop', 'journal',
        'teaching', 'simulation', 'mandatory', 'patient_safety', 'other'
      )
    );

-- ════════════════════════════════════════════════════════════
-- MIGRATION 008 — Marketplace Admin Policies
-- ════════════════════════════════════════════════════════════

drop policy if exists "provider_owner_select" on training_providers;
create policy "provider_owner_select" on training_providers
  for select using (auth.uid() = created_by);

drop policy if exists "provider_owner_insert" on training_providers;
create policy "provider_owner_insert" on training_providers
  for insert with check (auth.uid() = created_by);

drop policy if exists "provider_owner_update" on training_providers;
create policy "provider_owner_update" on training_providers
  for update using (auth.uid() = created_by AND status != 'suspended');

drop policy if exists "course_owner_select" on courses;
create policy "course_owner_select" on courses
  for select using (
    provider_id in (
      select id from training_providers where created_by = auth.uid()
    )
  );

drop policy if exists "course_owner_insert" on courses;
create policy "course_owner_insert" on courses
  for insert with check (
    provider_id in (
      select id from training_providers where created_by = auth.uid() and status = 'active'
    )
  );

drop policy if exists "course_owner_update" on courses;
create policy "course_owner_update" on courses
  for update using (
    provider_id in (
      select id from training_providers where created_by = auth.uid()
    )
  );

drop policy if exists "course_owner_delete" on courses;
create policy "course_owner_delete" on courses
  for delete using (
    provider_id in (
      select id from training_providers where created_by = auth.uid()
    )
    and status = 'draft'
  );

drop policy if exists "provider_enrollment_read" on course_enrollments;
create policy "provider_enrollment_read" on course_enrollments
  for select using (
    course_id in (
      select c.id from courses c
      join training_providers tp on tp.id = c.provider_id
      where tp.created_by = auth.uid()
    )
  );

drop policy if exists "provider_enrollment_update" on course_enrollments;
create policy "provider_enrollment_update" on course_enrollments
  for update using (
    course_id in (
      select c.id from courses c
      join training_providers tp on tp.id = c.provider_id
      where tp.created_by = auth.uid()
    )
  );

-- ════════════════════════════════════════════════════════════
-- MIGRATION 009 — Employer Department
-- ════════════════════════════════════════════════════════════

ALTER TABLE employer_link_requests ADD COLUMN IF NOT EXISTS department text;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 010 — Qatar DHP-AS Accurate Rules
-- ════════════════════════════════════════════════════════════

delete from compliance_activity_categories where country_code = 'QA';
delete from country_compliance_rules where country_code = 'QA';

insert into country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required, credit_terminology,
  online_credits_max_pct, mandatory_credits_min, self_reported_allowed,
  grace_period_days, employer_report_required, effective_from, notes
)
values
  ('QA', 'physician',  2, 80, 'CPD', 100, 40, true, 0, false, '2016-03-07',
   'DHP-AS Qatar. 2yr cycle. 80 credits/cycle. 40 min/year. MANDATORY: min 40 Cat1 + min 40 Cat2/Cat3. No grace period. Policy MOPH/DHP/AS/CPD/002 v4.3.'),
  ('QA', 'nurse',      2, 80, 'CPD', 100, 40, true, 0, false, '2016-03-07',
   'DHP-AS Qatar. Same 2yr/80cr framework. MANDATORY: min 40 Cat1 + min 40 Cat2/Cat3. Policy MOPH/DHP/AS/CPD/002 v4.3.'),
  ('QA', 'pharmacist', 2, 80, 'CPD', 100, 40, true, 0, false, '2016-03-07',
   'DHP-AS Qatar. Same 2yr/80cr framework. MANDATORY: min 40 Cat1 + min 40 Cat2/Cat3. Policy MOPH/DHP/AS/CPD/002 v4.3.'),
  ('QA', 'dentist',    2, 80, 'CPD', 100, 40, true, 0, false, '2016-03-07',
   'DHP-AS Qatar. Same 2yr/80cr framework. MANDATORY: min 40 Cat1 + min 40 Cat2/Cat3. Policy MOPH/DHP/AS/CPD/002 v4.3.'),
  ('QA', 'ahp',        2, 80, 'CPD', 100, 40, true, 0, false, '2016-03-07',
   'DHP-AS Qatar. Allied Health Professionals. Same 2yr/80cr CPD framework. Policy MOPH/DHP/AS/CPD/002 v4.3.')
;

insert into compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, accepted_accreditors, notes
)
values
  ('QA', 'cat1_conference_seminar_symposia', 0, null, 1.0, true,
   '["ACCME_USA","AAFP","AMA_PRA","RCPSC_Canada","CFPC_Canada","Federation_Royal_Colleges_UK","RCGP_UK","RCS_UK","UEMS_EACCME","EBAC","AMC_Australia","RACGP","RACP","SCFHS_Saudi","DHA_Dubai","DOH_AbuDhabi","OMSB_Oman","NHRA_Bahrain"]',
   'Category 1 — Accredited Group Learning. Conferences, symposia, seminars. 1 credit/hour.'),
  ('QA', 'cat1_workshop', 0, null, 1.0, true, null,
   'Category 1 — Accredited Group Learning. Hands-on workshops. 1 credit/hour.'),
  ('QA', 'cat1_educational_rounds', 0, null, 1.0, true, null,
   'Category 1 — Educational rounds: Grand rounds, M&M, tumor boards. 1 credit/hour.'),
  ('QA', 'cat1_journal_club', 0, null, 1.0, true, null,
   'Category 1 — Formally organized journal clubs. 1 credit/hour.'),
  ('QA', 'cat1_online_synchronous', 0, null, 1.0, true, null,
   'Category 1 — Online synchronous or blended learning. 1 credit/hour. List B accreditors only.'),
  ('QA', 'cat2_clinical_question_answering', 0, null, 0.5, false, null,
   'Category 2 — Self-Directed (Clinical Practice). Answering clinical questions. 0.5 credits/hour.'),
  ('QA', 'cat2_reading_journals_books', 0, null, 1.0, false, null,
   'Category 2 — Self-Directed (Clinical Practice). Reading journals/books. 1 credit/hour.'),
  ('QA', 'cat2_self_learning_modules', 0, null, 1.0, false, null,
   'Category 2 — Self-Directed (Clinical Practice). Asynchronous eLearning modules. 1 credit/hour.'),
  ('QA', 'cat2_podcasts_webcasts', 0, null, 0.5, false, null,
   'Category 2 — Self-Directed (Clinical Practice). Asynchronous podcasts/webcasts. 0.5 credits/hour.'),
  ('QA', 'cat2_postgraduate_degree_diploma', 0, null, 25.0, false, null,
   'Category 2 — Self-Directed (Education). Postgraduate degree/diploma. 25 credits/semester.'),
  ('QA', 'cat2_formal_teaching_preparation', 0, null, 2.0, false, null,
   'Category 2 — Self-Directed (Education). Preparation for formal teaching. 2 credits/hour.'),
  ('QA', 'cat2_assessment_tool_development', 0, null, 2.0, false, null,
   'Category 2 — Self-Directed (Education). OSCE/MCQ development. 2 credits/hour.'),
  ('QA', 'cat2_mentoring_preparation', 0, null, 1.0, false, null,
   'Category 2 — Self-Directed (Education). Preparation for mentoring. 1 credit/hour.'),
  ('QA', 'cat2_research_publication_development', 0, null, 1.0, false, null,
   'Category 2 — Self-Directed (Research). Grant/publication development. 1 credit/hour.'),
  ('QA', 'cat2_peer_review_clinical_practice', 0, null, 1.0, false, null,
   'Category 2 — Self-Directed (Research). Peer review of clinical practice. 1 credit/hour.'),
  ('QA', 'cat2_peer_review_journals_grants', 0, null, 1.0, false, null,
   'Category 2 — Self-Directed (Research). Peer review for journals/grants. 1 credit/hour.'),
  ('QA', 'cat2_quality_improvement_project', 0, null, 10.0, false, null,
   'Category 2 — Self-Directed (Research). QI projects. 10 credits/completed project.'),
  ('QA', 'cat3_knowledge_assessment', 0, null, 2.0, true, null,
   'Category 3 — Assessment Activities. Knowledge assessment/exams. 2 credits/hour.'),
  ('QA', 'cat3_simulation', 0, null, 2.0, true, null,
   'Category 3 — Assessment Activities. Simulation-based assessment. 2 credits/hour.'),
  ('QA', 'cat3_clinical_audit', 0, null, 2.0, true, null,
   'Category 3 — Assessment Activities. Clinical audits. 2 credits/hour.'),
  ('QA', 'cat3_multisource_feedback', 0, null, 2.0, true, null,
   'Category 3 — Assessment Activities. 360-degree feedback. 2 credits/hour.'),
  ('QA', 'cat3_direct_observation', 0, null, 2.0, true, null,
   'Category 3 — Assessment Activities. DOPS, mini-CEX. 2 credits/hour.'),
  ('QA', 'cat3_performance_review_feedback', 0, null, 2.0, false, null,
   'Category 3 — Assessment Activities. Annual performance review feedback. 2 credits/hour.'),
  ('QA', 'cat3_teaching_effectiveness_feedback', 0, null, 2.0, false, null,
   'Category 3 — Assessment Activities. Teaching effectiveness feedback. 2 credits/hour.')
;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 011 — Employer Actions (Tasks + Notifications)
-- ════════════════════════════════════════════════════════════

create table if not exists employer_tasks (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  assigned_to     uuid not null references auth.users(id) on delete cascade,
  assigned_by     uuid references auth.users(id) on delete set null,
  title           text not null,
  message         text,
  category        text,
  credits_target  int,
  due_date        date,
  status          text not null default 'pending'
                  check (status in ('pending', 'acknowledged', 'completed')),
  acknowledged_at timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_employer_tasks_org         on employer_tasks(organization_id);
create index if not exists idx_employer_tasks_assigned_to on employer_tasks(assigned_to);
create index if not exists idx_employer_tasks_status      on employer_tasks(status);

create table if not exists employer_notifications (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  recipient_id    uuid not null references auth.users(id) on delete cascade,
  sender_id       uuid references auth.users(id) on delete set null,
  type            text not null
                  check (type in ('compliance_reminder', 'task_assigned', 'general')),
  subject         text not null,
  message         text not null,
  sent_via_email  boolean not null default false,
  read_at         timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_employer_notifications_recipient on employer_notifications(recipient_id);
create index if not exists idx_employer_notifications_org       on employer_notifications(organization_id);

alter table employer_tasks         enable row level security;
alter table employer_notifications enable row level security;

drop policy if exists "employer_manage_tasks"  on employer_tasks;
drop policy if exists "staff_view_own_tasks"   on employer_tasks;
drop policy if exists "staff_update_own_tasks" on employer_tasks;
drop policy if exists "admin_all_tasks"        on employer_tasks;

create policy "employer_manage_tasks" on employer_tasks for all
  using (
    organization_id in (
      select organization_id from organization_members
      where auth_id = auth.uid() and role = 'employer_admin'
    )
  );

create policy "staff_view_own_tasks" on employer_tasks for select
  using (auth.uid() = assigned_to);

create policy "staff_update_own_tasks" on employer_tasks for update
  using (auth.uid() = assigned_to)
  with check (auth.uid() = assigned_to);

create policy "admin_all_tasks" on employer_tasks for all
  using (
    exists (
      select 1 from organization_members
      where auth_id = auth.uid() and role in ('master_admin', 'super_admin')
    )
  );

drop policy if exists "employer_manage_notifications"    on employer_notifications;
drop policy if exists "staff_view_own_notifications"     on employer_notifications;
drop policy if exists "staff_update_own_notifications"   on employer_notifications;
drop policy if exists "admin_all_notifications"          on employer_notifications;

create policy "employer_manage_notifications" on employer_notifications for all
  using (
    organization_id in (
      select organization_id from organization_members
      where auth_id = auth.uid() and role = 'employer_admin'
    )
  );

create policy "staff_view_own_notifications" on employer_notifications for select
  using (auth.uid() = recipient_id);

create policy "staff_update_own_notifications" on employer_notifications for update
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);

create policy "admin_all_notifications" on employer_notifications for all
  using (
    exists (
      select 1 from organization_members
      where auth_id = auth.uid() and role in ('master_admin', 'super_admin')
    )
  );

-- ════════════════════════════════════════════════════════════
-- MIGRATION 012 — RLS Hardening
-- ════════════════════════════════════════════════════════════

alter table professions enable row level security;
alter table specialties  enable row level security;

drop policy if exists "professions_public_read" on professions;
drop policy if exists "specialties_public_read"  on specialties;

create policy "professions_public_read" on professions
  for select using (auth.uid() is not null);

create policy "specialties_public_read" on specialties
  for select using (auth.uid() is not null);

drop policy if exists "professionals_own_activities"        on cme_activities;
drop policy if exists "professionals_own_activities_select" on cme_activities;
drop policy if exists "professionals_own_activities_insert" on cme_activities;
drop policy if exists "professionals_own_activities_update" on cme_activities;
drop policy if exists "professionals_own_activities_delete" on cme_activities;

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

drop policy if exists "professionals_own_link_requests"        on employer_link_requests;
drop policy if exists "professionals_own_link_requests_select" on employer_link_requests;
drop policy if exists "professionals_own_link_requests_insert" on employer_link_requests;

create policy "professionals_own_link_requests_select" on employer_link_requests
  for select using (auth.uid() = professional_id);

create policy "professionals_own_link_requests_insert" on employer_link_requests
  for insert with check (auth.uid() = professional_id);

-- ════════════════════════════════════════════════════════════
-- MIGRATION 013 — Schema Standards (updated_at columns)
-- ════════════════════════════════════════════════════════════

ALTER TABLE organizations ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE professions    ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE specialties    ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS organizations_updated_at ON organizations;
CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS professions_updated_at ON professions;
CREATE TRIGGER professions_updated_at
  BEFORE UPDATE ON professions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS specialties_updated_at ON specialties;
CREATE TRIGGER specialties_updated_at
  BEFORE UPDATE ON specialties
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- MIGRATION 014 — Timestamp Standards
-- ════════════════════════════════════════════════════════════

ALTER TABLE professions              ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE specialties              ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE profile_privacy_settings ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE cme_wallets              ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE organization_members ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
DROP TRIGGER IF EXISTS organization_members_updated_at ON organization_members;
CREATE TRIGGER organization_members_updated_at
  BEFORE UPDATE ON organization_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE employer_link_requests ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
DROP TRIGGER IF EXISTS employer_link_requests_updated_at ON employer_link_requests;
CREATE TRIGGER employer_link_requests_updated_at
  BEFORE UPDATE ON employer_link_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE cme_activities ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
DROP TRIGGER IF EXISTS cme_activities_updated_at ON cme_activities;
CREATE TRIGGER cme_activities_updated_at
  BEFORE UPDATE ON cme_activities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE course_enrollments ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
DROP TRIGGER IF EXISTS course_enrollments_updated_at ON course_enrollments;
CREATE TRIGGER course_enrollments_updated_at
  BEFORE UPDATE ON course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- MIGRATION 015 — CME Rejection Reason
-- ════════════════════════════════════════════════════════════

alter table cme_activities
  add column if not exists rejection_reason text;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 016 — Platform Settings
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS platform_settings (
  key         text PRIMARY KEY,
  value       text NOT NULL,
  description text,
  updated_at  timestamptz DEFAULT now(),
  updated_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin write platform_settings" ON platform_settings;
CREATE POLICY "Admin write platform_settings" ON platform_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Authenticated read platform_settings" ON platform_settings;
CREATE POLICY "Authenticated read platform_settings" ON platform_settings
  FOR SELECT USING (auth.uid() IS NOT NULL);

INSERT INTO platform_settings (key, value, description) VALUES
  ('pro_price_monthly',           '6.00',    'Pro plan monthly price (USD)'),
  ('pro_price_annual',            '61.20',   'Pro plan annual price (USD)'),
  ('pro_annual_discount_pct',     '15',      'Annual discount % shown on Pro plan'),
  ('employer_clinic_monthly',     '50.00',   'Employer Clinic tier — monthly (USD)'),
  ('employer_clinic_annual',      '510.00',  'Employer Clinic tier — annual (USD)'),
  ('employer_clinic_max_staff',   '10',      'Employer Clinic tier — max staff seats'),
  ('employer_growth_monthly',     '100.00',  'Employer Growth tier — monthly (USD)'),
  ('employer_growth_annual',      '1020.00', 'Employer Growth tier — annual (USD)'),
  ('employer_growth_max_staff',   '25',      'Employer Growth tier — max staff seats'),
  ('employer_dept_monthly',       '180.00',  'Employer Department tier — monthly (USD)'),
  ('employer_dept_annual',        '1836.00', 'Employer Department tier — annual (USD)'),
  ('employer_dept_max_staff',     '50',      'Employer Department tier — max staff seats'),
  ('employer_hospital_monthly',   '350.00',  'Employer Hospital tier — monthly (USD)'),
  ('employer_hospital_annual',    '3570.00', 'Employer Hospital tier — annual (USD)'),
  ('employer_hospital_max_staff', '200',     'Employer Hospital tier — max staff seats'),
  ('employer_annual_discount_pct','15',      'Annual discount % shown on all Employer plans'),
  ('free_cme_activity_limit',     '10',      'Max CME activities for Free plan'),
  ('free_license_limit',          '1',       'Max licenses for Free plan')
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION set_platform_settings_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_platform_settings_updated_at ON platform_settings;
CREATE TRIGGER trg_platform_settings_updated_at
  BEFORE UPDATE ON platform_settings
  FOR EACH ROW EXECUTE FUNCTION set_platform_settings_updated_at();

-- ════════════════════════════════════════════════════════════
-- MIGRATION 017 — Discounts
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS discounts (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name             text        NOT NULL,
  description      text,
  discount_type    text        NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_upgrade')),
  discount_value   numeric(10,2) NOT NULL DEFAULT 0 CHECK (discount_value >= 0),
  target_type      text        NOT NULL CHECK (target_type IN ('user', 'organization', 'global')),
  target_id        uuid,
  applicable_plans text[]      NOT NULL DEFAULT ARRAY['pro'],
  valid_from       timestamptz DEFAULT now(),
  valid_until      timestamptz,
  max_uses         integer,
  current_uses     integer     NOT NULL DEFAULT 0 CHECK (current_uses >= 0),
  is_active        boolean     NOT NULL DEFAULT true,
  promo_code       text        UNIQUE,
  notes            text,
  created_by       uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discounts_target ON discounts (target_type, target_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_discounts_promo_code ON discounts (promo_code) WHERE promo_code IS NOT NULL;

ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manage discounts" ON discounts;
CREATE POLICY "Admin manage discounts" ON discounts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "User read own discounts" ON discounts;
CREATE POLICY "User read own discounts" ON discounts
  FOR SELECT USING (
    is_active = true
    AND (
      target_type = 'global'
      OR (target_type = 'user' AND target_id = auth.uid())
      OR (
        target_type = 'organization'
        AND target_id IN (
          SELECT organization_id FROM organization_members WHERE auth_id = auth.uid()
        )
      )
    )
  );

CREATE OR REPLACE FUNCTION set_discounts_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_discounts_updated_at ON discounts;
CREATE TRIGGER trg_discounts_updated_at
  BEFORE UPDATE ON discounts
  FOR EACH ROW EXECUTE FUNCTION set_discounts_updated_at();

-- ════════════════════════════════════════════════════════════
-- MIGRATION 018 — Partners
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS partners (
  id               uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  name             text    NOT NULL,
  logo_url         text,
  website_url      text,
  country_code     text,
  partner_type     text    CHECK (partner_type IN ('accreditor','employer','technology','government','hospital','university')),
  organization_id  uuid    REFERENCES organizations(id) ON DELETE SET NULL,
  display_order    integer NOT NULL DEFAULT 0,
  is_active        boolean NOT NULL DEFAULT true,
  show_on_landing  boolean NOT NULL DEFAULT true,
  show_on_dashboard boolean NOT NULL DEFAULT true,
  tagline          text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partners_active ON partners (display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_partners_org ON partners (organization_id) WHERE organization_id IS NOT NULL;

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manage partners" ON partners;
CREATE POLICY "Admin manage partners" ON partners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Public read active partners" ON partners;
CREATE POLICY "Public read active partners" ON partners
  FOR SELECT USING (is_active = true);

CREATE OR REPLACE FUNCTION set_partners_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_partners_updated_at ON partners;
CREATE TRIGGER trg_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION set_partners_updated_at();

-- ════════════════════════════════════════════════════════════
-- MIGRATION 019 — Subscription Billing Interval
-- ════════════════════════════════════════════════════════════

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS billing_interval text
    CHECK (billing_interval IN ('monthly', 'annual'))
    DEFAULT 'annual',
  ADD COLUMN IF NOT EXISTS employer_tier text
    CHECK (employer_tier IN ('clinic', 'growth', 'department', 'hospital', 'enterprise'));

-- ════════════════════════════════════════════════════════════
-- MIGRATION 020 — Discount Uses RPC
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION increment_discount_uses(discount_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE discounts
  SET current_uses = current_uses + 1
  WHERE id = discount_id;
END;
$$;

REVOKE ALL ON FUNCTION increment_discount_uses(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_discount_uses(uuid) TO service_role;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 021 — Pro Trial
-- ════════════════════════════════════════════════════════════

ALTER TABLE professional_profiles ADD COLUMN IF NOT EXISTS pro_trial_ends_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_professional_profiles_trial
  ON professional_profiles(pro_trial_ends_at)
  WHERE pro_trial_ends_at IS NOT NULL;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 022 — Email Preferences
-- ════════════════════════════════════════════════════════════

ALTER TABLE professional_profiles
  ADD COLUMN IF NOT EXISTS email_cme_verified    boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_cme_deadline    boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_license_expiry  boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_trial_reminders boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_employer_tasks  boolean NOT NULL DEFAULT true;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 023 — Referral Code
-- ════════════════════════════════════════════════════════════

ALTER TABLE professional_profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

CREATE INDEX IF NOT EXISTS idx_professional_profiles_referral_code
  ON professional_profiles (referral_code)
  WHERE referral_code IS NOT NULL;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 024 — Accurate GCC Country Rules
-- ════════════════════════════════════════════════════════════

delete from compliance_activity_categories where country_code in ('SA', 'AE-DU', 'AE-AZ', 'KW', 'BH', 'OM');
delete from country_compliance_rules where country_code in ('SA', 'AE-DU', 'AE-AZ', 'KW', 'BH', 'OM');

-- Saudi Arabia — SCFHS
insert into country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
values
  ('SA', 'physician',  1, 60, 'CME', 50, 5, false, 60, true,  '2020-01-01', 'SCFHS Saudi Arabia. 1-year cycle. 60 CME credits/year. Physicians. Max 50% self-learning. Mandatory: 5 patient safety credits.'),
  ('SA', 'pharmacist', 1, 60, 'CME', 50, 5, false, 60, true,  '2020-01-01', 'SCFHS Saudi Arabia. 1-year cycle. 60 CME credits/year. Pharmacists. Same framework as physicians.'),
  ('SA', 'nurse',      1, 30, 'CME', 50, 0, true,  60, true,  '2020-01-01', 'SCFHS Saudi Arabia. 1-year cycle. 30 CME credits/year. Nurses.'),
  ('SA', 'ahp',        1, 30, 'CME', 50, 0, true,  60, false, '2020-01-01', 'SCFHS Saudi Arabia. 1-year cycle. 30 CME credits/year. Allied Health.'),
  ('SA', 'dentist',    1, 60, 'CME', 50, 5, false, 60, true,  '2020-01-01', 'SCFHS Saudi Arabia. 1-year cycle. 60 CME credits/year. Dentists.')
;

insert into compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
values
  ('SA', 'conference_symposium',   0, null, 1.0, true,  'SCFHS Cat A — Accredited conferences. 1 CME credit/hour.'),
  ('SA', 'workshop_hands_on',      0, null, 1.0, true,  'SCFHS Cat A — Hands-on workshops. 1 CME credit/hour.'),
  ('SA', 'online_accredited',      0, null, 1.0, true,  'SCFHS Cat A — Accredited online CME. Max 50% of total.'),
  ('SA', 'self_learning',          0, null, 0.5, false, 'SCFHS Cat B — Self-directed learning. 0.5 credits/hour. Max 50%.'),
  ('SA', 'patient_safety_mandatory', 5, null, 1.0, true, 'SCFHS Mandatory — Patient safety, infection control, CPR. Min 5/year.'),
  ('SA', 'research_publication',   0, null, 5.0, false, 'SCFHS Cat B — Peer-reviewed publication. 5 CME credits/paper.'),
  ('SA', 'teaching_lecturing',     0, null, 1.0, false, 'SCFHS Cat B — Formal teaching. 1 CME credit/hour.')
;

-- UAE — DHA Dubai
insert into country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
values
  ('AE-DU', 'all', 2, 40, 'CME', 50, 5, false, 90, true, '2019-01-01',
   'DHA Dubai. 2-year cycle. 40 CME credits. Mandatory: 5 Patient Safety. Max 50% online. 90-day grace period.')
;

insert into compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
values
  ('AE-DU', 'conference_seminar',     0, null, 1.0, true,  'DHA Cat 1 — Accredited conferences. 1 CME credit/hour.'),
  ('AE-DU', 'workshop',               0, null, 1.0, true,  'DHA Cat 1 — Hands-on workshops. 1 CME credit/hour.'),
  ('AE-DU', 'online_cme',             0, 20,   1.0, true,  'DHA Cat 1 — Online CME. Max 20 credits/cycle.'),
  ('AE-DU', 'patient_safety',         5, null, 1.0, true,  'DHA Mandatory — Patient Safety. Min 5 credits/cycle.'),
  ('AE-DU', 'self_directed_learning', 0, 10,   0.5, false, 'DHA Cat 2 — Self-directed learning. Max 10 credits/cycle.'),
  ('AE-DU', 'teaching_research',      0, null, 1.0, false, 'DHA Cat 2 — Teaching or peer-reviewed research.')
;

-- UAE — DOH Abu Dhabi
insert into country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
values
  ('AE-AZ', 'all', 2, 40, 'CPD', 50, 0, true, 60, false, '2018-01-01',
   'DOH Abu Dhabi. 2-year cycle. 40 CPD credits. Max 50% online. 60-day grace period.')
;

insert into compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
values
  ('AE-AZ', 'accredited_educational_activity', 0, null, 1.0, true,  'DOH Cat A — Accredited educational activities. 1 CPD credit/hour.'),
  ('AE-AZ', 'online_cpd',                      0, 20,   1.0, true,  'DOH Cat A — Online CPD. Max 20 credits/cycle.'),
  ('AE-AZ', 'self_directed_learning',           0, 15,   0.5, false, 'DOH Cat B — Self-directed learning. Max 15 credits/cycle.'),
  ('AE-AZ', 'postgraduate_study',               0, null, 25.0, false,'DOH Cat B — Postgraduate study. 25 CPD credits/semester.'),
  ('AE-AZ', 'research_publication',             0, null, 5.0, false, 'DOH Cat B — Peer-reviewed publication. 5 CPD credits/paper.'),
  ('AE-AZ', 'teaching_mentoring',               0, null, 1.0, false, 'DOH Cat B — Teaching or mentoring. 1 CPD credit/hour.')
;

-- Kuwait — MOH
insert into country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
values
  ('KW', 'physician',  1, 30, 'CME', 30, 0, true, 30, false, '2018-01-01', 'MOH Kuwait. 1-year cycle. 30 CME credits/year. Physicians. Max 30% online.'),
  ('KW', 'pharmacist', 1, 30, 'CME', 30, 0, true, 30, false, '2018-01-01', 'MOH Kuwait. 1-year cycle. 30 CME credits/year. Pharmacists.'),
  ('KW', 'nurse',      1, 20, 'CME', 30, 0, true, 30, false, '2018-01-01', 'MOH Kuwait. 1-year cycle. 20 CME credits/year. Nurses.'),
  ('KW', 'ahp',        1, 20, 'CME', 30, 0, true, 30, false, '2018-01-01', 'MOH Kuwait. 1-year cycle. 20 CME credits/year. Allied Health.')
;

insert into compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
values
  ('KW', 'conference_seminar', 0, null, 1.0, true,  'MOH Kuwait — Accredited conferences. 1 CME credit/hour.'),
  ('KW', 'workshop',           0, null, 1.0, true,  'MOH Kuwait — Hands-on workshops. 1 CME credit/hour.'),
  ('KW', 'online_cme',         0, null, 1.0, true,  'MOH Kuwait — Online CME. Max 30% of total annual credits.'),
  ('KW', 'self_directed',      0, null, 0.5, false, 'MOH Kuwait — Self-directed learning. Max 30% of total.')
;

-- Bahrain — NHRA
insert into country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
values
  ('BH', 'all', 2, 40, 'CPD', 50, 0, true, 60, false, '2017-01-01',
   'NHRA Bahrain. 2-year cycle. 40 CPD credits. Max 50% online. 60-day grace period.')
;

insert into compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
values
  ('BH', 'structured_accredited',    0, null, 1.0, true,  'NHRA Structured CPD — Accredited activities. 1 CPD credit/hour.'),
  ('BH', 'online_cpd',               0, 20,   1.0, true,  'NHRA — Online CPD. Max 20 credits/cycle.'),
  ('BH', 'unstructured_self_directed', 0, 20, 0.5, false, 'NHRA Unstructured CPD — Self-directed. Max 20 credits/cycle.'),
  ('BH', 'teaching_supervision',     0, null, 1.0, false, 'NHRA — Teaching or clinical supervision. 1 CPD credit/hour.'),
  ('BH', 'research_publication',     0, null, 5.0, false, 'NHRA — Peer-reviewed publication. 5 CPD credits/paper.')
;

-- Oman — OMSB
insert into country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
values
  ('OM', 'physician', 2, 40, 'CME', 50, 0, true, 30, false, '2016-01-01', 'OMSB Oman. 2-year cycle. 40 CME credits. Physicians.'),
  ('OM', 'nurse',     2, 30, 'CME', 50, 0, true, 30, false, '2016-01-01', 'OMSB Oman. 2-year cycle. 30 CME credits. Nurses/AHP.'),
  ('OM', 'ahp',       2, 30, 'CME', 50, 0, true, 30, false, '2016-01-01', 'OMSB Oman. 2-year cycle. 30 CME credits. Allied Health.')
;

insert into compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
values
  ('OM', 'cat_a_accredited_group', 0, null, 1.0, true,  'OMSB Category A — Accredited group learning. 1 CME credit/hour.'),
  ('OM', 'cat_a_online',          0, 20,   1.0, true,  'OMSB Category A — Online accredited CME. Max 20 credits/cycle.'),
  ('OM', 'cat_b_self_directed',   0, null, 0.5, false, 'OMSB Category B — Self-directed learning. 0.5 CME credits/hour.'),
  ('OM', 'cat_b_teaching',        0, null, 1.0, false, 'OMSB Category B — Formal teaching. 1 CME credit/hour.'),
  ('OM', 'cat_b_research',        0, null, 5.0, false, 'OMSB Category B — Peer-reviewed publication. 5 CME credits/paper.'),
  ('OM', 'cat_b_postgraduate',    0, null, 10.0, false,'OMSB Category B — Postgraduate program. 10 CME credits/semester.')
;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 025 — Marketplace CME Sync
-- ════════════════════════════════════════════════════════════

alter table course_enrollments
  add column if not exists cme_activity_id uuid references cme_activities (id) on delete set null;

create index if not exists idx_course_enrollments_cme_activity
  on course_enrollments (cme_activity_id);

-- ════════════════════════════════════════════════════════════
-- MIGRATION 026 — Multi-Country Wallet
-- ════════════════════════════════════════════════════════════

alter table cme_wallets drop constraint if exists cme_wallets_professional_id_key;

alter table cme_wallets add column if not exists is_primary boolean not null default false;
alter table cme_wallets add column if not exists label text;

update cme_wallets set is_primary = true where true;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'cme_wallets_professional_country_unique'
      AND table_name = 'cme_wallets'
  ) THEN
    ALTER TABLE cme_wallets
      ADD CONSTRAINT cme_wallets_professional_country_unique
      UNIQUE (professional_id, country);
  END IF;
END; $$;

create index if not exists idx_cme_wallets_primary
  on cme_wallets (professional_id)
  where is_primary = true;

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

drop trigger if exists employer_required_courses_updated_at on employer_required_courses;
create trigger employer_required_courses_updated_at
  before update on employer_required_courses
  for each row execute function public.set_updated_at();

alter table employer_required_courses enable row level security;

create or replace function public.get_auth_user_id_by_email(p_email text)
returns uuid language sql security definer set search_path = public as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1;
$$;

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

-- ════════════════════════════════════════════════════════════
-- MIGRATION 027 — NPS Responses
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS nps_responses (
  id              uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id uuid        NOT NULL REFERENCES professional_profiles(auth_id) ON DELETE CASCADE,
  score           smallint    NOT NULL CHECK (score >= 0 AND score <= 10),
  comment         text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nps_responses_professional_id ON nps_responses(professional_id);
CREATE INDEX IF NOT EXISTS idx_nps_responses_created_at ON nps_responses(created_at);

DROP TRIGGER IF EXISTS nps_responses_updated_at ON nps_responses;
CREATE TRIGGER nps_responses_updated_at
  BEFORE UPDATE ON nps_responses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE nps_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "nps_responses_select_own" ON nps_responses;
CREATE POLICY "nps_responses_select_own"
  ON nps_responses FOR SELECT
  USING (professional_id = auth.uid());

DROP POLICY IF EXISTS "nps_responses_insert_own" ON nps_responses;
CREATE POLICY "nps_responses_insert_own"
  ON nps_responses FOR INSERT
  WITH CHECK (professional_id = auth.uid());

DROP POLICY IF EXISTS "nps_responses_select_admin" ON nps_responses;
CREATE POLICY "nps_responses_select_admin"
  ON nps_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

-- ════════════════════════════════════════════════════════════
-- MIGRATION 028 — Email Bounce Protection
-- ════════════════════════════════════════════════════════════

ALTER TABLE professional_profiles
  ADD COLUMN IF NOT EXISTS email_hard_bounced  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_spam_reported boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_professional_profiles_email
  ON professional_profiles (email);

-- ════════════════════════════════════════════════════════════
-- MIGRATION 029 — QPay Qatar Local Payment Invoices
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS qpay_invoices (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id        text NOT NULL UNIQUE,
  invoice_number    text NOT NULL UNIQUE,
  professional_id   uuid NOT NULL REFERENCES professional_profiles(auth_id) ON DELETE CASCADE,
  plan              text NOT NULL CHECK (plan IN ('pro', 'employer')),
  billing_interval  text NOT NULL CHECK (billing_interval IN ('monthly', 'annual')),
  amount_qar        numeric(10, 2) NOT NULL,
  status            text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'cancelled')),
  qr_text           text,
  short_url         text,
  payment_id        text,
  paid_at           timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS payment_provider text DEFAULT 'paddle',
  ADD COLUMN IF NOT EXISTS qpay_invoice_id text;

CREATE INDEX IF NOT EXISTS idx_qpay_invoices_professional_id ON qpay_invoices(professional_id);
CREATE INDEX IF NOT EXISTS idx_qpay_invoices_status ON qpay_invoices(status);
CREATE INDEX IF NOT EXISTS idx_qpay_invoices_invoice_id ON qpay_invoices(invoice_id);

DROP TRIGGER IF EXISTS trg_qpay_invoices_updated_at ON qpay_invoices;
CREATE TRIGGER trg_qpay_invoices_updated_at
  BEFORE UPDATE ON qpay_invoices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE qpay_invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qpay_invoices_owner_read" ON qpay_invoices;
CREATE POLICY "qpay_invoices_owner_read" ON qpay_invoices
  FOR SELECT TO authenticated
  USING (professional_id = auth.uid());

DROP POLICY IF EXISTS "qpay_invoices_admin_all" ON qpay_invoices;
CREATE POLICY "qpay_invoices_admin_all" ON qpay_invoices
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ════════════════════════════════════════════════════════════
-- POST-RUN VERIFICATION QUERIES
-- Run these after the script completes to confirm success.
-- ════════════════════════════════════════════════════════════

-- Uncomment to verify table counts:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- SELECT country_code, count(*) FROM country_compliance_rules GROUP BY country_code ORDER BY country_code;
-- SELECT country_code, count(*) FROM compliance_activity_categories GROUP BY country_code ORDER BY country_code;

-- ============================================================
-- Hayya Med PRO — ALL 61 MIGRATIONS COMBINED
-- Paste this entire file into the Supabase SQL Editor and Run.
-- Idempotent: safe to run on a fresh project.
-- Generated: 2026-06-16
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
-- MIGRATION 030 — Schema Standards: licensing_authorities updated_at
-- ════════════════════════════════════════════════════════════

ALTER TABLE licensing_authorities
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS licensing_authorities_updated_at ON licensing_authorities;
CREATE TRIGGER licensing_authorities_updated_at
  BEFORE UPDATE ON licensing_authorities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- MIGRATION 031 — Waitlist signups (pre-launch lead capture)
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS waitlist_signups (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text NOT NULL,
  profession      text,
  country         text,
  source          text DEFAULT 'coming_soon',
  created_at      timestamptz NOT NULL DEFAULT now(),
  notified        boolean NOT NULL DEFAULT false,
  CONSTRAINT waitlist_email_unique UNIQUE (email)
);

ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "waitlist_insert_anon" ON waitlist_signups;
CREATE POLICY "waitlist_insert_anon"
  ON waitlist_signups FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "waitlist_select_none" ON waitlist_signups;
CREATE POLICY "waitlist_select_none"
  ON waitlist_signups FOR SELECT
  USING (false);

CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist_signups (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_notified   ON waitlist_signups (notified) WHERE notified = false;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 032 — Demo requests (enterprise lead capture)
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS demo_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  email        text NOT NULL,
  job_title    text NOT NULL,
  org_name     text NOT NULL,
  org_type     text NOT NULL,
  staff_count  text NOT NULL,
  country      text NOT NULL,
  message      text,
  status       text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed_won', 'closed_lost')),
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "demo_requests_insert_anon" ON demo_requests;
CREATE POLICY "demo_requests_insert_anon"
  ON demo_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "demo_requests_select_none" ON demo_requests;
CREATE POLICY "demo_requests_select_none"
  ON demo_requests FOR SELECT
  USING (false);

CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON demo_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status     ON demo_requests (status);
CREATE INDEX IF NOT EXISTS idx_demo_requests_country    ON demo_requests (country);

-- ════════════════════════════════════════════════════════════
-- MIGRATION 033 — Onboarding drip email log
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS drip_email_log (
  id              uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sequence_day    integer     NOT NULL,
  sent_at         timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, sequence_day)
);

CREATE INDEX IF NOT EXISTS idx_drip_email_log_user_id ON drip_email_log(user_id);
CREATE INDEX IF NOT EXISTS idx_drip_email_log_sent_at  ON drip_email_log(sent_at);

CREATE OR REPLACE TRIGGER drip_email_log_updated_at
  BEFORE UPDATE ON drip_email_log
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE drip_email_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "drip_email_log_admin_select" ON drip_email_log;
CREATE POLICY "drip_email_log_admin_select"
  ON drip_email_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

-- ════════════════════════════════════════════════════════════
-- MIGRATION 034 — MFA recovery codes
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS mfa_recovery_codes (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id uuid        NOT NULL,
  code_hash       text        NOT NULL,
  used_at         timestamptz,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT mfa_recovery_codes_professional_id_fkey
    FOREIGN KEY (professional_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mfa_recovery_codes_professional_id
  ON mfa_recovery_codes(professional_id);

ALTER TABLE mfa_recovery_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own recovery codes" ON mfa_recovery_codes;
CREATE POLICY "Users read own recovery codes" ON mfa_recovery_codes
  FOR SELECT USING (professional_id = auth.uid());

-- ════════════════════════════════════════════════════════════
-- MIGRATION 035 — Marketplace full-text search
-- ════════════════════════════════════════════════════════════

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
      setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(description, '')), 'B')
    ) STORED;

CREATE INDEX IF NOT EXISTS idx_courses_search_vector
  ON courses USING GIN (search_vector);

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_courses_title_trgm
  ON courses USING GIN (title gin_trgm_ops);

-- ════════════════════════════════════════════════════════════
-- MIGRATION 036 — Referrals
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS referrals (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_auth_id  uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_auth_id  uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code     text        NOT NULL,
  status            text        NOT NULL DEFAULT 'signed_up'
                    CHECK (status IN ('signed_up', 'converted')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  converted_at      timestamptz,
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referred_auth_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals (referrer_auth_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code     ON referrals (referral_code);

CREATE OR REPLACE FUNCTION referrals_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS referrals_updated_at ON referrals;
CREATE TRIGGER referrals_updated_at
  BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION referrals_set_updated_at();

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "referrer reads own referrals" ON referrals;
CREATE POLICY "referrer reads own referrals" ON referrals
  FOR SELECT USING (referrer_auth_id = auth.uid());

DROP POLICY IF EXISTS "admin reads all referrals" ON referrals;
CREATE POLICY "admin reads all referrals" ON referrals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

-- ════════════════════════════════════════════════════════════
-- MIGRATION 037 — CPD Reflection Journal
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS cpd_reflections (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cme_activity_id     uuid        REFERENCES cme_activities(id) ON DELETE SET NULL,
  reflection_date     date        NOT NULL DEFAULT CURRENT_DATE,
  reflection_type     text        NOT NULL DEFAULT 'learning'
                      CHECK (reflection_type IN ('learning', 'practice_change', 'significant_event', 'feedback', 'research')),
  what_learned        text        NOT NULL CHECK (char_length(what_learned) >= 10),
  how_applied         text,
  impact_on_practice  text,
  further_learning    text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cpd_reflections_professional ON cpd_reflections (professional_id);
CREATE INDEX IF NOT EXISTS idx_cpd_reflections_activity     ON cpd_reflections (cme_activity_id) WHERE cme_activity_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cpd_reflections_date         ON cpd_reflections (professional_id, reflection_date DESC);

CREATE OR REPLACE FUNCTION cpd_reflections_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS cpd_reflections_updated_at ON cpd_reflections;
CREATE TRIGGER cpd_reflections_updated_at
  BEFORE UPDATE ON cpd_reflections
  FOR EACH ROW EXECUTE FUNCTION cpd_reflections_set_updated_at();

ALTER TABLE cpd_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional reads own reflections" ON cpd_reflections;
CREATE POLICY "professional reads own reflections" ON cpd_reflections
  FOR SELECT USING (professional_id = auth.uid());

DROP POLICY IF EXISTS "professional inserts own reflections" ON cpd_reflections;
CREATE POLICY "professional inserts own reflections" ON cpd_reflections
  FOR INSERT WITH CHECK (professional_id = auth.uid());

DROP POLICY IF EXISTS "professional updates own reflections" ON cpd_reflections;
CREATE POLICY "professional updates own reflections" ON cpd_reflections
  FOR UPDATE USING (professional_id = auth.uid()) WITH CHECK (professional_id = auth.uid());

DROP POLICY IF EXISTS "professional deletes own reflections" ON cpd_reflections;
CREATE POLICY "professional deletes own reflections" ON cpd_reflections
  FOR DELETE USING (professional_id = auth.uid());

DROP POLICY IF EXISTS "admin reads all reflections" ON cpd_reflections;
CREATE POLICY "admin reads all reflections" ON cpd_reflections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

-- ════════════════════════════════════════════════════════════
-- MIGRATION 038: Employer Compliance Alert Thresholds
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS employer_compliance_thresholds (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  threshold_pct   smallint    NOT NULL DEFAULT 80
                  CHECK (threshold_pct BETWEEN 0 AND 100),
  alert_email     text        NOT NULL,
  enabled         boolean     NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id)
);

CREATE INDEX IF NOT EXISTS idx_compliance_thresholds_org ON employer_compliance_thresholds (organization_id);

CREATE OR REPLACE FUNCTION compliance_thresholds_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS compliance_thresholds_updated_at ON employer_compliance_thresholds;
CREATE TRIGGER compliance_thresholds_updated_at
  BEFORE UPDATE ON employer_compliance_thresholds
  FOR EACH ROW EXECUTE FUNCTION compliance_thresholds_set_updated_at();

ALTER TABLE employer_compliance_thresholds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "employer admin manages own threshold" ON employer_compliance_thresholds;
CREATE POLICY "employer admin manages own threshold" ON employer_compliance_thresholds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND organization_id = employer_compliance_thresholds.organization_id
        AND role = 'employer_admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND organization_id = employer_compliance_thresholds.organization_id
        AND role = 'employer_admin'
    )
  );

DROP POLICY IF EXISTS "admin reads all thresholds" ON employer_compliance_thresholds;
CREATE POLICY "admin reads all thresholds" ON employer_compliance_thresholds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

-- ════════════════════════════════════════════════════════════
-- MIGRATION 039: Professional Achievement Badges
-- ════════════════════════════════════════════════════════════

-- Professional Achievement Badges
-- One row per earned badge per professional; UNIQUE prevents duplicate awards.
CREATE TABLE IF NOT EXISTS professional_achievements (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_key       text        NOT NULL,
  awarded_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (professional_id, badge_key)
);

CREATE INDEX IF NOT EXISTS idx_achievements_professional ON professional_achievements (professional_id);

-- RLS: professionals read own badges; admins read all
ALTER TABLE professional_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional reads own achievements" ON professional_achievements;
CREATE POLICY "professional reads own achievements" ON professional_achievements
  FOR SELECT USING (auth.uid() = professional_id);

DROP POLICY IF EXISTS "admin reads all achievements" ON professional_achievements;
CREATE POLICY "admin reads all achievements" ON professional_achievements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

-- No UPDATE or DELETE — badges are permanent once awarded
-- Inserts are server-side only (admin client) — no INSERT policy for auth users

-- ════════════════════════════════════════════════════════════
-- MIGRATION 040: Multi-License Wallet
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS professional_licenses (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  license_number      text        NOT NULL,
  licensing_authority text        NOT NULL,
  country_code        text        NOT NULL DEFAULT 'QA',
  profession          text,
  specialty           text,
  issue_date          date,
  expiry_date         date,
  notes               text,
  is_primary          boolean     NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pro_licenses_professional ON professional_licenses (professional_id);
CREATE INDEX IF NOT EXISTS idx_pro_licenses_expiry       ON professional_licenses (expiry_date);

CREATE OR REPLACE FUNCTION pro_licenses_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS pro_licenses_updated_at ON professional_licenses;
CREATE TRIGGER pro_licenses_updated_at
  BEFORE UPDATE ON professional_licenses
  FOR EACH ROW EXECUTE FUNCTION pro_licenses_set_updated_at();

ALTER TABLE professional_licenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional manages own licenses" ON professional_licenses;
CREATE POLICY "professional manages own licenses" ON professional_licenses
  FOR ALL USING (auth.uid() = professional_id) WITH CHECK (auth.uid() = professional_id);

DROP POLICY IF EXISTS "employer reads linked staff licenses" ON professional_licenses;
CREATE POLICY "employer reads linked staff licenses" ON professional_licenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM employer_link_requests elr
      JOIN organization_members om ON om.organization_id = elr.organization_id
      WHERE elr.professional_id = professional_licenses.professional_id
        AND elr.status = 'approved'
        AND om.auth_id = auth.uid()
        AND om.role = 'employer_admin'
    )
  );

DROP POLICY IF EXISTS "admin reads all licenses" ON professional_licenses;
CREATE POLICY "admin reads all licenses" ON professional_licenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid() AND role IN ('master_admin', 'super_admin')
    )
  );

-- ════════════════════════════════════════════════════════════
-- MIGRATION 041 — AI Call Logs
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ai_call_logs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action          text        NOT NULL,
  model           text        NOT NULL,
  input_tokens    integer,
  output_tokens   integer,
  latency_ms      integer,
  cost_usd        numeric(10, 6),
  prompt_version  text,
  success         boolean     NOT NULL DEFAULT true,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_call_logs_professional ON ai_call_logs (professional_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_call_logs_action       ON ai_call_logs (action);
CREATE INDEX IF NOT EXISTS idx_ai_call_logs_created_at   ON ai_call_logs (created_at DESC);

ALTER TABLE ai_call_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "no direct access to ai_call_logs" ON ai_call_logs;
CREATE POLICY "no direct access to ai_call_logs" ON ai_call_logs FOR ALL USING (false);

-- ════════════════════════════════════════════════════════════
-- MIGRATION 042 — Certificate Storage Records
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS certificate_storage_records (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cme_activity_id uuid        REFERENCES cme_activities(id) ON DELETE SET NULL,
  storage_path    text        NOT NULL,
  file_name       text,
  file_size_bytes integer,
  mime_type       text,
  uploaded_at     timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  is_deleted      boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cert_storage_path       ON certificate_storage_records (storage_path) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS idx_cert_storage_professional      ON certificate_storage_records (professional_id);
CREATE INDEX IF NOT EXISTS idx_cert_storage_activity          ON certificate_storage_records (cme_activity_id);
CREATE INDEX IF NOT EXISTS idx_cert_storage_orphans           ON certificate_storage_records (uploaded_at) WHERE cme_activity_id IS NULL AND NOT is_deleted;

CREATE OR REPLACE FUNCTION cert_storage_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS cert_storage_updated_at ON certificate_storage_records;
CREATE TRIGGER cert_storage_updated_at
  BEFORE UPDATE ON certificate_storage_records
  FOR EACH ROW EXECUTE FUNCTION cert_storage_set_updated_at();

ALTER TABLE certificate_storage_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional reads own certificate records" ON certificate_storage_records;
CREATE POLICY "professional reads own certificate records" ON certificate_storage_records FOR SELECT USING (auth.uid() = professional_id AND NOT is_deleted);

DROP POLICY IF EXISTS "professional inserts own certificate records" ON certificate_storage_records;
CREATE POLICY "professional inserts own certificate records" ON certificate_storage_records FOR INSERT WITH CHECK (auth.uid() = professional_id);

DROP POLICY IF EXISTS "professional soft-deletes own certificate records" ON certificate_storage_records;
CREATE POLICY "professional soft-deletes own certificate records" ON certificate_storage_records FOR UPDATE USING (auth.uid() = professional_id) WITH CHECK (auth.uid() = professional_id);

DROP POLICY IF EXISTS "admin reads all certificate records" ON certificate_storage_records;
CREATE POLICY "admin reads all certificate records" ON certificate_storage_records FOR SELECT USING (EXISTS (SELECT 1 FROM organization_members WHERE auth_id = auth.uid() AND role IN ('master_admin', 'super_admin')));

-- ════════════════════════════════════════════════════════════
-- MIGRATION 043 — Mobile Device Registrations
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS mobile_device_registrations (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_token    text        NOT NULL,
  platform        text        NOT NULL CHECK (platform IN ('ios', 'android')),
  app_version     text,
  os_version      text,
  device_model    text,
  is_active       boolean     NOT NULL DEFAULT true,
  last_active_at  timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (professional_id, device_token)
);

CREATE INDEX IF NOT EXISTS idx_mobile_devices_professional ON mobile_device_registrations (professional_id);
CREATE INDEX IF NOT EXISTS idx_mobile_devices_active       ON mobile_device_registrations (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_mobile_devices_platform     ON mobile_device_registrations (platform);

CREATE OR REPLACE FUNCTION mobile_devices_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS mobile_devices_updated_at ON mobile_device_registrations;
CREATE TRIGGER mobile_devices_updated_at
  BEFORE UPDATE ON mobile_device_registrations
  FOR EACH ROW EXECUTE FUNCTION mobile_devices_set_updated_at();

ALTER TABLE mobile_device_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional manages own devices" ON mobile_device_registrations;
CREATE POLICY "professional manages own devices" ON mobile_device_registrations FOR ALL USING (auth.uid() = professional_id) WITH CHECK (auth.uid() = professional_id);

DROP POLICY IF EXISTS "admin reads all device registrations" ON mobile_device_registrations;
CREATE POLICY "admin reads all device registrations" ON mobile_device_registrations FOR SELECT USING (EXISTS (SELECT 1 FROM organization_members WHERE auth_id = auth.uid() AND role IN ('master_admin', 'super_admin')));

-- ════════════════════════════════════════════════════════════
-- MIGRATION 044 — Notification Queue
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS notification_queue (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid        REFERENCES auth.users(id) ON DELETE CASCADE,
  channel         text        NOT NULL CHECK (channel IN ('email', 'push', 'sms')),
  template_id     text        NOT NULL,
  payload         jsonb       NOT NULL,
  status          text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  attempts        integer     NOT NULL DEFAULT 0,
  max_attempts    integer     NOT NULL DEFAULT 3,
  scheduled_at    timestamptz NOT NULL DEFAULT now(),
  sent_at         timestamptz,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notification_queue_pending      ON notification_queue (scheduled_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_notification_queue_professional ON notification_queue (professional_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_queue_template     ON notification_queue (template_id, status);

CREATE OR REPLACE FUNCTION notification_queue_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS notification_queue_updated_at ON notification_queue;
CREATE TRIGGER notification_queue_updated_at
  BEFORE UPDATE ON notification_queue
  FOR EACH ROW EXECUTE FUNCTION notification_queue_set_updated_at();

ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "no direct access to notification_queue" ON notification_queue;
CREATE POLICY "no direct access to notification_queue" ON notification_queue FOR ALL USING (false);

-- ════════════════════════════════════════════════════════════
-- MIGRATION 045 — Feature Flags
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS feature_flags (
  key             text        PRIMARY KEY,
  enabled         boolean     NOT NULL DEFAULT false,
  enabled_plans   text[]      DEFAULT NULL,
  rollout_pct     smallint    NOT NULL DEFAULT 100 CHECK (rollout_pct BETWEEN 0 AND 100),
  description     text,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  updated_by      uuid        REFERENCES auth.users(id) ON DELETE SET NULL
);

INSERT INTO feature_flags (key, enabled, enabled_plans, rollout_pct, description) VALUES
  ('ai_compliance_chat',     true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'AI compliance chatbot — Pro+ feature'),
  ('ai_gap_analysis',        true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'AI CME gap analysis — Pro+ feature'),
  ('ai_certificate_ocr',     true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'AI certificate OCR extraction — Pro+ feature'),
  ('ai_renewal_prediction',  true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'AI renewal risk prediction — Pro+ feature'),
  ('ai_learning_pathway',    true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'AI 12-month learning pathway — Pro+ feature'),
  ('ai_voice_chat',          true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'HayyaVoice AI orb — Pro+ feature'),
  ('offline_cme_queue',      true,  NULL, 100, 'Offline CME submission queue — all users'),
  ('referral_programme',     true,  NULL, 100, 'Referral code generation + tracking'),
  ('achievement_badges',     true,  NULL, 100, 'Gamification badges'),
  ('compliance_certificate', true,  ARRAY['pro', 'employer', 'master_admin', 'super_admin'], 100, 'PDF compliance certificate download — Pro+ feature'),
  ('marketplace',            true,  NULL, 100, 'Training marketplace browsing'),
  ('coming_soon_mode',       false, NULL, 100, 'Show coming-soon page instead of app')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated users read feature flags" ON feature_flags;
CREATE POLICY "authenticated users read feature flags" ON feature_flags FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "admin manages feature flags" ON feature_flags;
CREATE POLICY "admin manages feature flags" ON feature_flags FOR ALL
  USING (EXISTS (SELECT 1 FROM organization_members WHERE auth_id = auth.uid() AND role IN ('master_admin', 'super_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM organization_members WHERE auth_id = auth.uid() AND role IN ('master_admin', 'super_admin')));

-- ════════════════════════════════════════════════════════════
-- MIGRATION 046 — Webhook Management
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  url             text        NOT NULL,
  secret          text        NOT NULL,
  events          text[]      NOT NULL,
  description     text,
  is_active       boolean     NOT NULL DEFAULT true,
  created_by      uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_org ON webhook_endpoints (organization_id) WHERE is_active = true;

CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id     uuid        NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  event_type      text        NOT NULL,
  payload         jsonb       NOT NULL,
  status          text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed')),
  response_status integer,
  response_body   text,
  attempts        integer     NOT NULL DEFAULT 0,
  delivered_at    timestamptz,
  next_retry_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_endpoint   ON webhook_deliveries (endpoint_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_pending    ON webhook_deliveries (next_retry_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_event_type ON webhook_deliveries (event_type);

CREATE OR REPLACE FUNCTION webhook_endpoints_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS webhook_endpoints_updated_at ON webhook_endpoints;
CREATE TRIGGER webhook_endpoints_updated_at
  BEFORE UPDATE ON webhook_endpoints
  FOR EACH ROW EXECUTE FUNCTION webhook_endpoints_set_updated_at();

ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "employer admin manages org webhooks" ON webhook_endpoints;
CREATE POLICY "employer admin manages org webhooks" ON webhook_endpoints FOR ALL
  USING (EXISTS (SELECT 1 FROM organization_members WHERE organization_id = webhook_endpoints.organization_id AND auth_id = auth.uid() AND role = 'employer_admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM organization_members WHERE organization_id = webhook_endpoints.organization_id AND auth_id = auth.uid() AND role = 'employer_admin'));

DROP POLICY IF EXISTS "admin reads all webhooks" ON webhook_endpoints;
CREATE POLICY "admin reads all webhooks" ON webhook_endpoints FOR SELECT USING (EXISTS (SELECT 1 FROM organization_members WHERE auth_id = auth.uid() AND role IN ('master_admin', 'super_admin')));

DROP POLICY IF EXISTS "employer admin reads own deliveries" ON webhook_deliveries;
CREATE POLICY "employer admin reads own deliveries" ON webhook_deliveries FOR SELECT USING (
  EXISTS (SELECT 1 FROM webhook_endpoints we JOIN organization_members om ON om.organization_id = we.organization_id WHERE we.id = webhook_deliveries.endpoint_id AND om.auth_id = auth.uid() AND om.role = 'employer_admin')
);

DROP POLICY IF EXISTS "admin reads all deliveries" ON webhook_deliveries;
CREATE POLICY "admin reads all deliveries" ON webhook_deliveries FOR SELECT USING (EXISTS (SELECT 1 FROM organization_members WHERE auth_id = auth.uid() AND role IN ('master_admin', 'super_admin')));

-- ════════════════════════════════════════════════════════════
-- MIGRATION 047 — Performance Indexes
-- Note: CONCURRENTLY not supported in transactions; run individually if needed.
-- ════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_cme_activities_professional_date ON cme_activities (professional_id, activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_cme_activities_verification_status ON cme_activities (verification_status) WHERE verification_status = 'pending';
CREATE INDEX IF NOT EXISTS idx_employer_link_requests_org_status ON employer_link_requests (organization_id, status);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_country ON professional_profiles (country_of_residence);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_status ON subscriptions (plan, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_date ON audit_logs (actor_auth_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cme_wallets_compliance_status ON cme_wallets (compliance_status);
CREATE INDEX IF NOT EXISTS idx_professional_licenses_country_expiry ON professional_licenses (country_code, expiry_date) WHERE expiry_date IS NOT NULL;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 048 — Employer RLS Policies
-- ════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "employer reads approved staff activities" ON cme_activities;
CREATE POLICY "employer reads approved staff activities" ON cme_activities FOR SELECT
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

DROP POLICY IF EXISTS "employer reads approved staff cme summary" ON cme_activities;
CREATE POLICY "employer reads approved staff cme summary" ON cme_activities FOR SELECT
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

DROP POLICY IF EXISTS "employer reads approved staff profiles" ON professional_profiles;
CREATE POLICY "employer reads approved staff profiles" ON professional_profiles FOR SELECT
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

DROP POLICY IF EXISTS "employer reads approved staff wallets" ON cme_wallets;
CREATE POLICY "employer reads approved staff wallets" ON cme_wallets FOR SELECT
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

-- ════════════════════════════════════════════════════════════
-- MIGRATION 049: API Keys for HRIS / LMS Integrations
-- Employer admins generate API keys that external systems
-- (Workday, SAP, Oracle HCM, custom HIS) use to query
-- compliance data without browser-based auth sessions.
-- Full key shown once at creation; only SHA-256 hash stored.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS api_keys (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  key_prefix      text        NOT NULL,
  key_hash        text        NOT NULL UNIQUE,
  scopes          text[]      NOT NULL DEFAULT '{}',
  last_used_at    timestamptz,
  expires_at      timestamptz,
  is_active       boolean     NOT NULL DEFAULT true,
  created_by      uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_org      ON api_keys (organization_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_api_keys_hash     ON api_keys (key_hash) WHERE is_active = true;

CREATE OR REPLACE FUNCTION api_keys_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS api_keys_updated_at ON api_keys;
CREATE TRIGGER api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION api_keys_set_updated_at();

ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "employer admin manages api keys" ON api_keys;
CREATE POLICY "employer admin manages api keys" ON api_keys
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE organization_id = api_keys.organization_id
         AND auth_id = auth.uid()
         AND role = 'employer_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE organization_id = api_keys.organization_id
         AND auth_id = auth.uid()
         AND role = 'employer_admin'
    )
  );

DROP POLICY IF EXISTS "admin reads all api keys" ON api_keys;
CREATE POLICY "admin reads all api keys" ON api_keys
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND role IN ('master_admin', 'super_admin')
    )
  );

-- ════════════════════════════════════════════════════════════
-- POST-RUN VERIFICATION QUERIES
-- Run these after the script completes to confirm success.
-- ════════════════════════════════════════════════════════════

-- Uncomment to verify table counts:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
-- SELECT country_code, count(*) FROM country_compliance_rules GROUP BY country_code ORDER BY country_code;
-- SELECT country_code, count(*) FROM compliance_activity_categories GROUP BY country_code ORDER BY country_code;
-- SELECT COUNT(*) FROM api_keys; -- should be 0 on fresh install

-- ════════════════════════════════════════════════════════════
-- MIGRATION 050: AI Learning Pathway Storage
-- Stores generated 12-month CME pathways so professionals
-- can revisit without re-calling the AI on every page load.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS learning_pathways (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country         text        NOT NULL,
  profession      text        NOT NULL,
  model           text        NOT NULL DEFAULT 'claude-sonnet-4-6',
  prompt_version  text        NOT NULL DEFAULT 'v1',
  pathway_json    jsonb       NOT NULL,
  credits_gap     numeric(5,1),
  cycle_end_date  date,
  is_current      boolean     NOT NULL DEFAULT true,
  generated_at    timestamptz NOT NULL DEFAULT now(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_learning_pathways_professional
  ON learning_pathways (professional_id, generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_pathways_current
  ON learning_pathways (professional_id, country)
  WHERE is_current = true;

CREATE OR REPLACE FUNCTION learning_pathways_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS learning_pathways_updated_at ON learning_pathways;
CREATE TRIGGER learning_pathways_updated_at
  BEFORE UPDATE ON learning_pathways
  FOR EACH ROW EXECUTE FUNCTION learning_pathways_set_updated_at();

CREATE OR REPLACE FUNCTION mark_previous_pathways_stale()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE learning_pathways
  SET    is_current = false
  WHERE  professional_id = NEW.professional_id
    AND  country         = NEW.country
    AND  id             != NEW.id
    AND  is_current      = true;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS learning_pathway_mark_stale ON learning_pathways;
CREATE TRIGGER learning_pathway_mark_stale
  AFTER INSERT ON learning_pathways
  FOR EACH ROW EXECUTE FUNCTION mark_previous_pathways_stale();

ALTER TABLE learning_pathways ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional reads own pathways" ON learning_pathways;
CREATE POLICY "professional reads own pathways" ON learning_pathways
  FOR SELECT USING (auth.uid() = professional_id);

DROP POLICY IF EXISTS "professional inserts own pathways" ON learning_pathways;
CREATE POLICY "professional inserts own pathways" ON learning_pathways
  FOR INSERT WITH CHECK (auth.uid() = professional_id);

DROP POLICY IF EXISTS "admin reads all pathways" ON learning_pathways;
CREATE POLICY "admin reads all pathways" ON learning_pathways
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND role IN ('master_admin', 'super_admin')
    )
  );

-- SELECT COUNT(*) FROM learning_pathways; -- should be 0 on fresh install

-- ════════════════════════════════════════════════════════════
-- MIGRATION 051 — Profile Completion Auto-Trigger
-- profile_completion_pct stayed at 0 since migration 001.
-- This trigger recomputes the percentage on every INSERT/UPDATE.
-- Field weights (total = 100):
--   full_name 15, profession 15, license_number 15,
--   licensing_authority 10, license_expiry 10, specialty 10,
--   mobile 5, date_of_birth 5, nationality 5, onboarding_complete 10
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.compute_profile_completion_pct()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  score smallint := 0;
BEGIN
  IF NEW.full_name           IS NOT NULL AND trim(NEW.full_name)            <> '' THEN score := score + 15; END IF;
  IF NEW.profession          IS NOT NULL AND trim(NEW.profession)           <> '' THEN score := score + 15; END IF;
  IF NEW.license_number      IS NOT NULL AND trim(NEW.license_number)       <> '' THEN score := score + 15; END IF;
  IF NEW.licensing_authority IS NOT NULL AND trim(NEW.licensing_authority)  <> '' THEN score := score + 10; END IF;
  IF NEW.license_expiry      IS NOT NULL                                          THEN score := score + 10; END IF;
  IF NEW.specialty           IS NOT NULL AND trim(NEW.specialty)            <> '' THEN score := score + 10; END IF;
  IF NEW.mobile              IS NOT NULL AND trim(NEW.mobile)               <> '' THEN score := score + 5;  END IF;
  IF NEW.date_of_birth       IS NOT NULL                                          THEN score := score + 5;  END IF;
  IF NEW.nationality         IS NOT NULL AND trim(NEW.nationality)          <> '' THEN score := score + 5;  END IF;
  IF NEW.onboarding_complete = true                                               THEN score := score + 10; END IF;

  NEW.profile_completion_pct := score;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profile_completion_pct_trigger ON professional_profiles;
CREATE TRIGGER profile_completion_pct_trigger
  BEFORE INSERT OR UPDATE ON professional_profiles
  FOR EACH ROW EXECUTE FUNCTION public.compute_profile_completion_pct();

-- Back-fill existing rows by touching updated_at (fires the BEFORE UPDATE trigger on each row)
UPDATE professional_profiles SET updated_at = now() WHERE true;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 052 — Add 'removed' to link_status enum
-- ════════════════════════════════════════════════════════════

ALTER TYPE link_status ADD VALUE IF NOT EXISTS 'removed';

-- ════════════════════════════════════════════════════════════
-- MIGRATION 053 — Notification Queue Retry Column
-- ════════════════════════════════════════════════════════════

ALTER TABLE notification_queue
  ADD COLUMN IF NOT EXISTS next_retry_at timestamptz;

DROP INDEX IF EXISTS idx_notification_queue_pending;
CREATE INDEX IF NOT EXISTS idx_notification_queue_pending
  ON notification_queue (scheduled_at, next_retry_at)
  WHERE status = 'pending';

-- ════════════════════════════════════════════════════════════
-- MIGRATION 054 — Per-category push notification preferences
-- ════════════════════════════════════════════════════════════

ALTER TABLE professional_profiles
  ADD COLUMN IF NOT EXISTS push_license_expiry     boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS push_cme_deadline       boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS push_employer_tasks     boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS push_compliance_alerts  boolean NOT NULL DEFAULT true;


-- ════════════════════════════════════════════════════════════
-- MIGRATION 055 — Organization Compliance Snapshots
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS organization_compliance_snapshots (
  id               uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid    NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  snapshot_date    date    NOT NULL,
  total_staff      integer NOT NULL DEFAULT 0,
  compliant        integer NOT NULL DEFAULT 0,
  at_risk          integer NOT NULL DEFAULT 0,
  non_compliant    integer NOT NULL DEFAULT 0,
  unknown          integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_org_compliance_snapshots_org_date
  ON organization_compliance_snapshots (organization_id, snapshot_date DESC);

ALTER TABLE organization_compliance_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "employer reads own snapshots" ON organization_compliance_snapshots;
CREATE POLICY "employer reads own snapshots" ON organization_compliance_snapshots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND organization_id = organization_compliance_snapshots.organization_id
         AND role = 'employer_admin'
    )
  );

DROP POLICY IF EXISTS "admin reads all snapshots" ON organization_compliance_snapshots;
CREATE POLICY "admin reads all snapshots" ON organization_compliance_snapshots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND role IN ('master_admin', 'super_admin')
    )
  );


-- ════════════════════════════════════════════════════════════
-- MIGRATION 056 — Cycle-Scoped Credit Sync
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.sync_cme_wallet_credits()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_wallet_id    uuid := COALESCE(NEW.wallet_id, OLD.wallet_id);
  v_cycle_start  date;
BEGIN
  SELECT cycle_start_date INTO v_cycle_start
  FROM cme_wallets WHERE id = v_wallet_id;

  UPDATE cme_wallets
  SET completed_credits = (
    SELECT COALESCE(SUM(credits), 0)
    FROM cme_activities
    WHERE wallet_id           = v_wallet_id
      AND verification_status = 'verified'
      AND activity_date       >= COALESCE(v_cycle_start, '-infinity'::date)
  )
  WHERE id = v_wallet_id;

  RETURN NULL;
END;
$$;


-- ════════════════════════════════════════════════════════════
-- MIGRATION 057 — Auth Email Sync Trigger
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    UPDATE public.professional_profiles
    SET email      = NEW.email,
        updated_at = now()
    WHERE auth_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_email();

UPDATE public.professional_profiles pp
SET    email      = u.email,
       updated_at = now()
FROM   auth.users u
WHERE  pp.auth_id = u.id
  AND  pp.email IS DISTINCT FROM u.email;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 058 — Schema Improvements
-- ════════════════════════════════════════════════════════════

ALTER TYPE org_type ADD VALUE IF NOT EXISTS 'government';
ALTER TYPE org_type ADD VALUE IF NOT EXISTS 'regulatory_body';
ALTER TYPE org_type ADD VALUE IF NOT EXISTS 'ngo';

ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS plan_values;
ALTER TABLE subscriptions
  ADD CONSTRAINT plan_values
  CHECK (plan IN ('free', 'pro', 'employer', 'university', 'government'));

ALTER TABLE cme_activities
  ADD COLUMN IF NOT EXISTS accreditor text;

-- ════════════════════════════════════════════════════════════
-- MIGRATION 059 — Account Suspension Fields
-- ════════════════════════════════════════════════════════════

ALTER TABLE professional_profiles
  ADD COLUMN IF NOT EXISTS is_suspended    boolean     NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS suspended_at    timestamptz,
  ADD COLUMN IF NOT EXISTS suspended_reason text;

CREATE INDEX IF NOT EXISTS idx_professional_profiles_suspended
  ON professional_profiles (is_suspended) WHERE is_suspended = true;


-- ════════════════════════════════════════════════════════════
-- MIGRATION 060 — Fix Profile Completion: Professional Licenses Table
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.compute_profile_completion_pct()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  score        smallint := 0;
  has_license  boolean;
  has_authority boolean;
  has_expiry   boolean;
BEGIN
  IF NEW.full_name  IS NOT NULL AND trim(NEW.full_name)  <> '' THEN score := score + 15; END IF;
  IF NEW.profession IS NOT NULL AND trim(NEW.profession) <> '' THEN score := score + 15; END IF;

  has_license := (
    (NEW.license_number IS NOT NULL AND trim(NEW.license_number) <> '') OR
    EXISTS (SELECT 1 FROM public.professional_licenses WHERE professional_id = NEW.auth_id LIMIT 1)
  );
  IF has_license THEN score := score + 15; END IF;

  has_authority := (
    (NEW.licensing_authority IS NOT NULL AND trim(NEW.licensing_authority) <> '') OR
    EXISTS (
      SELECT 1 FROM public.professional_licenses
      WHERE professional_id = NEW.auth_id
        AND licensing_authority IS NOT NULL AND trim(licensing_authority) <> ''
      LIMIT 1
    )
  );
  IF has_authority THEN score := score + 10; END IF;

  has_expiry := (
    NEW.license_expiry IS NOT NULL OR
    EXISTS (
      SELECT 1 FROM public.professional_licenses
      WHERE professional_id = NEW.auth_id AND expiry_date IS NOT NULL LIMIT 1
    )
  );
  IF has_expiry THEN score := score + 10; END IF;

  IF NEW.specialty         IS NOT NULL AND trim(NEW.specialty)         <> '' THEN score := score + 10; END IF;
  IF NEW.mobile            IS NOT NULL AND trim(NEW.mobile)            <> '' THEN score := score + 5;  END IF;
  IF NEW.date_of_birth     IS NOT NULL                                       THEN score := score + 5;  END IF;
  IF NEW.nationality       IS NOT NULL AND trim(NEW.nationality)       <> '' THEN score := score + 5;  END IF;
  IF NEW.onboarding_complete = true                                          THEN score := score + 10; END IF;

  NEW.profile_completion_pct := score;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.refresh_completion_on_license_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.professional_profiles
  SET updated_at = NOW()
  WHERE auth_id = COALESCE(NEW.professional_id, OLD.professional_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_refresh_completion_on_license ON public.professional_licenses;
CREATE TRIGGER trg_refresh_completion_on_license
  AFTER INSERT OR DELETE ON public.professional_licenses
  FOR EACH ROW EXECUTE FUNCTION public.refresh_completion_on_license_change();

UPDATE public.professional_profiles pp
SET updated_at = NOW()
WHERE EXISTS (
  SELECT 1 FROM public.professional_licenses pl WHERE pl.professional_id = pp.auth_id LIMIT 1
)
AND (
  pp.license_number      IS NULL OR trim(pp.license_number)      = '' OR
  pp.licensing_authority IS NULL OR trim(pp.licensing_authority) = '' OR
  pp.license_expiry      IS NULL
);

-- ════════════════════════════════════════════════════════════
-- MIGRATION 061: UK, Australia, India Compliance Rules
-- ════════════════════════════════════════════════════════════

DELETE FROM compliance_activity_categories WHERE country_code IN ('GB', 'AU', 'IN');
DELETE FROM country_compliance_rules WHERE country_code IN ('GB', 'AU', 'IN');

INSERT INTO country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
VALUES
  ('GB', 'physician', 1, 50, 'CPD', 100, 0, true, 0, false, '2012-12-01',
   'GMC UK. Annual CPD cycle (within 5-year revalidation). 50 CPD credits/year recommended by Royal Colleges (RCP, RCS, RCPCH, RCPsych). 1 CPD credit = 1 hour of verified learning. Activities: accredited courses, conferences, e-learning, audit, research, reflective practice, teaching. No formal online cap — balance expected. Self-reported reflective CPD accepted. Annual appraisal required; full revalidation every 5 years with Responsible Officer. Source: GMC Revalidation Framework (gmc-uk.org); RCP CPD Guidance.'),
  ('GB', 'dentist', 1, 100, 'CPD', 100, 10, false, 0, false, '2018-01-01',
   'GDC UK (General Dental Council). Annual CPD cycle (100 verifiable hours per 5-year enhanced CPD scheme cycle = 20/year; mandate records as annual). Minimum 10 hours from mandatory recommended topics (patient safety, disinfection and decontamination, medical emergencies) per 5 years. All activities must be verifiable with a CPD outcome statement. Reflective CPD statement required per activity. Source: GDC Enhanced CPD Scheme (gdc-uk.org/professionals/cpd). Note: cycle_years=1 represents annual logging; GDC assesses across the 5-year enhanced scheme period.'),
  ('GB', 'nurse', 3, 35, 'CPD', 43, 20, true, 0, true, '2016-04-01',
   'NMC UK (Nursing and Midwifery Council). 3-year revalidation cycle. 35 hours CPD per 3-year registration renewal period. Mandatory: at least 20 of the 35 hours must be participatory (interactive group learning, not self-study alone). 5 written reflective accounts required. Confirmation from line manager or registered healthcare professional required. Self-directed (individual) CPD accepted for up to 15 hours (43% of 35). Applies to all NMC-registered nurses, midwives, and nursing associates. Source: NMC Revalidation Standards (nmc.org.uk). Note: online_credits_max_pct = 43 represents the 15/35 non-participatory allowance.'),
  ('GB', 'pharmacist', 1, 20, 'CPD', 100, 0, true, 0, false, '2010-01-01',
   'GPhC UK (General Pharmaceutical Council). Annual renewal. GPhC prescribes outcomes not hours — minimum 9 CPD entries per year covering learning relevant to practice context. Practical equivalence: ~20 hours CPD per year. All activity types accepted (courses, e-learning, reading, reflection, audit). Portfolio-based evidence required; no formal accreditation required for activities. Self-reported CPD accepted. Source: GPhC Standards for the education and training of pharmacists and GPhC CPD requirements (pharmacyregulation.org). Note: 20 credits used as rules engine practical equivalent; actual requirement is outcome/entry-based.'),
  ('AU', 'physician', 1, 50, 'CPD', 100, 10, true, 0, false, '2023-01-01',
   'Medical Board of Australia (AHPRA). Annual registration. 50 CPD hours per year (revised standard effective 1 Jan 2023). Mandatory 10 hours from two specified categories: minimum 5 hours performance review (peer review, multi-source feedback, clinical audit); minimum 5 hours measuring outcomes (audit outcomes, data collection). Remainder from any CPD type: educational activities (conferences, workshops, e-learning, reading). No specific online cap — balance expected. Self-reported CPD accepted. CPD home body (college fellowship) activities receive priority. Source: Medical Board of Australia CPD Registration Standard (medicalboard.gov.au). AHPRA oversight.'),
  ('AU', 'nurse', 1, 20, 'CPD', 100, 0, true, 0, false, '2016-01-01',
   'Nursing and Midwifery Board of Australia (NMBA/AHPRA). Annual registration renewal. 20 CPD hours per year. Activities must be relevant to context of practice. All activity types accepted: workshops, conferences, e-learning, clinical education, reflective practice. Self-reported CPD accepted in NMBA portfolio. No formal accreditation required for activities. Documentation: Retain evidence for 5 years in case of AHPRA audit. Source: NMBA CPD Registration Standard (nursingmidwiferyboard.gov.au).'),
  ('AU', 'pharmacist', 1, 40, 'CPD', 100, 10, true, 0, false, '2020-01-01',
   'Pharmacy Board of Australia (PBA/AHPRA). Annual registration. 40 CPD hours per year. Mandatory: minimum 10 hours from approved CPD activities (pharmacy-specific accredited programs). Remaining 30 hours from any relevant professional development. Self-recorded CPD acceptable for non-accredited learning. SHPA, PSA, APhA, ACPE-accredited activities accepted internationally. Documentation: CPD record retained for 5 years. Source: Pharmacy Board of Australia CPD Standard (pharmacyboard.gov.au).'),
  ('AU', 'dentist', 1, 60, 'CPD', 100, 20, false, 0, false, '2015-01-01',
   'Dental Board of Australia (DBA/AHPRA). Annual registration. 60 CPD hours per year. Mandatory: minimum 20 hours from hands-on clinical or safety-critical activities (patient safety, infection control, dental emergencies, radiography). Remaining 40 hours from any relevant CPD. Accredited activities preferred; non-accredited accepted with evidence. No online cap but clinical safety topics require in-person/simulation. Documentation: CPD record with evidence retained for 5 years. Source: Dental Board of Australia CPD Standard (dentalboard.gov.au).'),
  ('AU', 'ahp', 1, 30, 'CPD', 100, 0, true, 0, false, '2016-01-01',
   'Allied Health Professions — AHPRA. Annual registration. 30 CPD hours per year (approximate — varies by specific board: Physiotherapy, Optometry, Psychology, etc. most require 20–40 hours). Activities relevant to scope of practice. Self-reported CPD accepted. Documentation: evidence retained 5 years. Source: Respective national board registration standards under AHPRA (ahpra.gov.au). Note: Specific boards (e.g., Psychology Board) may have different requirements — this row captures the median standard.'),
  ('IN', 'physician', 5, 30, 'CME', 50, 0, false, 90, false, '2020-09-25',
   'NMC India (National Medical Commission, formerly MCI). 5-year registration renewal cycle. 30 CME credits required per 5-year cycle (6 credits/year effective minimum). NMC-accredited CME programs via NMC portal or state medical council. Events by Indian Medical Association (IMA), specialty associations (API, FOGSI, IAPSM, etc.) accepted if NMC-registered. International CME from WHO-recognized bodies accepted. Max 50% from online CME. Self-reported unaccredited activities not accepted — NMC portal registration mandatory. 90-day grace period for renewal. Source: NMC CME Regulations (nmc.org.in); NMC Act 2020 (No. 30 of 2020). Effective 25 Sep 2020.'),
  ('IN', 'nurse', 5, 30, 'CME', 50, 0, false, 90, false, '2020-01-01',
   'INC India (Indian Nursing Council). 5-year registration renewal. 30 CME/CPD credits per 5-year period. INC-recognised programs and state nursing council approved events. Specialty nursing workshops, hospital in-service training counted if INC-approved. Max 50% online. Source: INC CPD Guidelines (indiannursingcouncil.org). Note: INC framework is less standardized than NMC — enforcement varies by state. This row captures the national guideline.'),
  ('IN', 'pharmacist', 5, 30, 'CME', 50, 0, false, 90, false, '2020-01-01',
   'PCI India (Pharmacy Council of India). 5-year registration renewal. 30 CME credits per 5-year period. PCI-recognized programs, pharmacy conferences, hospital pharmacy workshops. IPA (Indian Pharmaceutical Association) events accepted. Max 50% online. Documentation: Certificate of participation from PCI-recognised organizer. Source: PCI CPD Guidelines (pci.nic.in). Note: PCI framework in transition post-2020 — state pharmacy councils vary in enforcement.')
;

INSERT INTO compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
VALUES
  ('GB', 'accredited_course_conference', 0, NULL, 1.0, false,
   'UK CPD — Accredited courses, conferences, postgraduate events, Royal College scientific meetings. 1 CPD credit/hour. UK Royal Colleges, RCPCH, RCS, RCPsych, BMA events accepted. CME/CPD accreditation from RCPSC, ACCME, UEMS-EACCME, RACP also recognised. Documentation: Certificate of attendance with hours/credits. For GDC: verifiable CPD outcome statement required.'),
  ('GB', 'e_learning_online', 0, NULL, 1.0, false,
   'UK CPD — Online and e-learning modules. 1 CPD credit/hour. No formal accreditation required by GMC/GPhC; NMC counts a portion as non-participatory. Documentation: Completion certificate. For GDC: verifiable CPD outcome statement required. NMC users: online modules count toward the 15-hour non-participatory allowance, not the 20-hour participatory requirement.'),
  ('GB', 'participatory_learning', 20, NULL, 1.0, false,
   'UK CPD — NMC Participatory CPD only. Interactive group learning: simulation, case-based discussion, peer learning groups, workshops. 1 CPD credit/hour. Minimum 20 hours per 3-year NMC cycle. Not required for GMC/GPhC/GDC professionals. Documentation: Evidence of group participation; reflection record.'),
  ('GB', 'clinical_audit_qi', 0, NULL, 1.0, false,
   'UK CPD — Clinical audit, quality improvement project, significant event analysis. 1 CPD credit/hour. Accepted by GMC, GDC, NMC, GPhC. Demonstrates evidence-based practice reflection. Documentation: Audit report or QI project summary with learning outcomes.'),
  ('GB', 'reflective_practice', 0, 10, 0.5, false,
   'UK CPD — Reflective practice and written reflective accounts. 0.5 credits/hour. NMC requires 5 written reflective accounts per 3-year cycle. GMC requires reflective notes in annual appraisal portfolio. Not a substitute for formal learning but captures synthesis. Maximum 10 credits per cycle. Documentation: Written reflective account.'),
  ('GB', 'research_publication_teaching', 0, NULL, 1.0, false,
   'UK CPD — Peer-reviewed publication (5 credits per paper), lecturing or formal teaching (1 credit/hour), postgraduate supervision. Accepted across GMC, NMC, GPhC, GDC frameworks. Documentation: Published paper, institutional letter confirming teaching hours, or supervision record.'),
  ('GB', 'postgraduate_programme', 0, NULL, 10.0, false,
   'UK CPD — Enrolment in accredited postgraduate diploma, MSc, or fellowship programme. 10 CPD credits per academic semester or equivalent. Documentation: Enrolment letter and transcript. Applicable across all UK healthcare professions.'),
  ('AU', 'educational_activities', 0, NULL, 1.0, false,
   'AHPRA Australia — Educational activities (conferences, workshops, courses, seminars, online modules, journal reading). 1 CPD hour/hour of activity. Primary CPD category for Medical Board 2023 standard. No specific accreditation required — relevance to practice is the criterion. Documentation: Attendance certificate or completion record. RACGP, RACP, RACS, ANZCA, ACRRM, ANF, PSA accreditation provides additional credibility.'),
  ('AU', 'performance_review', 5, NULL, 1.0, false,
   'AHPRA Australia MBA mandatory — Performance review activities (peer review, multi-source feedback, case peer discussion, MOPS, PREP, specialty college audit). 1 CPD hour/hour. Mandatory minimum 5 hours per year for Medical Board (MBA/AHPRA) registrants. Not specifically required by other AHPRA boards. Documentation: Peer review report, MSF feedback summary, specialty college performance review evidence.'),
  ('AU', 'measuring_outcomes', 5, NULL, 1.0, false,
   'AHPRA Australia MBA mandatory — Measuring outcomes activities (clinical audit, quality improvement, data collection review, incident analysis). 1 CPD hour/hour. Mandatory minimum 5 hours per year for Medical Board registrants. Documentation: Audit report, QI project evidence, or data analysis summary demonstrating outcomes measured.'),
  ('AU', 'online_accredited', 0, NULL, 1.0, false,
   'AHPRA Australia — Accredited online/e-learning modules. 1 CPD hour/hour. Accepted across all AHPRA boards. No specific cap — balance with other activity types expected. RACGP online modules (gplearning), RACP learning portal, PSA CPD portal, and international accredited platforms (ACCME, UK Royal Colleges, UEMS) accepted. Documentation: Online completion certificate.'),
  ('AU', 'teaching_supervision', 0, NULL, 1.0, false,
   'AHPRA Australia — Teaching, lecturing, clinical supervision, postgraduate training delivery. 1 CPD hour/hour of teaching preparation + delivery (up to 2× prep time may be claimed). Accepted by all AHPRA boards. Documentation: Institutional letter or teaching schedule.'),
  ('AU', 'research_publication', 0, NULL, 5.0, false,
   'AHPRA Australia — Peer-reviewed publication as primary or co-author. 5 CPD hours per published paper in indexed journal. Documentation: Published article or acceptance letter from indexed journal. Applicable across all AHPRA boards.'),
  ('AU', 'postgraduate_degree', 0, NULL, 20.0, false,
   'AHPRA Australia — Enrolment in postgraduate degree, graduate diploma, or specialist fellowship program. 20 CPD hours per semester. Documentation: Enrolment confirmation, transcript, or fellowship program participation evidence.'),
  ('IN', 'accredited_conference_workshop', 0, NULL, 1.0, true,
   'NMC India — Accredited conference, workshop, or CME symposium. 1 CME credit/hour. Must be NMC-registered (via NMC CME portal, nmc.org.in) or organized by recognized national specialty association (IMA, API, FOGSI, IAPSM, ASI, etc.) with NMC recognition. International CME from WHO-recognized bodies accepted with documentary evidence. Documentation: Certificate with total CME hours and NMC credit notation.'),
  ('IN', 'online_cme_accredited', 0, NULL, 1.0, true,
   'NMC India — Online accredited CME modules. 1 CME credit/hour. Maximum 50% of total 30-credit requirement (15 credits per 5-year cycle). Must be from NMC-approved online platform or recognized e-learning provider. Documentation: Online completion certificate with NMC credit notation.'),
  ('IN', 'hospital_training', 0, 10, 0.5, false,
   'NMC India — Hospital in-service training, grand rounds, mortality and morbidity conference, CME conducted by hospital medical education department. 0.5 CME credits/hour. Maximum 10 credits per 5-year cycle (33% of total). Requires certificate from Head of Department. Not accepted as substitute for NMC-accredited external CME. Documentation: Hospital CME certificate signed by Medical Superintendent or CME Committee Chair.'),
  ('IN', 'research_publication', 0, NULL, 3.0, false,
   'NMC India — Publication in peer-reviewed indexed journal (MEDLINE/PUBMED index preferred). 3 CME credits per paper as primary author; 1.5 credits as co-author. Documentation: Published paper or acceptance letter from indexed journal.'),
  ('IN', 'teaching_faculty', 0, NULL, 1.0, false,
   'NMC India — Formal teaching in NMC-recognized medical college or hospital, as faculty in accredited CME programs. 1 CME credit/hour. Documentation: Letter from Dean/Principal confirming teaching hours or faculty certificate from CME organizer.'),
  ('IN', 'postgraduate_degree', 0, NULL, 15.0, false,
   'NMC India — Completion of postgraduate degree, diploma, or fellowship (DNB, MD, MS, DM, MCh, fellowship from recognized body). 15 CME credits for completion of any postgraduate degree or specialty certification during the 5-year cycle. Documentation: Degree certificate or statement of passing from issuing institution.')
;

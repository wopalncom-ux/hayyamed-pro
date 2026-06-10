-- Migration: Country Rules Engine
-- All compliance rules live in the database, not in code.
-- A business analyst can configure a new country without a developer.

-- Core compliance rules per country + profession
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

create index idx_country_rules_country on country_compliance_rules (country_code);
create index idx_country_rules_authority on country_compliance_rules (authority_id);

alter table country_compliance_rules enable row level security;

drop policy if exists "country_rules_public_read" on country_compliance_rules;
create policy "country_rules_public_read" on country_compliance_rules
  for select using (true);

create trigger set_country_compliance_rules_updated_at
  before update on country_compliance_rules
  for each row execute procedure set_updated_at();

-- Activity category rules per country
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

create index idx_activity_categories_country on compliance_activity_categories (country_code);

alter table compliance_activity_categories enable row level security;

drop policy if exists "activity_categories_public_read" on compliance_activity_categories;
create policy "activity_categories_public_read" on compliance_activity_categories
  for select using (true);

create trigger set_compliance_activity_categories_updated_at
  before update on compliance_activity_categories
  for each row execute procedure set_updated_at();

-- Seed: Qatar QCHP rules
insert into country_compliance_rules
  (country_code, profession_code, cycle_years, total_credits_required, credit_terminology,
   online_credits_max_pct, mandatory_credits_min, self_reported_allowed,
   grace_period_days, employer_report_required, notes)
values
  ('QA', 'all',        1, 50, 'CME', 50, 0, true, 30, false, 'QCHP general rule — all licensed professions'),
  ('SA', 'all',        1, 50, 'CME', 50, 10, false, 60, true, 'SCFHS — must be accredited activities only'),
  ('AE-DU', 'all',     2, 40, 'CME', 50, 5, false, 90, true, 'DHA Dubai — 2-year cycle, patient safety mandatory'),
  ('AE-AZ', 'all',     2, 40, 'CPD', 50, 0, true, 60, false, 'DOH Abu Dhabi — 2-year cycle'),
  ('KW', 'all',        1, 30, 'CME', 30, 0, true, 30, false, 'MOH Kuwait — online max 30%'),
  ('BH', 'all',        2, 40, 'CPD', 50, 0, true, 60, false, 'NHRA Bahrain — 2-year cycle'),
  ('OM', 'all',        2, 40, 'CME', 50, 0, true, 30, false, 'OMSB Oman — 2-year cycle')
on conflict do nothing;

-- Seed: Qatar QCHP activity categories
insert into compliance_activity_categories
  (country_code, category_name, max_credits_per_cycle, credits_per_hour, accreditation_required, notes)
values
  ('QA', 'conference',          25, 1.0, true,  'Conferences and seminars — max 50% of total'),
  ('QA', 'online',              25, 1.0, true,  'Online CME — max 50% of total'),
  ('QA', 'workshop',            null, 1.0, true, 'Hands-on workshops — no cap'),
  ('QA', 'journal',             10, 1.0, false, 'Journal reading and self-assessment'),
  ('QA', 'teaching',            10, 1.0, false, 'Teaching and lecturing credits'),
  ('QA', 'simulation',          null, 1.0, true, 'Simulation training'),
  ('SA', 'conference',          25, 1.0, true,  'SCFHS accredited conferences only'),
  ('SA', 'online',              25, 1.0, true,  'SCFHS accredited online only'),
  ('SA', 'mandatory',           10, 1.0, true,  'Mandatory structured credits minimum 10'),
  ('AE-DU', 'conference',       20, 1.0, true,  'DHA accredited conferences'),
  ('AE-DU', 'online',           20, 1.0, true,  'DHA accredited online'),
  ('AE-DU', 'patient_safety',   5,  1.0, true,  'Patient safety — mandatory minimum 5 credits')
on conflict do nothing;

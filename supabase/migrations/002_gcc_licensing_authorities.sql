-- Migration: GCC Licensing Authorities
-- Replaces hardcoded authority strings with a proper reference table.
-- Supports QCHP, DHA, DOH-AD, SCFHS, NHRA, OMSB, MOH-KW — required for
-- accurate CME credit requirements across GCC expansion markets.

-- ─── Table ────────────────────────────────────────────────────────────────────

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

-- RLS: public read (authority names are not sensitive), no direct writes
alter table licensing_authorities enable row level security;

create policy "licensing_authorities_public_read"
  on licensing_authorities for select using (true);

-- ─── Add FK to professional_profiles ─────────────────────────────────────────

alter table professional_profiles
  add column if not exists licensing_authority_id uuid
    references licensing_authorities (id) on delete set null;

-- ─── Seed: GCC authorities with accurate CME requirements ────────────────────

insert into licensing_authorities
  (country, country_code, authority_name, abbreviation, required_credits, renewal_cycle_years, website_url)
values
  -- Qatar
  ('Qatar',        'QA', 'Qatar Council for Healthcare Practitioners',   'QCHP',    50, 3, 'https://www.qchp.org.qa'),

  -- UAE — Abu Dhabi
  ('UAE',          'AE', 'Department of Health – Abu Dhabi',             'DOH-AD',  60, 3, 'https://www.doh.gov.ae'),

  -- UAE — Dubai
  ('UAE',          'AE', 'Dubai Health Authority',                       'DHA',     60, 3, 'https://www.dha.gov.ae'),

  -- UAE — Federal
  ('UAE',          'AE', 'Ministry of Health and Prevention UAE',        'MOH-UAE', 60, 3, 'https://www.mohap.gov.ae'),

  -- Saudi Arabia
  ('Saudi Arabia', 'SA', 'Saudi Commission for Health Specialties',      'SCFHS',   60, 5, 'https://www.scfhs.org.sa'),

  -- Kuwait
  ('Kuwait',       'KW', 'Ministry of Health Kuwait',                    'MOH-KW',  30, 2, null),

  -- Bahrain
  ('Bahrain',      'BH', 'National Health Regulatory Authority',         'NHRA',    50, 3, 'https://www.nhra.bh'),

  -- Oman
  ('Oman',         'OM', 'Oman Medical Specialty Board',                 'OMSB',    50, 3, 'https://www.omsb.org')

on conflict (abbreviation) do nothing;

-- ─── Backfill: map existing text values to FK where we can ───────────────────
-- Safe to run multiple times (ON CONFLICT above + WHERE already-null filter).

update professional_profiles pp
set    licensing_authority_id = la.id
from   licensing_authorities la
where  pp.licensing_authority_id is null
  and  (
    upper(pp.licensing_authority) like '%' || la.abbreviation || '%'
    or upper(pp.licensing_authority) like '%' || upper(la.abbreviation) || '%'
  );

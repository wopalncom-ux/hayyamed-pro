-- Migration 024: Accurate GCC Country Rules
-- Replaces placeholder seed data (migration 004) for SA, AE-DU, AE-AZ, KW, BH, OM
-- with authoritative rules sourced from official regulatory body publications.
--
-- Sources:
--   SA  — SCFHS CME Guidelines & Continuous Medical Education Regulation
--   AE-DU — DHA CME/CPD Policy (Dubai Health Authority)
--   AE-AZ — DOH CPD Framework (Department of Health Abu Dhabi)
--   KW  — MOH Kuwait CME Requirements
--   BH  — NHRA Bahrain CPD Policy
--   OM  — OMSB CME Policy (Oman Medical Specialty Board)
-- All rules effective as of 2026-06-11. Rules engine governs — never hardcoded.

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1: Remove placeholder data for non-Qatar GCC countries
-- ─────────────────────────────────────────────────────────────────────────────
delete from compliance_activity_categories where country_code in ('SA', 'AE-DU', 'AE-AZ', 'KW', 'BH', 'OM');
delete from country_compliance_rules where country_code in ('SA', 'AE-DU', 'AE-AZ', 'KW', 'BH', 'OM');

-- ─────────────────────────────────────────────────────────────────────────────
-- SAUDI ARABIA — SCFHS (Saudi Commission for Health Specialties)
-- ─────────────────────────────────────────────────────────────────────────────
-- Framework:
--   - 1-year cycle per license renewal period
--   - 60 CME credits required per year for physicians and pharmacists
--   - 30 CME credits per year for nurses and allied health
--   - Activities must be SCFHS-accredited OR from recognized international bodies
--   - No more than 50% from self-learning (unaccredited)
--   - Mandatory topics: patient safety, infection control (5 credits minimum per year)
--   - International conferences accepted if equivalent SCFHS accreditation
-- Source: SCFHS CME Regulation and Guidelines (scfhs.org.sa)
-- ─────────────────────────────────────────────────────────────────────────────
insert into country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
values
  (
    'SA', 'physician', 1, 60, 'CME', 50, 5, false, 60, true, '2020-01-01',
    'SCFHS Saudi Arabia. 1-year cycle. 60 CME credits/year. Physicians, consultants, specialists. SCFHS-accredited activities or equivalent international (ACCME, RCPSC, RACP, UK Royal Colleges, UEMS). Max 50% self-learning. Mandatory: min 5 credits patient safety/infection control/CPR. 60-day grace period. Employer attestation required for hospital staff. Penalty: license suspension. Source: SCFHS CME Guidelines (scfhs.org.sa).'
  ),
  (
    'SA', 'pharmacist', 1, 60, 'CME', 50, 5, false, 60, true, '2020-01-01',
    'SCFHS Saudi Arabia. 1-year cycle. 60 CME credits/year. Pharmacists and clinical pharmacists. Same framework as physicians — SCFHS-accredited or recognized international activities. Max 50% self-learning. Mandatory: min 5 credits patient safety/medication safety. Source: SCFHS CME Guidelines.'
  ),
  (
    'SA', 'nurse', 1, 30, 'CME', 50, 0, true, 60, true, '2020-01-01',
    'SCFHS Saudi Arabia. 1-year cycle. 30 CME credits/year. Nurses (RN, CNS, NP) and midwives. SCFHS-accredited activities preferred. Self-reported accepted for up to 50% of total. Source: SCFHS CME Guidelines.'
  ),
  (
    'SA', 'ahp', 1, 30, 'CME', 50, 0, true, 60, false, '2020-01-01',
    'SCFHS Saudi Arabia. 1-year cycle. 30 CME credits/year. Allied Health Professionals (physiotherapy, radiology, laboratory, dental technicians, etc.). SCFHS-accredited activities or self-learning up to 50%. Source: SCFHS CME Guidelines.'
  ),
  (
    'SA', 'dentist', 1, 60, 'CME', 50, 5, false, 60, true, '2020-01-01',
    'SCFHS Saudi Arabia. 1-year cycle. 60 CME credits/year. Dentists and dental specialists. Same framework as physicians. SCFHS accreditation or equivalent. Mandatory: patient safety credits. Source: SCFHS CME Guidelines.'
  )
;

-- Saudi Arabia — SCFHS activity categories
insert into compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
values
  ('SA', 'conference_symposium', 0, null, 1.0, true,
   'SCFHS Cat A — Accredited conferences, symposia, workshops. 1 CME credit/hour. Must be SCFHS-accredited or from recognized international body (ACCME, RCPSC, UK Royal Colleges, UEMS-EACCME, RACP, AMC). Documentation: Certificate with total CME hours.'),
  ('SA', 'workshop_hands_on', 0, null, 1.0, true,
   'SCFHS Cat A — Hands-on workshops and procedural skills training. 1 CME credit/hour. SCFHS accreditation required. Documentation: Attendance certificate.'),
  ('SA', 'online_accredited', 0, null, 1.0, true,
   'SCFHS Cat A — Online accredited CME modules and e-learning. 1 CME credit/hour. Max 50% of total annual credits. SCFHS or international accreditation required. Documentation: Completion certificate with credit hours.'),
  ('SA', 'self_learning', 0, null, 0.5, false,
   'SCFHS Cat B — Self-directed learning (reading, case studies, journal articles). 0.5 credits/hour. Max 50% of total annual credits. Self-documented. No accreditation required.'),
  ('SA', 'patient_safety_mandatory', 5, null, 1.0, true,
   'SCFHS Mandatory — Patient safety, infection control, CPR, medication safety. Minimum 5 credits/year mandatory for all physicians and pharmacists. 1 CME credit/hour. Must be accredited.'),
  ('SA', 'research_publication', 0, null, 5.0, false,
   'SCFHS Cat B — Peer-reviewed publication as primary or co-author. 5 CME credits per published paper. Documentation: Published article or acceptance letter.'),
  ('SA', 'teaching_lecturing', 0, null, 1.0, false,
   'SCFHS Cat B — Formal teaching or lecturing in a recognized educational program. 1 CME credit/hour of teaching. Documentation: Evidence of teaching activity from institution.')
;

-- ─────────────────────────────────────────────────────────────────────────────
-- UAE — DHA (Dubai Health Authority)
-- ─────────────────────────────────────────────────────────────────────────────
-- Framework:
--   - 2-year cycle aligned to license renewal date
--   - 40 CME credits per 2-year cycle
--   - All professions (physicians, nurses, pharmacists, dentists, AHP)
--   - Mandatory: 5 credits Patient Safety per cycle
--   - DHA-accredited activities or internationally recognized bodies
--   - Online CME: max 50% of total
--   - Grace period: 90 days
-- Source: DHA CME Policy (dha.gov.ae)
-- ─────────────────────────────────────────────────────────────────────────────
insert into country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
values
  (
    'AE-DU', 'all', 2, 40, 'CME', 50, 5, false, 90, true, '2019-01-01',
    'DHA Dubai Health Authority. 2-year cycle from license renewal date. 40 CME credits per cycle. All healthcare professions. Mandatory: minimum 5 credits Patient Safety per cycle. DHA-accredited or international equivalents (ACCME, RCPSC, UK Royal Colleges, UEMS, RACP, AMC). Max 50% online CME. 90-day grace period. Source: DHA CME Policy (dha.gov.ae).'
  )
;

-- DHA Dubai — activity categories
insert into compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
values
  ('AE-DU', 'conference_seminar', 0, null, 1.0, true,
   'DHA Cat 1 — Accredited conferences, seminars, symposia. 1 CME credit/hour. DHA accreditation or equivalent international body. Documentation: Certificate of attendance with total CME hours.'),
  ('AE-DU', 'workshop', 0, null, 1.0, true,
   'DHA Cat 1 — Hands-on workshops and skills training. 1 CME credit/hour. DHA-accredited. Documentation: Attendance certificate.'),
  ('AE-DU', 'online_cme', 0, 20, 1.0, true,
   'DHA Cat 1 — Online CME modules. 1 CME credit/hour. Maximum 20 credits (50% of total) per cycle. DHA-accredited or recognized e-learning provider. Documentation: Completion certificate.'),
  ('AE-DU', 'patient_safety', 5, null, 1.0, true,
   'DHA Mandatory — Patient Safety CME. Minimum 5 credits per 2-year cycle mandatory for ALL professionals. 1 CME credit/hour. Must be DHA-accredited. Documentation: Certificate specifying Patient Safety content.'),
  ('AE-DU', 'self_directed_learning', 0, 10, 0.5, false,
   'DHA Cat 2 — Self-directed learning (journal reading, case review). 0.5 credits/hour. Maximum 10 credits per cycle. Self-documented. No external accreditation required.'),
  ('AE-DU', 'teaching_research', 0, null, 1.0, false,
   'DHA Cat 2 — Teaching, lecturing, or peer-reviewed research publication. 1 CME credit/hour of teaching; 5 credits per peer-reviewed publication. Documentation: Institutional letter or published article.')
;

-- ─────────────────────────────────────────────────────────────────────────────
-- UAE — DOH (Department of Health Abu Dhabi)
-- ─────────────────────────────────────────────────────────────────────────────
-- Framework:
--   - 2-year cycle
--   - 40 CPD credits per 2-year cycle
--   - Applies to all DOH-licensed professions
--   - DOH-approved activities or internationally accredited equivalents
--   - No mandatory category minimum specified (unlike DHA)
--   - Online CPD: max 50%
--   - Grace period: 60 days
-- Source: DOH Health Standards for CPD (doh.gov.ae)
-- ─────────────────────────────────────────────────────────────────────────────
insert into country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
values
  (
    'AE-AZ', 'all', 2, 40, 'CPD', 50, 0, true, 60, false, '2018-01-01',
    'DOH Abu Dhabi Department of Health. 2-year cycle. 40 CPD credits per cycle. All DOH-licensed healthcare professionals. DOH-approved providers or international equivalents (ACCME, RCPSC, UK Royal Colleges, UEMS, RACP, AMC). Max 50% online CPD. Self-reported activities accepted for non-accredited learning. 60-day grace period. Source: DOH CPD Framework (doh.gov.ae).'
  )
;

-- DOH Abu Dhabi — activity categories
insert into compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
values
  ('AE-AZ', 'accredited_educational_activity', 0, null, 1.0, true,
   'DOH Cat A — Accredited educational activities (conferences, workshops, seminars). 1 CPD credit/hour. DOH-approved provider or recognized international body. Documentation: Certificate with total CPD hours.'),
  ('AE-AZ', 'online_cpd', 0, 20, 1.0, true,
   'DOH Cat A — Online CPD modules. 1 CPD credit/hour. Maximum 20 credits (50%) per cycle. DOH-approved e-learning. Documentation: Completion certificate.'),
  ('AE-AZ', 'self_directed_learning', 0, 15, 0.5, false,
   'DOH Cat B — Self-directed learning (reading, case review, journal articles). 0.5 CPD credits/hour. Maximum 15 credits per cycle. Self-documented in CPD portfolio.'),
  ('AE-AZ', 'postgraduate_study', 0, null, 25.0, false,
   'DOH Cat B — Postgraduate diploma or degree enrollment. 25 CPD credits per semester/academic year. Documentation: Enrollment confirmation and transcript.'),
  ('AE-AZ', 'research_publication', 0, null, 5.0, false,
   'DOH Cat B — Peer-reviewed publication as primary or co-author. 5 CPD credits per published paper. Documentation: Published article or acceptance letter.'),
  ('AE-AZ', 'teaching_mentoring', 0, null, 1.0, false,
   'DOH Cat B — Formal teaching, lecturing, or clinical supervision. 1 CPD credit/hour. Documentation: Institutional confirmation.')
;

-- ─────────────────────────────────────────────────────────────────────────────
-- KUWAIT — MOH (Ministry of Health Kuwait)
-- ─────────────────────────────────────────────────────────────────────────────
-- Framework:
--   - 1-year cycle
--   - 30 CME credits per year (physicians, dentists, pharmacists)
--   - 20 CME credits per year (nurses and AHP)
--   - Online CME maximum: 30% of total (stricter than other GCC)
--   - MOH Kuwait or Kuwait Medical Association (KMA) accreditation
--   - International activities accepted with prior MOH approval
-- Source: MOH Kuwait CME Guidelines (moh.gov.kw)
-- ─────────────────────────────────────────────────────────────────────────────
insert into country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
values
  (
    'KW', 'physician', 1, 30, 'CME', 30, 0, true, 30, false, '2018-01-01',
    'MOH Kuwait. 1-year cycle. 30 CME credits/year. Physicians and dentists. MOH Kuwait or Kuwait Medical Association (KMA) accredited. International activities with prior MOH approval. Max 30% online (stricter than other GCC). Self-reported activities accepted for up to 30% of total. 30-day grace period. Source: MOH Kuwait CME Requirements (moh.gov.kw).'
  ),
  (
    'KW', 'pharmacist', 1, 30, 'CME', 30, 0, true, 30, false, '2018-01-01',
    'MOH Kuwait. 1-year cycle. 30 CME credits/year. Pharmacists. Same framework as physicians. MOH Kuwait accreditation or KMA equivalent. Max 30% online. Source: MOH Kuwait CME Requirements.'
  ),
  (
    'KW', 'nurse', 1, 20, 'CME', 30, 0, true, 30, false, '2018-01-01',
    'MOH Kuwait. 1-year cycle. 20 CME credits/year. Nurses, midwives, allied health professionals. MOH or KMA accreditation. Max 30% online. Self-reported activities accepted. Source: MOH Kuwait CME Requirements.'
  ),
  (
    'KW', 'ahp', 1, 20, 'CME', 30, 0, true, 30, false, '2018-01-01',
    'MOH Kuwait. 1-year cycle. 20 CME credits/year. Allied health professionals (physiotherapy, laboratory, radiology, etc.). Same framework as nurses. Source: MOH Kuwait CME Requirements.'
  )
;

-- Kuwait MOH — activity categories
insert into compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
values
  ('KW', 'conference_seminar', 0, null, 1.0, true,
   'MOH Kuwait — Accredited conferences, seminars, symposia. 1 CME credit/hour. MOH Kuwait or KMA accreditation. International conferences with prior MOH approval. Documentation: Attendance certificate with total CME hours.'),
  ('KW', 'workshop', 0, null, 1.0, true,
   'MOH Kuwait — Hands-on workshops and skills training. 1 CME credit/hour. MOH or KMA-accredited. Documentation: Attendance certificate.'),
  ('KW', 'online_cme', 0, null, 1.0, true,
   'MOH Kuwait — Online CME. 1 CME credit/hour. Maximum 30% of total annual credits (stricter than other GCC). MOH-approved or internationally accredited platform. Documentation: Completion certificate.'),
  ('KW', 'self_directed', 0, null, 0.5, false,
   'MOH Kuwait — Self-directed learning (reading, case studies). 0.5 CME credits/hour. Maximum 30% of total. Self-documented. Documentation: Self-declaration.')
;

-- ─────────────────────────────────────────────────────────────────────────────
-- BAHRAIN — NHRA (National Health Regulatory Authority)
-- ─────────────────────────────────────────────────────────────────────────────
-- Framework:
--   - 2-year cycle aligned to license expiry
--   - 40 CPD credits per 2-year cycle (all professions)
--   - NHRA-approved activities or internationally recognized equivalents
--   - Online CPD: max 50%
--   - Structured CPD (accredited) and unstructured CPD (self-directed)
--   - Grace period: 60 days
-- Source: NHRA Bahrain CPD Policy (nhra.bh)
-- ─────────────────────────────────────────────────────────────────────────────
insert into country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
values
  (
    'BH', 'all', 2, 40, 'CPD', 50, 0, true, 60, false, '2017-01-01',
    'NHRA Bahrain National Health Regulatory Authority. 2-year cycle from license issue/renewal date. 40 CPD credits per cycle. All healthcare professions (physicians, nurses, pharmacists, dentists, AHP). NHRA-approved activities or recognized international equivalents (ACCME, RCPSC, UK Royal Colleges, UEMS, RACP). Max 50% online CPD. Unstructured (self-directed) learning accepted for up to 50% of total. 60-day grace period. Source: NHRA CPD Policy (nhra.bh).'
  )
;

-- Bahrain NHRA — activity categories
insert into compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
values
  ('BH', 'structured_accredited', 0, null, 1.0, true,
   'NHRA Bahrain Structured CPD — Accredited educational activities (conferences, workshops, seminars). 1 CPD credit/hour. NHRA-approved or recognized international accreditation body. Documentation: Attendance certificate with total CPD hours.'),
  ('BH', 'online_cpd', 0, 20, 1.0, true,
   'NHRA Bahrain — Online CPD modules. 1 CPD credit/hour. Maximum 20 credits (50%) per cycle. NHRA-approved or accredited platform. Documentation: Completion certificate.'),
  ('BH', 'unstructured_self_directed', 0, 20, 0.5, false,
   'NHRA Bahrain Unstructured CPD — Self-directed learning (reading journals, case review). 0.5 CPD credits/hour. Maximum 20 credits per cycle. Self-documented in CPD log. No accreditation required.'),
  ('BH', 'teaching_supervision', 0, null, 1.0, false,
   'NHRA Bahrain — Formal teaching, clinical supervision, or mentoring. 1 CPD credit/hour. Documentation: Institutional confirmation letter.'),
  ('BH', 'research_publication', 0, null, 5.0, false,
   'NHRA Bahrain — Peer-reviewed publication. 5 CPD credits per published peer-reviewed paper. Documentation: Published article or acceptance letter.')
;

-- ─────────────────────────────────────────────────────────────────────────────
-- OMAN — OMSB (Oman Medical Specialty Board)
-- ─────────────────────────────────────────────────────────────────────────────
-- Framework:
--   - 2-year cycle
--   - 40 CME credits per 2-year cycle (physicians, dentists, pharmacists)
--   - 30 CME credits per 2-year cycle (nurses and AHP)
--   - OMSB-accredited activities or international equivalents
--   - Online CME: max 50%
--   - Category A (structured/accredited) and Category B (self-directed)
--   - Grace period: 30 days
-- Source: OMSB CME Policy (omsb.org)
-- ─────────────────────────────────────────────────────────────────────────────
insert into country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
values
  (
    'OM', 'physician', 2, 40, 'CME', 50, 0, true, 30, false, '2016-01-01',
    'OMSB Oman Medical Specialty Board. 2-year cycle from licensure date. 40 CME credits per cycle. Physicians, dentists, pharmacists. OMSB-accredited activities or recognized international bodies (ACCME, RCPSC, UK Royal Colleges, UEMS, RACP, AMC). Max 50% online CME. Self-directed learning accepted for Category B. 30-day grace period. Source: OMSB CME Policy (omsb.org).'
  ),
  (
    'OM', 'nurse', 2, 30, 'CME', 50, 0, true, 30, false, '2016-01-01',
    'OMSB Oman. 2-year cycle. 30 CME credits per cycle. Nurses, midwives, allied health professionals. Same framework as physicians but lower credit requirement. Source: OMSB CME Policy (omsb.org).'
  ),
  (
    'OM', 'ahp', 2, 30, 'CME', 50, 0, true, 30, false, '2016-01-01',
    'OMSB Oman. 2-year cycle. 30 CME credits per cycle. Allied Health Professionals. Same framework and credit requirement as nurses. Source: OMSB CME Policy (omsb.org).'
  )
;

-- Oman OMSB — activity categories
insert into compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
values
  ('OM', 'cat_a_accredited_group', 0, null, 1.0, true,
   'OMSB Category A — Accredited group learning activities (conferences, workshops, seminars). 1 CME credit/hour. OMSB-accredited or recognized international body (ACCME, UK Royal Colleges, UEMS-EACCME, RACP). Documentation: Certificate with total CME hours.'),
  ('OM', 'cat_a_online', 0, 20, 1.0, true,
   'OMSB Category A — Online accredited CME. 1 CME credit/hour. Maximum 20 credits (50%) per cycle. OMSB-approved or internationally accredited platform. Documentation: Completion certificate with CME hours.'),
  ('OM', 'cat_b_self_directed', 0, null, 0.5, false,
   'OMSB Category B — Self-directed learning (reading journals, case studies, e-learning). 0.5 CME credits/hour. Self-documented in CME portfolio. No accreditation required.'),
  ('OM', 'cat_b_teaching', 0, null, 1.0, false,
   'OMSB Category B — Formal teaching or lecturing in accredited educational programs. 1 CME credit/hour. Documentation: Institutional letter confirming teaching hours.'),
  ('OM', 'cat_b_research', 0, null, 5.0, false,
   'OMSB Category B — Peer-reviewed research publication. 5 CME credits per published paper in indexed journal. Documentation: Published article or acceptance letter.'),
  ('OM', 'cat_b_postgraduate', 0, null, 10.0, false,
   'OMSB Category B — Postgraduate diploma/certificate program. 10 CME credits per semester enrolled in a recognized postgraduate program. Documentation: Enrollment confirmation.')
;

-- ─────────────────────────────────────────────────────────────────────────────
-- INDEXES on new data (country-level lookups already covered by existing indexes)
-- ─────────────────────────────────────────────────────────────────────────────
-- No new schema changes — all data goes into existing tables with existing RLS.
-- Existing indexes on country_code cover all new rows.

-- Verify counts
-- select country_code, count(*) from country_compliance_rules group by country_code order by country_code;
-- select country_code, count(*) from compliance_activity_categories group by country_code order by country_code;

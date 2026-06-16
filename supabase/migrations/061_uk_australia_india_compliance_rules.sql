-- Migration 061: UK, Australia, India Compliance Rules
-- Phase 3 market readiness — rules engine entry for GB, AU, IN
-- No country-specific logic hardcoded — all governed by rules engine tables.
--
-- Sources:
--   GB/UK  — GMC Revalidation Framework (gmc-uk.org)
--            NMC Revalidation Standards (nmc.org.uk)
--            GPhC CPD Standards (pharmacyregulation.org)
--            GDC CPD Requirements (gdc-uk.org)
--   AU     — Medical Board of Australia CPD Registration Standard (medicalboard.gov.au)
--            Nursing & Midwifery Board CPD Standard (nursingmidwiferyboard.gov.au)
--            Pharmacy Board CPD Standard (pharmacyboard.gov.au)
--            Dental Board CPD Standard (dentalboard.gov.au)
--   IN     — NMC CME/CPD Regulation (nmc.org.in)
-- All rules effective as of 2026-06-16. Rules engine governs — never hardcoded.

-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1: Remove any placeholder data for these countries (idempotent)
-- ─────────────────────────────────────────────────────────────────────────────
DELETE FROM compliance_activity_categories WHERE country_code IN ('GB', 'AU', 'IN');
DELETE FROM country_compliance_rules WHERE country_code IN ('GB', 'AU', 'IN');

-- ─────────────────────────────────────────────────────────────────────────────
-- UNITED KINGDOM — GMC (General Medical Council) — Physicians & Surgeons
-- ─────────────────────────────────────────────────────────────────────────────
-- Framework:
--   - 5-year revalidation cycle with annual appraisal
--   - 50 CPD credits per year (RCP/RCPCH/RCS recommendation; 1 credit = 1 hour)
--   - GMC does not prescribe a specific number — 50/year is the Royal College consensus
--   - Activities: clinical and educational, internal and external
--   - Reflective practice is a formal CPD category
--   - No explicit online cap — balance of activity types expected
--   - Revalidation requires evidence of participation in formal appraisal
-- Source: GMC Revalidation Framework (gmc-uk.org/registration-and-licensing/revalidation)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
VALUES
  (
    'GB', 'physician', 1, 50, 'CPD', 100, 0, true, 0, false, '2012-12-01',
    'GMC UK. Annual CPD cycle (within 5-year revalidation). 50 CPD credits/year recommended by Royal Colleges (RCP, RCS, RCPCH, RCPsych). 1 CPD credit = 1 hour of verified learning. Activities: accredited courses, conferences, e-learning, audit, research, reflective practice, teaching. No formal online cap — balance expected. Self-reported reflective CPD accepted. Annual appraisal required; full revalidation every 5 years with Responsible Officer. Source: GMC Revalidation Framework (gmc-uk.org); RCP CPD Guidance.'
  ),
  (
    'GB', 'dentist', 1, 100, 'CPD', 100, 10, false, 0, false, '2018-01-01',
    'GDC UK (General Dental Council). Annual CPD cycle (100 verifiable hours per 5-year enhanced CPD scheme cycle = 20/year; mandate records as annual). Minimum 10 hours from mandatory recommended topics (patient safety, disinfection and decontamination, medical emergencies) per 5 years. All activities must be verifiable with a CPD outcome statement. Reflective CPD statement required per activity. Source: GDC Enhanced CPD Scheme (gdc-uk.org/professionals/cpd). Note: cycle_years=1 represents annual logging; GDC assesses across the 5-year enhanced scheme period.'
  )
;

-- ─────────────────────────────────────────────────────────────────────────────
-- UNITED KINGDOM — NMC (Nursing and Midwifery Council) — Nurses & Midwives
-- ─────────────────────────────────────────────────────────────────────────────
-- Framework:
--   - 3-year revalidation cycle (registration renewal every 3 years)
--   - 35 hours CPD per 3-year period; at least 20 hours must be participatory
--   - Must have 5 written reflective accounts
--   - Confirmation by line manager or peer required
--   - No specific online cap — but participatory component requires interactive learning
-- Source: NMC Revalidation Standards (nmc.org.uk/revalidation)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
VALUES
  (
    'GB', 'nurse', 3, 35, 'CPD', 43, 20, true, 0, true, '2016-04-01',
    'NMC UK (Nursing and Midwifery Council). 3-year revalidation cycle. 35 hours CPD per 3-year registration renewal period. Mandatory: at least 20 of the 35 hours must be participatory (interactive group learning, not self-study alone). 5 written reflective accounts required. Confirmation from line manager or registered healthcare professional required. Self-directed (individual) CPD accepted for up to 15 hours (43% of 35). Applies to all NMC-registered nurses, midwives, and nursing associates. Source: NMC Revalidation Standards (nmc.org.uk). Note: online_credits_max_pct = 43 represents the 15/35 non-participatory allowance.'
  )
;

-- ─────────────────────────────────────────────────────────────────────────────
-- UNITED KINGDOM — GPhC (General Pharmaceutical Council) — Pharmacists
-- ─────────────────────────────────────────────────────────────────────────────
-- Framework:
--   - Annual renewal
--   - No minimum hours prescribed — portfolio-based with defined outcomes
--   - 9+ CPD entries per year required (GPhC recommends; not an hour minimum)
--   - Practical equivalence: ~20 hours structured CPD per year
--   - Must demonstrate professional development across patient/population, pharmacy practice
--   - Source: GPhC Standards for CPD (pharmacyregulation.org)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
VALUES
  (
    'GB', 'pharmacist', 1, 20, 'CPD', 100, 0, true, 0, false, '2010-01-01',
    'GPhC UK (General Pharmaceutical Council). Annual renewal. GPhC prescribes outcomes not hours — minimum 9 CPD entries per year covering learning relevant to practice context. Practical equivalence: ~20 hours CPD per year. All activity types accepted (courses, e-learning, reading, reflection, audit). Portfolio-based evidence required; no formal accreditation required for activities. Self-reported CPD accepted. Source: GPhC Standards for the education and training of pharmacists and GPhC CPD requirements (pharmacyregulation.org). Note: 20 credits used as rules engine practical equivalent; actual requirement is outcome/entry-based.'
  )
;

-- UK GB — activity categories (shared across GMC/NMC/GDC professions)
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
   'UK CPD — Enrolment in accredited postgraduate diploma, MSc, or fellowship programme. 10 CPD credits per academic semester or equivalent. Documentation: Enrolment letter and transcript. Applicable across all UK healthcare professions.')
;

-- ─────────────────────────────────────────────────────────────────────────────
-- AUSTRALIA — Medical Board of Australia (MBA/AHPRA) — Physicians
-- ─────────────────────────────────────────────────────────────────────────────
-- Framework:
--   - Annual CPD registration standard (revised 2023 — significant update)
--   - 50 CPD hours per year for most practitioners
--   - Mandatory: minimum 5 hours performance review (peer review, audit, multi-source feedback)
--   - Mandatory: minimum 5 hours outcome measurement (audit, QI, data review)
--   - All activity types (educational activities, review, measuring outcomes)
--   - Online: no specific cap (balance expected)
--   - Grace period: aligned to registration renewal date (no grace period in standard)
-- Source: Medical Board of Australia CPD Registration Standard (effective 1 Jan 2023)
--         medicalboard.gov.au/registration/cpd.aspx
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
VALUES
  (
    'AU', 'physician', 1, 50, 'CPD', 100, 10, true, 0, false, '2023-01-01',
    'Medical Board of Australia (AHPRA). Annual registration. 50 CPD hours per year (revised standard effective 1 Jan 2023). Mandatory 10 hours from two specified categories: minimum 5 hours performance review (peer review, multi-source feedback, clinical audit); minimum 5 hours measuring outcomes (audit outcomes, data collection). Remainder from any CPD type: educational activities (conferences, workshops, e-learning, reading). No specific online cap — balance expected. Self-reported CPD accepted. CPD home body (college fellowship) activities receive priority. Source: Medical Board of Australia CPD Registration Standard (medicalboard.gov.au). AHPRA oversight.'
  ),
  (
    'AU', 'nurse', 1, 20, 'CPD', 100, 0, true, 0, false, '2016-01-01',
    'Nursing and Midwifery Board of Australia (NMBA/AHPRA). Annual registration renewal. 20 CPD hours per year. Activities must be relevant to context of practice. All activity types accepted: workshops, conferences, e-learning, clinical education, reflective practice. Self-reported CPD accepted in NMBA portfolio. No formal accreditation required for activities. Documentation: Retain evidence for 5 years in case of AHPRA audit. Source: NMBA CPD Registration Standard (nursingmidwiferyboard.gov.au).'
  ),
  (
    'AU', 'pharmacist', 1, 40, 'CPD', 100, 10, true, 0, false, '2020-01-01',
    'Pharmacy Board of Australia (PBA/AHPRA). Annual registration. 40 CPD hours per year. Mandatory: minimum 10 hours from approved CPD activities (pharmacy-specific accredited programs). Remaining 30 hours from any relevant professional development. Self-recorded CPD acceptable for non-accredited learning. SHPA, PSA, APhA, ACPE-accredited activities accepted internationally. Documentation: CPD record retained for 5 years. Source: Pharmacy Board of Australia CPD Standard (pharmacyboard.gov.au).'
  ),
  (
    'AU', 'dentist', 1, 60, 'CPD', 100, 20, false, 0, false, '2015-01-01',
    'Dental Board of Australia (DBA/AHPRA). Annual registration. 60 CPD hours per year. Mandatory: minimum 20 hours from hands-on clinical or safety-critical activities (patient safety, infection control, dental emergencies, radiography). Remaining 40 hours from any relevant CPD. Accredited activities preferred; non-accredited accepted with evidence. No online cap but clinical safety topics require in-person/simulation. Documentation: CPD record with evidence retained for 5 years. Source: Dental Board of Australia CPD Standard (dentalboard.gov.au).'
  ),
  (
    'AU', 'ahp', 1, 30, 'CPD', 100, 0, true, 0, false, '2016-01-01',
    'Allied Health Professions — AHPRA. Annual registration. 30 CPD hours per year (approximate — varies by specific board: Physiotherapy, Optometry, Psychology, etc. most require 20–40 hours). Activities relevant to scope of practice. Self-reported CPD accepted. Documentation: evidence retained 5 years. Source: Respective national board registration standards under AHPRA (ahpra.gov.au). Note: Specific boards (e.g., Psychology Board) may have different requirements — this row captures the median standard.'
  )
;

-- Australia — activity categories
INSERT INTO compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
VALUES
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
   'AHPRA Australia — Enrolment in postgraduate degree, graduate diploma, or specialist fellowship program. 20 CPD hours per semester. Documentation: Enrolment confirmation, transcript, or fellowship program participation evidence.')
;

-- ─────────────────────────────────────────────────────────────────────────────
-- INDIA — NMC (National Medical Commission) — Physicians
-- ─────────────────────────────────────────────────────────────────────────────
-- Framework:
--   - 5-year registration renewal cycle (aligned to license renewal)
--   - 30 CME credits required per 5-year cycle
--   - NMC-accredited events or events organized by medical associations
--   - Online CME accepted (MCI/NMC online portal for accreditation)
--   - No mandatory category minimum specified by NMC
--   - Self-reported learning limited — NMC portal registration required for accredited events
-- Source: NMC CME Regulations (Continuing Medical Education) (nmc.org.in)
--         Former MCI CME Guidelines — superseded by NMC Act 2020
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO country_compliance_rules (
  country_code, profession_code, cycle_years, total_credits_required,
  credit_terminology, online_credits_max_pct, mandatory_credits_min,
  self_reported_allowed, grace_period_days, employer_report_required,
  effective_from, notes
)
VALUES
  (
    'IN', 'physician', 5, 30, 'CME', 50, 0, false, 90, false, '2020-09-25',
    'NMC India (National Medical Commission, formerly MCI). 5-year registration renewal cycle. 30 CME credits required per 5-year cycle (6 credits/year effective minimum). NMC-accredited CME programs via NMC portal or state medical council. Events by Indian Medical Association (IMA), specialty associations (API, FOGSI, IAPSM, etc.) accepted if NMC-registered. International CME from WHO-recognized bodies accepted. Max 50% from online CME. Self-reported unaccredited activities not accepted — NMC portal registration mandatory. 90-day grace period for renewal. Source: NMC CME Regulations (nmc.org.in); NMC Act 2020 (No. 30 of 2020). Effective 25 Sep 2020.'
  ),
  (
    'IN', 'nurse', 5, 30, 'CME', 50, 0, false, 90, false, '2020-01-01',
    'INC India (Indian Nursing Council). 5-year registration renewal. 30 CME/CPD credits per 5-year period. INC-recognised programs and state nursing council approved events. Specialty nursing workshops, hospital in-service training counted if INC-approved. Max 50% online. Source: INC CPD Guidelines (indiannursingcouncil.org). Note: INC framework is less standardized than NMC — enforcement varies by state. This row captures the national guideline.'
  ),
  (
    'IN', 'pharmacist', 5, 30, 'CME', 50, 0, false, 90, false, '2020-01-01',
    'PCI India (Pharmacy Council of India). 5-year registration renewal. 30 CME credits per 5-year period. PCI-recognized programs, pharmacy conferences, hospital pharmacy workshops. IPA (Indian Pharmaceutical Association) events accepted. Max 50% online. Documentation: Certificate of participation from PCI-recognised organizer. Source: PCI CPD Guidelines (pci.nic.in). Note: PCI framework in transition post-2020 — state pharmacy councils vary in enforcement.'
  )
;

-- India — activity categories
INSERT INTO compliance_activity_categories (
  country_code, category_name, min_credits_per_cycle, max_credits_per_cycle,
  credits_per_hour, accreditation_required, notes
)
VALUES
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

-- ─────────────────────────────────────────────────────────────────────────────
-- INDEXES — no schema changes; existing country_code indexes cover new rows
-- ─────────────────────────────────────────────────────────────────────────────
-- Verify row counts post-migration:
-- SELECT country_code, profession_code, cycle_years, total_credits_required, credit_terminology
-- FROM country_compliance_rules WHERE country_code IN ('GB','AU','IN') ORDER BY country_code, profession_code;
-- SELECT country_code, category_name FROM compliance_activity_categories WHERE country_code IN ('GB','AU','IN') ORDER BY country_code;

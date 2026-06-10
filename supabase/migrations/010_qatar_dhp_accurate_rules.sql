-- Migration 010: Accurate Qatar DHP-AS CPD Rules
-- Replaces placeholder Qatar seed data with authoritative rules extracted from official MOPH Qatar PDFs.
--
-- Sources:
--   MOPH/DHP/AS/CPD/002 v4.3 — CPD Cycle Policy (effective 2016-03-07, revised Dec 2020)
--   MOPH/DHP/AS/CPD/005 v4.4 — CPD Recording Policy
--   DHP-AS CPD Framework Table (official)
--   DHP Guidelines: Physicians, Nurses, Pharmacists, Dentists
--   DHP-AS List of International CPD Accreditation Bodies (List A & List B)
-- Governing law: Emiri Decree No. 7 for the Year 2013
-- Authority: DHP-AS — Department of Healthcare Professions, Accreditation Section, MOPH Qatar

-- ─────────────────────────────────────────────────────────
-- STEP 1: Remove incorrect placeholder data for Qatar
-- ─────────────────────────────────────────────────────────
delete from compliance_activity_categories where country_code = 'QA';
delete from country_compliance_rules where country_code = 'QA';

-- ─────────────────────────────────────────────────────────
-- STEP 2: Insert accurate Qatar DHP-AS profession-specific rules
--
-- Key facts (same framework for ALL Qatar-licensed professions):
--   - Cycle: 2 years (starts from each practitioner's date of licensure)
--   - Annual minimum: 40 credits/year
--   - Cycle total: 80 credits per 2-year cycle
--   - MANDATORY: Min 40 credits from Category 1 per cycle
--   - MANDATORY: Min 40 credits from Category 2 and/or 3 per cycle
--   - Grace period: NONE — system blocks renewal if non-compliant
--   - Non-adherence (annual miss): monitoring + CPD Audit
--   - Non-compliance (category or cycle miss): registration TERMINATED
--   - Credit transfer: up to 10 credits from 6 months before cycle start
-- ─────────────────────────────────────────────────────────
insert into country_compliance_rules (
  country_code,
  profession_code,
  cycle_years,
  total_credits_required,
  credit_terminology,
  online_credits_max_pct,
  mandatory_credits_min,
  self_reported_allowed,
  grace_period_days,
  employer_report_required,
  effective_from,
  notes
)
values
  (
    'QA', 'physician', 2, 80, 'CPD', 100, 40, true, 0, false, '2016-03-07',
    'DHP-AS Qatar. 2yr cycle from licensure date. 40 credits/year minimum. 80 total/cycle. MANDATORY: min 40 credits Cat1 (Accredited Group Learning) + min 40 credits Cat2/Cat3 per cycle. System blocks renewal — no grace period. Non-compliance → license termination (MOPH/DHP/AS/CPD/005). Professions: GP, Specialty, Consultant. Qualifying exam required for some scopes (IFOM/USMLE/PLAB/AMC/MCCQE/PRES/MRCGP-AKT for Cat3 specialties). Emiri Decree No. 7/2013. Policy MOPH/DHP/AS/CPD/002 v4.3.'
  ),
  (
    'QA', 'nurse', 2, 80, 'CPD', 100, 40, true, 0, false, '2016-03-07',
    'DHP-AS Qatar. Same 2yr/80cr framework. MANDATORY: min 40 Cat1 + min 40 Cat2/Cat3. Scopes: RGN, CNS, NE, NP, Midwife, Assistant Nurse, LPN, CMS. Prometric qualifying exam required for RGN and Midwife. NCLEX exempts Prometric if passed within previous 5 years. Online/distance nursing degrees NOT accepted for qualification. Policy MOPH/DHP/AS/CPD/002 v4.3.'
  ),
  (
    'QA', 'pharmacist', 2, 80, 'CPD', 100, 40, true, 0, false, '2016-03-07',
    'DHP-AS Qatar. Same 2yr/80cr framework. MANDATORY: min 40 Cat1 + min 40 Cat2/Cat3. Scopes: Pharmacist, Industrial Pharmacist, Clinical Pharmacist, Pharmacy Technician, Pharmacy Technologist. Prometric required for Pharmacist and Clinical Pharmacist (exempted if Master''s in pharmacy or clinical pharmacy). Industrial Pharmacist: GMP exam (Pharmacy and Drug Control dept). Policy MOPH/DHP/AS/CPD/002 v4.3.'
  ),
  (
    'QA', 'dentist', 2, 80, 'CPD', 100, 40, true, 0, false, '2016-03-07',
    'DHP-AS Qatar. Same 2yr/80cr framework. MANDATORY: min 40 Cat1 + min 40 Cat2/Cat3. Scopes: General Dentist, General Dentist (Supervised), Dental Specialist (13 approved specialties). Prometric required for General Dentist (not for Supervised or Specialists). 13 specialties: Periodontics, Orthodontics, Pedodontics, Endodontics, Prosthodontics, Oral Medicine, Public Health Dentistry, Orofacial Pain, Oral Surgery, OMR, OMFS, Restorative Dentistry. Policy MOPH/DHP/AS/CPD/002 v4.3.'
  ),
  (
    'QA', 'ahp', 2, 80, 'CPD', 100, 40, true, 0, false, '2016-03-07',
    'DHP-AS Qatar. Allied Health Professionals. Same 2yr/80cr CPD framework. MANDATORY: min 40 Cat1 + min 40 Cat2/Cat3 per cycle. Policy MOPH/DHP/AS/CPD/002 v4.3.'
  )
;

-- ─────────────────────────────────────────────────────────
-- STEP 3: Insert accurate Qatar DHP-AS CPD activity categories
--
-- Three categories per DHP-AS CPD Framework Table (official):
--   Category 1 — Accredited Group Learning: 1 credit/hour
--   Category 2 — Self-Directed Learning: 0.5–25 credits (varies by activity)
--   Category 3 — Assessment Activities: 2 credits/hour
--
-- Cycle constraint: min 40 credits from Cat 1 per cycle (mandatory)
--                   min 40 credits from Cat 2 and/or Cat 3 per cycle (mandatory)
-- ─────────────────────────────────────────────────────────

insert into compliance_activity_categories (
  country_code,
  category_name,
  min_credits_per_cycle,
  max_credits_per_cycle,
  credits_per_hour,
  accreditation_required,
  accepted_accreditors,
  notes
)
values

  -- ── CATEGORY 1: Accredited Group Learning (1 credit/hour) ──────────────────
  -- Minimum 40 credits from the Cat1 group per 2-year cycle is MANDATORY.
  -- The min_credits_per_cycle here applies to individual activity types;
  -- the aggregate Cat1 minimum of 40 is enforced by the rules engine.

  (
    'QA', 'cat1_conference_seminar_symposia', 0, null, 1.0, true,
    '[
      "ACCME_USA","AAFP","AMA_PRA","ACPE_USA","ADA_CERP","AGD_PACE","AANP","ANCC","AAPA",
      "RCPSC_Canada","CFPC_Canada","CCCEP_Canada","CCME_Canada",
      "Federation_Royal_Colleges_UK","RCGP_UK","RCS_UK","RCOG_UK","RCPCH_UK","RCPsych_UK",
      "RCR_UK","RCPath_UK","RCA_UK","RCEM_UK","RCN_UK","RPS_UK","GDC_UK",
      "UEMS_EACCME","EBAC","EBAH",
      "AMC_Australia","RACP","RACS","RACGP","RANZCOG","RANZCO","RANZCR","RANZCP","ACEM_Australia",
      "SMC_Singapore","SDC_Singapore","Medical_Council_HK","HKAM",
      "MMC_Malaysia","NMC_India","IDA_India",
      "OMSB_Oman","KIMS_Kuwait","NHRA_Bahrain","MOH_UAE","DOH_AbuDhabi","DHA_Dubai",
      "SCFHS_Saudi","JMC_Jordan",
      "EHC_Egypt","Sudan_Medical_Council","HPCSA_SouthAfrica"
    ]',
    'Category 1 — Accredited Group Learning. Conferences, symposia, seminars (face-to-face or hybrid). 1 credit/hour. Accreditation by DHP-AS List A bodies required. Documentation: Certificate of attendance with total CPD hours. Qatar DHP-AS CPD Framework Table; Policy MOPH/DHP/AS/CPD/002 v4.3.'
  ),
  (
    'QA', 'cat1_workshop', 0, null, 1.0, true,
    '[
      "ACCME_USA","AAFP","AMA_PRA","RCPSC_Canada","CFPC_Canada",
      "Federation_Royal_Colleges_UK","RCGP_UK","RCS_UK","UEMS_EACCME","EBAC",
      "AMC_Australia","RACGP","RACP",
      "SMC_Singapore","MMC_Malaysia","SCFHS_Saudi","DHA_Dubai","DOH_AbuDhabi","OMSB_Oman"
    ]',
    'Category 1 — Accredited Group Learning. Hands-on workshops (face-to-face). 1 credit/hour. Accreditation by DHP-AS List A bodies required. Documentation: Certificate with total hours.'
  ),
  (
    'QA', 'cat1_educational_rounds', 0, null, 1.0, true,
    null,
    'Category 1 — Accredited Group Learning. Educational rounds: morning report, Grand rounds, Morbidity & Mortality rounds, tumor boards, case discussions. Must be institutionally organized. 1 credit/hour. Documentation: Certificate or letter with total hours attended.'
  ),
  (
    'QA', 'cat1_journal_club', 0, null, 1.0, true,
    null,
    'Category 1 — Accredited Group Learning. Formally organized journal clubs. Must be recognized by the institution. 1 credit/hour. Documentation: Certificate or letter with total hours.'
  ),
  (
    'QA', 'cat1_online_synchronous', 0, null, 1.0, true,
    '[
      "ACCME_USA","AAFP","AMA_PRA","AANP","ANCC","ACPE_USA",
      "RCPSC_Canada","CFPC_Canada","CCME_Canada",
      "RCGP_UK","RCS_UK","RCOG_UK","RCPCH_UK","RCPsych_UK","RCN_UK","RPS_UK",
      "UEMS_EACCME","EBAC","EBAH",
      "AMC_Australia","RACGP","RACP","RANZCP",
      "SMC_Singapore","MMC_Malaysia","SCFHS_Saudi","DHA_Dubai","DOH_AbuDhabi","OMSB_Oman","NHRA_Bahrain"
    ]',
    'Category 1 — Accredited Group Learning. Online synchronous OR blended learning. 1 credit/hour. CRITICAL: Only DHP-AS List B accreditors recognized (List B is a strict SUBSET of List A — not all List A bodies are on List B). Documentation: Certificate with total CPD hours. Policy MOPH/DHP/AS/CPD/002 v4.3.'
  ),

  -- ── CATEGORY 2: Self-Directed Learning (variable credit rates) ─────────────
  -- No individual activity cap specified by DHP-AS.
  -- Combined Cat2 + Cat3 total must reach minimum 40 credits per 2-year cycle.

  -- Clinical Practice sub-group
  (
    'QA', 'cat2_clinical_question_answering', 0, null, 0.5, false,
    null,
    'Category 2 — Self-Directed Learning (Clinical Practice). Answering self-identified clinical questions using evidence. 0.5 credits/hour. Self-documented in CPD ePortfolio or third-party transcript. DHP-AS CPD Framework Table.'
  ),
  (
    'QA', 'cat2_reading_journals_books', 0, null, 1.0, false,
    null,
    'Category 2 — Self-Directed Learning (Clinical Practice). Reading journals, books, or monographs. 1 credit/hour. Self-documented in CPD ePortfolio.'
  ),
  (
    'QA', 'cat2_self_learning_modules', 0, null, 1.0, false,
    null,
    'Category 2 — Self-Directed Learning (Clinical Practice). Completing self-learning modules (asynchronous eLearning). 1 credit/hour. Self-documented.'
  ),
  (
    'QA', 'cat2_podcasts_webcasts', 0, null, 0.5, false,
    null,
    'Category 2 — Self-Directed Learning (Clinical Practice). Viewing podcasts or webcasts (asynchronous). 0.5 credits/hour. Self-documented in CPD ePortfolio.'
  ),

  -- Education & Training sub-group
  (
    'QA', 'cat2_postgraduate_degree_diploma', 0, null, 25.0, false,
    null,
    'Category 2 — Self-Directed Learning (Education & Training). Postgraduate degree or diploma recognized by a professional body. 25 credits per semester or per course (not per hour). Documentation: Enrollment confirmation and transcript. DHP-AS CPD Framework Table.'
  ),
  (
    'QA', 'cat2_formal_teaching_preparation', 0, null, 2.0, false,
    null,
    'Category 2 — Self-Directed Learning (Education & Training). Preparation for formal teaching (lectures, tutorials). 2 credits/hour of preparation time. Documentation: Evidence of teaching activity delivered.'
  ),
  (
    'QA', 'cat2_assessment_tool_development', 0, null, 2.0, false,
    null,
    'Category 2 — Self-Directed Learning (Education & Training). Development of assessment tools: OSCE stations, MCQ questions, SAQs. 2 credits/hour. Documentation: Evidence of tool creation/use.'
  ),
  (
    'QA', 'cat2_mentoring_preparation', 0, null, 1.0, false,
    null,
    'Category 2 — Self-Directed Learning (Education & Training). Preparation for mentoring activities. 1 credit/hour of preparation. Documentation: Evidence of mentoring activity.'
  ),

  -- Research & Quality Improvement sub-group
  (
    'QA', 'cat2_research_publication_development', 0, null, 1.0, false,
    null,
    'Category 2 — Self-Directed Learning (Research & QI). Development of research grant applications or peer-reviewed publications. 1 credit/hour. Documentation: Draft manuscript or grant application.'
  ),
  (
    'QA', 'cat2_peer_review_clinical_practice', 0, null, 1.0, false,
    null,
    'Category 2 — Self-Directed Learning (Research & QI). Peer review of clinical practice. 1 credit/hour. Documentation: Evidence of peer review participation.'
  ),
  (
    'QA', 'cat2_peer_review_journals_grants', 0, null, 1.0, false,
    null,
    'Category 2 — Self-Directed Learning (Research & QI). Peer review for academic journals or research grants. 1 credit/hour. Documentation: Confirmation from journal/grant body.'
  ),
  (
    'QA', 'cat2_quality_improvement_project', 0, null, 10.0, false,
    null,
    'Category 2 — Self-Directed Learning (Research & QI). Quality improvement projects. 10 credits per completed project (not per hour). Documentation: QI project completion report. DHP-AS CPD Framework Table.'
  ),

  -- ── CATEGORY 3: Assessment Activities (2 credits/hour) ────────────────────
  -- Combined Cat2 + Cat3 total must reach minimum 40 credits per 2-year cycle.

  (
    'QA', 'cat3_knowledge_assessment', 0, null, 2.0, true,
    null,
    'Category 3 — Assessment Activities (Accredited). Knowledge assessment programs (accredited examinations, MCQ assessments). 2 credits/hour. Documentation: Certificate or letter from the responsible organization. DHP-AS CPD Framework Table.'
  ),
  (
    'QA', 'cat3_simulation', 0, null, 2.0, true,
    null,
    'Category 3 — Assessment Activities (Accredited). Simulation-based assessment activities. 2 credits/hour. Must be accredited. Documentation: Certificate from simulation center or responsible organization.'
  ),
  (
    'QA', 'cat3_clinical_audit', 0, null, 2.0, true,
    null,
    'Category 3 — Assessment Activities (Accredited). Clinical audits (accredited). 2 credits/hour. Documentation: Audit report from responsible organization.'
  ),
  (
    'QA', 'cat3_multisource_feedback', 0, null, 2.0, true,
    null,
    'Category 3 — Assessment Activities (Accredited). Multi-source feedback (360-degree assessments). 2 credits/hour. Must be accredited. Documentation: Feedback report from responsible organization.'
  ),
  (
    'QA', 'cat3_direct_observation', 0, null, 2.0, true,
    null,
    'Category 3 — Assessment Activities (Accredited). Direct observation of practice (DOPS, mini-CEX). 2 credits/hour. Must be accredited. Documentation: Observation report.'
  ),
  (
    'QA', 'cat3_performance_review_feedback', 0, null, 2.0, false,
    null,
    'Category 3 — Assessment Activities (Other). Feedback from annual performance review. 2 credits/hour. Documentation: Annual performance review letter/report from employer.'
  ),
  (
    'QA', 'cat3_teaching_effectiveness_feedback', 0, null, 2.0, false,
    null,
    'Category 3 — Assessment Activities (Other). Feedback on teaching effectiveness. 2 credits/hour. Documentation: Feedback letter or report from institution.'
  )
;

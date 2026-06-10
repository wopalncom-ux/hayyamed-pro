# Hayya Med Pro — Country Rules Engine

## Architecture Principle

All compliance rules live in the **database**, not in code. A business analyst must be able to configure a new country without a developer. The rules engine is the core defensible intellectual property of the platform.

---

## Database Schema (Planned)

```sql
-- Core rules table
country_compliance_rules (
  id, country_code, authority_id,
  profession_code,              -- doctor, nurse, pharmacist, dentist, allied
  cycle_years,                  -- license renewal cycle length
  total_credits_required,       -- e.g. 50
  credit_terminology,           -- CME | CPD | PDU | CE
  online_credits_max_pct,       -- e.g. 50 (max 50% can be online)
  mandatory_credits_min,        -- e.g. 10 (minimum mandatory/structured credits)
  self_reported_allowed,        -- true | false
  grace_period_days,            -- days after expiry before enforcement
  employer_report_required,     -- true | false
  employer_report_format,       -- PDF | API | portal
  effective_from, effective_to  -- date range (rules change over time)
)

-- Activity category rules
compliance_activity_categories (
  id, country_code, authority_id,
  category_name,                -- conference, online, simulation, journal, teaching
  max_credits_per_cycle,        -- null = unlimited
  min_credits_per_cycle,        -- null = not required
  credits_per_hour,             -- conversion factor
  accreditation_required,       -- true | false
  accepted_accreditors          -- JSON array of accepted accreditation bodies
)
```

---

## GCC: Currently Configured

### Qatar — DHP-AS (Department of Healthcare Professions — Accreditation Section, MOPH)

> **Sources (authoritative):**
> - MOPH/DHP/AS/CPD/002 v4.3 — CPD Cycle Policy (effective 2016-03-07, revised Dec 2020)
> - MOPH/DHP/AS/CPD/005 v4.4 — CPD Recording Policy
> - DHP-AS CPD Framework Table (official)
> - DHP Guidelines: Physicians, Nurses, Pharmacists, Dentists
> - DHP-AS List of International CPD Accreditation Bodies (List A and List B)
> - **Governing law:** Emiri Decree No. 7 for the Year 2013

**IMPORTANT:** Qatar uses the term **CPD** (Continuing Professional Development), not CME.
The authority is **DHP-AS** (not QCHP — QCHP is the registration body; DHP-AS oversees accreditation).

#### Core CPD Requirements (all professions)

| Rule | Value | Source |
|---|---|---|
| Terminology | **CPD** (not CME) | DHP-AS official |
| Licensing cycle | **2 years** (from date of licensure) | CPD/002 v4.3 |
| Annual minimum | **40 credits/year** | CPD/002 v4.3 |
| Cycle total | **80 credits per 2-year cycle** | CPD/002 v4.3 |
| Category 1 mandatory minimum | **40 credits from Cat 1 per cycle** | CPD/002 v4.3 |
| Category 2+3 mandatory minimum | **40 credits from Cat 2 and/or Cat 3 per cycle** | CPD/002 v4.3 |
| Grace period | **None — system blocks renewal** | CPD/002 v4.3 |
| Self-reporting | Allowed — in CPD ePortfolio | CPD/005 v4.4 |
| Employer reporting | Not mandatory (individual responsibility) | CPD/005 v4.4 |
| Credit transfer | Up to 10 credits from 6 months before first cycle | CPD/002 v4.3 |

#### Non-Adherence vs Non-Compliance (critical distinction)

| Status | Definition | Consequence |
|---|---|---|
| **Non-adherence** | Fails to record annual minimum (40 credits) | Monitoring + CPD Audit in remaining cycle year |
| **Non-compliance** | Fails category-specific OR 2-year cycle requirements | Registration and license **MAY BE TERMINATED** |

Non-compliant practitioners may appeal under MOPH/DHP/AS/CPD/007.

#### CPD Category Framework

| Category | Name | Credit Rate |
|---|---|---|
| **Category 1** | Accredited Group Learning | **1 credit/hour** |
| **Category 2** | Self-Directed Learning | 0.5 – 25 credits (varies by activity) |
| **Category 3** | Assessment Activities | **2 credits/hour** |

**Category 1 activities:** Conferences, symposia, seminars, workshops, educational rounds (Grand rounds, M&M, tumor boards, case discussions), journal clubs, online synchronous learning, blended learning.

**Category 2 activities (with credit rates):**
| Activity | Rate |
|---|---|
| Self-identified clinical questions | 0.5 cr/hr |
| Reading journals/books/monographs | 1 cr/hr |
| Self-learning modules (async) | 1 cr/hr |
| Podcasts/webcasts (async) | 0.5 cr/hr |
| Postgraduate degree/diploma | 25 cr/semester |
| Formal teaching preparation | 2 cr/hr |
| Assessment tool development (OSCE/MCQ/SAQ) | 2 cr/hr |
| Mentoring preparation | 1 cr/hr |
| Research grant / publication development | 1 cr/hr |
| Peer review (clinical practice) | 1 cr/hr |
| Peer review (journals or grants) | 1 cr/hr |
| Quality improvement projects | 10 cr/project |

**Category 3 activities:** Knowledge assessment programs, simulation, clinical audits, multi-source feedback, direct observation of practice (DOPS/mini-CEX), annual performance review feedback, teaching effectiveness feedback.

#### Recognized International CPD Accreditation Bodies

> **Critical rule:** DHP-AS maintains two distinct lists.
> List A = face-to-face and hybrid activities.
> List B = online synchronous ONLY — strict subset of List A (some List A bodies are NOT on List B).

**List A (face-to-face / hybrid) — key bodies:**
- North America (39): ACCME USA, AAFP, AMA PRA, ACPE, ADA CERP, AGD PACE, AANP, ANCC, AAPA, RCPSC Canada, CFPC, CCCEP, CCME
- UK/Europe (54): Federation of Royal Colleges UK, RCGP, RCS, RCOG, RCPCH, RCPsych, RCR, RCPath, RCA, RCEM, RCN, RPS, GDC, CPD Standards Office UK, UEMS-EACCME, EBAC, EBAH
- Australia/NZ (19): AMC, RACP, RACS, RACGP, RANZCOG, RANZCO, RANZCR, RANZCP, ACEM
- GCC/Asia (35): SMC Singapore, MMC Malaysia, NMC India, OMSB Oman, KIMS Kuwait, NHRA Bahrain, MOH UAE, DOH Abu Dhabi, DHA Dubai, SCFHS Saudi, JMC Jordan
- Africa (5): EHC Egypt, EACMED Egypt, Sudan Medical Council, HPCSA South Africa

**List B (online synchronous only):** ACCME, AAFP, AMA, AANP, ANCC, ACPE, RCPSC, CFPC, RCGP, RCS, RCOG, RCPCH, RCPsych, RCN, RPS, UEMS-EACCME, EBAC, EBAH, AMC, RACGP, RACP, RANZCP, SMC, MMC, SCFHS, DHA, DOH, OMSB, NHRA.
> ARRT, ARDMS, ACSM, CDR — on List A but NOT on List B.

#### Profession-Specific Licensing Notes

| Profession | Scopes | Qualifying Exam |
|---|---|---|
| Physician | GP (Supervised), GP, Specialty (Cat 1/2/3), Consultant | Required for Cat 3 specialties: IFOM, USMLE Step 2, PLAB Part 1, MCCQE Part 1, AMC MCQ, PRES, MRCGP AKT |
| Nurse | RGN, CNS, Nurse Educator, NP, Midwife, Asst Nurse, LPN, CMS | Prometric required for RGN and Midwife (NCLEX exempt if within 5 years) |
| Pharmacist | Pharmacist, Industrial, Clinical Pharmacist, Tech, Technologist | Prometric for Pharmacist and Clinical Pharmacist (Master's exempt); GMP exam for Industrial |
| Dentist | General Dentist, General Dentist (Supervised), Dental Specialist | Prometric for General Dentist only |

**Note for Nurses:** Online/distance nursing degree programs are NOT accepted for Qatar DHP qualification.

**Professions covered:** Physicians, Nurses, Pharmacists, Dentists, Allied Health Professionals

---

### Saudi Arabia — SCFHS (Saudi Commission for Health Specialties)

| Rule | Value |
|---|---|
| Licensing cycle | 1–3 years (by specialty) |
| Total CME required | 40–60 credits/cycle |
| Terminology | CME |
| Online CME max | 50% |
| Mandatory CME min | 10 credits (structured/accredited) |
| Self-reporting | Not allowed — must be SCFHS-accredited |
| Grace period | 60 days |
| Employer reporting | Required for institutional practice |
| Accepted accreditors | SCFHS-accredited providers only |

---

### UAE — DHA (Dubai Health Authority)

| Rule | Value |
|---|---|
| Licensing cycle | 2 years |
| Total CME required | 40 credits/2-year cycle |
| Terminology | CME / CPD |
| Online CME max | 50% (20 credits) |
| Mandatory CME min | 5 credits patient safety topics |
| Self-reporting | Limited — DHA verification preferred |
| Grace period | 90 days |
| Employer reporting | Required for facility license renewal |

---

### UAE — DOH (Department of Health Abu Dhabi)

| Rule | Value |
|---|---|
| Licensing cycle | 1–2 years (by profession) |
| Total CME required | 30–50 credits/cycle |
| Terminology | CPD |
| Online credits max | 50% |
| Mandatory credits | Ethics and patient safety mandatory |
| Self-reporting | Allowed |
| Grace period | 60 days |

---

### Kuwait — MOH Kuwait

| Rule | Value |
|---|---|
| Licensing cycle | 1 year |
| Total CME required | 30 credits/year |
| Terminology | CME |
| Online CME max | 30% |
| Self-reporting | Allowed |
| Grace period | 30 days |

---

### Bahrain — NHRA (National Health Regulatory Authority)

| Rule | Value |
|---|---|
| Licensing cycle | 2 years |
| Total CME required | 40 credits/2-year cycle |
| Terminology | CPD |
| Online credits max | 50% |
| Self-reporting | Allowed with documentation |
| Grace period | 60 days |

---

### Oman — OMSB (Oman Medical Specialty Board)

| Rule | Value |
|---|---|
| Licensing cycle | 2 years |
| Total CME required | 40 credits/cycle |
| Terminology | CME |
| Online credits max | 50% |
| Self-reporting | Allowed |
| Grace period | 30 days |

---

## Future Countries (Planned)

| Country | Authority | Priority |
|---|---|---|
| Egypt | Egyptian Medical Syndicate | Year 2 |
| Jordan | Jordan Medical Council | Year 2 |
| Lebanon | Order of Physicians of Lebanon | Year 2 |
| UK | GMC / NMC / GPhC | Year 3 |
| USA | AMA / ACCME / state medical boards | Year 3 |
| Canada | CFPC / RCPSC | Year 3 |
| Australia | AHPRA / RACGP | Year 3 |
| India | NMC / MCI | Year 2 |

---

## Rules Engine Operational Rules

1. **Versioned rules** — Every rule has `effective_from` and `effective_to`. Historical compliance is calculated against the rules that were active at the time.
2. **Profession-specific** — Rules differ by profession within the same country. A Qatar physician and Qatar nurse have different requirements.
3. **No code changes for new countries** — Adding Egypt requires inserting rows into `country_compliance_rules`, not a deployment.
4. **Business analyst configurable** — Admin dashboard allows authorized staff to add/edit country rules with audit logging.
5. **Override support** — Individual professionals can flag a rule conflict for manual review (edge cases: dual licensure, specialty exemptions).

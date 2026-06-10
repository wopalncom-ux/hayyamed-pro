# Hayya Med Pro — Product Requirements

## Business Requirements

| ID | Requirement |
|---|---|
| BR-01 | The platform must be legally operable as a SaaS business from Qatar without requiring a UAE entity |
| BR-02 | All payment processing must work for Qatar-registered businesses (Paddle as Merchant of Record) |
| BR-03 | The platform must comply with Qatar PDPL (Personal Data Protection Law) data handling requirements |
| BR-04 | Revenue must be recurring (annual subscription model — not one-time) |
| BR-05 | The platform must support multi-country compliance rules without code changes |
| BR-06 | The platform must be deployable in GCP Qatar/Middle East region (me-central1) |
| BR-07 | All professional certificates and documents must be stored securely with access controls |
| BR-08 | Employer access must be strictly controlled — employers cannot access professional personal data |
| BR-09 | Audit trails must be maintained for all administrative actions (7-year retention) |
| BR-10 | The platform must be mobile-accessible from day one (PWA) |

---

## Functional Requirements

### Professional Management

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Professionals can self-register with email/password | Must Have |
| FR-02 | Professional profile includes: name, profession, specialty, license number, licensing authority, license expiry, country | Must Have |
| FR-03 | Professionals can track CME/CPD activities with: title, provider, date, credits, category, certificate | Must Have |
| FR-04 | Professionals can upload certificates (PDF, JPG, PNG, max 2MB) | Must Have |
| FR-05 | CME activities have statuses: pending, verified, rejected | Must Have |
| FR-06 | Professionals can see their compliance status and credit balance | Must Have |
| FR-07 | Professionals receive email alerts 30 days and 7 days before license expiry | Must Have |
| FR-08 | Pro subscribers can download a PDF compliance report | Must Have |
| FR-09 | Professionals can request to link to an employer | Must Have |
| FR-10 | Professionals can view their subscription status and billing history | Should Have |

### Admin Management

| ID | Requirement | Priority |
|---|---|---|
| FR-11 | Admins can view all submitted CME activities | Must Have |
| FR-12 | Admins can verify or reject CME activities with reason | Must Have |
| FR-13 | Admins can view and manage employer link requests | Must Have |
| FR-14 | Admins can approve or reject link requests | Must Have |
| FR-15 | Admins can create and manage organizations | Must Have |
| FR-16 | All admin actions are logged in audit trail | Must Have |
| FR-17 | Admins can view platform-wide analytics | Should Have |
| FR-18 | Admins can manage country compliance rules (no code change) | Should Have |

### Employer Management

| ID | Requirement | Priority |
|---|---|---|
| FR-19 | Employers can view compliance status of linked staff | Must Have |
| FR-20 | Employer view is read-only — no access to personal professional data | Must Have |
| FR-21 | Employers can download bulk compliance reports (PDF) | Should Have |
| FR-22 | Employers receive alerts when staff compliance drops below threshold | Should Have |

### Subscription & Billing

| ID | Requirement | Priority |
|---|---|---|
| FR-23 | Free tier with limited features | Must Have |
| FR-24 | Pro tier ($49/year) unlocks: PDF reports, email alerts, certificate storage | Must Have |
| FR-25 | Employer tier ($199/year) unlocks: employer dashboard | Must Have |
| FR-26 | Subscription managed via Paddle (Qatar-compatible) | Must Have |
| FR-27 | Subscription status reflected immediately after payment | Must Have |
| FR-28 | Pro features are gated — free users see paywall with upgrade prompt | Must Have |

---

## Non-Functional Requirements

### Performance

| Requirement | Target |
|---|---|
| Page load time (LCP) | < 2.5 seconds |
| API response time (p95) | < 500ms |
| PDF generation time | < 10 seconds |
| File upload time (2MB) | < 5 seconds on 4G |
| Concurrent users | 1,000 (Phase 1), 10,000 (Phase 3) |
| Database query time (p95) | < 100ms |

### Availability

| Requirement | Target |
|---|---|
| Uptime SLA | 99.9% (8.7 hours downtime/year) |
| Planned maintenance | Off-peak (2am–4am Qatar time) |
| Deployment strategy | Zero-downtime (Cloud Run rolling deploy) |
| Disaster recovery RTO | < 4 hours |
| Disaster recovery RPO | < 1 hour (Supabase PITR) |

### Security

| Requirement | Standard |
|---|---|
| Authentication | Supabase Auth — JWT, cookie-based |
| Authorization | Row Level Security on all tables |
| Data encryption at rest | AES-256 (Supabase/GCP managed) |
| Data encryption in transit | TLS 1.3 |
| Security headers | Full CSP, HSTS, X-Frame-Options (see next.config.ts) |
| Secrets management | GCP Secret Manager — never in code |
| Audit logging | All admin actions + subscription changes |

### Scalability

| Requirement | Target |
|---|---|
| Architecture | Stateless (Cloud Run — horizontal scale) |
| Database | Supabase PostgreSQL with RLS |
| File storage | Supabase Storage |
| Countries supported | 30+ without code changes |
| Professions supported | All licensed healthcare professions |

---

## User Stories

### Professional

- **US-01:** As a doctor in Qatar, I want to log my CME activity so I can track my compliance toward my QCHP renewal.
- **US-02:** As a pharmacist, I want to upload my conference certificate so my credits are verified by the admin team.
- **US-03:** As a nurse approaching license expiry, I want to receive an email alert 30 days before so I have time to complete remaining credits.
- **US-04:** As a Pro subscriber, I want to download a PDF compliance report to submit with my license renewal application.
- **US-05:** As a professional working at a hospital, I want to link my account to my employer so they can see my compliance without me sending manual reports.

### Employer / HR

- **US-06:** As a hospital HR director, I want to see which staff members are non-compliant so I can take action before their licenses expire.
- **US-07:** As a clinic manager, I want to download a compliance report for all linked staff to submit to the licensing authority during our facility renewal.

### Admin

- **US-08:** As an admin, I want to verify submitted CME activities so only genuine credits count toward compliance.
- **US-09:** As an admin, I want to approve employer link requests so staff are connected to the right organization.

---

## Acceptance Criteria

### CME Activity Submission (US-01, US-02)
- Professional can submit activity with all required fields
- Certificate upload accepts PDF, JPG, PNG up to 2MB
- Activity appears in "Pending" status after submission
- Admin receives notification of pending activity
- Professional receives email when activity is verified or rejected
- Verified credits add to CME wallet balance

### PDF Report (US-04)
- PDF generates in < 10 seconds
- PDF includes: professional info, credit balance, verified activities list
- PDF is downloadable on desktop and mobile
- Free users see upgrade prompt instead of download button
- PDF shows "Verified activities only" disclaimer

---

## Success Metrics

| Metric | Phase 1 Target | Phase 2 Target |
|---|---|---|
| Registered professionals | 100 | 500 |
| Pro conversion rate | 5% | 10% |
| Monthly Active Users | 50% of registered | 60% of registered |
| CME activities submitted/month | 200 | 1,000 |
| Admin verification time (avg) | < 48 hours | < 24 hours |
| PDF downloads/month | 50 | 300 |
| Employer accounts | 3 | 20 |
| NPS score | > 40 | > 50 |
| Support tickets/month | < 20 | < 50 |
| Uptime | 99.9% | 99.9% |

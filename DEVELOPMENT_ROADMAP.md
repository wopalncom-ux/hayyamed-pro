# Hayya Med Pro — Development Roadmap

## Strategic Context

Hayya Med Pro is a global healthcare SaaS. Every phase must balance speed-to-revenue with architectural integrity. We are building to be acquired or to raise Series A — every phase must increase enterprise value, not just ship features.

---

## Phase 1: Foundation & Go-To-Market (Current — Q2–Q3 2026)

### Objectives
- Launch MVP that is genuinely useful for a healthcare professional in Qatar today
- Establish secure, scalable, investor-grade technical foundation
- Generate first $10,000 ARR from individual Pro subscriptions
- Onboard first 5 employer accounts

### Deliverables

**Completed ✅**
- Professional onboarding (7-step wizard)
- CME activity tracking + verification workflow (wallet, compliance ring, status badges)
- Admin panel — 18 admin pages covering all platform operations
- Employer linking (request → approve → compliance grid view → department grouping)
- Certificate storage (private Supabase bucket, signed URLs, 1-hour expiry)
- Subscription billing (Paddle — Free / Pro / Employer Clinic/Growth/Dept/Hospital)
- PDF compliance reports (Pro only, per-wallet + bulk employer export)
- Email notifications (Postmark — 20+ transactional emails)
- Security headers, CSP, HSTS, rate limiting (Upstash Redis)
- Audit logging (all admin + AI actions, append-only, 7-year retention)
- GCC licensing authorities — 7 countries, 7 authority pages (QCHP/SCFHS/DHA/DOH/NHRA/OMSB/MOH-Kuwait)
- Country Rules Engine — all 7 GCC countries, 32 compliance rules, admin CRUD
- 32 database migrations + COMBINED_RUN_ONCE.sql
- GCP Cloud Run deployment pipeline (me-central1 / Doha) — live at hayyamed.pro
- Coming-soon gate with env-var toggle (COMING_SOON=false to go live, no code deploy)
- Waitlist email capture (DB-first, profession + country segmentation, admin view)
- Demo requests pipeline (DB-first, status workflow, admin pipeline view, CSV export)
- PWA (manifest, service worker, offline fallback, install prompt, push notifications)
- Offline CME submission queue (localStorage → auto-sync on reconnect)
- AI features — compliance chat, gap analysis, OCR, voice assistant, employer/provider analyzers
- Vertex AI (ADC — no API key needed on Cloud Run)
- SEO — 110+ public pages covering GCC CME requirements, specialties, authorities
- Marketing pages — /employers, /for-providers, /for-universities, /pricing, /request-demo, /about
- Referral program (30-day trial extension, /r/[code], ComplianceBadgeCard sharing)
- Trial pipeline (14-day Free trial, 30-day referred trial, upgrade walls, trial emails)
- Analytics — PostHog with 13 conversion events and user identity
- Sentry error tracking, /monitoring tunnel endpoint
- QPay Qatar integration (alternative payment for QAR)
- NPS survey (30-day, annual, /admin/nps)
- Email bounce/spam handling (Postmark webhook, suppression list)
- Calendar export (.ics) for license renewals
- One-click unsubscribe (HMAC tokens, RFC 8058 compliant)
- Changelog at /changelog
- Full legal pages — /terms, /privacy, /legal/dpa
- RLS verified — 8/8 tests passed (supabase/tests/rls_run.sql)

**Pending — user actions required (not code)**
- Run 32 migrations (COMBINED_RUN_ONCE.sql → Supabase SQL Editor)
- Paddle account approval + 10 price IDs created
- Postmark sending domain approved
- VAPID private key added to GCP Secret Manager
- Enable Claude Haiku 4.5 in Vertex AI Model Garden
- To go live: set `_COMING_SOON = false` in Cloud Build Trigger → trigger build

### Dependencies
- GCP project: `project-38d955b0-84e7-44b6-8b5`
- Supabase project: `ulevibytaxocdvdfmfaq`
- Domain: `hayyamed.pro` — live on Cloudflare + Cloud Run

### Risks
- Paddle account approval timeline (7–14 days)
- Postmark sending approval (under review)
- Haiku 4.5 Model Garden activation (user action, 5 minutes)

### Success Criteria
- [x] Live infrastructure at `hayyamed.pro`
- [ ] First paying Pro subscriber
- [ ] First employer account linked
- [ ] Lighthouse scores: Performance >90, Best Practices 100, PWA installable
- [x] Zero critical security findings (OWASP audit complete, RLS verified)
- [ ] $0 → $1,000 ARR

---

## Phase 2: Growth & Enterprise Foundation (Q3–Q4 2026)

### Objectives
- 500 registered professionals
- 20 paying Pro subscribers
- 3 hospital/clinic employer contracts
- First GCC country expansion (Saudi Arabia or UAE outreach)

### Deliverables

**UI & UX**
- Arabic language support (next-intl, RTL layout — Phase 2 gate: 50 paying users)
- Dark mode (optional, low priority)

**Enterprise Sales**
- QCHP partnership outreach (official CME tracking endorsement)
- Hospital PoC framework (Hamad Medical Corporation, Sidra Medicine)
- RFP response capability (technical + security + compliance sections)

**Platform**
- University admin portal (faculty + alumni CME tracking)
- API v1 for HRIS integration (hospital HR systems)
- Webhook events for enterprise customers

**Marketplace Growth**
- Course discovery improvements (hybrid search: pgvector + full-text)
- CME credit issuance for marketplace completions
- Provider analytics (enrollment trends, category demand)

**Compliance Engine**
- India NMC rules (NMC 5-year, 30 CME)
- UK GMC/NMC CPD rules
- Australia AHPRA CPD rules
- Egypt / Jordan market rules

### Success Criteria
- [ ] $1,000 → $25,000 ARR
- [ ] Saudi Arabia and UAE compliance routes launched
- [ ] First hospital employer contract signed
- [ ] Arabic language toggle functional
- [ ] 3+ training providers in marketplace

---

## Phase 3: Intelligence & Automation (Q1–Q2 2027)

### Objectives
- AI-powered compliance assistant as competitive moat
- Automated license renewal workflow
- University partnerships (2+)
- $100,000 ARR

### Deliverables

**AI Features (already in Phase 1, expand in Phase 3)**
- RAG pipeline for country-specific rules (pgvector + Supabase)
- AI-generated renewal strategy ("Your QCHP renewal is in 90 days — here's your exact plan")
- Confidence scoring + citations on every AI compliance answer
- Arabic NLP optimization for Gulf dialect medical terminology
- Hallucination prevention: "I don't know" responses with authority links

**License Renewal Automation**
- QCHP portal integration (API or scraping — pending authority partnership)
- One-click renewal document package
- License renewal countdown on dashboard (already shipping in Phase 1)

**University Module**
- University admin portal (student + faculty compliance tracking)
- Alumni CME issuance via QR-verified certificates
- Accreditation reporting for JCI/CBAHI

**Analytics**
- Platform-wide workforce intelligence (anonymized)
- Department compliance benchmarking
- Churn prediction model

### Success Criteria
- [ ] $25,000 → $100,000 ARR
- [ ] 2 university partnerships signed
- [ ] AI assistant used by >30% of active users
- [ ] QCHP endorsement or official partnership

---

## Phase 4: Global Expansion (Q3 2027 – Q2 2028)

### Objectives
- UK, EU, India market entry
- MENA expansion (Egypt, Jordan)
- White-label licensing pipeline
- $1,000,000 ARR

### Deliverables

**International Compliance**
- UK: GMC, NMC, GPhC rules
- India: NMC rules
- Egypt: EMS rules
- EU: country-by-country CPD rules
- GDPR compliance implementation (DPA templates, data residency per country)

**White-Label Platform**
- White-label configuration (branding, domain, rules per deployment)
- First government white-label contract (target: QCHP official portal)
- White-label admin panel

**Enterprise API**
- REST API v2 for HRIS integration
- API documentation site
- API key management portal
- Webhook events + retry + audit

**Payments Global**
- Local payment processors per region (Stripe for UK/EU/IN, local GCC gateways)
- Local currency pricing
- VAT/GST handling per jurisdiction (Saudi 15%, UAE 5%, UK 20%)

**Security & Compliance Certifications**
- SOC 2 Type II preparation (starts Year 2)
- ISO 27001 gap analysis

### Success Criteria
- [ ] $100,000 → $1,000,000 ARR
- [ ] First white-label government contract
- [ ] UK / India market live
- [ ] Enterprise API with 3+ HRIS integrations
- [ ] Series A round initiated

---

## Phase 5: Market Leadership (2028+)

### Objectives
- Category leader in healthcare compliance SaaS globally
- $5,000,000+ ARR
- Acquisition-ready or IPO-track

### Deliverables

**Platform Expansion**
- Healthcare professional network (peer learning, specialty groups)
- Job board integration (compliance score as hiring filter)
- Conference and events CME tracking
- Sponsor/pharma CME funding platform

**Data & Intelligence**
- Anonymized workforce intelligence (sold to MoH, pharma, insurers)
- Predictive compliance risk scoring
- Benchmarking (how does your compliance compare to peers in your specialty?)

**Acquisition Readiness**
- SOC 2 Type II certified
- ISO 27001 certified
- Investor-grade financial reporting
- Clean cap table + documented IP (Country Rules Engine, AI models)
- Multi-region GCP deployment (GCC + EU + Asia)

### Success Criteria
- [ ] $5,000,000 ARR
- [ ] 500,000 registered professionals across 30+ countries
- [ ] SOC 2 Type II certified
- [ ] Strategic acquisition conversation or Series B

---

*Last updated: 2026-06-14 — Session 50. Phase 1 code complete. Pending: Paddle/Postmark approval, 32 migrations, Vertex AI Haiku activation, COMING_SOON=false deploy.*

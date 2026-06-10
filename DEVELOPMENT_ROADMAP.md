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
- Professional onboarding (3-step wizard)
- CME activity tracking + verification workflow
- Admin panel (verify/reject activities, manage link requests)
- Employer linking (request → approve → compliance view)
- Certificate storage (private, signed URLs, secure)
- Subscription billing (Paddle — Free / Pro / Employer)
- PDF compliance reports (Pro only)
- Email notifications (Resend)
- Security headers + CSP + HSTS
- Audit logging (all admin actions)
- GCC licensing authorities (8 authorities)
- Subscriptions table + auto-provisioning
- GCP Cloud Run deployment pipeline

**In Progress 🔄**
- GCP Cloud Run deployment (current session)
- TypeScript clean build

**Remaining in Phase 1 📋**
- PWA setup (manifest, service worker, install prompt)
- Country Rules Engine SQL migration (`country_compliance_rules` table)
- Supabase Auth production URL update
- Paddle account setup + pricing configuration
- Resend domain verification (hayyamed.com)
- Phase 1 UI polish (loading states, error boundaries, toasts)

### Dependencies
- GCP project: `project-38d955b0-84e7-44b6-8b5`
- Supabase project: `ulevibytaxocdvdfmfaq`
- Domain: `pro.hayyamed.com` — DNS configuration needed post-deployment

### Risks
- Paddle account approval timeline (7–14 days)
- Resend domain verification (48 hours DNS propagation)
- GCP Cloud Run deployment (currently unblocking)

### Success Criteria
- [ ] Live at `pro.hayyamed.com`
- [ ] First paying Pro subscriber
- [ ] First employer account linked
- [ ] Lighthouse scores: Performance >90, Best Practices 100, PWA installable
- [ ] Zero critical security findings
- [ ] $0 → $1,000 ARR

---

## Phase 2: Growth & Enterprise Foundation (Q3–Q4 2026)

### Objectives
- 500 registered professionals
- 20 paying Pro subscribers
- 3 hospital/clinic employer contracts
- First GCC country outside Qatar (Saudi or UAE)

### Deliverables

**UI & UX**
- Full shadcn/ui component library integration
- Loading skeletons on all data tables
- Toast notifications system
- Error boundaries on all pages
- Mobile-first responsive overhaul
- Arabic language support (RTL layout)

**Country Rules Engine**
- `country_compliance_rules` database table
- `compliance_activity_categories` table
- Saudi Arabia (SCFHS) rules configured
- UAE (DHA + DOH) rules configured
- Admin UI for rules management

**Employer Dashboard**
- Staff compliance overview (grid view)
- Department grouping
- Bulk compliance report (PDF, all staff)
- Scheduled report delivery (weekly email)
- Staff CME deficit alerts

**Notifications**
- Push notification system (Web Push for PWA)
- 30-day and 7-day license expiry alerts (automated cron)
- CME cycle deadline alerts
- Digest email (weekly compliance summary for employers)

**Marketplace Foundation**
- Training provider registration
- Course listing (basic)
- Course enrollment tracking
- CME credit issuance for marketplace completions

### Success Criteria
- [ ] $1,000 → $25,000 ARR
- [ ] Saudi and UAE compliance rules live
- [ ] First hospital employer contract signed
- [ ] Arabic language toggle functional
- [ ] Push notifications live (PWA)
- [ ] 3+ training providers listed in marketplace

---

## Phase 3: Intelligence & Automation (Q1–Q2 2027)

### Objectives
- AI-powered compliance assistant
- Automated license renewal workflow
- University partnerships
- $100,000 ARR

### Deliverables

**AI Features**
- CME activity auto-categorization (AI suggests category + credits)
- Compliance gap analysis ("You need 12 more credits in cardiology by June")
- Smart activity recommendations based on specialty + gap
- AI compliance chatbot (in-dashboard, answers "am I compliant?")
- Certificate information extraction (OCR — auto-fill from uploaded certificate)

**License Renewal Automation**
- Direct integration with QCHP portal (API or scraping)
- One-click renewal document package (all verified activities + PDF report)
- License renewal deadline countdown on dashboard

**University Module**
- University admin portal
- Student compliance tracking
- Alumni CME issuance
- Faculty development tracking
- Accreditation reporting

**Analytics**
- Professional: personal compliance trend charts
- Employer: team compliance analytics, department breakdown, risk heatmap
- Admin: platform-wide analytics dashboard, revenue reporting

### Success Criteria
- [ ] $25,000 → $100,000 ARR
- [ ] 2 university partnerships signed
- [ ] AI assistant used by >30% of active users
- [ ] Average time-to-compliance-report < 30 seconds

---

## Phase 4: Global Expansion (Q3 2027 – Q2 2028)

### Objectives
- UK, EU, India market entry
- MENA expansion (Egypt, Jordan)
- White-label licensing pipeline
- $1,000,000 ARR

### Deliverables

**International Compliance**
- UK: GMC, NMC, GPhC rules configured
- India: NMC rules configured
- Egypt: EMS rules configured
- EU: EMA-adjacent CPD rules configured
- GDPR compliance implementation

**White-Label Platform**
- White-label configuration system (branding, domain, rules per deployment)
- First government white-label contract (target: QCHP official portal)
- White-label admin panel

**Enterprise API**
- REST API for HRIS integration (Hospital HR systems)
- Webhook events for enterprise customers
- API documentation site
- API key management portal

**Payments Global**
- Local payment processors per region
- Local currency pricing
- VAT/GST handling per jurisdiction

### Success Criteria
- [ ] $100,000 → $1,000,000 ARR
- [ ] First white-label government contract
- [ ] UK/India market live
- [ ] Enterprise API with 3+ HRIS integrations
- [ ] Series A investment round initiated

---

## Phase 5: Market Leadership (2028+)

### Objectives
- Category leader in healthcare compliance SaaS globally
- $5,000,000+ ARR
- Acquisition-ready or IPO-track

### Deliverables

**Platform Expansion**
- Healthcare professional network (LinkedIn for healthcare)
- Job board integration (compliance score as hiring filter)
- Employer verification badge system
- Peer learning groups by specialty
- Conference and events platform integration

**Data & Intelligence**
- Anonymized workforce intelligence reports (sold to MoH, pharma, insurers)
- Predictive compliance risk scoring
- Benchmarking (how does your compliance compare to peers in your country?)

**Acquisition Readiness**
- SOC 2 Type II certification
- ISO 27001 certification
- Investor-grade financial reporting
- Clean cap table
- Documented IP (country rules engine, AI models)
- Multi-region GCP deployment (GCC + EU + Asia)

### Success Criteria
- [ ] $5,000,000 ARR
- [ ] 500,000 registered professionals across 30+ countries
- [ ] SOC 2 Type II certified
- [ ] Strategic acquisition conversation or Series B

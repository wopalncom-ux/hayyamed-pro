# DoctorsInQatar.com — Enterprise Architecture Diagrams
**AI Healthcare Growth Operating System — Qatar & GCC**
*Version 2.0 | June 2026 | For Investors, QSTP, Rasmal Ventures, Healthcare Stakeholders*

---

## DIAGRAM 1 — Executive Architecture Overview

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#7a1525', 'primaryTextColor': '#fff', 'primaryBorderColor': '#c9a84c', 'lineColor': '#c9a84c', 'secondaryColor': '#1a1a2e', 'tertiaryColor': '#16213e', 'background': '#0d0d0d', 'mainBkg': '#1a1a2e', 'nodeBorder': '#c9a84c', 'clusterBkg': '#16213e', 'titleColor': '#c9a84c', 'edgeLabelBackground': '#1a1a2e', 'fontFamily': 'Inter, sans-serif'}}}%%

graph TB
    subgraph USERS["👥 USER ECOSYSTEM"]
        P["🏥 Patients<br/>Discovery & Booking"]
        D["👨‍⚕️ Doctors<br/>Profile & Leads"]
        C["🏢 Clinics<br/>Growth & Management"]
        H["🏨 Hospitals<br/>Network & Referrals"]
        S["📦 Suppliers<br/>B2B Marketplace"]
        PH["💊 Pharmacies"]
        HC["🏠 Home Care"]
    end

    subgraph PUBLIC["🌐 PUBLIC DISCOVERY LAYER"]
        HP["Homepage"]
        DP["Doctor Profiles"]
        CP["Clinic Profiles"]
        SP["Specialty Pages (40+)"]
        ENC["Health Encyclopedia<br/>180+ Articles"]
        INS["Insurance Guide"]
        PSEO["Programmatic SEO<br/>1000+ Pages"]
        AR["Arabic Site /ar/*<br/>Full RTL Localization"]
    end

    subgraph AI_SUITE["🤖 HAYYA MED AI SUITE"]
        NAV["🧭 Hayya AI Navigator<br/>Patient Triage"]
        REC["📞 AI Receptionist<br/>Booking & Scheduling"]
        MKT["📣 AI Marketing Manager<br/>Campaigns & Copy"]
        SEO_AI["🔍 AI SEO Manager<br/>Rankings & Keywords"]
        CON["✍️ AI Content Studio<br/>Articles & Posts"]
        PR["📰 AI PR Manager<br/>Press & Brand"]
        SMS["💬 AI SMS Manager<br/>Reminders & Alerts"]
        ANA["📊 AI Analytics Manager<br/>Insights & Reports"]
        ADM["⚙️ AI Administrator<br/>Operations"]
        LINA["🎙️ Lina — AI Voice<br/>Arabic & English"]
        CME["🎓 AI CME Manager<br/>QCHP Credits"]
        PROC_AI["🛒 AI Procurement<br/>Tender Intelligence"]
    end

    subgraph DASHBOARDS["📱 DASHBOARD LAYER"]
        PATIENT_D["Patient Portal<br/>12 Pages"]
        CLINIC_D["Clinic Dashboard<br/>30 Pages"]
        DOCTOR_D["Doctor Dashboard<br/>Profile & Analytics"]
        HOSPITAL_D["Hospital Dashboard"]
        ADMIN_D["Master Admin<br/>Platform Control"]
        SUPPLIER_D["Supplier Dashboard<br/>B2B & RFQ"]
    end

    subgraph MARKETPLACE["🛒 PROCUREMENT MARKETPLACE"]
        RFQ["RFQ System"]
        QUOT["Quotation Engine"]
        B2B["B2B Messaging"]
        CATALOG["Product Catalog"]
        COMPARE["Comparison Engine"]
        CONTRACT["Contracts & Billing"]
    end

    subgraph BACKEND["⚙️ BACKEND PLATFORM"]
        NEXTJS["Next.js 15 App Router<br/>TypeScript Strict"]
        SUPA["Supabase<br/>Postgres + Auth + Storage"]
        EDGE["Edge Functions<br/>AI Routing"]
        API["REST API v1<br/>Public Endpoints"]
    end

    subgraph INTEGRATIONS["🔌 INTEGRATIONS"]
        CLAUDE_API["Anthropic Claude"]
        OPENAI["OpenAI GPT-4"]
        WA["WhatsApp Business API"]
        TWILIO["Twilio SMS"]
        STRIPE["Stripe Billing"]
        TAP["Tap Payments<br/>Qatar Local"]
        MAPS["Google Maps"]
        GA4["Google Analytics 4"]
    end

    subgraph INFRA["☁️ INFRASTRUCTURE"]
        VERCEL["Vercel<br/>Edge Network"]
        CDN["Global CDN"]
        MON["Monitoring & Alerts"]
        BAK["Automated Backups"]
    end

    USERS --> PUBLIC
    USERS --> DASHBOARDS
    PUBLIC --> AI_SUITE
    DASHBOARDS --> AI_SUITE
    AI_SUITE --> BACKEND
    DASHBOARDS --> MARKETPLACE
    MARKETPLACE --> BACKEND
    BACKEND --> INTEGRATIONS
    BACKEND --> INFRA

    classDef userNode fill:#7a1525,stroke:#c9a84c,color:#fff,font-weight:bold
    classDef aiNode fill:#1a1a2e,stroke:#c9a84c,color:#c9a84c,font-weight:bold
    classDef infraNode fill:#0d2137,stroke:#3b82f6,color:#93c5fd
    classDef pubNode fill:#14532d,stroke:#22c55e,color:#bbf7d0
    classDef dashNode fill:#3b1f00,stroke:#f59e0b,color:#fde68a
    classDef mktNode fill:#1e1b4b,stroke:#818cf8,color:#c7d2fe

    class P,D,C,H,S,PH,HC userNode
    class NAV,REC,MKT,SEO_AI,CON,PR,SMS,ANA,ADM,LINA,CME,PROC_AI aiNode
    class VERCEL,CDN,MON,BAK infraNode
    class HP,DP,CP,SP,ENC,INS,PSEO,AR pubNode
    class PATIENT_D,CLINIC_D,DOCTOR_D,HOSPITAL_D,ADMIN_D,SUPPLIER_D dashNode
    class NEXTJS,SUPA,EDGE,API mktNode
```

---

## DIAGRAM 2 — Technical System Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e293b', 'primaryTextColor': '#e2e8f0', 'primaryBorderColor': '#3b82f6', 'lineColor': '#64748b', 'secondaryColor': '#0f172a', 'tertiaryColor': '#1e293b', 'fontFamily': 'Inter, sans-serif', 'fontSize': '13px'}}}%%

graph LR
    subgraph CLIENT["CLIENT LAYER"]
        direction TB
        BROWSER["🌐 Browser / PWA<br/>React 19 + Tailwind v4"]
        MOBILE["📱 Mobile Web<br/>Responsive + PWA"]
        SW["⚡ Service Worker<br/>Offline Support"]
    end

    subgraph NEXT["NEXT.JS 15 APP ROUTER"]
        direction TB
        subgraph ROUTES["Page Routes"]
            PUB_R["Public Routes<br/>/doctors /clinics /specialties<br/>/health-encyclopedia /ar/*"]
            DASH_R["Dashboard Routes<br/>/dashboard/* (30 pages)"]
            PAT_R["Patient Routes<br/>/patient/* (12 pages)"]
            API_R["API Routes<br/>/api/* + REST v1"]
        end
        subgraph MW["Middleware & Config"]
            AUTH_MW["Auth Middleware<br/>Coming Soon Gate"]
            NEXT_CFG["next.config.ts<br/>Image Domains, Rewrites"]
            SITEMAP["sitemap.ts<br/>1000+ Dynamic URLs"]
        end
    end

    subgraph AI_ROUTER["AI ROUTING LAYER"]
        direction TB
        UNIFIED["Unified AI Router<br/>/api/ai/[tool]"]
        GUARD["ai-guardrails.ts<br/>Medical Safety Layer"]
        subgraph AI_TOOLS["15 AI Tool Endpoints"]
            T1["navigator"] 
            T2["receptionist"]
            T3["marketing"]
            T4["seo_manager"]
            T5["content_studio"]
            T6["pr_manager"]
            T7["sms_manager"]
            T8["analytics"]
            T9["administrator"]
            T10["voice_lina"]
            T11["cme_manager"]
            T12["procurement"]
            T13["jobs"]
            T14["insurance_guide"]
            T15["secretary"]
        end
    end

    subgraph SUPABASE["SUPABASE PLATFORM"]
        direction TB
        subgraph DB["PostgreSQL Database"]
            CLINIC_T["clinics"]
            DOCTOR_T["doctors"]
            LEAD_T["leads"]
            PATIENT_T["patient_profiles"]
            AVAIL_T["doctor_availability"]
            INV_T["patient_invoices"]
            ANALYTICS_T["analytics_events"]
            CONTENT_T["content_posts"]
            PROC_T["procurement tables (12)"]
        end
        AUTH["Auth<br/>JWT + RLS Policies"]
        STORAGE["Storage<br/>Photos + Documents"]
        REALTIME["Realtime<br/>B2B Chat + Notifs"]
        EDGE_FN["Edge Functions<br/>Webhooks + Cron"]
    end

    subgraph EXT_AI["EXTERNAL AI PROVIDERS"]
        CLAUDE["Anthropic Claude<br/>claude-haiku-4-5<br/>Primary Engine"]
        OAI["OpenAI GPT-4<br/>Fallback Engine"]
    end

    subgraph EXT_SVC["EXTERNAL SERVICES"]
        WA_SVC["WhatsApp Business API"]
        TWI["Twilio SMS<br/>+ Webhook Verify"]
        STRIPE_SVC["Stripe<br/>Subscription Billing"]
        TAP_SVC["Tap Payments<br/>Qatar Gateway<br/>+ HMAC Webhook"]
        MAPS_SVC["Google Maps<br/>Location Services"]
        RESEND["Resend<br/>Transactional Email"]
    end

    subgraph INFRA_TECH["DEPLOYMENT"]
        VER["Vercel<br/>Edge Network"]
        CDN_T["CDN + Image Optimization"]
        DNS_T["DNS + SSL"]
        MON_T["Monitoring + Alerts"]
    end

    CLIENT --> NEXT
    NEXT --> AI_ROUTER
    NEXT --> SUPABASE
    AI_ROUTER --> EXT_AI
    AI_ROUTER --> EXT_SVC
    SUPABASE --> EXT_SVC
    NEXT --> INFRA_TECH

    UNIFIED --> GUARD
    GUARD --> T1
    GUARD --> T3
    GUARD --> T5

    classDef techBlue fill:#1e3a5f,stroke:#3b82f6,color:#93c5fd,font-weight:bold
    classDef techGreen fill:#14532d,stroke:#22c55e,color:#bbf7d0
    classDef techPurple fill:#2e1065,stroke:#a855f7,color:#d8b4fe
    classDef techOrange fill:#431407,stroke:#f97316,color:#fed7aa
    classDef techRed fill:#450a0a,stroke:#ef4444,color:#fca5a5

    class BROWSER,MOBILE,SW techBlue
    class CLAUDE,OAI techPurple
    class CLINIC_T,DOCTOR_T,LEAD_T,PATIENT_T,AVAIL_T,INV_T,ANALYTICS_T,CONTENT_T,PROC_T techGreen
    class WA_SVC,TWI,STRIPE_SVC,TAP_SVC,MAPS_SVC,RESEND techOrange
    class VER,CDN_T,DNS_T,MON_T techRed
```

---

## DIAGRAM 3 — AI Ecosystem Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#0f172a', 'primaryTextColor': '#e2e8f0', 'primaryBorderColor': '#c9a84c', 'lineColor': '#c9a84c', 'secondaryColor': '#1e1b4b', 'tertiaryColor': '#0f172a', 'fontFamily': 'Inter, sans-serif'}}}%%

graph TB
    subgraph CORE["🧠 AI CORE ENGINE"]
        ROUTER["Unified AI Router<br/>/api/ai/[tool]<br/>15 Endpoints"]
        GUARD_CORE["Medical Guardrails<br/>MOPH Compliance Layer<br/>Qatar PDPL Safe"]
        CLAUDE_C["Claude claude-haiku-4-5<br/>Primary Engine"]
        OAI_C["OpenAI GPT-4<br/>Fallback Engine"]
        ROUTER --> GUARD_CORE
        GUARD_CORE --> CLAUDE_C
        GUARD_CORE --> OAI_C
    end

    subgraph PATIENT_AI["👩‍⚕️ PATIENT-FACING AI"]
        NAV_AI["🧭 Hayya AI Navigator<br/>Symptom → Specialty<br/>Triages & Routes Patients<br/>Arabic + English"]
        LINA_AI["🎙️ Lina — Voice AI<br/>Conversational Bookings<br/>WhatsApp Voice"]
        INS_AI["🛡️ Insurance Guide AI<br/>Coverage Explanation<br/>Qatar Network Mapping"]
    end

    subgraph CLINIC_AI["🏢 CLINIC AI TOOLS"]
        REC_AI["📞 AI Receptionist<br/>24/7 Booking Automation<br/>Slot Management"]
        MKT_AI["📣 AI Marketing Manager<br/>Campaign Generation<br/>Meta + TikTok Copy"]
        SMS_AI["💬 AI SMS Manager<br/>Patient Reminders<br/>Twilio Integration"]
        WA_AI["📱 WhatsApp AI<br/>Lead Qualification<br/>Auto-Responses"]
    end

    subgraph GROWTH_AI["📈 GROWTH AI TOOLS"]
        SEO_AI_G["🔍 AI SEO Manager<br/>Keyword Intelligence<br/>Content Gap Analysis"]
        CON_AI["✍️ AI Content Studio<br/>Medical Articles<br/>Blog + Social Posts"]
        PR_AI["📰 AI PR Manager<br/>Press Releases<br/>Media Outreach"]
        ANA_AI["📊 AI Analytics Manager<br/>ROI Scoring<br/>Growth Insights"]
    end

    subgraph PROFESSIONAL_AI["🎓 PROFESSIONAL AI"]
        CME_AI["🎓 AI CME Manager<br/>QCHP Credit Tracking<br/>Course Recommendations"]
        JOBS_AI["💼 AI Jobs Manager<br/>Healthcare Recruitment<br/>Qatar Medical Jobs"]
        ADM_AI["⚙️ AI Administrator<br/>Platform Operations<br/>Automated Tasks"]
    end

    subgraph PROCUREMENT_AI_G["🛒 PROCUREMENT AI"]
        PROC_AI_G["🛒 AI Procurement Manager<br/>Tender Intelligence<br/>Supplier Matching"]
        CATALOG_AI["📋 AI Catalog Engine<br/>Product Intelligence<br/>Price Benchmarking"]
        TENDER_AI["📄 AI Tender Assistant<br/>RFQ Generation<br/>Bid Analysis"]
    end

    subgraph AI_OUTPUTS["📤 AI OUTPUTS"]
        direction LR
        OUT1["Patient Triage<br/>& Booking"]
        OUT2["Marketing<br/>Content"]
        OUT3["SEO<br/>Rankings"]
        OUT4["SMS &<br/>WhatsApp"]
        OUT5["Analytics<br/>Reports"]
        OUT6["Procurement<br/>Intelligence"]
    end

    subgraph AI_CHANNELS["📡 DELIVERY CHANNELS"]
        direction LR
        CH1["Web Widget"]
        CH2["Dashboard UI"]
        CH3["Twilio SMS"]
        CH4["WhatsApp API"]
        CH5["Email / Resend"]
        CH6["Voice / Lina"]
    end

    CORE --> PATIENT_AI
    CORE --> CLINIC_AI
    CORE --> GROWTH_AI
    CORE --> PROFESSIONAL_AI
    CORE --> PROCUREMENT_AI_G

    PATIENT_AI --> OUT1
    CLINIC_AI --> OUT2
    CLINIC_AI --> OUT4
    GROWTH_AI --> OUT3
    GROWTH_AI --> OUT5
    PROCUREMENT_AI_G --> OUT6
    ANA_AI --> OUT5

    OUT1 --> CH1
    OUT2 --> CH2
    OUT4 --> CH3
    OUT4 --> CH4
    OUT5 --> CH5
    OUT1 --> CH6

    classDef coreNode fill:#7a1525,stroke:#c9a84c,color:#fff,font-weight:bold,font-size:11px
    classDef patientNode fill:#1e3a5f,stroke:#60a5fa,color:#bfdbfe,font-size:11px
    classDef clinicNode fill:#14532d,stroke:#4ade80,color:#bbf7d0,font-size:11px
    classDef growthNode fill:#3b1f00,stroke:#fbbf24,color:#fde68a,font-size:11px
    classDef proNode fill:#1e1b4b,stroke:#818cf8,color:#c7d2fe,font-size:11px
    classDef procNode fill:#2d1b69,stroke:#a78bfa,color:#ddd6fe,font-size:11px
    classDef outputNode fill:#1f2937,stroke:#9ca3af,color:#f3f4f6,font-size:10px
    classDef channelNode fill:#0c1445,stroke:#3b82f6,color:#93c5fd,font-size:10px

    class ROUTER,GUARD_CORE,CLAUDE_C,OAI_C coreNode
    class NAV_AI,LINA_AI,INS_AI patientNode
    class REC_AI,MKT_AI,SMS_AI,WA_AI clinicNode
    class SEO_AI_G,CON_AI,PR_AI,ANA_AI growthNode
    class CME_AI,JOBS_AI,ADM_AI proNode
    class PROC_AI_G,CATALOG_AI,TENDER_AI procNode
    class OUT1,OUT2,OUT3,OUT4,OUT5,OUT6 outputNode
    class CH1,CH2,CH3,CH4,CH5,CH6 channelNode
```

---

## DIAGRAM 4 — User Journey Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e293b', 'primaryTextColor': '#e2e8f0', 'lineColor': '#64748b', 'fontFamily': 'Inter, sans-serif', 'fontSize': '12px'}}}%%

flowchart TD
    subgraph PATIENT_J["🏥 PATIENT JOURNEY"]
        P_LAND["Lands on DoctorsInQatar.com<br/>(Google Search / Social / Referral)"]
        P_DISC["Discovers via<br/>Specialty / Doctor / Clinic Search"]
        P_AI["Chats with Hayya AI Navigator<br/>Gets Triage & Recommendation"]
        P_PROF["Views Doctor Profile<br/>Reviews + Insurance + Availability"]
        P_BOOK["Books Appointment<br/>Real-Time Slot Picker"]
        P_REG["Registers / Logs In<br/>Patient Portal"]
        P_CONF["Receives Confirmation<br/>SMS + WhatsApp + Email"]
        P_REMIND["Receives Reminders<br/>24hr + 2hr before"]
        P_VISIT["Attends Visit"]
        P_REVIEW["Leaves Review<br/>Feeds SEO & Trust Score"]

        P_LAND --> P_DISC
        P_DISC --> P_AI
        P_AI --> P_PROF
        P_PROF --> P_BOOK
        P_BOOK --> P_REG
        P_REG --> P_CONF
        P_CONF --> P_REMIND
        P_REMIND --> P_VISIT
        P_VISIT --> P_REVIEW
    end

    subgraph DOCTOR_J["👨‍⚕️ DOCTOR JOURNEY"]
        D_ONBOARD["Onboards via Clinic<br/>or Direct Registration"]
        D_PROFILE["Builds Profile<br/>Photo + Specialty + Languages"]
        D_AVAIL["Sets Availability<br/>Weekly Schedule"]
        D_LEADS["Receives Leads<br/>in Dashboard"]
        D_APPTS["Manages Appointments<br/>Confirmed / Pending"]
        D_CME["Tracks CME Credits<br/>QCHP Dashboard"]
        D_ANALYTICS["Views Analytics<br/>Profile Views, Leads, SEO"]
        D_GROW["Grows Reputation<br/>Reviews + SEO Score"]

        D_ONBOARD --> D_PROFILE
        D_PROFILE --> D_AVAIL
        D_AVAIL --> D_LEADS
        D_LEADS --> D_APPTS
        D_APPTS --> D_CME
        D_CME --> D_ANALYTICS
        D_ANALYTICS --> D_GROW
    end

    subgraph CLINIC_J["🏢 CLINIC JOURNEY"]
        C_REG["Registers Clinic<br/>Business Verification"]
        C_PLAN["Selects Plan<br/>Starter / Growth / Enterprise"]
        C_SETUP["Sets Up Profile<br/>Doctors + Services + Insurance"]
        C_AI_TOOLS["Activates AI Tools<br/>Marketing + SEO + SMS"]
        C_LEADS_M["Manages Leads<br/>New → Contacted → Booked"]
        C_MKTG["Runs AI Marketing<br/>Meta + WhatsApp Campaigns"]
        C_ANALYTICS_C["Reviews Analytics<br/>ROI + SEO + Lead Source"]
        C_UPGRADE["Upgrades Plan<br/>More AI Credits + Features"]

        C_REG --> C_PLAN
        C_PLAN --> C_SETUP
        C_SETUP --> C_AI_TOOLS
        C_AI_TOOLS --> C_LEADS_M
        C_LEADS_M --> C_MKTG
        C_MKTG --> C_ANALYTICS_C
        C_ANALYTICS_C --> C_UPGRADE
    end

    subgraph SUPPLIER_J["📦 SUPPLIER JOURNEY"]
        S_REG["Registers as Supplier<br/>Product Categories"]
        S_CATALOG["Uploads Product Catalog<br/>AI-Enhanced Listings"]
        S_RFQ["Receives RFQ Requests<br/>from Clinics / Hospitals"]
        S_QUOTE["Submits Quotations<br/>Price + Delivery Terms"]
        S_MSG["B2B Messaging<br/>Negotiates with Buyer"]
        S_CONTRACT["Signs Digital Contract<br/>Stripe Billing"]
        S_FEATURE["Gets Featured Placement<br/>Marketplace Visibility"]

        S_REG --> S_CATALOG
        S_CATALOG --> S_RFQ
        S_RFQ --> S_QUOTE
        S_QUOTE --> S_MSG
        S_MSG --> S_CONTRACT
        S_CONTRACT --> S_FEATURE
    end

    P_REVIEW -->|"Boosts"| D_GROW
    P_BOOK -->|"Creates Lead"| C_LEADS_M
    C_AI_TOOLS -->|"Drives"| P_LAND

    classDef patientStep fill:#1e3a5f,stroke:#60a5fa,color:#bfdbfe,font-size:11px
    classDef doctorStep fill:#14532d,stroke:#4ade80,color:#bbf7d0,font-size:11px
    classDef clinicStep fill:#3b1f00,stroke:#fbbf24,color:#fde68a,font-size:11px
    classDef supplierStep fill:#2d1b69,stroke:#a78bfa,color:#ddd6fe,font-size:11px

    class P_LAND,P_DISC,P_AI,P_PROF,P_BOOK,P_REG,P_CONF,P_REMIND,P_VISIT,P_REVIEW patientStep
    class D_ONBOARD,D_PROFILE,D_AVAIL,D_LEADS,D_APPTS,D_CME,D_ANALYTICS,D_GROW doctorStep
    class C_REG,C_PLAN,C_SETUP,C_AI_TOOLS,C_LEADS_M,C_MKTG,C_ANALYTICS_C,C_UPGRADE clinicStep
    class S_REG,S_CATALOG,S_RFQ,S_QUOTE,S_MSG,S_CONTRACT,S_FEATURE supplierStep
```

---

## DIAGRAM 5 — Database Entity Relationship Diagram

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e293b', 'primaryTextColor': '#e2e8f0', 'primaryBorderColor': '#3b82f6', 'lineColor': '#94a3b8', 'fontFamily': 'Inter, sans-serif', 'fontSize': '11px'}}}%%

erDiagram
    CLINICS {
        uuid id PK
        text name
        text slug UK
        text area
        text phone
        text whatsapp_number
        text description
        text[] specialty_focus
        text[] insurance
        text logo_url
        decimal rating
        int review_count
        text plan
        int ai_credits_balance
        text activation_status
        text business_type
        text country
        text city
        timestamp created_at
    }

    DOCTORS {
        uuid id PK
        uuid clinic_id FK
        text slug UK
        text name
        text specialty
        text photo_url
        text languages
        text bio
        text submission_status
        text gender
        int experience_years
        timestamp created_at
    }

    PORTAL_USERS {
        uuid id PK
        uuid auth_id UK
        uuid clinic_id FK
        text role
        text full_name
        text email
        text phone
        timestamp created_at
    }

    PATIENT_PROFILES {
        uuid id PK
        uuid auth_id UK
        text full_name
        text email
        text phone
        text preferred_language
        uuid[] saved_doctors
        uuid[] saved_clinics
        timestamp created_at
    }

    LEADS {
        uuid id PK
        uuid clinic_id FK
        text patient_name
        text patient_phone
        text service
        text source
        text status
        text doctor_slug
        text notes
        timestamp created_at
    }

    APPOINTMENTS {
        uuid id PK
        uuid clinic_id FK
        uuid doctor_id FK
        uuid patient_id FK
        uuid lead_id FK
        date appointment_date
        time appointment_time
        text status
        text notes
        timestamp created_at
    }

    DOCTOR_AVAILABILITY {
        uuid id PK
        text doctor_slug FK
        uuid clinic_id FK
        int day_of_week
        time start_time
        time end_time
        int slot_duration_minutes
        boolean is_available
    }

    PATIENT_INVOICES {
        uuid id PK
        uuid clinic_id FK
        uuid lead_id FK
        text invoice_number UK
        text patient_name
        text patient_phone
        text description
        decimal amount_qar
        text status
        date due_date
        text tap_charge_id
        text tap_payment_url
        timestamp paid_at
    }

    ANALYTICS_EVENTS {
        uuid id PK
        uuid clinic_id FK
        text event_type
        uuid doctor_id FK
        jsonb metadata
        timestamp created_at
    }

    SUPPLIERS {
        uuid id PK
        text company_name
        text contact_name
        text email
        text phone
        text[] categories
        text country
        text plan
        text verification_status
        timestamp created_at
    }

    RFQS {
        uuid id PK
        uuid clinic_id FK
        uuid supplier_id FK
        text title
        text description
        text[] categories
        text status
        date deadline
        timestamp created_at
    }

    QUOTATIONS {
        uuid id PK
        uuid rfq_id FK
        uuid supplier_id FK
        decimal total_amount
        text currency
        text delivery_terms
        text status
        timestamp created_at
    }

    B2B_MESSAGES {
        uuid id PK
        uuid rfq_id FK
        uuid sender_id FK
        text sender_type
        text content
        boolean is_read
        timestamp created_at
    }

    CONTENT_POSTS {
        uuid id PK
        uuid clinic_id FK
        text title
        text slug UK
        text content
        text category
        text status
        text language
        text[] tags
        timestamp published_at
    }

    CLINIC_CREDITS_LOGS {
        uuid id PK
        uuid clinic_id FK
        text tool
        int credits_used
        int balance_after
        timestamp created_at
    }

    CLINICS ||--o{ DOCTORS : "employs"
    CLINICS ||--o{ PORTAL_USERS : "has staff"
    CLINICS ||--o{ LEADS : "receives"
    CLINICS ||--o{ APPOINTMENTS : "schedules"
    CLINICS ||--o{ PATIENT_INVOICES : "issues"
    CLINICS ||--o{ ANALYTICS_EVENTS : "generates"
    CLINICS ||--o{ RFQS : "creates"
    CLINICS ||--o{ CONTENT_POSTS : "publishes"
    CLINICS ||--o{ CLINIC_CREDITS_LOGS : "consumes"
    DOCTORS ||--o{ DOCTOR_AVAILABILITY : "defines"
    DOCTORS ||--o{ APPOINTMENTS : "attends"
    PATIENT_PROFILES ||--o{ APPOINTMENTS : "books"
    LEADS ||--o{ APPOINTMENTS : "converts to"
    LEADS ||--o{ PATIENT_INVOICES : "generates"
    RFQS ||--o{ QUOTATIONS : "receives"
    RFQS ||--o{ B2B_MESSAGES : "has"
    SUPPLIERS ||--o{ QUOTATIONS : "submits"
    SUPPLIERS ||--o{ RFQS : "responds to"
```

---

## DIAGRAM 6 — Revenue Flow Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#14532d', 'primaryTextColor': '#bbf7d0', 'primaryBorderColor': '#22c55e', 'lineColor': '#4ade80', 'secondaryColor': '#0f172a', 'fontFamily': 'Inter, sans-serif', 'fontSize': '12px'}}}%%

flowchart LR
    subgraph REVENUE_SOURCES["💰 REVENUE STREAMS"]
        direction TB
        R1["📅 SaaS Subscriptions<br/>Clinics / Hospitals<br/>Starter · Growth · Enterprise<br/>QAR 299–1,999/mo"]
        R2["🤖 AI Credits<br/>Pay-per-use<br/>Above plan quota<br/>QAR 0.50–2.00/credit"]
        R3["📦 Supplier Marketplace<br/>Annual Listing Fees<br/>Featured Placement<br/>QAR 2,500–15,000/yr"]
        R4["💊 Featured Listings<br/>Pharmacy · Home Care<br/>Physio · Nutrition<br/>Premium Placement"]
        R5["📣 Digital Advertising<br/>Sponsored Content<br/>Banner Ads · Newsletter<br/>Performance Campaigns"]
        R6["🤝 B2B Commissions<br/>Procurement Deals<br/>Referral Fees<br/>2–5% of contract"]
        R7["📊 Data Intelligence<br/>Market Reports<br/>Healthcare Analytics<br/>Enterprise Insights"]
        R8["🏥 Hospital Contracts<br/>Network Agreements<br/>Custom Integrations<br/>QAR 50,000+/yr"]
    end

    subgraph PAYMENT_GATEWAYS["💳 PAYMENT GATEWAYS"]
        STRIPE_R["Stripe<br/>Global Subscriptions<br/>Cards + Bank Transfer"]
        TAP_R["Tap Payments<br/>Qatar Local<br/>MADA + KNET + QR"]
        BANK["Bank Transfer<br/>Enterprise Clients<br/>Purchase Orders"]
    end

    subgraph SUBSCRIPTION_TIERS["📊 SUBSCRIPTION PLANS"]
        direction TB
        FREE_T["Free Tier<br/>Basic listing<br/>5 leads/mo<br/>No AI tools"]
        STARTER_T["Starter Plan<br/>QAR 299/mo<br/>50 AI credits<br/>Basic analytics"]
        GROWTH_T["Growth Plan<br/>QAR 799/mo<br/>200 AI credits<br/>Full AI suite"]
        ENTERPRISE_T["Enterprise Plan<br/>QAR 1,999/mo<br/>Unlimited AI<br/>Dedicated support"]
        SUPPLIER_T["Supplier Plans<br/>QAR 2,500–15,000/yr<br/>Marketplace access<br/>RFQ system"]
    end

    subgraph COST_CENTERS["⬇️ COST CENTERS"]
        direction TB
        AI_COST["AI API Costs<br/>Claude + OpenAI<br/>~QAR 0.10/call"]
        INFRA_COST["Infrastructure<br/>Vercel + Supabase<br/>~QAR 1,200/mo"]
        SMS_COST["SMS / WhatsApp<br/>Twilio + WA API<br/>Per message"]
        STRIPE_COST["Payment Processing<br/>Stripe: 2.9% + 30¢<br/>Tap: 2.75%"]
        TEAM_COST["Team & Operations<br/>Engineering + CS<br/>Growth"]
    end

    subgraph UNIT_ECONOMICS["📈 UNIT ECONOMICS"]
        direction TB
        LTV["Clinic LTV<br/>Avg 18-mo retention<br/>QAR 8,500 LTV"]
        CAC["Customer Acquisition<br/>SEO + Content driven<br/>QAR 350 CAC"]
        GM["Gross Margin<br/>Target 72%+<br/>SaaS model"]
        MRR["MRR Target<br/>Year 1: QAR 150K<br/>Year 3: QAR 800K"]
    end

    R1 --> STRIPE_R
    R2 --> STRIPE_R
    R2 --> TAP_R
    R3 --> STRIPE_R
    R3 --> BANK
    R4 --> STRIPE_R
    R5 --> BANK
    R6 --> STRIPE_R
    R7 --> BANK
    R8 --> BANK

    STRIPE_R --> SUBSCRIPTION_TIERS
    TAP_R --> SUBSCRIPTION_TIERS
    BANK --> SUBSCRIPTION_TIERS

    SUBSCRIPTION_TIERS --> UNIT_ECONOMICS
    UNIT_ECONOMICS --> COST_CENTERS

    classDef revenueNode fill:#14532d,stroke:#22c55e,color:#bbf7d0,font-weight:bold
    classDef gatewayNode fill:#1e3a5f,stroke:#60a5fa,color:#bfdbfe,font-weight:bold
    classDef tierNode fill:#3b1f00,stroke:#fbbf24,color:#fde68a
    classDef costNode fill:#450a0a,stroke:#ef4444,color:#fca5a5
    classDef econNode fill:#1e1b4b,stroke:#818cf8,color:#c7d2fe,font-weight:bold

    class R1,R2,R3,R4,R5,R6,R7,R8 revenueNode
    class STRIPE_R,TAP_R,BANK gatewayNode
    class FREE_T,STARTER_T,GROWTH_T,ENTERPRISE_T,SUPPLIER_T tierNode
    class AI_COST,INFRA_COST,SMS_COST,STRIPE_COST,TEAM_COST costNode
    class LTV,CAC,GM,MRR econNode
```

---

## DIAGRAM 7 — Integration & Data Flow Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e293b', 'primaryTextColor': '#e2e8f0', 'primaryBorderColor': '#c9a84c', 'lineColor': '#64748b', 'fontFamily': 'Inter, sans-serif', 'fontSize': '11px'}}}%%

flowchart TB
    subgraph CORE_PLATFORM["🏗️ CORE PLATFORM — DoctorsInQatar.com"]
        direction LR
        NEXT_CORE["Next.js 15 App Router"]
        SUPA_CORE["Supabase Platform"]
        AI_CORE["AI Router Layer"]
        NEXT_CORE <--> SUPA_CORE
        NEXT_CORE <--> AI_CORE
    end

    subgraph AI_PROVIDERS["🤖 AI INTELLIGENCE"]
        ANTHROPIC["Anthropic Claude<br/>claude-haiku-4-5-20251001<br/>Medical Guardrails Active"]
        OPENAI_I["OpenAI GPT-4<br/>Fallback Provider<br/>Content & Analysis"]
        ANTHROPIC -->|"Primary"| AI_CORE
        OPENAI_I -->|"Fallback"| AI_CORE
    end

    subgraph COMMUNICATION["📡 COMMUNICATION CHANNELS"]
        WA_I["WhatsApp Business API<br/>Booking Confirmations<br/>Lead Notifications<br/>AI Conversations"]
        TWILIO_I["Twilio SMS<br/>Appointment Reminders<br/>OTP + Alerts<br/>Webhook Verified"]
        EMAIL_I["Resend Email<br/>Transactional<br/>Invoices + Confirmations"]
        PUSH_I["Web Push Notifications<br/>Service Worker<br/>Real-time Alerts"]
    end

    subgraph PAYMENTS["💳 PAYMENT ECOSYSTEM"]
        STRIPE_I["Stripe<br/>SaaS Subscriptions<br/>AI Credit Purchases<br/>Supplier Plans"]
        TAP_I["Tap Payments<br/>Qatar Local Gateway<br/>MADA · KNET · Apple Pay<br/>HMAC Webhook Verified"]
    end

    subgraph ANALYTICS["📊 ANALYTICS & SEO"]
        GA4_I["Google Analytics 4<br/>User Behavior<br/>Conversion Tracking<br/>Arabic + English"]
        GSC_I["Google Search Console<br/>SEO Performance<br/>1000+ Page Sitemap"]
        META_I["Meta Pixel<br/>Facebook + Instagram<br/>Retargeting Campaigns"]
        TIKTOK_I["TikTok Pixel<br/>GCC Audience<br/>Healthcare Campaigns"]
    end

    subgraph MAPS_LOC["📍 LOCATION SERVICES"]
        GMAPS_I["Google Maps API<br/>Clinic Locations<br/>Area-based Search<br/>Doha Neighborhoods"]
    end

    subgraph HOSTING_I["☁️ INFRASTRUCTURE"]
        VERCEL_I["Vercel Edge Network<br/>Global CDN<br/>SSL + DDoS Protection<br/>Auto-scaling"]
        SUPABASE_INFRA["Supabase Cloud<br/>Managed Postgres<br/>Row Level Security<br/>Real-time Subscriptions"]
    end

    CORE_PLATFORM <-->|"AI Requests"| AI_PROVIDERS
    CORE_PLATFORM -->|"SMS + Reminders"| TWILIO_I
    CORE_PLATFORM -->|"Booking Alerts"| WA_I
    CORE_PLATFORM -->|"Invoices"| EMAIL_I
    CORE_PLATFORM -->|"Push Notifs"| PUSH_I
    CORE_PLATFORM <-->|"Billing"| STRIPE_I
    CORE_PLATFORM <-->|"Qatar Payments"| TAP_I
    CORE_PLATFORM -->|"Events"| GA4_I
    CORE_PLATFORM -->|"Indexes"| GSC_I
    CORE_PLATFORM -->|"Conversions"| META_I
    CORE_PLATFORM -->|"Conversions"| TIKTOK_I
    CORE_PLATFORM -->|"Location Queries"| GMAPS_I
    CORE_PLATFORM ---|"Deployed on"| VERCEL_I
    CORE_PLATFORM ---|"Data on"| SUPABASE_INFRA

    classDef coreClass fill:#7a1525,stroke:#c9a84c,color:#fff,font-weight:bold
    classDef aiClass fill:#2d1b69,stroke:#a78bfa,color:#ddd6fe
    classDef commClass fill:#14532d,stroke:#22c55e,color:#bbf7d0
    classDef payClass fill:#1e3a5f,stroke:#60a5fa,color:#bfdbfe
    classDef anaClass fill:#3b1f00,stroke:#fbbf24,color:#fde68a
    classDef infraClass fill:#0f172a,stroke:#475569,color:#94a3b8

    class NEXT_CORE,SUPA_CORE,AI_CORE coreClass
    class ANTHROPIC,OPENAI_I aiClass
    class WA_I,TWILIO_I,EMAIL_I,PUSH_I commClass
    class STRIPE_I,TAP_I payClass
    class GA4_I,GSC_I,META_I,TIKTOK_I anaClass
    class GMAPS_I,VERCEL_I,SUPABASE_INFRA infraClass
```

---

## DIAGRAM 8 — Platform Capability Matrix

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e293b', 'primaryTextColor': '#e2e8f0', 'fontFamily': 'Inter, sans-serif'}}}%%

quadrantChart
    title DoctorsInQatar.com — Competitive Capability Matrix
    x-axis Low Market Readiness --> High Market Readiness
    y-axis Low Strategic Value --> High Strategic Value
    quadrant-1 Core Differentiators
    quadrant-2 Build & Scale
    quadrant-3 Maintain
    quadrant-4 Invest & Expand

    AI Healthcare Navigator: [0.85, 0.92]
    Procurement Marketplace: [0.75, 0.88]
    Bilingual Arabic/English: [0.90, 0.85]
    AI SEO Engine: [0.80, 0.78]
    Doctor-Clinic SaaS: [0.88, 0.82]
    Health Encyclopedia: [0.82, 0.65]
    WhatsApp Integration: [0.87, 0.72]
    Insurance Guide AI: [0.68, 0.80]
    CME Credit Tracker: [0.60, 0.75]
    Lina Voice AI: [0.45, 0.88]
    GCC Expansion: [0.35, 0.90]
    B2B Supplier Network: [0.65, 0.80]
    Telemedicine Layer: [0.40, 0.85]
    Hospital Dashboard: [0.55, 0.78]
```

---

## ARCHITECTURE SUMMARY — Layer Definitions

### Layer 1 — Public Website Layer
The discovery engine. Built with **Next.js 15 App Router** for maximum SEO performance. Includes 40+ specialty pages, doctor and clinic profiles, a 180+ article health encyclopedia, and programmatic SEO generating 1,000+ indexed pages. **Full Arabic localization** across 23 `/ar/*` routes with RTL support via Cairo font. All pages are MOPH-compliant (no comparative claims) and Qatar PDPL privacy-safe.

### Layer 2 — Patient Layer
12-page patient portal with appointment booking via real-time slot picker, saved providers, notification center (SMS + push), and the **Hayya AI Navigator** — an AI triage chatbot routing patients to the right specialty with medical guardrails.

### Layer 3 — Doctor Dashboard
Profile management, live availability editor, lead inbox, appointment tracker, QCHP CME credit tracker, and AI-generated SEO score with improvement recommendations.

### Layer 4 — Clinic Dashboard
30-page SaaS dashboard: doctor roster management, AI marketing suite, lead pipeline (New→Contacted→Booked→Completed), WhatsApp integration, invoicing with Tap Payments, and 5 AI analytics scores.

### Layer 5 — Master Admin Dashboard
Platform-wide control: user management, content approval queue, SEO management, AI tool configuration, subscription plan management, and Stripe billing oversight.

### Layer 6 — AI Layer
12 AI modules powered by **Claude claude-haiku-4-5** (primary) with OpenAI GPT-4 fallback. All routes pass through `ai-guardrails.ts` enforcing MOPH medical compliance, no-diagnosis rules, and emergency referral protocols.

### Layer 7 — Procurement Marketplace
Healthcare B2B marketplace: clinics and hospitals post RFQs, suppliers respond with quotations, B2B messaging, digital contract signing, and Stripe billing for supplier subscriptions.

### Layer 8 — Integration Layer
14 external integrations: AI (Claude + OpenAI), Communication (Twilio + WhatsApp + Resend), Payments (Stripe + Tap), Analytics (GA4 + GSC + Meta + TikTok), Location (Google Maps).

### Layer 9 — Backend Layer
Next.js 15 + TypeScript strict mode + Tailwind v4 + Supabase (Postgres + Auth + Storage + Realtime + Edge Functions). Row Level Security enforced on all tables. Admin client bypasses RLS for API mutations only.

### Layer 10 — Infrastructure Layer
Vercel edge network with global CDN, automated SSL, DDoS protection, and auto-scaling. Supabase managed cloud for database. Monitoring and automated daily backups.

---

*Generated: June 2026 | DoctorsInQatar.com | Hayya Med Technology*
*Classification: Investor-Ready Architecture Document*

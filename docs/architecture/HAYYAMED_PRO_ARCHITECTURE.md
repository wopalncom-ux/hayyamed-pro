# Hayya Med PRO — Complete System Architecture
**Healthcare Professional CME & Compliance Operating System — Qatar & GCC**
*Version 1.0 | June 2026 | Project 4*

---

## DIAGRAM 1 — Executive Platform Overview

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#0f2027', 'primaryTextColor': '#e2e8f0', 'primaryBorderColor': '#10b981', 'lineColor': '#10b981', 'secondaryColor': '#1a2e2a', 'tertiaryColor': '#0f2027', 'clusterBkg': '#1a2e2a', 'titleColor': '#10b981', 'fontFamily': 'Inter, sans-serif'}}}%%

graph TB
    subgraph USERS["👥 USER ECOSYSTEM — Hayya Med PRO"]
        HP["👨‍⚕️ Healthcare Professional<br/>Doctor · Nurse · Pharmacist<br/>Dentist · Physio · Dietitian<br/>Lab · Radiology · Paramedic"]
        EA["🏢 Employer Admin<br/>Hospital · Clinic · Pharmacy<br/>Lab · University"]
        TP["🎓 Training Provider<br/>CME Course Publisher<br/>Conference Organizer"]
        MA["⚙️ Master Admin<br/>Organization Verification<br/>Platform Control"]
        SA["🔐 Super Admin<br/>Full Access + Audit Logs"]
    end

    subgraph ONBOARDING["🚀 7-STEP ONBOARDING"]
        S1["Step 1<br/>Account Creation<br/>Email + Password + Verify"]
        S2["Step 2<br/>Personal Information<br/>Name · DOB · Nationality · Mobile"]
        S3["Step 3<br/>Professional Information<br/>Profession · Specialty · License"]
        S4["Step 4<br/>Employer Linking<br/>Search · Request · Await Approval"]
        S5["Step 5<br/>CME Setup<br/>Country · Cycle · Upload Certs"]
        S6["Step 6<br/>Privacy & Consent<br/>Employer Visibility Toggles"]
        S7["Step 7<br/>Dashboard Activation<br/>Profile % · Wallet · Countdown"]
        S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7
    end

    subgraph PRO_DASHBOARD["📊 PROFESSIONAL DASHBOARD"]
        CME_W["CME Wallet<br/>Credits · Progress · Compliance"]
        LIC["License Management<br/>Expiry Countdown · Alerts"]
        CERTS["Certificate Vault<br/>Upload · Track · Export"]
        PRIVACY["Privacy Controls<br/>Employer Visibility Settings"]
        COURSES["Recommended Courses<br/>AI-Matched by Specialty"]
        PROFILE["Professional Profile<br/>Completion · Public View"]
    end

    subgraph EMPLOYER_DASH["🏢 EMPLOYER DASHBOARD"]
        STAFF_OV["Staff Compliance Overview<br/>All Linked Professionals"]
        LIC_ALERTS["License Expiry Alerts<br/>30/60/90 Day Warnings"]
        CME_STATUS["CME Completion Status<br/>Per Staff Member"]
        DEPT_RPT["Department Reports<br/>Compliance Analytics"]
        LINK_MGT["Link Request Management<br/>Approve · Reject · Remove"]
    end

    subgraph EMPLOYER_LINK["🔗 EMPLOYER LINKING ENGINE"]
        SEARCH["Search Organizations DB"]
        MATCH["Match Found?"]
        REQ["Send Link Request"]
        NOTIFY["Notify Employer Admin"]
        APPROVE["Admin Approves/Rejects"]
        UNVERIFIED["Create Unverified Employer<br/>Pending Admin Review"]
        SEARCH --> MATCH
        MATCH -->|"Yes"| REQ --> NOTIFY --> APPROVE
        MATCH -->|"No"| UNVERIFIED
    end

    subgraph AI_ENGINE["🤖 AI LAYER"]
        AI_MATCH["AI Course Matcher<br/>Specialty + Credits Gap"]
        AI_RISK["AI Renewal Risk<br/>License Expiry Predictor"]
        AI_COMP["AI Compliance Coach<br/>Personalized Action Plan"]
        AI_CERT["AI Certificate Verifier<br/>OCR + Validation"]
    end

    subgraph DB_LAYER["🗄️ DATABASE LAYER"]
        PP["professional_profiles"]
        ORG["organizations"]
        OM["organization_members"]
        ELR["employer_link_requests"]
        PPS["profile_privacy_settings"]
        CW["cme_wallets"]
        CA["cme_activities"]
        AL["audit_logs"]
    end

    subgraph INTEGRATIONS_P["🔌 INTEGRATIONS"]
        QCHP["QCHP API<br/>Qatar CME Authority"]
        EMAIL_P["Resend Email<br/>Notifications"]
        SMS_P["Twilio SMS<br/>License Alerts"]
        STRIPE_P["Stripe<br/>Employer Subscriptions"]
        OCR["OCR Engine<br/>Certificate Reading"]
    end

    HP --> ONBOARDING
    ONBOARDING --> PRO_DASHBOARD
    PRO_DASHBOARD --> EMPLOYER_LINK
    EMPLOYER_LINK --> EMPLOYER_DASH
    EA --> EMPLOYER_DASH
    PRO_DASHBOARD --> AI_ENGINE
    AI_ENGINE --> DB_LAYER
    PRO_DASHBOARD --> DB_LAYER
    EMPLOYER_DASH --> DB_LAYER
    DB_LAYER --> INTEGRATIONS_P

    classDef userCls fill:#064e3b,stroke:#10b981,color:#d1fae5,font-weight:bold
    classDef stepCls fill:#1e3a5f,stroke:#60a5fa,color:#bfdbfe
    classDef proDashCls fill:#2d1b69,stroke:#a78bfa,color:#ddd6fe
    classDef empCls fill:#3b1f00,stroke:#fbbf24,color:#fde68a
    classDef linkCls fill:#1a1a2e,stroke:#10b981,color:#6ee7b7
    classDef aiCls fill:#450a0a,stroke:#f87171,color:#fca5a5
    classDef dbCls fill:#0f172a,stroke:#475569,color:#94a3b8
    classDef intCls fill:#1e293b,stroke:#64748b,color:#cbd5e1

    class HP,EA,TP,MA,SA userCls
    class S1,S2,S3,S4,S5,S6,S7 stepCls
    class CME_W,LIC,CERTS,PRIVACY,COURSES,PROFILE proDashCls
    class STAFF_OV,LIC_ALERTS,CME_STATUS,DEPT_RPT,LINK_MGT empCls
    class SEARCH,MATCH,REQ,NOTIFY,APPROVE,UNVERIFIED linkCls
    class AI_MATCH,AI_RISK,AI_COMP,AI_CERT aiCls
    class PP,ORG,OM,ELR,PPS,CW,CA,AL dbCls
    class QCHP,EMAIL_P,SMS_P,STRIPE_P,OCR intCls
```

---

## DIAGRAM 2 — 7-Step Onboarding Flow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#064e3b', 'primaryTextColor': '#d1fae5', 'primaryBorderColor': '#10b981', 'lineColor': '#10b981', 'fontFamily': 'Inter, sans-serif', 'fontSize': '12px'}}}%%

flowchart TD
    START(["🚀 User visits Hayya Med PRO"])

    subgraph STEP1["STEP 1 — Account Creation"]
        S1A["Enter email + password"]
        S1B["System sends verification email"]
        S1C["User verifies email link"]
        S1A --> S1B --> S1C
    end

    subgraph STEP2["STEP 2 — Personal Information"]
        S2A["Full Name"]
        S2B["Date of Birth"]
        S2C["Gender + Nationality"]
        S2D["Country of Residence"]
        S2E["Mobile Number"]
    end

    subgraph STEP3["STEP 3 — Professional Information"]
        S3A["Select Profession Category<br/>Doctor · Nurse · Pharmacist · etc."]
        S3B["Select Specialty + Subspecialty"]
        S3C["Medical License Number"]
        S3D["Licensing Authority"]
        S3E["License Expiry Date"]
    end

    subgraph STEP4["STEP 4 — Employer Linking"]
        S4A["Type Employer Name"]
        S4B{"Employer in DB?"}
        S4C["Show Match — Request Link"]
        S4D["Employer Admin Notified"]
        S4E["Mark as Unverified Employer<br/>Pending Admin Review"]
        S4A --> S4B
        S4B -->|"YES"| S4C --> S4D
        S4B -->|"NO"| S4E
    end

    subgraph STEP5["STEP 5 — CME Setup"]
        S5A["Select Country + Regulatory Body"]
        S5B["Confirm Profession + Specialty"]
        S5C["System sets Required Credits<br/>per QCHP / local authority"]
        S5D["Upload Existing Certificates<br/>(optional — can skip)"]
        S5A --> S5B --> S5C --> S5D
    end

    subgraph STEP6["STEP 6 — Privacy & Consent"]
        S6A["Toggle: Employer sees CME Summary"]
        S6B["Toggle: Employer sees Certificates"]
        S6C["Toggle: Employer sees License Expiry"]
        S6D["Toggle: Employer sees Detailed Activities"]
        S6E["Accept Terms + Privacy Policy"]
        S6F["Consent to data sharing rules"]
    end

    subgraph STEP7["STEP 7 — Dashboard Activated"]
        S7A["Profile Completion % shown"]
        S7B["CME Wallet initialized"]
        S7C["License Renewal Countdown starts"]
        S7D["AI Course Recommendations shown"]
        S7E["Employer Link status shown<br/>Pending / Approved / None"]
    end

    SAVE["💾 Save & Continue Later<br/>Available at every step"]

    START --> STEP1 --> STEP2 --> STEP3 --> STEP4 --> STEP5 --> STEP6 --> STEP7
    STEP2 -.->|"Save draft"| SAVE
    STEP3 -.->|"Save draft"| SAVE
    STEP4 -.->|"Save draft"| SAVE
    STEP5 -.->|"Save draft"| SAVE

    COMPLIANCE["⚠️ Compliance Notice<br/>'Hayya Med Pro supports CME tracking and<br/>licensing readiness. It does not issue licenses<br/>and does not replace official licensing authorities.'"]

    STEP7 --> COMPLIANCE

    classDef stepBox fill:#064e3b,stroke:#10b981,color:#d1fae5
    classDef decisionBox fill:#1e3a5f,stroke:#60a5fa,color:#bfdbfe
    classDef saveBox fill:#3b1f00,stroke:#fbbf24,color:#fde68a
    classDef compBox fill:#450a0a,stroke:#ef4444,color:#fca5a5,font-weight:bold

    class S1A,S1B,S1C,S2A,S2B,S2C,S2D,S2E stepBox
    class S3A,S3B,S3C,S3D,S3E,S4A,S4C,S4D,S4E stepBox
    class S5A,S5B,S5C,S5D,S6A,S6B,S6C,S6D,S6E,S6F stepBox
    class S7A,S7B,S7C,S7D,S7E stepBox
    class S4B decisionBox
    class SAVE saveBox
    class COMPLIANCE compBox
```

---

## DIAGRAM 3 — Employer Linking & Approval Workflow

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e293b', 'primaryTextColor': '#e2e8f0', 'primaryBorderColor': '#10b981', 'lineColor': '#64748b', 'fontFamily': 'Inter, sans-serif', 'fontSize': '12px'}}}%%

sequenceDiagram
    actor Pro as 👨‍⚕️ Professional
    participant App as Hayya Med PRO
    participant DB as Supabase DB
    participant EA as 🏢 Employer Admin
    participant MA as ⚙️ Master Admin

    Note over Pro,MA: SCENARIO A — Employer exists in system

    Pro->>App: Enters employer name
    App->>DB: Search organizations table
    DB-->>App: Match found: "HMC Qatar"
    App-->>Pro: Shows match suggestion
    Pro->>App: Confirms & requests link
    App->>DB: Creates employer_link_request (status: pending)
    App->>EA: Email + SMS notification
    Note over EA: "New link request from Dr. Ahmed"
    EA->>App: Reviews request
    alt Approved
        EA->>App: Clicks Approve
        App->>DB: Updates organization_members (status: approved)
        App->>DB: Updates employer_link_request (status: approved)
        App->>Pro: Notification: "Link approved by HMC"
        Note over EA,Pro: Professional now visible in employer dashboard
    else Rejected
        EA->>App: Clicks Reject + adds note
        App->>DB: Updates request (status: rejected)
        App->>Pro: Notification: "Link request declined"
    end

    Note over Pro,MA: SCENARIO B — Employer does NOT exist

    Pro->>App: Enters "New Specialist Clinic"
    App->>DB: Search organizations — no match
    App-->>Pro: "Employer not found — we'll add it"
    Pro->>App: Confirms employer name + type
    App->>DB: Creates organizations record (verification_status: unverified)
    App->>DB: Creates employer_link_request (organization_id: null, status: pending)
    App->>MA: Admin notification: new unverified employer suggestion
    MA->>App: Reviews suggestion
    alt Admin Verifies & Creates Org
        MA->>DB: Creates/approves organization record
        MA->>DB: Approves link request
        App->>Pro: Notification: "Your employer has been verified"
    else Admin Merges with Existing Org
        MA->>DB: Merges with existing organization
        App->>Pro: Updated employer profile
    else Admin Rejects
        MA->>DB: Marks suggestion as rejected
        App->>Pro: Manual employer entry retained (unverified tag)
    end
```

---

## DIAGRAM 4 — CME Wallet & Privacy Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#0f172a', 'primaryTextColor': '#e2e8f0', 'primaryBorderColor': '#10b981', 'lineColor': '#10b981', 'fontFamily': 'Inter, sans-serif', 'fontSize': '12px'}}}%%

graph TB
    subgraph PROFESSIONAL["👨‍⚕️ PROFESSIONAL SIDE"]
        CME_WALLET["CME Wallet<br/>Required: 50 credits<br/>Completed: 32 credits<br/>Remaining: 18 credits<br/>Status: AT RISK"]
        ACTIVITIES["CME Activities Log<br/>Course · Conference · Workshop<br/>Online · Simulation"]
        CERT_VAULT["Certificate Vault<br/>Upload PDF/Image<br/>AI-verified OCR"]
        PRIVACY_CTL["Privacy Control Panel"]

        subgraph PRIVACY_TOGGLES["🔒 Privacy Settings"]
            T1["✅ Employer sees CME Summary"]
            T2["❌ Employer sees Certificates"]
            T3["✅ Employer sees License Expiry"]
            T4["❌ Employer sees Detailed Activities"]
            T5["✅ Employer sees Profile Details"]
        end

        CME_WALLET --> ACTIVITIES
        CME_WALLET --> CERT_VAULT
        PRIVACY_CTL --> PRIVACY_TOGGLES
    end

    subgraph PRIVACY_GATE["🔐 PRIVACY ENFORCEMENT LAYER<br/>(Server-side RLS + API Gate)"]
        CHECK["Check profile_privacy_settings<br/>for this professional"]
        FILTER["Filter data based on<br/>employer consent flags"]
        AUDIT["Log access to audit_logs<br/>timestamp + employer_id + field_accessed"]
        CHECK --> FILTER --> AUDIT
    end

    subgraph EMPLOYER_VIEW["🏢 WHAT EMPLOYER ADMIN SEES"]
        subgraph ALWAYS_VISIBLE["Always Visible (no toggle)"]
            EV1["Professional Full Name"]
            EV2["Profession + Specialty"]
            EV3["License Number"]
            EV4["Compliance Status"]
            EV5["Renewal Risk Level"]
            EV6["Last Activity Date"]
        end
        subgraph CONSENT_REQUIRED["Requires Professional Consent"]
            EC1["CME Wallet Summary<br/>(toggle: T1)"]
            EC2["Uploaded Certificates<br/>(toggle: T2)"]
            EC3["License Expiry Date<br/>(toggle: T3)"]
            EC4["Detailed CME Activities<br/>(toggle: T4)"]
        end
        subgraph NEVER_VISIBLE["Never Visible to Employer"]
            EN1["Date of Birth"]
            EN2["Mobile Number"]
            EN3["Nationality"]
            EN4["Personal Address"]
            EN5["Password / Auth Data"]
        end
    end

    subgraph EMPLOYER_REPORTS["📊 EMPLOYER COMPLIANCE REPORTS"]
        RPT1["Staff Compliance Overview<br/>All approved linked professionals"]
        RPT2["License Expiry Dashboard<br/>30 / 60 / 90 day alerts"]
        RPT3["CME Completion Rates<br/>By department / specialty"]
        RPT4["At-Risk Staff List<br/>Low credits or expiring licenses"]
        RPT5["Department Compliance Score<br/>% of staff fully compliant"]
    end

    PROFESSIONAL -->|"Data request"| PRIVACY_GATE
    PRIVACY_GATE -->|"Filtered data"| EMPLOYER_VIEW
    EMPLOYER_VIEW --> EMPLOYER_REPORTS

    classDef proNode fill:#064e3b,stroke:#10b981,color:#d1fae5
    classDef gateNode fill:#450a0a,stroke:#ef4444,color:#fca5a5,font-weight:bold
    classDef alwaysNode fill:#1e3a5f,stroke:#60a5fa,color:#bfdbfe
    classDef consentNode fill:#3b1f00,stroke:#fbbf24,color:#fde68a
    classDef neverNode fill:#1f2937,stroke:#6b7280,color:#9ca3af
    classDef reportNode fill:#2d1b69,stroke:#a78bfa,color:#ddd6fe
    classDef toggleNode fill:#064e3b,stroke:#10b981,color:#d1fae5,font-size:11px

    class CME_WALLET,ACTIVITIES,CERT_VAULT,PRIVACY_CTL proNode
    class CHECK,FILTER,AUDIT gateNode
    class EV1,EV2,EV3,EV4,EV5,EV6 alwaysNode
    class EC1,EC2,EC3,EC4 consentNode
    class EN1,EN2,EN3,EN4,EN5 neverNode
    class RPT1,RPT2,RPT3,RPT4,RPT5 reportNode
    class T1,T2,T3,T4,T5 toggleNode
```

---

## DIAGRAM 5 — Database ERD

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e293b', 'primaryTextColor': '#e2e8f0', 'primaryBorderColor': '#10b981', 'lineColor': '#94a3b8', 'fontFamily': 'Inter, sans-serif', 'fontSize': '11px'}}}%%

erDiagram
    USERS {
        uuid id PK
        text email UK
        text password_hash
        text email_verified
        timestamp created_at
    }

    PROFESSIONAL_PROFILES {
        uuid id PK
        uuid user_id FK
        text full_name
        date date_of_birth
        text gender
        text nationality
        text country_of_residence
        uuid profession_id FK
        uuid specialty_id FK
        uuid subspecialty_id FK
        text license_number
        uuid licensing_authority_id FK
        date license_expiry_date
        text employer_name_text
        uuid employer_id FK
        text current_role
        int years_of_experience
        text preferred_language
        int profile_completion_percentage
        timestamp created_at
        timestamp updated_at
    }

    ORGANIZATIONS {
        uuid id PK
        text organization_name
        text organization_type
        text country
        text city
        text verification_status
        timestamp created_at
        timestamp updated_at
    }

    ORGANIZATION_MEMBERS {
        uuid id PK
        uuid organization_id FK
        uuid user_id FK
        uuid professional_profile_id FK
        text role_in_organization
        text membership_status
        uuid approved_by FK
        timestamp approved_at
        timestamp created_at
        timestamp updated_at
    }

    EMPLOYER_LINK_REQUESTS {
        uuid id PK
        uuid professional_profile_id FK
        uuid user_id FK
        text employer_name_text
        uuid organization_id FK
        text request_status
        timestamp requested_at
        uuid reviewed_by FK
        timestamp reviewed_at
        text notes
    }

    PROFILE_PRIVACY_SETTINGS {
        uuid id PK
        uuid user_id FK
        uuid professional_profile_id FK
        boolean employer_can_view_cme_summary
        boolean employer_can_view_certificates
        boolean employer_can_view_license_expiry
        boolean employer_can_view_detailed_cme_activities
        boolean employer_can_view_profile_details
        timestamp created_at
        timestamp updated_at
    }

    CME_WALLETS {
        uuid id PK
        uuid user_id FK
        uuid professional_profile_id FK
        uuid country_id FK
        uuid profession_id FK
        uuid specialty_id FK
        int required_credits
        int completed_credits
        int remaining_credits
        text compliance_status
        date renewal_cycle_start
        date renewal_cycle_end
        timestamp last_updated_at
    }

    CME_ACTIVITIES {
        uuid id PK
        uuid wallet_id FK
        uuid user_id FK
        text activity_title
        text activity_type
        text provider_name
        text country
        decimal credits_awarded
        date activity_date
        text certificate_url
        text verification_status
        timestamp created_at
        timestamp updated_at
    }

    AUDIT_LOGS {
        uuid id PK
        uuid actor_id FK
        text actor_role
        text action_type
        uuid target_user_id FK
        text target_resource
        jsonb metadata
        text ip_address
        timestamp created_at
    }

    PROFESSIONS {
        uuid id PK
        text name
        text code
        text[] applicable_countries
    }

    SPECIALTIES {
        uuid id PK
        uuid profession_id FK
        text name
        text code
    }

    SUBSPECIALTIES {
        uuid id PK
        uuid specialty_id FK
        text name
    }

    LICENSING_AUTHORITIES {
        uuid id PK
        text name
        text country
        text website
        int required_cme_credits_per_cycle
        int cycle_years
    }

    USERS ||--|| PROFESSIONAL_PROFILES : "has"
    USERS ||--|| PROFILE_PRIVACY_SETTINGS : "controls"
    USERS ||--|| CME_WALLETS : "owns"
    USERS ||--o{ CME_ACTIVITIES : "logs"
    USERS ||--o{ EMPLOYER_LINK_REQUESTS : "submits"
    PROFESSIONAL_PROFILES ||--|| PROFILE_PRIVACY_SETTINGS : "linked to"
    PROFESSIONAL_PROFILES ||--o{ EMPLOYER_LINK_REQUESTS : "generates"
    PROFESSIONAL_PROFILES }o--|| ORGANIZATIONS : "linked to"
    PROFESSIONAL_PROFILES }o--|| PROFESSIONS : "belongs to"
    PROFESSIONAL_PROFILES }o--|| SPECIALTIES : "has"
    PROFESSIONAL_PROFILES }o--|| SUBSPECIALTIES : "has"
    PROFESSIONAL_PROFILES }o--|| LICENSING_AUTHORITIES : "licensed by"
    ORGANIZATIONS ||--o{ ORGANIZATION_MEMBERS : "has"
    ORGANIZATIONS ||--o{ EMPLOYER_LINK_REQUESTS : "receives"
    CME_WALLETS ||--o{ CME_ACTIVITIES : "contains"
    CME_WALLETS }o--|| PROFESSIONS : "for"
    SPECIALTIES }o--|| PROFESSIONS : "under"
    SUBSPECIALTIES }o--|| SPECIALTIES : "under"
    USERS ||--o{ AUDIT_LOGS : "generates"
```

---

## DIAGRAM 6 — Role-Based Access Control

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e293b', 'primaryTextColor': '#e2e8f0', 'primaryBorderColor': '#10b981', 'lineColor': '#64748b', 'fontFamily': 'Inter, sans-serif', 'fontSize': '11px'}}}%%

graph LR
    subgraph ROLES["🔐 PLATFORM ROLES"]
        R1["healthcare_professional"]
        R2["employer_admin"]
        R3["training_provider_admin"]
        R4["university_admin"]
        R5["master_admin"]
        R6["super_admin"]
    end

    subgraph RESOURCES["📦 PROTECTED RESOURCES"]
        RES1["Own Profile Data"]
        RES2["Own CME Wallet"]
        RES3["Own Certificates"]
        RES4["Privacy Settings"]
        RES5["Staff Profiles (linked only)"]
        RES6["Staff CME Data (with consent)"]
        RES7["Staff License Alerts"]
        RES8["Department Reports"]
        RES9["Organization Records"]
        RES10["All User Profiles"]
        RES11["Audit Logs"]
        RES12["Platform Analytics"]
        RES13["All Organizations"]
        RES14["Full Platform Control"]
    end

    R1 -->|"Read + Write"| RES1
    R1 -->|"Read + Write"| RES2
    R1 -->|"Read + Write"| RES3
    R1 -->|"Read + Write"| RES4

    R2 -->|"Read (consent-gated)"| RES5
    R2 -->|"Read (consent-gated)"| RES6
    R2 -->|"Read"| RES7
    R2 -->|"Read"| RES8
    R2 -->|"Read own org"| RES9

    R3 -->|"Read + Write own courses"| RES1
    R4 -->|"Read + Write own programs"| RES1

    R5 -->|"Full"| RES9
    R5 -->|"Full"| RES10
    R5 -->|"Read"| RES11
    R5 -->|"Read"| RES12
    R5 -->|"Full"| RES13

    R6 -->|"Full"| RES14
    R6 -->|"Full"| RES11
    R6 -->|"Full"| RES12

    subgraph AUDIT_TRIGGERS["📋 AUDIT LOG TRIGGERS"]
        AT1["Employer views CME wallet"]
        AT2["Employer views license info"]
        AT3["Employer approves staff link"]
        AT4["User changes privacy settings"]
        AT5["Admin changes org verification"]
        AT6["Certificate uploaded or deleted"]
        AT7["Super admin impersonates user"]
        AT8["Mass data export"]
    end

    R2 -.->|"Logged"| AT1
    R2 -.->|"Logged"| AT2
    R2 -.->|"Logged"| AT3
    R1 -.->|"Logged"| AT4
    R5 -.->|"Logged"| AT5
    R1 -.->|"Logged"| AT6
    R6 -.->|"Logged"| AT7
    R5 -.->|"Logged"| AT8

    classDef roleNode fill:#064e3b,stroke:#10b981,color:#d1fae5,font-weight:bold
    classDef resNode fill:#1e293b,stroke:#475569,color:#94a3b8
    classDef auditNode fill:#450a0a,stroke:#ef4444,color:#fca5a5,font-size:10px

    class R1,R2,R3,R4,R5,R6 roleNode
    class RES1,RES2,RES3,RES4,RES5,RES6,RES7,RES8,RES9,RES10,RES11,RES12,RES13,RES14 resNode
    class AT1,AT2,AT3,AT4,AT5,AT6,AT7,AT8 auditNode
```

---

## DIAGRAM 7 — Revenue & Business Model

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#064e3b', 'primaryTextColor': '#d1fae5', 'primaryBorderColor': '#10b981', 'lineColor': '#10b981', 'fontFamily': 'Inter, sans-serif', 'fontSize': '12px'}}}%%

flowchart LR
    subgraph PRO_REVENUE["💳 PROFESSIONAL PLANS"]
        FREE_P["Free Forever<br/>Basic CME tracking<br/>1 renewal cycle<br/>5 certificate uploads"]
        BASIC_P["Pro Individual<br/>QAR 49/mo<br/>Unlimited credits<br/>Unlimited certificates<br/>License alerts"]
        PREMIUM_P["Pro+ Individual<br/>QAR 99/mo<br/>AI course matching<br/>Export reports<br/>API access"]
    end

    subgraph EMP_REVENUE["🏢 EMPLOYER PLANS"]
        STARTER_E["Employer Starter<br/>QAR 499/mo<br/>Up to 25 staff<br/>Basic compliance view<br/>License alerts"]
        GROWTH_E["Employer Growth<br/>QAR 1,299/mo<br/>Up to 100 staff<br/>Department reports<br/>CSV export"]
        ENT_E["Enterprise<br/>QAR 3,999/mo<br/>Unlimited staff<br/>Custom reports<br/>API + HRIS integration<br/>Dedicated support"]
    end

    subgraph TP_REVENUE["🎓 TRAINING PROVIDER PLANS"]
        TP_BASIC["Provider Basic<br/>QAR 299/mo<br/>List 10 courses<br/>CME-accredited badge"]
        TP_PRO["Provider Pro<br/>QAR 799/mo<br/>Unlimited courses<br/>Analytics + leads<br/>Featured placement"]
    end

    subgraph ADD_ONS["➕ ADD-ONS"]
        AO1["Certificate Verification API<br/>QAR 1/certificate"]
        AO2["Bulk Staff Onboarding<br/>QAR 199 setup fee"]
        AO3["Custom Compliance Reports<br/>QAR 299/report"]
        AO4["HRIS Integration<br/>QAR 999/mo"]
        AO5["White-label for Hospitals<br/>QAR 4,999/mo"]
    end

    subgraph ECONOMICS["📈 UNIT ECONOMICS"]
        LTV_P["Professional LTV<br/>Avg 24-mo · QAR 1,500"]
        LTV_E["Employer LTV<br/>Avg 36-mo · QAR 35,000"]
        CAC_E["Employer CAC<br/>~QAR 800<br/>B2B outreach + referral"]
        GM_P["Gross Margin Target<br/>78%+ (SaaS + low marginal cost)"]
        MRR_P["MRR Targets<br/>Yr1: QAR 80K<br/>Yr2: QAR 300K<br/>Yr3: QAR 900K"]
    end

    PRO_REVENUE --> ECONOMICS
    EMP_REVENUE --> ECONOMICS
    TP_REVENUE --> ECONOMICS
    ADD_ONS --> ECONOMICS

    classDef proRev fill:#064e3b,stroke:#10b981,color:#d1fae5,font-weight:bold
    classDef empRev fill:#1e3a5f,stroke:#60a5fa,color:#bfdbfe,font-weight:bold
    classDef tpRev fill:#3b1f00,stroke:#fbbf24,color:#fde68a,font-weight:bold
    classDef addOn fill:#2d1b69,stroke:#a78bfa,color:#ddd6fe
    classDef econNode fill:#1f2937,stroke:#9ca3af,color:#f3f4f6,font-weight:bold

    class FREE_P,BASIC_P,PREMIUM_P proRev
    class STARTER_E,GROWTH_E,ENT_E empRev
    class TP_BASIC,TP_PRO tpRev
    class AO1,AO2,AO3,AO4,AO5 addOn
    class LTV_P,LTV_E,CAC_E,GM_P,MRR_P econNode
```

---

## DIAGRAM 8 — Technical Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#1e293b', 'primaryTextColor': '#e2e8f0', 'primaryBorderColor': '#10b981', 'lineColor': '#64748b', 'fontFamily': 'Inter, sans-serif', 'fontSize': '12px'}}}%%

graph TB
    subgraph FRONTEND["🖥️ FRONTEND — Next.js 15 App Router"]
        direction LR
        subgraph PUBLIC_PAGES["Public Pages"]
            LP["Landing Page<br/>pro.hayyamed.com"]
            PRICING_P["Pricing Page"]
            LOGIN_P["Login / Register"]
        end
        subgraph ONBOARD_PAGES["Onboarding (7 Steps)"]
            OB["Multi-step Form<br/>Progress saved to DB<br/>Resume anytime"]
        end
        subgraph PRO_PAGES["Professional Dashboard"]
            PD1["CME Wallet Page"]
            PD2["License Management"]
            PD3["Certificate Vault"]
            PD4["Privacy Settings"]
            PD5["Course Recommendations"]
            PD6["Profile Page"]
        end
        subgraph EMP_PAGES["Employer Dashboard"]
            ED1["Staff Overview"]
            ED2["Compliance Reports"]
            ED3["License Alerts"]
            ED4["Link Request Manager"]
        end
        subgraph ADMIN_PAGES["Admin Dashboard"]
            AD1["Organization Management"]
            AD2["User Management"]
            AD3["Audit Log Viewer"]
            AD4["Platform Analytics"]
        end
    end

    subgraph API_LAYER["⚙️ API LAYER — Next.js Route Handlers"]
        direction TB
        AUTH_API["Auth API<br/>/api/auth/*<br/>Register · Login · Verify · Reset"]
        PROFILE_API["Profile API<br/>/api/profile/*<br/>Create · Update · Complete"]
        CME_API["CME API<br/>/api/cme/*<br/>Wallet · Activities · Upload"]
        EMPLOYER_API["Employer API<br/>/api/employer/*<br/>Search · Link · Approve"]
        PRIVACY_API["Privacy API<br/>/api/privacy/*<br/>Get · Update settings"]
        REPORTS_API["Reports API<br/>/api/reports/*<br/>Compliance · Department"]
        AI_API["AI API<br/>/api/ai/*<br/>Course Match · Risk · Coach"]
        WEBHOOK_API["Webhooks<br/>/api/webhooks/*<br/>Stripe · Email events"]
    end

    subgraph MIDDLEWARE["🔐 MIDDLEWARE & GUARDS"]
        AUTH_MW["Auth Middleware<br/>JWT verification"]
        RLS_MW["RLS Policy Enforcement<br/>Role-based data access"]
        PRIVACY_MW["Privacy Gate<br/>Consent check before data pass"]
        AUDIT_MW["Audit Logger<br/>Sensitive action capture"]
    end

    subgraph SUPABASE_PRO["🗄️ SUPABASE — Data Layer"]
        direction TB
        DB_PRO["PostgreSQL<br/>15 tables + RLS policies"]
        AUTH_PRO["Supabase Auth<br/>Email verify · OAuth"]
        STORAGE_PRO["Storage<br/>Certificate PDFs<br/>Profile Photos"]
        RT_PRO["Realtime<br/>Link request notifications<br/>Alert broadcasts"]
        EDGE_PRO["Edge Functions<br/>License expiry cron<br/>CME reminder jobs"]
    end

    subgraph EXT_SERVICES["🔌 EXTERNAL SERVICES"]
        CLAUDE_PRO["Claude AI<br/>Course matching<br/>Compliance coaching"]
        OCR_PRO["OCR Engine<br/>Certificate reading<br/>Credit extraction"]
        STRIPE_PRO["Stripe<br/>All subscription plans"]
        EMAIL_PRO["Resend Email<br/>Verifications · Alerts"]
        SMS_PRO["Twilio SMS<br/>License expiry warnings"]
        QCHP_PRO["QCHP API (future)<br/>Authority verification"]
    end

    FRONTEND --> API_LAYER
    API_LAYER --> MIDDLEWARE
    MIDDLEWARE --> SUPABASE_PRO
    API_LAYER --> EXT_SERVICES

    classDef frontendNode fill:#1e3a5f,stroke:#60a5fa,color:#bfdbfe
    classDef apiNode fill:#064e3b,stroke:#10b981,color:#d1fae5
    classDef mwNode fill:#450a0a,stroke:#ef4444,color:#fca5a5
    classDef dbNode fill:#0f172a,stroke:#475569,color:#94a3b8
    classDef extNode fill:#3b1f00,stroke:#fbbf24,color:#fde68a

    class LP,PRICING_P,LOGIN_P,OB,PD1,PD2,PD3,PD4,PD5,PD6 frontendNode
    class ED1,ED2,ED3,ED4,AD1,AD2,AD3,AD4 frontendNode
    class AUTH_API,PROFILE_API,CME_API,EMPLOYER_API,PRIVACY_API,REPORTS_API,AI_API,WEBHOOK_API apiNode
    class AUTH_MW,RLS_MW,PRIVACY_MW,AUDIT_MW mwNode
    class DB_PRO,AUTH_PRO,STORAGE_PRO,RT_PRO,EDGE_PRO dbNode
    class CLAUDE_PRO,OCR_PRO,STRIPE_PRO,EMAIL_PRO,SMS_PRO,QCHP_PRO extNode
```

---

## IMPLEMENTATION ROADMAP

### Phase 1 — Foundation (Week 1–2)
**Database & Auth**
- [ ] Create Supabase project: `hayyamed-pro`
- [ ] Run all 15 table migrations with RLS policies
- [ ] Set up role enum + auth triggers
- [ ] Configure storage buckets (certificates, profile-photos)

**Onboarding Flow**
- [ ] 7-step form with localStorage + DB draft saving
- [ ] Email verification flow
- [ ] Profession → Specialty → Subspecialty cascading dropdowns
- [ ] Progress bar + step validation

### Phase 2 — Core Features (Week 3–4)
**Professional Dashboard**
- [ ] CME Wallet UI (donut chart, progress bar, credits breakdown)
- [ ] Certificate upload (drag & drop, PDF preview, OCR processing)
- [ ] License countdown (days remaining, color-coded risk)
- [ ] Privacy settings control panel

**Employer Linking**
- [ ] Organization search with fuzzy match
- [ ] Link request flow (send → notify → approve/reject)
- [ ] Unverified employer suggestion flow
- [ ] Real-time notification via Supabase Realtime

### Phase 3 — Employer Dashboard (Week 5–6)
- [ ] Staff compliance overview table
- [ ] Privacy-gated data rendering (check consent flags server-side)
- [ ] License expiry alerts (30/60/90 day dashboard cards)
- [ ] Department-level compliance report
- [ ] CSV export for HR teams

### Phase 4 — AI & Intelligence (Week 7–8)
- [ ] AI course matcher (Claude API — specialty + credits gap → recommendations)
- [ ] AI renewal risk predictor (license expiry + credit velocity)
- [ ] AI compliance coach (personalized action plan)
- [ ] OCR certificate reader (extract credits, dates, provider)

### Phase 5 — Billing & Admin (Week 9–10)
- [ ] Stripe integration (individual + employer plans)
- [ ] Master admin dashboard (org verification, user management)
- [ ] Audit log viewer (super admin only)
- [ ] Cron jobs: license expiry emails (90/60/30/7 days)

---

## SQL MIGRATIONS — Quick Reference

```sql
-- Core lookup tables
CREATE TABLE professions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, code text UNIQUE, applicable_countries text[]);
CREATE TABLE specialties (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), profession_id uuid REFERENCES professions(id), name text NOT NULL, code text);
CREATE TABLE subspecialties (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), specialty_id uuid REFERENCES specialties(id), name text NOT NULL);
CREATE TABLE licensing_authorities (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, country text, website text, required_cme_credits_per_cycle int, cycle_years int);

-- Core business tables
CREATE TABLE organizations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_name text NOT NULL, organization_type text, country text, city text, verification_status text DEFAULT 'unverified', created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now());

CREATE TABLE professional_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  date_of_birth date,
  gender text,
  nationality text,
  country_of_residence text,
  profession_id uuid REFERENCES professions(id),
  specialty_id uuid REFERENCES specialties(id),
  subspecialty_id uuid REFERENCES subspecialties(id),
  license_number text,
  licensing_authority_id uuid REFERENCES licensing_authorities(id),
  license_expiry_date date,
  employer_name_text text,
  employer_id uuid REFERENCES organizations(id),
  current_role text,
  years_of_experience int,
  preferred_language text DEFAULT 'en',
  profile_completion_percentage int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  user_id uuid REFERENCES auth.users(id),
  professional_profile_id uuid REFERENCES professional_profiles(id),
  role_in_organization text,
  membership_status text DEFAULT 'pending' CHECK (membership_status IN ('pending','approved','rejected','removed')),
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE employer_link_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_profile_id uuid REFERENCES professional_profiles(id),
  user_id uuid REFERENCES auth.users(id),
  employer_name_text text,
  organization_id uuid REFERENCES organizations(id),
  request_status text DEFAULT 'pending' CHECK (request_status IN ('pending','approved','rejected','cancelled')),
  requested_at timestamptz DEFAULT now(),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  notes text
);

CREATE TABLE profile_privacy_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  professional_profile_id uuid REFERENCES professional_profiles(id),
  employer_can_view_cme_summary boolean DEFAULT true,
  employer_can_view_certificates boolean DEFAULT false,
  employer_can_view_license_expiry boolean DEFAULT true,
  employer_can_view_detailed_cme_activities boolean DEFAULT false,
  employer_can_view_profile_details boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE cme_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  professional_profile_id uuid REFERENCES professional_profiles(id),
  country_id text,
  profession_id uuid REFERENCES professions(id),
  specialty_id uuid REFERENCES specialties(id),
  required_credits int DEFAULT 50,
  completed_credits int DEFAULT 0,
  remaining_credits int GENERATED ALWAYS AS (required_credits - completed_credits) STORED,
  compliance_status text DEFAULT 'pending',
  renewal_cycle_start date,
  renewal_cycle_end date,
  last_updated_at timestamptz DEFAULT now()
);

CREATE TABLE cme_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES cme_wallets(id),
  user_id uuid REFERENCES auth.users(id),
  activity_title text NOT NULL,
  activity_type text,
  provider_name text,
  country text,
  credits_awarded decimal(5,2),
  activity_date date,
  certificate_url text,
  verification_status text DEFAULT 'unverified',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id),
  actor_role text,
  action_type text NOT NULL,
  target_user_id uuid REFERENCES auth.users(id),
  target_resource text,
  metadata jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);
```

---

## COMPLIANCE NOTICES

> **Platform Disclaimer (required on all pages):**
> "Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with their relevant regulatory body."

> **Data Protection:** Full compliance with Qatar PDPL Law No. 13/2016. All employer data access is consent-gated, logged, and auditable.

> **GCC Expansion:** Architecture supports multi-country regulatory bodies (QCHP Qatar, DHA Dubai, HAAD Abu Dhabi, SCFHS Saudi Arabia, MOH Kuwait).

---

*Generated: June 2026 | Hayya Med Technology | Project 4 — Hayya Med PRO*
*Classification: Internal Architecture + Investor Document*

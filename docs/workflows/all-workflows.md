# Hayya Med Pro — Workflow & Automation Architecture
_Generated: 2026-06-15_

---

## 1. User Registration & Profile Creation

```mermaid
flowchart TD
    A[Visitor clicks Register] --> B[POST /api/auth/register\nor Supabase Auth UI]
    B --> C{Email already exists?}
    C -->|Yes| D[Return 409 error]
    C -->|No| E[Supabase creates auth.users row]
    E --> F[Trigger: on_auth_user_created]
    F --> G[INSERT professional_profiles\nauth_id email]
    G --> H[Trigger: on_profile_created_subscription]
    H --> I[INSERT subscriptions\nplan=free status=active]
    I --> J[POST /api/auth/verify-email\nor magic link]
    J --> K[Redirect to /onboarding/1]
    K --> L[Onboarding Steps 1–7]
    L --> M{All 7 steps complete?}
    M -->|No| N[Store onboarding_step in profile]
    M -->|Yes| O[SET onboarding_complete=true]
    O --> P[Redirect to /dashboard]
    P --> Q[Drip email D+1 queued by cron]

    style E fill:#dbeafe
    style G fill:#dbeafe
    style I fill:#dbeafe
    style O fill:#dcfce7
```

**Automations triggered:**
- `handle_new_user()` DB trigger → creates `professional_profiles`
- `handle_new_subscription()` DB trigger → creates free `subscriptions` row
- `drip_email_log` cron (D+1, D+3, D+7, D+10) → onboarding activation emails

**Missing automation:** Welcome email sent immediately on profile creation (currently only drip D+1)

---

## 2. Employer / Organisation Onboarding

```mermaid
flowchart TD
    A[Employer registers or is invited] --> B[POST /api/auth → role=employer_admin]
    B --> C[INSERT organization_members\nrole=employer_admin]
    C --> D[Employer accesses /employer dashboard]
    D --> E[Employer invites staff via QR or link]
    E --> F{Staff member already registered?}
    F -->|No| G[Staff registers → shown employer link prompt]
    F -->|Yes| H[Staff receives invite notification]
    G --> I[Staff submits employer_link_request]
    H --> I
    I --> J[INSERT employer_link_requests\nstatus=pending]
    J --> K[Employer sees request in dashboard]
    K --> L{Employer approves?}
    L -->|Reject| M[UPDATE status=rejected\nNotify staff]
    L -->|Approve| N[UPDATE status=approved]
    N --> O[Staff profile now visible to employer]
    O --> P{Mandatory courses assigned?}
    P -->|Yes| Q[employer_required_courses checked\nStaff sees required training]
    P -->|No| R[Employer views compliance heatmap]

    style N fill:#dcfce7
    style J fill:#dbeafe
```

**Missing automation:** No webhook fired when employer approves a link request (enterprise integrations need this)

---

## 3. CME Activity Submission & Verification

```mermaid
flowchart TD
    A[Professional logs CME] --> B{Online or offline?}
    B -->|Online| C[POST /api/cme/activities\nwith optional certificate file]
    B -->|Offline| D[Queued in localStorage\nvia cmeOfflineQueue]
    D --> E{Connection restored?}
    E -->|Yes| F[POST /api/cme/submit-queued\nflush queue]
    E -->|No| G[Queue persists in localStorage]
    F --> C
    C --> H{Certificate uploaded?}
    H -->|Yes| I[File → Supabase private bucket\nStore path in cme_activities.certificate_url]
    H -->|No| J[Activity created with status=pending]
    I --> J
    J --> K{AI OCR requested?}
    K -->|Yes Pro only| L[POST /api/ai/ocr-certificate\nExtract title/date/credits/category]
    L --> M[Pre-fill form with AI suggestions]
    K -->|No| N[Manual form entry]
    M --> N
    N --> O[INSERT cme_activities\nverification_status=pending]
    O --> P[Trigger: cme_activity_sync]
    P --> Q[UPDATE cme_wallets.completed_credits\nfrom verified activities only]
    Q --> R[Trigger: update_compliance_status\nRecompute compliance_status]
    R --> S{Admin reviews pending activities?}
    S -->|Verify| T[UPDATE verification_status=verified]
    T --> P
    S -->|Reject| U[UPDATE verification_status=rejected\nSend rejection email]

    style T fill:#dcfce7
    style U fill:#fee2e2
    style L fill:#fef3c7
```

**Missing automation:**
- Auto-verify activities from known accredited providers (marketplace completions are auto-verified)
- No AI confidence score stored for OCR extraction quality

---

## 4. Course Enrollment & Completion (Marketplace)

```mermaid
flowchart TD
    A[Professional browses /dashboard/marketplace] --> B[Finds course]
    B --> C[POST /api/marketplace/enroll\ncourseId]
    C --> D{Already enrolled?}
    D -->|Yes| E[Return 409]
    D -->|No| F[INSERT course_enrollments\nstatus=enrolled]
    F --> G[Course appears in My Courses]
    G --> H[Professional completes course]
    H --> I[POST /api/marketplace/complete\nenrollmentId]
    I --> J[Fetch enrollment + course credits]
    J --> K[INSERT cme_activities\nverification_status=verified\ntitle=course.title provider=provider.name]
    K --> L[Trigger: cme_activity_sync → wallet update]
    L --> M[UPDATE course_enrollments\nstatus=completed\ncme_activity_id=new_activity_id]
    M --> N[Return 200 creditsIssued]
    N --> O[UI shows Credits issued! toast]
    O --> P{Achievement unlocked?}
    P -->|Yes| Q[POST /api/badge/check\nAward badge if threshold met]
    P -->|No| R[Dashboard refreshes]

    style K fill:#dcfce7
    style L fill:#dbeafe
```

---

## 5. Subscription Lifecycle (Paddle)

```mermaid
flowchart TD
    A[User clicks Upgrade] --> B[Redirect to Paddle Checkout\nwith price_id + customer_data]
    B --> C{Payment successful?}
    C -->|No| D[Checkout abandoned / failed]
    C -->|Yes| E[Paddle fires webhook\nsubscription.activated]
    E --> F[POST /api/paddle/webhooks]
    F --> G{Valid HMAC signature?}
    G -->|No| H[Return 401 reject]
    G -->|Yes| I[UPDATE subscriptions\nplan=pro status=active\npaddle_subscription_id]
    I --> J[Send upgrade confirmation email]
    J --> K[User now has Pro features]
    K --> L{Subscription renewal?}
    L -->|subscription.updated| M[UPDATE current_period_end]
    L -->|payment.failed| N[UPDATE status=past_due\nSend payment failure email]
    L -->|subscription.cancelled| O[UPDATE status=canceled\ncancel_at_period_end=true]
    O --> P{Period end reached?}
    P -->|Yes| Q[User downgraded to Free tier\nFeature gates enforced]

    style I fill:#dcfce7
    style N fill:#fee2e2
    style Q fill:#fef3c7
```

**QPay alternative (Qatar):**
```mermaid
flowchart LR
    A[User selects QPay] --> B[POST /api/qpay/create-invoice]
    B --> C[INSERT qpay_invoices\nstatus=pending]
    C --> D[Show QR code to user]
    D --> E[User scans QR in banking app]
    E --> F[QPay fires callback webhook]
    F --> G[POST /api/qpay/callback]
    G --> H[UPDATE qpay_invoices\nstatus=paid]
    H --> I[UPDATE subscriptions\nplan=pro]
```

---

## 6. Compliance Monitoring (Automated)

```mermaid
flowchart TD
    A[Cloud Scheduler — 7 cron jobs] --> B[cme-deadline cron\n7-day and 30-day reminders]
    A --> C[license-expiry cron\n30/60/90-day reminders]
    A --> D[compliance-alerts cron\nCheck employer thresholds]
    A --> E[trial-reminders cron\n7-day / expired notices]
    A --> F[professional-digest cron\nWeekly CME summary]
    A --> G[employer-digest cron\nWeekly staff compliance report]
    A --> H[license-reminders push cron\nPush notifications]

    B --> I{For each professional with\nactive wallet near cycle_end?}
    I -->|Yes| J[Send deadline reminder email\nvia Postmark]

    D --> K{Employer threshold configured?}
    K -->|Yes| L[Query staff compliance %]
    L --> M{Any staff below threshold_pct?}
    M -->|Yes| N[Send alert to alert_email]
    M -->|No| O[No action]

    style J fill:#dbeafe
    style N fill:#fef3c7
```

**Missing automation:**
- No real-time compliance score push when activity is verified (only recalculated on wallet write)
- No automated re-enrollment reminder for employer_required_courses with due dates

---

## 7. AI Certificate OCR Flow

```mermaid
flowchart TD
    A[Pro user uploads certificate] --> B[POST /api/ai/ocr-certificate\nmultipart form data]
    B --> C{File size ≤ 8MB?}
    C -->|No| D[Return 413]
    C -->|Yes| E{Rate limit OK?\n5/hour per user}
    E -->|No| F[Return 429]
    E -->|Yes| G[Convert file to base64]
    G --> H[Send to Claude Sonnet 4.6\nvia Vertex AI]
    H --> I[Extract: title, provider,\ndate, credits, category]
    I --> J[Validate via OcrResponseSchema\nZod parse]
    J --> K{Valid response?}
    K -->|No| L[Return null — user enters manually]
    K -->|Yes| M[Return extracted fields]
    M --> N[logAudit: action=ai_ocr_certificate]
    N --> O[Pre-fill CME form\nUser reviews and submits]

    style H fill:#fef3c7
    style J fill:#dbeafe
```

---

## 8. Renewal Tracking & License Management

```mermaid
flowchart TD
    A[Professional adds license\nPOST /api/licenses] --> B[INSERT professional_licenses]
    B --> C[Renewal Calendar shows license timeline]
    C --> D{expiry_date - today ≤ 90 days?}
    D -->|Yes| E[license-expiry cron triggers]
    E --> F{90-day notice sent?}
    F -->|No| G[Send 90-day email\nlog in audit_logs]
    D --> H{expiry_date - today ≤ 30 days?}
    H -->|Yes| I[Send 30-day email]
    H --> J{expiry_date - today ≤ 7 days?}
    J -->|Yes| K[Send 7-day email + push notification]
    K --> L{License expired?}
    L -->|Yes| M[Send expiry email\nFlag in dashboard]

    style G fill:#fef3c7
    style M fill:#fee2e2
```

---

## 9. Referral Programme

```mermaid
flowchart TD
    A[Professional generates referral link\nPOST /api/referral/generate] --> B[Generate unique referral_code\nStore in professional_profiles]
    B --> C[Share link: /register?ref=CODE]
    C --> D[New user registers with ref param]
    D --> E[POST /api/auth/register\nwith referral_code in body]
    E --> F[INSERT referrals\nreferrer_auth_id, referred_auth_id\nstatus=signed_up]
    F --> G{Referred user upgrades to Pro?}
    G -->|Yes| H[UPDATE referrals.status=converted\nconverted_at=now]
    H --> I{Referrer reward?}
    I -->|Pending implementation| J[⚠️ No automatic reward currently\nManual admin action required]

    style J fill:#fee2e2
```

**Missing:** Referral reward automation — discount, trial extension, or free month for referrer on conversion

---

## 10. Push Notification Flow

```mermaid
flowchart TD
    A{Notification type} --> B[license-reminders cron]
    A --> C[Admin broadcast\nPOST /api/push/route.ts]

    B --> D[Query professionals with\nlicense expiry in 7/30 days]
    D --> E[For each: fetch push_subscriptions]
    E --> F{Has push subscription?}
    F -->|Yes| G[Send Web Push\nVAPID signed payload]
    F -->|No| H[Skip — no push endpoint]

    C --> I[Admin selects segment\nor broadcasts to all]
    I --> J[Fetch all push_subscriptions]
    J --> K[Batch send Web Push\nvia web-push library]
    K --> L{Push endpoint gone?}
    L -->|410 Gone| M[DELETE push_subscriptions\nEndpoint invalid]
    L -->|Success| N[Notification delivered]

    style N fill:#dcfce7
    style M fill:#fee2e2
```

---

## 11. Drip Email Onboarding Sequence

```mermaid
flowchart TD
    A[User registers] --> B[Account created\nD+0: no email]
    B --> C[Cloud Scheduler fires\nonboarding-drip cron daily]
    C --> D{For each user: check\ndays_since_signup}
    D --> E{Day 1?}
    E --> F{Sent D+1 already?\nCHECK drip_email_log}
    F -->|No| G[Send: Getting Started email\nINSERT drip_email_log sequence_day=1]
    F -->|Yes| H[Skip]
    D --> I{Day 3?}
    I --> J{Sent D+3?}
    J -->|No| K[Send: First CME email\nINSERT drip_email_log sequence_day=3]
    D --> L{Day 7?}
    L --> M[Send: Compliance Status email]
    D --> N{Day 10?}
    N --> O[Send: Pro upgrade prompt]

    style G fill:#dbeafe
    style K fill:#dbeafe
```

---

## 12. MFA / Security Flow

```mermaid
flowchart TD
    A[User enables MFA\nPOST /api/auth/mfa/setup] --> B[Generate TOTP secret\nvia Supabase Auth]
    B --> C[Display QR code\nUser scans with authenticator app]
    C --> D[User enters verification code]
    D --> E{Code valid?}
    E -->|No| F[Return 400 Invalid code]
    E -->|Yes| G[Supabase MFA enrolled\nAAL2 required for sensitive ops]
    G --> H[Generate 8 recovery codes\nhashed with bcrypt]
    H --> I[INSERT mfa_recovery_codes\nhashed values]
    I --> J[Show codes to user ONCE\nStore securely]
    J --> K{Login flow}
    K --> L[User enters password → AAL1]
    L --> M{MFA enabled?}
    M -->|Yes| N[Prompt TOTP code]
    N --> O{Valid TOTP?}
    O -->|No| P{Recovery code?}
    P -->|Yes| Q[Compare hash\nMarkused=true]
    Q --> R[AAL2 granted]
    O -->|Yes| R

    style R fill:#dcfce7
    style F fill:#fee2e2
```

---

## Automation Gaps Summary

| Gap | Priority | Impact |
|-----|----------|--------|
| No immediate welcome email on registration | MEDIUM | Activation rate |
| No referral reward automation | HIGH | Growth / viral loop |
| No real-time compliance push on activity verify | LOW | UX polish |
| No employer webhook on link approval | HIGH | Enterprise integration |
| No retry/queue for failed emails | HIGH | Reliability |
| No auto-verify for known accredited providers | MEDIUM | UX friction |
| No post-renewal congratulation email | LOW | Retention |
| No employer_required_courses deadline alerts | MEDIUM | Employer value |


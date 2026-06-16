# Hayya Med Pro — Data Breach Notification Runbook

## Classification: Internal — Operations
## Version: 1.0 | Effective: 2026-06-16
## Authority: CISO / Privacy Officer

---

## Legal Basis

Qatar Personal Data Protection Law (PDPL) — Law No. 13 of 2016, Article 20:

> "The controller shall notify the competent authority of any personal data breach
> without undue delay and, where feasible, not later than 72 hours after becoming
> aware of the breach."

Additional obligations:
- **EU GDPR Article 33/34** — applies to any EU/EEA data subjects
- **GCC data residency requirements** — per-country supplemental rules
- **Paddle DPA** — payment processor must be notified of breaches affecting card data
- **Postmark DPA** — email processor must be notified of breaches affecting email metadata

---

## 1. Detection & Triage (Hour 0–1)

### 1.1 Who to contact first

| Role | Contact | Priority |
|---|---|---|
| CEO / Founder | Internal Slack #incident | Immediate |
| CISO / Privacy Officer | Internal Slack #incident | Immediate |
| Lead Engineer | Internal Slack #incident | Immediate |
| Legal Counsel | Email / Phone | Within 1 hour |

### 1.2 Immediate containment actions

Run in the following order — do not wait to confirm scope before starting:

```bash
# 1. Rotate the compromised credential immediately
#    Supabase → Settings → API → Rotate service role key
#    Then update GCP Secret Manager:
gcloud secrets versions add SUPABASE_SERVICE_ROLE_KEY --data-file=-

# 2. If database access is suspected, run in Supabase SQL Editor:
SELECT * FROM audit_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
LIMIT 500;

# 3. If a user account is suspected of compromise, suspend immediately:
# POST /api/admin/suspend-account { professionalId, reason }

# 4. Enable Cloud Armor or firewall rule to block suspected IP range:
gcloud compute security-policies rules create 1000 \
  --security-policy=hayya-med-policy \
  --expression="inIpRange(origin.ip, 'SUSPECT_IP/CIDR')" \
  --action=deny-403
```

### 1.3 Determine breach scope

Run this query in Supabase SQL Editor to identify affected data:

```sql
-- Find all potentially accessed records in the window
SELECT
  'professional_profiles' AS table_name,
  COUNT(*) AS records_at_risk
FROM professional_profiles
WHERE created_at <= 'BREACH_END_TIMESTAMP'

UNION ALL

SELECT 'cme_activities', COUNT(*)
FROM cme_activities
WHERE created_at <= 'BREACH_END_TIMESTAMP'

UNION ALL

SELECT 'subscriptions', COUNT(*)
FROM subscriptions
WHERE created_at <= 'BREACH_END_TIMESTAMP';
```

**Data categories in our system (for notification content):**

| Category | Sensitivity | Tables |
|---|---|---|
| Identity | High | professional_profiles (full_name, email, license_number) |
| Professional credentials | High | professional_profiles, professional_licenses |
| Health/CME records | High | cme_activities, cme_wallets |
| Payment data | Critical | subscriptions (plan only — Paddle holds card data) |
| Authentication | Critical | auth.users, mfa_recovery_codes |

---

## 2. Hour 0–6: Internal Assessment

### 2.1 Breach classification

| Severity | Criteria | Response |
|---|---|---|
| **P0 — Critical** | Card data, auth credentials, mass PII export (>100 users) | CEO + Legal notified immediately; PDPL regulator notification mandatory within 72 hours |
| **P1 — High** | CME records, license numbers, <100 users | Legal notified within 2 hours; regulator notification likely required |
| **P2 — Medium** | Email addresses only, no health data, <10 users | Legal review; regulator notification at legal discretion |
| **P3 — Low** | No PII accessed; configuration or availability incident | Internal review only |

### 2.2 Evidence preservation

Before any remediation that alters logs:

```bash
# Export audit_logs for the incident window to GCP Cloud Storage
gcloud storage cp - gs://hayyamed-incident-logs/$(date +%Y%m%d)-incident.json << 'EOF'
-- Run in Supabase: COPY (SELECT * FROM audit_logs WHERE ...) TO STDOUT CSV HEADER;
EOF

# Export GCP access logs
gcloud logging read "timestamp>=\"BREACH_START_TIMESTAMP\"" \
  --format=json > /tmp/gcp-access-logs.json
```

---

## 3. Hour 24–72: Regulator Notification

**Required for P0 and P1 incidents under PDPL Article 20.**

### 3.1 Qatar PDPL Regulator Notification

**Authority:** Ministry of Communications and Information Technology (MCIT) — Personal Data Protection Department

**Method:** Email to pdp@mcit.gov.qa (subject: "Personal Data Breach Notification — Hayya Med Pro")

**Template:**

---

**SUBJECT:** Personal Data Breach Notification — Hayya Med Pro — [DATE]

To the Personal Data Protection Department,

Hayya Med Pro (operated by [LEGAL_ENTITY_NAME], CR No. [COMMERCIAL_REGISTRATION_NUMBER]) hereby notifies the Personal Data Protection Department of a personal data breach discovered on [DISCOVERY_DATE_TIME] (Qatar Standard Time).

**1. Nature of the breach:**
[Describe: unauthorized access / exfiltration / accidental exposure / ransomware]

**2. Categories of personal data involved:**
- [ ] Full name
- [ ] Email address
- [ ] Medical license number
- [ ] CME activity records
- [ ] Authentication credentials
- [ ] Payment subscription status (note: no card numbers held — Paddle is the processor)

**3. Approximate number of individuals affected:**
[NUMBER] healthcare professionals

**4. Likely consequences:**
[Describe potential harm: identity fraud, credential misuse, professional reputational harm]

**5. Measures taken or proposed:**
- [DATE TIME]: [Action taken — e.g., compromised credential rotated]
- [DATE TIME]: [Action taken — e.g., affected accounts suspended]
- [DATE TIME]: [Action taken — e.g., breach vector patched]
- Ongoing: Enhanced monitoring of all audit log activity
- Planned: External security assessment

**6. Contact for further information:**

Privacy Officer / CISO
Hayya Med Pro
Email: privacy@hayyamed.pro
Phone: [CONTACT_PHONE]

We remain available to provide any further information required by the Department.

Sincerely,
[NAME], [TITLE]
Hayya Med Pro
[DATE]

---

### 3.2 EU GDPR Notification (if EU/EEA data subjects affected)

**Authority:** Relevant EU supervisory authority for the country of the affected data subjects
**Timeline:** 72 hours from awareness (same as PDPL)

Required content (GDPR Article 33(3)):
- Nature of the breach including categories and approximate number of data subjects
- Name and contact details of the data protection officer
- Likely consequences of the breach
- Measures taken or proposed

---

## 4. User Notification

**Required when:** The breach is likely to result in high risk to individuals' rights and freedoms (PDPL Article 20(2); GDPR Article 34).

Triggers:
- Authentication credentials compromised
- Medical license numbers or CME records accessed
- More than 50 users affected

### 4.1 In-app notification

Post via Supabase directly to all affected users' notification feeds:

```sql
INSERT INTO notification_queue (professional_id, type, title, body, created_at)
SELECT
  auth_id,
  'security_alert',
  'Important Security Notice',
  'We are writing to inform you of a security incident that may have affected your account. Please review your account settings and change your password.',
  NOW()
FROM professional_profiles
WHERE auth_id IN (/* list of affected professional_ids */);
```

### 4.2 Email notification template (via Postmark)

**SUBJECT:** Important Security Notice — Your Hayya Med Pro Account

Dear [FIRST_NAME],

We are writing to inform you of a security incident that occurred between [START_DATE] and [END_DATE] that may have affected your Hayya Med Pro account.

**What happened:**
[1–2 sentence factual description of the breach]

**What information was involved:**
[List specific data categories — be specific, not general]

**What we have done:**
- Immediately contained the breach by [ACTION]
- Notified the relevant data protection authority
- Enhanced our security monitoring

**What you should do:**
1. **Change your password** — go to Settings → Security → Change Password
2. **Enable two-factor authentication** if not already active — Settings → Security → Two-Factor Authentication
3. **Review your account** for any unauthorized changes to your professional profile
4. **Contact us** at privacy@hayyamed.pro if you notice anything suspicious

We sincerely apologize for this incident. Protecting your professional data is our highest priority.

If you have questions, please contact us at privacy@hayyamed.pro.

Sincerely,
[CEO NAME]
CEO, Hayya Med Pro

---

## 5. Post-Incident Review (Days 7–30)

Mandatory activities:

- [ ] Root cause analysis completed and documented
- [ ] Remediation verified by independent engineer
- [ ] All affected credentials rotated and confirmed
- [ ] External penetration test scheduled
- [ ] PDPL regulator follow-up response sent (if requested)
- [ ] Internal incident report filed (retain minimum 7 years with audit_logs)
- [ ] `docs/security/audit.md` updated with incident reference
- [ ] Affected users notified of resolution
- [ ] Insurance carrier notified (cyber liability policy — if applicable)
- [ ] Paddle notified (if payment metadata was accessed)
- [ ] Postmark notified (if email processing data was accessed)

---

## 6. Contacts & Escalation

| Contact | When | How |
|---|---|---|
| Qatar MCIT PDPL | P0, P1 within 72 hours | pdp@mcit.gov.qa |
| Paddle DPA Team | If payment records affected | dpo@paddle.com |
| Postmark DPA Team | If email metadata affected | support@postmarkapp.com |
| Anthropic (Vertex AI via GCP) | If AI call logs with PII accessed | GCP support channel |
| Supabase Support | Database or auth infrastructure breach | support@supabase.io |
| GCP Support | Infrastructure or secrets breach | GCP Console → Support |

---

## 7. Secret Rotation Checklist

When credentials are confirmed compromised or suspected compromised, rotate in this order:

1. `SUPABASE_SERVICE_ROLE_KEY` — Supabase Dashboard → Settings → API → Rotate
2. `SUPABASE_ANON_KEY` — same location
3. `NEXT_PUBLIC_SUPABASE_URL` — not a secret but verify no SSRF exposure
4. `ANTHROPIC_API_KEY` / Vertex AI credentials — GCP IAM → Service Accounts → New key
5. `POSTMARK_SERVER_TOKEN` — Postmark Dashboard → Server → API Tokens → Revoke
6. `PADDLE_WEBHOOK_SECRET` — Paddle Dashboard → Developer Tools → Webhooks → Rotate secret
7. `VAPID_PRIVATE_KEY` — Generate new VAPID pair; notify all push subscribers to re-subscribe
8. `UPSTASH_REDIS_REST_TOKEN` — Upstash Dashboard → Database → Rotate token
9. API keys (`professional_api_keys` table) — Run: `UPDATE professional_api_keys SET revoked_at = NOW();`
10. All existing user sessions — Run: Supabase Auth → Users → Bulk sign out (or Supabase Admin API)

**Update all rotated secrets in GCP Secret Manager:**
```bash
echo -n "NEW_SECRET_VALUE" | gcloud secrets versions add SECRET_NAME --data-file=-
```

Then trigger a Cloud Build deploy to pick up the new secret versions.

---

## 8. Scheduled Review

This runbook must be reviewed:
- Annually (minimum)
- After any P0 or P1 incident
- After any change to the list of personal data processed
- After any new country market entry (for local notification obligations)

Next scheduled review: **2027-06-16**

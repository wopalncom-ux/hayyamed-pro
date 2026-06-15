# Hayya Med Pro — Security Audit
_Generated: 2026-06-15 | Scope: All 29 API routes, DB schema, storage, AI layer_

---

## Executive Summary

| Category | Status | Critical Issues |
|----------|--------|-----------------|
| Authentication | ✅ Strong | None |
| Authorization / RLS | ✅ Strong | 2 employer policy gaps |
| API Route Security | ✅ Audited (Session 45) | All routes verified |
| AI PII Controls | ⚠️ Partial | provider-analyzer sends raw enrollment IDs |
| Storage Security | ✅ Strong | Missing audit table (migration 042) |
| Payment Security | ✅ HMAC verified | None |
| Audit Logging | ✅ Append-only | Missing AI cost table (migration 041) |
| Rate Limiting | ✅ Active | Upstash token rotation pending |
| Dependency Scanning | 🔴 Not automated | npm audit in CI needed |
| Secret Rotation | 🔴 Manual | Rotation schedule not set |
| VAPT | 🔴 Pre-launch | Scheduled pre-launch |

---

## OWASP Top 10 — 2021

### A01: Broken Access Control

**Status: ✅ Mitigated**

- Every API route starts with `supabase.auth.getUser()` — enforced in all 29 routes
- RLS enabled on all 36 DB tables — no exceptions
- Admin routes additionally verify role via `organization_members` table
- Employer routes check `org_member.role = 'employer_admin'`

**Gaps:**
- Employer RLS policies on `cme_activities` and `professional_profiles` missing at DB level (workaround: `createAdminClient()` — works but bypasses RLS)
- See migration 048 in schema-audit.md

### A02: Cryptographic Failures

**Status: ✅ Mitigated**

| Data | Encryption | Implementation |
|------|------------|----------------|
| Passwords | Argon2id | Supabase Auth (managed) |
| MFA recovery codes | bcrypt | Hashed before DB INSERT |
| JWT tokens | RS256 | Supabase Auth (managed) |
| HMAC webhook signatures | SHA-256 HMAC | Paddle + QPay webhooks |
| Certificate files | AES-256 at rest | GCP/Supabase Storage |
| DB at rest | AES-256 | Supabase managed |
| DB in transit | TLS 1.3 | Supabase managed |
| API in transit | TLS 1.3 | Cloud Run + HTTPS enforced |
| VAPID keys | ECDSA P-256 | Web Push standard |
| Unsubscribe tokens | HMAC-SHA256 | One-click unsubscribe |

**Gaps:**
- MFA recovery codes: individual code hashing with bcrypt is correct, but there is no rate limit on recovery code attempts (brute-forceable if attacker has DB read access)

### A03: Injection

**Status: ✅ Mitigated**

- All DB queries use Supabase client parameterised queries — no raw SQL in API routes
- AI prompts use template strings with sanitized user input (no user input interpolated directly into system prompts)
- Email content passed through Zod validation before rendering
- File names normalised before storage (no user-supplied file names used)

**Gaps:**
- AI provider-analyzer: aggregated enrollment data may include provider-supplied course titles that could influence AI output (prompt injection via course title)

### A04: Insecure Design

**Status: ✅ Strong**

- Multi-tenant: row-level isolation (RLS) — not application-level filtering
- Certificate downloads: signed URL pattern, never direct public URL
- Offline queue: re-validates server-side on flush (client data not trusted)
- Audit logs: append-only, no UPDATE/DELETE policy

### A05: Security Misconfiguration

**Status: ⚠️ Partial**

- Service role key: server-side only ✅
- CORS: Cloud Run handles; Next.js has default restrictive CORS ✅
- Error messages: production errors do not expose stack traces ✅ (Sentry captures, not user-visible)
- Environment variables: GCP Secret Manager → mounted in Cloud Run ✅

**Gaps:**
- No automated security headers audit (Content-Security-Policy, X-Frame-Options, HSTS)
- CSP for PostHog/Sentry was partially fixed (Session 51) but full CSP audit not done
- X-Content-Type-Options, X-Frame-Options, Referrer-Policy not confirmed set

### A06: Vulnerable and Outdated Components

**Status: 🔴 Manual Only**

- `npm audit` not automated in Cloud Build pipeline
- No Snyk or Dependabot configured
- Next.js 16, React 19, Supabase JS 2.x — current at time of writing

**Fix:**
```yaml
# Add to cloudbuild.yaml before build step:
- name: "node:22"
  entrypoint: "npm"
  args: ["audit", "--audit-level=high"]
```

### A07: Identification and Authentication Failures

**Status: ✅ Strong**

- Supabase Auth manages session lifecycle, token refresh, and revocation
- MFA (TOTP) enforced for sensitive admin operations (AAL2 check)
- Passkeys (WebAuthn) available as additional factor
- Rate limiting on auth endpoints: Upstash Redis middleware ✅
- Magic link tokens expire in 24 hours (Supabase default)
- No "remember me forever" — sessions expire per Supabase Auth settings

### A08: Software and Data Integrity Failures

**Status: ✅ Mitigated**

- Paddle webhooks: HMAC signature verified before processing ✅
- QPay callbacks: signature verified before processing ✅
- GCP Cloud Build: source from git repo (no external package execution)
- Zod validation on all AI responses before using structured output ✅

### A09: Security Logging and Monitoring Failures

**Status: ✅ Strong / ⚠️ Partial**

✅ Strengths:
- `audit_logs` table: append-only, 7-year retention
- All admin actions logged with actor, action, target, metadata
- All AI calls logged to `audit_logs` (action: `ai_*`)
- Sentry: real-time error alerting
- Cloud Run structured logs

⚠️ Gaps:
- No `ai_call_logs` table for AI-specific cost/token/model tracking (migration 041)
- No per-user login event log (Supabase Auth logs exist but not exported to `audit_logs`)
- No alerting on: unusual login locations, high API error rates, payment failure spikes

### A10: Server-Side Request Forgery (SSRF)

**Status: ✅ Mitigated**

No routes make server-side HTTP requests to user-supplied URLs except:
- Postmark: fixed API endpoint ✅
- QPay: `QPAY_BASE_URL` from env var (not user input) ✅
- Vertex AI: fixed GCP endpoint ✅
- Paddle: fixed API endpoint ✅

No URL fetch from user-supplied input. ✅

---

## Authentication Deep Dive

### Session Architecture

```
Browser → Supabase Auth Cookie (httpOnly, Secure, SameSite=Lax)
Mobile  → Supabase Auth Bearer Token (SecureStore / Keychain)
Admin   → Same as browser + organization_members role check
```

### Token Lifetime

| Token | Expiry | Refresh |
|-------|--------|---------|
| Access token (JWT) | 1 hour | Auto-refresh via `supabase-js` |
| Refresh token | 30 days | Rotated on each use |
| Magic link | 24 hours | One-time use |
| Signed URL (certificates) | 1 hour | Generated on demand |
| TOTP window | ±30 seconds | Standard TOTP |
| Unsubscribe token | None (permanent HMAC) | Valid forever |

### AAL2 Enforcement (MFA)

Admin routes require AAL2 (MFA verified). Pattern:

```typescript
const { data: { session } } = await supabase.auth.getSession();
if (session?.user?.aal !== "aal2") {
  return NextResponse.json({ error: "MFA required" }, { status: 403 });
}
```

Status: ✅ Applied to admin routes. Not applied to regular Pro user routes (AAL1 sufficient).

---

## Authorization Matrix

| Role | Own Data | Employer Data | Admin Data | Provider Data |
|------|----------|---------------|------------|---------------|
| `healthcare_professional` | ✅ Read/Write | ❌ | ❌ | ❌ (enroll only) |
| `employer_admin` | ✅ + | ✅ Read (approved staff) | ❌ | ❌ |
| `training_provider_admin` | ✅ + | ❌ | ❌ | ✅ Own courses |
| `master_admin` / `super_admin` | ✅ All | ✅ All | ✅ All | ✅ All |

**Implementation:** Checked via `organization_members` table + RLS policies. Admin routes use service role key after verifying role in application code.

---

## Rate Limiting

### Implementation

```
middleware.ts (Next.js) 
  → Upstash Redis (REST API)
  → checkAndLogRateLimit(identifier, limit, window)
```

### Limits by Endpoint

| Endpoint Type | Limit | Window | Enforcement |
|--------------|-------|--------|-------------|
| Auth (login/register) | 10 | 15 min | middleware.ts |
| AI routes | 5–30 | 1 hour | Per-route check |
| Webhook endpoints | 100 | 1 min | middleware.ts |
| Standard API | 200 | 1 min | middleware.ts |
| Cron (secret-gated) | N/A | — | CRON_SECRET header |

### Gap: Upstash Token Rotation

Per Session 47 memory: Upstash token needs rotation. This is an outstanding action item.

If the Upstash token is compromised, rate limiting is bypassed for all endpoints including auth. **Priority: HIGH.**

---

## Secrets Management

### Current Secrets (GCP Secret Manager)

| Secret | Rotation Policy | Last Rotated |
|--------|-----------------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Annual | Unknown |
| `PADDLE_SECRET_KEY` | When compromised | Unknown |
| `PADDLE_WEBHOOK_SECRET` | When compromised | Unknown |
| `POSTMARK_SERVER_API_TOKEN` | Annual | Unknown |
| `UPSTASH_REDIS_REST_TOKEN` | **Needs rotation NOW** | Session 47 noted as stale |
| `VAPID_PRIVATE_KEY` | Never (key pair) | Session 50 |
| `CRON_SECRET` | Annual | Unknown |
| `QPAY_PASSWORD` | Per QPay policy | Unknown |

### Secret Rotation Procedure

1. Generate new secret in vendor dashboard
2. Add new version to GCP Secret Manager
3. Update Cloud Run to use new version
4. Verify cron jobs and webhooks still work
5. Retire old secret version after 24h

**Recommendation:** Document rotation in Runbook; schedule Upstash rotation now.

---

## Certificate Security

### File Security Model

| Control | Status |
|---------|--------|
| Private bucket (no public URL) | ✅ |
| Signed URL only (1-hour) | ✅ |
| Path traversal protection | ✅ |
| File size limit (8MB) | ✅ |
| MIME type allowlist | ✅ |
| No user-supplied file names | ✅ |
| Certificate access audit log | ⚠️ Missing dedicated table (migration 042) |
| Secure deletion on account close | 🔴 Not implemented |

---

## Payment Security

### Paddle

| Control | Status |
|---------|--------|
| HMAC signature verification | ✅ Every webhook |
| No card data stored | ✅ Paddle handles PCI |
| Price ID from env (not user input) | ✅ |
| Idempotent webhook handling | ✅ (subscription_id UNIQUE check) |

### QPay

| Control | Status |
|---------|--------|
| Callback signature verification | ✅ |
| Invoice status double-check | ✅ `check_payment_status` called on callback |
| Amount verification | ✅ Invoice amount vs. expected plan price |

---

## Scalability — Security Implications

| Scale | Security Risk | Mitigation |
|-------|---------------|-----------|
| 100 users | Low — single region, known users | Current controls sufficient |
| 1,000 users | Rate limiting tested | Load test Upstash limits |
| 10,000 users | Brute force attempts increase | Auto-ban after N failed auth attempts |
| 100,000 users | DDoS surface grows | GCP Cloud Armor WAF needed |
| 1,000,000 users | Nation-state threat model | SOC 2, ISO 27001, dedicated security team |

### GCP Cloud Armor (100K+ users)

```yaml
# Cloud Armor policy: add to Cloud Run service
security_policy:
  - name: "rate-limit-global"
    action: "rate_based_ban"
    threshold: 1000 req/min per IP
  - name: "block-known-bad-IPs"
    action: "deny-403"
    source: "GCP Threat Intelligence"
```

---

## Incident Response

### Current Runbook (Minimal)

| Step | Action | Owner |
|------|--------|-------|
| 1. Detection | Sentry alert or user report | On-call |
| 2. Triage | Check audit_logs + Cloud Run logs | On-call |
| 3. Contain | Disable compromised account or rotate secret | On-call |
| 4. Notify | Notify affected users within 72h (Qatar PDPL) | Legal/CEO |
| 5. Fix | Deploy patch | Engineering |
| 6. Post-mortem | Within 7 days | All teams |

### 72-Hour Notification Requirement

Under Qatar PDPL (Law No. 13 of 2016): breach notification to QCERT/MOTC within 72 hours of discovery for personal data breaches.

**Current gap:** No formal breach notification template drafted. Required before launch.

---

## Pre-Launch Security Checklist

| Item | Status | Priority |
|------|--------|----------|
| All API routes have auth check | ✅ Complete (Session 45 audit) | — |
| RLS on all tables | ✅ Complete | — |
| Webhook signatures verified | ✅ Complete | — |
| Rate limiting live | ✅ Complete | — |
| VAPT (external pen test) | 🔴 Not done | HIGH |
| npm audit in CI | 🔴 Not configured | HIGH |
| Upstash token rotation | 🔴 Pending | HIGH |
| Security headers audit (CSP, HSTS, X-Frame) | 🟡 Partial | MEDIUM |
| Breach notification template | 🔴 Not drafted | MEDIUM |
| Secret rotation schedule | 🔴 Not established | MEDIUM |
| SOC 2 readiness audit | 🔴 Year 2 target | LOW |
| Bug bounty program | 🔴 Post-launch | LOW |

---

## Post-Launch: SOC 2 Readiness (Year 2 Target)

SOC 2 Type II requires:

| Control | Current Evidence | Gap |
|---------|-----------------|-----|
| Access Control | RLS + role checks | Document in policy |
| Audit Logging | `audit_logs` table | Need log export to SIEM |
| Encryption | TLS + at-rest | Document key management |
| Availability | 99.9% uptime SLA | Implement uptime monitoring SLA report |
| Incident Response | Informal runbook | Formalise + test quarterly |
| Vulnerability Management | Manual only | Automate (Snyk, Dependabot) |
| Change Management | Git history | Formalise PR review policy |
| Vendor Management | Informal | Document DPAs with all vendors |

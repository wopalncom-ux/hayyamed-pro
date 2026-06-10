# Hayya Med Pro — Security Standards

## Classification: Internal — Restricted

---

## Authentication Standards

| Standard | Implementation |
|---|---|
| Provider | Supabase Auth (JWT-based) |
| Session management | Supabase SSR cookie-based sessions |
| Token storage | HTTPOnly cookies — never localStorage |
| Token rotation | Automatic via Supabase refresh token |
| Password policy | Min 8 chars, enforced by Supabase |
| Email verification | Required before dashboard access |
| Password reset | Time-limited signed URL via Supabase |
| Future: MFA | TOTP (Google Authenticator compatible) — planned Q2 Year 1 |
| Future: Biometric | WebAuthn / Passkeys — planned PWA Phase 2 |
| Future: SSO | SAML 2.0 for enterprise hospital contracts |

---

## Authorization Standards

### Role-Based Access Control (RBAC)

| Role | Access |
|---|---|
| `professional` | Own profile, own CME, own documents, own employer links |
| `employer` | Own organization, linked staff compliance view (read-only) |
| `admin` | All professionals, CME verification, link requests, org management |
| `super_admin` | All admin + system configuration, user impersonation, audit logs |
| `master_admin` | Full platform access + billing, country rules, security settings |

**Rule:** Roles are stored in `organization_members.role`. No role = no elevated access. Default is `professional`.

### Row Level Security (RLS)

- RLS is **enabled on every table**. No exceptions.
- Service role key is used **only in server-side admin operations** (`createAdminClient()`).
- User-scoped client (`createClient()`) always applies RLS policies.
- Every new table must have RLS enabled before the PR is merged.

---

## API Security

| Standard | Rule |
|---|---|
| Authentication check | Every API route must call `supabase.auth.getUser()` first |
| Admin API routes | Must additionally verify role via `organization_members` |
| Rate limiting | Planned: Upstash Redis rate limiting on auth + webhook endpoints |
| Input validation | Zod schemas on all POST body inputs |
| Path traversal | Certificate API blocks `..`, `\0`, `//` in file paths |
| CORS | Restricted to `NEXT_PUBLIC_APP_URL` origin |

---

## Security Headers

All responses include:
```
X-DNS-Prefetch-Control: on
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: [full CSP — see next.config.ts]
```

---

## Audit Logging Standards

| Field | Description |
|---|---|
| `actor_auth_id` | Who performed the action (null = system) |
| `action` | Dot-notation event name (e.g. `cme.verified`, `subscription.canceled`) |
| `target_table` | Which table was affected |
| `target_id` | Which row was affected |
| `metadata` | JSON — additional context |
| `created_at` | Server timestamp |

**Rules:**
- Audit logs are **append-only** — no UPDATE or DELETE on audit_logs
- All admin actions must be logged
- All subscription changes must be logged
- All certificate access must be logged
- Audit log failures must **never crash** the main flow (fire-and-forget)
- Retention: Minimum 7 years (healthcare regulatory requirement)

---

## Data Classification

| Level | Data | Storage Rule |
|---|---|---|
| Public | Organization names, specialty lists | Supabase public read |
| Internal | Professional profiles, CME records | RLS — own data only |
| Confidential | License numbers, license expiry | RLS — encrypted at rest |
| Restricted | Service role key, API keys | GCP Secret Manager only |
| Sensitive — Medical | No medical records stored | Hayya Med Pro is compliance tracking, not EHR |

---

## Certificate Storage Security

- Bucket: `certificates` — **private** (no public access)
- Access: Signed URLs only — 1-hour expiry
- Path ownership check: `path.startsWith(user.id + "/")`
- Path traversal protection: blocks `..`, `\0`, `//`
- Max file size: 2MB
- Allowed MIME types: `application/pdf`, `image/jpeg`, `image/png`
- Admin bypass: `createAdminClient()` — logged in audit_logs

---

## Data Retention Policies

| Data | Retention |
|---|---|
| Active professional profiles | Indefinite (while account active) |
| CME activity records | 10 years minimum |
| Audit logs | 7 years minimum |
| Certificates | 10 years minimum |
| Deleted account data | 30-day grace period, then anonymized |
| Session tokens | 7 days (Supabase default) |

---

## Backup Policy

| Layer | Policy |
|---|---|
| Supabase database | Daily automated backups (Supabase managed) |
| Point-in-time recovery | 7-day PITR (Supabase Pro tier) |
| Certificate storage | Supabase Storage with replication |
| GCP Cloud Run | Stateless — no local state to back up |
| Secrets | GCP Secret Manager with versioning |

---

## Incident Response Guidelines

1. **Detection** — Monitor Cloud Logging for 4xx/5xx spikes, auth failures, unusual data access
2. **Containment** — Revoke affected tokens via Supabase admin. Rotate secrets in GCP Secret Manager.
3. **Assessment** — Review audit_logs for scope of access
4. **Notification** — Notify affected users within 72 hours (GDPR requirement)
5. **Remediation** — Patch, redeploy via Cloud Build
6. **Post-mortem** — Document within 5 business days

---

## Compliance Targets

| Standard | Status |
|---|---|
| Qatar PDPL (Personal Data Protection Law) | Design compliant — implementation review needed |
| GDPR (for EU expansion) | Architecture compliant — DPA agreements needed at scale |
| HIPAA | Not applicable (not US EHR) — reviewed and confirmed |
| SOC 2 Type II | Target Year 2 for enterprise hospital sales |
| ISO 27001 | Target Year 3 |

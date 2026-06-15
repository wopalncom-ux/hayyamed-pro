# Hayya Med Pro — Storage Architecture
_Generated: 2026-06-15_

---

## Overview

Storage spans two layers: **Supabase Storage** (object storage, files) and **PostgreSQL** (structured data, metadata). This document covers the object storage layer.

---

## Bucket Design

### Current Buckets

| Bucket | Access | Purpose | RLS Policy |
|--------|--------|---------|-----------|
| `certificates` | **Private** | CME certificate files uploaded by professionals | Owner only via signed URL |
| (future) `profile-photos` | **Public CDN** | User avatar images | Public read, owner write |
| (future) `course-materials` | **Private** | Training provider course PDFs/videos | Provider + enrolled users |
| (future) `org-logos` | **Public CDN** | Organisation / partner logos | Public read, admin write |
| (future) `verification-docs` | **Private** | Admin verification support docs | Admin only |

---

## Certificate Bucket — Detailed Architecture

### Path Structure

```
certificates/
  {auth_user_id}/                         ← Professional UUID (from auth.uid())
    {cme_activity_id}/                    ← CME activity UUID (generated before upload)
      certificate.pdf                     ← File stored with fixed name
      certificate.jpg                     ← Alternative: image file
      certificate.png
```

### Why This Structure
- Scoped by user → RLS policy can enforce `auth.uid() = path.split('/')[0]`
- Scoped by activity → One certificate per activity (enforces 1:1)
- Fixed file name → Avoids path enumeration attacks (no predictable sequential IDs)

### Access Pattern

```typescript
// Upload (server-side API route — never direct from browser)
const { data, error } = await supabase.storage
  .from("certificates")
  .upload(`${userId}/${activityId}/certificate.${ext}`, file, {
    upsert: false,  // Never overwrite
    contentType: file.type,
  });

// Download (server-side, 1-hour signed URL)
const { data } = await supabase.storage
  .from("certificates")
  .createSignedUrl(`${userId}/${activityId}/certificate.${ext}`, 3600);

// Admin access (verification queue — uses admin client)
const adminSupabase = createAdminClient();
const { data } = await adminSupabase.storage
  .from("certificates")
  .createSignedUrl(`${userId}/${activityId}/certificate.${ext}`, 3600);
```

### RLS Policy (Supabase Storage)

```sql
-- Owner can upload own certificates
CREATE POLICY "professionals upload own certificates"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificates'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Owner can read own certificates (signed URL pattern)
CREATE POLICY "professionals read own certificates"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'certificates'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- No direct DELETE — soft-delete via certificate_storage_records.is_deleted
-- Admin service role reads via createAdminClient() — bypasses RLS
```

### Security Controls

| Control | Implementation | Status |
|---------|----------------|--------|
| Private bucket | Supabase Storage: no public URL | ✅ Done |
| Signed URLs only | `createSignedUrl()` 1h expiry | ✅ Done |
| Path traversal protection | Block `..`, `\0`, `//` in route handlers | ✅ Done |
| File size limit | 8MB enforced in API route before upload | ✅ Done |
| MIME type validation | Accept: PDF, JPEG, PNG, WebP only | ✅ Done |
| File name normalisation | Fixed `certificate.{ext}` — no user-supplied names | ✅ Done |
| Admin access logging | Every admin view logs to `audit_logs` | ✅ Done |
| Certificate metadata DB record | `certificate_storage_records` table | ⚠️ MISSING (migration 042) |

---

## Missing: `certificate_storage_records` Table

Currently, `cme_activities.certificate_url` stores the raw storage path as a plain text column. This means:

1. No database audit of who accessed which certificate file
2. Cannot track file deletion status (is_deleted)
3. Cannot enforce 1-hour signed URL policy from DB (no last_signed_at column)
4. Admin cannot see which certificates have been accessed and when

**Fix: Migration 042** (see `docs/database/schema-audit.md`)

```typescript
// After migration 042, access pattern becomes:
// 1. Check certificate_storage_records for storage_path
// 2. Generate signed URL from storage_path
// 3. Log access in audit_logs

async function getCertificateSignedUrl(activityId: string, userId: string) {
  const admin = createAdminClient();

  // Step 1: Get storage path from DB record
  const { data: record } = await admin
    .from("certificate_storage_records")
    .select("storage_path, is_deleted")
    .eq("cme_activity_id", activityId)
    .single();

  if (!record || record.is_deleted) return null;

  // Step 2: Generate signed URL
  const { data: urlData } = await admin.storage
    .from("certificates")
    .createSignedUrl(record.storage_path, 3600);

  // Step 3: Log access
  await logAudit(admin, userId, "certificate_accessed", "certificate_storage_records", activityId, {
    storage_path: record.storage_path,
  });

  return urlData?.signedUrl ?? null;
}
```

---

## File Retention Policy

### Certificates
- **Retention:** Indefinite (professional may need certificate for audit purposes years later)
- **Soft delete only:** `is_deleted = true` on `certificate_storage_records` — never hard-delete
- **Physical deletion trigger:** User account deletion → Cloud Storage Lifecycle Rule deletes files after 30 days
- **Backup:** Supabase Storage is backed by GCP Cloud Storage — point-in-time recovery available

### Orphaned Files
- Files can become orphaned if upload succeeds but DB INSERT fails
- **Fix:** Cloud Scheduler cron (weekly) queries `certificate_storage_records` for records where `cme_activity_id IS NULL` and `uploaded_at < 7 days ago` → delete from storage

---

## Backup & Disaster Recovery

### Current State
- Supabase Storage (GCP backend) → automatic replication within region
- Supabase DB → daily automated backups (Supabase Pro plan)
- No cross-region backup of files currently ⚠️

### Target State (Pre-SOC 2)

| Asset | Current | Target |
|-------|---------|--------|
| DB | Daily Supabase backup | Daily + WAL continuous streaming to GCS bucket |
| Storage files | Single-region | Cross-region replication to eu-west1 |
| Secrets | GCP Secret Manager | Same (already redundant) |
| Configuration | In code (git) | Same (already versioned) |

### Disaster Recovery Targets

| Metric | Target | Current Status |
|--------|--------|----------------|
| RPO (data loss) | < 1 hour | ⚠️ Daily backup = up to 24h loss |
| RTO (restore time) | < 4 hours | Not tested |
| Backup test | Quarterly | Not scheduled |

---

## Future: Course Materials Bucket

When training providers upload course PDFs/videos:

```
course-materials/
  {provider_org_id}/
    {course_id}/
      slides.pdf
      recording.mp4
      handout.pdf
```

### Access Control
- Provider can upload to own `provider_org_id/` subtree
- Enrolled professionals can read files for courses they're enrolled in
- RLS: join `course_enrollments` → validate `professional_id = auth.uid() AND status IN ('enrolled', 'completed')`

### Size Limits by File Type

| Type | Limit | Reason |
|------|-------|--------|
| Certificate (PDF/image) | 8MB | OCR processing memory limit |
| Course slides (PDF) | 50MB | Supabase Storage default |
| Course video | 500MB | Requires chunked upload + CDN |
| Profile photo | 2MB | Avatar display only |
| Org logo | 1MB | Small display sizes |

---

## Storage Cost Estimates

### Current Usage
| Category | Estimated Volume | Cost |
|----------|----------------|------|
| Certificates | 100 users × 10 certs × 500KB avg = 500MB | ~$0.025/month |
| At 1,000 users | ~5GB | ~$0.25/month |
| At 10,000 users | ~50GB | ~$2.50/month |
| At 100,000 users | ~500GB | ~$25/month |

Storage cost is negligible vs. AI and compute costs at all scale levels. ✅

---

## CDN & Performance

### Current
- Certificate signed URLs: direct Supabase Storage (GCP us-east1)
- No CDN for private files (correct — signed URLs should not be CDN-cached)

### Future: Public Assets
- Profile photos, org logos → serve via Supabase Storage CDN (GCP Cloud CDN)
- `next/image` with Supabase CDN URL in `next.config.ts` `remotePatterns`
- Cache-Control: `public, max-age=86400` for static logos

```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};
```

---

## Path Traversal Protection

All file operation routes must sanitize paths before use:

```typescript
function sanitizeStoragePath(input: string): string | null {
  // Block null bytes, directory traversal, double slashes
  if (input.includes('\0')) return null;
  if (input.includes('..')) return null;
  if (input.includes('//')) return null;
  // Allow: alphanumeric, hyphens, underscores, slashes, dots (for extensions)
  if (!/^[\w\-/.]+$/.test(input)) return null;
  return input;
}
```

Status: ✅ Implemented in certificate upload and download routes.

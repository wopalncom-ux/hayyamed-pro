-- ════════════════════════════════════════════════════════════
-- MIGRATION 042: Certificate Storage Records
-- Audit table tracking every certificate file in Supabase Storage.
-- Enables: soft-delete, access logging, orphan cleanup,
-- and signed-URL audit trail for SOC 2 compliance.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS certificate_storage_records (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cme_activity_id uuid        REFERENCES cme_activities(id) ON DELETE SET NULL,
  storage_path    text        NOT NULL,     -- e.g. '{user_id}/{activity_id}/certificate.pdf'
  file_name       text,                     -- original filename for display
  file_size_bytes integer,
  mime_type       text,                     -- 'application/pdf' | 'image/jpeg' | 'image/png'
  uploaded_at     timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz,
  is_deleted      boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cert_storage_path ON certificate_storage_records (storage_path) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS idx_cert_storage_professional ON certificate_storage_records (professional_id);
CREATE INDEX IF NOT EXISTS idx_cert_storage_activity     ON certificate_storage_records (cme_activity_id);
CREATE INDEX IF NOT EXISTS idx_cert_storage_orphans      ON certificate_storage_records (uploaded_at) WHERE cme_activity_id IS NULL AND NOT is_deleted;

CREATE OR REPLACE FUNCTION cert_storage_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS cert_storage_updated_at ON certificate_storage_records;
CREATE TRIGGER cert_storage_updated_at
  BEFORE UPDATE ON certificate_storage_records
  FOR EACH ROW EXECUTE FUNCTION cert_storage_set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE certificate_storage_records ENABLE ROW LEVEL SECURITY;

-- Professional can read their own records (to get storage_path for signed URL)
DROP POLICY IF EXISTS "professional reads own certificate records" ON certificate_storage_records;
CREATE POLICY "professional reads own certificate records" ON certificate_storage_records
  FOR SELECT
  USING (auth.uid() = professional_id AND NOT is_deleted);

-- Professional can insert their own records
DROP POLICY IF EXISTS "professional inserts own certificate records" ON certificate_storage_records;
CREATE POLICY "professional inserts own certificate records" ON certificate_storage_records
  FOR INSERT
  WITH CHECK (auth.uid() = professional_id);

-- Soft-delete only — professional can SET is_deleted=true, not hard delete
DROP POLICY IF EXISTS "professional soft-deletes own certificate records" ON certificate_storage_records;
CREATE POLICY "professional soft-deletes own certificate records" ON certificate_storage_records
  FOR UPDATE
  USING  (auth.uid() = professional_id)
  WITH CHECK (auth.uid() = professional_id);

-- Admins read all (for verification queue)
DROP POLICY IF EXISTS "admin reads all certificate records" ON certificate_storage_records;
CREATE POLICY "admin reads all certificate records" ON certificate_storage_records
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND role IN ('master_admin', 'super_admin')
    )
  );

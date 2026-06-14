-- Migration 034: MFA recovery codes
-- Stores SHA-256-hashed one-time recovery codes for users with TOTP MFA enabled.
-- Codes are generated server-side, shown once, and deleted on use.

CREATE TABLE IF NOT EXISTS mfa_recovery_codes (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id uuid       NOT NULL,
  code_hash      text        NOT NULL,
  used_at        timestamptz,
  created_at     timestamptz DEFAULT now() NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT mfa_recovery_codes_professional_id_fkey
    FOREIGN KEY (professional_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mfa_recovery_codes_professional_id
  ON mfa_recovery_codes(professional_id);

ALTER TABLE mfa_recovery_codes ENABLE ROW LEVEL SECURITY;

-- Users can view their own codes (to count how many remain)
DROP POLICY IF EXISTS "Users read own recovery codes" ON mfa_recovery_codes;
CREATE POLICY "Users read own recovery codes" ON mfa_recovery_codes
  FOR SELECT USING (professional_id = auth.uid());

-- All writes go through server-side service role only (no user-level insert/update/delete)

-- Professional Credentials Vault
-- A single place for a healthcare professional to store and track the EXPIRY of the
-- non-CME documents GCC clinicians constantly juggle: medical license, life-support
-- certs (BLS/ACLS/PALS/NRP/ATLS), malpractice/indemnity insurance, Dataflow PSV,
-- good-standing certificate, passport/visa/QID, degrees, board certifications.
-- Distinct from cme_activities (CME credit certificates) and from `licenses`
-- (active license cycles) — this is the credential/document wallet with expiry alerts.

CREATE TABLE IF NOT EXISTS professional_credentials (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_type    text        NOT NULL DEFAULT 'other'
                     CHECK (credential_type IN (
                       'medical_license','bls','acls','pals','nrp','atls',
                       'malpractice_insurance','dataflow_psv','good_standing',
                       'passport','visa','qid','degree','board_certification','other')),
  title              text        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  issuing_authority  text,
  credential_number  text,
  issue_date         date,
  expiry_date        date,        -- NULL = does not expire
  document_url       text,        -- signed-URL path in private storage (optional)
  notes              text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prof_credentials_professional ON professional_credentials (professional_id);
CREATE INDEX IF NOT EXISTS idx_prof_credentials_expiry       ON professional_credentials (professional_id, expiry_date);

-- Trigger: keep updated_at fresh
CREATE OR REPLACE FUNCTION professional_credentials_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS professional_credentials_updated_at ON professional_credentials;
CREATE TRIGGER professional_credentials_updated_at
  BEFORE UPDATE ON professional_credentials
  FOR EACH ROW EXECUTE FUNCTION professional_credentials_set_updated_at();

-- RLS — a professional can only ever see/modify their own credentials
ALTER TABLE professional_credentials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "professional reads own credentials" ON professional_credentials;
CREATE POLICY "professional reads own credentials" ON professional_credentials
  FOR SELECT USING (professional_id = auth.uid());

DROP POLICY IF EXISTS "professional inserts own credentials" ON professional_credentials;
CREATE POLICY "professional inserts own credentials" ON professional_credentials
  FOR INSERT WITH CHECK (professional_id = auth.uid());

DROP POLICY IF EXISTS "professional updates own credentials" ON professional_credentials;
CREATE POLICY "professional updates own credentials" ON professional_credentials
  FOR UPDATE USING (professional_id = auth.uid()) WITH CHECK (professional_id = auth.uid());

DROP POLICY IF EXISTS "professional deletes own credentials" ON professional_credentials;
CREATE POLICY "professional deletes own credentials" ON professional_credentials
  FOR DELETE USING (professional_id = auth.uid());

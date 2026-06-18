-- ════════════════════════════════════════════════════════════
-- MIGRATION 072 — QIIB Payment Sessions
-- Records every payment attempt through QIIB bank gateway.
-- Covers Visa, Mastercard, and NAPS (Qatar local debit).
-- Mirrors the qpay_invoices pattern from migration 029.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS qiib_payment_sessions (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id       uuid        NOT NULL REFERENCES professional_profiles(auth_id) ON DELETE CASCADE,
  plan                  text        NOT NULL CHECK (plan IN ('pro', 'employer')),
  billing_interval      text        NOT NULL CHECK (billing_interval IN ('monthly', 'annual')),
  employer_tier         text        CHECK (employer_tier IN ('clinic', 'growth', 'department', 'hospital')),
  amount_usd            numeric(10, 2) NOT NULL,
  amount_qar            numeric(10, 2) NOT NULL,
  currency              text        NOT NULL DEFAULT 'QAR',

  -- QIIB gateway fields — populated once session is created with QIIB
  qiib_order_id         text        UNIQUE,
  qiib_session_id       text,
  payment_url           text,

  -- Payment outcome
  status                text        NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'cancelled')),
  paid_at               timestamptz,
  qiib_transaction_ref  text,
  failure_reason        text,

  -- Promo discount applied (if any)
  discount_id           uuid        REFERENCES discounts(id) ON DELETE SET NULL,

  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qiib_sessions_professional ON qiib_payment_sessions (professional_id);
CREATE INDEX IF NOT EXISTS idx_qiib_sessions_status       ON qiib_payment_sessions (status);
CREATE INDEX IF NOT EXISTS idx_qiib_sessions_order_id     ON qiib_payment_sessions (qiib_order_id) WHERE qiib_order_id IS NOT NULL;

DROP TRIGGER IF EXISTS trg_qiib_sessions_updated_at ON qiib_payment_sessions;
CREATE TRIGGER trg_qiib_sessions_updated_at
  BEFORE UPDATE ON qiib_payment_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE qiib_payment_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qiib_sessions_owner_read" ON qiib_payment_sessions;
CREATE POLICY "qiib_sessions_owner_read" ON qiib_payment_sessions
  FOR SELECT TO authenticated
  USING (professional_id = auth.uid());

DROP POLICY IF EXISTS "qiib_sessions_service_all" ON qiib_payment_sessions;
CREATE POLICY "qiib_sessions_service_all" ON qiib_payment_sessions
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "qiib_sessions_admin_read" ON qiib_payment_sessions;
CREATE POLICY "qiib_sessions_admin_read" ON qiib_payment_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('master_admin', 'super_admin')
    )
  );

-- Migration 029: QPay Qatar local payment invoices
-- Tracks QPay invoice lifecycle: pending → paid → (refunded)

CREATE TABLE IF NOT EXISTS qpay_invoices (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id        text NOT NULL UNIQUE,
  invoice_number    text NOT NULL UNIQUE,
  professional_id   uuid NOT NULL REFERENCES professional_profiles(auth_id) ON DELETE CASCADE,
  plan              text NOT NULL CHECK (plan IN ('pro', 'employer')),
  billing_interval  text NOT NULL CHECK (billing_interval IN ('monthly', 'annual')),
  amount_qar        numeric(10, 2) NOT NULL,
  status            text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'cancelled')),
  qr_text           text,
  short_url         text,
  payment_id        text,
  paid_at           timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Add QPay fields to subscriptions if not present
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS payment_provider text DEFAULT 'paddle',
  ADD COLUMN IF NOT EXISTS qpay_invoice_id text;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_qpay_invoices_professional_id ON qpay_invoices(professional_id);
CREATE INDEX IF NOT EXISTS idx_qpay_invoices_status ON qpay_invoices(status);
CREATE INDEX IF NOT EXISTS idx_qpay_invoices_invoice_id ON qpay_invoices(invoice_id);

-- Updated_at trigger
DROP TRIGGER IF EXISTS trg_qpay_invoices_updated_at ON qpay_invoices;
CREATE TRIGGER trg_qpay_invoices_updated_at
  BEFORE UPDATE ON qpay_invoices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE qpay_invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qpay_invoices_owner_read" ON qpay_invoices;
CREATE POLICY "qpay_invoices_owner_read" ON qpay_invoices
  FOR SELECT TO authenticated
  USING (professional_id = auth.uid());

DROP POLICY IF EXISTS "qpay_invoices_admin_all" ON qpay_invoices;
CREATE POLICY "qpay_invoices_admin_all" ON qpay_invoices
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

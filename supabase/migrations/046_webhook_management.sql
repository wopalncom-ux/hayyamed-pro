-- ════════════════════════════════════════════════════════════
-- MIGRATION 046: Webhook Management (Enterprise)
-- Outbound webhook system for hospital/government HRIS integrations.
-- Organisations register endpoints to receive real-time events:
-- staff compliance changes, license expiries, course completions.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  url             text        NOT NULL,
  secret          text        NOT NULL,    -- HMAC-SHA256 signing key (stored hashed)
  events          text[]      NOT NULL,    -- ['staff.compliance_changed', 'license.expiring', 'course.completed']
  description     text,
  is_active       boolean     NOT NULL DEFAULT true,
  created_by      uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_org ON webhook_endpoints (organization_id) WHERE is_active = true;

CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id     uuid        NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  event_type      text        NOT NULL,
  payload         jsonb       NOT NULL,
  status          text        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'delivered', 'failed')),
  response_status integer,
  response_body   text,
  attempts        integer     NOT NULL DEFAULT 0,
  delivered_at    timestamptz,
  next_retry_at   timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_endpoint    ON webhook_deliveries (endpoint_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_pending     ON webhook_deliveries (next_retry_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_event_type  ON webhook_deliveries (event_type);

CREATE OR REPLACE FUNCTION webhook_endpoints_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS webhook_endpoints_updated_at ON webhook_endpoints;
CREATE TRIGGER webhook_endpoints_updated_at
  BEFORE UPDATE ON webhook_endpoints
  FOR EACH ROW EXECUTE FUNCTION webhook_endpoints_set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- Employer admins manage their own org's webhooks
DROP POLICY IF EXISTS "employer admin manages org webhooks" ON webhook_endpoints;
CREATE POLICY "employer admin manages org webhooks" ON webhook_endpoints
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE organization_id = webhook_endpoints.organization_id
         AND auth_id = auth.uid()
         AND role = 'employer_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE organization_id = webhook_endpoints.organization_id
         AND auth_id = auth.uid()
         AND role = 'employer_admin'
    )
  );

-- Admins read all
DROP POLICY IF EXISTS "admin reads all webhooks" ON webhook_endpoints;
CREATE POLICY "admin reads all webhooks" ON webhook_endpoints
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND role IN ('master_admin', 'super_admin')
    )
  );

-- Webhook deliveries: employer admins read their org's deliveries
DROP POLICY IF EXISTS "employer admin reads own deliveries" ON webhook_deliveries;
CREATE POLICY "employer admin reads own deliveries" ON webhook_deliveries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
        FROM webhook_endpoints we
        JOIN organization_members om ON om.organization_id = we.organization_id
       WHERE we.id = webhook_deliveries.endpoint_id
         AND om.auth_id = auth.uid()
         AND om.role = 'employer_admin'
    )
  );

-- Admins read all deliveries
DROP POLICY IF EXISTS "admin reads all deliveries" ON webhook_deliveries;
CREATE POLICY "admin reads all deliveries" ON webhook_deliveries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
       WHERE auth_id = auth.uid()
         AND role IN ('master_admin', 'super_admin')
    )
  );

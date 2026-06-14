-- Migration 032: Demo requests
-- Stores enterprise demo leads submitted via /request-demo.
-- DB is source of truth; admin notification email is fire-and-forget on top.
-- Admin reads via service role key only (no public select).
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS demo_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  email        text NOT NULL,
  job_title    text NOT NULL,
  org_name     text NOT NULL,
  org_type     text NOT NULL,
  staff_count  text NOT NULL,
  country      text NOT NULL,
  message      text,
  status       text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed_won', 'closed_lost')),
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "demo_requests_insert_anon" ON demo_requests;
CREATE POLICY "demo_requests_insert_anon"
  ON demo_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "demo_requests_select_none" ON demo_requests;
CREATE POLICY "demo_requests_select_none"
  ON demo_requests FOR SELECT
  USING (false);

CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON demo_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status     ON demo_requests (status);
CREATE INDEX IF NOT EXISTS idx_demo_requests_country    ON demo_requests (country);

-- Migration 076: Performance Snapshots
-- Stores Lighthouse / PageSpeed Insights results over time for tracked pages

CREATE TABLE IF NOT EXISTS performance_snapshots (
  id                   uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url             text NOT NULL,
  page_label           text,
  strategy             text NOT NULL DEFAULT 'desktop',  -- 'desktop' | 'mobile'
  performance_score    integer,   -- 0-100
  accessibility_score  integer,   -- 0-100
  seo_score            integer,   -- 0-100
  best_practices_score integer,   -- 0-100
  lcp_ms               integer,   -- Largest Contentful Paint (ms)
  cls_score            numeric(6,4), -- Cumulative Layout Shift
  fid_ms               integer,   -- First Input Delay / INP (ms)
  ttfb_ms              integer,   -- Time to First Byte (ms)
  fcp_ms               integer,   -- First Contentful Paint (ms)
  si_ms                integer,   -- Speed Index (ms)
  tbt_ms               integer,   -- Total Blocking Time (ms)
  raw_data             jsonb,
  run_by               uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at           timestamptz DEFAULT now()
);

ALTER TABLE performance_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage performance_snapshots" ON performance_snapshots;
CREATE POLICY "Admins manage performance_snapshots" ON performance_snapshots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.auth_id = auth.uid()
        AND om.role IN ('master_admin', 'super_admin')
    )
  );

CREATE INDEX IF NOT EXISTS idx_perf_snapshots_url     ON performance_snapshots (page_url, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_perf_snapshots_created ON performance_snapshots (created_at DESC);

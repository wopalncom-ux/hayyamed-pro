-- ════════════════════════════════════════════════════════════
-- MIGRATION 041: AI Call Logs
-- Tracks every AI API call: model, tokens, cost, latency.
-- Append-only (no UPDATE/DELETE) — required for cost auditing
-- and per-user AI token budget enforcement.
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ai_call_logs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action          text        NOT NULL,   -- 'gap_analysis' | 'compliance_chat' | 'ocr' | 'renewal_prediction' | etc.
  model           text        NOT NULL,   -- 'claude-haiku-4-5' | 'claude-sonnet-4-6' | 'claude-opus-4-8'
  input_tokens    integer,
  output_tokens   integer,
  latency_ms      integer,
  cost_usd        numeric(10, 6),
  prompt_version  text,
  success         boolean     NOT NULL DEFAULT true,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_call_logs_professional ON ai_call_logs (professional_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_call_logs_action       ON ai_call_logs (action);
CREATE INDEX IF NOT EXISTS idx_ai_call_logs_created_at   ON ai_call_logs (created_at DESC);

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE ai_call_logs ENABLE ROW LEVEL SECURITY;

-- No SELECT/UPDATE/DELETE for any user — append-only cost log
-- All reads go through service role (admin routes only)
DROP POLICY IF EXISTS "no direct access to ai_call_logs" ON ai_call_logs;
CREATE POLICY "no direct access to ai_call_logs" ON ai_call_logs
  FOR ALL
  USING (false);

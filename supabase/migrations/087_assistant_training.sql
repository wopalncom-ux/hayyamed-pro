-- 087 — Assistant training: admin-added knowledge (documents, websites, Q&A) + always-on rules
-- Extends the existing RAG knowledge_chunks table with owner-authored source types,
-- and adds a separate assistant_rules table for constraints that are always injected
-- into the compliance-chat system prompt (not retrieved via similarity search).

-- Widen the source_type check to include owner-authored content
ALTER TABLE knowledge_chunks DROP CONSTRAINT IF EXISTS knowledge_chunks_source_type_check;
ALTER TABLE knowledge_chunks ADD CONSTRAINT knowledge_chunks_source_type_check
  CHECK (source_type IN ('compliance_rule','category_cap','authority_faq','platform_help','admin_document','admin_website','admin_qa'));

CREATE TABLE IF NOT EXISTS assistant_rules (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_text   text        NOT NULL,
  active      boolean     NOT NULL DEFAULT true,
  created_by  uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE assistant_rules ENABLE ROW LEVEL SECURITY;

-- No public/authenticated read policy — rules are only read server-side via
-- createAdminClient() when building the compliance-chat system prompt, and
-- only managed via the master_admin-gated /api/owner/knowledge/* routes.

CREATE OR REPLACE FUNCTION assistant_rules_set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_assistant_rules_updated_at ON assistant_rules;
CREATE TRIGGER trg_assistant_rules_updated_at
  BEFORE UPDATE ON assistant_rules
  FOR EACH ROW EXECUTE FUNCTION assistant_rules_set_updated_at();

CREATE INDEX IF NOT EXISTS idx_assistant_rules_active ON assistant_rules (active);

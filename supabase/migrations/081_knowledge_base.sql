-- 081 — RAG knowledge base for AI compliance chatbot
-- Stores chunked compliance rules, authority guidelines, and FAQ pairs
-- as pgvector embeddings (768-dim, Vertex AI text-embedding-004)

-- Enable pgvector if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type   text NOT NULL CHECK (source_type IN ('compliance_rule','category_cap','authority_faq','platform_help')),
  source_id     text,
  country_code  text,
  profession    text,
  title         text NOT NULL,
  content       text NOT NULL,
  embedding     vector(768),
  metadata      jsonb DEFAULT '{}',
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Cosine similarity index (IVFFlat — fast approximate nearest neighbour)
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
  ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

CREATE INDEX IF NOT EXISTS knowledge_chunks_country_idx ON knowledge_chunks (country_code);
CREATE INDEX IF NOT EXISTS knowledge_chunks_source_idx  ON knowledge_chunks (source_type);

-- RLS: readable by all authenticated users; writable only by service role
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "knowledge_chunks_select" ON knowledge_chunks;
CREATE POLICY "knowledge_chunks_select"
  ON knowledge_chunks FOR SELECT
  TO authenticated
  USING (true);

-- pgvector similarity search function — returns top-k chunks by cosine similarity
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
  query_embedding vector(768),
  match_count     int DEFAULT 4,
  filter_country  text DEFAULT NULL,
  similarity_threshold float DEFAULT 0.6
)
RETURNS TABLE (
  id           uuid,
  title        text,
  content      text,
  source_type  text,
  country_code text,
  similarity   float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    kc.id,
    kc.title,
    kc.content,
    kc.source_type,
    kc.country_code,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM knowledge_chunks kc
  WHERE
    kc.embedding IS NOT NULL
    AND (filter_country IS NULL OR kc.country_code = filter_country OR kc.country_code IS NULL)
    AND 1 - (kc.embedding <=> query_embedding) >= similarity_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
$$;

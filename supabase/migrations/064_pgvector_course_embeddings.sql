-- ════════════════════════════════════════════════════════════
-- MIGRATION 064 — pgvector semantic course search
-- ════════════════════════════════════════════════════════════

-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Embedding column on courses (text-embedding-004 → 768 dims)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS embedding vector(768);

-- IVFFlat index for fast approximate cosine similarity search
-- lists=50 is appropriate for < 100K courses; increase to 100+ at scale
CREATE INDEX IF NOT EXISTS idx_courses_embedding
  ON courses USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 50);

-- RPC for semantic course search — runs as SECURITY DEFINER so RLS
-- on courses still applies (status = 'active' filter handles visibility)
CREATE OR REPLACE FUNCTION public.semantic_course_search(
  query_embedding vector(768),
  match_count     int     DEFAULT 6,
  country_filter  text    DEFAULT NULL
)
RETURNS TABLE (
  id          uuid,
  title       text,
  category    text,
  credits     numeric,
  is_free     boolean,
  price_usd   numeric,
  provider_id uuid,
  similarity  float
)
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    c.id,
    c.title,
    c.category,
    c.credits,
    c.is_free,
    c.price_usd,
    c.provider_id,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM courses c
  WHERE c.status = 'active'
    AND c.embedding IS NOT NULL
    AND (country_filter IS NULL OR country_filter = ANY(c.country_codes))
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;

REVOKE ALL ON FUNCTION public.semantic_course_search(vector, int, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.semantic_course_search(vector, int, text) TO authenticated, service_role;

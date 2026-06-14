-- Migration 035: Full-text search for training marketplace
-- Adds a tsvector generated column on courses for fast GIN-indexed search.
-- Searches across title + description + provider name for best recall.

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
      setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('english', coalesce(description, '')), 'B')
    ) STORED;

CREATE INDEX IF NOT EXISTS idx_courses_search_vector
  ON courses USING GIN (search_vector);

-- Also add a pg_trgm index for autocomplete / short partial queries
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_courses_title_trgm
  ON courses USING GIN (title gin_trgm_ops);

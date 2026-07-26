-- ════════════════════════════════════════════════════════════
-- MIGRATION 089: Move vector/pg_trgm extensions out of public
-- Addresses the `extension_in_public` WARN findings from
-- `supabase db advisors --type security` (2026-07-26) — the last
-- two of the original 49 findings left unfixed by 088.
--
-- ALTER EXTENSION ... SET SCHEMA relocates the extension's types,
-- functions, and operators by OID — existing columns (courses.embedding,
-- knowledge_chunks.embedding), the ivfflat/GIN indexes built on them, and
-- the two RPC functions' parameter signatures all reference these by OID,
-- not by schema-qualified name, so none of that is broken by the move.
-- The only thing that *does* need updating is runtime name resolution:
-- the two SECURITY DEFINER-adjacent RPC functions pin `search_path` (per
-- 088's hardening), so `extensions` must be added there for the `<=>`
-- operator and opclasses to still resolve when they execute.
-- ════════════════════════════════════════════════════════════

CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

ALTER EXTENSION vector SET SCHEMA extensions;
ALTER EXTENSION pg_trgm SET SCHEMA extensions;

-- Once vector lives in `extensions`, the ALTER FUNCTION statements below
-- must schema-qualify it in the signature used to identify the function
-- (name resolution happens against the search_path active during this
-- migration, which is just the default until these statements run) —
-- this does not change the functions' actual parameter types.
ALTER FUNCTION public.semantic_course_search(extensions.vector, integer, text)
  SET search_path = public, extensions, pg_temp;

ALTER FUNCTION public.match_knowledge_chunks(extensions.vector, integer, text, double precision)
  SET search_path = public, extensions, pg_temp;

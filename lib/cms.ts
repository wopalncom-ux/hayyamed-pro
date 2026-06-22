import { createAdminClient } from "@/lib/supabase/server";

type ContentCache = Map<string, string | null>;
let _cache: ContentCache | null = null;
let _cacheTime = 0;
const CACHE_TTL = 60_000; // 60 seconds

async function loadAll(): Promise<ContentCache> {
  const now = Date.now();
  if (_cache && now - _cacheTime < CACHE_TTL) return _cache;

  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("platform_content")
      .select("page_key, section_key, field_key, content_value");

    const map: ContentCache = new Map();
    for (const row of data ?? []) {
      map.set(`${row.page_key}.${row.section_key}.${row.field_key}`, row.content_value);
    }
    _cache = map;
    _cacheTime = now;
    return map;
  } catch {
    return _cache ?? new Map();
  }
}

/**
 * Get a CMS content value. Falls back to `defaultValue` if not in DB.
 * Usage: await getContent("landing", "hero", "headline", "Default headline")
 */
export async function getContent(
  pageKey: string,
  sectionKey: string,
  fieldKey: string,
  defaultValue = ""
): Promise<string> {
  const cache = await loadAll();
  const key = `${pageKey}.${sectionKey}.${fieldKey}`;
  const value = cache.get(key);
  return value ?? defaultValue;
}

/**
 * Get all content for a page as a nested object.
 * Returns { section: { field: value } }
 */
export async function getPageContent(pageKey: string): Promise<Record<string, Record<string, string>>> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("platform_content")
    .select("section_key, field_key, content_value")
    .eq("page_key", pageKey);

  const result: Record<string, Record<string, string>> = {};
  for (const row of data ?? []) {
    result[row.section_key] ??= {};
    result[row.section_key][row.field_key] = row.content_value ?? "";
  }
  return result;
}

/**
 * Get SEO settings for a page. Returns null if not found.
 */
export async function getPageSeo(pageKey: string) {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("page_seo_settings")
      .select("*")
      .eq("page_key", pageKey)
      .maybeSingle();
    return data ?? null;
  } catch {
    return null;
  }
}

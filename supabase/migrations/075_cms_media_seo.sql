-- Migration 075: CMS Content, Page SEO Settings, Media Library
-- Master Admin Panel Phase 1 — Content, Media & SEO

-- ─────────────────────────────────────────────
-- 1. Platform Content (CMS)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS platform_content (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key     text NOT NULL,   -- 'landing', 'about', 'pricing', 'global', etc.
  section_key  text NOT NULL,   -- 'hero', 'features', 'cta', 'footer', etc.
  field_key    text NOT NULL,   -- 'headline', 'subtext', 'button_text', etc.
  content_type text NOT NULL DEFAULT 'text',  -- 'text' | 'html' | 'image_url' | 'url'
  content_value text,
  notes        text,            -- internal admin note about this field
  updated_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now(),
  UNIQUE (page_key, section_key, field_key)
);

ALTER TABLE platform_content ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write content
DROP POLICY IF EXISTS "Admins manage content" ON platform_content;
CREATE POLICY "Admins manage content" ON platform_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.auth_id = auth.uid()
        AND om.role IN ('master_admin', 'super_admin')
    )
  );

-- Public read for resolved content (web pages pull content)
DROP POLICY IF EXISTS "Public can read content" ON platform_content;
CREATE POLICY "Public can read content" ON platform_content
  FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_platform_content_page ON platform_content (page_key, section_key);

-- ─────────────────────────────────────────────
-- 2. Page SEO Settings
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_seo_settings (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key          text NOT NULL UNIQUE,  -- 'landing', 'about', 'pricing', etc.
  page_label        text,                  -- human-readable label
  meta_title        text,
  meta_description  text,
  og_title          text,
  og_description    text,
  og_image_url      text,
  canonical_url     text,
  robots_directive  text DEFAULT 'index, follow',
  keywords          text[],
  json_ld           jsonb,
  updated_by        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

ALTER TABLE page_seo_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage seo" ON page_seo_settings;
CREATE POLICY "Admins manage seo" ON page_seo_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.auth_id = auth.uid()
        AND om.role IN ('master_admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Public can read seo" ON page_seo_settings;
CREATE POLICY "Public can read seo" ON page_seo_settings
  FOR SELECT USING (true);

-- ─────────────────────────────────────────────
-- 3. Media Library Metadata
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_library (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name    text NOT NULL,
  file_path    text NOT NULL UNIQUE,   -- path in Supabase Storage bucket
  bucket_name  text NOT NULL DEFAULT 'media-library',
  public_url   text,
  mime_type    text,
  file_size    bigint,
  alt_text     text,
  category     text DEFAULT 'general',  -- 'team', 'logos', 'banners', 'courses', 'general'
  tags         text[],
  uploaded_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage media" ON media_library;
CREATE POLICY "Admins manage media" ON media_library
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.auth_id = auth.uid()
        AND om.role IN ('master_admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Public can read media" ON media_library;
CREATE POLICY "Public can read media" ON media_library
  FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_media_library_category ON media_library (category);

-- ─────────────────────────────────────────────
-- 4. Seed: Default SEO pages
-- ─────────────────────────────────────────────
INSERT INTO page_seo_settings (page_key, page_label, meta_title, meta_description, robots_directive)
VALUES
  ('landing',     'Landing Page (Home)',
   'Hayya Med Pro — CME Tracking & License Compliance for GCC Healthcare Professionals',
   'Track CME credits, manage license renewals, and stay compliant with QCHP, SCFHS, DHA, and all GCC licensing authorities — free, on web and mobile.',
   'index, follow'),
  ('about',       'About Page',
   'About Hayya Med Pro — Built for GCC Healthcare Professionals',
   'Learn about Hayya Med Pro, the platform built to simplify CME tracking and license compliance for healthcare professionals across the GCC.',
   'index, follow'),
  ('pricing',     'Pricing Page',
   'Hayya Med Pro Pricing — Free, Pro & Employer Plans',
   'Choose the plan that fits your needs. Free for individuals, Pro for advanced features, Employer for team compliance management.',
   'index, follow'),
  ('specialties', 'Specialties Directory',
   'Medical Specialty CME Requirements — GCC & Global',
   'Browse CME and CPD requirements by medical specialty. Cardiology, Surgery, Psychiatry, Emergency Medicine and 40+ specialties covered.',
   'index, follow'),
  ('contact',     'Contact Page',
   'Contact Hayya Med Pro — GCC Healthcare Compliance Platform',
   'Get in touch with the Hayya Med Pro team. We support healthcare professionals and employer accounts across Qatar, Saudi Arabia, UAE and the GCC.',
   'index, follow'),
  ('help',        'Help & Support',
   'Help Center — Hayya Med Pro',
   'Find answers to common questions about CME tracking, license renewal, and using Hayya Med Pro.',
   'index, follow'),
  ('login',       'Login Page',
   'Sign In — Hayya Med Pro',
   'Sign in to your Hayya Med Pro account to manage your CME credits and license compliance.',
   'noindex, nofollow'),
  ('register',    'Register Page',
   'Create Account — Hayya Med Pro',
   'Join thousands of GCC healthcare professionals tracking CME credits and license compliance with Hayya Med Pro.',
   'index, follow')
ON CONFLICT (page_key) DO NOTHING;

-- ─────────────────────────────────────────────
-- 5. Seed: Default CMS content fields
-- ─────────────────────────────────────────────
INSERT INTO platform_content (page_key, section_key, field_key, content_type, content_value, notes)
VALUES
  -- Landing hero
  ('landing', 'hero', 'headline',       'text', 'Track CME. Stay Compliant. Renew with Confidence.', 'Main hero headline'),
  ('landing', 'hero', 'subtext',        'text', 'The GCC''s first intelligent CME tracking and license compliance platform — built for Qatar, Saudi Arabia, UAE, and beyond.', 'Hero subheadline'),
  ('landing', 'hero', 'cta_primary',    'text', 'Start Tracking Free', 'Primary CTA button'),
  ('landing', 'hero', 'cta_secondary',  'text', 'See How It Works', 'Secondary CTA button'),

  -- Landing stats
  ('landing', 'stats', 'professionals', 'text', '10,000+', 'Stat: number of professionals'),
  ('landing', 'stats', 'countries',     'text', '7+',      'Stat: number of countries'),
  ('landing', 'stats', 'credits',       'text', '500K+',   'Stat: CME credits tracked'),

  -- Landing CTA section
  ('landing', 'cta_section', 'headline', 'text', 'Start tracking your CME today — it''s free.', 'Bottom CTA headline'),
  ('landing', 'cta_section', 'subtext',  'text', 'Join thousands of GCC healthcare professionals who never miss a renewal deadline.', 'Bottom CTA subtext'),
  ('landing', 'cta_section', 'button',   'text', 'Get Started Free', 'Bottom CTA button text'),

  -- About page
  ('about', 'hero', 'headline', 'text', 'Built for GCC Healthcare Professionals', 'About page hero headline'),
  ('about', 'hero', 'subtext',  'text', 'Hayya Med Pro was founded to eliminate the complexity of CME tracking and license renewal across the GCC.', 'About page hero subtext'),

  -- Global / Company info
  ('global', 'contact', 'phone',      'text', '+974 3367 7333',              'Company phone number'),
  ('global', 'contact', 'email',      'text', 'hello@hayyamed.pro',          'Company email'),
  ('global', 'contact', 'whatsapp',   'text', '+97433677333',                'WhatsApp number (no spaces)'),
  ('global', 'contact', 'address',    'text', 'Doha, Qatar',                 'Company address'),
  ('global', 'social',  'linkedin',   'url',  'https://linkedin.com/company/hayyamed', 'LinkedIn URL'),
  ('global', 'social',  'twitter',    'url',  '',                             'Twitter/X URL'),
  ('global', 'footer',  'tagline',    'text', 'CME tracking for the GCC.', 'Footer tagline'),
  ('global', 'footer',  'copyright',  'text', '© 2025 Hayya Med AI. All rights reserved.', 'Footer copyright text'),

  -- Pricing page
  ('pricing', 'hero', 'headline', 'text', 'Simple, Transparent Pricing', 'Pricing page headline'),
  ('pricing', 'hero', 'subtext',  'text', 'Free forever for individuals. Upgrade when you need more.', 'Pricing page subtext')

ON CONFLICT (page_key, section_key, field_key) DO NOTHING;

-- updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS platform_content_updated_at ON platform_content;
CREATE TRIGGER platform_content_updated_at
  BEFORE UPDATE ON platform_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS page_seo_settings_updated_at ON page_seo_settings;
CREATE TRIGGER page_seo_settings_updated_at
  BEFORE UPDATE ON page_seo_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS media_library_updated_at ON media_library;
CREATE TRIGGER media_library_updated_at
  BEFORE UPDATE ON media_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

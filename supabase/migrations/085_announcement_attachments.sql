-- ════════════════════════════════════════════════════════════════════════════
-- MIGRATION 085: File attachments for authority announcements
--
-- Lets a regulatory authority attach an official document (PDF circular/notice,
-- or image) to a jurisdiction announcement. Stored in a public bucket because
-- announcements are broadcast to every user in the jurisdiction.
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.authority_announcements
  ADD COLUMN IF NOT EXISTS attachment_url  text,
  ADD COLUMN IF NOT EXISTS attachment_name text;

-- Public bucket for announcement attachments. Uploads are performed server-side
-- with the service role (bypasses storage RLS); public read lets jurisdiction
-- users open the circular via its public URL.
INSERT INTO storage.buckets (id, name, public)
VALUES ('announcement-files', 'announcement-files', true)
ON CONFLICT (id) DO NOTHING;

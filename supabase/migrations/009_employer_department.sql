-- Add department field to employer_link_requests so employer admins can group staff
ALTER TABLE employer_link_requests ADD COLUMN IF NOT EXISTS department text;

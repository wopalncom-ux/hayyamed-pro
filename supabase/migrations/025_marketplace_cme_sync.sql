-- Marketplace → CME Auto-sync
-- Tracks which CME activity was auto-created when a marketplace course is completed.

alter table course_enrollments
  add column if not exists cme_activity_id uuid references cme_activities (id) on delete set null;

create index if not exists idx_course_enrollments_cme_activity
  on course_enrollments (cme_activity_id);

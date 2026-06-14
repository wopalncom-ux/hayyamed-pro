-- Migration 031: Waitlist signups
-- Captures pre-launch email leads from the coming-soon page.
-- Table is insert-only for anon users; admin reads via service role.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists waitlist_signups (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  profession      text,
  country         text,
  source          text default 'coming_soon',
  created_at      timestamptz not null default now(),
  notified        boolean not null default false,
  constraint waitlist_email_unique unique (email)
);

alter table waitlist_signups enable row level security;

-- Anon users can insert (for the coming-soon form)
drop policy if exists "waitlist_insert_anon" on waitlist_signups;
create policy "waitlist_insert_anon"
  on waitlist_signups for insert
  to anon, authenticated
  with check (true);

-- No row-level select for non-admins — admin reads via service role key
drop policy if exists "waitlist_select_none" on waitlist_signups;
create policy "waitlist_select_none"
  on waitlist_signups for select
  using (false);

-- Indexes
create index if not exists idx_waitlist_created_at on waitlist_signups (created_at desc);
create index if not exists idx_waitlist_notified   on waitlist_signups (notified) where notified = false;

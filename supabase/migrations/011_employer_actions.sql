-- 011_employer_actions.sql
-- Employer task assignment and staff notifications

create table if not exists employer_tasks (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  assigned_to     uuid not null references auth.users(id) on delete cascade,
  assigned_by     uuid references auth.users(id) on delete set null,
  title           text not null,
  message         text,
  category        text,
  credits_target  int,
  due_date        date,
  status          text not null default 'pending'
                  check (status in ('pending', 'acknowledged', 'completed')),
  acknowledged_at timestamptz,
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_employer_tasks_org         on employer_tasks(organization_id);
create index if not exists idx_employer_tasks_assigned_to on employer_tasks(assigned_to);
create index if not exists idx_employer_tasks_status      on employer_tasks(status);

create table if not exists employer_notifications (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  recipient_id    uuid not null references auth.users(id) on delete cascade,
  sender_id       uuid references auth.users(id) on delete set null,
  type            text not null
                  check (type in ('compliance_reminder', 'task_assigned', 'general')),
  subject         text not null,
  message         text not null,
  sent_via_email  boolean not null default false,
  read_at         timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_employer_notifications_recipient on employer_notifications(recipient_id);
create index if not exists idx_employer_notifications_org       on employer_notifications(organization_id);

alter table employer_tasks         enable row level security;
alter table employer_notifications enable row level security;

-- ── employer_tasks policies ────────────────────────────────────────────────

drop policy if exists "employer_manage_tasks"  on employer_tasks;
drop policy if exists "staff_view_own_tasks"   on employer_tasks;
drop policy if exists "staff_update_own_tasks" on employer_tasks;
drop policy if exists "admin_all_tasks"        on employer_tasks;

create policy "employer_manage_tasks" on employer_tasks for all
  using (
    organization_id in (
      select organization_id from organization_members
      where auth_id = auth.uid() and role = 'employer_admin'
    )
  );

create policy "staff_view_own_tasks" on employer_tasks for select
  using (auth.uid() = assigned_to);

create policy "staff_update_own_tasks" on employer_tasks for update
  using (auth.uid() = assigned_to)
  with check (auth.uid() = assigned_to);

create policy "admin_all_tasks" on employer_tasks for all
  using (
    exists (
      select 1 from organization_members
      where auth_id = auth.uid() and role in ('master_admin', 'super_admin')
    )
  );

-- ── employer_notifications policies ───────────────────────────────────────

drop policy if exists "employer_manage_notifications"    on employer_notifications;
drop policy if exists "staff_view_own_notifications"     on employer_notifications;
drop policy if exists "staff_update_own_notifications"   on employer_notifications;
drop policy if exists "admin_all_notifications"          on employer_notifications;

create policy "employer_manage_notifications" on employer_notifications for all
  using (
    organization_id in (
      select organization_id from organization_members
      where auth_id = auth.uid() and role = 'employer_admin'
    )
  );

create policy "staff_view_own_notifications" on employer_notifications for select
  using (auth.uid() = recipient_id);

create policy "staff_update_own_notifications" on employer_notifications for update
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);

create policy "admin_all_notifications" on employer_notifications for all
  using (
    exists (
      select 1 from organization_members
      where auth_id = auth.uid() and role in ('master_admin', 'super_admin')
    )
  );

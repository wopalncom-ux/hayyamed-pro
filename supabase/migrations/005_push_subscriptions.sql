-- Push notification subscriptions
create table if not exists push_subscriptions (
  id              uuid        primary key default gen_random_uuid(),
  professional_id uuid        not null references auth.users (id) on delete cascade,
  endpoint        text        not null,
  p256dh          text        not null,
  auth            text        not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint push_subscriptions_unique unique (professional_id, endpoint)
);

create index idx_push_subscriptions_professional on push_subscriptions (professional_id);

alter table push_subscriptions enable row level security;

create policy "push_own_read" on push_subscriptions
  for select using (auth.uid() = professional_id);

create policy "push_own_insert" on push_subscriptions
  for insert with check (auth.uid() = professional_id);

create policy "push_own_delete" on push_subscriptions
  for delete using (auth.uid() = professional_id);

create trigger set_push_subscriptions_updated_at
  before update on push_subscriptions
  for each row execute procedure set_updated_at();

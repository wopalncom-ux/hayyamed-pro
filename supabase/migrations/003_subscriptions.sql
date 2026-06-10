-- Migration: Subscriptions (Paddle)
-- Tracks Paddle subscription state per professional.
-- Source of truth for feature gating (Pro/Employer features).

create table if not exists subscriptions (
  id                       uuid        primary key default gen_random_uuid(),
  professional_id          uuid        not null unique references professional_profiles (auth_id) on delete cascade,
  paddle_customer_id       text        unique,
  paddle_subscription_id   text        unique,
  plan                     text        not null default 'free',
  status                   text        not null default 'active',
  current_period_end       timestamptz,
  cancel_at_period_end     boolean     not null default false,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),

  constraint plan_values   check (plan   in ('free', 'pro', 'employer')),
  constraint status_values check (status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete'))
);

alter table subscriptions enable row level security;

create policy "subscriptions_own_read"
  on subscriptions for select
  using (professional_id = auth.uid());

create trigger set_subscriptions_updated_at
  before update on subscriptions
  for each row execute procedure set_updated_at();

create or replace function handle_new_subscription()
returns trigger language plpgsql security definer as $$
begin
  insert into subscriptions (professional_id, plan, status)
  values (new.auth_id, 'free', 'active')
  on conflict (professional_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created_subscription on professional_profiles;
create trigger on_profile_created_subscription
  after insert on professional_profiles
  for each row execute procedure handle_new_subscription();

-- Backfill: give all existing professionals a free subscription row
insert into subscriptions (professional_id, plan, status)
select auth_id, 'free', 'active'
from   professional_profiles
on conflict (professional_id) do nothing;

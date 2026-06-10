-- Training Marketplace: providers, courses, enrollments

create table if not exists training_providers (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  description     text,
  website_url     text,
  country_code    text        not null default 'QA',
  is_accredited   boolean     not null default false,
  accreditor      text,
  logo_url        text,
  contact_email   text,
  status          text        not null default 'pending',
  created_by      uuid        references auth.users (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint provider_status_values check (status in ('pending', 'active', 'suspended'))
);

create table if not exists courses (
  id                  uuid        primary key default gen_random_uuid(),
  provider_id         uuid        not null references training_providers (id) on delete cascade,
  title               text        not null,
  description         text,
  category            text        not null,
  credits             numeric(5,2) not null default 1,
  credit_type         text        not null default 'CME',
  delivery_mode       text        not null default 'online',
  duration_hours      numeric(5,1),
  price_usd           numeric(10,2),
  is_free             boolean     not null default false,
  country_codes       text[]      not null default '{QA}',
  professions         text[]      not null default '{all}',
  start_date          date,
  end_date            date,
  enrollment_deadline date,
  max_enrollments     int,
  status              text        not null default 'draft',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint course_status_values check (status in ('draft', 'active', 'closed', 'cancelled')),
  constraint delivery_mode_values check (delivery_mode in ('online', 'in_person', 'hybrid')),
  constraint credits_positive check (credits > 0)
);

create index idx_courses_provider on courses (provider_id);
create index idx_courses_status on courses (status);
create index idx_courses_country on courses using gin (country_codes);

create table if not exists course_enrollments (
  id              uuid        primary key default gen_random_uuid(),
  course_id       uuid        not null references courses (id) on delete cascade,
  professional_id uuid        not null references auth.users (id) on delete cascade,
  enrolled_at     timestamptz not null default now(),
  completed_at    timestamptz,
  credits_issued  numeric(5,2),
  status          text        not null default 'enrolled',
  certificate_url text,

  constraint enrollment_unique unique (course_id, professional_id),
  constraint enrollment_status_values check (status in ('enrolled', 'in_progress', 'completed', 'cancelled'))
);

create index idx_enrollments_professional on course_enrollments (professional_id);
create index idx_enrollments_course on course_enrollments (course_id);

-- RLS
alter table training_providers enable row level security;
alter table courses enable row level security;
alter table course_enrollments enable row level security;

create policy "providers_public_read" on training_providers for select using (status = 'active');
create policy "courses_public_read" on courses for select using (status = 'active');
create policy "enrollments_own" on course_enrollments for all using (auth.uid() = professional_id);

-- Updated_at triggers
create trigger set_training_providers_updated_at
  before update on training_providers
  for each row execute procedure set_updated_at();

create trigger set_courses_updated_at
  before update on courses
  for each row execute procedure set_updated_at();

# Hayya Med Pro — Database Standards

## Engine: PostgreSQL via Supabase

---

## Naming Conventions

| Object | Convention | Example |
|---|---|---|
| Tables | `snake_case`, plural | `professional_profiles`, `cme_activities` |
| Columns | `snake_case` | `created_at`, `auth_id`, `full_name` |
| Primary keys | `id uuid` | Always UUID, never serial integer |
| Foreign keys | `{table_singular}_id` | `professional_id`, `organization_id` |
| Auth user ref | `auth_id uuid` | References `auth.users(id)` |
| Timestamps | `created_at`, `updated_at` | Always `timestamptz` |
| Booleans | `is_` or `has_` prefix | `is_active`, `has_subscription` |
| Enums (text) | `snake_case` values | `'pending'`, `'approved'`, `'rejected'` |
| Indexes | `idx_{table}_{column}` | `idx_cme_activities_professional_id` |
| Functions | `snake_case` | `set_updated_at()`, `handle_new_subscription()` |
| Policies | `{table}_{action}_{description}` | `cme_activities_own_read` |

---

## Primary Key Standard

```sql
id uuid primary key default uuid_generate_v4()
```

**Never use serial integer PKs.** UUIDs prevent enumeration attacks, support distributed systems, and are required for Supabase RLS patterns.

---

## Timestamp Standard

Every table must have:

```sql
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

And a trigger:

```sql
create trigger set_{table}_updated_at
  before update on {table}
  for each row execute procedure set_updated_at();
```

---

## Foreign Key Standards

```sql
-- Always use ON DELETE CASCADE for owned data
professional_id uuid not null references professional_profiles (auth_id) on delete cascade

-- Use ON DELETE SET NULL for optional references
organization_id uuid references organizations (id) on delete set null
```

**Rule:** All foreign keys must be explicitly declared. No implicit relationships.

---

## Row Level Security (RLS)

**Every table must have RLS enabled before it is used in production.**

```sql
alter table {table} enable row level security;
```

Standard policy patterns:

```sql
-- Own data read
create policy "{table}_own_read" on {table} for select
  using ({owner_column} = auth.uid());

-- Own data write
create policy "{table}_own_insert" on {table} for insert
  with check ({owner_column} = auth.uid());

-- Public read (reference tables only)
create policy "{table}_public_read" on {table} for select
  using (true);

-- Admin bypass
create policy "{table}_admin_all" on {table} for all
  using (
    exists (
      select 1 from organization_members
      where auth_id = auth.uid()
      and role in ('admin', 'super_admin', 'master_admin')
    )
  );
```

---

## Indexing Standards

```sql
-- Index every foreign key
create index idx_{table}_{fk_column} on {table} ({fk_column});

-- Index every column used in WHERE clauses
create index idx_{table}_{filter_column} on {table} ({filter_column});

-- Composite indexes for common query patterns
create index idx_cme_activities_professional_status
  on cme_activities (professional_id, verification_status);
```

---

## Check Constraints for Enums

Never use raw text without a check constraint:

```sql
constraint plan_values check (plan in ('free', 'pro', 'employer', 'enterprise'))
constraint status_values check (status in ('active', 'trialing', 'past_due', 'canceled'))
```

---

## Multi-Tenant Strategy

Hayya Med Pro uses **row-level multi-tenancy** — all tenant data lives in shared tables, isolated by RLS policies.

| Entity | Isolation key |
|---|---|
| Professional data | `professional_id = auth.uid()` |
| Employer data | `organization_id` (via membership check) |
| Admin data | Role check via `organization_members` |

**Future:** For hospital enterprise contracts requiring hard data isolation, introduce a `tenant_id` column and partition-based isolation. Implement before first hospital contract > 500 staff.

---

## Country-Based Configuration Strategy

Country-specific rules must **never** be hardcoded in application logic.

All configurable data must live in:
- `country_compliance_rules` — credit requirements, cycle lengths, terminology
- `compliance_activity_categories` — category caps and conversion factors
- `licensing_authorities` — authority names, countries, abbreviations
- `country_localization_config` — currency, date format, language, payment gateway

---

## Audit Table Standard

```sql
audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  actor_auth_id uuid,               -- null = system action
  action      text not null,        -- dot-notation: 'cme.verified'
  target_table text,
  target_id   text,
  metadata    jsonb,
  created_at  timestamptz not null default now()
)
```

**Rules:**
- Append-only: No UPDATE or DELETE policies on audit_logs
- No updated_at trigger (immutable records)
- Retained minimum 7 years
- Indexed on: `actor_auth_id`, `action`, `created_at`

---

## Migration Standards

| Rule | Description |
|---|---|
| File naming | `{NNN}_{description}.sql` — e.g. `003_subscriptions.sql` |
| Idempotent | Always use `CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS` |
| Never destructive | Never `DROP COLUMN` or `DROP TABLE` in migrations — use soft deprecation |
| Always include RLS | Every new table migration must include RLS enable + policies |
| Include backfill | If adding data to existing tables, include a safe `INSERT ... ON CONFLICT DO NOTHING` |
| Version control | All migrations committed to `supabase/migrations/` |

---

## Scalability Requirements

| Threshold | Action Required |
|---|---|
| 10,000 professionals | Add read replica for reporting queries |
| 100,000 activities | Partition `cme_activities` by `created_at` year |
| 500,000 rows in any table | Review indexes, add covering indexes for hot queries |
| 1,000 concurrent users | Enable connection pooling (PgBouncer via Supabase) |
| Enterprise hospital > 500 staff | Evaluate dedicated schema or dedicated project per client |

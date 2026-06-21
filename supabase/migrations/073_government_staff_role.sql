-- Migration 073: Add government_staff to user_role enum
-- Sub-accounts feature: allows multiple staff members from a regulatory authority
-- to access the government dashboard with read-only permissions.
-- government_staff = read-only (view dashboard, registry, reports)
-- government_admin = full admin (approve, broadcast, manage team, settings)

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'government_staff';

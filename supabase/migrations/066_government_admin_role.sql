-- Migration 066: Add government_admin to user_role enum
-- The government portal (Session 126) uses role='government_admin' in organization_members.
-- PostgreSQL enums require explicit ALTER TYPE to add new values.

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'government_admin';

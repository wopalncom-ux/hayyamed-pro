-- Migration 015: Add rejection_reason column to cme_activities
-- Allows admins to communicate why a CME submission was rejected

alter table cme_activities
  add column if not exists rejection_reason text;

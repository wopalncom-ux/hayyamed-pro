-- ════════════════════════════════════════════════════════════
-- MIGRATION 052 — Add 'removed' to link_status enum
-- Needed to soft-delete approved employer-staff links without
-- physical deletion. Status 'removed' means an employer admin
-- removed the staff member from their roster (vs 'rejected'
-- which is declining a pending request).
-- ════════════════════════════════════════════════════════════

ALTER TYPE link_status ADD VALUE IF NOT EXISTS 'removed';

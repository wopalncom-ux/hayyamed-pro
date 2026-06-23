-- ============================================================
-- Migration 082 — Owner / Founder Role + Emergency Controls
-- Adds the highest-privilege "founder" role and a singleton
-- emergency controls table for platform-wide kill switches.
-- ============================================================

-- Add founder to the user_role enum (highest privilege)
DO $$ BEGIN
  ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'founder';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Platform Emergency Controls (singleton) ───────────────────────────────
-- One row only — controls platform-wide emergency toggles.
-- Only founder / master_admin / super_admin can read or update.

CREATE TABLE IF NOT EXISTS public.platform_emergency_controls (
  id                            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_mode              boolean     NOT NULL DEFAULT false,
  maintenance_message           text        NOT NULL DEFAULT 'The platform is currently under maintenance. We will be back shortly.',
  disable_registrations         boolean     NOT NULL DEFAULT false,
  disable_payments              boolean     NOT NULL DEFAULT false,
  disable_ai                    boolean     NOT NULL DEFAULT false,
  disable_email_notifications   boolean     NOT NULL DEFAULT false,
  emergency_banner_active       boolean     NOT NULL DEFAULT false,
  emergency_banner_message      text,
  emergency_banner_type         text        NOT NULL DEFAULT 'warning'
                                  CHECK (emergency_banner_type IN ('info', 'warning', 'error', 'success')),
  updated_by_auth_id            uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at                    timestamptz NOT NULL DEFAULT now(),
  created_at                    timestamptz NOT NULL DEFAULT now()
);

-- Enforce singleton: only one row ever
CREATE UNIQUE INDEX IF NOT EXISTS platform_emergency_controls_singleton
  ON public.platform_emergency_controls ((true));

-- Seed the single control row
INSERT INTO public.platform_emergency_controls DEFAULT VALUES
  ON CONFLICT DO NOTHING;

-- RLS
ALTER TABLE public.platform_emergency_controls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_read_emergency_controls" ON public.platform_emergency_controls;
CREATE POLICY "owner_read_emergency_controls"
  ON public.platform_emergency_controls FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('founder', 'master_admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "owner_update_emergency_controls" ON public.platform_emergency_controls;
CREATE POLICY "owner_update_emergency_controls"
  ON public.platform_emergency_controls FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE auth_id = auth.uid()
        AND role IN ('founder', 'master_admin', 'super_admin')
    )
  );

-- Also allow service role inserts (for the seed row above)
DROP POLICY IF EXISTS "service_role_emergency_insert" ON public.platform_emergency_controls;
CREATE POLICY "service_role_emergency_insert"
  ON public.platform_emergency_controls FOR INSERT
  WITH CHECK (true);

-- ── Update subscription.ts admin bypass to include founder ────────────────
-- The getUserPlan() function already checks master_admin / super_admin.
-- Founder inherits the same bypass — handled in application code.

-- ── RLS: allow master_admin to read platform_emergency_controls ───────────
-- (already handled by the policies above)

COMMENT ON TABLE public.platform_emergency_controls IS
  'Singleton row. Owner-only emergency kill switches for the platform.';

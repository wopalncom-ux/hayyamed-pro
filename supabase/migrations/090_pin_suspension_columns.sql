-- professionals_own_profile lets a professional write every column on their own
-- row via a blanket WITH CHECK (auth.uid() = auth_id), including the 3
-- admin-only moderation columns added in 059_account_suspension.sql.
-- Real enforcement of a suspension is via Supabase Auth ban_duration (session
-- revocation, not client-writable) — so this can't be used to bypass a ban —
-- but a still-live session could cosmetically flip its own is_suspended flag
-- and corrupt the admin UI's badge. Block self-writes to these columns with
-- a trigger (reliable OLD/NEW comparison, same pattern used elsewhere on
-- sibling products for this exact class of gap); service_role is exempt so
-- the real admin suspend/unsuspend actions still work.
create or replace function prevent_self_suspension_edit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'service_role' then
    return new;
  end if;
  if new.is_suspended is distinct from old.is_suspended
     or new.suspended_at is distinct from old.suspended_at
     or new.suspended_reason is distinct from old.suspended_reason then
    raise exception 'Not permitted to change suspension status via self-update';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_self_suspension_edit on professional_profiles;
create trigger trg_prevent_self_suspension_edit
before update on professional_profiles
for each row
execute function prevent_self_suspension_edit();

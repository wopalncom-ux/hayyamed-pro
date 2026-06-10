-- Admin and provider RLS policies for training marketplace tables

-- Allow service role (createAdminClient) full access — already implicit with service key.
-- These policies add authenticated-user access patterns.

-- Training providers: owners can manage their own pending/active providers
create policy "provider_owner_select" on training_providers
  for select using (auth.uid() = created_by);

create policy "provider_owner_insert" on training_providers
  for insert with check (auth.uid() = created_by);

create policy "provider_owner_update" on training_providers
  for update using (auth.uid() = created_by AND status != 'suspended');

-- Courses: provider owners can CRUD their own courses
create policy "course_owner_select" on courses
  for select using (
    provider_id in (
      select id from training_providers where created_by = auth.uid()
    )
  );

create policy "course_owner_insert" on courses
  for insert with check (
    provider_id in (
      select id from training_providers where created_by = auth.uid() and status = 'active'
    )
  );

create policy "course_owner_update" on courses
  for update using (
    provider_id in (
      select id from training_providers where created_by = auth.uid()
    )
  );

create policy "course_owner_delete" on courses
  for delete using (
    provider_id in (
      select id from training_providers where created_by = auth.uid()
    )
    and status = 'draft'
  );

-- Enrollments: provider can view enrollments for their courses
create policy "provider_enrollment_read" on course_enrollments
  for select using (
    course_id in (
      select c.id from courses c
      join training_providers tp on tp.id = c.provider_id
      where tp.created_by = auth.uid()
    )
  );

-- Provider can update enrollment status (mark complete)
create policy "provider_enrollment_update" on course_enrollments
  for update using (
    course_id in (
      select c.id from courses c
      join training_providers tp on tp.id = c.provider_id
      where tp.created_by = auth.uid()
    )
  );

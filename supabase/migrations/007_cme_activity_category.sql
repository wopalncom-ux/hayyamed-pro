-- Add AI-suggested category column to cme_activities
alter table cme_activities
  add column if not exists category text
    check (
      category is null
      or category in (
        'conference', 'online', 'workshop', 'journal',
        'teaching', 'simulation', 'mandatory', 'patient_safety', 'other'
      )
    );

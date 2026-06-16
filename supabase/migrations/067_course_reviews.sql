-- Migration 067: Course reviews and star ratings
-- Professionals who completed a course can leave a 1–5 star review + optional text.
-- One review per professional per course (UNIQUE constraint).

CREATE TABLE IF NOT EXISTS course_reviews (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   uuid        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  reviewer_id uuid        NOT NULL REFERENCES professional_profiles(auth_id) ON DELETE CASCADE,
  rating      integer     NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (course_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_course_reviews_course_id   ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_reviewer_id ON course_reviews(reviewer_id);

ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews (public social proof)
DROP POLICY IF EXISTS "course_reviews_select" ON course_reviews;
CREATE POLICY "course_reviews_select" ON course_reviews FOR SELECT USING (true);

-- Professionals can only write / edit / delete their own review
DROP POLICY IF EXISTS "course_reviews_insert" ON course_reviews;
CREATE POLICY "course_reviews_insert" ON course_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "course_reviews_update" ON course_reviews;
CREATE POLICY "course_reviews_update" ON course_reviews FOR UPDATE USING (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS "course_reviews_delete" ON course_reviews;
CREATE POLICY "course_reviews_delete" ON course_reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- Service role unrestricted (admin moderation)
DROP POLICY IF EXISTS "course_reviews_service" ON course_reviews;
CREATE POLICY "course_reviews_service" ON course_reviews FOR ALL USING (auth.role() = 'service_role');

-- Auto-update updated_at
CREATE TRIGGER set_updated_at_course_reviews
  BEFORE UPDATE ON course_reviews
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

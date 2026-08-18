-- Dev RLS policies for LMS-backend
-- WARNING: These are permissive development policies. DO NOT use unchanged in production.
-- Keep this file private and use it as a reference for applying policies in Supabase SQL editor.

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_assignments ENABLE ROW LEVEL SECURITY;

-- =====================
-- users table policies
-- =====================
-- SELECT: user can select their own row, admins can select all
CREATE POLICY users_select_own_or_admin ON users
  FOR SELECT
  USING (
    id::text = auth.uid()::text
    OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'ADMIN')
  );

-- INSERT: allow sign-up if id matches auth.uid()
CREATE POLICY users_insert_self ON users
  FOR INSERT
  WITH CHECK (id::text = auth.uid()::text);

-- UPDATE: allow user to update own row; admin can update any
CREATE POLICY users_update_own_or_admin ON users
  FOR UPDATE
  USING (id::text = auth.uid()::text OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'ADMIN'))
  WITH CHECK (id::text = auth.uid()::text OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'ADMIN'));

-- DELETE: admin only (dev)
CREATE POLICY users_delete_admin ON users
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid() AND u.role = 'ADMIN'));

-- =====================
-- courses table policies
-- =====================
-- SELECT: authenticated users may read courses
CREATE POLICY courses_select_auth ON courses
  FOR SELECT
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'ADMIN'));

-- INSERT: allow mentors and admins
CREATE POLICY courses_insert_by_mentor_or_admin ON courses
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'MENTOR')
    OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'ADMIN')
  );

-- UPDATE/DELETE: only course owner (mentor_id) or admin
CREATE POLICY courses_modify_owner_or_admin ON courses
  FOR UPDATE, DELETE
  USING (
    mentor_id::text = auth.uid()::text
    OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'ADMIN')
  )
  WITH CHECK (
    mentor_id::text = auth.uid()::text
    OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'ADMIN')
  );

-- =====================
-- chapters table policies
-- =====================
-- SELECT: authenticated users
CREATE POLICY chapters_select_auth ON chapters
  FOR SELECT
  USING (auth.role() = 'authenticated' OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'ADMIN'));

-- INSERT: allowed if requester is mentor for referenced course or admin
CREATE POLICY chapters_insert_by_course_mentor_or_admin ON chapters
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = course_id AND (c.mentor_id::text = auth.uid()::text OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'ADMIN'))
    )
  );

-- UPDATE/DELETE: only course mentor (owner) or admin
CREATE POLICY chapters_modify_by_course_mentor_or_admin ON chapters
  FOR UPDATE, DELETE
  USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = course_id AND (c.mentor_id::text = auth.uid()::text OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'ADMIN')))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = course_id AND (c.mentor_id::text = auth.uid()::text OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'ADMIN')))
  );

-- =====================
-- progress table policies
-- =====================
-- SELECT: student can see own progress; mentors/admin can select
CREATE POLICY progress_select_owner_or_staff ON progress
  FOR SELECT
  USING (
    user_id::text = auth.uid()::text
    OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role IN ('MENTOR','ADMIN'))
  );

-- INSERT: allow user to insert their own progress record
CREATE POLICY progress_insert_self ON progress
  FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

-- UPDATE: allow user to update their own progress
CREATE POLICY progress_update_self ON progress
  FOR UPDATE
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

-- DELETE: admin only (dev)
CREATE POLICY progress_delete_admin ON progress
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid() AND u.role = 'ADMIN'));

-- =====================
-- certificates table policies
-- =====================
-- SELECT: user can select their own certificates; mentors/admin can also select
CREATE POLICY certificates_select_owner_or_staff ON certificates
  FOR SELECT
  USING (
    user_id::text = auth.uid()::text
    OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role IN ('MENTOR','ADMIN'))
  );

-- INSERT: restrict issuing to admin or mentor (dev-safe)
CREATE POLICY certificates_insert_admin_or_mentor ON certificates
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role IN ('ADMIN','MENTOR'))
    OR auth.role() = 'service_role'
  );

-- DELETE: admin only
CREATE POLICY certificates_delete_admin ON certificates
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid() AND u.role = 'ADMIN'));

-- =====================
-- course_assignments table policies
-- =====================
-- SELECT: student sees own assignments; mentors/admin can view
CREATE POLICY course_assignments_select_owner_or_staff ON course_assignments
  FOR SELECT
  USING (
    student_id::text = auth.uid()::text
    OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role IN ('MENTOR','ADMIN'))
  );

-- INSERT: mentor of the course or admin can create assignments
CREATE POLICY course_assignments_insert_by_mentor_or_admin ON course_assignments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = course_id AND (c.mentor_id::text = auth.uid()::text OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'ADMIN'))
    )
  );

-- DELETE: mentor of course or admin
CREATE POLICY course_assignments_delete_by_mentor_or_admin ON course_assignments
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = course_id AND (c.mentor_id::text = auth.uid()::text OR EXISTS (SELECT 1 FROM users u WHERE u.id::text = auth.uid()::text AND u.role = 'ADMIN')))
  );

-- End of dev RLS policies

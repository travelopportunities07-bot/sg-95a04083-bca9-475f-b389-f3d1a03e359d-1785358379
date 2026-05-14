-- Clean up duplicate RLS policies on users table

-- Remove duplicate policies (keeping only the most recent/correct ones)
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "HR can view their workers" ON users;

-- Verify final policies (should have only 4 policies now)
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
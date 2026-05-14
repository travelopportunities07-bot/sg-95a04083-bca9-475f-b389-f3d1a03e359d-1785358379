-- Fix RLS policies for users table to allow proper signup flow

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "HR managers can view their employees" ON users;

-- 1. CRITICAL: Allow authenticated users to INSERT their own record during signup
-- This must use auth.uid() = id because during signup, the user is already authenticated
-- but their profile row doesn't exist yet
CREATE POLICY "Users can insert their own profile"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 2. Allow users to read their own profile
CREATE POLICY "Users can view their own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 3. Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Allow HR managers to view their assigned employees
CREATE POLICY "HR managers can view their employees"
ON users
FOR SELECT
TO authenticated
USING (
  hr_manager_id = auth.uid() OR
  auth.uid() = id
);

-- Verify RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Display policies for verification
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
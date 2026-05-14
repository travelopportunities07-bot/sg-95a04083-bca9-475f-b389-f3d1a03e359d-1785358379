-- Fix RLS policies for users table to allow signup

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

-- CREATE: Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- READ: Allow users to view their own profile
CREATE POLICY "Users can view own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- UPDATE: Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Also fix HR managers seeing their employees
CREATE POLICY "HR managers can view their employees"
ON users
FOR SELECT
TO authenticated
USING (
  hr_manager_id = auth.uid() OR
  auth.uid() = id
);
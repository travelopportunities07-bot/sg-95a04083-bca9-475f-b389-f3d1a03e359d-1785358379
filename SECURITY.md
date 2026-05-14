# WorkBridgeDe - Security & RLS Policies Documentation

## 🔐 Row Level Security (RLS) Policies

### 📋 Table: `users`

**Purpose**: Stores user profiles for both workers and HR managers.

#### Policies:

1. **Users can insert their own profile** ✅
   - **Command**: `INSERT`
   - **Role**: `authenticated`
   - **Condition**: `auth.uid() = id`
   - **Purpose**: Allows users to create their profile during signup
   - **Critical**: This is required for signup to work

2. **Users can view own profile** ✅
   - **Command**: `SELECT`
   - **Role**: `authenticated`
   - **Condition**: `auth.uid() = id`
   - **Purpose**: Users can read their own profile data

3. **Users can update own profile** ✅
   - **Command**: `UPDATE`
   - **Role**: `authenticated`
   - **Condition**: `auth.uid() = id`
   - **With Check**: `auth.uid() = id`
   - **Purpose**: Users can modify their own profile

4. **HR managers can view their employees** ✅
   - **Command**: `SELECT`
   - **Role**: `authenticated`
   - **Condition**: `hr_manager_id = auth.uid() OR auth.uid() = id`
   - **Purpose**: HR managers can see their assigned workers

---

### 📋 Table: `profiles`

**Purpose**: Supabase default profiles table (for auth.users extension).

#### Policies:

1. **Public profiles are viewable by everyone**
   - **Command**: `SELECT`
   - **Role**: `public`
   - **Condition**: `true`

2. **Users can insert their own profile**
   - **Command**: `INSERT`
   - **Role**: `public`
   - **With Check**: `uid() = id`

3. **Users can update their own profile**
   - **Command**: `UPDATE`
   - **Role**: `public`
   - **Condition**: `uid() = id`

---

### 📋 Table: `tasks`

**Purpose**: Global task templates available to all users.

#### Policies:

1. **Authenticated users can view tasks**
   - **Command**: `SELECT`
   - **Role**: `public`
   - **Condition**: `uid() IS NOT NULL`

---

### 📋 Table: `user_tasks`

**Purpose**: Individual task assignments per user.

#### Policies:

1. **Users can view own tasks**
   - **Command**: `SELECT`
   - **Role**: `public`
   - **Condition**: `uid() = user_id`

2. **Users can update own tasks**
   - **Command**: `UPDATE`
   - **Role**: `public`
   - **Condition**: `uid() = user_id`

3. **HR can view worker tasks**
   - **Command**: `SELECT`
   - **Role**: `public`
   - **Condition**: `user_id IN (SELECT id FROM users WHERE hr_manager_id = uid())`

---

### 📋 Table: `documents`

**Purpose**: User-uploaded documents (passport, visa, etc.).

#### Policies:

1. **Users can view own documents**
   - **Command**: `SELECT`
   - **Role**: `public`
   - **Condition**: `uid() = user_id`

2. **Users can insert own documents**
   - **Command**: `INSERT`
   - **Role**: `public`
   - **With Check**: `uid() = user_id`

3. **HR can view worker documents**
   - **Command**: `SELECT`
   - **Role**: `public`
   - **Condition**: `user_id IN (SELECT id FROM users WHERE hr_manager_id = uid())`

4. **HR can update worker documents**
   - **Command**: `UPDATE`
   - **Role**: `public`
   - **Condition**: `user_id IN (SELECT id FROM users WHERE hr_manager_id = uid())`

---

### 📋 Table: `reminders`

**Purpose**: Push/email reminders sent by HR to workers.

#### Policies:

1. **Users can view own reminders**
   - **Command**: `SELECT`
   - **Role**: `public`
   - **Condition**: `uid() = recipient_id OR uid() = sender_id`

2. **HR can send reminders**
   - **Command**: `INSERT`
   - **Role**: `public`
   - **With Check**: `uid() = sender_id`

---

### 📋 Table: `badges` & `user_badges`

**Purpose**: Gamification badges.

#### Badges Policies:

1. **All can view badges**
   - **Command**: `SELECT`
   - **Role**: `public`
   - **Condition**: `true`

#### User_Badges Policies:

1. **Users can view own earned badges**
   - **Command**: `SELECT`
   - **Role**: `public`
   - **Condition**: `uid() = user_id`

---

## 🛡️ Security Best Practices

### ✅ Implemented:

1. **RLS enabled on all sensitive tables** (users, tasks, documents, reminders)
2. **Principle of least privilege**: Users can only access their own data
3. **HR isolation**: HR managers can only view their assigned workers
4. **Authenticated-only access**: Most operations require authentication
5. **Double submission prevention**: Frontend uses `submittedRef` to prevent duplicate signups
6. **Input validation**: All forms have client-side and database-level validation
7. **Foreign key cascades**: Proper cleanup on user deletion

### 📝 Constraints & Validation:

#### Users Table:
- **role**: Must be `'worker'` or `'hr_manager'`
- **job_type**: Must be `'Fachkraft'` or `'Azubi'`
- **language_level**: Must be `'A1'`, `'A2'`, `'B1'`, `'B2'`, or `'C1'`
- **email**: Unique constraint

#### Tasks Table:
- **category**: Must be one of 6 categories (Gesundheit, Integration, Anmeldung, Finanzen, Steuern, Arbeit)
- **priority**: Must be `'normal'` or `'urgent'`

#### Documents Table:
- **doc_type**: Must be valid document type (passport, visa, work_contract, health_insurance, anmeldung, other)
- **status**: Must be `'pending'`, `'validated'`, or `'rejected'`

---

## 🚨 Common Issues & Fixes

### Issue 1: "new row violates row-level security policy for table users"

**Cause**: Missing INSERT policy on `users` table.

**Fix**: Applied in migration `20260417224015_migration_99406342.sql`
```sql
CREATE POLICY "Users can insert their own profile"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
```

---

### Issue 2: "email rate limit exceeded"

**Cause**: Multiple rapid signups triggered by double form submission.

**Fix**: Added `submittedRef.current` guard in `src/pages/auth/signup.tsx`
```typescript
const submittedRef = useRef(false);

const handleSubmit = async (e: React.FormEvent) => {
  if (submittedRef.current || loading) {
    return; // Prevent duplicate submission
  }
  submittedRef.current = true;
  // ... signup logic
};
```

---

## 🔍 Testing RLS Policies

### Test User Isolation:
```sql
-- As user A (authenticated)
SELECT * FROM users WHERE id = auth.uid(); -- ✅ Should see own profile
SELECT * FROM users WHERE id != auth.uid(); -- ❌ Should see nothing

-- As HR manager
SELECT * FROM users WHERE hr_manager_id = auth.uid(); -- ✅ Should see workers
```

### Test Document Access:
```sql
-- As user A
SELECT * FROM documents WHERE user_id = auth.uid(); -- ✅ Own documents only

-- As HR manager
SELECT * FROM documents WHERE user_id IN (
  SELECT id FROM users WHERE hr_manager_id = auth.uid()
); -- ✅ Workers' documents only
```

---

## 📚 Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Policies](https://www.postgresql.org/docs/current/sql-createpolicy.html)
- [Auth Best Practices](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

---

**Last Updated**: 2026-04-17  
**Version**: 1.0
-- ============================================
-- WORKBRIDGEDE DATABASE SCHEMA
-- Complete schema for worker integration tracking
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('worker', 'hr_manager')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  nationality TEXT,
  arrival_date DATE,
  job_type TEXT CHECK (job_type IN ('Fachkraft', 'Azubi')),
  company_id UUID,
  hr_manager_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  language_level TEXT CHECK (language_level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  xp_points INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TASKS TABLE (master task definitions)
-- ============================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('Gesundheit', 'Integration', 'Anmeldung', 'Finanzen', 'Steuern', 'Arbeit')),
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_de TEXT,
  description_en TEXT,
  xp_value INTEGER DEFAULT 20,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
  deadline_offset_days INTEGER NOT NULL,
  guide_steps JSONB,
  required_documents TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER_TASKS TABLE (assigned tasks to users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  completed_at TIMESTAMP WITH TIME ZONE,
  deadline DATE,
  reminder_sent_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('passport', 'visa', 'work_contract', 'health_insurance', 'anmeldung', 'other')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected')),
  validated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  validated_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  expires_at DATE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- REMINDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'manual' CHECK (type IN ('manual', 'automatic')),
  channel TEXT DEFAULT 'push' CHECK (channel IN ('push', 'email', 'both')),
  message TEXT NOT NULL,
  template_id UUID,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  action_taken_at TIMESTAMP WITH TIME ZONE,
  related_task_id UUID REFERENCES public.user_tasks(id) ON DELETE SET NULL,
  related_doc_type TEXT
);

-- ============================================
-- REMINDER_TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reminder_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  message_de TEXT NOT NULL,
  message_en TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name_de TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_de TEXT,
  description_en TEXT,
  icon TEXT,
  condition_type TEXT NOT NULL,
  condition_value INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER_BADGES TABLE (earned badges)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================
-- COMPANIES TABLE (optional)
-- ============================================
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Users table RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "HR can view their workers" ON public.users
  FOR SELECT USING (
    role = 'worker' AND hr_manager_id = auth.uid()
  );

-- Tasks table RLS (public read for all authenticated)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view tasks" ON public.tasks
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- User_tasks table RLS
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks" ON public.user_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.user_tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "HR can view worker tasks" ON public.user_tasks
  FOR SELECT USING (
    user_id IN (SELECT id FROM public.users WHERE hr_manager_id = auth.uid())
  );

-- Documents table RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "HR can view worker documents" ON public.documents
  FOR SELECT USING (
    user_id IN (SELECT id FROM public.users WHERE hr_manager_id = auth.uid())
  );

CREATE POLICY "HR can update worker documents" ON public.documents
  FOR UPDATE USING (
    user_id IN (SELECT id FROM public.users WHERE hr_manager_id = auth.uid())
  );

-- Reminders table RLS
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminders" ON public.reminders
  FOR SELECT USING (auth.uid() = recipient_id OR auth.uid() = sender_id);

CREATE POLICY "HR can send reminders" ON public.reminders
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Badges tables RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All can view badges" ON public.badges
  FOR SELECT USING (true);

CREATE POLICY "Users can view own earned badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- SEED DATA - Master Tasks
-- ============================================
INSERT INTO public.tasks (category, title_de, title_en, description_de, description_en, xp_value, priority, deadline_offset_days, required_documents) VALUES
-- Anmeldung category
('Anmeldung', 'Wohnsitz anmelden (Einwohnermeldeamt)', 'Register residence (Registration office)', 'Melde deinen Wohnsitz innerhalb von 14 Tagen beim Einwohnermeldeamt an.', 'Register your residence within 14 days at the registration office.', 40, 'urgent', 14, ARRAY['passport', 'work_contract']),

-- Gesundheit category
('Gesundheit', 'Krankenversicherung abschließen', 'Get health insurance', 'Schließe eine gesetzliche oder private Krankenversicherung ab.', 'Get statutory or private health insurance.', 40, 'urgent', 7, ARRAY['passport', 'work_contract']),
('Gesundheit', 'Hausarzt registrieren', 'Register family doctor', 'Finde einen Hausarzt in deiner Nähe und registriere dich.', 'Find a family doctor nearby and register.', 20, 'normal', 30, ARRAY['health_insurance']),

-- Finanzen category
('Finanzen', 'Bankkonto eröffnen', 'Open bank account', 'Eröffne ein deutsches Bankkonto für dein Gehalt.', 'Open a German bank account for your salary.', 30, 'urgent', 14, ARRAY['passport', 'anmeldung']),
('Finanzen', 'Steuer-ID beantragen', 'Apply for tax ID', 'Beantrage deine Steueridentifikationsnummer.', 'Apply for your tax identification number.', 30, 'normal', 21, ARRAY['anmeldung']),

-- Integration category
('Integration', 'Deutschkurs buchen', 'Book German course', 'Melde dich für einen Deutschkurs an.', 'Register for a German language course.', 20, 'normal', 30, NULL),
('Integration', 'Integrationskurs anmelden', 'Register for integration course', 'Melde dich für den offiziellen Integrationskurs an.', 'Register for the official integration course.', 30, 'normal', 60, NULL),

-- Arbeit category
('Arbeit', 'Sozialversicherung anmelden', 'Register social insurance', 'Melde dich bei der Sozialversicherung an.', 'Register with social insurance.', 30, 'normal', 14, ARRAY['work_contract']),

-- Steuern category
('Steuern', 'Steuerklasse festlegen', 'Determine tax class', 'Lege deine Steuerklasse fest.', 'Determine your tax class.', 20, 'normal', 30, ARRAY['work_contract'])
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA - Badges
-- ============================================
INSERT INTO public.badges (code, name_de, name_en, description_de, description_en, icon, condition_type, condition_value) VALUES
('starter', 'Starter', 'Starter', 'Erste Anmeldung', 'First login', '🏁', 'first_login', 1),
('task_hunter', 'Task Hunter', 'Task Hunter', '5 Aufgaben erledigt', '5 tasks completed', '📋', 'tasks_completed', 5),
('doc_master', 'Doc Master', 'Doc Master', 'Alle Dokumente validiert', 'All documents validated', '📄', 'all_docs_validated', 1),
('angemeldet', 'Angemeldet', 'Registered', 'Anmeldung abgeschlossen', 'Registration completed', '🏠', 'task_completed', 1),
('on_the_way', 'On the Way', 'On the Way', '50% Fortschritt', '50% progress', '💪', 'progress_percent', 50),
('speedrunner', 'Speedrunner', 'Speedrunner', 'Erste Aufgabe in 24h', 'First task in 24h', '⚡', 'task_speed', 1),
('fully_integrated', 'Fully Integrated', 'Fully Integrated', '100% aller Aufgaben', '100% of all tasks', '🎉', 'progress_percent', 100)
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED DATA - Reminder Templates
-- ============================================
INSERT INTO public.reminder_templates (code, message_de, message_en, category) VALUES
('TPL_001', 'Bitte vervollständigen Sie Ihre Krankenversicherung.', 'Please complete your health insurance.', 'Gesundheit'),
('TPL_002', 'Erinnerung: Ihr Aufenthaltstitel läuft bald ab.', 'Reminder: Your residence permit expires soon.', 'Arbeit'),
('TPL_003', 'Ein Dokument wurde abgelehnt. Bitte erneut hochladen.', 'A document was rejected. Please re-upload.', 'Dokumente'),
('TPL_004', 'Sie haben noch offene Aufgaben. Bitte erledigen Sie diese.', 'You have pending tasks. Please complete them.', 'Aufgaben'),
('TPL_005', 'Willkommen! Bitte beginnen Sie mit der Anmeldung.', 'Welcome! Please start with registration.', 'Onboarding')
ON CONFLICT DO NOTHING;

-- ============================================
-- TRIGGER: Auto-create user profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, role, first_name, last_name)
  VALUES (NEW.id, NEW.email, 'worker', '', '')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users
INSERT INTO public.users (id, email, role, first_name, last_name)
SELECT u.id, u.email, 'worker', '', ''
FROM auth.users u
LEFT JOIN public.users p ON p.id = u.id
WHERE p.id IS NULL;
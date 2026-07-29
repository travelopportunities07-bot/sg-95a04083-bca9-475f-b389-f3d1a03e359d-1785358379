-- Créer la table pour les rapports mensuels
CREATE TABLE IF NOT EXISTS monthly_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  hr_manager_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  report_month date NOT NULL, -- Premier jour du mois du rapport
  total_employees integer NOT NULL DEFAULT 0,
  active_employees integer NOT NULL DEFAULT 0,
  avg_progress numeric(5,2) NOT NULL DEFAULT 0,
  completed_tasks integer NOT NULL DEFAULT 0,
  overdue_tasks integer NOT NULL DEFAULT 0,
  documents_approved integer NOT NULL DEFAULT 0,
  documents_rejected integer NOT NULL DEFAULT 0,
  reminders_sent integer NOT NULL DEFAULT 0,
  new_hires integer NOT NULL DEFAULT 0,
  report_data jsonb NULL, -- Données détaillées du rapport
  generated_at timestamp with time zone NOT NULL DEFAULT now(),
  pdf_url text NULL, -- URL du PDF généré
  created_at timestamp with time zone DEFAULT now()
);

-- Index pour recherche rapide
CREATE INDEX idx_monthly_reports_hr_manager ON monthly_reports(hr_manager_id);
CREATE INDEX idx_monthly_reports_month ON monthly_reports(report_month DESC);

-- RLS policies
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hr_view_own_reports" ON monthly_reports
  FOR SELECT
  USING (hr_manager_id = auth.uid());

CREATE POLICY "hr_insert_own_reports" ON monthly_reports
  FOR INSERT
  WITH CHECK (hr_manager_id = auth.uid());

COMMENT ON TABLE monthly_reports IS 'Monthly performance reports for HR managers';

-- Créer la table pour les alertes automatiques
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  hr_manager_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id uuid NULL REFERENCES profiles(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN (
    'task_overdue',
    'document_missing',
    'document_rejected',
    'no_progress',
    'deadline_approaching',
    'inactivity',
    'multiple_overdue'
  )),
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed')),
  action_required boolean DEFAULT true,
  action_url text NULL,
  metadata jsonb NULL, -- Données contextuelles
  triggered_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved_at timestamp with time zone NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Index
CREATE INDEX idx_alerts_hr_manager ON alerts(hr_manager_id);
CREATE INDEX idx_alerts_worker ON alerts(worker_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_triggered ON alerts(triggered_at DESC);

-- RLS policies
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hr_view_own_alerts" ON alerts
  FOR SELECT
  USING (hr_manager_id = auth.uid());

CREATE POLICY "hr_manage_own_alerts" ON alerts
  FOR ALL
  USING (hr_manager_id = auth.uid());

COMMENT ON TABLE alerts IS 'Automated alerts for HR managers based on business rules';

-- Créer la table pour les absences
CREATE TABLE IF NOT EXISTS absences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hr_manager_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  absence_type text NOT NULL CHECK (absence_type IN (
    'sick_leave',
    'vacation',
    'personal',
    'emergency',
    'unpaid',
    'parental_leave',
    'other'
  )),
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_days integer NOT NULL,
  reason text NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  reviewed_by uuid NULL REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at timestamp with time zone NULL,
  rejection_reason text NULL,
  documents jsonb NULL, -- URLs des documents justificatifs
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Index
CREATE INDEX idx_absences_worker ON absences(worker_id);
CREATE INDEX idx_absences_hr_manager ON absences(hr_manager_id);
CREATE INDEX idx_absences_status ON absences(status);
CREATE INDEX idx_absences_dates ON absences(start_date, end_date);

-- RLS policies
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workers_manage_own_absences" ON absences
  FOR ALL
  USING (worker_id = auth.uid());

CREATE POLICY "hr_view_team_absences" ON absences
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hr_manager'
      AND profiles.id = absences.hr_manager_id
    )
  );

CREATE POLICY "hr_update_team_absences" ON absences
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'hr_manager'
      AND profiles.id = absences.hr_manager_id
    )
  );

COMMENT ON TABLE absences IS 'Employee absence management system';

-- Fonction pour générer les alertes automatiques
CREATE OR REPLACE FUNCTION generate_automated_alerts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  hr_record RECORD;
  worker_record RECORD;
  overdue_count integer;
BEGIN
  -- Pour chaque HR Manager
  FOR hr_record IN 
    SELECT id FROM profiles WHERE role = 'hr_manager'
  LOOP
    -- Pour chaque worker de ce HR Manager
    FOR worker_record IN
      SELECT id, first_name, last_name, email
      FROM profiles
      WHERE hr_manager_id = hr_record.id
      AND role = 'worker'
    LOOP
      -- Vérifier les tâches en retard
      SELECT COUNT(*) INTO overdue_count
      FROM tasks
      WHERE user_id = worker_record.id
      AND status != 'completed'
      AND due_date < CURRENT_DATE;
      
      -- Si 3+ tâches en retard, créer une alerte
      IF overdue_count >= 3 THEN
        INSERT INTO alerts (
          hr_manager_id,
          worker_id,
          alert_type,
          severity,
          title,
          message,
          action_url,
          metadata
        )
        VALUES (
          hr_record.id,
          worker_record.id,
          'multiple_overdue',
          'high',
          'Mehrere überfällige Aufgaben',
          worker_record.first_name || ' ' || worker_record.last_name || ' hat ' || overdue_count || ' überfällige Aufgaben.',
          '/hr/employees',
          jsonb_build_object('overdue_count', overdue_count, 'worker_email', worker_record.email)
        )
        ON CONFLICT DO NOTHING;
      END IF;
      
      -- Vérifier les documents rejetés
      IF EXISTS (
        SELECT 1 FROM documents
        WHERE user_id = worker_record.id
        AND status = 'rejected'
        AND created_at > CURRENT_DATE - INTERVAL '7 days'
      ) THEN
        INSERT INTO alerts (
          hr_manager_id,
          worker_id,
          alert_type,
          severity,
          title,
          message,
          action_url
        )
        VALUES (
          hr_record.id,
          worker_record.id,
          'document_rejected',
          'medium',
          'Abgelehntes Dokument',
          worker_record.first_name || ' ' || worker_record.last_name || ' hat ein abgelehntes Dokument, das erneut hochgeladen werden muss.',
          '/hr/employees'
        )
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END LOOP;
END;
$$;

COMMENT ON FUNCTION generate_automated_alerts IS 'Generates automated alerts based on business rules';
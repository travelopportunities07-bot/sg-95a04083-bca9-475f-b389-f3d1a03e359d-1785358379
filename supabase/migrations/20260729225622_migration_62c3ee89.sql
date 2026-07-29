-- Créer la table reminders pour l'historique des rappels envoyés
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  hr_manager_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  task_title text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'read', 'completed')),
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  read_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Index pour performances
CREATE INDEX idx_reminders_hr_manager ON reminders(hr_manager_id);
CREATE INDEX idx_reminders_worker ON reminders(worker_id);
CREATE INDEX idx_reminders_status ON reminders(status);
CREATE INDEX idx_reminders_sent_at ON reminders(sent_at DESC);

-- RLS policies
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- HR managers can view reminders they sent
CREATE POLICY "hr_view_own_reminders" ON reminders
  FOR SELECT
  USING (hr_manager_id = auth.uid());

-- HR managers can create reminders
CREATE POLICY "hr_create_reminders" ON reminders
  FOR INSERT
  WITH CHECK (hr_manager_id = auth.uid());

-- Workers can view reminders sent to them
CREATE POLICY "workers_view_own_reminders" ON reminders
  FOR SELECT
  USING (worker_id = auth.uid());

-- Workers can update status of their reminders
CREATE POLICY "workers_update_reminder_status" ON reminders
  FOR UPDATE
  USING (worker_id = auth.uid())
  WITH CHECK (worker_id = auth.uid());

COMMENT ON TABLE reminders IS 'Stores reminder history sent by HR managers to workers';
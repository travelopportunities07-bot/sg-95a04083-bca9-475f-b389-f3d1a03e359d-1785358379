-- Create activity_logs table for HR audit trail
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'invite_sent',
    'document_approved',
    'document_rejected',
    'reminder_sent',
    'profile_updated',
    'task_assigned',
    'worker_onboarded'
  )),
  target_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  target_user_email TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- HR managers can view their company's activity logs
CREATE POLICY "hr_view_company_logs" ON activity_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'hr_manager'
        AND profiles.company_id = (
          SELECT company_id FROM profiles WHERE id = activity_logs.user_id
        )
    )
  );

-- HR managers can insert their own logs
CREATE POLICY "hr_insert_own_logs" ON activity_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_target_user ON activity_logs(target_user_id);
CREATE INDEX idx_activity_logs_action_type ON activity_logs(action_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Add comment
COMMENT ON TABLE activity_logs IS 'Audit trail for HR manager actions';
-- Améliorer la table profiles pour supporter OAuth Google
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email',
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- Créer un index pour les recherches par google_id
CREATE INDEX IF NOT EXISTS idx_profiles_google_id ON profiles(google_id);

-- Créer une table pour gérer les permissions par rôle
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL,
  permission TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, permission)
);

-- Insérer les permissions par défaut pour workers
INSERT INTO role_permissions (role, permission) VALUES
  ('worker', 'view_own_tasks'),
  ('worker', 'update_own_tasks'),
  ('worker', 'view_own_documents'),
  ('worker', 'upload_documents'),
  ('worker', 'view_own_profile'),
  ('worker', 'update_own_profile'),
  ('worker', 'use_ai_assistant')
ON CONFLICT (role, permission) DO NOTHING;

-- Insérer les permissions par défaut pour HR managers
INSERT INTO role_permissions (role, permission) VALUES
  ('hr_manager', 'view_all_workers'),
  ('hr_manager', 'manage_workers'),
  ('hr_manager', 'view_all_documents'),
  ('hr_manager', 'validate_documents'),
  ('hr_manager', 'send_reminders'),
  ('hr_manager', 'invite_workers'),
  ('hr_manager', 'view_analytics'),
  ('hr_manager', 'manage_company')
ON CONFLICT (role, permission) DO NOTHING;

-- Fonction pour vérifier les permissions d'un utilisateur
CREATE OR REPLACE FUNCTION has_permission(user_id UUID, required_permission TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Récupérer le rôle de l'utilisateur
  SELECT role INTO user_role
  FROM profiles
  WHERE id = user_id;
  
  -- Vérifier si la permission existe pour ce rôle
  RETURN EXISTS (
    SELECT 1 
    FROM role_permissions 
    WHERE role = user_role AND permission = required_permission
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction trigger pour créer automatiquement un profil lors de l'inscription OAuth
CREATE OR REPLACE FUNCTION handle_oauth_profile_creation()
RETURNS TRIGGER AS $$
DECLARE
  user_metadata JSONB;
  first_name TEXT;
  last_name TEXT;
  full_name TEXT;
  avatar_url TEXT;
BEGIN
  -- Extraire les métadonnées de l'utilisateur
  user_metadata := NEW.raw_user_meta_data;
  
  -- Extraire les informations du profil Google
  full_name := COALESCE(user_metadata->>'full_name', user_metadata->>'name', '');
  first_name := COALESCE(user_metadata->>'given_name', SPLIT_PART(full_name, ' ', 1), '');
  last_name := COALESCE(user_metadata->>'family_name', SPLIT_PART(full_name, ' ', 2), '');
  avatar_url := COALESCE(user_metadata->>'avatar_url', user_metadata->>'picture', '');
  
  -- Créer le profil si OAuth provider (Google)
  IF NEW.app_metadata->>'provider' = 'google' THEN
    INSERT INTO profiles (
      id, 
      email, 
      first_name, 
      last_name, 
      full_name,
      avatar_url,
      google_id,
      auth_provider,
      role,
      last_login_at,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.email,
      first_name,
      last_name,
      full_name,
      avatar_url,
      user_metadata->>'sub',
      'google',
      'worker', -- Rôle par défaut, sera mis à jour dans role-select
      NOW(),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      last_login_at = NOW(),
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger pour la création automatique de profil OAuth
DROP TRIGGER IF EXISTS on_auth_user_created_oauth ON auth.users;
CREATE TRIGGER on_auth_user_created_oauth
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_oauth_profile_creation();

-- Fonction pour mettre à jour la dernière connexion
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET last_login_at = NOW(),
      updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour last_login_at sur les nouvelles sessions
DROP TRIGGER IF EXISTS on_session_created ON auth.sessions;
CREATE TRIGGER on_session_created
  AFTER INSERT ON auth.sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_last_login();

-- Ajouter des commentaires pour la documentation
COMMENT ON COLUMN profiles.google_id IS 'Google user ID (sub claim from OAuth)';
COMMENT ON COLUMN profiles.auth_provider IS 'Authentication provider: email, google, etc.';
COMMENT ON COLUMN profiles.last_login_at IS 'Timestamp of last successful login';
COMMENT ON TABLE role_permissions IS 'Permissions assigned to each role';
COMMENT ON FUNCTION has_permission IS 'Check if a user has a specific permission';
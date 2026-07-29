-- Ajouter la colonne first_login pour tracker les premières connexions
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_login BOOLEAN DEFAULT true;

-- Commentaire explicatif
COMMENT ON COLUMN profiles.first_login IS 'Flag to track if user has completed their first login (for welcome email)';
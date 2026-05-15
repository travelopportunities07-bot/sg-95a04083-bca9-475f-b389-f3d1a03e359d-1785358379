-- Créer/Mettre à jour les policies RLS pour permettre aux utilisateurs de lire leur propre profil
-- et aux HR managers de lire les profils de leurs employés

-- Activer RLS si ce n'est pas déjà fait
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "HR managers can read their workers profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Policy 1: Les utilisateurs peuvent lire leur propre profil
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy 3: Les HR managers peuvent lire les profils de leurs workers
CREATE POLICY "HR managers can read their workers profiles" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles hr
      WHERE hr.id = auth.uid()
      AND hr.role = 'hr_manager'
      AND profiles.hr_manager_id = hr.id
    )
  );

SELECT '✅ Policies RLS créées avec succès pour la table profiles' as message;
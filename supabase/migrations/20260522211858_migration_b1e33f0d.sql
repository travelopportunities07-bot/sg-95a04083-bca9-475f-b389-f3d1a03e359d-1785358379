-- Créer une fonction trigger pour générer automatiquement un profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'worker'),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger qui s'exécute après la création d'un utilisateur auth
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Créer aussi une fonction pour mettre à jour le profil après signup
CREATE OR REPLACE FUNCTION public.update_profile_after_signup(
  user_id uuid,
  profile_data jsonb
)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET
    nationality = COALESCE(profile_data->>'nationality', nationality),
    arrival_date = COALESCE((profile_data->>'arrival_date')::date, arrival_date),
    job_type = COALESCE(profile_data->>'job_type', job_type),
    language_level = COALESCE(profile_data->>'language_level', language_level),
    company_id = COALESCE((profile_data->>'company_id')::uuid, company_id),
    hr_manager_id = COALESCE((profile_data->>'hr_manager_id')::uuid, hr_manager_id),
    updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
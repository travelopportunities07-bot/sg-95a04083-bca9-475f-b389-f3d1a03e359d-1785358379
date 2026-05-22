import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/router";

interface UserProfile {
  id: string;
  email: string;
  role: "worker" | "hr_manager";
  first_name: string;
  last_name: string;
  nationality?: string;
  arrival_date?: string;
  job_type?: string;
  language_level?: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; userProfile?: UserProfile | null }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: Error | null; data?: { user: User } | null }>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dynamic URL Helper
const getURL = () => {
  let url = process?.env?.NEXT_PUBLIC_VERCEL_URL ?? 
           process?.env?.NEXT_PUBLIC_SITE_URL ?? 
           'http://localhost:3000'
  
  if (!url) {
    url = 'http://localhost:3000';
  }
  
  url = url.startsWith('http') ? url : `https://${url}`
  url = url.endsWith('/') ? url : `${url}/`
  
  return url
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
      
      setUserProfile(data as UserProfile);
      return data as UserProfile;
    } catch (error: any) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        
        // Messages d'erreur plus clairs
        if (error.message.includes("Email not confirmed")) {
          return { 
            error: new Error("Votre email n'est pas encore confirmé. Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation."),
            userProfile: null 
          };
        } else if (error.message.includes("Invalid login credentials")) {
          return { 
            error: new Error("Email ou mot de passe incorrect. Veuillez réessayer."),
            userProfile: null 
          };
        }
        
        return { error, userProfile: null };
      }

      if (data.user) {
        // Attendre un peu pour que le profil soit créé par le trigger
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const profile = await fetchUserProfile(data.user.id);
        if (!profile) {
          // Si le profil n'existe toujours pas, créer un profil basique
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              email: data.user.email || email,
              role: 'worker',
              first_name: '',
              last_name: ''
            });

          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
          
          // Récupérer à nouveau
          const retryProfile = await fetchUserProfile(data.user.id);
          return { error: null, userProfile: retryProfile };
        }
        return { error: null, userProfile: profile };
      }

      return { error: new Error("No user data returned"), userProfile: null };
    } catch (error: any) {
      console.error("Error in signIn:", error);
      return { error, userProfile: null };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // 1. Créer l'utilisateur auth (le trigger créera automatiquement le profil de base)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getURL()}auth/confirm-email`,
          data: {
            role: userData.role || 'worker',
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user returned");

      // 2. Si l'utilisateur a des données supplémentaires, mettre à jour le profil
      if (userData.nationality || userData.arrival_date || userData.job_type || userData.language_level) {
        // Attendre que le trigger crée le profil
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const profileUpdateData: any = {};
        if (userData.nationality) profileUpdateData.nationality = userData.nationality;
        if (userData.arrival_date) profileUpdateData.arrival_date = userData.arrival_date;
        if (userData.job_type) profileUpdateData.job_type = userData.job_type;
        if (userData.language_level) profileUpdateData.language_level = userData.language_level;
        if (userData.company_id) profileUpdateData.company_id = userData.company_id;
        if (userData.hr_manager_id) profileUpdateData.hr_manager_id = userData.hr_manager_id;

        const { error: updateError } = await supabase
          .from("profiles")
          .update(profileUpdateData)
          .eq("id", authData.user.id);

        if (updateError) {
          console.error("Error updating profile:", updateError);
        }
      }

      return { error: null, data: { user: authData.user } };
    } catch (error: any) {
      console.error("Signup error:", error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    router.push("/auth/login");
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const value = {
    user,
    userProfile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
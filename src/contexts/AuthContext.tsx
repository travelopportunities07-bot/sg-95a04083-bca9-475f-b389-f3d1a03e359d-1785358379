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
  signUp: (email: string, password: string, userData: any) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      
      setUserProfile(data as UserProfile);
      return data as UserProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
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

      if (error) throw error;

      // Fetch user profile to get the role
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        return { error: null, userProfile: profile };
      }

      return { error: null, userProfile: null };
    } catch (error: any) {
      return { error, userProfile: null };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user returned");

      // 2. Create user profile with only the fields that exist in the schema
      const profileData: any = {
        email,
        role: userData.role,
        first_name: userData.first_name,
        last_name: userData.last_name,
      };

      // Add optional fields only if provided
      if (userData.nationality) profileData.nationality = userData.nationality;
      if (userData.arrival_date) profileData.arrival_date = userData.arrival_date;
      if (userData.job_type) profileData.job_type = userData.job_type;
      if (userData.language_level) profileData.language_level = userData.language_level;
      if (userData.company) profileData.company = userData.company;

      const { error: profileError } = await supabase
        .from("users")
        .update(profileData)
        .eq("id", authData.user.id);

      if (profileError) throw profileError;

      return { error: null };
    } catch (error: any) {
      return { error };
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
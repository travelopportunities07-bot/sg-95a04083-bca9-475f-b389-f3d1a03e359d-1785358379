import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SessionState {
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook personnalisé pour gérer la session utilisateur avec refresh automatique
 */
export function useSession() {
  const [state, setState] = useState<SessionState>({
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setState({ session: null, loading: false, error });
      } else {
        setState({ session, loading: false, error: null });
      }
    });

    // S'abonner aux changements de session
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      // Gérer les événements de session
      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in:', session?.user?.email);
          setState({ session, loading: false, error: null });
          break;
          
        case 'SIGNED_OUT':
          console.log('User signed out');
          setState({ session: null, loading: false, error: null });
          break;
          
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed');
          setState({ session, loading: false, error: null });
          break;
          
        case 'USER_UPDATED':
          console.log('User updated');
          setState({ session, loading: false, error: null });
          break;
          
        default:
          setState({ session, loading: false, error: null });
      }
    });

    // Nettoyage
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Rafraîchir la session manuellement
   */
  const refreshSession = async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      setState({ session: null, loading: false, error });
    } else {
      setState({ session, loading: false, error: null });
    }
    
    return { session, error };
  };

  /**
   * Vérifier si la session est valide
   */
  const isSessionValid = () => {
    if (!state.session) return false;
    
    const expiresAt = state.session.expires_at;
    if (!expiresAt) return false;
    
    // Vérifier si la session expire dans moins de 5 minutes
    const expiresIn = expiresAt * 1000 - Date.now();
    return expiresIn > 5 * 60 * 1000; // 5 minutes
  };

  /**
   * Obtenir le temps restant avant expiration (en secondes)
   */
  const getTimeUntilExpiration = () => {
    if (!state.session?.expires_at) return 0;
    
    const expiresIn = state.session.expires_at * 1000 - Date.now();
    return Math.max(0, Math.floor(expiresIn / 1000));
  };

  return {
    session: state.session,
    loading: state.loading,
    error: state.error,
    refreshSession,
    isSessionValid,
    getTimeUntilExpiration,
  };
}
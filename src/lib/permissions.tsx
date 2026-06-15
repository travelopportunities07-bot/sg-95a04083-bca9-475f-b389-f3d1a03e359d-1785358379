import React from 'react';
import { supabase } from "@/integrations/supabase/client";

/**
 * Liste des permissions disponibles dans l'application
 */
export const PERMISSIONS = {
  // Worker permissions
  VIEW_OWN_TASKS: 'view_own_tasks',
  UPDATE_OWN_TASKS: 'update_own_tasks',
  VIEW_OWN_DOCUMENTS: 'view_own_documents',
  UPLOAD_DOCUMENTS: 'upload_documents',
  VIEW_OWN_PROFILE: 'view_own_profile',
  UPDATE_OWN_PROFILE: 'update_own_profile',
  USE_AI_ASSISTANT: 'use_ai_assistant',
  
  // HR Manager permissions
  VIEW_ALL_WORKERS: 'view_all_workers',
  MANAGE_WORKERS: 'manage_workers',
  VIEW_ALL_DOCUMENTS: 'view_all_documents',
  VALIDATE_DOCUMENTS: 'validate_documents',
  SEND_REMINDERS: 'send_reminders',
  INVITE_WORKERS: 'invite_workers',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_COMPANY: 'manage_company',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Permissions par rôle (cache côté client)
 */
const rolePermissions: Record<string, Permission[]> = {
  worker: [
    PERMISSIONS.VIEW_OWN_TASKS,
    PERMISSIONS.UPDATE_OWN_TASKS,
    PERMISSIONS.VIEW_OWN_DOCUMENTS,
    PERMISSIONS.UPLOAD_DOCUMENTS,
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.UPDATE_OWN_PROFILE,
    PERMISSIONS.USE_AI_ASSISTANT,
  ],
  hr_manager: [
    PERMISSIONS.VIEW_ALL_WORKERS,
    PERMISSIONS.MANAGE_WORKERS,
    PERMISSIONS.VIEW_ALL_DOCUMENTS,
    PERMISSIONS.VALIDATE_DOCUMENTS,
    PERMISSIONS.SEND_REMINDERS,
    PERMISSIONS.INVITE_WORKERS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_COMPANY,
  ],
};

/**
 * Vérifie si un utilisateur a une permission spécifique
 */
export async function hasPermission(permission: Permission): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    // Récupérer le profil de l'utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile?.role) return false;

    // Vérifier si le rôle a la permission
    return rolePermissions[profile.role]?.includes(permission) || false;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Vérifie si un utilisateur a plusieurs permissions
 */
export async function hasPermissions(permissions: Permission[]): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile?.role) return false;

    const userPermissions = rolePermissions[profile.role] || [];
    return permissions.every(permission => userPermissions.includes(permission));
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
}

/**
 * Récupère toutes les permissions d'un utilisateur
 */
export async function getUserPermissions(): Promise<Permission[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile?.role) return [];

    return rolePermissions[profile.role] || [];
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return [];
  }
}

/**
 * Hook React pour vérifier les permissions
 */
export function usePermission(permission: Permission) {
  const [hasAccess, setHasAccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    hasPermission(permission).then(result => {
      setHasAccess(result);
      setLoading(false);
    });
  }, [permission]);

  return { hasAccess, loading };
}

/**
 * Composant de protection basé sur les permissions
 */
interface ProtectedProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Protected({ permission, fallback = null, children }: ProtectedProps) {
  const { hasAccess, loading } = usePermission(permission);

  if (loading) return null;
  if (!hasAccess) return <>{fallback}</>;

  return <>{children}</>;
}
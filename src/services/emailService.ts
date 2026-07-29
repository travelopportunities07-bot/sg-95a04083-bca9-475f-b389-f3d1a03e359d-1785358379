import { supabase } from "@/integrations/supabase/client";

/**
 * Service d'envoi d'emails pour WorkBridgeDe
 */

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

interface WelcomeEmailParams {
  email: string;
  firstName: string;
  userId: string;
  role: "worker" | "hr_manager";
}

interface InvitationEmailParams {
  email: string;
  firstName?: string;
  lastName?: string;
  inviterName: string;
  companyName?: string;
  inviteLink: string;
  inviteCode: string;
}

/**
 * Envoyer email de bienvenue après première connexion Google
 */
export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<{ success: boolean; error?: Error }> {
  try {
    const dashboardUrl = params.role === "worker" 
      ? `${getURL()}` 
      : `${getURL()}hr/employees`;

    const response = await fetch("/api/send-welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: params.email,
        firstName: params.firstName,
        dashboardUrl,
        role: params.role
      })
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi de l'email de bienvenue");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return { success: false, error };
  }
}

/**
 * Envoyer email d'invitation
 */
export async function sendInvitationEmail(params: InvitationEmailParams): Promise<{ success: boolean; error?: Error }> {
  try {
    const response = await fetch("/api/send-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi de l'invitation");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error sending invitation email:", error);
    return { success: false, error };
  }
}

/**
 * Marquer la première connexion comme effectuée
 */
export async function markFirstLoginComplete(userId: string): Promise<{ success: boolean; error?: Error }> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ first_login: false })
      .eq("id", userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Error marking first login complete:", error);
    return { success: false, error };
  }
}
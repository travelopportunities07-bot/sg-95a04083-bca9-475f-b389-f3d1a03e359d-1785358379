import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "./activityService";

export interface Invitation {
  id: string;
  code: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: "worker" | "hr_manager";
  company_id: string;
  invited_by: string;
  status: "pending" | "accepted" | "expired";
  expires_at: string;
  accepted_at?: string;
  created_at: string;
}

/**
 * Generate unique invitation code
 */
function generateInvitationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const prefix = "HR";
  let code = prefix + "-";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Create invitation
 */
export async function createInvitation(
  email: string,
  companyId: string,
  invitedBy: string,
  firstName?: string,
  lastName?: string,
  role: "worker" | "hr_manager" = "worker"
): Promise<{ data: Invitation | null; error: Error | null; inviteLink: string | null }> {
  try {
    const code = generateInvitationCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days validity

    const { data, error } = await supabase
      .from("invitations")
      .insert({
        code,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        company_id: companyId,
        invited_by: invitedBy,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    const inviteLink = `${window.location.origin}/auth/signup?invite=${code}`;

    // Log activity
    await logActivity({
      actionType: "invite_sent",
      targetUserEmail: email,
      details: {
        role,
        invite_code: code,
        first_name: firstName,
        last_name: lastName,
      },
    });

    return { data: data as Invitation, error: null, inviteLink };
  } catch (error: any) {
    return { data: null, error, inviteLink: null };
  }
}

/**
 * Get invitation by code
 */
export async function getInvitationByCode(code: string): Promise<{ data: Invitation | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("code", code)
      .single();

    if (error) throw error;

    // Check if expired
    if (data && new Date(data.expires_at) < new Date()) {
      await supabase
        .from("invitations")
        .update({ status: "expired" })
        .eq("id", data.id);

      throw new Error("Invitation code expired");
    }

    return { data: data as Invitation, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

/**
 * Accept invitation
 */
export async function acceptInvitation(invitationId: string, userId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from("invitations")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", invitationId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error };
  }
}

/**
 * Get company invitations (HR Manager)
 */
export async function getCompanyInvitations(companyId: string): Promise<{ data: Invitation[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: (data || []) as Invitation[], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

/**
 * Resend invitation email
 */
export async function resendInvitation(invitationId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    // Get invitation details
    const { data: invitation, error: invError } = await supabase
      .from("invitations")
      .select("*")
      .eq("id", invitationId)
      .single();

    if (invError) throw invError;

    // Extend expiry date
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    const { error: updateError } = await supabase
      .from("invitations")
      .update({
        expires_at: newExpiresAt.toISOString(),
        status: "pending",
      })
      .eq("id", invitationId);

    if (updateError) throw updateError;

    // Log activity
    await logActivity({
      actionType: "invite_sent",
      targetUserEmail: invitation.email,
      details: {
        action: "resend",
        invite_code: invitation.code,
      },
    });

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error };
  }
}

/**
 * Delete invitation
 */
export async function deleteInvitation(invitationId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from("invitations")
      .delete()
      .eq("id", invitationId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error };
  }
}
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "./activityService";

export interface Absence {
  id: string;
  worker_id: string;
  hr_manager_id: string;
  absence_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  documents?: any;
  created_at: string;
  updated_at: string;
}

/**
 * Create absence request
 */
export async function createAbsence(params: {
  startDate: string;
  endDate: string;
  absenceType: string;
  reason?: string;
  documents?: any;
}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get user profile to find HR manager
    const { data: profile } = await supabase
      .from("profiles")
      .select("hr_manager_id")
      .eq("id", user.id)
      .single();

    if (!profile?.hr_manager_id) {
      throw new Error("No HR manager assigned");
    }

    // Calculate total days
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const { data, error } = await supabase
      .from("absences")
      .insert({
        worker_id: user.id,
        hr_manager_id: profile.hr_manager_id,
        absence_type: params.absenceType,
        start_date: params.startDate,
        end_date: params.endDate,
        total_days: totalDays,
        reason: params.reason,
        documents: params.documents,
        status: "pending"
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification for HR manager
    await supabase
      .from("notifications")
      .insert({
        user_id: profile.hr_manager_id,
        title: "Neue Abwesenheitsanfrage",
        message: `Ein Mitarbeiter hat eine Abwesenheit vom ${new Date(params.startDate).toLocaleDateString('de-DE')} bis ${new Date(params.endDate).toLocaleDateString('de-DE')} beantragt.`,
        type: "info",
        action_url: "/hr/absences"
      });

    return { data, error: null };
  } catch (error: any) {
    console.error("Error creating absence:", error);
    return { data: null, error: error.message };
  }
}

/**
 * Get absences for worker
 */
export async function getWorkerAbsences() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("absences")
      .select("*")
      .eq("worker_id", user.id)
      .order("start_date", { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error: any) {
    console.error("Error fetching worker absences:", error);
    return { data: [], error: error.message };
  }
}

/**
 * Get absences for HR manager's team
 */
export async function getTeamAbsences(status?: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    let query = supabase
      .from("absences")
      .select(`
        *,
        worker:profiles!absences_worker_id_fkey(
          id,
          email,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq("hr_manager_id", user.id)
      .order("start_date", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error: any) {
    console.error("Error fetching team absences:", error);
    return { data: [], error: error.message };
  }
}

/**
 * Approve absence
 */
export async function approveAbsence(absenceId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("absences")
      .update({
        status: "approved",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", absenceId)
      .select()
      .single();

    if (error) throw error;

    // Notify worker
    await supabase
      .from("notifications")
      .insert({
        user_id: data.worker_id,
        title: "Abwesenheit genehmigt",
        message: "Deine Abwesenheitsanfrage wurde genehmigt.",
        type: "success"
      });

    return { data, error: null };
  } catch (error: any) {
    console.error("Error approving absence:", error);
    return { data: null, error: error.message };
  }
}

/**
 * Reject absence
 */
export async function rejectAbsence(absenceId: string, rejectionReason: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("absences")
      .update({
        status: "rejected",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: rejectionReason
      })
      .eq("id", absenceId)
      .select()
      .single();

    if (error) throw error;

    // Notify worker
    await supabase
      .from("notifications")
      .insert({
        user_id: data.worker_id,
        title: "Abwesenheit abgelehnt",
        message: `Deine Abwesenheitsanfrage wurde abgelehnt. Grund: ${rejectionReason}`,
        type: "error"
      });

    return { data, error: null };
  } catch (error: any) {
    console.error("Error rejecting absence:", error);
    return { data: null, error: error.message };
  }
}

/**
 * Get absence statistics
 */
export async function getAbsenceStats() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("absences")
      .select("status, total_days, absence_type")
      .eq("hr_manager_id", user.id);

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      pending: data?.filter(a => a.status === "pending").length || 0,
      approved: data?.filter(a => a.status === "approved").length || 0,
      rejected: data?.filter(a => a.status === "rejected").length || 0,
      total_days: data?.filter(a => a.status === "approved")
        .reduce((sum, a) => sum + a.total_days, 0) || 0,
      by_type: {} as Record<string, number>
    };

    // Count by type
    data?.forEach(a => {
      if (!stats.by_type[a.absence_type]) {
        stats.by_type[a.absence_type] = 0;
      }
      stats.by_type[a.absence_type]++;
    });

    return { data: stats, error: null };
  } catch (error: any) {
    console.error("Error fetching absence stats:", error);
    return { data: null, error: error.message };
  }
}
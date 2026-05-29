import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"];
type ActivityLogInsert = Database["public"]["Tables"]["activity_logs"]["Insert"];

export type ActionType = 
  | "invite_sent"
  | "document_approved"
  | "document_rejected"
  | "reminder_sent"
  | "profile_updated"
  | "task_assigned"
  | "worker_onboarded";

interface LogActivityParams {
  actionType: ActionType;
  targetUserId?: string;
  targetUserEmail?: string;
  details?: Record<string, any>;
}

/**
 * Log an activity for audit trail
 */
export async function logActivity({
  actionType,
  targetUserId,
  targetUserEmail,
  details,
}: LogActivityParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const logData: ActivityLogInsert = {
      user_id: user.id,
      action_type: actionType,
      target_user_id: targetUserId || null,
      target_user_email: targetUserEmail || null,
      details: details || null,
    };

    const { error } = await supabase
      .from("activity_logs")
      .insert(logData);

    if (error) {
      console.error("Error logging activity:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in logActivity:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get activity logs for HR manager's company
 */
export async function getActivityLogs({
  actionType,
  startDate,
  endDate,
  limit = 50,
  offset = 0,
}: {
  actionType?: ActionType;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ logs: ActivityLog[]; error?: string }> {
  try {
    let query = supabase
      .from("activity_logs")
      .select(`
        *,
        profiles!activity_logs_user_id_fkey(full_name, email),
        target_profile:profiles!activity_logs_target_user_id_fkey(full_name, email)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (actionType) {
      query = query.eq("action_type", actionType);
    }

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching activity logs:", error);
      return { logs: [], error: error.message };
    }

    return { logs: data || [] };
  } catch (error: any) {
    console.error("Error in getActivityLogs:", error);
    return { logs: [], error: error.message };
  }
}

/**
 * Get activity logs count
 */
export async function getActivityLogsCount({
  actionType,
  startDate,
  endDate,
}: {
  actionType?: ActionType;
  startDate?: string;
  endDate?: string;
} = {}): Promise<{ count: number; error?: string }> {
  try {
    let query = supabase
      .from("activity_logs")
      .select("*", { count: "exact", head: true });

    if (actionType) {
      query = query.eq("action_type", actionType);
    }

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { count, error } = await query;

    if (error) {
      console.error("Error counting activity logs:", error);
      return { count: 0, error: error.message };
    }

    return { count: count || 0 };
  } catch (error: any) {
    console.error("Error in getActivityLogsCount:", error);
    return { count: 0, error: error.message };
  }
}
import { supabase } from "@/integrations/supabase/client";

export interface Alert {
  id: string;
  hr_manager_id: string;
  worker_id?: string;
  alert_type: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  status: "active" | "resolved" | "dismissed";
  action_required: boolean;
  action_url?: string;
  metadata?: any;
  triggered_at: string;
  resolved_at?: string;
}

/**
 * Get all alerts for HR manager
 */
export async function getAlerts(status?: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    let query = supabase
      .from("alerts")
      .select(`
        *,
        worker:profiles!alerts_worker_id_fkey(
          id,
          email,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq("hr_manager_id", user.id)
      .order("triggered_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error: any) {
    console.error("Error fetching alerts:", error);
    return { data: [], error: error.message };
  }
}

/**
 * Get alert statistics
 */
export async function getAlertStats() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("alerts")
      .select("severity, status")
      .eq("hr_manager_id", user.id);

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      active: data?.filter(a => a.status === "active").length || 0,
      critical: data?.filter(a => a.severity === "critical" && a.status === "active").length || 0,
      high: data?.filter(a => a.severity === "high" && a.status === "active").length || 0,
      medium: data?.filter(a => a.severity === "medium" && a.status === "active").length || 0,
      low: data?.filter(a => a.severity === "low" && a.status === "active").length || 0
    };

    return { data: stats, error: null };
  } catch (error: any) {
    console.error("Error fetching alert stats:", error);
    return { data: null, error: error.message };
  }
}

/**
 * Resolve an alert
 */
export async function resolveAlert(alertId: string) {
  try {
    const { error } = await supabase
      .from("alerts")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString()
      })
      .eq("id", alertId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error resolving alert:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Dismiss an alert
 */
export async function dismissAlert(alertId: string) {
  try {
    const { error } = await supabase
      .from("alerts")
      .update({
        status: "dismissed",
        resolved_at: new Date().toISOString()
      })
      .eq("id", alertId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error dismissing alert:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Manually trigger alert generation
 */
export async function triggerAlertGeneration() {
  try {
    const { error } = await supabase.rpc("generate_automated_alerts");

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error triggering alerts:", error);
    return { success: false, error: error.message };
  }
}
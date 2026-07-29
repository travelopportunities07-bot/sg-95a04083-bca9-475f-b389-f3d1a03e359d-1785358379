import { supabase } from "@/integrations/supabase/client";

export interface MonthlyReport {
  id: string;
  hr_manager_id: string;
  report_month: string;
  total_employees: number;
  active_employees: number;
  avg_progress: number;
  completed_tasks: number;
  overdue_tasks: number;
  documents_approved: number;
  documents_rejected: number;
  reminders_sent: number;
  new_hires: number;
  report_data?: any;
  generated_at: string;
  pdf_url?: string;
}

/**
 * Generate monthly report for HR manager
 */
export async function generateMonthlyReport(reportMonth: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get all workers
    const { data: workers, error: workersError } = await supabase
      .from("profiles")
      .select("id, created_at")
      .eq("hr_manager_id", user.id)
      .eq("role", "worker");

    if (workersError) throw workersError;

    const totalEmployees = workers?.length || 0;
    const monthStart = new Date(reportMonth);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);

    // Calculate new hires in this month
    const newHires = workers?.filter(w => {
      const createdDate = new Date(w.created_at);
      return createdDate >= monthStart && createdDate <= monthEnd;
    }).length || 0;

    // Get tasks stats
    const { data: tasks } = await supabase
      .from("tasks")
      .select("user_id, status, due_date, updated_at, created_at")
      .in("user_id", workers?.map(w => w.id) || []);

    const completedTasks = tasks?.filter(t => t.status === "completed").length || 0;
    const overdueTasks = tasks?.filter(t => 
      t.due_date && new Date(t.due_date) < new Date() && t.status !== "completed"
    ).length || 0;

    // Calculate average progress
    let totalProgress = 0;
    for (const worker of workers || []) {
      const workerTasks = tasks?.filter(t => t.user_id === worker.id) || [];
      const workerCompleted = workerTasks.filter(t => t.status === "completed").length;
      const workerTotal = workerTasks.length;
      const progress = workerTotal > 0 ? (workerCompleted / workerTotal) * 100 : 0;
      totalProgress += progress;
    }
    const avgProgress = totalEmployees > 0 ? totalProgress / totalEmployees : 0;

    // Get documents stats
    const { data: documents } = await supabase
      .from("documents")
      .select("status, user_id")
      .in("user_id", workers?.map(w => w.id) || []);

    const documentsApproved = documents?.filter(d => d.status === "approved").length || 0;
    const documentsRejected = documents?.filter(d => d.status === "rejected").length || 0;

    // Get reminders stats
    const { data: reminders } = await supabase
      .from("reminders")
      .select("id")
      .eq("hr_manager_id", user.id)
      .gte("sent_at", monthStart.toISOString())
      .lte("sent_at", monthEnd.toISOString());

    const remindersSent = reminders?.length || 0;

    // Active employees (those who completed at least 1 task this month)
    const activeEmployees = new Set(
      tasks?.filter(t => {
        const completedDate = t.status === "completed" && new Date(t.updated_at);
        return completedDate && completedDate >= monthStart && completedDate <= monthEnd;
      }).map(t => t.user_id) || []
    ).size;

    // Create report
    const { data: report, error: reportError } = await supabase
      .from("monthly_reports")
      .insert({
        hr_manager_id: user.id,
        report_month: reportMonth,
        total_employees: totalEmployees,
        active_employees: activeEmployees,
        avg_progress: Math.round(avgProgress * 100) / 100,
        completed_tasks: completedTasks,
        overdue_tasks: overdueTasks,
        documents_approved: documentsApproved,
        documents_rejected: documentsRejected,
        reminders_sent: remindersSent,
        new_hires: newHires,
        report_data: {
          month: reportMonth,
          workers: workers?.map(w => w.id),
          generated_by: user.id
        }
      })
      .select()
      .single();

    if (reportError) throw reportError;

    return { data: report, error: null };
  } catch (error: any) {
    console.error("Error generating monthly report:", error);
    return { data: null, error: error.message };
  }
}

/**
 * Get monthly reports for HR manager
 */
export async function getMonthlyReports(limit = 12) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("monthly_reports")
      .select("*")
      .eq("hr_manager_id", user.id)
      .order("report_month", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error: any) {
    console.error("Error fetching monthly reports:", error);
    return { data: [], error: error.message };
  }
}

/**
 * Get specific monthly report
 */
export async function getMonthlyReport(reportId: string) {
  try {
    const { data, error } = await supabase
      .from("monthly_reports")
      .select("*")
      .eq("id", reportId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching report:", error);
    return { data: null, error: error.message };
  }
}
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "./activityService";

export interface Reminder {
  id: string;
  hr_manager_id: string;
  worker_id: string;
  task_id?: string;
  task_title: string;
  message?: string;
  status: "sent" | "read" | "completed";
  sent_at: string;
  read_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface CreateReminderParams {
  workerId: string;
  taskId?: string;
  taskTitle: string;
  message?: string;
}

/**
 * Create and send a reminder to a worker
 */
export async function createReminder(params: CreateReminderParams) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get worker profile for email
    const { data: workerProfile, error: workerError } = await supabase
      .from("profiles")
      .select("email, first_name, last_name")
      .eq("id", params.workerId)
      .single();

    if (workerError) throw workerError;

    // Create reminder record
    const { data: reminder, error: reminderError } = await supabase
      .from("reminders")
      .insert({
        hr_manager_id: user.id,
        worker_id: params.workerId,
        task_id: params.taskId || null,
        task_title: params.taskTitle,
        message: params.message || null,
        status: "sent"
      })
      .select()
      .single();

    if (reminderError) throw reminderError;

    // Create in-app notification
    const { error: notifError } = await supabase
      .from("notifications")
      .insert({
        user_id: params.workerId,
        title: "Neue Erinnerung",
        message: `Erinnerung für: ${params.taskTitle}`,
        type: "warning",
        action_url: "/tasks"
      });

    if (notifError) {
      console.error("Error creating notification:", notifError);
    }

    // Log activity
    await logActivity({
      actionType: "reminder_sent",
      targetUserId: params.workerId,
      targetUserEmail: workerProfile.email,
      details: {
        task_title: params.taskTitle,
        message: params.message,
        reminder_id: reminder.id
      }
    });

    return { data: reminder, error: null };
  } catch (error: any) {
    console.error("Error creating reminder:", error);
    return { data: null, error: error.message };
  }
}

/**
 * Get reminders for HR manager
 */
export async function getHRReminders(limit = 50, offset = 0) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("reminders")
      .select(`
        *,
        worker:profiles!reminders_worker_id_fkey(
          id,
          email,
          first_name,
          last_name,
          avatar_url
        ),
        task:tasks(
          id,
          title,
          status,
          due_date
        )
      `)
      .eq("hr_manager_id", user.id)
      .order("sent_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error: any) {
    console.error("Error fetching reminders:", error);
    return { data: [], error: error.message };
  }
}

/**
 * Get reminders for a specific worker
 */
export async function getWorkerReminders(workerId: string, limit = 50) {
  try {
    const { data, error } = await supabase
      .from("reminders")
      .select(`
        *,
        hr_manager:profiles!reminders_hr_manager_id_fkey(
          id,
          email,
          first_name,
          last_name,
          company
        )
      `)
      .eq("worker_id", workerId)
      .order("sent_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error: any) {
    console.error("Error fetching worker reminders:", error);
    return { data: [], error: error.message };
  }
}

/**
 * Mark reminder as read
 */
export async function markReminderAsRead(reminderId: string) {
  try {
    const { error } = await supabase
      .from("reminders")
      .update({
        status: "read",
        read_at: new Date().toISOString()
      })
      .eq("id", reminderId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error marking reminder as read:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Mark reminder as completed
 */
export async function markReminderAsCompleted(reminderId: string) {
  try {
    const { error } = await supabase
      .from("reminders")
      .update({
        status: "completed",
        completed_at: new Date().toISOString()
      })
      .eq("id", reminderId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error marking reminder as completed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get reminder statistics for HR manager
 */
export async function getReminderStats() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("reminders")
      .select("status")
      .eq("hr_manager_id", user.id);

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      sent: data?.filter(r => r.status === "sent").length || 0,
      read: data?.filter(r => r.status === "read").length || 0,
      completed: data?.filter(r => r.status === "completed").length || 0
    };

    return { data: stats, error: null };
  } catch (error: any) {
    console.error("Error fetching reminder stats:", error);
    return { data: null, error: error.message };
  }
}
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id: string;
  user_id: string;
  category: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "completed";
  due_date?: string;
  completed_at?: string;
  xp_reward: number;
  created_at: string;
  updated_at: string;
}

/**
 * Mark task as completed
 */
export async function markTaskAsCompleted(taskId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from("tasks")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error };
  }
}

/**
 * Update task status
 */
export async function updateTaskStatus(
  taskId: string,
  status: "todo" | "in_progress" | "completed"
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const updateData: any = { status };

    if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase.from("tasks").update(updateData).eq("id", taskId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error };
  }
}

/**
 * Get user tasks
 */
export async function getUserTasks(userId: string): Promise<{ data: Task[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

/**
 * Get task completion stats
 */
export async function getTaskStats(userId: string): Promise<{
  data: { total: number; completed: number; in_progress: number; todo: number; completion_rate: number } | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase.from("tasks").select("status").eq("user_id", userId);

    if (error) throw error;

    const total = data.length;
    const completed = data.filter((t) => t.status === "completed").length;
    const in_progress = data.filter((t) => t.status === "in_progress").length;
    const todo = data.filter((t) => t.status === "todo").length;
    const completion_rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      data: {
        total,
        completed,
        in_progress,
        todo,
        completion_rate,
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error };
  }
}

/**
 * Create initial tasks for new worker
 */
export async function createInitialTasks(userId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const initialTasks = [
      {
        user_id: userId,
        category: "Gesundheit",
        title: "Krankenversicherung abschließen",
        description: "Wählen Sie eine Krankenkasse und melden Sie sich an",
        priority: "urgent",
        status: "todo",
        xp_reward: 100,
      },
      {
        user_id: userId,
        category: "Integration",
        title: "Deutschkurs anmelden",
        description: "Finden Sie einen passenden Deutschkurs",
        priority: "high",
        status: "todo",
        xp_reward: 75,
      },
      {
        user_id: userId,
        category: "Anmeldung",
        title: "Anmeldung beim Einwohnermeldeamt",
        description: "Registrieren Sie sich innerhalb von 14 Tagen",
        priority: "urgent",
        status: "todo",
        xp_reward: 100,
      },
      {
        user_id: userId,
        category: "Finanzen",
        title: "Bankkonto eröffnen",
        description: "Eröffnen Sie ein deutsches Bankkonto",
        priority: "high",
        status: "todo",
        xp_reward: 75,
      },
      {
        user_id: userId,
        category: "Steuern",
        title: "Steuer-ID beantragen",
        description: "Beantragen Sie Ihre deutsche Steuer-ID",
        priority: "medium",
        status: "todo",
        xp_reward: 50,
      },
      {
        user_id: userId,
        category: "Arbeit",
        title: "Arbeitserlaubnis prüfen",
        description: "Stellen Sie sicher, dass Ihre Arbeitserlaubnis gültig ist",
        priority: "urgent",
        status: "todo",
        xp_reward: 100,
      },
    ];

    const { error } = await supabase.from("tasks").insert(initialTasks);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error };
  }
}
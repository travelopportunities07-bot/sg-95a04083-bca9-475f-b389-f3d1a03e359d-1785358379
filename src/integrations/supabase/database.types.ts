 
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          code: string
          condition_type: string
          condition_value: number | null
          created_at: string | null
          description_de: string | null
          description_en: string | null
          icon: string | null
          id: string
          name_de: string
          name_en: string
        }
        Insert: {
          code: string
          condition_type: string
          condition_value?: number | null
          created_at?: string | null
          description_de?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          name_de: string
          name_en: string
        }
        Update: {
          code?: string
          condition_type?: string
          condition_value?: number | null
          created_at?: string | null
          description_de?: string | null
          description_en?: string | null
          icon?: string | null
          id?: string
          name_de?: string
          name_en?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          doc_type: string
          expires_at: string | null
          file_name: string
          file_url: string
          id: string
          rejection_reason: string | null
          status: string | null
          uploaded_at: string | null
          user_id: string
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          doc_type: string
          expires_at?: string | null
          file_name: string
          file_url: string
          id?: string
          rejection_reason?: string | null
          status?: string | null
          uploaded_at?: string | null
          user_id: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          doc_type?: string
          expires_at?: string | null
          file_name?: string
          file_url?: string
          id?: string
          rejection_reason?: string | null
          status?: string | null
          uploaded_at?: string | null
          user_id?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reminder_templates: {
        Row: {
          category: string | null
          code: string
          created_at: string | null
          id: string
          message_de: string
          message_en: string
        }
        Insert: {
          category?: string | null
          code: string
          created_at?: string | null
          id?: string
          message_de: string
          message_en: string
        }
        Update: {
          category?: string | null
          code?: string
          created_at?: string | null
          id?: string
          message_de?: string
          message_en?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          action_taken_at: string | null
          channel: string | null
          id: string
          message: string
          priority: string | null
          read_at: string | null
          recipient_id: string
          related_doc_type: string | null
          related_task_id: string | null
          sender_id: string
          sent_at: string | null
          template_id: string | null
          type: string | null
        }
        Insert: {
          action_taken_at?: string | null
          channel?: string | null
          id?: string
          message: string
          priority?: string | null
          read_at?: string | null
          recipient_id: string
          related_doc_type?: string | null
          related_task_id?: string | null
          sender_id: string
          sent_at?: string | null
          template_id?: string | null
          type?: string | null
        }
        Update: {
          action_taken_at?: string | null
          channel?: string | null
          id?: string
          message?: string
          priority?: string | null
          read_at?: string | null
          recipient_id?: string
          related_doc_type?: string | null
          related_task_id?: string | null
          sender_id?: string
          sent_at?: string | null
          template_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminders_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_related_task_id_fkey"
            columns: ["related_task_id"]
            isOneToOne: false
            referencedRelation: "user_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string
          created_at: string | null
          deadline_offset_days: number
          description_de: string | null
          description_en: string | null
          guide_steps: Json | null
          id: string
          priority: string | null
          required_documents: string[] | null
          title_de: string
          title_en: string
          xp_value: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          deadline_offset_days: number
          description_de?: string | null
          description_en?: string | null
          guide_steps?: Json | null
          id?: string
          priority?: string | null
          required_documents?: string[] | null
          title_de: string
          title_en: string
          xp_value?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          deadline_offset_days?: number
          description_de?: string | null
          description_en?: string | null
          guide_steps?: Json | null
          id?: string
          priority?: string | null
          required_documents?: string[] | null
          title_de?: string
          title_en?: string
          xp_value?: number | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          deadline: string | null
          id: string
          reminder_sent_count: number | null
          status: string | null
          task_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          reminder_sent_count?: number | null
          status?: string | null
          task_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          reminder_sent_count?: number | null
          status?: string | null
          task_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          arrival_date: string | null
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          email: string
          first_name: string
          hr_manager_id: string | null
          id: string
          job_type: string | null
          language_level: string | null
          last_name: string
          nationality: string | null
          role: string
          updated_at: string | null
          xp_points: number | null
        }
        Insert: {
          arrival_date?: string | null
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email: string
          first_name: string
          hr_manager_id?: string | null
          id: string
          job_type?: string | null
          language_level?: string | null
          last_name: string
          nationality?: string | null
          role: string
          updated_at?: string | null
          xp_points?: number | null
        }
        Update: {
          arrival_date?: string | null
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          hr_manager_id?: string | null
          id?: string
          job_type?: string | null
          language_level?: string | null
          last_name?: string
          nationality?: string | null
          role?: string
          updated_at?: string | null
          xp_points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_hr_manager_id_fkey"
            columns: ["hr_manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

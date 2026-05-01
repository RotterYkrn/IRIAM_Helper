export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      endurance_action_counts: {
        Row: {
          created_at: string
          id: string
          normal_count: number
          project_id: string
          rescue_count: number
          sabotage_count: number
          unit_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          normal_count?: number
          project_id: string
          rescue_count?: number
          sabotage_count?: number
          unit_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          normal_count?: number
          project_id?: string
          rescue_count?: number
          sabotage_count?: number
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_endurance_action_counts_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_endurance_action_counts_unit"
            columns: ["unit_id"]
            isOneToOne: true
            referencedRelation: "endurance_units"
            referencedColumns: ["id"]
          },
        ]
      }
      endurance_action_histories_new: {
        Row: {
          action_amount: number
          action_count: number
          action_id: string | null
          action_type: string
          created_at: string
          id: string
          project_id: string
          unit_id: string
        }
        Insert: {
          action_amount: number
          action_count: number
          action_id?: string | null
          action_type: string
          created_at?: string
          id?: string
          project_id: string
          unit_id: string
        }
        Update: {
          action_amount?: number
          action_count?: number
          action_id?: string | null
          action_type?: string
          created_at?: string
          id?: string
          project_id?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_endurance_histories_actions"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "endurance_actions_new"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_endurance_histories_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_endurance_histories_unit"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "endurance_units"
            referencedColumns: ["id"]
          },
        ]
      }
      endurance_actions_new: {
        Row: {
          amount: number
          count: number
          created_at: string
          id: string
          label: string
          position: number
          project_id: string
          type: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          count?: number
          created_at?: string
          id?: string
          label: string
          position: number
          project_id: string
          type: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          count?: number
          created_at?: string
          id?: string
          label?: string
          position?: number
          project_id?: string
          type?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_action_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_action_unit"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "endurance_units"
            referencedColumns: ["id"]
          },
        ]
      }
      endurance_units: {
        Row: {
          created_at: string
          current_count: number
          id: string
          label: string
          position: number
          project_id: string
          target_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_count?: number
          id?: string
          label: string
          position?: number
          project_id: string
          target_count: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_count?: number
          id?: string
          label?: string
          position?: number
          project_id?: string
          target_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_endurance_unit_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      enter_logs: {
        Row: {
          entered_at: string
          id: string
          project_id: string
          unit_id: string
          user_name: string
        }
        Insert: {
          entered_at?: string
          id?: string
          project_id: string
          unit_id: string
          user_name: string
        }
        Update: {
          entered_at?: string
          id?: string
          project_id?: string
          unit_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_enter_log_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_enter_log_unit"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "enter_units"
            referencedColumns: ["id"]
          },
        ]
      }
      enter_units: {
        Row: {
          completed_at: string | null
          created_at: string
          enter_count: number
          event_date: string
          id: string
          project_id: string
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          enter_count?: number
          event_date: string
          id?: string
          project_id: string
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          enter_count?: number
          event_date?: string
          id?: string
          project_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_enter_unit_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          id: string
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_project: { Args: { p_project_id: string }; Returns: string }
      create_endurance_project_new: {
        Args: {
          p_rescue_actions: Database["public"]["CompositeTypes"]["create_endurance_action_args"][]
          p_sabotage_actions: Database["public"]["CompositeTypes"]["create_endurance_action_args"][]
          p_target_count: number
          p_title: string
        }
        Returns: string
      }
      create_enter_endurance_project: { Args: never; Returns: string }
      create_enter_unit: {
        Args: { p_event_date: string; p_project_id: string }
        Returns: string
      }
      create_multi_endurance_project: {
        Args: { p_event_date: string }
        Returns: string
      }
      delete_project: { Args: { p_project_id: string }; Returns: undefined }
      duplicate_endurance_project: {
        Args: { p_project_id: string }
        Returns: string
      }
      duplicate_multi_endurance_project: {
        Args: { p_project_id: string }
        Returns: string
      }
      finish_project: { Args: { p_project_id: string }; Returns: string }
      log_endurance_action_history_new: {
        Args: {
          p_action_count: number
          p_action_history_type: string
          p_action_id?: string
          p_project_id: string
          p_unit_id: string
        }
        Returns: string
      }
      log_enter: {
        Args: {
          p_entered_at: string
          p_project_id: string
          p_unit_id: string
          p_user_name: string
        }
        Returns: string
      }
      log_multi_endurance_action_history: {
        Args: {
          p_action_count: number
          p_project_id: string
          p_unit_id: string
        }
        Returns: string
      }
      update_endurance_project_new: {
        Args: {
          p_project_id: string
          p_rescue_actions: Database["public"]["CompositeTypes"]["update_endurance_action_args"][]
          p_sabotage_actions: Database["public"]["CompositeTypes"]["update_endurance_action_args"][]
          p_target_count: number
          p_title: string
          p_unit_id: string
        }
        Returns: string
      }
      update_multi_endurance_project: {
        Args: {
          p_project_id: string
          p_title: string
          p_units: Database["public"]["CompositeTypes"]["update_unit_args"][]
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      create_endurance_action_args: {
        position: number | null
        label: string | null
        amount: number | null
      }
      create_unit_args: {
        position: number | null
        label: string | null
        target_count: number | null
      }
      update_endurance_action_args: {
        id: string | null
        position: number | null
        label: string | null
        amount: number | null
      }
      update_unit_args: {
        id: string | null
        position: number | null
        label: string | null
        target_count: number | null
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const


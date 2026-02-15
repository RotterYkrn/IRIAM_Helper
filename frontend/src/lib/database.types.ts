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
      endurance_action_histories: {
        Row: {
          action_amount: number
          action_id: string | null
          action_type: string
          created_at: string
          id: string
          is_reversal: boolean
          project_id: string
        }
        Insert: {
          action_amount: number
          action_id?: string | null
          action_type: string
          created_at?: string
          id?: string
          is_reversal?: boolean
          project_id: string
        }
        Update: {
          action_amount?: number
          action_id?: string | null
          action_type?: string
          created_at?: string
          id?: string
          is_reversal?: boolean
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_endurance_histories_actions"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "endurance_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_endurance_histories_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "endurance_action_stats_view"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "fk_endurance_histories_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "endurance_project_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_endurance_histories_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      endurance_actions: {
        Row: {
          amount: number
          created_at: string
          id: string
          label: string
          position: number
          project_id: string
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          label: string
          position: number
          project_id: string
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          label?: string
          position?: number
          project_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_action_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "endurance_action_stats_view"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "fk_action_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "endurance_project_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_action_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      endurance_progress: {
        Row: {
          created_at: string
          current_count: number
          id: string
          normal_count: number
          project_id: string
          rescue_count: number
          sabotage_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_count?: number
          id?: string
          normal_count?: number
          project_id: string
          rescue_count?: number
          sabotage_count?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_count?: number
          id?: string
          normal_count?: number
          project_id?: string
          rescue_count?: number
          sabotage_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_endurance_progress_project"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "endurance_action_stats_view"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "fk_endurance_progress_project"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "endurance_project_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_endurance_progress_project"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      endurance_settings: {
        Row: {
          created_at: string
          id: string
          project_id: string
          target_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          target_count: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          target_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_endurance_settings_project"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "endurance_action_stats_view"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "fk_endurance_settings_project"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "endurance_project_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_endurance_settings_project"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      multi_endurance_progress: {
        Row: {
          created_at: string
          current_count: number
          id: string
          setting_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_count?: number
          id?: string
          setting_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_count?: number
          id?: string
          setting_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_multi_endurance_progress_setting"
            columns: ["setting_id"]
            isOneToOne: true
            referencedRelation: "multi_endurance_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      multi_endurance_settings: {
        Row: {
          created_at: string
          id: string
          label: string
          project_id: string
          target_count: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          project_id: string
          target_count: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          project_id?: string
          target_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_multi_endurance_setting_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "endurance_action_stats_view"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "fk_multi_endurance_setting_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "endurance_project_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_multi_endurance_setting_project"
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
      endurance_action_stats_view: {
        Row: {
          project_id: string | null
          rescue_actions:
            | Database["public"]["CompositeTypes"]["endurance_action_stat"][]
            | null
          sabotage_actions:
            | Database["public"]["CompositeTypes"]["endurance_action_stat"][]
            | null
        }
        Relationships: []
      }
      endurance_project_view: {
        Row: {
          current_count: number | null
          id: string | null
          normal_count: number | null
          rescue_count: number | null
          sabotage_count: number | null
          status: string | null
          target_count: number | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      activate_project: { Args: { p_project_id: string }; Returns: string }
      create_endurance_project: {
        Args: {
          p_rescue_actions: Database["public"]["CompositeTypes"]["create_endurance_action_args"][]
          p_sabotage_actions: Database["public"]["CompositeTypes"]["create_endurance_action_args"][]
          p_target_count: number
          p_title: string
        }
        Returns: string
      }
      delete_project: { Args: { p_project_id: string }; Returns: undefined }
      duplicate_project: { Args: { p_project_id: string }; Returns: string }
      finish_project: { Args: { p_project_id: string }; Returns: string }
      increment_multi_endurance: {
        Args: { p_setting_id: string }
        Returns: string
      }
      log_endurance_action_history: {
        Args: {
          p_action_history_type: string
          p_action_id?: string
          p_project_id: string
        }
        Returns: string
      }
      update_endurance_project: {
        Args: {
          p_project_id: string
          p_rescue_actions: Database["public"]["CompositeTypes"]["update_endurance_action_args"][]
          p_sabotage_actions: Database["public"]["CompositeTypes"]["update_endurance_action_args"][]
          p_target_count: number
          p_title: string
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
      endurance_action_stat: {
        id: string | null
        type: string | null
        position: number | null
        label: string | null
        amount: number | null
        action_times: number | null
      }
      update_endurance_action_args: {
        id: string | null
        position: number | null
        label: string | null
        amount: number | null
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


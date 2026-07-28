export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      goals: {
        Row: {
          completed_on: string | null;
          created_at: string;
          display_order: number;
          id: string;
          is_active: boolean;
          target_weight_kg: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed_on?: string | null;
          created_at?: string;
          display_order: number;
          id?: string;
          is_active?: boolean;
          target_weight_kg: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed_on?: string | null;
          created_at?: string;
          display_order?: number;
          id?: string;
          is_active?: boolean;
          target_weight_kg?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string;
          height_cm: number;
          id: string;
          initial_weight_kg: number;
          name: string;
          theme_preference: "dark" | "light" | "system";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          height_cm: number;
          id?: string;
          initial_weight_kg: number;
          name: string;
          theme_preference?: "dark" | "light" | "system";
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          height_cm?: number;
          id?: string;
          initial_weight_kg?: number;
          name?: string;
          theme_preference?: "dark" | "light" | "system";
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      weigh_ins: {
        Row: {
          created_at: string;
          id: string;
          notes: string | null;
          updated_at: string;
          user_id: string;
          waist_cm: number | null;
          weighed_on: string;
          weight_kg: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          notes?: string | null;
          updated_at?: string;
          user_id: string;
          waist_cm?: number | null;
          weighed_on: string;
          weight_kg: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          notes?: string | null;
          updated_at?: string;
          user_id?: string;
          waist_cm?: number | null;
          weighed_on?: string;
          weight_kg?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      activate_goal: {
        Args: {
          p_goal_id: string;
        };
        Returns: Database["public"]["Tables"]["goals"]["Row"];
      };
      complete_onboarding: {
        Args: {
          p_height_cm: number;
          p_initial_weight_kg: number;
          p_name: string;
          p_target_weight_kg: number;
        };
        Returns: Database["public"]["Tables"]["profiles"]["Row"];
      };
      delete_own_account: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      move_pending_goal: {
        Args: {
          p_direction: string;
          p_goal_id: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Row"];

export type TablesInsert<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Insert"];

export type TablesUpdate<
  TableName extends keyof Database["public"]["Tables"],
> = Database["public"]["Tables"][TableName]["Update"];

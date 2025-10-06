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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      about_achievements: {
        Row: {
          created_at: string
          icon_name: string
          id: string
          label: string
          sort_order: number
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          icon_name: string
          id?: string
          label: string
          sort_order?: number
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          icon_name?: string
          id?: string
          label?: string
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      about_content: {
        Row: {
          button_text: string | null
          created_at: string
          description: string | null
          id: string
          section_key: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          button_text?: string | null
          created_at?: string
          description?: string | null
          id?: string
          section_key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          button_text?: string | null
          created_at?: string
          description?: string | null
          id?: string
          section_key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      about_services: {
        Row: {
          created_at: string
          description: string
          id: string
          sort_order: number
          specialties: string[]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          sort_order?: number
          specialties?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          sort_order?: number
          specialties?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      about_skills: {
        Row: {
          created_at: string
          id: string
          percentage: number
          skill_name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          percentage: number
          skill_name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          percentage?: number
          skill_name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string | null
          budget_range: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          deposit_amount: number | null
          event_date: string | null
          event_location: string | null
          id: string
          message: string | null
          notes: string | null
          package_type: string
          payment_status: string | null
          preferred_time: string | null
          service_type: string
          status: string | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          booking_date?: string | null
          budget_range: string
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          deposit_amount?: number | null
          event_date?: string | null
          event_location?: string | null
          id?: string
          message?: string | null
          notes?: string | null
          package_type: string
          payment_status?: string | null
          preferred_time?: string | null
          service_type: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          booking_date?: string | null
          budget_range?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          deposit_amount?: number | null
          event_date?: string | null
          event_location?: string | null
          id?: string
          message?: string | null
          notes?: string | null
          package_type?: string
          payment_status?: string | null
          preferred_time?: string | null
          service_type?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      hero_stats: {
        Row: {
          created_at: string
          icon_name: string
          id: string
          label: string
          sort_order: number
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          icon_name: string
          id?: string
          label: string
          sort_order?: number
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          icon_name?: string
          id?: string
          label?: string
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string | null
          source: string | null
          subscribed_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          downloads_count: number
          id: string
          image_url: string
          is_featured: boolean | null
          likes_count: number
          shares_count: number
          sort_order: number | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          downloads_count?: number
          id?: string
          image_url: string
          is_featured?: boolean | null
          likes_count?: number
          shares_count?: number
          sort_order?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          downloads_count?: number
          id?: string
          image_url?: string
          is_featured?: boolean | null
          likes_count?: number
          shares_count?: number
          sort_order?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_name: string
          client_photo_url: string | null
          client_role: string
          created_at: string
          display_order: number | null
          id: string
          is_featured: boolean | null
          rating: number
          review_text: string
          service_type: string
          updated_at: string
        }
        Insert: {
          client_name: string
          client_photo_url?: string | null
          client_role: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          rating: number
          review_text: string
          service_type: string
          updated_at?: string
        }
        Update: {
          client_name?: string
          client_photo_url?: string | null
          client_role?: string
          created_at?: string
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          rating?: number
          review_text?: string
          service_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_photo_stat: {
        Args: { photo_id: string; stat_type: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const

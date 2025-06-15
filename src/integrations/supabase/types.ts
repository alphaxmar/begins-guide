export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_settings: {
        Row: {
          created_at: string
          description: string | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      articles: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          slug: string
          status: Database["public"]["Enums"]["article_status"]
          title: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          slug: string
          status?: Database["public"]["Enums"]["article_status"]
          title: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["article_status"]
          title?: string
        }
        Relationships: []
      }
      franchise_views: {
        Row: {
          franchise_id: string
          id: number
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          franchise_id: string
          id?: number
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          franchise_id?: string
          id?: number
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_views_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchises: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          investment_max: number | null
          investment_min: number | null
          name: string
          status: Database["public"]["Enums"]["franchise_status"]
          submission_id: string | null
          submitted_by: string | null
          time_commitment:
            | Database["public"]["Enums"]["franchise_time_commitment"]
            | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          investment_max?: number | null
          investment_min?: number | null
          name: string
          status?: Database["public"]["Enums"]["franchise_status"]
          submission_id?: string | null
          submitted_by?: string | null
          time_commitment?:
            | Database["public"]["Enums"]["franchise_time_commitment"]
            | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          investment_max?: number | null
          investment_min?: number | null
          name?: string
          status?: Database["public"]["Enums"]["franchise_status"]
          submission_id?: string | null
          submitted_by?: string | null
          time_commitment?:
            | Database["public"]["Enums"]["franchise_time_commitment"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "franchises_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "partner_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_submissions: {
        Row: {
          admin_notes: string | null
          business_plan: string | null
          category: string | null
          contact_info: Json | null
          description: string | null
          id: string
          image_url: string | null
          investment_max: number | null
          investment_min: number | null
          name: string
          partner_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["franchise_status"]
          submitted_at: string
          time_commitment:
            | Database["public"]["Enums"]["franchise_time_commitment"]
            | null
        }
        Insert: {
          admin_notes?: string | null
          business_plan?: string | null
          category?: string | null
          contact_info?: Json | null
          description?: string | null
          id?: string
          image_url?: string | null
          investment_max?: number | null
          investment_min?: number | null
          name: string
          partner_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["franchise_status"]
          submitted_at?: string
          time_commitment?:
            | Database["public"]["Enums"]["franchise_time_commitment"]
            | null
        }
        Update: {
          admin_notes?: string | null
          business_plan?: string | null
          category?: string | null
          contact_info?: Json | null
          description?: string | null
          id?: string
          image_url?: string | null
          investment_max?: number | null
          investment_min?: number | null
          name?: string
          partner_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["franchise_status"]
          submitted_at?: string
          time_commitment?:
            | Database["public"]["Enums"]["franchise_time_commitment"]
            | null
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          instructor_id: string | null
          price: number
          product_type: Database["public"]["Enums"]["product_type"]
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          price: number
          product_type?: Database["public"]["Enums"]["product_type"]
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instructor_id?: string | null
          price?: number
          product_type?: Database["public"]["Enums"]["product_type"]
          slug?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          franchise_id: string
          id: string
          rating: number
          status: Database["public"]["Enums"]["review_status"]
          title: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          franchise_id: string
          id?: string
          rating: number
          status?: Database["public"]["Enums"]["review_status"]
          title: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          franchise_id?: string
          id?: string
          rating?: number
          status?: Database["public"]["Enums"]["review_status"]
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_franchises: {
        Row: {
          created_at: string
          franchise_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          franchise_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          franchise_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_franchises_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_has_role: {
        Args: { role_to_check: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      get_monthly_signups: {
        Args: Record<PropertyKey, never>
        Returns: {
          signup_month: string
          users_count: number
          partners_count: number
        }[]
      }
      get_partner_franchise_stats: {
        Args: { p_partner_id: string }
        Returns: {
          franchise_name: string
          view_count: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "partner"
      article_status: "draft" | "published"
      franchise_status: "pending" | "approved" | "rejected"
      franchise_time_commitment: "full-time" | "part-time" | "flexible"
      product_type: "course" | "template"
      review_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "partner"],
      article_status: ["draft", "published"],
      franchise_status: ["pending", "approved", "rejected"],
      franchise_time_commitment: ["full-time", "part-time", "flexible"],
      product_type: ["course", "template"],
      review_status: ["pending", "approved", "rejected"],
    },
  },
} as const

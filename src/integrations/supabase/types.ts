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
      generated_images: {
        Row: {
          attributes_id: string | null
          case_id: string
          created_at: string
          generation_metadata: Json | null
          generation_status: string | null
          id: string
          image_data: string | null
          image_url: string | null
        }
        Insert: {
          attributes_id?: string | null
          case_id: string
          created_at?: string
          generation_metadata?: Json | null
          generation_status?: string | null
          id?: string
          image_data?: string | null
          image_url?: string | null
        }
        Update: {
          attributes_id?: string | null
          case_id?: string
          created_at?: string
          generation_metadata?: Json | null
          generation_status?: string | null
          id?: string
          image_data?: string | null
          image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_images_attributes_id_fkey"
            columns: ["attributes_id"]
            isOneToOne: false
            referencedRelation: "suspect_physical_attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_images_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "suspect_case_records"
            referencedColumns: ["id"]
          },
        ]
      }
      image_generation_queue: {
        Row: {
          case_id: string
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          next_retry_at: string | null
          retry_count: number | null
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          case_id: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          next_retry_at?: string | null
          retry_count?: number | null
          started_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          case_id?: string
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          next_retry_at?: string | null
          retry_count?: number | null
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_generation_queue_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "suspect_case_records"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      suspect_case_records: {
        Row: {
          arms_involved: string | null
          contact_number: string | null
          created_at: string
          crime_committed: string | null
          custodies: string | null
          id: string
          incident_location_address: string | null
          incident_location_lat: number | null
          incident_location_lng: number | null
          incident_timestamp: string
          reported_by: string | null
          status: string | null
          surveillance_footage_ref: string | null
          suspect_address: string | null
          suspect_name: string | null
          updated_at: string
          user_id: string
          vehicles_involved: string | null
        }
        Insert: {
          arms_involved?: string | null
          contact_number?: string | null
          created_at?: string
          crime_committed?: string | null
          custodies?: string | null
          id?: string
          incident_location_address?: string | null
          incident_location_lat?: number | null
          incident_location_lng?: number | null
          incident_timestamp?: string
          reported_by?: string | null
          status?: string | null
          surveillance_footage_ref?: string | null
          suspect_address?: string | null
          suspect_name?: string | null
          updated_at?: string
          user_id: string
          vehicles_involved?: string | null
        }
        Update: {
          arms_involved?: string | null
          contact_number?: string | null
          created_at?: string
          crime_committed?: string | null
          custodies?: string | null
          id?: string
          incident_location_address?: string | null
          incident_location_lat?: number | null
          incident_location_lng?: number | null
          incident_timestamp?: string
          reported_by?: string | null
          status?: string | null
          surveillance_footage_ref?: string | null
          suspect_address?: string | null
          suspect_name?: string | null
          updated_at?: string
          user_id?: string
          vehicles_involved?: string | null
        }
        Relationships: []
      }
      suspect_physical_attributes: {
        Row: {
          accessories: string | null
          age: number | null
          beard_color: string | null
          body_type: string | null
          bridge_height: string | null
          case_id: string
          chin_shape: string | null
          created_at: string
          ear_lobes: string | null
          ear_shape: string | null
          ear_size: string | null
          ethnicity: string | null
          eye_bags_wrinkles: string | null
          eye_color: string | null
          eye_shape: string | null
          eye_size_spacing: string | null
          eyebrow_type: string | null
          eyelashes: string | null
          eyelid_type: string | null
          facial_hair_type: string | null
          gender: string | null
          hair_length: string | null
          hair_style: string | null
          hair_texture: string | null
          hairline_shape: string | null
          head_shape: string | null
          height_feet: number | null
          helix_antihelix: string | null
          id: string
          lip_shape: string | null
          lip_thickness: string | null
          mouth_width: string | null
          nose_shape: string | null
          nose_tip_shape: string | null
          nostril_width: string | null
          other_skin_features: string | null
          skin_tone: string | null
          smile_type: string | null
        }
        Insert: {
          accessories?: string | null
          age?: number | null
          beard_color?: string | null
          body_type?: string | null
          bridge_height?: string | null
          case_id: string
          chin_shape?: string | null
          created_at?: string
          ear_lobes?: string | null
          ear_shape?: string | null
          ear_size?: string | null
          ethnicity?: string | null
          eye_bags_wrinkles?: string | null
          eye_color?: string | null
          eye_shape?: string | null
          eye_size_spacing?: string | null
          eyebrow_type?: string | null
          eyelashes?: string | null
          eyelid_type?: string | null
          facial_hair_type?: string | null
          gender?: string | null
          hair_length?: string | null
          hair_style?: string | null
          hair_texture?: string | null
          hairline_shape?: string | null
          head_shape?: string | null
          height_feet?: number | null
          helix_antihelix?: string | null
          id?: string
          lip_shape?: string | null
          lip_thickness?: string | null
          mouth_width?: string | null
          nose_shape?: string | null
          nose_tip_shape?: string | null
          nostril_width?: string | null
          other_skin_features?: string | null
          skin_tone?: string | null
          smile_type?: string | null
        }
        Update: {
          accessories?: string | null
          age?: number | null
          beard_color?: string | null
          body_type?: string | null
          bridge_height?: string | null
          case_id?: string
          chin_shape?: string | null
          created_at?: string
          ear_lobes?: string | null
          ear_shape?: string | null
          ear_size?: string | null
          ethnicity?: string | null
          eye_bags_wrinkles?: string | null
          eye_color?: string | null
          eye_shape?: string | null
          eye_size_spacing?: string | null
          eyebrow_type?: string | null
          eyelashes?: string | null
          eyelid_type?: string | null
          facial_hair_type?: string | null
          gender?: string | null
          hair_length?: string | null
          hair_style?: string | null
          hair_texture?: string | null
          hairline_shape?: string | null
          head_shape?: string | null
          height_feet?: number | null
          helix_antihelix?: string | null
          id?: string
          lip_shape?: string | null
          lip_thickness?: string | null
          mouth_width?: string | null
          nose_shape?: string | null
          nose_tip_shape?: string | null
          nostril_width?: string | null
          other_skin_features?: string | null
          skin_tone?: string | null
          smile_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suspect_physical_attributes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "suspect_case_records"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_next_processing_slot: { Args: never; Returns: string }
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

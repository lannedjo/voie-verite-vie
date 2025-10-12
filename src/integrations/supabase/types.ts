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
      courses: {
        Row: {
          chapter_number: number | null
          content_en: string
          content_fr: string
          created_at: string | null
          exam_id: string
          id: string
          is_published: boolean | null
          order_index: number | null
          subject: string
          title_en: string
          title_fr: string
          updated_at: string | null
        }
        Insert: {
          chapter_number?: number | null
          content_en: string
          content_fr: string
          created_at?: string | null
          exam_id: string
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          subject: string
          title_en: string
          title_fr: string
          updated_at?: string | null
        }
        Update: {
          chapter_number?: number | null
          content_en?: string
          content_fr?: string
          created_at?: string | null
          exam_id?: string
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          subject?: string
          title_en?: string
          title_fr?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          base_price: number
          created_at: string | null
          description_en: string | null
          description_fr: string | null
          education_level: string
          id: string
          is_active: boolean | null
          name_en: string
          name_fr: string
        }
        Insert: {
          base_price: number
          created_at?: string | null
          description_en?: string | null
          description_fr?: string | null
          education_level: string
          id?: string
          is_active?: boolean | null
          name_en: string
          name_fr: string
        }
        Update: {
          base_price?: number
          created_at?: string | null
          description_en?: string | null
          description_fr?: string | null
          education_level?: string
          id?: string
          is_active?: boolean | null
          name_en?: string
          name_fr?: string
        }
        Relationships: []
      }
      mock_exam_registrations: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          mock_exam_id: string
          registration_status: string | null
          started_at: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          mock_exam_id: string
          registration_status?: string | null
          started_at?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          mock_exam_id?: string
          registration_status?: string | null
          started_at?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_exam_registrations_mock_exam_id_fkey"
            columns: ["mock_exam_id"]
            isOneToOne: false
            referencedRelation: "mock_exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_exam_registrations_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_exam_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_exam_results: {
        Row: {
          answers: Json | null
          correct_answers: number
          created_at: string | null
          id: string
          rank: number | null
          registration_id: string
          score: number
          total_questions: number
        }
        Insert: {
          answers?: Json | null
          correct_answers: number
          created_at?: string | null
          id?: string
          rank?: number | null
          registration_id: string
          score: number
          total_questions: number
        }
        Update: {
          answers?: Json | null
          correct_answers?: number
          created_at?: string | null
          id?: string
          rank?: number | null
          registration_id?: string
          score?: number
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "mock_exam_results_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "mock_exam_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_exams: {
        Row: {
          created_at: string | null
          description_en: string | null
          description_fr: string | null
          duration_minutes: number
          exam_id: string
          id: string
          is_active: boolean | null
          max_participants: number | null
          registration_fee: number
          scheduled_at: string
          title_en: string
          title_fr: string
        }
        Insert: {
          created_at?: string | null
          description_en?: string | null
          description_fr?: string | null
          duration_minutes: number
          exam_id: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          registration_fee: number
          scheduled_at: string
          title_en: string
          title_fr: string
        }
        Update: {
          created_at?: string | null
          description_en?: string | null
          description_fr?: string | null
          duration_minutes?: number
          exam_id?: string
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          registration_fee?: number
          scheduled_at?: string
          title_en?: string
          title_fr?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_exams_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_downloads: {
        Row: {
          content_id: string
          content_type: string
          downloaded_at: string | null
          id: string
          user_id: string
          watermark_text: string
        }
        Insert: {
          content_id: string
          content_type: string
          downloaded_at?: string | null
          id?: string
          user_id: string
          watermark_text: string
        }
        Update: {
          content_id?: string
          content_type?: string
          downloaded_at?: string | null
          id?: string
          user_id?: string
          watermark_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "pdf_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_attempts: {
        Row: {
          attempted_at: string | null
          id: string
          is_correct: boolean | null
          question_id: string
          user_answer: string | null
          user_id: string
        }
        Insert: {
          attempted_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id: string
          user_answer?: string | null
          user_id: string
        }
        Update: {
          attempted_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string
          user_answer?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "practice_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_questions: {
        Row: {
          correct_answer: string | null
          created_at: string | null
          difficulty: string | null
          exam_id: string
          explanation_en: string | null
          explanation_fr: string | null
          id: string
          options: Json | null
          question_text_en: string
          question_text_fr: string
          question_type: string
          subject: string
          year: number | null
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string | null
          difficulty?: string | null
          exam_id: string
          explanation_en?: string | null
          explanation_fr?: string | null
          id?: string
          options?: Json | null
          question_text_en: string
          question_text_fr: string
          question_type: string
          subject: string
          year?: number | null
        }
        Update: {
          correct_answer?: string | null
          created_at?: string | null
          difficulty?: string | null
          exam_id?: string
          explanation_en?: string | null
          explanation_fr?: string | null
          id?: string
          options?: Json | null
          question_text_en?: string
          question_text_fr?: string
          question_type?: string
          subject?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          commission_amount: number | null
          commission_paid: boolean | null
          commission_rate: number | null
          created_at: string | null
          id: string
          referred_user_id: string
          referrer_user_id: string
          transaction_id: string | null
        }
        Insert: {
          commission_amount?: number | null
          commission_paid?: boolean | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          referred_user_id: string
          referrer_user_id: string
          transaction_id?: string | null
        }
        Update: {
          commission_amount?: number | null
          commission_paid?: boolean | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          referred_user_id?: string
          referrer_user_id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_user_id_fkey"
            columns: ["referrer_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          exam_id: string
          expires_at: string | null
          id: string
          price_paid: number
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          exam_id: string
          expires_at?: string | null
          id?: string
          price_paid: number
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          exam_id?: string
          expires_at?: string | null
          id?: string
          price_paid?: number
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          status: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          education_level: string
          email: string
          full_name: string
          id: string
          is_master_account: boolean | null
          phone: string | null
          referral_code: string
          referred_by_code: string | null
          secret_code: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          education_level: string
          email: string
          full_name: string
          id: string
          is_master_account?: boolean | null
          phone?: string | null
          referral_code: string
          referred_by_code?: string | null
          secret_code: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          education_level?: string
          email?: string
          full_name?: string
          id?: string
          is_master_account?: boolean | null
          phone?: string | null
          referral_code?: string
          referred_by_code?: string | null
          secret_code?: string
          updated_at?: string | null
        }
        Relationships: []
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

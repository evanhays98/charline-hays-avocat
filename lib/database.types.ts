export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          availability: string[];
          created_at: string;
          email: string;
          ends_at: string | null;
          format: Database["public"]["Enums"]["consultation_format"];
          full_name: string;
          id: string;
          message: string | null;
          phone: string | null;
          starts_at: string | null;
          status: Database["public"]["Enums"]["booking_status"];
          subject: string;
        };
        ComputedFields: never;
        Insert: {
          availability?: string[];
          created_at?: string;
          email: string;
          ends_at?: string | null;
          format?: Database["public"]["Enums"]["consultation_format"];
          full_name: string;
          id?: string;
          message?: string | null;
          phone?: string | null;
          starts_at?: string | null;
          status?: Database["public"]["Enums"]["booking_status"];
          subject: string;
        };
        Update: {
          availability?: string[];
          created_at?: string;
          email?: string;
          ends_at?: string | null;
          format?: Database["public"]["Enums"]["consultation_format"];
          full_name?: string;
          id?: string;
          message?: string | null;
          phone?: string | null;
          starts_at?: string | null;
          status?: Database["public"]["Enums"]["booking_status"];
          subject?: string;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          auth: string;
          created_at: string;
          endpoint: string;
          id: string;
          p256dh: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          auth: string;
          created_at?: string;
          endpoint: string;
          id?: string;
          p256dh: string;
          user_id?: string;
        };
        Update: {
          auth?: string;
          created_at?: string;
          endpoint?: string;
          id?: string;
          p256dh?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          calendar_token: string;
          horizon_days: number;
          id: boolean;
          min_notice_hours: number;
          slot_minutes: number;
          timezone: string;
        };
        ComputedFields: never;
        Insert: {
          calendar_token?: string;
          horizon_days?: number;
          id?: boolean;
          min_notice_hours?: number;
          slot_minutes?: number;
          timezone?: string;
        };
        Update: {
          calendar_token?: string;
          horizon_days?: number;
          id?: boolean;
          min_notice_hours?: number;
          slot_minutes?: number;
          timezone?: string;
        };
        Relationships: [];
      };
      time_off: {
        Row: {
          ends_at: string;
          id: string;
          label: string | null;
          starts_at: string;
        };
        ComputedFields: never;
        Insert: {
          ends_at: string;
          id?: string;
          label?: string | null;
          starts_at: string;
        };
        Update: {
          ends_at?: string;
          id?: string;
          label?: string | null;
          starts_at?: string;
        };
        Relationships: [];
      };
      weekly_hours: {
        Row: {
          ends_at: string;
          id: string;
          starts_at: string;
          weekday: number;
        };
        ComputedFields: never;
        Insert: {
          ends_at: string;
          id?: string;
          starts_at: string;
          weekday: number;
        };
        Update: {
          ends_at?: string;
          id?: string;
          starts_at?: string;
          weekday?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_time_off: {
        Args: {
          first_day: string;
          from_time?: string;
          label?: string;
          last_day: string;
          to_time?: string;
        };
        Returns: {
          ends_at: string;
          id: string;
          label: string | null;
          starts_at: string;
        };
        SetofOptions: {
          from: "*";
          to: "time_off";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      free_slots: {
        Args: { range_end: string; range_start: string };
        Returns: {
          ends_at: string;
          starts_at: string;
        }[];
      };
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
      ping: { Args: Record<PropertyKey, never>; Returns: boolean };
      regenerate_calendar_token: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      replace_weekly_hours: { Args: { hours: Json }; Returns: undefined };
    };
    Enums: {
      booking_status: "pending" | "confirmed" | "declined" | "cancelled";
      consultation_format: "cabinet" | "visio" | "telephone";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      booking_status: ["pending", "confirmed", "declined", "cancelled"],
      consultation_format: ["cabinet", "visio", "telephone"],
    },
  },
} as const;

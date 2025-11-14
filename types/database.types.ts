export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      heavy_equipment: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          specifications: Json | null
          price_per_hour: number | null
          image_url: string | null
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          specifications?: Json | null
          price_per_hour?: number | null
          image_url?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          specifications?: Json | null
          price_per_hour?: number | null
          image_url?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      equipment_images: {
        Row: {
          id: string
          equipment_id: string
          image_url: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          image_url: string
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          image_url?: string
          is_primary?: boolean
          created_at?: string
        }
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
  }
}

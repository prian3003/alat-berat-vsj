import { Database } from './database.types'

export type HeavyEquipment = Database['public']['Tables']['heavy_equipment']['Row']
export type HeavyEquipmentInsert = Database['public']['Tables']['heavy_equipment']['Insert']
export type HeavyEquipmentUpdate = Database['public']['Tables']['heavy_equipment']['Update']

export type EquipmentImage = Database['public']['Tables']['equipment_images']['Row']

export interface HeavyEquipmentWithImages extends HeavyEquipment {
  equipment_images?: EquipmentImage[]
}

export type EquipmentCategory =
  | 'excavator'
  | 'bulldozer'
  | 'loader'
  | 'dump_truck'
  | 'other'

export const EQUIPMENT_CATEGORIES: { value: EquipmentCategory; label: string }[] = [
  { value: 'excavator', label: 'Excavator' },
  { value: 'bulldozer', label: 'Bulldozer' },
  { value: 'loader', label: 'Loader' },
  { value: 'dump_truck', label: 'Dump Truck' },
  { value: 'other', label: 'Lainnya' },
]

// Blog Post Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  author_name: string
  reading_time: number
  tags: string[]
}

export interface BlogPostInsert {
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image?: string | null
  published?: boolean
  published_at?: string | null
  author_name: string
  reading_time?: number
  tags?: string[]
}

export interface BlogPostUpdate {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  featured_image?: string | null
  published?: boolean
  published_at?: string | null
  author_name?: string
  reading_time?: number
  tags?: string[]
}

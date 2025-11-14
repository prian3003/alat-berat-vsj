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
  | 'crane'
  | 'loader'
  | 'forklift'
  | 'dump_truck'
  | 'grader'
  | 'roller'
  | 'other'

export const EQUIPMENT_CATEGORIES: { value: EquipmentCategory; label: string }[] = [
  { value: 'excavator', label: 'Excavator' },
  { value: 'bulldozer', label: 'Bulldozer' },
  { value: 'crane', label: 'Crane' },
  { value: 'loader', label: 'Loader' },
  { value: 'forklift', label: 'Forklift' },
  { value: 'dump_truck', label: 'Dump Truck' },
  { value: 'grader', label: 'Grader' },
  { value: 'roller', label: 'Roller' },
  { value: 'other', label: 'Lainnya' },
]

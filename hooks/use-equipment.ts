import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { HeavyEquipmentWithImages } from '@/types'

export function useEquipment() {
  const [equipment, setEquipment] = useState<HeavyEquipmentWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data, error: fetchError } = await supabase
        .from('heavy_equipment')
        .select(`
          *,
          equipment_images (*)
        `)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setEquipment(data as HeavyEquipmentWithImages[])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchEquipment()
  }

  return { equipment, loading, error, refetch }
}

export function useEquipmentByCategory(category: string | null) {
  const [equipment, setEquipment] = useState<HeavyEquipmentWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchEquipment()
  }, [category])

  const fetchEquipment = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      let query = supabase
        .from('heavy_equipment')
        .select(`
          *,
          equipment_images (*)
        `)
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      setEquipment(data as HeavyEquipmentWithImages[])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { equipment, loading, error }
}

'use client'

import { useState } from 'react'
import { HeavyEquipmentWithImages } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { useConfirm } from '@/hooks/use-confirm'

interface EquipmentTableProps {
  equipment: HeavyEquipmentWithImages[]
  onEdit: (equipment: HeavyEquipmentWithImages) => void
  onRefresh: () => void
}

export function EquipmentTable({ equipment, onEdit, onRefresh }: EquipmentTableProps) {
  const { toast } = useToast()
  const { confirm } = useConfirm()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirm({
      title: "Hapus Alat Berat",
      description: `Apakah Anda yakin ingin menghapus "${name}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      cancelText: "Batal"
    })

    if (!confirmed) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/equipment/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete equipment')
      }

      toast({
        variant: "success",
        title: "Berhasil",
        description: "Alat berat berhasil dihapus",
      })

      onRefresh()
    } catch (error) {
      console.error('Error deleting equipment:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus data",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const formatPrice = (price: number | null) => {
    if (!price) return '-'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      excavator: 'Excavator',
      bulldozer: 'Bulldozer',
      crane: 'Crane',
      loader: 'Loader',
      forklift: 'Forklift',
      dump_truck: 'Dump Truck',
      grader: 'Grader',
      roller: 'Roller',
      other: 'Lainnya',
    }
    return categories[category] || category
  }

  if (equipment.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-slate-600">Belum ada data alat berat.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga/Jam</TableHead>
            <TableHead>Gambar</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipment.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{getCategoryLabel(item.category)}</TableCell>
              <TableCell>{formatPrice(item.price_per_hour)}</TableCell>
              <TableCell>
                <span className="text-sm text-slate-600">
                  {item.equipment_images?.length || 0} gambar
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={item.is_available ? 'default' : 'secondary'}>
                  {item.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(item)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(item.id, item.name)}
                      disabled={deletingId === item.id}
                      className="text-red-600"
                    >
                      {deletingId === item.id ? 'Menghapus...' : 'Hapus'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

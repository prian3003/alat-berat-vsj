'use client'

import { useState } from 'react'
import { useEquipmentByCategory } from '@/hooks/use-equipment'
import { EquipmentCard } from './equipment-card'
import { EquipmentDetailModal } from './equipment-detail-modal'
import { Button } from '@/components/ui/button'
import { EQUIPMENT_CATEGORIES, HeavyEquipment } from '@/types'

export function EquipmentList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<HeavyEquipment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { equipment, loading, error} = useEquipmentByCategory(selectedCategory)

  const handleCardClick = (item: HeavyEquipment) => {
    setSelectedEquipment(item)
    setIsModalOpen(true)
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Terjadi kesalahan saat memuat data.</p>
      </div>
    )
  }

  return (
    <section id="equipment" className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-16 sm:py-24">
      {/* Grid Background Pattern - Inverted */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 30px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Sewa Alat Berat Bali - Katalog Lengkap
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Pilih dari berbagai jenis <strong>alat berat berkualitas</strong> untuk proyek konstruksi di Bali.
            Excavator, bulldozer, crane, loader, dan dump truck tersedia dengan <strong>harga per jam terjangkau</strong>.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
          >
            Semua
          </Button>
          {EQUIPMENT_CATEGORIES.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[500px] animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : equipment.length === 0 ? (
          <div className="mt-12 py-12 text-center">
            <p className="text-slate-600">
              Tidak ada alat berat yang tersedia dalam kategori ini.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
                onClick={() => handleCardClick(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <EquipmentDetailModal
        equipment={selectedEquipment}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </section>
  )
}

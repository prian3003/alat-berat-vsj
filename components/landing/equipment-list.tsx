'use client'

import { useState } from 'react'
import Image from 'next/image'
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
    <section id="equipment" className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-12 sm:py-16 md:py-24">
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
          <div className="inline-flex items-center justify-center mb-3">
            <h2 className="text-2xl sm:text-3xl font-bold bg-orange-600 text-white px-6 py-2.5 rounded-xl shadow-md">
              Katalog Alat Berat | Sewa Excavator, Bulldozer
            </h2>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-slate-600">
            Pilih dari berbagai jenis <strong>alat berat berkualitas</strong> untuk proyek konstruksi.
            Excavator, bulldozer, loader, dan dump truck tersedia dengan <strong>harga per jam terjangkau</strong>.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2">
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
          <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 sm:h-80 lg:h-[400px] animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : equipment.length === 0 ? (
          <div className="mt-8 sm:mt-12 py-12 text-center">
            <p className="text-sm sm:text-base text-slate-600">
              Tidak ada alat berat yang tersedia dalam kategori ini.
            </p>
          </div>
        ) : (
          <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
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

      {/* Katalog SVG - Bottom Right Corner */}
      <div className="absolute bottom-0 right-0 w-64 sm:w-80 lg:w-96 h-auto pointer-events-none">
        <Image
          src="/katalog.svg"
          alt="Katalog Alat Berat"
          width={400}
          height={300}
          loading="lazy"
          className="w-full h-auto"
          priority={false}
        />
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

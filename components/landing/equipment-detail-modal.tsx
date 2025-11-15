'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { HeavyEquipmentWithImages } from '@/types'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface EquipmentDetailModalProps {
  equipment: HeavyEquipmentWithImages | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EquipmentDetailModal({ equipment, open, onOpenChange }: EquipmentDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!equipment) return null

  // Get all images - primary + additional images
  const allImages = [
    equipment.image_url,
    ...(equipment.equipment_images?.map(img => img.image_url) || [])
  ].filter(Boolean) as string[]

  const currentImage = allImages[currentImageIndex] || equipment.image_url || '/placeholder-equipment.jpg'

  // Don't render if no valid image
  const hasValidImage = currentImage && currentImage !== '/placeholder-equipment.jpg'

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return '-'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(price))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto" aria-describedby="equipment-description">
        <DialogHeader>
          <DialogTitle className="text-2xl">{equipment.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6" id="equipment-description">
          {/* Image Gallery */}
          {hasValidImage && (
            <div className="relative">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={currentImage}
                  alt={equipment.name}
                  fill
                  className="object-cover"
                  priority
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </div>

            {/* Image Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all hover:bg-white"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        idx === currentImageIndex ? 'w-6 bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            </div>
          )}

          {/* Thumbnails */}
          {hasValidImage && allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative aspect-video overflow-hidden rounded-lg border-2 transition-all ${
                    idx === currentImageIndex ? 'border-orange-500' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${equipment.name} - ${idx + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                    quality={75}
                    sizes="200px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Deskripsi</h3>
              <p className="mt-2 text-slate-600">{equipment.description || 'Tidak ada deskripsi'}</p>
            </div>

            {/* Specifications */}
            {equipment.specifications && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Spesifikasi</h3>
                <dl className="mt-2 grid grid-cols-2 gap-4">
                  {Object.entries(equipment.specifications as Record<string, any>).map(([key, value]) => (
                    <div key={key} className="rounded-lg bg-slate-50 p-3">
                      <dt className="text-sm font-medium capitalize text-slate-600">
                        {key.replace(/_/g, ' ')}
                      </dt>
                      <dd className="mt-1 text-sm text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Harga Sewa</h3>
              <div className="mt-2 rounded-lg bg-orange-50 p-6">
                <p className="text-sm text-orange-600">Tarif Per Jam</p>
                <p className="mt-1 text-3xl font-bold text-orange-900">
                  {formatPrice(equipment.price_per_hour)}
                </p>
                <p className="mt-2 text-xs text-slate-600">*Harga dapat berubah sewaktu-waktu</p>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  equipment.is_available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {equipment.is_available ? 'Tersedia' : 'Tidak Tersedia'}
              </span>
            </div>

            {/* Contact Button */}
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <a
                  href={`https://wa.me/6285813718988?text=${encodeURIComponent(
                    `Halo, saya tertarik dengan ${equipment.name}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hubungi via WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

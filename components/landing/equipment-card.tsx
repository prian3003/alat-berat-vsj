'use client'

import { HeavyEquipmentWithImages } from '@/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'

interface EquipmentCardProps {
  equipment: HeavyEquipmentWithImages
  onClick?: () => void
}

export function EquipmentCard({ equipment, onClick }: EquipmentCardProps) {
  const primaryImage = equipment.equipment_images?.find(img => img.is_primary)?.image_url ||
                       equipment.image_url ||
                       '/images/placeholder.jpg'

  const formatPrice = (price: number | null) => {
    if (!price) return 'Hubungi Kami'
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

  const specs = equipment.specifications as Record<string, string> | null

  const handleWhatsAppContact = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    // WhatsApp Business Number for VSJ
    const whatsappNumber = '6285813718988'

    // Build message with equipment details
    const message = `*PT. VANIA SUGIARTA JAYA*
_Sewa Alat Berat Profesional_

Halo, saya tertarik dengan alat berat berikut:

*${equipment.name}*
Kategori: ${getCategoryLabel(equipment.category)}
${specs?.brand ? `Brand: ${specs.brand}\n` : ''}${specs?.model ? `Model: ${specs.model}\n` : ''}Harga: ${formatPrice(equipment.price_per_hour)}/jam

───────────────────────
*DAFTAR HARGA PENAWARAN*

*Excavator PC 200*
• Bucket: Rp 450.000 all in/jam
• Breaker: Rp 500.000 all in/jam

*Excavator PC 78*
• Bucket: Rp 300.000 all in/jam
• Breaker: Rp 350.000 all in/jam

*Backhoe Loader Dashwheel*
• Rp 350.000 all in/jam

*Excavator PC 58 / PC 40 / PC 30*
• Rp 250.000 - Rp 300.000 all in/jam

───────────────────────

Apakah tersedia untuk disewa?

Terima kasih.`

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message)

    // Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg flex flex-col h-full" onClick={onClick}>
      <div className="relative w-full h-64 overflow-hidden bg-white">
        <Image
          src={primaryImage}
          alt={equipment.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          quality={85}
        />
        <div className="absolute right-2 top-2 z-20">
          <Badge variant={equipment.is_available ? 'default' : 'secondary'}>
            {equipment.is_available ? 'Tersedia' : 'Tidak Tersedia'}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="line-clamp-1">{equipment.name}</CardTitle>
            <CardDescription className="mt-1">
              {getCategoryLabel(equipment.category)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {equipment.description && (
          <p className="mb-4 line-clamp-2 text-sm text-slate-600">
            {equipment.description}
          </p>
        )}

        {specs && (
          <div className="space-y-2 text-sm">
            {specs.brand && (
              <div className="flex justify-between">
                <span className="text-slate-600">Brand:</span>
                <span className="font-medium">{specs.brand}</span>
              </div>
            )}
            {specs.model && (
              <div className="flex justify-between">
                <span className="text-slate-600">Model:</span>
                <span className="font-medium">{specs.model}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Harga per jam:</span>
            {equipment.price_per_hour ? (
              <span className="text-lg font-bold text-orange-600">{formatPrice(equipment.price_per_hour)}</span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleWhatsAppContact(e)
                }}
                className="text-lg font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
              >
                {formatPrice(equipment.price_per_hour)}
              </button>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 mt-auto">
        <Button className="w-full" disabled={!equipment.is_available} onClick={(e) => {
          e.stopPropagation()
          onClick?.()
        }}>
          {equipment.is_available ? 'Lihat Detail' : 'Tidak Tersedia'}
        </Button>
        <Button
          variant="outline"
          disabled={!equipment.is_available}
          onClick={handleWhatsAppContact}
          className="w-full hover:bg-green-50 hover:border-green-600 hover:text-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Hubungi Sekarang</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

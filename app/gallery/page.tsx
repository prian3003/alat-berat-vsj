'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { WhatsAppFloat } from '@/components/shared/whatsapp-float'
import { FullscreenGallery } from '@/components/gallery/fullscreen-gallery'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface GalleryImage {
  id: string
  title: string
  description: string
  image_url: string
  category: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState<string[]>(['all'])
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [fullscreenIndex, setFullscreenIndex] = useState(0)

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredImages(images)
    } else {
      setFilteredImages(images.filter(img => img.category === selectedCategory))
    }
  }, [selectedCategory, images])

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }
      const data = await response.json()

      if (Array.isArray(data)) {
        setImages(data)

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((img: GalleryImage) => img.category))
        ) as string[]
        setCategories(['all', ...uniqueCategories])
      } else {
        console.error('Unexpected response format:', data)
        setImages([])
        setCategories(['all'])
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
      setImages([])
      setCategories(['all'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <WhatsAppFloat />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                Galeri Proyek
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                Dokumentasi lengkap proyek-proyek alat berat kami di Bali. Lihat pengalaman dan keahlian kami dalam melayani berbagai jenis pekerjaan konstruksi.
              </p>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-2 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </motion.div>

            {/* Gallery Grid */}
            {loading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="aspect-square bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <motion.div
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    onClick={() => {
                      setFullscreenIndex(index)
                      setFullscreenOpen(true)
                    }}
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      <Image
                        src={image.image_url}
                        alt={image.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-4">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-white font-semibold">{image.title}</h3>
                          {image.description && (
                            <p className="text-white/90 text-sm mt-1">{image.description}</p>
                          )}
                          <span className="inline-block mt-2 px-3 py-1 bg-orange-600/80 text-white text-xs rounded-full">
                            {image.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!loading && filteredImages.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-slate-600 text-lg">Tidak ada gambar untuk kategori ini.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Fullscreen Gallery Modal */}
      <FullscreenGallery
        images={filteredImages}
        initialIndex={fullscreenIndex}
        isOpen={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
      />
    </div>
  )
}

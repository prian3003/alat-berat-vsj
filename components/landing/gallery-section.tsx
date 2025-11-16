'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface GalleryImage {
  id: string
  title: string
  description: string
  image_url: string
  category: string
}

export function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('/api/gallery?limit=2')
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setImages(data)
      } else {
        console.error('Unexpected response format:', data)
        setImages([])
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="bg-white py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-48 sm:h-56 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="relative bg-white py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Continuous Grid Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 30px',
            backgroundPosition: '0 0',
          }}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Left Side - Title */}
          <div>
            <h2 className="inline-block text-2xl sm:text-3xl font-bold bg-orange-600 text-white px-8 py-2.5 rounded-xl shadow-md">
              Galeri
            </h2>
          </div>

          {/* Right Side - Link */}
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1 text-sm sm:text-base font-medium text-orange-600 hover:text-orange-700 transition-colors group"
          >
            Lihat Semua
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* 2 Column Grid */}
        <motion.div
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/gallery`}>
                <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-100">
                  <Image
                    src={image.image_url}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="50vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-4">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-white font-semibold text-sm">{image.title}</h3>
                      {image.description && (
                        <p className="text-white/90 text-xs mt-1 line-clamp-1">{image.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {images.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-600">Galeri belum ada. Silakan cek kembali nanti.</p>
          </div>
        )}
      </div>
    </section>
  )
}

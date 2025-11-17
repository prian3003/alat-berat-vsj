'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface GalleryImage {
  id: string
  title: string
  description: string
  image_url: string
  category: string
}

interface FullscreenGalleryProps {
  images: GalleryImage[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export function FullscreenGallery({ images, initialIndex, isOpen, onClose }: FullscreenGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Don't render if not open
  if (!isOpen) return null

  const currentImage = images[currentIndex]

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        title="Close (Esc)"
        aria-label="Close gallery"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Main Image Container */}
      <div
        className="relative w-full h-full flex items-center justify-center max-w-7xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={currentImage.image_url}
            alt={currentImage.title}
            fill
            className="object-contain"
            priority
            quality={90}
            sizes="100vw"
          />
        </div>

        {/* Previous Arrow Button */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 z-40 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors group"
          title="Previous (Left Arrow)"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Next Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-4 z-40 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors group"
          title="Next (Right Arrow)"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Image Info and Counter */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-white text-lg sm:text-xl font-semibold">{currentImage.title}</h3>
          {currentImage.description && (
            <p className="text-white/80 text-sm sm:text-base mt-2">{currentImage.description}</p>
          )}
          <div className="flex items-center justify-between mt-4">
            <span className="inline-block px-3 py-1 bg-orange-600/80 text-white text-xs sm:text-sm rounded-full">
              {currentImage.category}
            </span>
            <span className="text-white/60 text-sm">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      </div>

      {/* Keyboard Help */}
      <div className="absolute top-4 left-4 text-white/60 text-xs sm:text-sm hidden sm:block">
        <p>← → Navigasi | Esc Tutup</p>
      </div>
    </div>
  )
}

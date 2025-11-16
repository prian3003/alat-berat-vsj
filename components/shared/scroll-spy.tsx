'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SectionLink {
  id: string
  label: string
}

const sections: SectionLink[] = [
  { id: 'hero', label: 'Beranda' },
  { id: 'partners', label: 'Partner' },
  { id: 'equipment', label: 'Alat Berat' },
  { id: 'gallery', label: 'Galeri' },
  { id: 'about', label: 'Tentang' },
  { id: 'contact', label: 'Kontak' },
]

export function ScrollSpy() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      let closestSection = 'hero'
      let closestDistance = Infinity

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementCenter = rect.top + rect.height / 2
          const viewportCenter = window.innerHeight / 2
          const distance = Math.abs(elementCenter - viewportCenter)

          // Find the section closest to viewport center
          if (distance < closestDistance) {
            closestDistance = distance
            closestSection = section.id
          }
        }
      }

      setActiveSection(closestSection)
    }

    // Call on mount to set initial section
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col gap-6">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`#${section.id}`}
            className="relative flex items-center gap-3 group"
          >
            {/* Dot indicator */}
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-orange-600 scale-100'
                  : 'bg-slate-300 scale-75 group-hover:scale-100'
              }`}
            />

            {/* Line connecting to text */}
            <div
              className={`w-8 h-0.5 transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-orange-600 w-12'
                  : 'bg-slate-300 group-hover:w-10'
              }`}
            />

            {/* Label - only show for active */}
            {activeSection === section.id && (
              <span className="text-xs font-medium text-orange-600 whitespace-nowrap transition-opacity duration-300">
                {section.label}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

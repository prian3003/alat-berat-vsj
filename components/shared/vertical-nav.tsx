'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const navItems = [
  { id: 'hero', label: 'Beranda', href: '#hero' },
  { id: 'equipment', label: 'Alat Berat', href: '#equipment' },
  { id: 'about', label: 'Tentang', href: '#about' },
  { id: 'gallery', label: 'Galeri', href: '#gallery' },
  { id: 'blog', label: 'Blog', href: '#blog' },
  { id: 'contact', label: 'Kontak', href: '#contact' },
]

export function VerticalNav() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200 // Offset for better detection

      // Check each section
      for (let i = navItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(navItems[i].id)
        if (section) {
          const sectionTop = section.offsetTop
          if (scrollPosition >= sectionTop) {
            setActiveSection(navItems[i].id)
            break
          }
        }
      }
    }

    // Initial check
    handleScroll()

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 z-40">
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-300"></div>

        {/* Timeline Items */}
        <div className="space-y-6">
          {navItems.map((item) => {
            const isActive = activeSection === item.id

            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-4 group"
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(item.id)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
              >
                <div
                  className={`
                    flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full shadow-lg z-10 transition-all
                    ${isActive
                      ? 'bg-orange-600 scale-110'
                      : 'bg-slate-300 group-hover:bg-slate-400 group-hover:scale-110'
                    }
                  `}
                >
                  <div className={`rounded-full bg-white ${isActive ? 'h-3 w-3' : 'h-2 w-2'}`}></div>
                </div>
                <span
                  className={`
                    text-sm font-medium whitespace-nowrap transition-all
                    ${isActive
                      ? 'opacity-100 text-orange-600 font-semibold'
                      : 'opacity-0 text-slate-600 group-hover:opacity-100'
                    }
                  `}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

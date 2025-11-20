'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

export function WhatsAppFloat() {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const contacts = [
    { name: 'Admin', number: '6281325805326' },
    { name: 'Owner', number: '6282230958088' }
  ]

  const message = encodeURIComponent(`*PT. VANIA SUGIARTA JAYA*
_Sewa Alat Berat Profesional_

Halo, saya tertarik dengan layanan sewa alat berat Anda.

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

Mohon informasi lebih lanjut.

Terima kasih.`)

  const toggleMobileMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu when clicking outside (handle both mouse and touch events)
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      // Use both mousedown and touchstart to handle mobile/desktop properly
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 flex flex-col items-end"
    >
      {/* Contact Options - Mobile: Click to toggle, Desktop: Show on Hover */}
      <div
        className={`mb-3 flex flex-col gap-2 transition-all duration-300 ${
          isMobileMenuOpen || isHovered ? 'translate-y-0 opacity-100 visible' : 'pointer-events-none translate-y-2 opacity-0 invisible'
        }`}
      >
        {contacts.map((contact) => (
          <Link
            key={contact.number}
            href={`https://wa.me/${contact.number}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              setIsMobileMenuOpen(false)
            }}
            className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-lg transition-all hover:shadow-xl whitespace-nowrap sm:gap-3 sm:px-4"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
              <Image
                src="/whatsapp.svg"
                alt="WhatsApp"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </div>
            <div className="pr-1 sm:pr-2">
              <p className="text-sm font-semibold text-slate-900">{contact.name}</p>
              <p className="text-xs text-slate-600">Chat via WhatsApp</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main WhatsApp Button - Mobile: Button to toggle menu */}
      <button
        onClick={toggleMobileMenu}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition-all hover:scale-110 hover:bg-green-600 hover:shadow-xl sm:hidden"
        aria-label="Contact us on WhatsApp"
      >
        <Image
          src="/whatsapp.svg"
          alt="WhatsApp"
          width={28}
          height={28}
          className="h-7 w-7"
        />
      </button>

      {/* Desktop: Direct link with hover */}
      <Link
        href={`https://wa.me/${contacts[0].number}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition-all hover:scale-110 hover:bg-green-600 hover:shadow-xl"
        aria-label="Contact us on WhatsApp"
      >
        <Image
          src="/whatsapp.svg"
          alt="WhatsApp"
          width={62}
          height={32}
          className="h-8 w-8"
        />
      </Link>
    </div>
  )
}

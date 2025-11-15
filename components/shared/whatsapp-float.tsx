'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

export function WhatsAppFloat() {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const contacts = [
    { name: 'Admin', number: '6285813718988' },
    { name: 'Owner', number: '6282139659136' }
  ]

  const message = encodeURIComponent('Halo, saya tertarik dengan layanan sewa alat berat Anda.')

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 sm:bottom-4 sm:right-4"
    >
      {/* Contact Options - Mobile: Click to toggle, Desktop: Show on Hover */}
      <div
        className={`mb-3 flex flex-col gap-2 transition-all duration-300 ${
          isMobileMenuOpen || isHovered ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        {contacts.map((contact) => (
          <Link
            key={contact.number}
            href={`https://wa.me/${contact.number}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg"
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
            <div className="pr-2">
              <p className="text-sm font-semibold text-slate-900">{contact.name}</p>
              <p className="text-xs text-slate-600">Chat via WhatsApp</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main WhatsApp Button - Larger on mobile */}
      {/* Mobile: Button to toggle menu */}
      <button
        onClick={toggleMobileMenu}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg transition-all hover:scale-110 hover:bg-green-600 hover:shadow-xl sm:hidden"
        aria-label="Contact us on WhatsApp"
      >
        <Image
          src="/whatsapp.svg"
          alt="WhatsApp"
          width={36}
          height={36}
          className="h-9 w-9"
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
          width={32}
          height={32}
          className="h-8 w-8"
        />
      </Link>
    </div>
  )
}

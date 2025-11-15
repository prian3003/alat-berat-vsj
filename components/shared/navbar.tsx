'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const checkScroll = () => {
      const scrollPosition = window.scrollY || window.pageYOffset
      setIsScrolled(scrollPosition > 0)
    }

    checkScroll()

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0)',
        borderBottom: isScrolled ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid transparent',
        boxShadow: isScrolled ? '0 1px 3px 0 rgb(0 0 0 / 0.1)' : 'none',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none'
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'transparent' }}>
        <div className="flex min-h-20 py-5 items-center justify-between" style={{ backgroundColor: 'transparent' }}>
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="AlatBerat Logo"
                width={220}
                height={250}
                className="h-20"
                style={{ width: 'auto', height: '80px' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? 'text-slate-700 hover:text-slate-900'
                  : 'text-slate-800 hover:text-slate-900'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/#equipment"
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? 'text-slate-700 hover:text-slate-900'
                  : 'text-slate-800 hover:text-slate-900'
              }`}
            >
              Alat Berat
            </Link>
            <Link
              href="/#about"
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? 'text-slate-700 hover:text-slate-900'
                  : 'text-slate-800 hover:text-slate-900'
              }`}
            >
              Tentang Kami
            </Link>
            <Link
              href="/#contact"
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? 'text-slate-700 hover:text-slate-900'
                  : 'text-slate-800 hover:text-slate-900'
              }`}
            >
              Kontak
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex md:items-center md:space-x-4">
           
            <Button asChild>
              <Link href="#contact">Hubungi Kami</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    mobileMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur border-t">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Beranda
            </Link>
            <Link
              href="/#equipment"
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Alat Berat
            </Link>
            <Link
              href="/#about"
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Tentang Kami
            </Link>
            <Link
              href="/#contact"
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Kontak
            </Link>
           
          </div>
        </div>
      )}
    </nav>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Determine if a link is active
  const isActive = (href: string) => {
    // Only the home link should be active on the home page
    if (href === '/' && pathname === '/') return true
    // Hash links are just scroll anchors, don't mark them as active
    if (href.startsWith('/#')) return false
    // Mark other routes as active if pathname matches
    if (pathname.startsWith(href) && href !== '/') return true
    return false
  }

  useEffect(() => {
    const checkScroll = () => {
      const scrollPosition = window.scrollY || window.pageYOffset
      // Trigger navbar change after scrolling 120px (ensures we're past hero section)
      const shouldScroll = scrollPosition > 120
      setIsScrolled(shouldScroll)
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
      className="sticky top-0 z-50 transition-all duration-500 ease-out"
      style={{
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0)',
        borderBottom: isScrolled ? '1px solid rgba(226, 232, 240, 0.6)' : 'none',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.06)' : 'none',
        backdropFilter: isScrolled ? 'blur(12px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(12px) saturate(180%)' : 'none'
      }}
      data-scrolled={isScrolled}
      data-testid="navbar"
    >
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div
          className="flex h-20 sm:h-24 items-center justify-between"
        >
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="VSJ - Sewa Alat Berat Bali Logo"
                width={280}
                height={320}
                className="h-24"
                style={{ width: 'auto', height: '96px' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              href="/"
              className={`px-2 py-2 text-sm font-semibold transition-all duration-200 relative hover:after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-orange-600 after:transition-all after:duration-300 ${
                isActive('/')
                  ? 'text-orange-600'
                  : isScrolled
                  ? 'text-slate-700 hover:text-orange-600'
                  : 'text-slate-800 hover:text-orange-600'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/#equipment"
              className={`px-2 py-2 text-sm font-semibold transition-all duration-200 relative hover:after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-orange-600 after:transition-all after:duration-300 ${
                isActive('/#equipment')
                  ? 'text-orange-600'
                  : isScrolled
                  ? 'text-slate-700 hover:text-orange-600'
                  : 'text-slate-800 hover:text-orange-600'
              }`}
            >
              Alat Berat
            </Link>
            <Link
              href="/gallery"
              className={`px-2 py-2 text-sm font-semibold transition-all duration-200 relative hover:after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-orange-600 after:transition-all after:duration-300 ${
                isActive('/gallery')
                  ? 'text-orange-600'
                  : isScrolled
                  ? 'text-slate-700 hover:text-orange-600'
                  : 'text-slate-800 hover:text-orange-600'
              }`}
            >
              Galeri
            </Link>
            <Link
              href="/#about"
              className={`px-2 py-2 text-sm font-semibold transition-all duration-200 relative hover:after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-orange-600 after:transition-all after:duration-300 ${
                isActive('/#about')
                  ? 'text-orange-600'
                  : isScrolled
                  ? 'text-slate-700 hover:text-orange-600'
                  : 'text-slate-800 hover:text-orange-600'
              }`}
            >
              Tentang Kami
            </Link>
            <Link
              href="/blog"
              className={`px-2 py-2 text-sm font-semibold transition-all duration-200 relative hover:after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-orange-600 after:transition-all after:duration-300 ${
                isActive('/blog')
                  ? 'text-orange-600'
                  : isScrolled
                  ? 'text-slate-700 hover:text-orange-600'
                  : 'text-slate-800 hover:text-orange-600'
              }`}
            >
              Blog
            </Link>
            <Link
              href="/#contact"
              className={`px-2 py-2 text-sm font-semibold transition-all duration-200 relative hover:after:content-[''] after:absolute after:w-0 hover:after:w-full after:h-[2px] after:bottom-0 after:left-0 after:bg-orange-600 after:transition-all after:duration-300 ${
                isActive('/#contact')
                  ? 'text-orange-600'
                  : isScrolled
                  ? 'text-slate-700 hover:text-orange-600'
                  : 'text-slate-800 hover:text-orange-600'
              }`}
            >
              Kontak
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex md:items-center">
            <Button
              asChild
              className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-0"
            >
              <Link href="#contact" className="inline-flex items-center gap-2">
                Hubungi Kami
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <svg
                className="h-6 w-6 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
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
        <div className="md:hidden bg-white/98 backdrop-blur-lg border-t border-slate-200 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-1 px-4 pb-4 pt-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-base font-semibold transition-all duration-200 relative hover:after:content-[''] after:absolute after:w-0 hover:after:w-[calc(100%-2rem)] after:h-[2px] after:bottom-2 after:left-4 after:bg-orange-600 after:transition-all after:duration-300 ${
                isActive('/')
                  ? 'text-orange-600'
                  : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/#equipment"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-base font-semibold transition-all duration-200 relative hover:after:content-[''] after:absolute after:w-0 hover:after:w-[calc(100%-2rem)] after:h-[2px] after:bottom-2 after:left-4 after:bg-orange-600 after:transition-all after:duration-300 ${
                isActive('/#equipment')
                  ? 'text-orange-600'
                  : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Alat Berat
            </Link>
            <Link
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-base font-semibold transition-all duration-200 relative hover:after:content-[''] after:absolute after:w-0 hover:after:w-[calc(100%-2rem)] after:h-[2px] after:bottom-2 after:left-4 after:bg-orange-600 after:transition-all after:duration-300 ${
                isActive('/gallery')
                  ? 'text-orange-600'
                  : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Galeri
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-base font-semibold transition-all duration-200 relative hover:after:content-[''] after:absolute after:w-0 hover:after:w-[calc(100%-2rem)] after:h-[2px] after:bottom-2 after:left-4 after:bg-orange-600 after:transition-all after:duration-300 ${
                isActive('/#about')
                  ? 'text-orange-600'
                  : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Tentang Kami
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-base font-semibold transition-all duration-200 relative hover:after:content-[''] after:absolute after:w-0 hover:after:w-[calc(100%-2rem)] after:h-[2px] after:bottom-2 after:left-4 after:bg-orange-600 after:transition-all after:duration-300 ${
                isActive('/blog')
                  ? 'text-orange-600'
                  : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Blog
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 text-base font-semibold transition-all duration-200 relative hover:after:content-[''] after:absolute after:w-0 hover:after:w-[calc(100%-2rem)] after:h-[2px] after:bottom-2 after:left-4 after:bg-orange-600 after:transition-all after:duration-300 ${
                isActive('/#contact')
                  ? 'text-orange-600'
                  : 'text-slate-700 hover:text-orange-600'
              }`}
            >
              Kontak
            </Link>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="#contact" className="inline-flex items-center justify-center gap-2">
                  Hubungi Kami
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

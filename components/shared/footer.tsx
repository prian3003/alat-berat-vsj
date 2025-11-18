import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  const currentYear = new Date().getFullYear()

  // Navigation links matching navbar structure
  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Alat Berat', href: '/#equipment' },
    { label: 'Galeri', href: '/gallery' },
    { label: 'Tentang Kami', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Kontak', href: '/contact' },
  ]

  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="VSJ - Sewa Alat Berat Bali Logo"
                width={180}
                height={60}
                className="h-24 w-48 sm:h-28 sm:w-56"
              />
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
              Vania Sugiarta Jaya layanan sewa alat berat terpercaya dengan pengalaman bertahun-tahun
              dalam mendukung proyek konstruksi di seluruh Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3 sm:mb-4">
              Tautan Cepat
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-slate-600 hover:text-orange-600 transition-colors inline-block relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-orange-600 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3 sm:mb-4">
              Hubungi Kami
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <a
                  href="mailto:vaniasugiartajaya25@gmail.com"
                  className="text-slate-600 hover:text-orange-600 transition-colors break-all inline-block relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-orange-600 after:transition-all after:duration-300 hover:after:w-full"
                >
                  Email: vaniasugiartajaya25@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6285813718988"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-green-600 transition-colors break-all inline-block relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full"
                >
                  WA Admin: +62 858-1371-8988
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6282230958088"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-green-600 transition-colors break-all inline-block relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full"
                >
                  WA Owner: +62 822-3095-8088
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 border-t pt-6 sm:pt-8">
          <p className="text-center text-xs sm:text-sm text-slate-600">
            &copy; {currentYear} vaniasugiarta.com Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}

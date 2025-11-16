import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="VSJ - Sewa Alat Berat Bali Logo"
                width={120}
                height={40}
                className="h-16 w-32 sm:h-20 sm:w-40"
              />
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
              Vania Sugiarta Jaya layanan sewa alat berat terpercaya dengan pengalaman bertahun-tahun
              dalam mendukung proyek konstruksi di seluruh Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Tautan Cepat
            </h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/#equipment"
                  className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Alat Berat
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Hubungi Kami
            </h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <a
                  href="mailto:info@alatberat.com"
                  className="text-slate-600 hover:text-orange-600 transition-colors break-all"
                >
                  Email: info@alatberat.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6285813718988"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-green-600 transition-colors break-all"
                >
                  WA Admin: +62 858-1371-8988
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6282230958088"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-green-600 transition-colors break-all"
                >
                  WA Owner: +62 822-3095-8088
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 border-t pt-6 sm:pt-8">
          <p className="text-center text-xs sm:text-sm text-slate-600">
            &copy; {currentYear} VaniaSugiartaJaya.com Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}

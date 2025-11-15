import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="AlatBerat Logo"
                width={120}
                height={40}
                className="h-20  w-40"
              />
            </div>
            <p className="mt-4 text-sm text-slate-600">
              Vania Sugiarta Jaya layanan sewa alat berat terpercaya dengan pengalaman bertahun-tahun
              dalam mendukung proyek konstruksi di seluruh Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Tautan Cepat
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/#equipment"
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Alat Berat
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
              Hubungi Kami
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Email: info@alatberat.com</li>
              <li>Whatsapp Admin: +6285813718988</li>
              <li>Whatsapp Owner: +6281234567890</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-slate-600">
            &copy; {currentYear} VaniaSugiartaJaya.com Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}

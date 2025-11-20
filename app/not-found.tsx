import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="text-center max-w-2xl">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-orange-600 mb-4">404</h1>
          <div className="text-6xl mb-4">🚜</div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman telah dipindahkan atau dihapus.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
            <Link href="/">
              Kembali ke Beranda
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/#equipment">
              Lihat Alat Berat
            </Link>
          </Button>
        </div>

        {/* Additional Links */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-4">Atau kunjungi halaman lainnya:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/about" className="text-orange-600 hover:text-orange-700 font-medium">
              Tentang Kami
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/contact" className="text-orange-600 hover:text-orange-700 font-medium">
              Kontak
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/blog" className="text-orange-600 hover:text-orange-700 font-medium">
              Blog
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/gallery" className="text-orange-600 hover:text-orange-700 font-medium">
              Galeri
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-700 mb-2">Butuh bantuan?</p>
          <p className="text-slate-900 font-medium">
            Hubungi kami di WhatsApp:{' '}
            <a
              href="https://wa.me/6281325805326"
              className="text-orange-600 hover:text-orange-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              +62 813-2580-5326
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

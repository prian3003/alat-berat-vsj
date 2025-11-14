'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 sm:py-32">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 30px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Sewa Alat Berat di Bali <span className="text-orange-600">Terpercaya & Terjangkau</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            <strong>Rental alat berat profesional</strong> di Denpasar, Badung, Gianyar, dan seluruh Bali.
            Menyediakan <strong>excavator, bulldozer, crane, loader, dump truck</strong> dengan operator berpengalaman.
            Harga kompetitif, tarif per jam, layanan 24/7 siap mendukung proyek konstruksi Anda.
          </p>

          {/* SEO Keywords Section */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-slate-100 px-4 py-1.5">📍 Denpasar</span>
            <span className="rounded-full bg-slate-100 px-4 py-1.5">📍 Badung</span>
            <span className="rounded-full bg-slate-100 px-4 py-1.5">📍 Gianyar</span>
            <span className="rounded-full bg-slate-100 px-4 py-1.5">📍 Tabanan</span>
            <span className="rounded-full bg-slate-100 px-4 py-1.5">⏰ 24/7</span>
            <span className="rounded-full bg-slate-100 px-4 py-1.5">💰 Harga Kompetitif</span>
          </div>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Link href="#equipment">Lihat Alat Berat</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#contact">Hubungi Kami</Link>
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-400 to-yellow-300 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </section>
  )
}

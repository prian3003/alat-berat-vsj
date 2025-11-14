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

          {/* SEO Keywords Section - Glassmorphism */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {/* Location badges */}
            <span className="group relative overflow-hidden rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md transition-all hover:bg-white/20 hover:shadow-lg">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Denpasar
              </span>
            </span>
            <span className="group relative overflow-hidden rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md transition-all hover:bg-white/20 hover:shadow-lg">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Badung
              </span>
            </span>
            <span className="group relative overflow-hidden rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md transition-all hover:bg-white/20 hover:shadow-lg">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Gianyar
              </span>
            </span>
            <span className="group relative overflow-hidden rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md transition-all hover:bg-white/20 hover:shadow-lg">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Tabanan
              </span>
            </span>

            {/* Feature badges */}
            <span className="group relative overflow-hidden rounded-full border border-orange-200/30 bg-orange-50/40 px-5 py-2 backdrop-blur-md transition-all hover:bg-orange-100/50 hover:shadow-lg">
              <span className="flex items-center gap-2 text-sm font-medium text-orange-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                24/7 Service
              </span>
            </span>
            <span className="group relative overflow-hidden rounded-full border border-green-200/30 bg-green-50/40 px-5 py-2 backdrop-blur-md transition-all hover:bg-green-100/50 hover:shadow-lg">
              <span className="flex items-center gap-2 text-sm font-medium text-green-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                Harga Kompetitif
              </span>
            </span>
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

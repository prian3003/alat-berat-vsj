'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section id="hero" className="relative bg-gradient-to-b from-slate-50 to-white rounded-b-[8rem] overflow-hidden min-h-[600px] lg:min-h-[700px]">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 30px',
            maskImage: 'radial-gradient(ellipse 100% 120% at 50% 0%, #000 45%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 100% 120% at 50% 0%, #000 45%, transparent 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 pt-8 sm:pt-16 lg:pt-20 xl:pt-24 pb-12 sm:pb-20 lg:pb-32 xl:pb-40">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
              }
            }
          }}
        >
          <motion.h1
            className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }
              }
            }}
          >
            <span className="relative inline-block mb-2 sm:mb-3">
              <motion.span
                className="font-kalam text-painted block text-slate-800"
                initial={{ opacity: 0, scale: 0.9, rotateZ: -2 }}
                animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
              >
                Sewa Alat Berat di Bali
              </motion.span>

              {/* Brush stroke decoration */}
              <motion.svg
                className="absolute -left-6 -top-4 w-[calc(100%+3rem)] h-[calc(100%+2rem)] pointer-events-none opacity-20 -z-10"
                viewBox="0 0 500 120"
                preserveAspectRatio="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.2 }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              >
                <motion.path
                  d="M20,60 Q150,30 250,60 T480,60"
                  stroke="url(#brush-gradient)"
                  strokeWidth="20"
                  fill="none"
                  strokeLinecap="round"
                  filter="url(#brush-texture)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
                <defs>
                  <linearGradient id="brush-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#2563eb" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
                  </linearGradient>
                  <filter id="brush-texture">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                  </filter>
                </defs>
              </motion.svg>

              {/* Paint splatters */}
              <motion.div
                className="absolute -right-4 top-0 w-8 h-8 bg-blue-500/20 rounded-full blur-sm"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              />
              <motion.div
                className="absolute -left-3 bottom-2 w-6 h-6 bg-blue-600/20 rounded-full blur-sm"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1 }}
              />
            </span>

            <span className="relative inline-block">
              <span className="animate-gradient bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-[length:200%_auto] bg-clip-text text-transparent">
               {/* Terpercaya & Terjangkau */}
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-orange-600 to-red-600"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </motion.h1>

          <motion.p
            className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }
              }
            }}
          >
            <strong>Rental alat berat profesional</strong> melayani seluruh Bali dengan <strong>excavator, bulldozer, loader, dump truck</strong>.
            <br className="hidden sm:block" />
            Operator berpengalaman, harga kompetitif, tarif per jam, layanan <strong>24/7</strong>.
          </motion.p>

          {/* SEO Keywords Section - Location & Feature Badges */}
          <motion.div
            className="mt-6 lg:mt-8 flex flex-wrap items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Location badges - All Bali Regencies */}
            {['Denpasar', 'Badung', 'Gianyar', 'Tabanan', 'Buleleng', 'Klungkung', 'Bangli', 'Karangasem', 'Jembrana'].map((location) => (
              <span
                key={location}
                className="rounded-full border border-white/20 bg-white/10 px-3 sm:px-5 py-1.5 sm:py-2 transition-colors hover:bg-white/20"
              >
                <span className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-slate-700">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {location}
                </span>
              </span>
            ))}

            {/* Feature badges */}
            <span
              className="rounded-full border border-orange-200/30 bg-orange-50/40 px-3 sm:px-5 py-1.5 sm:py-2 transition-colors hover:bg-orange-100/50"
            >
              <span className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-orange-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">24/7 Service</span>
                <span className="sm:hidden">24/7</span>
              </span>
            </span>
            <span
              className="rounded-full border border-green-200/30 bg-green-50/40 px-3 sm:px-5 py-1.5 sm:py-2 transition-colors hover:bg-green-100/50"
            >
              <span className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-green-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                <span className="hidden sm:inline">Harga Kompetitif</span>
                <span className="sm:hidden">Kompetitif</span>
              </span>
            </span>
          </motion.div>

          <motion.div
            className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }
              }
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:w-auto"
            >
              <Button asChild size="lg" className="w-full h-10 sm:h-12 bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/30 text-sm sm:text-base font-semibold">
                <Link href="#equipment">Lihat Alat Berat</Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:w-auto"
            >
              <Button asChild variant="outline" size="lg" className="w-full h-10 sm:h-12 border-2 text-sm sm:text-base font-semibold">
                <Link href="#contact">Hubungi Kami</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Mobile Katalog Image - Fill empty space on mobile */}
        <motion.div
          className="md:hidden mt-8 sm:mt-10 w-full flex justify-center pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="w-full max-w-sm px-4">
            <Image
              src="/katalog.svg"
              alt="Katalog Alat Berat Bali"
              width={400}
              height={500}
              loading="lazy"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu blur-3xl">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-400 to-yellow-300 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        {/* Equipment Image - Bottom Left */}
        <motion.div
          className="hidden md:block absolute -bottom-40 -left-32 lg:-bottom-48 lg:-left-24 xl:-bottom-56 xl:-left-16 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px] pointer-events-none"
          initial={{ opacity: 0, x: -100, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/herologo.svg"
            alt="Excavator - Sewa Alat Berat Bali"
            width={550}
            height={550}
            className="object-contain w-full h-full drop-shadow-2xl"
            priority
            quality={85}
          />
        </motion.div>
      </div>
    </section>
  )
}

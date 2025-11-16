'use client'

import Image from 'next/image'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

const partners = [
  { id: 1, name: 'Partner 1', logo: '/partner1.png' },
  { id: 2, name: 'Partner 2', logo: '/partner2.png' },
  { id: 3, name: 'Partner 3', logo: '/montana.webp' },
  { id: 4, name: 'Partner 4', logo: '/astina.avif', label: 'ASTINA DIESEL' },
  { id: 5, name: 'Partner 5', logo: '/pjp.webp' },
]

function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: '100px' })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])

  useEffect(() => {
    springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('id-ID').format(Math.floor(latest))
      }
    })
  }, [springValue])

  return <span ref={ref} />
}

export function PartnerStatsSection() {
  return (
    <section id="partners" className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 md:py-24">
      {/* Grid Background Pattern - Subtle */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 30px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Partner Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold bg-orange-600 text-white px-8 py-2.5 rounded-xl shadow-md">
              Partner
            </h2>
          </div>
        </motion.div>

        {/* Infinite Scrolling Logo Container */}
        <div className="relative mb-16 sm:mb-20 lg:mb-24">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Scrolling Container */}
          <div className="overflow-hidden py-8">
            <div className="flex animate-scroll">
              {/* Original set */}
              {partners.map((partner, index) => (
                <div
                  key={`set1-${partner.id}-${index}`}
                  className="flex-shrink-0 mx-4 sm:mx-6 lg:mx-8 transition-transform duration-300 hover:scale-110"
                >
                  <div className={`flex flex-col items-center justify-center ${partner.label ? 'h-auto' : 'h-24 sm:h-28 lg:h-32'} w-40 sm:w-48 lg:w-56`}>
                    <div className={`flex items-center justify-center ${partner.label ? 'h-16 sm:h-20 lg:h-24' : 'h-24 sm:h-28 lg:h-32'} w-full`}>
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={partner.label ? 120 : 224}
                        height={partner.label ? 80 : 128}
                        className="object-contain h-full w-auto"
                        sizes="(max-width: 640px) 120px, (max-width: 1024px) 140px, 160px"
                        priority={index < 2}
                      />
                    </div>
                    {partner.label && (
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-2 text-center">
                        {partner.label}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {/* Duplicate 1 */}
              {partners.map((partner, index) => (
                <div
                  key={`set2-${partner.id}-${index}`}
                  className="flex-shrink-0 mx-4 sm:mx-6 lg:mx-8 transition-transform duration-300 hover:scale-110"
                >
                  <div className={`flex flex-col items-center justify-center ${partner.label ? 'h-auto' : 'h-24 sm:h-28 lg:h-32'} w-40 sm:w-48 lg:w-56`}>
                    <div className={`flex items-center justify-center ${partner.label ? 'h-16 sm:h-20 lg:h-24' : 'h-24 sm:h-28 lg:h-32'} w-full`}>
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={partner.label ? 120 : 224}
                        height={partner.label ? 80 : 128}
                        className="object-contain h-full w-auto"
                        sizes="(max-width: 640px) 120px, (max-width: 1024px) 140px, 160px"
                      />
                    </div>
                    {partner.label && (
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-2 text-center">
                        {partner.label}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {/* Duplicate 2 */}
              {partners.map((partner, index) => (
                <div
                  key={`set3-${partner.id}-${index}`}
                  className="flex-shrink-0 mx-4 sm:mx-6 lg:mx-8 transition-transform duration-300 hover:scale-110"
                >
                  <div className={`flex flex-col items-center justify-center ${partner.label ? 'h-auto' : 'h-24 sm:h-28 lg:h-32'} w-40 sm:w-48 lg:w-56`}>
                    <div className={`flex items-center justify-center ${partner.label ? 'h-16 sm:h-20 lg:h-24' : 'h-24 sm:h-28 lg:h-32'} w-full`}>
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={partner.label ? 120 : 224}
                        height={partner.label ? 80 : 128}
                        className="object-contain h-full w-auto"
                        sizes="(max-width: 640px) 120px, (max-width: 1024px) 140px, 160px"
                      />
                    </div>
                    {partner.label && (
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-2 text-center">
                        {partner.label}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {/* Year Established */}
          <motion.div
            className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/20 p-6 sm:p-8 shadow-md backdrop-blur-xl transition-all hover:border-white/60 hover:bg-white/30 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.3)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">2025</div>
              <div className="mt-2 text-xs sm:text-sm font-medium text-slate-600">Tahun Berdiri</div>
            </div>
          </motion.div>

          {/* Projects Completed */}
          <motion.div
            className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/20 p-6 sm:p-8 shadow-md backdrop-blur-xl transition-all hover:border-white/60 hover:bg-white/30 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 0 20px rgba(255, 255, 255, 0.3)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex items-baseline">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
                  <Counter value={1000} />
                </span>
                <span className="ml-1 text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600">+</span>
              </div>
              <div className="mt-2 text-xs sm:text-sm font-medium text-slate-600">Proyek Selesai</div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
          will-change: transform;
          width: fit-content;
        }

        @media (max-width: 640px) {
          .animate-scroll {
            animation: scroll 20s linear infinite;
          }
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}

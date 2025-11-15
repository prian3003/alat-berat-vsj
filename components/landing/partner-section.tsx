'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const partners = [
  { id: 1, name: 'Partner 1', logo: '/partner1.png' },
  { id: 2, name: 'Partner 2', logo: '/partner2.png' },
  { id: 3, name: 'Partner 1', logo: '/partner1.png' },
  { id: 4, name: 'Partner 2', logo: '/partner2.png' },
  { id: 5, name: 'Partner 1', logo: '/partner1.png' },
  { id: 6, name: 'Partner 2', logo: '/partner2.png' },
]

export function PartnerSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20">
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
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Partner Terpercaya Kami
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Dipercaya oleh perusahaan-perusahaan terkemuka di Bali
          </p>
        </motion.div>

        {/* Infinite Scrolling Logo Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Scrolling Container */}
          <div className="overflow-hidden py-8">
            <div className="flex animate-scroll">
              {/* First set */}
              {partners.map((partner, index) => (
                <div
                  key={`first-${partner.id}-${index}`}
                  className="flex-shrink-0 mx-12 transition-transform duration-300 hover:scale-110"
                >
                  <div className="relative h-40 w-80 flex items-center justify-center">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
                      sizes="320px"
                    />
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {partners.map((partner, index) => (
                <div
                  key={`second-${partner.id}-${index}`}
                  className="flex-shrink-0 mx-12 transition-transform duration-300 hover:scale-110"
                >
                  <div className="relative h-40 w-80 flex items-center justify-center">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
                      sizes="320px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}

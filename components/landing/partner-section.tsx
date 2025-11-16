'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const partners = [
  { id: 1, name: 'Partner 1', logo: '/partner1.png' },
  { id: 2, name: 'Partner 2', logo: '/partner2.png' },
  { id: 3, name: 'Partner 3', logo: '/montana.webp' },
  { id: 4, name: 'Partner 4', logo: '/astina.avif', label: 'ASTINA DIESEL' },
  { id: 5, name: 'Partner 5', logo: '/pjp.webp' },
]

export function PartnerSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 md:py-20">
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
          <div className="inline-flex items-center justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold bg-orange-600 text-white px-8 py-2.5 rounded-xl shadow-md">
              Partner
            </h2>
          </div>
        </motion.div>

        {/* Infinite Scrolling Logo Container */}
        <div className="relative">
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

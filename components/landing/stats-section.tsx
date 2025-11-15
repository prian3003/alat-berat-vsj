'use client'

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: '-100px' })

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

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16">
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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {/* Year Established */}
          <motion.div
            className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 p-10 shadow-lg backdrop-blur-xl transition-all hover:border-white/60 hover:bg-white/30 hover:shadow-2xl"
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
              <div className="text-5xl font-bold text-slate-900 sm:text-6xl">2025</div>
              <div className="mt-3 text-sm font-medium text-slate-600">Tahun Berdiri</div>
            </div>
          </motion.div>

          {/* Projects Completed */}
          <motion.div
            className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 p-10 shadow-lg backdrop-blur-xl transition-all hover:border-white/60 hover:bg-white/30 hover:shadow-2xl"
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
                <span className="text-5xl font-bold text-slate-900 sm:text-6xl">
                  <Counter value={1000} />
                </span>
                <span className="ml-1 text-4xl font-bold text-orange-600">+</span>
              </div>
              <div className="mt-3 text-sm font-medium text-slate-600">Proyek Selesai</div>
            </div>
          </motion.div>

          {/* Happy Clients */}
         
        </div>
      </div>
    </section>
  )
}

import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { WhatsAppFloat } from '@/components/shared/whatsapp-float'
import { BlogList } from '@/components/blog/blog-list'

export const metadata = {
  title: 'Blog - Sewa Alat Berat Bali | VSJ',
  description: 'Artikel, tips, dan informasi seputar sewa alat berat, konstruksi, dan proyek pembangunan di Bali. Excavator, bulldozer, loader, dump truck.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppFloat />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-slate-50 to-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                  Blog VSJ
                </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Artikel, tips, dan informasi terbaru seputar <strong>sewa alat berat</strong>, konstruksi, dan proyek pembangunan di Bali.
              </p>
            </div>
          </div>
        </section>

        <BlogList />
      </main>
      <Footer />
    </div>
  )
}

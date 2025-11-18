import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Tentang Kami | PT. Vania Sugiarta Jaya - Sewa Alat Berat Terpercaya',
  description: 'Pelajari tentang PT. Vania Sugiarta Jaya, perusahaan penyewa alat berat terpercaya dengan pengalaman bertahun-tahun mendukung proyek konstruksi di Indonesia. Komitmen kami pada kualitas, keamanan, dan kepuasan pelanggan.',
  keywords: 'tentang vania sugiarta jaya, sewa alat berat, penyedia alat konstruksi, pengalaman konstruksi',
  openGraph: {
    title: 'Tentang Vania Sugiarta Jaya - Sewa Alat Berat Terpercaya',
    description: 'Perusahaan penyewa alat berat dengan pengalaman bertahun-tahun mendukung proyek konstruksi di Indonesia',
    url: 'https://vaniasugiarta.com/about',
    type: 'website',
    images: [
      {
        url: 'https://vaniasugiarta.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'PT. Vania Sugiarta Jaya Logo',
      },
    ],
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-slate-50 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 sm:mb-6">
              Tentang Kami
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              PT. Vania Sugiarta Jaya adalah mitra terpercaya Anda dalam penyediaan alat berat berkualitas untuk berbagai kebutuhan proyek konstruksi.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Profil Perusahaan
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              PT. Vania Sugiarta Jaya didirikan dengan visi untuk menjadi penyedia layanan sewa alat berat terkemuka di Indonesia. Dengan pengalaman lebih dari satu dekade dalam industri konstruksi, kami memahami setiap kebutuhan unik dari setiap proyek.
            </p>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Kami berkomitmen untuk menyediakan alat berat berkualitas tinggi, profesional yang terlatih, dan layanan pelanggan yang luar biasa. Kepercayaan klien adalah aset terbesar kami, dan kami bekerja keras setiap hari untuk mempertahankannya.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-10 text-center">
            Misi, Visi & Nilai Kami
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">Misi</h3>
              <p className="text-slate-600 leading-relaxed">
                Menyediakan solusi penyewaan alat berat yang inovatif, terpercaya, dan terjangkau untuk mendukung kesuksesan setiap proyek konstruksi dengan standar keamanan tertinggi.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">Visi</h3>
              <p className="text-slate-600 leading-relaxed">
                Menjadi mitra utama dan terpercaya dalam industri penyewaan alat berat di Indonesia, dikenal karena kualitas layanan, keandalan, dan komitmen terhadap kepuasan pelanggan.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">Nilai Inti</h3>
              <ul className="text-slate-600 space-y-2">
                <li>✓ Integritas dan kejujuran</li>
                <li>✓ Keamanan kerja utama</li>
                <li>✓ Kualitas tanpa kompromi</li>
                <li>✓ Layanan pelanggan terbaik</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-10">
            Mengapa Memilih Kami?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '🏆',
                title: 'Pengalaman Bertahun-tahun',
                desc: 'Dengan pengalaman lebih dari sepuluh tahun, kami memahami setiap aspek industri penyewaan alat berat.'
              },
              {
                icon: '✅',
                title: 'Alat Berkualitas Tinggi',
                desc: 'Semua peralatan kami dirawat dengan baik dan diperiksa secara berkala untuk memastikan performa optimal.'
              },
              {
                icon: '🛡️',
                title: 'Standar Keamanan Tertinggi',
                desc: 'Keselamatan operator dan lingkungan adalah prioritas utama kami dalam setiap layanan.'
              },
              {
                icon: '👥',
                title: 'Tim Profesional',
                desc: 'Operator berpengalaman dan staf profesional siap membantu proyek Anda mencapai kesuksesan.'
              },
              {
                icon: '💰',
                title: 'Harga Kompetitif',
                desc: 'Kami menawarkan paket rental yang fleksibel dan harga yang kompetitif tanpa mengorbankan kualitas.'
              },
              {
                icon: '📞',
                title: 'Dukungan 24/7',
                desc: 'Tim customer service kami siap membantu Anda kapan saja untuk memastikan kelancaran operasional.'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-6 bg-slate-50 rounded-lg border border-slate-200 hover:border-orange-300 transition-colors">
                <div className="text-4xl shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Fleet */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 text-center">
            Armada Alat Berat Kami
          </h2>
          <p className="text-center text-slate-600 mb-10 text-lg">
            Kami menyediakan berbagai jenis alat berat modern untuk memenuhi kebutuhan proyek Anda:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Excavator (berbagai ukuran)',
              'Backhoe Loader',
              'Wheel Loader',
              'Dump Truck',
              'Bulldozer',
              'Concrete Mixer Truck',
              'Mini Excavator',
              'Vibro Roller',
              'Motor Grader',
              'Compactor',
              'Crane',
              'Generator Set'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200">
                <div className="w-2 h-2 bg-orange-600 rounded-full shrink-0"></div>
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Jangkauan Layanan
          </h2>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
            Kami melayani seluruh wilayah Indonesia dengan fokus khusus pada pulau Bali dan sekitarnya. Dengan jaringan distribusi yang luas, kami mampu mengirimkan alat berat ke lokasi proyek Anda dengan cepat dan aman.
          </p>

          <div className="bg-gradient-to-br from-orange-50 to-slate-50 rounded-lg p-8 border-2 border-orange-200">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Wilayah Utama Layanan:</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <ul className="space-y-2 text-slate-600">
                  <li>✓ Bali (semua kabupaten)</li>
                  <li>✓ Lombok</li>
                  <li>✓ Sumbawa</li>
                  <li>✓ Nusa Tenggara</li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-slate-600">
                  <li>✓ Jawa Timur</li>
                  <li>✓ Sulawesi</li>
                  <li>✓ Dan wilayah Indonesia lainnya</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Siap Membantu Proyek Anda?
          </h2>
          <p className="text-lg text-orange-50 mb-8">
            Hubungi kami hari ini untuk mendapatkan penawaran terbaik dan konsultasi gratis tentang kebutuhan alat berat Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3 text-lg"
            >
              <Link href="/contact">
                Hubungi Kami
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-orange-700 font-semibold px-8 py-3 text-lg"
            >
              <a href="https://wa.me/6285813718988" target="_blank" rel="noopener noreferrer">
                Chat WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

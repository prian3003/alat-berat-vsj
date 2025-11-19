import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { WhatsAppFloat } from '@/components/shared/whatsapp-float'
import {
  Trophy,
  CheckCircle,
  Shield,
  Users,
  DollarSign,
  Phone,
  Truck,
  Award,
  MapPin,
  Navigation
} from 'lucide-react'

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
    <>
      <Navbar />
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
              <Award className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Misi</h3>
              <p className="text-slate-600 leading-relaxed">
                Menyediakan solusi penyewaan alat berat yang inovatif, terpercaya, dan terjangkau untuk mendukung kesuksesan setiap proyek konstruksi dengan standar keamanan tertinggi.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <Navigation className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Visi</h3>
              <p className="text-slate-600 leading-relaxed">
                Menjadi mitra utama dan terpercaya dalam industri penyewaan alat berat di Indonesia, dikenal karena kualitas layanan, keandalan, dan komitmen terhadap kepuasan pelanggan.
              </p>
            </div>

            {/* Values */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <Shield className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Nilai Inti</h3>
              <ul className="text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  Integritas dan kejujuran
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  Keamanan kerja utama
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  Kualitas tanpa kompromi
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  Layanan pelanggan terbaik
                </li>
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
                icon: Trophy,
                title: 'Pengalaman Bertahun-tahun',
                desc: 'Dengan pengalaman lebih dari sepuluh tahun, kami memahami setiap aspek industri penyewaan alat berat.'
              },
              {
                icon: CheckCircle,
                title: 'Alat Berkualitas Tinggi',
                desc: 'Semua peralatan kami dirawat dengan baik dan diperiksa secara berkala untuk memastikan performa optimal.'
              },
              {
                icon: Shield,
                title: 'Standar Keamanan Tertinggi',
                desc: 'Keselamatan operator dan lingkungan adalah prioritas utama kami dalam setiap layanan.'
              },
              {
                icon: Users,
                title: 'Tim Profesional',
                desc: 'Operator berpengalaman dan staf profesional siap membantu proyek Anda mencapai kesuksesan.'
              },
              {
                icon: DollarSign,
                title: 'Harga Kompetitif',
                desc: 'Kami menawarkan paket rental yang fleksibel dan harga yang kompetitif tanpa mengorbankan kualitas.'
              },
              {
                icon: Phone,
                title: 'Dukungan 24/7',
                desc: 'Tim customer service kami siap membantu Anda kapan saja untuk memastikan kelancaran operasional.'
              }
            ].map((item, idx) => {
              const IconComponent = item.icon
              return (
                <div key={idx} className="flex gap-4 p-6 bg-slate-50 rounded-lg border border-slate-200 hover:border-orange-300 transition-colors">
                  <IconComponent className="w-8 h-8 text-orange-600 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )
            })}
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
              <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-orange-300 transition-colors">
                <Truck className="w-5 h-5 text-orange-600 shrink-0" />
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
            Kami melayani seluruh wilayah Bali dengan jaringan distribusi yang luas dan efisien. Dengan lokasi strategis, kami mampu mengirimkan alat berat ke lokasi proyek Anda dengan cepat dan aman.
          </p>

          <div className="bg-gradient-to-br from-orange-50 to-slate-50 rounded-lg p-8 border-2 border-orange-200">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-4">Wilayah Layanan Utama:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Denpasar (Kota Denpasar)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Badung (Kuta, Seminyak, Sanur)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Gianyar (Ubud, Tegallalang)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Klungkung
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Buleleng (Singaraja, Lovina)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Jembrana
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Tabanan
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    Bangli
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-center">
            Lokasi Kami
          </h2>
          <p className="text-center text-slate-600 mb-8 text-lg">
            Kunjungi kantor kami di Jl. Raya Denpasar No.16, Mangwi - Badung, Bali
          </p>
          <div className="relative w-full overflow-hidden rounded-xl shadow-lg border-2 border-slate-200" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.8976469945844!2d115.17355887500983!3d-8.516481291525156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23b4ad161a047%3A0xbb7da6bad4bc14f0!2sPT%20Vania%20Sugiarta%20Jaya!5e0!3m2!1sen!2sid!4v1737365000000!5m2!1sen!2sid"
              className="absolute top-0 left-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PT. Vania Sugiarta Jaya Location"
            />
          </div>

          {/* Contact Info Below Map */}
          <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <MapPin className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">Alamat</h3>
              <p className="text-sm text-slate-600">
                Jl. Raya Denpasar No.16<br />
                Mangwi - Badung, Bali
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <Phone className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">Telepon</h3>
              <p className="text-sm text-slate-600">
                +62 813-2580-5326<br />
                +62 822-3095-8088
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <svg className="w-8 h-8 text-orange-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-bold text-slate-900 mb-2">Jam Operasional</h3>
              <p className="text-sm text-slate-600">
                Senin - Minggu<br />
                24/7 Service
              </p>
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
              className="border-white text-green hover:bg-orange-700 font-semibold px-8 py-3 text-lg"
            >
              <a href="https://wa.me/6281325805326" target="_blank" rel="noopener noreferrer">
                Chat WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

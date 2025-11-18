import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import {
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Globe,
  CheckCircle,
  Zap,
  AlertCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hubungi Kami | PT. Vania Sugiarta Jaya - Sewa Alat Berat',
  description: 'Hubungi PT. Vania Sugiarta Jaya untuk pemesanan alat berat atau konsultasi. Kami tersedia 24/7 untuk menjawab pertanyaan Anda.',
  keywords: 'hubungi, kontak, sewa alat berat, PT Vania Sugiarta Jaya, WhatsApp, email',
  openGraph: {
    title: 'Hubungi Kami | PT. Vania Sugiarta Jaya',
    description: 'Hubungi PT. Vania Sugiarta Jaya untuk pemesanan alat berat atau konsultasi profesional',
    url: 'https://vaniasugiarta.com/contact',
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

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactContent />
      <Footer />
    </>
  )
}

function ContactContent() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'vaniasugiartajaya25@gmail.com',
      href: 'mailto:vaniasugiartajaya25@gmail.com',
      description: 'Kirim email Anda kapan saja. Kami akan merespons dalam 24 jam.'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Admin',
      value: '+62 858-1371-8988',
      href: 'https://wa.me/6285813718988',
      description: 'Chat langsung dengan admin kami untuk respons cepat.'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Owner',
      value: '+62 822-3095-8088',
      href: 'https://wa.me/6282230958088',
      description: 'Hubungi owner untuk konsultasi bisnis dan penawaran khusus.'
    },
    {
      icon: MapPin,
      title: 'Lokasi',
      value: 'Bali, Indonesia',
      description: 'Kami beroperasi di berbagai lokasi strategis di Bali.'
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      value: '24/7',
      description: 'Tim kami siap melayani Anda kapan saja, setiap hari.'
    },
    {
      icon: Globe,
      title: 'Website',
      value: 'vaniasugiarta.com',
      href: 'https://vaniasugiarta.com',
      description: 'Kunjungi website kami untuk informasi lebih lengkap.'
    }
  ]

  const faqs = [
    {
      q: 'Bagaimana cara memesan alat berat?',
      a: 'Hubungi kami melalui WhatsApp, email, atau telepon. Tim kami akan membantu Anda memilih alat yang sesuai dengan kebutuhan proyek dan memberikan penawaran terbaik.'
    },
    {
      q: 'Berapa lama minimum penyewaan?',
      a: 'Kami menerima pemesanan dengan berbagai durasi, mulai dari harian, mingguan, bulanan, hingga tahunan. Diskusikan kebutuhan spesifik Anda dengan tim kami.'
    },
    {
      q: 'Apakah harga sudah termasuk operator?',
      a: 'Paket sewa kami tersedia dengan atau tanpa operator. Anda dapat memilih sesuai dengan kebutuhan. Kami juga menyediakan operator terlatih dengan biaya tambahan jika diperlukan.'
    },
    {
      q: 'Bagaimana dengan pengiriman alat ke lokasi proyek?',
      a: 'Kami menyediakan layanan pengiriman ke seluruh Indonesia. Biaya pengiriman akan dihitung berdasarkan jarak dan jenis alat yang disewa.'
    },
    {
      q: 'Apa saja jaminan keamanan alat berat Anda?',
      a: 'Semua alat kami diasuransikan dan telah lulus pemeriksaan keselamatan. Kami juga menyediakan perjanjian sewa yang jelas untuk melindungi kedua belah pihak.'
    },
    {
      q: 'Bagaimana jika alat mengalami kerusakan saat digunakan?',
      a: 'Kerusakan yang terjadi karena pemakaian normal ditanggung oleh kami. Namun, kerusakan akibat kelalaian penyewa menjadi tanggung jawab penyewa sesuai dengan ketentuan perjanjian.'
    }
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-slate-50 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-4 sm:mb-6">
              Hubungi Kami
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Tim kami siap membantu Anda 24/7. Hubungi kami untuk konsultasi gratis tentang kebutuhan alat berat proyek Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-10 text-center">
            Cara Menghubungi Kami
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {contactMethods.map((method, idx) => {
              const IconComponent = method.icon
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all duration-300"
                >
                  <IconComponent className="w-8 h-8 text-orange-600 mb-3" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{method.title}</h3>
                  {method.href ? (
                    <a
                      href={method.href}
                      target={method.href.startsWith('http') ? '_blank' : undefined}
                      rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-orange-600 font-semibold hover:text-orange-700 break-all mb-2 inline-block"
                    >
                      {method.value}
                    </a>
                  ) : (
                    <p className="text-slate-700 font-semibold mb-2">{method.value}</p>
                  )}
                  <p className="text-slate-600 text-sm">{method.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Contact Form Benefits */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 text-center">
            Informasi Yang Kami Butuhkan
          </h2>
          <p className="text-center text-slate-600 mb-10 text-lg">
            Untuk memberikan penawaran terbaik, silakan siapkan informasi berikut saat menghubungi kami:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: AlertCircle,
                title: 'Jenis Alat Berat',
                desc: 'Spesifikasi alat yang Anda butuhkan untuk proyek'
              },
              {
                icon: Clock,
                title: 'Durasi Penyewaan',
                desc: 'Periode waktu yang Anda perlukan (hari, minggu, bulan)'
              },
              {
                icon: MapPin,
                title: 'Lokasi Proyek',
                desc: 'Alamat lengkap lokasi penggunaan alat berat'
              },
              {
                icon: CheckCircle,
                title: 'Jumlah Unit',
                desc: 'Berapa banyak unit alat yang dibutuhkan'
              },
              {
                icon: Clock,
                title: 'Tanggal Mulai',
                desc: 'Kapan Anda membutuhkan alat mulai beroperasi'
              },
              {
                icon: AlertCircle,
                title: 'Kondisi Khusus',
                desc: 'Kebutuhan atau persyaratan khusus proyek Anda'
              }
            ].map((item, idx) => {
              const IconComponent = item.icon
              return (
                <div key={idx} className="bg-white rounded-lg p-6 border-l-4 border-orange-600">
                  <div className="flex items-start gap-3 mb-3">
                    <IconComponent className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-10 text-center">
            Pertanyaan Yang Sering Diajukan
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-slate-200 rounded-lg p-6 hover:border-orange-300 transition-colors duration-300"
              >
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-slate-900 text-lg">
                  {faq.q}
                  <span className="text-xl text-orange-600 group-open:rotate-180 transition-transform duration-300">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Response Time Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-50 to-slate-50">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Waktu Respons Kami
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-100">
              <Zap className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 mb-2">WhatsApp</h3>
              <p className="text-slate-600">Respons dalam hitungan menit</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-100">
              <Mail className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 mb-2">Email</h3>
              <p className="text-slate-600">Respons dalam 24 jam</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-100">
              <Clock className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-bold text-lg text-slate-900 mb-2">Telepon</h3>
              <p className="text-slate-600">Tersedia 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Jangan Ragu untuk Menghubungi Kami
          </h2>
          <p className="text-lg text-orange-50 mb-8">
            Kami siap memberikan solusi terbaik untuk kebutuhan alat berat proyek Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3 text-lg"
            >
              <a href="https://wa.me/6285813718988" target="_blank" rel="noopener noreferrer">
                Chat WhatsApp Sekarang
              </a>
            </Button>
            <Button
              asChild
              className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3 text-lg"
            >
              <a href="mailto:vaniasugiartajaya25@gmail.com">
                Kirim Email
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

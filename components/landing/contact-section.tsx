export function ContactSection() {
  return (
    <section id="contact" className="relative bg-white py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Continuous Grid Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 30px',
            backgroundPosition: '0 0',
          }}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center justify-center mb-3">
            <h2 className="text-2xl sm:text-3xl font-bold bg-orange-600 text-white px-6 py-2.5 rounded-xl shadow-md">
              Hubungi VSJ - Konsultasi Gratis Sewa Alat Berat
            </h2>
          </div>
          <p className="mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-slate-600">
            Konsultasi GRATIS untuk kebutuhan rental excavator, bulldozer, crane di seluruh Bali.
            Dapatkan penawaran harga terbaik untuk proyek konstruksi Anda di Denpasar, Badung, Gianyar, Tabanan, Buleleng, Klungkung, Bangli, Karangasem, Jembrana.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
            <a
              href={`https://wa.me/6281325805326?text=${encodeURIComponent(`*PT. VANIA SUGIARTA JAYA*
_Sewa Alat Berat Profesional_

Halo, saya tertarik dengan layanan sewa alat berat Anda.

───────────────────────
*DAFTAR HARGA PENAWARAN*

*Excavator PC 200*
• Bucket: Rp 450.000 all in/jam
• Breaker: Rp 500.000 all in/jam

*Excavator PC 78*
• Bucket: Rp 300.000 all in/jam
• Breaker: Rp 350.000 all in/jam

*Backhoe Loader Dashwheel*
• Rp 350.000 all in/jam

*Excavator PC 58 / PC 40 / PC 30*
• Rp 250.000 - Rp 300.000 all in/jam

───────────────────────

Mohon informasi lebih lanjut.

Terima kasih.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm sm:text-base font-medium text-white transition-colors hover:bg-green-700 active:bg-green-800"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="hidden sm:inline">Chat WhatsApp - Penawaran Instant</span>
              <span className="sm:hidden">Chat WhatsApp</span>
            </a>
            <a
              href="tel:+6281325805326"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-900 px-6 py-3 text-sm sm:text-base font-medium text-slate-900 transition-colors hover:bg-slate-900 hover:text-white active:bg-slate-800"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              <span className="hidden sm:inline">Telepon Langsung</span>
              <span className="sm:hidden">Telepon</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

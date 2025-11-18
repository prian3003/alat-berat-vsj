import Image from 'next/image'

export function AboutSection() {
  return (
    <section id="about" className="relative bg-white py-12 sm:py-16 md:py-24 overflow-hidden">
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
      <div className="relative z-10 pt-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center mb-3">
            <h2 className="text-2xl sm:text-3xl font-bold bg-orange-600 text-white px-6 py-2.5 rounded-xl shadow-md">
              Tentang VSJ - Rental Alat Berat Terpercaya
            </h2>
          </div>
          <p className="mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-slate-600">
            Penyedia jasa <strong>rental alat berat terpercaya di Bali</strong> sejak 2023.
            Melayani proyek konstruksi di Denpasar, Badung, Gianyar, Tabanan, Buleleng, Klungkung, Bangli, Karangasem, Jembrana, dan seluruh Bali dengan komitmen kualitas terbaik.
          </p>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative rounded-lg bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-base sm:text-lg font-semibold text-slate-900">
              Alat Berat Berkualitas Tinggi
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
              Excavator, bulldozer, crane, dan loader yang terawat dengan baik.
              Siap mendukung proyek konstruksi besar maupun kecil di seluruh Bali.
            </p>
            <div className="absolute bottom-4 right-4 w-12 h-12 opacity-10">
              <Image src="/logo.png" alt="VSJ Logo" width={48} height={48} className="object-contain" />
            </div>
          </div>

          <div className="relative rounded-lg bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-base sm:text-lg font-semibold text-slate-900">
              Tarif Per Jam Terjangkau
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
              Harga sewa alat berat kompetitif dengan sistem tarif per jam.
              Hemat biaya operasional proyek konstruksi Anda di Bali.
            </p>
            <div className="absolute bottom-4 right-4 w-12 h-12 opacity-10">
              <Image src="/logo.png" alt="VSJ Logo" width={48} height={48} className="object-contain" />
            </div>
          </div>

          <div className="relative rounded-lg bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-base sm:text-lg font-semibold text-slate-900">
              Operator Berpengalaman & Layanan 24/7
            </h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
              Operator profesional bersertifikat dan tim support siap membantu kapan saja.
              Layanan cepat untuk seluruh Bali: Denpasar, Badung, Gianyar, Tabanan, Buleleng, Klungkung, Bangli, Karangasem, Jembrana.
            </p>
            <div className="absolute bottom-4 right-4 w-12 h-12 opacity-10">
              <Image src="/logo.png" alt="VSJ Logo" width={48} height={48} className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

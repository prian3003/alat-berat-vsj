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

        {/* Vertical Timeline */}
        <div className="mt-8 sm:mt-10 md:mt-12 max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-300"></div>

            {/* Timeline Items */}
            <div className="space-y-8">
              {/* Item 1 */}
              <div className="relative flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-600 shadow-lg z-10">
                  <svg
                    className="h-6 w-6 text-white"
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
                <div className="flex-1 rounded-lg bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    Alat Berat Berkualitas Tinggi
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                    Excavator, bulldozer, crane, dan loader yang terawat dengan baik.
                    Siap mendukung proyek konstruksi besar maupun kecil di seluruh Bali.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="relative flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-300 shadow-lg z-10">
                  <svg
                    className="h-6 w-6 text-slate-600"
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
                <div className="flex-1 rounded-lg bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    Tarif Per Jam Terjangkau
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                    Harga sewa alat berat kompetitif dengan sistem tarif per jam.
                    Hemat biaya operasional proyek konstruksi Anda di Bali.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="relative flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-300 shadow-lg z-10">
                  <svg
                    className="h-6 w-6 text-slate-600"
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
                <div className="flex-1 rounded-lg bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    Operator Berpengalaman & Layanan 24/7
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                    Operator profesional bersertifikat dan tim support siap membantu kapan saja.
                    Layanan cepat untuk seluruh Bali: Denpasar, Badung, Gianyar, Tabanan, Buleleng, Klungkung, Bangli, Karangasem, Jembrana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Location */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Lokasi Kami</h3>
            <p className="text-sm sm:text-base text-slate-600">
              Jl. Raya Denpasar No.16, Mangwi - Badung, Bali
            </p>
          </div>
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
        </div>
      </div>
    </section>
  )
}

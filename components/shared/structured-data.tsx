export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://vaniasugiartajaya.com",
    "name": "VSJ - Vania Sugiarta Jaya",
    "alternateName": "Sewa Alat Berat Bali",
    "description": "Penyedia layanan sewa alat berat di Bali untuk proyek konstruksi. Menyediakan excavator, bulldozer, crane, loader, dump truck dengan operator berpengalaman dan harga kompetitif.",
    "url": "https://vaniasugiartajaya.com",
    "logo": "https://vaniasugiartajaya.com/logo.png",
    "image": "https://vaniasugiartajaya.com/logo.png",
    "telephone": "+62 858-1371-8988",
    "email": "info@vaniasugiartajaya.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Denpasar",
      "addressRegion": "Bali",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-8.6705",
      "longitude": "115.2126"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Denpasar"
      },
      {
        "@type": "City",
        "name": "Badung"
      },
      {
        "@type": "City",
        "name": "Gianyar"
      },
      {
        "@type": "City",
        "name": "Tabanan"
      },
      {
        "@type": "City",
        "name": "Klungkung"
      },
      {
        "@type": "State",
        "name": "Bali"
      }
    ],
    "priceRange": "Rp 250.000 - Rp 500.000 per jam",
    "currenciesAccepted": "IDR",
    "paymentAccepted": "Cash, Transfer Bank",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/vaniasugiartajaya",
      "https://www.instagram.com/vaniasugiartajaya"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Layanan Sewa Alat Berat",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sewa Excavator",
            "description": "Layanan sewa excavator berbagai ukuran untuk proyek galian, penggalian pondasi, dan pekerjaan tanah"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sewa Bulldozer",
            "description": "Layanan sewa bulldozer untuk land clearing, perataan tanah, dan pembukaan lahan"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sewa Crane",
            "description": "Layanan sewa crane untuk pengangkatan material berat pada proyek konstruksi"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sewa Loader",
            "description": "Layanan sewa loader untuk loading dan unloading material konstruksi"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sewa Dump Truck",
            "description": "Layanan sewa dump truck untuk pengangkutan material proyek"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

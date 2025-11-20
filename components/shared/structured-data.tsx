export function StructuredData() {
  // Organization + LocalBusiness hybrid schema for comprehensive business information
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": "https://vaniasugiartajaya.com",
    "name": "PT. Vania Sugiarta Jaya",
    "alternateName": ["VSJ", "Sewa Alat Berat Bali", "Vania Sugiarta Jaya"],
    "description": "Penyedia layanan sewa alat berat terpercaya di Bali untuk proyek konstruksi. Menyediakan excavator, bulldozer, crane, loader, dump truck dengan operator berpengalaman, harga kompetitif, dan layanan 24/7.",
    "url": "https://vaniasugiartajaya.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vaniasugiartajaya.com/logo.png",
      "width": 200,
      "height": 200,
      "caption": "VSJ - Sewa Alat Berat Bali Logo"
    },
    "image": [
      "https://vaniasugiartajaya.com/logo.png",
      "https://vaniasugiartajaya.com/og-image.jpg"
    ],
    "telephone": ["+62-813-2580-5326", "+62-822-3095-8088"],
    "email": "info@vaniasugiartajaya.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Denpasar, Bali",
      "addressLocality": "Denpasar",
      "addressRegion": "Bali",
      "postalCode": "80000",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-8.6705",
      "longitude": "115.2126"
    },
    "areaServed": [
      { "@type": "City", "name": "Denpasar" },
      { "@type": "City", "name": "Badung" },
      { "@type": "City", "name": "Gianyar" },
      { "@type": "City", "name": "Tabanan" },
      { "@type": "City", "name": "Buleleng" },
      { "@type": "City", "name": "Klungkung" },
      { "@type": "City", "name": "Bangli" },
      { "@type": "City", "name": "Karangasem" },
      { "@type": "City", "name": "Jembrana" },
      { "@type": "State", "name": "Bali" }
    ],
    "serviceArea": {
      "@type": "State",
      "name": "Bali, Indonesia"
    },
    "priceRange": "Rp 250.000 - Rp 500.000 per jam",
    "currenciesAccepted": "IDR",
    "paymentAccepted": ["Cash", "Bank Transfer"],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59",
        "opens_en": "00:00",
        "closes_en": "23:59"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-813-2580-5326",
      "contactType": "Customer Service",
      "areaServed": "ID",
      "availableLanguage": ["id", "en"],
      "email": "info@vaniasugiartajaya.com"
    },
    "sameAs": [
      "https://www.facebook.com/vaniasugiartajaya",
      "https://www.instagram.com/vaniasugiartajaya",
      "https://www.whatsapp.com"
    ],
    "foundingDate": "2010",
    "founder": {
      "@type": "Person",
      "name": "Vania Sugiarta"
    },
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "50+"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Client Testimoni" },
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "Layanan sewa alat berat terbaik di Bali. Operator profesional dan berpengalaman."
      }
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
            "description": "Layanan sewa excavator (PC 30, PC 40, PC 58, PC 78, PC 200) berbagai ukuran untuk proyek galian, penggalian pondasi, dan pekerjaan tanah",
            "serviceType": "Equipment Rental"
          },
          "priceCurrency": "IDR",
          "price": "250000-350000",
          "priceValidUntil": "2025-12-31"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sewa Bulldozer",
            "description": "Layanan sewa bulldozer untuk land clearing, perataan tanah, dan pembukaan lahan",
            "serviceType": "Equipment Rental"
          },
          "priceCurrency": "IDR",
          "price": "300000-400000",
          "priceValidUntil": "2025-12-31"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sewa Crane",
            "description": "Layanan sewa crane untuk pengangkatan material berat pada proyek konstruksi",
            "serviceType": "Equipment Rental"
          },
          "priceCurrency": "IDR",
          "price": "350000-500000",
          "priceValidUntil": "2025-12-31"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sewa Loader",
            "description": "Layanan sewa loader untuk loading dan unloading material konstruksi",
            "serviceType": "Equipment Rental"
          },
          "priceCurrency": "IDR",
          "price": "300000-400000",
          "priceValidUntil": "2025-12-31"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Sewa Dump Truck",
            "description": "Layanan sewa dump truck untuk pengangkutan material proyek konstruksi",
            "serviceType": "Equipment Rental"
          },
          "priceCurrency": "IDR",
          "price": "250000-350000",
          "priceValidUntil": "2025-12-31"
        }
      ]
    },
    "knowsAbout": [
      "Equipment Rental",
      "Construction",
      "Heavy Machinery",
      "Excavator",
      "Bulldozer",
      "Crane",
      "Loader",
      "Dump Truck"
    ],
    "mainEntity": {
      "@type": "Service",
      "name": "Sewa Alat Berat Bali",
      "description": "Layanan sewa alat berat profesional untuk proyek konstruksi di Bali"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  )
}

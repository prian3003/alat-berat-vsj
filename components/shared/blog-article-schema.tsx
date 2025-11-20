interface BlogArticleSchemaProps {
  title: string
  description: string
  featuredImage?: string
  author: string
  datePublished: string
  dateModified: string
  slug: string
  category?: string
  tags?: string[]
}

export function BlogArticleSchema({
  title,
  description,
  featuredImage,
  author,
  datePublished,
  dateModified,
  slug,
  category,
  tags = []
}: BlogArticleSchemaProps) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://vaniasugiartajaya.com/blog/${slug}`,
    "headline": title,
    "name": title,
    "description": description,
    "articleBody": description,
    "image": featuredImage ? [
      {
        "@type": "ImageObject",
        "url": featuredImage,
        "width": 1200,
        "height": 630
      }
    ] : [],
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Person",
      "name": author || "VSJ Team",
      "url": "https://vaniasugiartajaya.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PT. Vania Sugiarta Jaya",
      "logo": {
        "@type": "ImageObject",
        "url": "https://vaniasugiartajaya.com/logo.png",
        "width": 200,
        "height": 200
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://vaniasugiartajaya.com/blog/${slug}`
    },
    "articleSection": category || "Sewa Alat Berat",
    "keywords": [
      "sewa alat berat",
      "rental alat berat bali",
      "excavator",
      "bulldozer",
      "crane",
      category || "alat berat",
      ...tags
    ].filter(Boolean).join(", "),
    "inLanguage": "id",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://vaniasugiartajaya.com",
      "name": "VSJ - Sewa Alat Berat Bali",
      "url": "https://vaniasugiartajaya.com"
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  )
}

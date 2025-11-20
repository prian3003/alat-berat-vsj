import { Metadata } from 'next'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { WhatsAppFloat } from '@/components/shared/whatsapp-float'
import { BlogPostDetailWrapper } from '@/components/blog/blog-post-detail-wrapper'
import { BlogArticleSchema } from '@/components/shared/blog-article-schema'
import { BreadcrumbSchema } from '@/components/shared/breadcrumb-schema'

// Generate metadata for SEO - with robust fallback
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const baseUrl = 'https://vaniasugiartajaya.com' // Use hardcoded URL for reliability

  try {
    // Fetch with timeout to prevent hanging
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

    const response = await fetch(`${baseUrl}/api/blog/public/${params.slug}`, {
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)'
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      // Return generic metadata instead of "Not Found" - post might exist but API is slow
      return {
        title: `${params.slug.replace(/-/g, ' ')} - VSJ Sewa Alat Berat Bali`,
        description: 'Artikel tentang sewa alat berat profesional di Bali untuk proyek konstruksi.',
        openGraph: {
          title: `${params.slug.replace(/-/g, ' ')} - VSJ Sewa Alat Berat Bali`,
          description: 'Artikel tentang sewa alat berat profesional di Bali',
          url: `${baseUrl}/blog/${params.slug}`,
          type: 'article'
        }
      }
    }

    const { data } = await response.json()

    // Extract text from content (remove HTML tags for description)
    const stripHtml = (html: string) => {
      return html.replace(/<[^>]*>/g, '').substring(0, 160)
    }

    const description = data.excerpt || stripHtml(data.content) || 'Artikel tentang sewa alat berat di Bali'

    return {
      title: `${data.title} - VSJ Sewa Alat Berat Bali`,
      description: description,
      keywords: [
        'sewa alat berat',
        'rental alat berat bali',
        'excavator bali',
        'bulldozer bali',
        'crane bali',
        data.category,
        ...data.tags || []
      ].filter(Boolean).join(', '),
      authors: [{ name: data.author || 'VSJ Team' }],
      creator: 'VSJ Team',
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        }
      },
      openGraph: {
        title: data.title,
        description: description,
        url: `${baseUrl}/blog/${params.slug}`,
        siteName: 'PT. Vania Sugiarta Jaya',
        images: data.featured_image ? [
          {
            url: data.featured_image,
            width: 1200,
            height: 630,
            alt: data.title,
            type: 'image/jpeg'
          }
        ] : [],
        locale: 'id_ID',
        type: 'article',
        publishedTime: data.published_at,
        modifiedTime: data.updated_at,
        authors: [data.author || 'VSJ Team']
      },
      twitter: {
        card: 'summary_large_image',
        title: data.title,
        description: description,
        images: data.featured_image ? [data.featured_image] : [],
        creator: '@vaniasugiartajaya'
      },
      alternates: {
        canonical: `${baseUrl}/blog/${params.slug}`
      }
    }
  } catch (error) {
    console.error('Error generating blog post metadata:', error)
    // Return metadata based on slug instead of generic "not found" message
    return {
      title: `${params.slug.replace(/-/g, ' ')} - VSJ Sewa Alat Berat Bali`,
      description: 'Artikel tentang sewa alat berat profesional di Bali untuk proyek konstruksi dan konstruksi bangunan.',
      robots: {
        index: true,
        follow: true
      },
      openGraph: {
        title: `${params.slug.replace(/-/g, ' ')} - VSJ Sewa Alat Berat Bali`,
        description: 'Artikel tentang sewa alat berat profesional di Bali',
        url: `${baseUrl}/blog/${params.slug}`,
        type: 'article'
      }
    }
  }
}

async function getBlogPostForSchema(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vaniasugiartajaya.com'
    const response = await fetch(`${baseUrl}/api/blog/public/${slug}`, {
      cache: 'no-store'
    })

    if (!response.ok) return null
    const { data } = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching blog post for schema:', error)
    return null
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostForSchema(params.slug)

  const breadcrumbItems = [
    { name: 'Home', url: 'https://vaniasugiartajaya.com' },
    { name: 'Blog', url: 'https://vaniasugiartajaya.com/blog' },
    { name: post?.title || 'Article', url: `https://vaniasugiartajaya.com/blog/${params.slug}` }
  ]

  return (
    <div className="min-h-screen">
      {post && (
        <>
          <BlogArticleSchema
            title={post.title}
            description={post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 160)}
            featuredImage={post.featured_image}
            author={post.author || 'VSJ Team'}
            datePublished={post.published_at}
            dateModified={post.updated_at}
            slug={params.slug}
            category={post.category}
            tags={post.tags}
          />
          <BreadcrumbSchema items={breadcrumbItems} />
        </>
      )}
      <Navbar />
      <WhatsAppFloat />
      <main>
        <BlogPostDetailWrapper slug={params.slug} />
      </main>
      <Footer />
    </div>
  )
}

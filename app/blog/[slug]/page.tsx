import { Metadata } from 'next'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import { WhatsAppFloat } from '@/components/shared/whatsapp-float'
import { BlogPostDetailWrapper } from '@/components/blog/blog-post-detail-wrapper'
import { BlogArticleSchema } from '@/components/shared/blog-article-schema'
import { BreadcrumbSchema } from '@/components/shared/breadcrumb-schema'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vaniasugiartajaya.com'
    const response = await fetch(`${baseUrl}/api/blog/public/${params.slug}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      return {
        title: 'Artikel Tidak Ditemukan - VSJ Sewa Alat Berat Bali',
        description: 'Artikel yang Anda cari tidak ditemukan.'
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
      ].join(', '),
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
            alt: data.title
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
        images: data.featured_image ? [data.featured_image] : []
      },
      alternates: {
        canonical: `${baseUrl}/blog/${params.slug}`
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Blog - VSJ Sewa Alat Berat Bali',
      description: 'Artikel tentang sewa alat berat di Bali'
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

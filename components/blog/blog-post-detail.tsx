'use client'

import { BlogPost } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useCallback, useRef } from 'react'

interface BlogPostDetailProps {
  post: BlogPost
}

interface RecentPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string | null
  published_at: string
  reading_time: number
  tags: string[]
}

interface TocItem {
  id: string
  text: string
  level: number
}

// CTA Card Component
function CTACard() {
  return (
    <div
      className="rounded-xl relative overflow-hidden py-8 sm:py-10 px-6 sm:px-8 flex items-center justify-center"
      style={{
        backgroundImage: 'url(/cardimage.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Glassmorphism background with better contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-black/50 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        <h3 className="mb-3 text-xl sm:text-2xl font-bold text-white leading-tight">
          Butuh Alat Berat untuk Proyek Anda?
        </h3>
        <p className="mb-6 text-sm sm:text-base text-white/90">
          Hubungi kami untuk konsultasi dan penawaran terbaik sewa alat berat di Bali.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-2.5 font-semibold text-orange-600 text-sm sm:text-base transition-all hover:bg-slate-100 hover:shadow-lg shadow-md"
          >
            <span>Hubungi Kami</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/#equipment"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/20 backdrop-blur-md border-2 border-white px-6 py-2.5 font-semibold text-white text-sm sm:text-base transition-all hover:bg-white/30 hover:shadow-lg"
          >
            Lihat Katalog
          </Link>
        </div>
      </div>
    </div>
  )
}

export function BlogPostDetail({ post }: BlogPostDetailProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = post.title
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])

  // Store heading texts and indices for mapping
  const headingTextsRef = useRef<Map<string, string>>(new Map())

  // Fetch recent posts
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch('/api/blog/recent')
        if (response.ok) {
          const { data } = await response.json()
          // Filter out current post
          setRecentPosts(data.filter((p: RecentPost) => p.slug !== post.slug).slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching recent posts:', error)
      }
    }

    fetchRecentPosts()
  }, [post.slug])

  // Extract table of contents from HTML content
  useEffect(() => {
    const contentElement = document.querySelector('.blog-content')

    if (!contentElement) {
      return
    }

    const actualHeadings = contentElement.querySelectorAll('h1, h2, h3, h4')

    const tocItems: TocItem[] = []
    headingTextsRef.current.clear()
    let tocIndex = 0

    // Extract headings and store their cleaned text
    actualHeadings.forEach((heading) => {
      if (heading.textContent && heading.textContent.trim().length > 0) {
        const id = `heading-${tocIndex}`
        const level = parseInt((heading as HTMLElement).tagName.substring(1))

        // Remove numbers like "1.", "2.", "1.2.3", etc. from the beginning
        let text = heading.textContent
        text = text.replace(/^[\d.]+\s*[\.)]\s*/, '').trim()

        // Store cleaned text for later lookup
        headingTextsRef.current.set(id, text)

        tocItems.push({
          id,
          text,
          level
        })

        tocIndex++
      }
    })

    setToc(tocItems)
  }, [post.content])


  const scrollToHeading = useCallback((id: string) => {
    console.log('scrollToHeading called with id:', id)

    const contentElement = document.querySelector('.blog-content')
    if (!contentElement) {
      console.log('Content element not found')
      return
    }

    // Get the cleaned text to search for
    const cleanedText = headingTextsRef.current.get(id)
    console.log('Looking for text:', cleanedText)

    if (!cleanedText) {
      console.log('Cleaned text not found for id:', id)
      return
    }

    // Find heading by matching cleaned text
    const headings = contentElement.querySelectorAll('h1, h2, h3, h4')
    let targetHeading: Element | null = null

    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i]
      let headingText = heading.textContent || ''
      headingText = headingText.replace(/^[\d.]+\s*[\.)]\s*/, '').trim()

      if (headingText === cleanedText) {
        targetHeading = heading
        break
      }
    }

    console.log('Target heading found:', !!targetHeading)

    if (targetHeading) {
      // Get position from current DOM element
      const rect = (targetHeading as HTMLElement).getBoundingClientRect()
      const scrollTop = window.scrollY + rect.top
      const navbarHeight = 120
      const targetScroll = scrollTop - navbarHeight

      console.log('BoundingClientRect.top:', rect.top)
      console.log('Current window.scrollY:', window.scrollY)
      console.log('Calculated scrollTop:', scrollTop)
      console.log('Target scroll position:', targetScroll)

      window.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth'
      })
    }
  }, [])

  return (
    <article className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-orange-600 transition-colors mb-8"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Blog
        </Link>

        {/* Main Content with Sidebar Layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Table of Contents - Sidebar (Hidden on mobile) */}
          {toc.length > 0 && (
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 max-h-[calc(100vh-140px)] overflow-y-auto pr-1 pt-14">
                <div className="rounded-md bg-slate-50 p-1.5">
                  <h4 className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-900 px-2">
                    <svg className="h-4 w-4 flex-shrink-0 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span>Daftar Isi</span>
                  </h4>
                  <nav className="space-y-0">
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveId(item.id)
                          scrollToHeading(item.id)
                        }}
                        className={`group relative block w-full text-left text-sm transition-all duration-200 ${
                          item.level === 3 ? 'pl-3' : 'pl-0'
                        } ${
                          activeId === item.id
                            ? 'font-semibold text-orange-600'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span className={`block py-1.5 px-2 border-l-2 transition-all duration-200 truncate text-xs leading-relaxed ${
                          activeId === item.id
                            ? 'border-orange-600 bg-orange-50/50'
                            : 'border-transparent hover:border-slate-300 hover:bg-white/30'
                        }`}>
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>
          )}

          {/* Article Container */}
          <div className="lg:col-span-9">
            <div className="mx-auto max-w-3xl">
              {/* Header */}
              <header className="mb-10">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h1 className="mb-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                  {post.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 border-b border-slate-200 pb-6">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{post.author_name}</span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <time>
                    {new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span className="text-slate-400">•</span>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{post.reading_time} menit baca</span>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {post.featured_image && (
                <div className="relative mb-12 overflow-hidden rounded-xl">
                  <div className="relative aspect-[16/9] bg-slate-100">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 896px"
                    />
                  </div>
                </div>
              )}

              {/* Middle CTA */}
              <div className="my-12">
                <CTACard />
              </div>

              {/* Content */}
              <div
                className="blog-content prose prose-lg max-w-none
                  prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
                  prose-h2:mt-20 prose-h2:mb-8 prose-h2:text-4xl prose-h2:font-black prose-h2:leading-tight prose-h2:border-b-2 prose-h2:border-slate-200 prose-h2:pb-4
                  prose-h3:mt-14 prose-h3:mb-5 prose-h3:text-2xl prose-h3:font-extrabold prose-h3:text-slate-800 prose-h3:leading-snug
                  prose-h4:mt-10 prose-h4:mb-4 prose-h4:text-xl prose-h4:font-bold prose-h4:text-slate-700
                  prose-p:mb-7 prose-p:text-lg prose-p:leading-loose prose-p:text-slate-700
                  prose-a:font-medium prose-a:text-orange-600 prose-a:underline prose-a:decoration-orange-300 prose-a:decoration-2 prose-a:underline-offset-2 hover:prose-a:text-orange-700 hover:prose-a:decoration-orange-500
                  prose-strong:font-extrabold prose-strong:text-slate-900
                  prose-em:italic prose-em:text-slate-600
                  prose-ul:my-8 prose-ul:list-disc prose-ul:space-y-4 prose-ul:pl-8
                  prose-ol:my-8 prose-ol:list-decimal prose-ol:space-y-4 prose-ol:pl-8
                  prose-li:text-lg prose-li:leading-loose prose-li:text-slate-700 prose-li:pl-3
                  prose-li:marker:text-orange-500 prose-li:marker:font-bold
                  prose-img:my-12 prose-img:rounded-xl prose-img:shadow-2xl
                  prose-blockquote:my-10 prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:py-6 prose-blockquote:pl-8 prose-blockquote:pr-6 prose-blockquote:italic prose-blockquote:text-lg prose-blockquote:text-slate-700
                  prose-code:rounded-md prose-code:bg-slate-100 prose-code:px-2.5 prose-code:py-1 prose-code:text-base prose-code:font-mono prose-code:text-orange-600 prose-code:before:content-[''] prose-code:after:content-['']
                  prose-pre:my-10 prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:p-6
                  [&>p:first-of-type]:text-xl [&>p:first-of-type]:font-medium [&>p:first-of-type]:text-slate-800 [&>p:first-of-type]:leading-loose"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Share Section */}
              <div className="mt-16 border-t border-slate-200 pt-10">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Bagikan Artikel
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${shareText} - ${shareUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      WhatsApp
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </a>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          navigator.clipboard.writeText(window.location.href)
                          alert('Link berhasil disalin!')
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Salin Link
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-16">
                <CTACard />
              </div>

              {/* Recent Posts Section */}
              {recentPosts.length > 0 && (
                <div className="mt-16 border-t border-slate-200 pt-12">
                  <h2 className="mb-8 text-2xl font-bold text-slate-900">
                    Postingan Terakhir
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentPosts.map((recentPost) => (
                      <Link
                        key={recentPost.id}
                        href={`/blog/${recentPost.slug}`}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-lg hover:border-orange-200"
                      >
                        {/* Featured Image */}
                        {recentPost.featured_image && (
                          <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                            <Image
                              src={recentPost.featured_image}
                              alt={recentPost.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-5">
                          {/* Tags */}
                          {recentPost.tags && recentPost.tags.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-2">
                              {recentPost.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Title */}
                          <h3 className="mb-2 text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {recentPost.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="mb-3 text-sm text-slate-600 line-clamp-2">
                            {recentPost.excerpt}
                          </p>

                          {/* Meta */}
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{recentPost.reading_time} menit baca</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BlogPost } from '@/types'
import { BlogPostDetail } from './blog-post-detail'

interface BlogPostDetailWrapperProps {
  slug: string
}

export function BlogPostDetailWrapper({ slug }: BlogPostDetailWrapperProps) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/public/${slug}`)

        if (!response.ok) {
          setError(true)
          setLoading(false)
          return
        }

        const { data } = await response.json()
        setPost(data)
      } catch (err) {
        console.error('Error fetching post:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"></div>
          <p className="text-slate-600">Memuat artikel...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">404</h1>
          <p className="mb-8 text-lg text-slate-600">Artikel tidak ditemukan</p>
          <button
            onClick={() => router.push('/blog')}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-white transition-colors hover:bg-orange-700"
          >
            Kembali ke Blog
          </button>
        </div>
      </div>
    )
  }

  return <BlogPostDetail post={post} />
}

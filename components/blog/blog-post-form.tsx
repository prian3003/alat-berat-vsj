'use client'

import { useState, useEffect } from 'react'
import { BlogPost, BlogPostInsert, BlogPostUpdate } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface BlogPostFormProps {
  post?: BlogPost | null
  onSuccess: () => void
  onCancel: () => void
}

export function BlogPostForm({ post, onSuccess, onCancel }: BlogPostFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    featured_image: post?.featured_image || '',
    published: post?.published || false,
    author_name: post?.author_name || 'VSJ Team',
    reading_time: post?.reading_time || 5,
    tags: post?.tags?.join(', ') || ''
  })

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Upload via API endpoint
      const response = await fetch('/api/blog/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const { url } = await response.json()
      setFormData(prev => ({ ...prev, featured_image: url }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Gagal mengunggah gambar')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const data = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featured_image: formData.featured_image || null,
        published: formData.published,
        published_at: formData.published ? new Date().toISOString() : null,
        author_name: formData.author_name,
        reading_time: formData.reading_time,
        tags: tagsArray
      }

      if (post) {
        // Update existing post via API
        const response = await fetch(`/api/blog/posts/${post.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Failed to update post')
        }
      } else {
        // Create new post via API
        const response = await fetch('/api/blog/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Failed to create post')
        }
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Gagal menyimpan artikel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
          Judul Artikel <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          placeholder="Masukkan judul artikel"
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-2">
          Slug URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="slug"
          required
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          placeholder="artikel-sewa-alat-berat"
        />
        <p className="mt-1 text-xs text-slate-500">
          URL: /blog/{formData.slug || 'slug-artikel'}
        </p>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-2">
          Ringkasan <span className="text-red-500">*</span>
        </label>
        <textarea
          id="excerpt"
          required
          rows={3}
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          placeholder="Ringkasan singkat artikel (2-3 kalimat)"
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
          Konten Artikel (HTML) <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          required
          rows={15}
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 font-mono text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          placeholder="<p>Konten artikel dalam format HTML...</p>"
        />
        <p className="mt-1 text-xs text-slate-500">
          Gunakan HTML untuk formatting (h2, h3, p, strong, ul, ol, dll)
        </p>
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Gambar Utama
        </label>
        {formData.featured_image && (
          <div className="mb-4 relative aspect-video w-full max-w-md overflow-hidden rounded-lg">
            <Image
              src={formData.featured_image}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
              className="absolute top-2 right-2 rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50"
        />
        {uploading && <p className="mt-2 text-sm text-orange-600">Mengunggah gambar...</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Author Name */}
        <div>
          <label htmlFor="author_name" className="block text-sm font-medium text-slate-700 mb-2">
            Nama Penulis <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="author_name"
            required
            value={formData.author_name}
            onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>

        {/* Reading Time */}
        <div>
          <label htmlFor="reading_time" className="block text-sm font-medium text-slate-700 mb-2">
            Waktu Baca (menit)
          </label>
          <input
            type="number"
            id="reading_time"
            min="1"
            value={formData.reading_time}
            onChange={(e) => setFormData(prev => ({ ...prev, reading_time: parseInt(e.target.value) }))}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-2">
          Tag (pisahkan dengan koma)
        </label>
        <input
          type="text"
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          placeholder="Alat Berat, Excavator, Tips Konstruksi"
        />
      </div>

      {/* Published */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          checked={formData.published}
          onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
          className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
        />
        <label htmlFor="published" className="text-sm font-medium text-slate-700">
          Publikasikan artikel
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 border-t pt-6">
        <Button type="submit" disabled={loading || uploading}>
          {loading ? 'Menyimpan...' : post ? 'Update Artikel' : 'Buat Artikel'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
      </div>
    </form>
  )
}

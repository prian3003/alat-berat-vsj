'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { useConfirm } from '@/hooks/use-confirm'

interface GalleryImage {
  id: string
  title: string
  description: string
  image_url: string
  category: string
  sort_order: number
  published: boolean
}

export default function AdminGalleryPage() {
  const { toast } = useToast()
  const { confirm } = useConfirm()
  const { isAuthenticated, isLoading, logout } = useAuth()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'general',
    sort_order: 0,
    published: true
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchGalleryImages()
    }
  }, [isAuthenticated])

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (!response.ok) {
        throw new Error('Failed to fetch gallery images')
      }
      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.error('Error fetching gallery:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat gambar galeri",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, image_url: data.url }))
      toast({
        variant: "success",
        title: "Berhasil",
        description: "Gambar berhasil diunggah",
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengunggah gambar",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create gallery image')
      }

      toast({
        variant: "success",
        title: "Berhasil",
        description: "Gambar galeri berhasil ditambahkan",
      })

      fetchGalleryImages()
      setFormData({
        title: '',
        description: '',
        image_url: '',
        category: 'general',
        sort_order: 0,
        published: true
      })
      setShowForm(false)
    } catch (error) {
      console.error('Error creating gallery image:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menambahkan gambar galeri",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await confirm({
      title: "Hapus Gambar",
      description: `Apakah Anda yakin ingin menghapus "${title}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      cancelText: "Batal"
    })

    if (!confirmed) return

    try {
      const response = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete gallery image')
      }

      toast({
        variant: "success",
        title: "Berhasil",
        description: "Gambar berhasil dihapus",
      })

      fetchGalleryImages()
    } catch (error) {
      console.error('Error deleting gallery image:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menghapus gambar",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Memeriksa autentikasi...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-600">Kelola alat berat dan konten website</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/">Kembali ke Website</Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-4 border-b">
            <Link
              href="/admin"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Alat Berat
            </Link>
            <Link
              href="/admin/blog"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Blog
            </Link>
            <Link
              href="/admin/gallery"
              className="border-b-2 border-orange-600 px-4 py-3 text-sm font-medium text-orange-600"
            >
              Galeri
            </Link>
            <Link
              href="/admin/surat"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Surat Jalan
            </Link>
            <Link
              href="/admin/perjanjian"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Surat Perjanjian Sewa
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Kelola Galeri</h2>
              <p className="mt-2 text-slate-600">Tambah, ubah, atau hapus gambar galeri</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-white font-medium hover:bg-orange-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Gambar
            </button>
          </div>
        </motion.div>

        {/* Form */}
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            className="mb-8 rounded-lg bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-900">Judul</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-orange-600 focus:ring-orange-600"
                  placeholder="Judul gambar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900">Kategori</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-orange-600 focus:ring-orange-600"
                  placeholder="general"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-900">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-orange-600 focus:ring-orange-600"
                placeholder="Deskripsi gambar"
                rows={3}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-900">Upload Gambar</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => e.target.files && handleFileUpload(e.target.files[0])}
                className="mt-1 block w-full text-slate-900"
              />
              {formData.image_url && (
                <div className="mt-4 relative w-32 h-32">
                  <Image
                    src={formData.image_url}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={uploading || !formData.image_url}
                className="rounded-lg bg-orange-600 px-4 py-2 text-white font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Menyimpan...' : 'Simpan Gambar'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-900 font-medium hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
            </div>
          </motion.form>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                className="rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <Image
                    src={image.image_url}
                    alt={image.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{image.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{image.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                      {image.category}
                    </span>
                    <button
                      onClick={() => handleDelete(image.id, image.title)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && images.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-600">Tidak ada gambar. Silakan tambah gambar terlebih dahulu.</p>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  )
}

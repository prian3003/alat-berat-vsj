'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { useConfirm } from '@/hooks/use-confirm'

interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  video_url?: string
  category: string
  sort_order: number
  published: boolean
  media_type?: 'image' | 'video'
  thumbnail_url?: string
  duration?: number
}

export default function AdminGalleryPage() {
  const { toast } = useToast()
  const { confirm } = useConfirm()
  const { isAuthenticated, isLoading, logout } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null)
  const [inputType, setInputType] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState('')
  const [urlLoading, setUrlLoading] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    video_url: '',
    category: 'general',
    sort_order: 0,
    published: true,
    media_type: 'image' as 'image' | 'video',
    thumbnail_url: '',
    duration: 0
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

  const validateMediaUrl = async (url: string) => {
    if (!url) {
      setUrlError(null)
      return false
    }

    try {
      new URL(url)
    } catch {
      setUrlError('URL tidak valid')
      return false
    }

    setUrlLoading(true)
    setUrlError(null)

    try {
      const response = await fetch(url, { method: 'HEAD' })
      const contentType = response.headers.get('content-type') || ''

      const isImage = contentType.startsWith('image/')
      const isVideo = contentType.startsWith('video/')

      if (!isImage && !isVideo) {
        setUrlError('URL harus berupa gambar atau video')
        setUrlLoading(false)
        return false
      }

      setUrlError(null)
      setUrlLoading(false)
      return true
    } catch (error) {
      setUrlError('Tidak dapat memverifikasi URL ini')
      setUrlLoading(false)
      return false
    }
  }

  const handleAddMediaUrl = async () => {
    if (!urlInput.trim()) {
      setUrlError('Masukkan URL gambar atau video terlebih dahulu')
      return
    }

    const isValid = await validateMediaUrl(urlInput)
    if (!isValid) return

    // Set form data with URL
    const isVideo = urlInput.toLowerCase().includes('.mp4') || urlInput.toLowerCase().includes('.webm')

    if (isVideo) {
      setFormData(prev => ({
        ...prev,
        video_url: urlInput,
        media_type: 'video'
      }))
      setMediaType('video')
      toast({
        variant: "success",
        title: "Berhasil",
        description: "URL video berhasil ditambahkan",
      })
    } else {
      setFormData(prev => ({
        ...prev,
        image_url: urlInput,
        media_type: 'image'
      }))
      setMediaType('image')
      toast({
        variant: "success",
        title: "Berhasil",
        description: "URL gambar berhasil ditambahkan",
      })
    }

    setUrlInput('')
    setUrlError(null)
    setInputType('upload')
  }

  const handleFileSelect = (file: File) => {
    // Validate file type
    const isImage = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)
    const isVideo = ['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type)

    if (!isImage && !isVideo) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Format file tidak didukung. Gunakan PNG, JPEG, WebP, MP4, atau WebM.",
      })
      return
    }

    // Validate file size (500MB for videos, 100MB for images)
    const maxSize = isVideo ? 500 * 1024 * 1024 : 100 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Ukuran file terlalu besar (${(file.size / 1024 / 1024).toFixed(2)}MB). Maksimal ${isVideo ? '500MB' : '100MB'}.`,
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setFilePreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setSelectedFile(file)
    setMediaType(isVideo ? 'video' : 'image')
    setFormData(prev => ({ ...prev, media_type: isVideo ? 'video' : 'image' }))
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Pilih file terlebih dahulu",
      })
      return
    }

    const formDataUpload = new FormData()
    formDataUpload.append('file', selectedFile)

    try {
      setUploading(true)
      setUploadProgress(0)

      // Simulate upload progress (0-90% while uploading)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 90) return prev + Math.random() * 30
          return prev
        })
      }, 500)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      clearInterval(progressInterval)
      setUploadProgress(90)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      setUploadProgress(100)

      if (mediaType === 'video') {
        setFormData(prev => ({
          ...prev,
          video_url: data.url,
          thumbnail_url: data.metadata?.thumbnailUrl || '',
          duration: data.metadata?.duration || 0
        }))
        toast({
          variant: "success",
          title: "Berhasil",
          description: `Video berhasil diunggah (${data.metadata?.originalSize}MB → ${data.metadata?.compressedSize}MB MP4 terkompresi)`,
        })
      } else {
        setFormData(prev => ({ ...prev, image_url: data.url }))
        toast({
          variant: "success",
          title: "Berhasil",
          description: `Gambar berhasil diunggah (${(selectedFile.size / 1024 / 1024).toFixed(2)}MB → WebP terkompresi)`,
        })
      }
      setSelectedFile(null)

      // Reset progress after success
      setTimeout(() => setUploadProgress(0), 1000)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal mengunggah gambar",
      })
      setUploadProgress(0)
    } finally {
      setUploading(false)
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
        video_url: '',
        category: 'general',
        sort_order: 0,
        published: true,
        media_type: 'image',
        thumbnail_url: '',
        duration: 0
      })
      setSelectedFile(null)
      setFilePreviewUrl(null)
      setMediaType(null)
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
            <Link
              href="/admin/buku-besar"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Buku Besar
            </Link>
            <Link
              href="/admin/invoice"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Invoice
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
              <label className="block text-sm font-medium text-slate-900 mb-3">Tambah Media</label>

              {/* Toggle between Upload and URL */}
              <div className="mb-3 flex gap-2 bg-slate-100 rounded-lg p-1 w-fit">
                <button
                  type="button"
                  onClick={() => setInputType('upload')}
                  className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                    inputType === 'upload'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setInputType('url')}
                  className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                    inputType === 'url'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Dari URL
                </button>
              </div>

              {/* File Upload Button */}
              {inputType === 'upload' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Pilih File
                  </button>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleFileUpload}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          </svg>
                          Mengunggah...
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          Upload
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,video/mp4,video/webm,video/quicktime"
                  onChange={e => e.target.files && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                {/* File info and validation */}
                {selectedFile && (
                  <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold">{selectedFile.name}</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Ukuran: {(selectedFile.size / 1024 / 1024).toFixed(2)}MB
                      </p>
                      <p className="text-xs text-blue-700">
                        Tipe: {selectedFile.type}
                      </p>
                    </div>
                  </div>
                )}

                {/* Upload progress bar */}
                {uploading && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-green-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 text-center">{Math.round(uploadProgress)}% - Mengompresi ke WebP...</p>
                  </div>
                )}

                {/* File preview */}
                {filePreviewUrl && mediaType === 'image' && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-slate-600 mb-2">Preview Gambar:</p>
                    <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-slate-300">
                      <Image
                        src={filePreviewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Video preview */}
                {filePreviewUrl && mediaType === 'video' && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-slate-600 mb-2">Preview Video:</p>
                    <video
                      controls
                      className="w-48 h-auto rounded-lg border border-slate-300 bg-black"
                      src={filePreviewUrl}
                    />
                  </div>
                )}

                {/* Uploaded image preview */}
                {formData.image_url && !selectedFile && formData.media_type === 'image' && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-slate-600 mb-2">Gambar Terupload (WebP):</p>
                    <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-slate-300 bg-slate-100">
                      <Image
                        src={formData.image_url}
                        alt="Uploaded"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Uploaded video preview */}
                {formData.video_url && !selectedFile && formData.media_type === 'video' && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-slate-600 mb-2">Video Terupload (MP4):</p>
                    <video
                      controls
                      className="w-48 h-auto rounded-lg border border-slate-300 bg-black"
                      src={formData.video_url}
                      poster={formData.thumbnail_url}
                    />
                    {formData.duration > 0 && (
                      <p className="text-xs text-slate-600 mt-2">Durasi: {Math.floor(formData.duration)}s</p>
                    )}
                  </div>
                )}
              </div>
              )}

              {/* URL Input Section */}
              {inputType === 'url' && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-300">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value)
                      setUrlError(null)
                    }}
                    placeholder="https://example.com/image.jpg atau https://example.com/video.mp4"
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                      urlError
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                    disabled={urlLoading}
                  />
                  <button
                    type="button"
                    onClick={handleAddMediaUrl}
                    disabled={!urlInput.trim() || urlLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {urlLoading ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        </svg>
                        Validasi...
                      </>
                    ) : (
                      'Tambah'
                    )}
                  </button>
                </div>
                {urlError && (
                  <p className="text-sm text-red-600">{urlError}</p>
                )}
                <p className="text-xs text-slate-500">Masukkan URL gambar atau video dan klik Tambah untuk menambahkan ke galeri</p>
              </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={uploading || (!formData.image_url && !formData.video_url)}
                className="rounded-lg bg-orange-600 px-4 py-2 text-white font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Menyimpan...' : `Simpan ${formData.media_type === 'video' ? 'Video' : 'Gambar'}`}
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
                <div className="relative aspect-square overflow-hidden bg-slate-100 group">
                  {image.media_type === 'video' && image.video_url ? (
                    <>
                      <video
                        src={image.video_url}
                        poster={image.thumbnail_url}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                        <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Video {image.duration && `(${Math.floor(image.duration)}s)`}
                      </div>
                    </>
                  ) : (
                    <Image
                      src={image.image_url}
                      alt={image.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
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

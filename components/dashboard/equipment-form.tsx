'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EQUIPMENT_CATEGORIES, HeavyEquipmentWithImages } from '@/types'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'

interface EquipmentFormProps {
  equipment?: HeavyEquipmentWithImages
  onSuccess: () => void
  onCancel: () => void
}

interface ImageUpload {
  id?: string
  url: string
  isPrimary: boolean
  file?: File
}

export function EquipmentForm({ equipment, onSuccess, onCancel }: EquipmentFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<ImageUpload[]>([])
  const [imageInputType, setImageInputType] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState('')
  const [urlLoading, setUrlLoading] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    category: equipment?.category || '',
    description: equipment?.description || '',
    pricePerHour: equipment?.price_per_hour?.toString() || '',
    imageUrl: equipment?.image_url || '',
    isAvailable: equipment?.is_available ?? true,
    specifications: {
      brand: '',
      model: '',
      capacity: '',
      engine_power: '',
      ...(equipment?.specifications as Record<string, string> || {}),
    },
  })

  // Load existing images when editing
  useEffect(() => {
    if (equipment?.equipment_images && equipment.equipment_images.length > 0) {
      const existingImages = equipment.equipment_images.map(img => ({
        id: img.id,
        url: img.image_url,
        isPrimary: img.is_primary,
      }))
      setImages(existingImages)
    }
  }, [equipment])

  const validateImageUrl = async (url: string) => {
    if (!url) {
      setUrlError(null)
      return false
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      setUrlError('URL tidak valid')
      return false
    }

    // Check if URL points to an image
    setUrlLoading(true)
    setUrlError(null)

    try {
      const response = await fetch(url, { method: 'HEAD' })
      const contentType = response.headers.get('content-type')

      if (!contentType?.startsWith('image/')) {
        setUrlError('URL bukan gambar yang valid')
        setUrlLoading(false)
        return false
      }

      setUrlError(null)
      setUrlLoading(false)
      return true
    } catch (error) {
      setUrlError('Tidak dapat memuat gambar dari URL ini')
      setUrlLoading(false)
      return false
    }
  }

  const handleAddImageUrl = async () => {
    if (!urlInput.trim()) {
      setUrlError('Masukkan URL gambar terlebih dahulu')
      return
    }

    const isValid = await validateImageUrl(urlInput)
    if (!isValid) return

    setImages([...images, {
      url: urlInput,
      isPrimary: images.length === 0,
    }])

    setUrlInput('')
    setUrlError(null)
    toast({
      variant: "success",
      title: "Berhasil",
      description: "Gambar dari URL berhasil ditambahkan",
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Upload failed')

        const data = await response.json()
        return {
          url: data.url,
          isPrimary: images.length === 0, // First image is primary
        }
      })

      const uploadedImages = await Promise.all(uploadPromises)
      setImages([...images, ...uploadedImages])
      toast({
        variant: "success",
        title: "Berhasil",
        description: `${uploadedImages.length} gambar berhasil diunggah`,
      })
    } catch (error) {
      console.error('Error uploading images:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal mengupload gambar",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    // If we removed the primary image, make the first image primary
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true
    }
    setImages(newImages)
  }

  const handleSetPrimary = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First, save the equipment
      const data = {
        name: formData.name,
        category: formData.category,
        description: formData.description || null,
        pricePerHour: formData.pricePerHour ? parseFloat(formData.pricePerHour) : null,
        imageUrl: formData.imageUrl || null,
        isAvailable: formData.isAvailable,
        specifications: formData.specifications,
        images: images.map(img => ({
          url: img.url,
          isPrimary: img.isPrimary,
        })),
      }

      const url = equipment ? `/api/equipment/${equipment.id}` : '/api/equipment'
      const method = equipment ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save equipment')
      }

      toast({
        variant: "success",
        title: "Berhasil",
        description: equipment ? "Alat berat berhasil diupdate" : "Alat berat berhasil ditambahkan",
      })

      onSuccess()
    } catch (error) {
      console.error('Error saving equipment:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Alat Berat *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contoh: Excavator Komatsu PC200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            required
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {EQUIPMENT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Deskripsi lengkap alat berat..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pricePerHour">Harga per Jam (Rp)</Label>
        <Input
          id="pricePerHour"
          type="number"
          value={formData.pricePerHour}
          onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
          placeholder="250000"
        />
        <p className="text-xs text-slate-500">Kosongkan jika ingin menampilkan "Hubungi Kami"</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL Gambar (Legacy)</Label>
        <Input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-xs text-slate-500">Opsional - Gunakan upload gambar di bawah untuk multiple images</p>
      </div>

      {/* Multiple Image Upload Section */}
      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Galeri Gambar</h3>
          <div className="flex gap-2">
            {/* Toggle between Upload and URL */}
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setImageInputType('upload')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  imageInputType === 'upload'
                    ? 'bg-orange-600 text-white'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setImageInputType('url')}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  imageInputType === 'url'
                    ? 'bg-orange-600 text-white'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                Dari URL
              </button>
            </div>

            {/* Upload File Button */}
            {imageInputType === 'upload' && (
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Upload Gambar
                </div>
              </Label>
            )}
          </div>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
        </div>

        {/* URL Input Section */}
        {imageInputType === 'url' && (
          <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value)
                  setUrlError(null)
                }}
                placeholder="https://example.com/image.jpg"
                className={`flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  urlError
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-300 focus:border-orange-500 focus:ring-orange-500/20'
                }`}
                disabled={urlLoading}
              />
              <Button
                type="button"
                onClick={handleAddImageUrl}
                disabled={!urlInput.trim() || urlLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {urlLoading ? 'Validasi...' : 'Tambah'}
              </Button>
            </div>
            {urlError && (
              <p className="text-sm text-red-600">{urlError}</p>
            )}
            <p className="text-xs text-slate-500">Masukkan URL gambar dan klik Tambah untuk menambahkan ke galeri</p>
          </div>
        )}

        {uploading && (
          <div className="text-center text-sm text-slate-600">
            Mengupload gambar...
          </div>
        )}

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.map((image, index) => (
              <div key={index} className="group relative aspect-video overflow-hidden rounded-lg border-2 border-slate-200">
                <Image
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="200px"
                />

                {/* Primary badge */}
                {image.isPrimary && (
                  <div className="absolute left-2 top-2 rounded bg-orange-600 px-2 py-1 text-xs font-medium text-white">
                    Utama
                  </div>
                )}

                {/* Actions overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  {!image.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      className="rounded-full bg-white p-2 text-slate-900 transition-transform hover:scale-110"
                      title="Jadikan gambar utama"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="rounded-full bg-red-600 p-2 text-white transition-transform hover:scale-110"
                    title="Hapus gambar"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p className="mt-2 text-sm text-slate-600">Belum ada gambar</p>
            <p className="text-xs text-slate-500">Klik tombol "Upload Gambar" untuk menambahkan</p>
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold">Spesifikasi</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formData.specifications.brand}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, brand: e.target.value },
                })
              }
              placeholder="Contoh: Komatsu"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formData.specifications.model}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, model: e.target.value },
                })
              }
              placeholder="Contoh: PC200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Kapasitas</Label>
            <Input
              id="capacity"
              value={formData.specifications.capacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, capacity: e.target.value },
                })
              }
              placeholder="Contoh: 20 ton"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="engine_power">Daya Mesin</Label>
            <Input
              id="engine_power"
              value={formData.specifications.engine_power}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, engine_power: e.target.value },
                })
              }
              placeholder="Contoh: 123 kW"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isAvailable"
          checked={formData.isAvailable}
          onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <Label htmlFor="isAvailable" className="cursor-pointer">
          Tersedia untuk disewa
        </Label>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" disabled={loading} className="bg-black hover:bg-slate-800">
          {loading ? 'Menyimpan...' : 'Tambah'}
        </Button>
      </div>
    </form>
  )
}

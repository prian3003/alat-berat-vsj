'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SuratJalanTemplate } from '@/components/surat-jalan/surat-jalan-template'

interface SuratJalanItem {
  urutan: number
  jenisUnit: string
  seri: string
  lokasi: string
  keterangan?: string
}

interface SuratJalan {
  id: string
  noSurat: string
  tanggal: string
  jenisKendaraan: string
  noPol: string
  sopir: string
  tujuan?: string
  keterangan?: string
  status: string
  items: SuratJalanItem[]
}

export default function SuratJalanPage() {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [suratList, setSuratList] = useState<SuratJalan[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [selectedSurat, setSelectedSurat] = useState<SuratJalan | null>(null)

  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    jenisKendaraan: '',
    noPol: '',
    sopir: '',
    tujuan: '',
    keterangan: '',
    items: [{ urutan: 1, jenisUnit: '', seri: '', lokasi: '', keterangan: '' }],
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchSuratList()
    }
  }, [isAuthenticated])

  const fetchSuratList = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/surat-jalan')
      const data = await response.json()
      setSuratList(data)
    } catch (error) {
      console.error('Error fetching surat jalan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          urutan: formData.items.length + 1,
          jenisUnit: '',
          seri: '',
          lokasi: '',
          keterangan: '',
        },
      ],
    })
  }

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      items: newItems.map((item, i) => ({
        ...item,
        urutan: i + 1,
      })),
    })
  }

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      const payload = {
        ...formData,
        items: formData.items.map((item) => ({
          jenisUnit: item.jenisUnit,
          seri: item.seri,
          lokasi: item.lokasi,
          keterangan: item.keterangan || null,
        })),
      }

      const url = editingId
        ? `/api/surat-jalan/${editingId}`
        : '/api/surat-jalan'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to save surat jalan')
      }

      await fetchSuratList()
      resetForm()
      setShowForm(false)
    } catch (error) {
      console.error('Error saving surat jalan:', error)
      alert('Gagal menyimpan surat jalan')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (surat: SuratJalan) => {
    setFormData({
      tanggal: surat.tanggal,
      jenisKendaraan: surat.jenisKendaraan,
      noPol: surat.noPol,
      sopir: surat.sopir,
      tujuan: surat.tujuan || '',
      keterangan: surat.keterangan || '',
      items: surat.items.map(item => ({
        urutan: item.urutan,
        jenisUnit: item.jenisUnit,
        seri: item.seri,
        lokasi: item.lokasi,
        keterangan: item.keterangan || '',
      })),
    })
    setEditingId(surat.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus surat jalan ini?')) return

    try {
      setLoading(true)
      const response = await fetch(`/api/surat-jalan/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete surat jalan')
      }

      await fetchSuratList()
    } catch (error) {
      console.error('Error deleting surat jalan:', error)
      alert('Gagal menghapus surat jalan')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      jenisKendaraan: '',
      noPol: '',
      sopir: '',
      tujuan: '',
      keterangan: '',
      items: [{ urutan: 1, jenisUnit: '', seri: '', lokasi: '', keterangan: '' }],
    })
    setEditingId(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
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
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Galeri
            </Link>
            <Link
              href="/admin/surat"
              className="border-b-2 border-orange-600 px-4 py-3 text-sm font-medium text-orange-600"
            >
              Surat Jalan
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">
                {editingId ? 'Edit Surat Jalan' : 'Buat Surat Jalan'}
              </h2>

              {!showForm ? (
                <Button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  + Buat Surat Baru
                </Button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Tanggal */}
                  <div>
                    <label className="block text-sm font-medium">Tanggal</label>
                    <input
                      type="date"
                      required
                      value={formData.tanggal}
                      onChange={(e) =>
                        setFormData({ ...formData, tanggal: e.target.value })
                      }
                      className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Jenis Kendaraan */}
                  <div>
                    <label className="block text-sm font-medium">
                      Jenis Kendaraan
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Truck, Excavator"
                      value={formData.jenisKendaraan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jenisKendaraan: e.target.value,
                        })
                      }
                      className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>

                  {/* No Pol */}
                  <div>
                    <label className="block text-sm font-medium">No Pol</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: B 1234 ABC"
                      value={formData.noPol}
                      onChange={(e) =>
                        setFormData({ ...formData, noPol: e.target.value })
                      }
                      className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Sopir */}
                  <div>
                    <label className="block text-sm font-medium">Sopir</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Sopir"
                      value={formData.sopir}
                      onChange={(e) =>
                        setFormData({ ...formData, sopir: e.target.value })
                      }
                      className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Tujuan */}
                  <div>
                    <label className="block text-sm font-medium">Tujuan</label>
                    <input
                      type="text"
                      placeholder="Lokasi tujuan (opsional)"
                      value={formData.tujuan}
                      onChange={(e) =>
                        setFormData({ ...formData, tujuan: e.target.value })
                      }
                      className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    />
                  </div>

                  {/* Keterangan */}
                  <div>
                    <label className="block text-sm font-medium">
                      Keterangan
                    </label>
                    <textarea
                      placeholder="Keterangan tambahan (opsional)"
                      value={formData.keterangan}
                      onChange={(e) =>
                        setFormData({ ...formData, keterangan: e.target.value })
                      }
                      className="mt-1 w-full border rounded px-3 py-2 text-sm"
                      rows={3}
                    />
                  </div>

                  {/* Items Section */}
                  <div className="border-t pt-4">
                    <h3 className="mb-3 font-semibold text-sm">Alat Berat</h3>
                    <div className="max-h-64 space-y-3 overflow-y-auto">
                      {formData.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded border bg-gray-50 p-3 space-y-2"
                        >
                          <div className="text-xs font-medium text-gray-600">
                            Item {idx + 1}
                          </div>

                          <input
                            type="text"
                            placeholder="Jenis Unit"
                            value={item.jenisUnit}
                            onChange={(e) =>
                              handleItemChange(idx, 'jenisUnit', e.target.value)
                            }
                            className="w-full border rounded px-2 py-1 text-xs"
                          />

                          <input
                            type="text"
                            placeholder="Seri"
                            value={item.seri}
                            onChange={(e) =>
                              handleItemChange(idx, 'seri', e.target.value)
                            }
                            className="w-full border rounded px-2 py-1 text-xs"
                          />

                          <input
                            type="text"
                            placeholder="Lokasi"
                            value={item.lokasi}
                            onChange={(e) =>
                              handleItemChange(idx, 'lokasi', e.target.value)
                            }
                            className="w-full border rounded px-2 py-1 text-xs"
                          />

                          <input
                            type="text"
                            placeholder="Keterangan"
                            value={item.keterangan || ''}
                            onChange={(e) =>
                              handleItemChange(
                                idx,
                                'keterangan',
                                e.target.value
                              )
                            }
                            className="w-full border rounded px-2 py-1 text-xs"
                          />

                          {formData.items.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              variant="outline"
                              size="sm"
                              className="w-full text-xs text-red-600"
                            >
                              Hapus Item
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {formData.items.length < 6 && (
                      <Button
                        type="button"
                        onClick={handleAddItem}
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                      >
                        + Tambah Item
                      </Button>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="border-t pt-4 space-y-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {loading ? 'Menyimpan...' : 'Simpan Surat'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        resetForm()
                        setShowForm(false)
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-6 text-xl font-semibold">Daftar Surat Jalan</h2>

              {loading && suratList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Loading...
                </div>
              ) : suratList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada surat jalan. Buat yang pertama!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left font-semibold">
                          No Surat
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Tanggal
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          No Pol
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Sopir
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Item
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {suratList.map((surat) => (
                        <tr
                          key={surat.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium">
                            {surat.noSurat}
                          </td>
                          <td className="px-4 py-3">
                            {new Date(surat.tanggal).toLocaleDateString(
                              'id-ID'
                            )}
                          </td>
                          <td className="px-4 py-3">{surat.noPol}</td>
                          <td className="px-4 py-3">{surat.sopir}</td>
                          <td className="px-4 py-3 text-center">
                            {surat.items.length}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button
                                onClick={() => {
                                  setSelectedSurat(surat)
                                  setPreviewId(surat.id)
                                }}
                                size="sm"
                                variant="outline"
                              >
                                Preview
                              </Button>
                              <Button
                                onClick={() => handleEdit(surat)}
                                size="sm"
                                variant="outline"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(surat.id)}
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                              >
                                Hapus
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {previewId && selectedSurat && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => {
              setPreviewId(null)
              setSelectedSurat(null)
            }}
          >
            <div
              className="max-h-screen w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Preview: {selectedSurat.noSurat}
                </h2>
                <button
                  onClick={() => {
                    setPreviewId(null)
                    setSelectedSurat(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <SuratJalanTemplate
                noSurat={selectedSurat.noSurat}
                tanggal={selectedSurat.tanggal}
                jenisKendaraan={selectedSurat.jenisKendaraan}
                noPol={selectedSurat.noPol}
                sopir={selectedSurat.sopir}
                items={selectedSurat.items}
                tujuan={selectedSurat.tujuan}
                keterangan={selectedSurat.keterangan}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

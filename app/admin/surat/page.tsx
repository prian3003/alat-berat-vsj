'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedSurat, setSelectedSurat] = useState<SuratJalan | null>(null)
  const [previewSurat, setPreviewSurat] = useState<SuratJalan | null>(null)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [suratToDelete, setSuratToDelete] = useState<SuratJalan | null>(null)

  // Robust search function - case insensitive, searches across multiple fields
  const filteredSuratList = suratList.filter((surat) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true

    // Search across multiple fields
    return (
      surat.noSurat.toLowerCase().includes(query) ||
      surat.jenisKendaraan.toLowerCase().includes(query) ||
      surat.noPol.toLowerCase().includes(query) ||
      surat.sopir.toLowerCase().includes(query) ||
      (surat.tujuan && surat.tujuan.toLowerCase().includes(query)) ||
      new Date(surat.tanggal).toLocaleDateString('id-ID').includes(query)
    )
  })

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

      const url = selectedSurat ? `/api/surat-jalan/${selectedSurat.id}` : '/api/surat-jalan'
      const method = selectedSurat ? 'PUT' : 'POST'

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
      setIsFormDialogOpen(false)
    } catch (error) {
      console.error('Error saving surat jalan:', error)
      alert('Gagal menyimpan surat jalan')
    } finally {
      setLoading(false)
    }
  }

  const handleEditSurat = (surat: SuratJalan) => {
    setSelectedSurat(surat)

    // Convert ISO date string to YYYY-MM-DD format for input field
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return new Date().toISOString().split('T')[0]
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    }

    setFormData({
      tanggal: formatDateForInput(surat.tanggal),
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
    setIsFormDialogOpen(true)
  }

  const handleDeleteClick = (surat: SuratJalan) => {
    setSuratToDelete(surat)
    setDeleteAlertOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!suratToDelete) return

    try {
      setLoading(true)
      const response = await fetch(`/api/surat-jalan/${suratToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete surat jalan')
      }

      await fetchSuratList()
      setDeleteAlertOpen(false)
      setSuratToDelete(null)
    } catch (error) {
      console.error('Error deleting surat jalan:', error)
      alert('Gagal menghapus surat jalan')
    } finally {
      setLoading(false)
    }
  }

  const handlePreviewSurat = (surat: SuratJalan) => {
    setPreviewSurat(surat)
    setIsPreviewOpen(true)
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
    setSelectedSurat(null)
  }

  const openNewFormDialog = () => {
    resetForm()
    setIsFormDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Surat Jalan</h2>
            <p className="mt-2 text-slate-600">Kelola surat jalan kendaraan pengiriman</p>
          </div>
          <Button
            onClick={openNewFormDialog}
            className="bg-orange-600 hover:bg-orange-700"
          >
            + Buat Surat Baru
          </Button>
        </div>

        {/* Search Box */}
        {suratList.length > 0 && (
          <div className="mb-6 flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Cari berdasarkan No. Surat, Kendaraan, No. Polisi, Sopir, atau Tanggal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Surat List */}
        {loading && !suratList.length ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Memuat...</p>
          </div>
        ) : suratList.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-600">Belum ada surat jalan. Buat surat baru untuk memulai.</p>
          </div>
        ) : filteredSuratList.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-600">Tidak ada hasil pencarian untuk "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              Hapus filter pencarian
            </button>
          </div>
        ) : (
          <div className="rounded-lg bg-white shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Menampilkan <span className="font-semibold">{filteredSuratList.length}</span> dari{' '}
                <span className="font-semibold">{suratList.length}</span> surat jalan
              </p>
            </div>
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                    No. Surat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                    Kendaraan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                    Sopir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredSuratList.map((surat) => (
                  <tr key={surat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {surat.noSurat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(surat.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {surat.jenisKendaraan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {surat.sopir}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handlePreviewSurat(surat)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleEditSurat(surat)}
                        className="text-slate-600 hover:text-slate-900 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(surat)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedSurat ? 'Edit Surat Jalan' : 'Buat Surat Jalan Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Top Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Tanggal</label>
                <input
                  type="date"
                  required
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Jenis Kendaraan</label>
                <input
                  type="text"
                  required
                  placeholder="Truck, Mobil, dll"
                  value={formData.jenisKendaraan}
                  onChange={(e) => setFormData({ ...formData, jenisKendaraan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">No. Polisi</label>
                <input
                  type="text"
                  required
                  placeholder="B 1234 ABC"
                  value={formData.noPol}
                  onChange={(e) => setFormData({ ...formData, noPol: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Sopir</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Sopir"
                  value={formData.sopir}
                  onChange={(e) => setFormData({ ...formData, sopir: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Tujuan</label>
                <input
                  type="text"
                  placeholder="Lokasi Tujuan"
                  value={formData.tujuan}
                  onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Keterangan</label>
                <input
                  type="text"
                  placeholder="Keterangan tambahan"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                />
              </div>
            </div>

            {/* Items Section */}
            <fieldset className="border rounded-lg p-4">
              <legend className="text-sm font-semibold text-slate-900">Daftar Alat Berat</legend>
              <div className="mt-4 space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 items-end">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">NO</label>
                      <input
                        type="text"
                        disabled
                        value={item.urutan}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Jenis Unit</label>
                      <input
                        type="text"
                        required
                        placeholder="PC30, Excavator, dll"
                        value={item.jenisUnit}
                        onChange={(e) => handleItemChange(index, 'jenisUnit', e.target.value)}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Seri</label>
                      <input
                        type="text"
                        required
                        placeholder="No. Seri"
                        value={item.seri}
                        onChange={(e) => handleItemChange(index, 'seri', e.target.value)}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Lokasi</label>
                      <input
                        type="text"
                        required
                        placeholder="Lokasi"
                        value={item.lokasi}
                        onChange={(e) => handleItemChange(index, 'lokasi', e.target.value)}
                        className="w-full px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                      />
                    </div>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-900 font-medium text-sm border border-red-300 rounded-lg hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-4 text-sm text-blue-600 hover:text-blue-900 font-medium"
              >
                + Tambah Item
              </button>
            </fieldset>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsFormDialogOpen(false)
                  resetForm()
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : selectedSurat ? 'Perbarui' : 'Simpan'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      {isPreviewOpen && previewSurat && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setIsPreviewOpen(false)
            setPreviewSurat(null)
          }}
        >
          <div
            className="max-h-screen w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Preview: {previewSurat.noSurat}
              </h2>
              <button
                onClick={() => {
                  setIsPreviewOpen(false)
                  setPreviewSurat(null)
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
              noSurat={previewSurat.noSurat}
              tanggal={previewSurat.tanggal}
              jenisKendaraan={previewSurat.jenisKendaraan}
              noPol={previewSurat.noPol}
              sopir={previewSurat.sopir}
              items={previewSurat.items}
              tujuan={previewSurat.tujuan}
              keterangan={previewSurat.keterangan}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Surat Jalan?</AlertDialogTitle>
            <AlertDialogDescription>
              {suratToDelete && (
                <div className="space-y-2 mt-4">
                  <p>Apakah Anda yakin ingin menghapus surat jalan ini?</p>
                  <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                    <p className="font-semibold text-sm text-slate-900">No. Surat: {suratToDelete.noSurat}</p>
                    <p className="text-sm text-slate-600">Kendaraan: {suratToDelete.jenisKendaraan} ({suratToDelete.noPol})</p>
                    <p className="text-sm text-slate-600">Sopir: {suratToDelete.sopir}</p>
                    <p className="text-sm text-slate-600">
                      Tanggal: {new Date(suratToDelete.tanggal).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <p className="text-sm text-red-600 font-medium">Tindakan ini tidak dapat dibatalkan.</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

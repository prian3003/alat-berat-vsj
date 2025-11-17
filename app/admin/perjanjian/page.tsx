'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Link from 'next/link'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { SuratPerjanjianTemplate } from '@/components/surat-perjanjian/surat-perjanjian-template'

interface SuratPerjanjianItem {
  urutan: number
  jenisAlat: string
  jumlah: number
  hargaSewa: string
  keterangan?: string
}

interface SuratPerjanjian {
  id: string
  noPerjanjian: string
  tanggal: string
  tanggalPernyataan?: string
  pihakPertamaNama: string
  pihakPertamaJabatan: string
  pihakPertamaPerusahaan: string
  pihakPertamaAlamat: string
  pihakKeduaNama: string
  pihakKeduaJabatan: string
  pihakKedualPerusahaan: string
  pihakKeduaAlamat: string
  lokasiPekerjaan: string
  tanggalMulai: string
  tanggalSelesai: string
  items: SuratPerjanjianItem[]
  keterangan?: string
  status: string
}

export default function PerjanjianPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()

  const [perjanjianList, setPerjanjianList] = useState<SuratPerjanjian[]>([])
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [selectedPerjanjian, setSelectedPerjanjian] = useState<SuratPerjanjian | undefined>()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewPerjanjian, setPreviewPerjanjian] = useState<SuratPerjanjian | undefined>()
  const [isLoadingPerjanjian, setIsLoadingPerjanjian] = useState(true)

  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    tanggalPernyataan: '',
    pihakPertamaNama: 'Shuken Funawer',
    pihakPertamaJabatan: 'Direktris',
    pihakPertamaPerusahaan: 'CV. TUNGGAL JAYA ABADI',
    pihakPertamaAlamat: 'Jl. Yos Sudarso No.42 RT. 03 RW. 02 Ampana Kota Keluarahan Uentanaga Bawah Ampana Kota Selanjutnya disebit PIHAK PERTAMA',
    pihakKeduaNama: '',
    pihakKeduaJabatan: '',
    pihakKedualPerusahaan: '',
    pihakKeduaAlamat: '',
    lokasiPekerjaan: '',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: new Date().toISOString().split('T')[0],
    keterangan: '',
    items: [{ jenisAlat: '', jumlah: 1, hargaSewa: '', keterangan: '' }],
  })

  const loadPerjanjianList = async () => {
    try {
      setIsLoadingPerjanjian(true)
      const response = await fetch('/api/surat-perjanjian')
      if (response.ok) {
        const data = await response.json()
        setPerjanjianList(data)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load surat perjanjian',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingPerjanjian(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadPerjanjianList()
    }
  }, [isAuthenticated])

  const handleAddPerjanjian = () => {
    setSelectedPerjanjian(undefined)
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      tanggalPernyataan: '',
      pihakPertamaNama: 'Shuken Funawer',
      pihakPertamaJabatan: 'Direktris',
      pihakPertamaPerusahaan: 'CV. TUNGGAL JAYA ABADI',
      pihakPertamaAlamat: 'Jl. Yos Sudarso No.42 RT. 03 RW. 02 Ampana Kota Keluarahan Uentanaga Bawah Ampana Kota Selanjutnya disebit PIHAK PERTAMA',
      pihakKeduaNama: '',
      pihakKeduaJabatan: '',
      pihakKedualPerusahaan: '',
      pihakKeduaAlamat: '',
      lokasiPekerjaan: '',
      tanggalMulai: new Date().toISOString().split('T')[0],
      tanggalSelesai: new Date().toISOString().split('T')[0],
      keterangan: '',
      items: [{ jenisAlat: '', jumlah: 1, hargaSewa: '', keterangan: '' }],
    })
    setIsFormDialogOpen(true)
  }

  const handleEditPerjanjian = (perjanjian: SuratPerjanjian) => {
    setSelectedPerjanjian(perjanjian)
    setFormData({
      tanggal: perjanjian.tanggal.split('T')[0],
      tanggalPernyataan: perjanjian.tanggalPernyataan || '',
      pihakPertamaNama: perjanjian.pihakPertamaNama,
      pihakPertamaJabatan: perjanjian.pihakPertamaJabatan,
      pihakPertamaPerusahaan: perjanjian.pihakPertamaPerusahaan,
      pihakPertamaAlamat: perjanjian.pihakPertamaAlamat,
      pihakKeduaNama: perjanjian.pihakKeduaNama,
      pihakKeduaJabatan: perjanjian.pihakKeduaJabatan,
      pihakKedualPerusahaan: perjanjian.pihakKedualPerusahaan,
      pihakKeduaAlamat: perjanjian.pihakKeduaAlamat,
      lokasiPekerjaan: perjanjian.lokasiPekerjaan,
      tanggalMulai: perjanjian.tanggalMulai.split('T')[0],
      tanggalSelesai: perjanjian.tanggalSelesai.split('T')[0],
      keterangan: perjanjian.keterangan || '',
      items: perjanjian.items.map((item) => ({
        jenisAlat: item.jenisAlat,
        jumlah: item.jumlah,
        hargaSewa: item.hargaSewa,
        keterangan: item.keterangan || '',
      })),
    })
    setIsFormDialogOpen(true)
  }

  const handleDeletePerjanjian = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus surat perjanjian ini?')) return

    try {
      const response = await fetch(`/api/surat-perjanjian/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Surat perjanjian berhasil dihapus',
        })
        loadPerjanjianList()
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menghapus surat perjanjian',
        variant: 'destructive',
      })
    }
  }

  const handleSavePerjanjian = async () => {
    if (!formData.pihakKeduaNama || !formData.lokasiPekerjaan) {
      toast({
        title: 'Validation Error',
        description: 'Mohon isi semua field yang wajib',
        variant: 'destructive',
      })
      return
    }

    try {
      const url = selectedPerjanjian
        ? `/api/surat-perjanjian/${selectedPerjanjian.id}`
        : '/api/surat-perjanjian'

      const method = selectedPerjanjian ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: selectedPerjanjian
            ? 'Surat perjanjian berhasil diupdate'
            : 'Surat perjanjian berhasil dibuat',
        })
        setIsFormDialogOpen(false)
        loadPerjanjianList()
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyimpan surat perjanjian',
        variant: 'destructive',
      })
    }
  }

  const handlePreview = (perjanjian: SuratPerjanjian) => {
    setPreviewPerjanjian(perjanjian)
    setIsPreviewOpen(true)
  }

  const addItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { jenisAlat: '', jumlah: 1, hargaSewa: '', keterangan: '' }],
    })
  }

  const removeItemRow = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
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
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Surat Perjanjian Sewa Alat Berat</h1>
              <p className="text-sm text-slate-600">Kelola surat perjanjian rental</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/">Kembali ke Website</Link>
              </Button>
            </div>
          </div>
        </div>

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
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Surat Jalan
            </Link>
            <Link
              href="/admin/perjanjian"
              className="border-b-2 border-orange-600 px-4 py-3 text-sm font-medium text-orange-600"
            >
              Surat Perjanjian Sewa
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Daftar Surat Perjanjian
            </h2>
            <p className="text-sm text-slate-600">
              Total: {perjanjianList.length} surat
            </p>
          </div>
          <Button onClick={handleAddPerjanjian}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Surat Perjanjian
          </Button>
        </div>

        {isLoadingPerjanjian ? (
          <div className="rounded-lg border bg-white p-12 text-center">
            <p className="text-slate-600">Memuat data...</p>
          </div>
        ) : perjanjianList.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-white p-12 text-center">
            <p className="text-slate-600">Belum ada surat perjanjian</p>
          </div>
        ) : (
          <div className="rounded-lg bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">No. Surat</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Tanggal</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Pihak Kedua</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Lokasi</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {perjanjianList.map((perjanjian) => (
                  <tr key={perjanjian.id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-3 text-sm font-medium">{perjanjian.noPerjanjian}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {new Date(perjanjian.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600">{perjanjian.pihakKeduaNama}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">
                      {perjanjian.lokasiPekerjaan.substring(0, 30)}...
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          perjanjian.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : perjanjian.status === 'printed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {perjanjian.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm space-x-2">
                      <button
                        onClick={() => handlePreview(perjanjian)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleEditPerjanjian(perjanjian)}
                        className="text-slate-600 hover:text-slate-900 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePerjanjian(perjanjian.id)}
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

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPerjanjian ? 'Edit Surat Perjanjian' : 'Tambah Surat Perjanjian Baru'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">Tanggal Pernyataan</label>
                <input
                  type="text"
                  placeholder="Delapan Belas bulan Oktober..."
                  value={formData.tanggalPernyataan}
                  onChange={(e) => setFormData({ ...formData, tanggalPernyataan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                />
              </div>
            </div>

            <fieldset className="border rounded-lg p-4">
              <legend className="text-sm font-semibold text-slate-900">Pihak Pertama</legend>
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Nama"
                  value={formData.pihakPertamaNama}
                  onChange={(e) => setFormData({ ...formData, pihakPertamaNama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                />
                <input
                  type="text"
                  placeholder="Jabatan"
                  value={formData.pihakPertamaJabatan}
                  onChange={(e) => setFormData({ ...formData, pihakPertamaJabatan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                />
                <input
                  type="text"
                  placeholder="Perusahaan"
                  value={formData.pihakPertamaPerusahaan}
                  onChange={(e) => setFormData({ ...formData, pihakPertamaPerusahaan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                />
                <textarea
                  placeholder="Alamat"
                  value={formData.pihakPertamaAlamat}
                  onChange={(e) => setFormData({ ...formData, pihakPertamaAlamat: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                  rows={3}
                />
              </div>
            </fieldset>

            <fieldset className="border rounded-lg p-4">
              <legend className="text-sm font-semibold text-slate-900">Pihak Kedua (Wajib)</legend>
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Nama"
                  value={formData.pihakKeduaNama}
                  onChange={(e) => setFormData({ ...formData, pihakKeduaNama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                />
                <input
                  type="text"
                  placeholder="Jabatan"
                  value={formData.pihakKeduaJabatan}
                  onChange={(e) => setFormData({ ...formData, pihakKeduaJabatan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                />
                <input
                  type="text"
                  placeholder="Perusahaan"
                  value={formData.pihakKedualPerusahaan}
                  onChange={(e) => setFormData({ ...formData, pihakKedualPerusahaan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                />
                <textarea
                  placeholder="Alamat"
                  value={formData.pihakKeduaAlamat}
                  onChange={(e) => setFormData({ ...formData, pihakKeduaAlamat: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                  rows={3}
                />
              </div>
            </fieldset>

            <fieldset className="border rounded-lg p-4">
              <legend className="text-sm font-semibold text-slate-900">Detail Perjanjian</legend>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">Lokasi Pekerjaan (Wajib)</label>
                  <textarea
                    placeholder="Lokasi"
                    value={formData.lokasiPekerjaan}
                    onChange={(e) => setFormData({ ...formData, lokasiPekerjaan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={formData.tanggalMulai}
                      onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Tanggal Selesai</label>
                    <input
                      type="date"
                      value={formData.tanggalSelesai}
                      onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="border rounded-lg p-4">
              <legend className="text-sm font-semibold text-slate-900">Alat yang Disewa</legend>
              <div className="mt-4 space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <input
                      type="text"
                      placeholder="Jenis Alat"
                      value={item.jenisAlat}
                      onChange={(e) => updateItem(index, 'jenisAlat', e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Jumlah"
                      value={item.jumlah}
                      onChange={(e) => updateItem(index, 'jumlah', parseInt(e.target.value))}
                      className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Harga Sewa"
                      value={item.hargaSewa}
                      onChange={(e) => updateItem(index, 'hargaSewa', e.target.value)}
                      className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                    />
                    {formData.items.length > 1 && (
                      <button
                        onClick={() => removeItemRow(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addItemRow}
                  className="px-4 py-2 text-sm font-medium text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50"
                >
                  + Tambah Item
                </button>
              </div>
            </fieldset>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Keterangan Tambahan</label>
              <textarea
                placeholder="Catatan tambahan"
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSavePerjanjian}>
                {selectedPerjanjian ? 'Update' : 'Buat'} Surat Perjanjian
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      {isPreviewOpen && previewPerjanjian && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setIsPreviewOpen(false)
            setPreviewPerjanjian(undefined)
          }}
        >
          <div
            className="max-h-screen w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Preview: {previewPerjanjian.noPerjanjian}
              </h2>
              <button
                onClick={() => {
                  setIsPreviewOpen(false)
                  setPreviewPerjanjian(undefined)
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
            <SuratPerjanjianTemplate
              noPerjanjian={previewPerjanjian.noPerjanjian}
              tanggal={String(previewPerjanjian.tanggal)}
              tanggalPernyataan={previewPerjanjian.tanggalPernyataan}
              pihakPertamaNama={previewPerjanjian.pihakPertamaNama}
              pihakPertamaJabatan={previewPerjanjian.pihakPertamaJabatan}
              pihakPertamaPerusahaan={previewPerjanjian.pihakPertamaPerusahaan}
              pihakPertamaAlamat={previewPerjanjian.pihakPertamaAlamat}
              pihakKeduaNama={previewPerjanjian.pihakKeduaNama}
              pihakKeduaJabatan={previewPerjanjian.pihakKeduaJabatan}
              pihakKedualPerusahaan={previewPerjanjian.pihakKedualPerusahaan}
              pihakKeduaAlamat={previewPerjanjian.pihakKeduaAlamat}
              lokasiPekerjaan={previewPerjanjian.lokasiPekerjaan}
              tanggalMulai={String(previewPerjanjian.tanggalMulai)}
              tanggalSelesai={String(previewPerjanjian.tanggalSelesai)}
              items={previewPerjanjian.items}
              keterangan={previewPerjanjian.keterangan}
            />
          </div>
        </div>
      )}

      <Toaster />
    </div>
  )
}

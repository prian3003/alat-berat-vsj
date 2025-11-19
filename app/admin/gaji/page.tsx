'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { useConfirm } from '@/hooks/use-confirm'
import { GajiForm } from '@/components/dashboard/gaji-form'
import { GajiTemplate } from '@/components/dashboard/gaji-template'
import { Plus, Eye, CheckCircle, Trash2, ArrowLeft } from 'lucide-react'

interface GajiItem {
  id: string
  gajiId: string
  urutan: number
  tanggal: string
  keterangan: string
  jam?: number
  jumlah: number
  tipe: string
  createdAt: string
}

interface GajiPekerja {
  id: string
  pekerjaNama: string
  pekerjaId?: string
  jabatan: string
}

interface Gaji {
  id: string
  nomorGaji: string
  tipe: 'weekly' | 'monthly'
  bulan?: number
  tahun?: number
  tanggalMulai: string
  tanggalSelesai: string
  totalGaji: number
  keterangan?: string
  status: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  items: GajiItem[]
  pekerjas?: GajiPekerja[]
}

export default function AdminGajiPage() {
  const { toast } = useToast()
  const { confirm } = useConfirm()
  const { isAuthenticated, isLoading, logout } = useAuth()
  const [gajiList, setGajiList] = useState<Gaji[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedGaji, setSelectedGaji] = useState<Gaji | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'weekly' | 'monthly'>('all')

  useEffect(() => {
    if (isAuthenticated) {
      fetchGaji()
    }
  }, [isAuthenticated])

  const fetchGaji = async () => {
    try {
      const response = await fetch('/api/gaji')
      if (!response.ok) {
        throw new Error('Failed to fetch salary records')
      }
      const data = await response.json()
      setGajiList(data)
    } catch (error) {
      console.error('Error fetching salary records:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data gaji",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, nomorGaji: string) => {
    const confirmed = await confirm({
      title: "Hapus Gaji",
      description: `Apakah Anda yakin ingin menghapus "${nomorGaji}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      cancelText: "Batal"
    })

    if (!confirmed) return

    try {
      const response = await fetch(`/api/gaji/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete salary record')
      }

      toast({
        variant: "success",
        title: "Berhasil",
        description: "Data gaji berhasil dihapus",
      })

      fetchGaji()
    } catch (error) {
      console.error('Error deleting salary record:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menghapus data gaji",
      })
    }
  }

  const handleMarkAsPaid = async (gajiId: string) => {
    try {
      const response = await fetch(`/api/gaji/${gajiId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update status')
      }

      toast({
        variant: "success",
        title: "Berhasil",
        description: "Status gaji diubah menjadi Lunas",
      })

      fetchGaji()
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal mengubah status",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const filteredGaji = filterType === 'all'
    ? gajiList
    : gajiList.filter(gaji => gaji.tipe === filterType)

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

  if (showForm) {
    return (
      <GajiForm
        onSuccess={() => {
          setShowForm(false)
          fetchGaji()
        }}
        onCancel={() => setShowForm(false)}
      />
    )
  }

  if (showPreview && selectedGaji) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b bg-white sticky top-0 z-10">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowPreview(false)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Kembali
              </button>
              <h1 className="text-2xl font-bold text-slate-900">Preview Gaji</h1>
              <div></div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <GajiTemplate gaji={selectedGaji} />
        </main>
      </div>
    )
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
          <nav className="flex gap-4 border-b overflow-x-auto">
            <Link
              href="/admin"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 whitespace-nowrap"
            >
              Alat Berat
            </Link>
            <Link
              href="/admin/blog"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 whitespace-nowrap"
            >
              Blog
            </Link>
            <Link
              href="/admin/gallery"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 whitespace-nowrap"
            >
              Galeri
            </Link>
            <Link
              href="/admin/surat"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 whitespace-nowrap"
            >
              Surat Jalan
            </Link>
            <Link
              href="/admin/perjanjian"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 whitespace-nowrap"
            >
              Surat Perjanjian
            </Link>
            <Link
              href="/admin/buku-besar"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 whitespace-nowrap"
            >
              Buku Besar
            </Link>
            <Link
              href="/admin/invoice"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 whitespace-nowrap"
            >
              Invoice
            </Link>
            <Link
              href="/admin/gaji"
              className="border-b-2 border-orange-600 px-4 py-3 text-sm font-medium text-orange-600 whitespace-nowrap"
            >
              Gaji
            </Link>
            <Link
              href="/admin/pekerja"
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 whitespace-nowrap"
            >
              Pekerja
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Kelola Gaji</h2>
              <p className="mt-2 text-slate-600">Tambah, ubah, atau hapus data gaji karyawan</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-white font-medium hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Tambah Gaji
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                filterType === 'all'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-slate-600 border-b-2 border-transparent hover:text-slate-900'
              }`}
            >
              Semua ({gajiList.length})
            </button>
            <button
              onClick={() => setFilterType('weekly')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                filterType === 'weekly'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-slate-600 border-b-2 border-transparent hover:text-slate-900'
              }`}
            >
              Mingguan ({gajiList.filter(g => g.tipe === 'weekly').length})
            </button>
            <button
              onClick={() => setFilterType('monthly')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                filterType === 'monthly'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-slate-600 border-b-2 border-transparent hover:text-slate-900'
              }`}
            >
              Bulanan ({gajiList.filter(g => g.tipe === 'monthly').length})
            </button>
          </div>
        </div>

        {/* Salary List */}
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredGaji.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGaji.map((gaji) => (
              <div
                key={gaji.id}
                className="rounded-lg bg-white shadow-sm hover:shadow-lg transition-all overflow-hidden border border-slate-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900">{gaji.nomorGaji}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {gaji.tipe === 'monthly' ? 'Bulanan' : 'Mingguan'} • {formatDate(gaji.tanggalMulai)}
                      </p>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                      gaji.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {gaji.status === 'completed' ? 'Lunas' : 'Draft'}
                    </span>
                  </div>

                  {/* Worker Info */}
                  {gaji.pekerjas && gaji.pekerjas.length > 0 && (
                    <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-100">
                      <p className="text-xs text-blue-600 font-semibold">Pekerja</p>
                      <p className="text-sm text-blue-900 font-medium">
                        {gaji.pekerjas[0].pekerjaNama}
                      </p>
                      <p className="text-xs text-blue-700">
                        {gaji.pekerjas[0].jabatan}
                      </p>
                    </div>
                  )}

                  {/* Total Display */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-600 font-semibold uppercase">Total Gaji</p>
                    <p className="text-3xl font-bold text-orange-600 mt-1">
                      {formatCurrency(gaji.totalGaji)}
                    </p>
                  </div>

                  {/* Period Info */}
                  <div className="text-xs text-slate-600 mb-4 space-y-1 bg-slate-50 p-2 rounded">
                    <p>📅 {formatDate(gaji.tanggalMulai)} - {formatDate(gaji.tanggalSelesai)}</p>
                    {gaji.tipe === 'monthly' && gaji.bulan && (
                      <p>📆 {new Date(2024, gaji.bulan - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedGaji(gaji)
                        setShowPreview(true)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg py-2 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </button>
                    {gaji.status !== 'completed' && (
                      <button
                        onClick={() => handleMarkAsPaid(gaji.id)}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg py-2 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Lunas
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(gaji.id, gaji.nomorGaji)}
                      className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg py-2 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-600">Tidak ada data gaji. Silakan tambah data gaji terlebih dahulu.</p>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  )
}

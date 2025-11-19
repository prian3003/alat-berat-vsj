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
                className="text-slate-600 hover:text-slate-900"
              >
                ← Kembali
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Kelola Gaji</h2>
              <p className="mt-2 text-slate-600">Tambah, ubah, atau hapus data gaji karyawan</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-white font-medium hover:bg-orange-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Gaji
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
        ) : gajiList.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {gajiList.map((gaji) => (
              <div
                key={gaji.id}
                className="rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{gaji.nomorGaji}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {gaji.tipe === 'monthly' ? 'Bulanan' : 'Mingguan'} - {formatDate(gaji.tanggalMulai)}
                      </p>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      gaji.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {gaji.status === 'completed' ? 'Selesai' : 'Draft'}
                    </span>
                  </div>

                  <div className="mb-4 p-3 bg-slate-50 rounded">
                    <p className="text-sm text-slate-600">Total Gaji</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {gaji.totalGaji > 0 ? (new Intl.NumberFormat('id-ID', { notation: 'compact', compactDisplay: 'short' }).format(gaji.totalGaji)) : 'Rp 0'}
                    </p>
                  </div>

                  <div className="text-xs text-slate-500 mb-4 space-y-1">
                    <p>Periode: {formatDate(gaji.tanggalMulai)} - {formatDate(gaji.tanggalSelesai)}</p>
                    {gaji.tipe === 'monthly' && gaji.bulan && (
                      <p>Bulan: {gaji.bulan}/{gaji.tahun}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedGaji(gaji)
                        setShowPreview(true)
                      }}
                      className="flex-1 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded py-2 transition-colors"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => handleDelete(gaji.id, gaji.nomorGaji)}
                      className="flex-1 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded py-2 transition-colors"
                    >
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

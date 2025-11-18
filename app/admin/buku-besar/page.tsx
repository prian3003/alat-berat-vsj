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
import { BukuBesarTemplate } from '@/components/buku-besar/buku-besar-template'
import { Eye, Trash2, Edit2, Plus } from 'lucide-react'

interface BukuBesarEntry {
  id: string
  nomor: string
  tanggal: string
  deskripsi: string
  debit: number
  kredit: number
  saldo_akhir?: number
  keterangan?: string
}

export default function BukuBesarPage() {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [entries, setEntries] = useState<BukuBesarEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<BukuBesarEntry | null>(null)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<BukuBesarEntry | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [saldoAwal, setSaldoAwal] = useState(0)
  const [isBulkMode, setIsBulkMode] = useState(false)
  const [bulkEntries, setBulkEntries] = useState<any[]>([])
  const itemsPerPage = 10

  // Get current date safely
  const getCurrentDate = (): Date => {
    try {
      return new Date()
    } catch {
      return new Date()
    }
  }

  // Get period from date (YYYY-MM format for robust comparison)
  const getPeriodKey = (date: Date | string): string => {
    try {
      const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date)
      if (isNaN(d.getTime())) return ''
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      return `${year}-${month}`
    } catch {
      return ''
    }
  }

  // Format period display (Bulan Tahun)
  const formatPeriodeDisplay = (date: Date | string): string => {
    try {
      const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date)
      if (isNaN(d.getTime())) return ''
      const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
      const month = monthNames[d.getMonth()]
      const year = d.getFullYear()
      return `${month} ${year}`
    } catch {
      return ''
    }
  }

  // Initialize with current date
  const currentDate = getCurrentDate()
  const currentPeriodKey = getPeriodKey(currentDate)
  const [selectedPeriodKey, setSelectedPeriodKey] = useState(currentPeriodKey)
  const [periode, setPeriode] = useState(formatPeriodeDisplay(currentDate))

  const [formData, setFormData] = useState({
    nomor: '',
    tanggal: currentDate.toISOString().split('T')[0],
    deskripsi: '',
    debit: 0,
    kredit: 0,
    keterangan: '',
  })

  // Get first day of selected period for balance calculation
  const getPeriodStartDate = (periodKey: string): Date => {
    try {
      const [year, month] = periodKey.split('-')
      return new Date(`${year}-${month}-01T00:00:00`)
    } catch {
      return currentDate
    }
  }

  // Filter entries by selected period and search query
  const filteredEntries = entries
    .filter((entry) => {
      // Filter by period
      const entryPeriodKey = getPeriodKey(entry.tanggal)
      return entryPeriodKey === selectedPeriodKey
    })
    .filter((entry) => {
      // Filter by search query
      const query = searchQuery.toLowerCase().trim()
      if (!query) return true
      return (
        entry.nomor.toLowerCase().includes(query) ||
        entry.deskripsi.toLowerCase().includes(query) ||
        entry.keterangan?.toLowerCase().includes(query) ||
        new Date(entry.tanggal).toLocaleDateString('id-ID').includes(query)
      )
    })

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage)
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchEntries()
    }
  }, [isAuthenticated])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedPeriodKey])

  const fetchEntries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/buku-besar')
      if (response.ok) {
        const data = await response.json()
        setEntries(data)
      }
    } catch (error) {
      console.error('Error fetching entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      if (isBulkMode) {
        // Bulk insert
        const validEntries = bulkEntries.filter(entry => entry.nomor && entry.deskripsi && (entry.debit > 0 || entry.kredit > 0))

        if (validEntries.length === 0) {
          alert('Tambahkan minimal satu entri yang valid')
          setLoading(false)
          return
        }

        for (const entry of validEntries) {
          const payload = {
            nomor: entry.nomor,
            tanggal: entry.tanggal,
            deskripsi: entry.deskripsi,
            debit: parseFloat(entry.debit) || 0,
            kredit: parseFloat(entry.kredit) || 0,
            keterangan: entry.keterangan || null,
          }

          const response = await fetch('/api/buku-besar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

          if (!response.ok) {
            throw new Error(`Gagal menyimpan entri: ${entry.nomor}`)
          }
        }

        await fetchEntries()
        setBulkEntries([])
        setIsBulkMode(false)
        alert(`${validEntries.length} entri berhasil disimpan`)
      } else {
        // Single entry
        const payload = {
          ...formData,
          debit: parseFloat(formData.debit.toString()) || 0,
          kredit: parseFloat(formData.kredit.toString()) || 0,
        }

        const url = selectedEntry ? `/api/buku-besar/${selectedEntry.id}` : '/api/buku-besar'
        const method = selectedEntry ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error('Failed to save entry')
        }

        await fetchEntries()
        resetForm()
      }
      setIsFormDialogOpen(false)
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('Gagal menyimpan entri buku besar: ' + (error instanceof Error ? error.message : ''))
    } finally {
      setLoading(false)
    }
  }

  const handleEditEntry = (entry: BukuBesarEntry) => {
    setSelectedEntry(entry)
    setFormData({
      nomor: entry.nomor,
      tanggal: entry.tanggal,
      deskripsi: entry.deskripsi,
      debit: entry.debit,
      kredit: entry.kredit,
      keterangan: entry.keterangan || '',
    })
    setIsFormDialogOpen(true)
  }

  const handleDeleteClick = (entry: BukuBesarEntry) => {
    setEntryToDelete(entry)
    setDeleteAlertOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!entryToDelete) return

    try {
      setLoading(true)
      const response = await fetch(`/api/buku-besar/${entryToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete entry')
      }

      await fetchEntries()
      setDeleteAlertOpen(false)
      setEntryToDelete(null)
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('Gagal menghapus entri')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    try {
      const periodStart = getPeriodStartDate(selectedPeriodKey)
      const defaultDate = periodStart.toISOString().split('T')[0]
      setFormData({
        nomor: '',
        tanggal: defaultDate,
        deskripsi: '',
        debit: 0,
        kredit: 0,
        keterangan: '',
      })
    } catch {
      setFormData({
        nomor: '',
        tanggal: new Date().toISOString().split('T')[0],
        deskripsi: '',
        debit: 0,
        kredit: 0,
        keterangan: '',
      })
    }
    setSelectedEntry(null)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  // Calculate running balance
  const calculateBalance = (index: number) => {
    let balance = saldoAwal
    for (let i = 0; i <= index; i++) {
      balance += filteredEntries[i].debit - filteredEntries[i].kredit
    }
    return balance
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
          <nav className="flex gap-4 border-b overflow-x-auto">
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
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900"
            >
              Surat Perjanjian
            </Link>
            <Link
              href="/admin/buku-besar"
              className="border-b-2 border-orange-600 px-4 py-3 text-sm font-medium text-orange-600"
            >
              Buku Besar
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Buku Besar</h2>
              <p className="mt-2 text-slate-600">Pencatatan transaksi keuangan dan akuntansi</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  resetForm()
                  setIsFormDialogOpen(true)
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Entri
              </Button>
              {entries.length > 0 && (
                <Button
                  onClick={() => setIsPreviewOpen(true)}
                  variant="outline"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat PDF
                </Button>
              )}
            </div>
          </div>

          {/* Period and Saldo Awal Input */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Periode (Bulan-Tahun)</label>
              <input
                type="month"
                value={selectedPeriodKey}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedPeriodKey(e.target.value)
                    setPeriode(formatPeriodeDisplay(e.target.value + '-01'))
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
              <p className="mt-1 text-xs text-slate-500">Ditampilkan: {periode}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Saldo Awal</label>
              <input
                type="number"
                value={saldoAwal}
                onChange={(e) => setSaldoAwal(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-slate-500">Saldo pembukaan untuk {periode}</p>
            </div>
          </div>
        </div>

        {/* Search Box */}
        {entries.length > 0 && (
          <div className="mb-6 flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Cari berdasarkan nomor, deskripsi, atau tanggal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Entries Table */}
        {loading && !entries.length ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Memuat...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-600">Belum ada entri buku besar. Tambahkan entri baru untuk memulai.</p>
          </div>
        ) : filteredEntries.length === 0 ? (
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
                Menampilkan <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> -{' '}
                <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredEntries.length)}</span>{' '}
                dari <span className="font-semibold">{filteredEntries.length}</span> entri
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                      No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-900 uppercase tracking-wider">
                      Debit
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-900 uppercase tracking-wider">
                      Kredit
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-900 uppercase tracking-wider">
                      Saldo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginatedEntries.map((entry, idx) => {
                    const displayIndex = (currentPage - 1) * itemsPerPage + idx
                    const balance = calculateBalance(displayIndex)
                    return (
                      <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {entry.nomor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {new Date(entry.tanggal).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {entry.deskripsi}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-600 font-mono">
                          {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-600 font-mono">
                          {entry.kredit > 0 ? formatCurrency(entry.kredit) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-900 font-mono font-bold">
                          {formatCurrency(balance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button
                            onClick={() => handleEditEntry(entry)}
                            className="text-blue-600 hover:text-blue-900 font-medium inline-flex items-center gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(entry)}
                            className="text-red-600 hover:text-red-900 font-medium inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Hapus
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ← Sebelumnya
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-orange-600 text-white'
                          : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Berikutnya →
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={(open) => {
        setIsFormDialogOpen(open)
        if (!open) {
          resetForm()
          setBulkEntries([])
          setIsBulkMode(false)
        }
      }}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between w-full">
              <DialogTitle>
                {isBulkMode ? 'Bulk Insert Entri Buku Besar' : selectedEntry ? 'Edit Entri Buku Besar' : 'Tambah Entri Buku Besar'}
              </DialogTitle>
              {!selectedEntry && (
                <Button
                  type="button"
                  variant={isBulkMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setIsBulkMode(!isBulkMode)
                    resetForm()
                    setBulkEntries([])
                  }}
                >
                  {isBulkMode ? 'Mode Tunggal' : 'Bulk Insert'}
                </Button>
              )}
            </div>
          </DialogHeader>

          {isBulkMode ? (
            // Bulk Insert Mode
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Add new bulk entry row */}
              <div className="border rounded-lg p-3 bg-slate-50 space-y-2">
                <p className="text-xs font-medium text-slate-600 mb-2">Tambah Entri Baru</p>
                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="text"
                    placeholder="Nomor"
                    value={formData.nomor}
                    onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
                    className="col-span-1 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="col-span-2 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                  <input
                    type="text"
                    placeholder="Deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="col-span-4 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                  <input
                    type="number"
                    placeholder="Debit"
                    value={formData.debit}
                    onChange={(e) => setFormData({ ...formData, debit: parseFloat(e.target.value) || 0, kredit: 0 })}
                    className="col-span-2 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                  <input
                    type="number"
                    placeholder="Kredit"
                    value={formData.kredit}
                    onChange={(e) => setFormData({ ...formData, kredit: parseFloat(e.target.value) || 0, debit: 0 })}
                    className="col-span-2 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="col-span-1 bg-orange-600 hover:bg-orange-700"
                    onClick={() => {
                      if (formData.nomor && formData.deskripsi && (formData.debit > 0 || formData.kredit > 0)) {
                        setBulkEntries([...bulkEntries, { ...formData, id: Math.random() }])
                        resetForm()
                      }
                    }}
                  >
                    Tambah
                  </Button>
                </div>
                <input
                  type="text"
                  placeholder="Keterangan (opsional)"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              {/* Bulk entries list */}
              {bulkEntries.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 border-b">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-slate-900">No.</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-slate-900">Tanggal</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-slate-900">Deskripsi</th>
                        <th className="px-2 py-2 text-right text-xs font-semibold text-slate-900">Debit</th>
                        <th className="px-2 py-2 text-right text-xs font-semibold text-slate-900">Kredit</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-slate-900">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkEntries.map((entry, idx) => (
                        <tr key={entry.id} className="border-b hover:bg-slate-50">
                          <td className="px-2 py-2 text-slate-700">{entry.nomor}</td>
                          <td className="px-2 py-2 text-slate-700">{new Date(entry.tanggal).toLocaleDateString('id-ID')}</td>
                          <td className="px-2 py-2 text-slate-700">{entry.deskripsi}</td>
                          <td className="px-2 py-2 text-right text-slate-700">{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</td>
                          <td className="px-2 py-2 text-right text-slate-700">{entry.kredit > 0 ? formatCurrency(entry.kredit) : '-'}</td>
                          <td className="px-2 py-2">
                            <button
                              type="button"
                              onClick={() => setBulkEntries(bulkEntries.filter((_, i) => i !== idx))}
                              className="text-red-600 hover:text-red-900 text-xs font-medium"
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

              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setBulkEntries([])
                    setIsFormDialogOpen(false)
                  }}
                >
                  Batal
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={loading || bulkEntries.length === 0}>
                  Simpan ({bulkEntries.length})
                </Button>
              </div>
            </form>
          ) : (
            // Single Entry Mode
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-900 mb-0.5">No. Ref</label>
                  <input
                    type="text"
                    required
                    value={formData.nomor}
                    onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="BBB-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-900 mb-0.5">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-900 mb-0.5">Deskripsi</label>
                  <input
                    type="text"
                    required
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Deskripsi transaksi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-900 mb-0.5">Debit (Rp)</label>
                  <input
                    type="number"
                    value={formData.debit}
                    onChange={(e) => setFormData({ ...formData, debit: parseFloat(e.target.value) || 0, kredit: 0 })}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-900 mb-0.5">Kredit (Rp)</label>
                  <input
                    type="number"
                    value={formData.kredit}
                    onChange={(e) => setFormData({ ...formData, kredit: parseFloat(e.target.value) || 0, debit: 0 })}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-900 mb-0.5">Keterangan</label>
                <textarea
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-600"
                  rows={2}
                  placeholder="Keterangan atau catatan transaksi"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsFormDialogOpen(false)
                  }}
                >
                  Batal
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={loading}>
                  {selectedEntry ? 'Perbarui' : 'Simpan'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      {isPreviewOpen && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pratinjau Buku Besar PDF</DialogTitle>
            </DialogHeader>
            <BukuBesarTemplate
              entries={entries}
              saldoAwal={saldoAwal}
              periode={periode}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Entri</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus entri "{entryToDelete?.deskripsi}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

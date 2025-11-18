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

  // Get last saved tanggal from localStorage
  const getLastSavedTanggal = (): string => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('lastBukuBesarTanggal')
        if (saved) {
          return saved
        }
      }
    } catch {
      console.error('Error getting last saved tanggal')
    }
    return currentDate.toISOString().split('T')[0]
  }

  const [formData, setFormData] = useState({
    nomor: '',
    tanggal: getLastSavedTanggal(),
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

  // Auto-generate No. Ref based on today's date and sequence
  const generateAutoNomor = (dateStr: string = ''): string => {
    try {
      if (!dateStr) dateStr = currentDate.toISOString().split('T')[0]

      // Parse date safely
      const date = new Date(dateStr + 'T00:00:00')
      if (isNaN(date.getTime())) return 'BBB-001'

      // Format: BBB-DDMMYY (e.g., BBB-181125 for 18 November 2025)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = String(date.getFullYear()).slice(-2)

      // Count entries for this specific date
      const entriesForDate = entries.filter((entry) => {
        try {
          const entryDate = new Date(entry.tanggal + 'T00:00:00')
          return (
            entryDate.getDate() === date.getDate() &&
            entryDate.getMonth() === date.getMonth() &&
            entryDate.getFullYear() === date.getFullYear()
          )
        } catch {
          return false
        }
      })

      const sequenceNumber = String(entriesForDate.length + 1).padStart(3, '0')
      return `BBB-${day}${month}${year}-${sequenceNumber}`
    } catch (err) {
      console.error('Error generating auto nomor:', err)
      return 'BBB-001'
    }
  }

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = (): string => {
    try {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch (err) {
      console.error('Error getting today date:', err)
      return currentDate.toISOString().split('T')[0]
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

  // Save tanggal to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && formData.tanggal) {
        localStorage.setItem('lastBukuBesarTanggal', formData.tanggal)
      }
    } catch (err) {
      console.error('Error saving tanggal to localStorage:', err)
    }
  }, [formData.tanggal])

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
      // Use last saved tanggal if available, otherwise use today's date
      const lastTanggal = getLastSavedTanggal()
      // Auto-generate No. Ref based on last/current tanggal and existing entries
      const autoNomor = generateAutoNomor(lastTanggal)

      setFormData({
        nomor: autoNomor,
        tanggal: lastTanggal,
        deskripsi: '',
        debit: 0,
        kredit: 0,
        keterangan: '',
      })
    } catch (err) {
      console.error('Error resetting form:', err)
      try {
        // Fallback to safe defaults
        const fallbackTanggal = getLastSavedTanggal()
        setFormData({
          nomor: 'BBB-001',
          tanggal: fallbackTanggal,
          deskripsi: '',
          debit: 0,
          kredit: 0,
          keterangan: '',
        })
      } catch {
        // Last resort fallback
        setFormData({
          nomor: 'BBB-001',
          tanggal: new Date().toISOString().split('T')[0],
          deskripsi: '',
          debit: 0,
          kredit: 0,
          keterangan: '',
        })
      }
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

  // Format date key for grouping (YYYY-MM-DD)
  const getDateKey = (dateStr: string): string => {
    try {
      const date = new Date(dateStr + 'T00:00:00')
      if (isNaN(date.getTime())) return ''
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch {
      return ''
    }
  }

  // Format date display (format Indonesian)
  const formatDateDisplay = (dateStr: string): string => {
    try {
      const date = new Date(dateStr + 'T00:00:00')
      if (isNaN(date.getTime())) return ''
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return ''
    }
  }

  // Group entries by date with robust error handling
  const groupedEntries = (() => {
    try {
      const grouped: { [key: string]: (BukuBesarEntry & { displayIndex: number })[] } = {}
      let globalIndex = 0

      filteredEntries.forEach((entry) => {
        try {
          const dateKey = getDateKey(entry.tanggal)
          if (!dateKey) return

          if (!grouped[dateKey]) {
            grouped[dateKey] = []
          }
          grouped[dateKey].push({
            ...entry,
            displayIndex: globalIndex
          })
          globalIndex++
        } catch (err) {
          console.error('Error processing entry:', entry, err)
        }
      })

      return grouped
    } catch (err) {
      console.error('Error grouping entries:', err)
      return {}
    }
  })()

  // Get sorted date keys
  const sortedDateKeys = (() => {
    try {
      return Object.keys(groupedEntries).sort((a, b) => {
        const dateA = new Date(a + 'T00:00:00').getTime()
        const dateB = new Date(b + 'T00:00:00').getTime()
        return dateA - dateB
      })
    } catch (err) {
      console.error('Error sorting dates:', err)
      return Object.keys(groupedEntries)
    }
  })()

  // Paginate grouped entries
  const paginatedDateKeys = (() => {
    try {
      const startIdx = (currentPage - 1) * itemsPerPage
      const endIdx = startIdx + itemsPerPage
      return sortedDateKeys.slice(startIdx, endIdx)
    } catch (err) {
      console.error('Error paginating:', err)
      return sortedDateKeys
    }
  })()

  // Calculate number of pages based on grouped dates
  const totalPagesGrouped = Math.ceil(sortedDateKeys.length / itemsPerPage)

  // Calculate total current balance from ALL entries (not just selected period)
  const calculateTotalBalance = (): number => {
    try {
      let totalBalance = 0

      // Sum all debit and kredit entries from the entire dataset
      entries.forEach((entry) => {
        totalBalance += (entry.debit || 0) - (entry.kredit || 0)
      })

      return totalBalance
    } catch (err) {
      console.error('Error calculating total balance:', err)
      return 0
    }
  }

  // Calculate running balance
  const calculateBalance = (dateKey: string, entryIndex: number): number => {
    try {
      let balance = 0
      const targetDateIndex = sortedDateKeys.indexOf(dateKey)

      // Add balance from all dates before this date
      for (let i = 0; i < targetDateIndex; i++) {
        const dateEntries = groupedEntries[sortedDateKeys[i]] || []
        dateEntries.forEach((entry) => {
          balance += (entry.debit || 0) - (entry.kredit || 0)
        })
      }

      // Add balance from entries in this date up to entryIndex
      const currentDateEntries = groupedEntries[dateKey] || []
      for (let i = 0; i <= entryIndex; i++) {
        if (currentDateEntries[i]) {
          balance += (currentDateEntries[i].debit || 0) - (currentDateEntries[i].kredit || 0)
        }
      }

      return balance
    } catch (err) {
      console.error('Error calculating balance:', err)
      return 0
    }
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
              <label className="block text-sm font-medium text-slate-900 mb-1">Total Saldo Sekarang</label>
              <div className="w-full px-3 py-2 border border-green-300 bg-green-50 rounded-lg text-slate-900 font-semibold text-lg">
                {formatCurrency(calculateTotalBalance())}
              </div>
              <p className="mt-1 text-xs text-slate-500">Total saldo dari semua transaksi</p>
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
          <div className="space-y-4">
            {/* Info Section */}
            <div className="rounded-lg bg-white shadow p-4 border-b border-slate-200">
              <p className="text-sm text-slate-600">
                Total: <span className="font-semibold">{filteredEntries.length}</span> entri {' '}
                ({paginatedDateKeys.length > 0 ? `${paginatedDateKeys.length} hari` : '0 hari'})
              </p>
            </div>

            {/* Grouped Entries by Date */}
            {paginatedDateKeys.length > 0 ? (
              <div className="space-y-4">
                {paginatedDateKeys.map((dateKey) => {
                  try {
                    const dateEntries = groupedEntries[dateKey] || []
                    const displayDate = formatDateDisplay(dateKey)

                    if (!displayDate || dateEntries.length === 0) return null

                    return (
                      <div key={dateKey} className="rounded-lg bg-white shadow overflow-hidden">
                        {/* Date Header */}
                        <div className="px-6 py-3 bg-gradient-to-r from-orange-50 to-slate-50 border-b border-slate-200">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {displayDate}
                            <span className="ml-2 text-xs font-normal text-slate-500">
                              ({dateEntries.length} {dateEntries.length === 1 ? 'entri' : 'entri'})
                            </span>
                          </h3>
                        </div>

                        {/* Entries Table for this date */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-900 uppercase tracking-wider">
                                  No.
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
                              {dateEntries.map((entry, entryIdx) => {
                                try {
                                  const balance = calculateBalance(dateKey, entryIdx)
                                  return (
                                    <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                        {entry.nomor || '-'}
                                      </td>
                                      <td className="px-6 py-4 text-sm text-slate-600">
                                        <div className="font-medium">{entry.deskripsi || '-'}</div>
                                        {entry.keterangan && (
                                          <div className="text-xs text-slate-500 mt-0.5">{entry.keterangan}</div>
                                        )}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-600 font-mono">
                                        {entry.debit && entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-600 font-mono">
                                        {entry.kredit && entry.kredit > 0 ? formatCurrency(entry.kredit) : '-'}
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
                                } catch (err) {
                                  console.error('Error rendering entry:', entry, err)
                                  return null
                                }
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  } catch (err) {
                    console.error('Error rendering date group:', dateKey, err)
                    return null
                  }
                })}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center bg-white">
                <p className="text-slate-600">Tidak ada entri untuk periode ini</p>
              </div>
            )}

            {/* Pagination */}
            {totalPagesGrouped > 1 && (
              <div className="rounded-lg bg-white shadow p-4 border-t border-slate-200 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ← Sebelumnya
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPagesGrouped }, (_, i) => i + 1).map((page) => (
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPagesGrouped))}
                  disabled={currentPage === totalPagesGrouped}
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
        try {
          setIsFormDialogOpen(open)
          if (!open) {
            resetForm()
            setBulkEntries([])
            setIsBulkMode(false)
          }
        } catch (err) {
          console.error('Error handling form dialog:', err)
        }
      }}>
        <DialogContent className="max-h-[95vh] w-full max-w-none overflow-y-auto rounded-lg shadow-2xl" style={{maxWidth: '95vw'}}>
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Add new bulk entry section */}
              <div className="border-2 border-dashed border-orange-200 rounded-lg p-6 bg-gradient-to-br from-orange-50 to-slate-50 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Tambah Entri Baru</h3>
                  <p className="text-sm text-slate-600">Isi form di bawah untuk menambahkan transaksi baru</p>
                </div>

                {/* Info: Auto-Generated Fields */}
                <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-700">
                  No. Ref dan Tanggal diisi otomatis berdasarkan hari ini
                </div>

                {/* Input Row 1: Nomor, Tanggal */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">No. Ref <span className="text-green-600">(Auto)</span></label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        disabled
                        value={formData.nomor}
                        className="w-full px-4 py-2 text-base border border-green-300 bg-green-50 rounded-lg text-slate-700 cursor-not-allowed"
                      />
                      <div className="absolute right-3 top-2 text-green-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Tanggal</label>
                    <input
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) => {
                        try {
                          const newDate = e.target.value
                          if (newDate) {
                            const newNomor = generateAutoNomor(newDate)
                            setFormData({ ...formData, tanggal: newDate, nomor: newNomor })
                          }
                        } catch (err) {
                          console.error('Error updating tanggal in bulk:', err)
                          setFormData({ ...formData, tanggal: e.target.value })
                        }
                      }}
                      className="w-full px-4 py-2 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
                    />
                  </div>
                </div>

                {/* Input Row 2: Deskripsi */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Deskripsi</label>
                  <input
                    type="text"
                    placeholder="Deskripsi transaksi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="w-full px-4 py-2 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
                  />
                </div>

                {/* Input Row 3: Debit, Kredit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Debit (Rp)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.debit}
                      onChange={(e) => setFormData({ ...formData, debit: parseFloat(e.target.value) || 0, kredit: 0 })}
                      onFocus={(e) => {
                        if (parseFloat(e.target.value) === 0) {
                          e.target.value = '';
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          setFormData({ ...formData, debit: 0 });
                        }
                      }}
                      className="w-full px-4 py-2 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Kredit (Rp)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.kredit}
                      onChange={(e) => setFormData({ ...formData, kredit: parseFloat(e.target.value) || 0, debit: 0 })}
                      onFocus={(e) => {
                        if (parseFloat(e.target.value) === 0) {
                          e.target.value = '';
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          setFormData({ ...formData, kredit: 0 });
                        }
                      }}
                      className="w-full px-4 py-2 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
                    />
                  </div>
                </div>

                {/* Input Row 4: Keterangan */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Keterangan (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Catatan tambahan"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    className="w-full px-4 py-2 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
                  />
                </div>

                {/* Add Button */}
                <Button
                  type="button"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 text-base"
                  onClick={() => {
                    try {
                      if (formData.nomor && formData.deskripsi && (formData.debit > 0 || formData.kredit > 0)) {
                        setBulkEntries([...bulkEntries, { ...formData, id: Math.random() }])
                        resetForm()
                      } else {
                        alert('Mohon isi: Nomor, Deskripsi, dan minimal Debit atau Kredit')
                      }
                    } catch (err) {
                      console.error('Error adding bulk entry:', err)
                      alert('Gagal menambah entri')
                    }
                  }}
                >
                  + Tambah Entri
                </Button>
              </div>

              {/* Bulk entries list */}
              {bulkEntries.length > 0 && (
                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="px-6 py-4 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                    <h3 className="text-base font-semibold text-slate-900">Daftar Entri ({bulkEntries.length})</h3>
                  </div>
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">No.</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Tanggal</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Deskripsi</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Debit</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Kredit</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {bulkEntries.map((entry, idx) => {
                        try {
                          return (
                            <tr key={entry.id} className="hover:bg-orange-50 transition-colors">
                              <td className="px-6 py-4 text-sm font-medium text-slate-900">{entry.nomor}</td>
                              <td className="px-6 py-4 text-sm text-slate-600">{new Date(entry.tanggal).toLocaleDateString('id-ID')}</td>
                              <td className="px-6 py-4 text-sm text-slate-600">{entry.deskripsi}</td>
                              <td className="px-6 py-4 text-sm text-right font-mono text-slate-900">{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</td>
                              <td className="px-6 py-4 text-sm text-right font-mono text-slate-900">{entry.kredit > 0 ? formatCurrency(entry.kredit) : '-'}</td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    try {
                                      setBulkEntries(bulkEntries.filter((_, i) => i !== idx))
                                    } catch (err) {
                                      console.error('Error removing entry:', err)
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-900 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 transition-all"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          )
                        } catch (err) {
                          console.error('Error rendering bulk entry:', entry, err)
                          return null
                        }
                      })}
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Info Message */}
              {selectedEntry && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Mode Edit:</span> Anda sedang mengedit entri yang ada. Ubah data sesuai kebutuhan dan klik "Perbarui".
                  </p>
                </div>
              )}

              {/* Row 1: Nomor & Tanggal - Auto-fetched */}
        
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    No. Ref <span className="text-green-600">(Auto)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={formData.nomor}
                      className="w-full px-4 py-3 text-base border border-green-300 bg-green-50 rounded-lg text-slate-700 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-3 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">✓ Nomor auto-generate berdasarkan tanggal & urutan</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => {
                      try {
                        const newDate = e.target.value
                        if (newDate) {
                          const newNomor = generateAutoNomor(newDate)
                          setFormData({ ...formData, tanggal: newDate, nomor: newNomor })
                        }
                      } catch (err) {
                        console.error('Error updating tanggal:', err)
                        setFormData({ ...formData, tanggal: e.target.value })
                      }
                    }}
                    className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-2">Ubah untuk auto-update nomor ref</p>
                </div>
              </div>

              {/* Row 2: Deskripsi */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Deskripsi</label>
                <input
                  type="text"
                  required
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
                  placeholder="Deskripsi transaksi"
                />
                <p className="text-xs text-slate-500 mt-2">Penjelasan singkat tentang transaksi</p>
              </div>

              {/* Row 3: Debit & Kredit */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Debit (Rp)</label>
                  <input
                    type="number"
                    value={formData.debit}
                    onChange={(e) => setFormData({ ...formData, debit: parseFloat(e.target.value) || 0, kredit: 0 })}
                    onFocus={(e) => {
                      if (parseFloat(e.target.value) === 0) {
                        e.target.value = '';
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '') {
                        setFormData({ ...formData, debit: 0 });
                      }
                    }}
                    className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
                    placeholder="0"
                  />
                  <p className="text-xs text-slate-500 mt-2">Jumlah debit (masukan / kas)</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">Kredit (Rp)</label>
                  <input
                    type="number"
                    value={formData.kredit}
                    onChange={(e) => setFormData({ ...formData, kredit: parseFloat(e.target.value) || 0, debit: 0 })}
                    onFocus={(e) => {
                      if (parseFloat(e.target.value) === 0) {
                        e.target.value = '';
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '') {
                        setFormData({ ...formData, kredit: 0 });
                      }
                    }}
                    className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
                    placeholder="0"
                  />
                  <p className="text-xs text-slate-500 mt-2">Jumlah kredit (pengeluaran / hutang)</p>
                </div>
              </div>

              {/* Row 4: Keterangan */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Keterangan (Opsional)</label>
                <textarea
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full px-4 py-3 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
                  rows={4}
                  placeholder="Catatan atau keterangan tambahan tentang transaksi ini..."
                />
                <p className="text-xs text-slate-500 mt-2">Catatan tambahan yang relevan</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    try {
                      resetForm()
                      setIsFormDialogOpen(false)
                    } catch (err) {
                      console.error('Error closing form:', err)
                    }
                  }}
                  className="px-6"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : (selectedEntry ? 'Perbarui Entri' : 'Simpan Entri')}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog - Full Screen */}
      {isPreviewOpen && (
        <Dialog open={isPreviewOpen} onOpenChange={(open) => {
          try {
            setIsPreviewOpen(open)
          } catch (err) {
            console.error('Error handling PDF dialog:', err)
          }
        }}>
          <DialogContent className="max-h-[98vh] w-full overflow-y-auto rounded-lg shadow-2xl" style={{maxWidth: '95vw'}}>
            <div className="sticky top-0 bg-white border-b border-slate-200 z-10">
              <DialogHeader className="py-4">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl">Pratinjau Buku Besar PDF</DialogTitle>
                  <button
                    onClick={() => {
                      try {
                        setIsPreviewOpen(false)
                      } catch (err) {
                        console.error('Error closing PDF dialog:', err)
                      }
                    }}
                    className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
                  >
                    ✕
                  </button>
                </div>
              </DialogHeader>
            </div>
            <div className="overflow-auto" style={{ maxHeight: 'calc(98vh - 80px)' }}>
              <div className="p-6 bg-slate-50 flex justify-center">
                <div style={{ width: 'fit-content', minWidth: '100%' }}>
                  <BukuBesarTemplate
                    entries={filteredEntries}
                    periode={periode}
                  />
                </div>
              </div>
            </div>
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

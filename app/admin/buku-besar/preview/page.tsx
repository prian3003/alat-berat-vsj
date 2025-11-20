'use client'

import { useSearchParams } from 'next/navigation'
import { BukuBesarTemplate } from '@/components/buku-besar/buku-besar-template'
import { useEffect, useState, Suspense } from 'react'

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

function BukuBesarPreviewContent() {
  const searchParams = useSearchParams()
  const [entries, setEntries] = useState<BukuBesarEntry[]>([])
  const [periode, setPeriode] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const sessionId = searchParams.get('sessionId')

      if (sessionId) {
        // Retrieve data from sessionStorage
        const storedData = sessionStorage.getItem(sessionId)
        if (storedData) {
          const { periode: periodKey, entries: entriesData } = JSON.parse(storedData)
          setEntries(entriesData)

          // Format periode display
          const [year, month] = periodKey.split('-')
          const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
          const monthIndex = parseInt(month) - 1
          setPeriode(`${monthNames[monthIndex]} ${year}`)
        }
      }
    } catch (error) {
      console.error('Error retrieving preview data:', error)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Memuat...</p>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Tidak ada data untuk ditampilkan</p>
          <a href="/admin/buku-besar" className="text-orange-600 hover:text-orange-700 font-medium">
            Kembali ke Buku Besar
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Buku Besar - {periode}</h1>
            <p className="text-sm text-slate-600 mt-1">Preview Mode</p>
          </div>
          <a
            href="/admin/buku-besar"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            ← Kembali ke Dashboard
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <BukuBesarTemplate entries={entries} periode={periode} />
        </div>
      </div>
    </div>
  )
}

export default function BukuBesarPreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-600">Memuat...</p></div>}>
      <BukuBesarPreviewContent />
    </Suspense>
  )
}

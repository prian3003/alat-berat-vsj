'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { useConfirm } from '@/hooks/use-confirm'

interface Pekerja {
  id: string
  nama: string
  jabatan: string
  nomorTelepon?: string
  alamat?: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function AdminPekerjaPage() {
  const { toast } = useToast()
  const { confirm } = useConfirm()
  const { isAuthenticated, isLoading, logout } = useAuth()
  const [pekerjaList, setPekerjaList] = useState<Pekerja[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    nomorTelepon: '',
    alamat: '',
    status: 'aktif',
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchPekerja()
    }
  }, [isAuthenticated])

  const fetchPekerja = async () => {
    try {
      const response = await fetch('/api/pekerja')
      if (!response.ok) {
        throw new Error('Failed to fetch workers')
      }
      const data = await response.json()
      setPekerjaList(data)
    } catch (error) {
      console.error('Error fetching workers:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data pekerja",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nama || !formData.jabatan) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Nama dan Jabatan harus diisi",
      })
      return
    }

    try {
      const url = editingId ? `/api/pekerja/${editingId}` : '/api/pekerja'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save worker')
      }

      toast({
        variant: "success",
        title: "Berhasil",
        description: editingId ? "Data pekerja berhasil diupdate" : "Pekerja baru berhasil ditambahkan",
      })

      setFormData({
        nama: '',
        jabatan: '',
        nomorTelepon: '',
        alamat: '',
        status: 'aktif',
      })
      setEditingId(null)
      setShowForm(false)
      fetchPekerja()
    } catch (error) {
      console.error('Error saving worker:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menyimpan data pekerja",
      })
    }
  }

  const handleEdit = (pekerja: Pekerja) => {
    setFormData({
      nama: pekerja.nama,
      jabatan: pekerja.jabatan,
      nomorTelepon: pekerja.nomorTelepon || '',
      alamat: pekerja.alamat || '',
      status: pekerja.status,
    })
    setEditingId(pekerja.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string, nama: string) => {
    const confirmed = await confirm({
      title: "Hapus Pekerja",
      description: `Apakah Anda yakin ingin menghapus "${nama}"? Tindakan ini tidak dapat dibatalkan.`,
      confirmText: "Hapus",
      cancelText: "Batal"
    })

    if (!confirmed) return

    try {
      const response = await fetch(`/api/pekerja/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete worker')
      }

      toast({
        variant: "success",
        title: "Berhasil",
        description: "Pekerja berhasil dihapus",
      })

      fetchPekerja()
    } catch (error) {
      console.error('Error deleting worker:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menghapus pekerja",
      })
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      nama: '',
      jabatan: '',
      nomorTelepon: '',
      alamat: '',
      status: 'aktif',
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
              className="border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900 whitespace-nowrap"
            >
              Gaji
            </Link>
            <Link
              href="/admin/pekerja"
              className="border-b-2 border-orange-600 px-4 py-3 text-sm font-medium text-orange-600 whitespace-nowrap"
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
              <h2 className="text-2xl font-bold text-slate-900">Kelola Pekerja</h2>
              <p className="mt-2 text-slate-600">Tambah, ubah, atau hapus data pekerja</p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  nama: '',
                  jabatan: '',
                  nomorTelepon: '',
                  alamat: '',
                  status: 'aktif',
                })
                setEditingId(null)
                setShowForm(true)
              }}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-white font-medium hover:bg-orange-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Pekerja
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Pekerja' : 'Tambah Pekerja Baru'}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Pekerja</Label>
                  <Input
                    id="nama"
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Masukkan nama pekerja"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jabatan">Jabatan</Label>
                  <Input
                    id="jabatan"
                    type="text"
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    placeholder="Contoh: Operator, Sopir, dll"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomorTelepon">Nomor Telepon (Opsional)</Label>
                  <Input
                    id="nomorTelepon"
                    type="tel"
                    value={formData.nomorTelepon}
                    onChange={(e) => setFormData({ ...formData, nomorTelepon: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat (Opsional)</Label>
                  <Input
                    id="alamat"
                    type="text"
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    placeholder="Masukkan alamat pekerja"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="tidak aktif">Tidak Aktif</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    {editingId ? 'Update' : 'Tambah'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Workers Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Memuat data pekerja...</p>
          </div>
        ) : pekerjaList.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nama</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Jabatan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Telepon</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pekerjaList.map((pekerja, index) => (
                  <tr key={pekerja.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{pekerja.nama}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{pekerja.jabatan}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{pekerja.nomorTelepon || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        pekerja.status === 'aktif'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {pekerja.status === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(pekerja)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pekerja.id, pekerja.nama)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-600">Tidak ada data pekerja. Silakan tambah pekerja terlebih dahulu.</p>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  )
}

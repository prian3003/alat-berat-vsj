'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { X, Plus } from 'lucide-react'

interface Pekerja {
  id: string
  nama: string
  jabatan: string
}

interface GajiItem {
  tanggal: string
  keterangan: string
  jam?: number
  jumlah: number
  tipe: 'regular' | 'overtime' | 'break' | 'allowance' | 'libur'
}

interface GajiFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function GajiForm({ onSuccess, onCancel }: GajiFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [pekerjaloading, setPekerjaLoading] = useState(true)
  const [tipe, setTipe] = useState<'weekly' | 'monthly'>('weekly')
  const [pekerjaList, setPekerjaList] = useState<Pekerja[]>([])
  const [selectedPekerja, setSelectedPekerja] = useState<Pekerja | null>(null)
  const [formData, setFormData] = useState({
    tanggalMulai: '',
    tanggalSelesai: '',
    totalGaji: 0,
    bonAmount: 0,
    uangMakanAmount: 0,
    keterangan: '',
    status: 'draft',
  })
  const [items, setItems] = useState<GajiItem[]>([])
  const [newItem, setNewItem] = useState<GajiItem>({
    tanggal: '',
    keterangan: '',
    jam: 0,
    jumlah: 0,
    tipe: 'regular',
  })
  const [bulan, setBulan] = useState(new Date().getMonth() + 1)
  const [tahun, setTahun] = useState(new Date().getFullYear())

  // Fetch workers on mount
  useEffect(() => {
    fetchPekerja()
  }, [])

  const fetchPekerja = async () => {
    try {
      const response = await fetch('/api/pekerja?status=aktif')
      if (!response.ok) {
        console.error('Error fetching workers:', response.statusText)
        // Still set loading to false so form can be used
        setPekerjaLoading(false)
        return
      }
      const data = await response.json()
      setPekerjaList(data)
    } catch (error) {
      console.error('Error fetching workers:', error)
      // Still set loading to false so form can be used
      setPekerjaLoading(false)
    } finally {
      setPekerjaLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculateTotal = (itemsList: GajiItem[]) => {
    return itemsList.reduce((sum, item) => sum + item.jumlah, 0)
  }

  const handleAddItem = () => {
    if (!newItem.tanggal || !newItem.keterangan || newItem.jumlah <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Lengkapi semua field item gaji",
      })
      return
    }

    const updatedItems = [...items, { ...newItem }]
    setItems(updatedItems)
    setFormData(prev => ({
      ...prev,
      totalGaji: calculateTotal(updatedItems),
    }))
    setNewItem({
      tanggal: '',
      keterangan: '',
      jam: 0,
      jumlah: 0,
      tipe: 'regular',
    })

    toast({
      variant: "success",
      title: "Berhasil",
      description: "Item gaji ditambahkan",
    })
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index)
    setItems(updatedItems)
    setFormData(prev => ({
      ...prev,
      totalGaji: calculateTotal(updatedItems),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Only require worker selection if workers are available
    if (pekerjaList.length > 0 && !selectedPekerja) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Pilih pekerja terlebih dahulu",
      })
      return
    }

    if (tipe === 'weekly' && items.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Tambahkan minimal 1 item gaji",
      })
      return
    }

    if (!formData.tanggalMulai || !formData.tanggalSelesai) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Lengkapi tanggal mulai dan selesai",
      })
      return
    }

    setLoading(true)

    try {
      const bonAmount = parseFloat(String(formData.bonAmount || 0))
      const uangMakanAmount = parseFloat(String(formData.uangMakanAmount || 0))
      const totalPotongan = bonAmount + uangMakanAmount
      const gajiNetto = formData.totalGaji - totalPotongan

      const data = {
        tipe,
        bulan: tipe === 'monthly' ? bulan : null,
        tahun: tipe === 'monthly' ? tahun : null,
        tanggalMulai: formData.tanggalMulai,
        tanggalSelesai: formData.tanggalSelesai,
        totalGaji: formData.totalGaji,
        bonAmount,
        uangMakanAmount,
        totalPotongan,
        gajiNetto,
        keterangan: formData.keterangan || null,
        status: formData.status,
        items: tipe === 'weekly' ? items : [],
        pekerjas: selectedPekerja ? [
          {
            pekerjaNama: selectedPekerja.nama,
            pekerjaId: selectedPekerja.id,
            jabatan: selectedPekerja.jabatan,
          }
        ] : [],
      }

      const response = await fetch('/api/gaji', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save salary record')
      }

      toast({
        variant: "success",
        title: "Berhasil",
        description: "Data gaji berhasil disimpan",
      })

      onSuccess()
    } catch (error) {
      console.error('Error saving salary:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menyimpan data gaji",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="w-full h-full bg-white flex flex-col">
        {/* Header */}
        <div className="border-b sticky top-0 bg-white z-10 p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Tambah Gaji</h2>
              <p className="text-sm text-slate-600 mt-1">Mingguan atau Bulanan</p>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            {/* Worker Selection */}
            <div className="space-y-2">
              <Label htmlFor="pekerja">Pilih Pekerja *</Label>
              {pekerjaloading ? (
                <div className="p-3 bg-slate-100 rounded text-sm text-slate-600">Memuat daftar pekerja...</div>
              ) : pekerjaList.length > 0 ? (
                <select
                  id="pekerja"
                  value={selectedPekerja?.id || ''}
                  onChange={(e) => {
                    const selected = pekerjaList.find(p => p.id === e.target.value)
                    setSelectedPekerja(selected || null)
                  }}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  required
                >
                  <option value="">-- Pilih Pekerja --</option>
                  {pekerjaList.map((pekerja) => (
                    <option key={pekerja.id} value={pekerja.id}>
                      {pekerja.nama} ({pekerja.jabatan})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                  Tidak ada pekerja aktif. Silakan tambah pekerja di menu Pekerja terlebih dahulu.
                </div>
              )}
            </div>

            {selectedPekerja && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Pekerja Terpilih:</strong> {selectedPekerja.nama} - {selectedPekerja.jabatan}
                </p>
              </div>
            )}

            {/* Type Toggle */}
            <div className="space-y-2">
              <Label>Tipe Gaji</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={tipe === 'weekly'}
                    onChange={() => setTipe('weekly')}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium">Mingguan</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={tipe === 'monthly'}
                    onChange={() => setTipe('monthly')}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium">Bulanan</span>
                </label>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tanggalMulai">Tanggal Mulai</Label>
                <Input
                  id="tanggalMulai"
                  type="date"
                  value={formData.tanggalMulai}
                  onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tanggalSelesai">Tanggal Selesai</Label>
                <Input
                  id="tanggalSelesai"
                  type="date"
                  value={formData.tanggalSelesai}
                  onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Monthly Salary Input */}
            {tipe === 'monthly' && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="bulan">Bulan</Label>
                  <select
                    id="bulan"
                    value={bulan}
                    onChange={(e) => setBulan(parseInt(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2024, i).toLocaleDateString('id-ID', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tahun">Tahun</Label>
                  <Input
                    id="tahun"
                    type="number"
                    value={tahun}
                    onChange={(e) => setTahun(parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalGaji">Total Gaji</Label>
                  <Input
                    id="totalGaji"
                    type="number"
                    value={formData.totalGaji}
                    onChange={(e) => setFormData({ ...formData, totalGaji: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
            )}

            {/* Weekly Items */}
            {tipe === 'weekly' && (
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Detail Gaji Mingguan</h3>
                  {items.length > 0 && (
                    <span className="text-sm text-slate-600">
                      {items.length} item
                    </span>
                  )}
                </div>

                {/* Add Item Form */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 items-end">
                    <div className="space-y-1">
                      <Label htmlFor="itemTanggal" className="text-xs font-semibold">Tanggal</Label>
                      <Input
                        id="itemTanggal"
                        type="date"
                        value={newItem.tanggal}
                        onChange={(e) => setNewItem({ ...newItem, tanggal: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="itemKeterangan" className="text-xs font-semibold">Keterangan</Label>
                      <Input
                        id="itemKeterangan"
                        placeholder="8 jam, Libur, OT..."
                        value={newItem.keterangan}
                        onChange={(e) => setNewItem({ ...newItem, keterangan: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="itemJam" className="text-xs font-semibold">Jam</Label>
                      <Input
                        id="itemJam"
                        type="number"
                        step="0.5"
                        placeholder="8"
                        value={newItem.jam || ''}
                        onChange={(e) => setNewItem({ ...newItem, jam: e.target.value ? parseFloat(e.target.value) : 0 })}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="itemJumlah" className="text-xs font-semibold">Jumlah *</Label>
                      <Input
                        id="itemJumlah"
                        type="number"
                        placeholder="250000"
                        value={newItem.jumlah || ''}
                        onChange={(e) => setNewItem({ ...newItem, jumlah: parseFloat(e.target.value) || 0 })}
                        className="h-9"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddItem}
                      className="bg-green-600 hover:bg-green-700 h-9 px-4 flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah
                    </Button>
                  </div>
                </div>

                {/* Items List */}
                {items.length > 0 && (
                  <div className="space-y-2">
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-100 border-b">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium">Tanggal</th>
                            <th className="px-4 py-2 text-left font-medium">Keterangan</th>
                            <th className="px-4 py-2 text-right font-medium">Jam</th>
                            <th className="px-4 py-2 text-right font-medium">Jumlah</th>
                            <th className="px-4 py-2 text-center font-medium">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-2">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                              <td className="px-4 py-2">{item.keterangan}</td>
                              <td className="px-4 py-2 text-right">{item.jam ? item.jam : '-'}</td>
                              <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.jumlah)}</td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(index)}
                                  className="inline-flex items-center justify-center w-6 h-6 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                  title="Hapus item"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Deductions Section */}
            <div className="space-y-4 border-t pt-6 bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-lg text-red-900">Potongan Gaji</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bonAmount">Bon (Advance/Pinjaman)</Label>
                  <Input
                    id="bonAmount"
                    type="number"
                    min="0"
                    step="10000"
                    placeholder="0"
                    value={formData.bonAmount || ''}
                    onChange={(e) => setFormData({ ...formData, bonAmount: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-red-600">{formatCurrency(formData.bonAmount || 0)}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uangMakanAmount">Uang Makan</Label>
                  <Input
                    id="uangMakanAmount"
                    type="number"
                    min="0"
                    step="10000"
                    placeholder="0"
                    value={formData.uangMakanAmount || ''}
                    onChange={(e) => setFormData({ ...formData, uangMakanAmount: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-red-600">{formatCurrency(formData.uangMakanAmount || 0)}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2 border-t pt-6">
              <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
              <Textarea
                id="keterangan"
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                placeholder="Catatan tambahan..."
                rows={3}
              />
            </div>

            {/* Salary Summary Display */}
            <div className="space-y-3 border rounded-lg p-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-slate-700 font-medium">Gaji Bruto (Gross):</span>
                <span className="text-lg font-bold text-orange-600">{formatCurrency(formData.totalGaji)}</span>
              </div>
              <div className="space-y-2 pb-3 border-b">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">- Bon:</span>
                  <span className="text-red-600 font-medium">{formatCurrency(formData.bonAmount || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">- Uang Makan:</span>
                  <span className="text-red-600 font-medium">{formatCurrency(formData.uangMakanAmount || 0)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-900 font-bold text-lg">Gaji Netto (Net):</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    formData.totalGaji - (formData.bonAmount || 0) - (formData.uangMakanAmount || 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t sticky bottom-0 bg-white p-6">
            <div className="max-w-7xl mx-auto flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-black hover:bg-slate-800"
              >
                {loading ? 'Menyimpan...' : 'Simpan & Preview'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

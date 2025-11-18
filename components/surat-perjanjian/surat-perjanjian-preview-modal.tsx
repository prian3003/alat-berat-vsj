'use client'

import { useRef, useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import { SuratPerjanjianTemplate } from './surat-perjanjian-template'

type FormData = {
  tanggal: string
  tanggalPernyataan: string
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
  biayaMobilisasi: string
  keterangan: string
  items: Array<{
    jenisAlat: string
    jumlah: number
    hargaSewa: string
    keterangan: string
  }>
}

interface SuratPerjanjianPreviewModalProps {
  formData: FormData
  onFormDataChange: Dispatch<SetStateAction<FormData>>
  onClose: () => void
  noPerjanjian?: string
}

export function SuratPerjanjianPreviewModal({
  formData,
  onFormDataChange,
  onClose,
  noPerjanjian = '',
}: SuratPerjanjianPreviewModalProps) {
  const templateRef = useRef<HTMLDivElement>(null)
  const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Generate preview canvas
  const doGeneratePreview = useCallback(async () => {
    if (!templateRef.current) return

    setIsGeneratingPreview(true)

    try {
      // Wait for component to fully render
      await new Promise(r => setTimeout(r, 150))

      // Wait for images to load
      const images = templateRef.current.querySelectorAll('img')
      const imageLoadPromises = Array.from(images).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete) {
            resolve()
          } else {
            img.onload = () => resolve()
            img.onerror = () => resolve()
            if (!img.src) resolve()
          }
        })
      })

      await Promise.all(imageLoadPromises)
      await new Promise(r => setTimeout(r, 300))

      const canvas = await html2canvas(templateRef.current, {
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
        windowHeight: templateRef.current.scrollHeight,
        windowWidth: templateRef.current.scrollWidth,
      })

      setPreviewCanvas(canvas)
    } catch (error) {
      console.error('Error generating preview:', error)
    } finally {
      setIsGeneratingPreview(false)
    }
  }, [])

  // Debounced preview update when formData changes
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      doGeneratePreview()
    }, 600)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [formData, doGeneratePreview])

  // Generate initial preview
  useEffect(() => {
    const timer = setTimeout(() => {
      doGeneratePreview()
    }, 500)
    return () => clearTimeout(timer)
  }, [doGeneratePreview])

  const handleDownloadPDF = async () => {
    if (!previewCanvas) {
      alert('Preview belum siap. Silakan tunggu...')
      return
    }

    setIsDownloading(true)
    setDownloadProgress(10)

    try {
      setDownloadProgress(30)

      // Use the preview canvas that we already generated
      const canvas = previewCanvas
      const imgData = canvas.toDataURL('image/jpeg', 0.98)

      setDownloadProgress(60)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 10

      const imgWidth = pageWidth - margin * 2
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = margin

      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - margin * 2

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight)
        heightLeft -= pageHeight - margin * 2
      }

      setDownloadProgress(90)

      const filename = noPerjanjian
        ? `Surat-Perjanjian-${noPerjanjian}.pdf`
        : `Surat-Perjanjian-${formData.pihakKeduaNama}.pdf`

      pdf.save(filename)

      setDownloadProgress(100)

      await new Promise(r => setTimeout(r, 300))
      setDownloadProgress(0)
      setIsDownloading(false)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Gagal mengunduh PDF: ' + (error instanceof Error ? error.message : 'Unknown error'))
      setIsDownloading(false)
      setDownloadProgress(0)
    }
  }

  const updateFormData = (updates: Partial<FormData>) => {
    onFormDataChange(prev => ({ ...prev, ...updates }))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    updateFormData({ items: newItems })
  }

  const addItemRow = () => {
    updateFormData({
      items: [...formData.items, { jenisAlat: '', jumlah: 1, hargaSewa: '', keterangan: '' }],
    })
  }

  const removeItemRow = (index: number) => {
    updateFormData({
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between bg-white flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold">Preview & Edit PDF</h2>
            <p className="text-xs text-slate-600">Review dan edit dokumen sebelum download</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Split Screen */}
        <div className="flex flex-1 overflow-hidden gap-4 p-4 min-h-0">
          {/* LEFT: Form Editor */}
          <div className="w-1/2 overflow-y-auto space-y-4 pr-4 min-w-0">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-slate-900 sticky top-0 bg-white py-2">Edit Data</h3>

              {/* Tanggal Section */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Tanggal</label>
                <input
                  type="date"
                  value={formData.tanggal}
                  onChange={(e) => updateFormData({ tanggal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Tanggal Pernyataan</label>
                <input
                  type="text"
                  placeholder="Delapan Belas bulan Oktober..."
                  value={formData.tanggalPernyataan}
                  onChange={(e) => updateFormData({ tanggalPernyataan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                />
              </div>

              {/* Pihak Pertama */}
              <div className="border-t pt-3 space-y-2">
                <h4 className="text-xs font-semibold text-slate-700">Pihak Pertama (VSJ)</h4>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Nama</label>
                  <input
                    type="text"
                    value={formData.pihakPertamaNama}
                    onChange={(e) => updateFormData({ pihakPertamaNama: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Jabatan</label>
                  <input
                    type="text"
                    value={formData.pihakPertamaJabatan}
                    onChange={(e) => updateFormData({ pihakPertamaJabatan: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Perusahaan</label>
                  <input
                    type="text"
                    value={formData.pihakPertamaPerusahaan}
                    onChange={(e) => updateFormData({ pihakPertamaPerusahaan: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Alamat</label>
                  <textarea
                    value={formData.pihakPertamaAlamat}
                    onChange={(e) => updateFormData({ pihakPertamaAlamat: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                    rows={2}
                  />
                </div>
              </div>

              {/* Pihak Kedua */}
              <div className="border-t pt-3 space-y-2">
                <h4 className="text-xs font-semibold text-slate-700">Pihak Kedua (Penyewa)</h4>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Nama</label>
                  <input
                    type="text"
                    value={formData.pihakKeduaNama}
                    onChange={(e) => updateFormData({ pihakKeduaNama: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Jabatan</label>
                  <input
                    type="text"
                    value={formData.pihakKeduaJabatan}
                    onChange={(e) => updateFormData({ pihakKeduaJabatan: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Perusahaan</label>
                  <input
                    type="text"
                    value={formData.pihakKedualPerusahaan}
                    onChange={(e) => updateFormData({ pihakKedualPerusahaan: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Alamat</label>
                  <textarea
                    value={formData.pihakKeduaAlamat}
                    onChange={(e) => updateFormData({ pihakKeduaAlamat: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                    rows={2}
                  />
                </div>
              </div>

              {/* Detail Perjanjian */}
              <div className="border-t pt-3 space-y-2">
                <h4 className="text-xs font-semibold text-slate-700">Detail Perjanjian</h4>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Lokasi Pekerjaan</label>
                  <textarea
                    value={formData.lokasiPekerjaan}
                    onChange={(e) => updateFormData({ lokasiPekerjaan: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-700">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={formData.tanggalMulai}
                      onChange={(e) => updateFormData({ tanggalMulai: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-700">Tanggal Selesai</label>
                    <input
                      type="date"
                      value={formData.tanggalSelesai}
                      onChange={(e) => updateFormData({ tanggalSelesai: e.target.value })}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Biaya Mobilisasi</label>
                  <input
                    type="text"
                    placeholder="4000000"
                    value={formData.biayaMobilisasi}
                    onChange={(e) => updateFormData({ biayaMobilisasi: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </div>
              </div>

              {/* Items */}
              <div className="border-t pt-3 space-y-2">
                <h4 className="text-xs font-semibold text-slate-700">Alat yang Disewa</h4>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-1.5 items-end">
                      <input
                        type="text"
                        placeholder="Jenis Alat"
                        value={item.jenisAlat}
                        onChange={(e) => updateItem(index, 'jenisAlat', e.target.value)}
                        className="flex-1 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                      />
                      <input
                        type="number"
                        placeholder="Jml"
                        value={item.jumlah}
                        onChange={(e) => updateItem(index, 'jumlah', parseInt(e.target.value))}
                        className="w-12 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                      />
                      <input
                        type="text"
                        placeholder="Harga"
                        value={item.hargaSewa}
                        onChange={(e) => updateItem(index, 'hargaSewa', e.target.value)}
                        className="w-24 px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                      />
                      {formData.items.length > 1 && (
                        <button
                          onClick={() => removeItemRow(index)}
                          className="px-2 py-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs font-medium"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addItemRow}
                    className="px-3 py-1.5 text-xs font-medium text-orange-600 border border-orange-600 rounded hover:bg-orange-50 w-full"
                  >
                    + Tambah Item
                  </button>
                </div>
              </div>

              {/* Keterangan */}
              <div className="border-t pt-3 space-y-2">
                <label className="block text-xs font-medium text-slate-700">Keterangan Tambahan</label>
                <textarea
                  placeholder="Catatan tambahan"
                  value={formData.keterangan}
                  onChange={(e) => updateFormData({ keterangan: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-600"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: PDF Preview */}
          <div className="w-1/2 flex flex-col gap-2 min-w-0">
            <div className="bg-white z-10 flex-shrink-0">
              <p className="text-xs font-medium text-slate-600 mb-2">
                {isGeneratingPreview ? '🔄 Updating preview...' : '✓ Preview ready'}
              </p>
            </div>

            <div className="flex-1 bg-slate-100 rounded border border-slate-300 overflow-auto flex flex-col items-center justify-start p-2 min-h-0">
              {previewCanvas ? (
                <canvas
                  ref={(canvasRef) => {
                    if (canvasRef && previewCanvas) {
                      const ctx = canvasRef.getContext('2d')
                      if (ctx) {
                        canvasRef.width = previewCanvas.width
                        canvasRef.height = previewCanvas.height
                        ctx.drawImage(previewCanvas, 0, 0)
                      }
                    }
                  }}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                    display: 'block',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#fff',
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full text-slate-500">
                  <p className="text-sm">Generating preview...</p>
                </div>
              )}
            </div>

            {/* Download Button */}
            <div className="border-t pt-3 flex gap-2 flex-shrink-0">
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading || isGeneratingPreview || !previewCanvas}
                className="flex-1"
              >
                {isDownloading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    </svg>
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download PDF
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onClose} disabled={isDownloading}>
                Batal
              </Button>
            </div>

            {isDownloading && (
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden flex-shrink-0">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden template for preview generation - positioned off-screen, not display:none */}
      <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: '210mm', visibility: 'hidden' }}>
        <div ref={templateRef}>
          <SuratPerjanjianTemplate
            noPerjanjian={noPerjanjian}
            tanggal={formData.tanggal}
            tanggalPernyataan={formData.tanggalPernyataan}
            pihakPertamaNama={formData.pihakPertamaNama}
            pihakPertamaJabatan={formData.pihakPertamaJabatan}
            pihakPertamaPerusahaan={formData.pihakPertamaPerusahaan}
            pihakPertamaAlamat={formData.pihakPertamaAlamat}
            pihakKeduaNama={formData.pihakKeduaNama}
            pihakKeduaJabatan={formData.pihakKeduaJabatan}
            pihakKedualPerusahaan={formData.pihakKedualPerusahaan}
            pihakKeduaAlamat={formData.pihakKeduaAlamat}
            lokasiPekerjaan={formData.lokasiPekerjaan}
            tanggalMulai={formData.tanggalMulai}
            tanggalSelesai={formData.tanggalSelesai}
            biayaMobilisasi={formData.biayaMobilisasi}
            items={formData.items.map((item, idx) => ({
              ...item,
              urutan: idx + 1,
            }))}
            keterangan={formData.keterangan}
          />
        </div>
      </div>
    </div>
  )
}

'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

interface SuratPerjanjianItem {
  urutan: number
  jenisAlat: string
  jumlah: number
  hargaSewa: string
  keterangan?: string
}

interface SuratPerjanjianTemplateProps {
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
}

export function SuratPerjanjianTemplate({
  noPerjanjian,
  tanggal,
  tanggalPernyataan,
  pihakPertamaNama,
  pihakPertamaJabatan,
  pihakPertamaPerusahaan,
  pihakPertamaAlamat,
  pihakKeduaNama,
  pihakKeduaJabatan,
  pihakKedualPerusahaan,
  pihakKeduaAlamat,
  lokasiPekerjaan,
  tanggalMulai,
  tanggalSelesai,
  items,
  keterangan,
}: SuratPerjanjianTemplateProps) {
  const templateRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handlePrint = () => {
    if (templateRef.current) {
      window.print()
    }
  }

  const handleDownloadPDF = async () => {
    if (!templateRef.current) {
      alert('Dokumen tidak siap')
      return
    }

    setIsDownloading(true)
    setDownloadProgress(10)

    try {
      const element = templateRef.current

      // Store original display state only for the button container
      const buttonContainer = element.parentElement?.querySelector('[class*="print:hidden"]') as HTMLElement
      const originalDisplay = buttonContainer?.style.display

      setDownloadProgress(20)

      // Wait for ALL images to load before capturing (suppress console output)
      const originalWarn = console.warn
      const originalLog = console.log
      console.warn = () => {}
      console.log = () => {}

      const images = element.querySelectorAll('img')
      const imageLoadPromises = Array.from(images).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete) {
            resolve()
          } else {
            img.onload = () => resolve()
            img.onerror = () => resolve() // Resolve even on error to not block
            // Force reload if needed
            if (!img.src) {
              resolve()
            }
          }
        })
      })

      await Promise.all(imageLoadPromises)
      setDownloadProgress(30)

      // Additional wait to ensure rendering is complete
      await new Promise(r => setTimeout(r, 1000))

      // Restore console
      console.warn = originalWarn
      console.log = originalLog

      // Use html2canvas-pro which supports modern CSS colors (lab, oklch, etc)
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true,
        backgroundColor: '#ffffff',
        imageTimeout: 15000, // Increase timeout to 15 seconds for logo loading
        ignoreElements: (el) => {
          // Don't ignore any elements - we need everything including images
          return false
        },
        windowHeight: element.scrollHeight, // Capture full height of content
        windowWidth: element.scrollWidth, // Capture full width of content
      })

      setDownloadProgress(60)

      // Create PDF from canvas
      const imgData = canvas.toDataURL('image/png', 0.98)
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

      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - margin * 2

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
        heightLeft -= pageHeight - margin * 2
      }

      setDownloadProgress(90)

      // Save PDF
      pdf.save(`${noPerjanjian}.pdf`)

      setDownloadProgress(100)

      // No need to restore - print:hidden CSS will handle visibility
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="w-full">
      {/* Buttons */}
      <div className="mb-4 space-y-3 print:hidden">
        <div className="flex gap-2">
          <button onClick={handlePrint} className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white font-medium hover:bg-orange-700 transition-colors" disabled={isDownloading}>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"
              />
            </svg>
            Cetak
          </button>
          <button onClick={handleDownloadPDF} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50" disabled={isDownloading}>
            {isDownloading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                </svg>
                Mengunduh...
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
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
          </button>
        </div>
        {isDownloading && (
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Document */}
      <div
        ref={templateRef}
        className="mx-auto w-full bg-white"
        style={{
          fontSize: '10pt',
          lineHeight: 1.3,
          maxWidth: '8.5in',
          margin: '0 auto',
          padding: '20mm 15mm',
        }}
      >
        {/* Header */}
        <div className="mb-3 pb-1 border-b border-gray-300 print:mb-2 print:pb-0.5">
          <div className="flex items-start gap-2">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="VSJ Logo"
                style={{ height: '60px', width: 'auto' }}
              />
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h1 className="text-center text-base font-bold leading-tight">
                PT. VANIA SUGIARTA JAYA
              </h1>
              <p className="text-center text-xs font-semibold text-gray-700 mt-0.5">
                Sewa Alat Berat Terpercaya
              </p>
              <p className="text-center text-xs text-gray-600 mt-1 space-y-0">
                <span className="block text-xs">Jln. Werdi Bhuwana, Kec. Mengwi, Kab. Badung-Bali, 80351</span>
                <span className="block text-xs">Telp. (+62) 821-3965-9136 | Email: vaniasugiartajaya25@gmail.com</span>
                <span className="block text-xs">www.vaniasugiarta.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Document Title */}
        <h2 className="mb-4 text-center text-base font-bold border-b-2 border-black pb-1">
          SURAT PERJANJIAN SEWA ALAT BERAT
        </h2>

        {/* Document Info */}
        <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
          <div className="flex justify-between items-center border-b border-black pb-0.5">
            <span className="font-bold">No. Perjanjian:</span>
            <span>{noPerjanjian}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-0.5">
            <span className="font-bold">Tanggal:</span>
            <span>{formatDate(tanggal)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-0.5">
            <span className="font-bold">Lokasi Pekerjaan:</span>
            <span>{lokasiPekerjaan}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-0.5">
            <span className="font-bold">Jangka Waktu:</span>
            <span>{formatDate(tanggalMulai)} s/d {formatDate(tanggalSelesai)}</span>
          </div>
        </div>

        {/* Pihak Information Section */}
        <div className="mb-3 text-xs space-y-2">
          {/* Pihak Pertama */}
          <div>
            <p className="font-bold mb-0.5">Pihak Pertama (Penyedia):</p>
            <div className="ml-3 space-y-0">
              <p><span className="font-bold">Nama:</span> {pihakPertamaNama}</p>
              <p><span className="font-bold">Jabatan:</span> {pihakPertamaJabatan}</p>
              <p><span className="font-bold">Perusahaan:</span> {pihakPertamaPerusahaan}</p>
              <p><span className="font-bold">Alamat:</span> {pihakPertamaAlamat}</p>
            </div>
          </div>

          {/* Pihak Kedua */}
          <div>
            <p className="font-bold mb-0.5">Pihak Kedua (Penyewa):</p>
            <div className="ml-3 space-y-0">
              <p><span className="font-bold">Nama:</span> {pihakKeduaNama}</p>
              <p><span className="font-bold">Jabatan:</span> {pihakKeduaJabatan}</p>
              <p><span className="font-bold">Perusahaan:</span> {pihakKedualPerusahaan}</p>
              <p><span className="font-bold">Alamat:</span> {pihakKeduaAlamat}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="mb-4 w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-800 px-3 py-2 text-center font-bold w-8">NO</th>
              <th className="border border-gray-800 px-3 py-2 text-left font-bold">JENIS ALAT</th>
              <th className="border border-gray-800 px-3 py-2 text-center font-bold">JUMLAH</th>
              <th className="border border-gray-800 px-3 py-2 text-left font-bold">HARGA SEWA</th>
              <th className="border border-gray-800 px-3 py-2 text-left font-bold">KETERANGAN</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.urutan} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-3 py-2 text-center">
                  {item.urutan}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {item.jenisAlat}
                </td>
                <td className="border border-gray-300 px-3 py-2 text-center">{item.jumlah}</td>
                <td className="border border-gray-300 px-3 py-2">
                  {item.hargaSewa}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {item.keterangan || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Notes Section */}
        <div className="mb-4 text-xs border-l-4 border-gray-400 pl-2 py-1 bg-gray-50">
          <p className="font-bold mb-0.5">Keterangan:</p>
          <p className="mb-0.5">Kedua belah pihak setuju dengan syarat dan ketentuan yang telah ditetapkan</p>
          {keterangan && <p><span className="font-bold">Catatan:</span> {keterangan}</p>}
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-2 gap-4 text-center text-xs">
          <div>
            <p className="font-bold mb-8">PIHAK PERTAMA</p>
            <div className="border-t-2 border-black pt-0.5 h-8 mb-0.5"></div>
            <p className="text-xs">Tanda Tangan</p>
          </div>

          <div>
            <p className="font-bold mb-8">PIHAK KEDUA</p>
            <div className="border-t-2 border-black pt-0.5 h-8 mb-0.5"></div>
            <p className="text-xs">Tanda Tangan</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-1 border-t border-gray-300 text-center text-xs text-gray-600 print:mt-2 print:pt-0.5">
          <p className="font-semibold text-xs">PT. VANIA SUGIARTA JAYA</p>
          <p className="text-xs">Jln. Werdi Bhuwana, Kec. Mengwi, Kab. Badung-Bali, 80351</p>
          <p className="text-xs">Telp. (+62) 821-3965-9136 | www.vaniasugiarta.com</p>
        </div>

        {/* Print-specific styles */}
        <style>{`
          @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
          }
          @media print {
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
            body {
              font-size: 10pt;
              line-height: 1.3;
              color: #000;
            }
            .print\\:hidden {
              display: none !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            h1, h2, h3, h4 {
              page-break-after: avoid;
              margin: 0.1em 0 0.05em 0;
              padding: 0;
            }
            p {
              margin: 0.05em 0;
              padding: 0;
              line-height: 1.3;
            }
            table {
              page-break-inside: avoid;
              border-collapse: collapse;
              width: 100%;
              font-size: 9pt;
            }
            tr {
              page-break-inside: avoid;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

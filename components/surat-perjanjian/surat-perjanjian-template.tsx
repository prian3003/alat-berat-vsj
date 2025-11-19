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
  biayaMobilisasi?: string
  items: SuratPerjanjianItem[]
  keterangan?: string
}

// Function to format currency with dot separators (Indonesian format)
// 300000 -> 300.000, 3000000 -> 3.000.000
const formatCurrency = (value: string | number): string => {
  const numStr = String(value).replace(/\D/g, '') // Remove non-digits
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
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
  biayaMobilisasi,
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
      // Use standard A4 dimensions for proper page splitting
      const A4_MM = { width: 210, height: 297 }
      const MARGIN_MM = 10
      const CONTENT_WIDTH_MM = A4_MM.width - MARGIN_MM * 2

      // DOM-based page break detection - scan Pasal containers BEFORE rendering
      const getPasalPositions = (): number[] => {
        const positions: number[] = []
        const elementRect = element.getBoundingClientRect()

        // Find all Pasal containers (divs with pageBreakInside style)
        const pasalDivs = Array.from(element.querySelectorAll('div[style*="pageBreakInside"]'))

        pasalDivs.forEach((pasal) => {
          const pasalRect = pasal.getBoundingClientRect()
          // Get position relative to the element
          const relativeY = pasalRect.bottom - elementRect.top
          positions.push(relativeY)
        })

        // Also add structural breaks (header sections, signature section, etc)
        // Find all major section divs that should stay together
        const sections = Array.from(element.querySelectorAll('div[style*="margin"]')).filter((el) => {
          const style = el.getAttribute('style') || ''
          // Look for divs with explicit margins that are section containers
          return style.includes('marginTop') || style.includes('marginBottom')
        })

        sections.forEach((section) => {
          const sectionRect = section.getBoundingClientRect()
          const relativeY = sectionRect.bottom - elementRect.top
          if (!positions.includes(relativeY) && relativeY > 0) {
            positions.push(relativeY)
          }
        })

        // Sort and remove duplicates
        positions.sort((a, b) => a - b)
        return Array.from(new Set(positions))
      }

      const breakPositions = getPasalPositions()

      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        logging: false,
        allowTaint: true,
        useCORS: true,
        backgroundColor: '#ffffff',
        imageTimeout: 16000,
        ignoreElements: (el) => {
          return false
        },
        scrollY: 0,
        scrollX: 0,
      })

      setDownloadProgress(60)

      // Convert mm to px (at scale 2)
      const MM_TO_PX = (mmValue: number) => (mmValue * 96) / 25.4 * 2
      const pageHeightPx = MM_TO_PX(A4_MM.height)
      const contentHeightPerPagePx = pageHeightPx - MM_TO_PX(MARGIN_MM * 2)

      // Use DOM Pasal positions to determine smart page breaks
      const detectPageBreaks = (): number[] => {
        const breaks: number[] = [0]

        if (breakPositions.length === 0) {
          // Fallback: use simple pixel-based splitting if no sections found
          const canvasHeight = canvas.height
          for (let i = contentHeightPerPagePx; i < canvasHeight; i += contentHeightPerPagePx) {
            breaks.push(i)
          }
          breaks.push(canvasHeight)
          return breaks
        }

        // Convert DOM positions to canvas pixels (accounting for scale 2)
        const sectionPixels = breakPositions.map((pos) => pos * 2)

        let currentPageEnd = contentHeightPerPagePx
        let sectionIdx = 0

        while (sectionIdx < sectionPixels.length) {
          // Find the last Pasal/section that fits on this page
          while (sectionIdx < sectionPixels.length && sectionPixels[sectionIdx] <= currentPageEnd) {
            sectionIdx++
          }

          // Back up to last section that fits
          if (sectionIdx > 0) {
            const lastSectionThatFits = sectionPixels[sectionIdx - 1]
            breaks.push(lastSectionThatFits)
            currentPageEnd = lastSectionThatFits + contentHeightPerPagePx
          } else {
            // First section is too long for a page, force it anyway
            if (sectionPixels[0] > currentPageEnd) {
              breaks.push(sectionPixels[0])
              currentPageEnd = sectionPixels[0] + contentHeightPerPagePx
              sectionIdx++
            }
          }
        }

        // Ensure last page is included
        if (breaks[breaks.length - 1] !== canvas.height) {
          breaks.push(canvas.height)
        }

        return breaks
      }

      const pageBreaks = detectPageBreaks()

      // Create PDF from canvas
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const imgWidth = CONTENT_WIDTH_MM
      const canvasWidth = canvas.width

      for (let breakIdx = 0; breakIdx < pageBreaks.length - 1; breakIdx++) {
        if (breakIdx > 0) {
          pdf.addPage()
        }

        const cropStartPx = pageBreaks[breakIdx]
        const cropEndPx = pageBreaks[breakIdx + 1]
        const cropHeightPx = cropEndPx - cropStartPx

        // Create a temporary canvas for this page's content
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvasWidth
        pageCanvas.height = cropHeightPx

        const ctx = pageCanvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, cropStartPx, // Source position (crop)
            canvasWidth, cropHeightPx, // Source size
            0, 0, // Destination position
            canvasWidth, cropHeightPx // Destination size
          )
        }

        // Convert page canvas to image data
        const pageImgData = pageCanvas.toDataURL('image/png', 0.98)

        // Calculate image height based on width scaling
        const imgHeight = (cropHeightPx * imgWidth) / canvasWidth

        // Add image to PDF
        pdf.addImage(pageImgData, 'PNG', MARGIN_MM, MARGIN_MM, imgWidth, imgHeight)
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
          fontSize: '11pt',
          lineHeight: 1.4,
          maxWidth: '8.5in',
          margin: '0 auto',
          padding: '20mm 15mm',
        }}
      >
        {/* Header with Logo */}
        <div className="mb-6 pb-3 border-b-2 border-black text-center">
          {/* Logo */}
          <div className="mb-2">
            <img
              src="/logo.png"
              alt="VSJ Logo"
              style={{ height: '70px', width: 'auto', margin: '0 auto', display: 'block' }}
            />
          </div>

          {/* Company Info */}
          <h1 className="text-base font-bold leading-tight">
            PT. VANIA SUGIARTA JAYA
          </h1>
          <p className="text-sm font-semibold text-gray-700 mt-0.5">
            Sewa Alat Berat Terpercaya
          </p>
          <p className="text-xs text-gray-600 mt-1">
            <span className="block">Jln. Werdi Bhuwana, Kec. Mengwi, Kab. Badung-Bali, 80351</span>
            <span className="block">Telp. (+62) 813-7026-6314 | www.vaniasugiartajaya.com</span>
          </p>
        </div>

        {/* Document Title */}
        <h2 className="mb-6 text-center text-base font-bold border-b-2 border-black pb-3">
          SURAT PERJANJIAN SEWA PAKAI ALAT BERAT
        </h2>

        {/* Document Number */}
        <div className="mb-4 text-sm">
          <div className="flex justify-between items-center border-b border-black pb-2">
            <span className="font-bold">Nomor Perjanjian:</span>
            <span className="font-bold">{noPerjanjian}</span>
          </div>
        </div>

        {/* Pihak Information Section */}
        <div className="mb-4 text-sm space-y-3">
          <p>Pada hari ini, <span className="font-bold">{tanggalPernyataan || 'yang telah ditetapkan'}</span>, yang bertanda tangan di bawah ini :</p>

          {/* Pihak Pertama */}
          <div className="ml-8 mb-4">
            <div className="flex mb-1">
              <span className="font-bold w-24">I. Nama</span>
              <span>: <span className="font-bold">{pihakPertamaNama}</span></span>
            </div>
            <div className="flex mb-1">
              <span className="font-bold w-24">Jabatan</span>
              <span>: {pihakPertamaJabatan}</span>
            </div>
            <div className="flex mb-1">
              <span className="font-bold w-24">Perusahaan</span>
              <span>: <span className="font-bold">{pihakPertamaPerusahaan}</span></span>
            </div>
            <div className="flex mb-1">
              <span className="font-bold w-24">Alamat</span>
              <span>: {pihakPertamaAlamat}</span>
            </div>
            <p className="text-sm">Selanjutnya disebut <span className="font-bold">PIHAK PERTAMA</span></p>
          </div>

          {/* Pihak Kedua */}
          <div className="ml-8">
            <div className="flex mb-1">
              <span className="font-bold w-24">II. Nama</span>
              <span>: <span className="font-bold">{pihakKeduaNama}</span></span>
            </div>
            <div className="flex mb-1">
              <span className="font-bold w-24">Jabatan</span>
              <span>: {pihakKeduaJabatan}</span>
            </div>
            <div className="flex mb-1">
              <span className="font-bold w-24">Perusahaan</span>
              <span>: <span className="font-bold">{pihakKedualPerusahaan}</span></span>
            </div>
            <div className="flex mb-1">
              <span className="font-bold w-24">Alamat</span>
              <span>: {pihakKeduaAlamat}</span>
            </div>
            <p className="text-sm">Selanjutnya disebut <span className="font-bold">PIHAK KEDUA</span></p>
          </div>

          {/* Agreement Statement */}
          <p className="text-sm mt-3">Kedua belah pihak telah sepakat untuk mengadakan perjanjian sewa pakai alat berat untuk pekerjaan di lokasi {lokasiPekerjaan} dengan ketentuan dan syarat yang diatur dalam pasal – pasal di bawah ini :</p>
        </div>

        {/* Pasal Section */}
        <div className="mb-4 text-sm space-y-2" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
          <p className="font-bold text-center mb-3" style={{ fontSize: '11pt', wordWrap: 'break-word', overflowWrap: 'break-word' }}>DENGAN KETENTUAN DAN SYARAT SEBAGAI BERIKUT :</p>

          {/* Pasal 1 */}
          <div style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: '11pt', wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Pasal 1</p>
            <p className="font-bold text-center" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', margin: '8px 0 8px 0' }}>Jenis, Jumlah, Harga Sewa dan Lokasi Kerja.</p>
            <p className="ml-6 mb-2">1. PIHAK PERTAMA bersedia menyewakan alat kepada PIHAK KEDUA dan PIHAK KEDUA setuju untuk menyewa alat berat kepada PIHAK PERTAMA dengan jenis alat sebagai berikut :</p>

            {/* Sub-point a: Jenis alat berat */}
            <p className="ml-8 mb-1">a) Jenis alat berat :</p>
            <div className="ml-12 space-y-0.5 mb-3">
              {items.map((item) => (
                <p key={item.urutan}>• {item.urutan} ({item.urutan === 1 ? 'satu' : 'dua'}) Unit {item.jenisAlat}</p>
              ))}
            </div>

            {/* Sub-point b: Harga sewa alat berat */}
            <p className="ml-8 mb-1">b) Harga sewa alat berat :</p>
            <div className="ml-12 space-y-0.5 mb-3">
              {items.map((item) => (
                <p key={item.urutan}>• {item.jenisAlat}     Rp. {formatCurrency(item.hargaSewa)} / Jam</p>
              ))}
            </div>

            <p className="ml-6 mb-1">2. Harga sewa alat berat di atas tanpa pemotongan pajak dan kedua belah pihak setuju bahwa tarif sewa alat berat pada Pasal 1 ini tidak akan berubah selama perjanjian belum berakhir.</p>
            <p className="ml-6">3. Lokasi kerja PIHAK KEDUA yaitu terletak di {lokasiPekerjaan}.</p>
          </div>

          {/* Pasal 2 */}
          <div style={{ marginBottom: '12px', pageBreakInside: 'avoid' }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt", wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Pasal 2</p>
            <p className="font-bold mb-3 text-center" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Tempat, Waktu dan Kondisi Penyerahan Alat Berat</p>
            <p className="ml-6 mb-1">1. Alat diangkut oleh PIHAK PERTAMA ke lokasi yang telah ditentukan oleh PIHAK KEDUA setelah PIHAK KEDUA menyelesaikan administrasi sewa menyewa.</p>
            <p className="ml-6">2. Waktu penyerahan alat berat selambat lambatnya tiga hari setelah surat perjanjian kerja ini ditandatangani.</p>
          </div>

          {/* Pasal 3 */}
          <div style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            
              <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt", wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Pasal 3</p>
              <p className="font-bold text-center" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', margin: '8px 0 0 0' }}>Biaya Mobilisasi Alat Berat</p>
            {biayaMobilisasi ? (
              <>
                <p className="ml-6 mb-1">1. Biaya Mobilisasi dan Demobilisasi alat berat adalah senilai Rp. {formatCurrency(biayaMobilisasi)} (sesuai kesepakatan kedua belah pihak).</p>
                <p className="ml-6">2. Biaya Mobilisasi ditanggung oleh PIHAK KEDUA.</p>
              </>
            ) : (
              <>
                <p className="ml-6 mb-1">1. Biaya Mobilisasi dan Demobilisasi alat berat akan ditentukan berdasarkan kesepakatan kedua belah pihak.</p>
                <p className="ml-6">2. Biaya Mobilisasi ditanggung oleh PIHAK KEDUA.</p>
              </>
            )}
          </div>

          {/* Pasal 4 */}
          <div style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
            
              <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt", wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Pasal 4</p>
              <p className="font-bold text-center" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', margin: '8px 0 0 0' }}>Biaya Operasi, Pemeliharaan dan Perbaikan Alat</p>
            <p className="ml-6 mb-1">1. Selama masa penyewaan alat berat, keperluan olie, perbaikan kerusakan, penggantian sparepart dan Mekanik menjadi tanggung jawab PIHAK PERTAMA.</p>
            <p className="ml-6">2. Pemakaian BBM (Bahan Bakar Minyak) untuk keperluan operasi menjadi tanggung jawab PIHAK KEDUA.</p>
          </div>

          {/* Pasal 5 */}
          <div style={{ marginBottom: "12px", pageBreakInside: 'avoid' }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt", wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Pasal 5</p>
            <p className="font-bold mb-3 text-center" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Operasi dan Operator</p>
            <p className="ml-6">Pengadaan Operator menjadi tanggung jawab PIHAK PERTAMA, kebutuhan operator seperti makan, minum, tempat tinggal dan transportasi menjadi tanggung jawab PIHAK KEDUA.</p>
          </div>

          {/* Pasal 6 */}
          <div style={{ marginBottom: "12px", pageBreakInside: 'avoid' }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt", wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Pasal 6</p>
            <p className="font-bold text-center" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', margin: '8px 0 8px 0' }}>Laporan Operasi Alat (Time Sheet)</p>
            <p className="ml-6">Laporan harian operasi alat diisi oleh operator dan ditandatangani oleh Pengawas Kerja dari PIHAK KEDUA atau atas nama penyewa alat.</p>
          </div>

          {/* Pasal 7 */}
          <div style={{ marginBottom: "12px", pageBreakInside: 'avoid' }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt", wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Pasal 7</p>
            <p className="font-bold text-center" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', margin: '8px 0 8px 0' }}>Pembayaran Sewa</p>
            <p className="ml-6 mb-1">1. PIHAK KEDUA berkewajiban menyelesaikan pembayaran sewa alat berat dimuka sebesar 100 jam/unitnya serta ditambah biaya mobilisasi.</p>
            <p className="ml-6 mb-1">2. Uang pembayaran sewa alat berat dibayarkan secara tunai atau sesuai kesepakatan kedua belah pihak.</p>
            <p className="ml-6">3. Jika pekerjaan sudah hampir mencapai nilai dari dana masuk dan PIHAK KEDUA masih akan memperpanjang masa sewa maka harus memberitahukan kepada PIHAK PERTAMA minimal dua (2) hari sebelum habis masa sewa alat berat.</p>
          </div>

          {/* Pasal 8 */}
          <div style={{ marginBottom: "12px", pageBreakInside: 'avoid' }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt", wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Pasal 8</p>
            <p className="font-bold text-center" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', margin: '8px 0 8px 0' }}>Keamanan Alat Berat</p>
            <p className="ml-6 mb-1">1. PIHAK KEDUA wajib menyediakan security untuk menjaga keamanan alat di lokasi kerja.</p>
            <p className="ml-6 mb-1">2. PIHAK KEDUA wajib membayar ganti rugi terhadap unit kerja jika terjadi pencurian, perusakan dalam bentuk apapun juga yang dilakukan secara sengaja maupun tidak sengaja.</p>
            <p className="ml-6">3. Apabila alat tenggelam/mengalami kecelakaan pada saat di lokasi kerja maka biaya yang timbul akibat hal tersebut akan menjadi tanggungan PIHAK KEDUA.</p>
          </div>

          {/* Pasal 9 */}
          <div style={{ marginBottom: "12px", pageBreakInside: 'avoid' }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt", wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Pasal 9</p>
            <p className="font-bold text-center" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', margin: '8px 0 8px 0' }}>Masa Perjanjian</p>
            <p className="ml-6 mb-1">1. Perjanjian ini berlaku sejak ditandatangani oleh kedua belah pihak hingga alat dianggap telah selesai bekerja.</p>
            <p className="ml-6">2. Perjanjian sewa akan diperpanjang kembali jika ada kesepakatan oleh kedua belah pihak baik pembayaran maupun hal lainnya.</p>
          </div>

          {/* Pasal 10 */}
          <div style={{ marginBottom: "12px", pageBreakInside: 'avoid' }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt", wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Pasal 10</p>
            <p className="font-bold text-center" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', margin: '8px 0 8px 0' }}>Pemindahan, Pengambilan dan Penggunaan Alat</p>
            <p className="ml-6 mb-1">1. Alat tidak boleh dipindahkan ke lokasi lain oleh PIHAK KEDUA sebelum masa jam perjanjian habis terkecuali ada persetujuan dari PIHAK PERTAMA.</p>
            <p className="ml-6 mb-1">2. Apabila PIHAK KEDUA akan menggunakan alat keluar lokasi yang telah ditentukan dalam perjanjian ini maka PIHAK KEDUA wajib memberitahukan kepada PIHAK PERTAMA sebelumnya.</p>
            <p className="ml-6">3. Apabila PIHAK KEDUA memerlukan alat untuk dipakai ke lokasi lain diluar dari lokasi perjanjian maka semua biaya pemindahan alat menjadi tanggung jawab PIHAK KEDUA.</p>
          </div>

          {/* Pasal 11 */}
          <div style={{ marginBottom: "12px", pageBreakInside: 'avoid' }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt", wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Pasal 11</p>
            <p className="font-bold text-center" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', margin: '8px 0 8px 0' }}>Perselisihan</p>
            <p className="ml-6 mb-1">1. Jika timbul perselisihan antara PIHAK PERTAMA dengan PIHAK KEDUA maka sebisa mungkin akan diselesaikan secara musyawarah dan kekeluargaan.</p>
            <p className="ml-6">2. Apabila perselisihan tidak bisa diselesaikan secara musyawarah maka kedua belah pihak sepakat untuk menyelesaikan masalah tersebut sesuai hukum yang berlaku.</p>
          </div>

          {/* Pasal 12 */}
          <div style={{ marginBottom: "12px", pageBreakInside: 'avoid' }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt", wordWrap: 'break-word', overflowWrap: 'break-word', margin: 0 }}>Pasal 12</p>
            <p className="font-bold text-center" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', margin: '8px 0 8px 0' }}>Penutup</p>
            <p className="ml-6">Demikian surat perjanjian sewa pakai alat berat ini dibuat dan ditandatangani oleh kedua belah pihak dalam rangkap dua (2) bermatrai cukup dan berkekuatan hukum yang sama dan dibuat tanpa paksaan dari pihak manapun.</p>
          </div>

          {keterangan && (
            <div style={{ marginBottom: "12px" }}>
              <p className="font-bold mb-1">Catatan Tambahan:</p>
              <p className="ml-6">{keterangan}</p>
            </div>
          )}
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-2 gap-8 text-center text-sm mt-6" style={{ marginBottom: "12px" }}>
          <div>
            <p className="font-bold mb-2">{pihakPertamaPerusahaan}</p>
            <p className="font-bold mb-16">PIHAK PERTAMA</p>
            <div className="border-t-2 border-black pt-1 h-12 mb-1"></div>
            <p className="font-semibold mt-2">{pihakPertamaNama}</p>
            <p className="text-sm">{pihakPertamaJabatan}</p>
          </div>

          <div>
            <p className="font-bold mb-2">{pihakKedualPerusahaan}</p>
            <p className="font-bold mb-16">PIHAK KEDUA</p>
            <div className="border-t-2 border-black pt-1 h-12 mb-1"></div>
            <p className="font-semibold mt-2">{pihakKeduaNama}</p>
            <p className="text-sm">{pihakKeduaJabatan}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-2 border-t border-gray-400 text-center text-xs text-gray-600">
          <p className="font-semibold">PT. VANIA SUGIARTA JAYA</p>
          <p className="text-xs">Jln. Werdi Bhuwana, Kec. Mengwi, Kab. Badung-Bali, 80351</p>
          <p className="text-xs">Telp. (+62) 813-7026-6314 | www.vaniasugiartajaya.com</p>
        </div>

        {/* Print-specific styles */}
        <style>{`
          @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
          }
          @media print {
            html, body, div, p, h1, h2, h3, h4, h5, h6, table, tr, td, th {
              margin: 0;
              padding: 0;
              overflow: visible !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box;
            }
            html, body {
              width: 100%;
              height: 100%;
              background: white;
              color: #000;
              font-size: 11pt;
              line-height: 1.4;
            }
            .print\\:hidden {
              display: none !important;
            }
            h1, h2 {
              page-break-after: avoid;
              page-break-inside: avoid;
              margin: 0.2em 0 0.1em 0;
              padding: 0;
              overflow: visible !important;
            }
            p {
              margin: 0;
              padding: 0;
              line-height: 1.4;
              orphans: 4;
              widows: 4;
              page-break-inside: avoid;
              overflow: visible !important;
            }
            /* Ultra-strict: prevent ALL breaks within pasal */
            div {
              overflow: visible !important;
            }
            div[style*="pageBreakInside"] {
              page-break-inside: avoid !important;
              break-inside: avoid-page !important;
              overflow: visible !important;
              display: block;
              position: relative;
            }
            /* Pasal number heading - keep centered */
            div[style*="pageBreakInside"] > p:nth-child(1) {
              page-break-after: avoid !important;
              break-after: avoid-page !important;
              margin-bottom: 0.2em;
              overflow: visible !important;
              text-align: center !important;
            }
            /* Pasal subtitle - force center alignment */
            div[style*="pageBreakInside"] > p:nth-child(2) {
              page-break-after: avoid !important;
              break-after: avoid-page !important;
              margin-bottom: 0.1em;
              overflow: visible !important;
              text-align: center !important;
            }
            div[style*="pageBreakInside"] > p:nth-child(3) {
              page-break-after: avoid !important;
              break-after: avoid-page !important;
              margin-bottom: 0.1em;
              overflow: visible !important;
            }
            table {
              page-break-inside: avoid !important;
              border-collapse: collapse;
              width: 100%;
              font-size: 11pt;
              overflow: visible !important;
            }
            tbody {
              display: table-row-group;
              overflow: visible !important;
            }
            tr {
              page-break-inside: avoid !important;
              break-inside: avoid-page !important;
              display: table-row;
              overflow: visible !important;
            }
            td, th {
              padding: 3pt 4pt;
              page-break-inside: avoid !important;
              overflow: visible !important;
              display: table-cell;
              vertical-align: top;
            }
            img {
              max-width: 100%;
              height: auto;
              overflow: visible !important;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

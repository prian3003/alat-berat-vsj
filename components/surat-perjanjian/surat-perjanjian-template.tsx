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
        scale: 1.5, // Reduced from 2 for better rendering stability
        logging: false,
        allowTaint: true,
        useCORS: true,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
        ignoreElements: (el) => {
          // Don't ignore any elements - we need everything including images
          return false
        },
        scrollY: 0, // CRITICAL: Prevent double-capture due to scroll
        scrollX: 0, // Also set scroll X to avoid horizontal offset
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
          fontSize: '11pt',
          lineHeight: 1.4,
          maxWidth: '8.5in',
          margin: '0 auto',
          padding: '20mm 15mm',
        }}
      >
        {/* Header */}
        <div className="mb-4 pb-2 border-b border-gray-400">
          <div className="flex items-start gap-3">
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
              <p className="text-center text-sm font-semibold text-gray-700 mt-0.5">
                Sewa Alat Berat Terpercaya
              </p>
              <p className="text-center text-xs text-gray-600 mt-1">
                <span className="block">Jln. Werdi Bhuwana, Kec. Mengwi, Kab. Badung-Bali, 80351</span>
                <span className="block">Telp. (+62) 821-3965-9136 | www.vaniasugiarta.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Document Title */}
        <h2 className="mb-4 text-center text-base font-bold border-b-2 border-black pb-2">
          SURAT PERJANJIAN SEWA PAKAI ALAT BERAT
        </h2>

        {/* Pihak Information Section */}
        <div className="mb-4 text-sm space-y-3">
          <p>Pada hari ini, <span className="font-bold">{tanggalPernyataan || 'yang telah ditetapkan'}</span>, yang bertanda tangan di bawah ini :</p>

          {/* Pihak Pertama */}
          <div>
            <p className="font-bold mb-1">I. <span className="font-bold">Nama</span>: {pihakPertamaNama}</p>
            <p className="ml-4 text-sm"><span className="font-bold">Jabatan</span>: {pihakPertamaJabatan}</p>
            <p className="ml-4 text-sm"><span className="font-bold">Perusahaan</span>: {pihakPertamaPerusahaan}</p>
            <p className="ml-4 text-sm"><span className="font-bold">Alamat</span>: {pihakPertamaAlamat}</p>
            <p className="ml-4 text-sm">Selanjutnya disebut <span className="font-bold">PIHAK PERTAMA</span></p>
          </div>

          {/* Pihak Kedua */}
          <div>
            <p className="font-bold mb-1">II. <span className="font-bold">Nama</span>: {pihakKeduaNama}</p>
            <p className="ml-4 text-sm"><span className="font-bold">Jabatan</span>: {pihakKeduaJabatan}</p>
            <p className="ml-4 text-sm"><span className="font-bold">Perusahaan</span>: {pihakKedualPerusahaan}</p>
            <p className="ml-4 text-sm"><span className="font-bold">Alamat</span>: {pihakKeduaAlamat}</p>
            <p className="ml-4 text-sm">Selanjutnya disebut <span className="font-bold">PIHAK KEDUA</span></p>
          </div>

          {/* Agreement Statement */}
          <p className="text-sm mt-3">Kedua belah pihak telah sepakat untuk mengadakan perjanjian sewa pakai alat berat untuk pekerjaan di lokasi {lokasiPekerjaan} dengan ketentuan dan syarat yang diatur dalam pasal – pasal di bawah ini :</p>
        </div>

        {/* Items Table */}
        <table className="mb-4 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-800 px-3 py-2 text-center font-bold w-8">NO</th>
              <th className="border border-gray-800 px-3 py-2 text-left font-bold">JENIS ALAT</th>
              <th className="border border-gray-800 px-3 py-2 text-center font-bold w-12">JUMLAH</th>
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

        {/* Pasal Section */}
        <div className="mb-4 text-sm space-y-2">
          <p className="font-bold text-center mb-3" style={{ fontSize: '11pt' }}>DENGAN KETENTUAN DAN SYARAT SEBAGAI BERIKUT :</p>

          {/* Pasal 1 */}
          <div style={{ pageBreakInside: 'avoid' }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: '11pt' }}>Pasal 1</p>
            <p className="font-bold mb-1">Jenis, Jumlah, Harga Sewa dan Lokasi Kerja.</p>
            <p className="ml-6 mb-1">1. PIHAK PERTAMA bersedia menyewakan alat kepada PIHAK KEDUA dan PIHAK KEDUA setuju untuk menyewa alat berat kepada PIHAK PERTAMA dengan jenis dan harga sewa sebagaimana tercantum dalam tabel di atas.</p>
            <p className="ml-6 mb-1">2. Harga sewa alat berat di atas tanpa pemotongan pajak dan kedua belah pihak setuju bahwa tarif sewa alat berat pada Pasal 1 ini tidak akan berubah selama perjanjian belum berakhir.</p>
            <p className="ml-6">3. Lokasi kerja PIHAK KEDUA yaitu terletak di {lokasiPekerjaan}.</p>
          </div>

          {/* Pasal 2 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt" }}>Pasal 2</p>
            <p className="font-bold mb-1">Tempat, Waktu dan Kondisi Penyerahan Alat Berat</p>
            <p className="ml-6 mb-1">1. Alat diangkut oleh PIHAK PERTAMA ke lokasi yang telah ditentukan oleh PIHAK KEDUA setelah PIHAK KEDUA menyelesaikan administrasi sewa menyewa.</p>
            <p className="ml-6">2. Waktu penyerahan alat berat selambat lambatnya tiga hari setelah surat perjanjian kerja ini ditandatangani.</p>
          </div>

          {/* Pasal 3 */}
          <div style={{ pageBreakInside: 'avoid' }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt" }}>Pasal 3</p>
            <p className="font-bold mb-1">Biaya Mobilisasi Alat Berat</p>
            <p className="ml-6 mb-1">1. Biaya Mobilisasi dan Demobilisasi alat berat akan ditentukan berdasarkan kesepakatan kedua belah pihak.</p>
            <p className="ml-6">2. Biaya Mobilisasi ditanggung oleh PIHAK KEDUA.</p>
          </div>

          {/* Pasal 4 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt" }}>Pasal 4</p>
            <p className="font-bold mb-1">Biaya Operasi, Pemeliharaan dan Perbaikan Alat</p>
            <p className="ml-6 mb-1">1. Selama masa penyewaan alat berat, keperluan olie, perbaikan kerusakan, penggantian sparepart dan Mekanik menjadi tanggung jawab PIHAK PERTAMA.</p>
            <p className="ml-6">2. Pemakaian BBM (Bahan Bakar Minyak) untuk keperluan operasi menjadi tanggung jawab PIHAK KEDUA.</p>
          </div>

          {/* Pasal 5 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt" }}>Pasal 5</p>
            <p className="font-bold mb-1">Operasi dan Operator</p>
            <p className="ml-6">Pengadaan Operator menjadi tanggung jawab PIHAK PERTAMA, kebutuhan operator seperti makan, minum, tempat tinggal dan transportasi menjadi tanggung jawab PIHAK KEDUA.</p>
          </div>

          {/* Pasal 6 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt" }}>Pasal 6</p>
            <p className="font-bold mb-1">Laporan Operasi Alat (Time Sheet)</p>
            <p className="ml-6">Laporan harian operasi alat diisi oleh operator dan ditandatangani oleh Pengawas Kerja dari PIHAK KEDUA atau atas nama penyewa alat.</p>
          </div>

          {/* Pasal 7 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt" }}>Pasal 7</p>
            <p className="font-bold mb-1">Pembayaran Sewa</p>
            <p className="ml-6 mb-1">1. PIHAK KEDUA berkewajiban menyelesaikan pembayaran sewa alat berat dimuka sebesar 100 jam/unitnya serta ditambah biaya mobilisasi.</p>
            <p className="ml-6 mb-1">2. Uang pembayaran sewa alat berat dibayarkan secara tunai atau sesuai kesepakatan kedua belah pihak.</p>
            <p className="ml-6">3. Jika pekerjaan sudah hampir mencapai nilai dari dana masuk dan PIHAK KEDUA masih akan memperpanjang masa sewa maka harus memberitahukan kepada PIHAK PERTAMA minimal dua (2) hari sebelum habis masa sewa alat berat.</p>
          </div>

          {/* Pasal 8 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt" }}>Pasal 8</p>
            <p className="font-bold mb-1">Keamanan Alat Berat</p>
            <p className="ml-6 mb-1">1. PIHAK KEDUA wajib menyediakan security untuk menjaga keamanan alat di lokasi kerja.</p>
            <p className="ml-6 mb-1">2. PIHAK KEDUA wajib membayar ganti rugi terhadap unit kerja jika terjadi pencurian, perusakan dalam bentuk apapun juga yang dilakukan secara sengaja maupun tidak sengaja.</p>
            <p className="ml-6">3. Apabila alat tenggelam/mengalami kecelakaan pada saat di lokasi kerja maka biaya yang timbul akibat hal tersebut akan menjadi tanggungan PIHAK KEDUA.</p>
          </div>

          {/* Pasal 9 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt" }}>Pasal 9</p>
            <p className="font-bold mb-1">Masa Perjanjian</p>
            <p className="ml-6 mb-1">1. Perjanjian ini berlaku sejak ditandatangani oleh kedua belah pihak hingga alat dianggap telah selesai bekerja.</p>
            <p className="ml-6">2. Perjanjian sewa akan diperpanjang kembali jika ada kesepakatan oleh kedua belah pihak baik pembayaran maupun hal lainnya.</p>
          </div>

          {/* Pasal 10 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt" }}>Pasal 10</p>
            <p className="font-bold mb-1">Pemindahan, Pengambilan dan Penggunaan Alat</p>
            <p className="ml-6 mb-1">1. Alat tidak boleh dipindahkan ke lokasi lain oleh PIHAK KEDUA sebelum masa jam perjanjian habis terkecuali ada persetujuan dari PIHAK PERTAMA.</p>
            <p className="ml-6 mb-1">2. Apabila PIHAK KEDUA akan menggunakan alat keluar lokasi yang telah ditentukan dalam perjanjian ini maka PIHAK KEDUA wajib memberitahukan kepada PIHAK PERTAMA sebelumnya.</p>
            <p className="ml-6">3. Apabila PIHAK KEDUA memerlukan alat untuk dipakai ke lokasi lain diluar dari lokasi perjanjian maka semua biaya pemindahan alat menjadi tanggung jawab PIHAK KEDUA.</p>
          </div>

          {/* Pasal 11 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt" }}>Pasal 11</p>
            <p className="font-bold mb-1">Perselisihan</p>
            <p className="ml-6 mb-1">1. Jika timbul perselisihan antara PIHAK PERTAMA dengan PIHAK KEDUA maka sebisa mungkin akan diselesaikan secara musyawarah dan kekeluargaan.</p>
            <p className="ml-6">2. Apabila perselisihan tidak bisa diselesaikan secara musyawarah maka kedua belah pihak sepakat untuk menyelesaikan masalah tersebut sesuai hukum yang berlaku.</p>
          </div>

          {/* Pasal 12 */}
          <div style={{ pageBreakInside: "avoid" }}>
            <p className="font-bold mb-2 text-center" style={{ fontSize: "11pt" }}>Pasal 12</p>
            <p className="font-bold mb-1">Penutup</p>
            <p className="ml-6">Demikian surat perjanjian sewa pakai alat berat ini dibuat dan ditandatangani oleh kedua belah pihak dalam rangkap dua (2) bermatrai cukup dan berkekuatan hukum yang sama dan dibuat tanpa paksaan dari pihak manapun.</p>
          </div>

          {keterangan && (
            <div style={{ pageBreakInside: "avoid" }}>
              <p className="font-bold mb-1">Catatan Tambahan:</p>
              <p className="ml-6">{keterangan}</p>
            </div>
          )}
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-2 gap-8 text-center text-sm mt-6" style={{ pageBreakInside: "avoid" }}>
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
              background: white;
              overflow: visible !important;
            }
            body {
              font-size: 11pt;
              line-height: 1.4;
              color: #000;
            }
            .print\\:hidden {
              display: none !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              overflow: visible !important;
            }
            h1, h2 {
              page-break-after: avoid;
              page-break-inside: avoid;
              margin: 0.2em 0 0.1em 0;
              padding: 0;
            }
            p {
              margin: 0;
              padding: 0;
              line-height: 1.4;
              orphans: 4;
              widows: 4;
              page-break-inside: avoid;
            }
            /* Prevent page breaks within pasal divs */
            div[style*="pageBreakInside"] {
              page-break-inside: avoid;
              break-inside: avoid-page;
              overflow: visible !important;
            }
            /* Keep pasal number on same page as content */
            div[style*="pageBreakInside"] > p:first-child {
              page-break-after: avoid;
              break-after: avoid-page;
              margin-bottom: 0.2cm;
            }
            div[style*="pageBreakInside"] > p:nth-child(2) {
              page-break-after: avoid;
              break-after: avoid-page;
              margin-bottom: 0.1cm;
            }
            table {
              page-break-inside: avoid;
              border-collapse: collapse;
              width: 100%;
              font-size: 11pt;
              overflow: visible !important;
            }
            tr {
              page-break-inside: avoid;
              break-inside: avoid-page;
            }
            td, th {
              padding: 3pt 4pt;
              page-break-inside: avoid;
              overflow: visible !important;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

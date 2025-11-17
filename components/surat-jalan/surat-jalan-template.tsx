'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

interface SuratJalanItem {
  urutan: number
  jenisUnit: string
  seri: string
  lokasi: string
  keterangan?: string
}

interface SuratJalanTemplateProps {
  noSurat: string
  tanggal: string
  jenisKendaraan: string
  noPol: string
  sopir: string
  items: SuratJalanItem[]
  tujuan?: string
  keterangan?: string
}

export function SuratJalanTemplate({
  noSurat,
  tanggal,
  jenisKendaraan,
  noPol,
  sopir,
  items,
  tujuan,
  keterangan,
}: SuratJalanTemplateProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handlePrint = () => {
    if (printRef.current) {
      window.print()
    }
  }

  const handleDownloadPDF = async () => {
    if (!printRef.current) {
      alert('Dokumen tidak siap')
      return
    }

    setIsDownloading(true)
    setDownloadProgress(10)

    try {
      const element = printRef.current

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
      const imgData = canvas.toDataURL('image/jpeg', 0.98)
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

      // Save PDF
      pdf.save(`${noSurat}.pdf`)

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
          <Button onClick={handlePrint} variant="outline" size="sm" disabled={isDownloading}>
            <svg
              className="mr-2 h-4 w-4"
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
          </Button>
          <Button onClick={handleDownloadPDF} variant="outline" size="sm" disabled={isDownloading}>
            {isDownloading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                </svg>
                Mengunduh...
              </>
            ) : (
              <>
                <svg
                  className="mr-2 h-4 w-4"
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
          </Button>
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
        ref={printRef}
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
        <div className="mb-4 pb-2 border-b border-gray-300 print:mb-2 print:pb-1">
          <div className="flex items-start gap-3">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="VSJ Logo"
                style={{ height: '80px', width: 'auto' }}
              />
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h1 className="text-center text-xl font-bold leading-tight">
                PT. VANIA SUGIARTA JAYA
              </h1>
              <p className="text-center text-sm font-semibold text-gray-700 mt-1">
                Sewa Alat Berat Terpercaya
              </p>
              <p className="text-center text-xs text-gray-600 mt-3 space-y-1">
                <span className="block">Jln. Werdi Bhuwana, Kec. Mengwi, Kab. Badung-Bali, 80351</span>
                <span className="block">Telp. (+62) 813-7026-6314 | Email: vaniasugiartajaya25@gmail.com</span>
                <span className="block">www.vaniasugiarta.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Document Title */}
        <h2 className="mb-8 text-center text-lg font-bold border-b-2 border-black pb-2">
          SURAT JALAN
        </h2>

        {/* Document Info */}
        <div className="mb-6 grid grid-cols-2 gap-6 text-xs">
          <div className="flex justify-between items-center border-b border-black pb-1">
            <span className="font-bold">Jenis Kendaraan:</span>
            <span>{jenisKendaraan}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-1">
            <span className="font-bold">Tanggal:</span>
            <span>{formatDate(tanggal)}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-1">
            <span className="font-bold">No Pol:</span>
            <span>{noPol}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-1">
            <span className="font-bold">Sopir:</span>
            <span>{sopir}</span>
          </div>
        </div>

        {/* Surat Number */}
        <div className="mb-6 text-center text-sm font-bold bg-gray-100 py-2 rounded">
          No. Surat: <span className="text-base">{noSurat}</span>
        </div>

        {/* Items Table */}
        <table className="mb-8 w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-800 px-3 py-2 text-center font-bold w-8">NO</th>
              <th className="border border-gray-800 px-3 py-2 text-left font-bold">JENIS UNIT</th>
              <th className="border border-gray-800 px-3 py-2 text-left font-bold">SERI</th>
              <th className="border border-gray-800 px-3 py-2 text-left font-bold">LOKASI</th>
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
                  {item.jenisUnit}
                </td>
                <td className="border border-gray-300 px-3 py-2">{item.seri}</td>
                <td className="border border-gray-300 px-3 py-2">
                  {item.lokasi}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {item.keterangan || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Notes Section */}
        <div className="mb-8 text-xs border-l-4 border-gray-400 pl-3 py-2 bg-gray-50">
          <p className="font-bold mb-1">Keterangan:</p>
          <p className="mb-1">Mohon untuk dicek dan diterima oleh pihak yang berwenang</p>
          {tujuan && <p className="mb-1"><span className="font-bold">Tujuan:</span> {tujuan}</p>}
          {keterangan && <p><span className="font-bold">Catatan:</span> {keterangan}</p>}
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <p className="font-bold mb-16">PENGEMUDI</p>
            <div className="border-t-2 border-black pt-1 h-12 mb-1"></div>
            <p className="text-xs">Tanda Tangan</p>
          </div>

          <div>
            <p className="font-bold mb-16">PERUSAHAAN</p>
            <div className="border-t-2 border-black pt-1 h-12 mb-1"></div>
            <p className="text-xs">Tanda Tangan</p>
          </div>

          <div>
            <p className="font-bold mb-16">PENERIMA</p>
            <div className="border-t-2 border-black pt-1 h-12 mb-1"></div>
            <p className="text-xs">Tanda Tangan</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-2 border-t border-gray-300 text-center text-xs text-gray-600 print:mt-2 print:pt-1">
          <p className="font-semibold text-xs">PT. VANIA SUGIARTA JAYA</p>
          <p className="text-xs">Jln. Werdi Bhuwana, Kec. Mengwi, Kab. Badung-Bali, 80351</p>
          <p className="text-xs">Telp. (+62) 813-7026-6314 | www.vaniasugiarta.com</p>
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

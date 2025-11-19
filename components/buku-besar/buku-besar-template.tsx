'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Printer, Download, Loader2 } from 'lucide-react'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

interface BukuBesarEntry {
  id?: string
  nomor: string
  tanggal: string
  deskripsi: string
  debit: number
  kredit: number
  saldo_akhir?: number
  keterangan?: string
}

interface BukuBesarTemplateProps {
  entries: BukuBesarEntry[]
  periode: string
}

export function BukuBesarTemplate({
  entries,
  periode
}: BukuBesarTemplateProps) {
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

      setDownloadProgress(20)

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
            img.onerror = () => resolve()
            if (!img.src) {
              resolve()
            }
          }
        })
      })

      await Promise.all(imageLoadPromises)
      setDownloadProgress(30)

      await new Promise(r => setTimeout(r, 1000))

      console.warn = originalWarn
      console.log = originalLog

      // Use landscape A4 dimensions for proper page splitting
      const A4_MM = { width: 297, height: 210 } // Landscape
      const MARGIN_MM = 10
      const CONTENT_WIDTH_MM = A4_MM.width - MARGIN_MM * 2

      // DOM-based page break detection - scan table rows BEFORE rendering
      const getTableRowPositions = (): number[] => {
        const positions: number[] = []
        const table = element.querySelector('table')
        if (!table) return positions

        const rows = Array.from(table.querySelectorAll('tr'))
        const tableRect = table.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()

        rows.forEach((row) => {
          const rowRect = row.getBoundingClientRect()
          // Get position relative to the element
          const relativeY = rowRect.bottom - elementRect.top
          positions.push(relativeY)
        })

        return positions
      }

      const rowPositions = getTableRowPositions()

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true,
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
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

      // Use DOM row positions to determine page breaks
      const detectPageBreaks = (): number[] => {
        const breaks: number[] = [0]

        if (rowPositions.length === 0) {
          // Fallback: use simple pixel-based splitting if no rows found
          const canvasHeight = canvas.height
          for (let i = contentHeightPerPagePx; i < canvasHeight; i += contentHeightPerPagePx) {
            breaks.push(i)
          }
          breaks.push(canvasHeight)
          return breaks
        }

        // Convert DOM positions to canvas pixels (accounting for scale 2)
        const rowPixels = rowPositions.map((pos) => pos * 2)

        let currentPageEnd = contentHeightPerPagePx
        let rowIdx = 0

        while (rowIdx < rowPixels.length) {
          // Find the last row that fits on this page
          while (rowIdx < rowPixels.length && rowPixels[rowIdx] <= currentPageEnd) {
            rowIdx++
          }

          // Back up to last row that fits
          if (rowIdx > 0) {
            const lastRowThatFits = rowPixels[rowIdx - 1]
            breaks.push(lastRowThatFits)
            currentPageEnd = lastRowThatFits + contentHeightPerPagePx
          } else {
            // First row is too long for a page, force it anyway
            currentPageEnd += contentHeightPerPagePx
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
        orientation: 'landscape',
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

        // Convert page canvas to image data (PNG for better text clarity)
        const pageImgData = pageCanvas.toDataURL('image/png', 0.98)

        // Calculate image height based on width scaling
        const imgHeight = (cropHeightPx * imgWidth) / canvasWidth

        // Add image to PDF
        pdf.addImage(pageImgData, 'PNG', MARGIN_MM, MARGIN_MM, imgWidth, imgHeight)
      }

      setDownloadProgress(90)

      pdf.save(`Buku-Besar-${periode}.pdf`)

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

  const calculateTotal = (type: 'debit' | 'kredit') => {
    return entries.reduce((sum, entry) => sum + (type === 'debit' ? entry.debit : entry.kredit), 0)
  }

  const totalDebit = calculateTotal('debit')
  const totalKredit = calculateTotal('kredit')
  const saldoAkhir = totalDebit - totalKredit

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
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
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
          <Button onClick={handleDownloadPDF} variant="outline" size="sm" disabled={isDownloading}>
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengunduh...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
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
          maxWidth: '11in',
          margin: '0 auto',
          padding: '20mm 15mm',
        }}
      >
        {/* Logo - At very top, centered */}
        <div style={{
          textAlign: 'center',
          marginBottom: '12px',
          width: '100%',
          display: 'block',
          clear: 'both'
        }}>
          <img
            src="/logo.png"
            alt="VSJ Logo"
            style={{
              height: '70px',
              width: 'auto',
              margin: '0 auto',
              display: 'block',
              maxWidth: '100%',
              clear: 'both'
            }}
          />
        </div>

        {/* Header */}
        <div style={{
          marginBottom: '20px',
          textAlign: 'center',
          borderBottom: '2px solid #000',
          paddingBottom: '10px',
        }}>
          <h1 style={{
            fontSize: '16pt',
            fontWeight: 'bold',
            margin: '0 0 5px 0'
          }}>
            PT. VANIA SUGIARTA JAYA
          </h1>
          <h2 style={{
            fontSize: '12pt',
            fontWeight: 'bold',
            margin: '0 0 5px 0'
          }}>
            BUKU BESAR (GENERAL LEDGER)
          </h2>
          <p style={{
            fontSize: '10pt',
            margin: '5px 0 0 0',
            color: '#666'
          }}>
            Periode: {periode}
          </p>
        </div>

        {/* Ledger Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '20px',
          fontSize: '9pt'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#1f2937', color: '#fff' }}>
              <th style={{
                border: '1px solid #1f2937',
                padding: '8px',
                textAlign: 'left',
                fontWeight: 'bold',
                width: '8%'
              }}>No.</th>
              <th style={{
                border: '1px solid #1f2937',
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
                width: '12%'
              }}>Tanggal</th>
              <th style={{
                border: '1px solid #1f2937',
                padding: '8px',
                textAlign: 'left',
                fontWeight: 'bold',
                width: '25%'
              }}>Deskripsi</th>
              <th style={{
                border: '1px solid #1f2937',
                padding: '8px',
                textAlign: 'right',
                fontWeight: 'bold',
                width: '15%'
              }}>Debit</th>
              <th style={{
                border: '1px solid #1f2937',
                padding: '8px',
                textAlign: 'right',
                fontWeight: 'bold',
                width: '15%'
              }}>Kredit</th>
              <th style={{
                border: '1px solid #1f2937',
                padding: '8px',
                textAlign: 'right',
                fontWeight: 'bold',
                width: '15%'
              }}>Saldo</th>
              <th style={{
                border: '1px solid #1f2937',
                padding: '8px',
                textAlign: 'left',
                fontWeight: 'bold',
                width: '10%'
              }}>Ket.</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => {
              let runningBalance = 0
              for (let i = 0; i <= idx; i++) {
                runningBalance = runningBalance + entries[i].debit - entries[i].kredit
              }
              return (
                <tr key={entry.id || idx} style={{
                  backgroundColor: idx % 2 === 0 ? '#fff' : '#f9fafb',
                  borderBottom: '1px solid #d1d5db'
                }}>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '6px 8px',
                    textAlign: 'left'
                  }}>
                    {idx + 1}
                  </td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '6px 8px',
                    textAlign: 'center'
                  }}>
                    {formatDate(entry.tanggal)}
                  </td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '6px 8px',
                    textAlign: 'left'
                  }}>
                    {entry.deskripsi}
                  </td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '6px 8px',
                    textAlign: 'right',
                    fontFamily: 'monospace'
                  }}>
                    {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                  </td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '6px 8px',
                    textAlign: 'right',
                    fontFamily: 'monospace'
                  }}>
                    {entry.kredit > 0 ? formatCurrency(entry.kredit) : '-'}
                  </td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '6px 8px',
                    textAlign: 'right',
                    fontFamily: 'monospace',
                    fontWeight: 'bold'
                  }}>
                    {formatCurrency(runningBalance)}
                  </td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '6px 8px',
                    textAlign: 'left',
                    fontSize: '8pt'
                  }}>
                    {entry.keterangan ? entry.keterangan.substring(0, 10) : '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '15px',
          marginTop: '20px'
        }}>
          <div style={{
            backgroundColor: '#e8f4f8',
            padding: '10px',
            borderRadius: '4px',
            borderLeft: '3px solid #2196F3',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '5px' }}>Total Debit</div>
            <div style={{ fontSize: '11pt', fontWeight: 'bold' }}>{formatCurrency(totalDebit)}</div>
          </div>
          <div style={{
            backgroundColor: '#fff3e0',
            padding: '10px',
            borderRadius: '4px',
            borderLeft: '3px solid #FF9800',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '5px' }}>Total Kredit</div>
            <div style={{ fontSize: '11pt', fontWeight: 'bold' }}>{formatCurrency(totalKredit)}</div>
          </div>
          <div style={{
            backgroundColor: '#f3e5f5',
            padding: '10px',
            borderRadius: '4px',
            borderLeft: '3px solid #9C27B0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '5px' }}>Total Saldo</div>
            <div style={{ fontSize: '11pt', fontWeight: 'bold' }}>{formatCurrency(saldoAkhir)}</div>
          </div>
          <div style={{
            backgroundColor: '#e8f5e9',
            padding: '10px',
            borderRadius: '4px',
            borderLeft: '3px solid #4CAF50',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '9pt', color: '#666', marginBottom: '5px' }}>Saldo Akhir</div>
            <div style={{ fontSize: '11pt', fontWeight: 'bold' }}>{formatCurrency(saldoAkhir)}</div>
          </div>
        </div>

        {/* Verification */}
        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #d1d5db',
          fontSize: '9pt',
          color: '#666'
        }}>
          <p style={{ margin: '5px 0' }}>Verifikasi: Total Debit - Total Kredit = Saldo</p>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
            {formatCurrency(totalDebit)} - {formatCurrency(totalKredit)} = {formatCurrency(saldoAkhir)}
          </p>
        </div>

        {/* Print Styles */}
        <style>{`
          @page {
            size: A4 landscape;
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
              font-size: 9pt;
              line-height: 1.3;
            }
            .print\\:hidden {
              display: none !important;
            }
            h1, h2, h3, h4 {
              page-break-after: avoid !important;
              page-break-inside: avoid !important;
              margin: 0.1em 0 0.05em 0;
              padding: 0;
              overflow: visible !important;
            }
            p {
              margin: 0;
              padding: 0;
              line-height: 1.3;
              orphans: 3 !important;
              widows: 3 !important;
              page-break-inside: avoid !important;
              overflow: visible !important;
            }
            div {
              overflow: visible !important;
            }
            /* Table and row page break prevention */
            table {
              page-break-inside: avoid !important;
              border-collapse: collapse;
              width: 100%;
              font-size: 9pt;
              overflow: visible !important;
            }
            tbody {
              display: table-row-group;
              overflow: visible !important;
            }
            thead {
              display: table-header-group;
              overflow: visible !important;
            }
            tr {
              page-break-inside: avoid !important;
              break-inside: avoid-page !important;
              display: table-row;
              overflow: visible !important;
            }
            td, th {
              page-break-inside: avoid !important;
              overflow: visible !important;
              display: table-cell;
              vertical-align: top;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

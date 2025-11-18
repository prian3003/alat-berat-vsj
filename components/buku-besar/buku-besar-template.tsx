'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
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
        windowHeight: element.scrollHeight,
        windowWidth: element.scrollWidth,
      })

      setDownloadProgress(60)

      const imgData = canvas.toDataURL('image/jpeg', 0.98)
      const pdf = new jsPDF({
        orientation: 'landscape',
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
          maxWidth: '11in',
          margin: '0 auto',
          padding: '20mm 15mm',
        }}
      >
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
          gridTemplateColumns: '1fr 1fr 1fr',
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
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
            body {
              font-size: 9pt;
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

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
        className="mx-auto bg-white"
        style={{
          fontSize: '10pt',
          lineHeight: 1.3,
          maxWidth: '8.5in',
          margin: '0 auto',
          padding: '20mm 15mm',
          width: '100%'
        }}
      >
        {/* Logo - At very top, centered - ISOLATED SECTION */}
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
          marginBottom: '16px',
          paddingBottom: '8px',
          borderBottom: '1px solid #d1d5db',
          textAlign: 'center',
          width: '100%',
          display: 'block',
          clear: 'both'
        }}>
          {/* Company Info - Centered */}
          <h1 style={{
            fontSize: '18pt',
            fontWeight: 'bold',
            lineHeight: 1.2,
            margin: '0 0 4px 0'
          }}>
            PT. VANIA SUGIARTA JAYA
          </h1>
          <p style={{
            fontSize: '11pt',
            fontWeight: '600',
            color: '#374151',
            margin: '4px 0'
          }}>
            Sewa Alat Berat Terpercaya
          </p>
          <p style={{
            fontSize: '9pt',
            color: '#4b5563',
            margin: '8px 0 0 0'
          }}>
            <span style={{ display: 'block', margin: '2px 0' }}>Jln. Werdi Bhuwana, Kec. Mengwi, Kab. Badung-Bali, 80351</span>
            <span style={{ display: 'block', margin: '2px 0' }}>Telp. +62 822-3095-8088 | Email: vaniasugiartajaya25@gmail.com</span>
            <span style={{ display: 'block', margin: '2px 0' }}>www.vaniasugiartajaya.com</span>
          </p>
        </div>

        {/* Document Title */}
        <h2 style={{
          marginBottom: '32px',
          textAlign: 'center',
          fontSize: '14pt',
          fontWeight: 'bold',
          borderBottom: '2px solid #000',
          paddingBottom: '8px',
          width: '100%',
          display: 'block',
          clear: 'both'
        }}>
          SURAT JALAN
        </h2>

        {/* Document Info */}
        <div style={{
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          fontSize: '9pt',
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #000',
            paddingBottom: '4px'
          }}>
            <span style={{ fontWeight: 'bold' }}>Jenis Kendaraan:</span>
            <span>{jenisKendaraan}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #000',
            paddingBottom: '4px'
          }}>
            <span style={{ fontWeight: 'bold' }}>Tanggal:</span>
            <span>{formatDate(tanggal)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #000',
            paddingBottom: '4px'
          }}>
            <span style={{ fontWeight: 'bold' }}>No Pol:</span>
            <span>{noPol}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #000',
            paddingBottom: '4px'
          }}>
            <span style={{ fontWeight: 'bold' }}>Sopir:</span>
            <span>{sopir}</span>
          </div>
        </div>

        {/* Surat Number */}
        <div style={{
          marginBottom: '24px',
          textAlign: 'center',
          fontSize: '11pt',
          fontWeight: 'bold',
          backgroundColor: '#f3f4f6',
          padding: '8px',
          borderRadius: '4px',
          width: '100%'
        }}>
          No. Surat: <span style={{ fontSize: '12pt' }}>{noSurat}</span>
        </div>

        {/* Items Table */}
        <table style={{
          marginBottom: '16px',
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '8pt',
          fontFamily: "'Segoe UI', 'Calibri', 'Arial', sans-serif",
          lineHeight: '1.2'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
              <th style={{
                border: '0.5pt solid #2c3e50',
                padding: '3px 4px',
                textAlign: 'center',
                fontWeight: 'bold',
                width: '5%',
                fontSize: '7.5pt'
              }}>NO</th>
              <th style={{
                border: '0.5pt solid #2c3e50',
                padding: '3px 4px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '7.5pt'
              }}>JENIS UNIT</th>
              <th style={{
                border: '0.5pt solid #2c3e50',
                padding: '3px 4px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '7.5pt'
              }}>SERI</th>
              <th style={{
                border: '0.5pt solid #2c3e50',
                padding: '3px 4px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '7.5pt'
              }}>LOKASI</th>
              <th style={{
                border: '0.5pt solid #2c3e50',
                padding: '3px 4px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '7.5pt'
              }}>KETERANGAN</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.urutan} style={{
                backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa'
              }}>
                <td style={{
                  border: '0.5pt solid #d1d5db',
                  padding: '2px 4px',
                  textAlign: 'center',
                  fontSize: '8pt'
                }}>
                  {item.urutan}
                </td>
                <td style={{
                  border: '0.5pt solid #d1d5db',
                  padding: '2px 4px',
                  fontSize: '8pt'
                }}>
                  {item.jenisUnit}
                </td>
                <td style={{
                  border: '0.5pt solid #d1d5db',
                  padding: '2px 4px',
                  fontSize: '8pt'
                }}>{item.seri}</td>
                <td style={{
                  border: '0.5pt solid #d1d5db',
                  padding: '2px 4px',
                  fontSize: '8pt'
                }}>
                  {item.lokasi}
                </td>
                <td style={{
                  border: '0.5pt solid #d1d5db',
                  padding: '2px 4px',
                  fontSize: '8pt'
                }}>
                  {item.keterangan || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Notes Section */}
        <div style={{
          marginBottom: '12px',
          fontSize: '7.5pt',
          borderLeft: '2px solid #9ca3af',
          paddingLeft: '8px',
          paddingTop: '4px',
          paddingBottom: '4px',
          backgroundColor: '#f9fafb',
          width: '100%',
          fontFamily: "'Segoe UI', 'Calibri', 'Arial', sans-serif",
          lineHeight: '1.3'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '2px', margin: '0 0 2px 0' }}>Keterangan:</p>
          <p style={{ marginBottom: '2px', margin: '0 0 2px 0' }}>Mohon untuk dicek dan diterima oleh pihak yang berwenang</p>
          {tujuan && <p style={{ marginBottom: '2px', margin: '0 0 2px 0' }}><span style={{ fontWeight: 'bold' }}>Tujuan:</span> {tujuan}</p>}
          {keterangan && <p style={{ margin: '0' }}><span style={{ fontWeight: 'bold' }}>Catatan:</span> {keterangan}</p>}
        </div>

        {/* Signature Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          textAlign: 'center',
          fontSize: '8pt',
          width: '100%',
          fontFamily: "'Segoe UI', 'Calibri', 'Arial', sans-serif",
          marginTop: '8px'
        }}>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '32px', margin: '0 0 32px 0', fontSize: '8pt' }}>PENGEMUDI</p>
            <div style={{ borderTop: '1pt solid #000', paddingTop: '2px', height: '36px', marginBottom: '2px' }}></div>
            <p style={{ fontSize: '7.5pt', margin: '2px 0 0 0' }}>Tanda Tangan</p>
          </div>

          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '32px', margin: '0 0 32px 0', fontSize: '8pt' }}>PERUSAHAAN</p>
            <div style={{ borderTop: '1pt solid #000', paddingTop: '2px', height: '36px', marginBottom: '2px' }}></div>
            <p style={{ fontSize: '7.5pt', margin: '2px 0 0 0' }}>Tanda Tangan</p>
          </div>

          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '32px', margin: '0 0 32px 0', fontSize: '8pt' }}>PENERIMA</p>
            <div style={{ borderTop: '1pt solid #000', paddingTop: '2px', height: '36px', marginBottom: '2px' }}></div>
            <p style={{ fontSize: '7.5pt', margin: '2px 0 0 0' }}>Tanda Tangan</p>
          </div>
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

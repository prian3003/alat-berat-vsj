'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import Image from 'next/image'

interface GajiItem {
  urutan: number
  tanggal: string
  keterangan: string
  jam?: number
  jumlah: number
  tipe: string
}

interface GajiTemplateProps {
  gaji: {
    nomorGaji: string
    tipe: 'weekly' | 'monthly'
    bulan?: number
    tahun?: number
    tanggalMulai: string
    tanggalSelesai: string
    totalGaji: number
    keterangan?: string
    items?: GajiItem[]
  }
}

export function GajiTemplate({ gaji }: GajiTemplateProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = date.getDate().toString().padStart(2, '0')
    const months = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER']
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const getMonthName = (month: number) => {
    const months = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER']
    return months[month - 1]
  }

  const handleDownloadPDF = async () => {
    if (!printRef.current) {
      alert('Dokumen tidak siap')
      return
    }

    setIsDownloading(true)

    try {
      const element = printRef.current

      // Wait for images to load
      const images = element.querySelectorAll('img')
      const imageLoadPromises = Array.from(images).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete) {
            resolve()
          } else {
            img.onload = () => resolve()
            img.onerror = () => resolve()
          }
        })
      })

      await Promise.all(imageLoadPromises)
      await new Promise(r => setTimeout(r, 500))

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      } else {
        let heightLeft = imgHeight
        let position = 0

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pdfHeight
        }
      }

      pdf.save(`Gaji-${gaji.nomorGaji}.pdf`)
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Gagal menghasilkan PDF')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Download Button */}
      <div className="flex justify-end gap-2 print:hidden">
        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {isDownloading ? 'Downloading...' : 'Download PDF'}
        </Button>
      </div>

      {/* Gaji Document */}
      <div ref={printRef} className="bg-white p-6 mx-auto" style={{ width: '210mm', minHeight: '297mm', fontFamily: "'Segoe UI', 'Calibri', 'Arial', sans-serif" }}>
        {/* Header */}
        <div style={{ borderTop: '1pt solid #000', paddingTop: '8px', paddingBottom: '8px' }}>
          {/* Company Info */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex items-center justify-center" style={{ width: '48px', height: '48px' }}>
              <img src="/logo.png" alt="VSJ Logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            </div>
            <div style={{ fontSize: '8.5pt', lineHeight: '1.3' }}>
              <h1 style={{ fontSize: '11pt', fontWeight: 'bold', margin: '0 0 2px 0' }}>PT. VANIA SUGIARTA JAYA</h1>
              <p style={{ margin: '0' }}>Jl. Raya Denpasar No.16</p>
              <p style={{ margin: '0' }}>Mangwi - Badung</p>
              <p style={{ margin: '0' }}>Telp. +62 858-1371-8988 | +62 822-3095-8088</p>
            </div>
          </div>

          {/* Title */}
          <h2 style={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'center', margin: '8px 0' }}>
            SLIP GAJI {gaji.tipe === 'monthly' ? 'BULANAN' : 'MINGGUAN'}
          </h2>

          {/* Salary Info */}
          <div style={{ fontSize: '8.5pt', marginBottom: '6px', lineHeight: '1.4', border: '0.5pt solid #999', padding: '6px' }}>
            <div className="flex justify-between mb-1">
              <span>No. Gaji: <strong>{gaji.nomorGaji}</strong></span>
              <span>Periode: <strong>{formatDateShort(gaji.tanggalMulai)} - {formatDateShort(gaji.tanggalSelesai)}</strong></span>
            </div>
            {gaji.tipe === 'monthly' && (
              <div>
                <span>Bulan: <strong>{getMonthName(gaji.bulan || 1)} {gaji.tahun}</strong></span>
              </div>
            )}
          </div>

          {/* Items Table for Weekly */}
          {gaji.tipe === 'weekly' && gaji.items && gaji.items.length > 0 && (
            <>
              <div style={{ marginTop: '12px', marginBottom: '8px', fontSize: '8.5pt', fontWeight: 'bold' }}>
                Detail Gaji Mingguan:
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '8.5pt', fontFamily: "'Segoe UI', 'Calibri', 'Arial', sans-serif" }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ border: '0.5pt solid #666', padding: '4px 3px', textAlign: 'center', fontWeight: 'bold', width: '8%', fontSize: '8pt' }}>No.</th>
                    <th style={{ border: '0.5pt solid #666', padding: '4px 3px', textAlign: 'center', fontWeight: 'bold', width: '12%', fontSize: '8pt' }}>Tanggal</th>
                    <th style={{ border: '0.5pt solid #666', padding: '4px 3px', textAlign: 'left', fontWeight: 'bold', fontSize: '8pt' }}>Keterangan</th>
                    <th style={{ border: '0.5pt solid #666', padding: '4px 3px', textAlign: 'center', fontWeight: 'bold', width: '8%', fontSize: '8pt' }}>Jam</th>
                    <th style={{ border: '0.5pt solid #666', padding: '4px 3px', textAlign: 'right', fontWeight: 'bold', width: '15%', fontSize: '8pt' }}>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {gaji.items.map((item, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                      <td style={{ border: '0.5pt solid #ddd', padding: '3px', textAlign: 'center', fontSize: '8pt' }}>{item.urutan}</td>
                      <td style={{ border: '0.5pt solid #ddd', padding: '3px', textAlign: 'center', fontSize: '8pt' }}>{formatDateShort(item.tanggal)}</td>
                      <td style={{ border: '0.5pt solid #ddd', padding: '3px', fontSize: '8pt' }}>{item.keterangan}</td>
                      <td style={{ border: '0.5pt solid #ddd', padding: '3px', textAlign: 'center', fontSize: '8pt' }}>{item.jam ? item.jam : '-'}</td>
                      <td style={{ border: '0.5pt solid #ddd', padding: '3px', textAlign: 'right', fontSize: '8pt' }}>
                        Rp {formatCurrency(Number(item.jumlah))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Total Section */}
          <div style={{ marginTop: '12px', padding: '8px', border: '0.5pt solid #999', backgroundColor: '#f0f0f0' }}>
            <div style={{ fontSize: '10pt', fontWeight: 'bold', textAlign: 'right' }}>
              Total Gaji: <span style={{ fontSize: '12pt', color: '#d97706' }}>Rp {formatCurrency(Number(gaji.totalGaji))}</span>
            </div>
          </div>

          {/* Notes */}
          {gaji.keterangan && (
            <div style={{ marginTop: '12px', fontSize: '8pt', borderLeft: '2pt solid #d97706', paddingLeft: '8px' }}>
              <strong>Keterangan:</strong>
              <p style={{ margin: '4px 0 0 0', whiteSpace: 'pre-wrap' }}>{gaji.keterangan}</p>
            </div>
          )}

          {/* Signature Section */}
          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt' }}>
            <div style={{ width: '45%' }}>
              <p style={{ margin: '0 0 32px 0', fontWeight: 'bold' }}>Admin</p>
              <div style={{ borderBottom: '1pt solid #000', height: '40px' }}></div>
              <p style={{ margin: '4px 0 0 0', fontSize: '7.5pt' }}>Tanda Tangan</p>
            </div>
            <div style={{ width: '45%', textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '7.5pt', color: '#666' }}>Dicetak pada: {formatDate(new Date().toISOString())}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

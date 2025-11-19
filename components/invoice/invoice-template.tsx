'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import Image from 'next/image'

interface InvoiceItem {
  urutan: number
  namaItem: string
  tanggal: string
  quantity: number
  harga: number
  diskon: number
  totalHarga: number
}

interface InvoiceTemplateProps {
  invoice: {
    noFaktur: string
    tanggal: string
    customerName: string
    customerLocation: string
    pembayara?: string
    jatuhTempo: string
    nomorPO?: string
    bankName?: string
    accountNumber?: string
    accountName?: string
    total: number
    items: InvoiceItem[]
  }
}

export function InvoiceTemplate({ invoice }: InvoiceTemplateProps) {
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

      pdf.save(`Invoice-${invoice.noFaktur}.pdf`)
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

      {/* Invoice Document */}
      <div ref={printRef} className="bg-white p-6 mx-auto" style={{ width: '210mm', minHeight: '297mm', fontFamily: "'Segoe UI', 'Calibri', 'Arial', sans-serif" }}>
        {/* Header with subtle top border */}
        <div style={{ borderTop: '1pt solid #000', paddingTop: '8px', paddingBottom: '8px' }}>
          {/* Company Info and Customer Info */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center" style={{ width: '48px', height: '48px' }}>
                <img src="/logo.png" alt="VSJ Logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
              </div>
              <div style={{ fontSize: '8.5pt', lineHeight: '1.3' }}>
                <h1 style={{ fontSize: '11pt', fontWeight: 'bold', margin: '0 0 2px 0' }}>PT. VANIA SUGIARTA JAYA</h1>
                <p style={{ margin: '0' }}>Jl. Raya Denpasar No.16</p>
                <p style={{ margin: '0' }}>Mangwi - Badung</p>
                <p style={{ margin: '0' }}>No. HP : 0821-3965-9136</p>
              </div>
            </div>
            <div style={{ border: '1pt solid #999', padding: '6px', fontSize: '8pt', lineHeight: '1.4' }}>
              <div style={{ display: 'flex', marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold', width: '70px' }}>Customer</span>
                <span style={{ marginLeft: '4px' }}>: {invoice.customerName}</span>
              </div>
              <div style={{ display: 'flex', marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold', width: '70px' }}>LOKASI</span>
                <span style={{ marginLeft: '4px' }}>: {invoice.customerLocation}</span>
              </div>
              <div style={{ display: 'flex', marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold', width: '70px' }}>Pembayara</span>
                <span style={{ marginLeft: '4px' }}>: {invoice.pembayara || ''}</span>
              </div>
              <div style={{ display: 'flex', marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold', width: '70px' }}>Jatuh Tempo</span>
                <span style={{ marginLeft: '4px' }}>: {formatDateShort(invoice.jatuhTempo)}</span>
              </div>
              <div style={{ display: 'flex' }}>
                <span style={{ fontWeight: 'bold', width: '70px' }}>Nomor P.O</span>
                <span style={{ marginLeft: '4px' }}>: {invoice.nomorPO || 'T1 234'}</span>
              </div>
            </div>
          </div>

          {/* Date and Invoice Number */}
          <div style={{ fontSize: '8.5pt', marginBottom: '6px', lineHeight: '1.4' }}>
            <div>Tanggal : {formatDateShort(invoice.tanggal)}</div>
            <div>No. Faktur : {invoice.noFaktur}</div>
          </div>

          {/* Title */}
          <h2 style={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px', margin: '4px 0' }}>TAGIHAN</h2>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px', fontSize: '8.5pt', fontFamily: "'Segoe UI', 'Calibri', 'Arial', sans-serif" }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '0.5pt solid #666', padding: '4px 3px', textAlign: 'center', fontWeight: 'bold', width: '5%', fontSize: '8pt' }}>No.</th>
                <th style={{ border: '0.5pt solid #666', padding: '4px 3px', textAlign: 'left', fontWeight: 'bold', fontSize: '8pt' }}>Nama Item</th>
                <th style={{ border: '0.5pt solid #666', padding: '4px 3px', textAlign: 'center', fontWeight: 'bold', width: '12%', fontSize: '8pt' }}>Tanggal</th>
                <th style={{ border: '0.5pt solid #666', padding: '4px 3px', textAlign: 'center', fontWeight: 'bold', width: '7%', fontSize: '8pt' }}>Qty</th>
                <th style={{ border: '0.5pt solid #666', padding: '4px 3px', textAlign: 'right', fontWeight: 'bold', width: '13%', fontSize: '8pt' }}>Harga</th>
                <th style={{ border: '0.5pt solid #666', padding: '4px 3px', textAlign: 'right', fontWeight: 'bold', width: '12%', fontSize: '8pt' }}>Diskon</th>
                <th style={{ border: '0.5pt solid #666', padding: '4px 3px', textAlign: 'right', fontWeight: 'bold', width: '15%', fontSize: '8pt' }}>Total Harga</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ border: '0.5pt solid #ddd', padding: '3px', textAlign: 'center', fontSize: '8pt' }}>{item.urutan}</td>
                  <td style={{ border: '0.5pt solid #ddd', padding: '3px', fontSize: '8pt' }}>{item.namaItem}</td>
                  <td style={{ border: '0.5pt solid #ddd', padding: '3px', textAlign: 'center', fontSize: '8pt' }}>{formatDateShort(item.tanggal)}</td>
                  <td style={{ border: '0.5pt solid #ddd', padding: '3px', textAlign: 'center', fontSize: '8pt' }}>{item.quantity}</td>
                  <td style={{ border: '0.5pt solid #ddd', padding: '3px', textAlign: 'right', fontSize: '8pt' }}>
                    {formatCurrency(Number(item.harga))}
                  </td>
                  <td style={{ border: '0.5pt solid #ddd', padding: '3px', textAlign: 'right', fontSize: '8pt' }}>
                    {formatCurrency(Number(item.diskon))}
                  </td>
                  <td style={{ border: '0.5pt solid #ddd', padding: '3px', textAlign: 'right', fontSize: '8pt' }}>
                    Rp {formatCurrency(Number(item.totalHarga))}
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr>
                <td colSpan={3} style={{ border: '0.5pt solid #666', padding: '4px', fontSize: '8pt' }}>
                  Dicetak pada tanggal : {formatDateShort(invoice.tanggal)}
                </td>
                <td colSpan={2} style={{ border: '0.5pt solid #666', padding: '4px', textAlign: 'right', fontWeight: 'bold', fontSize: '8pt' }}>
                  admin :
                </td>
                <td style={{ border: '0.5pt solid #666', padding: '4px', textAlign: 'right', fontWeight: 'bold', fontSize: '8pt' }}>JUMLAH</td>
                <td style={{ border: '0.5pt solid #666', padding: '4px', textAlign: 'right', fontWeight: 'bold', fontSize: '8pt' }}>
                  Rp {formatCurrency(Number(invoice.total))}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            {/* Signatures */}
            <div style={{ border: '0.5pt solid #999', padding: '8px', fontSize: '8.5pt', fontFamily: "'Segoe UI', 'Calibri', 'Arial', sans-serif" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', fontWeight: 'bold', fontSize: '8pt' }}>
                <span>Penerima</span>
                <span>Hormat kami</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ borderBottom: '1pt dotted #000', width: '45%', height: '20px' }}></div>
                <div style={{ borderBottom: '1pt dotted #000', width: '45%', height: '20px' }}></div>
              </div>
            </div>

            {/* Payment Info */}
            <div style={{ border: '0.5pt solid #999', padding: '8px', fontSize: '8pt', fontFamily: "'Segoe UI', 'Calibri', 'Arial', sans-serif", lineHeight: '1.3' }}>
              <div style={{ marginBottom: '6px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Transfer ke:</div>
                <div>Bank {invoice.bankName || 'BCA'}</div>
                <div>No Rek : {invoice.accountNumber || '1801410397'}</div>
                <div>an. {invoice.accountName || 'YENI RETNAWATI'}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ border: '0.5pt solid #999', padding: '4px', textAlign: 'right', fontWeight: 'bold', fontSize: '8pt' }}>
                  <span>Rp -</span>
                </div>
                <div style={{ border: '0.5pt solid #999', padding: '4px', textAlign: 'right', fontWeight: 'bold', fontSize: '8pt', backgroundColor: '#f0f0f0' }}>
                  <span>TOTAL Rp {formatCurrency(Number(invoice.total))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

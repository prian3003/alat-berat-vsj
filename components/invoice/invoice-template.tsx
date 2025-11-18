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
      <div ref={printRef} className="bg-white p-6 mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* Header with Border */}
        <div className="border-3 border-black p-3">
          {/* Company Info and Customer Info */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 border-2 border-black flex items-center justify-center bg-white">
                <img src="/logo.png" alt="VSJ Logo" className="w-14 h-14 object-contain" />
              </div>
              <div style={{ fontSize: '10px' }}>
                <h1 className="text-sm font-bold">PT. VANIA SUGIARTA JAYA</h1>
                <p>Jl. Raya Denpasar No.16</p>
                <p>Mangwi - Badung</p>
                <p>No. HP : 0821-3965-9136</p>
              </div>
            </div>
            <div className="border-2 border-black p-2" style={{ fontSize: '9px' }}>
              <div className="space-y-0.5">
                <div className="flex">
                  <span className="font-bold w-20">Customer</span>
                  <span>: {invoice.customerName}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-20">LOKASI</span>
                  <span>: {invoice.customerLocation}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-20">Pembayara</span>
                  <span>: {invoice.pembayara || ''}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-20">Jatuh Tempo</span>
                  <span>: {formatDateShort(invoice.jatuhTempo)}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-20">Nomor P.O</span>
                  <span>: {invoice.nomorPO || 'T1 234'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date and Invoice Number */}
          <div style={{ fontSize: '10px' }} className="mb-2">
            <div>Tanggal : {formatDateShort(invoice.tanggal)}</div>
            <div>No. Faktur : {invoice.noFaktur}</div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center mb-3">TAGIHAN</h2>

          {/* Items Table */}
          <table className="w-full border-2 border-black mb-3">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-2 border-black px-1.5 py-1" style={{ fontSize: '10px', width: '6%' }}>No.</th>
                <th className="border-2 border-black px-1.5 py-1" style={{ fontSize: '10px' }}>Nama Item</th>
                <th className="border-2 border-black px-1.5 py-1 text-center" style={{ fontSize: '10px', width: '12%' }}>Tanggal</th>
                <th className="border-2 border-black px-1.5 py-1 text-center" style={{ fontSize: '10px', width: '8%' }}>Qty</th>
                <th className="border-2 border-black px-1.5 py-1 text-right" style={{ fontSize: '10px', width: '15%' }}>Harga</th>
                <th className="border-2 border-black px-1.5 py-1 text-right" style={{ fontSize: '10px', width: '12%' }}>Diskon</th>
                <th className="border-2 border-black px-1.5 py-1 text-right" style={{ fontSize: '10px', width: '17%' }}>Total Harga</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="border-2 border-black px-1.5 py-1" style={{ fontSize: '10px' }}>{item.urutan}</td>
                  <td className="border-2 border-black px-1.5 py-1" style={{ fontSize: '10px' }}>{item.namaItem}</td>
                  <td className="border-2 border-black px-1.5 py-1 text-center" style={{ fontSize: '10px' }}>{formatDateShort(item.tanggal)}</td>
                  <td className="border-2 border-black px-1.5 py-1 text-center" style={{ fontSize: '10px' }}>{item.quantity}</td>
                  <td className="border-2 border-black px-1.5 py-1 text-right" style={{ fontSize: '10px' }}>
                    {formatCurrency(Number(item.harga))}
                  </td>
                  <td className="border-2 border-black px-1.5 py-1 text-right" style={{ fontSize: '10px' }}>
                    {formatCurrency(Number(item.diskon))}
                  </td>
                  <td className="border-2 border-black px-1.5 py-1 text-right" style={{ fontSize: '10px' }}>
                    Rp {formatCurrency(Number(item.totalHarga))}
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr>
                <td colSpan={3} className="border-2 border-black px-1.5 py-1" style={{ fontSize: '10px' }}>
                  Dicetak pada tanggal : {formatDateShort(invoice.tanggal)}
                </td>
                <td colSpan={2} className="border-2 border-black px-1.5 py-1 text-right font-bold" style={{ fontSize: '10px' }}>
                  admin :
                </td>
                <td className="border-2 border-black px-1.5 py-1 text-right font-bold" style={{ fontSize: '10px' }}>JUMLAH</td>
                <td className="border-2 border-black px-1.5 py-1 text-right font-bold" style={{ fontSize: '10px' }}>
                  Rp {formatCurrency(Number(invoice.total))}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Section */}
          <div className="grid grid-cols-2 gap-3">
            {/* Signatures */}
            <div className="border-2 border-black p-3">
              <div className="flex justify-between mb-10" style={{ fontSize: '10px' }}>
                <span className="font-bold">Penerima</span>
                <span className="font-bold">Hormat kami</span>
              </div>
              <div className="flex justify-between">
                <div className="border-b-2 border-dotted border-black w-28"></div>
                <div className="border-b-2 border-dotted border-black w-28"></div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-2 border-black p-3">
              <div className="mb-2" style={{ fontSize: '10px' }}>
                <div className="font-bold mb-1">Transfer ke:</div>
                <div>Bank {invoice.bankName || 'BCA'}</div>
                <div>No Rek : {invoice.accountNumber || '1801410397'}</div>
                <div>an. {invoice.accountName || 'YENI RETNAWATI'}</div>
              </div>
              <div className="space-y-1.5">
                <div className="border-2 border-black p-1.5 text-right" style={{ fontSize: '10px' }}>
                  <span className="font-bold">Rp -</span>
                </div>
                <div className="border-2 border-black p-1.5 text-right" style={{ fontSize: '10px' }}>
                  <span className="font-bold">TOTAL Rp {formatCurrency(Number(invoice.total))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
